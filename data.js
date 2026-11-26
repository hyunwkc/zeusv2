// Shared facts for the three fresh Zeus variants: the same job, plan, people and evidence in every mockup.
window.Z = {
  job: { title: "Software Engineering Intern, Storage", org: "Quanta Cloud", kind: "Internship", when: "June to August 2027" },
  plan: {
    must: ["Free June to August"],
    look: ["A verified USACO result", "A verified IOI result", "An individual result", "Results in two seasons"],
    review: ["Clear communication", "Systems thinking", "Writes Python or Go"],
  },
  groups: [
    { label: "Meets all 4", n: 23, people: [
      { name: "Marcus E. Abara", place: 17, of: 350, comp: "IOI", event: "International Olympiad in Informatics", year: 2022, medal: "Gold", ver: "Official source", avail: "Jun–Aug", status: "Accepted", seasons: [2021, 2022] },
      { name: "Vivek Bergstrom", place: 12, tied: true, of: 350, comp: "IOI", event: "International Olympiad in Informatics", year: 2019, medal: "Gold", ver: "Organizer verified", avail: "Jun–Aug", status: "Saved", seasons: [2018, 2019] },
      { name: "Rosa N. Chen", place: 11, of: 350, comp: "IOI", event: "International Olympiad in Informatics", year: 2024, medal: "Gold", ver: "Organizer verified", avail: "Jun–Aug", status: "Awaiting reply", seasons: [2023, 2024] },
      { name: "Ravi Ibrahim", place: 10, of: 350, comp: "IOI", event: "International Olympiad in Informatics", year: 2017, medal: "Gold", ver: "Official source", avail: "Jun–Aug", status: "Saved", seasons: [2016, 2017] },
      { name: "Tara W. Nguyen", place: 16, of: 350, comp: "IOI", event: "International Olympiad in Informatics", year: 2021, medal: "Gold", ver: "Organizer verified", avail: "Summer or fall", status: "Awaiting reply", seasons: [2020, 2021] },
    ]},
    { label: "Meets 3 of 4", n: 141, people: [
      { name: "Priya I. Varga", place: 19, of: 350, comp: "IOI", event: "International Olympiad in Informatics", year: 2017, medal: "Gold", ver: "Official source", avail: "Jun–Aug", status: "", seasons: [2016, 2017] },
      { name: "Leah C. Nwosu", place: 15, of: 350, comp: "IOI", event: "International Olympiad in Informatics", year: 2018, medal: "Gold", ver: "Official source", avail: "Jun–Aug", status: "", seasons: [2018] },
      { name: "Malik Reyes", place: 4, of: 410, comp: "USACO", event: "USACO US Open", year: 2025, medal: "Platinum", ver: "Organizer verified", avail: "Jun–Aug", status: "", seasons: [2024, 2025] },
      { name: "Nadia Mehta", place: 71, of: 350, comp: "IOI", event: "International Olympiad in Informatics", year: 2021, medal: "Silver", ver: "Official source", avail: "Jun–Aug", status: "", seasons: [2020, 2021] },
    ]},
  ],
  open: {
    name: "Marcus E. Abara", avail: "Available June to August 2027", intro: "Introduction accepted",
    checks: [
      ["Supported", "Free June to August"], ["Supported", "A verified USACO result"], ["Supported", "A verified IOI result"],
      ["Supported", "An individual result"], ["Supported", "Results in two seasons"],
    ],
    records: [
      { event: "International Olympiad in Informatics", short: "IOI", year: 2022, month: "Aug", place: 17, of: 350, medal: "Gold medal", ver: "Official source matched", round: "Final contest", org: "IOI International Committee" },
      { event: "USACO US Open", short: "USACO", year: 2021, month: "Apr", place: 7, of: 410, medal: "Platinum division", ver: "Organizer verified", round: "Invited to the training camp", org: "USA Computing Olympiad" },
      { event: "International Olympiad in Informatics", short: "IOI", year: 2021, month: "Aug", place: 51, of: 350, medal: "Silver medal", ver: "Organizer verified", round: "Final contest", org: "IOI International Committee" },
    ],
    self: ["Built a key-value store in Go (personal project, 2023)"],
  },
}
window.ord = n => n + (["th", "st", "nd", "rd"][(n % 100 - 20) % 10] || ["th", "st", "nd", "rd"][n % 100] || "th")
