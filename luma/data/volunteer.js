// Volunteer opportunities for the Get Involved page.
// resource links each one to its listing in resources.js (for phone, website and source).
// type is used for the filter buttons.

window.LUMA_VOLUNTEER_TYPES = [
  { id: "food", label: "Food", icon: "v-food" },
  { id: "animals", label: "Animals", icon: "v-animals" },
  { id: "outdoors", label: "Outdoors", icon: "v-outdoors" },
  { id: "kids", label: "Kids and teens", icon: "v-kids" },
  { id: "housing", label: "Housing", icon: "v-housing" },
  { id: "people", label: "Seniors and support", icon: "v-people" }
];

window.LUMA_VOLUNTEER = [
  { resource: "the-place", type: "food",
    task: "Help run The Market, where families shop for groceries, and sort donated food and clothing.",
    tags: ["Ongoing", "Weekdays"] },
  { resource: "meals-by-grace", type: "food",
    task: "Help cook and deliver hot meals to families who don't have a way to get to a pantry.",
    tags: ["Ongoing"] },
  { resource: "humane-society", type: "animals",
    task: "Help at the adoption center or foster a dog or cat at home until it's adopted.",
    tags: ["Ongoing", "Fostering"] },
  { resource: "kfcb", type: "outdoors",
    task: "Pick up litter on roads and streams, or help at recycling drives like Bring One for the Chipper.",
    tags: ["One-day events", "Good for groups"] },
  { resource: "habitat-ncg", type: "housing",
    task: "Work on build days to help local families build and buy their own homes.",
    tags: ["Build days", "Good for groups"] },
  { resource: "family-promise", type: "housing",
    task: "Help families who are between homes by hosting through a partner church, cooking meals or helping at the Bridge Center.",
    tags: ["Ongoing", "Through a congregation"] },
  { resource: "bgc-forsyth", type: "kids",
    task: "Ask about helping kids with homework and activities after school.",
    tags: ["After school"] },
  { resource: "jesses-house", type: "kids",
    task: "Ask about tutoring and mentoring the girls who live at the home.",
    tags: ["Ongoing"] },
  { resource: "lib-cumming", type: "kids",
    task: "Ask your local library branch about helping with programs and events.",
    tags: ["Any branch"] },
  { resource: "charles-place", type: "people",
    task: "Help with meals, classes and activities at the county's senior centers.",
    tags: ["Weekdays"] },
  { resource: "nami-fdl", type: "people",
    task: "Ask about helping with community events and mental health education.",
    tags: ["Events"] },
  { resource: "united-way", type: "people",
    task: "Join volunteer projects with United Way's partner agencies around the county.",
    tags: ["Projects", "Good for groups"] }
];
