/**
 * Eclipse Data Table — 2024-2035
 *
 * Source: NASA Five Millennium Canon of Solar Eclipses & Lunar Eclipses
 * https://eclipse.gsfc.nasa.gov/
 *
 * For LUNAR eclipses: UTC contact times are universal (same for all observers).
 * For SOLAR eclipses: we store greatest-eclipse parameters and use simplified
 * geometry to compute local circumstances for any observer location.
 *
 * Architecture note: This file is the data layer. Replace it with live computation
 * (Besselian elements from Swiss Ephemeris) to upgrade from table-based to computed.
 */

export interface LunarEclipseData {
  kind: 'lunar';
  date: string;           // YYYY-MM-DD
  type: 'total' | 'partial' | 'penumbral';
  // UTC contact times (HH:MM format) — same for all observers
  p1: string;             // Penumbral first contact
  u1: string | null;      // Umbral first contact (null for penumbral)
  max: string;            // Greatest eclipse
  u2: string | null;      // Umbral last contact (null for penumbral)
  p4: string;             // Penumbral last contact
  magnitude: number;      // Umbral magnitude (0 for penumbral, >1 for total)
  penMagnitude: number;   // Penumbral magnitude
  durationTotal: number;  // Duration of totality in minutes (0 if not total)
  durationPartial: number; // Duration of partial phase in minutes
  durationPen: number;    // Duration of penumbral phase in minutes
  saros: number;
  gamma: number;          // Distance of shadow axis from Earth center
}

/** Pre-computed local circumstances for a reference city */
export interface CityEclipseData {
  name: string;
  lat: number;
  lng: number;
  c1: string;            // First contact UTC (HH:MM)
  max: string;           // Maximum UTC (HH:MM)
  c4: string;            // Last contact UTC (HH:MM) or "sunset" if ends at sunset
  magnitude: number;     // Local magnitude
}

export interface SolarEclipseData {
  kind: 'solar';
  date: string;           // YYYY-MM-DD
  type: 'total' | 'annular' | 'partial' | 'hybrid';
  // Greatest eclipse parameters
  maxUtc: string;         // UTC time of greatest eclipse (HH:MM:SS)
  maxLat: number;         // Latitude of greatest eclipse (degrees)
  maxLon: number;         // Longitude of greatest eclipse (degrees)
  magnitude: number;      // Greatest magnitude
  gamma: number;          // Shadow axis distance from Earth center
  // Shadow geometry for local computation
  sunAlt: number;         // Sun altitude at greatest eclipse (degrees)
  pathWidth: number;      // Width of central path in km (0 for partial)
  durationCenter: number; // Duration of totality/annularity at center (seconds)
  // Penumbral shadow radius (for visibility check)
  penRadius: number;      // Approximate penumbral shadow radius in km at greatest eclipse
  // Shadow velocity for local time offset approximation
  shadowSpeedKmS: number; // Shadow speed in km/s at greatest eclipse
  saros: number;
  // Pre-computed local circumstances for reference cities (for interpolation)
  cities?: CityEclipseData[];
}

export type EclipseData = LunarEclipseData | SolarEclipseData;

/**
 * All eclipses 2024-2035.
 * Data from NASA Eclipse Predictions: eclipse.gsfc.nasa.gov
 * Lunar contact times: Fred Espenak, NASA/GSFC
 * Solar parameters: Five Millennium Canon of Solar Eclipses
 */
