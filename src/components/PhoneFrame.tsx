import type { ReactNode } from 'react';

/** Marco de teléfono: en PC se ve como un iPhone; en móvil ocupa toda la pantalla. */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="device">
      <div className="island" />
      <StatusBar />
      {children}
    </div>
  );
}

function StatusBar() {
  return (
    <div className="status-bar">
      <span>9:41</span>
      <span className="sb-icons">
        <svg width="18" height="12" viewBox="0 0 18 12" fill="#fff" aria-hidden="true">
          <rect y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
          <rect x="10" y="3" width="3" height="9" rx="1" />
          <rect x="15" width="3" height="12" rx="1" />
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
          <path d="M1.5 4.5a9.5 9.5 0 0 1 13 0M4 7.2a6 6 0 0 1 8 0M6.5 9.8a2.5 2.5 0 0 1 3 0" />
        </svg>
        <svg width="27" height="13" viewBox="0 0 27 13" fill="none" aria-hidden="true">
          <rect x=".5" y=".5" width="23" height="12" rx="3.5" stroke="#fff" opacity=".4" />
          <rect x="2.5" y="2.5" width="19" height="8" rx="2" fill="#fff" />
          <rect x="25" y="4.5" width="1.5" height="4" rx=".7" fill="#fff" opacity=".4" />
        </svg>
      </span>
    </div>
  );
}
