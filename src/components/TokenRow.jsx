function tokenColor(tokenId) {
  return `hsl(${(tokenId * 37) % 360}, 70%, 65%)`;
}

export default function TokenRow({ tokens, selectedToken, onSelectToken }) {
  return (
    <div className="token-row">
      {tokens.map(token => {
        const color = tokenColor(token.tokenId);
        const isSelected = selectedToken === token.id;
        return (
          <div
            key={token.id}
            className={`token-block ${isSelected ? 'selected' : ''}`}
            style={{ backgroundColor: color }}
            onClick={() => onSelectToken(token.id)}
            title={`Token ID: ${token.tokenId}`}
          >
            <span className="token-text">{token.text}</span>
            <span className="token-id">#{token.tokenId}</span>
          </div>
        );
      })}
    </div>
  );
}
