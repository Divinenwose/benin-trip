import amazon from './assets/amazon.jpg'
import craft from './assets/craft.jpg'
import ganhi from './assets/ganhi.jpg'
import snake from './assets/snake.jpg'
import graffiti from './assets/graffiti.jpg'
import ponr from './assets/ponr.jpg'
import beach from './assets/beach.jpg'
import dock from './assets/dock.jpg'
import passport from './assets/passport.jpg'
import yellowcard from './assets/yellowcard.jpg'
import cash from './assets/cash.jpg'
import adapter from './assets/adapter.jpg'

// Rate implied by the deck: CFA 100K = ₦227,500
export const RATE = 2.275
export const naira = (n) => '₦' + Math.round(n).toLocaleString('en-NG')
export const cfa = (n) => 'CFA ' + Math.round(n).toLocaleString('en-US')

export const TRIP_START = new Date(2026, 10, 23, 0, 0, 0) // 23 Nov 2026
export const PAY_DEADLINE = new Date(2026, 9, 31, 23, 59, 59) // 31 Oct 2026

export const BUDGET = 300000
export const ROOM_PP = 214000

export const LEG1 = [
  { id: 'hiace', name: 'Hiace bus', blurb: 'Lagos to the border and back', total: 400000, pp: 40000, seats: 'Compact and cosy' },
  { id: 'coaster', name: 'Coaster bus', blurb: 'Lagos to the border and back', total: 500000, pp: 50000, seats: 'More room to stretch' },
]
export const LEG2 = [
  { id: 'bus', name: 'Bus', blurb: 'Border to the Airbnb and back', totalCfa: 80000, total: 182000, pp: 18200, seats: 'Shared ride' },
  { id: 'car', name: 'Private car', blurb: 'Border to the Airbnb and back', totalCfa: 100000, total: 227500, pp: 22750, seats: 'Just us' },
]
export const combo = (a, b) => (LEG1.find((x) => x.id === a)?.pp ?? 0) + (LEG2.find((x) => x.id === b)?.pp ?? 0)

export const STOPS = [
  { id: 'amazon', name: 'Amazon Statue', city: 'Cotonou', cfa: 0, img: amazon, blurb: 'A monument to the female warriors of old Dahomey, and the first photo stop of the trip.' },
  { id: 'craft', name: 'Art & Craft Markets', city: 'Cotonou', cfa: 0, img: craft, blurb: 'Fabric, carvings and colour in every direction. Bring cash and your bargaining voice.' },
  { id: 'ganhi', name: 'Ganhi Fruit Market', city: 'Cotonou', cfa: 0, img: ganhi, blurb: 'Fresh fruit, busy stalls and local snacks to try.' },
  { id: 'graffiti', name: 'The Graffiti Wall', city: 'Cotonou', cfa: 0, img: graffiti, blurb: 'A wall of bold street art that begs for group pictures.' },
  { id: 'beach', name: 'Family Beach', city: null, cfa: 0, img: beach, blurb: 'Palm shade, soft sand and a slow afternoon by the water.' },
  { id: 'snake', name: 'Snake Temple', city: 'Ouidah', cfa: 2000, optional: true, img: snake, blurb: 'The python temple in Ouidah. A small entry fee, and a story you will tell for years.' },
  { id: 'ponr', name: 'Point of No Return', city: 'Ouidah', cfa: 0, img: ponr, blurb: 'The memorial gate on the Ouidah coast, and the heart of the history day.' },
  { id: 'dock', name: 'Babs Dock', city: null, cfa: 2500, optional: true, img: dock, blurb: 'A quiet wooden dock, sailboats and green water. A calm way to end a busy day.' },
]

export const OPTIONALS = [
  { id: 'snake', name: 'Snake Temple', cfa: 2000, city: 'Ouidah', img: snake, day: 'Day 4 · Thursday 26', blurb: 'Entry is CFA 2,000 per person.' },
  { id: 'dock', name: 'Babs Dock', cfa: 2500, city: null, img: dock, day: 'Sightseeing', blurb: 'Entry is CFA 2,500 per person.' },
  { id: 'night', name: 'Birthday nightlife', cfa: null, city: 'Cotonou', img: null, day: 'Day 2 · Tuesday 24', blurb: 'The late-night add-on after the birthday dinner. Price depends on where we go.' },
]

export const DAYS = [
  { n: 1, dow: 'Mon', date: 23, title: 'Cross the border', tag: 'Travel day', color: 'green',
    text: 'Lagos departure, border crossing, Cotonou arrival, check-in and a relaxed dinner.',
    beats: ['Meet at Alagomeji, Yaba', 'Lagos to the Seme border', 'Cross into Benin', 'Check in at the Airbnb', 'Relaxed dinner'] },
  { n: 2, dow: 'Tue', date: 24, title: 'Birthday day', tag: 'Celebration', color: 'red',
    text: 'Birthday: brunch, photos, leisure, birthday dinner and optional nightlife.',
    beats: ['Birthday brunch', 'Photos', 'Leisure time', 'Birthday dinner', 'Optional nightlife'] },
  { n: 3, dow: 'Wed', date: 25, title: 'Cotonou, up close', tag: 'Sightseeing', color: 'yellow',
    text: 'Cotonou sightseeing, visit to the beach, market visit, local food and a flexible afternoon.',
    beats: ['City sightseeing', 'Beach visit', 'Market visit', 'Local food', 'Flexible afternoon'] },
  { n: 4, dow: 'Thu', date: 26, title: 'Ouidah, history day', tag: 'Day trip', color: 'green',
    text: 'Ouidah historical and cultural day trip.',
    beats: ['Ouidah day trip', 'Snake Temple (optional)', 'Point of No Return'] },
  { n: 5, dow: 'Fri', date: 27, title: 'Back to Lagos', tag: 'Return', color: 'red',
    text: 'Breakfast, check-out and return to Lagos.',
    beats: ['Breakfast', 'Check-out', 'Return to Lagos'] },
]

export const REQS = [
  { id: 'passport', name: 'International passport', img: passport, tip: 'Valid for the whole trip. Passport stamping is already covered in the ₦300K.' },
  { id: 'yellow', name: 'Yellow fever card', img: yellowcard, tip: 'Keep the physical card in your hand luggage, not in the big bag.' },
  { id: 'cash', name: 'Cash', img: cash, tip: 'CFA for markets, food and the optional entries: Snake Temple CFA 2,000 and Babs Dock CFA 2,500.' },
  { id: 'adapter', name: 'Universal adapter (Type E)', img: adapter, tip: 'The sockets are Type E. One universal adapter charges the phone, the camera and the power bank.' },
  { id: 'sim', name: 'SIM cards', img: null, tip: 'A local Benin SIM keeps maps and the group chat running while we move around.' },
]

export const ACCOUNTS = [
  { number: '0169451421', name: 'Chika Chukwudinma', bank: 'Union Bank', label: 'Main account' },
  { number: '0092624633', name: 'Chika Chukwudinma', bank: 'Sterling Bank', label: 'Alternative account' },
]
