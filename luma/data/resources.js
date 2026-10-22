// Listings for the directory and map. Kept as a .js file (not JSON) so the
// site still works when it's opened straight from a folder with no server.
//
// lat/lng are null for phone-only services or places with a private address.
// oh is the hours format the "open now" check reads, like "Mo-Fr 08:00-17:00".
// verified is the month we last checked the listing against its source.

window.LUMA_CATEGORIES = [
  { id: "food",      name: "Food & Essentials",      short: "Food",      icon: "cat-food",      color: "#C0643B" },
  { id: "health",    name: "Health & Medical",       short: "Health",    icon: "cat-health",    color: "#2E7D74" },
  { id: "crisis",    name: "Crisis & Mental Health", short: "Crisis",    icon: "cat-crisis",    color: "#7A4E8C" },
  { id: "learn",     name: "Libraries & Learning",   short: "Learning",  icon: "cat-learn",     color: "#3B63A8" },
  { id: "youth",     name: "Youth & Family",         short: "Family",    icon: "cat-youth",     color: "#B8517A" },
  { id: "seniors",   name: "Seniors",                short: "Seniors",   icon: "cat-seniors",   color: "#9A7429" },
  { id: "housing",   name: "Housing & Utilities",    short: "Housing",   icon: "cat-housing",   color: "#7C5236" },
  { id: "jobs",      name: "Jobs & Money",           short: "Jobs",      icon: "cat-jobs",      color: "#4F6380" },
  { id: "rec",       name: "Parks & Culture",        short: "Parks",     icon: "cat-rec",       color: "#4C7D3B" },
  { id: "civic",     name: "Government & Transit",   short: "Civic",     icon: "cat-civic",     color: "#5B5752" },
  { id: "volunteer", name: "Volunteer & Give",       short: "Volunteer", icon: "cat-volunteer", color: "#1F7A91" }
];

window.LUMA_AUDIENCES = {
  all: "Everyone", families: "Families", youth: "Children & teens", adults: "Adults",
  seniors: "Older adults (60+)", disability: "People with disabilities", uninsured: "Uninsured residents",
  survivors: "Survivors of abuse", students: "Students", jobseekers: "Job seekers", volunteers: "Volunteers"
};


