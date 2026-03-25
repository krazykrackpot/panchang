'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface InfoCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  accentColor?: string;
}

export default function InfoCard({ title, description, icon, href, onClick }: InfoCardProps) {
  const content = (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="glass-card rounded-xl p-6 cursor-pointer transition-all duration-300 h-full flex flex-col"
    >
      {icon && (
        <div className="mb-4">
          {icon}
        </div>
      )}
      <h3 className="font-heading text-xl font-semibold text-gold-light mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
        {title}
      </h3>
      <p className="text-text-secondary text-sm leading-relaxed flex-1">
        {description}
      </p>
    </motion.div>
  );

  if (href) {
    return <a href={href}>{content}</a>;
  }
  if (onClick) {
    return <button onClick={onClick} className="text-left w-full">{content}</button>;
  }
  return content;
}
