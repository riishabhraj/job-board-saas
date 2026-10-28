/**
 * Maps the free-text locations companies write ("Bangalore", "San Francisco,
 * CA | New York City, NY", "Remote - EMEA") to canonical country names, so
 * location filtering works on countries instead of exact strings.
 */

// canonical name -> other spellings (all lowercase)
const COUNTRIES: Record<string, string[]> = {
  "United States": ["united states", "usa", "u.s.", "u.s.a.", "us", "america", "united states of america"],
  "United Kingdom": ["united kingdom", "uk", "u.k.", "england", "scotland", "wales", "northern ireland", "great britain"],
  Canada: ["canada"],
  India: ["india"],
  Germany: ["germany", "deutschland"],
  France: ["france"],
  Spain: ["spain"],
  Portugal: ["portugal"],
  Italy: ["italy"],
  Netherlands: ["netherlands", "the netherlands", "holland"],
  Ireland: ["ireland"],
  Poland: ["poland"],
  Sweden: ["sweden"],
  Norway: ["norway"],
  Denmark: ["denmark"],
  Finland: ["finland"],
  Switzerland: ["switzerland"],
  Austria: ["austria"],
  Belgium: ["belgium"],
  Czechia: ["czechia", "czech republic"],
  Romania: ["romania"],
  Greece: ["greece"],
  Luxembourg: ["luxembourg"],
  Estonia: ["estonia"],
  Lithuania: ["lithuania"],
  Ukraine: ["ukraine"],
  Israel: ["israel"],
  Turkey: ["turkey", "türkiye", "turkiye"],
  "United Arab Emirates": ["united arab emirates", "uae"],
  Singapore: ["singapore"],
  Japan: ["japan"],
  "South Korea": ["south korea", "korea"],
  Australia: ["australia"],
  "New Zealand": ["new zealand"],
  China: ["china"],
  "Hong Kong": ["hong kong"],
  Taiwan: ["taiwan"],
  Philippines: ["philippines"],
  Indonesia: ["indonesia"],
  Malaysia: ["malaysia"],
  Vietnam: ["vietnam"],
  Thailand: ["thailand"],
  Pakistan: ["pakistan"],
  Bangladesh: ["bangladesh"],
  Brazil: ["brazil", "brasil"],
  Mexico: ["mexico", "méxico"],
  Argentina: ["argentina"],
  Colombia: ["colombia"],
  Chile: ["chile"],
  "Costa Rica": ["costa rica"],
  "South Africa": ["south africa"],
  Nigeria: ["nigeria"],
  Kenya: ["kenya"],
  Egypt: ["egypt"],
};

