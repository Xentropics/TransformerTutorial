function clamp(v) {
  return Math.max(-1, Math.min(1, v));
}

export default function VectorViewer({ vector, label, color }) {
  const max = 1.0;

  return (
    <div className="vector-viewer">
      {label && <div className="vector-label">{label}</div>}
      {vector.map((val, i) => {
        const clamped = clamp(val);
        const isPositive = clamped >= 0;
        const pct = Math.abs(clamped) * 50; // 50% = max width for one side

        return (
          <div key={i} className="vector-row">
            <span className="dim-label">d{i + 1}</span>
            <div className="bar-container">
              <div className="bar-center-line" />
              <div
                className={`bar ${isPositive ? 'positive' : 'negative'}`}
                style={{
                  width: `${pct}%`,
                  left: isPositive ? '50%' : `${50 - pct}%`,
                }}
              />
            </div>
            <span
              className={`dim-value ${isPositive ? 'pos-text' : 'neg-text'}`}
            >
              {val.toFixed(2)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
