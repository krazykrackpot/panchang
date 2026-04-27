import { generateFestivalCalendarV2 } from './src/lib/calendar/festival-generator';

const year = 2027;
const lat = 28.6139; // New Delhi
const lon = 77.2090;
const timezone = 'Asia/Kolkata';

const festivals = generateFestivalCalendarV2(year, lat, lon, timezone);

console.log('Festival | Date | Tithi | Rule');
console.log('--- | --- | --- | ---');
festivals.forEach(f => {
  if (f.type === 'major') {
     console.log(`${f.name.en} | ${f.date} | ${f.tithi} | ${f.slug}`);
  }
});
