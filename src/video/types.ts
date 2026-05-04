/**
 * Video pipeline types for Remotion Short video generation.
 * Enhanced with cosmic visual presets and audio support.
 */

import type { CosmicPreset } from './components/CosmicBackground';
import type { PlanetId } from './components/PlanetRender';

export interface Scene {
  id: number;
  duration: number; // seconds
  narration: string;
  visualType: string;
  textOverlay?: string;
  transition: 'cut' | 'fade' | 'slide' | 'zoom';

  // Cosmic visual options
  cosmicPreset?: CosmicPreset;   // background preset (nebula, planet, sun_corona, etc.)
  planet?: PlanetId;              // for planet_render visual type
  textStyle?: 'burst' | 'ascend' | 'shatter' | 'glow'; // for cosmic_text visual type
  subtitle?: string;              // secondary text line
}

export interface ScriptMeta {
  topic: string;
  type: 'short' | 'long';
  language: string;
  estimatedDuration: number;
  style: 'dramatic' | 'educational' | 'casual';
  musicMood?: string;
  voiceProfile?: string;
  musicTrack?: string; // path to background music file
}

export interface VideoScript {
  meta: ScriptMeta;
  scenes: Scene[];
}

export interface ShortVideoProps {
  script: VideoScript;
  theme: string;
  includeAudio?: boolean;
}
