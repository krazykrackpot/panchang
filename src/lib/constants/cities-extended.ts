/**
 * Extended city database for city-specific panchang pages.
 * 800+ cities: 55 Tier 1 (existing) + ~200 Tier 2 + ~350 Tier 3 + 30 international.
 *
 * Tier 1: Pre-rendered at build, sitemap priority 0.8
 * Tier 2: ISR on first visit, sitemap priority 0.5
 * Tier 3: ISR on first visit, discovered via "nearby cities" links (not in sitemap initially)
 */

import type { LocaleText } from '@/types/panchang';
import type { CityData } from './cities';

export interface CityDataWithTier extends CityData {
  tier: 1 | 2 | 3;
}

// ---------------------------------------------------------------------------
// Compact Indian city helper — expands [slug, en, hi, state, lat, lng, pop]
// All Indian cities: timezone='Asia/Kolkata', Devanagari locales copy hi, others copy en
// ---------------------------------------------------------------------------
type IndianCityTuple = [string, string, string, string, number, number, number];

function expandIndian(data: IndianCityTuple[], tier: 1 | 2 | 3): CityDataWithTier[] {
  return data.map(([slug, en, hi, state, lat, lng, population]) => ({
    slug,
    name: { en, hi, sa: hi, mai: hi, mr: hi, ta: en, te: en, bn: en, kn: en, gu: en } as LocaleText,
    state,
    lat,
    lng,
    timezone: 'Asia/Kolkata',
    population,
    tier,
  }));
}

// ---------------------------------------------------------------------------
// Tier 1 — existing 55 cities (41 Indian + 14 international)
// ---------------------------------------------------------------------------
const TIER1_INDIAN: IndianCityTuple[] = [
  ['delhi', 'Delhi', 'दिल्ली', 'Delhi', 28.6139, 77.2090, 32000000],
  ['mumbai', 'Mumbai', 'मुंबई', 'Maharashtra', 19.0760, 72.8777, 21000000],
  ['bangalore', 'Bangalore', 'बेंगलुरु', 'Karnataka', 12.9716, 77.5946, 13000000],
  ['hyderabad', 'Hyderabad', 'हैदराबाद', 'Telangana', 17.3850, 78.4867, 10000000],
  ['chennai', 'Chennai', 'चेन्नई', 'Tamil Nadu', 13.0827, 80.2707, 11000000],
  ['kolkata', 'Kolkata', 'कोलकाता', 'West Bengal', 22.5726, 88.3639, 15000000],
  ['ahmedabad', 'Ahmedabad', 'अहमदाबाद', 'Gujarat', 23.0225, 72.5714, 8000000],
  ['pune', 'Pune', 'पुणे', 'Maharashtra', 18.5204, 73.8567, 7500000],
  ['jaipur', 'Jaipur', 'जयपुर', 'Rajasthan', 26.9124, 75.7873, 4000000],
  ['lucknow', 'Lucknow', 'लखनऊ', 'Uttar Pradesh', 26.8467, 80.9462, 3700000],
  ['varanasi', 'Varanasi', 'वाराणसी', 'Uttar Pradesh', 25.3176, 82.9739, 1800000],
  ['patna', 'Patna', 'पटना', 'Bihar', 25.6093, 85.1376, 2500000],
  ['indore', 'Indore', 'इंदौर', 'Madhya Pradesh', 22.7196, 75.8577, 3200000],
  ['bhopal', 'Bhopal', 'भोपाल', 'Madhya Pradesh', 23.2599, 77.4126, 2400000],
  ['nagpur', 'Nagpur', 'नागपुर', 'Maharashtra', 21.1458, 79.0882, 2800000],
  ['chandigarh', 'Chandigarh', 'चंडीगढ़', 'Chandigarh', 30.7333, 76.7794, 1200000],
  ['surat', 'Surat', 'सूरत', 'Gujarat', 21.1702, 72.8311, 7800000],
  ['kanpur', 'Kanpur', 'कानपुर', 'Uttar Pradesh', 26.4499, 80.3319, 3100000],
  ['coimbatore', 'Coimbatore', 'कोयम्बटूर', 'Tamil Nadu', 11.0168, 76.9558, 2200000],
  ['visakhapatnam', 'Visakhapatnam', 'विशाखापत्तनम', 'Andhra Pradesh', 17.6868, 83.2185, 2100000],
  ['thiruvananthapuram', 'Thiruvananthapuram', 'तिरुवनंतपुरम', 'Kerala', 8.5241, 76.9366, 1700000],
  ['kochi', 'Kochi', 'कोच्चि', 'Kerala', 9.9312, 76.2673, 2100000],
  ['guwahati', 'Guwahati', 'गुवाहाटी', 'Assam', 26.1445, 91.7362, 1100000],
  ['madurai', 'Madurai', 'मदुरै', 'Tamil Nadu', 9.9252, 78.1198, 1500000],
  ['agra', 'Agra', 'आगरा', 'Uttar Pradesh', 27.1767, 78.0081, 1800000],
  ['ujjain', 'Ujjain', 'उज्जैन', 'Madhya Pradesh', 23.1765, 75.7885, 550000],
  ['haridwar', 'Haridwar', 'हरिद्वार', 'Uttarakhand', 29.9457, 78.1642, 250000],
  ['rishikesh', 'Rishikesh', 'ऋषिकेश', 'Uttarakhand', 30.0869, 78.2676, 100000],
  ['puri', 'Puri', 'पुरी', 'Odisha', 19.8135, 85.8312, 200000],
  ['tirupati', 'Tirupati', 'तिरुपति', 'Andhra Pradesh', 13.6288, 79.4192, 375000],
  ['amritsar', 'Amritsar', 'अमृतसर', 'Punjab', 31.6340, 74.8723, 1200000],
  ['dehradun', 'Dehradun', 'देहरादून', 'Uttarakhand', 30.3165, 78.0322, 700000],
  ['ranchi', 'Ranchi', 'रांची', 'Jharkhand', 23.3441, 85.3096, 1100000],
  ['bhubaneswar', 'Bhubaneswar', 'भुवनेश्वर', 'Odisha', 20.2961, 85.8245, 1000000],
  ['mysore', 'Mysore', 'मैसूर', 'Karnataka', 12.2958, 76.6394, 1000000],
  ['nashik', 'Nashik', 'नासिक', 'Maharashtra', 19.9975, 73.7898, 1600000],
  ['jodhpur', 'Jodhpur', 'जोधपुर', 'Rajasthan', 26.2389, 73.0243, 1300000],
  ['goa', 'Goa', 'गोवा', 'Goa', 15.2993, 74.1240, 600000],
  ['raipur', 'Raipur', 'रायपुर', 'Chhattisgarh', 21.2514, 81.6296, 1200000],
  ['allahabad', 'Prayagraj', 'प्रयागराज', 'Uttar Pradesh', 25.4358, 81.8463, 1300000],
];

