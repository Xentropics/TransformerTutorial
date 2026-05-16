import { useState } from 'react';
import { sentences } from '../data/sentences';

export default function SentenceInput({ onStart }) {
  const [inputText, setInputText] = useState('');

  function handleStart() {
    const text = inputText.trim() || sentences[0].text;
    onStart(text);
  }

  function handleExample(text) {
    setInputText(text);
  }

  return (
    <div className="step-card">
      <h2 className="step-title">Invoer</h2>
      <p className="step-description">
        Een taalmodel begint met tekst. Die tekst wordt niet als hele zin gelezen,
        maar eerst opgeknipt in kleinere stukjes.
      </p>

      <div className="input-section">
        <label className="input-label" htmlFor="sentence-input">
          Voer een zin in of kies een voorbeeld:
        </label>
        <input
          id="sentence-input"
          className="sentence-input"
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder="Typ een zin..."
          onKeyDown={e => e.key === 'Enter' && handleStart()}
        />
      </div>

      <div className="example-buttons">
        {sentences.map(s => (
          <button
            key={s.id}
            className={`example-btn ${inputText === s.text ? 'active' : ''}`}
            onClick={() => handleExample(s.text)}
          >
            {s.text}
          </button>
        ))}
      </div>

      <button className="start-btn" onClick={handleStart}>
        Start →
      </button>

      <div className="more-info">
        <details>
          <summary>▶ Meer weten</summary>
          <div className="more-info-content">
            <p>
              Moderne taalmodellen gebruiken subword-tokenizers zoals{' '}
              <strong>BPE (Byte-Pair Encoding)</strong> of{' '}
              <strong>WordPiece</strong>. Deze knippen woorden op in
              veelvoorkomende stukjes. Het woord &lsquo;onvergetelijk&rsquo; kan dan worden
              [on, vergete, lijk]. In deze demo splitsen we eenvoudig op woorden
              en leestekens.
            </p>
          </div>
        </details>
      </div>
    </div>
  );
}
