import { searchLocations } from './locations';
import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const busRoutes = {
  // ============ COLOMBO ROUTES ============
  "colombo-kandy": {
    normal: { bus: "No. 1", fare: "Rs. 500", duration: "3 hrs" },
    ac: { bus: "No. 1 - AC Intercity", fare: "Rs. 900", duration: "2.5 hrs" },
    timing: { first: "5:30 AM", last: "9:00 PM", frequency: "Every 15 mins" },
    stops: ["Colombo Fort", "Kelaniya", "Kadawatha", "Nittambuwa", "Kandy"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 7.2906, lng: 80.6337 }]
  },
  "colombo-galle": {
    normal: { bus: "No. 2-1", fare: "Rs. 580", duration: "2.5 hrs" },
    ac: { bus: "No. 2-1 - AC Intercity", fare: "Rs. 875", duration: "2 hrs" },
    timing: { first: "5:00 AM", last: "10:00 PM", frequency: "Every 20 mins" },
    stops: ["Colombo Fort", "Moratuwa", "Panadura", "Kalutara", "Galle"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 6.0535, lng: 80.2210 }]
  },
  "colombo-jaffna": {
    normal: { bus: "No. 15/87", fare: "Rs. 2,150", duration: "8 hrs" },
    ac: { bus: "No. 15/87 - AC Intercity", fare: "Rs. 2,860", duration: "7 hrs" },
    timing: { first: "6:00 AM", last: "8:00 PM", frequency: "Every 1 hour" },
    stops: ["Colombo Fort", "Kurunegala", "Anuradhapura", "Vavuniya", "Jaffna"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 9.6615, lng: 80.0255 }]
  },
  "colombo-negombo": {
    normal: { bus: "No. 4", fare: "Rs. 328", duration: "1.5 hrs" },
    ac: { bus: "No. 4 - AC", fare: "Rs. 710", duration: "1 hr" },
    timing: { first: "5:00 AM", last: "10:30 PM", frequency: "Every 10 mins" },
    stops: ["Colombo Fort", "Wattala", "Ja-Ela", "Negombo"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 7.2097, lng: 79.8350 }]
  },
  "colombo-matara": {
    normal: { bus: "No. 2", fare: "Rs. 870", duration: "3.5 hrs" },
    ac: { bus: "No. 2 - AC Intercity", fare: "Rs. 1,158", duration: "3 hrs" },
    timing: { first: "5:00 AM", last: "9:30 PM", frequency: "Every 20 mins" },
    stops: ["Colombo Fort", "Moratuwa", "Kalutara", "Galle", "Matara"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 5.9549, lng: 80.5550 }]
  },
  "colombo-anuradhapura": {
    normal: { bus: "No. 15-1-1", fare: "Rs. 1,194", duration: "5 hrs" },
    ac: { bus: "No. 15-1-1 - AC", fare: "Rs. 1,593", duration: "4 hrs" },
    timing: { first: "6:00 AM", last: "8:00 PM", frequency: "Every 30 mins" },
    stops: ["Colombo Fort", "Kurunegala", "Dambulla", "Anuradhapura"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 8.3114, lng: 80.4037 }]
  },
  "colombo-trincomalee": {
    normal: { bus: "No. 49", fare: "Rs. 1,391", duration: "7 hrs" },
    ac: { bus: "No. 49 - AC", fare: "Rs. 2,782", duration: "6 hrs" },
    timing: { first: "6:30 AM", last: "7:00 PM", frequency: "Every 1 hour" },
    stops: ["Colombo Fort", "Kurunegala", "Anuradhapura", "Trincomalee"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 8.5874, lng: 81.2152 }]
  },
  "colombo-batticaloa": {
    normal: { bus: "No. 48-1", fare: "Rs. 1,663", duration: "7.5 hrs" },
    ac: { bus: "No. 48-1 - AC Super Luxury", fare: "Rs. 3,326", duration: "6.5 hrs" },
    timing: { first: "6:00 AM", last: "7:30 PM", frequency: "Every 1 hour" },
    stops: ["Colombo Fort", "Kandy", "Polonnaruwa", "Batticaloa"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 7.7310, lng: 81.6747 }]
  },
  "colombo-hambantota": {
    normal: { bus: "No. 32-1", fare: "Rs. 1,292", duration: "5 hrs" },
    ac: { bus: "No. 32-1 - AC", fare: "Rs. 2,378", duration: "4 hrs" },
    timing: { first: "5:30 AM", last: "8:30 PM", frequency: "Every 30 mins" },
    stops: ["Colombo Fort", "Galle", "Matara", "Hambantota"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 6.1429, lng: 81.1212 }]
  },
  "colombo-badulla": {
    normal: { bus: "No. 21-6", fare: "Rs. 1,364", duration: "6 hrs" },
    ac: { bus: "No. 21-6 - AC", fare: "Rs. 1,844", duration: "5 hrs" },
    timing: { first: "6:00 AM", last: "7:00 PM", frequency: "Every 45 mins" },
    stops: ["Colombo Fort", "Ratnapura", "Welimada", "Badulla"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 6.9934, lng: 81.0550 }]
  },
  "colombo-nuwara eliya": {
    normal: { bus: "No. 2-10", fare: "Rs. 1,060", duration: "5 hrs" },
    ac: { bus: "No. 2-10 - AC", fare: "Rs. 1,413", duration: "4 hrs" },
    timing: { first: "6:00 AM", last: "7:30 PM", frequency: "Every 30 mins" },
    stops: ["Colombo Fort", "Kandy", "Nuwara Eliya"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 6.9497, lng: 80.7891 }]
  },
  "colombo-kurunegala": {
    normal: { bus: "No. 6", fare: "Rs. 500", duration: "2.5 hrs" },
    ac: { bus: "No. 6 - AC", fare: "Rs. 731", duration: "2 hrs" },
    timing: { first: "5:30 AM", last: "9:30 PM", frequency: "Every 15 mins" },
    stops: ["Colombo Fort", "Kelaniya", "Gampaha", "Kurunegala"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 7.4818, lng: 80.3609 }]
  },
  "colombo-ratnapura": {
    normal: { bus: "No. 98", fare: "Rs. 595", duration: "3 hrs" },
    ac: { bus: "No. 98 - AC", fare: "Rs. 802", duration: "2.5 hrs" },
    timing: { first: "5:30 AM", last: "9:00 PM", frequency: "Every 20 mins" },
    stops: ["Colombo Fort", "Avissawella", "Ratnapura"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 6.6828, lng: 80.3992 }]
  },
  "colombo-puttalam": {
    normal: { bus: "No. 7", fare: "Rs. 900", duration: "3.5 hrs" },
    ac: { bus: "No. 4-7 - AC", fare: "Rs. 960", duration: "3 hrs" },
    timing: { first: "6:00 AM", last: "8:00 PM", frequency: "Every 30 mins" },
    stops: ["Colombo Fort", "Negombo", "Chilaw", "Puttalam"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 8.0408, lng: 79.8394 }]
  },
  "colombo-ampara": {
    normal: { bus: "No. 38-4", fare: "Rs. 1,774", duration: "7 hrs" },
    ac: { bus: "No. 38-4 - AC", fare: "Rs. 2,379", duration: "6 hrs" },
    timing: { first: "6:30 AM", last: "6:30 PM", frequency: "Every 1 hour" },
    stops: ["Colombo Fort", "Kandy", "Polonnaruwa", "Ampara"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 7.2811, lng: 81.6747 }]
  },
  "colombo-matale": {
    normal: { bus: "No. 8", fare: "Rs. 601", duration: "3.5 hrs" },
    ac: { bus: "No. 8 - AC", fare: "Rs. 1,080", duration: "3 hrs" },
    timing: { first: "5:30 AM", last: "9:00 PM", frequency: "Every 20 mins" },
    stops: ["Colombo Fort", "Kandy", "Matale"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 7.4675, lng: 80.6234 }]
  },
  "colombo-vavuniya": {
    normal: { bus: "No. 15/87", fare: "Rs. 1,343", duration: "6 hrs" },
    ac: { bus: "No. 15/87 - AC", fare: "Rs. 1,789", duration: "5 hrs" },
    timing: { first: "6:00 AM", last: "7:00 PM", frequency: "Every 1 hour" },
    stops: ["Colombo Fort", "Kurunegala", "Anuradhapura", "Vavuniya"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 8.7514, lng: 80.4971 }]
  },
  "colombo-mannar": {
    normal: { bus: "No. 4", fare: "Rs. 1,643", duration: "7 hrs" },
    ac: { bus: "No. 4 - AC", fare: "Rs. 2,193", duration: "6 hrs" },
    timing: { first: "6:30 AM", last: "6:00 PM", frequency: "Every 2 hours" },
    stops: ["Colombo Fort", "Kurunegala", "Anuradhapura", "Mannar"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 8.9810, lng: 79.9044 }]
  },
  "colombo-monaragala": {
    normal: { bus: "No. 9", fare: "Rs. 1,093", duration: "6 hrs" },
    ac: { bus: "No. 9 - AC", fare: "Rs. 1,909", duration: "5.5 hrs" },
    timing: { first: "6:00 AM", last: "7:00 PM", frequency: "Every 1 hour" },
    stops: ["Colombo Fort", "Ratnapura", "Wellawaya", "Monaragala"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 6.8728, lng: 81.3507 }]
  },
  "colombo-polonnaruwa": {
    normal: { bus: "No. 48", fare: "Rs. 1,527", duration: "6 hrs" },
    ac: { bus: "No. 48 - AC", fare: "Rs. 3,050", duration: "5 hrs" },
    timing: { first: "6:00 AM", last: "7:30 PM", frequency: "Every 45 mins" },
    stops: ["Colombo Fort", "Kandy", "Dambulla", "Polonnaruwa"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 7.9403, lng: 81.0188 }]
  },
  "colombo-hatton": {
    normal: { bus: "No. 18-2", fare: "Rs. 711", duration: "4 hrs" },
    ac: { bus: "No. 18-2 - AC", fare: "Rs. 950", duration: "3.5 hrs" },
    timing: { first: "6:00 AM", last: "7:00 PM", frequency: "Every 1 hour" },
    stops: ["Colombo Fort", "Avissawella", "Ginigathena", "Hatton"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 6.8978, lng: 80.5951 }]
  },
  "colombo-kataragama": {
    normal: { bus: "No. 32", fare: "Rs. 1,542", duration: "6 hrs" },
    ac: { bus: "No. 32 - AC", fare: "Rs. 2,059", duration: "5.5 hrs" },
    timing: { first: "6:00 AM", last: "6:00 PM", frequency: "Every 2 hours" },
    stops: ["Colombo Fort", "Galle", "Matara", "Hambantota", "Kataragama"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 6.4149, lng: 81.3322 }]
  },
  "colombo-embilipitiya": {
    normal: { bus: "No. 3-1", fare: "Rs. 922", duration: "4 hrs" },
    ac: { bus: "No. 3-1 - AC", fare: "Rs. 1,231", duration: "3.5 hrs" },
    timing: { first: "6:00 AM", last: "7:00 PM", frequency: "Every 1 hour" },
    stops: ["Colombo Fort", "Ratnapura", "Pelmadulla", "Embilipitiya"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 6.3433, lng: 80.8490 }]
  },
  "colombo-chilaw": {
    normal: { bus: "No. 7", fare: "Rs. 500", duration: "2.5 hrs" },
    ac: { bus: "No. 7 - AC", fare: "Rs. 667", duration: "2 hrs" },
    timing: { first: "5:30 AM", last: "9:00 PM", frequency: "Every 20 mins" },
    stops: ["Colombo Fort", "Negombo", "Chilaw"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 7.5758, lng: 79.7953 }]
  },
  "colombo-dambulla": {
    normal: { bus: "No. 6", fare: "Rs. 500", duration: "3 hrs" },
    ac: { bus: "No. 6 - AC", fare: "Rs. 667", duration: "2.5 hrs" },
    timing: { first: "5:30 AM", last: "8:30 PM", frequency: "Every 30 mins" },
    stops: ["Colombo Fort", "Kurunegala", "Dambulla"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 7.8742, lng: 80.6511 }]
  },
  "colombo-welimada": {
    normal: { bus: "No. 2-12", fare: "Rs. 1,222", duration: "5.5 hrs" },
    ac: { bus: "No. 2-12 - AC", fare: "Rs. 1,628", duration: "5 hrs" },
    timing: { first: "6:00 AM", last: "6:30 PM", frequency: "Every 1 hour" },
    stops: ["Colombo Fort", "Ratnapura", "Welimada"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 6.9018, lng: 80.9171 }]
  },
  "colombo-kegalle": {
    normal: { bus: "No. 96", fare: "Rs. 375", duration: "2 hrs" },
    ac: { bus: "No. 96 - AC", fare: "Rs. 500", duration: "1.5 hrs" },
    timing: { first: "5:30 AM", last: "9:30 PM", frequency: "Every 15 mins" },
    stops: ["Colombo Fort", "Avissawella", "Kegalle"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 7.2513, lng: 80.3464 }]
  },
  "colombo-gampaha": {
    normal: { bus: "No. 5", fare: "Rs. 164", duration: "1 hr" },
    ac: { bus: "No. 5 - AC", fare: "Rs. 219", duration: "45 mins" },
    timing: { first: "5:00 AM", last: "10:30 PM", frequency: "Every 5 mins" },
    stops: ["Colombo Fort", "Wattala", "Ja-Ela", "Gampaha"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 7.0873, lng: 80.0144 }]
  },
  "colombo-kalutara": {
    normal: { bus: "No. 2", fare: "Rs. 219", duration: "1.5 hrs" },
    ac: { bus: "No. 2 - AC", fare: "Rs. 292", duration: "1 hr" },
    timing: { first: "5:00 AM", last: "10:00 PM", frequency: "Every 10 mins" },
    stops: ["Colombo Fort", "Moratuwa", "Panadura", "Kalutara"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 6.5854, lng: 79.9607 }]
  },
  "colombo-horana": {
    normal: { bus: "No. 98", fare: "Rs. 219", duration: "1.5 hrs" },
    ac: { bus: "No. 98 - AC", fare: "Rs. 292", duration: "1 hr" },
    timing: { first: "5:30 AM", last: "9:30 PM", frequency: "Every 15 mins" },
    stops: ["Colombo Fort", "Panadura", "Horana"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 6.7153, lng: 80.0615 }]
  },
  "colombo-avissawella": {
    normal: { bus: "No. 96", fare: "Rs. 273", duration: "1.5 hrs" },
    ac: { bus: "No. 96 - AC", fare: "Rs. 364", duration: "1 hr" },
    timing: { first: "5:30 AM", last: "9:30 PM", frequency: "Every 15 mins" },
    stops: ["Colombo Fort", "Hanwella", "Avissawella"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 6.9497, lng: 80.2089 }]
  },
  "colombo-kilinochchi": {
    normal: { bus: "No. 15/87", fare: "Rs. 1,744", duration: "8.5 hrs" },
    ac: { bus: "No. 15/87 - AC", fare: "Rs. 2,330", duration: "7.5 hrs" },
    timing: { first: "6:00 AM", last: "6:00 PM", frequency: "Every 2 hours" },
    stops: ["Colombo Fort", "Anuradhapura", "Vavuniya", "Kilinochchi"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 9.3803, lng: 80.3770 }]
  },
  "colombo-mullaitivu": {
    normal: { bus: "No. 15/82", fare: "Rs. 1,886", duration: "9 hrs" },
    ac: { bus: "No. 15/82 - AC", fare: "Rs. 2,519", duration: "8 hrs" },
    timing: { first: "6:00 AM", last: "5:30 PM", frequency: "Every 2 hours" },
    stops: ["Colombo Fort", "Anuradhapura", "Vavuniya", "Mullaitivu"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 9.2671, lng: 80.8128 }]
  },
  "colombo-tangalle": {
    normal: { bus: "No. 32-4", fare: "Rs. 1,080", duration: "4.5 hrs" },
    ac: { bus: "No. 32-4 - AC", fare: "Rs. 1,442", duration: "4 hrs" },
    timing: { first: "6:00 AM", last: "7:30 PM", frequency: "Every 1 hour" },
    stops: ["Colombo Fort", "Galle", "Matara", "Tangalle"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 6.0249, lng: 80.7977 }]
  },
  "colombo-ambalangoda": {
    normal: { bus: "No. 2-3", fare: "Rs. 500", duration: "2 hrs" },
    ac: { bus: "No. 2-3 - AC", fare: "Rs. 667", duration: "1.5 hrs" },
    timing: { first: "5:30 AM", last: "9:00 PM", frequency: "Every 20 mins" },
    stops: ["Colombo Fort", "Moratuwa", "Kalutara", "Ambalangoda"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 6.2357, lng: 80.0549 }]
  },
  "colombo-hikkaduwa": {
    normal: { bus: "No. 2-1", fare: "Rs. 525", duration: "2 hrs" },
    ac: { bus: "No. 2-1 - AC", fare: "Rs. 700", duration: "1.5 hrs" },
    timing: { first: "5:30 AM", last: "9:00 PM", frequency: "Every 20 mins" },
    stops: ["Colombo Fort", "Moratuwa", "Kalutara", "Hikkaduwa"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 6.1399, lng: 80.1038 }]
  },
  "colombo-ella": {
    normal: { bus: "No. 98-1", fare: "Rs. 1,411", duration: "6.5 hrs" },
    ac: { bus: "No. 98-1 - AC", fare: "Rs. 1,883", duration: "6 hrs" },
    timing: { first: "6:00 AM", last: "6:30 PM", frequency: "Every 2 hours" },
    stops: ["Colombo Fort", "Ratnapura", "Welimada", "Ella"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 6.8667, lng: 81.0466 }]
  },
  "colombo-bandarawela": {
    normal: { bus: "No. 98-1", fare: "Rs. 1,356", duration: "6 hrs" },
    ac: { bus: "No. 98-1 - AC", fare: "Rs. 1,810", duration: "5.5 hrs" },
    timing: { first: "6:00 AM", last: "6:30 PM", frequency: "Every 2 hours" },
    stops: ["Colombo Fort", "Ratnapura", "Welimada", "Bandarawela"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 6.8308, lng: 80.9886 }]
  },
  "colombo-haputale": {
    normal: { bus: "No. 98-1", fare: "Rs. 1,300", duration: "5.5 hrs" },
    ac: { bus: "No. 98-1 - AC", fare: "Rs. 1,735", duration: "5 hrs" },
    timing: { first: "6:00 AM", last: "6:30 PM", frequency: "Every 2 hours" },
    stops: ["Colombo Fort", "Ratnapura", "Haputale"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 6.7697, lng: 80.9556 }]
  },
  "colombo-mahiyanganaya": {
    normal: { bus: "No. 38-1", fare: "Rs. 1,142", duration: "5 hrs" },
    ac: { bus: "No. 38-1 - AC", fare: "Rs. 1,524", duration: "4.5 hrs" },
    timing: { first: "6:00 AM", last: "6:00 PM", frequency: "Every 2 hours" },
    stops: ["Colombo Fort", "Kandy", "Mahiyanganaya"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 7.3280, lng: 81.0008 }]
  },
  "colombo-tissamaharama": {
    normal: { bus: "No. 32-7", fare: "Rs. 1,400", duration: "5.5 hrs" },
    ac: { bus: "No. 32-7 - AC", fare: "Rs. 1,868", duration: "5 hrs" },
    timing: { first: "6:00 AM", last: "6:00 PM", frequency: "Every 2 hours" },
    stops: ["Colombo Fort", "Galle", "Matara", "Hambantota", "Tissamaharama"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 6.2864, lng: 81.2875 }]
  },
  "colombo-sigiriya": {
    normal: { bus: "No. 6", fare: "Rs. 545", duration: "3.5 hrs" },
    ac: { bus: "No. 6 - AC", fare: "Rs. 727", duration: "3 hrs" },
    timing: { first: "6:00 AM", last: "7:00 PM", frequency: "Every 1 hour" },
    stops: ["Colombo Fort", "Kurunegala", "Dambulla", "Sigiriya"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 7.9572, lng: 80.7603 }]
  },
  "colombo-panadura": {
    normal: { bus: "No. 2", fare: "Rs. 109", duration: "45 mins" },
    ac: { bus: "No. 2 - AC", fare: "Rs. 146", duration: "35 mins" },
    timing: { first: "5:00 AM", last: "11:00 PM", frequency: "Every 5 mins" },
    stops: ["Colombo Fort", "Moratuwa", "Panadura"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 6.7131, lng: 79.9042 }]
  },
  "colombo-moratuwa": {
    normal: { bus: "No. 2", fare: "Rs. 82", duration: "30 mins" },
    ac: { bus: "No. 2 - AC", fare: "Rs. 109", duration: "25 mins" },
    timing: { first: "5:00 AM", last: "11:00 PM", frequency: "Every 5 mins" },
    stops: ["Colombo Fort", "Dehiwala", "Moratuwa"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 6.7730, lng: 79.8814 }]
  },
  "colombo-ja-ela": {
    normal: { bus: "No. 4", fare: "Rs. 109", duration: "45 mins" },
    ac: { bus: "No. 4 - AC", fare: "Rs. 146", duration: "35 mins" },
    timing: { first: "5:00 AM", last: "11:00 PM", frequency: "Every 5 mins" },
    stops: ["Colombo Fort", "Wattala", "Ja-Ela"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 7.0746, lng: 79.8916 }]
  },
  "colombo-katunayake": {
    normal: { bus: "No. 4", fare: "Rs. 164", duration: "1 hr" },
    ac: { bus: "No. 4 - AC", fare: "Rs. 219", duration: "45 mins" },
    timing: { first: "4:30 AM", last: "11:00 PM", frequency: "Every 10 mins" },
    stops: ["Colombo Fort", "Wattala", "Ja-Ela", "Katunayake"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 7.1696, lng: 79.8845 }]
  },
  "colombo-kadawatha": {
    normal: { bus: "No. 1", fare: "Rs. 82", duration: "30 mins" },
    ac: { bus: "No. 1 - AC", fare: "Rs. 109", duration: "25 mins" },
    timing: { first: "5:00 AM", last: "10:30 PM", frequency: "Every 5 mins" },
    stops: ["Colombo Fort", "Kelaniya", "Kadawatha"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 6.9956, lng: 79.9563 }]
  },
  "colombo-dehiwala": {
    normal: { bus: "No. 2", fare: "Rs. 55", duration: "20 mins" },
    ac: { bus: "No. 2 - AC", fare: "Rs. 73", duration: "15 mins" },
    timing: { first: "5:00 AM", last: "11:00 PM", frequency: "Every 3 mins" },
    stops: ["Colombo Fort", "Dehiwala"],
    coords: [{ lat: 6.9271, lng: 79.8612 }, { lat: 6.8517, lng: 79.8647 }]
  },

  // ============ KANDY ROUTES ============
  "kandy-jaffna": {
    normal: { bus: "No. 43/87", fare: "Rs. 1,732", duration: "7 hrs" },
    ac: { bus: "No. 43/87 - AC", fare: "Rs. 2,291", duration: "6 hrs" },
    timing: { first: "6:00 AM", last: "7:00 PM", frequency: "Every 2 hours" },
    stops: ["Kandy", "Dambulla", "Anuradhapura", "Vavuniya", "Jaffna"],
    coords: [{ lat: 7.2906, lng: 80.6337 }, { lat: 9.6615, lng: 80.0255 }]
  },
  "kandy-anuradhapura": {
    normal: { bus: "No. 43", fare: "Rs. 693", duration: "3.5 hrs" },
    ac: { bus: "No. 43 - AC", fare: "Rs. 928", duration: "3 hrs" },
    timing: { first: "6:00 AM", last: "7:00 PM", frequency: "Every 1 hour" },
    stops: ["Kandy", "Dambulla", "Kekirawa", "Anuradhapura"],
    coords: [{ lat: 7.2906, lng: 80.6337 }, { lat: 8.3114, lng: 80.4037 }]
  },
  "kandy-nuwara eliya": {
    normal: { bus: "No. 98", fare: "Rs. 232", duration: "2 hrs" },
    ac: { bus: "No. 98 - AC", fare: "Rs. 437", duration: "1.5 hrs" },
    timing: { first: "6:00 AM", last: "8:00 PM", frequency: "Every 30 mins" },
    stops: ["Kandy", "Gampola", "Nuwara Eliya"],
    coords: [{ lat: 7.2906, lng: 80.6337 }, { lat: 6.9497, lng: 80.7891 }]
  },
  "kandy-badulla": {
    normal: { bus: "No. 98/1", fare: "Rs. 464", duration: "3.5 hrs" },
    ac: { bus: "No. 98/1 - AC", fare: "Rs. 867", duration: "3 hrs" },
    timing: { first: "6:00 AM", last: "7:00 PM", frequency: "Every 45 mins" },
    stops: ["Kandy", "Nuwara Eliya", "Welimada", "Badulla"],
    coords: [{ lat: 7.2906, lng: 80.6337 }, { lat: 6.9934, lng: 81.0550 }]
  },
  "kandy-polonnaruwa": {
    normal: { bus: "No. 48", fare: "Rs. 414", duration: "3 hrs" },
    ac: { bus: "No. 48 - AC", fare: "Rs. 774", duration: "2.5 hrs" },
    timing: { first: "5:30 AM", last: "7:30 PM", frequency: "Every 45 mins" },
    stops: ["Kandy", "Matale", "Dambulla", "Polonnaruwa"],
    coords: [{ lat: 7.2906, lng: 80.6337 }, { lat: 7.9403, lng: 81.0188 }]
  },
  "kandy-trincomalee": {
    normal: { bus: "No. 49", fare: "Rs. 633", duration: "4 hrs" },
    ac: { bus: "No. 49 - AC", fare: "Rs. 1,189", duration: "3.5 hrs" },
    timing: { first: "6:00 AM", last: "6:00 PM", frequency: "Every 1 hour" },
    stops: ["Kandy", "Dambulla", "Habarana", "Trincomalee"],
    coords: [{ lat: 7.2906, lng: 80.6337 }, { lat: 8.5874, lng: 81.2152 }]
  },
  "kandy-matara": {
    normal: { bus: "No. 2", fare: "Rs. 567", duration: "4 hrs" },
    ac: { bus: "No. 2 - AC", fare: "Rs. 1,064", duration: "3.5 hrs" },
    timing: { first: "5:30 AM", last: "7:00 PM", frequency: "Every 1 hour" },
    stops: ["Kandy", "Colombo", "Galle", "Matara"],
    coords: [{ lat: 7.2906, lng: 80.6337 }, { lat: 5.9549, lng: 80.5550 }]
  },
  "kandy-hatton": {
    normal: { bus: "No. 18-2", fare: "Rs. 219", duration: "2 hrs" },
    ac: { bus: "No. 18-2 - AC", fare: "Rs. 411", duration: "1.5 hrs" },
    timing: { first: "6:00 AM", last: "7:30 PM", frequency: "Every 45 mins" },
    stops: ["Kandy", "Gampola", "Ginigathena", "Hatton"],
    coords: [{ lat: 7.2906, lng: 80.6337 }, { lat: 6.8978, lng: 80.5951 }]
  },
  "kandy-matale": {
    normal: { bus: "No. 8", fare: "Rs. 109", duration: "45 mins" },
    ac: { bus: "No. 8 - AC", fare: "Rs. 219", duration: "30 mins" },
    timing: { first: "5:00 AM", last: "9:30 PM", frequency: "Every 10 mins" },
    stops: ["Kandy", "Matale"],
    coords: [{ lat: 7.2906, lng: 80.6337 }, { lat: 7.4675, lng: 80.6234 }]
  },
  "kandy-kurunegala": {
    normal: { bus: "No. 1", fare: "Rs. 232", duration: "1.5 hrs" },
    ac: { bus: "No. 1 - AC", fare: "Rs. 437", duration: "1 hr" },
    timing: { first: "5:30 AM", last: "9:00 PM", frequency: "Every 20 mins" },
    stops: ["Kandy", "Alawwa", "Kurunegala"],
    coords: [{ lat: 7.2906, lng: 80.6337 }, { lat: 7.4818, lng: 80.3609 }]
  },
  "kandy-mahiyanganaya": {
    normal: { bus: "No. 38-1", fare: "Rs. 232", duration: "2 hrs" },
    ac: { bus: "No. 38-1 - AC", fare: "Rs. 437", duration: "1.5 hrs" },
    timing: { first: "6:00 AM", last: "6:30 PM", frequency: "Every 1 hour" },
    stops: ["Kandy", "Mahiyanganaya"],
    coords: [{ lat: 7.2906, lng: 80.6337 }, { lat: 7.3280, lng: 81.0008 }]
  },
  "kandy-dambulla": {
    normal: { bus: "No. 6", fare: "Rs. 164", duration: "1.5 hrs" },
    ac: { bus: "No. 6 - AC", fare: "Rs. 308", duration: "1 hr" },
    timing: { first: "5:30 AM", last: "9:00 PM", frequency: "Every 15 mins" },
    stops: ["Kandy", "Matale", "Dambulla"],
    coords: [{ lat: 7.2906, lng: 80.6337 }, { lat: 7.8742, lng: 80.6511 }]
  },

  // ============ GALLE ROUTES ============
  "galle-matara": {
    normal: { bus: "No. 32", fare: "Rs. 202", duration: "1 hr" },
    ac: { bus: "No. 32 - AC", fare: "Rs. 379", duration: "45 mins" },
    timing: { first: "5:00 AM", last: "10:00 PM", frequency: "Every 10 mins" },
    stops: ["Galle", "Unawatuna", "Weligama", "Matara"],
    coords: [{ lat: 6.0535, lng: 80.2210 }, { lat: 5.9549, lng: 80.5550 }]
  },
  "galle-hambantota": {
    normal: { bus: "No. 32-1", fare: "Rs. 414", duration: "2 hrs" },
    ac: { bus: "No. 32-1 - AC", fare: "Rs. 777", duration: "1.5 hrs" },
    timing: { first: "5:30 AM", last: "8:00 PM", frequency: "Every 30 mins" },
    stops: ["Galle", "Matara", "Tangalle", "Hambantota"],
    coords: [{ lat: 6.0535, lng: 80.2210 }, { lat: 6.1429, lng: 81.1212 }]
  },
  "galle-ratnapura": {
    normal: { bus: "No. 32/3", fare: "Rs. 349", duration: "2.5 hrs" },
    ac: { bus: "No. 32/3 - AC", fare: "Rs. 655", duration: "2 hrs" },
    timing: { first: "6:00 AM", last: "7:00 PM", frequency: "Every 1 hour" },
    stops: ["Galle", "Elpitiya", "Ratnapura"],
    coords: [{ lat: 6.0535, lng: 80.2210 }, { lat: 6.6828, lng: 80.3992 }]
  },
  "galle-kataragama": {
    normal: { bus: "No. 32-7", fare: "Rs. 707", duration: "3.5 hrs" },
    ac: { bus: "No. 32-7 - AC", fare: "Rs. 1,328", duration: "3 hrs" },
    timing: { first: "6:00 AM", last: "6:00 PM", frequency: "Every 2 hours" },
    stops: ["Galle", "Matara", "Hambantota", "Kataragama"],
    coords: [{ lat: 6.0535, lng: 80.2210 }, { lat: 6.4149, lng: 81.3322 }]
  },

  // ============ JAFFNA ROUTES ============
  "jaffna-vavuniya": {
    normal: { bus: "No. 15", fare: "Rs. 540", duration: "2.5 hrs" },
    ac: { bus: "No. 15 - AC", fare: "Rs. 1,013", duration: "2 hrs" },
    timing: { first: "5:30 AM", last: "7:00 PM", frequency: "Every 30 mins" },
    stops: ["Jaffna", "Kilinochchi", "Vavuniya"],
    coords: [{ lat: 9.6615, lng: 80.0255 }, { lat: 8.7514, lng: 80.4971 }]
  },
  "jaffna-trincomalee": {
    normal: { bus: "No. 78", fare: "Rs. 742", duration: "4 hrs" },
    ac: { bus: "No. 78 - AC", fare: "Rs. 1,391", duration: "3.5 hrs" },
    timing: { first: "6:00 AM", last: "5:00 PM", frequency: "Every 2 hours" },
    stops: ["Jaffna", "Mullaitivu", "Trincomalee"],
    coords: [{ lat: 9.6615, lng: 80.0255 }, { lat: 8.5874, lng: 81.2152 }]
  },
  "jaffna-mannar": {
    normal: { bus: "No. 87", fare: "Rs. 414", duration: "2.5 hrs" },
    ac: { bus: "No. 87 - AC", fare: "Rs. 777", duration: "2 hrs" },
    timing: { first: "6:00 AM", last: "5:30 PM", frequency: "Every 1 hour" },
    stops: ["Jaffna", "Paranthan", "Mannar"],
    coords: [{ lat: 9.6615, lng: 80.0255 }, { lat: 8.9810, lng: 79.9044 }]
  },
  "jaffna-anuradhapura": {
    normal: { bus: "No. 15", fare: "Rs. 953", duration: "3.5 hrs" },
    ac: { bus: "No. 15 - AC", fare: "Rs. 1,784", duration: "3 hrs" },
    timing: { first: "6:00 AM", last: "7:00 PM", frequency: "Every 1 hour" },
    stops: ["Jaffna", "Kilinochchi", "Vavuniya", "Anuradhapura"],
    coords: [{ lat: 9.6615, lng: 80.0255 }, { lat: 8.3114, lng: 80.4037 }]
  },
  "jaffna-kilinochchi": {
    normal: { bus: "No. 15", fare: "Rs. 289", duration: "1.5 hrs" },
    ac: { bus: "No. 15 - AC", fare: "Rs. 542", duration: "1 hr" },
    timing: { first: "5:30 AM", last: "7:30 PM", frequency: "Every 30 mins" },
    stops: ["Jaffna", "Elephant Pass", "Kilinochchi"],
    coords: [{ lat: 9.6615, lng: 80.0255 }, { lat: 9.3803, lng: 80.3770 }]
  },

  // ============ ANURADHAPURA ROUTES ============
  "anuradhapura-nochchiyagama": {
    normal: { bus: "No. 57/822/87", fare: "Rs. 107", duration: "45 mins" },
    ac: { bus: "No. 57 - AC", fare: "Rs. 202", duration: "35 mins" },
    timing: { first: "5:30 AM", last: "8:00 PM", frequency: "Every 20 mins" },
    stops: ["Anuradhapura", "Thalawa", "Nochchiyagama"],
    coords: [{ lat: 8.3114, lng: 80.4037 }, { lat: 8.2833, lng: 80.2167 }],
    alternativeBuses: [
      { bus: "No. 57/1", fare: "Rs. 107", type: "Normal" },
      { bus: "No. 822", fare: "Rs. 107", type: "Normal" },
      { bus: "No. 87", fare: "Rs. 120", type: "Normal" },
    ]
  },
  "anuradhapura-trincomalee": {
    normal: { bus: "No. 49", fare: "Rs. 464", duration: "2.5 hrs" },
    ac: { bus: "No. 49 - AC", fare: "Rs. 867", duration: "2 hrs" },
    timing: { first: "6:00 AM", last: "6:30 PM", frequency: "Every 1 hour" },
    stops: ["Anuradhapura", "Kekirawa", "Habarana", "Trincomalee"],
    coords: [{ lat: 8.3114, lng: 80.4037 }, { lat: 8.5874, lng: 81.2152 }]
  },
  "anuradhapura-kurunegala": {
    normal: { bus: "No. 6", fare: "Rs. 347", duration: "2 hrs" },
    ac: { bus: "No. 6 - AC", fare: "Rs. 650", duration: "1.5 hrs" },
    timing: { first: "5:30 AM", last: "8:00 PM", frequency: "Every 30 mins" },
    stops: ["Anuradhapura", "Kekirawa", "Kurunegala"],
    coords: [{ lat: 8.3114, lng: 80.4037 }, { lat: 7.4818, lng: 80.3609 }]
  },
  "anuradhapura-jaffna": {
    normal: { bus: "No. 15", fare: "Rs. 953", duration: "3.5 hrs" },
    ac: { bus: "No. 15 - AC", fare: "Rs. 1,784", duration: "3 hrs" },
    timing: { first: "6:00 AM", last: "7:00 PM", frequency: "Every 1 hour" },
    stops: ["Anuradhapura", "Vavuniya", "Kilinochchi", "Jaffna"],
    coords: [{ lat: 8.3114, lng: 80.4037 }, { lat: 9.6615, lng: 80.0255 }]
  },
  "anuradhapura-polonnaruwa": {
    normal: { bus: "No. 49", fare: "Rs. 347", duration: "2 hrs" },
    ac: { bus: "No. 49 - AC", fare: "Rs. 650", duration: "1.5 hrs" },
    timing: { first: "6:00 AM", last: "6:30 PM", frequency: "Every 1 hour" },
    stops: ["Anuradhapura", "Habarana", "Polonnaruwa"],
    coords: [{ lat: 8.3114, lng: 80.4037 }, { lat: 7.9403, lng: 81.0188 }]
  },

  // ============ TRINCOMALEE ROUTES ============
  "trincomalee-batticaloa": {
    normal: { bus: "No. 48", fare: "Rs. 414", duration: "2.5 hrs" },
    ac: { bus: "No. 48 - AC", fare: "Rs. 777", duration: "2 hrs" },
    timing: { first: "6:00 AM", last: "6:00 PM", frequency: "Every 1 hour" },
    stops: ["Trincomalee", "Muttur", "Batticaloa"],
    coords: [{ lat: 8.5874, lng: 81.2152 }, { lat: 7.7310, lng: 81.6747 }]
  },
  "trincomalee-polonnaruwa": {
    normal: { bus: "No. 49", fare: "Rs. 311", duration: "2 hrs" },
    ac: { bus: "No. 49 - AC", fare: "Rs. 583", duration: "1.5 hrs" },
    timing: { first: "6:00 AM", last: "6:30 PM", frequency: "Every 1 hour" },
    stops: ["Trincomalee", "Kantale", "Polonnaruwa"],
    coords: [{ lat: 8.5874, lng: 81.2152 }, { lat: 7.9403, lng: 81.0188 }]
  },
  "trincomalee-vavuniya": {
    normal: { bus: "No. 87", fare: "Rs. 347", duration: "2 hrs" },
    ac: { bus: "No. 87 - AC", fare: "Rs. 650", duration: "1.5 hrs" },
    timing: { first: "6:00 AM", last: "6:00 PM", frequency: "Every 1 hour" },
    stops: ["Trincomalee", "Vavuniya"],
    coords: [{ lat: 8.5874, lng: 81.2152 }, { lat: 8.7514, lng: 80.4971 }]
  },

  // ============ BATTICALOA ROUTES ============
  "batticaloa-ampara": {
    normal: { bus: "No. 68", fare: "Rs. 202", duration: "1.5 hrs" },
    ac: { bus: "No. 68 - AC", fare: "Rs. 379", duration: "1 hr" },
    timing: { first: "5:30 AM", last: "7:00 PM", frequency: "Every 30 mins" },
    stops: ["Batticaloa", "Kalmunai", "Ampara"],
    coords: [{ lat: 7.7310, lng: 81.6747 }, { lat: 7.2811, lng: 81.6747 }]
  },
  "batticaloa-polonnaruwa": {
    normal: { bus: "No. 48", fare: "Rs. 414", duration: "2.5 hrs" },
    ac: { bus: "No. 48 - AC", fare: "Rs. 777", duration: "2 hrs" },
    timing: { first: "6:00 AM", last: "6:00 PM", frequency: "Every 1 hour" },
    stops: ["Batticaloa", "Valaichchenai", "Polonnaruwa"],
    coords: [{ lat: 7.7310, lng: 81.6747 }, { lat: 7.9403, lng: 81.0188 }]
  },

  // ============ MATARA ROUTES ============
  "matara-hambantota": {
    normal: { bus: "No. 32-1", fare: "Rs. 289", duration: "1.5 hrs" },
    ac: { bus: "No. 32-1 - AC", fare: "Rs. 542", duration: "1 hr" },
    timing: { first: "5:30 AM", last: "8:30 PM", frequency: "Every 20 mins" },
    stops: ["Matara", "Tangalle", "Hambantota"],
    coords: [{ lat: 5.9549, lng: 80.5550 }, { lat: 6.1429, lng: 81.1212 }]
  },
  "matara-badulla": {
    normal: { bus: "No. 99", fare: "Rs. 589", duration: "4 hrs" },
    ac: { bus: "No. 99 - AC", fare: "Rs. 1,104", duration: "3.5 hrs" },
    timing: { first: "6:00 AM", last: "6:00 PM", frequency: "Every 2 hours" },
    stops: ["Matara", "Wellawaya", "Badulla"],
    coords: [{ lat: 5.9549, lng: 80.5550 }, { lat: 6.9934, lng: 81.0550 }]
  },
  "matara-kataragama": {
    normal: { bus: "No. 32-7", fare: "Rs. 464", duration: "3 hrs" },
    ac: { bus: "No. 32-7 - AC", fare: "Rs. 870", duration: "2.5 hrs" },
    timing: { first: "6:00 AM", last: "6:30 PM", frequency: "Every 1 hour" },
    stops: ["Matara", "Tangalle", "Hambantota", "Kataragama"],
    coords: [{ lat: 5.9549, lng: 80.5550 }, { lat: 6.4149, lng: 81.3322 }]
  },

  // ============ HAMBANTOTA ROUTES ============
  "hambantota-monaragala": {
    normal: { bus: "No. 99", fare: "Rs. 347", duration: "2.5 hrs" },
    ac: { bus: "No. 99 - AC", fare: "Rs. 650", duration: "2 hrs" },
    timing: { first: "6:00 AM", last: "6:00 PM", frequency: "Every 1 hour" },
    stops: ["Hambantota", "Tissamaharama", "Monaragala"],
    coords: [{ lat: 6.1429, lng: 81.1212 }, { lat: 6.8728, lng: 81.3507 }]
  },
  "hambantota-matara": {
    normal: { bus: "No. 32-1", fare: "Rs. 289", duration: "1.5 hrs" },
    ac: { bus: "No. 32-1 - AC", fare: "Rs. 542", duration: "1 hr" },
    timing: { first: "5:00 AM", last: "9:00 PM", frequency: "Every 20 mins" },
    stops: ["Hambantota", "Tangalle", "Matara"],
    coords: [{ lat: 6.1429, lng: 81.1212 }, { lat: 5.9549, lng: 80.5550 }]
  },

  // ============ BADULLA ROUTES ============
  "badulla-nuwara eliya": {
    normal: { bus: "No. 98", fare: "Rs. 232", duration: "2 hrs" },
    ac: { bus: "No. 98 - AC", fare: "Rs. 437", duration: "1.5 hrs" },
    timing: { first: "6:00 AM", last: "6:00 PM", frequency: "Every 45 mins" },
    stops: ["Badulla", "Welimada", "Nuwara Eliya"],
    coords: [{ lat: 6.9934, lng: 81.0550 }, { lat: 6.9497, lng: 80.7891 }]
  },
  "badulla-monaragala": {
    normal: { bus: "No. 99", fare: "Rs. 202", duration: "1.5 hrs" },
    ac: { bus: "No. 99 - AC", fare: "Rs. 379", duration: "1 hr" },
    timing: { first: "6:00 AM", last: "6:30 PM", frequency: "Every 1 hour" },
    stops: ["Badulla", "Wellawaya", "Monaragala"],
    coords: [{ lat: 6.9934, lng: 81.0550 }, { lat: 6.8728, lng: 81.3507 }]
  },
  "badulla-kandy": {
    normal: { bus: "No. 98/1", fare: "Rs. 464", duration: "3.5 hrs" },
    ac: { bus: "No. 98/1 - AC", fare: "Rs. 867", duration: "3 hrs" },
    timing: { first: "6:00 AM", last: "6:30 PM", frequency: "Every 1 hour" },
    stops: ["Badulla", "Welimada", "Nuwara Eliya", "Kandy"],
    coords: [{ lat: 6.9934, lng: 81.0550 }, { lat: 7.2906, lng: 80.6337 }]
  },

  // ============ KURUNEGALA ROUTES ============
  "kurunegala-puttalam": {
    normal: { bus: "No. 7", fare: "Rs. 232", duration: "1.5 hrs" },
    ac: { bus: "No. 7 - AC", fare: "Rs. 437", duration: "1 hr" },
    timing: { first: "5:30 AM", last: "8:30 PM", frequency: "Every 20 mins" },
    stops: ["Kurunegala", "Wariyapola", "Puttalam"],
    coords: [{ lat: 7.4818, lng: 80.3609 }, { lat: 8.0408, lng: 79.8394 }]
  },
  "kurunegala-anuradhapura": {
    normal: { bus: "No. 15", fare: "Rs. 347", duration: "2 hrs" },
    ac: { bus: "No. 15 - AC", fare: "Rs. 650", duration: "1.5 hrs" },
    timing: { first: "5:30 AM", last: "8:00 PM", frequency: "Every 30 mins" },
    stops: ["Kurunegala", "Dambulla", "Anuradhapura"],
    coords: [{ lat: 7.4818, lng: 80.3609 }, { lat: 8.3114, lng: 80.4037 }]
  },
  "kurunegala-kandy": {
    normal: { bus: "No. 1", fare: "Rs. 232", duration: "1.5 hrs" },
    ac: { bus: "No. 1 - AC", fare: "Rs. 437", duration: "1 hr" },
    timing: { first: "5:30 AM", last: "9:00 PM", frequency: "Every 20 mins" },
    stops: ["Kurunegala", "Alawwa", "Kandy"],
    coords: [{ lat: 7.4818, lng: 80.3609 }, { lat: 7.2906, lng: 80.6337 }]
  },

  // ============ RATNAPURA ROUTES ============
  "ratnapura-badulla": {
    normal: { bus: "No. 98", fare: "Rs. 414", duration: "3 hrs" },
    ac: { bus: "No. 98 - AC", fare: "Rs. 777", duration: "2.5 hrs" },
    timing: { first: "6:00 AM", last: "6:00 PM", frequency: "Every 1 hour" },
    stops: ["Ratnapura", "Pelmadulla", "Wellawaya", "Badulla"],
    coords: [{ lat: 6.6828, lng: 80.3992 }, { lat: 6.9934, lng: 81.0550 }]
  },
  "ratnapura-galle": {
    normal: { bus: "No. 32/3", fare: "Rs. 349", duration: "2.5 hrs" },
    ac: { bus: "No. 32/3 - AC", fare: "Rs. 655", duration: "2 hrs" },
    timing: { first: "6:00 AM", last: "6:30 PM", frequency: "Every 1 hour" },
    stops: ["Ratnapura", "Elpitiya", "Galle"],
    coords: [{ lat: 6.6828, lng: 80.3992 }, { lat: 6.0535, lng: 80.2210 }]
  },
  "ratnapura-kegalle": {
    normal: { bus: "No. 98", fare: "Rs. 174", duration: "1 hr" },
    ac: { bus: "No. 98 - AC", fare: "Rs. 326", duration: "45 mins" },
    timing: { first: "6:00 AM", last: "8:00 PM", frequency: "Every 20 mins" },
    stops: ["Ratnapura", "Avissawella", "Kegalle"],
    coords: [{ lat: 6.6828, lng: 80.3992 }, { lat: 7.2513, lng: 80.3464 }]
  },

  // ============ VAVUNIYA ROUTES ============
  "vavuniya-jaffna": {
    normal: { bus: "No. 15", fare: "Rs. 540", duration: "2 hrs" },
    ac: { bus: "No. 15 - AC", fare: "Rs. 1,013", duration: "1.5 hrs" },
    timing: { first: "5:30 AM", last: "7:30 PM", frequency: "Every 30 mins" },
    stops: ["Vavuniya", "Kilinochchi", "Jaffna"],
    coords: [{ lat: 8.7514, lng: 80.4971 }, { lat: 9.6615, lng: 80.0255 }]
  },
  "vavuniya-anuradhapura": {
    normal: { bus: "No. 15", fare: "Rs. 289", duration: "1.5 hrs" },
    ac: { bus: "No. 15 - AC", fare: "Rs. 542", duration: "1 hr" },
    timing: { first: "5:30 AM", last: "8:00 PM", frequency: "Every 30 mins" },
    stops: ["Vavuniya", "Anuradhapura"],
    coords: [{ lat: 8.7514, lng: 80.4971 }, { lat: 8.3114, lng: 80.4037 }]
  },

  // ============ MANNAR ROUTES ============
  "mannar-anuradhapura": {
    normal: { bus: "No. 87", fare: "Rs. 414", duration: "2.5 hrs" },
    ac: { bus: "No. 87 - AC", fare: "Rs. 777", duration: "2 hrs" },
    timing: { first: "6:00 AM", last: "5:30 PM", frequency: "Every 1 hour" },
    stops: ["Mannar", "Medawachchiya", "Anuradhapura"],
    coords: [{ lat: 8.9810, lng: 79.9044 }, { lat: 8.3114, lng: 80.4037 }]
  },

  // ============ PUTTALAM ROUTES ============
  "puttalam-negombo": {
    normal: { bus: "No. 4", fare: "Rs. 289", duration: "2 hrs" },
    ac: { bus: "No. 4 - AC", fare: "Rs. 542", duration: "1.5 hrs" },
    timing: { first: "5:30 AM", last: "8:00 PM", frequency: "Every 30 mins" },
    stops: ["Puttalam", "Chilaw", "Negombo"],
    coords: [{ lat: 8.0408, lng: 79.8394 }, { lat: 7.2097, lng: 79.8350 }]
  },

  // ============ KALUTARA ROUTES ============
  "kalutara-galle": {
    normal: { bus: "No. 2", fare: "Rs. 289", duration: "1.5 hrs" },
    ac: { bus: "No. 2 - AC", fare: "Rs. 542", duration: "1 hr" },
    timing: { first: "5:00 AM", last: "9:30 PM", frequency: "Every 15 mins" },
    stops: ["Kalutara", "Aluthgama", "Bentota", "Galle"],
    coords: [{ lat: 6.5854, lng: 79.9607 }, { lat: 6.0535, lng: 80.2210 }]
  },
  "kalutara-ratnapura": {
    normal: { bus: "No. 98", fare: "Rs. 232", duration: "1.5 hrs" },
    ac: { bus: "No. 98 - AC", fare: "Rs. 437", duration: "1 hr" },
    timing: { first: "6:00 AM", last: "7:30 PM", frequency: "Every 30 mins" },
    stops: ["Kalutara", "Horana", "Ratnapura"],
    coords: [{ lat: 6.5854, lng: 79.9607 }, { lat: 6.6828, lng: 80.3992 }]
  },

  // ============ NUWARA ELIYA ROUTES ============
  "nuwara eliya-badulla": {
    normal: { bus: "No. 98", fare: "Rs. 232", duration: "2 hrs" },
    ac: { bus: "No. 98 - AC", fare: "Rs. 437", duration: "1.5 hrs" },
    timing: { first: "6:00 AM", last: "6:00 PM", frequency: "Every 45 mins" },
    stops: ["Nuwara Eliya", "Welimada", "Badulla"],
    coords: [{ lat: 6.9497, lng: 80.7891 }, { lat: 6.9934, lng: 81.0550 }]
  },
  "nuwara eliya-kandy": {
    normal: { bus: "No. 98", fare: "Rs. 232", duration: "2 hrs" },
    ac: { bus: "No. 98 - AC", fare: "Rs. 437", duration: "1.5 hrs" },
    timing: { first: "6:00 AM", last: "7:00 PM", frequency: "Every 30 mins" },
    stops: ["Nuwara Eliya", "Gampola", "Kandy"],
    coords: [{ lat: 6.9497, lng: 80.7891 }, { lat: 7.2906, lng: 80.6337 }]
  },

  // ============ MONARAGALA ROUTES ============
  "monaragala-badulla": {
    normal: { bus: "No. 99", fare: "Rs. 202", duration: "1.5 hrs" },
    ac: { bus: "No. 99 - AC", fare: "Rs. 379", duration: "1 hr" },
    timing: { first: "6:00 AM", last: "6:30 PM", frequency: "Every 1 hour" },
    stops: ["Monaragala", "Wellawaya", "Badulla"],
    coords: [{ lat: 6.8728, lng: 81.3507 }, { lat: 6.9934, lng: 81.0550 }]
  },
  "monaragala-hambantota": {
    normal: { bus: "No. 99", fare: "Rs. 347", duration: "2.5 hrs" },
    ac: { bus: "No. 99 - AC", fare: "Rs. 650", duration: "2 hrs" },
    timing: { first: "6:00 AM", last: "5:30 PM", frequency: "Every 1 hour" },
    stops: ["Monaragala", "Tissamaharama", "Hambantota"],
    coords: [{ lat: 6.8728, lng: 81.3507 }, { lat: 6.1429, lng: 81.1212 }]
  },

  // ============ AMPARA ROUTES ============
  "ampara-batticaloa": {
    normal: { bus: "No. 68", fare: "Rs. 202", duration: "1.5 hrs" },
    ac: { bus: "No. 68 - AC", fare: "Rs. 379", duration: "1 hr" },
    timing: { first: "5:30 AM", last: "7:00 PM", frequency: "Every 30 mins" },
    stops: ["Ampara", "Kalmunai", "Batticaloa"],
    coords: [{ lat: 7.2811, lng: 81.6747 }, { lat: 7.7310, lng: 81.6747 }]
  },
  "ampara-monaragala": {
    normal: { bus: "No. 99", fare: "Rs. 289", duration: "2 hrs" },
    ac: { bus: "No. 99 - AC", fare: "Rs. 542", duration: "1.5 hrs" },
    timing: { first: "6:00 AM", last: "5:30 PM", frequency: "Every 1 hour" },
    stops: ["Ampara", "Monaragala"],
    coords: [{ lat: 7.2811, lng: 81.6747 }, { lat: 6.8728, lng: 81.3507 }]
  },

  // ============ KILINOCHCHI ROUTES ============
  "kilinochchi-vavuniya": {
    normal: { bus: "No. 15", fare: "Rs. 232", duration: "1 hr" },
    ac: { bus: "No. 15 - AC", fare: "Rs. 437", duration: "45 mins" },
    timing: { first: "5:30 AM", last: "7:30 PM", frequency: "Every 30 mins" },
    stops: ["Kilinochchi", "Vavuniya"],
    coords: [{ lat: 9.3803, lng: 80.3770 }, { lat: 8.7514, lng: 80.4971 }]
  },

  // ============ MULLAITIVU ROUTES ============
  "mullaitivu-vavuniya": {
    normal: { bus: "No. 15/1", fare: "Rs. 347", duration: "2 hrs" },
    ac: { bus: "No. 15/1 - AC", fare: "Rs. 650", duration: "1.5 hrs" },
    timing: { first: "6:00 AM", last: "5:00 PM", frequency: "Every 2 hours" },
    stops: ["Mullaitivu", "Mankulam", "Vavuniya"],
    coords: [{ lat: 9.2671, lng: 80.8128 }, { lat: 8.7514, lng: 80.4971 }]
  },

  // ============ GAMPAHA ROUTES ============
  "gampaha-negombo": {
    normal: { bus: "No. 4", fare: "Rs. 87", duration: "45 mins" },
    ac: { bus: "No. 4 - AC", fare: "Rs. 163", duration: "30 mins" },
    timing: { first: "5:00 AM", last: "10:00 PM", frequency: "Every 10 mins" },
    stops: ["Gampaha", "Ja-Ela", "Negombo"],
    coords: [{ lat: 7.0873, lng: 80.0144 }, { lat: 7.2097, lng: 79.8350 }]
  },
  "gampaha-kandy": {
    normal: { bus: "No. 1", fare: "Rs. 347", duration: "2 hrs" },
    ac: { bus: "No. 1 - AC", fare: "Rs. 650", duration: "1.5 hrs" },
    timing: { first: "5:30 AM", last: "9:00 PM", frequency: "Every 20 mins" },
    stops: ["Gampaha", "Kadawatha", "Nittambuwa", "Kandy"],
    coords: [{ lat: 7.0873, lng: 80.0144 }, { lat: 7.2906, lng: 80.6337 }]
  },

  // ============ POLONNARUWA ROUTES ============
  "polonnaruwa-batticaloa": {
    normal: { bus: "No. 48", fare: "Rs. 414", duration: "2.5 hrs" },
    ac: { bus: "No. 48 - AC", fare: "Rs. 777", duration: "2 hrs" },
    timing: { first: "6:00 AM", last: "6:00 PM", frequency: "Every 1 hour" },
    stops: ["Polonnaruwa", "Valaichchenai", "Batticaloa"],
    coords: [{ lat: 7.9403, lng: 81.0188 }, { lat: 7.7310, lng: 81.6747 }]
  },
  "polonnaruwa-anuradhapura": {
    normal: { bus: "No. 49", fare: "Rs. 347", duration: "2 hrs" },
    ac: { bus: "No. 49 - AC", fare: "Rs. 650", duration: "1.5 hrs" },
    timing: { first: "5:30 AM", last: "7:00 PM", frequency: "Every 45 mins" },
    stops: ["Polonnaruwa", "Habarana", "Kekirawa", "Anuradhapura"],
    coords: [{ lat: 7.9403, lng: 81.0188 }, { lat: 8.3114, lng: 80.4037 }]
  },

  // ============ KEGALLE ROUTES ============
  "kegalle-kandy": {
    normal: { bus: "No. 96", fare: "Rs. 174", duration: "1 hr" },
    ac: { bus: "No. 96 - AC", fare: "Rs. 326", duration: "45 mins" },
    timing: { first: "5:30 AM", last: "9:00 PM", frequency: "Every 15 mins" },
    stops: ["Kegalle", "Mawanella", "Kandy"],
    coords: [{ lat: 7.2513, lng: 80.3464 }, { lat: 7.2906, lng: 80.6337 }]
  },
  "kegalle-ratnapura": {
    normal: { bus: "No. 98", fare: "Rs. 174", duration: "1 hr" },
    ac: { bus: "No. 98 - AC", fare: "Rs. 326", duration: "45 mins" },
    timing: { first: "6:00 AM", last: "8:00 PM", frequency: "Every 20 mins" },
    stops: ["Kegalle", "Avissawella", "Ratnapura"],
    coords: [{ lat: 7.2513, lng: 80.3464 }, { lat: 6.6828, lng: 80.3992 }]
  },

  // ============ MATALE ROUTES ============
  "matale-dambulla": {
    normal: { bus: "No. 6", fare: "Rs. 116", duration: "45 mins" },
    ac: { bus: "No. 6 - AC", fare: "Rs. 218", duration: "30 mins" },
    timing: { first: "5:30 AM", last: "9:00 PM", frequency: "Every 15 mins" },
    stops: ["Matale", "Sigiriya Junction", "Dambulla"],
    coords: [{ lat: 7.4675, lng: 80.6234 }, { lat: 7.8742, lng: 80.6511 }]
  },
};
function findRoute(from, to) {
  const key1 = `${from.toLowerCase()}-${to.toLowerCase()}`;
  const key2 = `${to.toLowerCase()}-${from.toLowerCase()}`;
  return busRoutes[key1] || busRoutes[key2] || null;
}

