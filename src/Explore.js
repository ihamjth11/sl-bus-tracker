import FeaturedCarousel from "./components/FeaturedCarousel";
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import './Explore.css';
import './ExploreExtras.css';
import Navbar from './Navbar';


const icon = (children) => (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    {children}
  </svg>
);

const IconSun = icon(
  <>
    <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.7" />
    <path d="M12 2.5V4.5M12 19.5V21.5M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M2.5 12H4.5M19.5 12H21.5M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </>
);

const IconMoon = icon(
  <path d="M20.5 14.2C19.3 14.7 18 15 16.6 15C11.3 15 7 10.7 7 5.4C7 4 7.3 2.7 7.8 1.5C4.4 2.9 2 6.2 2 10.1C2 15.3 6.2 19.5 11.4 19.5C15.3 19.5 18.6 17.1 20 13.7C20.2 13.9 20.4 14.1 20.5 14.2Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
);

const IconBus = icon(
  <>
    <path d="M4 16V6.6C4 5.2 5.2 4.3 7 4.1C9 3.9 15 3.9 17 4.1C18.8 4.3 20 5.2 20 6.6V16C20 16.7 19.4 17.3 18.7 17.3H18.3C17.6 17.3 17 17.9 17 18.6V19C17 19.4 16.7 19.7 16.3 19.7H14.7C14.3 19.7 14 19.4 14 19V18.6C14 17.9 13.4 17.3 12.7 17.3H11.3C10.6 17.3 10 17.9 10 18.6V19C10 19.4 9.7 19.7 9.3 19.7H7.7C7.3 19.7 7 19.4 7 19V18.6C7 17.9 6.4 17.3 5.7 17.3H5.3C4.6 17.3 4 16.7 4 16Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M4 10.5H20" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="7.5" cy="14" r="0.9" fill="currentColor" />
    <circle cx="16.5" cy="14" r="0.9" fill="currentColor" />
  </>
);

const IconBed = icon(
  <>
    <path d="M3 18V6M3 13H21V18M3 13V10C3 9 3.9 8 5 8H11C12.1 8 13 9 13 10V13M15 8H19C20.1 8 21 9 21 10V13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="7" cy="10.5" r="1.3" stroke="currentColor" strokeWidth="1.4" />
  </>
);

const IconTicketExternal = icon(
  <>
    <path d="M14 4H19C19.6 4 20 4.4 20 5V10M20 5L11 14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M17 13V18C17 19.1 16.1 20 15 20H6C4.9 20 4 19.1 4 18V9C4 7.9 4.9 7 6 7H11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </>
);

const IconTip = icon(
  <>
    <path d="M9 18H15M10 21H14M8 10C8 6.7 10.7 4 14 4C17.3 4 20 6.7 20 10C20 12.5 18.5 14 17.3 15.1C16.6 15.7 16 16.4 16 17.2V18H12V17.2C12 16.4 11.4 15.7 10.7 15.1C9.5 14 8 12.5 8 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </>
);

const IconInfo = icon(
  <>
    <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
    <path d="M12 11V16.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="12" cy="8" r="1" fill="currentColor" />
  </>
);

const IconLocate = icon(
  <>
    <path d="M12 21.5C12 21.5 19 15.1 19 9.8C19 5.9 15.9 2.8 12 2.8C8.1 2.8 5 5.9 5 9.8C5 15.1 12 21.5 12 21.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <circle cx="12" cy="9.7" r="2.3" stroke="currentColor" strokeWidth="1.6" />
  </>
);

const IconSearch = icon(
  <>
    <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.7" />
    <path d="M20 20L16 16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </>
);

const IconChevron = icon(
  <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
);

const PAGE_SIZE = 4;

