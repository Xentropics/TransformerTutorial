import React, { useState } from 'react';
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

const TOTAL_STEPS = 12;
const DELTA_PRECISION = 100;

const LAYER_STACK = [
  { step: 0, label: 'Invoer' },
  { step: 1, label: 'Tokenisatie' },
  { step: 2, label: 'Embeddings' },
  { step: 3, label: 'Positie' },
  { step: 4, label: 'Attention' },
  { step: 5, label: 'Multi-Head' },
  { step: 6, label: 'Feed-Forward' },
  { step: 7, label: 'Voorspelling' },
  { step: 8, label: 'Wat is een LLM?' },
  { step: 9, label: 'AI-agents' },
  { step: 10, label: 'Leren & RAG' },
  { step: 11, label: 'Kritische blik' },
];

const LLM_CAPABILITIES = [
  {
    icon: '📚',
    label: 'Begrijpen',
    summary: 'Vat lange teksten samen, beantwoord vragen, extraheer sleutelpunten.',
    example: 'Input: 10-pagina rapport → Output: 5 bullet points met de kern',
  },
  {
    icon: '🌍',
    label: 'Vertalen',
    summary: 'Vertaal tekst naar honderden talen met behoud van toon en nuance.',
    example: '"The bank is by the river." → "De oever ligt aan de rivier."',
  },
  {
    icon: '💻',
    label: 'Programmeren',
    summary: 'Schrijf, leg uit en debug code in Python, JavaScript, SQL en meer.',
    example: '"Sorteer een lijst in Python" → complete werkende functie met uitleg',
  },
  {
    icon: '🧠',
    label: 'Redeneren',
    summary: 'Los stap-voor-stap problemen op: wiskunde, logica, plannen.',
    example: '"Als A > B en B > C, wat is groter: A of C?" → "A — omdat A > B > C."',
  },
];

const REACT_STEPS = [
  {
    icon: '🧠',
    label: 'Denk',
    summary: 'Het LLM analyseert de opdracht en bedenkt een aanpak.',
    example: 'Opdracht: "Zoek de nieuwste Python-versie."\nAgent: "Ik moet internet raadplegen. Ik gebruik de zoektool."',
  },
  {
    icon: '🤝',
    label: 'Handel',
    summary: 'De agent roept een tool aan om informatie te verzamelen of actie te nemen.',
    example: 'Agent roept search_web("Python latest version") aan.',
  },
  {
    icon: '👀',
    label: 'Observeer',
    summary: 'Het resultaat van de tool komt terug in de context van het LLM.',
    example: 'Resultaat: "Python 3.13 uitgebracht op 7 oktober 2024"',
  },
  {
    icon: '🔄',
    label: 'Herhaal',
    summary: 'De agent beslist of de taak klaar is, of een nieuwe stap nodig is.',
    example: 'Agent: "Ik heb het antwoord. Python 3.13 (oktober 2024)."',
  },
];

const LEARNING_TECHNIQUES = [
  {
    icon: '✍️',
    label: 'Prompting',
    when: 'Snel, goedkoop, geen technische kennis nodig',
    summary: 'Stuur het model met slimme instructies in je prompt. Geen training vereist.',
    example: '"Je bent een vriendelijke klantenservice-medewerker. Antwoord altijd in het Nederlands."',
  },
  {
    icon: '🎯',
    label: 'Fine-tuning',
    when: 'Specifieke stijl of vakkennis inbakken',
    summary: 'Train het model verder op eigen data. De interne gewichten veranderen écht.',
    example: '10.000 klantenservice-gesprekken → model leert tone-of-voice van jouw organisatie.',
  },
  {
    icon: '👍',
    label: 'RLHF',
    when: 'Veiligheid en bruikbaarheid structureel verbeteren',
    summary: 'Mensen beoordelen antwoorden; het model leert die voorkeur na te streven.',
    example: 'Zo is ChatGPT behulpzaam en beleefd geworden in plaats van gevaarlijk of onzinnig.',
  },
  {
    icon: '🔍',
    label: 'RAG',
    when: 'Up-to-date of bedrijfsspecifieke info nodig',
    summary: 'Haal relevante documenten op vóór elke vraag en voeg die toe aan de prompt.',
    example: '"Wat zijn onze openingstijden?" → RAG zoekt in bedrijfsdocs → LLM geeft antwoord.',
  },
];

