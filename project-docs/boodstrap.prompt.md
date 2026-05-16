Je bent een senior product designer, AI educator en full-stack JavaScript developer.

Ontwerp een MVP voor een interactieve HTML/JavaScript-demo die transformer-modellen uitlegt aan niet-technische gebruikers, geïnspireerd op de bekende interactieve blockchain-demo’s. Het doel is dat mensen stap voor stap kunnen zien hoe een taalmodel van inputtekst naar voorspellingen komt.

De demo moet gelaagd zijn opgebouwd:

1. Basislaag:
   - Leg transformers intuïtief uit zonder wiskunde.
   - Toon tokens als blokjes.
   - Laat zien dat woorden naar andere woorden “kijken” om context te begrijpen.
   - Visualiseer self-attention met pijlen, kleuren of gewichten.
   - Laat een simpele volgende-tokenvoorspelling zien.

2. “Meer weten”-laag:
   - Geef per stap een knop of sectie “meer weten”.
   - Leg uit wat er onder de motorkap gebeurt.
   - Behandel embeddings, positional encoding, query/key/value, dot products, softmax, attention heads, feed-forward layers en residual connections.
   - Gebruik kleine, begrijpelijke getallen en visuele voorbeelden.

3. Advanced modus:
   - Beschrijf hoe dezelfde demo later gekoppeld kan worden aan echte modellen.
   - Denk aan transformers.js, ONNX Runtime Web, TensorFlow.js of een kleine browser-compatible transformer.
   - Laat gebruikers echte tokens, attention weights, logits, temperatuur en sampling zien.
   - Zorg dat deze modus optioneel blijft zodat beginners niet overweldigd worden.

Werk dit uit als een concreet MVP-plan en een roadmap voor doorontwikkeling.

Geef je antwoord in het Nederlands en structureer het als volgt:

## 1. Productvisie
Beschrijf in één alinea wat de demo doet en voor wie hij bedoeld is.

## 2. Leerdoelen
Maak onderscheid tussen:
- beginner
- geïnteresseerde gebruiker
- technische gebruiker

## 3. MVP-functionaliteit
Beschrijf exact wat de eerste versie moet kunnen. Houd het haalbaar voor één developer in een paar dagen.

## 4. Interactieve flow
Beschrijf de schermen of stappen van de demo:
- inputzin
- tokenisatie
- embeddings
- positional encoding
- self-attention
- multi-head attention
- feed-forward update
- voorspelling volgend token

Geef per stap:
- wat de gebruiker ziet
- welke interactie mogelijk is
- wat de korte uitlegtekst is
- wat er achter “meer weten” staat

## 5. Didactisch model
Beschrijf hoe je een versimpelde maar conceptueel correcte transformer simuleert zonder meteen een echt model te draaien. Gebruik kleine vectors, eenvoudige matrices en vaste voorbeelddata.

## 6. Visualisaties
Doe voorstellen voor concrete visualisaties:
- tokenblokjes
- vectorbalkjes
- attention-pijlen
- heatmap
- lagen-stack
- outputkansen
- sliders

## 7. Advanced modus
Beschrijf hoe een echte model-backend of browsermodel later geïntegreerd kan worden. Benoem mogelijke libraries, technische voor- en nadelen en performance-risico’s.

## 8. Technische architectuur
Stel een eenvoudige technische architectuur voor:
- HTML/CSS/JavaScript of React
- datastructuren
- componenten
- state management
- rekencode
- visualisatielaag

## 9. MVP-roadmap
Maak een roadmap in fases:
- Fase 1: klikbare educatieve simulatie
- Fase 2: interactieve parameters
- Fase 3: echte tokenisatie en kleine modeloutput
- Fase 4: echte attention-inspectie
- Fase 5: publiceerbare educatieve tool

Geef per fase:
- doel
- belangrijkste features
- technische complexiteit
- geschatte effort
- risico’s

## 10. Scopebewaking
Maak expliciet wat níet in de MVP hoort.

## 11. Voorbeeldcontent
Geef minstens drie voorbeeldzinnen die goed werken voor de demo, waaronder één zin met ambiguïteit, bijvoorbeeld “De bank staat aan het water”.

## 12. Bouwadvies
Sluit af met een concreet advies:
- wat eerst bouwen
- welke fake data gebruiken
- welke onderdelen generiek houden
- hoe later naar echte modellen te migreren

Belangrijk:
- Maak het praktisch, niet academisch.
- Vermijd te veel jargon in de basislaag.
- Gebruik “meer weten”-secties om diepgang te bieden.
- Ontwerp de demo alsof hij in een browser draait zonder installatie.
- De MVP mag fake/simulated data gebruiken, zolang de concepten eerlijk en correct worden uitgelegd.