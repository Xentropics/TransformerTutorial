## 1. Productvisie

De demo is een interactieve browserervaring die niet-technische gebruikers stap voor stap laat zien hoe een transformer van tekst naar een volgende-tokenvoorspelling komt. De gebruiker typt een korte zin, ziet hoe die zin wordt opgeknipt in tokens, hoe tokens context krijgen door naar elkaar te “kijken”, en hoe daaruit een voorspelling ontstaat. De demo gebruikt in de MVP gesimuleerde maar conceptueel correcte data, zodat het leerproces helder blijft zonder zware modellen of installatie.

## 2. Leerdoelen

**Beginner**
- Begrijpt dat een taalmodel niet “denkt”, maar patronen gebruikt.
- Ziet dat tekst eerst wordt opgeknipt in tokens.
- Begrijpt intuïtief dat woorden betekenis krijgen door context.

**Geïnteresseerde gebruiker**
- Begrijpt embeddings als getallenrepresentaties van tokens.
- Ziet hoe attention bepaalt welke tokens belangrijk zijn.
- Begrijpt dat meerdere lagen de tekstrepresentatie stap voor stap verfijnen.

**Technische gebruiker**
- Herkent query/key/value, softmax, attention heads en logits.
- Ziet hoe fake vectors en matrices het transformerproces simuleren.
- Begrijpt hoe de demo later aan een echt browsermodel gekoppeld kan worden.

## 3. MVP-functionaliteit

De eerste versie moet kunnen:

- Eén voorbeeldzin kiezen of zelf een korte zin invoeren.
- Tokens als blokjes tonen.
- Per stap vooruit/achteruit navigeren.
- Een vaste transformer-simulatie tonen met kleine vectors.
- Self-attention visualiseren via pijlen of heatmap.
- Een eenvoudige volgende-tokenvoorspelling tonen als kansverdeling.
- Per stap een korte uitleg en een inklapbare “meer weten”-sectie tonen.
- Geen backend, geen echte modelinference, geen installatie.

Haalbaar voor één developer in een paar dagen als statische HTML/CSS/JavaScript-app.

## 4. Interactieve flow

### Inputzin

**Gebruiker ziet**
- Tekstveld.
- Voorbeeldzinnen.
- Startknop.

**Interactie**
- Zin typen of voorbeeld kiezen.

**Korte uitleg**
“Een taalmodel begint met tekst. Die tekst wordt niet als hele zin gelezen, maar eerst opgeknipt in kleinere stukjes.”

**Meer weten**
Leg uit dat echte modellen subword-tokenizers gebruiken, zoals BPE of WordPiece. Voor de MVP mag tokenisatie simpel zijn: splitsen op woorden en leestekens.

### Tokenisatie

**Gebruiker ziet**
- Woorden als losse tokenblokjes.
- Elk token krijgt een ID.

**Interactie**
- Hover over token toont token-ID en simpele beschrijving.

**Korte uitleg**
“Tokens zijn de bouwblokjes waarmee het model werkt.”

**Meer weten**
Echte modellen kennen geen woorden zoals mensen. Ze werken met numerieke IDs uit een vocabulaire.

### Embeddings

**Gebruiker ziet**
- Elk token krijgt kleine vectorbalkjes, bijvoorbeeld `[0.2, 0.7, -0.1]`.

**Interactie**
- Klik op token toont vector.

**Korte uitleg**
“Een embedding vertaalt een token naar getallen die betekenis kunnen dragen.”

**Meer weten**
Woorden met verwante betekenis krijgen vaak vectoren die dichter bij elkaar liggen. In de MVP gebruiken we vaste voorbeeldvectors.

### Positional Encoding

**Gebruiker ziet**
- Extra kleurbalk of offset per tokenpositie.
- Tokenvector verandert licht na toevoeging van positie.

**Interactie**
- Toggle: “toon zonder/met positie”.

**Korte uitleg**
“Het model moet ook weten waar een token in de zin staat.”

**Meer weten**
Transformers lezen tokens tegelijk. Daarom voegen ze positie-informatie toe aan de embeddings.

### Self-Attention

**Gebruiker ziet**
- Tokens met pijlen naar andere tokens.
- Dikkere pijl betekent meer aandacht.
- Eventueel heatmap onder de zin.

**Interactie**
- Selecteer een token om te zien waar het naar kijkt.

**Korte uitleg**
“Een token kijkt naar andere tokens om zijn betekenis in context te begrijpen.”

**Meer weten**
Voor elk token worden query, key en value gemaakt. De query van één token wordt vergeleken met keys van andere tokens. Daarna bepaalt softmax hoeveel aandacht elk token krijgt.

