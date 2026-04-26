# Post-Restructure TODO

## Known Issues to Fix
1. Mega cards need to be same size as five element cards (bigger padding, icons, text)
2. SVG hydration mismatch in RashiIcon/SamvatsaraIcon — round line coordinates to fixed precision
3. Birth poster may not be visible after chart generation — verify and fix
4. Yoga Achievement overlay — verify it triggers on rare yogas

## Verification Checklist
- [ ] Panchang main page loads cleanly, no console errors
- [ ] All mega cards link to correct subpages
- [ ] Each subpage loads with correct panchang data
- [ ] Auspicious timings subpage shows all muhurtas, amrit kalam, etc.
- [ ] Inauspicious timings subpage shows rahu kaal, varjyam, etc.
- [ ] Nivas & Shool subpage renders all 5 nivas sections
- [ ] Planetary positions subpage shows navagraha table
- [ ] Remedies subpage shows vara-based remedy
- [ ] Hindu months card links to /panchang/masa
- [ ] Choghadiya card links to /choghadiya
- [ ] Hora card links to /hora
- [ ] Muhurta card links to /panchang/muhurta
- [ ] Five element cards still work (tithi/nakshatra/yoga/karana/vara)
- [ ] Energy Weather card visible inline
- [ ] Sunrise/Sunset/Moonrise/Moonset cards visible
- [ ] Current Hora card visible
- [ ] Sun/Moon sign cards visible
- [ ] Kundali page — saved chart picker works
- [ ] Kundali page — birth poster visible below chart
- [ ] Kundali page — yoga achievement overlay triggers
- [ ] Muhurta AI — NL search bar visible
- [ ] Compare page — saved chart dropdowns visible
- [ ] Full test suite passes
- [ ] TypeScript clean
- [ ] Build passes

## Bug Hunt Areas
- [ ] All navigation links work (no dead clicks)
- [ ] Hindi locale renders correctly on all new pages
- [ ] Mobile responsive — mega cards stack properly
- [ ] No loading spinners stuck forever
- [ ] Error states handled (no white screens)
