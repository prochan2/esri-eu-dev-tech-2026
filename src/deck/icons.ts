/** Simple line icons (inline SVG, currentColor). */
const svg = (d: string, vb = '0 0 24 24') =>
  `<svg class="ico" viewBox="${vb}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;

export const icons = {
  code: svg('<path d="M8 6l-6 6 6 6M16 6l6 6-6 6M14 4l-4 16"/>'),
  build: svg('<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>'),
  box: svg('<path d="M21 8l-9-5-9 5v8l9 5 9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>'),
  server: svg('<rect x="3" y="3" width="18" height="7" rx="1.5"/><rect x="3" y="14" width="18" height="7" rx="1.5"/><path d="M7 6.5h.01M7 17.5h.01M11 6.5h6M11 17.5h6"/>'),
  db: svg('<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>'),
  sparkle: svg('<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>'),
  file: svg('<path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z"/><path d="M14 3v5h5"/>'),
  folder: svg('<path d="M3 7a1 1 0 0 1 1-1h5l2 2h9a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/>'),
  check: svg('<path d="M5 12l5 5L20 7"/>'),
  cross: svg('<path d="M6 6l12 12M18 6L6 18"/>'),
  linux: svg('<path d="M12 3c-2.2 0-3.4 1.9-3.4 4.4 0 1.6-.3 2.6-1.4 4.1C6 13 5 14.7 5 16.6 5 19.5 8 21 12 21s7-1.5 7-4.4c0-1.9-1-3.6-2.2-5.1-1.1-1.5-1.4-2.5-1.4-4.1C15.4 4.9 14.2 3 12 3z"/><circle cx="10.4" cy="7.6" r=".6"/><circle cx="13.6" cy="7.6" r=".6"/><path d="M10.6 10.2c.8.6 2 .6 2.8 0"/>'),
  windows: svg('<path d="M3 5.5l8-1.2v7.2H3zM13 4l8-1.2v8.7h-8zM3 12.5h8v7.2l-8-1.2zM13 12.5h8v8.7L13 20z"/>'),
  apple: svg('<path d="M16.4 12.6c0-2.4 2-3.5 2-3.6-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9s-1.8-.9-3-.8C6.9 7.3 5.4 8.2 4.6 9.7c-1.7 2.9-.4 7.2 1.2 9.6.8 1.2 1.7 2.4 2.9 2.4s1.6-.8 3-.8 1.8.8 3 .8 2-1.2 2.8-2.3c.9-1.3 1.2-2.6 1.2-2.7 0 0-2.3-.9-2.3-4.1zM14.2 5.6c.6-.8 1.1-1.8 1-2.9-.9 0-2.1.6-2.7 1.4-.6.7-1.1 1.8-1 2.8 1 .1 2.1-.5 2.7-1.3z"/>'),
  pkg: svg('<path d="M3 7l9-4 9 4-9 4z"/><path d="M3 7v10l9 4 9-4V7M12 11v10"/>'),
  gauge: svg('<path d="M4 18a8 8 0 1 1 16 0"/><path d="M12 18l4-6"/>'),
  doc: svg('<path d="M4 4h16v16H4z"/><path d="M8 8h8M8 12h8M8 16h5"/>'),
  tag: svg('<path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9z"/><circle cx="7.5" cy="7.5" r="1.2"/>'),
  merge: svg('<path d="M6 3v6a6 6 0 0 0 6 6h0a6 6 0 0 1 6 6M18 3v6a6 6 0 0 1-6 6"/>'),
  fork: svg('<circle cx="12" cy="4" r="2"/><circle cx="6" cy="20" r="2"/><circle cx="18" cy="20" r="2"/><path d="M12 6v4c0 2-6 3-6 8M12 10c0 2 6 3 6 8"/>'),
  rocket: svg('<path d="M5 19c1-3 2-4 4-5M14 4c3 0 6 3 6 6l-7 7-6-6z"/><circle cx="15" cy="9" r="1.5"/><path d="M7 11l-3 1 2 2M13 17l-1 3-2-2"/>'),
  monitor: svg('<rect x="2" y="4" width="20" height="13" rx="1.5"/><path d="M8 21h8M12 17v4"/>'),
  api: svg('<path d="M4 6h16M4 12h10M4 18h7"/><circle cx="18" cy="16" r="3"/>'),
  warn: svg('<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18h.01"/>'),
};