// major tech hubs -> country (lowercase)
const CITIES: Record<string, string> = {
  // India
  bengaluru: "India", bangalore: "India", hyderabad: "India", mumbai: "India", pune: "India",
  delhi: "India", "new delhi": "India", gurgaon: "India", gurugram: "India", noida: "India",
  chennai: "India", kolkata: "India", ahmedabad: "India",
  // US
  "san francisco": "United States", "south san francisco": "United States", "palo alto": "United States",
  "mountain view": "United States", "menlo park": "United States", "san jose": "United States",
  sunnyvale: "United States", "santa clara": "United States", "los angeles": "United States",
  "san diego": "United States", seattle: "United States", bellevue: "United States", redmond: "United States",
  "new york": "United States", "new york city": "United States", brooklyn: "United States",
  boston: "United States", chicago: "United States", austin: "United States",
  dallas: "United States", houston: "United States", denver: "United States", boulder: "United States",
  atlanta: "United States", miami: "United States", portland: "United States", philadelphia: "United States",
  nashville: "United States", "washington, d.c.": "United States", "washington dc": "United States",
  "washington d.c.": "United States", pittsburgh: "United States", raleigh: "United States",
  "salt lake city": "United States", phoenix: "United States", minneapolis: "United States",
  // Canada
  toronto: "Canada", vancouver: "Canada", montreal: "Canada", montréal: "Canada", ottawa: "Canada",
  calgary: "Canada", waterloo: "Canada",
  // UK / Ireland
  london: "United Kingdom", manchester: "United Kingdom", edinburgh: "United Kingdom", bristol: "United Kingdom",
  dublin: "Ireland", cork: "Ireland",
  // Europe
  berlin: "Germany", munich: "Germany", münchen: "Germany", hamburg: "Germany", frankfurt: "Germany",
  cologne: "Germany", paris: "France", lyon: "France", nantes: "France", madrid: "Spain", barcelona: "Spain",
  lisbon: "Portugal", porto: "Portugal", amsterdam: "Netherlands", rotterdam: "Netherlands", utrecht: "Netherlands",
  warsaw: "Poland", krakow: "Poland", kraków: "Poland", wroclaw: "Poland", wrocław: "Poland",
  stockholm: "Sweden", copenhagen: "Denmark", oslo: "Norway", helsinki: "Finland", zurich: "Switzerland",
  zürich: "Switzerland", geneva: "Switzerland", vienna: "Austria", brussels: "Belgium", prague: "Czechia",
  bucharest: "Romania", athens: "Greece", tallinn: "Estonia", vilnius: "Lithuania", kyiv: "Ukraine",
  milan: "Italy", rome: "Italy",
  // Middle East / Asia-Pacific
  "tel aviv": "Israel", jerusalem: "Israel", istanbul: "Turkey", dubai: "United Arab Emirates",
  "abu dhabi": "United Arab Emirates", tokyo: "Japan", osaka: "Japan", seoul: "South Korea",
  sydney: "Australia", melbourne: "Australia", brisbane: "Australia", auckland: "New Zealand",
  shanghai: "China", beijing: "China", shenzhen: "China", taipei: "Taiwan", manila: "Philippines",
  jakarta: "Indonesia", "kuala lumpur": "Malaysia", bangkok: "Thailand", "ho chi minh city": "Vietnam",
  hanoi: "Vietnam", karachi: "Pakistan", lahore: "Pakistan", dhaka: "Bangladesh",
  // Americas / Africa
  "são paulo": "Brazil", "sao paulo": "Brazil", "rio de janeiro": "Brazil", "mexico city": "Mexico",
  "buenos aires": "Argentina", bogotá: "Colombia", bogota: "Colombia", medellín: "Colombia", santiago: "Chile",
  "san josé": "Costa Rica", heredia: "Costa Rica", "cape town": "South Africa", johannesburg: "South Africa",
  lagos: "Nigeria", nairobi: "Kenya", cairo: "Egypt",
};

const US_STATES: Record<string, string> = {
  alabama: "AL", alaska: "AK", arizona: "AZ", arkansas: "AR", california: "CA", colorado: "CO",
  connecticut: "CT", delaware: "DE", florida: "FL", georgia: "GA", hawaii: "HI", idaho: "ID",
  illinois: "IL", indiana: "IN", iowa: "IA", kansas: "KS", kentucky: "KY", louisiana: "LA",
  maine: "ME", maryland: "MD", massachusetts: "MA", michigan: "MI", minnesota: "MN", mississippi: "MS",
  missouri: "MO", montana: "MT", nebraska: "NE", nevada: "NV", "new hampshire": "NH", "new jersey": "NJ",
  "new mexico": "NM", "new york": "NY", "north carolina": "NC", "north dakota": "ND", ohio: "OH",
  oklahoma: "OK", oregon: "OR", pennsylvania: "PA", "rhode island": "RI", "south carolina": "SC",
  "south dakota": "SD", tennessee: "TN", texas: "TX", utah: "UT", vermont: "VT", virginia: "VA",
  washington: "WA", "west virginia": "WV", wisconsin: "WI", wyoming: "WY",
};
const CA_PROVINCES = new Set(["alberta", "british columbia", "manitoba", "new brunswick", "newfoundland and labrador", "nova scotia", "ontario", "quebec", "québec", "saskatchewan", "prince edward island"]);
const CA_CODES = new Set(["ON", "BC", "AB", "QC", "MB", "NS", "NB", "SK", "PE", "NL"]);
const EXTRA_PLACES: Record<string, string> = {
  luxembourg: "Luxembourg", "san francisco bay area": "United States", "bay area": "United States",
  nyc: "United States", sf: "United States", "new york metro": "United States",
};
const STATE_CODES = new Set(Object.values(US_STATES));
const STATE_NAMES = new Set(Object.keys(US_STATES));

