import fs from 'node:fs';
import path from 'node:path';
import ScriptRunner from './ScriptRunner';

const HOME_SCRIPTS = [
  { src: '/site/fm-data.js' },
  { src: '/site/signal-field.js' },
  { src: '/site/fm-platform.js' },
  { src: '/site/fm-rebuild.js' },
  { src: '/site/fm-pflow.js' },
  { src: '/site/fm.js' },
  { src: '/site/scroll-horizon.js', data: { 'horizon-mode': 'scroll' } },
];

export default function Home() {
  const html = fs.readFileSync(path.join(process.cwd(), 'app/home.html'), 'utf8');
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <ScriptRunner scripts={HOME_SCRIPTS} />
    </>
  );
}