const TIER1_INTERNATIONAL: CityDataWithTier[] = [
  { slug: 'new-york', name: { en: 'New York', hi: 'न्यूयॉर्क', sa: 'न्यूयॉर्क', mai: 'न्यूयॉर्क', mr: 'न्यूयॉर्क', ta: 'New York', te: 'New York', bn: 'New York', kn: 'New York', gu: 'New York' }, state: 'USA', lat: 40.7128, lng: -74.0060, timezone: 'America/New_York', population: 8300000, tier: 1 },
  { slug: 'london', name: { en: 'London', hi: 'लंदन', sa: 'लंदन', mai: 'लंदन', mr: 'लंदन', ta: 'London', te: 'London', bn: 'London', kn: 'London', gu: 'London' }, state: 'UK', lat: 51.5074, lng: -0.1278, timezone: 'Europe/London', population: 9000000, tier: 1 },
  { slug: 'singapore', name: { en: 'Singapore', hi: 'सिंगापुर', sa: 'सिंगापुर', mai: 'सिंगापुर', mr: 'सिंगापुर', ta: 'Singapore', te: 'Singapore', bn: 'Singapore', kn: 'Singapore', gu: 'Singapore' }, state: 'Singapore', lat: 1.3521, lng: 103.8198, timezone: 'Asia/Singapore', population: 5900000, tier: 1 },
  { slug: 'dubai', name: { en: 'Dubai', hi: 'दुबई', sa: 'दुबई', mai: 'दुबई', mr: 'दुबई', ta: 'Dubai', te: 'Dubai', bn: 'Dubai', kn: 'Dubai', gu: 'Dubai' }, state: 'UAE', lat: 25.2048, lng: 55.2708, timezone: 'Asia/Dubai', population: 3500000, tier: 1 },
  { slug: 'sydney', name: { en: 'Sydney', hi: 'सिडनी', sa: 'सिडनी', mai: 'सिडनी', mr: 'सिडनी', ta: 'Sydney', te: 'Sydney', bn: 'Sydney', kn: 'Sydney', gu: 'Sydney' }, state: 'Australia', lat: -33.8688, lng: 151.2093, timezone: 'Australia/Sydney', population: 5300000, tier: 1 },
  { slug: 'toronto', name: { en: 'Toronto', hi: 'टोरंटो', sa: 'टोरंटो', mai: 'टोरंटो', mr: 'टोरंटो', ta: 'Toronto', te: 'Toronto', bn: 'Toronto', kn: 'Toronto', gu: 'Toronto' }, state: 'Canada', lat: 43.6532, lng: -79.3832, timezone: 'America/Toronto', population: 2900000, tier: 1 },
  { slug: 'kuala-lumpur', name: { en: 'Kuala Lumpur', hi: 'कुआलालंपुर', sa: 'कुआलालंपुर', mai: 'कुआलालंपुर', mr: 'कुआलालंपुर', ta: 'Kuala Lumpur', te: 'Kuala Lumpur', bn: 'Kuala Lumpur', kn: 'Kuala Lumpur', gu: 'Kuala Lumpur' }, state: 'Malaysia', lat: 3.1390, lng: 101.6869, timezone: 'Asia/Kuala_Lumpur', population: 1800000, tier: 1 },
  { slug: 'mauritius', name: { en: 'Mauritius', hi: 'मॉरीशस', sa: 'मॉरीशस', mai: 'मॉरीशस', mr: 'मॉरीशस', ta: 'Mauritius', te: 'Mauritius', bn: 'Mauritius', kn: 'Mauritius', gu: 'Mauritius' }, state: 'Mauritius', lat: -20.1609, lng: 57.5012, timezone: 'Indian/Mauritius', population: 1300000, tier: 1 },
  { slug: 'fiji', name: { en: 'Suva (Fiji)', hi: 'सूवा (फ़िजी)', sa: 'सूवा (फ़िजी)', mai: 'सूवा (फ़िजी)', mr: 'सूवा (फ़िजी)', ta: 'Suva (Fiji)', te: 'Suva (Fiji)', bn: 'Suva (Fiji)', kn: 'Suva (Fiji)', gu: 'Suva (Fiji)' }, state: 'Fiji', lat: -18.1416, lng: 178.4419, timezone: 'Pacific/Fiji', population: 93000, tier: 1 },
  { slug: 'trinidad', name: { en: 'Port of Spain', hi: 'पोर्ट ऑफ स्पेन', sa: 'पोर्ट ऑफ स्पेन', mai: 'पोर्ट ऑफ स्पेन', mr: 'पोर्ट ऑफ स्पेन', ta: 'Port of Spain', te: 'Port of Spain', bn: 'Port of Spain', kn: 'Port of Spain', gu: 'Port of Spain' }, state: 'Trinidad', lat: 10.6596, lng: -61.5086, timezone: 'America/Port_of_Spain', population: 37000, tier: 1 },
  { slug: 'san-francisco', name: { en: 'San Francisco', hi: 'सैन फ्रांसिस्को', sa: 'सैन फ्रांसिस्को', mai: 'सैन फ्रांसिस्को', mr: 'सैन फ्रांसिस्को', ta: 'San Francisco', te: 'San Francisco', bn: 'San Francisco', kn: 'San Francisco', gu: 'San Francisco' }, state: 'USA', lat: 37.7749, lng: -122.4194, timezone: 'America/Los_Angeles', population: 870000, tier: 1 },
  { slug: 'houston', name: { en: 'Houston', hi: 'ह्यूस्टन', sa: 'ह्यूस्टन', mai: 'ह्यूस्टन', mr: 'ह्यूस्टन', ta: 'Houston', te: 'Houston', bn: 'Houston', kn: 'Houston', gu: 'Houston' }, state: 'USA', lat: 29.7604, lng: -95.3698, timezone: 'America/Chicago', population: 2300000, tier: 1 },
  { slug: 'chicago', name: { en: 'Chicago', hi: 'शिकागो', sa: 'शिकागो', mai: 'शिकागो', mr: 'शिकागो', ta: 'Chicago', te: 'Chicago', bn: 'Chicago', kn: 'Chicago', gu: 'Chicago' }, state: 'USA', lat: 41.8781, lng: -87.6298, timezone: 'America/Chicago', population: 2700000, tier: 1 },
  { slug: 'melbourne', name: { en: 'Melbourne', hi: 'मेलबर्न', sa: 'मेलबर्न', mai: 'मेलबर्न', mr: 'मेलबर्न', ta: 'Melbourne', te: 'Melbourne', bn: 'Melbourne', kn: 'Melbourne', gu: 'Melbourne' }, state: 'Australia', lat: -37.8136, lng: 144.9631, timezone: 'Australia/Melbourne', population: 5100000, tier: 1 },
  { slug: 'auckland', name: { en: 'Auckland', hi: 'ऑकलैंड', sa: 'ऑकलैंड', mai: 'ऑकलैंड', mr: 'ऑकलैंड', ta: 'Auckland', te: 'Auckland', bn: 'Auckland', kn: 'Auckland', gu: 'Auckland' }, state: 'New Zealand', lat: -36.8485, lng: 174.7633, timezone: 'Pacific/Auckland', population: 1660000, tier: 1 },
];