function App() {
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [result, setResult] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [chat, setChat] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [loading, setLoading] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [favorites, setFavorites] = useState(() => {
  const saved = localStorage.getItem('sl-bus-favorites');
  return saved ? JSON.parse(saved) : [];
});

  useEffect(() => {
    if (window.google && mapRef.current && !mapInstanceRef.current) {
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center: { lat: 7.8731, lng: 80.7718 },
        zoom: 7,
        styles: [
          { elementType: "geometry", stylers: [{ color: "#0a0a1a" }] },
          { elementType: "labels.text.fill", stylers: [{ color: "#38bdf8" }] },
          { elementType: "labels.text.stroke", stylers: [{ color: "#0a0a1a" }] },
          { featureType: "road", elementType: "geometry", stylers: [{ color: "#1e293b" }] },
          { featureType: "water", elementType: "geometry", stylers: [{ color: "#0f172a" }] },
        ],
      });
    }
  }, []);

  const handleSearch = () => {
  if (!from || !to) return;
  const route = findRoute(from, to);
  if (route) {
    setResult(route);
    setNotFound(false);
    if (mapInstanceRef.current && route.coords) {
      const bounds = new window.google.maps.LatLngBounds();
      route.coords.forEach(coord => {
        new window.google.maps.Marker({
          position: coord,
          map: mapInstanceRef.current,
          icon: { path: window.google.maps.SymbolPath.CIRCLE, scale: 8, fillColor: "#38bdf8", fillOpacity: 1, strokeColor: "#fff", strokeWeight: 2 }
        });
        bounds.extend(coord);
      });
      new window.google.maps.Polyline({
        path: route.coords,
        geodesic: true,
        strokeColor: "#38bdf8",
        strokeOpacity: 0.8,
        strokeWeight: 3,
        map: mapInstanceRef.current,
      });
      mapInstanceRef.current.fitBounds(bounds);
    }
  } else {
    setResult(null);
    setNotFound(true);
  }
};
const handleFromChange = (e) => {
  const val = e.target.value;
  setFrom(val);
  const suggestions = searchLocations(val);
  setFromSuggestions(suggestions);
  setShowFromSuggestions(true);
};

