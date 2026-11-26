// Zeus r5: the rest of the app in the chat page's look, after the PRD (Today, jobs with Chat · Shortlist · Plan,
// Introductions, Challenges, Settings, the record pane's Evidence · Activity · Profile). Demo data; every person is fictional.
const ME = "Ana Ruiz", ORG = "Quanta Cloud"
const firstName = n => n.split(" ")[0]
const riseIn = (els, gap = 45, y = 8) => { if (reduce) return; [...els].forEach((e, i) => e.animate([{ opacity: 0, transform: `translateY(${y}px)` }, { opacity: 1, transform: "none" }], { duration: 420, delay: i * gap, easing: EASE, fill: "backwards" })) }
const pop = el => { if (el && !reduce) el.animate([{ transform: "scale(1.6)" }, { transform: "none" }], { duration: 480, easing: "cubic-bezier(.3,1.6,.5,1)" }) }
const pillFor = s => s ? `<span class="pill${s === "Accepted" ? " live" : ""}"><i class="dot"></i>${s}</span>` : ""
const recLine = p => `${p.comp} ${p.year} · ${ord(p.place)} of ${p.of} · ${p.medal}`

// ---------- jobs: one chat thread each, one people list each ----------
function clonePeople(withStatus) {
  const out = []
  Z.groups.forEach((g, gi) => g.people.forEach(p => out.push({ ...p, g: gi, status: withStatus ? p.status : "", avail: "Jun–Aug" })))
  EXTRA.forEach(p => out.push({ ...p, g: 1, status: "", avail: "Jun–Aug" }))
  return out.sort((a, b) => a.g - b.g || b.year - a.year)
}
const JOBS = {}, ORDER = []
let JN = 0, DRAFT_FOR = null, TAB = "chat", PREV = "#home"
function makeJob(id, title, people, state, extra = {}) {
  const t = document.createElement("div"); t.className = "tin"; t.hidden = true; thread.appendChild(t)
  return JOBS[id] = { id, title, people, state, tin: t, planV: 1, lastRes: null, plans: [], reviews: {}, passed: [], when: "June to August 2027", kind: "Internship", ...extra }
}
function useJob(J) {
  if (CUR === J) return
  if (CUR) { CUR.planV = planV; CUR.lastRes = lastRes }
  CUR = J; tin = J.tin; planV = J.planV; lastRes = J.lastRes
  Q("#chat").classList.remove("withpane"); sel = null
}
function logPlan(add) { if (CUR) CUR.plans.unshift({ v: planV, add, at: "Just now", by: "You" }); if (TAB === "chat") jtabs() }

// the quant job already has history: a confirmed plan, a narrowed second version, five people saved and three introductions
function seedQuant() {
  const J = makeJob("quant", "Quant Research Intern", clonePeople(true), "Active", { when: "June to August 2027" })
  const said = "someone great at algorithms for quant research", inf = infer(said)
  const v1 = ["A verified USACO result", "A verified IOI result", "An individual result, not a team one", "Results in two seasons"]
  J.plans = [
    { v: 2, add: ["Results from 2021 or later"], at: "Nov 20", by: "You" },
    { v: 1, said, chips: v1, review: ["Comfortable with probability", "Clear communication"], at: "Nov 18", by: "You", n: 7 },
  ]
  J.reviews = {
    "Vivek Bergstrom": [{ who: "Priya Raman", d: "Advance", why: "Two IOI golds. Strong fit for research pace.", v: 1 }],
    "Ravi Ibrahim": [{ who: "Priya Raman", d: "Needs evidence", why: "Best result is from 2017. Want something recent.", v: 1 }, { who: "Daniel Osei", d: "Advance", why: "Top-ten IOI finish.", v: 1 }],
    "Marcus E. Abara": [{ who: "Priya Raman", d: "Advance", why: "IOI and USACO, both verified.", v: 1 }],
  }
  useJob(J)
  const chip = t => `<span>${esc(t)}</span>`
  msg(esc(said), true, true)
  msg(`<div class="card pmsg"><header><b>Search plan v1</b><span>· read from what you said, you confirmed it</span></header><div class="chips">${v1.map(chip).join("")}</div></div>`, false, true)
  msg(`<div class="run folded">Searched 3 approved sources · 1,204 records checked · Nov 18</div><p>Ordered by how many of the four things to look for each person meets, then by their most recent result.</p>`, false, true)
  resultsCard(tin.lastElementChild.querySelector(".zb"), () => true, { all: 164, a: 23, b: 141 }, true)
  msg("Save the top five to this job", true, true)
  msg(`<p>Saved all five to this job. Your hiring manager sees saved people when you share the job.</p>`, false, true)
  msg("Only results from 2021 or later", true, true)
  msg(`<div class="card pmsg"><header><b>Search plan v2</b><span>· changed from v1</span></header><div class="chips"><span class="add">＋ Results from 2021 or later</span></div></div>`, false, true)
  msg(`<div class="run folded">Searched 3 approved sources · 1,204 records checked · Nov 20</div><p>Done. Older results no longer count, so people whose best result is from before 2021 dropped out. People you already saved stay saved.</p>`, false, true)
  lastRes = resultsCard(tin.lastElementChild.querySelector(".zb"), p => p.year >= 2021, { all: 97, a: 14, b: 83 }, true)
  planV = 2
  sugs(["Who also has a USACO result?", "Compare Rosa N. Chen and Marcus E. Abara"])
  J.planV = planV; J.lastRes = lastRes
  return J
}
function seedJobs() {
  seedQuant()
  makeJob("hw", "Hardware Intern, Robotics", clonePeople(false), "Draft", { when: "September to December 2027" })
  ORDER.push("quant", "hw")
  CUR = null; tin = null
}
// a confirmed plan from the describe step becomes a job (or fills the draft it was started from)
function newJob(title, chips, first) {
  let J = DRAFT_FOR && JOBS[DRAFT_FOR]; DRAFT_FOR = null
  if (J) { J.state = "Active"; J.tin.innerHTML = ""; J.people = clonePeople(false) }
  else { const id = "j" + (++JN); J = makeJob(id, title, clonePeople(false), "Active"); ORDER.unshift(id) }
  J.plans = [{ v: 1, said: SAID, chips, review: QA('#pl ul[data-sec="review"] .lbl').map(e => e.textContent.trim()).filter(Boolean), at: "Just now", by: "You" }]
  if (CUR && CUR !== J) { CUR.planV = planV; CUR.lastRes = lastRes }
  CUR = J; tin = J.tin; planV = 1; lastRes = null; Q("#chat").classList.remove("withpane"); sel = null
  Q("#chat").classList.add("show"); paintJob("chat")
  renderSide(J.id); history.replaceState(null, "", "#job/" + J.id); PREV = "#job/" + J.id
}
function renderSide(fresh) {
  Q("#jobs").innerHTML = ORDER.map(id => { const J = JOBS[id]; return `<a href="#job/${id}" data-nav="job:${id}"><span class="t">${esc(J.title)}</span>${J.state !== "Active" ? `<span>${J.state}</span>` : ""}</a>` }).join("")
  const a = fresh && Q(`#jobs a[data-nav="job:${fresh}"]`)
  if (a) { QA(".side a").forEach(x => x.classList.remove("on")); a.classList.add("on"); if (!reduce) a.animate([{ opacity: 0, transform: "translateX(-10px)", background: cssv("--side-on") }, { opacity: 1, transform: "none" }], { duration: 600, easing: EASE }) }
}