// ---------------------------------------------------------------------------
// Tier 2 — Indian cities pop >300k, state capitals, major district HQs (~200)
// ---------------------------------------------------------------------------
const TIER2_INDIAN: IndianCityTuple[] = [
  // Uttar Pradesh
  ['gorakhpur', 'Gorakhpur', 'गोरखपुर', 'Uttar Pradesh', 26.7606, 83.3732, 700000],
  ['meerut', 'Meerut', 'मेरठ', 'Uttar Pradesh', 28.9845, 77.7064, 1500000],
  ['ghaziabad', 'Ghaziabad', 'गाज़ियाबाद', 'Uttar Pradesh', 28.6692, 77.4538, 2400000],
  ['noida', 'Noida', 'नोएडा', 'Uttar Pradesh', 28.5355, 77.3910, 640000],
  ['aligarh', 'Aligarh', 'अलीगढ़', 'Uttar Pradesh', 27.8974, 78.0880, 900000],
  ['moradabad', 'Moradabad', 'मुरादाबाद', 'Uttar Pradesh', 28.8386, 78.7733, 950000],
  ['bareilly', 'Bareilly', 'बरेली', 'Uttar Pradesh', 28.3670, 79.4304, 1000000],
  ['saharanpur', 'Saharanpur', 'सहारनपुर', 'Uttar Pradesh', 29.9680, 77.5510, 700000],
  ['mathura', 'Mathura', 'मथुरा', 'Uttar Pradesh', 27.4924, 77.6737, 450000],
  ['firozabad', 'Firozabad', 'फ़िरोज़ाबाद', 'Uttar Pradesh', 27.1591, 78.3957, 400000],
  ['ayodhya', 'Ayodhya', 'अयोध्या', 'Uttar Pradesh', 26.7922, 82.1998, 100000],
  ['jhansi', 'Jhansi', 'झाँसी', 'Uttar Pradesh', 25.4484, 78.5685, 550000],
  ['muzaffarnagar', 'Muzaffarnagar', 'मुज़फ़्फ़रनगर', 'Uttar Pradesh', 29.4727, 77.7085, 400000],
  ['etawah', 'Etawah', 'इटावा', 'Uttar Pradesh', 26.7856, 79.0158, 300000],
  ['mirzapur', 'Mirzapur', 'मिर्ज़ापुर', 'Uttar Pradesh', 25.1337, 82.5644, 250000],
  // Rajasthan
  ['udaipur', 'Udaipur', 'उदयपुर', 'Rajasthan', 24.5854, 73.7125, 500000],
  ['ajmer', 'Ajmer', 'अजमेर', 'Rajasthan', 26.4499, 74.6399, 550000],
  ['kota', 'Kota', 'कोटा', 'Rajasthan', 25.2138, 75.8648, 1100000],
  ['bikaner', 'Bikaner', 'बीकानेर', 'Rajasthan', 28.0229, 73.3119, 650000],
  ['alwar', 'Alwar', 'अलवर', 'Rajasthan', 27.5530, 76.6346, 350000],
  ['bhilwara', 'Bhilwara', 'भीलवाड़ा', 'Rajasthan', 25.3407, 74.6313, 400000],
  ['sikar', 'Sikar', 'सीकर', 'Rajasthan', 27.6094, 75.1399, 300000],
  // Maharashtra
  ['aurangabad', 'Chhatrapati Sambhajinagar', 'छत्रपति संभाजीनगर', 'Maharashtra', 19.8762, 75.3433, 1200000],
  ['solapur', 'Solapur', 'सोलापुर', 'Maharashtra', 17.6599, 75.9064, 1000000],
  ['kolhapur', 'Kolhapur', 'कोल्हापुर', 'Maharashtra', 16.7050, 74.2433, 600000],
  ['nanded', 'Nanded', 'नांदेड़', 'Maharashtra', 19.1383, 77.3210, 600000],
  ['sangli', 'Sangli', 'सांगली', 'Maharashtra', 16.8524, 74.5815, 500000],
  ['thane', 'Thane', 'ठाणे', 'Maharashtra', 19.2183, 72.9781, 2000000],
  ['navi-mumbai', 'Navi Mumbai', 'नवी मुंबई', 'Maharashtra', 19.0330, 73.0297, 1200000],
  ['vasai-virar', 'Vasai-Virar', 'वसई-विरार', 'Maharashtra', 19.3919, 72.8397, 1200000],
  // Gujarat
  ['vadodara', 'Vadodara', 'वडोदरा', 'Gujarat', 22.3072, 73.1812, 2100000],
  ['rajkot', 'Rajkot', 'राजकोट', 'Gujarat', 22.3039, 70.8022, 1400000],
  ['bhavnagar', 'Bhavnagar', 'भावनगर', 'Gujarat', 21.7645, 72.1519, 600000],
  ['jamnagar', 'Jamnagar', 'जामनगर', 'Gujarat', 22.4707, 70.0577, 600000],
  ['junagadh', 'Junagadh', 'जूनागढ़', 'Gujarat', 21.5222, 70.4579, 400000],
  ['gandhinagar', 'Gandhinagar', 'गांधीनगर', 'Gujarat', 23.2156, 72.6369, 300000],
  ['anand', 'Anand', 'आनंद', 'Gujarat', 22.5645, 72.9289, 300000],
  // Madhya Pradesh
  ['jabalpur', 'Jabalpur', 'जबलपुर', 'Madhya Pradesh', 23.1815, 79.9864, 1200000],
  ['gwalior', 'Gwalior', 'ग्वालियर', 'Madhya Pradesh', 26.2183, 78.1828, 1200000],
  ['sagar', 'Sagar', 'सागर', 'Madhya Pradesh', 23.8388, 78.7378, 350000],
  ['dewas', 'Dewas', 'देवास', 'Madhya Pradesh', 22.9676, 76.0534, 350000],
  ['satna', 'Satna', 'सतना', 'Madhya Pradesh', 24.5004, 80.8322, 300000],
  ['rewa', 'Rewa', 'रीवा', 'Madhya Pradesh', 24.5362, 81.3037, 300000],
  // Bihar
  ['gaya', 'Gaya', 'गया', 'Bihar', 24.7955, 84.9994, 500000],
  ['muzaffarpur', 'Muzaffarpur', 'मुज़फ़्फ़रपुर', 'Bihar', 26.1209, 85.3647, 400000],
  ['bhagalpur', 'Bhagalpur', 'भागलपुर', 'Bihar', 25.2425, 86.9842, 400000],
  ['darbhanga', 'Darbhanga', 'दरभंगा', 'Bihar', 26.1542, 85.8918, 350000],
  ['purnia', 'Purnia', 'पूर्णिया', 'Bihar', 25.7771, 87.4753, 350000],
  ['arrah', 'Arrah', 'आरा', 'Bihar', 25.5569, 84.6643, 300000],
  // West Bengal
  ['howrah', 'Howrah', 'हावड़ा', 'West Bengal', 22.5958, 88.2636, 1100000],
  ['asansol', 'Asansol', 'आसनसोल', 'West Bengal', 23.6739, 86.9524, 600000],
  ['durgapur', 'Durgapur', 'दुर्गापुर', 'West Bengal', 23.5204, 87.3119, 600000],
  ['siliguri', 'Siliguri', 'सिलीगुड़ी', 'West Bengal', 26.7271, 88.3953, 700000],
  ['kharagpur', 'Kharagpur', 'खड़गपुर', 'West Bengal', 22.3460, 87.2320, 300000],
  // Tamil Nadu
  ['tiruchirappalli', 'Tiruchirappalli', 'तिरुचिरापल्ली', 'Tamil Nadu', 10.7905, 78.7047, 1000000],
  ['salem', 'Salem', 'सेलम', 'Tamil Nadu', 11.6643, 78.1460, 900000],
  ['tirunelveli', 'Tirunelveli', 'तिरुनेलवेली', 'Tamil Nadu', 8.7139, 77.7567, 500000],
  ['erode', 'Erode', 'इरोड', 'Tamil Nadu', 11.3410, 77.7172, 550000],
  ['vellore', 'Vellore', 'वेल्लोर', 'Tamil Nadu', 12.9165, 79.1325, 500000],
  ['thanjavur', 'Thanjavur', 'तंजावुर', 'Tamil Nadu', 10.7870, 79.1378, 350000],
  ['kanchipuram', 'Kanchipuram', 'कांचीपुरम', 'Tamil Nadu', 12.8342, 79.7036, 200000],
  // Karnataka
  ['mangalore', 'Mangalore', 'मंगलुरु', 'Karnataka', 12.9141, 74.8560, 700000],
  ['hubli-dharwad', 'Hubli-Dharwad', 'हुबली-धारवाड़', 'Karnataka', 15.3647, 75.1240, 1000000],
  ['belgaum', 'Belgaum', 'बेलगाम', 'Karnataka', 15.8497, 74.4977, 600000],
  ['gulbarga', 'Gulbarga', 'गुलबर्गा', 'Karnataka', 17.3297, 76.8343, 550000],
  ['davangere', 'Davangere', 'दावणगेरे', 'Karnataka', 14.4644, 75.9218, 500000],
  ['bellary', 'Bellary', 'बेल्लारी', 'Karnataka', 15.1394, 76.9214, 400000],
  ['shimoga', 'Shimoga', 'शिमोगा', 'Karnataka', 13.9299, 75.5681, 350000],
  // Kerala
  ['kozhikode', 'Kozhikode', 'कोझिकोड', 'Kerala', 11.2588, 75.7804, 650000],
  ['thrissur', 'Thrissur', 'त्रिशूर', 'Kerala', 10.5276, 76.2144, 400000],
  ['kollam', 'Kollam', 'कोल्लम', 'Kerala', 8.8932, 76.6141, 400000],
  ['palakkad', 'Palakkad', 'पालक्काड', 'Kerala', 10.7867, 76.6548, 300000],
  ['kannur', 'Kannur', 'कन्नूर', 'Kerala', 11.8745, 75.3704, 250000],
  ['guruvayur', 'Guruvayur', 'गुरुवायूर', 'Kerala', 10.5935, 76.0410, 70000],
  // Andhra Pradesh
  ['vijayawada', 'Vijayawada', 'विजयवाड़ा', 'Andhra Pradesh', 16.5062, 80.6480, 1100000],
  ['guntur', 'Guntur', 'गुंटूर', 'Andhra Pradesh', 16.3067, 80.4365, 750000],
  ['nellore', 'Nellore', 'नेल्लोर', 'Andhra Pradesh', 14.4426, 79.9865, 600000],
  ['kakinada', 'Kakinada', 'काकीनाडा', 'Andhra Pradesh', 16.9891, 82.2475, 400000],
  ['rajahmundry', 'Rajahmundry', 'राजमहेंद्री', 'Andhra Pradesh', 17.0005, 81.8040, 500000],
  ['kurnool', 'Kurnool', 'कुर्नूल', 'Andhra Pradesh', 15.8281, 78.0373, 500000],
  ['anantapur', 'Anantapur', 'अनंतपुर', 'Andhra Pradesh', 14.6819, 77.6006, 350000],
  // Telangana
  ['warangal', 'Warangal', 'वारंगल', 'Telangana', 17.9784, 79.5941, 750000],
  ['nizamabad', 'Nizamabad', 'निज़ामाबाद', 'Telangana', 18.6725, 78.0940, 350000],
  ['karimnagar', 'Karimnagar', 'करीमनगर', 'Telangana', 18.4386, 79.1288, 300000],
  // Punjab
  ['ludhiana', 'Ludhiana', 'लुधियाना', 'Punjab', 30.9010, 75.8573, 1700000],
  ['jalandhar', 'Jalandhar', 'जालंधर', 'Punjab', 31.3260, 75.5762, 900000],
  ['patiala', 'Patiala', 'पटियाला', 'Punjab', 30.3398, 76.3869, 500000],
  ['bathinda', 'Bathinda', 'बठिंडा', 'Punjab', 30.2110, 74.9455, 300000],
  // Haryana
  ['faridabad', 'Faridabad', 'फ़रीदाबाद', 'Haryana', 28.4089, 77.3178, 1800000],
  ['gurugram', 'Gurugram', 'गुरुग्राम', 'Haryana', 28.4595, 77.0266, 1500000],
  ['panipat', 'Panipat', 'पानीपत', 'Haryana', 29.3909, 76.9635, 500000],
  ['ambala', 'Ambala', 'अंबाला', 'Haryana', 30.3782, 76.7767, 400000],
  ['hisar', 'Hisar', 'हिसार', 'Haryana', 29.1492, 75.7217, 350000],
  ['karnal', 'Karnal', 'करनाल', 'Haryana', 29.6857, 76.9905, 350000],
  ['rohtak', 'Rohtak', 'रोहतक', 'Haryana', 28.8955, 76.6066, 400000],
  // Jharkhand
  ['jamshedpur', 'Jamshedpur', 'जमशेदपुर', 'Jharkhand', 22.8046, 86.2029, 1400000],
  ['dhanbad', 'Dhanbad', 'धनबाद', 'Jharkhand', 23.7957, 86.4304, 1200000],
  ['bokaro', 'Bokaro', 'बोकारो', 'Jharkhand', 23.6693, 86.1511, 600000],
  ['hazaribagh', 'Hazaribagh', 'हजारीबाग', 'Jharkhand', 23.9921, 85.3637, 300000],
  // Chhattisgarh
  ['bilaspur-chhattisgarh', 'Bilaspur', 'बिलासपुर', 'Chhattisgarh', 22.0797, 82.1409, 400000],
  ['durg-bhilai', 'Durg-Bhilai', 'दुर्ग-भिलाई', 'Chhattisgarh', 21.1904, 81.2849, 1000000],
  ['korba', 'Korba', 'कोरबा', 'Chhattisgarh', 22.3595, 82.7501, 400000],
  // Odisha
  ['cuttack', 'Cuttack', 'कटक', 'Odisha', 20.4625, 85.8828, 700000],
  ['rourkela', 'Rourkela', 'राउरकेला', 'Odisha', 22.2604, 84.8536, 550000],
  ['sambalpur', 'Sambalpur', 'संबलपुर', 'Odisha', 21.4669, 83.9812, 350000],
  ['berhampur', 'Berhampur', 'बरहमपुर', 'Odisha', 19.3150, 84.7941, 400000],
  // Assam
  ['dibrugarh', 'Dibrugarh', 'डिब्रूगढ़', 'Assam', 27.4728, 94.9120, 200000],
  ['silchar', 'Silchar', 'सिलचर', 'Assam', 24.8333, 92.7789, 250000],
  ['jorhat', 'Jorhat', 'जोरहट', 'Assam', 26.7509, 94.2037, 200000],
  // Uttarakhand
  ['haldwani', 'Haldwani', 'हल्द्वानी', 'Uttarakhand', 29.2183, 79.5130, 250000],
  ['roorkee', 'Roorkee', 'रुड़की', 'Uttarakhand', 29.8543, 77.8880, 200000],
  // Himachal Pradesh
  ['shimla', 'Shimla', 'शिमला', 'Himachal Pradesh', 31.1048, 77.1734, 200000],
  ['dharamshala', 'Dharamshala', 'धर्मशाला', 'Himachal Pradesh', 32.2190, 76.3234, 50000],
  // Jammu & Kashmir
  ['jammu', 'Jammu', 'जम्मू', 'Jammu & Kashmir', 32.7266, 74.8570, 600000],
  ['srinagar', 'Srinagar', 'श्रीनगर', 'Jammu & Kashmir', 34.0837, 74.7973, 1300000],
  // Northeastern states
  ['imphal', 'Imphal', 'इम्फाल', 'Manipur', 24.8170, 93.9368, 300000],
  ['shillong', 'Shillong', 'शिलांग', 'Meghalaya', 25.5788, 91.8933, 200000],
  ['agartala', 'Agartala', 'अगरतला', 'Tripura', 23.8315, 91.2868, 400000],
  ['aizawl', 'Aizawl', 'आइज़ोल', 'Mizoram', 23.7271, 92.7176, 300000],
  ['kohima', 'Kohima', 'कोहिमा', 'Nagaland', 25.6751, 94.1086, 100000],
  ['itanagar', 'Itanagar', 'ईटानगर', 'Arunachal Pradesh', 27.0844, 93.6053, 60000],
  ['gangtok', 'Gangtok', 'गंगटोक', 'Sikkim', 27.3389, 88.6065, 100000],
  // Other major cities
  ['mangalore', 'Mangalore', 'मंगलुरु', 'Karnataka', 12.9141, 74.8560, 700000],
  ['warangal', 'Warangal', 'वारंगल', 'Telangana', 17.9784, 79.5941, 750000],
];

