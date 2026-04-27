/**
 * Bright Star Catalog for 2D Sky Map / Planisphere
 *
 * ~90 stars with apparent magnitude <= 2.5, J2000.0 epoch coordinates.
 * RA is in DEGREES (0-360). Dec is in DEGREES (-90 to +90).
 *
 * Color mapping by spectral type:
 *   O/B (hot blue): #9bb0ff
 *   A (white):      #cad7ff
 *   F (white-yellow): #f8f7ff
 *   G (yellow):     #fff4e8
 *   K (orange):     #ffd2a1
 *   M (red-orange): #ffcc6f
 */

export interface CatalogStar {
  name: string;           // Common name (e.g., "Sirius", "Vega")
  bayer: string;          // Bayer designation (e.g., "α CMa", "α Lyr")
  constellation: string;  // IAU abbreviation (e.g., "CMa", "Lyr")
  ra: number;             // Right Ascension in DEGREES (0-360), J2000.0 epoch
  dec: number;            // Declination in DEGREES (-90 to +90), J2000.0 epoch
  mag: number;            // Apparent magnitude (lower = brighter)
  color: string;          // Spectral color for rendering
}

export interface ConstellationLine {
  constellation: string;  // IAU abbreviation
  name: string;           // Full name
  lines: number[][];      // Array of polylines, each polyline is array of star indices
}


