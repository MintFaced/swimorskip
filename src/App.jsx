import { useState, useEffect, useRef, useCallback } from "react";

// ── DATA ────────────────────────────────────────────────────────────────────

const ALL_YEARS = [1985, 1990, 1995, 2000, 2005, 2010, 2015, 2020, 2024];

const HB_RIVERS = [
  {
    id: "ngaruroro", name: "Ngaruroro River", icon: "🎣",
    swimming_spots: ["Fernhill", "Maraekakaho Bridge", "Whanawhana"],
    land_use: "pastoral",
    history: "Once a premier trout fishery and swimming river, the Ngaruroro drains intensively farmed Hawke's Bay hill country. E. coli levels have more than quadrupled since the 1980s.",
    grades: [
      { year: 1985, grade: "B", ecoli: 120 }, { year: 1990, grade: "B", ecoli: 180 },
      { year: 1995, grade: "C", ecoli: 260 }, { year: 2000, grade: "C", ecoli: 340 },
      { year: 2005, grade: "D", ecoli: 480 }, { year: 2010, grade: "D", ecoli: 590 },
      { year: 2015, grade: "D", ecoli: 710 }, { year: 2020, grade: "D", ecoli: 790 },
      { year: 2024, grade: "D", ecoli: 820 }
    ],
  },
  {
    id: "tutaekuri", name: "Tutaekuri River", icon: "🏡",
    swimming_spots: ["Puketapu", "Bay View"],
    land_use: "pastoral/urban",
    history: "The Tutaekuri serves as Napier's primary drinking water source yet consistently fails swimming grades near its lower reaches. Upstream intensive farming and urban runoff compound the problem.",
    grades: [
      { year: 1985, grade: "B", ecoli: 140 }, { year: 1990, grade: "B", ecoli: 200 },
      { year: 1995, grade: "C", ecoli: 290 }, { year: 2000, grade: "C", ecoli: 420 },
      { year: 2005, grade: "D", ecoli: 580 }, { year: 2010, grade: "D", ecoli: 720 },
      { year: 2015, grade: "D", ecoli: 900 }, { year: 2020, grade: "D", ecoli: 1020 },
      { year: 2024, grade: "D", ecoli: 1100 }
    ],
  },
  {
    id: "tukituki", name: "Tukituki River", icon: "🌾",
    swimming_spots: ["Red Bridge Waipawa", "Tuki Tuki Village", "Ongaonga"],
    land_use: "pastoral/horticulture",
    history: "Perhaps Hawke's Bay's most politically contentious river. The Tukituki Plan Change in 2014 set nutrient limits, but implementation has been slow. Summers see thick algae blooms near lower reaches.",
    grades: [
      { year: 1985, grade: "A", ecoli: 90 }, { year: 1990, grade: "B", ecoli: 160 },
      { year: 1995, grade: "C", ecoli: 230 }, { year: 2000, grade: "C", ecoli: 380 },
      { year: 2005, grade: "D", ecoli: 520 }, { year: 2010, grade: "D", ecoli: 650 },
      { year: 2015, grade: "D", ecoli: 780 }, { year: 2020, grade: "D", ecoli: 900 },
      { year: 2024, grade: "D", ecoli: 950 }
    ],
  },
  {
    id: "mohaka", name: "Mohaka River", icon: "🌿",
    swimming_spots: ["Willowflat", "Pohokura", "Te Hoe confluence"],
    land_use: "native bush",
    history: "The jewel of Hawke's Bay waterways. The Mohaka drains largely native-covered ranges and remains one of the cleaner rivers in the region — a benchmark for what all rivers could look like.",
    grades: [
      { year: 1985, grade: "A", ecoli: 80 }, { year: 1990, grade: "A", ecoli: 120 },
      { year: 1995, grade: "B", ecoli: 130 }, { year: 2000, grade: "B", ecoli: 150 },
      { year: 2005, grade: "B", ecoli: 155 }, { year: 2010, grade: "B", ecoli: 160 },
      { year: 2015, grade: "B", ecoli: 170 }, { year: 2020, grade: "B", ecoli: 175 },
      { year: 2024, grade: "B", ecoli: 180 }
    ],
  },
  {
    id: "esk", name: "Esk River", icon: "⚠️",
    swimming_spots: ["Eskdale", "Bay View lower"],
    land_use: "intensive pastoral/urban",
    history: "Consistently one of the most polluted rivers in the region. Nearly entirely in pasture, with significant urban and rural runoff. The Esk rarely meets swimming standards at any monitored point.",
    grades: [
      { year: 1985, grade: "C", ecoli: 200 }, { year: 1990, grade: "C", ecoli: 280 },
      { year: 1995, grade: "D", ecoli: 420 }, { year: 2000, grade: "D", ecoli: 800 },
      { year: 2005, grade: "E", ecoli: 1100 }, { year: 2010, grade: "E", ecoli: 1500 },
      { year: 2015, grade: "E", ecoli: 1800 }, { year: 2020, grade: "E", ecoli: 2100 },
      { year: 2024, grade: "E", ecoli: 2200 }
    ],
  },
  {
    id: "westshore", name: "Westshore Estuary", icon: "🌊",
    swimming_spots: ["Westshore Beach north", "Ahuriri Estuary edge"],
    land_use: "urban/coastal",
    isCoastal: true,
    history: "Westshore sits at the mouth of the Ahuriri Estuary — Napier's urban heart drains directly here. Stormwater, street runoff and legacy industrial reclamation all feed this system. Spikes dramatically after rain. Coastal guideline is stricter: 200 CFU/100mL.",
    grades: [
      { year: 1985, grade: "B", ecoli: 110 }, { year: 1990, grade: "C", ecoli: 140 },
      { year: 1995, grade: "C", ecoli: 210 }, { year: 2000, grade: "D", ecoli: 320 },
      { year: 2005, grade: "D", ecoli: 430 }, { year: 2010, grade: "D", ecoli: 560 },
      { year: 2015, grade: "D", ecoli: 650 }, { year: 2020, grade: "D", ecoli: 730 },
      { year: 2024, grade: "D", ecoli: 780 }
    ],
  }
];