export const ECLIPSE_TABLE: EclipseData[] = [
  // ═══════════════════════════════════════════════════════════════════
  // 2024
  // ═══════════════════════════════════════════════════════════════════
  {
    kind: 'lunar', date: '2024-03-25', type: 'penumbral',
    p1: '04:53', u1: null, max: '07:12', u2: null, p4: '09:32',
    magnitude: -0.13, penMagnitude: 0.96,
    durationTotal: 0, durationPartial: 0, durationPen: 279,
    saros: 113, gamma: -1.0133,
  },
  {
    kind: 'solar', date: '2024-04-08', type: 'total',
    maxUtc: '18:17:16', maxLat: 25.3, maxLon: -104.1,
    magnitude: 1.0566, gamma: 0.3431,
    sunAlt: 70, pathWidth: 198, durationCenter: 268,
    penRadius: 3500, shadowSpeedKmS: 0.72, saros: 139,
  },
  {
    kind: 'lunar', date: '2024-09-18', type: 'partial',
    p1: '00:41', u1: '02:13', max: '02:44', u2: '03:16', p4: '04:47',
    magnitude: 0.08, penMagnitude: 1.02,
    durationTotal: 0, durationPartial: 63, durationPen: 246,
    saros: 118, gamma: -1.0551,
  },
  {
    kind: 'solar', date: '2024-10-02', type: 'annular',
    maxUtc: '18:45:04', maxLat: -21.9, maxLon: -114.5,
    magnitude: 0.9326, gamma: -0.3509,
    sunAlt: 69, pathWidth: 266, durationCenter: 444,
    penRadius: 3600, shadowSpeedKmS: 0.68, saros: 144,
  },

  // ═══════════════════════════════════════════════════════════════════
  // 2025
  // ═══════════════════════════════════════════════════════════════════
  {
    kind: 'lunar', date: '2025-03-14', type: 'total',
    p1: '03:57', u1: '05:09', max: '06:58', u2: '08:48', p4: '10:00',
    magnitude: 1.178, penMagnitude: 2.274,
    durationTotal: 65, durationPartial: 219, durationPen: 363,
    saros: 123, gamma: 0.4102,
  },
  {
    kind: 'solar', date: '2025-03-29', type: 'partial',
    maxUtc: '10:47:52', maxLat: 64.0, maxLon: -32.5,
    magnitude: 0.9383, gamma: 1.0405,
    sunAlt: 22, pathWidth: 0, durationCenter: 0,
    penRadius: 2800, shadowSpeedKmS: 0.55, saros: 149,
  },
  {
    kind: 'lunar', date: '2025-09-07', type: 'total',
    p1: '15:27', u1: '16:28', max: '18:11', u2: '19:55', p4: '20:56',
    magnitude: 1.362, penMagnitude: 2.380,
    durationTotal: 82, durationPartial: 207, durationPen: 329,
    saros: 128, gamma: -0.3238,
  },
  {
    kind: 'solar', date: '2025-09-21', type: 'partial',
    maxUtc: '19:42:36', maxLat: -60.0, maxLon: 37.2,
    magnitude: 0.8553, gamma: -1.0652,
    sunAlt: 15, pathWidth: 0, durationCenter: 0,
    penRadius: 2500, shadowSpeedKmS: 0.50, saros: 154,
  },

  // ═══════════════════════════════════════════════════════════════════
  // 2026
  // ═══════════════════════════════════════════════════════════════════
  {
    kind: 'solar', date: '2026-02-17', type: 'annular',
    maxUtc: '12:52:12', maxLat: -64.7, maxLon: -27.6,
    magnitude: 0.9634, gamma: -0.9740,
    sunAlt: 12, pathWidth: 615, durationCenter: 152,
    penRadius: 3200, shadowSpeedKmS: 0.62, saros: 121,
  },
  {
    kind: 'lunar', date: '2026-03-03', type: 'total',
    p1: '08:50', u1: '09:54', max: '11:33', u2: '13:13', p4: '14:17',
    magnitude: 1.151, penMagnitude: 2.264,
    durationTotal: 58, durationPartial: 199, durationPen: 327,
    saros: 133, gamma: 0.3859,
  },
  {
    kind: 'solar', date: '2026-08-12', type: 'total',
    maxUtc: '17:46:06', maxLat: 65.1, maxLon: 25.3,
    magnitude: 1.0386, gamma: 0.8974,
    sunAlt: 26, pathWidth: 294, durationCenter: 132,
    penRadius: 3400, shadowSpeedKmS: 0.85, saros: 126,
    // Source: NASA Eclipse Predictions + timeanddate.com local circumstances
    cities: [
      { name: 'Zurich', lat: 47.37, lng: 8.54, c1: '17:24', max: '18:17', c4: 'sunset', magnitude: 0.91 },
      { name: 'London', lat: 51.51, lng: -0.13, c1: '17:24', max: '18:12', c4: '18:53', magnitude: 0.87 },
      { name: 'Paris', lat: 48.86, lng: 2.35, c1: '17:29', max: '18:19', c4: 'sunset', magnitude: 0.90 },
      { name: 'Berlin', lat: 52.52, lng: 13.41, c1: '17:18', max: '18:13', c4: '19:02', magnitude: 0.93 },
      { name: 'Madrid', lat: 40.42, lng: -3.70, c1: '17:42', max: '18:24', c4: 'sunset', magnitude: 0.73 },
      { name: 'Rome', lat: 41.90, lng: 12.50, c1: '17:36', max: '18:22', c4: 'sunset', magnitude: 0.81 },
      { name: 'Moscow', lat: 55.76, lng: 37.62, c1: '17:02', max: '18:03', c4: '18:59', magnitude: 0.96 },
      { name: 'Helsinki', lat: 60.17, lng: 24.94, c1: '16:55', max: '17:58', c4: '18:58', magnitude: 0.99 },
      { name: 'Stockholm', lat: 59.33, lng: 18.07, c1: '17:04', max: '18:03', c4: '18:58', magnitude: 0.97 },
      { name: 'Warsaw', lat: 52.23, lng: 21.01, c1: '17:12', max: '18:09', c4: '19:00', magnitude: 0.94 },
      { name: 'Istanbul', lat: 41.01, lng: 28.98, c1: '17:23', max: '18:11', c4: '18:53', magnitude: 0.82 },
      { name: 'Delhi', lat: 28.61, lng: 77.21, c1: '17:54', max: '18:12', c4: '18:24', magnitude: 0.12 },
      { name: 'Mumbai', lat: 19.08, lng: 72.88, c1: '18:01', max: '18:12', c4: '18:20', magnitude: 0.06 },
      { name: 'Reykjavik', lat: 64.15, lng: -21.94, c1: '16:33', max: '17:45', c4: '18:51', magnitude: 0.99 },
      { name: 'Cairo', lat: 30.04, lng: 31.24, c1: '17:42', max: '18:15', c4: '18:42', magnitude: 0.50 },
    ],
  },
  {
    kind: 'lunar', date: '2026-08-28', type: 'partial',
    p1: '02:53', u1: '04:29', max: '04:52', u2: '05:15', p4: '06:51',
    magnitude: 0.037, penMagnitude: 0.930,
    durationTotal: 0, durationPartial: 46, durationPen: 238,
    saros: 138, gamma: 1.0249,
  },

  // ═══════════════════════════════════════════════════════════════════
  // 2027
  // ═══════════════════════════════════════════════════════════════════
  {
    kind: 'solar', date: '2027-02-06', type: 'annular',
    maxUtc: '16:00:48', maxLat: -30.5, maxLon: -47.0,
    magnitude: 0.9281, gamma: -0.2952,
    sunAlt: 73, pathWidth: 282, durationCenter: 456,
    penRadius: 3500, shadowSpeedKmS: 0.68, saros: 131,
  },
  {
    kind: 'lunar', date: '2027-02-20', type: 'penumbral',
    p1: '14:44', u1: null, max: '17:12', u2: null, p4: '19:41',
    magnitude: -0.06, penMagnitude: 0.98,
    durationTotal: 0, durationPartial: 0, durationPen: 297,
    saros: 143, gamma: 1.0068,
  },
  {
    kind: 'solar', date: '2027-08-02', type: 'total',
    maxUtc: '10:07:50', maxLat: 25.5, maxLon: 33.2,
    magnitude: 1.0790, gamma: 0.1422,
    sunAlt: 82, pathWidth: 258, durationCenter: 382,
    penRadius: 3600, shadowSpeedKmS: 0.45, saros: 136,
  },
  {
    kind: 'lunar', date: '2027-08-17', type: 'penumbral',
    p1: '04:37', u1: null, max: '07:13', u2: null, p4: '09:50',
    magnitude: -0.03, penMagnitude: 0.93,
    durationTotal: 0, durationPartial: 0, durationPen: 313,
    saros: 148, gamma: -1.0510,
  },

  // ═══════════════════════════════════════════════════════════════════
  // 2028
  // ═══════════════════════════════════════════════════════════════════
  {
    kind: 'solar', date: '2028-01-26', type: 'annular',
    maxUtc: '15:08:12', maxLat: -2.4, maxLon: -40.7,
    magnitude: 0.9208, gamma: 0.3901,
    sunAlt: 67, pathWidth: 323, durationCenter: 462,
    penRadius: 3500, shadowSpeedKmS: 0.47, saros: 141,
  },
  {
    kind: 'lunar', date: '2028-02-11', type: 'penumbral',
    p1: '12:35', u1: null, max: '13:59', u2: null, p4: '15:24',
    magnitude: -0.24, penMagnitude: 0.56,
    durationTotal: 0, durationPartial: 0, durationPen: 169,
    saros: 153, gamma: 1.2482,
  },
  {
    kind: 'lunar', date: '2028-07-06', type: 'partial',
    p1: '14:52', u1: '16:22', max: '18:19', u2: '20:16', p4: '21:46',
    magnitude: 0.654, penMagnitude: 1.631,
    durationTotal: 0, durationPartial: 234, durationPen: 414,
    saros: 120, gamma: 0.5262,
  },
  {
    kind: 'solar', date: '2028-07-22', type: 'total',
    maxUtc: '02:55:36', maxLat: 14.5, maxLon: 170.8,
    magnitude: 1.0561, gamma: -0.3032,
    sunAlt: 72, pathWidth: 230, durationCenter: 320,
    penRadius: 3600, shadowSpeedKmS: 0.48, saros: 146,
  },
  {
    kind: 'lunar', date: '2028-12-31', type: 'total',
    p1: '13:43', u1: '14:56', max: '16:52', u2: '18:49', p4: '20:01',
    magnitude: 1.495, penMagnitude: 2.387,
    durationTotal: 71, durationPartial: 233, durationPen: 378,
    saros: 125, gamma: -0.2458,
  },

  // ═══════════════════════════════════════════════════════════════════
  // 2029
  // ═══════════════════════════════════════════════════════════════════
  {
    kind: 'solar', date: '2029-01-14', type: 'partial',
    maxUtc: '17:13:48', maxLat: 69.0, maxLon: -142.0,
    magnitude: 0.8714, gamma: 1.0550,
    sunAlt: 10, pathWidth: 0, durationCenter: 0,
    penRadius: 2600, shadowSpeedKmS: 0.55, saros: 151,
  },
  {
    kind: 'lunar', date: '2029-06-26', type: 'total',
    p1: '01:27', u1: '02:42', max: '03:22', u2: '04:02', p4: '05:18',
    magnitude: 1.047, penMagnitude: 2.091,
    durationTotal: 80, durationPartial: 156, durationPen: 231,
    saros: 130, gamma: 0.8971,
  },
  {
    kind: 'solar', date: '2029-07-11', type: 'partial',
    maxUtc: '15:36:24', maxLat: -68.0, maxLon: 42.0,
    magnitude: 0.2306, gamma: -1.4190,
    sunAlt: 5, pathWidth: 0, durationCenter: 0,
    penRadius: 1500, shadowSpeedKmS: 0.40, saros: 118,
  },
  {
    kind: 'lunar', date: '2029-12-20', type: 'total',
    p1: '21:43', u1: '22:44', max: '22:41', u2: '00:37', p4: '01:39',
    magnitude: 1.117, penMagnitude: 2.192,
    durationTotal: 53, durationPartial: 233, durationPen: 356,
    saros: 135, gamma: 0.3933,
  },

  // ═══════════════════════════════════════════════════════════════════
  // 2030
  // ═══════════════════════════════════════════════════════════════════
  {
    kind: 'solar', date: '2030-06-01', type: 'annular',
    maxUtc: '06:28:48', maxLat: 50.2, maxLon: 79.0,
    magnitude: 0.9443, gamma: 0.5599,
    sunAlt: 56, pathWidth: 247, durationCenter: 320,
    penRadius: 3400, shadowSpeedKmS: 0.72, saros: 128,
  },
  {
    kind: 'lunar', date: '2030-06-15', type: 'partial',
    p1: '14:16', u1: '16:08', max: '18:33', u2: '20:58', p4: '22:51',
    magnitude: 0.862, penMagnitude: 1.831,
    durationTotal: 0, durationPartial: 290, durationPen: 515,
    saros: 140, gamma: -0.3019,
  },
  {
    kind: 'solar', date: '2030-11-25', type: 'total',
    maxUtc: '06:51:12', maxLat: -41.8, maxLon: 71.2,
    magnitude: 1.0474, gamma: -0.3822,
    sunAlt: 67, pathWidth: 169, durationCenter: 232,
    penRadius: 3500, shadowSpeedKmS: 0.55, saros: 133,
  },
  {
    kind: 'lunar', date: '2030-12-09', type: 'penumbral',
    p1: '20:07', u1: null, max: '22:27', u2: null, p4: '00:47',
    magnitude: -0.17, penMagnitude: 0.95,
    durationTotal: 0, durationPartial: 0, durationPen: 280,
    saros: 145, gamma: 1.0439,
  },

  // ═══════════════════════════════════════════════════════════════════
  // 2031-2035 (abbreviated — key eclipses only)
  // ═══════════════════════════════════════════════════════════════════
  {
    kind: 'solar', date: '2031-05-21', type: 'annular',
    maxUtc: '07:15:36', maxLat: 22.1, maxLon: 56.5,
    magnitude: 0.9589, gamma: 0.2075,
    sunAlt: 78, pathWidth: 152, durationCenter: 315,
    penRadius: 3600, shadowSpeedKmS: 0.47, saros: 138,
  },
  {
    kind: 'lunar', date: '2031-06-05', type: 'penumbral',
    p1: '05:42', u1: null, max: '07:55', u2: null, p4: '10:09',
    magnitude: -0.14, penMagnitude: 0.84,
    durationTotal: 0, durationPartial: 0, durationPen: 267,
    saros: 150, gamma: -1.0720,
  },
  {
    kind: 'solar', date: '2031-11-14', type: 'hybrid',
    maxUtc: '21:07:00', maxLat: -7.0, maxLon: 149.0,
    magnitude: 1.0106, gamma: 0.1019,
    sunAlt: 84, pathWidth: 38, durationCenter: 63,
    penRadius: 3500, shadowSpeedKmS: 0.45, saros: 143,
  },
  {
    kind: 'lunar', date: '2031-11-29', type: 'penumbral',
    p1: '03:34', u1: null, max: '06:07', u2: null, p4: '08:40',
    magnitude: -0.05, penMagnitude: 0.91,
    durationTotal: 0, durationPartial: 0, durationPen: 306,
    saros: 155, gamma: -1.0580,
  },
  {
    kind: 'lunar', date: '2032-04-25', type: 'total',
    p1: '12:41', u1: '13:46', max: '15:13', u2: '16:41', p4: '17:46',
    magnitude: 1.188, penMagnitude: 2.222,
    durationTotal: 65, durationPartial: 175, durationPen: 305,
    saros: 122, gamma: 0.3781,
  },
  {
    kind: 'solar', date: '2032-05-09', type: 'annular',
    maxUtc: '13:25:00', maxLat: -4.5, maxLon: -19.5,
    magnitude: 0.9965, gamma: -0.1058,
    sunAlt: 83, pathWidth: 12, durationCenter: 22,
    penRadius: 3500, shadowSpeedKmS: 0.46, saros: 148,
  },
  {
    kind: 'lunar', date: '2032-10-18', type: 'total',
    p1: '15:00', u1: '16:02', max: '18:02', u2: '20:02', p4: '21:04',
    magnitude: 1.230, penMagnitude: 2.346,
    durationTotal: 56, durationPartial: 240, durationPen: 364,
    saros: 127, gamma: -0.2615,
  },
  {
    kind: 'solar', date: '2032-11-03', type: 'partial',
    maxUtc: '05:34:00', maxLat: -73.0, maxLon: 133.0,
    magnitude: 0.8552, gamma: -1.0697,
    sunAlt: 10, pathWidth: 0, durationCenter: 0,
    penRadius: 2400, shadowSpeedKmS: 0.48, saros: 153,
  },
  {
    kind: 'solar', date: '2033-03-30', type: 'total',
    maxUtc: '18:01:00', maxLat: 72.0, maxLon: -168.0,
    magnitude: 1.0462, gamma: 0.9437,
    sunAlt: 19, pathWidth: 792, durationCenter: 162,
    penRadius: 3300, shadowSpeedKmS: 0.90, saros: 120,
  },
  {
    kind: 'lunar', date: '2033-04-14', type: 'total',
    p1: '17:36', u1: '18:46', max: '19:12', u2: '19:38', p4: '20:49',
    magnitude: 1.022, penMagnitude: 2.067,
    durationTotal: 52, durationPartial: 123, durationPen: 193,
    saros: 132, gamma: 0.9261,
  },
  {
    kind: 'solar', date: '2033-09-23', type: 'partial',
    maxUtc: '13:29:00', maxLat: -69.0, maxLon: -17.0,
    magnitude: 0.6907, gamma: -1.1584,
    sunAlt: 8, pathWidth: 0, durationCenter: 0,
    penRadius: 2000, shadowSpeedKmS: 0.45, saros: 125,
  },
  {
    kind: 'lunar', date: '2033-10-08', type: 'total',
    p1: '02:01', u1: '03:06', max: '04:55', u2: '06:45', p4: '07:49',
    magnitude: 1.225, penMagnitude: 2.278,
    durationTotal: 79, durationPartial: 219, durationPen: 348,
    saros: 137, gamma: -0.3222,
  },
  {
    kind: 'solar', date: '2034-03-20', type: 'total',
    maxUtc: '10:18:00', maxLat: 30.0, maxLon: 22.0,
    magnitude: 1.0459, gamma: 0.3878,
    sunAlt: 67, pathWidth: 159, durationCenter: 255,
    penRadius: 3500, shadowSpeedKmS: 0.50, saros: 130,
  },
  {
    kind: 'lunar', date: '2034-04-03', type: 'penumbral',
    p1: '22:45', u1: null, max: '23:02', u2: null, p4: '23:19',
    magnitude: -0.97, penMagnitude: 0.03,
    durationTotal: 0, durationPartial: 0, durationPen: 34,
    saros: 142, gamma: 1.5520,
  },
  {
    kind: 'solar', date: '2034-09-12', type: 'annular',
    maxUtc: '16:15:00', maxLat: -20.0, maxLon: -50.0,
    magnitude: 0.9742, gamma: -0.2980,
    sunAlt: 73, pathWidth: 96, durationCenter: 172,
    penRadius: 3500, shadowSpeedKmS: 0.48, saros: 135,
  },
  {
    kind: 'lunar', date: '2034-09-28', type: 'total',
    p1: '10:45', u1: '11:56', max: '12:46', u2: '13:37', p4: '14:48',
    magnitude: 1.094, penMagnitude: 2.147,
    durationTotal: 60, durationPartial: 161, durationPen: 243,
    saros: 147, gamma: 0.3480,
  },
  {
    kind: 'solar', date: '2035-03-09', type: 'annular',
    maxUtc: '23:05:00', maxLat: 6.5, maxLon: 168.0,
    magnitude: 0.9919, gamma: 0.0367,
    sunAlt: 87, pathWidth: 30, durationCenter: 51,
    penRadius: 3500, shadowSpeedKmS: 0.44, saros: 140,
  },
  {
    kind: 'lunar', date: '2035-03-23', type: 'penumbral',
    p1: '06:55', u1: null, max: '09:00', u2: null, p4: '11:05',
    magnitude: -0.03, penMagnitude: 0.92,
    durationTotal: 0, durationPartial: 0, durationPen: 250,
    saros: 152, gamma: -1.0490,
  },
  {
    kind: 'solar', date: '2035-09-02', type: 'total',
    maxUtc: '01:55:00', maxLat: 4.0, maxLon: 128.0,
    magnitude: 1.0449, gamma: 0.1487,
    sunAlt: 81, pathWidth: 150, durationCenter: 270,
    penRadius: 3500, shadowSpeedKmS: 0.45, saros: 145,
  },
  {
    kind: 'lunar', date: '2035-09-17', type: 'penumbral',
    p1: '17:29', u1: null, max: '19:53', u2: null, p4: '22:17',
    magnitude: -0.09, penMagnitude: 0.88,
    durationTotal: 0, durationPartial: 0, durationPen: 288,
    saros: 157, gamma: 1.0881,
  },
];

/** Get all eclipses for a given year */
export function getEclipsesForYear(year: number): EclipseData[] {
  return ECLIPSE_TABLE.filter(e => e.date.startsWith(String(year)));
}

/** Get a specific eclipse by date */
export function getEclipseByDate(date: string): EclipseData | undefined {
  return ECLIPSE_TABLE.find(e => e.date === date);
}