const handleToChange = (e) => {
  const val = e.target.value;
  setTo(val);
  const suggestions = searchLocations(val);
  setToSuggestions(suggestions);
  setShowToSuggestions(true);
};

const selectFrom = (location) => {
  setFrom(location.name);
  setShowFromSuggestions(false);
};

const selectTo = (location) => {
  setTo(location.name);
  setShowToSuggestions(false);
};
const toggleFavorite = () => {
  if (!from || !to) return;
  const key = `${from}-${to}`;
  const exists = favorites.find(f => f.key === key);
  let newFavorites;
  if (exists) {
    newFavorites = favorites.filter(f => f.key !== key);
  } else {
    newFavorites = [...favorites, { key, from, to }];
  }
  setFavorites(newFavorites);
  localStorage.setItem('sl-bus-favorites', JSON.stringify(newFavorites));
};

const isFavorite = () => {
  const key = `${from}-${to}`;
  return favorites.some(f => f.key === key);
};
  const handleSwap = () => {
    setFrom(to);
    setTo(from);
    setResult(null);
    setNotFound(false);
  };

  const handleChip = (chip) => {
    const [f, t] = chip.split(' → ');
    setFrom(f);
    setTo(t);
    setResult(null);
    setNotFound(false);
  };

  const handleChat = async () => {
  if (!chatInput.trim()) return;
  const userMsg = chatInput;
  setChatInput('');
  setChat(prev => [...prev, { role: 'user', text: userMsg }]);
  setLoading(true);

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: userMsg,
        history: chat.map(m => ({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: m.text
        }))
      })
    });

    const data = await response.json();
    setChat(prev => [...prev, { role: 'assistant', text: data.reply }]);
  } catch (error) {
    setChat(prev => [...prev, { role: 'assistant', text: 'Sorry, something went wrong. Please try again!' }]);
  }
  setLoading(false);
};

  return (
    <div className="app">
      <div className="header">
        <div className="logo">
          <div className="logo-icon">SL</div>
          <div className="logo-text">
            <h1>BusTracker</h1>
            <span>Sri Lanka 🇱🇰</span>
          </div>
        </div>
        <div className="badge">● Live</div>
      </div>

      <div className="hero">
        <h2>Where are you<br /><span>heading today?</span></h2>
        <p>Smart routes across all Sri Lanka</p>
      </div>

      <div className="search-card">
  {/* From Input */}
  <div className="input-wrapper">
    <div className="input-group">
      <span className="input-icon">📍</span>
      <input
        type="text"
        placeholder="From — Colombo, Kandy..."
        value={from}
        onChange={handleFromChange}
        onFocus={() => setShowFromSuggestions(true)}
        onBlur={() => setTimeout(() => setShowFromSuggestions(false), 200)}
      />
    </div>
    {showFromSuggestions && fromSuggestions.length > 0 && (
      <div className="suggestions-box">
        {fromSuggestions.map((loc, i) => (
          <div key={i} className="suggestion-item" onMouseDown={() => selectFrom(loc)}>
            <span className="suggestion-name">{loc.name}</span>
            <span className="suggestion-district">{loc.district}</span>
          </div>
        ))}
      </div>
    )}
  </div>

  {/* Swap */}
  <div className="divider">
    <div className="divider-line"></div>
    <div className="swap-btn" onClick={handleSwap}>⇅</div>
    <div className="divider-line"></div>
  </div>

  {/* To Input */}
  <div className="input-wrapper">
    <div className="input-group">
      <span className="input-icon">🏁</span>
      <input
        type="text"
        placeholder="To — Galle, Jaffna..."
        value={to}
        onChange={handleToChange}
        onFocus={() => setShowToSuggestions(true)}
        onBlur={() => setTimeout(() => setShowToSuggestions(false), 200)}
      />
    </div>
    {showToSuggestions && toSuggestions.length > 0 && (
      <div className="suggestions-box">
        {toSuggestions.map((loc, i) => (
          <div key={i} className="suggestion-item" onMouseDown={() => selectTo(loc)}>
            <span className="suggestion-name">{loc.name}</span>
            <span className="suggestion-district">{loc.district}</span>
          </div>
        ))}
      </div>
    )}
  </div>

 <div className="search-actions">
  <button className="search-btn" onClick={handleSearch}>Find My Bus →</button>
  <button className="fav-btn" onClick={toggleFavorite} title="Save to favorites">
    {isFavorite() ? '❤️' : '🤍'}
  </button>
</div>
</div>

      {result && (
  <div className="result-card">
    <p className="result-title">🚌 Available Buses</p>

    {/* Normal Bus */}
    <div className="bus-option normal-bus">
      <div className="bus-option-header">
        <span className="bus-type-badge normal-badge">🚌 Normal</span>
        <span className="bus-fare-tag">{result.normal.fare}</span>
      </div>
      <div className="bus-option-info">
        <span>📋 {result.normal.bus}</span>
        <span>⏱ {result.normal.duration}</span>
      </div>
    </div>

    {/* AC Bus */}
    <div className="bus-option ac-bus">
      <div className="bus-option-header">
        <span className="bus-type-badge ac-badge">❄️ AC Intercity</span>
        <span className="bus-fare-tag ac-fare">{result.ac.fare}</span>
      </div>
      <div className="bus-option-info">
        <span>📋 {result.ac.bus}</span>
        <span>⏱ {result.ac.duration}</span>
      </div>
    </div>

    {/* Timing */}
<div className="timing-box">
  <div className="timing-title">🕐 Bus Timings</div>
  <div className="timing-grid">
    <div className="timing-item">
      <span className="timing-label">First Bus</span>
      <span className="timing-value">{result.timing.first}</span>
    </div>
    <div className="timing-item">
      <span className="timing-label">Last Bus</span>
      <span className="timing-value">{result.timing.last}</span>
    </div>
    <div className="timing-item full">
      <span className="timing-label">Frequency</span>
      <span className="timing-value">{result.timing.frequency}</span>
    </div>
  </div>
</div>
{/* Alternative Buses */}
{result.alternativeBuses && result.alternativeBuses.length > 0 && (
  <div className="alt-buses">
    <div className="alt-buses-title">🚌 Other Buses on this Route</div>
    <div className="alt-buses-list">
      {result.alternativeBuses.map((bus, i) => (
        <div key={i} className="alt-bus-item">
          <span className="alt-bus-number">{bus.bus}</span>
          <span className="alt-bus-type">{bus.type}</span>
          <span className="alt-bus-fare">{bus.fare}</span>
        </div>
      ))}
    </div>
  </div>
)}

    {/* Stops */}
    <div className="stops-title">🗺️ Stops</div>
    <div className="stops">
      {result.stops.map((stop, i) => (
        <div className="stop" key={i}>
          <div className="stop-dot"></div>
          <span>{stop}</span>
        </div>
      ))}
    </div>
  </div>
)}

      {notFound && (
  <div className="not-found">
    <div className="not-found-icon">🔍</div>
    <p>Route not found in our database!</p>
    <p className="not-found-sub">👇 Ask our AI Assistant below — it knows ALL Sri Lanka bus routes!</p>
    <button className="ask-ai-btn" onClick={() => {
      document.querySelector('.chat-input-row input').focus();
      document.querySelector('.chat-input-row input').value = `${from} to ${to} bus route`;
      document.querySelector('.chat-input-row input').dispatchEvent(new Event('change', { bubbles: true }));
    }}>
      Ask AI Assistant →
    </button>
  </div>
)}

      {/* Map */}
      <div className="map-container" ref={mapRef}></div>
      {favorites.length > 0 && (
  <div className="quick-routes">
    <p className="quick-title">❤️ Your Favorites</p>
    <div className="chips">
      {favorites.map((fav, i) => (
        <div key={i} className="chip favorite-chip" onClick={() => {
          setFrom(fav.from);
          setTo(fav.to);
          setResult(null);
          setNotFound(false);
        }}>
          {fav.from} → {fav.to}
          <span className="remove-fav" onClick={(e) => {
            e.stopPropagation();
            const newFavorites = favorites.filter(f => f.key !== fav.key);
            setFavorites(newFavorites);
            localStorage.setItem('sl-bus-favorites', JSON.stringify(newFavorites));
          }}>✕</span>
        </div>
      ))}
    </div>
  </div>
)}

      <div className="quick-routes">
        <p className="quick-title">Popular Routes</p>
        <div className="chips">
          {["Colombo → Kandy", "Colombo → Galle", "Colombo → Jaffna", "Colombo → Negombo", "Colombo → Trincomalee", "Colombo → Badulla", "Colombo → Hambantota", "Colombo → Batticaloa"].map((chip, i) => (
            <div className="chip" key={i} onClick={() => handleChip(chip)}>{chip}</div>
          ))}
        </div>
      </div>

      <div className="chat-section">
        <p className="quick-title">🤖 AI Assistant</p>
        <div className="chat-box">
          {chat.length === 0 && <p className="chat-placeholder">Ask me anything about Sri Lanka buses! 🇱🇰</p>}
          {chat.map((msg, i) => (
            <div key={i} className={`chat-msg ${msg.role}`}>
              <p>{msg.text}</p>
            </div>
          ))}
          {loading && <div className="chat-msg assistant"><p>Typing...</p></div>}
        </div>
        <div className="chat-input-row">
          <input type="text" placeholder="Ask about any route..." value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleChat()} />
          <button onClick={handleChat}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;