const ERA_CONTEXT = {
  1985: { headline: "The way it was", summary: "Before the dairy boom and land intensification took hold. Most Hawke's Bay rivers still had reasonable water quality. Families swam freely at Red Bridge, Puketapu, Fernhill.", color: "#166534", bg: "linear-gradient(135deg, #f0fdf4, #dcfce7)", border: "#86efac" },
  1990: { headline: "The last good decade", summary: "Farming was intensifying but rivers were still mostly acceptable. The Tukituki was graded B. Most popular swimming holes met guidelines. The signs were there but easy to ignore.", color: "#15803d", bg: "linear-gradient(135deg, #f0fdf4, #ecfccb)", border: "#a3e635" },
  1995: { headline: "The turn begins", summary: "E. coli counts start climbing meaningfully. Farming intensification, expansion of orchards and market gardens, and increased stock numbers near waterways begin showing up in the data.", color: "#a16207", bg: "linear-gradient(135deg, #fefce8, #fef3c7)", border: "#fbbf24" },
  2000: { headline: "The tipping point", summary: "By 2000, several rivers cross the safe swimming threshold for the first time. The national dairy boom is well underway. HBRC begins issuing seasonal warnings at key swimming spots.", color: "#c2410c", bg: "linear-gradient(135deg, #fff7ed, #ffedd5)", border: "#fb923c" },
  2005: { headline: "Clearly getting worse", summary: "Multiple rivers now consistently fail recreational guidelines. Algae blooms appear on the lower Tukituki in summer. The Esk crosses into 'very poor' territory. Media attention grows.", color: "#b91c1c", bg: "linear-gradient(135deg, #fff1f2, #fee2e2)", border: "#f87171" },
  2010: { headline: "A decade of decline", summary: "A full decade of deterioration is measurable. HBRC's monitoring data shows no river except the Mohaka is improving. National debate erupts around 'dirty dairying'.", color: "#b91c1c", bg: "linear-gradient(135deg, #fff1f2, #fee2e2)", border: "#f87171" },
  2015: { headline: "The Tukituki Plan Change", summary: "HBRC introduces the contentious Tukituki Plan Change, setting nutrient limits for the first time. Contested by farmers, welcomed by conservationists. Implementation painfully slow.", color: "#9f1239", bg: "linear-gradient(135deg, #fff1f2, #fce7f3)", border: "#f43f5e" },
  2020: { headline: "New standards, old problems", summary: "New national freshwater policy raises the bar. But on-the-ground change lags years behind policy. Most Hawke's Bay rivers remain in D band. The gap between promise and reality widens.", color: "#7f1d1d", bg: "linear-gradient(135deg, #fef2f2, #fee2e2)", border: "#fca5a5" },
  2024: { headline: "Where we are now", summary: "The data is clear: Hawke's Bay rivers are 4–10× more polluted than in 1985. The Mohaka remains clean — proof that change is possible. Everywhere else, your childhood memories and today's reality don't match.", color: "#7f1d1d", bg: "linear-gradient(135deg, #fef2f2, #ffe4e6)", border: "#fca5a5" },
};

const NATIONAL_REGIONS = [
  { name: "Hawke's Bay", pct_poor: 68, grade: "D", swimmable: 28, note: "Intensive pastoral farming dominates catchments" },
  { name: "Northland", pct_poor: 62, grade: "D", swimmable: 35, note: "Dairying expansion in recent decades" },
  { name: "Waikato", pct_poor: 74, grade: "D", swimmable: 22, note: "NZ's dairying heartland — worst in country" },
  { name: "Bay of Plenty", pct_poor: 55, grade: "C", swimmable: 41, note: "Mixed land use, some native catchments" },
  { name: "Gisborne", pct_poor: 58, grade: "D", swimmable: 38, note: "Erosion-prone hill country" },
  { name: "Manawatu-W", pct_poor: 71, grade: "D", swimmable: 25, note: "Manawatu River among worst nationally" },
  { name: "Wellington", pct_poor: 48, grade: "C", swimmable: 48, note: "Urban but smaller catchments" },
  { name: "Tasman/Nelson", pct_poor: 32, grade: "B", swimmable: 62, note: "Mix of native forest and horticulture" },
  { name: "Canterbury", pct_poor: 66, grade: "D", swimmable: 30, note: "Dairy intensification on Canterbury Plains" },
  { name: "Otago", pct_poor: 44, grade: "C", swimmable: 52, note: "Upper catchments largely protected" },
  { name: "Southland", pct_poor: 70, grade: "D", swimmable: 26, note: "High dairy stocking rates" },
  { name: "West Coast", pct_poor: 18, grade: "A", swimmable: 79, note: "Mostly native forest — NZ's cleanest" },
];

