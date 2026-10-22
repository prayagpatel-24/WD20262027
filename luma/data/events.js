// Calendar events. Each one uses one of these date setups:
//   date (+ end)  one day, or a stretch of days
//   weekly        { days: [0-6], from, until }   (0 is Sunday)
//   monthly       { nth: [2, -1], day: 4, ... }  (-1 means the last one in the month)
//   extra         extra one-off dates
// status is confirmed, recurring, or tentative (guessed from last year's date).

window.LUMA_EVENTS = [
  {
    id: "advance-voting", title: "Early voting for the Nov. 3 general election", cat: "civic", status: "confirmed",
    weekly: { days: [1, 2, 3, 4, 5], from: "2026-10-12", until: "2026-10-30" }, extra: ["2026-10-24"],
    start: "08:00", finish: "17:00",
    place: "Voter Registrations & Elections, 1201 Sawnee Drive (plus four other sites)", resource: "elections",
    desc: "Registered Forsyth County voters can vote early on weekdays and on Saturday, October 24. Other advance voting sites include Hampton Park Library, Midway Park Community Building, Sharon Springs Park Community Building and the Parks & Recreation Natural Resources Operations Center.",
    source: { label: "Forsyth County: Advance voting for the November 3 General and Special Election", url: "https://www.forsythco.com/News/advance-voting-for-november-3-general-and-special-election-starts-oct-12-22" }
  },
  {
    id: "election-day", title: "General Election Day", cat: "civic", status: "confirmed",
    date: "2026-11-03", start: "07:00", finish: "19:00",
    place: "Your assigned polling place", resource: "elections",
    desc: "Polls are open from 7 a.m. to 7 p.m. On Election Day you must vote at your assigned polling place. Check it on the Georgia My Voter Page or call the elections office.",
    source: { label: "Forsyth County: Advance voting and Election Day information", url: "https://www.forsythco.com/News/advance-voting-for-november-3-general-and-special-election-starts-oct-12-22" }
  },
  {
    id: "farmers-market", title: "Cumming Farmers Market", cat: "food", status: "recurring",
    weekly: { days: [6], from: "2026-10-03", until: "2027-05-29" },
    start: "08:00", finish: "11:00",
    place: "Cumming City Center, 423 Canton Road", resource: "farmers-market",
    desc: "Shop local produce, baked goods and handmade items from area vendors. The market runs Saturday mornings from October through May.",
    source: { label: "Forsyth County News: Cumming Farmers Market moving to City Center", url: "https://forsythnews.com/life/food-drink/cumming-farmers-market-moving-city-center-fall-opening-year-round" }
  },
  {
    id: "nami-groups", title: "NAMI peer and family support groups", cat: "crisis", status: "recurring",
    monthly: { nth: [2, -1], day: 4, from: "2026-10-01", until: "2027-06-30" },
    start: "19:00", finish: "20:30",
    place: "Forsyth County Senior Center, 595 Dahlonega Street", resource: "nami-fdl",
    desc: "Free, confidential support groups for adults living with a mental health condition and for their family members.",
    source: { label: "NAMI: Georgia affiliate directory", url: "https://nami.org/georgia-affiliate-directory" }
  },
  {
    id: "boc-meetings", title: "Board of Commissioners regular meeting", cat: "civic", status: "recurring",
    monthly: { nth: [1, 3], day: 4, from: "2026-10-01", until: "2027-06-30" },
    start: "17:00", finish: "19:00",
    place: "See forsythco.com/Meetings for the agenda and location", resource: "freedom-park",
    desc: "Regular meetings of the Forsyth County Board of Commissioners are open to the public. Check the county meetings calendar for agendas and any schedule changes.",
    source: { label: "Forsyth County: Meetings calendar", url: "https://www.forsythco.com/Meetings" }
  },
  {
    id: "evening-clinic", title: "Health Department evening clinic hours", cat: "health", status: "recurring",
    weekly: { days: [2], from: "2026-10-01", until: "2027-06-30" },
    start: "17:00", finish: "19:00",
    place: "Forsyth County Health Department, 428 Canton Highway", resource: "health-dept",
    desc: "The Health Department stays open until 7 p.m. on Tuesdays so working families can get immunizations, WIC services and screenings after work.",
    source: { label: "Forsyth County News: FoCo Info: Health Department", url: "https://forsythnews.com/foco-info/forsyth-county-health-department" }
  },
  {
    id: "tree-lighting", title: "City Center Christmas Tree Lighting", cat: "rec", status: "tentative",
    date: "2026-11-21", start: "18:00", finish: "19:00",
    place: "Cumming City Center, 423 Canton Road", resource: "farmers-market",
    desc: "The City of Cumming's annual tree lighting features live music, activities for all ages and treats from local vendors. The date is projected from the 2025 event (the Saturday before Thanksgiving). Confirm with the City of Cumming.",
    source: { label: "City of Cumming: City Center Christmas Tree Lighting", url: "https://www.cityofcumming.net/event/city-center-christmas-tree-lighting-2" }
  },
  {
    id: "christmas-parade", title: "City of Cumming Christmas Parade", cat: "rec", status: "tentative",
    date: "2026-12-12", start: "17:00", finish: "19:00",
    place: "Forsyth Central High School to the Cumming Fairgrounds",
    desc: "The parade travels from Forsyth Central High School along Tribble Gap and Castleberry roads to the Cumming Fairgrounds. The date is projected from the 2025 parade (the second Saturday in December). Confirm with the City of Cumming.",
    source: { label: "City of Cumming: 2025 Christmas Parade", url: "https://www.cityofcumming.net/event/2025-christmas-parade" }
  },
  {
    id: "chipper", title: "Bring One for the Chipper (Christmas tree recycling)", cat: "volunteer", status: "tentative",
    date: "2026-12-26", end: "2027-01-31", start: "", finish: "",
    place: "Drop-off sites across Forsyth County", resource: "kfcb",
    desc: "Recycle your live Christmas tree after the holidays. Remove lights, ornaments and stands, and the trees are chipped into mulch for local projects. Forsyth County has recycled more than 100,000 trees since 1994.",
    source: { label: "Forsyth County: Bring One for the Chipper", url: "https://www.forsythco.com/News/bring-one-for-the-chipper-24" }
  }
];
