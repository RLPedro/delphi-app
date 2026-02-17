import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Delphi — Retail Intelligence",
  description: "Retail product discovery and competitor intelligence dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <header className="app-header">
          <div className="app-logo">
            {/* <div className="app-logo-icon">L</div> */}
            <span className="app-logo-text">Delphi</span>
            <span className="app-logo-tag">Intelligence</span>
          </div>
          <div className="app-header-meta">
            <div className="header-status">
              <span className="status-dot" />
              <span>System Online</span>
            </div>
            <span style={{ color: 'var(--text-tertiary)' }} suppressHydrationWarning>
              {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