// ---------- routing ----------
function nav(h) { if (location.hash === h) route(); else location.hash = h }
function route() {
  document.body.classList.remove("menu"); closeSheet()
  const [a, b, c] = location.hash.replace(/^#\/?/, "").split("/")
  let key = "home"
  if (a === "job" && JOBS[b]) { show("chat"); useJob(JOBS[b]); paintJob(c || "chat"); key = "job:" + b }
  else if (a === "intros") { showIntros(b); key = "intros" }
  else if (a === "challenges") { showChallenges(b); key = "challenges" }
  else if (a === "settings") { showSettings(b); key = "settings" }
  else if (a === "new") { key = ""; openDescribe() }
  else { show("home"); renderNeeds() }
  if (a !== "new") PREV = location.hash || "#home"
  QA(".side a[data-nav]").forEach(x => x.classList.toggle("on", x.dataset.nav === key))
}
addEventListener("hashchange", route)
Q("#start").onclick = () => nav("#new"); Q("#newjob").onclick = () => nav("#new"); Q("#mnew").onclick = () => nav("#new")
Q("#back").onclick = () => nav(PREV === "#new" ? "#home" : PREV)
Q("#menu").onclick = () => document.body.classList.toggle("menu")
Q("#mscrim").onclick = () => document.body.classList.remove("menu")

// ---------- today: what needs you, under the start card ----------
const NEEDS = [
  { id: "n1", t: "Marcus E. Abara accepted your introduction", s: "Quant Research Intern · he shared an email with you", b: "Open thread", go: "#intros/marcus" },
  { id: "n2", t: "Priya Raman and Daniel Osei disagree on Ravi Ibrahim", s: "Quant Research Intern · your call on the shortlist", b: "Settle it", go: "#job/quant/shortlist" },
  { id: "n3", t: "Tara W. Nguyen's email notice didn't go through", s: "Quant Research Intern · the request is still in her Pantheon inbox", b: "Retry", go: "#intros/tara" },
  { id: "n4", t: "Hardware Intern, Robotics has no plan yet", s: "Draft · describe who you need and Zeus reads it into a plan", b: "Describe it", go: "#job/hw" },
]
const DONE = new Set()
function renderNeeds() {
  const L = NEEDS.filter(n => !DONE.has(n.id)), el = Q("#needs")
  el.innerHTML = L.length ? `<h6><span>Needs you</span></h6><div class="nlist">${L.map(n => `<button class="nrow" data-id="${n.id}"><i></i><div><b>${n.t}</b><span>${n.s}</span></div><em>${n.b}</em></button>`).join("")}</div>`
    : `<h6><span>Needs you</span></h6><div class="caught">You're caught up. New replies and reviews land here.</div>`
  el.querySelectorAll(".nrow").forEach(r => r.onclick = () => { const n = NEEDS.find(x => x.id === r.dataset.id); DONE.add(n.id); nav(n.go) })
  riseIn(el.querySelectorAll(".nrow"), 60)
}
function clearNeed(id) { DONE.add(id) }

// ---------- a job: Chat · Shortlist · Plan ----------
const saved = J => J.people.filter(p => p.status)
function jtabs(bump) {
  const J = CUR, n = saved(J).length, nav2 = Q("#jtabs")
  nav2.innerHTML = `<span class="tpill"></span>` + [["chat", "Chat", ""], ["shortlist", "Shortlist", n || ""], ["plan", "Plan", J.state === "Draft" ? "" : "v" + planV]]
    .map(([k, l, c]) => `<a href="#job/${J.id}/${k}" class="${k === TAB ? "on" : ""}" data-k="${k}">${l}${c !== "" ? ` <span>${c}</span>` : ""}</a>`).join("")
  const on = nav2.querySelector("a.on"), pl = nav2.querySelector(".tpill")
  pl.style.left = on.offsetLeft + "px"; pl.style.width = on.offsetWidth + "px"
  if (bump) pop(nav2.querySelector('a[data-k="shortlist"] span'))
}
function paintJob(tab) {
  const J = CUR, was = TAB; TAB = tab
  Q("#ctitle").textContent = J.title
  Q("#jst").innerHTML = J.state === "Active" ? `<span class="pill live"><i class="dot"></i>Active</span>` : `<span class="pill">${J.state}</span>`
  // slide the tab pill from the old tab to the new one
  jtabs(); const pl = Q("#jtabs .tpill"), from = Q(`#jtabs a[data-k="${was}"]`), to = Q("#jtabs a.on")
  if (from && from !== to && !reduce) { pl.style.transition = "none"; pl.style.left = from.offsetLeft + "px"; pl.style.width = from.offsetWidth + "px"; void pl.offsetWidth; pl.style.transition = ""; pl.style.left = to.offsetLeft + "px"; pl.style.width = to.offsetWidth + "px" }
  QA("#thread .tin").forEach(t => t.hidden = t !== J.tin)
  J.tin.querySelectorAll(".res .tabs").forEach(tb => { const on = tb.querySelector(".tab.on"), pl = tb.querySelector(".tpill"); if (on && pl) { pl.style.transition = "none"; pl.style.left = on.offsetLeft + "px"; pl.style.width = on.offsetWidth + "px"; void pl.offsetWidth; pl.style.transition = "" } })
  const chat = tab === "chat"
  Q("#thread").hidden = !chat; Q("#jview").hidden = chat; Q(".cdock").hidden = !chat || J.state === "Draft"
  Q("#share").hidden = J.state === "Draft"
  if (chat && J.state === "Draft") draftEmpty(J)
  if (tab === "shortlist") renderShortlist(J)
  if (tab === "plan") renderPlan(J)
  if (!chat) riseIn(Q("#jview").querySelectorAll(".jin > *"), 50)
  else if (was !== "chat" || !Q("#thread").dataset.j || Q("#thread").dataset.j !== J.id) { Q("#thread").dataset.j = J.id; thread.scrollTop = thread.scrollHeight }
}
function draftEmpty(J) {
  J.tin.innerHTML = `<div class="empty"><canvas class="dfield"></canvas><h3>${esc(J.title)} has no plan yet</h3><p>Describe who you need in a sentence. Zeus reads it into a plan you check before anything runs.</p><button class="pri" id="ddesc">Describe it</button></div>`
  Q("#ddesc").onclick = () => { DRAFT_FOR = J.id; nav("#new") }
  miniField(J.tin.querySelector(".dfield"))
}
// a small idle field, the same as the start card's
function miniField(cv) {
  const ctx = cv.getContext("2d"), d = Math.min(2, devicePixelRatio || 1), W = cv.clientWidth, H = cv.clientHeight; cv.width = W * d; cv.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0)
  const N = 120, draw = t => { if (!cv.isConnected) return; ctx.clearRect(0, 0, W, H); const c = Math.min(W, H) * .46 / Math.sqrt(N); for (let i = 0; i < N; i++) { const q = i + .5, r = c * Math.sqrt(q), a = q * GA + (reduce ? 0 : t * .00016); ctx.beginPath(); ctx.arc(W / 2 + r * Math.cos(a), H / 2 + r * Math.sin(a), 1.3, 0, 6.283); ctx.fillStyle = `rgba(${DOT},${i < 10 ? .6 : .2})`; ctx.fill() } requestAnimationFrame(draw) }
  requestAnimationFrame(draw)
}
function bumpSaved() { if (CUR) jtabs(true) }

