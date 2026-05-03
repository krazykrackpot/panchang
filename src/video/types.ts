/**
 * Video pipeline types for Remotion Short video generation.
 */

export interface Scene {
  id: number;
  duration: number; // seconds
  narration: string;
  visualType: string;
  textOverlay?: string;
  transition: 'cut' | 'fade' | 'slide' | 'zoom';
}

export interface ScriptMeta {
  topic: string;
  type: 'short' | 'long';
  language: string;
  estimatedDuration: number;
  style: 'dramatic' | 'educational' | 'casual';
  musicMood?: string;
  voiceProfile?: string;
}

export interface VideoScript {
  meta: ScriptMeta;
  scenes: Scene[];
}

export interface ShortVideoProps {
  script: VideoScript;
  theme: string;
}
