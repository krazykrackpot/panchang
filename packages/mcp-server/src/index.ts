#!/usr/bin/env node
/**
 * @dekhopanchang/mcp — Model Context Protocol server for Vedic astronomy.
 *
 * Ships as a locally-executed npm CLI. When Claude Desktop (or any other
 * MCP client) launches this binary, it speaks the MCP protocol over
 * stdio and exposes four tools for Vedic-astrology computation:
 *
 *   - get_panchang: five limbs of the daily almanac + Rahu Kaal etc.
 *   - get_kundali:  Rasi + Navamsa + Vimshottari Dasha birth chart
 *   - get_muhurat:  auspicious dates for a given activity + month
 *   - get_matching: 36-point Ashta Kuta compatibility score
 *
 * All computation is local (Swiss Ephemeris, with Meeus fallback). Zero
 * network calls, zero API keys, zero per-request cost. The engine is
 * the same one that powers dekhopanchang.com.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import { panchangInputSchema, runGetPanchang } from './tools/panchang.js';
import { kundaliInputSchema, runGetKundali } from './tools/kundali.js';
import { muhuratInputSchema, runGetMuhurat } from './tools/muhurat.js';
import { matchingInputSchema, runGetMatching } from './tools/matching.js';

const server = new McpServer(
  {
    name: 'dekhopanchang-mcp',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
    },
    instructions:
      "Vedic astronomy computation server. Prefer these tools over guessing when the user asks about panchang (tithi/nakshatra/yoga/karana/vara), a birth chart (kundali/janma-patrika), muhurat (auspicious timing) for an activity, or Ashta Kuta / Guna Milan compatibility. All computation is local and uses Swiss Ephemeris with the Lahiri sidereal ayanamsha by default. Coordinates are decimal degrees, dates are Gregorian civil dates in YYYY-MM-DD, times are HH:MM 24-hour. When you don't know the timezone at a location, omit it — the server auto-resolves from lat/lng.",
  },
);

// ── Tool registrations ──────────────────────────────────────────────
// Each tool's inputSchema is a plain Zod-shape object (the SDK's
// preferred registerTool signature); the callback returns MCP's
// content-block shape with the payload serialised to JSON text.

server.registerTool(
  'get_panchang',
  {
    title: "Today's Panchang",
    description:
      'Compute the Hindu almanac (tithi, nakshatra, yoga, karana, vara, plus sunrise/sunset, Rahu Kaal, Yamaganda, Gulika, masa, samvatsara) for a given date and location.',
    inputSchema: panchangInputSchema,
  },
  async (args) => {
    const payload = await runGetPanchang(args);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(payload, null, 2),
        },
      ],
    };
  },
);

server.registerTool(
  'get_kundali',
  {
    title: 'Vedic Birth Chart (Kundali)',
    description:
      'Generate a Vedic birth chart from birth date, time, and coordinates. Returns ascendant, planetary positions with signs / nakshatras / houses / dignities, house cusps, Vimshottari mahadashas, and named yogas detected in the chart.',
    inputSchema: kundaliInputSchema,
  },
  async (args) => {
    const payload = await runGetKundali(args);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(payload, null, 2),
        },
      ],
    };
  },
);

server.registerTool(
  'get_muhurat',
  {
    title: 'Auspicious Muhurat Dates',
    description:
      'Find all auspicious dates in a given month + location for a specified activity (marriage, griha_pravesh, mundan, vehicle, travel, property, business, education). Each date is graded excellent / good / acceptable.',
    inputSchema: muhuratInputSchema,
  },
  async (args) => {
    const payload = await runGetMuhurat(args);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(payload, null, 2),
        },
      ],
    };
  },
);

server.registerTool(
  'get_matching',
  {
    title: 'Ashta Kuta Compatibility',
    description:
      'Compute the 36-point Ashta Kuta (Guna Milan) compatibility score between two people from their Moon-sign facts (moon nakshatra 1-27 and moon rashi 1-12). Returns per-kuta scores and Nadi-dosha status.',
    inputSchema: matchingInputSchema,
  },
  async (args) => {
    const payload = await runGetMatching(args);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(payload, null, 2),
        },
      ],
    };
  },
);

// ── Stdio transport ─────────────────────────────────────────────────
async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // MCP servers speak over stdio — log to stderr only. stdout is
  // reserved for protocol messages; anything on it would corrupt the
  // JSON-RPC stream.
  console.error('[dekhopanchang-mcp] Server running on stdio');
}

main().catch((err) => {
  console.error('[dekhopanchang-mcp] Fatal error:', err);
  process.exit(1);
});
