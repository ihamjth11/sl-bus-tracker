import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const busRoutes = {
  // Kandy based routes
  "kandy-anuradhapura": {
    normal: { bus: "No. 43 - Normal", fare: "Rs. 636", duration: "3.5 hrs" },
    ac: { bus: "No. 43 - AC", fare: "Rs. 850", duration: "3 hrs" },
    timing: { first: "6:00 AM", last: "7:00 PM", frequency: "Every 1 hour" },
    stops: ["Kandy", "Dambulla", "Kekirawa", "Anuradhapura"],
    coords: [{lat: 7.2906, lng: 80.6337}, {lat: 8.3114, lng: 80.4037}]
  },
  "kandy-nuwara eliya": {
    normal: { bus: "No. 98 - Normal", fare: "Rs. 213", duration: "2 hrs" },
    ac: { bus: "No. 98 - AC", fare: "Rs. 400", duration: "1.5 hrs" },
    timing: { first: "6:00 AM", last: "8:00 PM", frequency: "Every 30 mins" },
    stops: ["Kandy", "Gampola", "Nuwara Eliya"],
    coords: [{lat: 7.2906, lng: 80.6337}, {lat: 6.9497, lng: 80.7891}]
  },
  "kandy-badulla": {
    normal: { bus: "No. 98/1 - Normal", fare: "Rs. 425", duration: "3.5 hrs" },
    ac: { bus: "No. 98/1 - AC", fare: "Rs. 795", duration: "3 hrs" },
    timing: { first: "6:00 AM", last: "7:00 PM", frequency: "Every 45 mins" },
    stops: ["Kandy", "Nuwara Eliya", "Welimada", "Badulla"],
    coords: [{lat: 7.2906, lng: 80.6337}, {lat: 6.9934, lng: 81.0550}]
  },
  "kandy-polonnaruwa": {
    normal: { bus: "No. 48 - Normal", fare: "Rs. 380", duration: "3 hrs" },
    ac: { bus: "No. 48 - AC", fare: "Rs. 710", duration: "2.5 hrs" },
    timing: { first: "5:30 AM", last: "7:30 PM", frequency: "Every 45 mins" },
    stops: ["Kandy", "Matale", "Dambulla", "Polonnaruwa"],
    coords: [{lat: 7.2906, lng: 80.6337}, {lat: 7.9403, lng: 81.0188}]
  },
  "kandy-trincomalee": {
    normal: { bus: "No. 49 - Normal", fare: "Rs. 580", duration: "4 hrs" },
    ac: { bus: "No. 49 - AC", fare: "Rs. 1,090", duration: "3.5 hrs" },
    timing: { first: "6:00 AM", last: "6:00 PM", frequency: "Every 1 hour" },
    stops: ["Kandy", "Dambulla", "Habarana", "Trincomalee"],
    coords: [{lat: 7.2906, lng: 80.6337}, {lat: 8.5874, lng: 81.2152}]
  },
  "kandy-matara": {
    normal: { bus: "No. 2 - Normal", fare: "Rs. 520", duration: "4 hrs" },
    ac: { bus: "No. 2 - AC", fare: "Rs. 975", duration: "3.5 hrs" },
    timing: { first: "5:30 AM", last: "7:00 PM", frequency: "Every 1 hour" },
    stops: ["Kandy", "Colombo", "Galle", "Matara"],
    coords: [{lat: 7.2906, lng: 80.6337}, {lat: 5.9549, lng: 80.5550}]
  },

  // Anuradhapura based routes
  "anuradhapura-nochchiyagama": {
    normal: { bus: "No. 57 - Normal", fare: "Rs. 98", duration: "45 mins" },
    ac: { bus: "No. 57 - AC", fare: "Rs. 185", duration: "35 mins" },
    timing: { first: "5:30 AM", last: "8:00 PM", frequency: "Every 20 mins" },
    stops: ["Anuradhapura", "Thalawa", "Nochchiyagama"],
    coords: [{lat: 8.3114, lng: 80.4037}, {lat: 8.2833, lng: 80.2167}]
  },
  "anuradhapura-jaffna": {
    normal: { bus: "No. 15 - Normal", fare: "Rs. 873", duration: "3.5 hrs" },
    ac: { bus: "No. 15 - AC", fare: "Rs. 1,635", duration: "3 hrs" },
    timing: { first: "6:00 AM", last: "7:00 PM", frequency: "Every 1 hour" },
    stops: ["Anuradhapura", "Vavuniya", "Kilinochchi", "Jaffna"],
    coords: [{lat: 8.3114, lng: 80.4037}, {lat: 9.6615, lng: 80.0255}]
  },
  "anuradhapura-trincomalee": {
    normal: { bus: "No. 49 - Normal", fare: "Rs. 425", duration: "2.5 hrs" },
    ac: { bus: "No. 49 - AC", fare: "Rs. 795", duration: "2 hrs" },
    timing: { first: "6:00 AM", last: "6:30 PM", frequency: "Every 1 hour" },
    stops: ["Anuradhapura", "Kekirawa", "Habarana", "Trincomalee"],
    coords: [{lat: 8.3114, lng: 80.4037}, {lat: 8.5874, lng: 81.2152}]
  },
  "anuradhapura-kurunegala": {
    normal: { bus: "No. 6 - Normal", fare: "Rs. 318", duration: "2 hrs" },
    ac: { bus: "No. 6 - AC", fare: "Rs. 595", duration: "1.5 hrs" },
    timing: { first: "5:30 AM", last: "8:00 PM", frequency: "Every 30 mins" },
    stops: ["Anuradhapura", "Kekirawa", "Kurunegala"],
    coords: [{lat: 8.3114, lng: 80.4037}, {lat: 7.4818, lng: 80.3609}]
  },

  // Jaffna based routes
  "jaffna-vavuniya": {
    normal: { bus: "No. 15 - Normal", fare: "Rs. 495", duration: "2.5 hrs" },
    ac: { bus: "No. 15 - AC", fare: "Rs. 928", duration: "2 hrs" },
    timing: { first: "5:30 AM", last: "7:00 PM", frequency: "Every 30 mins" },
    stops: ["Jaffna", "Kilinochchi", "Vavuniya"],
    coords: [{lat: 9.6615, lng: 80.0255}, {lat: 8.7514, lng: 80.4971}]
  },
  "jaffna-trincomalee": {
    normal: { bus: "No. 78 - Normal", fare: "Rs. 680", duration: "4 hrs" },
    ac: { bus: "No. 78 - AC", fare: "Rs. 1,275", duration: "3.5 hrs" },
    timing: { first: "6:00 AM", last: "5:00 PM", frequency: "Every 2 hours" },
    stops: ["Jaffna", "Mullaitivu", "Trincomalee"],
    coords: [{lat: 9.6615, lng: 80.0255}, {lat: 8.5874, lng: 81.2152}]
  },
  "jaffna-mannar": {
    normal: { bus: "No. 87 - Normal", fare: "Rs. 380", duration: "2.5 hrs" },
    ac: { bus: "No. 87 - AC", fare: "Rs. 712", duration: "2 hrs" },
    timing: { first: "6:00 AM", last: "5:30 PM", frequency: "Every 1 hour" },
    stops: ["Jaffna", "Paranthan", "Mannar"],
    coords: [{lat: 9.6615, lng: 80.0255}, {lat: 8.9810, lng: 79.9044}]
  },

  // Galle based routes
  "galle-matara": {
    normal: { bus: "No. 32 - Normal", fare: "Rs. 185", duration: "1 hr" },
    ac: { bus: "No. 32 - AC", fare: "Rs. 347", duration: "45 mins" },
    timing: { first: "5:00 AM", last: "10:00 PM", frequency: "Every 10 mins" },
    stops: ["Galle", "Unawatuna", "Weligama", "Matara"],
    coords: [{lat: 6.0535, lng: 80.2210}, {lat: 5.9549, lng: 80.5550}]
  },
  "galle-hambantota": {
    normal: { bus: "No. 32/1 - Normal", fare: "Rs. 380", duration: "2 hrs" },
    ac: { bus: "No. 32/1 - AC", fare: "Rs. 712", duration: "1.5 hrs" },
    timing: { first: "5:30 AM", last: "8:00 PM", frequency: "Every 30 mins" },
    stops: ["Galle", "Matara", "Tangalle", "Hambantota"],
    coords: [{lat: 6.0535, lng: 80.2210}, {lat: 6.1429, lng: 81.1212}]
  },
  "galle-ratnapura": {
    normal: { bus: "No. 32/3 - Normal", fare: "Rs. 320", duration: "2.5 hrs" },
    ac: { bus: "No. 32/3 - AC", fare: "Rs. 600", duration: "2 hrs" },
    timing: { first: "6:00 AM", last: "7:00 PM", frequency: "Every 1 hour" },
    stops: ["Galle", "Elpitiya", "Ratnapura"],
    coords: [{lat: 6.0535, lng: 80.2210}, {lat: 6.6828, lng: 80.3992}]
  },

  // Matara based routes
  "matara-hambantota": {
    normal: { bus: "No. 32/1 - Normal", fare: "Rs. 265", duration: "1.5 hrs" },
    ac: { bus: "No. 32/1 - AC", fare: "Rs. 497", duration: "1 hr" },
    timing: { first: "5:30 AM", last: "8:30 PM", frequency: "Every 20 mins" },
    stops: ["Matara", "Tangalle", "Hambantota"],
    coords: [{lat: 5.9549, lng: 80.5550}, {lat: 6.1429, lng: 81.1212}]
  },
  "matara-badulla": {
    normal: { bus: "No. 99 - Normal", fare: "Rs. 540", duration: "4 hrs" },
    ac: { bus: "No. 99 - AC", fare: "Rs. 1,012", duration: "3.5 hrs" },
    timing: { first: "6:00 AM", last: "6:00 PM", frequency: "Every 2 hours" },
    stops: ["Matara", "Wellawaya", "Badulla"],
    coords: [{lat: 5.9549, lng: 80.5550}, {lat: 6.9934, lng: 81.0550}]
  },

  // Trincomalee based routes
  "trincomalee-batticaloa": {
    normal: { bus: "No. 48 - Normal", fare: "Rs. 380", duration: "2.5 hrs" },
    ac: { bus: "No. 48 - AC", fare: "Rs. 712", duration: "2 hrs" },
    timing: { first: "6:00 AM", last: "6:00 PM", frequency: "Every 1 hour" },
    stops: ["Trincomalee", "Muttur", "Batticaloa"],
    coords: [{lat: 8.5874, lng: 81.2152}, {lat: 7.7310, lng: 81.6747}]
  },
  "trincomalee-polonnaruwa": {
    normal: { bus: "No. 49 - Normal", fare: "Rs. 285", duration: "2 hrs" },
    ac: { bus: "No. 49 - AC", fare: "Rs. 534", duration: "1.5 hrs" },
    timing: { first: "6:00 AM", last: "6:30 PM", frequency: "Every 1 hour" },
    stops: ["Trincomalee", "Kantale", "Polonnaruwa"],
    coords: [{lat: 8.5874, lng: 81.2152}, {lat: 7.9403, lng: 81.0188}]
  },

  // Batticaloa based routes
  "batticaloa-ampara": {
    normal: { bus: "No. 68 - Normal", fare: "Rs. 185", duration: "1.5 hrs" },
    ac: { bus: "No. 68 - AC", fare: "Rs. 347", duration: "1 hr" },
    timing: { first: "5:30 AM", last: "7:00 PM", frequency: "Every 30 mins" },
    stops: ["Batticaloa", "Kalmunai", "Ampara"],
    coords: [{lat: 7.7310, lng: 81.6747}, {lat: 7.2811, lng: 81.6747}]
  },

  // Kurunegala based routes
  "kurunegala-puttalam": {
    normal: { bus: "No. 7 - Normal", fare: "Rs. 212", duration: "1.5 hrs" },
    ac: { bus: "No. 7 - AC", fare: "Rs. 397", duration: "1 hr" },
    timing: { first: "5:30 AM", last: "8:30 PM", frequency: "Every 20 mins" },
    stops: ["Kurunegala", "Wariyapola", "Puttalam"],
    coords: [{lat: 7.4818, lng: 80.3609}, {lat: 8.0408, lng: 79.8394}]
  },
  "kurunegala-kandy": {
    normal: { bus: "No. 1 - Normal", fare: "Rs. 212", duration: "1.5 hrs" },
    ac: { bus: "No. 1 - AC", fare: "Rs. 397", duration: "1 hr" },
    timing: { first: "5:30 AM", last: "9:00 PM", frequency: "Every 20 mins" },
    stops: ["Kurunegala", "Alawwa", "Kandy"],
    coords: [{lat: 7.4818, lng: 80.3609}, {lat: 7.2906, lng: 80.6337}]
  },

  // Ratnapura based routes
  "ratnapura-badulla": {
    normal: { bus: "No. 98 - Normal", fare: "Rs. 380", duration: "3 hrs" },
    ac: { bus: "No. 98 - AC", fare: "Rs. 712", duration: "2.5 hrs" },
    timing: { first: "6:00 AM", last: "6:00 PM", frequency: "Every 1 hour" },
    stops: ["Ratnapura", "Pelmadulla", "Wellawaya", "Badulla"],
    coords: [{lat: 6.6828, lng: 80.3992}, {lat: 6.9934, lng: 81.0550}]
  },
  "ratnapura-galle": {
    normal: { bus: "No. 32/3 - Normal", fare: "Rs. 320", duration: "2.5 hrs" },
    ac: { bus: "No. 32/3 - AC", fare: "Rs. 600", duration: "2 hrs" },
    timing: { first: "6:00 AM", last: "6:30 PM", frequency: "Every 1 hour" },
    stops: ["Ratnapura", "Elpitiya", "Galle"],
    coords: [{lat: 6.6828, lng: 80.3992}, {lat: 6.0535, lng: 80.2210}]
  },

  // Badulla based routes
  "badulla-nuwara eliya": {
    normal: { bus: "No. 98 - Normal", fare: "Rs. 212", duration: "2 hrs" },
    ac: { bus: "No. 98 - AC", fare: "Rs. 397", duration: "1.5 hrs" },
    timing: { first: "6:00 AM", last: "6:00 PM", frequency: "Every 45 mins" },
    stops: ["Badulla", "Welimada", "Nuwara Eliya"],
    coords: [{lat: 6.9934, lng: 81.0550}, {lat: 6.9497, lng: 80.7891}]
  },
  "badulla-monaragala": {
    normal: { bus: "No. 99 - Normal", fare: "Rs. 185", duration: "1.5 hrs" },
    ac: { bus: "No. 99 - AC", fare: "Rs. 347", duration: "1 hr" },
    timing: { first: "6:00 AM", last: "6:30 PM", frequency: "Every 1 hour" },
    stops: ["Badulla", "Wellawaya", "Monaragala"],
    coords: [{lat: 6.9934, lng: 81.0550}, {lat: 6.8728, lng: 81.3507}]
  },

  // Hambantota based routes
  "hambantota-matara": {
    normal: { bus: "No. 32/1 - Normal", fare: "Rs. 265", duration: "1.5 hrs" },
    ac: { bus: "No. 32/1 - AC", fare: "Rs. 497", duration: "1 hr" },
    timing: { first: "5:00 AM", last: "9:00 PM", frequency: "Every 20 mins" },
    stops: ["Hambantota", "Tangalle", "Matara"],
    coords: [{lat: 6.1429, lng: 81.1212}, {lat: 5.9549, lng: 80.5550}]
  },
  "hambantota-monaragala": {
    normal: { bus: "No. 99 - Normal", fare: "Rs. 318", duration: "2.5 hrs" },
    ac: { bus: "No. 99 - AC", fare: "Rs. 596", duration: "2 hrs" },
    timing: { first: "6:00 AM", last: "6:00 PM", frequency: "Every 1 hour" },
    stops: ["Hambantota", "Tissamaharama", "Monaragala"],
    coords: [{lat: 6.1429, lng: 81.1212}, {lat: 6.8728, lng: 81.3507}]
  },

  // Nuwara Eliya based routes
  "nuwara eliya-badulla": {
    normal: { bus: "No. 98 - Normal", fare: "Rs. 212", duration: "2 hrs" },
    ac: { bus: "No. 98 - AC", fare: "Rs. 397", duration: "1.5 hrs" },
    timing: { first: "6:00 AM", last: "6:00 PM", frequency: "Every 45 mins" },
    stops: ["Nuwara Eliya", "Welimada", "Badulla"],
    coords: [{lat: 6.9497, lng: 80.7891}, {lat: 6.9934, lng: 81.0550}]
  },
  "nuwara eliya-kandy": {
    normal: { bus: "No. 98 - Normal", fare: "Rs. 213", duration: "2 hrs" },
    ac: { bus: "No. 98 - AC", fare: "Rs. 400", duration: "1.5 hrs" },
    timing: { first: "6:00 AM", last: "7:00 PM", frequency: "Every 30 mins" },
    stops: ["Nuwara Eliya", "Gampola", "Kandy"],
    coords: [{lat: 6.9497, lng: 80.7891}, {lat: 7.2906, lng: 80.6337}]
  },

  // Polonnaruwa based routes
  "polonnaruwa-batticaloa": {
    normal: { bus: "No. 48 - Normal", fare: "Rs. 380", duration: "2.5 hrs" },
    ac: { bus: "No. 48 - AC", fare: "Rs. 712", duration: "2 hrs" },
    timing: { first: "6:00 AM", last: "6:00 PM", frequency: "Every 1 hour" },
    stops: ["Polonnaruwa", "Valaichchenai", "Batticaloa"],
    coords: [{lat: 7.9403, lng: 81.0188}, {lat: 7.7310, lng: 81.6747}]
  },
  "polonnaruwa-anuradhapura": {
    normal: { bus: "No. 15 - Normal", fare: "Rs. 318", duration: "2 hrs" },
    ac: { bus: "No. 49 - AC", fare: "Rs. 596", duration: "1.5 hrs" },
    timing: { first: "5:30 AM", last: "7:00 PM", frequency: "Every 45 mins" },
    stops: ["Polonnaruwa", "Habarana", "Kekirawa", "Anuradhapura"],
    coords: [{lat: 7.9403, lng: 81.0188}, {lat: 8.3114, lng: 80.4037}]
  },

  // Vavuniya based routes
  "vavuniya-jaffna": {
    normal: { bus: "No. 15 - Normal", fare: "Rs. 495", duration: "2 hrs" },
    ac: { bus: "No. 15 - AC", fare: "Rs. 928", duration: "1.5 hrs" },
    timing: { first: "5:30 AM", last: "7:30 PM", frequency: "Every 30 mins" },
    stops: ["Vavuniya", "Kilinochchi", "Jaffna"],
    coords: [{lat: 8.7514, lng: 80.4971}, {lat: 9.6615, lng: 80.0255}]
  },
  "vavuniya-anuradhapura": {
    normal: { bus: "No. 15 - Normal", fare: "Rs. 265", duration: "1.5 hrs" },
    ac: { bus: "No. 15 - AC", fare: "Rs. 497", duration: "1 hr" },
    timing: { first: "5:30 AM", last: "8:00 PM", frequency: "Every 30 mins" },
    stops: ["Vavuniya", "Anuradhapura"],
    coords: [{lat: 8.7514, lng: 80.4971}, {lat: 8.3114, lng: 80.4037}]
  },

  // Mannar based routes
  "mannar-anuradhapura": {
    normal: { bus: "No. 87 - Normal", fare: "Rs. 380", duration: "2.5 hrs" },
    ac: { bus: "No. 87 - AC", fare: "Rs. 712", duration: "2 hrs" },
    timing: { first: "6:00 AM", last: "5:30 PM", frequency: "Every 1 hour" },
    stops: ["Mannar", "Medawachchiya", "Anuradhapura"],
    coords: [{lat: 8.9810, lng: 79.9044}, {lat: 8.3114, lng: 80.4037}]
  },

  // Puttalam based routes
  "puttalam-kurunegala": {
    normal: { bus: "No. 7 - Normal", fare: "Rs. 212", duration: "1.5 hrs" },
    ac: { bus: "No. 7 - AC", fare: "Rs. 397", duration: "1 hr" },
    timing: { first: "5:30 AM", last: "8:30 PM", frequency: "Every 20 mins" },
    stops: ["Puttalam", "Wariyapola", "Kurunegala"],
    coords: [{lat: 8.0408, lng: 79.8394}, {lat: 7.4818, lng: 80.3609}]
  },
  "puttalam-negombo": {
    normal: { bus: "No. 4 - Normal", fare: "Rs. 265", duration: "2 hrs" },
    ac: { bus: "No. 4 - AC", fare: "Rs. 497", duration: "1.5 hrs" },
    timing: { first: "5:30 AM", last: "8:00 PM", frequency: "Every 30 mins" },
    stops: ["Puttalam", "Chilaw", "Negombo"],
    coords: [{lat: 8.0408, lng: 79.8394}, {lat: 7.2097, lng: 79.8350}]
  },

  // Kegalle based routes
  "kegalle-kandy": {
    normal: { bus: "No. 96 - Normal", fare: "Rs. 159", duration: "1 hr" },
    ac: { bus: "No. 96 - AC", fare: "Rs. 298", duration: "45 mins" },
    timing: { first: "5:30 AM", last: "9:00 PM", frequency: "Every 15 mins" },
    stops: ["Kegalle", "Mawanella", "Kandy"],
    coords: [{lat: 7.2513, lng: 80.3464}, {lat: 7.2906, lng: 80.6337}]
  },
  "kegalle-ratnapura": {
    normal: { bus: "No. 98 - Normal", fare: "Rs. 159", duration: "1 hr" },
    ac: { bus: "No. 98 - AC", fare: "Rs. 298", duration: "45 mins" },
    timing: { first: "6:00 AM", last: "8:00 PM", frequency: "Every 20 mins" },
    stops: ["Kegalle", "Avissawella", "Ratnapura"],
    coords: [{lat: 7.2513, lng: 80.3464}, {lat: 6.6828, lng: 80.3992}]
  },

  // Matale based routes
  "matale-dambulla": {
    normal: { bus: "No. 6 - Normal", fare: "Rs. 106", duration: "45 mins" },
    ac: { bus: "No. 6 - AC", fare: "Rs. 199", duration: "30 mins" },
    timing: { first: "5:30 AM", last: "9:00 PM", frequency: "Every 15 mins" },
    stops: ["Matale", "Sigiriya Junction", "Dambulla"],
    coords: [{lat: 7.4675, lng: 80.6234}, {lat: 7.8742, lng: 80.6511}]
  },
  "matale-kandy": {
    normal: { bus: "No. 8 - Normal", fare: "Rs. 106", duration: "45 mins" },
    ac: { bus: "No. 8 - AC", fare: "Rs. 199", duration: "30 mins" },
    timing: { first: "5:00 AM", last: "9:30 PM", frequency: "Every 10 mins" },
    stops: ["Matale", "Kandy"],
    coords: [{lat: 7.4675, lng: 80.6234}, {lat: 7.2906, lng: 80.6337}]
  },

  // Ampara based routes
  "ampara-batticaloa": {
    normal: { bus: "No. 68 - Normal", fare: "Rs. 185", duration: "1.5 hrs" },
    ac: { bus: "No. 68 - AC", fare: "Rs. 347", duration: "1 hr" },
    timing: { first: "5:30 AM", last: "7:00 PM", frequency: "Every 30 mins" },
    stops: ["Ampara", "Kalmunai", "Batticaloa"],
    coords: [{lat: 7.2811, lng: 81.6747}, {lat: 7.7310, lng: 81.6747}]
  },
  "ampara-monaragala": {
    normal: { bus: "No. 99 - Normal", fare: "Rs. 265", duration: "2 hrs" },
    ac: { bus: "No. 99 - AC", fare: "Rs. 497", duration: "1.5 hrs" },
    timing: { first: "6:00 AM", last: "5:30 PM", frequency: "Every 1 hour" },
    stops: ["Ampara", "Monaragala"],
    coords: [{lat: 7.2811, lng: 81.6747}, {lat: 6.8728, lng: 81.3507}]
  },

  // Monaragala based routes
  "monaragala-badulla": {
    normal: { bus: "No. 99 - Normal", fare: "Rs. 185", duration: "1.5 hrs" },
    ac: { bus: "No. 99 - AC", fare: "Rs. 347", duration: "1 hr" },
    timing: { first: "6:00 AM", last: "6:30 PM", frequency: "Every 1 hour" },
    stops: ["Monaragala", "Wellawaya", "Badulla"],
    coords: [{lat: 6.8728, lng: 81.3507}, {lat: 6.9934, lng: 81.0550}]
  },
  "monaragala-hambantota": {
    normal: { bus: "No. 99 - Normal", fare: "Rs. 318", duration: "2.5 hrs" },
    ac: { bus: "No. 99 - AC", fare: "Rs. 596", duration: "2 hrs" },
    timing: { first: "6:00 AM", last: "5:30 PM", frequency: "Every 1 hour" },
    stops: ["Monaragala", "Tissamaharama", "Hambantota"],
    coords: [{lat: 6.8728, lng: 81.3507}, {lat: 6.1429, lng: 81.1212}]
  },

  // Kilinochchi based routes
  "kilinochchi-jaffna": {
    normal: { bus: "No. 15 - Normal", fare: "Rs. 265", duration: "1.5 hrs" },
    ac: { bus: "No. 15 - AC", fare: "Rs. 497", duration: "1 hr" },
    timing: { first: "5:30 AM", last: "7:30 PM", frequency: "Every 30 mins" },
    stops: ["Kilinochchi", "Elephant Pass", "Jaffna"],
    coords: [{lat: 9.3803, lng: 80.3770}, {lat: 9.6615, lng: 80.0255}]
  },
  "kilinochchi-vavuniya": {
    normal: { bus: "No. 15 - Normal", fare: "Rs. 212", duration: "1 hr" },
    ac: { bus: "No. 15 - AC", fare: "Rs. 397", duration: "45 mins" },
    timing: { first: "5:30 AM", last: "7:30 PM", frequency: "Every 30 mins" },
    stops: ["Kilinochchi", "Vavuniya"],
    coords: [{lat: 9.3803, lng: 80.3770}, {lat: 8.7514, lng: 80.4971}]
  },

  // Mullaitivu based routes
  "mullaitivu-vavuniya": {
    normal: { bus: "No. 15/1 - Normal", fare: "Rs. 318", duration: "2 hrs" },
    ac: { bus: "No. 15/1 - AC", fare: "Rs. 596", duration: "1.5 hrs" },
    timing: { first: "6:00 AM", last: "5:00 PM", frequency: "Every 2 hours" },
    stops: ["Mullaitivu", "Mankulam", "Vavuniya"],
    coords: [{lat: 9.2671, lng: 80.8128}, {lat: 8.7514, lng: 80.4971}]
  },
  "mullaitivu-trincomalee": {
    normal: { bus: "No. 78 - Normal", fare: "Rs. 318", duration: "2.5 hrs" },
    ac: { bus: "No. 78 - AC", fare: "Rs. 596", duration: "2 hrs" },
    timing: { first: "6:00 AM", last: "4:00 PM", frequency: "Every 2 hours" },
    stops: ["Mullaitivu", "Trincomalee"],
    coords: [{lat: 9.2671, lng: 80.8128}, {lat: 8.5874, lng: 81.2152}]
  },

  // Gampaha based routes
  "gampaha-negombo": {
    normal: { bus: "No. 4 - Normal", fare: "Rs. 80", duration: "45 mins" },
    ac: { bus: "No. 4 - AC", fare: "Rs. 150", duration: "30 mins" },
    timing: { first: "5:00 AM", last: "10:00 PM", frequency: "Every 10 mins" },
    stops: ["Gampaha", "Ja-Ela", "Negombo"],
    coords: [{lat: 7.0873, lng: 80.0144}, {lat: 7.2097, lng: 79.8350}]
  },
  "gampaha-kandy": {
    normal: { bus: "No. 1 - Normal", fare: "Rs. 318", duration: "2 hrs" },
    ac: { bus: "No. 1 - AC", fare: "Rs. 596", duration: "1.5 hrs" },
    timing: { first: "5:30 AM", last: "9:00 PM", frequency: "Every 20 mins" },
    stops: ["Gampaha", "Kadawatha", "Nittambuwa", "Kandy"],
    coords: [{lat: 7.0873, lng: 80.0144}, {lat: 7.2906, lng: 80.6337}]
  },

  // Kalutara based routes
  "kalutara-galle": {
    normal: { bus: "No. 2 - Normal", fare: "Rs. 265", duration: "1.5 hrs" },
    ac: { bus: "No. 2 - AC", fare: "Rs. 497", duration: "1 hr" },
    timing: { first: "5:00 AM", last: "9:30 PM", frequency: "Every 15 mins" },
    stops: ["Kalutara", "Aluthgama", "Bentota", "Galle"],
    coords: [{lat: 6.5854, lng: 79.9607}, {lat: 6.0535, lng: 80.2210}]
  },
  "kalutara-ratnapura": {
    normal: { bus: "No. 98 - Normal", fare: "Rs. 212", duration: "1.5 hrs" },
    ac: { bus: "No. 98 - AC", fare: "Rs. 397", duration: "1 hr" },
    timing: { first: "6:00 AM", last: "7:30 PM", frequency: "Every 30 mins" },
    stops: ["Kalutara", "Horana", "Ratnapura"],
    coords: [{lat: 6.5854, lng: 79.9607}, {lat: 6.6828, lng: 80.3992}]
  },
  "colombo-kandy": {
    normal: { bus: "No. 1 - Normal", fare: "Rs. 458", duration: "3 hrs" },
    ac: { bus: "No. 1 - AC Luxury", fare: "Rs. 830", duration: "2.5 hrs" },
    timing: { first: "5:30 AM", last: "9:00 PM", frequency: "Every 15 mins" },
    stops: ["Colombo Fort", "Kelaniya", "Kadawatha", "Nittambuwa", "Kandy"],
    coords: [{lat: 6.9271, lng: 79.8612}, {lat: 7.2906, lng: 80.6337}]
  },
  "colombo-galle": {
    normal: { bus: "No. 2-1 - Normal", fare: "Rs. 532", duration: "2.5 hrs" },
    ac: { bus: "No. 2-1 - AC Luxury", fare: "Rs. 800", duration: "2 hrs" },
    timing: { first: "5:00 AM", last: "10:00 PM", frequency: "Every 20 mins" },
    stops: ["Colombo Fort", "Moratuwa", "Panadura", "Kalutara", "Galle"],
    coords: [{lat: 6.9271, lng: 79.8612}, {lat: 6.0535, lng: 80.2210}]
  },
  "colombo-jaffna": {
    normal: { bus: "No. 15/87 - Normal", fare: "Rs. 1,967", duration: "8 hrs" },
    ac: { bus: "No. 15/87 - AC Luxury", fare: "Rs. 2,620", duration: "7 hrs" },
    timing: { first: "6:00 AM", last: "8:00 PM", frequency: "Every 1 hour" },
    stops: ["Colombo Fort", "Kurunegala", "Anuradhapura", "Vavuniya", "Jaffna"],
    coords: [{lat: 6.9271, lng: 79.8612}, {lat: 9.6615, lng: 80.0255}]
  },
  "colombo-negombo": {
    normal: { bus: "No. 4 - Normal", fare: "Rs. 301", duration: "1.5 hrs" },
    ac: { bus: "No. 4 - AC Luxury", fare: "Rs. 652", duration: "1 hr" },
    timing: { first: "5:00 AM", last: "10:30 PM", frequency: "Every 10 mins" },
    stops: ["Colombo Fort", "Wattala", "Ja-Ela", "Negombo"],
    coords: [{lat: 6.9271, lng: 79.8612}, {lat: 7.2097, lng: 79.8350}]
  },
  "colombo-matara": {
    normal: { bus: "No. 2 - Normal", fare: "Rs. 797", duration: "3.5 hrs" },
    ac: { bus: "No. 2 - AC Luxury", fare: "Rs. 1,060", duration: "3 hrs" },
    timing: { first: "5:00 AM", last: "9:30 PM", frequency: "Every 20 mins" },
    stops: ["Colombo Fort", "Moratuwa", "Kalutara", "Galle", "Matara"],
    coords: [{lat: 6.9271, lng: 79.8612}, {lat: 5.9549, lng: 80.5550}]
  },
  "colombo-anuradhapura": {
    normal: { bus: "No. 15-1-1 - Normal", fare: "Rs. 1,094", duration: "5 hrs" },
    ac: { bus: "No. 15-1-1 - AC Luxury", fare: "Rs. 1,460", duration: "4 hrs" },
    timing: { first: "6:00 AM", last: "8:00 PM", frequency: "Every 30 mins" },
    stops: ["Colombo Fort", "Kurunegala", "Dambulla", "Anuradhapura"],
    coords: [{lat: 6.9271, lng: 79.8612}, {lat: 8.3114, lng: 80.4037}]
  },
  "colombo-trincomalee": {
    normal: { bus: "No. 49 - Normal", fare: "Rs. 1,275", duration: "7 hrs" },
    ac: { bus: "No. 49 - AC", fare: "Rs. 2,550", duration: "6 hrs" },
    timing: { first: "6:30 AM", last: "7:00 PM", frequency: "Every 1 hour" },
    stops: ["Colombo Fort", "Kurunegala", "Anuradhapura", "Trincomalee"],
    coords: [{lat: 6.9271, lng: 79.8612}, {lat: 8.5874, lng: 81.2152}]
  },
  "colombo-batticaloa": {
    normal: { bus: "No. 48-1 - Normal", fare: "Rs. 1,524", duration: "7.5 hrs" },
    ac: { bus: "No. 48-1 - AC Super Luxury", fare: "Rs. 3,050", duration: "6.5 hrs" },
    timing: { first: "6:00 AM", last: "7:30 PM", frequency: "Every 1 hour" },
    stops: ["Colombo Fort", "Kandy", "Polonnaruwa", "Batticaloa"],
    coords: [{lat: 6.9271, lng: 79.8612}, {lat: 7.7310, lng: 81.6747}]
  },
  "colombo-hambantota": {
    normal: { bus: "No. 32-1 - Normal", fare: "Rs. 1,184", duration: "5 hrs" },
    ac: { bus: "No. 32-1 - AC", fare: "Rs. 2,180", duration: "4 hrs" },
    timing: { first: "5:30 AM", last: "8:30 PM", frequency: "Every 30 mins" },
    stops: ["Colombo Fort", "Galle", "Matara", "Hambantota"],
    coords: [{lat: 6.9271, lng: 79.8612}, {lat: 6.1429, lng: 81.1212}]
  },
  "colombo-badulla": {
    normal: { bus: "No. 21-6 - Normal", fare: "Rs. 1,250", duration: "6 hrs" },
    ac: { bus: "No. 21-6 - AC Luxury", fare: "Rs. 1,690", duration: "5 hrs" },
    timing: { first: "6:00 AM", last: "7:00 PM", frequency: "Every 45 mins" },
    stops: ["Colombo Fort", "Ratnapura", "Welimada", "Badulla"],
    coords: [{lat: 6.9271, lng: 79.8612}, {lat: 6.9934, lng: 81.0550}]
  },
  "colombo-nuwara eliya": {
    normal: { bus: "No. 2-10 - Normal", fare: "Rs. 971", duration: "5 hrs" },
    ac: { bus: "No. 2-10 - AC Luxury", fare: "Rs. 1,295", duration: "4 hrs" },
    timing: { first: "6:00 AM", last: "7:30 PM", frequency: "Every 30 mins" },
    stops: ["Colombo Fort", "Kandy", "Nuwara Eliya"],
    coords: [{lat: 6.9271, lng: 79.8612}, {lat: 6.9497, lng: 80.7891}]
  },
  "colombo-mannar": {
    normal: { bus: "No. 4 - Normal", fare: "Rs. 1,506", duration: "7 hrs" },
    ac: { bus: "No. 4 - AC Luxury", fare: "Rs. 2,010", duration: "6 hrs" },
    timing: { first: "6:30 AM", last: "6:00 PM", frequency: "Every 2 hours" },
    stops: ["Colombo Fort", "Kurunegala", "Anuradhapura", "Mannar"],
    coords: [{lat: 6.9271, lng: 79.8612}, {lat: 8.9810, lng: 79.9044}]
  },
  "colombo-vavuniya": {
    normal: { bus: "No. 15/87 - Normal", fare: "Rs. 1,230", duration: "6 hrs" },
    ac: { bus: "No. 15/87 - AC Luxury", fare: "Rs. 1,640", duration: "5 hrs" },
    timing: { first: "6:00 AM", last: "7:00 PM", frequency: "Every 1 hour" },
    stops: ["Colombo Fort", "Kurunegala", "Anuradhapura", "Vavuniya"],
    coords: [{lat: 6.9271, lng: 79.8612}, {lat: 8.7514, lng: 80.4971}]
  },
  "colombo-monaragala": {
    normal: { bus: "No. 9 - Normal", fare: "Rs. 1,001", duration: "6 hrs" },
    ac: { bus: "No. 9 - AC Luxury", fare: "Rs. 1,750", duration: "5.5 hrs" },
    timing: { first: "6:00 AM", last: "7:00 PM", frequency: "Every 1 hour" },
    stops: ["Colombo Fort", "Ratnapura", "Wellawaya", "Monaragala"],
    coords: [{lat: 6.9271, lng: 79.8612}, {lat: 6.8728, lng: 81.3507}]
  },
  "colombo-kurunegala": {
    normal: { bus: "No. 6 - Normal", fare: "Rs. 458", duration: "2.5 hrs" },
    ac: { bus: "No. 6 - AC Luxury", fare: "Rs. 670", duration: "2 hrs" },
    timing: { first: "5:30 AM", last: "9:30 PM", frequency: "Every 15 mins" },
    stops: ["Colombo Fort", "Kelaniya", "Gampaha", "Kurunegala"],
    coords: [{lat: 6.9271, lng: 79.8612}, {lat: 7.4818, lng: 80.3609}]
  },
  "colombo-ratnapura": {
    normal: { bus: "No. 98 - Normal", fare: "Rs. 545", duration: "3 hrs" },
    ac: { bus: "No. 98 - AC Luxury", fare: "Rs. 735", duration: "2.5 hrs" },
    timing: { first: "5:30 AM", last: "9:00 PM", frequency: "Every 20 mins" },
    stops: ["Colombo Fort", "Avissawella", "Ratnapura"],
    coords: [{lat: 6.9271, lng: 79.8612}, {lat: 6.6828, lng: 80.3992}]
  },
  "colombo-puttalam": {
    normal: { bus: "No. 7 - Normal", fare: "Rs. 825", duration: "3.5 hrs" },
    ac: { bus: "No. 4-7 - AC Luxury", fare: "Rs. 880", duration: "3 hrs" },
    timing: { first: "6:00 AM", last: "8:00 PM", frequency: "Every 30 mins" },
    stops: ["Colombo Fort", "Negombo", "Chilaw", "Puttalam"],
    coords: [{lat: 6.9271, lng: 79.8612}, {lat: 8.0408, lng: 79.8394}]
  },
  "colombo-ampara": {
    normal: { bus: "No. 38-4 - Normal", fare: "Rs. 1,625", duration: "7 hrs" },
    ac: { bus: "No. 38-4 - AC", fare: "Rs. 2,180", duration: "6 hrs" },
    timing: { first: "6:30 AM", last: "6:30 PM", frequency: "Every 1 hour" },
    stops: ["Colombo Fort", "Kandy", "Polonnaruwa", "Ampara"],
    coords: [{lat: 6.9271, lng: 79.8612}, {lat: 7.2811, lng: 81.6747}]
  },
  "kandy-jaffna": {
    normal: { bus: "No. 43/87 - Normal", fare: "Rs. 1,587", duration: "7 hrs" },
    ac: { bus: "No. 43/87 - AC", fare: "Rs. 2,100", duration: "6 hrs" },
    timing: { first: "6:00 AM", last: "7:00 PM", frequency: "Every 2 hours" },
    stops: ["Kandy", "Dambulla", "Anuradhapura", "Vavuniya", "Jaffna"],
    coords: [{lat: 7.2906, lng: 80.6337}, {lat: 9.6615, lng: 80.0255}]
  },
  "colombo-matale": {
    normal: { bus: "No. 8 - Normal", fare: "Rs. 551", duration: "3.5 hrs" },
    ac: { bus: "No. 8 - AC Luxury", fare: "Rs. 990", duration: "3 hrs" },
    timing: { first: "5:30 AM", last: "9:00 PM", frequency: "Every 20 mins" },
    stops: ["Colombo Fort", "Kandy", "Matale"],
    coords: [{lat: 6.9271, lng: 79.8612}, {lat: 7.4675, lng: 80.6234}]
  },
};
function findRoute(from, to) {
  const key1 = `${from.toLowerCase()}-${to.toLowerCase()}`;
  const key2 = `${to.toLowerCase()}-${from.toLowerCase()}`;
  return busRoutes[key1] || busRoutes[key2] || null;
}