// shortlist: evidence, review and introduction tracked separately per person (PRD P0.4, P0.5)
const RVDOT = { "Advance": "adv", "Needs evidence": "ne", "Pass for this role": "pass" }
function reviewCell(J, p) {
  const R = J.reviews[p.name]; if (p.kept) return `<div class="rv2"><span><i class="adv"></i>You kept them</span><small>after a split review</small></div>`
  if (!R || !R.length) return `<div class="rv2"><span style="color:var(--faint)">No review yet</span></div>`
  const split = new Set(R.map(r => r.d)).size > 1
  return `<div class="rv2">${split ? `<span class="split">Split review</span>` : ""}${R.map(r => `<span title="${esc(r.why)}"><i class="${RVDOT[r.d]}"></i>${r.d} · ${firstName(r.who)}</span>`).join("")}</div>`
}
function introOf(J, p) { return INTROS.find(i => i.job === J.id && i.name === p.name) }
function renderShortlist(J) {
  J.planV2 = () => (J === CUR ? planV : J.planV)
  const L = saved(J), jv = Q("#jview")
  const revd = L.filter(p => (J.reviews[p.name] || []).length).length
  jv.innerHTML = `<div class="jin">
    <div class="jhead"><div><h2>Shortlist</h2><p>${L.length ? `${L.length} people saved to this job. ${revd ? `${revd} reviewed by your hiring managers, on plan v1.` : "Nobody has reviewed them yet."} Hover a review to read the reason.` : "Nobody saved yet. Save people from the chat or a record."}</p></div>${L.length ? `<button class="b2" id="askrev">Ask for a review</button>` : ""}</div>
    ${L.length ? `<div class="tw"><table class="sl"><thead><tr><th>Name</th><th>Evidence</th><th>Review</th><th>Introduction</th><th></th></tr></thead><tbody>
      ${L.map(p => { const I = introOf(J, p); return `<tr class="r" data-n="${esc(p.name)}"><td class="n"><b>${p.name}</b><span class="mob">${I ? I.state : (J.reviews[p.name] || []).length ? (new Set(J.reviews[p.name].map(r => r.d)).size > 1 && !p.kept ? "Split review" : J.reviews[p.name][0].d + " · " + firstName(J.reviews[p.name][0].who)) : "No review yet"}</span></td><td>${recLine(p)} <span class="vt" title="${p.ver}">✓</span></td><td>${reviewCell(J, p)}</td><td>${I ? pillFor(I.state) : `<span class="d">Not requested</span>`}</td>
        <td class="act">${(J.reviews[p.name] || []).length > 1 && !p.kept && new Set(J.reviews[p.name].map(r => r.d)).size > 1 ? `<button class="b2" data-a="settle">Settle</button>` : I ? `<button class="b2" data-a="thread">Open thread</button>` : `<button class="b2" data-a="intro">Request introduction</button>`}</td></tr>` }).join("")}
    </tbody></table></div>` : `<div class="caught">Saved people show up here with their evidence, reviews and introductions.</div>`}
    ${J.passed.length ? `<details class="passed"><summary>Passed for this job · ${J.passed.length}</summary><ul>${J.passed.map(p => `<li><span>${p.name}</span><span class="d">${recLine(p)}</span></li>`).join("")}</ul><p>Passing is internal. Zeus never tells the person, and it doesn't affect other jobs or searches.</p></details>` : ""}
  </div>`
  jv.querySelectorAll("tr.r").forEach(tr => tr.onclick = e => {
    const p = J.people.find(x => x.name === tr.dataset.n), a = e.target.closest("[data-a]")
    if (!a) return openPane(p.name)
    e.stopPropagation()
    if (a.dataset.a === "intro") openIntroSheet(p, J)
    else if (a.dataset.a === "thread") nav("#intros/" + introOf(J, p).id)
    else settleMenu(a, J, p)
  })
  const ar = Q("#askrev"); if (ar) ar.onclick = () => reviewSheet(J)
}
function settleMenu(btn, J, p) {
  QA(".settle").forEach(x => x.remove())
  const m = document.createElement("div"); m.className = "settle"
  m.innerHTML = `<button data-k="keep">Keep on the shortlist<small>Daniel said advance. Priya wanted a recent result.</small></button><button data-k="pass">Pass for this job<small>Internal only. ${firstName(p.name)} isn't told.</small></button>`
  document.body.appendChild(m); const r = btn.getBoundingClientRect(); m.style.left = Math.min(innerWidth - 240, r.right - 230) + "px"; m.style.top = r.bottom + 6 + "px"
  if (!reduce) m.animate([{ opacity: 0, transform: "translateY(-4px)" }, { opacity: 1, transform: "none" }], { duration: 180, easing: EASE })
  const off = e => { if (!m.contains(e.target)) { m.remove(); removeEventListener("pointerdown", off, true) } }
  setTimeout(() => addEventListener("pointerdown", off, true))
  m.querySelectorAll("button").forEach(b => b.onclick = async () => {
    m.remove(); clearNeed("n2")
    const tr = Q(`#jview tr[data-n="${p.name}"]`)
    if (b.dataset.k === "keep") { p.kept = true; renderShortlist(J); toast(`${p.name} stays on the shortlist. Both reviews stay on record.`) }
    else { if (tr && !reduce) await tr.animate([{ opacity: 1 }, { opacity: 0, transform: "translateX(16px)" }], { duration: 260, easing: EASE, fill: "forwards" }).finished; p.status = ""; J.passed.push(p); renderShortlist(J); jtabs(true); toast(`Passed on ${p.name} for this job.`) }
  })
}
function renderPlan(J) {
  const cur = J === CUR ? planV : J.planV
  Q("#jview").innerHTML = J.state === "Draft" ? `<div class="jin"><div class="caught">No plan yet. Describe the job from the Chat tab.</div></div>` : `<div class="jin">
    <div class="jhead"><div><h2>Plan</h2><p>Every confirmed version is kept. Reviews stay tied to the version they were made on, and searches run on the current one.</p></div><button class="b2" id="chplan">Change the plan in chat</button></div>
    <div class="vers">${J.plans.map(v => `<div class="ver ${v.v === cur ? "cur" : ""}"><span class="vn">v${v.v}</span><div class="vb">
      <header><b>${v.v === cur ? "Current plan" : "Version " + v.v}</b><span>${v.by === "You" ? "Confirmed by you" : v.by} · ${v.at}</span></header>
      ${v.said ? `<div>Read from <q>${esc(v.said)}</q></div><div class="chips">${v.chips.map(c => `<span>${esc(c)}</span>`).join("")}</div>${v.review && v.review.length ? `<div class="rvl">Check in review: ${v.review.map(esc).join(", ")}</div>` : ""}`
        : `<div>Changed from v${v.v - 1}</div><div class="chips">${v.add.map(c => `<span class="add">＋ ${esc(c)}</span>`).join("")}</div>`}
      ${J.id === "quant" && v.v === 1 ? `<div class="rvl">Priya Raman's and Daniel Osei's reviews were made on this version.</div>` : ""}
    </div></div>`).join("")}</div></div>`
  const c = Q("#chplan"); if (c) c.onclick = () => { nav(`#job/${J.id}/chat`); setTimeout(() => Q("#ask").focus(), 60) }
}

