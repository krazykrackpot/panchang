import type { LocaleText } from '@/types/panchang';
/**
 * City data for city-specific panchang pages.
 * Top 50 Indian cities + 10 international Hindu diaspora cities.
 */

export interface CityData {
  slug: string;           // URL-safe: 'delhi', 'mumbai', 'new-york'
  name: LocaleText;
  state?: string;         // Indian state or country
  lat: number;
  lng: number;
  timezone: string;       // IANA timezone
  population?: number;    // for sorting
}

export const CITIES: CityData[] = [
  // ── Top Indian cities by search volume ──
  { slug: 'delhi', name: { en: 'Delhi', hi: 'दिल्ली', sa: 'दिल्ली', mai: 'दिल्ली', mr: 'दिल्ली', ta: 'Delhi', te: 'Delhi', bn: 'Delhi', kn: 'Delhi', gu: 'Delhi' }, state: 'Delhi', lat: 28.6139, lng: 77.2090, timezone: 'Asia/Kolkata', population: 32000000 },
  { slug: 'mumbai', name: { en: 'Mumbai', hi: 'मुंबई', sa: 'मुंबई', mai: 'मुंबई', mr: 'मुंबई', ta: 'Mumbai', te: 'Mumbai', bn: 'Mumbai', kn: 'Mumbai', gu: 'Mumbai' }, state: 'Maharashtra', lat: 19.0760, lng: 72.8777, timezone: 'Asia/Kolkata', population: 21000000 },
  { slug: 'bangalore', name: { en: 'Bangalore', hi: 'बेंगलुरु', sa: 'बेंगलुरु', mai: 'बेंगलुरु', mr: 'बेंगलुरु', ta: 'Bangalore', te: 'Bangalore', bn: 'Bangalore', kn: 'Bangalore', gu: 'Bangalore' }, state: 'Karnataka', lat: 12.9716, lng: 77.5946, timezone: 'Asia/Kolkata', population: 13000000 },
  { slug: 'hyderabad', name: { en: 'Hyderabad', hi: 'हैदराबाद', sa: 'हैदराबाद', mai: 'हैदराबाद', mr: 'हैदराबाद', ta: 'Hyderabad', te: 'Hyderabad', bn: 'Hyderabad', kn: 'Hyderabad', gu: 'Hyderabad' }, state: 'Telangana', lat: 17.3850, lng: 78.4867, timezone: 'Asia/Kolkata', population: 10000000 },
  { slug: 'chennai', name: { en: 'Chennai', hi: 'चेन्नई', sa: 'चेन्नई', mai: 'चेन्नई', mr: 'चेन्नई', ta: 'Chennai', te: 'Chennai', bn: 'Chennai', kn: 'Chennai', gu: 'Chennai' }, state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707, timezone: 'Asia/Kolkata', population: 11000000 },
  { slug: 'kolkata', name: { en: 'Kolkata', hi: 'कोलकाता', sa: 'कोलकाता', mai: 'कोलकाता', mr: 'कोलकाता', ta: 'Kolkata', te: 'Kolkata', bn: 'Kolkata', kn: 'Kolkata', gu: 'Kolkata' }, state: 'West Bengal', lat: 22.5726, lng: 88.3639, timezone: 'Asia/Kolkata', population: 15000000 },
  { slug: 'ahmedabad', name: { en: 'Ahmedabad', hi: 'अहमदाबाद', sa: 'अहमदाबाद', mai: 'अहमदाबाद', mr: 'अहमदाबाद', ta: 'Ahmedabad', te: 'Ahmedabad', bn: 'Ahmedabad', kn: 'Ahmedabad', gu: 'Ahmedabad' }, state: 'Gujarat', lat: 23.0225, lng: 72.5714, timezone: 'Asia/Kolkata', population: 8000000 },
  { slug: 'pune', name: { en: 'Pune', hi: 'पुणे', sa: 'पुणे', mai: 'पुणे', mr: 'पुणे', ta: 'Pune', te: 'Pune', bn: 'Pune', kn: 'Pune', gu: 'Pune' }, state: 'Maharashtra', lat: 18.5204, lng: 73.8567, timezone: 'Asia/Kolkata', population: 7500000 },
  { slug: 'jaipur', name: { en: 'Jaipur', hi: 'जयपुर', sa: 'जयपुर', mai: 'जयपुर', mr: 'जयपुर', ta: 'Jaipur', te: 'Jaipur', bn: 'Jaipur', kn: 'Jaipur', gu: 'Jaipur' }, state: 'Rajasthan', lat: 26.9124, lng: 75.7873, timezone: 'Asia/Kolkata', population: 4000000 },
  { slug: 'lucknow', name: { en: 'Lucknow', hi: 'लखनऊ', sa: 'लखनऊ', mai: 'लखनऊ', mr: 'लखनऊ', ta: 'Lucknow', te: 'Lucknow', bn: 'Lucknow', kn: 'Lucknow', gu: 'Lucknow' }, state: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462, timezone: 'Asia/Kolkata', population: 3700000 },
  { slug: 'varanasi', name: { en: 'Varanasi', hi: 'वाराणसी', sa: 'वाराणसी', mai: 'वाराणसी', mr: 'वाराणसी', ta: 'Varanasi', te: 'Varanasi', bn: 'Varanasi', kn: 'Varanasi', gu: 'Varanasi' }, state: 'Uttar Pradesh', lat: 25.3176, lng: 82.9739, timezone: 'Asia/Kolkata', population: 1800000 },
  { slug: 'patna', name: { en: 'Patna', hi: 'पटना', sa: 'पटना', mai: 'पटना', mr: 'पटना', ta: 'Patna', te: 'Patna', bn: 'Patna', kn: 'Patna', gu: 'Patna' }, state: 'Bihar', lat: 25.6093, lng: 85.1376, timezone: 'Asia/Kolkata', population: 2500000 },
  { slug: 'indore', name: { en: 'Indore', hi: 'इंदौर', sa: 'इंदौर', mai: 'इंदौर', mr: 'इंदौर', ta: 'Indore', te: 'Indore', bn: 'Indore', kn: 'Indore', gu: 'Indore' }, state: 'Madhya Pradesh', lat: 22.7196, lng: 75.8577, timezone: 'Asia/Kolkata', population: 3200000 },
  { slug: 'bhopal', name: { en: 'Bhopal', hi: 'भोपाल', sa: 'भोपाल', mai: 'भोपाल', mr: 'भोपाल', ta: 'Bhopal', te: 'Bhopal', bn: 'Bhopal', kn: 'Bhopal', gu: 'Bhopal' }, state: 'Madhya Pradesh', lat: 23.2599, lng: 77.4126, timezone: 'Asia/Kolkata', population: 2400000 },
  { slug: 'nagpur', name: { en: 'Nagpur', hi: 'नागपुर', sa: 'नागपुर', mai: 'नागपुर', mr: 'नागपुर', ta: 'Nagpur', te: 'Nagpur', bn: 'Nagpur', kn: 'Nagpur', gu: 'Nagpur' }, state: 'Maharashtra', lat: 21.1458, lng: 79.0882, timezone: 'Asia/Kolkata', population: 2800000 },
  { slug: 'chandigarh', name: { en: 'Chandigarh', hi: 'चंडीगढ़', sa: 'चंडीगढ़', mai: 'चंडीगढ़', mr: 'चंडीगढ़', ta: 'Chandigarh', te: 'Chandigarh', bn: 'Chandigarh', kn: 'Chandigarh', gu: 'Chandigarh' }, state: 'Chandigarh', lat: 30.7333, lng: 76.7794, timezone: 'Asia/Kolkata', population: 1200000 },
  { slug: 'surat', name: { en: 'Surat', hi: 'सूरत', sa: 'सूरत', mai: 'सूरत', mr: 'सूरत', ta: 'Surat', te: 'Surat', bn: 'Surat', kn: 'Surat', gu: 'Surat' }, state: 'Gujarat', lat: 21.1702, lng: 72.8311, timezone: 'Asia/Kolkata', population: 7800000 },
  { slug: 'kanpur', name: { en: 'Kanpur', hi: 'कानपुर', sa: 'कानपुर', mai: 'कानपुर', mr: 'कानपुर', ta: 'Kanpur', te: 'Kanpur', bn: 'Kanpur', kn: 'Kanpur', gu: 'Kanpur' }, state: 'Uttar Pradesh', lat: 26.4499, lng: 80.3319, timezone: 'Asia/Kolkata', population: 3100000 },
  { slug: 'coimbatore', name: { en: 'Coimbatore', hi: 'कोयम्बटूर', sa: 'कोयम्बटूर', mai: 'कोयम्बटूर', mr: 'कोयम्बटूर', ta: 'Coimbatore', te: 'Coimbatore', bn: 'Coimbatore', kn: 'Coimbatore', gu: 'Coimbatore' }, state: 'Tamil Nadu', lat: 11.0168, lng: 76.9558, timezone: 'Asia/Kolkata', population: 2200000 },
  { slug: 'visakhapatnam', name: { en: 'Visakhapatnam', hi: 'विशाखापत्तनम', sa: 'विशाखापत्तनम', mai: 'विशाखापत्तनम', mr: 'विशाखापत्तनम', ta: 'Visakhapatnam', te: 'Visakhapatnam', bn: 'Visakhapatnam', kn: 'Visakhapatnam', gu: 'Visakhapatnam' }, state: 'Andhra Pradesh', lat: 17.6868, lng: 83.2185, timezone: 'Asia/Kolkata', population: 2100000 },
  { slug: 'thiruvananthapuram', name: { en: 'Thiruvananthapuram', hi: 'तिरुवनंतपुरम', sa: 'तिरुवनंतपुरम', mai: 'तिरुवनंतपुरम', mr: 'तिरुवनंतपुरम', ta: 'Thiruvananthapuram', te: 'Thiruvananthapuram', bn: 'Thiruvananthapuram', kn: 'Thiruvananthapuram', gu: 'Thiruvananthapuram' }, state: 'Kerala', lat: 8.5241, lng: 76.9366, timezone: 'Asia/Kolkata', population: 1700000 },
  { slug: 'kochi', name: { en: 'Kochi', hi: 'कोच्चि', sa: 'कोच्चि', mai: 'कोच्चि', mr: 'कोच्चि', ta: 'Kochi', te: 'Kochi', bn: 'Kochi', kn: 'Kochi', gu: 'Kochi' }, state: 'Kerala', lat: 9.9312, lng: 76.2673, timezone: 'Asia/Kolkata', population: 2100000 },
  { slug: 'guwahati', name: { en: 'Guwahati', hi: 'गुवाहाटी', sa: 'गुवाहाटी', mai: 'गुवाहाटी', mr: 'गुवाहाटी', ta: 'Guwahati', te: 'Guwahati', bn: 'Guwahati', kn: 'Guwahati', gu: 'Guwahati' }, state: 'Assam', lat: 26.1445, lng: 91.7362, timezone: 'Asia/Kolkata', population: 1100000 },
  { slug: 'madurai', name: { en: 'Madurai', hi: 'मदुरै', sa: 'मदुरै', mai: 'मदुरै', mr: 'मदुरै', ta: 'Madurai', te: 'Madurai', bn: 'Madurai', kn: 'Madurai', gu: 'Madurai' }, state: 'Tamil Nadu', lat: 9.9252, lng: 78.1198, timezone: 'Asia/Kolkata', population: 1500000 },
  { slug: 'agra', name: { en: 'Agra', hi: 'आगरा', sa: 'आगरा', mai: 'आगरा', mr: 'आगरा', ta: 'Agra', te: 'Agra', bn: 'Agra', kn: 'Agra', gu: 'Agra' }, state: 'Uttar Pradesh', lat: 27.1767, lng: 78.0081, timezone: 'Asia/Kolkata', population: 1800000 },
  { slug: 'ujjain', name: { en: 'Ujjain', hi: 'उज्जैन', sa: 'उज्जैन', mai: 'उज्जैन', mr: 'उज्जैन', ta: 'Ujjain', te: 'Ujjain', bn: 'Ujjain', kn: 'Ujjain', gu: 'Ujjain' }, state: 'Madhya Pradesh', lat: 23.1765, lng: 75.7885, timezone: 'Asia/Kolkata', population: 550000 },
  { slug: 'haridwar', name: { en: 'Haridwar', hi: 'हरिद्वार', sa: 'हरिद्वार', mai: 'हरिद्वार', mr: 'हरिद्वार', ta: 'Haridwar', te: 'Haridwar', bn: 'Haridwar', kn: 'Haridwar', gu: 'Haridwar' }, state: 'Uttarakhand', lat: 29.9457, lng: 78.1642, timezone: 'Asia/Kolkata', population: 250000 },
  { slug: 'rishikesh', name: { en: 'Rishikesh', hi: 'ऋषिकेश', sa: 'ऋषिकेश', mai: 'ऋषिकेश', mr: 'ऋषिकेश', ta: 'Rishikesh', te: 'Rishikesh', bn: 'Rishikesh', kn: 'Rishikesh', gu: 'Rishikesh' }, state: 'Uttarakhand', lat: 30.0869, lng: 78.2676, timezone: 'Asia/Kolkata', population: 100000 },
  { slug: 'puri', name: { en: 'Puri', hi: 'पुरी', sa: 'पुरी', mai: 'पुरी', mr: 'पुरी', ta: 'Puri', te: 'Puri', bn: 'Puri', kn: 'Puri', gu: 'Puri' }, state: 'Odisha', lat: 19.8135, lng: 85.8312, timezone: 'Asia/Kolkata', population: 200000 },
  { slug: 'tirupati', name: { en: 'Tirupati', hi: 'तिरुपति', sa: 'तिरुपति', mai: 'तिरुपति', mr: 'तिरुपति', ta: 'Tirupati', te: 'Tirupati', bn: 'Tirupati', kn: 'Tirupati', gu: 'Tirupati' }, state: 'Andhra Pradesh', lat: 13.6288, lng: 79.4192, timezone: 'Asia/Kolkata', population: 375000 },
  { slug: 'amritsar', name: { en: 'Amritsar', hi: 'अमृतसर', sa: 'अमृतसर', mai: 'अमृतसर', mr: 'अमृतसर', ta: 'Amritsar', te: 'Amritsar', bn: 'Amritsar', kn: 'Amritsar', gu: 'Amritsar' }, state: 'Punjab', lat: 31.6340, lng: 74.8723, timezone: 'Asia/Kolkata', population: 1200000 },
  { slug: 'dehradun', name: { en: 'Dehradun', hi: 'देहरादून', sa: 'देहरादून', mai: 'देहरादून', mr: 'देहरादून', ta: 'Dehradun', te: 'Dehradun', bn: 'Dehradun', kn: 'Dehradun', gu: 'Dehradun' }, state: 'Uttarakhand', lat: 30.3165, lng: 78.0322, timezone: 'Asia/Kolkata', population: 700000 },
  { slug: 'ranchi', name: { en: 'Ranchi', hi: 'रांची', sa: 'रांची', mai: 'रांची', mr: 'रांची', ta: 'Ranchi', te: 'Ranchi', bn: 'Ranchi', kn: 'Ranchi', gu: 'Ranchi' }, state: 'Jharkhand', lat: 23.3441, lng: 85.3096, timezone: 'Asia/Kolkata', population: 1100000 },
  { slug: 'bhubaneswar', name: { en: 'Bhubaneswar', hi: 'भुवनेश्वर', sa: 'भुवनेश्वर', mai: 'भुवनेश्वर', mr: 'भुवनेश्वर', ta: 'Bhubaneswar', te: 'Bhubaneswar', bn: 'Bhubaneswar', kn: 'Bhubaneswar', gu: 'Bhubaneswar' }, state: 'Odisha', lat: 20.2961, lng: 85.8245, timezone: 'Asia/Kolkata', population: 1000000 },
  { slug: 'mysore', name: { en: 'Mysore', hi: 'मैसूर', sa: 'मैसूर', mai: 'मैसूर', mr: 'मैसूर', ta: 'Mysore', te: 'Mysore', bn: 'Mysore', kn: 'Mysore', gu: 'Mysore' }, state: 'Karnataka', lat: 12.2958, lng: 76.6394, timezone: 'Asia/Kolkata', population: 1000000 },
  { slug: 'nashik', name: { en: 'Nashik', hi: 'नासिक', sa: 'नासिक', mai: 'नासिक', mr: 'नासिक', ta: 'Nashik', te: 'Nashik', bn: 'Nashik', kn: 'Nashik', gu: 'Nashik' }, state: 'Maharashtra', lat: 19.9975, lng: 73.7898, timezone: 'Asia/Kolkata', population: 1600000 },
  { slug: 'jodhpur', name: { en: 'Jodhpur', hi: 'जोधपुर', sa: 'जोधपुर', mai: 'जोधपुर', mr: 'जोधपुर', ta: 'Jodhpur', te: 'Jodhpur', bn: 'Jodhpur', kn: 'Jodhpur', gu: 'Jodhpur' }, state: 'Rajasthan', lat: 26.2389, lng: 73.0243, timezone: 'Asia/Kolkata', population: 1300000 },
  { slug: 'goa', name: { en: 'Goa', hi: 'गोवा', sa: 'गोवा', mai: 'गोवा', mr: 'गोवा', ta: 'Goa', te: 'Goa', bn: 'Goa', kn: 'Goa', gu: 'Goa' }, state: 'Goa', lat: 15.2993, lng: 74.1240, timezone: 'Asia/Kolkata', population: 600000 },
  { slug: 'raipur', name: { en: 'Raipur', hi: 'रायपुर', sa: 'रायपुर', mai: 'रायपुर', mr: 'रायपुर', ta: 'Raipur', te: 'Raipur', bn: 'Raipur', kn: 'Raipur', gu: 'Raipur' }, state: 'Chhattisgarh', lat: 21.2514, lng: 81.6296, timezone: 'Asia/Kolkata', population: 1200000 },
  { slug: 'allahabad', name: { en: 'Prayagraj', hi: 'प्रयागराज', sa: 'प्रयागराज', mai: 'प्रयागराज', mr: 'प्रयागराज', ta: 'Prayagraj', te: 'Prayagraj', bn: 'Prayagraj', kn: 'Prayagraj', gu: 'Prayagraj' }, state: 'Uttar Pradesh', lat: 25.4358, lng: 81.8463, timezone: 'Asia/Kolkata', population: 1300000 },
  // ── International Hindu diaspora cities ──
  { slug: 'new-york', name: { en: 'New York', hi: 'न्यूयॉर्क', sa: 'न्यूयॉर्क', mai: 'न्यूयॉर्क', mr: 'न्यूयॉर्क', ta: 'New York', te: 'New York', bn: 'New York', kn: 'New York', gu: 'New York' }, state: 'USA', lat: 40.7128, lng: -74.0060, timezone: 'America/New_York', population: 8300000 },
  { slug: 'london', name: { en: 'London', hi: 'लंदन', sa: 'लंदन', mai: 'लंदन', mr: 'लंदन', ta: 'London', te: 'London', bn: 'London', kn: 'London', gu: 'London' }, state: 'UK', lat: 51.5074, lng: -0.1278, timezone: 'Europe/London', population: 9000000 },
  { slug: 'singapore', name: { en: 'Singapore', hi: 'सिंगापुर', sa: 'सिंगापुर', mai: 'सिंगापुर', mr: 'सिंगापुर', ta: 'Singapore', te: 'Singapore', bn: 'Singapore', kn: 'Singapore', gu: 'Singapore' }, state: 'Singapore', lat: 1.3521, lng: 103.8198, timezone: 'Asia/Singapore', population: 5900000 },
  { slug: 'dubai', name: { en: 'Dubai', hi: 'दुबई', sa: 'दुबई', mai: 'दुबई', mr: 'दुबई', ta: 'Dubai', te: 'Dubai', bn: 'Dubai', kn: 'Dubai', gu: 'Dubai' }, state: 'UAE', lat: 25.2048, lng: 55.2708, timezone: 'Asia/Dubai', population: 3500000 },
  { slug: 'sydney', name: { en: 'Sydney', hi: 'सिडनी', sa: 'सिडनी', mai: 'सिडनी', mr: 'सिडनी', ta: 'Sydney', te: 'Sydney', bn: 'Sydney', kn: 'Sydney', gu: 'Sydney' }, state: 'Australia', lat: -33.8688, lng: 151.2093, timezone: 'Australia/Sydney', population: 5300000 },
  { slug: 'toronto', name: { en: 'Toronto', hi: 'टोरंटो', sa: 'टोरंटो', mai: 'टोरंटो', mr: 'टोरंटो', ta: 'Toronto', te: 'Toronto', bn: 'Toronto', kn: 'Toronto', gu: 'Toronto' }, state: 'Canada', lat: 43.6532, lng: -79.3832, timezone: 'America/Toronto', population: 2900000 },
  { slug: 'kuala-lumpur', name: { en: 'Kuala Lumpur', hi: 'कुआलालंपुर', sa: 'कुआलालंपुर', mai: 'कुआलालंपुर', mr: 'कुआलालंपुर', ta: 'Kuala Lumpur', te: 'Kuala Lumpur', bn: 'Kuala Lumpur', kn: 'Kuala Lumpur', gu: 'Kuala Lumpur' }, state: 'Malaysia', lat: 3.1390, lng: 101.6869, timezone: 'Asia/Kuala_Lumpur', population: 1800000 },
  { slug: 'mauritius', name: { en: 'Mauritius', hi: 'मॉरीशस', sa: 'मॉरीशस', mai: 'मॉरीशस', mr: 'मॉरीशस', ta: 'Mauritius', te: 'Mauritius', bn: 'Mauritius', kn: 'Mauritius', gu: 'Mauritius' }, state: 'Mauritius', lat: -20.1609, lng: 57.5012, timezone: 'Indian/Mauritius', population: 1300000 },
  { slug: 'fiji', name: { en: 'Suva (Fiji)', hi: 'सूवा (फ़िजी)', sa: 'सूवा (फ़िजी)', mai: 'सूवा (फ़िजी)', mr: 'सूवा (फ़िजी)', ta: 'Suva (Fiji)', te: 'Suva (Fiji)', bn: 'Suva (Fiji)', kn: 'Suva (Fiji)', gu: 'Suva (Fiji)' }, state: 'Fiji', lat: -18.1416, lng: 178.4419, timezone: 'Pacific/Fiji', population: 93000 },
  { slug: 'trinidad', name: { en: 'Port of Spain', hi: 'पोर्ट ऑफ स्पेन', sa: 'पोर्ट ऑफ स्पेन', mai: 'पोर्ट ऑफ स्पेन', mr: 'पोर्ट ऑफ स्पेन', ta: 'Port of Spain', te: 'Port of Spain', bn: 'Port of Spain', kn: 'Port of Spain', gu: 'Port of Spain' }, state: 'Trinidad', lat: 10.6596, lng: -61.5086, timezone: 'America/Port_of_Spain', population: 37000 },
  { slug: 'san-francisco', name: { en: 'San Francisco', hi: 'सैन फ्रांसिस्को', sa: 'सैन फ्रांसिस्को', mai: 'सैन फ्रांसिस्को', mr: 'सैन फ्रांसिस्को', ta: 'San Francisco', te: 'San Francisco', bn: 'San Francisco', kn: 'San Francisco', gu: 'San Francisco' }, state: 'USA', lat: 37.7749, lng: -122.4194, timezone: 'America/Los_Angeles', population: 870000 },
  { slug: 'houston', name: { en: 'Houston', hi: 'ह्यूस्टन', sa: 'ह्यूस्टन', mai: 'ह्यूस्टन', mr: 'ह्यूस्टन', ta: 'Houston', te: 'Houston', bn: 'Houston', kn: 'Houston', gu: 'Houston' }, state: 'USA', lat: 29.7604, lng: -95.3698, timezone: 'America/Chicago', population: 2300000 },
  { slug: 'chicago', name: { en: 'Chicago', hi: 'शिकागो', sa: 'शिकागो', mai: 'शिकागो', mr: 'शिकागो', ta: 'Chicago', te: 'Chicago', bn: 'Chicago', kn: 'Chicago', gu: 'Chicago' }, state: 'USA', lat: 41.8781, lng: -87.6298, timezone: 'America/Chicago', population: 2700000 },
  { slug: 'melbourne', name: { en: 'Melbourne', hi: 'मेलबर्न', sa: 'मेलबर्न', mai: 'मेलबर्न', mr: 'मेलबर्न', ta: 'Melbourne', te: 'Melbourne', bn: 'Melbourne', kn: 'Melbourne', gu: 'Melbourne' }, state: 'Australia', lat: -37.8136, lng: 144.9631, timezone: 'Australia/Melbourne', population: 5100000 },
  { slug: 'auckland', name: { en: 'Auckland', hi: 'ऑकलैंड', sa: 'ऑकलैंड', mai: 'ऑकलैंड', mr: 'ऑकलैंड', ta: 'Auckland', te: 'Auckland', bn: 'Auckland', kn: 'Auckland', gu: 'Auckland' }, state: 'New Zealand', lat: -36.8485, lng: 174.7633, timezone: 'Pacific/Auckland', population: 1660000 },
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
