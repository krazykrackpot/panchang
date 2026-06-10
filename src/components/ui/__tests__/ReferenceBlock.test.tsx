// @vitest-environment jsdom
//
// ReferenceBlock contract:
//   1. Renders title + sourceCitation in the citation footer
//   2. Renders one row per rows[] entry with label and value visible
//   3. Each row gets a stable id anchor (ref-{blockId}-{rowId}) so deep links work
//   4. The whole block also gets an outer anchor (ref-{blockId})
//   5. CopyLinkButton on each row writes the absolute URL + #anchor to navigator.clipboard
//   6. After a successful copy, the button shows the "copied" label briefly
//   7. If clipboard API is absent the click does NOT throw (graceful degradation)

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import ReferenceBlock from '../ReferenceBlock';

function setLocation(href: string) {
  Object.defineProperty(window, 'location', {
    value: new URL(href),
    writable: true,
  });
}

describe('ReferenceBlock', () => {
  beforeEach(() => {
    setLocation('https://dekhopanchang.com/en/learn/aspects');
  });

  it('renders title and source citation', () => {
    render(
      <ReferenceBlock
        id="aspects"
        title="Planetary aspect rules"
        sourceCitation="BPHS Ch.26"
        rows={[{ id: 'mars', label: 'Mars', value: '4th, 7th, 8th' }]}
      />
    );
    expect(screen.getByText('Planetary aspect rules')).toBeTruthy();
    expect(screen.getByText(/BPHS Ch\.26/)).toBeTruthy();
  });

  it('renders one row per entry with label and value visible', () => {
    render(
      <ReferenceBlock
        id="aspects"
        title="Aspects"
        sourceCitation="BPHS"
        rows={[
          { id: 'mars', label: 'Mars', value: '4, 7, 8' },
          { id: 'jupiter', label: 'Jupiter', value: '5, 7, 9' },
          { id: 'saturn', label: 'Saturn', value: '3, 7, 10' },
        ]}
      />
    );
    expect(screen.getByText('Mars')).toBeTruthy();
    expect(screen.getByText('4, 7, 8')).toBeTruthy();
    expect(screen.getByText('Jupiter')).toBeTruthy();
    expect(screen.getByText('5, 7, 9')).toBeTruthy();
    expect(screen.getByText('Saturn')).toBeTruthy();
    expect(screen.getByText('3, 7, 10')).toBeTruthy();
  });

  it('assigns stable anchor ids to outer block and each row', () => {
    const { container } = render(
      <ReferenceBlock
        id="aspects"
        title="Aspects"
        sourceCitation="BPHS"
        rows={[
          { id: 'mars', label: 'Mars', value: '4, 7, 8' },
          { id: 'jupiter', label: 'Jupiter', value: '5, 7, 9' },
        ]}
      />
    );
    expect(container.querySelector('#ref-aspects')).toBeTruthy();
    expect(container.querySelector('#ref-aspects-mars')).toBeTruthy();
    expect(container.querySelector('#ref-aspects-jupiter')).toBeTruthy();
  });

  it('writes absolute URL + row anchor to clipboard on copy click', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      writable: true,
      configurable: true,
    });

    render(
      <ReferenceBlock
        id="aspects"
        title="Aspects"
        sourceCitation="BPHS"
        rows={[{ id: 'mars', label: 'Mars', value: '4, 7, 8' }]}
      />
    );

    const button = screen.getByRole('button', { name: /copy link to mars/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith(
        'https://dekhopanchang.com/en/learn/aspects#ref-aspects-mars'
      );
    });
  });

  it('shows the copied label after successful copy', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      writable: true,
      configurable: true,
    });

    render(
      <ReferenceBlock
        id="aspects"
        title="Aspects"
        sourceCitation="BPHS"
        copiedLabel="Copied!"
        rows={[{ id: 'mars', label: 'Mars', value: '4, 7, 8' }]}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /copy link to mars/i }));
    await waitFor(() => {
      expect(screen.getByText('Copied!')).toBeTruthy();
    });
  });

  it('does not throw if clipboard API is absent', () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: undefined,
      writable: true,
      configurable: true,
    });

    render(
      <ReferenceBlock
        id="aspects"
        title="Aspects"
        sourceCitation="BPHS"
        rows={[{ id: 'mars', label: 'Mars', value: '4, 7, 8' }]}
      />
    );

    const button = screen.getByRole('button', { name: /copy link to mars/i });
    expect(() => fireEvent.click(button)).not.toThrow();
  });
});