### Multi-Head Attention

**Gebruiker ziet**
- Tabs of kleine panelen: Head 1, Head 2, Head 3.
- Elke head heeft ander aandachtspatroon.

**Interactie**
- Wisselen tussen heads.

**Korte uitleg**
“Meerdere attention heads kijken op verschillende manieren naar dezelfde zin.”

**Meer weten**
Eén head kan grammaticale relaties leren, een andere betekenisrelaties. In de MVP zijn deze patronen vooraf ontworpen.

### Feed-Forward Update

**Gebruiker ziet**
- Tokenvectors worden bijgewerkt.
- Voor/na-vergelijking met kleine balkjes.

**Interactie**
- Slider of knop “update toepassen”.

**Korte uitleg**
“Na attention verwerkt het model elk token nog verder met een kleine interne bewerking.”

**Meer weten**
Een feed-forward layer is een klein netwerk dat per positie werkt. Residual connections voegen oude informatie terug toe, zodat signalen behouden blijven.

### Voorspelling Volgend Token

**Gebruiker ziet**
- Balkgrafiek met mogelijke volgende tokens.
- Bijvoorbeeld: `ligt 42%`, `staat 28%`, `is 15%`.

**Interactie**
- Temperatuur-slider in optionele modus.
- Klik op voorspelling voegt token toe.

**Korte uitleg**
“Het model kiest niet één zeker antwoord, maar geeft kansen voor mogelijke volgende tokens.”

**Meer weten**
De ruwe scores heten logits. Softmax zet die om naar kansen. Temperatuur maakt de verdeling scherper of willekeuriger.

## 5. Didactisch model

Gebruik een mini-transformer met vaste voorbeelddata:

- Tokens krijgen vaste IDs.
- Elk token krijgt een vector van 3 of 4 dimensies.
- Positional encoding is een kleine vaste vector per positie.
- Query/key/value worden berekend met kleine vaste matrices.
- Attention scores worden afgerond op eenvoudige waarden zoals `0.1`, `0.3`, `0.6`.
- Softmax mag visueel worden uitgelegd als “scores omzetten naar gewichten die samen 100% zijn”.
- Outputkansen worden vooraf bepaald op basis van voorbeeldzinnen.

Belangrijk: label duidelijk dat dit een simulatie is. De stappen kloppen conceptueel, maar de getallen zijn vereenvoudigd.

## 6. Visualisaties

- **Tokenblokjes:** horizontale rij met kleur per token.
- **Vectorbalkjes:** kleine horizontale staafjes per vectorwaarde.
- **Attention-pijlen:** gebogen lijnen tussen tokens, dikte op basis van gewicht.
- **Heatmap:** matrix met tokens op beide assen.
- **Lagen-stack:** verticale stappenlijst: embedding → positie → attention → feed-forward → voorspelling.
- **Outputkansen:** balkgrafiek voor volgende-tokenopties.
- **Sliders:** temperatuur, attention-focus, aantal heads in latere fases.

## 7. Advanced modus

Advanced modus blijft optioneel en staat standaard uit.

Mogelijke integraties:

- **transformers.js**
  - Voordeel: browsergericht, relatief toegankelijk.
  - Nadeel: modelgrootte en laadtijd kunnen hoog zijn.

- **ONNX Runtime Web**
  - Voordeel: goede performance, WebAssembly/WebGPU-opties.
  - Nadeel: meer technische setup.

- **TensorFlow.js**
  - Voordeel: bekend ecosysteem.
  - Nadeel: transformer-LLM’s in de browser blijven zwaar.

- **Klein browser-compatible transformer-model**
  - Voordeel: beste educatieve controle.
  - Nadeel: beperkte kwaliteit en mogelijk veel optimalisatiewerk.

Advanced features:

- Echte tokens tonen.
- Attention weights inspecteren.
- Logits en softmax tonen.
- Temperatuur en sampling aanpassen.
- Top-k/top-p sampling toevoegen.

Performance-risico’s:

- Grote modeldownloads.
- Trage inference op oudere laptops.
- Browsergeheugenlimieten.
- WebGPU-compatibiliteit verschilt per apparaat.

## 8. Technische architectuur

Voor de MVP: gewone HTML/CSS/JavaScript of React.

Aanbevolen voor snelheid:

- **React** als de demo meerdere interactieve componenten krijgt.
- **Geen backend**.
- **JSON-bestanden** voor voorbeeldzinnen, tokens, vectors en attention weights.
- **Canvas of SVG** voor pijlen en heatmaps.
- **CSS** voor tokenblokjes, layout en animaties.

Componenten:

