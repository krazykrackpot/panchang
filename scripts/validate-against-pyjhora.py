#!/usr/bin/env python3
"""
Validation: Our Meeus engine vs Swiss Ephemeris (pyswisseph)
Direct comparison of Sun, Moon, planet positions and derived panchang values.
"""
import json, subprocess, os, math
import swisseph as swe

# Set Lahiri ayanamsha
swe.set_sid_mode(swe.SIDM_LAHIRI)

TEST_CASES = [
    (2026, 3, 31, 28.6139, 77.209, 5.5, "Delhi Mar 31 2026"),
    (2026, 1, 1, 28.6139, 77.209, 5.5, "Delhi Jan 1 2026"),
    (2026, 6, 21, 28.6139, 77.209, 5.5, "Delhi Solstice"),
    (2026, 12, 25, 28.6139, 77.209, 5.5, "Delhi Dec 25"),
    (2025, 1, 15, 28.6139, 77.209, 5.5, "Delhi Jan 2025"),
    (2025, 8, 15, 28.6139, 77.209, 5.5, "Delhi Aug 2025"),
    (2024, 4, 8, 28.6139, 77.209, 5.5, "Delhi Apr 2024"),
    (2026, 3, 31, 46.46, 6.84, 1.0, "Corseaux Switzerland"),
    (2026, 3, 31, 40.71, -74.01, -5.0, "New York"),
    (2026, 3, 31, 13.08, 80.27, 5.5, "Chennai"),
    (2026, 3, 31, 19.08, 72.88, 5.5, "Mumbai"),
    (2026, 3, 31, 51.51, -0.13, 0.0, "London"),
    (2000, 1, 1, 28.6139, 77.209, 5.5, "Delhi Y2K"),
    (1990, 6, 15, 28.6139, 77.209, 5.5, "Delhi 1990"),
    (2030, 7, 4, 28.6139, 77.209, 5.5, "Delhi 2030"),
]

PLANETS = [
    (swe.SUN, "Sun"), (swe.MOON, "Moon"), (swe.MARS, "Mars"),
    (swe.MERCURY, "Mercury"), (swe.JUPITER, "Jupiter"),
    (swe.VENUS, "Venus"), (swe.SATURN, "Saturn"),
]

def norm(deg):
    return ((deg % 360) + 360) % 360

def get_swiss_eph(year, month, day, tz):
    """Get Swiss Ephemeris positions (gold standard)"""
    # JD at local sunrise (~6am local = 6-tz UT)
    ut_hour = 6.0 - tz  # approximate sunrise in UT
    jd = swe.julday(year, month, day, ut_hour)
    ayan = swe.get_ayanamsa_ut(jd)

    positions = {}
    for pid, name in PLANETS:
        result = swe.calc_ut(jd, pid)
        trop = result[0][0]
        sid = norm(trop - ayan)
        rashi = int(sid / 30) + 1
        positions[name] = {'tropical': round(trop, 4), 'sidereal': round(sid, 4), 'rashi': rashi}

    # Rahu (mean node)
    rahu = swe.calc_ut(jd, swe.MEAN_NODE)
    rahu_sid = norm(rahu[0][0] - ayan)
    positions['Rahu'] = {'sidereal': round(rahu_sid, 4), 'rashi': int(rahu_sid / 30) + 1}

    # Tithi
    sun_trop = positions['Sun']['tropical']
    moon_trop = positions['Moon']['tropical']
    elongation = norm(moon_trop - sun_trop)
    tithi = int(elongation / 12) + 1

    # Nakshatra (from Moon sidereal)
    moon_sid = positions['Moon']['sidereal']
    nakshatra = int(moon_sid / (360/27)) + 1

    return {
        'positions': positions,
        'ayanamsha': round(ayan, 4),
        'tithi': tithi,
        'nakshatra': nakshatra,
        'jd': jd,
    }

