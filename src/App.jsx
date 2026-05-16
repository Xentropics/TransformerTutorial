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
  { step: 9, label: 'Agents' },
  { step: 10, label: 'Leren & RAG' },
  { step: 11, label: 'Kritische blik' },
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
                    3D-vectors als voorbeeld. Zie een embedding als een compacte
                    samenvatting van wat een token vaak betekent en hoe het zich
                    verhoudt tot andere tokens.
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
                    <strong>Hoe werkt het precies?</strong><br />
                    Stel je voor dat je in een klas zit en iemand vraagt: "Wat bedoel je met 'bank'?"
                    Je kijkt om je heen naar de rest van de zin om het te begrijpen.
                    Dat is precies wat self-attention doet.
                  </p>
                  <p>
                    Voor elk token maakt het model drie kleine lijstjes met getallen:
                  </p>
                  <ul>
                    <li><strong>Query (vraag):</strong> "Waar moet ik op letten?" — dit token stuurt een vraag de wereld in.</li>
                    <li><strong>Key (sleutel):</strong> "Dit ben ik." — elk ander token geeft aan wat het te bieden heeft.</li>
                    <li><strong>Value (waarde):</strong> "Dit is mijn informatie." — de inhoud die doorgegeven wordt als iemand op jou let.</li>
                  </ul>
                  <p>
                    <strong>Stap 1 — Scores berekenen:</strong><br />
                    De query van token A wordt vergeleken met de key van elk ander token.
                    Dat vergelijken doe je met een <em>dot product</em>: je vermenigvuldigt de getallen met elkaar en telt ze op.
                    Hoe meer de query en key op elkaar lijken, hoe hoger de score.
                    Denk aan een zoekbalk: als je zoekt op "hond" en een token heeft key "hond", matcht dat goed.
                  </p>
                  <p>
                    <strong>Stap 2 — Softmax (verdeling maken):</strong><br />
                    Die scores zijn nu losse getallen, zoals 3.2, 0.1, -1.5.
                    Dat zegt nog niet hoeveel aandacht je eraan moet geven.
                    Softmax zet die getallen om naar <em>percentages die samen 100% zijn</em>.
                    Dus misschien wordt het: 80% op token A, 15% op token B, 5% op token C.
                    Hogere scores krijgen meer gewicht — maar lage scores tellen nog steeds een beetje mee.
                  </p>
                  <p>
                    <strong>Stap 3 — Informatie ophalen:</strong><br />
                    Nu weet het model hoe zwaar elk token meetelt.
                    Het pakt de <em>value</em> van elk token en mengt die samen, gewogen met die percentages.
                    Het resultaat is een nieuwe vector: een mix van informatie uit de hele zin,
                    aangepast aan de context van dit specifieke token.
                  </p>
                  <p>
                    <strong>Voorbeeld:</strong> In "De bank staat bij het water" kijkt "bank" sterk naar "water".
                    Daardoor schuift de betekenis van "bank" richting "oever" in plaats van "zitmeubel".
                    Zonder attention zou het model dat onderscheid niet kunnen maken.
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
                    typisch <strong>4&times; de embedding dimensie</strong>. Residual connections voegen de
                    originele embedding terug toe, zodat informatie niet verloren gaat.
                    Dit heet ook wel &lsquo;skip connection&rsquo;.
                  </p>
                  <p>
                    Zo&rsquo;n feed-forward layer is een klein neuraal netwerk dat per token
                    apart werkt. Een neuraal netwerk kun je zien als lagen met gewichten
                    die patronen leren: de eerste laag combineert signalen, de
                    activatiefunctie voegt niet-lineariteit toe, en de tweede laag
                    projecteert terug naar het oorspronkelijke formaat.
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
                  <p>
                    Voorbeeld: als twee logits dicht bij elkaar liggen, geeft softmax
                    twee vergelijkbare kansen. Ligt &eacute;&eacute;n logit veel hoger, dan wordt de
                    verdeling piekerig en kiest het model meestal die token.
                  </p>
                </MoreInfoPanel>
              </div>
            )}

            {currentStep === 8 && (
              <div className="step-card">
                <h2 className="step-title">Wat is een Large Language Model?</h2>
                <p className="step-description">
                  Een transformer is de motor. Een LLM is wat je krijgt als je die motor traint op een gigantische hoeveelheid tekst.
                </p>
                <MoreInfoPanel>
                  <p>
                    <strong>Van transformer naar LLM</strong><br />
                    Je hebt nu gezien hoe een transformer werkt: tokens, embeddings, attention, voorspelling.
                    Een <em>Large Language Model</em> (LLM) is een transformer die is getraind op een enorme hoeveelheid tekst —
                    denk aan miljarden pagina's van het internet, boeken, Wikipedia en code.
                  </p>
                  <p>
                    <strong>Hoe leer je een model?</strong><br />
                    Tijdens training krijgt het model steeds een stukje tekst te zien met het laatste woord weggelaten.
                    Het model doet een voorspelling, vergelijkt die met het echte woord, en past zijn interne gewichten aan.
                    Dit herhaalt zich biljoen keer. Na training "weet" het model heel veel over taal, feiten en redeneren —
                    zonder dat iemand het iets expliciet heeft uitgelegd.
                  </p>
                  <p>
                    <strong>Wat maakt LLMs speciaal?</strong><br />
                    Normale software volgt strikte regels: als A dan B. Een LLM leert patronen.
                    Daardoor kan het:
                  </p>
                  <ul>
                    <li>Tekst samenvatten, vertalen, herschrijven</li>
                    <li>Vragen beantwoorden op basis van context</li>
                    <li>Code schrijven en uitleggen</li>
                    <li>Redeneren over nieuwe situaties die het nooit heeft gezien</li>
                  </ul>
                  <p>
                    <strong>Voorbeelden:</strong> GPT-4 (OpenAI), Claude (Anthropic), Gemini (Google), Llama (Meta).
                    Ze werken allemaal op het transformer-principe dat je hier hebt gezien.
                  </p>
                  <p>
                    <strong>Context window</strong><br />
                    Een LLM kan maar een bepaalde hoeveelheid tekst tegelijk "zien" — dat heet het <em>context window</em>.
                    Vroege modellen hadden ruimte voor ~1000 tokens. Moderne modellen halen 100.000 tot 1 miljoen tokens.
                    Alles buiten dat venster is het model "vergeten".
                  </p>
                </MoreInfoPanel>
              </div>
            )}

            {currentStep === 9 && (
              <div className="step-card">
                <h2 className="step-title">Hoe werken AI-agents?</h2>
                <p className="step-description">
                  Een agent is een LLM dat niet alleen praat, maar ook dingen <em>doet</em>.
                </p>
                <MoreInfoPanel>
                  <p>
                    <strong>Van chatbot naar agent</strong><br />
                    Een gewone chatbot geeft antwoorden. Een agent kan ook acties uitvoeren:
                    een zoekopdracht doen, een bestand openen, een API aanroepen, code uitvoeren.
                    Het LLM is de hersenen; de tools zijn de handen.
                  </p>
                  <p>
                    <strong>Hoe werkt dat in de praktijk?</strong><br />
                    Een agent werkt in een lus:
                  </p>
                  <ol>
                    <li><strong>Denk:</strong> het LLM analyseert de opdracht en bedenkt een plan.</li>
                    <li><strong>Handel:</strong> het roept een tool aan (bijv. "zoek op internet naar X").</li>
                    <li><strong>Observeer:</strong> het krijgt het resultaat terug.</li>
                    <li><strong>Herhaal</strong> tot de taak klaar is.</li>
                  </ol>
                  <p>
                    Dit patroon heet <em>ReAct</em> (Reasoning + Acting). Bekende voorbeelden:
                    AutoGPT, GitHub Copilot, en de agents in ChatGPT die kunnen browsen of code uitvoeren.
                  </p>
                  <p>
                    <strong>Multi-agent systemen</strong><br />
                    Je kunt ook meerdere agents samenwerken laten: één agent plant, een andere zoekt informatie,
                    een derde schrijft de uiteindelijke tekst. Ze communiceren via tekst, net als mensen via e-mail.
                  </p>
                  <p>
                    <strong>Gevaar:</strong> een agent die zelfstandig handelt kan fouten maken die moeilijk terug te draaien zijn.
                    Daarom bouwen ontwikkelaars <em>guardrails</em> in: limieten op wat een agent mag doen zonder menselijke goedkeuring.
                  </p>
                </MoreInfoPanel>
              </div>
            )}

            {currentStep === 10 && (
              <div className="step-card">
                <h2 className="step-title">Modellen leren & aanpassen</h2>
                <p className="step-description">
                  Een standaard LLM is generiek. Maar je kunt het bijspijkeren voor jouw situatie — op meerdere manieren.
                </p>
                <MoreInfoPanel>
                  <p>
                    <strong>1. Prompting</strong><br />
                    De eenvoudigste aanpassing: geef het model goede instructies in je prompt.
                    "Beantwoord als een vriendelijke klantenservice-medewerker" verandert al hoe het model reageert.
                    Je kunt ook voorbeelden meegeven (<em>few-shot prompting</em>): "Hier zijn drie voorbeeldantwoorden, doe het zo."
                  </p>
                  <p>
                    <strong>2. Fine-tuning</strong><br />
                    Hier train je het model verder op jouw eigen data.
                    Stel je hebt 10.000 klantenservice-gesprekken van je bedrijf.
                    Door het model hierop bij te trainen, leert het de toon, terminologie en aanpak van jouw organisatie.
                    De interne gewichten veranderen écht — het model wordt letterlijk anders.
                  </p>
                  <p>
                    <strong>3. RLHF (Reinforcement Learning from Human Feedback)</strong><br />
                    Zo is ChatGPT nuttig en beleefd geworden. Mensen beoordelen antwoorden ("dit is goed, dit is slecht"),
                    en het model leert die voorkeur na te streven. Zonder RLHF zou een LLM soms gevaarlijke of onzinnige antwoorden geven.
                  </p>
                  <p>
                    <strong>4. RAG — Retrieval-Augmented Generation</strong><br />
                    Een LLM weet niets over wat er gisteren is gebeurd, of over jouw interne documenten.
                    RAG lost dat op: voordat het model antwoord geeft, zoekt een apart systeem relevante documenten op
                    (bijv. jouw kennisbank), en stopt die in de prompt. Het model combineert dan zijn eigen kennis met die verse informatie.
                  </p>
                  <p>
                    <strong>Voorbeeld RAG:</strong> Je vraagt "Wat zijn onze openingstijden?" De RAG-laag zoekt in de bedrijfsdocumenten,
                    vindt de juiste pagina, en geeft die mee aan het LLM. Het LLM formuleert dan een helder antwoord.
                    Zonder RAG zou het model dit simpelweg niet weten.
                  </p>
                  <p>
                    <strong>Wanneer gebruik je wat?</strong>
                  </p>
                  <ul>
                    <li><em>Prompting</em> — snel, goedkoop, geen technische kennis nodig</li>
                    <li><em>RAG</em> — als je up-to-date of bedrijfsspecifieke informatie nodig hebt</li>
                    <li><em>Fine-tuning</em> — als je een specifieke stijl of vakkennis wilt inbakken</li>
                    <li><em>RLHF</em> — voor grote organisaties die een model grondig willen sturen</li>
                  </ul>
                </MoreInfoPanel>
              </div>
            )}

            {currentStep === 11 && (
              <div className="step-card">
                <h2 className="step-title">Kritische blik: wat gaat er mis?</h2>
                <p className="step-description">
                  AI is krachtig — maar niet neutraal, niet gratis en niet foutloos. Een technology assessment.
                </p>
                <MoreInfoPanel>
                  <p>
                    <strong>🧠 Hallucinaties</strong><br />
                    Een LLM voorspelt woorden op basis van patronen. Het "weet" niet echt of iets waar is.
                    Soms verzint het feiten die klinken als echt: een nepbron, een fout cijfer, een niet-bestaand persoon.
                    Dit heet een <em>hallucinatie</em>. Het is geen opzet — het model heeft simpelweg geen ingebouwde waarheidscheck.
                    Blindelings vertrouwen is dus gevaarlijk.
                  </p>
                  <p>
                    <strong>⚖️ Alignment</strong><br />
                    Hoe zorg je dat een AI doet wat je <em>bedoelt</em>, niet alleen wat je letterlijk zegt?
                    Dit is het alignment-probleem. Een model geoptimaliseerd op "mensen blij maken" kan leren te liegen
                    als dat hogere beoordelingen geeft. Alignment-onderzoek probeert dit te voorkomen —
                    maar het is een open probleem waar de beste AI-onderzoekers ter wereld aan werken.
                  </p>
                  <p>
                    <strong>🌍 Energieverbruik en CO₂</strong><br />
                    Het trainen van een groot model kost evenveel stroom als honderden huishoudens een jaar lang gebruiken.
                    En elke keer dat je een vraag stelt, draait er een datacenter. De totale uitstoot van de AI-industrie
                    groeit snel. Sommige bedrijven compenseren dit met groene energie; anderen niet.
                  </p>
                  <p>
                    <strong>💧 Waterverbruik</strong><br />
                    Datacenters gebruiken water om te koelen. Microsoft en Google verbruiken inmiddels miljoenen liters
                    drinkwater per dag voor hun AI-infrastructuur — ook in gebieden waar water schaars is.
                  </p>
                  <p>
                    <strong>👷 Arbeidsomstandigheden bij training</strong><br />
                    Om een model veilig te maken, moeten mensen schadelijke content beoordelen en labelen.
                    Dit werk — vaak gedaan in landen als Kenia of de Filipijnen — is psychisch zwaar en slecht betaald.
                    Onderzoeksjournalisten hebben misstanden blootgelegd bij toeleveranciers van grote AI-bedrijven.
                  </p>
                  <p>
                    <strong>©️ Auteursrecht en trainingsdata</strong><br />
                    LLMs zijn getraind op teksten, boeken, afbeeldingen en code van mensen — vaak zonder toestemming of vergoeding.
                    Schrijvers, kunstenaars en programmeurs klagen dat hun werk is gebruikt zonder dat ze iets terugzien.
                    In meerdere landen lopen rechtszaken. Hoe dit juridisch eindigt, is nog onduidelijk.
                  </p>
                  <p>
                    <strong>🔒 Privacy en bias</strong><br />
                    Trainingsdata bevat ook persoonlijke informatie en maatschappelijke vooroordelen.
                    Modellen kunnen bestaande ongelijkheid versterken — bijvoorbeeld door vrouwen minder snel voor te stellen
                    als ingenieur. Bovendien kunnen gebruikers onbewust gevoelige informatie delen met commerciële AI-diensten.
                  </p>
                  <p>
                    <strong>Wat kun jij doen?</strong><br />
                    Kritisch blijven. Bronnen checken. Nadenken over welke AI-diensten je gebruikt en van wie.
                    En beseffen: technologie is nooit neutraal — er zitten altijd keuzes en belangen achter.
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
