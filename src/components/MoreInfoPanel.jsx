export default function MoreInfoPanel({ children }) {
  return (
    <div className="more-info">
      <details>
        <summary>▶ Meer weten</summary>
        <div className="more-info-content">{children}</div>
      </details>
    </div>
  );
}
