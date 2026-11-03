// Volunteer opportunities for the Volunteering page.
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
    task: "Homework help and activities with kids after school. Contact the club to see what help they need.",
    tags: ["After school"] },
  { resource: "jesses-house", type: "kids",
    task: "Tutoring and mentoring the girls who live at the home. Contact Jesse's House to set it up.",
    tags: ["Ongoing"] },
  { resource: "lib-cumming", type: "kids",
    task: "Programs and events at your local library. Contact the branch closest to you.",
    tags: ["Any branch"] },
  { resource: "charles-place", type: "people",
    task: "Help with meals, classes and activities at the county's senior centers.",
    tags: ["Weekdays"] },
  { resource: "nami-fdl", type: "people",
    task: "Community events and mental health education. Contact NAMI to find out where help is needed.",
    tags: ["Events"] },
  { resource: "united-way", type: "people",
    task: "Join volunteer projects with United Way's partner agencies around the county.",
    tags: ["Projects", "Good for groups"] }
];