def get_ours(year, month, day, lat, lng, tz):
    """Our Meeus engine"""
    script = f"""
const {{ computePanchang }} = require('./src/lib/ephem/panchang-calc');
try {{
  const p = computePanchang({{ year: {year}, month: {month}, day: {day}, lat: {lat}, lng: {lng}, tzOffset: {tz}, locationName: '' }});
  const planets = {{}};
  for (const pl of p.planets || []) {{
    planets[pl.name?.en || pl.id] = {{ sidereal: pl.longitude || 0, rashi: pl.rashi || 0 }};
  }}
  console.log(JSON.stringify({{
    planets,
    ayanamsha: p.ayanamsha || 0,
    tithi: p.tithi?.number || 0,
    nakshatra_name: p.nakshatra?.name?.en || '',
    sunrise: p.sunrise || '',
  }}));
}} catch(e) {{ console.log(JSON.stringify({{ error: e.message }})); }}
"""
    try:
        r = subprocess.run(['npx', 'tsx', '-e', script], capture_output=True, text=True, timeout=30,
                          cwd=os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        if r.returncode == 0:
            lines = [l for l in r.stdout.strip().split('\n') if l.startswith('{')]
            if lines:
                return json.loads(lines[-1])
    except Exception as e:
        return {'error': str(e)}
    return {'error': 'no output'}

# ─── Main ────────────────────────────────────────────────────────────────────

print("=" * 90)
print("PANCHANG VALIDATION: Our Meeus Engine vs Swiss Ephemeris (pyswisseph)")
print("=" * 90)

sun_diffs, moon_diffs, mars_diffs, jup_diffs, sat_diffs = [], [], [], [], []
ayan_diffs = []
tithi_match, tithi_total = 0, 0
nak_match, nak_total = 0, 0

for i, (yr, mo, dy, lat, lng, tz, name) in enumerate(TEST_CASES):
    print(f"\n[{i+1}/{len(TEST_CASES)}] {name} — {yr}-{mo:02d}-{dy:02d}")
    print("-" * 60)

    se = get_swiss_eph(yr, mo, dy, tz)
    ours = get_ours(yr, mo, dy, lat, lng, tz)

    if 'error' in ours:
        print(f"  Our engine error: {ours['error']}")
        continue

    # Planet comparisons
    planet_map = {'Sun': 'Sun', 'Moon': 'Moon', 'Mars': 'Mars', 'Mercury': 'Mercury',
                  'Jupiter': 'Jupiter', 'Venus': 'Venus', 'Saturn': 'Saturn'}

    for se_name, our_name in planet_map.items():
        se_pos = se['positions'].get(se_name, {}).get('sidereal', 0)
        our_pos = ours.get('planets', {}).get(our_name, {}).get('sidereal', 0)
        diff = abs(se_pos - our_pos)
        if diff > 180: diff = 360 - diff

        sym = "✓" if diff < 0.1 else "⚠" if diff < 1.0 else "✗"

        if se_name == 'Sun': sun_diffs.append(diff)
        elif se_name == 'Moon': moon_diffs.append(diff)
        elif se_name == 'Mars': mars_diffs.append(diff)
        elif se_name == 'Jupiter': jup_diffs.append(diff)
        elif se_name == 'Saturn': sat_diffs.append(diff)

        if se_name in ('Sun', 'Moon', 'Mars', 'Jupiter', 'Saturn'):
            se_rashi = se['positions'].get(se_name, {}).get('rashi', 0)
            our_rashi = ours.get('planets', {}).get(our_name, {}).get('rashi', 0)
            rashi_sym = "✓" if se_rashi == our_rashi else "✗ SIGN MISMATCH!"
            print(f"  {se_name:8s}: Ours={our_pos:9.4f}° SE={se_pos:9.4f}° Δ={diff:.4f}° {sym}  Rashi: {our_rashi} vs {se_rashi} {rashi_sym}")

    # Ayanamsha
    ad = abs(ours.get('ayanamsha', 0) - se['ayanamsha'])
    ayan_diffs.append(ad)
    sym = "✓" if ad < 0.01 else "⚠" if ad < 0.1 else "✗"
    print(f"  Ayan:     Ours={ours.get('ayanamsha',0):9.4f}° SE={se['ayanamsha']:9.4f}° Δ={ad:.4f}° {sym}")

    # Tithi
    tithi_total += 1
    if ours.get('tithi', 0) == se['tithi']:
        tithi_match += 1
        print(f"  Tithi:    {ours['tithi']} vs {se['tithi']} ✓")
    else:
        print(f"  Tithi:    {ours['tithi']} vs {se['tithi']} ✗")

# ─── Summary ─────────────────────────────────────────────────────────────────
print("\n" + "=" * 90)
print("ACCURACY REPORT")
print("=" * 90)

def report(name, diffs):
    if not diffs: return
    avg = sum(diffs)/len(diffs)
    mx = max(diffs)
    mn = min(diffs)
    within01 = sum(1 for d in diffs if d < 0.1)
    within05 = sum(1 for d in diffs if d < 0.5)
    within10 = sum(1 for d in diffs if d < 1.0)
    n = len(diffs)
    print(f"\n  {name} (n={n}):")
    print(f"    Avg error:   {avg:.4f}°")
    print(f"    Max error:   {mx:.4f}°")
    print(f"    Min error:   {mn:.4f}°")
    print(f"    Within 0.1°: {within01}/{n} ({100*within01/n:.0f}%)")
    print(f"    Within 0.5°: {within05}/{n} ({100*within05/n:.0f}%)")
    print(f"    Within 1.0°: {within10}/{n} ({100*within10/n:.0f}%)")

report("Sun", sun_diffs)
report("Moon", moon_diffs)
report("Mars", mars_diffs)
report("Jupiter", jup_diffs)
report("Saturn", sat_diffs)

if ayan_diffs:
    print(f"\n  Ayanamsha (n={len(ayan_diffs)}):")
    print(f"    Avg error:   {sum(ayan_diffs)/len(ayan_diffs):.4f}°")
    print(f"    Max error:   {max(ayan_diffs):.4f}°")

if tithi_total:
    print(f"\n  Tithi Match: {tithi_match}/{tithi_total} ({100*tithi_match/tithi_total:.0f}%)")

print(f"\n  Tests completed: {len(sun_diffs)}/{len(TEST_CASES)}")

# Verdict
print("\n" + "=" * 90)
print("VERDICT")
print("=" * 90)
if moon_diffs:
    mx = max(moon_diffs)
    avg = sum(moon_diffs)/len(moon_diffs)
    if mx > 1.0:
        print(f"\n  ✗ Moon accuracy gap is SIGNIFICANT: avg {avg:.2f}°, max {mx:.2f}°")
        print(f"    At {mx:.2f}°, this CAN cause nakshatra mismatches (~1 in every {int(13.333/mx)} charts)")
        print(f"    STRONG RECOMMENDATION: Upgrade to Swiss Ephemeris (swisseph-wasm)")
    elif mx > 0.5:
        print(f"\n  ⚠ Moon accuracy is MARGINAL: avg {avg:.2f}°, max {mx:.2f}°")
        print(f"    Occasional pada-boundary issues possible for charts near boundaries")
        print(f"    RECOMMENDATION: Consider Swiss Ephemeris upgrade")
    else:
        print(f"\n  ✓ Moon accuracy is GOOD: avg {avg:.2f}°, max {mx:.2f}°")
if sun_diffs:
    mx = max(sun_diffs)
    if mx > 0.1:
        print(f"  ⚠ Sun accuracy: max {mx:.2f}° (>0.1° threshold)")
    else:
        print(f"  ✓ Sun accuracy: max {mx:.4f}° (excellent)")