window.LUMA_RESOURCES = [
  // Food & Essentials
  {
    id: "the-place", name: "The Place of Forsyth County", cat: "food", also: ["housing", "volunteer"],
    blurb: "Client-choice food market, emergency assistance and thrift store.",
    desc: "The Place helps residents of Forsyth and Dawson counties meet essential needs and work toward self-sufficiency. Its Market lets qualifying families choose groceries using a point system, and its surplus pantry shares day-old bread and lightly damaged goods donated by local grocers. Call ahead to make an appointment.",
    address: "2550 The Place Circle", city: "Cumming", zip: "30040", lat: 34.23215, lng: -84.10360,
    phone: "770-887-1098", web: "https://www.theplaceofforsyth.org",
    hours: "Market: Tue 10 a.m.-2 p.m.; Wed 10 a.m.-3 p.m.; Thu 10 a.m.-noon and 2-3:30 p.m.",
    oh: "Tu 10:00-14:00; We 10:00-15:00; Th 10:00-12:00,14:00-15:30",
    aud: ["families", "adults", "seniors"], lang: ["English", "Spanish"],
    source: { label: "Forsyth County News: “New hours for The Place of Forsyth food pantry”", url: "https://www.forsythnews.com/local/lifestyles/new-hours-for-the-place-of-forsyth-food-pantry" },
    verified: "2026-10"
  },
  {
    id: "meals-by-grace", name: "Meals by Grace", cat: "food", also: ["volunteer"],
    blurb: "Free food pantry plus weekly hot meals delivered to families without transportation.",
    desc: "Meals by Grace prepares and delivers hot meals each week to families with limited or no transportation, and gives free food and household items to anyone in need during open hours. Call if you need help outside the listed times.",
    address: "6755 Majors Road", city: "Cumming", zip: "30040", lat: 34.16536, lng: -84.20636,
    phone: "678-328-8372", web: "https://mealsbygrace.org",
    hours: "Wed-Fri 9 a.m.-4:30 p.m.; Sat 10-11 a.m.; Sun 1-4 p.m.",
    oh: "We-Fr 09:00-16:30; Sa 10:00-11:00; Su 13:00-16:00",
    aud: ["families", "adults", "seniors"], lang: ["English"],
    source: { label: "Forsyth County Schools: Sawnee Elementary Community Resources", url: "https://sawneeelementary.forsyth.k12.ga.us/student-services/counseling/community-resources" },
    verified: "2026-10"
  },
  {
    id: "farmers-market", name: "Cumming Farmers Market", cat: "food", also: ["rec"],
    blurb: "Year-round local produce, baked goods and crafts at the Cumming City Center.",
    desc: "The Cumming Farmers Market moved to the Cumming City Center in 2022 and now runs year-round. Vendors set up in the Vision Parkway lot, immediately to the left as you enter the City Center from Canton Highway. Summer hours (June-September) expand to Wednesday and Saturday mornings starting at 6:30 a.m.",
    address: "423 Canton Road", city: "Cumming", zip: "30040", lat: 34.21539, lng: -84.14750,
    phone: "", web: "https://www.cityofcumming.net",
    hours: "October-May: Saturdays 8-11 a.m.",
    oh: "Sa 08:00-11:00",
    aud: ["all"], lang: ["English"],
    source: { label: "Forsyth County News: “Cumming Farmers Market moving to City Center”", url: "https://forsythnews.com/life/food-drink/cumming-farmers-market-moving-city-center-fall-opening-year-round" },
    verified: "2026-10"
  },
  {
    id: "dfcs", name: "Forsyth County DFCS (Family & Children Services)", cat: "food", also: ["health", "youth"],
    blurb: "Apply for SNAP food benefits, Medicaid, TANF and child welfare services.",
    desc: "The Georgia Division of Family and Children Services office for Forsyth County accepts walk-in applications for SNAP (food stamps), Medicaid, TANF and child welfare services. You can also apply online through Georgia Gateway or call the statewide Customer Contact Center at 877-423-4746.",
    address: "6435 Shiloh Road, Suite C", city: "Alpharetta", zip: "30005", lat: 34.10832, lng: -84.20971,
    phone: "770-781-6700", web: "https://dfcs.georgia.gov",
    hours: "Mon-Fri 8 a.m.-5 p.m. (walk-ins welcome)",
    oh: "Mo-Fr 08:00-17:00",
    aud: ["families", "adults", "seniors"], lang: ["English", "Spanish"],
    source: { label: "Georgia DFCS: Forsyth County office", url: "https://dfcs.georgia.gov/node/15766" },
    verified: "2026-10"
  },
  {
    id: "goodwill", name: "Goodwill Cumming Store", cat: "food", also: [],
    blurb: "Affordable clothing and household goods, plus an attended donation drop-off.",
    desc: "The Cumming Goodwill store sells low-cost clothing, furniture and household items and accepts donations at an attended drive-through. Revenue supports Goodwill of North Georgia's free career services across the region.",
    address: "715 Atlanta Road", city: "Cumming", zip: "30040", lat: 34.18681, lng: -84.14441,
    phone: "", web: "https://www.goodwillng.org",
    hours: "See website for current store hours.", oh: null,
    aud: ["all"], lang: ["English"],
    source: { label: "Goodwill of North Georgia: store locator", url: "https://www.goodwillng.org" },
    verified: "2026-10"
  },

  // Health & Medical
  {
    id: "health-dept", name: "Forsyth County Health Department", cat: "health", also: ["youth"],
    blurb: "Immunizations, WIC nutrition support, screenings and family health services.",
    desc: "Part of Georgia's District 2 Public Health, the Forsyth County Health Department offers clinical services including immunizations, WIC nutrition assistance for mothers and young children, and health screenings. Tuesday evening hours make it easier for working families to visit. Clinics close for lunch from 12:30 to 1 p.m. Monday through Thursday.",
    address: "428 Canton Highway", city: "Cumming", zip: "30040", lat: 34.21625, lng: -84.14934,
    phone: "770-781-6900", web: "https://www.phdistrict2.org",
    hours: "Mon, Wed, Thu 8 a.m.-5 p.m.; Tue 8 a.m.-7 p.m.; Fri 8 a.m.-noon",
    oh: "Mo,We,Th 08:00-12:30,13:00-17:00; Tu 08:00-12:30,13:00-19:00; Fr 08:00-12:00",
    aud: ["families", "youth", "adults"], lang: ["English", "Spanish"],
    source: { label: "Forsyth County News: FoCo Info: Forsyth County Health Department", url: "https://forsythnews.com/foco-info/forsyth-county-health-department" },
    verified: "2026-10"
  },
  {
    id: "northside-forsyth", name: "Northside Hospital Forsyth", cat: "health", also: [],
    blurb: "Full-service acute care hospital with a 24-hour emergency department.",
    desc: "Northside Hospital Forsyth is a 407-bed acute care hospital offering emergency care, maternity, surgery, cancer care and specialty services. For a life-threatening emergency, always call 911.",
    address: "1200 Northside Forsyth Drive", city: "Cumming", zip: "30041", lat: 34.17801, lng: -84.14090,
    phone: "770-844-3200", web: "https://www.northside.com/forsyth",
    hours: "Emergency department open 24/7", oh: "24/7",
    aud: ["all"], lang: ["English", "Spanish"],
    source: { label: "American Hospital Directory: Northside Hospital-Forsyth profile", url: "https://www.ahd.com/free_profile/110005/Northside_Hospital_-_Forsyth/Cumming/Georgia" },
    verified: "2026-10"
  },
  {
    id: "community-clinic", name: "Forsyth Community Clinic", cat: "health", also: [],
    blurb: "Free basic health care for uninsured adult residents of Forsyth County.",
    desc: "Forsyth County's first free clinic is staffed by volunteer physicians and health professionals. It provides basic care to uninsured Forsyth County adults ages 18-65, including lab work, imaging and physical therapy. Call to check eligibility before your visit.",
    address: "102 Mary Alice Park Road, Suite 803", city: "Cumming", zip: "30040", lat: 34.19955, lng: -84.13213,
    phone: "678-812-6622", web: "https://forsythcommunityclinic.org",
    hours: "By appointment. Call to check if you qualify.", oh: null,
    aud: ["uninsured", "adults"], lang: ["English", "Spanish"],
    source: { label: "Forsyth County News: “Forsyth County’s first free clinic is now fully open”", url: "https://www.forsythnews.com/news/health-care/forsyth-countys-first-free-clinic-is-now-fully-open/" },
    verified: "2026-10"
  },

  {
    id: "choa-forsyth", name: "Children's Urgent Care at Forsyth", cat: "health", also: ["youth"],
    blurb: "Walk-in urgent care for kids, open evenings and weekends.",
    desc: "Children's Healthcare of Atlanta runs an urgent care center for children at The Collection at Forsyth. It's open later on weekdays and on weekends, for illnesses and injuries that need care the same day but aren't emergencies.",
    address: "410 Peachtree Parkway, Suite 300", city: "Cumming", zip: "30041", lat: 34.15372, lng: -84.17428,
    phone: "", web: "https://www.choa.org/locations/childrens-urgent-care-at-forsyth",
    hours: "Weekdays 11 a.m.-9 p.m.; weekends 9 a.m.-7 p.m.", oh: "Mo-Fr 11:00-21:00; Sa-Su 09:00-19:00",
    aud: ["youth", "families"], lang: ["English", "Spanish"],
    source: { label: "Children's Healthcare of Atlanta: Children's at Forsyth", url: "https://choa.org/locations/childrens-at-forsyth" },
    verified: "2026-10"
  },
  // Crisis & Mental Health
  {
    id: "988", name: "988 Suicide & Crisis Lifeline", cat: "crisis", also: [],
    blurb: "Call or text 988 any time for free, confidential crisis support.",
    desc: "The 988 Lifeline connects anyone experiencing a suicidal, mental health or substance use crisis with trained counselors 24 hours a day. You can call or text 988 or chat online. If someone is in immediate danger, call 911.",
    address: "", city: "", zip: "", lat: null, lng: null, scope: "Nationwide · phone, text and chat",
    phone: "988", web: "https://988lifeline.org",
    hours: "24 hours a day, 7 days a week", oh: "24/7",
    aud: ["all"], lang: ["English", "Spanish"],
    source: { label: "988 Suicide & Crisis Lifeline", url: "https://988lifeline.org" },
    verified: "2026-10"
  },
  {
    id: "gcal", name: "Georgia Crisis & Access Line (GCAL)", cat: "crisis", also: ["health"],
    blurb: "Statewide 24/7 line that can dispatch mobile crisis teams and find open beds.",
    desc: "GCAL counselors screen callers, provide phone support, dispatch mobile crisis teams, locate open crisis or detox beds anywhere in Georgia and schedule urgent appointments. Language assistance is available, and you can call for yourself or on behalf of someone else.",
    address: "", city: "", zip: "", lat: null, lng: null, scope: "Statewide · phone and My GCAL app",
    phone: "800-715-4225", web: "https://dbhdd.georgia.gov",
    hours: "24 hours a day, 7 days a week", oh: "24/7",
    aud: ["all"], lang: ["English", "Spanish", "Interpreters available"],
    source: { label: "Georgia DBHDD: Access Services", url: "https://dbhdd.georgia.gov/node/604" },
    verified: "2026-10"
  },
  {
    id: "avita", name: "AVITA Community Partners (Forsyth)", cat: "crisis", also: ["health"],
    blurb: "Outpatient mental health, substance use and developmental disability services.",
    desc: "AVITA Community Partners is the public behavioral health provider for northeast Georgia. The Cumming center offers outpatient mental health and substance use treatment, telehealth and developmental disability services. Sliding-scale fees are available and walk-ins are accepted.",
    address: "125 North Corners Parkway", city: "Cumming", zip: "30040", lat: 34.21712, lng: -84.15153,
    phone: "678-341-3840", web: "https://avitapartners.org",
    hours: "Call for current walk-in hours.", oh: null,
    aud: ["adults", "youth", "disability"], lang: ["English", "Spanish"],
    source: { label: "AVITA Community Partners: All Services brochure (2024)", url: "https://avitapartners.org/content/userfiles/files/All%20Services%20brochure%20-%202024-color(1).pdf" },
    verified: "2026-10"
  },
  {
    id: "nami-fdl", name: "NAMI Forsyth, Dawson & Lumpkin", cat: "crisis", also: ["volunteer"],
    blurb: "Free peer and family mental health support groups and education.",
    desc: "The local affiliate of the National Alliance on Mental Illness hosts free support groups for people living with mental health conditions and for their families. Groups meet the second and last Thursday of each month from 7 to 8:30 p.m. at the Forsyth County Senior Center.",
    address: "595 Dahlonega Street (meeting location)", city: "Cumming", zip: "30040", lat: 34.22180, lng: -84.13150,
    phone: "770-406-8322", web: "https://www.namifdl.org",
    hours: "Support groups: 2nd and last Thursday, 7-8:30 p.m.", oh: null,
    aud: ["adults", "families"], lang: ["English"],
    source: { label: "NAMI: Georgia affiliate directory", url: "https://nami.org/georgia-affiliate-directory" },
    verified: "2026-10"
  },
  {
    id: "family-haven", name: "Family Haven", cat: "crisis", also: ["housing"],
    blurb: "24/7 domestic violence hotline, emergency shelter and advocacy.",
    desc: "Since 1989, Family Haven has offered free, confidential help to survivors of domestic violence in Forsyth and North Fulton counties, including emergency shelter, crisis intervention, counseling, support groups, help with protective orders and transitional housing. The shelter location is confidential for safety. Collect calls are accepted on the hotline.",
    address: "", city: "Cumming", zip: "", lat: null, lng: null, scope: "Confidential location · 24/7 hotline",
    phone: "770-887-1121", web: "https://forsythcountyfamilyhaven.info",
    hours: "Hotline answered 24/7", oh: "24/7",
    aud: ["survivors", "families"], lang: ["English", "Spanish"],
    source: { label: "DomesticShelters.org: Family Haven", url: "https://www.domesticshelters.org/help/ga/cumming/30028/family-haven" },
    verified: "2026-10"
  },

  // Libraries & Learning
  {
    id: "lib-cumming", name: "Cumming Library", cat: "learn", also: ["youth", "jobs"],
    blurb: "Downtown branch with books, computers, study rooms and free programs.",
    desc: "Opened in 1990, the Cumming Library is the Forsyth County Public Library's downtown branch. A free library card gives access to books, e-books, databases, public computers, Wi-Fi and programs for all ages.",
    address: "585 Dahlonega Street", city: "Cumming", zip: "30040", lat: 34.22095, lng: -84.13255,
    phone: "770-781-9840", web: "https://www.forsythpl.org",
    hours: "Hours vary by branch. Check the library website.", oh: null,
    aud: ["all", "students"], lang: ["English", "Spanish"],
    source: { label: "Wikipedia: Forsyth County Public Library", url: "https://en.wikipedia.org/wiki/Forsyth_County_Public_Library" },
    verified: "2026-10"
  },
  {
    id: "lib-hampton-park", name: "Hampton Park Library", cat: "learn", also: ["youth"],
    blurb: "North Forsyth branch and an advance voting location.",
    desc: "Hampton Park Library opened in 2010 to serve north Forsyth County. Like every branch, it offers free materials, computers, Wi-Fi and community programs, and it also serves as an advance voting site during elections.",
    address: "5345 Settingdown Road", city: "Cumming", zip: "30041", lat: 34.30528, lng: -84.06679,
    phone: "770-781-9840", web: "https://www.forsythpl.org",
    hours: "Hours vary by branch. Check the library website.", oh: null,
    aud: ["all", "students"], lang: ["English"],
    source: { label: "Wikipedia: Forsyth County Public Library", url: "https://en.wikipedia.org/wiki/Forsyth_County_Public_Library" },
    verified: "2026-10"
  },
  {
    id: "lib-post-road", name: "Post Road Library", cat: "learn", also: ["youth"],
    blurb: "West Forsyth branch beside Midway Park.",
    desc: "Post Road Library opened in 2013 to serve west Forsyth County and sits next to Midway Park. It offers free materials, computers, Wi-Fi and programs for children, teens and adults.",
    address: "5010 Post Road", city: "Cumming", zip: "30040", lat: 34.20528, lng: -84.21996,
    phone: "770-781-9840", web: "https://www.forsythpl.org",
    hours: "Hours vary by branch. Check the library website.", oh: null,
    aud: ["all", "students"], lang: ["English"],
    source: { label: "Wikipedia: Forsyth County Public Library", url: "https://en.wikipedia.org/wiki/Forsyth_County_Public_Library" },
    verified: "2026-10"
  },
  {
    id: "lib-sharon-forks", name: "Sharon Forks Library", cat: "learn", also: ["youth"],
    blurb: "Georgia's busiest library, lending more than a million items a year.",
    desc: "Opened in 2000, Sharon Forks Library in south Forsyth has the highest circulation of any library facility in Georgia, with more than a million items checked out each year.",
    address: "2820 Old Atlanta Road", city: "Cumming", zip: "30041", lat: 34.11783, lng: -84.15517,
    phone: "770-781-9840", web: "https://forsythpl.org/sharon-forks-library",
    hours: "Hours vary by branch. Check the library website.", oh: null,
    aud: ["all", "students"], lang: ["English"],
    source: { label: "Forsyth County News: “Georgia’s busiest library is in Forsyth County”", url: "https://www.forsythnews.com/life/arts-entertainment/georgias-busiest-library-is-in-forsyth-county-heres-a-behind-the-scenes-look-at-how-it-works/" },
    verified: "2026-10"
  },
  {
    id: "lib-denmark", name: "Denmark Library", cat: "learn", also: ["youth"],
    blurb: "The library system's newest branch, serving south Forsyth.",
    desc: "Opened in 2025, the Denmark Library is the newest branch of the Forsyth County Public Library and serves the Denmark High School area of south Forsyth County.",
    address: "530 Fowler Road", city: "Alpharetta", zip: "30004", lat: 34.14271, lng: -84.22685,
    phone: "770-781-9840", web: "https://www.forsythpl.org",
    hours: "Hours vary by branch. Check the library website.", oh: null,
    aud: ["all", "students"], lang: ["English"],
    source: { label: "Wikipedia: Forsyth County Public Library", url: "https://en.wikipedia.org/wiki/Forsyth_County_Public_Library" },
    verified: "2026-10"
  },
  {
    id: "lanier-tech", name: "Lanier Technical College, Forsyth Campus", cat: "learn", also: ["jobs"],
    blurb: "Career-focused certificates, diplomas and degrees off GA-400 exit 13.",
    desc: "Lanier Technical College's Forsyth Campus offers technical certificates, diplomas and associate degrees that prepare students for in-demand careers. The campus sits just off exit 13 of Georgia 400 and has free on-site parking.",
    address: "3410 Ronald Reagan Boulevard", city: "Cumming", zip: "30041", lat: 34.15134, lng: -84.17551,
    phone: "678-341-6600", web: "https://www.laniertech.edu",
    hours: "See website for office hours.", oh: null,
    aud: ["students", "adults", "jobseekers"], lang: ["English"],
    source: { label: "Lanier Technical College: Forsyth Conference Center location", url: "https://forsythconferencecenter.laniertech.edu/location/" },
    verified: "2026-10"
  },
  {
    id: "uga-extension", name: "UGA Extension Forsyth County", cat: "learn", also: ["youth", "rec"],
    blurb: "4-H youth programs, gardening help, soil testing and food safety classes.",
    desc: "The University of Georgia Cooperative Extension office brings university research to residents through 4-H youth development, home gardening and landscaping advice, soil testing, and family and consumer sciences classes.",
    address: "5110 Piney Grove Road", city: "Cumming", zip: "30040", lat: 34.17035, lng: -84.16723,
    phone: "770-887-2418", web: "https://extension.uga.edu/county-offices/forsyth.html",
    hours: "Mon-Fri 8 a.m.-5 p.m.", oh: "Mo-Fr 08:00-17:00",
    aud: ["all", "youth"], lang: ["English"],
    source: { label: "UGA Extension: Contact the Forsyth County office", url: "https://extension.uga.edu/county-offices/forsyth/contact-us.html" },
    verified: "2026-10"
  },
  {
    id: "fcs", name: "Forsyth County Schools Central Office", cat: "learn", also: ["youth"],
    blurb: "School enrollment, transportation and Board of Education information.",
    desc: "The Forsyth County Schools central office houses the Board of Education and district departments. Start here for questions about enrollment, school assignments, transportation and student services.",
    address: "1120 Dahlonega Highway", city: "Cumming", zip: "30040", lat: 34.23291, lng: -84.12409,
    phone: "770-887-2461", web: "https://www.forsyth.k12.ga.us",
    hours: "Mon-Fri during business hours", oh: "Mo-Fr 08:00-16:30",
    aud: ["families", "youth", "students"], lang: ["English", "Spanish"],
    source: { label: "Forsyth County Schools: Wikipedia", url: "https://en.wikipedia.org/wiki/Forsyth_County_Schools" },
    verified: "2026-10"
  },

  // Youth & Family
  {
    id: "bgc-forsyth", name: "Boys & Girls Club of Lanier (Forsyth)", cat: "youth", also: ["volunteer"],
    blurb: "After-school and summer programs for kids in grades K-12.",
    desc: "Boys & Girls Clubs of Lanier opened Forsyth County's first club to give young people a safe place to go after school and during the summer, with homework help, mentoring, sports and enrichment.",
    address: "2150 Antioch Road", city: "Cumming", zip: "30040", lat: 34.23889, lng: -84.10977,
    phone: "770-887-8151", web: "https://www.boysgirlsclubs.com",
    hours: "After school and in the summer. Call for times.", oh: null,
    aud: ["youth", "families"], lang: ["English"],
    source: { label: "Forsyth County News: “Forsyth County’s first Boys & Girls Club is now open”", url: "https://forsythnews.com/life/faith-charity/forsyth-countys-first-boys-girls-club-is-now-open-and-taking-registrations" },
    verified: "2026-10"
  },
  {
    id: "jesses-house", name: "Jesse's House", cat: "youth", also: ["crisis", "volunteer"],
    blurb: "Safe residential care, tutoring and counseling for girls ages 7-17.",
    desc: "Since 1998, Jesse's House has provided emergency and long-term residential care for girls ages 7 to 17 who have been removed from their homes because of abuse, abandonment or neglect. The home serves up to 12 girls at a time and offers tutoring, counseling and mentoring.",
    address: "", city: "Cumming", zip: "", lat: null, lng: null, scope: "Confidential location",
    phone: "678-947-6217", web: "https://www.jesseshouse.org",
    hours: "Call during business hours.", oh: null,
    aud: ["youth"], lang: ["English"],
    source: { label: "Charity Navigator: Jesse's House", url: "https://www.charitynavigator.org/ein/582516541" },
    verified: "2026-10"
  },

  // Seniors
  {
    id: "charles-place", name: "Charles Place Senior Center", cat: "seniors", also: [],
    blurb: "Central senior center with activities, meals and Senior Support Services.",
    desc: "Charles Place is Forsyth County Senior Services' traditional senior center in the center of the county. It offers classes, social activities and congregate meals, and it is home to Senior Support Services, which helps older adults and caregivers find in-home help, respite and other assistance.",
    address: "595 Dahlonega Street", city: "Cumming", zip: "30040", lat: 34.22155, lng: -84.13196,
    phone: "770-781-2178", web: "https://www.forsythco.com/seniors",
    hours: "Weekdays. Call for program times.", oh: null,
    aud: ["seniors"], lang: ["English"],
    source: { label: "Patch: “Forsyth expanding senior services at Sexton Hall”", url: "https://patch.com/georgia/cumming/forsyth-expanding-senior-services-sexton-hall" },
    verified: "2026-10"
  },
  {
    id: "sexton-hall", name: "Sexton Hall Enrichment Center", cat: "seniors", also: [],
    blurb: "South Forsyth life-enrichment center with classes, fitness and respite care.",
    desc: "Sexton Hall is Forsyth County Senior Services' renovated life-enrichment center in south Forsyth. It offers classes, fitness, social programs, congregate meals and adult day respite. Call and choose option 2 for Sexton Hall.",
    address: "2115 Chloe Road", city: "Cumming", zip: "30041", lat: 34.11672, lng: -84.15943,
    phone: "770-781-2178", web: "https://www.forsythco.com/seniors",
    hours: "Weekdays. Call for program times.", oh: null,
    aud: ["seniors"], lang: ["English"],
    source: { label: "Forsyth County: “Renovated Sexton Hall Enrichment Center now open”", url: "https://forsythco.com/News/renovated-sexton-hall-enrichment-center-now-open2" },
    verified: "2026-10"
  },

  // Housing & Utilities
  {
    id: "family-promise", name: "Family Promise of Forsyth County", cat: "housing", also: ["youth", "volunteer"],
    blurb: "Temporary shelter and case management for families experiencing homelessness.",
    desc: "Family Promise partners with local congregations to give families experiencing homelessness a safe place to stay, meals and case management. The 30- to 120-day program helps families find work, build a budget and save toward housing, and graduates receive continued support. The organization opened its Bridge Center in Cumming in February 2025.",
    address: "", city: "Cumming", zip: "", lat: null, lng: null, scope: "Serves all of Forsyth County",
    phone: "", web: "https://www.fpforsyth.org",
    hours: "Contact through the website.", oh: null,
    aud: ["families"], lang: ["English"],
    source: { label: "Forsyth County News: “A bridge to home”", url: "https://www.forsythnews.com/life/faith-charity/a-bridge-to-home-family-promise-cuts-ribbon-at-new-center-to-help-homeless-families-in-forsyth-county" },
    verified: "2026-10"
  },
  {
    id: "habitat-ncg", name: "Habitat for Humanity North Central Georgia", cat: "housing", also: ["volunteer"],
    blurb: "Affordable homeownership, home repair and volunteer build days.",
    desc: "Habitat for Humanity North Central Georgia partners with families to build and buy affordable homes and depends on volunteers for its build days. The organization has announced significant growth in Forsyth County.",
    address: "133 Samaritan Drive", city: "Cumming", zip: "30040", lat: 34.20879, lng: -84.14396,
    phone: "770-886-4939", web: "https://www.habitat-ncg.org",
    hours: "See website for office hours.", oh: null,
    aud: ["families", "volunteers"], lang: ["English"],
    source: { label: "Forsyth County News: Habitat to build 70 new homes in north Georgia", url: "https://forsythnews.com/life/faith-charity/habitat-for-humanity-to-build-70-new-homes-in-north-georgia-including-significant-growth-in-forsyth-county" },
    verified: "2026-10"
  },
  {
    id: "water-sewer", name: "Forsyth County Water & Sewer", cat: "housing", also: ["civic"],
    blurb: "Start or stop water service, pay a bill or report a problem.",
    desc: "The county's Water & Sewer Department handles new service, billing questions and service problems for county water customers. The department's offices are on the new Freedom Park campus.",
    address: "2435 Freedom Parkway, Suite 1200", city: "Cumming", zip: "30041", lat: 34.23780, lng: -84.09370, approx: true,
    phone: "770-781-2160", web: "https://www.forsythco.com/Departments-Offices/Water-Sewer",
    hours: "Mon-Fri during business hours", oh: "Mo-Fr 08:00-17:00",
    aud: ["all"], lang: ["English"],
    source: { label: "Forsyth County: Water & Sewer Department", url: "https://www.forsythco.com/Departments-Offices/Water-Sewer" },
    verified: "2026-10"
  },

  // Jobs & Money
  {
    id: "worksource", name: "WorkSource Georgia Mountains", cat: "jobs", also: ["learn"],
    blurb: "Free job training funds, career coaching and a Mobile Career Coach at local libraries.",
    desc: "WorkSource Georgia Mountains, run by the Georgia Mountains Regional Commission, helps job seekers in Forsyth County with career coaching and training assistance. Its Mobile Career Coach visits Forsyth County library branches each month.",
    address: "1856 Thompson Bridge Road (regional office)", city: "Gainesville", zip: "30501", lat: null, lng: null, scope: "Regional office in Gainesville · visits Forsyth libraries",
    phone: "770-538-2727", web: "https://www.gmrc.ga.gov",
    hours: "Mon-Fri 8 a.m.-6 p.m.", oh: "Mo-Fr 08:00-18:00",
    aud: ["jobseekers", "adults"], lang: ["English"],
    source: { label: "Forsyth County News: “Mobile career coach coming to two libraries”", url: "https://www.forsythnews.com/local/business/mobile-career-coach-coming-to-two-libraries/" },
    verified: "2026-10"
  },
  {
    id: "gdol", name: "Georgia Department of Labor (Gainesville)", cat: "jobs", also: [],
    blurb: "Unemployment benefits, job listings and re-employment help.",
    desc: "The Georgia Department of Labor's Gainesville Career Center serves Forsyth County residents who need help filing for unemployment, searching for jobs or getting back to work.",
    address: "2756 Atlanta Highway", city: "Gainesville", zip: "30504", lat: null, lng: null, scope: "Regional center in Gainesville",
    phone: "877-709-8185", web: "https://dol.georgia.gov",
    hours: "See website for hours.", oh: null,
    aud: ["jobseekers", "adults"], lang: ["English", "Spanish"],
    source: { label: "Georgia Department of Labor", url: "https://dol.georgia.gov/node/1556" },
    verified: "2026-10"
  },

  // Parks & Culture
  {
    id: "central-park", name: "Central Park", cat: "rec", also: ["seniors"],
    blurb: "Large county park with fields, trails, a recreation center and senior center.",
    desc: "Central Park is one of Forsyth County's largest parks, with athletic fields, playgrounds, walking trails and indoor recreation space. A new county senior center is also located on the park campus.",
    address: "2300 Keith Bridge Road", city: "Cumming", zip: "30040", lat: 34.25030, lng: -84.10500,
    phone: "", web: "https://parks.forsythco.com",
    hours: "Daily, dawn to dusk (park grounds)", oh: "Mo-Su 07:00-19:00",
    aud: ["all"], lang: ["English"],
    source: { label: "Forsyth County Parks & Recreation: park map", url: "https://parks.forsythco.com/Portals/3/Park Maps/1 - Forsyth County Parks Map 8.27.24.pdf" },
    verified: "2026-10"
  },
  {
    id: "fowler-park", name: "Fowler Park", cat: "rec", also: [],
    blurb: "South Forsyth park with a recreation center, playgrounds and greenway access.",
    desc: "Fowler Park offers a recreation center, athletic fields, playgrounds and a trailhead for the Big Creek Greenway.",
    address: "4110 Carolene Way", city: "Cumming", zip: "30040", lat: 34.14925, lng: -84.20835,
    phone: "", web: "https://parks.forsythco.com",
    hours: "Daily, dawn to dusk (park grounds)", oh: "Mo-Su 07:00-19:00",
    aud: ["all"], lang: ["English"],
    source: { label: "Forsyth County Parks & Recreation: Fowler Park map", url: "https://parks.forsythco.com/Portals/3/Park Maps/9 - Fowler Park Map.pdf" },
    verified: "2026-10"
  },
  {
    id: "sawnee-preserve", name: "Sawnee Mountain Preserve", cat: "rec", also: ["learn"],
    blurb: "Hiking trails, the Indian Seats overlook and a nature visitor center.",
    desc: "Sawnee Mountain Preserve protects nearly 1,000 acres of the mountain that overlooks Cumming. Trails climb to the Indian Seats rock formation, and the visitor center hosts nature programs for families and school groups.",
    address: "4075 Spot Road", city: "Cumming", zip: "30040", lat: 34.25642, lng: -84.13859,
    phone: "", web: "https://parks.forsythco.com",
    hours: "Daily, dawn to dusk (trails)", oh: "Mo-Su 07:00-19:00",
    aud: ["all"], lang: ["English"],
    source: { label: "Forsyth County Parks & Recreation: Sawnee Mountain Preserve map", url: "https://parks.forsythco.com/Portals/3/Park Maps/24 - Sawnee Mountain Preserve.pdf" },
    verified: "2026-10"
  },
  {
    id: "big-creek-greenway", name: "Big Creek Greenway, Bethelview Trailhead", cat: "rec", also: [],
    blurb: "Paved multi-use trail along Big Creek for walking, running and biking.",
    desc: "The Big Creek Greenway is a paved, multi-use trail that follows Big Creek through Forsyth County from McFarland Parkway north toward Kelly Mill Road. The Bethelview Road trailhead offers parking and access to the newest section.",
    address: "5120 Bethelview Road", city: "Cumming", zip: "30040", lat: 34.17970, lng: -84.19313,
    phone: "", web: "https://parks.forsythco.com",
    hours: "Daily, dawn to dusk", oh: "Mo-Su 07:00-19:00",
    aud: ["all"], lang: ["English"],
    source: { label: "Forsyth County: “Newest phase of the Big Creek Greenway now open”", url: "https://www.forsythco.com/News/newest-phase-of-forsyth-countys-big-creek-greenway-now-open2" },
    verified: "2026-10"
  },
  {
    id: "mary-alice-park", name: "Mary Alice Park", cat: "rec", also: [],
    blurb: "City of Cumming park on Lake Lanier with a beach and picnic areas.",
    desc: "Mary Alice Park gives residents public access to Lake Lanier, with a swimming beach, picnic shelters and lakeside views.",
    address: "1820 Mary Alice Park Road", city: "Cumming", zip: "30041", lat: 34.19748, lng: -84.09967,
    phone: "", web: "https://www.cityofcumming.net",
    hours: "Seasonal. Check the City of Cumming website.", oh: null,
    aud: ["all"], lang: ["English"],
    source: { label: "LakeLanier.com: Mary Alice Park in Cumming, Georgia", url: "https://lakelanier.com/2017/04/mary-alice-park-in-cumming-georgia/" },
    verified: "2026-10"
  },
  {
    id: "pooles-mill", name: "Poole's Mill Park", cat: "rec", also: ["learn"],
    blurb: "Historic 1901 covered bridge over Settendown Creek.",
    desc: "Poole's Mill Park is built around a covered bridge that dates to 1901 and spans the shoals of Settendown Creek. It is one of Forsyth County's most photographed historic sites and a popular picnic spot.",
    address: "7725 Pooles Mill Road", city: "Ball Ground", zip: "30107", lat: 34.29027, lng: -84.24225,
    phone: "", web: "https://parks.forsythco.com",
    hours: "Daily, dawn to dusk", oh: "Mo-Su 07:00-19:00",
    aud: ["all"], lang: ["English"],
    source: { label: "Explore Georgia: Poole's Mill Park", url: "https://www.exploregeorgia.org/cumming/general/historic-sites-trails-tours/pooles-mill-park" },
    verified: "2026-10"
  },
  {
    id: "midway-park", name: "Midway Park", cat: "rec", also: ["civic"],
    blurb: "West Forsyth park with a community building and pickleball courts.",
    desc: "Midway Park offers athletic fields, pickleball courts, playgrounds and a community building that also serves as an advance voting location during elections. It sits beside the Post Road Library.",
    address: "5100 Post Road", city: "Cumming", zip: "30040", lat: 34.20282, lng: -84.22007,
    phone: "", web: "https://parks.forsythco.com",
    hours: "Daily, dawn to dusk (park grounds)", oh: "Mo-Su 07:00-19:00",
    aud: ["all"], lang: ["English"],
    source: { label: "Forsyth County Parks & Recreation: Midway Park map", url: "https://parks.forsythco.com/Portals/3/Park Maps/18 - Midway Park.pdf" },
    verified: "2026-10"
  },
  {
    id: "aquatic-center", name: "Cumming Aquatic Center", cat: "rec", also: ["youth"],
    blurb: "City-run pools for open swim, swim lessons and fitness programs.",
    desc: "The City of Cumming's Aquatic Center offers open swim, swim lessons and aquatic fitness programs for residents of all ages.",
    address: "201 Aquatic Circle", city: "Cumming", zip: "30040", lat: 34.22559, lng: -84.11111,
    phone: "", web: "https://www.cityofcumming.net/aquatic-center",
    hours: "See website for seasonal hours.", oh: null,
    aud: ["all", "youth"], lang: ["English"],
    source: { label: "Explore Georgia: Cumming Aquatic Center", url: "https://exploregeorgia.org/cumming/water-sports-recreation/swimming/cumming-aquatic-center" },
    verified: "2026-10"
  },
  {
    id: "cumming-playhouse", name: "Cumming Playhouse", cat: "rec", also: ["learn"],
    blurb: "Plays, musicals and concerts in a restored 1923 schoolhouse.",
    desc: "The Cumming Playhouse occupies the 1923 Cumming Public School, which was named to the National Register of Historic Places in 2000. The city-owned building also houses the Historical Society of Forsyth County and a center for Southern history and genealogy research.",
    address: "101 School Street", city: "Cumming", zip: "30040", lat: 34.20791, lng: -84.13892,
    phone: "770-781-9178", web: "https://www.cityofcumming.net",
    hours: "Performance schedule varies.", oh: null,
    aud: ["all"], lang: ["English"],
    source: { label: "Forsyth County News: “Cumming Playhouse: center of local arts scene”", url: "https://www.forsythnews.com/magazines-2/progress-forsyth-county/cumming-playhouse-center-of-local-arts-scene" },
    verified: "2026-10"
  },

  {
    id: "sharon-springs-park", name: "Sharon Springs Park", cat: "rec", also: [],
    blurb: "South Forsyth park with a community building and the south tag office.",
    desc: "Sharon Springs Park in south Forsyth has a community building that is also used as an early voting site. The county's Sharon Springs tag office is inside the park.",
    address: "1950 Sharon Road", city: "Cumming", zip: "30041", lat: 34.11847, lng: -84.16325,
    phone: "", web: "https://parks.forsythco.com",
    hours: "Daily, dawn to dusk", oh: "Mo-Su 07:00-19:00",
    aud: ["all"], lang: ["English"],
    source: { label: "Forsyth County Parks & Recreation: park map", url: "https://parks.forsythco.com/Portals/3/Park Maps/1 - Forsyth County Parks Map 8.27.24.pdf" },
    verified: "2026-10"
  },
  {
    id: "coal-mountain-park", name: "Coal Mountain Park", cat: "rec", also: [],
    blurb: "North Forsyth park on Settingdown Road.",
    desc: "Coal Mountain Park is a county park in the Coal Mountain area of north Forsyth. The county's Coal Mountain recycling center is at the same address.",
    address: "3560 Settingdown Road", city: "Cumming", zip: "30028", lat: 34.2722, lng: -84.09257,
    phone: "", web: "https://parks.forsythco.com",
    hours: "Daily, dawn to dusk", oh: "Mo-Su 07:00-19:00",
    aud: ["all"], lang: ["English"],
    source: { label: "Forsyth County Parks & Recreation: park map", url: "https://parks.forsythco.com/Portals/3/Park Maps/1 - Forsyth County Parks Map 8.27.24.pdf" },
    verified: "2026-10"
  },
  {
    id: "lanierland-park", name: "Lanierland Park", cat: "rec", also: [],
    blurb: "Northeast Forsyth park that opened in 2017.",
    desc: "Lanierland Park opened in 2017 to serve northeast Forsyth County, near Lake Lanier.",
    address: "6115 Jot-Em-Down Road", city: "Cumming", zip: "30041", lat: 34.31574, lng: -84.0334,
    phone: "", web: "https://parks.forsythco.com",
    hours: "Daily, dawn to dusk", oh: "Mo-Su 07:00-19:00",
    aud: ["all"], lang: ["English"],
    source: { label: "Forsyth County: Lanierland Park in northeast Forsyth County now open (2017)", url: "https://www.forsythco.com/Portals/0/Documents/Communications/Press%20Releases/2017/March/2017%20March%2029%20Lanierland%20Park%20in%20Northeast%20Forsyth%20County%20Now%20Open.pdf" },
    verified: "2026-10"
  },
  {
    id: "matt-community-park", name: "Matt Community Park", cat: "rec", also: [],
    blurb: "Northwest Forsyth park along Settingdown Creek.",
    desc: "Matt Community Park sits along Settingdown Creek in the Matt community of northwest Forsyth County. It opened in 2016.",
    address: "6555 Wallace Tatum Road", city: "Cumming", zip: "30028", lat: 34.29052, lng: -84.18126,
    phone: "", web: "https://parks.forsythco.com",
    hours: "Daily, dawn to dusk", oh: "Mo-Su 07:00-19:00",
    aud: ["all"], lang: ["English"],
    source: { label: "Forsyth County: Matt Community Park at Settingdown Creek now open", url: "https://www.forsythco.com/News/matt-community-park-at-settingdown-creek-now-open-in-northwest-forsyth-county2" },
    verified: "2026-10"
  },
  {
    id: "eagles-beak-park", name: "Eagle's Beak Park", cat: "rec", also: [],
    blurb: "Quiet nature park in the far northwest corner of the county.",
    desc: "Eagle's Beak Park is a passive park in northwest Forsyth County, meant for walking and enjoying nature rather than organized sports.",
    address: "8420 Old Federal Road", city: "Ball Ground", zip: "30107", lat: 34.30907, lng: -84.22296,
    phone: "", web: "https://parks.forsythco.com",
    hours: "Daily, dawn to dusk", oh: "Mo-Su 07:00-19:00",
    aud: ["all"], lang: ["English"],
    source: { label: "Forsyth County: Eagle's Beak Park now open in northwest Forsyth County", url: "https://forsythco.com/News/eagles-beak-park-now-open-in-northwest-forsyth-county2" },
    verified: "2026-10"
  },
  {
    id: "shady-grove-campground", name: "Shady Grove Campground", cat: "rec", also: [],
    blurb: "County-run campground on Lake Lanier, open in the warmer months.",
    desc: "Forsyth County Parks & Recreation runs Shady Grove Campground on Lake Lanier. It opens each spring for the camping season.",
    address: "7800 Allyn Lane Memorial Way", city: "Cumming", zip: "30041", lat: 34.20676, lng: -84.03404,
    phone: "", web: "https://parks.forsythco.com",
    hours: "Seasonal, opens in spring. Check the parks website.", oh: null,
    aud: ["all"], lang: ["English"],
    source: { label: "Forsyth County: Shady Grove Campground to open March 6", url: "https://forsythco.com/News/forsyth-county-parks-recreations-shady-grove-campground-to-open-march-62" },
    verified: "2026-10"
  },
  {
    id: "haw-creek-park", name: "Haw Creek Park", cat: "rec", also: [],
    blurb: "Park with a StoryWalk trail that pairs a short walk with a picture book.",
    desc: "Haw Creek Park has a StoryWalk trail, built as a Leadership Forsyth project in 2019, where pages of a children's book are posted along the path.",
    address: "2205 Echols Road", city: "Cumming", zip: "30041", lat: 34.16508, lng: -84.10349,
    phone: "", web: "https://parks.forsythco.com",
    hours: "Daily, dawn to dusk", oh: "Mo-Su 07:00-19:00",
    aud: ["all"], lang: ["English"],
    source: { label: "Forsyth County News: StoryWalk trail at Haw Creek Park unveiled", url: "https://www.forsythnews.com/local/storywalk-trail-at-haw-creek-park-unveiled-as-leadership-forsyths-2019-project/" },
    verified: "2026-10"
  },
  {
    id: "windermere-park", name: "Windermere Park", cat: "rec", also: [],
    blurb: "County park in south Forsyth.",
    desc: "Windermere Park is one of the Forsyth County parks serving the neighborhoods of south Forsyth.",
    address: "3355 Windermere Parkway", city: "Cumming", zip: "30041", lat: 34.12886, lng: -84.11741,
    phone: "", web: "https://parks.forsythco.com",
    hours: "Daily, dawn to dusk", oh: "Mo-Su 07:00-19:00",
    aud: ["all"], lang: ["English"],
    source: { label: "Forsyth County Parks & Recreation: park map", url: "https://parks.forsythco.com/Portals/3/Park Maps/1 - Forsyth County Parks Map 8.27.24.pdf" },
    verified: "2026-10"
  },
  {
    id: "caney-creek-preserve", name: "Caney Creek Preserve", cat: "rec", also: [],
    blurb: "Nature preserve in south Forsyth with trails and a dog park.",
    desc: "Caney Creek Preserve has walking trails, a dog park and natural areas in south Forsyth County.",
    address: "2755 Caney Road", city: "Cumming", zip: "30041", lat: 34.0982, lng: -84.18207,
    phone: "", web: "https://parks.forsythco.com",
    hours: "Daily, dawn to dusk", oh: "Mo-Su 07:00-19:00",
    aud: ["all"], lang: ["English"],
    source: { label: "Prism News: Caney Creek Preserve offers trails, dog park and nature", url: "https://www.prismnews.com/local/forsyth-ga/caney-creek-preserve-offers-trails-dog-park-and-nature" },
    verified: "2026-10"
  },
  {
    id: "chattahoochee-pointe", name: "Chattahoochee Pointe Park", cat: "rec", also: [],
    blurb: "Park near the Chattahoochee River at the county's southeast edge.",
    desc: "Chattahoochee Pointe is a county park at the southeast edge of Forsyth County, near the Chattahoochee River.",
    address: "5790 Chattahoochee Pointe Drive", city: "Suwanee", zip: "30024", lat: 34.07036, lng: -84.11868,
    phone: "", web: "https://parks.forsythco.com",
    hours: "Daily, dawn to dusk", oh: "Mo-Su 07:00-19:00",
    aud: ["all"], lang: ["English"],
    source: { label: "Forsyth County Parks & Recreation: Chattahoochee Pointe map", url: "https://parks.forsythco.com/Portals/3/Park Maps/7 - Chattahoochee Pointe.pdf" },
    verified: "2026-10"
  },
  {
    id: "old-atlanta-rec", name: "Old Atlanta Recreation Center", cat: "rec", also: [],
    blurb: "South Forsyth recreation center run by the county.",
    desc: "The Old Atlanta Recreation Center is run by Forsyth County Parks & Recreation and serves south Forsyth with indoor recreation space and programs.",
    address: "810 Nichols Road", city: "Suwanee", zip: "30024", lat: 34.10978, lng: -84.14016,
    phone: "", web: "https://parks.forsythco.com",
    hours: "See the parks website for hours.", oh: null,
    aud: ["all"], lang: ["English"],
    source: { label: "Forsyth County Parks & Recreation: recreation centers", url: "https://parks.forsythco.com/FacilitiesAmenities/RecreationCenters" },
    verified: "2026-10"
  },
  // Government & Transit
  {
    id: "freedom-park", name: "Forsyth County Government (Freedom Park)", cat: "civic", also: [],
    blurb: "The county's new one-stop campus for permits, services and county offices.",
    desc: "In March 2026, Forsyth County government moved into a new 135,000-square-foot Administration Building on the Freedom Park campus. The building brings more than a dozen departments together so residents can handle permits and other county business in one place.",
    address: "2435 Freedom Parkway", city: "Cumming", zip: "30041", lat: 34.23780, lng: -84.09370, approx: true,
    phone: "770-781-2101", web: "https://www.forsythco.com",
    hours: "Mon-Fri during business hours", oh: "Mo-Fr 08:00-17:00",
    aud: ["all"], lang: ["English"],
    source: { label: "Forsyth County: “Administration offices have moved: what to know”", url: "https://www.forsythco.com/News/forsyth-county-administration-offices-have-moved-what-to-know" },
    verified: "2026-10"
  },
  {
    id: "elections", name: "Voter Registrations & Elections", cat: "civic", also: [],
    blurb: "Register to vote, check your polling place and vote early.",
    desc: "The Forsyth County Voter Registrations & Elections office handles voter registration, absentee ballots and polling places. It is also an advance voting location, next to the Tax Commissioner's Office and Magistrate Court.",
    address: "1201 Sawnee Drive", city: "Cumming", zip: "30040", lat: 34.22622, lng: -84.14092,
    phone: "770-781-2118", web: "https://www.forsythco.com/vote",
    hours: "Mon-Fri 8 a.m.-5 p.m.", oh: "Mo-Fr 08:00-17:00",
    aud: ["adults"], lang: ["English", "Spanish"],
    source: { label: "Forsyth County: Voter Registrations & Elections", url: "https://www.forsythco.com/Departments-Offices/Voter-Registrations-Elections" },
    verified: "2026-10"
  },
  {
    id: "sheriff", name: "Forsyth County Sheriff's Office", cat: "civic", also: [],
    blurb: "Non-emergency reports, records and community programs. Call 911 for emergencies.",
    desc: "The Sheriff's Office headquarters is in the Courthouse Annex, the former Forsyth County Courthouse, on the downtown square. Use the non-emergency number for situations that are not urgent. For any emergency, call 911.",
    address: "100 East Courthouse Square", city: "Cumming", zip: "30040", lat: 34.20701, lng: -84.14025,
    phone: "770-781-2222", web: "https://www.forsythsheriff.org",
    hours: "Office: Mon-Fri 8:30 a.m.-5 p.m. Deputies respond 24/7.", oh: "Mo-Fr 08:30-17:00",
    aud: ["all"], lang: ["English", "Spanish"],
    source: { label: "Forsyth County: “Sheriff’s Office headquarters has moved”", url: "https://www.forsythco.com/News/forsyth-county-sheriffs-office-headquarters-has-moved2" },
    verified: "2026-10"
  },
  {
    id: "access-forsyth", name: "Access Forsyth (formerly Dial-A-Ride)", cat: "civic", also: ["seniors"],
    blurb: "On-call public transit you can book by phone, anywhere in the county.",
    desc: "Access Forsyth is the county's on-call public transit service, rebranded from Dial-A-Ride in 2022. Riders call ahead to schedule trips anywhere in the county. The fare is $3 per trip, and a partner program connects older adults and riders with disabilities to rideshare services.",
    address: "", city: "", zip: "", lat: null, lng: null, scope: "Countywide service · call to schedule",
    phone: "770-781-2195", web: "https://www.forsythco.com/Departments-Offices/Access-Forsyth",
    hours: "Mon-Fri 8:30 a.m.-3 p.m.", oh: "Mo-Fr 08:30-15:00",
    aud: ["all", "seniors", "disability"], lang: ["English"],
    source: { label: "Appen Media: “Forsyth County raises fares for its public transit”", url: "https://www.appenmedia.com/forsyth/forsyth-county-raises-fares-for-its-public-transit/article_1c4eb540-7b3c-47ec-b637-f73b857f06b3.html" },
    verified: "2026-10"
  },

  {
    id: "cc-tolbert", name: "Tolbert Street Recycling Center", cat: "civic", also: ["housing"],
    blurb: "Drop off household trash and recycling. For Forsyth County residents.",
    desc: "One of the county's convenience centers, in central Cumming, where residents can drop off household trash and recycling. Bring proof that you live in Forsyth County.",
    address: "351 Tolbert Street", city: "Cumming", zip: "30040", lat: 34.20243, lng: -84.14848,
    phone: "770-781-2176", web: "https://www.forsythco.com/Departments-Offices/Recycling-Solid-Waste/Convenience-Centers",
    hours: "Mon-Sat 7:30 a.m.-5 p.m. Closed Sundays and county holidays.", oh: "Mo-Sa 07:30-17:00",
    aud: ["all"], lang: ["English"],
    source: { label: "Forsyth County: convenience centers", url: "https://www.forsythco.com/Departments-Offices/Recycling-Solid-Waste/Convenience-Centers" },
    verified: "2026-10"
  },
  {
    id: "cc-coal-mountain", name: "Coal Mountain Recycling Center", cat: "civic", also: ["housing"],
    blurb: "Drop off household trash and recycling. For Forsyth County residents.",
    desc: "One of the county's convenience centers, in north Forsyth, where residents can drop off household trash and recycling. Bring proof that you live in Forsyth County.",
    address: "3560 Settingdown Road", city: "Cumming", zip: "30028", lat: 34.2724, lng: -84.0923,
    phone: "770-781-2071", web: "https://www.forsythco.com/Departments-Offices/Recycling-Solid-Waste/Convenience-Centers",
    hours: "Mon-Sat 7:30 a.m.-5 p.m. Closed Sundays and county holidays.", oh: "Mo-Sa 07:30-17:00",
    aud: ["all"], lang: ["English"],
    source: { label: "Forsyth County: convenience centers", url: "https://www.forsythco.com/Departments-Offices/Recycling-Solid-Waste/Convenience-Centers" },
    verified: "2026-10"
  },
  {
    id: "cc-old-atlanta", name: "Old Atlanta Recycling Center", cat: "civic", also: ["housing"],
    blurb: "Drop off household trash and recycling. For Forsyth County residents.",
    desc: "One of the county's convenience centers, in south Forsyth, where residents can drop off household trash and recycling. Bring proof that you live in Forsyth County.",
    address: "3678 Old Atlanta Road", city: "Suwanee", zip: "30024", lat: 34.10076, lng: -84.13781,
    phone: "770-205-3010", web: "https://www.forsythco.com/Departments-Offices/Recycling-Solid-Waste/Convenience-Centers",
    hours: "Mon-Sat 7:30 a.m.-5 p.m. Closed Sundays and county holidays.", oh: "Mo-Sa 07:30-17:00",
    aud: ["all"], lang: ["English"],
    source: { label: "Forsyth County: convenience centers", url: "https://www.forsythco.com/Departments-Offices/Recycling-Solid-Waste/Convenience-Centers" },
    verified: "2026-10"
  },
  {
    id: "tag-office-south", name: "Sharon Springs Tag Office", cat: "civic", also: [],
    blurb: "South Forsyth office for car tags, titles and property tax.",
    desc: "The Tax Commissioner's Sharon Springs office, inside Sharon Springs Park, handles vehicle tags and titles and property tax payments for people in south Forsyth.",
    address: "1950 Sharon Road", city: "Cumming", zip: "30041", lat: 34.1187, lng: -84.163,
    phone: "770-781-2112", web: "https://www.forsythco.com/Departments-Offices/Tax-Commissioner",
    hours: "Mon-Fri 8:30 a.m.-5 p.m.", oh: "Mo-Fr 08:30-17:00",
    aud: ["adults"], lang: ["English"],
    source: { label: "Forsyth County: Renovated Sharon Springs tag office reopens", url: "https://forsythco.com/News/renovated-sharon-springs-tag-office-reopens2" },
    verified: "2026-10"
  },
  // Volunteer & Give
  {
    id: "united-way", name: "United Way of Forsyth County", cat: "volunteer", also: ["food", "youth"],
    blurb: "Funds local nonprofits and connects residents with volunteer projects.",
    desc: "United Way of Forsyth County raises funds for local partner agencies and organizes volunteer projects that address education, financial stability and health across the county.",
    address: "240 Elm Street", city: "Cumming", zip: "30040", lat: 34.21343, lng: -84.13672,
    phone: "770-781-4110", web: "https://www.unitedway.org/local/united-states/georgia/united-way-of-forsyth-county-inc",
    hours: "Weekdays. Call ahead.", oh: null,
    aud: ["volunteers", "all"], lang: ["English"],
    source: { label: "United Way Worldwide: United Way of Forsyth County", url: "https://www.unitedway.org/local/united-states/georgia/united-way-of-forsyth-county-inc" },
    verified: "2026-10"
  },
  {
    id: "humane-society", name: "Humane Society of Forsyth County", cat: "volunteer", also: [],
    blurb: "Adopt a pet, foster or volunteer at the adoption center.",
    desc: "The Humane Society of Forsyth County rescues and rehomes dogs and cats. Visit the adoption center to meet adoptable pets, or sign up to foster or volunteer.",
    address: "4440 Keith Bridge Road", city: "Cumming", zip: "30041", lat: 34.27342, lng: -84.04985,
    phone: "770-887-6480", web: "https://www.forsythpets.org",
    hours: "Adoptions: Tue-Thu 11 a.m.-5 p.m.; Fri-Sat 1-5 p.m.",
    oh: "Tu-Th 11:00-17:00; Fr-Sa 13:00-17:00",
    aud: ["all", "volunteers"], lang: ["English"],
    source: { label: "Pets for Patriots: Humane Society of Forsyth County", url: "https://www.petsforpatriots.org/partners/humane-society-of-forsyth-county/" },
    verified: "2026-10"
  },
  {
    id: "kfcb", name: "Keep Forsyth County Beautiful", cat: "volunteer", also: ["rec"],
    blurb: "Litter cleanups, recycling events and environmental education.",
    desc: "Keep Forsyth County Beautiful organizes community cleanups, recycling drives such as Bring One for the Chipper, and environmental education. Volunteers can borrow cleanup supplies and adopt a road or stream.",
    address: "110 East Main Street, Suite 100", city: "Cumming", zip: "30040", lat: 34.20699, lng: -84.13812,
    phone: "770-205-4573", web: "https://www.keepforsythcountybeautiful.org",
    hours: "Weekdays. Call ahead.", oh: null,
    aud: ["volunteers", "all"], lang: ["English"],
    source: { label: "Forsyth County: Keep Forsyth County Beautiful news", url: "https://www.forsythco.com/News/tag/keep-forsyth-county-beautiful" },
    verified: "2026-10"
  }
];
