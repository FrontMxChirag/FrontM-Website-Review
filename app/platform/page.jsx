import fs from 'node:fs';
import path from 'node:path';
import ScriptRunner from '@/app/ScriptRunner';
const SCRIPTS = [{"src":"/site/fm-data.js"},{"src":"/site/signal-field.js"},{"src":"/site/fm-platform.js"},{"src":"/site/fm.js"}];
export default function Page() {
  const html = fs.readFileSync(path.join(process.cwd(), 'app/platform.frag.html'), 'utf8');
  return (<><div dangerouslySetInnerHTML={{ __html: html }} /><ScriptRunner scripts={SCRIPTS} /></>);
}