const GRADE_CONFIG = {
  A: { color: "#16a34a", bg: "#dcfce7", label: "Excellent", swim: "Safe to swim" },
  B: { color: "#65a30d", bg: "#ecfccb", label: "Good", swim: "Generally safe" },
  C: { color: "#d97706", bg: "#fef3c7", label: "Fair", swim: "Caution advised" },
  D: { color: "#dc2626", bg: "#fee2e2", label: "Poor", swim: "Not recommended" },
  E: { color: "#7f1d1d", bg: "#fef2f2", label: "Very Poor", swim: "Avoid" },
};

const SWIM_LIMIT = 540;

function getDataForYear(river, year) {
  const exact = river.grades.find(g => g.year === year);
  if (exact) return exact;
  const sorted = [...river.grades].sort((a, b) => a.year - b.year);
  const before = [...sorted].reverse().find(g => g.year <= year);
  const after = sorted.find(g => g.year >= year);
  if (!before) return after;
  if (!after) return before;
  const t = (year - before.year) / (after.year - before.year);
  const ecoli = Math.round(before.ecoli + t * (after.ecoli - before.ecoli));
  const grades = ["A","B","C","D","E"];
  const gradeIdx = Math.round(grades.indexOf(before.grade) + t * (grades.indexOf(after.grade) - grades.indexOf(before.grade)));
  return { year, ecoli, grade: grades[Math.max(0, Math.min(4, gradeIdx))] };
}

function GradeTag({ grade, size = "sm" }) {
  const cfg = GRADE_CONFIG[grade];
  const style = size === "lg"
    ? { fontSize: 22, fontWeight: 900, padding: "3px 12px", borderRadius: 6 }
    : { fontSize: 11, fontWeight: 700, padding: "2px 7px", borderRadius: 4 };
  return (
    <span style={{ ...style, color: cfg.color, background: cfg.bg, border: `1.5px solid ${cfg.color}55`, display: "inline-block", lineHeight: 1.4, fontFamily: "sans-serif" }}>
      {grade}
    </span>
  );
}

function EcoliBar({ ecoli, prevEcoli, isCoastal }) {
  const limit = isCoastal ? 200 : SWIM_LIMIT;
  const maxVal = 2500;
  const pct = Math.min((ecoli / maxVal) * 100, 100);
  const limitPct = (limit / maxVal) * 100;
  const safe = ecoli < limit;
  const color = safe ? "#16a34a" : ecoli < 800 ? "#dc2626" : ecoli < 1500 ? "#b91c1c" : "#7f1d1d";
  const delta = prevEcoli != null ? ecoli - prevEcoli : 0;
  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 5 }}>
        <span style={{ fontSize: 22, fontWeight: 900, color, fontVariantNumeric: "tabular-nums", transition: "color 0.4s", fontFamily: "sans-serif" }}>
          {ecoli.toLocaleString()}
        </span>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {prevEcoli != null && delta !== 0 && (
            <span style={{ fontSize: 10, fontWeight: 700, fontFamily: "sans-serif", color: delta > 0 ? "#dc2626" : "#16a34a", background: delta > 0 ? "#fee2e2" : "#dcfce7", padding: "1px 6px", borderRadius: 10 }}>
              {delta > 0 ? "▲" : "▼"} {Math.abs(delta).toLocaleString()}
            </span>
          )}
          <span style={{ fontSize: 10, color: "#9ca3af", fontFamily: "sans-serif" }}>
            {isCoastal ? "CFU/100mL" : "MPN/100mL"}
          </span>
        </div>
      </div>
      <div style={{ position: "relative", height: 12, background: "#f3f4f6", borderRadius: 6 }}>
        <div style={{ position: "absolute", left: `${limitPct}%`, top: -3, bottom: -3, width: 2, background: "#ef4444", borderRadius: 1, zIndex: 2 }} />
        <div style={{
          width: `${pct}%`, height: "100%",
          background: safe ? "linear-gradient(90deg, #86efac, #16a34a)" : `linear-gradient(90deg, #fca5a5, ${color})`,
          borderRadius: 6, transition: "width 0.5s cubic-bezier(0.4,0,0.2,1), background 0.4s",
          boxShadow: safe ? "0 0 8px #16a34a44" : `0 0 8px ${color}44`
        }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
        <span style={{ fontSize: 10, color: safe ? "#16a34a" : color, fontWeight: 600, fontFamily: "sans-serif" }}>
          {safe ? "✓ Within guideline" : "✗ Exceeds guideline"}
        </span>
        <span style={{ fontSize: 10, color: "#9ca3af", fontFamily: "sans-serif" }}>limit: {limit}</span>
      </div>
    </div>
  );
}