const ALIAS = new Map<string, string>();
for (const [name, aliases] of Object.entries(COUNTRIES)) {
  ALIAS.set(name.toLowerCase(), name);
  for (const a of aliases) ALIAS.set(a, name);
}

/** Regions a posting may be limited to, and the countries they cover. */
export const REGIONS: Record<string, string[]> = {
  Europe: ["United Kingdom", "Ireland", "Germany", "France", "Spain", "Portugal", "Italy", "Netherlands", "Poland", "Sweden", "Norway", "Denmark", "Finland", "Switzerland", "Austria", "Belgium", "Czechia", "Romania", "Greece", "Estonia", "Lithuania", "Ukraine"],
  APAC: ["India", "Singapore", "Japan", "South Korea", "Australia", "New Zealand", "China", "Hong Kong", "Taiwan", "Philippines", "Indonesia", "Malaysia", "Vietnam", "Thailand", "Pakistan", "Bangladesh"],
  "Latin America": ["Brazil", "Mexico", "Argentina", "Colombia", "Chile", "Costa Rica"],
  "North America": ["United States", "Canada"],
  Americas: ["United States", "Canada", "Brazil", "Mexico", "Argentina", "Colombia", "Chile", "Costa Rica"],
};

const REGION_ALIASES: Record<string, string> = {
  europe: "Europe", apac: "APAC", "asia pacific": "APAC", "asia-pacific": "APAC",
  latam: "Latin America", "latin america": "Latin America", americas: "Americas",
  namer: "North America", "north america": "North America",
};

const norm = (s: string) => {
  const lower = s.toLowerCase();
  // "(U.S.)" on its own is the location; "Toronto (Hybrid)" is noise.
  const stripped = lower.replace(/\(.*?\)/g, " ").replace(/\s+/g, " ").trim();
  return stripped || lower.replace(/[()]/g, "").replace(/\s+/g, " ").trim();
};

/** Canonical countries named or implied by a free-text location. */
export function locationCountries(text: string): string[] {
  const found = new Set<string>();
  // Separators between places; commas separate city / state / country.
  const parts = text.split(/[|;•/\n]|\s[-–—]\s|\s(?:or|and)\s/i);
  for (const part of parts) {
    const segs = part.split(",").map(norm).filter(Boolean);
    segs.forEach((seg, i) => {
      const direct = ALIAS.get(seg);
      if (direct) return void found.add(direct);
      const region = REGION_ALIASES[seg];
      if (region) return void REGIONS[region].forEach((c) => found.add(c));
      const extra = EXTRA_PLACES[seg];
      if (extra) return void found.add(extra);
      if (CA_PROVINCES.has(seg) || (i > 0 && seg.length === 2 && CA_CODES.has(seg.toUpperCase()))) {
        return void found.add("Canada");
      }
      const city = CITIES[seg];
      if (city) return void found.add(city);
      // "CA", "NY", "Washington" after a city is a US state; a bare leading
      // "Washington" is more likely the city/state too, so accept both.
      if (STATE_CODES.has(seg.toUpperCase()) && seg.length === 2 && i > 0) {
        return void found.add("United States");
      }
      if (STATE_NAMES.has(seg)) found.add("United States");
    });
    // Single segment holding "City Country" without a comma: try word forms.
    if (segs.length === 1) {
      const s = segs[0];
      for (const [alias, name] of ALIAS) {
        if (alias.length > 3 && s.endsWith(` ${alias}`)) found.add(name);
      }
    }
  }
  return [...found];
}

/** Countries covered by a region-limited posting ("Europe", "APAC", ...). */
export function regionCountries(eligibility: string): string[] {
  const key = Object.keys(REGIONS).find(
    (r) => r.toLowerCase() === eligibility.toLowerCase(),
  );
  return key ? REGIONS[key] : [];
}
