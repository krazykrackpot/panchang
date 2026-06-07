/**
 * Canonical allowlists for the edge proxy (src/proxy.ts).
 *
 * Lives in its own file (not the canonical data files) so the Edge
 * Function bundle stays small. The proxy validates these slug sets
 * BEFORE the request crosses the ISR cache boundary, returning a real
 * HTTP 404 for unknown values — the only way to get a 404 status past
 * Next 16's ISR adapter, which caches notFound() responses as HTTP 200
 * (the soft-404 bug GSC flagged 2026-05-28/29 for /learn/yoga/lagna_mallika
 * and is currently silently affecting other [slug]/[rashi]/[city] routes).
 *
 * Drift guards in __tests__/proxy-allowlists.test.ts assert each set
 * matches the canonical source. CI fails any PR that adds/removes
 * values from the data without updating this file (or vice versa).
 *
 * SEO-safety strategy when picking each set's size:
 *   - rashi: 12 fixed canonical values. Page rejects anything else.
 *   - festival slug: ALL_FESTIVAL_DEFS ∩ FESTIVAL_DETAILS (58) — what
 *     /festivals/[slug]/[year]/page.tsx accepts (broader than the
 *     bare-slug page; gating tighter would 404 makar-sankranti and
 *     other SOLAR_FESTIVALS that are sitemap-indexed).
 *   - calendar slug: FESTIVAL_DETAILS ∪ CATEGORY_DETAILS ∪
 *     EKADASHI_NAMES specific slugs (81). The page itself accepts ANY
 *     slug (title-case fallback), but only these 81 produce meaningful
 *     content. Loose proxy here would re-introduce the soft-404 leak;
 *     strict gate matches what humans would actually expect to render.
 *   - panchang city: ALL_CITIES (325 slugs across all tiers). Includes
 *     tier-3 cities dropped from the sitemap May-25 — they're still
 *     reachable via internal "nearby cities" links on tier-1/2 pages,
 *     so 404-ing them would break the link graph. Only truly unknown
 *     slugs (typos, generated garbage) are gated.
 */

export const CANONICAL_RASHI_SLUGS: ReadonlySet<string> = new Set([
  'dhanu',
  'kanya',
  'kark',
  'kumbh',
  'makar',
  'meen',
  'mesh',
  'mithun',
  'simha',
  'tula',
  'vrishabh',
  'vrishchik',
]);

export const CANONICAL_FESTIVAL_SLUGS: ReadonlySet<string> = new Set([
  'akshaya-tritiya', 'amavasya', 'anant-chaturdashi', 'bhai-dooj',
  'bhishma-ashtami', 'bhishma-dwadashi', 'buddha-purnima',
  'chaitra-navratri', 'chaturthi', 'chhath-puja', 'devshayani-ekadashi',
  'devutthana-ekadashi', 'dhanteras', 'diwali', 'durga-ashtami',
  'dussehra', 'ganesh-chaturthi', 'ganga-dussehra', 'govardhan-puja',
  'guru-nanak-jayanti', 'guru-purnima', 'hanuman-jayanti',
  'hariyali-teej', 'hartalika-teej', 'holi', 'holika-dahan',
  'jagannath-rath-yatra', 'janmashtami', 'kartik-purnima',
  'magha-gupta-navratri', 'maha-navami', 'maha-shivaratri',
  'makar-sankranti', 'masik-durgashtami', 'masik-janmashtami',
  'mokshada-ekadashi', 'nag-panchami', 'narak-chaturdashi',
  'narasimha-jayanti', 'navaratri', 'nirjala-ekadashi', 'onam',
  'parashurama-jayanti', 'pongal', 'pradosham-krishna',
  'pradosham-shukla', 'purnima', 'raksha-bandhan', 'ram-navami',
  'ratha-saptami', 'sharad-purnima', 'skanda-shashthi', 'tulsi-vivah',
  'ugadi', 'varalakshmi-vratam', 'vasant-panchami', 'vat-savitri-vrat',
  'vinayaka-chaturthi',
]);

// CANONICAL_CALENDAR_SLUGS was intentionally NOT added here. The
// /calendar/[slug] page has a permissive title-case fallback in
// resolveDisplayName() — it serves valid 200 responses for unknown
// slugs like "satyanarayan" / "somvar-vrat" without calling
// notFound(). Sitemap audit 2026-06-07 confirmed those slugs are
// indexed in every visible locale. A proxy gate based on
// FESTIVAL_DETAILS / CATEGORY_DETAILS / EKADASHI_NAMES would 404
// hundreds of currently-ranking URLs — a guaranteed SEO regression.
// Reintroduce only if the page is first tightened to throw
// notFound() for unknown slugs.