const CATEGORIES = [
  {
    id: 'cities',
    label: 'Cities & Towns',
    accent: '#e0592a',
    places: [
      { name: 'Colombo', district: 'Colombo', blurb: 'Sri Lanka\'s commercial capital — colonial architecture around Fort and Pettah, the Galle Face Green seafront, and the country\'s main shopping and dining scene.', tip: 'Galle Face Green is best in the late afternoon, when the sea breeze picks up and street food vendors set up.' },
      { name: 'Galle Town', district: 'Galle', blurb: 'The wider southern port city beyond the historic Fort walls, with a busy local market, bus and rail links, and easy access to nearby beaches.', tip: 'Use Galle Town as a transport hub — buses fan out from here to Unawatuna, Mirissa, and Hikkaduwa.' },
      { name: 'Jaffna City', district: 'Jaffna', blurb: 'The commercial and cultural center of the north, with Jaffna Public Library, a bustling market, and distinctly Tamil cuisine and architecture.', tip: 'The Jaffna Public Library, rebuilt after being destroyed in 1981, is a moving stop with real historical weight.' },
      { name: 'Kurunegala', district: 'Kurunegala', blurb: 'A central province town built around Elephant Rock (Ethagala), a large rock outcrop resembling an elephant that you can climb for a city view.', tip: 'The rock climb is short and free — good for an hour\'s stop if you\'re passing through.' },
      { name: 'Batticaloa', district: 'Batticaloa', blurb: 'An east coast lagoon town, historically known for its "singing fish" folklore and its Dutch fort by the water.', tip: 'The lagoon and causeway make for a scenic evening walk as the town cools down.' },
      { name: 'Ratnapura', district: 'Ratnapura', blurb: 'The "City of Gems" — Sri Lanka\'s gem mining capital, where you can visit mines and gem markets to see the trade firsthand.', tip: 'Several gem museums and licensed mines near town offer short visitor tours.' },
      { name: 'Matara', district: 'Matara', blurb: 'A southern coastal town with the Dutch-built Star Fort and a long beachfront, often used as a base for exploring Tangalle and the far south.', tip: 'Matara\'s Star Fort is small but well preserved — a quick, easy stop.' },
      { name: 'Badulla', district: 'Badulla', blurb: 'The historic terminus of the scenic hill country railway line, with a large Kali temple and easy access into the surrounding hills.', tip: 'If you\'re riding the hill country train, Badulla is the final or starting stop for the full scenic route.' },
      { name: 'Kegalle', district: 'Kegalle', blurb: 'A spice- and gem-growing town on the road between Colombo and Kandy, close to the Pinnawala Elephant Orphanage.', tip: 'A natural stop-off if you\'re driving between Colombo and Kandy and want to combine it with Pinnawala.' },
      { name: 'Embilipitiya', district: 'Ratnapura', blurb: 'A small town that serves as the main gateway for visits to Udawalawe National Park.', tip: 'Most Udawalawe safari operators and lodges are based in or near Embilipitiya.' },
      { name: 'Hambantota', district: 'Hambantota', blurb: 'A growing southern port town with a large modern harbour project, close to Bundala National Park and the region\'s beaches.', tip: 'Mainly a functional base for exploring Bundala and the south coast rather than a sightseeing stop itself.' },
      { name: 'Puttalam', district: 'Puttalam', blurb: 'A lagoon town on the northwest coast, the main access point for the Kalpitiya peninsula\'s kitesurfing and dolphin-watching trips.', tip: 'Most Kalpitiya-bound travelers pass through or stay near Puttalam en route.' },
      { name: 'Vavuniya', district: 'Vavuniya', blurb: 'A northern crossroads town that marks the transition between the island\'s Sinhalese south and Tamil north.', tip: 'A practical stopover if you\'re traveling by road or rail between Colombo/Anuradhapura and Jaffna.' },
      { name: 'Chilaw', district: 'Puttalam', blurb: 'A fishing town on the northwest coast known for its Munneswaram Temple, one of the island\'s most significant Hindu shrines.', tip: 'The Munneswaram temple complex is worth a stop if you\'re driving the coastal road north of Negombo.' },
      { name: 'Anuradhapura Town', district: 'Anuradhapura', blurb: 'The modern town adjoining the ancient sacred city, with markets, guesthouses, and transport links for exploring the ruins.', tip: 'Base yourself here rather than closer to the ruins — it\'s a short tuk-tuk ride and has more amenities.' },
      { name: 'Mount Lavinia', district: 'Colombo', blurb: 'A beachside Colombo suburb famous for the colonial-era Mount Lavinia Hotel, once a governor\'s residence, right above a popular city beach.', tip: 'A good spot for a Colombo beach evening without leaving the city.' },
      { name: 'Kalutara', district: 'Kalutara', blurb: 'A riverside town on the way south from Colombo, home to the large white Kalutara Bodhiya stupa built over a hollow dome you can walk inside.', tip: 'The hollow interior of the stupa, painted with Jataka tales, is unusual and worth the stop.' },
      { name: 'Panadura', district: 'Kalutara', blurb: 'A coastal town just south of Colombo, historically known as a center of Buddhist revival in the 19th century.', tip: 'Mostly a through-town on the way south rather than a standalone destination.' },
      { name: 'Moratuwa', district: 'Colombo', blurb: 'A Colombo-area town long associated with traditional furniture-making and carpentry workshops.', tip: 'Interesting mainly for travelers curious about local craft industries.' },
      { name: 'Nawalapitiya', district: 'Kandy', blurb: 'A railway junction town in tea country, useful as a stop on the Kandy-Nanu Oya train line.', tip: 'A functional stop rather than a sightseeing destination in itself.' },
      { name: 'Balangoda', district: 'Ratnapura', blurb: 'A town near where the prehistoric "Balangoda Man" remains were discovered, among the earliest evidence of humans on the island.', tip: 'Mainly of interest to travelers with a specific interest in archaeology.' },
      { name: 'Polonnaruwa Town', district: 'Polonnaruwa', blurb: 'The modern town beside the ancient ruined city, with markets, guesthouses, and transport links for exploring the archaeological site.', tip: 'Base yourself here for easy access to the ancient city ruins by bicycle or tuk-tuk.' },
      { name: 'Deniyaya', district: 'Matara', blurb: 'A tea-growing town that serves as the main gateway for visiting Sinharaja Forest Reserve from the south.', tip: 'Most Sinharaja guides and lodges near the southern entrance are based here.' },
      { name: 'Monaragala', district: 'Monaragala', blurb: 'A southeastern gateway town for reaching Buduruwagala, Maligawila, and the wilder parts of Yala\'s surrounding region.', tip: 'A practical base for exploring the less-visited southeastern archaeological sites.' },
      { name: 'Ampara', district: 'Ampara', blurb: 'An agricultural town in the Eastern Province, a useful base for reaching Gal Oya National Park and the Kumana area.', tip: 'Mainly a logistical stop for travelers heading into the eastern wildlife parks.' },
      { name: 'Gampaha Town', district: 'Gampaha', blurb: 'A busy town north of Colombo, an administrative center for the wider Gampaha district.', tip: 'Mostly a transit and market town rather than a sightseeing stop.' },
      { name: 'Kalmunai', district: 'Ampara', blurb: 'An eastern coastal town with a mixed Tamil and Muslim community, useful as a base for the surrounding east coast.', tip: 'A practical stopover rather than a tourist destination in its own right.' },
      { name: 'Trincomalee Town', district: 'Trincomalee', blurb: 'The historic town center by the natural harbour, with Fort Frederick and the clifftop Koneswaram Temple.', tip: 'Koneswaram Temple\'s clifftop setting offers one of the best sunset views on the east coast.' },
      { name: 'Mullaitivu', district: 'Mullaitivu', blurb: 'A remote northeastern coastal town, historically significant and now slowly developing for visitors exploring the far north.', tip: 'Limited tourist infrastructure — best for travelers already exploring the northern coast.' },
      { name: 'Kilinochchi', district: 'Kilinochchi', blurb: 'A northern town along the main Jaffna road, home to a war memorial reflecting the region\'s recent history.', tip: 'Mainly a stop en route between Vavuniya and Jaffna.' },
      { name: 'Hatton', district: 'Nuwara Eliya', blurb: 'A tea-country railway town and the main access point for climbing Adam\'s Peak via Dalhousie.', tip: 'Most Adam\'s Peak train travelers change or disembark here before continuing to Dalhousie.' },
      { name: 'Avissawella', district: 'Colombo', blurb: 'A town at the edge of the wet zone hills, a common gateway for trips toward Ratnapura and the Kithulgala rafting area.', tip: 'A useful stop if you\'re driving from Colombo toward Sinharaja or Kithulgala.' },
      { name: 'Horana', district: 'Kalutara', blurb: 'A town inland from Kalutara, mostly known as a rubber and coconut cultivation area.', tip: 'Mainly a through-route town rather than a destination stop.' },
      { name: 'Gangaramaya Temple', district: 'Colombo', blurb: 'One of Colombo\'s most important temples, blending Sri Lankan, Thai, Chinese, and Indian architectural styles, with an eclectic museum of donated artifacts.', tip: 'The adjoining Seema Malaka meditation pavilion on Beira Lake is worth the short walk over.' },
      { name: 'Independence Square', district: 'Colombo', blurb: 'A national monument and public park built to commemorate Sri Lanka\'s independence, styled after an ancient royal audience hall.', tip: 'A popular spot for locals to walk or jog in the early morning and evening.' },
      { name: 'Viharamahadevi Park', district: 'Colombo', blurb: 'Colombo\'s largest and oldest public park, next to the Town Hall, with green lawns and a large seated Buddha statue.', tip: 'A relaxed green break from Colombo\'s busier commercial streets.' },
      { name: 'Pettah Market', district: 'Colombo', blurb: 'A dense, chaotic old-town market district where entire streets specialize in a single type of goods, from spices to electronics.', tip: 'Go with a loose plan and comfortable shoes — it rewards wandering more than a fixed route.' },
      { name: 'Colombo National Museum', district: 'Colombo', blurb: 'Sri Lanka\'s largest museum, housing royal regalia, ancient artifacts, and exhibits spanning the island\'s full history.', tip: 'Allow at least two hours if you want to see more than the highlights.' },
      { name: 'Wolvendaal Church', district: 'Colombo', blurb: 'A 18th-century Dutch Reformed church, one of the oldest Protestant churches still in use in Sri Lanka.', tip: 'A quiet historical stop, usually far less crowded than Colombo\'s main attractions.' },
      { name: 'Dutch Hospital Shopping Precinct', district: 'Colombo', blurb: 'A restored 17th-century Dutch colonial hospital building in Colombo Fort, now a dining and shopping precinct.', tip: 'A pleasant place for a meal while exploring the historic Fort area.' },
      { name: 'Beira Lake', district: 'Colombo', blurb: 'A lake in the heart of Colombo, bordered by parks, temples, and the city\'s business district.', tip: 'The lakeside path near Gangaramaya and Seema Malaka is the most scenic stretch to walk.' },
    ],
  },
  {
    id: 'ancient',
    label: 'Ancient Cities',
    accent: '#c2740a',
    places: [
      { name: 'Sigiriya', district: 'Matale', blurb: 'A 180m granite rock fortress with 5th-century frescoes and gardens at its base — a UNESCO World Heritage Site and one of the most photographed sights in the country.', tip: 'Climb early (gates open ~7am) to beat the heat and crowds.' },
      { name: 'Anuradhapura', district: 'Anuradhapura', blurb: 'Sri Lanka\'s first ancient capital, with 2,000+ year old dagobas (stupas), the sacred Sri Maha Bodhi tree, and sprawling monastery ruins.', tip: 'Rent a bicycle locally — the sacred city area is large and spread out.' },
      { name: 'Polonnaruwa', district: 'Polonnaruwa', blurb: 'The compact, well-preserved second ancient capital — easy to explore by bicycle in a day, with the famous Gal Vihara rock-cut Buddha statues.', tip: 'Cover shoulders and knees — this is an active sacred site.' },
      { name: 'Dambulla', district: 'Matale', blurb: 'Cave temple complex carved into a rock face, with over 150 Buddha statues and painted ceilings dating back more than 2,000 years.', tip: 'Combine with Sigiriya — they\'re only about 20km apart.' },
      { name: 'Mihintale', district: 'Anuradhapura', blurb: 'Considered the birthplace of Buddhism in Sri Lanka — a sacred hilltop reached by over a thousand ancient stone steps, dotted with dagobas and monastic ruins.', tip: 'Visit during Poson Poya (June full moon) to see it at its most alive, or avoid that date if you prefer it quiet.' },
      { name: 'Yapahuwa', district: 'Kurunegala', blurb: 'A short-lived 13th-century royal capital built on a steep rock outcrop, with an ornate stone staircase leading to cave temples near the summit.', tip: 'Far less visited than Sigiriya, so you often get the rock almost to yourself.' },
      { name: 'Aluvihare Rock Temple', district: 'Matale', blurb: 'Historic cave temple where the Buddhist scriptures (Tripitaka) were first committed to writing on ola leaves around the 1st century BCE.', tip: 'Small entrance fee; the ola-leaf manuscript museum on site is worth the extra few minutes.' },
      { name: 'Ridi Viharaya', district: 'Kurunegala', blurb: 'The "Silver Temple" — legend says silver ore found here funded the Ruwanwelisaya stupa in Anuradhapura; known for its painted ceilings and reclining Buddha.', tip: 'A quieter, off-the-main-trail temple worth combining with a Kurunegala stop.' },
      { name: 'Kelaniya Raja Maha Vihara', district: 'Gampaha', blurb: 'A major Buddhist temple near Colombo said to have been visited by the Buddha himself, known for its vivid ceiling and wall murals depicting Jataka tales.', tip: 'The temple hosts a large procession (Duruthu Perahera) every January.' },
      { name: 'Isurumuniya', district: 'Anuradhapura', blurb: 'A rock temple built into a large boulder near Anuradhapura\'s Tissa Wewa reservoir, famous for its carved "Isurumuniya Lovers" stone relief.', tip: 'Small and quick to visit — easy to fit in alongside the main Anuradhapura sites.' },
      { name: 'Avukana Buddha Statue', district: 'Anuradhapura', blurb: 'A 5th-century, 12m standing Buddha statue carved directly from a granite rock face — one of the best-preserved ancient statues on the island.', tip: 'Visit in the late afternoon when the statue faces the setting sun.' },
      { name: 'Medirigiriya Vatadage', district: 'Polonnaruwa', blurb: 'A remote, beautifully preserved circular relic house (vatadage) with concentric stone pillars — quieter and less commercial than the main Polonnaruwa site.', tip: 'Combine with a Polonnaruwa or Minneriya trip since it\'s a short detour off that route.' },
      { name: 'Galle Fort', district: 'Galle', blurb: 'A UNESCO-listed 16th-century Dutch and Portuguese colonial fort with cobbled streets, boutique cafes, and ramparts overlooking the Indian Ocean.', tip: 'Walk the ramparts at sunset — it\'s the classic Galle Fort experience.' },
      { name: 'Kataragama', district: 'Monaragala', blurb: 'A multi-religious pilgrimage town sacred to Buddhists, Hindus, and Muslims alike, centered around the Kataragama temple complex.', tip: 'The Esala Perahera festival (July/Aug) draws huge crowds — plan accommodation well ahead if visiting then.' },
      { name: 'Panduwasnuwara', district: 'Kurunegala', blurb: 'Ruins of a 12th-century royal capital, including a partially restored royal palace complex and a citadel with a distinctive circular relic house.', tip: 'A low-key, uncrowded ancient site for travelers who\'ve already seen the bigger names.' },
      { name: 'Nalanda Gedige', district: 'Matale', blurb: 'An unusual stone temple blending Hindu and Buddhist architectural styles, standing alone on the Kandy-Dambulla road.', tip: 'A quick 15-20 minute stop if you\'re driving between Kandy and Dambulla.' },
      { name: 'Tantirimale', district: 'Anuradhapura', blurb: 'A cluster of ancient Buddha statues and monastic ruins in a remote setting, far less visited than the main Anuradhapura sites.', tip: 'The dirt road in can be rough — a tuk-tuk or 4x4 handles it better than a low car.' },
      { name: 'Situlpawwa Rajamaha Viharaya', district: 'Hambantota', blurb: 'An ancient rock temple within Yala National Park\'s boundary, combining pilgrimage history with wildlife-park surroundings.', tip: 'Often visited as a stop during a Yala safari rather than as a separate trip.' },
      { name: 'Dighavapi', district: 'Ampara', blurb: 'An ancient stupa and monastic site in the Eastern Province, one of the earliest Buddhist sites mentioned in island chronicles.', tip: 'A quiet, uncrowded site — good for travelers exploring the less-visited east.' },
      { name: 'Seruwila Temple', district: 'Trincomalee', blurb: 'An ancient stupa and pilgrimage site said to enshrine a relic of the Buddha, located inland from Trincomalee town.', tip: 'Combine with a Trincomalee-area trip since it\'s a manageable detour inland.' },
      { name: 'Abhayagiri Dagoba', district: 'Anuradhapura', blurb: 'One of the tallest ancient stupas in the world, once the center of a major monastic university within Anuradhapura\'s sacred city.', tip: 'Part of the wider Anuradhapura ticket — allow extra time as this complex alone is large.' },
      { name: 'Jetavanaramaya', district: 'Anuradhapura', blurb: 'Once one of the tallest structures in the ancient world, this massive brick stupa is a centerpiece of Anuradhapura\'s ruins.', tip: 'The scale is best appreciated by walking its full perimeter rather than viewing from one side.' },
      { name: 'Ruwanwelisaya', district: 'Anuradhapura', blurb: 'An iconic, gleaming white stupa and one of the most sacred structures in Sri Lankan Buddhism, still an active place of worship.', tip: 'Visit barefoot, as at all active stupas, and expect it to be busiest around dusk.' },
      { name: 'Thuparamaya', district: 'Anuradhapura', blurb: 'Believed to be the oldest stupa in Sri Lanka, said to enshrine the Buddha\'s collarbone relic.', tip: 'Small compared to its neighbors, but historically the most significant stupa on the site.' },
      { name: 'Lankatilaka Vihara', district: 'Kandy', blurb: 'A 14th-century temple near Kandy known for its towering stone-columned hall and hillside setting.', tip: 'Often visited together with Gadaladeniya and Embekke as a trio of historic temples.' },
      { name: 'Gadaladeniya Temple', district: 'Kandy', blurb: 'A 14th-century temple blending South Indian architectural styles, built almost entirely of stone.', tip: 'Combine with Lankatilaka and Embekke — all three sit within a short drive of each other.' },
      { name: 'Embekke Devalaya', district: 'Kandy', blurb: 'Famous for its wooden entrance hall with intricately carved pillars depicting dancers, wrestlers, and mythical creatures.', tip: 'The wood carving detail here is considered some of the finest surviving from the Kandyan era.' },
      { name: 'Galapatha Raja Maha Vihara', district: 'Galle', blurb: 'An ancient Buddhist temple near Bentota, with stone inscriptions and a moonstone dating back over a thousand years.', tip: 'A quieter cultural stop if you\'re already based near Bentota\'s beaches.' },
      { name: 'Attanagalla Raja Maha Viharaya', district: 'Gampaha', blurb: 'A historic temple significant in early Sri Lankan chronicles, associated with a legendary queen\'s story.', tip: 'Less visited by foreign tourists — a good pick if you want a genuinely local temple experience.' },
      { name: 'Dowa Rock Temple', district: 'Badulla', blurb: 'A rock-cut temple near Bandarawela featuring an unfinished giant Buddha carving directly into the cliff face.', tip: 'A quick stop if you\'re traveling the Ella-Bandarawela road.' },
      { name: 'Yatala Wehera', district: 'Hambantota', blurb: 'An ancient stupa near Tissamaharama, with a distinctive elephant-wall base similar to Ruwanwelisaya in Anuradhapura.', tip: 'A quick, uncrowded stop if you\'re passing through Tissamaharama toward Yala.' },
      { name: 'Kiri Vehera', district: 'Monaragala', blurb: 'An ancient white stupa within the Kataragama sacred complex, one of the sixteen most venerated Buddhist sites on the island.', tip: 'Visit alongside the main Kataragama temple complex since they sit close together.' },
      { name: 'Menikdena', district: 'Matale', blurb: 'Archaeological ruins of an ancient monastery complex, less developed for visitors than the larger cultural triangle sites.', tip: 'A quiet stop for travelers who enjoy exploring ruins without crowds.' },
      { name: 'Rajagala', district: 'Ampara', blurb: 'A vast, largely unexcavated ancient monastery complex spread across a forested hill — one of the least-visited major archaeological sites.', tip: 'The scale of ruins here rivals better-known sites, but almost none of it has been restored.' },
      { name: 'Mahiyanganaya Raja Maha Vihara', district: 'Badulla', blurb: 'A historic temple said to mark the first place the Buddha visited in Sri Lanka, according to tradition.', tip: 'An important pilgrimage site with genuine local significance beyond typical tourist stops.' },
      { name: 'Girihandu Seya', district: 'Trincomalee', blurb: 'A stupa some traditions hold to be the oldest in Sri Lanka, built by two shipwrecked merchants according to legend.', tip: 'A lesser-known site worth combining with a Trincomalee-area visit.' },
      { name: 'Somawathiya Chaitya', district: 'Polonnaruwa', blurb: 'A sacred stupa within Somawathiya National Park, said to enshrine a tooth relic of the Buddha, reached along the Mahaweli River.', tip: 'Often combined with a boat trip along the river as part of the visit.' },
      { name: 'Neelagiri Seya', district: 'Badulla', blurb: 'An ancient stupa in the Mahiyanganaya area, part of the wider cluster of early Buddhist sites in the region.', tip: 'A minor stop best combined with the nearby Mahiyanganaya temple.' },
      { name: 'Vatadage (Polonnaruwa)', district: 'Polonnaruwa', blurb: 'A circular relic house within the Polonnaruwa complex, considered one of the finest examples of ancient Sri Lankan stone architecture.', tip: 'Look for the finely carved stone entrances (moonstones) at each of the four approaches.' },
      { name: 'Rankoth Vehera', district: 'Polonnaruwa', blurb: 'The largest stupa at Polonnaruwa, modeled after the great stupas of Anuradhapura.', tip: 'Its scale is best appreciated by walking the full path around its base.' },
      { name: 'Lankatilaka Vihara (Polonnaruwa)', district: 'Polonnaruwa', blurb: 'A massive brick image house at Polonnaruwa with towering walls and the remains of a huge standing Buddha statue.', tip: 'Not to be confused with the smaller Lankatilaka temple near Kandy — this one is part of the Polonnaruwa complex.' },
      { name: 'Sathmahal Prasada', district: 'Polonnaruwa', blurb: 'A unique stepped, pyramid-like structure at Polonnaruwa unlike any other building on the island, believed to show Southeast Asian influence.', tip: 'One of the more unusual structures in the ancient city — easy to miss if you\'re moving quickly through the site.' },
      { name: 'Nissanka Malla\'s Council Chamber', district: 'Polonnaruwa', blurb: 'The ruined audience hall of King Nissanka Malla, with stone pillars inscribed with the names of ministers who once sat there.', tip: 'A good stop for imagining how the ancient royal court once functioned.' },
      { name: 'Kaludiya Pokuna', district: 'Anuradhapura', blurb: 'A quiet monastic ruin built around a natural rock pool, away from the busier core of Anuradhapura\'s sacred city.', tip: 'One of the calmer, less-visited corners of the wider Anuradhapura site.' },
      { name: 'Vessagiriya', district: 'Anuradhapura', blurb: 'An ancient cave monastery complex where monks once lived among natural boulders, with inscriptions dating back over 2,000 years.', tip: 'A quieter alternative if the main Anuradhapura sites feel crowded.' },
      { name: 'Dedigama Kotavehera', district: 'Kegalle', blurb: 'A stupa marking the traditional birthplace of King Parakramabahu I, one of Sri Lanka\'s most significant historical rulers.', tip: 'A worthwhile stop for those specifically interested in Sri Lankan royal history.' },
    ],
  },
  {
    id: 'hills',
    label: 'Hill Country',
    accent: '#0f9d78',
    places: [
      { name: 'Kandy', district: 'Kandy', blurb: 'The cultural capital — home to the Temple of the Sacred Tooth Relic, a scenic lake, and the gateway to the hill country train line.', tip: 'The Kandy-Ella train is one of the world\'s most scenic — book seats ahead.' },
      { name: 'Ella', district: 'Badulla', blurb: 'Laid-back hill town famous for the Nine Arch Bridge, Little Adam\'s Peak, and tea-country views — a backpacker favorite.', tip: 'Nine Arch Bridge is best at sunrise, before tour groups arrive.' },
      { name: 'Nuwara Eliya', district: 'Nuwara Eliya', blurb: '"Little England" — cool climate, rolling tea plantations, colonial-era buildings, and Sri Lanka\'s highest peaks nearby.', tip: 'Bring a light jacket — evenings get genuinely cold here.' },
      { name: 'Haputale', district: 'Badulla', blurb: 'A quieter alternative to Ella, with dramatic escarpment views over the southern plains, especially at sunrise from Lipton\'s Seat.', tip: 'Lipton\'s Seat is a rewarding early-morning walk through tea estates.' },
      { name: 'Horton Plains', district: 'Nuwara Eliya', blurb: 'A high-altitude grassland plateau leading to World\'s End — a sheer 880m cliff drop with panoramic views on a clear morning.', tip: 'Start the walk by 6:30am — the view is often clouded over by mid-morning.' },
      { name: 'Adam\'s Peak (Sri Pada)', district: 'Ratnapura', blurb: 'A 2,243m sacred mountain climbed overnight by pilgrims of several faiths to catch sunrise from the summit, where a footprint-shaped rock formation sits.', tip: 'Climbing season is Dec-May; the steps are lit at night but bring a torch as backup.' },
      { name: 'Bandarawela', district: 'Badulla', blurb: 'A relaxed hill town with a milder climate than Nuwara Eliya, often used as a quieter base for exploring the surrounding tea country.', tip: 'Good midpoint stop between Ella and Haputale if you want to break up the journey.' },
      { name: 'Diyaluma Falls', district: 'Badulla', blurb: 'Sri Lanka\'s second-highest waterfall at 220m, with natural infinity pools partway up that you can hike to and swim in.', tip: 'The pools are reached by a steep, informal trail — go with a local guide and check conditions after heavy rain.' },
      { name: 'Ramboda Falls', district: 'Nuwara Eliya', blurb: 'A striking twin-tiered waterfall right beside the main Kandy-Nuwara Eliya road, easy to reach without a hike.', tip: 'There\'s a small temple built into the rock behind the falls, worth the short detour.' },
      { name: 'St. Clair\'s Falls', district: 'Nuwara Eliya', blurb: 'Known as "the little Niagara of Sri Lanka" for its wide twin cascades, framed by surrounding tea estates.', tip: 'Best viewed from the roadside lookout on the Talawakele-Nuwara Eliya road.' },
      { name: 'Hakgala Botanical Garden', district: 'Nuwara Eliya', blurb: 'A high-altitude botanical garden with rose gardens, ferns, and cool-climate flora, set against a dramatic rock backdrop.', tip: 'Cooler and quieter than the more famous Peradeniya gardens near Kandy.' },
      { name: 'Dambatenne Tea Factory', district: 'Badulla', blurb: 'A working tea factory founded by Sir Thomas Lipton, offering tours through the withering, rolling, and drying process near Haputale.', tip: 'The walk from the factory up to Lipton\'s Seat is a popular half-day combo.' },
      { name: 'Pekoe Trail', district: 'Central Province', blurb: 'A long-distance hiking trail (300km+) winding through tea country across the hill country, split into stages that can be walked individually.', tip: 'Pick a single stage near Ella or Haputale if you don\'t have time for the full trail.' },
      { name: 'Namunukula', district: 'Badulla', blurb: 'A seven-peaked mountain range near Ella offering a challenging hike and sweeping views over the surrounding hill country.', tip: 'The hike is steep and less touristy — go with a local guide if you\'re unfamiliar with the trail.' },
      { name: 'Idalgashinna', district: 'Badulla', blurb: 'A tiny, little-visited hill station between Haputale and Bandarawela, known for a scenic ridge-top railway station walk.', tip: 'The walk along the train tracks from the station offers views on both sides of the ridge.' },
      { name: 'Devon Falls', district: 'Nuwara Eliya', blurb: 'A roadside waterfall on the Kandy-Nuwara Eliya road, easy to view without leaving the vehicle for long.', tip: 'Often visited back-to-back with St. Clair\'s Falls since they\'re a short drive apart.' },
      { name: 'Loolecondera Estate', district: 'Kandy', blurb: 'The site of Ceylon\'s first commercial tea plantation, planted in the 1860s — the historical starting point of Sri Lanka\'s tea industry.', tip: 'A niche stop for anyone specifically interested in tea history rather than just tea-country views.' },
      { name: 'Single Tree Hill', district: 'Nuwara Eliya', blurb: 'A moderate hike near Nuwara Eliya town leading to sweeping views over the surrounding hills and Hakgala range.', tip: 'A good half-day hike if you want activity without committing to a full-day trek.' },
      { name: 'Galaha', district: 'Kandy', blurb: 'A tea-growing village near Kandy offering a quieter, more local look at tea country than the busier Ella-Haputale stretch.', tip: 'Good for travelers who want tea-estate scenery without traveling as far as Nuwara Eliya.' },
      { name: 'Uda Pussellawa', district: 'Nuwara Eliya', blurb: 'A scenic tea route connecting Nuwara Eliya to Ramboda, lined with estates and viewpoints along the way.', tip: 'Worth taking as a scenic drive route rather than a single stop.' },
      { name: 'Ambewela', district: 'Nuwara Eliya', blurb: 'A cool, New Zealand-style dairy farming area in the hills, with rolling pastures unusual for the tropics.', tip: 'The New Zealand Farm here is a popular photo stop with a distinctly un-Sri-Lankan look.' },
      { name: 'Pattipola', district: 'Nuwara Eliya', blurb: 'Home to the highest railway station in Sri Lanka, at the edge of Horton Plains.', tip: 'A scenic, cold stop if you\'re riding the hill country train line.' },
      { name: 'Ohiya', district: 'Nuwara Eliya', blurb: 'A small railway station town that serves as one of the access points for hiking into Horton Plains.', tip: 'Some travelers hike in to Horton Plains from Ohiya rather than driving to the main entrance.' },
      { name: 'Kothmale', district: 'Nuwara Eliya', blurb: 'A reservoir and dam area on a scenic stretch of road between Kandy and Nuwara Eliya.', tip: 'A worthwhile photo stop if you\'re driving this route rather than taking the train.' },
      { name: 'Great Western Mountain', district: 'Nuwara Eliya', blurb: 'A lesser-known peak in the central highlands, notable for its biodiversity and cooler, cloud-forest climate.', tip: 'A serious hike for those wanting to go beyond the more touristed viewpoints.' },
      { name: 'Moon Plains', district: 'Nuwara Eliya', blurb: 'A quieter, less-visited grassy plateau near Nuwara Eliya offering hill country views without Horton Plains\' crowds.', tip: 'A good alternative if you want the scenery without the Horton Plains entrance fee and queues.' },
      { name: 'Bogawantalawa', district: 'Nuwara Eliya', blurb: 'Known as the "Golden Valley" of Ceylon tea, a deep valley densely covered in tea estates.', tip: 'One of the most scenic, least-touristed tea valleys in the hill country.' },
      { name: 'Talawakele', district: 'Nuwara Eliya', blurb: 'A major tea-industry town at the heart of the hill country, close to St. Clair\'s and Devon Falls.', tip: 'A convenient base for visiting both waterfalls without a long detour.' },
      { name: 'Maskeliya', district: 'Nuwara Eliya', blurb: 'A reservoir town near the base of Adam\'s Peak, where most pilgrims begin the overnight climb.', tip: 'Most Adam\'s Peak treks start from here or nearby Dalhousie.' },
      { name: 'Rawana Ella Falls', district: 'Badulla', blurb: 'A wide waterfall near Ella linked in local legend to the Ramayana story of King Ravana.', tip: 'Easily viewed from the roadside — no hike required for the main view.' },
      { name: 'Castlereigh Reservoir', district: 'Nuwara Eliya', blurb: 'A scenic reservoir surrounded by tea estates, popular for photography and quiet lakeside views.', tip: 'A good stop for a peaceful break while driving through the deep tea country.' },
      { name: 'Norwood', district: 'Nuwara Eliya', blurb: 'A tea estate area in the hill country known for its dense, terraced plantations.', tip: 'Mostly of interest to travelers keen on deeper tea-country scenery beyond the main towns.' },
      { name: 'Demodara Loop', district: 'Badulla', blurb: 'Home to the famous Demodara Nine Arch spiral railway loop, where the track loops under itself to manage the steep gradient.', tip: 'Watching or riding a train complete the loop is a highlight for rail enthusiasts.' },
      { name: 'Poonagala', district: 'Badulla', blurb: 'A tea estate viewpoint area near Haputale offering sweeping views similar to Lipton\'s Seat with fewer visitors.', tip: 'A quieter alternative if Lipton\'s Seat feels crowded.' },
      { name: 'Corbett\'s Gap', district: 'Badulla', blurb: 'A scenic mountain pass near Passara offering panoramic views where the hill country drops toward the lowlands.', tip: 'A worthwhile detour if you\'re exploring beyond the main Ella-Haputale corridor.' },
      { name: 'Lover\'s Leap Falls', district: 'Nuwara Eliya', blurb: 'A waterfall near Nuwara Eliya town tied to a local legend of tragic lovers, reached by a short walk.', tip: 'An easy, accessible waterfall if you\'re already staying in Nuwara Eliya.' },
      { name: 'Elephant Rock', district: 'Badulla', blurb: 'A hiking spot near Ella offering a different, less crowded viewpoint than Little Adam\'s Peak or Ella Rock.', tip: 'A good pick if you want an Ella-area hike without the main trails\' crowds.' },
      { name: 'Lipton\'s Seat', district: 'Badulla', blurb: 'A viewpoint above the Dambatenne Tea Factory named for Sir Thomas Lipton, offering one of the best panoramic views in the hill country.', tip: 'Arrive by early morning for the clearest views before clouds roll in.' },
      { name: 'Pidurutalagala', district: 'Nuwara Eliya', blurb: 'The highest peak in Sri Lanka, rising above Nuwara Eliya town, though access to the summit is restricted due to a telecom installation.', tip: 'Most travelers view it from town rather than attempting the restricted summit.' },
      { name: 'Agrapatana', district: 'Nuwara Eliya', blurb: 'A remote tea estate area deep in the hill country, seldom visited by tourists.', tip: 'For travelers who want tea country scenery well off the standard route.' },
      { name: 'Bogawana', district: 'Kandy', blurb: 'A misty, forested hill area near Kandy known for its cooler climate and estate scenery.', tip: 'A quieter nature stop if you\'re based in Kandy and want to escape the city briefly.' },
      { name: 'Doluwa', district: 'Kandy', blurb: 'A hill station area near Kandy with tea estates and a noticeably cooler microclimate than the city below.', tip: 'A short, easy detour from Kandy for cooler air and estate views.' },
      { name: 'Kikiliyamana', district: 'Kandy', blurb: 'A tea estate viewpoint area near Kandy, offering hill country views without traveling as far as Nuwara Eliya.', tip: 'Convenient for a half-day trip if you\'re staying in Kandy.' },
      { name: 'Hunnasgiriya', district: 'Kandy', blurb: 'A mountain village near the Knuckles range, used as a starting point for some Knuckles hiking routes.', tip: 'A good base if you\'re planning a Knuckles Range trek but want to stay closer to Kandy.' },
      { name: 'Ambuluwawa Tower', district: 'Kandy', blurb: 'A striking 48m spiral tower near Gampola crowning a multi-religious complex — Buddhist stupa, Hindu kovil, mosque, and church side by side — with 360-degree views over the central highlands.', tip: 'The spiral staircase narrows sharply near the top and isn\'t for anyone uneasy with heights — go slow and hold the rail.' },
      { name: 'Sembuwatta Lake', district: 'Matale', blurb: 'A man-made lake fed by natural spring water at Elkaduwa, ringed by pine forest and tea slopes at 1,140m above sea level — a quiet hill country retreat with boating and a natural spring pool.', tip: "The final stretch of road is rough — a tuk-tuk or 4x4 handles it better than a low car, and swimming in the lake itself isn't permitted (use the adjacent spring pool instead)." },
    ],
  },
  {
    id: 'beaches',
    label: 'Beaches',
    accent: '#2b7fd1',
    places: [
      { name: 'Mirissa', district: 'Matara', blurb: 'Crescent-shaped beach known for whale watching (blue whales, Nov-Apr) and a lively beachfront strip of cafes.', tip: 'Whale watching boats leave early (~6:30am) — seas are calmer.' },
      { name: 'Unawatuna', district: 'Galle', blurb: 'A sheltered, calm bay close to Galle Fort — popular for swimming, snorkeling, and easy beach access.', tip: 'Walk or tuk-tuk to Galle Fort for sunset — about 15 minutes away.' },
      { name: 'Arugam Bay', district: 'Ampara', blurb: 'The east coast\'s premier surf town, with a laid-back backpacker scene and consistent right-hand point breaks.', tip: 'Best surf season is Apr-Oct, opposite to the west/south coast.' },
      { name: 'Trincomalee', district: 'Trincomalee', blurb: 'Deep natural harbour with Nilaveli and Uppuveli beaches nearby — clear water, snorkeling, and Pigeon Island National Park.', tip: 'Visit Apr-Sep — this coast has the opposite monsoon pattern to the south.' },
      { name: 'Bentota', district: 'Galle', blurb: 'A resort-heavy beach town on the west coast known for water sports — jet skiing, banana boats, and river safaris up the Bentota Ganga.', tip: 'Good base if you want a mix of beach time and organized water activities.' },
      { name: 'Hikkaduwa', district: 'Galle', blurb: 'A lively beach town with a coral sanctuary just offshore, good for snorkeling and beginner surfing, plus an active nightlife scene.', tip: 'The glass-bottom boat tours to the coral reef are touristy but genuinely worthwhile.' },
      { name: 'Tangalle', district: 'Hambantota', blurb: 'Quieter, less-developed beaches on the south coast with turtle nesting sites nearby — a good pick if Mirissa or Unawatuna feel too busy.', tip: 'Rekawa Beach nearby runs guided night turtle-watching walks in season.' },
      { name: 'Nilaveli', district: 'Trincomalee', blurb: 'A long stretch of quiet white-sand beach on the east coast, the main jumping-off point for boat trips to Pigeon Island.', tip: 'Snorkeling gear is rentable on the beach — Pigeon Island trips are best in the morning.' },
      { name: 'Negombo', district: 'Gampaha', blurb: 'A beach town close to the international airport, with a long sandy stretch and a busy fish market — a common first or last night stop.', tip: 'Convenient for late-night arrivals or early-morning flights since it\'s only ~20 min from the airport.' },
      { name: 'Weligama', district: 'Matara', blurb: 'A wide, gentle bay that\'s become the island\'s top spot for learning to surf, thanks to its consistent, forgiving beginner waves.', tip: 'Almost every guesthouse here offers surf lessons — no need to book ahead.' },
      { name: 'Pasikuda', district: 'Batticaloa', blurb: 'A shallow, calm east-coast bay where you can walk out a long way into warm, flat water — unusual for a Sri Lankan beach.', tip: 'The flat, shallow water makes it a good pick for families with young children.' },
      { name: 'Kalkudah', district: 'Batticaloa', blurb: 'A quieter neighbour to Pasikuda with a similarly calm bay and less resort development.', tip: 'Good day-trip pairing with Pasikuda if you\'re staying on the east coast.' },
      { name: 'Polhena', district: 'Matara', blurb: 'A small reef-protected lagoon beach near Matara town, calm enough for casual snorkeling right off the shore.', tip: 'Rent a mask and fins locally — the reef sits close enough to shore for a short swim out.' },
      { name: 'Rekawa', district: 'Hambantota', blurb: 'A beach best known for its marine turtle conservation project, with guided night watches to see nesting turtles.', tip: 'Book a spot with the conservation project rather than an informal tout for a more responsible visit.' },
      { name: 'Uppuveli', district: 'Trincomalee', blurb: 'A relaxed beach town right next to Trincomalee town, slightly more developed than nearby Nilaveli but still low-key.', tip: 'A good base for exploring both Trincomalee town and the Nilaveli/Pigeon Island area.' },
      { name: 'Marakolliya', district: 'Hambantota', blurb: 'A quiet, largely undeveloped beach near Tangalle, popular with travelers looking to avoid crowds.', tip: 'Few facilities here — bring water and sun protection, as there\'s little nearby.' },
      { name: 'Silent Beach', district: 'Hambantota', blurb: 'A secluded cove near Tangalle reached by a short walk, known for calm water and few visitors.', tip: 'Ask locally for directions — it\'s not well signposted from the main road.' },
      { name: 'Talalla', district: 'Matara', blurb: 'A quiet, mostly undeveloped beach between Matara and Tangalle, popular with longer-stay surfers and yoga travelers.', tip: 'A relaxed alternative if Weligama or Mirissa feel too busy.' },
      { name: 'Kirinda', district: 'Hambantota', blurb: 'A small fishing village beach near Yala, with a rock temple overlooking the sea and colorful fishing boats.', tip: 'Worth combining with a Yala safari trip since it\'s right on the way.' },
      { name: 'Batticaloa Beach', district: 'Batticaloa', blurb: 'The beach fronting Batticaloa town, backed by the lagoon, offering a quieter east-coast option outside the main resort towns.', tip: 'Best combined with exploring Batticaloa town and its Dutch fort.' },
      { name: 'Induruwa', district: 'Galle', blurb: 'A quieter beach near Bentota known for its turtle hatchery, where you can see conservation work up close.', tip: 'The turtle hatchery here is smaller and less commercial than some bigger operations.' },
      { name: 'Ahungalla', district: 'Galle', blurb: 'A resort beach town between Bentota and Hikkaduwa, generally calmer than its more famous neighbors.', tip: 'A good pick if you want a resort stay without Bentota\'s busier water-sports scene.' },
      { name: 'Ambalangoda', district: 'Galle', blurb: 'A beach town famous for traditional devil-mask carving workshops, alongside a quieter stretch of coast.', tip: 'The mask museums and workshops here are a distinctive cultural stop, not just a beach visit.' },
      { name: 'Wadduwa', district: 'Kalutara', blurb: 'A quiet beach close to Colombo, popular for a relaxed resort stay without traveling far south.', tip: 'Convenient if you want beach time immediately before flying out of Colombo.' },
      { name: 'Beruwala', district: 'Kalutara', blurb: 'A historic port town with early Muslim trading roots, alongside a resort beach strip.', tip: 'The old harbor area has more local character than the adjacent resort beaches.' },
      { name: 'Koggala', district: 'Galle', blurb: 'A beach backed by Koggala Lake, where boat trips visit small cinnamon-growing islands.', tip: 'The lake boat tour is a nice half-day add-on to a beach stay here.' },
      { name: 'Habaraduwa', district: 'Galle', blurb: 'A quiet beach village near Koggala, with a turtle hatchery and calmer waters than Hikkaduwa.', tip: 'A relaxed stop between Galle and Weligama if you want fewer crowds.' },
      { name: 'Dickwella', district: 'Matara', blurb: 'A beach town near the Hummanaya blowhole, with a mix of surf breaks and calmer bays.', tip: 'Combine a beach stop here with a visit to the nearby blowhole.' },
      { name: 'Kayankerni', district: 'Batticaloa', blurb: 'A remote east-coast beach with an offshore coral reef, popular for snorkeling away from the crowds.', tip: 'Limited facilities — best visited as part of a wider east coast trip rather than a standalone stay.' },
      { name: 'Kuchchaveli', district: 'Trincomalee', blurb: 'A remote, largely undeveloped beach north of Nilaveli, among the quietest stretches of coast on the island.', tip: 'Good for travelers specifically seeking an undeveloped, empty beach experience.' },
      { name: 'Jungle Beach', district: 'Galle', blurb: 'A small, secluded cove near Galle Fort, reached by a short jungle path or boat, popular for a quieter swim.', tip: 'Best visited by boat from Unawatuna to avoid the sometimes muddy jungle trail.' },
      { name: 'Wellawatte Beach', district: 'Colombo', blurb: 'A city beach in Colombo, popular with locals for an evening walk rather than swimming.', tip: 'More of a local city beach experience than a resort-style stop.' },
      { name: 'Panama Beach', district: 'Ampara', blurb: 'A remote east coast beach near the Panama-Okanda wildlife corridor, rarely visited by tourists.', tip: 'Very limited infrastructure — best visited as part of a wider eastern wildlife trip.' },
      { name: 'Okanda Beach', district: 'Ampara', blurb: 'A remote coastal stretch near the Okanda shrine, historically used by pilgrims walking to Kataragama.', tip: 'Mainly of interest to travelers already exploring the Kumana-Okanda area.' },
      { name: 'Kalladi Beach', district: 'Batticaloa', blurb: 'The beach fronting Batticaloa town, with calm waters and a relaxed, local atmosphere.', tip: 'A pleasant spot for an evening walk while based in Batticaloa town.' },
      { name: 'Goyambokka', district: 'Hambantota', blurb: 'A quiet cove-style beach near Tangalle, sheltered by rock outcrops on either side.', tip: 'One of Tangalle\'s calmer, more sheltered swimming spots.' },
      { name: 'Medaketiya', district: 'Hambantota', blurb: 'The main beach strip in Tangalle town, with a stretch of guesthouses and simple beachfront cafes.', tip: 'A convenient, walkable beach if you\'re staying in Tangalle town itself.' },
      { name: 'Unakuruwa', district: 'Hambantota', blurb: 'A quieter beach outside Tangalle town, less developed than the main Medaketiya strip.', tip: 'A good pick if you want Tangalle\'s coastline without its busier central stretch.' },
      { name: 'Payagala', district: 'Kalutara', blurb: 'A quiet beach town south of Kalutara, less developed than the bigger resort beaches further south.', tip: 'A relaxed stop if you want beach time without the crowds of Bentota or Hikkaduwa.' },
      { name: 'Waikkal', district: 'Puttalam', blurb: 'A river-mouth beach resort area north of Negombo, where the Maha Oya river meets the sea.', tip: 'Good for a mix of calm river-side relaxation and beach access in one spot.' },
      { name: 'Marawila', district: 'Puttalam', blurb: 'A beach town north of Negombo known locally for its batik fabric-printing workshops.', tip: 'Worth a stop if you\'re interested in traditional batik craft alongside the beach.' },
      { name: 'Madampe', district: 'Puttalam', blurb: 'A small coastal town on the route north toward Puttalam and Kalpitiya.', tip: 'Mainly a through-town rather than a standalone beach destination.' },
      { name: 'Chilaw Beach', district: 'Puttalam', blurb: 'The coastal stretch by Chilaw town, quieter than the more developed beaches further south.', tip: 'A convenient stop if you\'re already visiting Chilaw\'s Munneswaram Temple.' },
      { name: 'Uswetakeiyawa', district: 'Colombo', blurb: 'A quiet, less-touristy beach north of Negombo, popular with local surfers.', tip: 'A good pick if you want a beach close to Colombo without Negombo\'s crowds.' },
    ],
  },
  {
    id: 'wildlife',
    label: 'Wildlife',
    accent: '#a4460f',
    places: [
      { name: 'Yala National Park', district: 'Hambantota', blurb: 'One of the best places in the world to spot wild leopards, alongside elephants, sloth bears, and abundant birdlife.', tip: 'Book an early-morning safari — animals are most active then.' },
      { name: 'Udawalawe National Park', district: 'Ratnapura', blurb: 'Reliable elephant sightings in open grassland — often easier viewing than Yala\'s denser jungle terrain.', tip: 'Also home to the Elephant Transit Home, which feeds orphaned calves.' },
      { name: 'Minneriya National Park', district: 'Polonnaruwa', blurb: 'Famous for "the Gathering" — hundreds of wild elephants congregating around the reservoir in the dry season (Jul-Oct).', tip: 'Visit Jul-Oct specifically for the large elephant gatherings.' },
      { name: 'Sinharaja Forest Reserve', district: 'Ratnapura', blurb: 'Sri Lanka\'s last major rainforest, a UNESCO biosphere reserve rich in endemic birds and plant species.', tip: 'A local guide is required and genuinely improves the birdwatching.' },
      { name: 'Wilpattu National Park', district: 'Puttalam', blurb: 'Sri Lanka\'s largest national park, named for its many natural lakes (villus) — known for leopards in a quieter, less-crowded setting than Yala.', tip: 'Fewer jeeps than Yala means better odds of an unhurried sighting.' },
      { name: 'Bundala National Park', district: 'Hambantota', blurb: 'A wetland sanctuary and UNESCO biosphere reserve known for migratory birds, including flamingos, alongside elephants and crocodiles.', tip: 'Best for birdwatchers visiting Nov-Mar during peak migration season.' },
      { name: 'Kumana National Park', district: 'Ampara', blurb: 'A remote bird sanctuary bordering Yala\'s east side, known for large nesting colonies of herons, storks, and other waterbirds.', tip: 'May-Jul is peak nesting season for the bird colonies.' },
      { name: 'Pinnawala Elephant Orphanage', district: 'Kegalle', blurb: 'A well-known sanctuary caring for orphaned and injured elephants, with a popular daily river-bathing session open to visitors.', tip: 'The river bathing happens twice daily — check current times locally before visiting.' },
      { name: 'Kaudulla National Park', district: 'Polonnaruwa', blurb: 'A smaller, less-crowded alternative to Minneriya for elephant sightings around its central reservoir, especially in the dry season.', tip: 'A good backup option if Minneriya is busy during elephant-gathering season.' },
      { name: 'Wasgamuwa National Park', district: 'Matale', blurb: 'A less-visited park between the hill country and the cultural triangle, known for large elephant herds and dense forest cover.', tip: 'Fewer visitors than the famous parks means a calmer, more affordable safari.' },
      { name: 'Gal Oya National Park', district: 'Ampara', blurb: 'Unique among Sri Lankan parks for its boat safaris, where you can watch elephants swimming between islands on the Senanayake Samudraya reservoir.', tip: 'The boat safari here is genuinely different from a standard jeep safari — worth prioritizing.' },
      { name: 'Elephant Transit Home', district: 'Ratnapura', blurb: 'A rehabilitation center next to Udawalawe that raises orphaned elephant calves for eventual release back into the wild.', tip: 'Feeding times are the best moment to visit — check the schedule before you go.' },
      { name: 'Hurulu Eco Park', district: 'Anuradhapura', blurb: 'Part of the same elephant corridor as Minneriya and Kaudulla, offering a quieter, closer-to-Sigiriya safari option.', tip: 'A convenient choice if you\'re already based near Sigiriya or Dambulla.' },
      { name: 'Angammedilla National Park', district: 'Polonnaruwa', blurb: 'A smaller forest park near Polonnaruwa with fewer crowds, home to elephants, deer, and a good range of birdlife.', tip: 'Combine with a Polonnaruwa cultural visit for a lighter, half-day safari add-on.' },
      { name: 'Horagolla National Park', district: 'Gampaha', blurb: 'One of the smallest national parks, close to Colombo, protecting a patch of lowland forest and monkey and bird species.', tip: 'Handy if you want a short nature walk without leaving the Colombo area.' },
      { name: 'Horowpathana', district: 'Anuradhapura', blurb: 'A less-commercialized elephant sanctuary and forest area, offering a quieter alternative to the busier parks.', tip: 'Good option if you want an elephant-focused visit without the crowds of Minneriya or Pinnawala.' },
      { name: 'Lunugamvehera National Park', district: 'Hambantota', blurb: 'A buffer park bordering Yala, offering similar wildlife with far fewer visiting jeeps.', tip: 'Consider this as an overflow option when Yala\'s main block feels overcrowded.' },
      { name: 'Maduru Oya National Park', district: 'Polonnaruwa', blurb: 'A remote park centered on a large reservoir, known for elephants and as a resettlement area for animals displaced by dam projects.', tip: 'One of the quieter, less-touristed parks — go with a knowledgeable local guide.' },
      { name: 'Peak Wilderness Sanctuary', district: 'Ratnapura', blurb: 'The protected forest surrounding Adam\'s Peak, home to leopards, sambar deer, and rich montane biodiversity.', tip: 'Most visitors experience it while climbing Adam\'s Peak rather than as a standalone safari.' },
      { name: 'Chundikkulam National Park', district: 'Jaffna', blurb: 'A northern wetland sanctuary important for migratory birds, in the Jaffna peninsula area.', tip: 'A specialist stop for serious birdwatchers exploring the north.' },
      { name: 'Galway\'s Land National Park', district: 'Nuwara Eliya', blurb: 'A small forest patch within Nuwara Eliya town itself, protecting montane cloud forest and birdlife.', tip: 'Handy if you want a short nature walk without leaving town.' },
      { name: 'Victoria Park', district: 'Nuwara Eliya', blurb: 'A well-known birdwatching park in central Nuwara Eliya, popular with migratory species in season.', tip: 'A relaxed, easy stop if you\'re already staying in Nuwara Eliya town.' },
      { name: 'Kalametiya Bird Sanctuary', district: 'Hambantota', blurb: 'A coastal lagoon sanctuary supporting large numbers of wetland and migratory birds.', tip: 'A good add-on for birdwatchers already exploring the Tangalle area.' },
      { name: 'Wirawila-Tissa Sanctuary', district: 'Hambantota', blurb: 'A lake-based bird sanctuary near Tissamaharama, often visited alongside a Yala safari trip.', tip: 'Early morning boat or shoreline visits give the best birdwatching.' },
      { name: 'Kirala Kele Sanctuary', district: 'Matara', blurb: 'A wetland forest sanctuary near Matara town, home to a range of waterbirds and reptiles.', tip: 'A lesser-known stop for travelers with a specific interest in wetland ecosystems.' },
      { name: 'Bellanwila-Attidiya Sanctuary', district: 'Colombo', blurb: 'An urban wetland sanctuary on the edge of Colombo, offering surprising birdlife close to the city.', tip: 'Useful if you have a free morning in Colombo and want a quick nature escape.' },
      { name: 'Anawilundawa Wetland Sanctuary', district: 'Puttalam', blurb: 'A RAMSAR-listed wetland sanctuary with a network of ancient irrigation tanks, important for resident and migratory birds.', tip: 'A specialist stop for serious birdwatchers exploring the northwest coast.' },
      { name: 'Madu Ganga', district: 'Galle', blurb: 'A mangrove-lined estuary near Balapitiya explored by boat, with a small cinnamon-growing island stop along the way.', tip: 'The boat tour typically includes a cinnamon-peeling demonstration on one of the river islands.' },
      { name: 'Kithulgala Rainforest', district: 'Kegalle', blurb: 'A rainforest area on the Kelani River best known for white-water rafting, with jungle trekking and birdwatching alongside.', tip: 'Rafting trips run seasonally depending on river levels — check conditions before booking.' },
      { name: 'Belihul Oya Eco Park', district: 'Ratnapura', blurb: 'A river and forest eco-tourism area near Belihuloya, with walking trails and natural pools.', tip: 'A relaxed nature stop if you\'re passing through on the Ratnapura-hill country route.' },
      { name: 'Kalawewa Reservoir', district: 'Anuradhapura', blurb: 'A large ancient irrigation reservoir that has become an important habitat for water birds and elephants passing through the area.', tip: 'Best visited around sunset when birdlife activity picks up near the water.' },
      { name: 'Nachchaduwa Wewa', district: 'Anuradhapura', blurb: 'An ancient reservoir near Anuradhapura that attracts a range of resident and migratory birds.', tip: 'A convenient add-on if you\'re already exploring the ancient city area.' },
      { name: 'Giant\'s Tank Sanctuary', district: 'Mannar', blurb: 'A wetland sanctuary around one of the island\'s oldest irrigation reservoirs, important for migratory birds arriving from India.', tip: 'A specialist stop for birdwatchers exploring the Mannar region.' },
      { name: 'Padaviya Tank', district: 'Anuradhapura', blurb: 'An ancient reservoir in the northern dry zone that supports elephants and a range of waterbirds.', tip: 'A remote, little-visited wildlife-watching spot for travelers exploring the far north-central region.' },
    ],
  },
  {
    id: 'hidden',
    label: 'Hidden Gems',
    accent: '#9147c2',
    places: [
      { name: 'Ritigala', district: 'Anuradhapura', blurb: 'Forested ruins of an ancient monastery on a misty mountain — one of the least-visited archaeological sites, with none of the crowds of Sigiriya.', tip: 'Bring water and good shoes — this is a real forest hike, not a paved path.' },
      { name: 'Meemure', district: 'Kandy', blurb: 'One of Sri Lanka\'s most remote traditional villages, tucked inside the Knuckles mountain range — reachable only by a rough final stretch of road.', tip: 'Popular as a base for multi-day Knuckles Range hikes.' },
      { name: 'Riverston', district: 'Matale', blurb: 'A lesser-known viewpoint in the Knuckles range with dramatic cliff-edge views and cooler weather, minus the Ella crowds.', tip: 'Mist rolls in fast in the afternoon — aim to arrive by mid-morning.' },
      { name: 'Kalpitiya', district: 'Puttalam', blurb: 'A quiet peninsula known for kitesurfing and dolphin pods (sometimes hundreds at once) — a different pace from the south coast beach towns.', tip: 'Best kite season is May-Oct; dolphin tours run most of the year.' },
      { name: 'Knuckles Mountain Range', district: 'Matale', blurb: 'A UNESCO World Heritage rainforest range named for its knuckle-like peaks, with cloud forest trails and villages largely untouched by mass tourism.', tip: 'Multi-day treks need a registered guide — arrange one through the Wildlife Department office.' },
      { name: 'Jaffna Peninsula', district: 'Jaffna', blurb: 'The cultural heart of Sri Lanka\'s Tamil north — distinct cuisine, Hindu temples like Nallur Kovil, and a history and landscape unlike the rest of the island.', tip: 'Try Jaffna crab curry — it\'s noticeably different from southern-style curries.' },
      { name: 'Belihuloya', district: 'Ratnapura', blurb: 'A quiet valley town at the edge of the hill country, good for river walks and waterfalls without the tourist infrastructure of Ella or Nuwara Eliya.', tip: 'A relaxed overnight stop if you\'re driving between the hill country and the south.' },
      { name: 'Dondra Head', district: 'Matara', blurb: 'The southernmost point of Sri Lanka, marked by the island\'s tallest lighthouse — a peaceful stop with open ocean views in every direction.', tip: 'Combine with a Matara or Mirissa trip; it\'s a short detour off the coastal road.' },
      { name: 'Delft Island', district: 'Jaffna', blurb: 'A remote, windswept island off Jaffna with wild ponies, coral fences, and Dutch-era ruins — reached only by a slow ferry.', tip: 'Ferries are limited and weather-dependent, so plan a full day for the round trip.' },
      { name: 'Nainativu (Nagadeepa)', district: 'Jaffna', blurb: 'A small island sacred to both Buddhists and Hindus, home to the Nagadeepa Purana Vihara and Nagapooshani Amman Temple side by side.', tip: 'Reachable by a short ferry from Kurikadduwan (KKD) jetty near Jaffna.' },
      { name: 'Mannar & Adam\'s Bridge', district: 'Mannar', blurb: 'A quiet coastal district with baobab trees, flamingo sightings, and views toward the chain of shoals linking Sri Lanka to India.', tip: 'Mannar\'s baobab trees, brought by Arab traders centuries ago, are a genuinely unusual sight.' },
      { name: 'Wewurukannala Vihara', district: 'Matara', blurb: 'Home to Sri Lanka\'s tallest seated Buddha statue (over 50m), surrounded by vivid, sometimes unsettling scenes depicting the effects of bad karma.', tip: 'The multi-story image house behind the statue is worth the small extra entry fee.' },
      { name: 'Bomburu Ella', district: 'Kandy', blurb: 'A little-known waterfall near Kandy reached by a short, easy forest walk — a peaceful escape without a long drive.', tip: 'A good half-day trip if you\'re based in Kandy and want nature without a full excursion.' },
      { name: 'Ussangoda', district: 'Hambantota', blurb: 'An eerie, reddish plateau on the south coast with sparse vegetation and folklore ties to the Ramayana — very different scenery from the rest of the coastline.', tip: 'Go for sunset — the red soil and ocean backdrop are especially striking in low light.' },
      { name: 'Hummanaya Blowhole', district: 'Matara', blurb: 'The second-largest blowhole in the world, where sea water forces up through a coastal rock fissure — most dramatic during rough seas.', tip: 'Blowhole activity depends on sea conditions — it\'s most impressive during monsoon swells.' },
      { name: 'Bopath Ella Falls', district: 'Ratnapura', blurb: 'A waterfall named for its distinctive leaf ("bo-leaf") shape, easily reached and popular for a quick swim.', tip: 'One of the more accessible waterfalls in the south — a short walk from the road.' },
      { name: 'Kudumbigala Forest Hermitage', district: 'Ampara', blurb: 'A remote forest monastery built among rock outcrops near Kumana, with caves used by monks for centuries.', tip: 'Combine with a Kumana National Park visit since they\'re in the same remote area.' },
      { name: 'Muthurajawela Marsh', district: 'Gampaha', blurb: 'A coastal wetland near Negombo explored by boat, home to mangroves, water monitors, and a wide range of birdlife.', tip: 'Boat tours run from small operators near the Negombo lagoon — a relaxed half-day trip.' },
      { name: 'Kanniya Hot Springs', district: 'Trincomalee', blurb: 'Seven ancient stone-walled wells near Trincomalee, each said to have a slightly different water temperature.', tip: 'A quick, easy stop — most visitors combine it with a Trincomalee town visit.' },
      { name: 'Galapita Falls', district: 'Kegalle', blurb: 'A wide, gently cascading waterfall with natural rock pools, popular with locals for swimming and less known to tourists.', tip: 'A good stop between Colombo/Kegalle and the hill country if you want a swim break.' },
      { name: 'Adisham Bungalow', district: 'Badulla', blurb: 'A Tudor-style English manor house built by a colonial planter near Haputale, now run as a monastery with gardens open to visitors.', tip: 'Open only on select days — check current visiting hours before making the trip.' },
      { name: 'Ravana Cave', district: 'Badulla', blurb: 'A cave near Ella linked in local legend to the Ramayana story, reached by a short climb.', tip: 'A quick, easy add-on if you\'re already exploring the Ella area.' },
      { name: 'Bogoda Wooden Bridge', district: 'Badulla', blurb: 'A rare surviving example of a traditional covered wooden bridge, built without nails, dating back centuries.', tip: 'A niche stop for travelers interested in traditional Sri Lankan engineering.' },
      { name: 'Yudaganawa Stupa', district: 'Monaragala', blurb: 'A large, little-visited ancient stupa in the remote southeast, associated with a legendary battle site.', tip: 'Very few tourists make it out here — a genuinely off-the-beaten-path ancient site.' },
      { name: 'Maligawila Buddha Statue', district: 'Monaragala', blurb: 'A giant standing stone Buddha statue set in a jungle clearing, among the tallest free-standing ancient statues on the island.', tip: 'Combine with nearby Buduruwagala for a full day of remote ancient statues.' },
      { name: 'Buduruwagala', district: 'Monaragala', blurb: 'A cluster of rock-carved Buddha and Bodhisattva statues, including the tallest ancient standing Buddha carving in Sri Lanka.', tip: 'Far less crowded than Avukana, despite being an equally impressive carving.' },
      { name: 'Okanda Devalaya', district: 'Ampara', blurb: 'A remote coastal shrine sacred to both Buddhists and Hindus, historically the starting point of a pilgrimage route to Kataragama.', tip: 'Mainly visited by pilgrims walking the Pada Yatra route — a genuinely remote spot for other travelers.' },
      { name: 'Arankele Forest Hermitage', district: 'Kurunegala', blurb: 'Ruins of an ancient forest monastery built for meditating monks, set deep in quiet woodland.', tip: 'The walking paths between ruins are peaceful and rarely crowded.' },
      { name: 'Panama Village', district: 'Ampara', blurb: 'A remote traditional village on the east coast, near the wildlife corridors connecting Kumana and the coast.', tip: 'A good base for travelers heading into Kumana or the Panama-Okanda coastal stretch.' },
      { name: 'Nilgala Forest', district: 'Monaragala', blurb: 'A rock outcrop and forest area near indigenous Vedda communities, offering a rare glimpse of Sri Lanka\'s earliest inhabitants\' way of life.', tip: 'Best visited respectfully and ideally with a guide familiar with the local community.' },
      { name: 'Little Adam\'s Peak', district: 'Badulla', blurb: 'A short, accessible hike near Ella offering panoramic views without the long overnight climb of the main Adam\'s Peak.', tip: 'Doable in under an hour each way — a good sunrise or sunset walk from Ella.' },
      { name: 'Ella Rock', district: 'Badulla', blurb: 'A longer, steeper hike near Ella leading to a rock outcrop with sweeping valley views.', tip: 'The trail isn\'t well signposted — consider a local guide or clear directions before setting out.' },
      { name: 'Bakers Falls', district: 'Nuwara Eliya', blurb: 'A waterfall within Horton Plains National Park, reached via a side trail on the main loop to World\'s End.', tip: 'Combine with the World\'s End walk since both sit on the same Horton Plains circuit.' },
      { name: 'Pahiyangala Cave', district: 'Kalutara', blurb: 'A vast cave associated with some of the oldest human remains found outside Africa, with a mix of archaeology and legend.', tip: 'The site is linked to both prehistoric finds and stories of the monk Fa Hien, after whom it\'s named.' },
      { name: 'Madunagala Hot Springs', district: 'Hambantota', blurb: 'A set of natural hot water springs in the southern lowlands, believed locally to have healing properties.', tip: 'A relaxed, low-key stop if you\'re exploring the Hambantota area.' },
      { name: 'Dalhousie', district: 'Nuwara Eliya', blurb: 'The small village at the base of Adam\'s Peak where most pilgrims begin their overnight climb.', tip: 'Most travelers pass through briefly before starting the climb — few stay long.' },
      { name: 'Wavulpone Cave', district: 'Ratnapura', blurb: 'A large, little-visited cave system in the Ratnapura area, home to bat colonies and limited cave formations.', tip: 'Bring a flashlight and go with a local guide — this isn\'t a developed tourist cave.' },
      { name: 'Diyathalawa', district: 'Badulla', blurb: 'A cool, scenic army-town area near Bandarawela known for its pine forests and quieter hill country atmosphere.', tip: 'A relaxed stop if you want hill country scenery away from the busier Ella crowds.' },
      { name: 'Kadugannawa Pass', district: 'Kandy', blurb: 'A historic mountain pass on the old Colombo-Kandy road, marked by a colonial-era clock tower commemorating the road\'s construction.', tip: 'A quick stop with good views if you\'re driving the old road route to Kandy.' },
      { name: 'Bible Rock', district: 'Kegalle', blurb: 'A distinctive flat-topped mountain resembling an open book, visible from the Colombo-Kandy road and climbable via a moderate trail.', tip: 'The hike rewards you with panoramic views over the surrounding countryside.' },
      { name: 'Alagalla Mountain Range', district: 'Kegalle', blurb: 'A hiking range near Kadugannawa popular with local trekkers for its ridge walks and views toward the hill country.', tip: 'A good day-hike option for travelers based between Colombo and Kandy.' },
      { name: 'Dambana', district: 'Badulla', blurb: 'A village community of the Wanniyala-Aetto (Vedda), Sri Lanka\'s indigenous people, offering insight into their traditional way of life.', tip: 'Visit respectfully and ideally through an organized, community-approved visit rather than an informal drop-in.' },
      { name: 'Batadombalena Cave', district: 'Kalutara', blurb: 'A cave of archaeological significance where prehistoric human remains have been found, contributing to the island\'s early human history.', tip: 'A niche stop mainly of interest to those specifically curious about prehistoric archaeology.' },
      { name: 'Kirigalpotta', district: 'Nuwara Eliya', blurb: 'The second-highest peak in Sri Lanka, located within Horton Plains National Park.', tip: 'A serious hike for experienced trekkers — most Horton Plains visitors stick to the shorter World\'s End loop instead.' },
    ],
  },
  {
    id: 'sacred',
    label: 'Sacred Sites',
    accent: '#7a1f3d',
    places: [
      { name: 'Temple of the Sacred Tooth Relic', district: 'Kandy', blurb: "Sri Lanka's most important Buddhist shrine, enshrining a tooth relic of the Buddha within Kandy's royal palace complex — the spiritual heart of the country.", tip: 'Try to attend a puja (offering ceremony) — held three times daily — when the inner chamber briefly opens to view the relic casket.' },
      { name: 'Nallur Kandaswamy Kovil', district: 'Jaffna', blurb: "The most prominent Hindu temple in Jaffna, dedicated to Lord Murugan, known for its towering gopuram and vibrant daily rituals.", tip: 'The annual Nallur Festival (Aug) draws huge crowds with elaborate processions — spectacular if your visit lines up, but book accommodation well ahead.' },
      { name: 'Koneswaram Temple', district: 'Trincomalee', blurb: "A Hindu temple perched dramatically on Trincomalee's Swami Rock cliff, with the ocean falling away directly below — one of Sri Lanka's most striking temple settings.", tip: 'Time your visit for sunset, when the cliffside setting is at its most photogenic.' },
      { name: 'Munneswaram Temple', district: 'Puttalam', blurb: 'One of Sri Lanka\'s most historically significant Hindu temple complexes, near Chilaw, linked in legend to the Ramayana and visited by devotees of multiple faiths.', tip: 'A convenient stop if you\'re driving the coastal road between Colombo and Puttalam or Kalpitiya.' },
      { name: 'Jami Ul-Alfar Mosque (Red Mosque)', district: 'Colombo', blurb: 'An iconic candy-striped red-and-white mosque in the heart of Pettah, built in 1908-09 in an Indo-Saracenic style — one of Colombo\'s most photographed landmarks.', tip: 'Dress conservatively to enter; guards usually allow visitors in except during Friday prayer times.' },
      { name: 'Al-Aqsa Grand Jumma Masjid', district: 'Batticaloa', blurb: 'A striking mosque in Kattankudy modeled on the Dome of the Rock in Jerusalem, inaugurated in 2022 and now a landmark for the predominantly Muslim town.', tip: 'The gold dome and blue arcade are especially striking in late-afternoon light.' },
      { name: "St. Anthony's Shrine, Kochchikade", district: 'Colombo', blurb: 'A major Catholic shrine in Colombo drawing devotees of all faiths, known for its towering steeple and the belief that prayers here are especially favored.', tip: 'Tuesdays are the busiest day, when many visit specifically to pray at the shrine.' },
      { name: 'Our Lady of Madhu Shrine', district: 'Mannar', blurb: "Sri Lanka's most important Catholic pilgrimage site, a Marian shrine in a forest setting in Mannar district, drawing large crowds during its annual feast.", tip: 'The main feast day in August draws tens of thousands of pilgrims — visit outside that period for a quieter experience.' },
      { name: "St. Lucia's Cathedral", district: 'Colombo', blurb: "The largest Catholic cathedral in Sri Lanka, an imposing neoclassical structure in Kotahena that serves as the seat of the Archdiocese of Colombo.", tip: 'The scale of the interior is best appreciated during a quieter, non-service visiting hour.' },
    ],
  },

];


