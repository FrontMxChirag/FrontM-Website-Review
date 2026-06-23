import '../styles/fm.css';
import '../styles/fm-chrome.css';
import '../styles/fm-content.css';
import '../styles/fm-platform.css';
import '../styles/fm-rebuild.css';
import '../styles/fm-pflow.css';
import '../styles/fm-about.css';
import '../styles/fm-legal.css';
import '../styles/fm-resources.css';

export const metadata = {
  title: 'FrontM — The AI-native operating platform for maritime',
  description: 'FrontM is the digital layer for maritime operations.',
  robots: { index: false, follow: false },
  icons: { icon: '/assets/logos/frontm/frontm-mark.png' },
};

export default function RootLayout({ children }) {
  return (<html lang="en" className="js"><body>{children}</body></html>);
}
