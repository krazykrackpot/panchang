/**
 * Brihaspati sage avatar — uses a realistic portrait image
 * (public/brihaspati/sage.png), circular-cropped, served via next/image
 * for automatic responsive sizing.
 *
 * Same component interface as the previous SVG version — drop-in
 * compatible with all callers (Button, Panel, ChartChatTab, history).
 *
 * The portrait shows a Vedic sage: silver beard, rudraksha mala, jata
 * (matted topknot) and saffron robe, photographed in a mountain
 * āśrama setting. Aesthetically warm and grounded — matches the
 * "wise but warm" voice the spec specifies for Brihaspati.
 */

import Image from 'next/image';
import type { CSSProperties } from 'react';

interface BrihaspatiAvatarProps {
  size?: number;
  className?: string;
  style?: CSSProperties;
  /** Reserved for future variant work; ignored for now. */
  withAureole?: boolean;
}

const SRC = '/brihaspati/sage.png';

export function BrihaspatiAvatar({
  size = 64,
  className,
  style,
}: BrihaspatiAvatarProps) {
  return (
    <Image
      src={SRC}
      alt="Brihaspati — Vedic sage"
      width={size}
      height={size}
      // The portrait is square (1024×1024). object-cover keeps the face
      // centred. Border radius applied via the wrapper component in
      // every call site, so no inline style is needed here — keeps
      // next/image happy about the width/height ratio.
      className={
        `object-cover object-top rounded-full ${className ?? ''}`.trim()
      }
      style={style}
      priority={size >= 60}
      sizes={`${Math.max(size, 32) * 2}px`}
    />
  );
}