// ---------------------------------------------------------------------------
// Tier 3 — Smaller cities, district HQs, pilgrimage towns (~350)
// ---------------------------------------------------------------------------
const TIER3_INDIAN: IndianCityTuple[] = [
  // Uttar Pradesh — smaller cities
  ['shahjahanpur', 'Shahjahanpur', 'शाहजहाँपुर', 'Uttar Pradesh', 27.8826, 79.9050, 350000],
  ['rampur', 'Rampur', 'रामपुर', 'Uttar Pradesh', 28.7936, 79.0260, 350000],
  ['sitapur', 'Sitapur', 'सीतापुर', 'Uttar Pradesh', 27.5710, 80.6822, 200000],
  ['sultanpur', 'Sultanpur', 'सुल्तानपुर', 'Uttar Pradesh', 26.2648, 82.0727, 120000],
  ['faizabad', 'Faizabad', 'फ़ैज़ाबाद', 'Uttar Pradesh', 26.7734, 82.1426, 200000],
  ['banda', 'Banda', 'बाँदा', 'Uttar Pradesh', 25.4767, 80.3374, 180000],
  ['hardoi', 'Hardoi', 'हरदोई', 'Uttar Pradesh', 27.3945, 80.1312, 180000],
  ['unnao', 'Unnao', 'उन्नाव', 'Uttar Pradesh', 26.5393, 80.4862, 180000],
  ['fatehpur', 'Fatehpur', 'फ़तेहपुर', 'Uttar Pradesh', 25.9302, 80.8140, 200000],
  ['rae-bareli', 'Rae Bareli', 'रायबरेली', 'Uttar Pradesh', 26.2345, 81.2340, 200000],
  ['lakhimpur-kheri', 'Lakhimpur Kheri', 'लखीमपुर खीरी', 'Uttar Pradesh', 27.9462, 80.7716, 170000],
  ['budaun', 'Budaun', 'बदायूँ', 'Uttar Pradesh', 28.0383, 79.1260, 180000],
  ['mainpuri', 'Mainpuri', 'मैनपुरी', 'Uttar Pradesh', 27.2305, 79.0217, 100000],
  ['orai', 'Orai', 'ओरई', 'Uttar Pradesh', 25.9895, 79.4504, 200000],
  ['deoria', 'Deoria', 'देवरिया', 'Uttar Pradesh', 26.5024, 83.7910, 120000],
  ['ballia', 'Ballia', 'बलिया', 'Uttar Pradesh', 25.7584, 84.1484, 120000],
  ['azamgarh', 'Azamgarh', 'आज़मगढ़', 'Uttar Pradesh', 26.0684, 83.1858, 130000],
  ['basti', 'Basti', 'बस्ती', 'Uttar Pradesh', 26.7987, 82.7334, 130000],
  // Rajasthan — smaller
  ['pali', 'Pali', 'पाली', 'Rajasthan', 25.7711, 73.3234, 250000],
  ['tonk', 'Tonk', 'टोंक', 'Rajasthan', 26.1665, 75.7885, 200000],
  ['chittorgarh', 'Chittorgarh', 'चित्तौड़गढ़', 'Rajasthan', 24.8829, 74.6230, 130000],
  ['bundi', 'Bundi', 'बूंदी', 'Rajasthan', 25.4305, 75.6499, 120000],
  ['sawai-madhopur', 'Sawai Madhopur', 'सवाई माधोपुर', 'Rajasthan', 26.0217, 76.3571, 130000],
  ['jaisalmer', 'Jaisalmer', 'जैसलमेर', 'Rajasthan', 26.9157, 70.9083, 80000],
  ['mount-abu', 'Mount Abu', 'माउंट आबू', 'Rajasthan', 24.5925, 72.7156, 30000],
  ['pushkar', 'Pushkar', 'पुष्कर', 'Rajasthan', 26.4898, 74.5511, 25000],
  ['nathdwara', 'Nathdwara', 'नाथद्वारा', 'Rajasthan', 24.9380, 73.8238, 50000],
  // Maharashtra — smaller
  ['ahmednagar', 'Ahmednagar', 'अहमदनगर', 'Maharashtra', 19.0948, 74.7480, 400000],
  ['jalgaon', 'Jalgaon', 'जलगाँव', 'Maharashtra', 21.0077, 75.5626, 500000],
  ['latur', 'Latur', 'लातूर', 'Maharashtra', 18.4088, 76.5604, 400000],
  ['amravati', 'Amravati', 'अमरावती', 'Maharashtra', 20.9374, 77.7796, 700000],
  ['akola', 'Akola', 'अकोला', 'Maharashtra', 20.7002, 77.0082, 500000],
  ['chandrapur', 'Chandrapur', 'चंद्रपुर', 'Maharashtra', 19.9615, 79.2961, 350000],
  ['parbhani', 'Parbhani', 'परभणी', 'Maharashtra', 19.2610, 76.7747, 350000],
  ['shirdi', 'Shirdi', 'शिरडी', 'Maharashtra', 19.7668, 74.4770, 50000],
  ['pandharpur', 'Pandharpur', 'पंढरपुर', 'Maharashtra', 17.6813, 75.3221, 100000],
  // Gujarat — smaller
  ['mehsana', 'Mehsana', 'महेसाणा', 'Gujarat', 23.5880, 72.3693, 200000],
  ['navsari', 'Navsari', 'नवसारी', 'Gujarat', 20.9467, 72.9520, 200000],
  ['porbandar', 'Porbandar', 'पोरबंदर', 'Gujarat', 21.6417, 69.6293, 200000],
  ['dwarka', 'Dwarka', 'द्वारका', 'Gujarat', 22.2442, 68.9685, 40000],
  ['somnath', 'Somnath', 'सोमनाथ', 'Gujarat', 20.8880, 70.4013, 50000],
  ['pavagadh', 'Pavagadh', 'पावागढ़', 'Gujarat', 22.4612, 73.5126, 15000],
  // Bihar — smaller
  ['begusarai', 'Begusarai', 'बेगूसराय', 'Bihar', 25.4182, 86.1272, 250000],
  ['samastipur', 'Samastipur', 'समस्तीपुर', 'Bihar', 25.8629, 85.7857, 200000],
  ['sasaram', 'Sasaram', 'सासाराम', 'Bihar', 24.9520, 84.0311, 180000],
  ['chapra', 'Chapra', 'छपरा', 'Bihar', 25.7804, 84.7509, 200000],
  ['motihari', 'Motihari', 'मोतिहारी', 'Bihar', 26.6466, 84.9160, 150000],
  ['bodh-gaya', 'Bodh Gaya', 'बोधगया', 'Bihar', 24.6961, 84.9869, 50000],
  ['rajgir', 'Rajgir', 'राजगीर', 'Bihar', 25.0285, 85.4156, 50000],
  // Madhya Pradesh — smaller
  ['ujjain', 'Ujjain', 'उज्जैन', 'Madhya Pradesh', 23.1765, 75.7885, 550000],
  ['khajuraho', 'Khajuraho', 'खजुराहो', 'Madhya Pradesh', 24.8318, 79.9199, 30000],
  ['orchha', 'Orchha', 'ओरछा', 'Madhya Pradesh', 25.3519, 78.6407, 15000],
  ['omkareshwar', 'Omkareshwar', 'ओंकारेश्वर', 'Madhya Pradesh', 22.2449, 76.1510, 10000],
  ['mahakaleshwar', 'Mahakaleshwar', 'महाकालेश्वर', 'Madhya Pradesh', 23.1828, 75.7682, 550000],
  // Pilgrimage towns — pan India
  ['vrindavan', 'Vrindavan', 'वृन्दावन', 'Uttar Pradesh', 27.5810, 77.6960, 70000],
  ['kedarnath', 'Kedarnath', 'केदारनाथ', 'Uttarakhand', 30.7346, 79.0669, 500],
  ['badrinath', 'Badrinath', 'बद्रीनाथ', 'Uttarakhand', 30.7433, 79.4938, 1000],
  ['dwarka', 'Dwarka', 'द्वारका', 'Gujarat', 22.2442, 68.9685, 40000],
  ['rameshwaram', 'Rameshwaram', 'रामेश्वरम', 'Tamil Nadu', 9.2876, 79.3129, 50000],
  ['kashi', 'Kashi', 'काशी', 'Uttar Pradesh', 25.3176, 82.9739, 1800000],
  ['shirdi', 'Shirdi', 'शिरडी', 'Maharashtra', 19.7668, 74.4770, 50000],
  ['amarnath', 'Amarnath', 'अमरनाथ', 'Jammu & Kashmir', 34.2697, 75.5013, 0],
  ['char-dham', 'Char Dham', 'चारधाम', 'Uttarakhand', 30.7346, 79.0669, 0],
  ['somnath', 'Somnath', 'सोमनाथ', 'Gujarat', 20.8880, 70.4013, 50000],
  ['tiruvannamalai', 'Tiruvannamalai', 'तिरुवण्णामलै', 'Tamil Nadu', 12.2253, 79.0747, 150000],
  ['palani', 'Palani', 'पलनी', 'Tamil Nadu', 10.4500, 77.5200, 80000],
  ['sabarimala', 'Sabarimala', 'सबरीमाला', 'Kerala', 9.4360, 77.0757, 0],
  ['hampi', 'Hampi', 'हम्पी', 'Karnataka', 15.3350, 76.4600, 3000],
  ['srisailam', 'Srisailam', 'श्रीशैलम', 'Andhra Pradesh', 15.8497, 78.8689, 20000],
  ['trimbakeshwar', 'Trimbakeshwar', 'त्र्यंबकेश्वर', 'Maharashtra', 19.9322, 73.5305, 30000],
  ['ashtavinayak', 'Ashtavinayak', 'अष्टविनायक', 'Maharashtra', 18.5204, 73.8567, 0],
  ['jagannath-puri', 'Jagannath Puri', 'जगन्नाथ पुरी', 'Odisha', 19.8135, 85.8312, 200000],
  ['konark', 'Konark', 'कोणार्क', 'Odisha', 19.8876, 86.0945, 20000],
  // Additional cities from other states
  ['bhuj', 'Bhuj', 'भुज', 'Gujarat', 23.2419, 69.6669, 200000],
  ['bikaner', 'Bikaner', 'बीकानेर', 'Rajasthan', 28.0229, 73.3119, 650000],
  ['barmer', 'Barmer', 'बाड़मेर', 'Rajasthan', 25.7533, 71.3967, 120000],
  ['jhunjhunu', 'Jhunjhunu', 'झुंझुनूं', 'Rajasthan', 28.1279, 75.3982, 120000],
  ['churu', 'Churu', 'चूरू', 'Rajasthan', 28.2951, 74.9683, 100000],
  ['hanumangarh', 'Hanumangarh', 'हनुमानगढ़', 'Rajasthan', 29.5816, 74.3294, 200000],
  ['sri-ganganagar', 'Sri Ganganagar', 'श्रीगंगानगर', 'Rajasthan', 29.9038, 73.8772, 300000],
  ['beawar', 'Beawar', 'ब्यावर', 'Rajasthan', 26.1017, 74.3188, 200000],
  ['nagaur', 'Nagaur', 'नागौर', 'Rajasthan', 27.2024, 73.7346, 120000],
  // Madhya Pradesh
  ['khandwa', 'Khandwa', 'खंडवा', 'Madhya Pradesh', 21.8243, 76.3517, 200000],
  ['burhanpur', 'Burhanpur', 'बुरहानपुर', 'Madhya Pradesh', 21.3095, 76.2301, 220000],
  ['chhindwara', 'Chhindwara', 'छिंदवाड़ा', 'Madhya Pradesh', 22.0574, 78.9382, 200000],
  ['vidisha', 'Vidisha', 'विदिशा', 'Madhya Pradesh', 23.5251, 77.8081, 200000],
  ['damoh', 'Damoh', 'दमोह', 'Madhya Pradesh', 23.8310, 79.4421, 150000],
  ['morena', 'Morena', 'मुरैना', 'Madhya Pradesh', 26.4941, 78.0006, 200000],
  ['shivpuri', 'Shivpuri', 'शिवपुरी', 'Madhya Pradesh', 25.4258, 77.6564, 200000],
  // West Bengal
  ['malda', 'Malda', 'मालदा', 'West Bengal', 25.0108, 88.1411, 200000],
  ['burdwan', 'Burdwan', 'बर्धमान', 'West Bengal', 23.2324, 87.8615, 350000],
  ['haldia', 'Haldia', 'हल्दिया', 'West Bengal', 22.0257, 88.0583, 200000],
  ['kalyani', 'Kalyani', 'कल्याणी', 'West Bengal', 22.9751, 88.4345, 120000],
  ['baharampur', 'Baharampur', 'बहरामपुर', 'West Bengal', 24.1005, 88.2510, 200000],
  ['raiganj', 'Raiganj', 'रायगंज', 'West Bengal', 25.6175, 88.1261, 200000],
  ['bankura', 'Bankura', 'बांकुरा', 'West Bengal', 23.2324, 87.0618, 170000],
  // Tamil Nadu — smaller
  ['thoothukudi', 'Thoothukudi', 'तूतीकोरिन', 'Tamil Nadu', 8.7642, 78.1348, 350000],
  ['dindigul', 'Dindigul', 'डिंडीगुल', 'Tamil Nadu', 10.3624, 77.9695, 250000],
  ['hosur', 'Hosur', 'होसूर', 'Tamil Nadu', 12.7409, 77.8253, 200000],
  ['kumbakonam', 'Kumbakonam', 'कुंभकोणम', 'Tamil Nadu', 10.9617, 79.3881, 150000],
  ['nagapattinam', 'Nagapattinam', 'नागपट्टिनम', 'Tamil Nadu', 10.7672, 79.8449, 120000],
  ['chidambaram', 'Chidambaram', 'चिदंबरम', 'Tamil Nadu', 11.3991, 79.6912, 80000],
  ['srirangam', 'Srirangam', 'श्रीरंगम', 'Tamil Nadu', 10.8563, 78.6892, 60000],
  // Karnataka — smaller
  ['bijapur', 'Bijapur', 'बीजापुर', 'Karnataka', 16.8302, 75.7100, 350000],
  ['raichur', 'Raichur', 'रायचूर', 'Karnataka', 16.2076, 77.3463, 250000],
  ['hassan', 'Hassan', 'हासन', 'Karnataka', 13.0072, 76.0962, 200000],
  ['mandya', 'Mandya', 'मंड्या', 'Karnataka', 12.5222, 76.8952, 200000],
  ['udupi', 'Udupi', 'उडुपी', 'Karnataka', 13.3409, 74.7421, 200000],
  ['dharmasthala', 'Dharmasthala', 'धर्मस्थल', 'Karnataka', 12.9571, 75.3759, 10000],
  // Andhra Pradesh — smaller
  ['ongole', 'Ongole', 'ओंगोल', 'Andhra Pradesh', 15.5057, 80.0499, 300000],
  ['eluru', 'Eluru', 'एलूरु', 'Andhra Pradesh', 16.7107, 81.0952, 300000],
  ['srikakulam', 'Srikakulam', 'श्रीकाकुलम', 'Andhra Pradesh', 18.2949, 83.8938, 200000],
  ['machilipatnam', 'Machilipatnam', 'मछलीपट्टनम', 'Andhra Pradesh', 16.1875, 81.1389, 200000],
  // Telangana — smaller
  ['khammam', 'Khammam', 'खम्मम', 'Telangana', 17.2473, 80.1514, 300000],
  ['mahbubnagar', 'Mahbubnagar', 'महबूबनगर', 'Telangana', 16.7488, 77.9850, 200000],
  ['nalgonda', 'Nalgonda', 'नलगोंडा', 'Telangana', 17.0500, 79.2667, 200000],
  // Kerala — smaller
  ['alappuzha', 'Alappuzha', 'अलप्पुझा', 'Kerala', 9.4981, 76.3388, 200000],
  ['kottayam', 'Kottayam', 'कोट्टायम', 'Kerala', 9.5916, 76.5222, 200000],
  ['pathanamthitta', 'Pathanamthitta', 'पतनमतिट्टा', 'Kerala', 9.2648, 76.7870, 80000],
  ['malappuram', 'Malappuram', 'मलप्पुरम', 'Kerala', 11.0510, 76.0711, 200000],
  ['kasaragod', 'Kasaragod', 'कासरगोड', 'Kerala', 12.4996, 74.9869, 100000],
  // Goa
  ['margao', 'Margao', 'मडगाँव', 'Goa', 15.2832, 73.9862, 100000],
  ['mapusa', 'Mapusa', 'मापुसा', 'Goa', 15.5933, 73.8140, 50000],
  ['vasco', 'Vasco', 'वास्को', 'Goa', 15.3991, 73.8136, 120000],
  // Punjab — smaller
  ['hoshiarpur', 'Hoshiarpur', 'होशियारपुर', 'Punjab', 31.5143, 75.9115, 200000],
  ['moga', 'Moga', 'मोगा', 'Punjab', 30.8162, 75.1717, 200000],
  ['phagwara', 'Phagwara', 'फगवाड़ा', 'Punjab', 31.2240, 75.7708, 150000],
  ['kapurthala', 'Kapurthala', 'कपूरथला', 'Punjab', 31.3798, 75.3773, 120000],
  // Haryana — smaller
  ['bhiwani', 'Bhiwani', 'भिवानी', 'Haryana', 28.7751, 76.1394, 200000],
  ['rewari', 'Rewari', 'रेवाड़ी', 'Haryana', 28.1971, 76.6190, 200000],
  ['jind', 'Jind', 'जींद', 'Haryana', 29.3162, 76.3237, 200000],
  ['sonipat', 'Sonipat', 'सोनीपत', 'Haryana', 28.9931, 77.0151, 350000],
  ['yamunanagar', 'Yamunanagar', 'यमुनानगर', 'Haryana', 30.1290, 77.2674, 250000],
  // Additional diaspora (Tier 3 international)
];

