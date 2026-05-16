import { useState } from 'react';
import { sentences, generateCustomSentenceData } from './data/sentences';
import StepNavigator from './components/StepNavigator';
import SentenceInput from './components/SentenceInput';
import TokenRow from './components/TokenRow';
import VectorViewer from './components/VectorViewer';
import AttentionView from './components/AttentionView';
import HeadSelector from './components/HeadSelector';
import PredictionChart from './components/PredictionChart';
import MoreInfoPanel from './components/MoreInfoPanel';
import './App.css';

const TOTAL_STEPS = 8;

const LAYER_STACK = [
  { step: 0, label: 'Invoer' },
  { step: 1, label: 'Tokenisatie' },
  { step: 2, label: 'Embeddings' },
  { step: 3, label: 'Positie' },
  { step: 4, label: 'Attention' },
  { step: 5, label: 'Multi-Head' },
  { step: 6, label: 'Feed-Forward' },
  { step: 7, label: 'Voorspelling' },
];

function findSentenceData(text) {
  const found = sentences.find(s => s.text === text);
  return found || generateCustomSentenceData(text);
}

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [sentenceData, setSentenceData] = useState(null);
  const [selectedToken, setSelectedToken] = useState(0);
  const [selectedHead, setSelectedHead] = useState(0);
  const [selectedPrediction, setSelectedPrediction] = useState(0);
  const [showPositional, setShowPositional] = useState(false);

  function handleStart(text) {
    const data = findSentenceData(text);
    setSentenceData(data);
    setSelectedToken(0);
    setSelectedHead(0);
    setSelectedPrediction(0);
    setShowPositional(false);
    setCurrentStep(1);
  }

  function handleAppendToken(token) {
    // Preserve the original ending punctuation if present, otherwise append a period
    const trailingPunct = sentenceData.text.match(/[.!?]+$/)?.[0] ?? '.';
    const newText = sentenceData.text.replace(/[.!?]+$/, '') + ' ' + token + trailingPunct;
    const data = generateCustomSentenceData(newText);
    setSentenceData(data);
    setSelectedToken(data.tokens.length - 1);
    setSelectedPrediction(0);
    setCurrentStep(1);
  }

  function goToStep(step) {
    setCurrentStep(step);
  }

  const data = sentenceData;

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div>
            <h1 className="app-title">Transformer Demo</h1>
            <p className="app-subtitle">Stap voor stap door een taalmodel</p>
          </div>
          <div className="sim-banner">
            &#9888;&#65039; Simulatie &mdash; Conceptueel correct, getallen zijn vereenvoudigd
          </div>
        </div>
      </header>

      <div className="app-body">
        <aside className="layer-stack">
          <div className="layer-stack-title">Lagen</div>
          {LAYER_STACK.map(layer => (
            <button
              key={layer.step}
              className={`layer-item ${currentStep === layer.step ? 'active' : ''} ${currentStep > layer.step ? 'done' : ''}`}
              onClick={() => (layer.step === 0 || data) && goToStep(layer.step)}
              disabled={layer.step > 0 && !data}
            >
              <span className="layer-dot">{currentStep > layer.step ? '✓' : layer.step + 1}</span>
              <span className="layer-label">{layer.label}</span>
            </button>
          ))}
        </aside>

        <main className="main-content">
          <StepNavigator
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
            onPrev={() => setCurrentStep(s => Math.max(0, s - 1))}
            onNext={() => setCurrentStep(s => Math.min(TOTAL_STEPS - 1, s + 1))}
          />

          <div className="step-content">
            {currentStep === 0 && (
              <SentenceInput onStart={handleStart} />
            )}

            {currentStep === 1 && data && (
              <div className="step-card">
                <h2 className="step-title">Tokenisatie</h2>
                <p className="step-description">
                  Tokens zijn de bouwblokjes waarmee het model werkt. Elk token
                  krijgt een uniek nummer uit het vocabulaire.
                </p>
                <div className="current-sentence">&ldquo;{data.text}&rdquo;</div>
                <TokenRow
                  tokens={data.tokens}
                  selectedToken={selectedToken}
                  onSelectToken={setSelectedToken}
                />
                <p className="hint">Klik op een token om het te selecteren.</p>
                <MoreInfoPanel>
                  <p>
                    Een vocabulaire bevat typisch <strong>30.000 tot 100.000 tokens</strong>.
                    Het model kent geen woorden zoals mensen dat doen &mdash; het werkt alleen met
                    getallen. Token-ID 18 is misschien altijd een punt, ongeacht de taal of context.
                  </p>
                </MoreInfoPanel>
              </div>
            )}

            {currentStep === 2 && data && (
              <div className="step-card">
                <h2 className="step-title">Embeddings</h2>
                <p className="step-description">
                  Een embedding vertaalt een token naar een reeks getallen die
                  betekenis kunnen dragen.
                </p>
                <TokenRow
                  tokens={data.tokens}
                  selectedToken={selectedToken}
                  onSelectToken={setSelectedToken}
                />
                <div className="vector-grid">
                  {data.tokens.map((token, i) => (
                    <div
                      key={token.id}
                      className={`vector-card ${selectedToken === i ? 'highlighted' : ''}`}
                      onClick={() => setSelectedToken(i)}
                    >
                      <div className="vector-card-header">{token.text}</div>
                      <VectorViewer vector={data.embeddings[i]} />
                    </div>
                  ))}
                </div>
                <MoreInfoPanel>
                  <p>
                    In een echt model hebben embeddings <strong>768 tot 4096 dimensies</strong>.
                    Woorden met verwante betekenis liggen dichter bij elkaar in deze
                    hoge-dimensionale ruimte. In deze demo gebruiken we vereenvoudigde
                    3D-vectors als voorbeeld.
                  </p>
                </MoreInfoPanel>
              </div>
            )}

            {currentStep === 3 && data && (
              <div className="step-card">
                <h2 className="step-title">Positionale Encoding</h2>
                <p className="step-description">
                  Het model moet ook weten waar een token in de zin staat.
                  Positie-informatie wordt toegevoegd aan de embeddings.
                </p>
                <div className="toggle-row">
                  <button
                    className={`toggle-btn ${!showPositional ? 'active' : ''}`}
                    onClick={() => setShowPositional(false)}
                  >
                    Alleen embedding
                  </button>
                  <button
                    className={`toggle-btn ${showPositional ? 'active' : ''}`}
                    onClick={() => setShowPositional(true)}
                  >
                    + Positionele encoding
                  </button>
                </div>
                <TokenRow
                  tokens={data.tokens}
                  selectedToken={selectedToken}
                  onSelectToken={setSelectedToken}
                />
                <div className="vector-grid">
                  {data.tokens.map((token, i) => {
                    const emb = data.embeddings[i];
                    const pos = data.positionalEncodings[i];
                    const combined = emb.map((v, j) =>
                      showPositional ? Math.round((v + pos[j]) * 100) / 100 : v
                    );
                    return (
                      <div
                        key={token.id}
                        className={`vector-card ${selectedToken === i ? 'highlighted' : ''}`}
                        onClick={() => setSelectedToken(i)}
                      >
                        <div className="vector-card-header">{token.text}</div>
                        <VectorViewer vector={combined} />
                        {showPositional && (
                          <div className="pos-offset">
                            &Delta; pos: [{pos.map(v => v.toFixed(2)).join(', ')}]
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <MoreInfoPanel>
                  <p>
                    Transformers lezen alle tokens tegelijk (niet sequentieel zoals RNNs).
                    Daarom voegen ze expliciete positie-informatie toe. De originele
                    Transformer gebruikt <strong>sinuso&iuml;dale functies</strong>; nieuwere modellen
                    gebruiken geleerde posities (learned positional embeddings) of relatieve
                    posities (RoPE).
                  </p>
                </MoreInfoPanel>
              </div>
            )}

            {currentStep === 4 && data && (
              <div className="step-card">
                <h2 className="step-title">Self-Attention</h2>
                <p className="step-description">
                  Een token kijkt naar andere tokens om zijn betekenis in context te
                  begrijpen. &lsquo;Bank&rsquo; kijkt naar &lsquo;water&rsquo; om te begrijpen dat het om een
                  oever gaat, niet een zitmeubel.
                </p>
                <TokenRow
                  tokens={data.tokens}
                  selectedToken={selectedToken}
                  onSelectToken={setSelectedToken}
                />
                <p className="hint">
                  Geselecteerd token: <strong>{data.tokens[selectedToken]?.text}</strong>.
                  Klik op een ander token om de aandacht van dat token te zien.
                </p>
                <AttentionView
                  tokens={data.tokens}
                  weights={data.attentionHeads[0].weights}
                  selectedToken={selectedToken}
                />
                <MoreInfoPanel>
                  <p>
                    Voor elk token worden drie vectoren berekend:{' '}
                    <strong>Query</strong> (wat zoek ik?),{' '}
                    <strong>Key</strong> (wat bied ik aan?) en{' '}
                    <strong>Value</strong> (wat geef ik mee?).
                    De query van &eacute;&eacute;n token wordt vergeleken met de keys van alle andere tokens
                    via een dot product. Softmax zet die scores om naar gewichten die samen 1.0 zijn.
                  </p>
                </MoreInfoPanel>
              </div>
            )}

            {currentStep === 5 && data && (
              <div className="step-card">
                <h2 className="step-title">Multi-Head Attention</h2>
                <p className="step-description">
                  Meerdere attention heads kijken op verschillende manieren naar
                  dezelfde zin.
                </p>
                <HeadSelector
                  heads={data.attentionHeads}
                  selectedHead={selectedHead}
                  onSelectHead={setSelectedHead}
                />
                <TokenRow
                  tokens={data.tokens}
                  selectedToken={selectedToken}
                  onSelectToken={setSelectedToken}
                />
                <AttentionView
                  tokens={data.tokens}
                  weights={data.attentionHeads[selectedHead].weights}
                  selectedToken={selectedToken}
                />
                <MoreInfoPanel>
                  <p>
                    Elke head leert andere patronen. E&eacute;n head kan grammaticale relaties leren
                    (subject-werkwoord), een andere semantische relaties (woorden met verwante
                    betekenis). De outputs van alle heads worden samengevoegd en getransformeerd.
                    In GPT-2 zijn er <strong>12 heads</strong>; in GPT-3 zijn er <strong>96</strong>.
                  </p>
                </MoreInfoPanel>
              </div>
            )}

            {currentStep === 6 && data && (
              <div className="step-card">
                <h2 className="step-title">Feed-Forward Update</h2>
                <p className="step-description">
                  Na attention verwerkt het model elk token nog verder met een
                  intern netwerk.
                </p>
                <TokenRow
                  tokens={data.tokens}
                  selectedToken={selectedToken}
                  onSelectToken={setSelectedToken}
                />
                <p className="hint">
                  Geselecteerd token: <strong>{data.tokens[selectedToken]?.text}</strong>.{' '}
                  Klik op een token om te zien hoe het feed-forward netwerk dat token bijwerkt.
                </p>
                <div className="ff-comparison">
                  <div className="ff-col">
                    <h3>V&oacute;&oacute;r (na attention)</h3>
                    {data.tokens.map((token, i) => (
                      <div
                        key={token.id}
                        className={`vector-card compact ${selectedToken === i ? 'highlighted' : ''}`}
                        onClick={() => setSelectedToken(i)}
                      >
                        <div className="vector-card-header">{token.text}</div>
                        <VectorViewer vector={data.embeddings[i]} />
                      </div>
                    ))}
                  </div>
                  <div className="ff-arrow">&rarr;</div>
                  <div className="ff-col">
                    <h3>Na (feed-forward)</h3>
                    {data.tokens.map((token, i) => (
                      <div
                        key={token.id}
                        className={`vector-card compact updated ${selectedToken === i ? 'highlighted' : ''}`}
                        onClick={() => setSelectedToken(i)}
                      >
                        <div className="vector-card-header">{token.text}</div>
                        <VectorViewer vector={data.updatedEmbeddings[i]} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="ff-detail-card">
                  <div className="ff-detail-header">
                    <strong>{data.tokens[selectedToken]?.text}</strong>
                    <span>Verandering per dimensie</span>
                  </div>
                  <div className="ff-detail-grid">
                    <div className="vector-card compact highlighted">
                      <div className="vector-card-header">V&oacute;&oacute;r</div>
                      <VectorViewer vector={data.embeddings[selectedToken]} />
                    </div>
                    <div className="vector-card compact updated highlighted">
                      <div className="vector-card-header">Na</div>
                      <VectorViewer vector={data.updatedEmbeddings[selectedToken]} />
                    </div>
                    <div className="vector-card compact">
                      <div className="vector-card-header">&Delta; Update</div>
                      <VectorViewer
                        vector={data.updatedEmbeddings[selectedToken].map(
                          (value, index) => {
                            const deltaPrecision = 100;
                            const delta = value - data.embeddings[selectedToken][index];
                            return Math.round(delta * deltaPrecision) / deltaPrecision;
                          }
                        )}
                      />
                    </div>
                  </div>
                </div>
                <MoreInfoPanel>
                  <p>
                    Een feed-forward layer bestaat uit twee lineaire transformaties met een
                    activatiefunctie (ReLU of GELU) ertussen. De tussenliggende dimensie is
                    typisch <strong>4&times; de embedding dimensie</strong>. Residual connections voegen de
                    originele embedding terug toe, zodat informatie niet verloren gaat.
                    Dit heet ook wel &lsquo;skip connection&rsquo;.
                  </p>
                </MoreInfoPanel>
              </div>
            )}

            {currentStep === 7 && data && (
              <div className="step-card">
                <h2 className="step-title">Voorspelling</h2>
                <p className="step-description">
                  Het model kiest niet &eacute;&eacute;n zeker antwoord, maar geeft kansen voor
                  mogelijke volgende tokens.
                </p>
                <div className="current-sentence">
                  &ldquo;{data.text}&rdquo; &rarr; ?
                </div>
                <PredictionChart
                  predictions={data.predictions}
                  selectedPrediction={selectedPrediction}
                  onSelectPrediction={setSelectedPrediction}
                  onAppendToken={handleAppendToken}
                />
                <MoreInfoPanel>
                  <p>
                    De ruwe scores heten <strong>logits</strong>. Softmax zet die om naar kansen
                    die samen 100% zijn. <strong>Temperatuur</strong> bepaalt hoe scherp of
                    willekeurig de verdeling is: lage temperatuur &rarr; model kiest bijna altijd de
                    meest waarschijnlijke token; hoge temperatuur &rarr; verrassender output.
                    Top-k sampling kiest willekeurig uit de k meest waarschijnlijke tokens.
                  </p>
                </MoreInfoPanel>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
