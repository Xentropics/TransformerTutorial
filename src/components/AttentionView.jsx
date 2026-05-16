import { useState, useRef, useEffect } from 'react';

function tokenColor(tokenId) {
  return `hsl(${(tokenId * 37) % 360}, 70%, 65%)`;
}

function weightToColor(weight) {
  const intensity = Math.round(weight * 255);
  return `rgb(${255 - intensity}, ${255 - Math.round(intensity * 0.3)}, ${255 - intensity})`;
}

function ArrowView({ tokens, weights, selectedToken }) {
  const containerRef = useRef(null);
  const [positions, setPositions] = useState([]);
  const [svgWidth, setSvgWidth] = useState(600);

  useEffect(() => {
    if (!containerRef.current) return undefined;

    const measure = () => {
      if (!containerRef.current) return;
      const tokenEls = containerRef.current.querySelectorAll('.attn-token-block');
      const rects = Array.from(tokenEls).map(el => {
        const r = el.getBoundingClientRect();
        const cr = containerRef.current.getBoundingClientRect();
        return {
          x: r.left - cr.left + r.width / 2,
          y: r.top - cr.top + r.height / 2,
          w: r.width,
          h: r.height,
        };
      });
      setPositions(rects);
      setSvgWidth(containerRef.current.clientWidth);
    };

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [tokens, selectedToken]);

  const row = weights[selectedToken] || [];
  const svgHeight = 120;

  return (
    <div className="arrow-view" ref={containerRef}>
      <div className="attn-token-row">
        {tokens.map(t => (
          <div
            key={t.id}
            className={`attn-token-block ${t.id === selectedToken ? 'selected-source' : ''}`}
            style={{ backgroundColor: tokenColor(t.tokenId) }}
          >
            {t.text}
          </div>
        ))}
      </div>
      {positions.length > 0 && (
        <svg
          className="arrow-svg"
          style={{ height: svgHeight, width: '100%' }}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          preserveAspectRatio="xMinYMin meet"
        >
          {row.map((weight, targetIdx) => {
            if (targetIdx === selectedToken || weight < 0.03) return null;
            const src = positions[selectedToken];
            const tgt = positions[targetIdx];
            if (!src || !tgt) return null;

            const strokeW = Math.max(1, weight * 12);
            const opacity = 0.3 + weight * 0.7;
            const mx = (src.x + tgt.x) / 2;
            const my = svgHeight * 0.6;

            return (
              <g key={targetIdx}>
                <path
                  d={`M ${src.x} 10 Q ${mx} ${my} ${tgt.x} 10`}
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth={strokeW}
                  strokeOpacity={opacity}
                  markerEnd="url(#arrowhead)"
                />
                <text
                  x={mx}
                  y={my + 14}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#374151"
                >
                  {weight.toFixed(2)}
                </text>
              </g>
            );
          })}
          <defs>
            <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
              <polygon points="0 0, 6 2, 0 4" fill="#2563eb" />
            </marker>
          </defs>
        </svg>
      )}
      <p className="arrow-hint">
        Pijlen vanuit <strong>{tokens[selectedToken]?.text}</strong> naar andere tokens.
        Dikte = aandachtsgewicht.
      </p>
    </div>
  );
}

function HeatmapView({ tokens, weights }) {
  const n = tokens.length;
  return (
    <div className="heatmap-view">
      <div
        className="heatmap-grid"
        style={{ gridTemplateColumns: `60px repeat(${n}, 1fr)` }}
      >
        {/* header row */}
        <div className="heatmap-cell header-cell" />
        {tokens.map(t => (
          <div key={t.id} className="heatmap-cell header-cell" title={t.text}>
            {t.text}
          </div>
        ))}
        {/* data rows */}
        {weights.map((row, rowIdx) => (
          <>
            <div key={`label-${rowIdx}`} className="heatmap-cell row-label">
              {tokens[rowIdx]?.text}
            </div>
            {row.map((w, colIdx) => (
              <div
                key={colIdx}
                className="heatmap-cell data-cell"
                style={{ backgroundColor: weightToColor(w) }}
                title={`${tokens[rowIdx]?.text} → ${tokens[colIdx]?.text}: ${w.toFixed(2)}`}
              >
                {w.toFixed(2)}
              </div>
            ))}
          </>
        ))}
      </div>
      <p className="heatmap-hint">Rijen = van token, Kolommen = naar token</p>
    </div>
  );
}

export default function AttentionView({ tokens, weights, selectedToken }) {
  const [viewMode, setViewMode] = useState('arrows');

  return (
    <div className="attention-view">
      <div className="view-toggle">
        <button
          className={`toggle-btn ${viewMode === 'arrows' ? 'active' : ''}`}
          onClick={() => setViewMode('arrows')}
        >
          🏹 Pijlen
        </button>
        <button
          className={`toggle-btn ${viewMode === 'heatmap' ? 'active' : ''}`}
          onClick={() => setViewMode('heatmap')}
        >
          🔥 Heatmap
        </button>
      </div>

      {viewMode === 'arrows' ? (
        <ArrowView tokens={tokens} weights={weights} selectedToken={selectedToken} />
      ) : (
        <HeatmapView tokens={tokens} weights={weights} />
      )}
    </div>
  );
}