export const BRIGHT_STARS: CatalogStar[] = [
  // ── Mag < 0 ──────────────────────────────────────────────────────────
  /* 0  */ { name: 'Sirius',      bayer: 'α CMa', constellation: 'CMa', ra: 101.287, dec: -16.716, mag: -1.46, color: '#cad7ff' },
  /* 1  */ { name: 'Canopus',     bayer: 'α Car', constellation: 'Car', ra: 95.988,  dec: -52.696, mag: -0.74, color: '#f8f7ff' },
  /* 2  */ { name: 'Arcturus',    bayer: 'α Boo', constellation: 'Boo', ra: 213.915, dec: 19.182,  mag: -0.05, color: '#ffd2a1' },

  // ── Mag 0.0 – 0.5 ────────────────────────────────────────────────────
  /* 3  */ { name: 'Vega',        bayer: 'α Lyr', constellation: 'Lyr', ra: 279.235, dec: 38.784,  mag: 0.03,  color: '#cad7ff' },
  /* 4  */ { name: 'Capella',     bayer: 'α Aur', constellation: 'Aur', ra: 79.172,  dec: 45.998,  mag: 0.08,  color: '#fff4e8' },
  /* 5  */ { name: 'Rigel',       bayer: 'β Ori', constellation: 'Ori', ra: 78.634,  dec: -8.202,  mag: 0.13,  color: '#9bb0ff' },
  /* 6  */ { name: 'Procyon',     bayer: 'α CMi', constellation: 'CMi', ra: 114.826, dec: 5.225,   mag: 0.34,  color: '#f8f7ff' },
  /* 7  */ { name: 'Betelgeuse',  bayer: 'α Ori', constellation: 'Ori', ra: 88.793,  dec: 7.407,   mag: 0.42,  color: '#ffcc6f' },
  /* 8  */ { name: 'Achernar',    bayer: 'α Eri', constellation: 'Eri', ra: 24.429,  dec: -57.237, mag: 0.46,  color: '#9bb0ff' },

  // ── Mag 0.5 – 1.0 ────────────────────────────────────────────────────
  /* 9  */ { name: 'Hadar',       bayer: 'β Cen', constellation: 'Cen', ra: 210.956, dec: -60.373, mag: 0.61,  color: '#9bb0ff' },
  /* 10 */ { name: 'Altair',      bayer: 'α Aql', constellation: 'Aql', ra: 297.696, dec: 8.868,   mag: 0.77,  color: '#cad7ff' },
  /* 11 */ { name: 'Acrux',       bayer: 'α Cru', constellation: 'Cru', ra: 186.650, dec: -63.099, mag: 0.77,  color: '#9bb0ff' },
  /* 12 */ { name: 'Aldebaran',   bayer: 'α Tau', constellation: 'Tau', ra: 68.980,  dec: 16.509,  mag: 0.87,  color: '#ffd2a1' },
  /* 13 */ { name: 'Antares',     bayer: 'α Sco', constellation: 'Sco', ra: 247.352, dec: -26.432, mag: 1.06,  color: '#ffcc6f' },
  /* 14 */ { name: 'Spica',       bayer: 'α Vir', constellation: 'Vir', ra: 201.298, dec: -11.161, mag: 1.04,  color: '#9bb0ff' },

  // ── Mag 1.0 – 1.5 ────────────────────────────────────────────────────
  /* 15 */ { name: 'Pollux',      bayer: 'β Gem', constellation: 'Gem', ra: 116.329, dec: 28.026,  mag: 1.14,  color: '#ffd2a1' },
  /* 16 */ { name: 'Fomalhaut',   bayer: 'α PsA', constellation: 'PsA', ra: 344.413, dec: -29.622, mag: 1.16,  color: '#cad7ff' },
  /* 17 */ { name: 'Deneb',       bayer: 'α Cyg', constellation: 'Cyg', ra: 310.358, dec: 45.280,  mag: 1.25,  color: '#cad7ff' },
  /* 18 */ { name: 'Mimosa',      bayer: 'β Cru', constellation: 'Cru', ra: 191.930, dec: -59.689, mag: 1.25,  color: '#9bb0ff' },
  /* 19 */ { name: 'Regulus',     bayer: 'α Leo', constellation: 'Leo', ra: 152.093, dec: 11.967,  mag: 1.40,  color: '#9bb0ff' },
  /* 20 */ { name: 'Adhara',      bayer: 'ε CMa', constellation: 'CMa', ra: 104.656, dec: -28.972, mag: 1.50,  color: '#9bb0ff' },

  // ── Mag 1.5 – 2.0 ────────────────────────────────────────────────────
  /* 21 */ { name: 'Castor',      bayer: 'α Gem', constellation: 'Gem', ra: 113.650, dec: 31.888,  mag: 1.58,  color: '#cad7ff' },
  /* 22 */ { name: 'Shaula',      bayer: 'λ Sco', constellation: 'Sco', ra: 263.402, dec: -37.104, mag: 1.62,  color: '#9bb0ff' },
  /* 23 */ { name: 'Gacrux',      bayer: 'γ Cru', constellation: 'Cru', ra: 187.791, dec: -57.113, mag: 1.63,  color: '#ffcc6f' },
  /* 24 */ { name: 'Bellatrix',   bayer: 'γ Ori', constellation: 'Ori', ra: 81.283,  dec: 6.350,   mag: 1.64,  color: '#9bb0ff' },
  /* 25 */ { name: 'Elnath',      bayer: 'β Tau', constellation: 'Tau', ra: 81.573,  dec: 28.608,  mag: 1.65,  color: '#9bb0ff' },
  /* 26 */ { name: 'Miaplacidus', bayer: 'β Car', constellation: 'Car', ra: 138.300, dec: -69.717, mag: 1.68,  color: '#cad7ff' },
  /* 27 */ { name: 'Alnilam',     bayer: 'ε Ori', constellation: 'Ori', ra: 84.053,  dec: -1.202,  mag: 1.69,  color: '#9bb0ff' },
  /* 28 */ { name: 'Alnitak',     bayer: 'ζ Ori', constellation: 'Ori', ra: 85.190,  dec: -1.943,  mag: 1.77,  color: '#9bb0ff' },
  /* 29 */ { name: 'Alnair',      bayer: 'α Gru', constellation: 'Gru', ra: 332.058, dec: -46.961, mag: 1.74,  color: '#9bb0ff' },
  /* 30 */ { name: 'Alioth',      bayer: 'ε UMa', constellation: 'UMa', ra: 193.507, dec: 55.960,  mag: 1.77,  color: '#cad7ff' },
  /* 31 */ { name: 'Dubhe',       bayer: 'α UMa', constellation: 'UMa', ra: 165.932, dec: 61.751,  mag: 1.79,  color: '#ffd2a1' },
  /* 32 */ { name: 'Mirfak',      bayer: 'α Per', constellation: 'Per', ra: 51.081,  dec: 49.861,  mag: 1.79,  color: '#f8f7ff' },
  /* 33 */ { name: 'Kaus Australis', bayer: 'ε Sgr', constellation: 'Sgr', ra: 276.043, dec: -34.384, mag: 1.85, color: '#9bb0ff' },
  /* 34 */ { name: 'Wezen',       bayer: 'δ CMa', constellation: 'CMa', ra: 107.098, dec: -26.393, mag: 1.84,  color: '#f8f7ff' },
  /* 35 */ { name: 'Alkaid',      bayer: 'η UMa', constellation: 'UMa', ra: 206.885, dec: 49.313,  mag: 1.86,  color: '#9bb0ff' },
  /* 36 */ { name: 'Sargas',      bayer: 'θ Sco', constellation: 'Sco', ra: 264.330, dec: -42.998, mag: 1.87,  color: '#f8f7ff' },
  /* 37 */ { name: 'Avior',       bayer: 'ε Car', constellation: 'Car', ra: 125.629, dec: -59.509, mag: 1.86,  color: '#ffd2a1' },
  /* 38 */ { name: 'Menkalinan',  bayer: 'β Aur', constellation: 'Aur', ra: 89.882,  dec: 44.948,  mag: 1.90,  color: '#cad7ff' },
  /* 39 */ { name: 'Atria',       bayer: 'α TrA', constellation: 'TrA', ra: 252.166, dec: -69.028, mag: 1.92,  color: '#ffd2a1' },
  /* 40 */ { name: 'Alhena',      bayer: 'γ Gem', constellation: 'Gem', ra: 99.428,  dec: 16.399,  mag: 1.93,  color: '#cad7ff' },
  /* 41 */ { name: 'Peacock',     bayer: 'α Pav', constellation: 'Pav', ra: 306.412, dec: -56.735, mag: 1.94,  color: '#9bb0ff' },
  /* 42 */ { name: 'Polaris',     bayer: 'α UMi', constellation: 'UMi', ra: 37.954,  dec: 89.264,  mag: 1.98,  color: '#f8f7ff' },
  /* 43 */ { name: 'Mirzam',      bayer: 'β CMa', constellation: 'CMa', ra: 95.675,  dec: -17.956, mag: 1.98,  color: '#9bb0ff' },
  /* 44 */ { name: 'Alphard',     bayer: 'α Hya', constellation: 'Hya', ra: 141.897, dec: -8.659,  mag: 1.98,  color: '#ffd2a1' },

  // ── Mag 2.0 – 2.5 ────────────────────────────────────────────────────
  /* 45 */ { name: 'Hamal',       bayer: 'α Ari', constellation: 'Ari', ra: 31.793,  dec: 23.462,  mag: 2.00,  color: '#ffd2a1' },
  /* 46 */ { name: 'Algieba',     bayer: 'γ Leo', constellation: 'Leo', ra: 154.993, dec: 19.842,  mag: 2.08,  color: '#ffd2a1' },
  /* 47 */ { name: 'Diphda',      bayer: 'β Cet', constellation: 'Cet', ra: 10.897,  dec: -17.987, mag: 2.04,  color: '#ffd2a1' },
  /* 48 */ { name: 'Nunki',       bayer: 'σ Sgr', constellation: 'Sgr', ra: 283.816, dec: -26.297, mag: 2.05,  color: '#9bb0ff' },
  /* 49 */ { name: 'Mizar',       bayer: 'ζ UMa', constellation: 'UMa', ra: 200.981, dec: 54.925,  mag: 2.04,  color: '#cad7ff' },
  /* 50 */ { name: 'Saiph',       bayer: 'κ Ori', constellation: 'Ori', ra: 86.939,  dec: -9.670,  mag: 2.09,  color: '#9bb0ff' },
  /* 51 */ { name: 'Kochab',      bayer: 'β UMi', constellation: 'UMi', ra: 222.676, dec: 74.155,  mag: 2.08,  color: '#ffd2a1' },
  /* 52 */ { name: 'Rasalhague',  bayer: 'α Oph', constellation: 'Oph', ra: 263.734, dec: 12.560,  mag: 2.08,  color: '#cad7ff' },
  /* 53 */ { name: 'Algol',       bayer: 'β Per', constellation: 'Per', ra: 47.042,  dec: 40.956,  mag: 2.12,  color: '#9bb0ff' },
  /* 54 */ { name: 'Denebola',    bayer: 'β Leo', constellation: 'Leo', ra: 177.265, dec: 14.572,  mag: 2.14,  color: '#cad7ff' },
  /* 55 */ { name: 'Tiaki',       bayer: 'β Gru', constellation: 'Gru', ra: 340.667, dec: -46.885, mag: 2.11,  color: '#ffcc6f' },
  /* 56 */ { name: 'Naos',        bayer: 'ζ Pup', constellation: 'Pup', ra: 120.896, dec: -40.003, mag: 2.25,  color: '#9bb0ff' },
  /* 57 */ { name: 'Alphecca',    bayer: 'α CrB', constellation: 'CrB', ra: 233.672, dec: 26.715,  mag: 2.23,  color: '#cad7ff' },
  /* 58 */ { name: 'Sadr',        bayer: 'γ Cyg', constellation: 'Cyg', ra: 305.557, dec: 40.257,  mag: 2.23,  color: '#f8f7ff' },
  /* 59 */ { name: 'Schedar',     bayer: 'α Cas', constellation: 'Cas', ra: 10.127,  dec: 56.537,  mag: 2.24,  color: '#ffd2a1' },
  /* 60 */ { name: 'Mintaka',     bayer: 'δ Ori', constellation: 'Ori', ra: 83.002,  dec: -0.299,  mag: 2.23,  color: '#9bb0ff' },
  /* 61 */ { name: 'Caph',        bayer: 'β Cas', constellation: 'Cas', ra: 2.295,   dec: 59.150,  mag: 2.27,  color: '#f8f7ff' },
  /* 62 */ { name: 'Eltanin',     bayer: 'γ Dra', constellation: 'Dra', ra: 269.152, dec: 51.489,  mag: 2.24,  color: '#ffd2a1' },
  /* 63 */ { name: 'Dschubba',    bayer: 'δ Sco', constellation: 'Sco', ra: 240.083, dec: -22.622, mag: 2.29,  color: '#9bb0ff' },
  /* 64 */ { name: 'Epsilon Sco', bayer: 'ε Sco', constellation: 'Sco', ra: 252.541, dec: -34.293, mag: 2.31,  color: '#ffd2a1' },
  /* 65 */ { name: 'Mu Sco',      bayer: 'μ Sco', constellation: 'Sco', ra: 253.084, dec: -38.048, mag: 3.04,  color: '#9bb0ff' },
  /* 66 */ { name: 'Menkent',     bayer: 'θ Cen', constellation: 'Cen', ra: 211.671, dec: -36.370, mag: 2.06,  color: '#ffd2a1' },
  /* 67 */ { name: 'Merak',       bayer: 'β UMa', constellation: 'UMa', ra: 165.460, dec: 56.382,  mag: 2.37,  color: '#cad7ff' },
  /* 68 */ { name: 'Phecda',      bayer: 'γ UMa', constellation: 'UMa', ra: 178.458, dec: 53.695,  mag: 2.44,  color: '#cad7ff' },
  /* 69 */ { name: 'Megrez',      bayer: 'δ UMa', constellation: 'UMa', ra: 183.856, dec: 57.033,  mag: 2.37,  color: '#cad7ff' },
  /* 70 */ { name: 'Alderamin',   bayer: 'α Cep', constellation: 'Cep', ra: 319.645, dec: 62.586,  mag: 2.51,  color: '#cad7ff' },
  /* 71 */ { name: 'Ankaa',       bayer: 'α Phe', constellation: 'Phe', ra: 6.571,   dec: -42.306, mag: 2.38,  color: '#ffd2a1' },
  /* 72 */ { name: 'Gienah',      bayer: 'γ Crv', constellation: 'Crv', ra: 183.952, dec: -17.542, mag: 2.59,  color: '#9bb0ff' },
  /* 73 */ { name: 'Zubeneschamali', bayer: 'β Lib', constellation: 'Lib', ra: 229.252, dec: -9.383, mag: 2.61, color: '#9bb0ff' },
  /* 74 */ { name: 'Zubenelgenubi', bayer: 'α Lib', constellation: 'Lib', ra: 222.720, dec: -16.042, mag: 2.75, color: '#cad7ff' },
  /* 75 */ { name: 'Sheratan',    bayer: 'β Ari', constellation: 'Ari', ra: 28.660,  dec: 20.808,  mag: 2.64,  color: '#cad7ff' },
  /* 76 */ { name: 'Acubens',     bayer: 'α Cnc', constellation: 'Cnc', ra: 134.622, dec: 11.858,  mag: 4.25,  color: '#f8f7ff' },
  /* 77 */ { name: 'Al Tarf',     bayer: 'β Cnc', constellation: 'Cnc', ra: 124.129, dec: 9.186,   mag: 3.52,  color: '#ffd2a1' },
  /* 78 */ { name: 'Asellus Borealis', bayer: 'γ Cnc', constellation: 'Cnc', ra: 130.821, dec: 21.469, mag: 4.66, color: '#cad7ff' },
  /* 79 */ { name: 'Nashira',     bayer: 'γ Cap', constellation: 'Cap', ra: 325.023, dec: -16.662, mag: 3.68,  color: '#f8f7ff' },
  /* 80 */ { name: 'Deneb Algedi', bayer: 'δ Cap', constellation: 'Cap', ra: 326.760, dec: -16.127, mag: 2.85, color: '#cad7ff' },
  /* 81 */ { name: 'Algedi',      bayer: 'α Cap', constellation: 'Cap', ra: 304.514, dec: -12.508, mag: 3.57,  color: '#fff4e8' },
  /* 82 */ { name: 'Dabih',       bayer: 'β Cap', constellation: 'Cap', ra: 305.253, dec: -14.781, mag: 3.08,  color: '#ffd2a1' },
  /* 83 */ { name: 'Sadalmelik',  bayer: 'α Aqr', constellation: 'Aqr', ra: 331.446, dec: -0.320,  mag: 2.96,  color: '#fff4e8' },
  /* 84 */ { name: 'Sadalsuud',   bayer: 'β Aqr', constellation: 'Aqr', ra: 322.890, dec: -5.571,  mag: 2.91,  color: '#fff4e8' },
  /* 85 */ { name: 'Skat',        bayer: 'δ Aqr', constellation: 'Aqr', ra: 339.440, dec: -15.821, mag: 3.27,  color: '#cad7ff' },
  /* 86 */ { name: 'Eta Psc',     bayer: 'η Psc', constellation: 'Psc', ra: 22.871,  dec: 15.346,  mag: 3.62,  color: '#fff4e8' },
  /* 87 */ { name: 'Gamma Psc',   bayer: 'γ Psc', constellation: 'Psc', ra: 349.291, dec: 3.282,   mag: 3.69,  color: '#fff4e8' },
  /* 88 */ { name: 'Omega Psc',   bayer: 'ω Psc', constellation: 'Psc', ra: 359.225, dec: 6.863,   mag: 4.01,  color: '#f8f7ff' },
  /* 89 */ { name: 'Deneb Kaitos', bayer: 'ι Cet', constellation: 'Cet', ra: 0.324, dec: -8.824,   mag: 3.56,  color: '#ffd2a1' },

  // ── Additional notable stars ──────────────────────────────────────────
  /* 90 */ { name: 'Gamma Cas',   bayer: 'γ Cas', constellation: 'Cas', ra: 14.177,  dec: 60.717,  mag: 2.47,  color: '#9bb0ff' },
  /* 91 */ { name: 'Ruchbah',     bayer: 'δ Cas', constellation: 'Cas', ra: 21.454,  dec: 60.235,  mag: 2.68,  color: '#cad7ff' },
  /* 92 */ { name: 'Epsilon Cas', bayer: 'ε Cas', constellation: 'Cas', ra: 28.599,  dec: 63.670,  mag: 3.37,  color: '#9bb0ff' },
  /* 93 */ { name: 'Albireo',     bayer: 'β Cyg', constellation: 'Cyg', ra: 292.680, dec: 27.960,  mag: 3.08,  color: '#ffd2a1' },
  /* 94 */ { name: 'Delta Cyg',   bayer: 'δ Cyg', constellation: 'Cyg', ra: 296.244, dec: 45.131,  mag: 2.87,  color: '#cad7ff' },
  /* 95 */ { name: 'Epsilon Cyg', bayer: 'ε Cyg', constellation: 'Cyg', ra: 311.522, dec: 33.970,  mag: 2.48,  color: '#ffd2a1' },
  /* 96 */ { name: 'Tarazed',     bayer: 'γ Aql', constellation: 'Aql', ra: 296.565, dec: 10.613,  mag: 2.72,  color: '#ffd2a1' },
  /* 97 */ { name: 'Alschain',    bayer: 'β Aql', constellation: 'Aql', ra: 298.828, dec: 6.407,   mag: 3.71,  color: '#fff4e8' },
  /* 98 */ { name: 'Zeta Cyg',    bayer: 'ζ Cyg', constellation: 'Cyg', ra: 318.234, dec: 30.227,  mag: 3.21,  color: '#fff4e8' },

  // More Scorpius stars
  /* 99  */ { name: 'Acrab',      bayer: 'β Sco', constellation: 'Sco', ra: 241.359, dec: -19.806, mag: 2.56,  color: '#9bb0ff' },
  /* 100 */ { name: 'Pi Sco',     bayer: 'π Sco', constellation: 'Sco', ra: 239.713, dec: -26.114, mag: 2.89,  color: '#9bb0ff' },
  /* 101 */ { name: 'Girtab',     bayer: 'κ Sco', constellation: 'Sco', ra: 265.622, dec: -39.030, mag: 2.41,  color: '#9bb0ff' },

  // Sagittarius
  /* 102 */ { name: 'Kaus Media',   bayer: 'δ Sgr', constellation: 'Sgr', ra: 275.249, dec: -29.828, mag: 2.70, color: '#ffd2a1' },
  /* 103 */ { name: 'Kaus Borealis', bayer: 'λ Sgr', constellation: 'Sgr', ra: 276.993, dec: -25.422, mag: 2.82, color: '#ffd2a1' },
  /* 104 */ { name: 'Ascella',     bayer: 'ζ Sgr', constellation: 'Sgr', ra: 285.653, dec: -29.880, mag: 2.60,  color: '#cad7ff' },
  /* 105 */ { name: 'Phi Sgr',     bayer: 'φ Sgr', constellation: 'Sgr', ra: 281.414, dec: -26.991, mag: 3.17,  color: '#9bb0ff' },

  // Leo extras
  /* 106 */ { name: 'Zosma',      bayer: 'δ Leo', constellation: 'Leo', ra: 168.527, dec: 20.524,  mag: 2.56,  color: '#cad7ff' },
  /* 107 */ { name: 'Chertan',    bayer: 'θ Leo', constellation: 'Leo', ra: 168.560, dec: 15.430,  mag: 3.34,  color: '#cad7ff' },
  /* 108 */ { name: 'Epsilon Leo', bayer: 'ε Leo', constellation: 'Leo', ra: 146.463, dec: 23.774,  mag: 2.98, color: '#fff4e8' },

  // Virgo extras
  /* 109 */ { name: 'Zavijava',   bayer: 'β Vir', constellation: 'Vir', ra: 177.674, dec: 1.765,   mag: 3.61,  color: '#f8f7ff' },
  /* 110 */ { name: 'Porrima',    bayer: 'γ Vir', constellation: 'Vir', ra: 190.415, dec: -1.449,  mag: 2.74,  color: '#f8f7ff' },
  /* 111 */ { name: 'Vindemiatrix', bayer: 'ε Vir', constellation: 'Vir', ra: 195.544, dec: 10.959, mag: 2.83, color: '#fff4e8' },

  // Taurus extras
  /* 112 */ { name: 'Zeta Tau',   bayer: 'ζ Tau', constellation: 'Tau', ra: 84.411,  dec: 21.143,  mag: 3.03,  color: '#9bb0ff' },
  /* 113 */ { name: 'Lambda Tau', bayer: 'λ Tau', constellation: 'Tau', ra: 60.170,  dec: 12.490,  mag: 3.47,  color: '#9bb0ff' },

  // Ursa Minor extras
  /* 114 */ { name: 'Pherkad',    bayer: 'γ UMi', constellation: 'UMi', ra: 230.182, dec: 71.834,  mag: 3.00,  color: '#cad7ff' },

  // Crux extra
  /* 115 */ { name: 'Decrux',     bayer: 'δ Cru', constellation: 'Cru', ra: 183.786, dec: -58.749, mag: 2.78,  color: '#9bb0ff' },
];