// ---------- the record pane: Evidence · Activity · Profile ----------
let PTAB = "evidence"
function openPane(name) {
  const J = CUR, p = J.people.find(x => x.name === name); if (!p) return
  sel = name; QA("tr.r").forEach(tr => tr.classList.toggle("on", tr.dataset.n === name))
  const chat = Q("#chat"), was = chat.classList.contains("withpane"); PTAB = "evidence"
  const isO = name === Z.open.name
  PF.recs = isO ? Z.open.records.map(r => ({ ...r })) : [{ event: p.event, short: p.comp, year: p.year, month: p.comp === "IOI" ? "Aug" : "Apr", place: p.place, of: p.of, tied: p.tied, medal: p.medal + (p.comp === "IOI" ? " medal" : " division"), ver: p.ver === "Official source" ? "Official source matched" : p.ver, org: p.comp === "IOI" ? "IOI International Committee" : "USA Computing Olympiad" }]
  Q("#pane").innerHTML = `<div class="ph2"><span>Record</span><span class="sp"></span><button class="ib" id="pclose" title="Close">✕</button></div>
    <div class="pbody"><h2>${p.name}</h2><div class="ptab"><span class="tpill"></span>${["Evidence", "Activity", "Profile"].map(t => `<button class="tab ${t.toLowerCase() === PTAB ? "on" : ""}" data-t="${t.toLowerCase()}">${t}</button>`).join("")}</div><div id="ptb"></div></div>
    <div class="pa" id="pacts"></div>`
  chat.classList.add("withpane")
  if (!was && !reduce) Q("#pane").animate([{ transform: "translateX(40px)", opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 420, easing: EASE })
  Q("#pclose").onclick = () => { chat.classList.remove("withpane"); sel = null; QA("tr.r.on").forEach(t => t.classList.remove("on")) }
  QA("#pane .ptab .tab").forEach(b => b.onclick = () => { PTAB = b.dataset.t; paneTab(J, p, true) })
  paneTab(J, p); paneActs(J, p)
}
function paneTab(J, p, slide) {
  const tabs = Q("#pane .ptab"), old = tabs.querySelector(".tab.on"); QA("#pane .ptab .tab").forEach(b => b.classList.toggle("on", b.dataset.t === PTAB))
  const pl = tabs.querySelector(".tpill"), on = tabs.querySelector(".tab.on")
  if (slide && old && !reduce) { pl.style.transition = "none"; pl.style.left = old.offsetLeft + "px"; pl.style.width = old.offsetWidth + "px"; void pl.offsetWidth; pl.style.transition = "" }
  pl.style.left = on.offsetLeft + "px"; pl.style.width = on.offsetWidth + "px"
  const b = Q("#ptb"), isO = p.name === Z.open.name, I = introOf(J, p), R = J.reviews[p.name] || []
  if (PTAB === "evidence") {
    const ck = [["Free June to August", "Supported"], ["A verified USACO result", isO || p.comp === "USACO" ? "Supported" : "No evidence in this record"], ["A verified IOI result", p.comp === "IOI" ? "Supported" : "No evidence in this record"], ["An individual result", "Supported"], ["Results in two seasons", p.seasons.length > 1 ? "Supported" : "No evidence in this record"]]
    b.innerHTML = `<dl class="props"><dt>Available</dt><dd>${J.when} <span class="d">· they said</span></dd></dl>
      <div class="fieldbox"><canvas id="pfcv"></canvas><div class="flegend" id="flegend"></div></div>
      <div class="sec"><h6>Results</h6><ul class="recs">${PF.recs.map(r => `<li class="${r.ur ? "ur2" : ""}"><div><b>${r.event}</b><span>${r.ur ? "Under review · values hidden until Pantheon checks it" : `${r.medal} · ${r.ver}${r.org ? " · " + r.org : ""}`}</span></div><div class="rt"><b></b><span>${r.month} ${r.year}</span></div></li>`).join("")}</ul>
      <button class="flag" id="flag">Something wrong with a record?</button></div>
      <div class="sec"><h6>Against the plan</h6><ul class="ck">${ck.map(([l, s]) => `<li><span>${l}</span><em class="${s === "Supported" ? "" : "no"}">${s}</em></li>`).join("")}</ul></div>`
    PF.cv = Q("#pfcv"); PF.ctx = PF.cv.getContext("2d")
    const dpr = Math.min(2, devicePixelRatio || 1); PF.W = PF.cv.clientWidth; PF.H = PF.cv.clientHeight; PF.cv.width = PF.W * dpr; PF.cv.height = PF.H * dpr; PF.ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    PF.cur = PF.from = 0; PF.k = 1; PF.travel = 1
    QA(".recs li").forEach((li, i) => li.onclick = () => { if (i !== PF.cur && !PF.recs[i].ur) { pick(i); PF.travel = 0 } })
    pick(0); cancelAnimationFrame(PF.raf); PF.raf = requestAnimationFrame(pdraw)
    Q("#flag").onclick = () => flagBox(J, p)
  } else if (PTAB === "activity") {
    const A = []
    if (p.status) A.push([J.id === "quant" ? "Nov 18" : "Today", `Saved by you, from plan v1`])
    R.forEach(r => A.push(["Nov 21", `${r.who}: ${r.d}. “${r.why}”`]))
    if (p.kept) A.push(["Today", "You kept them on the shortlist after a split review"])
    if (I) I.tl.filter(t => t[2] === "done" || t[2] === "bad").forEach(t => A.push([t[1] || "", t[0]]))
    A.push([J.id === "quant" ? "Nov 18" : "Today", "Found by search, plan v1"])
    b.innerHTML = `<div class="sec"><h6>This job</h6><ul class="acts2">${A.map(([t, x]) => `<li><time>${t}</time><span>${esc(x)}</span></li>`).join("")}</ul></div>`
  } else {
    b.innerHTML = `<div class="sec prof"><h6>In their words</h6><p>${isO ? "I like problems where the clean answer only shows up after you've tried three messy ones. Looking for a summer team that ships." : `Competitive programmer since high school. Interested in ${J.title.toLowerCase().includes("quant") ? "research and probability" : "systems work"}.`}</p></div>
      <div class="sec"><h6>What they share</h6><dl class="props"><dt>Found by</dt><dd>Approved employers</dd><dt>Results</dt><dd>${PF.recs.length} of ${PF.recs.length} shared</dd><dt>Requests</dt><dd>Open to introductions</dd><dt>Contact</dt><dd>${isO && I && I.state === "Accepted" ? "Email shared with Quanta Cloud" : "Only after an accepted introduction"}</dd></dl></div>
      ${isO ? `<div class="sec"><h6>Self-reported</h6><ul class="ck"><li><span>${Z.open.self[0]}</span><em class="no">Not verified</em></li></ul></div>` : ""}`
  }
  if (!reduce) riseIn(b.children, 40, 6)
}
function paneActs(J, p) {
  const I = introOf(J, p), host = Q("#pacts")
  host.innerHTML = I ? (I.state === "Accepted" ? `<button class="pri" id="pintro">Open thread</button>` : `<button class="pri" id="pintro" ${I.state === "Awaiting reply" ? "" : "disabled"}>${I.state === "Awaiting reply" ? "Introduction requested · see thread" : "Introduction " + I.state.toLowerCase()}</button>`)
    : `<button class="pri" id="pintro">Request an introduction</button>`
  host.innerHTML += `<button class="b2" id="psave">${p.status ? "Saved" : "Save"}</button>`
  Q("#pintro").onclick = () => I ? nav("#intros/" + I.id) : openIntroSheet(p, J)
  Q("#psave").onclick = () => {
    if (p.status) return; p.status = "Saved"; Q("#psave").textContent = "Saved"
    QA(`tr[data-n="${p.name}"] .st`).forEach(td => { td.innerHTML = pillFor("Saved"); pop(td.firstChild) }); bumpSaved()
  }
}
function flagBox(J, p) {
  if (Q(".flagbox")) return
  const f = document.createElement("div"); f.className = "flagbox"
  f.innerHTML = `<p>Tell Pantheon what looks wrong. The record is hidden from searches and introductions while they check it.</p><div class="chips"><button>Wrong person</button><button>Wrong placement</button><button>Missing context</button></div>`
  Q("#flag").replaceWith(f); if (!reduce) f.animate([{ opacity: 0, transform: "translateY(-4px)" }, { opacity: 1, transform: "none" }], { duration: 220, easing: EASE })
  f.querySelectorAll("button").forEach(b => b.onclick = () => {
    PF.recs[PF.cur].ur = true
    f.innerHTML = `<p>Sent to Pantheon as “${b.textContent.toLowerCase()}”. Until it's resolved, this result shows as under review and can't be quoted in an introduction.</p>`
    const li = QA(".recs li")[PF.cur]; li.classList.add("ur2"); li.querySelector("span").textContent = "Under review · values hidden until Pantheon checks it"
    QA("#pane .ck li").forEach(x => { const e = x.querySelector("em"); if (/IOI|USACO|two seasons|individual/.test(x.textContent)) { e.textContent = "Needs review"; e.className = "no" } })
    toast("Record flagged. Pantheon will check it.")
  })
}

// ---------- sheets, toasts, flying dot ----------
function openSheet(html, wire) {
  const sc = Q("#scrim"), sh = Q("#sheet"); sh.innerHTML = html; sc.hidden = false
  if (!reduce) { sc.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 220 }); sh.animate([{ opacity: 0, transform: phone() ? "translateY(40px)" : "translateY(10px) scale(.98)" }, { opacity: 1, transform: "none" }], { duration: 380, easing: EASE }) }
  sc.onclick = e => { if (e.target === sc) closeSheet() }
  sh.querySelectorAll("[data-close]").forEach(b => b.onclick = closeSheet)
  wire && wire(sh); const f = sh.querySelector("textarea, input"); if (f && !phone()) f.focus()
}
function closeSheet() { Q("#scrim").hidden = true }
addEventListener("keydown", e => { if (e.key === "Escape" && !Q("#scrim").hidden) closeSheet() })
let tT = 0
function toast(t) { const el = Q("#toast"); el.textContent = t; el.hidden = false; if (!reduce) el.animate([{ opacity: 0, transform: "translate(-50%, 8px)" }, { opacity: 1, transform: "translate(-50%, 0)" }], { duration: 260, easing: EASE }); clearTimeout(tT); tT = setTimeout(() => el.hidden = true, 3200 * TEMPO) }
async function flyTo(fromEl, toSel) {
  const to = phone() ? Q("#menu") : Q(toSel); if (reduce || !to) return
  const a = fromEl.getBoundingClientRect(), b = to.getBoundingClientRect(), d = document.createElement("div"); d.className = "flydot"; document.body.appendChild(d)
  const x0 = a.left + a.width / 2, y0 = a.top + a.height / 2, x1 = b.left + Math.min(b.width - 12, 90), y1 = b.top + b.height / 2
  await d.animate([{ transform: `translate(${x0}px, ${y0}px) scale(2.4)`, opacity: .9 }, { transform: `translate(${(x0 + x1) / 2}px, ${Math.min(y0, y1) - 60}px) scale(1.4)`, opacity: 1, offset: .5 }, { transform: `translate(${x1}px, ${y1}px) scale(.6)`, opacity: .2 }], { duration: 700, easing: "cubic-bezier(.5,0,.3,1)" }).finished
  d.remove(); to.animate([{ background: cssv("--side-on") }, { background: "transparent" }], { duration: 700 })
}