export const CANONICAL_CITY_SLUGS: ReadonlySet<string> = new Set([
  'agartala', 'agra', 'ahmedabad', 'ahmednagar', 'aizawl', 'ajmer', 'akola', 'alappuzha', 'aligarh', 'allahabad',
  'alwar', 'amarnath', 'ambala', 'amravati', 'amritsar', 'anand', 'anantapur', 'arrah', 'asansol', 'ashtavinayak',
  'auckland', 'aurangabad', 'ayodhya', 'azamgarh', 'badrinath', 'baharampur', 'ballia', 'banda', 'bangalore', 'bangkok',
  'bankura', 'bareilly', 'barmer', 'basti', 'bathinda', 'beawar', 'begusarai', 'belgaum', 'bellary', 'berhampur',
  'bhagalpur', 'bhavnagar', 'bhilwara', 'bhiwani', 'bhopal', 'bhubaneswar', 'bhuj', 'bijapur', 'bikaner',
  'bilaspur-chhattisgarh', 'birmingham-uk', 'bodh-gaya', 'bokaro', 'brampton', 'budaun', 'bundi', 'burdwan',
  'burhanpur', 'chandigarh', 'chandrapur', 'chapra', 'char-dham', 'chennai', 'chhindwara', 'chicago', 'chidambaram',
  'chittorgarh', 'churu', 'coimbatore', 'colombo', 'cuttack', 'dallas', 'damoh', 'darbhanga', 'davangere', 'dehradun',
  'delhi', 'deoria', 'dewas', 'dhaka', 'dhanbad', 'dharamshala', 'dharmasthala', 'dibrugarh', 'dindigul', 'doha',
  'dubai', 'durban', 'durg-bhilai', 'durgapur', 'dwarka', 'edison', 'eluru', 'erode', 'etawah', 'faizabad',
  'faridabad', 'fatehpur', 'fiji', 'firozabad', 'fremont', 'gandhinagar', 'gangtok', 'gaya', 'ghaziabad', 'goa',
  'gorakhpur', 'gulbarga', 'guntur', 'gurugram', 'guruvayur', 'guwahati', 'gwalior', 'haldia', 'haldwani', 'hampi',
  'hanumangarh', 'hardoi', 'haridwar', 'hassan', 'hazaribagh', 'hisar', 'hoshiarpur', 'hosur', 'houston', 'howrah',
  'hubli-dharwad', 'hyderabad', 'imphal', 'indore', 'itanagar', 'jabalpur', 'jagannath-puri', 'jaipur', 'jaisalmer',
  'jakarta', 'jalandhar', 'jalgaon', 'jammu', 'jamnagar', 'jamshedpur', 'jhansi', 'jhunjhunu', 'jind', 'jodhpur',
  'jorhat', 'junagadh', 'kakinada', 'kalyani', 'kanchipuram', 'kannur', 'kanpur', 'kapurthala', 'karimnagar',
  'karnal', 'kasaragod', 'kashi', 'kathmandu', 'kedarnath', 'khajuraho', 'khammam', 'khandwa', 'kharagpur', 'kochi',
  'kohima', 'kolhapur', 'kolkata', 'kollam', 'konark', 'korba', 'kota', 'kottayam', 'kozhikode', 'kuala-lumpur',
  'kumbakonam', 'kurnool', 'lakhimpur-kheri', 'latur', 'leicester', 'london', 'los-angeles', 'lucknow', 'ludhiana',
  'machilipatnam', 'madurai', 'mahakaleshwar', 'mahbubnagar', 'mainpuri', 'malappuram', 'malda', 'mandya',
  'mangalore', 'mapusa', 'margao', 'mathura', 'mauritius', 'meerut', 'mehsana', 'melbourne', 'mirzapur', 'moga',
  'moradabad', 'morena', 'motihari', 'mount-abu', 'mumbai', 'muscat', 'muzaffarnagar', 'muzaffarpur', 'mysore',
  'nagapattinam', 'nagaur', 'nagpur', 'nairobi', 'nalgonda', 'nanded', 'nashik', 'nathdwara', 'navi-mumbai',
  'navsari', 'nellore', 'new-york', 'nizamabad', 'noida', 'omkareshwar', 'ongole', 'orai', 'orchha', 'palakkad',
  'palani', 'pali', 'pandharpur', 'panipat', 'parbhani', 'pathanamthitta', 'patiala', 'patna', 'pavagadh', 'perth',
  'phagwara', 'porbandar', 'pune', 'puri', 'purnia', 'pushkar', 'rae-bareli', 'raichur', 'raiganj', 'raipur',
  'rajahmundry', 'rajgir', 'rajkot', 'rameshwaram', 'rampur', 'ranchi', 'rewa', 'rewari', 'rishikesh', 'rohtak',
  'roorkee', 'rourkela', 'sabarimala', 'sagar', 'saharanpur', 'salem', 'samastipur', 'sambalpur', 'san-francisco',
  'sangli', 'sasaram', 'satna', 'sawai-madhopur', 'seattle', 'shahjahanpur', 'shillong', 'shimla', 'shimoga',
  'shirdi', 'shivpuri', 'sikar', 'silchar', 'siliguri', 'singapore', 'sitapur', 'solapur', 'somnath', 'sonipat',
  'sri-ganganagar', 'srikakulam', 'srinagar', 'srirangam', 'srisailam', 'sultanpur', 'surat', 'sydney', 'thane',
  'thanjavur', 'thiruvananthapuram', 'thoothukudi', 'thrissur', 'tiruchirappalli', 'tirunelveli', 'tirupati',
  'tiruvannamalai', 'tonk', 'toronto', 'trimbakeshwar', 'trinidad', 'udaipur', 'udupi', 'ujjain', 'unnao',
  'vadodara', 'vancouver', 'varanasi', 'vasai-virar', 'vasco', 'vellore', 'vidisha', 'vijayawada', 'visakhapatnam',
  'vrindavan', 'warangal', 'washington-dc', 'yamunanagar',
]);
