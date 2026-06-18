'use client';

import { useEffect, useRef } from 'react';

interface MermaidDiagramProps {
  chart: string;
}

export default function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    import('mermaid').then(({ default: mermaid }) => {
      if (cancelled || !ref.current) return;
      mermaid.initialize({
        startOnLoad: false,
        theme: 'dark',
        themeVariables: {
          primaryColor: '#06b6d4',
          primaryTextColor: '#e2e8f0',
          primaryBorderColor: '#0891b2',
          lineColor: '#22d3ee',
          secondaryColor: '#0f172a',
          tertiaryColor: '#1e293b',
          background: '#0d1117',
          mainBkg: '#1e293b',
          nodeBorder: '#06b6d4',
          clusterBkg: '#0f172a',
          titleColor: '#e2e8f0',
          edgeLabelBackground: '#1e293b',
          fontFamily: 'monospace',
        },
        flowchart: { curve: 'basis', padding: 20 },
      });
      const id = `mermaid-${Math.random().toString(36).slice(2)}`;
      mermaid.render(id, chart).then(({ svg }) => {
        if (cancelled || !ref.current) return;
        ref.current.innerHTML = svg;
        // make the SVG responsive
        const svgEl = ref.current.querySelector('svg');
        if (svgEl) {
          svgEl.removeAttribute('height');
          svgEl.setAttribute('width', '100%');
        }
      }).catch(() => {});
    });
    return () => { cancelled = true; };
  }, [chart]);

  return <div ref={ref} className="w-full overflow-x-auto" />;
}
