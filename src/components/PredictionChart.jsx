import { useState } from 'react';

function applySoftmaxWithTemperature(predictions, temperature) {
  const logits = predictions.map(p => Math.log(p.probability + 1e-9) / temperature);
  const maxLogit = Math.max(...logits);
  const exps = logits.map(l => Math.exp(l - maxLogit));
  const sum = exps.reduce((a, b) => a + b, 0);
  return predictions.map((p, i) => ({
    ...p,
    probability: exps[i] / sum,
  }));
}

export default function PredictionChart({
  predictions,
  selectedPrediction = 0,
  onSelectPrediction,
  onAppendToken,
}) {
  const [temperature, setTemperature] = useState(1.0);

  const adjusted = applySoftmaxWithTemperature(predictions, temperature);
  const maxProb = Math.max(...adjusted.map(p => p.probability), 0);
  const activePrediction = adjusted.length > 0
    ? adjusted[selectedPrediction] ?? adjusted[0]
    : null;

  return (
    <div className="prediction-chart">
      <div className="temperature-control">
        <label>
          Temperatuur: <strong>{temperature.toFixed(1)}</strong>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.1"
            value={temperature}
            onChange={e => setTemperature(parseFloat(e.target.value))}
            className="temp-slider"
          />
        </label>
        <span className="temp-hint">
          {temperature < 0.9 ? '🎯 Zeker' : temperature > 1.4 ? '🎲 Willekeurig' : '⚖️ Neutraal'}
        </span>
      </div>

      <div className="prediction-bars">
        {adjusted.map((pred, i) => (
          <div
            key={i}
            className={`prediction-row ${selectedPrediction === i ? 'selected' : ''}`}
            onClick={() => onSelectPrediction?.(i)}
            title={`Klik om '${pred.token}' te bekijken`}
          >
            <span className="pred-token">{pred.token}</span>
            <div className="pred-bar-container">
              <div
                className="pred-bar"
                style={{ width: `${(pred.probability / (maxProb || 1)) * 100}%` }}
              />
            </div>
            <span className="pred-pct">{(pred.probability * 100).toFixed(1)}%</span>
          </div>
        ))}
      </div>
      {activePrediction && (
        <div className="prediction-detail-card">
          <div>
            <div className="prediction-detail-title">
              Gekozen token: <strong>{activePrediction.token}</strong>
            </div>
            <div className="prediction-detail-meta">
              Kans bij temperatuur {temperature.toFixed(1)}:{' '}
              <strong>{(activePrediction.probability * 100).toFixed(1)}%</strong>
            </div>
          </div>
          <button
            type="button"
            className="append-token-btn"
            onClick={() => onAppendToken(activePrediction.token)}
          >
            Voeg token toe
          </button>
        </div>
      )}
      <p className="pred-hint">
        Klik op een token om het te selecteren en voeg het daarna toe aan de zin.
      </p>
    </div>
  );
}
