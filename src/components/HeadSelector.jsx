export default function HeadSelector({ heads, selectedHead, onSelectHead }) {
  return (
    <div className="head-selector">
      <div className="head-tabs">
        {heads.map((head, i) => (
          <button
            key={i}
            className={`head-tab ${selectedHead === i ? 'active' : ''}`}
            onClick={() => onSelectHead(i)}
          >
            {head.name}
          </button>
        ))}
      </div>
      {heads[selectedHead] && (
        <p className="head-description">{heads[selectedHead].description}</p>
      )}
    </div>
  );
}
