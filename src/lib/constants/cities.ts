/**
 * City data for city-specific panchang pages.
 * Top 50 Indian cities + 10 international Hindu diaspora cities.
 */

export interface CityData {
  slug: string;           // URL-safe: 'delhi', 'mumbai', 'new-york'
  name: { en: string; hi: string };
  state?: string;         // Indian state or country
  lat: number;
  lng: number;
  timezone: string;       // IANA timezone
  population?: number;    // for sorting
}

export const CITIES: CityData[] = [
  // ── Top Indian cities by search volume ──
  { slug: 'delhi', name: { en: 'Delhi', hi: 'दिल्ली' }, state: 'Delhi', lat: 28.6139, lng: 77.2090, timezone: 'Asia/Kolkata', population: 32000000 },
  { slug: 'mumbai', name: { en: 'Mumbai', hi: 'मुंबई' }, state: 'Maharashtra', lat: 19.0760, lng: 72.8777, timezone: 'Asia/Kolkata', population: 21000000 },
  { slug: 'bangalore', name: { en: 'Bangalore', hi: 'बेंगलुरु' }, state: 'Karnataka', lat: 12.9716, lng: 77.5946, timezone: 'Asia/Kolkata', population: 13000000 },
  { slug: 'hyderabad', name: { en: 'Hyderabad', hi: 'हैदराबाद' }, state: 'Telangana', lat: 17.3850, lng: 78.4867, timezone: 'Asia/Kolkata', population: 10000000 },
  { slug: 'chennai', name: { en: 'Chennai', hi: 'चेन्नई' }, state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707, timezone: 'Asia/Kolkata', population: 11000000 },
  { slug: 'kolkata', name: { en: 'Kolkata', hi: 'कोलकाता' }, state: 'West Bengal', lat: 22.5726, lng: 88.3639, timezone: 'Asia/Kolkata', population: 15000000 },
  { slug: 'ahmedabad', name: { en: 'Ahmedabad', hi: 'अहमदाबाद' }, state: 'Gujarat', lat: 23.0225, lng: 72.5714, timezone: 'Asia/Kolkata', population: 8000000 },
  { slug: 'pune', name: { en: 'Pune', hi: 'पुणे' }, state: 'Maharashtra', lat: 18.5204, lng: 73.8567, timezone: 'Asia/Kolkata', population: 7500000 },
  { slug: 'jaipur', name: { en: 'Jaipur', hi: 'जयपुर' }, state: 'Rajasthan', lat: 26.9124, lng: 75.7873, timezone: 'Asia/Kolkata', population: 4000000 },
  { slug: 'lucknow', name: { en: 'Lucknow', hi: 'लखनऊ' }, state: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462, timezone: 'Asia/Kolkata', population: 3700000 },
  { slug: 'varanasi', name: { en: 'Varanasi', hi: 'वाराणसी' }, state: 'Uttar Pradesh', lat: 25.3176, lng: 82.9739, timezone: 'Asia/Kolkata', population: 1800000 },
  { slug: 'patna', name: { en: 'Patna', hi: 'पटना' }, state: 'Bihar', lat: 25.6093, lng: 85.1376, timezone: 'Asia/Kolkata', population: 2500000 },
  { slug: 'indore', name: { en: 'Indore', hi: 'इंदौर' }, state: 'Madhya Pradesh', lat: 22.7196, lng: 75.8577, timezone: 'Asia/Kolkata', population: 3200000 },
  { slug: 'bhopal', name: { en: 'Bhopal', hi: 'भोपाल' }, state: 'Madhya Pradesh', lat: 23.2599, lng: 77.4126, timezone: 'Asia/Kolkata', population: 2400000 },
  { slug: 'nagpur', name: { en: 'Nagpur', hi: 'नागपुर' }, state: 'Maharashtra', lat: 21.1458, lng: 79.0882, timezone: 'Asia/Kolkata', population: 2800000 },
  { slug: 'chandigarh', name: { en: 'Chandigarh', hi: 'चंडीगढ़' }, state: 'Chandigarh', lat: 30.7333, lng: 76.7794, timezone: 'Asia/Kolkata', population: 1200000 },
  { slug: 'surat', name: { en: 'Surat', hi: 'सूरत' }, state: 'Gujarat', lat: 21.1702, lng: 72.8311, timezone: 'Asia/Kolkata', population: 7800000 },
  { slug: 'kanpur', name: { en: 'Kanpur', hi: 'कानपुर' }, state: 'Uttar Pradesh', lat: 26.4499, lng: 80.3319, timezone: 'Asia/Kolkata', population: 3100000 },
  { slug: 'coimbatore', name: { en: 'Coimbatore', hi: 'कोयम्बटूर' }, state: 'Tamil Nadu', lat: 11.0168, lng: 76.9558, timezone: 'Asia/Kolkata', population: 2200000 },
  { slug: 'visakhapatnam', name: { en: 'Visakhapatnam', hi: 'विशाखापत्तनम' }, state: 'Andhra Pradesh', lat: 17.6868, lng: 83.2185, timezone: 'Asia/Kolkata', population: 2100000 },
  { slug: 'thiruvananthapuram', name: { en: 'Thiruvananthapuram', hi: 'तिरुवनंतपुरम' }, state: 'Kerala', lat: 8.5241, lng: 76.9366, timezone: 'Asia/Kolkata', population: 1700000 },
  { slug: 'kochi', name: { en: 'Kochi', hi: 'कोच्चि' }, state: 'Kerala', lat: 9.9312, lng: 76.2673, timezone: 'Asia/Kolkata', population: 2100000 },
  { slug: 'guwahati', name: { en: 'Guwahati', hi: 'गुवाहाटी' }, state: 'Assam', lat: 26.1445, lng: 91.7362, timezone: 'Asia/Kolkata', population: 1100000 },
  { slug: 'madurai', name: { en: 'Madurai', hi: 'मदुरै' }, state: 'Tamil Nadu', lat: 9.9252, lng: 78.1198, timezone: 'Asia/Kolkata', population: 1500000 },
  { slug: 'agra', name: { en: 'Agra', hi: 'आगरा' }, state: 'Uttar Pradesh', lat: 27.1767, lng: 78.0081, timezone: 'Asia/Kolkata', population: 1800000 },
  { slug: 'ujjain', name: { en: 'Ujjain', hi: 'उज्जैन' }, state: 'Madhya Pradesh', lat: 23.1765, lng: 75.7885, timezone: 'Asia/Kolkata', population: 550000 },
  { slug: 'haridwar', name: { en: 'Haridwar', hi: 'हरिद्वार' }, state: 'Uttarakhand', lat: 29.9457, lng: 78.1642, timezone: 'Asia/Kolkata', population: 250000 },
  { slug: 'rishikesh', name: { en: 'Rishikesh', hi: 'ऋषिकेश' }, state: 'Uttarakhand', lat: 30.0869, lng: 78.2676, timezone: 'Asia/Kolkata', population: 100000 },
  { slug: 'puri', name: { en: 'Puri', hi: 'पुरी' }, state: 'Odisha', lat: 19.8135, lng: 85.8312, timezone: 'Asia/Kolkata', population: 200000 },
  { slug: 'tirupati', name: { en: 'Tirupati', hi: 'तिरुपति' }, state: 'Andhra Pradesh', lat: 13.6288, lng: 79.4192, timezone: 'Asia/Kolkata', population: 375000 },
  { slug: 'amritsar', name: { en: 'Amritsar', hi: 'अमृतसर' }, state: 'Punjab', lat: 31.6340, lng: 74.8723, timezone: 'Asia/Kolkata', population: 1200000 },
  { slug: 'dehradun', name: { en: 'Dehradun', hi: 'देहरादून' }, state: 'Uttarakhand', lat: 30.3165, lng: 78.0322, timezone: 'Asia/Kolkata', population: 700000 },
  { slug: 'ranchi', name: { en: 'Ranchi', hi: 'रांची' }, state: 'Jharkhand', lat: 23.3441, lng: 85.3096, timezone: 'Asia/Kolkata', population: 1100000 },
  { slug: 'bhubaneswar', name: { en: 'Bhubaneswar', hi: 'भुवनेश्वर' }, state: 'Odisha', lat: 20.2961, lng: 85.8245, timezone: 'Asia/Kolkata', population: 1000000 },
  { slug: 'mysore', name: { en: 'Mysore', hi: 'मैसूर' }, state: 'Karnataka', lat: 12.2958, lng: 76.6394, timezone: 'Asia/Kolkata', population: 1000000 },
  { slug: 'nashik', name: { en: 'Nashik', hi: 'नासिक' }, state: 'Maharashtra', lat: 19.9975, lng: 73.7898, timezone: 'Asia/Kolkata', population: 1600000 },
  { slug: 'jodhpur', name: { en: 'Jodhpur', hi: 'जोधपुर' }, state: 'Rajasthan', lat: 26.2389, lng: 73.0243, timezone: 'Asia/Kolkata', population: 1300000 },
  { slug: 'goa', name: { en: 'Goa', hi: 'गोवा' }, state: 'Goa', lat: 15.2993, lng: 74.1240, timezone: 'Asia/Kolkata', population: 600000 },
  { slug: 'raipur', name: { en: 'Raipur', hi: 'रायपुर' }, state: 'Chhattisgarh', lat: 21.2514, lng: 81.6296, timezone: 'Asia/Kolkata', population: 1200000 },
  { slug: 'allahabad', name: { en: 'Prayagraj', hi: 'प्रयागराज' }, state: 'Uttar Pradesh', lat: 25.4358, lng: 81.8463, timezone: 'Asia/Kolkata', population: 1300000 },
  // ── International Hindu diaspora cities ──
  { slug: 'new-york', name: { en: 'New York', hi: 'न्यूयॉर्क' }, state: 'USA', lat: 40.7128, lng: -74.0060, timezone: 'America/New_York', population: 8300000 },
  { slug: 'london', name: { en: 'London', hi: 'लंदन' }, state: 'UK', lat: 51.5074, lng: -0.1278, timezone: 'Europe/London', population: 9000000 },
  { slug: 'singapore', name: { en: 'Singapore', hi: 'सिंगापुर' }, state: 'Singapore', lat: 1.3521, lng: 103.8198, timezone: 'Asia/Singapore', population: 5900000 },
  { slug: 'dubai', name: { en: 'Dubai', hi: 'दुबई' }, state: 'UAE', lat: 25.2048, lng: 55.2708, timezone: 'Asia/Dubai', population: 3500000 },
  { slug: 'sydney', name: { en: 'Sydney', hi: 'सिडनी' }, state: 'Australia', lat: -33.8688, lng: 151.2093, timezone: 'Australia/Sydney', population: 5300000 },
  { slug: 'toronto', name: { en: 'Toronto', hi: 'टोरंटो' }, state: 'Canada', lat: 43.6532, lng: -79.3832, timezone: 'America/Toronto', population: 2900000 },
  { slug: 'kuala-lumpur', name: { en: 'Kuala Lumpur', hi: 'कुआलालंपुर' }, state: 'Malaysia', lat: 3.1390, lng: 101.6869, timezone: 'Asia/Kuala_Lumpur', population: 1800000 },
  { slug: 'mauritius', name: { en: 'Mauritius', hi: 'मॉरीशस' }, state: 'Mauritius', lat: -20.1609, lng: 57.5012, timezone: 'Indian/Mauritius', population: 1300000 },
  { slug: 'fiji', name: { en: 'Suva (Fiji)', hi: 'सूवा (फ़िजी)' }, state: 'Fiji', lat: -18.1416, lng: 178.4419, timezone: 'Pacific/Fiji', population: 93000 },
  { slug: 'trinidad', name: { en: 'Port of Spain', hi: 'पोर्ट ऑफ स्पेन' }, state: 'Trinidad', lat: 10.6596, lng: -61.5086, timezone: 'America/Port_of_Spain', population: 37000 },
];

export function getCityBySlug(slug: string): CityData | undefined {
  return CITIES.find(c => c.slug === slug);
}

export function getAllCitySlugs(): string[] {
  return CITIES.map(c => c.slug);
}

/** Get top N cities sorted by population (for "popular cities" links). */
export function getPopularCities(n: number = 12): CityData[] {
  return [...CITIES]
    .sort((a, b) => (b.population ?? 0) - (a.population ?? 0))
    .slice(0, n);
}