export default function Explore() {
  const [theme, setTheme] = useState(() => localStorage.getItem('sl-bus-theme') || 'dark');
  const [activeCategory, setActiveCategory] = useState('cities');
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('sl-bus-theme', next);
  };

  const handleCategoryClick = (id) => {
    setActiveCategory(id);
    setPage(0);
  };

  const current = CATEGORIES.find((c) => c.id === activeCategory);
  const totalPages = Math.ceil(current.places.length / PAGE_SIZE);
  const pagedPlaces = current.places.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  // Search across every category's places by name/district — active whenever
  // the search box has text, overriding the category tabs/pagination view.
  const searchResults = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return null;
    const results = [];
    CATEGORIES.forEach((cat) => {
      cat.places.forEach((place) => {
        if (
          place.name.toLowerCase().includes(q) ||
          place.district.toLowerCase().includes(q)
        ) {
          results.push({ ...place, categoryLabel: cat.label, accent: cat.accent });
        }
      });
    });
    return results;
  }, [search]);

  return (
    <div className="app explore-page">
      <Navbar
        extra={
          <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
            {theme === 'dark' ? <IconSun className="icon" /> : <IconMoon className="icon" />}
          </button>
        }
      />

      <FeaturedCarousel />

      <div className="hero">
        <h2>Explore <span>Sri Lanka</span></h2>
        <p>Discover where to go — then find the bus to get there.</p>
      </div>

      <div className="explore-search-wrap">
        <div className="explore-search-group">
          <IconSearch className="icon" style={{ opacity: 0.7 }} />
          <input
            type="text"
            placeholder="Search places — Sigiriya, Ella, Yala..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="explore-search-clear" onClick={() => setSearch('')} aria-label="Clear search">
              ✕
            </button>
          )}
        </div>
      </div>

      {searchResults ? (
        <div className="place-grid">
          <p className="explore-search-results-label">
            {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'}
          </p>
          {searchResults.length === 0 && (
            <p className="explore-search-empty">No places match "{search}" — try a different name or district.</p>
          )}
          {searchResults.map((place, i) => (
            <div className="place-card" key={i} style={{ '--place-accent': place.accent }}>
              <div className="place-card-top">
                <span className="place-district">{place.district} District</span>
              </div>
              <span className="explore-result-category-tag">{place.categoryLabel}</span>
              <h3 className="place-name">{place.name}</h3>
              <p className="place-blurb">{place.blurb}</p>
              {place.tip && (
                <p className="place-tip"><IconTip className="icon-xs" /> {place.tip}</p>
              )}
              <div className="place-actions">
                <Link to={`/?to=${encodeURIComponent(place.name)}`} className="place-bus-btn">
                  <IconBus className="icon-xs" /> Find Bus
                </Link>
                <a
                  href={`https://en.wikipedia.org/wiki/${encodeURIComponent(place.name.replace(/ /g, '_'))}`}
                  target="_blank" rel="noopener noreferrer"
                  className="place-action-btn"
                >
                  <IconInfo className="icon-xs" /> View
                </a>
                <a
                  href={`https://www.booking.com/searchresults.html?ss=${encodeURIComponent(place.name + ', Sri Lanka')}`}
                  target="_blank" rel="noopener noreferrer"
                  className="place-action-btn"
                >
                  <IconBed className="icon-xs" /> Stay
                </a>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ', Sri Lanka')}`}
                  target="_blank" rel="noopener noreferrer"
                  className="place-action-btn"
                >
                  <IconLocate className="icon-xs" /> Locate
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="category-tabs">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                className={`category-tab ${activeCategory === c.id ? 'active' : ''}`}
                style={activeCategory === c.id ? { '--tab-accent': c.accent } : undefined}
                onClick={() => handleCategoryClick(c.id)}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="place-grid">
            {pagedPlaces.map((place, i) => (
              <div className="place-card" key={i} style={{ '--place-accent': current.accent }}>
                <div className="place-card-top">
                  <span className="place-district">{place.district} District</span>
                </div>
                <h3 className="place-name">{place.name}</h3>
                <p className="place-blurb">{place.blurb}</p>
                {place.tip && (
                  <p className="place-tip"><IconTip className="icon-xs" /> {place.tip}</p>
                )}
                <div className="place-actions">
                  <Link to={`/?to=${encodeURIComponent(place.name)}`} className="place-bus-btn">
                    <IconBus className="icon-xs" /> Find Bus
                  </Link>
                  <a
                    href={`https://en.wikipedia.org/wiki/${encodeURIComponent(place.name.replace(/ /g, '_'))}`}
                    target="_blank" rel="noopener noreferrer"
                    className="place-action-btn"
                  >
                    <IconInfo className="icon-xs" /> View
                  </a>
                  <a
                    href={`https://www.booking.com/searchresults.html?ss=${encodeURIComponent(place.name + ', Sri Lanka')}`}
                    target="_blank" rel="noopener noreferrer"
                    className="place-action-btn"
                  >
                    <IconBed className="icon-xs" /> Stay
                  </a>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ', Sri Lanka')}`}
                    target="_blank" rel="noopener noreferrer"
                    className="place-action-btn"
                  >
                    <IconLocate className="icon-xs" /> Locate
                  </a>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="explore-pagination">
              <button
                className="explore-page-btn"
                onClick={() => setPage((p) => Math.max(p - 1, 0))}
                disabled={page === 0}
              >
                <IconChevron className="icon-xs" style={{ transform: 'rotate(180deg)' }} /> Prev
              </button>
              <span className="explore-page-indicator">
                {page + 1} / {totalPages}
              </span>
              <button
                className="explore-page-btn"
                onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
                disabled={page === totalPages - 1}
              >
                Next <IconChevron className="icon-xs" />
              </button>
            </div>
          )}
        </>
      )}

      <div className="booking-section">
        <p className="quick-title">Planning your trip</p>
        <div className="booking-cards">
          <a href="https://1315.lk" target="_blank" rel="noopener noreferrer" className="booking-card">
            <IconTicketExternal className="icon" />
            <div>
              <strong>Reserve intercity bus seats</strong>
              <small>Official SLTB booking — 1315.lk</small>
            </div>
          </a>
          <div className="booking-card disabled">
            <IconBed className="icon" />
            <div>
              <strong>Hotels & villas</strong>
              <small>Coming soon</small>
            </div>
          </div>
        </div>
      </div>

      <p className="explore-footer">Part of <Link to="/">Lankora</Link> — bus routes, fares, and timings across all 25 districts.</p>
    </div>
  );
}