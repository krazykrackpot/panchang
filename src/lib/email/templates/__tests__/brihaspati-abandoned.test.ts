import { describe, it, expect } from 'vitest';
import { brihaspatiAbandonedEmail } from '../brihaspati-abandoned';

describe('brihaspatiAbandonedEmail', () => {
  it('returns a non-empty subject + html', () => {
    const { subject, html } = brihaspatiAbandonedEmail({ displayName: 'Madhavi' });
    expect(subject.length).toBeGreaterThan(0);
    expect(html.length).toBeGreaterThan(0);
    expect(html.toLowerCase()).toContain('<html');
  });

  it('greets by display name when provided', () => {
    const { html } = brihaspatiAbandonedEmail({ displayName: 'Madhavi' });
    expect(html).toContain('Namaste Madhavi,');
  });

  it('falls back to bare greeting when display name is empty', () => {
    const { html } = brihaspatiAbandonedEmail({ displayName: '' });
    expect(html).toContain('Namaste,');
  });

  it('falls back to bare greeting when display name is whitespace', () => {
    const { html } = brihaspatiAbandonedEmail({ displayName: '   ' });
    expect(html).toContain('Namaste,');
  });

  it('escapes HTML in the display name to prevent injection', () => {
    const { html } = brihaspatiAbandonedEmail({ displayName: '<script>alert(1)</script>' });
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
  });

  it('includes a CTA link with UTM tags pointing at /brihaspati', () => {
    const { html } = brihaspatiAbandonedEmail({ displayName: '' });
    expect(html).toMatch(/href="https:\/\/[^"]*\/brihaspati\?utm_source=email&utm_medium=transactional&utm_campaign=brihaspati-abandoned"/);
  });

  it('does NOT reference question or answer content (privacy contract)', () => {
    const { subject, html } = brihaspatiAbandonedEmail({ displayName: 'Test' });
    const combined = (subject + html).toLowerCase();
    // Sanity guard: the template must not include placeholders for question
    // text. If a refactor ever interpolates question content, these will
    // catch it.
    expect(combined).not.toContain('{question}');
    expect(combined).not.toContain('{answer}');
    expect(combined).not.toContain('your question:');
    expect(combined).not.toContain('you asked:');
  });
});