// ---------- introductions ----------
const INTROS = [
  { id: "marcus", name: "Marcus E. Abara", job: "quant", state: "Accepted", sent: "Nov 18", ex: "IOI 2022 · 17th of 350 · Gold medal · Official source matched",
    tl: [["Queued", "Nov 18", "done"], ["Delivered to his Pantheon inbox", "Nov 18", "done"], ["Accepted", "Nov 19", "done"]],
    thread: [["them", "Thanks for reaching out. The quant team sounds interesting, and June to August works for me.", "Nov 19"], ["me", "Great to hear. Could we do a 30-minute call next week? I'll send times here.", "Nov 19"], ["sys", "Marcus shared his email with Quanta Cloud and approved a handoff of his name, email and IOI 2022 result.", "Nov 20"], ["them", "Tuesday or Thursday afternoon works for me.", "Nov 20"]], handoff: null },
  { id: "rosa", name: "Rosa N. Chen", job: "quant", state: "Awaiting reply", sent: "Nov 22", ex: "IOI 2024 · 11th of 350 · Gold medal · Organizer verified",
    tl: [["Queued", "Nov 22", "done"], ["Delivered to her Pantheon inbox", "Nov 22", "done"], ["Waiting for Rosa · expires Dec 6", "", "now"]] },
  { id: "tara", name: "Tara W. Nguyen", job: "quant", state: "Awaiting reply", sent: "Nov 23", ex: "IOI 2021 · 16th of 350 · Gold medal · Organizer verified", failed: true,
    tl: [["Queued", "Nov 23", "done"], ["Delivered to her Pantheon inbox", "Nov 23", "done"], ["Email notice failed · the request is still in her inbox", "Nov 23", "bad"], ["Waiting for Tara · expires Dec 7", "", "now"]] },
  { id: "leah", name: "Leah C. Nwosu", job: "quant", state: "Declined", sent: "Nov 10", ex: "IOI 2018 · 15th of 350 · Gold medal · Official source matched",
    tl: [["Queued", "Nov 10", "done"], ["Delivered to her Pantheon inbox", "Nov 10", "done"], ["Declined", "Nov 12", "end"]] },
  { id: "owen", name: "Owen T. Fischer", job: "quant", state: "Expired", sent: "Oct 29", ex: "IOI 2020 · 23rd of 350 · Gold medal · Official source matched",
    tl: [["Queued", "Oct 29", "done"], ["Delivered to his Pantheon inbox", "Oct 29", "done"], ["Expired after 14 days without a reply", "Nov 12", "end"]] },
]
const IGROUPS = [["Awaiting reply", i => i.state === "Awaiting reply"], ["Accepted", i => i.state === "Accepted"], ["Closed", i => /Declined|Expired|Withdrawn/.test(i.state)]]
let ITAB = 0, ISEL = null
const draftFor = (p, J) => `Hi ${firstName(p.name)},\n\nI lead early-career hiring at ${ORG}. Your ${p.comp} ${p.year} result, ${ord(p.place)} of ${p.of}, is the kind of work our team looks for. We have a ${J.title.toLowerCase()} role, ${J.when}, and I'd like to tell you more.\n\nIf you're open to it, accept and we can talk here.\n\n${ME}`
function introMsg(I) { const J = JOBS[I.job], p = J.people.find(x => x.name === I.name) || { name: I.name, comp: "IOI", year: 2022, place: 17, of: 350 }; return I.msg || draftFor(p, J) }
function showIntros(id) {
  show("intros"); Q("#ndot").hidden = true
  if (id) { const I = INTROS.find(x => x.id === id); if (I) { ISEL = id; ITAB = IGROUPS.findIndex(g => g[1](I)) } }
  const el = Q("#intros"), L = INTROS.filter(IGROUPS[ITAB][1])
  if (!L.some(i => i.id === ISEL)) ISEL = phone() ? null : (L[0] && L[0].id)
  if (!el.firstChild) el.innerHTML = `<div class="pbar2"><b>Introductions</b><span class="crumb">across your jobs</span></div><div class="ibody" id="ibody"><div class="ilist"><div class="tabs" id="itabs"></div><div class="irows" id="irows"></div></div><div class="ithread" id="ithread"></div></div>`
  const tabs = Q("#itabs"), old = tabs.querySelector(".tab.on")
  tabs.innerHTML = `<span class="tpill"></span>` + IGROUPS.map(([l, f], i) => `<button class="tab ${i === ITAB ? "on" : ""}" data-i="${i}">${l} <span>${INTROS.filter(f).length}</span></button>`).join("")
  const pl = tabs.querySelector(".tpill"), on = tabs.querySelector(".tab.on"), from = old && tabs.querySelector(`.tab[data-i="${old.dataset.i}"]`)
  if (from && from !== on && !reduce) { pl.style.transition = "none"; pl.style.left = from.offsetLeft + "px"; pl.style.width = from.offsetWidth + "px"; void pl.offsetWidth; pl.style.transition = "" }
  pl.style.left = on.offsetLeft + "px"; pl.style.width = on.offsetWidth + "px"
  tabs.querySelectorAll(".tab").forEach(b => b.onclick = () => { ITAB = +b.dataset.i; ISEL = null; showIntros() })
  Q("#irows").innerHTML = L.length ? L.map(i => `<button class="irow ${i.id === ISEL ? "on" : ""}" data-id="${i.id}"><div class="t1"><b>${i.name}</b><time>${i.state === "Accepted" ? (i.thread ? i.thread[i.thread.length - 1][2] : i.sent) : i.sent}</time></div><span>${JOBS[i.job].title}</span>${i.failed ? `<span class="warn">Email notice failed</span>` : i.state !== "Awaiting reply" && i.state !== "Accepted" ? `<span>${i.state}</span>` : ""}</button>`).join("")
    : `<p class="inote" style="padding-top:24px">Nothing here.</p>`
  Q("#irows").querySelectorAll(".irow").forEach(r => r.onclick = () => { history.replaceState(null, "", "#intros/" + r.dataset.id); ISEL = r.dataset.id; QA(".irow").forEach(x => x.classList.toggle("on", x === r)); paintThread() })
  riseIn(Q("#irows").children, 35, 6)
  paintThread()
}
function paintThread() {
  const I = INTROS.find(x => x.id === ISEL), host = Q("#ithread"); Q("#ibody").classList.toggle("open", !!I)
  if (!I) { host.innerHTML = `<p class="inote" style="margin:auto">Pick a request on the left.</p>`; return }
  const J = JOBS[I.job], fn = firstName(I.name), acts = []
  if (I.state === "Awaiting reply") acts.push(`<button class="b2" id="iwd">Withdraw request</button>`)
  if (I.failed) acts.push(`<button class="pri" id="iretry">Retry the email notice</button>`)
  if (I.state === "Accepted") acts.push(I.handoff ? `<button class="b2" disabled>Handed off</button>` : `<button class="pri" id="ihand">Record handoff</button>`)
  host.innerHTML = `<header class="ith"><button class="b2 iback" id="iback">←</button><div><h2>${I.name}</h2><p>${J.title} · <a id="irec">Open record</a></p></div><span class="sp"></span>${acts.join("")}</header>
    <div class="iscroll" id="iscroll"><div class="iin">
      <div class="card req"><h6>Your request</h6><p>${esc(introMsg(I))}</p><div class="exc"><span>Evidence quoted</span>${I.ex}</div>
        <ol class="tl">${I.tl.map(([t, d, k]) => `<li class="${k}"><i></i><span>${t}</span><time>${d}</time></li>`).join("")}</ol></div>
      ${(I.thread || []).map(([w, t, d]) => w === "sys" ? `<p class="sys">${esc(t)} · ${d}</p>` : `<div class="bub ${w}"><span>${esc(t)}</span><small>${w === "me" ? "You" : fn} · ${d}</small></div>`).join("")}
      ${I.handoff ? `<p class="sys"><b>Handed off to ${esc(I.handoff.dest)}</b> by you · ${I.handoff.at}${I.handoff.ref ? " · ref " + esc(I.handoff.ref) : ""}</p>` : ""}
      ${I.state === "Declined" ? `<p class="sys">${fn} declined. Nobody at ${ORG} can ask again for this job.</p>` : ""}
      ${I.state === "Withdrawn" ? `<p class="sys">You withdrew this request. ${fn} no longer sees it.</p>` : ""}
    </div></div>
    ${I.state === "Accepted" ? `<div class="idock"><div class="composer"><textarea id="ireply" placeholder="Reply to ${fn}"></textarea><button class="send" id="isend">↑</button></div></div>`
      : I.state === "Awaiting reply" ? `<p class="inote">You can write here once ${fn} accepts. Until then they only see your request.</p>` : ""}`
  riseIn(host.querySelectorAll(".iin > *"), 50)
  const sc = Q("#iscroll"); sc.scrollTop = sc.scrollHeight
  Q("#iback").onclick = () => { ISEL = null; history.replaceState(null, "", "#intros"); showIntros() }
  Q("#irec").onclick = () => { nav("#job/" + I.job + "/shortlist"); setTimeout(() => openPane(I.name), 30) }
  const wd = Q("#iwd"); if (wd) wd.onclick = () => {
    if (wd.dataset.sure) { I.state = "Withdrawn"; I.tl = I.tl.filter(t => t[2] !== "now").concat([["Withdrawn by you", "Today", "end"]]); const p = J.people.find(x => x.name === I.name); if (p) p.status = "Saved"; toast(`Request to ${I.name} withdrawn.`); ITAB = 2; showIntros() }
    else { wd.dataset.sure = 1; wd.textContent = "Withdraw? Click again"; setTimeout(() => { if (wd.isConnected) { delete wd.dataset.sure; wd.textContent = "Withdraw request" } }, 3000) }
  }
  const rt = Q("#iretry"); if (rt) rt.onclick = async () => {
    rt.disabled = true; rt.textContent = "Sending…"; await wait(900); I.failed = false; clearNeed("n3")
    I.tl = I.tl.map(t => t[2] === "bad" ? ["Email notice sent", "Today", "done"] : t); toast("Email notice sent. Still one request, not two."); showIntros()
  }
  const hd = Q("#ihand"); if (hd) hd.onclick = () => handoffSheet(I)
  const ta = Q("#ireply"); if (ta) {
    const send = () => { const v = ta.value.trim(); if (!v) return; ta.value = ""; I.thread.push(["me", v, "Just now"]); const d = document.createElement("div"); d.className = "bub me"; d.innerHTML = `<span>${esc(v)}</span><small>You · Just now</small>`; Q(".iin").appendChild(d); riseIn([d]); sc.scrollTo({ top: sc.scrollHeight, behavior: "smooth" }) }
    Q("#isend").onclick = send; ta.addEventListener("keydown", e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send() } })
  }
  clearNeed(I.id === "marcus" ? "n1" : "")
}
function openIntroSheet(p, J) {
  const ex = `${p.comp} ${p.year} · ${ord(p.place)} of ${p.of} · ${p.medal}${p.comp === "IOI" ? " medal" : " division"} · ${p.ver === "Official source" ? "Official source matched" : p.ver}`
  openSheet(`<h3>Request an introduction</h3><p class="sub">${firstName(p.name)} decides whether to talk. Nobody's contact details are shared unless one of you chooses to.</p>
    <dl class="kv"><dt>To</dt><dd>${p.name}</dd><dt>Job</dt><dd>${J.title} · ${J.kind} · ${J.when}</dd><dt>From</dt><dd>${ME}, ${ORG}</dd></dl>
    <label>Message<textarea class="ta" id="imsg" rows="11">${esc(draftFor(p, J))}</textarea></label>
    <div class="exc"><span>Evidence quoted</span>${ex}</div>
    <footer><span class="fine">Zeus drafted this from the job and the verified result. It goes to ${firstName(p.name)}'s Pantheon inbox.</span><button class="b2" data-close>Cancel</button><button class="pri" id="isendreq">Send request</button></footer>`, sh => {
    Q("#isendreq").onclick = async () => {
      const b = Q("#isendreq"); if (b.disabled) return; b.disabled = true
      if (introOf(J, p)) return closeSheet()
      const I = { id: p.name.split(" ")[0].toLowerCase() + Date.now() % 1000, name: p.name, job: J.id, state: "Awaiting reply", sent: "Today", ex, msg: Q("#imsg").value, tl: [["Queued", "Today", "done"], ["Delivered to the Pantheon inbox", "Today", "done"], [`Waiting for ${firstName(p.name)} · expires in 14 days`, "", "now"]] }
      INTROS.unshift(I); p.status = "Awaiting reply"
      if (!reduce) sh.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: "scale(.96)" }], { duration: 260, easing: EASE, fill: "forwards" })
      const fly = flyTo(b, '.side a[data-nav="intros"]'); await wait(180); closeSheet(); sh.getAnimations().forEach(a => a.cancel())
      await fly; Q("#ndot").hidden = false; pop(Q("#ndot"))
      QA(`tr[data-n="${p.name}"] .st`).forEach(td => { td.innerHTML = pillFor(p.status); pop(td.firstChild) })
      if (TAB === "shortlist") renderShortlist(J); else jtabs(true)
      if (Q("#chat").classList.contains("withpane") && sel === p.name) paneActs(J, p)
      toast(`Request sent to ${p.name}'s Pantheon inbox.`)
    }
  })
}
function handoffSheet(I) {
  openSheet(`<h3>Record handoff</h3><p class="sub">${firstName(I.name)} approved these fields for ${ORG}. Copy them into your hiring system, then confirm here so Pantheon keeps a record.</p>
    <ul class="ckl"><li><input type="checkbox" checked disabled><b>Name</b><span>${I.name}</span></li><li><input type="checkbox" checked disabled><b>Email</b><span>m.abara@fastmail.com</span></li><li><input type="checkbox" checked disabled><b>Result</b><span>${I.ex}</span></li><li class="off"><input type="checkbox" disabled><b>Phone</b><span>Not shared</span></li></ul>
    <div class="grid2"><label>Where it's going<input class="inp" id="hdest" placeholder="Greenhouse, Ashby, Lever…"></label><label>Your reference (optional)<input class="inp" id="href" placeholder="e.g. QC-2291"></label></div>
    <footer><span class="fine">Pantheon records who handed off which fields, where, and when.</span><button class="b2" data-close>Cancel</button><button class="pri" id="hgo" disabled>Confirm handoff</button></footer>`, () => {
    const d = Q("#hdest"), g = Q("#hgo"); d.oninput = () => g.disabled = d.value.trim().length < 2
    g.onclick = () => { I.handoff = { dest: d.value.trim(), ref: Q("#href").value.trim(), at: "Just now" }; closeSheet(); toast(`Handoff to ${I.handoff.dest} recorded.`); paintThread() }
  })
}
function reviewSheet(J) {
  const L = saved(J).filter(p => !(J.reviews[p.name] || []).length)
  openSheet(`<h3>Ask for a review</h3><p class="sub">Hiring managers see this job's plan and the people you pick, with their evidence. They can't search or open anyone else.</p>
    <label>Who reviews<select class="sel" id="rvwho"><option>Priya Raman</option><option>Daniel Osei</option><option>Both</option></select></label>
    <ul class="ckl">${(L.length ? L : saved(J)).map(p => `<li><input type="checkbox" checked><b>${p.name.split(" ")[0]} ${p.name.split(" ").slice(-1)}</b><span>${recLine(p)}</span></li>`).join("")}</ul>
    <footer><span class="fine">They review against plan v${planV}. Their choices: advance, needs evidence, or pass for this job.</span><button class="b2" data-close>Cancel</button><button class="pri" id="rvgo">Send for review</button></footer>`, () => {
    Q("#rvgo").onclick = () => { const w = Q("#rvwho").value; closeSheet(); toast(`Sent to ${w === "Both" ? "Priya Raman and Daniel Osei" : w}.`) }
  })
}
Q("#share").onclick = () => openSheet(`<h3>Share ${esc(CUR.title)}</h3><p class="sub">Hiring managers see the plan and the people you saved, and can leave reviews. Nothing else in Zeus.</p>
  <ul class="ckl"><li><input type="checkbox" checked><b>Priya Raman</b><span>Hiring manager</span></li><li><input type="checkbox" ${CUR.id === "quant" ? "checked" : ""}><b>Daniel Osei</b><span>Hiring manager</span></li></ul>
  <label>Invite someone else<input class="inp" placeholder="name@quanta.cloud"></label>
  <footer><button class="b2" data-close>Cancel</button><button class="pri" id="shgo">Share</button></footer>`, () => Q("#shgo").onclick = () => { closeSheet(); toast("Shared. They'll get a link to this job.") })