export const CONSTELLATION_LINES: ConstellationLine[] = (() => {
  // Build index lookup for readability
  const I: Record<string, number> = {};
  BRIGHT_STARS.forEach((s, i) => { I[s.name] = i; });

  return [
    // ── Orion ─────────────────────────────────────────────────────────
    {
      constellation: 'Ori',
      name: 'Orion',
      lines: [
        // Shoulders
        [I['Betelgeuse'], I['Bellatrix']],
        // Belt
        [I['Alnitak'], I['Alnilam'], I['Mintaka']],
        // Left side (Betelgeuse down to Alnitak, then Saiph)
        [I['Betelgeuse'], I['Alnitak'], I['Saiph']],
        // Right side (Bellatrix down to Mintaka, then Rigel)
        [I['Bellatrix'], I['Mintaka'], I['Rigel']],
      ],
    },

    // ── Ursa Major (Big Dipper) ───────────────────────────────────────
    {
      constellation: 'UMa',
      name: 'Ursa Major',
      lines: [
        // Bowl
        [I['Dubhe'], I['Merak'], I['Phecda'], I['Megrez'], I['Dubhe']],
        // Handle
        [I['Megrez'], I['Alioth'], I['Mizar'], I['Alkaid']],
      ],
    },

    // ── Ursa Minor (Little Dipper) ────────────────────────────────────
    {
      constellation: 'UMi',
      name: 'Ursa Minor',
      lines: [
        [I['Polaris'], I['Kochab'], I['Pherkad']],
      ],
    },

    // ── Cassiopeia ────────────────────────────────────────────────────
    {
      constellation: 'Cas',
      name: 'Cassiopeia',
      lines: [
        [I['Caph'], I['Schedar'], I['Gamma Cas'], I['Ruchbah'], I['Epsilon Cas']],
      ],
    },

    // ── Leo ───────────────────────────────────────────────────────────
    {
      constellation: 'Leo',
      name: 'Leo',
      lines: [
        // Sickle
        [I['Regulus'], I['Algieba'], I['Zosma'], I['Denebola']],
        // Triangle
        [I['Regulus'], I['Chertan'], I['Denebola']],
      ],
    },

    // ── Scorpius ──────────────────────────────────────────────────────
    {
      constellation: 'Sco',
      name: 'Scorpius',
      lines: [
        // Head
        [I['Dschubba'], I['Acrab']],
        [I['Dschubba'], I['Pi Sco']],
        // Body to tail
        [I['Dschubba'], I['Antares'], I['Epsilon Sco'], I['Shaula']],
        [I['Epsilon Sco'], I['Sargas'], I['Girtab'], I['Shaula']],
      ],
    },

    // ── Sagittarius (Teapot) ──────────────────────────────────────────
    {
      constellation: 'Sgr',
      name: 'Sagittarius',
      lines: [
        // Teapot body
        [I['Kaus Australis'], I['Kaus Media'], I['Kaus Borealis']],
        [I['Kaus Australis'], I['Ascella'], I['Nunki'], I['Kaus Borealis']],
        [I['Nunki'], I['Phi Sgr'], I['Kaus Media']],
      ],
    },

    // ── Gemini ────────────────────────────────────────────────────────
    {
      constellation: 'Gem',
      name: 'Gemini',
      lines: [
        [I['Castor'], I['Pollux']],
        [I['Castor'], I['Alhena']],
        [I['Pollux'], I['Alhena']],
      ],
    },

    // ── Taurus ────────────────────────────────────────────────────────
    {
      constellation: 'Tau',
      name: 'Taurus',
      lines: [
        // V shape from Aldebaran
        [I['Aldebaran'], I['Elnath']],
        [I['Aldebaran'], I['Zeta Tau']],
        [I['Aldebaran'], I['Lambda Tau']],
      ],
    },

    // ── Crux (Southern Cross) ─────────────────────────────────────────
    {
      constellation: 'Cru',
      name: 'Crux',
      lines: [
        [I['Acrux'], I['Gacrux']],
        [I['Mimosa'], I['Decrux']],
      ],
    },

    // ── Cygnus (Northern Cross) ───────────────────────────────────────
    {
      constellation: 'Cyg',
      name: 'Cygnus',
      lines: [
        // Body
        [I['Deneb'], I['Sadr'], I['Albireo']],
        // Wings
        [I['Delta Cyg'], I['Sadr'], I['Epsilon Cyg']],
      ],
    },

    // ── Lyra ──────────────────────────────────────────────────────────
    {
      constellation: 'Lyr',
      name: 'Lyra',
      lines: [
        // Vega is the main star; Lyra is small — just mark Vega
        // (Other Lyra stars are mag >3.2 and not in our catalog)
      ],
    },

    // ── Aquila ────────────────────────────────────────────────────────
    {
      constellation: 'Aql',
      name: 'Aquila',
      lines: [
        [I['Tarazed'], I['Altair'], I['Alschain']],
      ],
    },

    // ── Canis Major ───────────────────────────────────────────────────
    {
      constellation: 'CMa',
      name: 'Canis Major',
      lines: [
        [I['Sirius'], I['Mirzam']],
        [I['Sirius'], I['Adhara']],
        [I['Sirius'], I['Wezen'], I['Adhara']],
      ],
    },

    // ── Virgo ─────────────────────────────────────────────────────────
    {
      constellation: 'Vir',
      name: 'Virgo',
      lines: [
        [I['Spica'], I['Porrima'], I['Vindemiatrix']],
        [I['Porrima'], I['Zavijava']],
        [I['Spica'], I['Porrima'], I['Denebola']],
      ],
    },

    // ── Aries ─────────────────────────────────────────────────────────
    {
      constellation: 'Ari',
      name: 'Aries',
      lines: [
        [I['Hamal'], I['Sheratan']],
      ],
    },

    // ── Libra ─────────────────────────────────────────────────────────
    {
      constellation: 'Lib',
      name: 'Libra',
      lines: [
        [I['Zubeneschamali'], I['Zubenelgenubi']],
      ],
    },

    // ── Capricornus ───────────────────────────────────────────────────
    {
      constellation: 'Cap',
      name: 'Capricornus',
      lines: [
        [I['Algedi'], I['Dabih']],
        [I['Deneb Algedi'], I['Nashira']],
        [I['Algedi'], I['Deneb Algedi']],
      ],
    },

    // ── Aquarius ──────────────────────────────────────────────────────
    {
      constellation: 'Aqr',
      name: 'Aquarius',
      lines: [
        [I['Sadalmelik'], I['Sadalsuud']],
        [I['Sadalmelik'], I['Skat']],
      ],
    },
  ];
})();