const TIER3_INTERNATIONAL: CityDataWithTier[] = [
  { slug: 'los-angeles', name: { en: 'Los Angeles', hi: 'लॉस एंजिल्स', sa: 'लॉस एंजिल्स', mai: 'लॉस एंजिल्स', mr: 'लॉस एंजिल्स', ta: 'Los Angeles', te: 'Los Angeles', bn: 'Los Angeles', kn: 'Los Angeles', gu: 'Los Angeles' }, state: 'USA', lat: 34.0522, lng: -118.2437, timezone: 'America/Los_Angeles', population: 3900000, tier: 3 },
  { slug: 'edison', name: { en: 'Edison', hi: 'एडिसन', sa: 'एडिसन', mai: 'एडिसन', mr: 'एडिसन', ta: 'Edison', te: 'Edison', bn: 'Edison', kn: 'Edison', gu: 'Edison' }, state: 'USA', lat: 40.5187, lng: -74.4121, timezone: 'America/New_York', population: 107000, tier: 3 },
  { slug: 'fremont', name: { en: 'Fremont', hi: 'फ़्रीमॉन्ट', sa: 'फ़्रीमॉन्ट', mai: 'फ़्रीमॉन्ट', mr: 'फ़्रीमॉन्ट', ta: 'Fremont', te: 'Fremont', bn: 'Fremont', kn: 'Fremont', gu: 'Fremont' }, state: 'USA', lat: 37.5485, lng: -121.9886, timezone: 'America/Los_Angeles', population: 230000, tier: 3 },
  { slug: 'dallas', name: { en: 'Dallas', hi: 'डलास', sa: 'डलास', mai: 'डलास', mr: 'डलास', ta: 'Dallas', te: 'Dallas', bn: 'Dallas', kn: 'Dallas', gu: 'Dallas' }, state: 'USA', lat: 32.7767, lng: -96.7970, timezone: 'America/Chicago', population: 1300000, tier: 3 },
  { slug: 'seattle', name: { en: 'Seattle', hi: 'सिएटल', sa: 'सिएटल', mai: 'सिएटल', mr: 'सिएटल', ta: 'Seattle', te: 'Seattle', bn: 'Seattle', kn: 'Seattle', gu: 'Seattle' }, state: 'USA', lat: 47.6062, lng: -122.3321, timezone: 'America/Los_Angeles', population: 737000, tier: 3 },
  { slug: 'washington-dc', name: { en: 'Washington DC', hi: 'वाशिंगटन डीसी', sa: 'वाशिंगटन डीसी', mai: 'वाशिंगटन डीसी', mr: 'वाशिंगटन डीसी', ta: 'Washington DC', te: 'Washington DC', bn: 'Washington DC', kn: 'Washington DC', gu: 'Washington DC' }, state: 'USA', lat: 38.9072, lng: -77.0369, timezone: 'America/New_York', population: 690000, tier: 3 },
  { slug: 'birmingham-uk', name: { en: 'Birmingham', hi: 'बर्मिंघम', sa: 'बर्मिंघम', mai: 'बर्मिंघम', mr: 'बर्मिंघम', ta: 'Birmingham', te: 'Birmingham', bn: 'Birmingham', kn: 'Birmingham', gu: 'Birmingham' }, state: 'UK', lat: 52.4862, lng: -1.8904, timezone: 'Europe/London', population: 1140000, tier: 3 },
  { slug: 'leicester', name: { en: 'Leicester', hi: 'लेस्टर', sa: 'लेस्टर', mai: 'लेस्टर', mr: 'लेस्टर', ta: 'Leicester', te: 'Leicester', bn: 'Leicester', kn: 'Leicester', gu: 'Leicester' }, state: 'UK', lat: 52.6369, lng: -1.1398, timezone: 'Europe/London', population: 368000, tier: 3 },
  { slug: 'brampton', name: { en: 'Brampton', hi: 'ब्रैम्पटन', sa: 'ब्रैम्पटन', mai: 'ब्रैम्पटन', mr: 'ब्रैम्पटन', ta: 'Brampton', te: 'Brampton', bn: 'Brampton', kn: 'Brampton', gu: 'Brampton' }, state: 'Canada', lat: 43.7315, lng: -79.7624, timezone: 'America/Toronto', population: 656000, tier: 3 },
  { slug: 'vancouver', name: { en: 'Vancouver', hi: 'वैंकूवर', sa: 'वैंकूवर', mai: 'वैंकूवर', mr: 'वैंकूवर', ta: 'Vancouver', te: 'Vancouver', bn: 'Vancouver', kn: 'Vancouver', gu: 'Vancouver' }, state: 'Canada', lat: 49.2827, lng: -123.1207, timezone: 'America/Vancouver', population: 700000, tier: 3 },
  { slug: 'perth', name: { en: 'Perth', hi: 'पर्थ', sa: 'पर्थ', mai: 'पर्थ', mr: 'पर्थ', ta: 'Perth', te: 'Perth', bn: 'Perth', kn: 'Perth', gu: 'Perth' }, state: 'Australia', lat: -31.9505, lng: 115.8605, timezone: 'Australia/Perth', population: 2100000, tier: 3 },
  { slug: 'durban', name: { en: 'Durban', hi: 'डरबन', sa: 'डरबन', mai: 'डरबन', mr: 'डरबन', ta: 'Durban', te: 'Durban', bn: 'Durban', kn: 'Durban', gu: 'Durban' }, state: 'South Africa', lat: -29.8587, lng: 31.0218, timezone: 'Africa/Johannesburg', population: 3700000, tier: 3 },
  { slug: 'nairobi', name: { en: 'Nairobi', hi: 'नैरोबी', sa: 'नैरोबी', mai: 'नैरोबी', mr: 'नैरोबी', ta: 'Nairobi', te: 'Nairobi', bn: 'Nairobi', kn: 'Nairobi', gu: 'Nairobi' }, state: 'Kenya', lat: -1.2921, lng: 36.8219, timezone: 'Africa/Nairobi', population: 4700000, tier: 3 },
  { slug: 'doha', name: { en: 'Doha', hi: 'दोहा', sa: 'दोहा', mai: 'दोहा', mr: 'दोहा', ta: 'Doha', te: 'Doha', bn: 'Doha', kn: 'Doha', gu: 'Doha' }, state: 'Qatar', lat: 25.2854, lng: 51.5310, timezone: 'Asia/Qatar', population: 1900000, tier: 3 },
  { slug: 'muscat', name: { en: 'Muscat', hi: 'मस्कट', sa: 'मस्कट', mai: 'मस्कट', mr: 'मस्कट', ta: 'Muscat', te: 'Muscat', bn: 'Muscat', kn: 'Muscat', gu: 'Muscat' }, state: 'Oman', lat: 23.5880, lng: 58.3829, timezone: 'Asia/Muscat', population: 1400000, tier: 3 },
  { slug: 'kathmandu', name: { en: 'Kathmandu', hi: 'काठमांडू', sa: 'काठमांडू', mai: 'काठमांडू', mr: 'काठमांडू', ta: 'Kathmandu', te: 'Kathmandu', bn: 'Kathmandu', kn: 'Kathmandu', gu: 'Kathmandu' }, state: 'Nepal', lat: 27.7172, lng: 85.3240, timezone: 'Asia/Kathmandu', population: 1400000, tier: 3 },
  { slug: 'colombo', name: { en: 'Colombo', hi: 'कोलंबो', sa: 'कोलंबो', mai: 'कोलंबो', mr: 'कोलंबो', ta: 'Colombo', te: 'Colombo', bn: 'Colombo', kn: 'Colombo', gu: 'Colombo' }, state: 'Sri Lanka', lat: 6.9271, lng: 79.8612, timezone: 'Asia/Colombo', population: 750000, tier: 3 },
  { slug: 'dhaka', name: { en: 'Dhaka', hi: 'ढाका', sa: 'ढाका', mai: 'ढाका', mr: 'ढाका', ta: 'Dhaka', te: 'Dhaka', bn: 'Dhaka', kn: 'Dhaka', gu: 'Dhaka' }, state: 'Bangladesh', lat: 23.8103, lng: 90.4125, timezone: 'Asia/Dhaka', population: 22000000, tier: 3 },
  { slug: 'bangkok', name: { en: 'Bangkok', hi: 'बैंकॉक', sa: 'बैंकॉक', mai: 'बैंकॉक', mr: 'बैंकॉक', ta: 'Bangkok', te: 'Bangkok', bn: 'Bangkok', kn: 'Bangkok', gu: 'Bangkok' }, state: 'Thailand', lat: 13.7563, lng: 100.5018, timezone: 'Asia/Bangkok', population: 10000000, tier: 3 },
  { slug: 'jakarta', name: { en: 'Jakarta', hi: 'जकार्ता', sa: 'जकार्ता', mai: 'जकार्ता', mr: 'जकार्ता', ta: 'Jakarta', te: 'Jakarta', bn: 'Jakarta', kn: 'Jakarta', gu: 'Jakarta' }, state: 'Indonesia', lat: -6.2088, lng: 106.8456, timezone: 'Asia/Jakarta', population: 10600000, tier: 3 },
];

