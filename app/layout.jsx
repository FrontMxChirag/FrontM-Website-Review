import '../styles/fm.css';
import '../styles/fm-chrome.css';
import '../styles/fm-content.css';
import '../styles/fm-platform.css';
import '../styles/fm-rebuild.css';
import '../styles/fm-pflow.css';

export const metadata = {
  title: 'FrontM — The AI-native operating platform for maritime',
  description: 'FrontM is the digital layer for maritime operations.',
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="js">
      <body>{children}</body>
    </html>
  );
}