// ---------- challenges ----------
const STAGES = ["Submitted", "Needs information", "Approved", "In progress", "Results ready", "Closed"]
const CHAL = [
  { id: "hunt", title: "Probability puzzle hunt", job: "quant", stage: 4, owner: "Ana Ruiz", meta: "Online, timed, three hours · University students 18 and over · Ran Nov 8", next: "Look through the 38 people who agreed to share their results with you.", wait: "You", act: "See results" },
  { id: "sys", title: "Storage systems design sprint", prog: "2027 new grad program", stage: 3, owner: "Ana Ruiz", meta: "Online, take-home, one week · New grads 18 and over · Runs until Dec 3", next: "The organizer scores submissions after Dec 3. Results usually land within a week.", wait: "Organizer" },
  { id: "build", title: "Embedded robotics build-off", job: "hw", stage: 1, owner: "Sam Lee", meta: "In person, two days · University robotics teams 18 and over · Planned for February", next: "Pantheon needs a reviewer and how you plan to use the results.", wait: "You", act: "Add details" },
]
const HUNT = [["Yusuf Adeyemi", 3, "USACO 2024 Platinum"], ["Clara Hoffmann", 5, ""], ["Ibrahim Saleh", 7, "IOI 2023 Silver"], ["Marcus E. Abara", 9, "IOI 2022 Gold"], ["Elena Petrova", 12, ""], ["Jun Park", 14, "USACO 2025 Gold"], ["Sofia Marin", 18, ""], ["Theo Grant", 21, "IOI 2022 Bronze"]]
function showChallenges(id) {
  show("challenges"); const el = Q("#challenges")
  if (id === "hunt") return huntPage(el)
  el.innerHTML = `<div class="pbar2"><b>Challenges</b><span class="sp"></span><button class="pri" id="newch">Request a challenge</button></div>
    <div class="pscroll"><div class="pin"><div class="jhead"><div><h2>Challenges</h2><p>Ask Pantheon to run a contest that shows the skill you need. Results arrive as verified records, and only people who agree to share appear by name.</p></div></div>
    <div class="cards" id="cards">${CHAL.map(chalCard).join("")}</div></div></div>`
  wireCards(); riseIn(QA("#challenges .pin > *, #cards > *"), 60)
  Q("#newch").onclick = chalSheet
}
function chalCard(c) {
  const link = c.job ? `<a href="#job/${c.job}">${esc(JOBS[c.job].title)}</a>` : esc(c.prog)
  return `<article class="card chal" data-id="${c.id}"><header><div><h3>${esc(c.title)}</h3><p class="meta">For ${link} · owner ${c.owner}</p></div></header>
    <p class="meta">${esc(c.meta)}</p>
    <ol class="stg"><span class="ln"><div></div></span>${STAGES.map((s, i) => `<li class="${i < c.stage ? "done" : i === c.stage ? "now" : ""}"><i></i><span>${s}</span></li>`).join("")}</ol>
    <div class="nxt"><p><span>Next</span> · ${esc(c.next)}</p><span class="who ${c.wait === "You" ? "you" : ""}">Waiting on ${c.wait === "You" ? "you" : c.wait.toLowerCase() === "organizer" ? "the organizer" : c.wait}</span>${c.act ? `<button class="b2" data-act="${c.id}">${c.act}</button>` : ""}</div></article>`
}
function wireCards(fresh) {
  QA("#cards .chal").forEach(card => {
    const c = CHAL.find(x => x.id === card.dataset.id), ln = card.querySelector(".ln div"), to = (c.stage / 5 * 100) + "%"
    if (reduce) ln.style.width = to
    else ln.animate([{ width: "0%" }, { width: to }], { duration: 900 + c.stage * 120, delay: fresh && fresh !== c.id ? 0 : 200, easing: "cubic-bezier(.4,0,.2,1)", fill: "forwards" })
    const b = card.querySelector("[data-act]"); if (b) b.onclick = () => c.id === "hunt" ? nav("#challenges/hunt") : detailsSheet(c)
  })
}
function detailsSheet(c) {
  openSheet(`<h3>Add details for ${esc(c.title)}</h3><p class="sub">Pantheon and the organizer need these before they approve the challenge.</p>
    <div class="grid2"><label>Reviewer<select class="sel"><option>Sam Lee</option><option>Priya Raman</option><option>Daniel Osei</option></select></label><label>How you'll use the results<select class="sel"><option>Sourcing for ${esc(JOBS[c.job].title)}</option><option>Sourcing for a future program</option></select></label></div>
    <footer><button class="b2" data-close>Cancel</button><button class="pri" id="dgo">Send to Pantheon</button></footer>`, () => Q("#dgo").onclick = () => {
    c.wait = "Pantheon"; c.next = "Pantheon checks your answers with the organizer, usually within two working days."; c.act = ""; closeSheet(); toast("Sent. Pantheon has what it needs."); showChallenges()
  })
}
function chalSheet() {
  const jobs = ORDER.filter(id => JOBS[id]).map(id => `<option value="${id}">${esc(JOBS[id].title)}</option>`).join("")
  openSheet(`<h3>Request a challenge</h3><p class="sub">Tell Pantheon what you want to see people do. Pantheon and the organizer design it with you, and you approve the final version.</p>
    <label>What skill do you want to see?<textarea class="ta" id="cskill" rows="3" placeholder="e.g. designing a storage system under a tight memory budget"></textarea></label>
    <div class="grid2"><label>For<select class="sel" id="cjob">${jobs}<option value="">A future hiring program</option></select></label><label>Who takes part<select class="sel"><option>University students 18 and over</option><option>New grads 18 and over</option></select></label>
    <label>Format<select class="sel"><option>Online, timed</option><option>Online, take-home</option><option>In person</option></select></label><label>When<input class="inp" placeholder="e.g. Spring 2027"></label></div>
    <footer><span class="fine">Only people who agree to share with ${ORG} ever appear to you by name.</span><button class="b2" data-close>Cancel</button><button class="pri" id="cgo" disabled>Send request</button></footer>`, () => {
    const t = Q("#cskill"), g = Q("#cgo"); t.oninput = () => g.disabled = t.value.trim().length < 6
    g.onclick = () => {
      const sk = t.value.trim().replace(/^\w/, x => x.toUpperCase()), job = Q("#cjob").value
      const c = { id: "c" + Date.now() % 10000, title: sk.length > 48 ? sk.slice(0, 46).replace(/\s\S*$/, "") + "…" : sk, job: job || null, prog: job ? "" : "A future hiring program", stage: 0, owner: ME, meta: "Format and dates to be agreed with the organizer", next: "Pantheon reviews your request, usually within two working days.", wait: "Pantheon" }
      CHAL.unshift(c); closeSheet(); showChallenges()
      const card = Q(`.chal[data-id="${c.id}"]`); if (card && !reduce) card.animate([{ opacity: 0, transform: "translateY(-10px) scale(.98)", boxShadow: `0 0 0 3px ${cssv("--sel")}` }, { opacity: 1, transform: "none" }], { duration: 600, easing: EASE })
      toast("Request sent to Pantheon.")
    }
  })
}
function huntPage(el) {
  const c = CHAL[CHAL.findIndex(x => x.id === "hunt")], J = JOBS.quant
  el.innerHTML = `<div class="pbar2"><a class="crumb" href="#challenges">Challenges</a><span class="crumb">/</span><b>${c.title}</b></div>
    <div class="pscroll"><div class="pin">
      <div class="jhead"><div><h2>${c.title}</h2><p>For <a href="#job/quant" style="color:inherit">${J.title}</a>. Scored on rubric v2. Results finalized by the organizer on Nov 12.</p></div></div>
      <div class="cfield"><canvas id="hcv"></canvas><p class="cap"><b id="hn">0</b>agreed to share their results with ${ORG}, out of 212 who took part</p><div class="flegend"><span><i style="background:var(--acc)"></i>Agreed to share with you</span><span><i style="background:var(--focus)"></i>Counted in totals only</span></div></div>
      <div class="tw"><table class="hunt"><thead><tr><th>Name</th><th>Place</th><th>Other verified results</th><th></th></tr></thead><tbody>
        ${HUNT.map(([n, pl, o]) => { const on = J.people.some(p => p.name === n && p.status); return `<tr class="r" data-n="${n}" data-p="${pl}"><td class="n">${n}</td><td>${ord(pl)} <span class="d">of 212</span> <span class="vt" title="Organizer verified">✓</span></td><td class="d">${o || "None yet"}</td><td class="act">${on ? `<span class="on2">On the shortlist · result added</span>` : `<button class="b2" data-add>Add to shortlist</button>`}</td></tr>` }).join("")}
      </tbody></table></div>
      <p class="fine" style="color:var(--faint);font-size:12px">Showing the top 8 of the 38 who agreed to share. People who took part without agreeing appear only in the totals above; Zeus never shows their names or places.</p>
    </div></div>`
  riseIn(QA("#challenges .pin > *"), 70)
  tick(Q("#hn"), 38)
  huntField(Q("#hcv"))
  QA("#challenges tr.r").forEach(tr => {
    tr.onmouseenter = () => HF.hi = +tr.dataset.p; tr.onmouseleave = () => HF.hi = 0
    const b = tr.querySelector("[data-add]"); if (b) b.onclick = () => {
      const n = tr.dataset.n, pl = +tr.dataset.p
      J.people.push({ name: n, place: pl, of: 212, comp: "Puzzle hunt", event: c.title, year: 2026, medal: "Organizer verified", ver: "Organizer verified", seasons: [2026], g: 1, status: "Saved", avail: "Jun–Aug" })
      b.outerHTML = `<span class="on2">Added to ${J.title}</span>`; pop(tr.querySelector(".on2")); toast(`${n} added to the shortlist, with the challenge as the source.`)
    }
  })
}
// the challenge field: every participant a dot, placed by finish; only those who agreed to share light up
const HF = { hi: 0 }
function huntField(cv) {
  const ctx = cv.getContext("2d"), d = Math.min(2, devicePixelRatio || 1), W = cv.clientWidth, H = cv.clientHeight; cv.width = W * d; cv.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0)
  const N = 212, share = new Set(HUNT.map(h => h[1])); let k = 0; for (let i = 1; i <= N && share.size < 38; i++) if ((i * 7919) % 13 < 2 || i <= 2) share.add(i)
  const cx = W * (phone() ? .5 : .62), cy = H * .5, c = Math.min(W * (phone() ? .44 : .3), H * .44) / Math.sqrt(N), t0 = performance.now()
  const draw = t => {
    if (!cv.isConnected) return; ctx.clearRect(0, 0, W, H); k = reduce ? 1 : Math.min(1, (t - t0) / 1400)
    for (let i = 0; i < N; i++) {
      const q = i + .5, e = io3(clamp(k * 1.4 - i / N * .4)), r = c * Math.sqrt(q) * e, a = q * GA + (1 - e) * 2 + (reduce ? 0 : t * .00003), on = share.has(i + 1), hi = HF.hi === i + 1
      const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a)
      ctx.beginPath(); ctx.arc(x, y, on ? 3.2 : 2.2, 0, 6.283); ctx.fillStyle = on ? `rgba(${DOT},${.85 * e})` : `rgba(${DOT},${.14 * e})`; ctx.fill()
      if (hi) { const p = (Math.sin(t * .006) + 1) / 2; ctx.beginPath(); ctx.arc(x, y, 8 + p * 5, 0, 6.283); ctx.strokeStyle = `rgba(${DOT},${.5 - p * .3})`; ctx.lineWidth = 1.2; ctx.stroke() }
    }
    requestAnimationFrame(draw)
  }
  requestAnimationFrame(draw)
}