function App() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [result, setResult] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [chat, setChat] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [loading, setLoading] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

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
    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: "POST",
        mode: "cors",
        credentials: "omit",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "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"
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [
            {
              role: "system",
              content: `You are a helpful Sri Lanka bus transport assistant. Help people find bus routes, fares, timings across Sri Lanka. Be friendly and concise. Answer in the same language as the user (Tamil, Sinhala, or English).

Known routes:
- Colombo-Kandy: Normal Rs.458 / AC Rs.830, 2.5-3hrs, Bus No.1
- Colombo-Galle: Normal Rs.532 / AC Rs.800, 2-2.5hrs, Bus No.2-1
- Colombo-Jaffna: Normal Rs.1967 / AC Rs.2620, 7-8hrs, Bus No.15/87
- Colombo-Negombo: Normal Rs.301 / AC Rs.652, 1-1.5hrs, Bus No.4
- Colombo-Matara: Normal Rs.797 / AC Rs.1060, 3-3.5hrs, Bus No.2
- Colombo-Anuradhapura: Normal Rs.1094 / AC Rs.1460, 4-5hrs, Bus No.15-1-1
- Colombo-Trincomalee: Normal Rs.1275 / AC Rs.2550, 6-7hrs, Bus No.49
- Colombo-Batticaloa: Normal Rs.1524 / AC Rs.3050, 6.5-7.5hrs, Bus No.48-1
- Colombo-Hambantota: Normal Rs.1184 / AC Rs.2180, 4-5hrs, Bus No.32-1
- Colombo-Badulla: Normal Rs.1250 / AC Rs.1690, 5-6hrs, Bus No.21-6`
            },
            {
              role: "user",
              content: userMsg
            }
          ],
          max_tokens: 500,
        })
      }
    );

    const data = await response.json();
    const reply = data.choices[0].message.content;
    setChat(prev => [...prev, { role: 'assistant', text: reply }]);
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
        <div className="input-group">
          <span className="input-icon">📍</span>
          <input type="text" placeholder="From — Colombo, Kandy..." value={from} onChange={e => setFrom(e.target.value)} />
        </div>
        <div className="divider">
          <div className="divider-line"></div>
          <div className="swap-btn" onClick={handleSwap}>⇅</div>
          <div className="divider-line"></div>
        </div>
        <div className="input-group">
          <span className="input-icon">🏁</span>
          <input type="text" placeholder="To — Galle, Jaffna..." value={to} onChange={e => setTo(e.target.value)} />
        </div>
        <button className="search-btn" onClick={handleSearch}>Find My Bus →</button>
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
          <p>😕 Route not found. Try asking our AI Assistant below!</p>
        </div>
      )}

      {/* Map */}
      <div className="map-container" ref={mapRef}></div>

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