import { busRoutes } from './routesData';

// Every routesData.js key is `${fromTown}-${toTown}` (both lowercase). We
// split on the FIRST hyphen only — every "from" town in this dataset is a
// single word with no internal hyphen, while some "to" towns do contain one
// (e.g. "ja-ela", "hali-ela"), so splitting further left would break those.
function parseKey(key) {
  const idx = key.indexOf('-');
  if (idx === -1) return null;
  return [key.slice(0, idx), key.slice(idx + 1)];
}

// Build the graph once at module load: nodes are town-name fragments exactly
// as they appear in routesData.js keys, edges are direct routes between them.
const adjacency = new Map(); // node -> Set<neighbor>
const edgeRouteKey = new Map(); // "a|b" (sorted) -> the routesData.js key for that edge

function edgeId(a, b) {
  return [a, b].sort().join('|');
}

function addEdge(a, b, routeKey) {
  if (!adjacency.has(a)) adjacency.set(a, new Set());
  if (!adjacency.has(b)) adjacency.set(b, new Set());
  adjacency.get(a).add(b);
  adjacency.get(b).add(a);
  const id = edgeId(a, b);
  if (!edgeRouteKey.has(id)) edgeRouteKey.set(id, routeKey);
}

Object.keys(busRoutes).forEach((key) => {
  const parsed = parseKey(key);
  if (!parsed) return;
  addEdge(parsed[0], parsed[1], key);
});

// Cap how many legs we'll suggest — beyond 3 buses, a suggested "route" stops
// being practically useful to a rider and just adds noise.
const MAX_LEGS = 3;

/**
 * Finds the shortest chain of direct routes connecting `fromRaw` to `toRaw`
 * when no single direct route exists. Returns an array of legs
 * (`{ from, to, route, routeKey }`, each `route` being the full routesData.js
 * entry for that leg) in travel order, or null if no path is found within
 * MAX_LEGS hops.
 */
export function findTransferPath(fromRaw, toRaw) {
  if (!fromRaw || !toRaw) return null;
  const from = fromRaw.trim().toLowerCase();
  const to = toRaw.trim().toLowerCase();
  if (from === to) return null;
  if (!adjacency.has(from) || !adjacency.has(to)) return null;

  const queue = [[from]];
  const visited = new Set([from]);

  while (queue.length > 0) {
    const path = queue.shift();
    if (path.length - 1 >= MAX_LEGS) continue;
    const node = path[path.length - 1];
    const neighbors = adjacency.get(node) || new Set();

    for (const neighbor of neighbors) {
      if (visited.has(neighbor)) continue;
      const newPath = [...path, neighbor];
      if (neighbor === to) {
        return buildLegs(newPath);
      }
      visited.add(neighbor);
      queue.push(newPath);
    }
  }
  return null;
}

function buildLegs(path) {
  const legs = [];
  for (let i = 0; i < path.length - 1; i++) {
    const a = path[i];
    const b = path[i + 1];
    const routeKey = edgeRouteKey.get(edgeId(a, b));
    const route = busRoutes[routeKey];
    if (!route) return null; // shouldn't happen, but never show a broken leg
    legs.push({ from: a, to: b, route, routeKey });
  }
  return legs;
}

// "nuwara eliya" -> "Nuwara Eliya", "hali-ela" -> "Hali-Ela"
export function titleCaseTown(str) {
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}