// ---------- settings ----------
const MEMBERS = [["Ana Ruiz", "Admin and recruiter", "All jobs", "Active", true], ["Sam Lee", "Recruiter", "Hardware Intern, Robotics", "Active"], ["Priya Raman", "Hiring manager", "Quant Research Intern, shared shortlist only", "Active"], ["Daniel Osei", "Hiring manager", "Quant Research Intern, shared shortlist only", "Active"], ["kai.mendes@quanta.cloud", "Recruiter", "None yet", "Invited Nov 23"]]
const LOG = [["Today 9:41", "Priya Raman opened Vivek Bergstrom's record", "Quant Research Intern"], ["Today 9:12", "Daniel Osei tried to open a record outside his shared shortlist", "Quant Research Intern", 1], ["Nov 23", "You invited kai.mendes@quanta.cloud as a recruiter", "Workspace"], ["Nov 22", "You requested an introduction to Rosa N. Chen", "Quant Research Intern"], ["Nov 21", "Priya Raman reviewed 3 people", "Quant Research Intern"], ["Nov 20", "You changed the plan to v2", "Quant Research Intern"], ["Nov 19", "Sam Lee was given access to Hardware Intern, Robotics", "Workspace"]]
const STABS = ["Members", "Jobs", "Policies", "Access activity", "Hiring systems"]
let STAB = 0
function showSettings() {
  show("settings"); const el = Q("#settings"), first = !el.firstChild
  if (first) el.innerHTML = `<div class="pbar2"><b>Settings</b><span class="crumb">${ORG}</span><span class="sp"></span><button class="pri" id="inv">Invite someone</button></div><div class="pscroll"><div class="pin"><div class="ptabs" id="stabs"></div><div id="sbody"></div></div></div>`
  const tabs = Q("#stabs"), old = tabs.querySelector(".tab.on")
  tabs.innerHTML = `<span class="tpill"></span>` + STABS.map((t, i) => `<button class="tab ${i === STAB ? "on" : ""}" data-i="${i}">${t}</button>`).join("")
  const pl = tabs.querySelector(".tpill"), on = tabs.querySelector(".tab.on"), from = old && tabs.querySelector(`.tab[data-i="${old.dataset.i}"]`)
  if (from && from !== on && !reduce) { pl.style.transition = "none"; pl.style.left = from.offsetLeft + "px"; pl.style.width = from.offsetWidth + "px"; void pl.offsetWidth; pl.style.transition = "" }
  pl.style.left = on.offsetLeft + "px"; pl.style.width = on.offsetWidth + "px"
  tabs.querySelectorAll(".tab").forEach(b => b.onclick = () => { STAB = +b.dataset.i; showSettings() })
  Q("#inv").onclick = () => { STAB = 0; showSettings(); inviteRow() }
  const sb = Q("#sbody")
  if (STAB === 0) sb.innerHTML = `<div class="tw"><div id="invhost"></div><table><thead><tr><th>Name</th><th>Role</th><th>Can open</th><th>Status</th></tr></thead><tbody>${MEMBERS.map(([n, r, j, s, me]) => `<tr><td class="n">${esc(n)}${me ? ` <span class="d">· you</span>` : ""}</td><td>${r}</td><td class="d">${j}</td><td>${s === "Active" ? `<span class="d">Active</span>` : `<span class="pill">${s}</span>`}</td></tr>`).join("")}</tbody></table></div>
    <p style="color:var(--faint);font-size:12px">Everyone starts with no access. Admins give each person the jobs they work on; hiring managers only ever see the shortlists shared with them.</p>`
  else if (STAB === 1) sb.innerHTML = `<div class="tw"><table><thead><tr><th>Job</th><th>State</th><th>Owner</th><th>Recruiters</th><th>Hiring managers</th></tr></thead><tbody>${ORDER.map(id => JOBS[id]).map(J => `<tr><td class="n">${esc(J.title)}</td><td>${J.state === "Active" ? `<span class="pill live"><i class="dot"></i>Active</span>` : `<span class="pill">${J.state}</span>`}</td><td>${J.id === "hw" ? "Sam Lee" : "Ana Ruiz"}</td><td class="d">${J.id === "hw" ? "Sam Lee, Ana Ruiz" : "Ana Ruiz"}</td><td class="d">${J.id === "quant" ? "Priya Raman, Daniel Osei" : "None"}</td></tr>`).join("")}</tbody></table></div>`
  else if (STAB === 2) sb.innerHTML = `<dl class="kv2">${[["Who Zeus searches", "Adults who opted in to be found by employers and have at least one verified result", "Everyone else, including anyone under 18 or whose age isn't confirmed, never appears"], ["Never used to filter or sort", "Age, school, graduation year, or any protected trait", "Zeus also drops these if they're typed into a plan"], ["Introduction requests", "One per person per job", "And a 7-day gap between new requests from Quanta Cloud to the same person"], ["Unanswered requests", "Expire after 14 days", "A decline can't be asked again for the same job"], ["Pass for this job", "Internal only", "Never sent to the person and never affects other jobs"], ["Email domains", "quanta.cloud", "Only people with this domain can be invited"]].map(([a, b, c]) => `<div><dt>${a}</dt><dd>${b}<small>${c}</small></dd></div>`).join("")}</dl>`
  else if (STAB === 3) sb.innerHTML = `<ul class="alog">${LOG.map(([t, a, j, deny]) => `<li class="${deny ? "deny" : ""}"><time>${t}</time><span>${a}</span><em>${j}</em></li>`).join("")}</ul><p style="color:var(--faint);font-size:12px">Admins see every record opened and every access change. Kept for 12 months.</p>`
  else sb.innerHTML = `<dl class="kv2"><div><dt>Greenhouse</dt><dd>Not connected<small>A direct connection comes after the pilot. Until then, use Record handoff on an accepted introduction.</small></dd></div><div><dt>Handoffs so far</dt><dd>${INTROS.filter(i => i.handoff).length || "None"}<small>Every handoff is logged with who, what and where.</small></dd></div></dl>`
  riseIn(sb.children, 50)
}
function inviteRow() {
  const h = Q("#invhost"); if (!h || h.firstChild) return
  h.innerHTML = `<div class="invite"><input class="inp" id="iem" placeholder="name@quanta.cloud"><select class="sel" id="irole"><option>Recruiter</option><option>Hiring manager</option><option>Admin</option></select><button class="b2" id="icx">Cancel</button><button class="pri" id="igo">Send invite</button></div>`
  if (!reduce) h.firstChild.animate([{ opacity: 0, transform: "translateY(-6px)" }, { opacity: 1, transform: "none" }], { duration: 260, easing: EASE })
  Q("#iem").focus(); Q("#icx").onclick = () => h.innerHTML = ""
  Q("#igo").onclick = () => { const v = Q("#iem").value.trim(); if (!/@quanta\.cloud$/i.test(v)) { toast("Only quanta.cloud addresses can be invited."); return } MEMBERS.push([v, Q("#irole").value, "None yet", "Invited today"]); LOG.unshift(["Just now", `You invited ${v} as a ${Q("#irole").value.toLowerCase()}`, "Workspace"]); showSettings(); toast(`Invite sent to ${v}.`) }
}

// ---------- start ----------
seedJobs(); renderSide()
Q("#ndot").hidden = false
route()