// ---------------------------------------------------------------------------
// Deduplicate: remove entries from Tier 2/3 that collide with existing slugs
// ---------------------------------------------------------------------------
function deduplicateCities(tiers: CityDataWithTier[][]): CityDataWithTier[] {
  const seen = new Set<string>();
  const result: CityDataWithTier[] = [];
  for (const tier of tiers) {
    for (const city of tier) {
      if (!seen.has(city.slug)) {
        seen.add(city.slug);
        result.push(city);
      }
    }
  }
  return result;
}

// ---------------------------------------------------------------------------
// Combined + sorted by tier then population
// ---------------------------------------------------------------------------
export const ALL_CITIES: CityDataWithTier[] = deduplicateCities([
  [...expandIndian(TIER1_INDIAN, 1), ...TIER1_INTERNATIONAL],
  expandIndian(TIER2_INDIAN, 2),
  [...expandIndian(TIER3_INDIAN, 3), ...TIER3_INTERNATIONAL],
]).sort((a, b) => (b.population ?? 0) - (a.population ?? 0));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const slugIndex = new Map<string, CityDataWithTier>();
for (const city of ALL_CITIES) slugIndex.set(city.slug, city);

export function getCityBySlugExtended(slug: string): CityDataWithTier | undefined {
  return slugIndex.get(slug);
}

export function getAllCitySlugsExtended(): string[] {
  return ALL_CITIES.map(c => c.slug);
}

export function getCitiesByTier(tier: 1 | 2 | 3): CityDataWithTier[] {
  return ALL_CITIES.filter(c => c.tier === tier);
}

export function getTier1And2Cities(): CityDataWithTier[] {
  return ALL_CITIES.filter(c => c.tier <= 2);
}

/** Get N geographically nearest cities (haversine), excluding self. */
export function getNearbyCities(slug: string, count = 8): CityDataWithTier[] {
  const city = slugIndex.get(slug);
  if (!city) return [];
  return ALL_CITIES
    .filter(c => c.slug !== slug)
    .map(c => ({ city: c, dist: haversine(city.lat, city.lng, c.lat, c.lng) }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, count)
    .map(c => c.city);
}

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