- `SentenceInput`
- `StepNavigator`
- `TokenRow`
- `VectorViewer`
- `AttentionView`
- `HeadSelector`
- `PredictionChart`
- `MoreInfoPanel`
- `AdvancedToggle`

State:

```js
{
  sentence,
  tokens,
  currentStep,
  selectedToken,
  selectedHead,
  showAdvanced,
  temperature
}
```

Rekencode:

- Kleine pure JavaScript-functies voor vectoroptelling, dot product, softmax en fake prediction.
- Houd deze functies generiek, zodat ze later echte modeldata kunnen verwerken.

## 9. MVP-roadmap

### Fase 1: Klikbare educatieve simulatie

**Doel**
Een begrijpelijke end-to-end demo.

**Features**
- Voorbeeldzinnen.
- Tokens.
- Simulated embeddings.
- Simulated attention.
- Volgende-tokenvoorspelling.
- Meer-weten-secties.

**Complexiteit**
Laag.

**Effort**
2-4 dagen.

**Risico’s**
Te veel uitleg tegelijk. Houd de basislaag kort.

### Fase 2: Interactieve parameters

**Doel**
Gebruiker kan effecten manipuleren.

**Features**
- Temperatuur-slider.
- Head-selector.
- Attention-focus aanpassen.
- Voor/na vectorupdates.

**Complexiteit**
Middel.

**Effort**
3-5 dagen.

**Risico’s**
Interacties kunnen conceptueel misleidend worden als fake data niet goed ontworpen is.

### Fase 3: Echte tokenisatie en kleine modeloutput

**Doel**
MVP koppelen aan echte tokenisatie.

**Features**
- Echte tokenizer.
- Echte token-IDs.
- Kleine modeloutput of vooraf berekende logits.

**Complexiteit**
Middel.

**Effort**
1-2 weken.

**Risico’s**
Tokenizer-output is minder intuïtief voor beginners.

### Fase 4: Echte attention-inspectie

**Doel**
Werkelijke attention weights tonen.

**Features**
- Klein model laden.
- Attention per layer/head inspecteren.
- Logits tonen.

**Complexiteit**
Hoog.

**Effort**
2-4 weken.

**Risico’s**
Niet elk model geeft attention makkelijk vrij. Performance kan tegenvallen.

### Fase 5: Publiceerbare educatieve tool

**Doel**
Een stabiele, deelbare leeromgeving.

**Features**
- Goede responsive layout.
- Lesmodus.
- Deelbare voorbeelden.
- Toegankelijkheid.
- Docentnotities.
- Meertalige interface.

**Complexiteit**
Middel tot hoog.

**Effort**
2-4 weken.

**Risico’s**
Scope creep. Bewaak dat het een educatieve demo blijft, geen volledige modelstudio.

## 10. Scopebewaking

Niet in de MVP:

- Geen echte LLM draaien.
- Geen accounts.
- Geen backend.
- Geen training van modellen.
- Geen chatinterface.
- Geen volledige wiskundige uitleg.
- Geen grote datasets.
- Geen perfecte tokenizer.
- Geen productie-analytics.
- Geen ondersteuning voor lange teksten.

## 11. Voorbeeldcontent

Goede voorbeeldzinnen:

1. “De bank staat aan het water.”
   - Ambiguïteit: bank als zitmeubel of oever.

2. “De kat ligt op de mat.”
   - Eenvoudig en visueel duidelijk.

3. “Ik drink koffie met melk.”
   - Goede context voor volgende-tokenvoorspelling.

Extra nuttig:

4. “Zij pakte de sleutel omdat de deur dicht was.”
   - Laat relaties tussen woorden zien.

5. “De appel viel niet ver van de boom.”
   - Laat uitdrukkingen en context zien.

## 12. Bouwadvies

Begin met een statische React- of vanilla JS-demo met één sterk uitgewerkte voorbeeldzin: “De bank staat aan het water.” Bouw eerst de volledige flow met fake data: tokens, vectors, attention weights en voorspellingen.

Houd de data in losse JSON-structuren, bijvoorbeeld:

```js
{
  tokens: ["De", "bank", "staat", "aan", "het", "water"],
  embeddings: [[0.2, 0.4, 0.1], ...],
  attentionHeads: [...],
  predictions: [
    { token: "ligt", probability: 0.42 },
    { token: "is", probability: 0.25 }
  ]
}
```

Maak de visualisatiecomponenten generiek: ze moeten niet weten of data fake of echt is. Later kun je dezelfde UI voeden met output van `transformers.js`, ONNX Runtime Web of vooraf berekende modelresultaten. De beste eerste stap is dus niet het echte model, maar een heldere, klikbare simulatie waarin elk transformerconcept begrijpelijk en visueel klopt.