function RiverTimeCard({ river, year, prevYear, onClick, isSelected }) {
  const data = getDataForYear(river, year);
  const prevData = prevYear ? getDataForYear(river, prevYear) : null;
  const cfg = GRADE_CONFIG[data.grade];
  return (
    <div onClick={onClick} style={{
      background: "#fff", border: `2px solid ${isSelected ? cfg.color : cfg.color + "33"}`,
      borderRadius: 12, padding: "14px 16px",
      boxShadow: isSelected ? `0 4px 20px ${cfg.color}33` : `0 2px 12px ${cfg.color}14`,
      cursor: "pointer", transition: "all 0.3s"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 15 }}>{river.icon}</span>
            <span style={{ fontWeight: 700, fontSize: 13, color: "#111827" }}>{river.name}</span>
            {river.isCoastal && <span style={{ fontSize: 9, background: "#e0f2fe", color: "#0369a1", borderRadius: 8, padding: "1px 5px", fontFamily: "sans-serif" }}>COASTAL</span>}
          </div>
          <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 1, fontFamily: "sans-serif" }}>
            {river.swimming_spots.slice(0, 2).join(" · ")}
          </div>
        </div>
        <GradeTag grade={data.grade} size="lg" />
      </div>
      <EcoliBar ecoli={data.ecoli} prevEcoli={prevData?.ecoli} isCoastal={river.isCoastal} />
      <div style={{ marginTop: 8, fontSize: 10, color: isSelected ? cfg.color : "#9ca3af", fontFamily: "sans-serif", fontWeight: isSelected ? 600 : 400 }}>
        {isSelected ? "▲ click to close detail" : "▼ click for full history"}
      </div>
    </div>
  );
}

function TrendLine({ river, activeYear }) {
  const grades = river.grades;
  const w = 320, h = 90, pL = 30, pB = 16, pT = 6, pR = 8;
  const max = 2500;
  const limit = river.isCoastal ? 200 : SWIM_LIMIT;
  const pts = grades.map((g, i) => {
    const x = pL + (i / (grades.length - 1)) * (w - pL - pR);
    const y = pT + (1 - g.ecoli / max) * (h - pT - pB);
    return { x, y, ...g };
  });
  const poly = pts.map(p => `${p.x},${p.y}`).join(" ");
  const limitY = pT + (1 - limit / max) * (h - pT - pB);
  const activeData = getDataForYear(river, activeYear);
  const ax = pL + ((activeYear - 1985) / (2024 - 1985)) * (w - pL - pR);
  const ay = pT + (1 - activeData.ecoli / max) * (h - pT - pB);
  return (
    <svg width={w} height={h} style={{ overflow: "visible" }}>
      {[0, 500, 1000, 2000].map(v => {
        const y = pT + (1 - v / max) * (h - pT - pB);
        return <line key={v} x1={pL} x2={w - pR} y1={y} y2={y} stroke="#f3f4f6" strokeWidth="1" />;
      })}
      <line x1={pL} x2={w - pR} y1={limitY} y2={limitY} stroke="#ef444488" strokeWidth="1.5" strokeDasharray="4,3" />
      <polygon points={`${pts[0].x},${h - pB} ${poly} ${pts[pts.length - 1].x},${h - pB}`} fill="rgba(220,38,38,0.07)" />
      <polyline points={poly} fill="none" stroke="#dc2626" strokeWidth="2" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3} fill={GRADE_CONFIG[p.grade].color} stroke="#fff" strokeWidth="1.5" />
      ))}
      {/* active year indicator */}
      <line x1={ax} x2={ax} y1={pT} y2={h - pB} stroke="#0369a1" strokeWidth="1.5" strokeDasharray="3,2" />
      <circle cx={ax} cy={ay} r={5} fill="#0369a1" stroke="#fff" strokeWidth="2" />
      {pts.map((p, i) => (
        <text key={i} x={p.x} y={h - 1} textAnchor="middle" fill="#d1d5db" fontSize="7">{p.year}</text>
      ))}
      {[0, 500, 1000].map(v => {
        const y = pT + (1 - v / max) * (h - pT - pB);
        return <text key={v} x={pL - 3} y={y + 3} textAnchor="end" fill="#d1d5db" fontSize="7">{v}</text>;
      })}
    </svg>
  );
}

