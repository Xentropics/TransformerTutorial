const STEP_NAMES = [
  'Invoer',
  'Tokenisatie',
  'Embeddings',
  'Positionale Encoding',
  'Self-Attention',
  'Multi-Head Attention',
  'Feed-Forward Update',
  'Voorspelling',
];

export default function StepNavigator({ currentStep, totalSteps, onPrev, onNext }) {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="step-navigator">
      <div className="step-info">
        <span className="step-counter">
          Stap {currentStep + 1} / {totalSteps}:
        </span>
        <span className="step-name">{STEP_NAMES[currentStep]}</span>
      </div>

      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>

      <div className="nav-buttons">
        <button
          className="nav-btn"
          onClick={onPrev}
          disabled={currentStep === 0}
        >
          ← Vorige
        </button>
        <button
          className="nav-btn primary"
          onClick={onNext}
          disabled={currentStep === totalSteps - 1}
        >
          Volgende →
        </button>
      </div>
    </div>
  );
}
