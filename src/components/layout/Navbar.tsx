'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/i18n/navigation';
import LocaleSwitcher from './LocaleSwitcher';
import { Menu, X, Sun, Moon, Star } from 'lucide-react';

export default function Navbar() {
  const t = useTranslations('nav');
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/panchang', label: t('panchang') },
    { href: '/kundali', label: t('kundali') },
    { href: '/learn', label: t('learn') },
    { href: '/about', label: t('about') },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/80 backdrop-blur-xl border-b border-gold-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Sun className="w-6 h-6 text-gold-primary group-hover:text-gold-light transition-colors" />
              <Moon className="w-3 h-3 text-gold-light absolute -top-1 -right-1" />
            </div>
            <span className="text-lg font-semibold text-gold-gradient" style={{ fontFamily: 'var(--font-heading)' }}>
              Jyotish Panchang
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-text-secondary hover:text-gold-light transition-colors duration-200 text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
            <div className="w-px h-6 bg-gold-primary/20" />
            <LocaleSwitcher />
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-text-primary p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gold-primary/10">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-text-secondary hover:text-gold-light transition-colors px-2 py-1"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-gold-primary/10">
                <LocaleSwitcher />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