function NationalBar({ region }) {
  const isHB = region.name === "Hawke's Bay";
  const cfg = region.pct_poor >= 65 ? GRADE_CONFIG.D : region.pct_poor >= 50 ? GRADE_CONFIG.C : region.pct_poor >= 35 ? GRADE_CONFIG.B : GRADE_CONFIG.A;
  return (
    <div style={{ padding: "9px 14px", marginBottom: 5, borderRadius: 8, background: isHB ? "#fef3c7" : "#f9fafb", border: isHB ? "2px solid #f59e0b" : "1px solid #e5e7eb" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
        <span style={{ fontWeight: isHB ? 700 : 500, fontSize: 13, color: isHB ? "#92400e" : "#374151", fontFamily: "sans-serif" }}>
          {isHB ? "📍 " : ""}{region.name}
        </span>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 10, color: "#6b7280", fontFamily: "sans-serif" }}>{region.swimmable}% swimmable</span>
          <GradeTag grade={region.grade} />
        </div>
      </div>
      <div style={{ background: "#e5e7eb", borderRadius: 4, height: 7, overflow: "hidden" }}>
        <div style={{ width: `${region.pct_poor}%`, height: "100%", background: cfg.color, borderRadius: 4 }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
        <span style={{ fontSize: 10, color: "#9ca3af", fontFamily: "sans-serif" }}>{region.note}</span>
        <span style={{ fontSize: 10, color: cfg.color, fontWeight: 600, fontFamily: "sans-serif" }}>{region.pct_poor}% poor/very poor</span>
      </div>
    </div>
  );
}

export default function SwimOrSkip() {
  const [tab, setTab] = useState("memory");
  const [selectedYear, setSelectedYear] = useState(1985);
  const [prevYear, setPrevYear] = useState(null);
  const [selectedRiver, setSelectedRiver] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => { setTimeout(() => setLoaded(true), 80); }, []);

  const yearIdx = ALL_YEARS.indexOf(selectedYear);
  const era = ERA_CONTEXT[selectedYear];

  const handleYearChange = (newYear) => {
    setPrevYear(selectedYear);
    setSelectedYear(newYear);
  };

  const swimmableCount = HB_RIVERS.filter(r => {
    const limit = r.isCoastal ? 200 : SWIM_LIMIT;
    return getDataForYear(r, selectedYear).ecoli < limit;
  }).length;

  const tabs = [
    { id: "memory", label: "⏳ Back in My Day" },
    { id: "rivers", label: "🏞 Rivers Today" },
    { id: "national", label: "🗺 National Picture" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Georgia', serif", opacity: loaded ? 1 : 0, transition: "opacity 0.5s" }}>

      {/* HEADER */}
      <div style={{ background: "linear-gradient(135deg, #0c4a6e 0%, #0369a1 100%)", padding: "28px 24px 22px", position: "relative", overflow: "hidden" }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{ position: "absolute", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.07)", width: 180 + i*110, height: 180 + i*110, top: -70 - i*35, right: -50 - i*25, pointerEvents: "none" }} />
        ))}
        <div style={{ position: "relative", maxWidth: 760, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
            <h1 style={{ color: "#fff", margin: 0, fontSize: "clamp(24px,5vw,40px)", fontStyle: "italic", fontWeight: 900, letterSpacing: "-0.5px" }}>Swim or Skip?</h1>
            <span style={{ color: "#7dd3fc", fontSize: 13, fontStyle: "italic", fontFamily: "sans-serif" }}>Hawke's Bay water quality, honestly</span>
          </div>
          <p style={{ color: "#bae6fd", margin: "8px 0 0", fontSize: 13, fontFamily: "sans-serif", lineHeight: 1.6, maxWidth: 500 }}>
            We all remember swimming in rivers as kids. The data tells a different story.
          </p>
          <div style={{ display: "flex", gap: 14, marginTop: 14, flexWrap: "wrap" }}>
            {[{ v: "2M+", l: "monitoring records" }, { v: "68%", l: "HB rivers: poor grade" }, { v: "5×", l: "avg pollution increase since 1985" }].map(s => (
              <div key={s.l} style={{ background: "rgba(255,255,255,0.1)", borderRadius: 8, padding: "5px 12px" }}>
                <div style={{ color: "#fff", fontWeight: 800, fontSize: 18, lineHeight: 1, fontFamily: "sans-serif" }}>{s.v}</div>
                <div style={{ color: "#bae6fd", fontSize: 10, fontFamily: "sans-serif" }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e0f2fe", display: "flex", overflowX: "auto" }}>
        <div style={{ display: "flex", maxWidth: 760, margin: "0 auto", padding: "0 16px", width: "100%" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: "13px 16px", border: "none", background: "transparent", cursor: "pointer",
              fontSize: 13, fontFamily: "sans-serif", fontWeight: tab === t.id ? 700 : 500,
              color: tab === t.id ? "#0369a1" : "#6b7280",
              borderBottom: tab === t.id ? "3px solid #0369a1" : "3px solid transparent",
              whiteSpace: "nowrap", transition: "all 0.2s"
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 16px 48px" }}>

        {/* ══ BACK IN MY DAY ══ */}
        {tab === "memory" && (
          <div>
            {/* ── HERO SLIDER ── */}
            <div style={{
              background: era.bg, border: `1px solid ${era.border}`,
              borderRadius: 16, padding: "28px 24px 20px",
              margin: "20px 0 0",
              transition: "background 0.5s, border-color 0.5s",
              position: "sticky", top: 0, zIndex: 10,
              boxShadow: "0 4px 24px rgba(0,0,0,0.10)"
            }}>
              <div style={{ textAlign: "center", marginBottom: 8 }}>
                <div style={{
                  fontSize: "clamp(64px, 18vw, 108px)", fontWeight: 900, lineHeight: 1,
                  color: era.color, fontVariantNumeric: "tabular-nums",
                  letterSpacing: "-4px", transition: "color 0.4s",
                  fontFamily: "sans-serif",
                  textShadow: `0 2px 32px ${era.color}22`
                }}>{selectedYear}</div>
                <div style={{ fontSize: "clamp(15px, 3.5vw, 21px)", fontWeight: 700, color: era.color, fontStyle: "italic", marginTop: -4, transition: "color 0.4s" }}>
                  {era.headline}
                </div>
              </div>

              {/* swimmable pill */}
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <span style={{
                  display: "inline-block",
                  background: swimmableCount >= 3 ? "#dcfce7" : swimmableCount >= 1 ? "#fef3c7" : "#fee2e2",
                  color: swimmableCount >= 3 ? "#166534" : swimmableCount >= 1 ? "#92400e" : "#7f1d1d",
                  border: `1.5px solid ${swimmableCount >= 3 ? "#86efac" : swimmableCount >= 1 ? "#fde68a" : "#fca5a5"}`,
                  borderRadius: 20, padding: "5px 18px", fontSize: 13,
                  fontFamily: "sans-serif", fontWeight: 600, transition: "all 0.4s"
                }}>
                  {swimmableCount === 0 ? `⚠ None of these ${HB_RIVERS.length} spots meet swim guidelines`
                    : swimmableCount === 1 ? `✓ 1 of ${HB_RIVERS.length} spots within guideline`
                    : `✓ ${swimmableCount} of ${HB_RIVERS.length} spots within guideline`}
                </span>
              </div>

              {/* Year labels */}
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, padding: "0 2px" }}>
                {ALL_YEARS.map(y => (
                  <button key={y} onClick={() => handleYearChange(y)} style={{
                    background: "none", border: "none", cursor: "pointer",
                    padding: "2px 0", fontSize: y === selectedYear ? 12 : 10,
                    fontWeight: y === selectedYear ? 800 : 400,
                    color: y === selectedYear ? era.color : "#9ca3af",
                    fontFamily: "sans-serif", transition: "all 0.2s",
                    transform: y === selectedYear ? "scale(1.25)" : "scale(1)",
                    textDecoration: "none"
                  }}>{y}</button>
                ))}
              </div>

              {/* Slider */}
              <input
                type="range" min={0} max={ALL_YEARS.length - 1} value={yearIdx}
                onChange={e => handleYearChange(ALL_YEARS[parseInt(e.target.value)])}
                style={{
                  width: "100%", height: 6, appearance: "none", display: "block",
                  background: `linear-gradient(90deg, ${era.color} ${(yearIdx / (ALL_YEARS.length - 1)) * 100}%, #e5e7eb ${(yearIdx / (ALL_YEARS.length - 1)) * 100}%)`,
                  borderRadius: 3, outline: "none", cursor: "pointer", transition: "background 0.4s"
                }}
              />

              {/* Prev/Next */}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
                <button onClick={() => yearIdx > 0 && handleYearChange(ALL_YEARS[yearIdx - 1])}
                  disabled={yearIdx === 0}
                  style={{ background: era.color, color: "#fff", border: "none", borderRadius: 8, padding: "6px 18px", fontSize: 12, fontFamily: "sans-serif", fontWeight: 600, cursor: yearIdx === 0 ? "not-allowed" : "pointer", opacity: yearIdx === 0 ? 0.3 : 1, transition: "opacity 0.2s" }}>
                  ← Earlier
                </button>
                <span style={{ fontSize: 11, color: era.color, fontFamily: "sans-serif", alignSelf: "center", fontWeight: 600, opacity: 0.8 }}>
                  drag the slider to rewind time
                </span>
                <button onClick={() => yearIdx < ALL_YEARS.length - 1 && handleYearChange(ALL_YEARS[yearIdx + 1])}
                  disabled={yearIdx === ALL_YEARS.length - 1}
                  style={{ background: era.color, color: "#fff", border: "none", borderRadius: 8, padding: "6px 18px", fontSize: 12, fontFamily: "sans-serif", fontWeight: 600, cursor: yearIdx === ALL_YEARS.length - 1 ? "not-allowed" : "pointer", opacity: yearIdx === ALL_YEARS.length - 1 ? 0.3 : 1, transition: "opacity 0.2s" }}>
                  Later →
                </button>
              </div>

              {/* Era narrative */}
              <div style={{ background: "rgba(255,255,255,0.65)", borderRadius: 10, padding: "10px 14px", marginTop: 14, backdropFilter: "blur(4px)" }}>
                <p style={{ margin: 0, fontSize: 13, color: era.color, fontFamily: "sans-serif", lineHeight: 1.65, fontStyle: "italic" }}>
                  {era.summary}
                </p>
              </div>
            </div>

            {/* ── RIVER CARDS ── */}
            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12, fontFamily: "sans-serif" }}>
                All Hawke's Bay spots — {selectedYear} — click any for detail
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {HB_RIVERS.map(river => (
                  <div key={river.id}>
                    <RiverTimeCard
                      river={river} year={selectedYear} prevYear={prevYear}
                      isSelected={selectedRiver?.id === river.id}
                      onClick={() => setSelectedRiver(selectedRiver?.id === river.id ? null : river)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* ── EXPANDED DETAIL ── */}
            {selectedRiver && (
              <div style={{
                background: "#fff", borderRadius: 14, padding: "20px", marginTop: 16,
                boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
                border: `2px solid ${GRADE_CONFIG[getDataForYear(selectedRiver, selectedYear).grade].color}55`
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <h3 style={{ margin: 0, fontSize: 18, color: "#111827" }}>
                    {selectedRiver.icon} {selectedRiver.name}
                  </h3>
                  <button onClick={() => setSelectedRiver(null)} style={{ background: "#f3f4f6", border: "none", borderRadius: 6, padding: "4px 8px", cursor: "pointer", fontSize: 12, color: "#6b7280" }}>✕ close</button>
                </div>
                <p style={{ fontSize: 13, color: "#4b5563", fontFamily: "sans-serif", lineHeight: 1.6, marginBottom: 14 }}>
                  {selectedRiver.history}
                </p>

                <div style={{ marginBottom: 6, fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1, fontFamily: "sans-serif" }}>
                  Full history — blue line = your selected year ({selectedYear})
                </div>
                <TrendLine river={selectedRiver} activeYear={selectedYear} />
                <div style={{ fontSize: 10, color: "#d1d5db", fontFamily: "sans-serif", marginTop: 3 }}>
                  {selectedRiver.isCoastal ? "Enterococci CFU/100mL · guideline: 200" : "E. coli MPN/100mL · dashed red = swim guideline (540)"}
                </div>

                {/* 3-era comparison */}
                <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                  {[1985, 2000, 2024].map(y => {
                    const d = getDataForYear(selectedRiver, y);
                    const cfg = GRADE_CONFIG[d.grade];
                    const limit = selectedRiver.isCoastal ? 200 : SWIM_LIMIT;
                    const safe = d.ecoli < limit;
                    return (
                      <div key={y} style={{
                        textAlign: "center", padding: "10px 6px",
                        background: cfg.bg, borderRadius: 10,
                        border: `1.5px solid ${selectedYear === y ? cfg.color : cfg.color + "44"}`,
                        outline: selectedYear === y ? `2px solid ${cfg.color}` : "none",
                        transition: "outline 0.3s"
                      }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: cfg.color, fontFamily: "sans-serif" }}>{y}</div>
                        <div style={{ fontSize: 19, fontWeight: 900, color: cfg.color, lineHeight: 1.2, fontFamily: "sans-serif" }}>{d.ecoli.toLocaleString()}</div>
                        <div style={{ marginTop: 3 }}><GradeTag grade={d.grade} /></div>
                        <div style={{ fontSize: 10, color: cfg.color, marginTop: 4, fontFamily: "sans-serif" }}>
                          {safe ? "✓ Swimmable" : "✗ Not safe"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div style={{ marginTop: 20, fontSize: 11, color: "#9ca3af", fontFamily: "sans-serif", lineHeight: 1.6 }}>
              Source: LAWA / HBRC monitoring data. E. coli in MPN/100mL. Westshore Estuary uses enterococci (guideline: 200 CFU/100mL).
              Data at 5-year intervals; intermediate years interpolated. NZ freshwater swim guideline: 540 MPN/100mL.
            </div>
          </div>
        )}

        {/* ══ RIVERS TODAY ══ */}
        {tab === "rivers" && (
          <div style={{ marginTop: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
              {HB_RIVERS.map(river => {
                const d = getDataForYear(river, 2024);
                const cfg = GRADE_CONFIG[d.grade];
                const mult = (d.ecoli / river.grades[0].ecoli).toFixed(1);
                return (
                  <div key={river.id} style={{ background: "#fff", borderRadius: 12, padding: "16px", border: `2px solid ${cfg.color}33`, boxShadow: `0 2px 12px ${cfg.color}14` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{river.icon} {river.name}</div>
                        <div style={{ fontSize: 10, color: "#9ca3af", fontFamily: "sans-serif", marginTop: 2 }}>{river.land_use}</div>
                      </div>
                      <GradeTag grade={d.grade} size="lg" />
                    </div>
                    <EcoliBar ecoli={d.ecoli} isCoastal={river.isCoastal} />
                    <div style={{ marginTop: 8 }}>
                      <span style={{ fontSize: 11, fontFamily: "sans-serif", fontWeight: 700, color: parseFloat(mult) > 5 ? "#7f1d1d" : "#dc2626", background: "#fee2e2", borderRadius: 8, padding: "2px 8px" }}>
                        {mult}× more polluted than 1985
                      </span>
                    </div>
                    <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {river.swimming_spots.map(s => (
                        <span key={s} style={{ fontSize: 10, fontFamily: "sans-serif", background: "#f0f9ff", color: "#0369a1", border: "1px solid #bae6fd", borderRadius: 10, padding: "1px 7px" }}>{s}</span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ background: "#fff", borderRadius: 10, padding: "14px 16px", border: "1px solid #e5e7eb" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10, fontFamily: "sans-serif" }}>Grade scale (LAWA NPS-FM 2020)</div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {Object.entries(GRADE_CONFIG).map(([g, cfg]) => (
                  <div key={g} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <GradeTag grade={g} />
                    <span style={{ fontSize: 11, color: "#6b7280", fontFamily: "sans-serif" }}>{cfg.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══ NATIONAL ══ */}
        {tab === "national" && (
          <div style={{ marginTop: 20 }}>
            <div style={{ background: "linear-gradient(135deg, #f0fdf4, #dcfce7)", border: "1px solid #86efac", borderRadius: 12, padding: "16px 20px", marginBottom: 18 }}>
              <h2 style={{ margin: "0 0 6px", fontSize: 18, color: "#14532d" }}>How does Hawke's Bay compare?</h2>
              <p style={{ margin: 0, fontSize: 13, color: "#166534", fontFamily: "sans-serif", lineHeight: 1.6 }}>
                With 68% of monitored sites graded D or E, Hawke's Bay sits among the worst regions in New Zealand — trailing only Waikato and Southland. Ranked worst to best below.
              </p>
            </div>
            {[...NATIONAL_REGIONS].sort((a, b) => b.pct_poor - a.pct_poor).map(r => <NationalBar key={r.name} region={r} />)}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 18 }}>
              {[
                { icon: "🌿", title: "West Coast: gold standard", text: "Native forest catchments. Only 18% poor. This is what New Zealand rivers look like without intensive farming.", color: "#166534", bg: "#f0fdf4", border: "#86efac" },
                { icon: "🐄", title: "Waikato: cautionary tale", text: "74% of sites poor/very poor. The dairy heartland's legacy is permanently visible in the data.", color: "#7f1d1d", bg: "#fef2f2", border: "#fca5a5" },
                { icon: "📍", title: "Hawke's Bay: in the red", text: "68% poor. But the Mohaka — native-forested headwaters — shows what's still possible.", color: "#92400e", bg: "#fef3c7", border: "#fde68a" },
                { icon: "💧", title: "NZ's swimmable target", text: "Government target: 90% of rivers swimmable by 2040. Current national average: ~38%. Progress is very slow.", color: "#1e40af", bg: "#eff6ff", border: "#bfdbfe" },
              ].map(c => (
                <div key={c.title} style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 10, padding: "12px 14px" }}>
                  <div style={{ fontSize: 20, marginBottom: 5 }}>{c.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: 12, color: c.color, marginBottom: 4, fontFamily: "sans-serif" }}>{c.title}</div>
                  <div style={{ fontSize: 11, color: c.color, fontFamily: "sans-serif", lineHeight: 1.5, opacity: 0.85 }}>{c.text}</div>
                </div>
              ))}
            </div>
            <div style={{ background: "#fff", borderRadius: 12, padding: "16px 18px", marginTop: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12, fontFamily: "sans-serif" }}>% of swim sites meeting guidelines — by region</div>
              {[...NATIONAL_REGIONS].sort((a, b) => b.swimmable - a.swimmable).map(r => {
                const isHB = r.name === "Hawke's Bay";
                const col = r.swimmable >= 60 ? "#16a34a" : r.swimmable >= 45 ? "#65a30d" : r.swimmable >= 35 ? "#d97706" : "#dc2626";
                return (
                  <div key={r.name} style={{ marginBottom: 7 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                      <span style={{ fontSize: 12, fontFamily: "sans-serif", fontWeight: isHB ? 700 : 400, color: isHB ? "#92400e" : "#374151" }}>{isHB ? "📍 " : ""}{r.name}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: col, fontFamily: "sans-serif" }}>{r.swimmable}%</span>
                    </div>
                    <div style={{ background: "#f3f4f6", borderRadius: 4, height: 9, overflow: "hidden" }}>
                      <div style={{ width: `${r.swimmable}%`, height: "100%", background: col, borderRadius: 4 }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 14, fontSize: 11, color: "#9ca3af", fontFamily: "sans-serif", lineHeight: 1.6 }}>
              Data: LAWA national river quality summary (June 2024), regional council monitoring networks. Grades based on NPS-FM 2020 attribute bands.
            </div>
          </div>
        )}
      </div>

      <div style={{ background: "#0c4a6e", color: "#7dd3fc", padding: "16px 24px", fontFamily: "sans-serif", fontSize: 11, textAlign: "center", lineHeight: 1.8 }}>
        Data sourced from LAWA (Land, Air, Water New Zealand), HBRC, and NIWA · CC BY 4.0 · Built to make public environmental data accessible to everyone in New Zealand
      </div>

      <style>{`
        input[type=range] { -webkit-appearance: none; appearance: none; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 24px; height: 24px; border-radius: 50%; background: #0369a1; border: 3px solid #fff; box-shadow: 0 2px 8px rgba(3,105,161,0.5); cursor: pointer; transition: transform 0.15s; }
        input[type=range]::-webkit-slider-thumb:hover { transform: scale(1.25); }
        input[type=range]::-moz-range-thumb { width: 24px; height: 24px; border-radius: 50%; background: #0369a1; border: 3px solid #fff; cursor: pointer; }
      `}</style>
    </div>
  );
}
