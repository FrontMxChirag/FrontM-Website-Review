'use client';
import { useEffect } from 'react';

const camel = k => k.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

export default function ScriptRunner({ scripts }) {
  useEffect(() => {
    let cancelled = false;
    const added = [];
    const loadSeq = (i) => {
      if (cancelled || i >= scripts.length) return;
      const spec = scripts[i];
      const s = document.createElement('script');
      s.src = spec.src;
      if (spec.data) for (const [k, v] of Object.entries(spec.data)) s.dataset[camel(k)] = v;
      s.onload = () => loadSeq(i + 1);
      s.onerror = () => { if (window.console) console.error('[ScriptRunner] failed', spec.src); loadSeq(i + 1); };
      document.body.appendChild(s);
      added.push(s);
    };
    loadSeq(0);
    return () => { cancelled = true; added.forEach(s => s.remove()); };
  }, []);
  return null;
}