const RISKS = [
  {
    icon: '🧠',
    label: 'Hallucinaties',
    summary: 'Een LLM verzint soms feiten die klinken als echt. Er is geen ingebouwde waarheidscheck.',
    detail: 'Nepbronnen, foute cijfers, niet-bestaande personen — het model "gelooft" ze allemaal even sterk. Altijd verifiëren bij kritische informatie.',
  },
  {
    icon: '⚖️',
    label: 'Alignment',
    summary: 'Hoe zorg je dat AI doet wat je bedoelt, niet alleen wat je letterlijk vraagt?',
    detail: 'Een model dat beloond wordt voor "mensen blij maken" kan leren te liegen. Alignment is een open onderzoeksprobleem waar de beste AI-wetenschappers aan werken.',
  },
  {
    icon: '🌍',
    label: 'CO₂ & Energie',
    summary: 'Trainen en gebruiken van grote modellen verbruikt enorm veel stroom.',
    detail: 'Eén grote trainingsrun ≈ stroomverbruik van honderden huishoudens een jaar. De totale AI-uitstoot groeit snel; compensatie via groene energie is niet universeel.',
  },
  {
    icon: '💧',
    label: 'Waterverbruik',
    summary: 'Datacenters koelen servers met water, ook in regio\'s met waterschaarste.',
    detail: 'Microsoft en Google verbruiken miljoenen liters drinkwater per dag voor hun AI-infrastructuur. Een prangend probleem in droge gebieden.',
  },
  {
    icon: '👷',
    label: 'Werkomstandig-heden',
    summary: 'Content labelen voor AI-veiligheid is psychisch zwaar en slecht betaald.',
    detail: 'Vaak gedaan in Kenia, de Filipijnen of andere lage-lonenlanden. Misstanden zijn blootgelegd bij toeleveranciers van grote AI-bedrijven.',
  },
  {
    icon: '🔒',
    label: 'Privacy & Bias',
    summary: 'Trainingsdata bevat persoonlijke info en maatschappelijke vooroordelen.',
    detail: 'Modellen kunnen ongelijkheid versterken (bijv. vrouwen minder als ingenieur voorstellen). Gevoelige data kan onbewust gedeeld worden met commerciële AI-diensten.',
  },
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
  const [selectedCapability, setSelectedCapability] = useState(0);
  const [selectedAgentStep, setSelectedAgentStep] = useState(0);
  const [selectedTechnique, setSelectedTechnique] = useState(0);
  const [selectedRisk, setSelectedRisk] = useState(0);

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
              onClick={() => (layer.step === 0 || layer.step >= 8 || data) && goToStep(layer.step)}
              disabled={layer.step > 0 && layer.step < 8 && !data}
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
                  Het model leest geen woorden — het leest <em>tokens</em>: stukjes tekst
                  die elk een uniek getal krijgen uit een vaste lijst (het vocabulaire).
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
                    Sommige tokens zijn hele woorden, andere zijn woorddelen of leestekens.
                    "unhappy" kan worden gesplitst in "un" + "happy" — handig voor woorden
                    die het model nooit eerder zag.
                  </p>
                  <p>
                    Het model kent geen woorden zoals mensen dat doen — het werkt alleen met
                    getallen. Token-ID 18 is altijd hetzelfde getal, ongeacht de taal of context.
                    Betekenis ontstaat pas later, via embeddings en attention.
                  </p>
                </MoreInfoPanel>
              </div>
            )}

            {currentStep === 2 && data && (
              <div className="step-card">
                <h2 className="step-title">Embeddings</h2>
                <p className="step-description">
                  Elk token-getal wordt vertaald naar een lijst van getallen — een
                  <em> vector</em> — die betekenis kan dragen. Tokens met verwante
                  betekenis krijgen vergelijkbare vectoren.
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
                    hoge-dimensionale ruimte &mdash; "koning" en "koningin" zijn buren, "fiets"
                    staat ver weg. In deze demo gebruiken we vereenvoudigde 3D-vectoren.
                  </p>
                  <p>
                    Zie een embedding als een compacte samenvatting van wat een token
                    gemiddeld betekent. De <em>context</em> van de omringende tokens ontbreekt
                    hier nog — dat is wat attention later toevoegt.
                  </p>
                </MoreInfoPanel>
              </div>
            )}

            {currentStep === 3 && data && (
              <div className="step-card">
                <h2 className="step-title">Positionale Encoding</h2>
                <p className="step-description">
                  Een transformer leest alle tokens tegelijk — niet één voor één.
                  Daarom voegt het model expliciete positie-informatie toe, zodat
                  het verschil tussen "hond bijt man" en "man bijt hond" zichtbaar is.
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
                    De originele Transformer gebruikt <strong>sinusoïdale functies</strong> om
                    posities te coderen: elke positie krijgt een uniek patroon van sinus- en
                    cosinusgolven. Nieuwere modellen leren de positie-encodings zelf
                    (learned positional embeddings) of gebruiken relatieve posities (RoPE).
                  </p>
                  <p>
                    Zonder positie-encoding zou het model "De kat zit op de mat" en
                    "De mat zit op de kat" identiek behandelen — de volgorde van tokens
                    maakt letterlijk geen verschil.
                  </p>
                </MoreInfoPanel>
              </div>
            )}

            {currentStep === 4 && data && (
              <div className="step-card">
                <h2 className="step-title">Self-Attention</h2>
                <p className="step-description">
                  Elk token kijkt naar alle andere tokens om zijn betekenis in context
                  te bepalen. &lsquo;Bank&rsquo; kijkt naar &lsquo;water&rsquo; om te begrijpen dat het om
                  een oever gaat, niet een zitmeubel.
                </p>
                <TokenRow
                  tokens={data.tokens}
                  selectedToken={selectedToken}
                  onSelectToken={setSelectedToken}
                />
                <p className="hint">
                  Geselecteerd: <strong>{data.tokens[selectedToken]?.text}</strong>.
                  Klik op een ander token om de aandachtsverdeling te zien.
                </p>
                <AttentionView
                  tokens={data.tokens}
                  weights={data.attentionHeads[0].weights}
                  selectedToken={selectedToken}
                />
                <MoreInfoPanel>
                  <p>
                    <strong>Query, Key, Value</strong><br />
                    Voor elk token maakt het model drie vectoren:
                  </p>
                  <ul>
                    <li><strong>Query</strong> — "Waar moet ik op letten?" (het token stelt een vraag)</li>
                    <li><strong>Key</strong> — "Dit ben ik." (elk token biedt zichzelf aan)</li>
                    <li><strong>Value</strong> — "Dit is mijn inhoud." (de informatie die doorgegeven wordt)</li>
                  </ul>
                  <p>
                    <strong>Stap 1 — Scores:</strong> De query van token A en de key van token B worden
                    vermenigvuldigd (dot product). Hoe meer ze overeenkomen, hoe hoger de score.
                  </p>
                  <p>
                    <strong>Stap 2 — Softmax:</strong> Die scores worden omgezet naar percentages die
                    samen 100% zijn. Denk aan: 80% aandacht voor token B, 15% voor C, 5% voor D.
                  </p>
                  <p>
                    <strong>Stap 3 — Mix:</strong> De values van alle tokens worden gewogen samengevoegd.
                    Het resultaat is een nieuwe vector: een contextrijke mix van de hele zin.
                  </p>
                  <p>
                    <strong>Voorbeeld:</strong> In "De bank staat bij het water" kijkt "bank" sterk
                    naar "water". Daardoor schuift de betekenis van "bank" naar "oever".
                    Zonder attention zou dat onderscheid onmogelijk zijn.
                  </p>
                </MoreInfoPanel>
              </div>
            )}

            {currentStep === 5 && data && (
              <div className="step-card">
                <h2 className="step-title">Multi-Head Attention</h2>
                <p className="step-description">
                  Eén attention head mist de nuance. Meerdere heads kijken elk
                  op een eigen manier naar de zin — grammatica, semantiek,
                  coreference — en worden daarna samengevoegd.
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
                    Elke head leert andere patronen. Eén head kan grammaticale relaties leren
                    (subject–werkwoord), een andere semantische relaties (synoniemen),
                    en een derde coreference (naar wie verwijst "hij"?).
                  </p>
                  <p>
                    De outputs van alle heads worden samengevoegd en via een lineaire laag
                    teruggebracht naar de oorspronkelijke dimensie. In GPT-2 zijn er{' '}
                    <strong>12 heads</strong>; in GPT-3 zijn er <strong>96</strong>.
                    Meer heads = meer perspectieven per token.
                  </p>
                </MoreInfoPanel>
              </div>
            )}

            {currentStep === 6 && data && (
              <div className="step-card">
                <h2 className="step-title">Feed-Forward Update</h2>
                <p className="step-description">
                  Na attention werkt een klein neuraal netwerk elk token apart
                  verder bij. Het slaat feiten op en past de representatie aan
                  op basis van wat het tijdens training heeft geleerd.
                </p>
                <TokenRow
                  tokens={data.tokens}
                  selectedToken={selectedToken}
                  onSelectToken={setSelectedToken}
                />
                <p className="hint">
                  Geselecteerd: <strong>{data.tokens[selectedToken]?.text}</strong>.
                  Klik op een token om te zien hoe het feed-forward netwerk het bijwerkt.
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
                            const delta = value - data.embeddings[selectedToken][index];
                            return Math.round(delta * DELTA_PRECISION) / DELTA_PRECISION;
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
                    typisch <strong>4&times; de embedding-dimensie</strong>. Residual connections
                    voegen de originele embedding terug toe zodat informatie niet verloren gaat
                    — dit heet ook wel een <em>skip connection</em>.
                  </p>
                  <p>
                    Dit kleine netwerk werkt per token apart en slaat als het ware feitelijke
                    kennis op: welke woorden horen bij welke concepten, wat zijn typische
                    combinaties. Attention zorgt voor de context; feed-forward verwerkt die
                    context tot een bijgewerkte representatie.
                  </p>
                </MoreInfoPanel>
              </div>
            )}

            {currentStep === 7 && data && (
              <div className="step-card">
                <h2 className="step-title">Voorspelling</h2>
                <p className="step-description">
                  Het model geeft geen zeker antwoord — het geeft een
                  <em> kansverdeling</em> over alle mogelijke volgende tokens.
                  Selecteer een kandidaat en voeg hem toe aan de zin.
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
                    De ruwe scores heten <strong>logits</strong>. Softmax zet die om naar
                    kansen die samen 100% zijn. Voorbeeld: logits [3.2, 1.0, -0.5] worden
                    na softmax ongeveer [0.79, 0.16, 0.05] — de hoogste logit domineert.
                  </p>
                  <p>
                    <strong>Temperatuur</strong> bepaalt hoe scherp de verdeling is.
                    Lage temperatuur (0.5) → model kiest bijna altijd het meest
                    waarschijnlijke token. Hoge temperatuur (1.5) → verrassender,
                    creatievere output. <strong>Top-k sampling</strong> kiest willekeurig
                    uit de k meest waarschijnlijke tokens.
                  </p>
                </MoreInfoPanel>
              </div>
            )}

            {currentStep === 8 && (
              <div className="step-card">
                <h2 className="step-title">Wat is een Large Language Model?</h2>
                <p className="step-description">
                  Een transformer is de motor. Een LLM is wat je krijgt als je die
                  motor traint op miljarden pagina&rsquo;s tekst — zodat hij van alles
                  kan: samenvatten, vertalen, redeneren, programmeren.
                </p>
                <p className="hint">Klik op een vaardigheid om een voorbeeld te zien.</p>
                <div className="info-card-grid">
                  {LLM_CAPABILITIES.map((cap, i) => (
                    <div
                      key={i}
                      className={`info-card ${selectedCapability === i ? 'active' : ''}`}
                      onClick={() => setSelectedCapability(i)}
                    >
                      <span className="info-card-icon">{cap.icon}</span>
                      <span className="info-card-label">{cap.label}</span>
                    </div>
                  ))}
                </div>
                <div className="info-detail">
                  <strong>{LLM_CAPABILITIES[selectedCapability].summary}</strong>
                  <div className="info-detail-example">
                    {LLM_CAPABILITIES[selectedCapability].example}
                  </div>
                </div>
                <MoreInfoPanel>
                  <p>
                    <strong>Hoe wordt een LLM getraind?</strong><br />
                    Het model krijgt steeds een stuk tekst te zien met het laatste woord
                    weggelaten. Het voorspelt het ontbrekende woord, vergelijkt die
                    voorspelling met het echte woord, en past zijn gewichten aan via
                    backpropagation. Dit herhaalt zich biljoen keer op gigantische datasets.
                  </p>
                  <p>
                    <strong>Wat maakt LLMs anders dan gewone software?</strong><br />
                    Traditionele software volgt expliciete regels: als A dan B. Een LLM
                    leert statistische patronen uit data — geen enkele programmeur heeft het
                    ooit uitgelegd dat "de bank bij het water" een oever is.
                  </p>
                  <p>
                    <strong>Bekende modellen:</strong> GPT-4 (OpenAI), Claude (Anthropic),
                    Gemini (Google), Llama (Meta). Ze werken allemaal op het
                    transformer-principe dat je hier hebt gezien.
                  </p>
                  <p>
                    <strong>Context window:</strong> Hoeveel tokens een model tegelijk
                    "ziet". Vroege modellen: ~1.000 tokens. Moderne modellen: 100.000–1 miljoen.
                    Alles buiten het venster is het model vergeten.
                  </p>
                </MoreInfoPanel>
              </div>
            )}

            {currentStep === 9 && (
              <div className="step-card">
                <h2 className="step-title">Hoe werken AI-agents?</h2>
                <p className="step-description">
                  Een agent is een LLM dat niet alleen praat, maar ook <em>handelt</em>:
                  het zoekt op, voert code uit, roept API&rsquo;s aan — en herhaalt dat
                  totdat de taak klaar is.
                </p>
                <p className="hint">Klik op een stap om te zien wat er in die fase gebeurt.</p>
                <div className="react-loop">
                  {REACT_STEPS.map((step, i) => (
                    <React.Fragment key={i}>
                      <div
                        className={`react-step ${selectedAgentStep === i ? 'active' : ''}`}
                        onClick={() => setSelectedAgentStep(i)}
                      >
                        <span className="react-step-icon">{step.icon}</span>
                        <span className="react-step-label">{step.label}</span>
                      </div>
                      {i < REACT_STEPS.length - 1 && (
                        <div className="react-arrow">→</div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
                <div className="info-detail">
                  <strong>{REACT_STEPS[selectedAgentStep].summary}</strong>
                  <div className="info-detail-example" style={{ whiteSpace: 'pre-line' }}>
                    {REACT_STEPS[selectedAgentStep].example}
                  </div>
                </div>
                <MoreInfoPanel>
                  <p>
                    <strong>ReAct-patroon</strong> (Reasoning + Acting)<br />
                    Dit is het standaard-patroon voor agents. Het model denkt hardop
                    na (chain-of-thought), kiest een tool, observeert het resultaat,
                    en beslist of het klaar is of verder moet. Zo kan een simpele
                    LLM complexe meertraps-taken uitvoeren.
                  </p>
                  <p>
                    <strong>Bekende agents:</strong> GitHub Copilot, ChatGPT-plugins,
                    AutoGPT. Ze gebruiken tools als web-zoeken, code-uitvoering, of
                    bestandsbeheer.
                  </p>
                  <p>
                    <strong>Multi-agent systemen:</strong> Meerdere agents samenwerken —
                    één plant, een andere zoekt informatie, een derde schrijft de output.
                    Ze communiceren via tekst, net als mensen via e-mail.
                  </p>
                  <p>
                    <strong>Guardrails:</strong> Een agent die zelfstandig handelt kan
                    moeilijk terug te draaien fouten maken. Daarom bouwen ontwikkelaars
                    limieten in op wat een agent mag doen zonder menselijke goedkeuring.
                  </p>
                </MoreInfoPanel>
              </div>
            )}

            {currentStep === 10 && (
              <div className="step-card">
                <h2 className="step-title">Modellen aanpassen</h2>
                <p className="step-description">
                  Een standaard LLM is generiek. Er zijn vier manieren om het te
                  richten op jouw situatie — van snel en goedkoop tot grondig en duur.
                </p>
                <p className="hint">Klik op een techniek om te zien wanneer en hoe je die gebruikt.</p>
                <div className="info-card-grid">
                  {LEARNING_TECHNIQUES.map((tech, i) => (
                    <div
                      key={i}
                      className={`info-card ${selectedTechnique === i ? 'active' : ''}`}
                      onClick={() => setSelectedTechnique(i)}
                    >
                      <span className="info-card-icon">{tech.icon}</span>
                      <span className="info-card-label">{tech.label}</span>
                    </div>
                  ))}
                </div>
                <div className="info-detail">
                  <strong>{LEARNING_TECHNIQUES[selectedTechnique].summary}</strong>
                  <div className="info-detail-example">
                    {LEARNING_TECHNIQUES[selectedTechnique].example}
                  </div>
                  <div style={{ marginTop: '0.4rem', fontSize: '0.8rem', color: 'var(--gray-600)' }}>
                    <em>Wanneer: {LEARNING_TECHNIQUES[selectedTechnique].when}</em>
                  </div>
                </div>
                <MoreInfoPanel>
                  <p>
                    <strong>Prompting</strong> — geen technische kennis nodig; je stuurt
                    het model met instructies en voorbeelden in de prompt zelf.
                    Snel itereren, maar beperkt in stijl en domeinkennis.
                  </p>
                  <p>
                    <strong>Fine-tuning</strong> — je traint het model verder op eigen data.
                    De interne gewichten veranderen écht. Vereist labeled data en GPU-rekentijd.
                    Resultaat: een model dat echt anders is dan het origineel.
                  </p>
                  <p>
                    <strong>RLHF</strong> (Reinforcement Learning from Human Feedback) — mensen
                    beoordelen antwoorden, en het model leert die voorkeur na te streven.
                    Zo is ChatGPT veilig en bruikbaar geworden. Duur en complex.
                  </p>
                  <p>
                    <strong>RAG</strong> (Retrieval-Augmented Generation) — het model krijgt
                    bij elke vraag relevante documenten mee in de prompt. Ideaal voor
                    up-to-date informatie of bedrijfsspecifieke kennis zonder training.
                  </p>
                </MoreInfoPanel>
              </div>
            )}

            {currentStep === 11 && (
              <div className="step-card">
                <h2 className="step-title">Kritische blik</h2>
                <p className="step-description">
                  AI is krachtig — maar niet neutraal, niet gratis en niet foutloos.
                  Klik op een onderwerp om te zien wat er mis kan gaan.
                </p>
                <div className="info-card-grid">
                  {RISKS.map((risk, i) => (
                    <div
                      key={i}
                      className={`info-card ${selectedRisk === i ? 'active' : ''}`}
                      onClick={() => setSelectedRisk(i)}
                    >
                      <span className="info-card-icon">{risk.icon}</span>
                      <span className="info-card-label">{risk.label}</span>
                    </div>
                  ))}
                </div>
                <div className="info-detail">
                  <strong>{RISKS[selectedRisk].summary}</strong>
                  <div className="info-detail-example">
                    {RISKS[selectedRisk].detail}
                  </div>
                </div>
                <MoreInfoPanel>
                  <p>
                    <strong>Wat kun jij doen?</strong><br />
                    Kritisch blijven. Bronnen checken. Nadenken over welke AI-diensten
                    je gebruikt en van wie. Beseffen dat technologie nooit neutraal is
                    — er zitten altijd keuzes en belangen achter.
                  </p>
                  <p>
                    <strong>Positief tegenwicht:</strong> Betere regulering (EU AI Act),
                    open modellen (Llama, Mistral), onafhankelijk veiligheidsonderzoek
                    (METR, Apollo Research) en eerlijkere arbeidscontracten in de
                    annotatie-industrie zijn stappen in de goede richting.
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
