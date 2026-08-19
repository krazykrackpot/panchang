# @dekhopanchang/mcp

**Model Context Protocol server for Vedic astronomy.**
Give your AI agent accurate panchang, kundali, muhurat, and Ashta Kuta
matching computation using Swiss Ephemeris — runs locally, no API keys,
no per-call cost.

Built by [Dekho Panchang](https://dekhopanchang.com) — a
computation-first Vedic-astrology platform. This package wraps the same
engine that powers the web app.

---

## Why this exists

Modern LLMs are excellent at explaining Vedic astrology concepts but
routinely hallucinate the numbers — tithis, planetary positions,
nakshatras — because they don't have an ephemeris. Answers drift by days
for panchang and by houses for kundali.

This MCP server gives your assistant a source of ground truth:

- **Local computation.** No network round-trip, sub-second responses.
- **No API keys.** No accounts. No usage caps.
- **Swiss Ephemeris DE441** (with a Meeus fallback when the native
  binary isn't available). Accuracy: `<0.001°` for all planets.
- **Lahiri sidereal ayanamsha** by default; Raman and KP available.
- **Same engine that powers dekhopanchang.com** — verified against
  Prokerala and Shubh Panchang for hundreds of dates and locations.

## Exposed tools

| Tool | Purpose |
|---|---|
| `get_panchang` | Five limbs of the daily almanac (tithi, nakshatra, yoga, karana, vara) plus sunrise / sunset, Rahu Kaal, Yamaganda, Gulika, masa, samvatsara for a given date and location. |
| `get_kundali` | Vedic birth chart from birth date, time, and coordinates. Ascendant, planetary positions with signs / nakshatras / houses / dignities, house cusps, Vimshottari mahadashas, and detected named yogas. |
| `get_muhurat` | Auspicious dates in a given month + location for a specified activity (marriage, griha_pravesh, mundan, vehicle, travel, property, business, education). Each date graded excellent / good / acceptable. |
| `get_matching` | 36-point Ashta Kuta (Guna Milan) compatibility score between two people from their Moon-sign facts. Includes per-kuta breakdown and Nadi-dosha status. |

Every response includes a `citation` block naming the sources
(BPHS / Surya Siddhanta / Muhurta Chintamani / Swiss Ephemeris DE441),
suitable for direct attribution.

## Install

### Claude Desktop

Add this to your `claude_desktop_config.json` (on macOS:
`~/Library/Application Support/Claude/claude_desktop_config.json`, on
Windows: `%APPDATA%\Claude\claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "dekhopanchang": {
      "command": "npx",
      "args": ["-y", "@dekhopanchang/mcp"]
    }
  }
}
```

Restart Claude Desktop. The four tools appear under the MCP tool menu.

### Cursor / Windsurf / any MCP client

Any client that supports MCP over stdio can launch this server the same
way — the entry point is the `dekhopanchang-mcp` binary registered in
`package.json`. Point your client at:

```
npx -y @dekhopanchang/mcp
```

### Global install (optional)

```bash
npm install -g @dekhopanchang/mcp
dekhopanchang-mcp   # runs on stdio
```

## Requirements

- Node.js `>= 18.17`
- On first run, the `sweph` dependency compiles a native Swiss Ephemeris
  binary (via node-gyp). This needs a working C++ toolchain (Xcode CLT
  on macOS, build-essential on Linux, MSVC Build Tools on Windows). If
  the compile fails, the server still runs on the Meeus fallback with
  slightly reduced accuracy (Sun ~0.01°, Moon ~0.5°, outer planets 1-3°).

## Examples

### Panchang for today, in Varanasi

Ask your AI agent:

> "What's the panchang today in Varanasi?"

The agent calls `get_panchang({ date: '2026-08-19', lat: 25.3176, lng: 82.9739 })`
and receives:

```json
{
  "date": "2026-08-19",
  "location": { "latitude": 25.3176, "longitude": 82.9739, "timezone": "Asia/Kolkata" },
  "tithi": { "name": "Shashti", "number": 6, "paksha": "Krishna (waning)", "startTime": "...", "endTime": "..." },
  "nakshatra": { "name": "Ashwini", "ruler": "Ketu", "pada": 3, ... },
  "yoga": { "name": "Shubha", ... },
  "karana": { "name": "Vishti", ... },
  "vara": "Wednesday",
  "sunrise": "05:34",
  "sunset": "18:47",
  "rahuKaal": { "start": "12:11", "end": "13:49" },
  ...
}
```

### Kundali for a birth in London

> "Compute a kundali for someone born 1990-04-15 at 14:30 in London."

The agent calls `get_kundali({ birth_date: '1990-04-15', birth_time: '14:30', lat: 51.5074, lng: -0.1278 })`
and receives a chart with ascendant, planets, houses, and mahadashas.
The timezone is auto-resolved from lat/lng.

### Marriage muhurat for December 2026 in Mumbai

> "When are the good wedding dates in December 2026 in Mumbai?"

The agent calls `get_muhurat({ activity: 'marriage', year: 2026, month: 12, lat: 19.0760, lng: 72.8777 })`
and receives every date in the month with a quality grade.

### Ashta Kuta compatibility

> "Check compatibility between Person A (Rohini nakshatra, Taurus moon)
> and Person B (Uttara Phalguni nakshatra, Leo moon)."

The agent calls `get_matching({ personA: { moonNakshatra: 4, moonRashi: 2 }, personB: { moonNakshatra: 12, moonRashi: 5 } })`
and receives a 36-point Guna Milan breakdown.

## Design constraints

- **No phone-home.** The server never contacts dekhopanchang.com. All
  telemetry lives on the client side of the MCP protocol.
- **No LLM inference.** This is pure astronomical computation. If your
  agent wants natural-language interpretation, feed the JSON response
  to your model of choice.
- **No hidden state.** Every tool call is deterministic given its
  arguments — same inputs, same output, always.

## Development

This package lives inside the `krazykrackpot/panchang` monorepo at
`packages/mcp-server/`. Local build:

```bash
cd packages/mcp-server
npm install
npm run build       # tsc → dist/
npm run typecheck   # tsc --noEmit
```

The `prepublishOnly` script runs the build automatically before `npm publish`.

## Licence

MIT. See [LICENSE](./LICENSE).

## Links

- Landing page: https://dekhopanchang.com/mcp
- Web application: https://dekhopanchang.com
- Methodology: https://dekhopanchang.com/en/about/methodology
- Source: https://github.com/krazykrackpot/panchang/tree/main/packages/mcp-server
- Report bugs: https://github.com/krazykrackpot/panchang/issues
