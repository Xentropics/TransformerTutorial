# Transformer Demo

Een interactieve, educatieve web-app die stap voor stap uitlegt hoe een transformer taalmodel werkt.

> ⚠️ **Simulatie** — Conceptueel correct, getallen zijn vereenvoudigd.

## Over dit project

Dit is een statische browser-app (geen backend, geen echte model-inferentie) gebouwd met **React 18 + Vite**. De app visualiseert de interne werking van een transformer met gesimuleerde maar conceptueel correcte data.

De UI is in het **Nederlands**. Drie voorbeeldzinnen zijn ingebouwd; je kunt ook je eigen zin invoeren.

## Stappen (8 lagen)

1. **Invoer** — tekst invoeren of een voorbeeldzin kiezen
2. **Tokenisatie** — zin opknippen in tokens met vocabulaire-ID's
3. **Embeddings** — tokens omzetten naar numerieke vectoren
4. **Positionale Encoding** — positie-informatie toevoegen aan embeddings
5. **Self-Attention** — tokens kijken naar andere tokens (pijlen / heatmap)
6. **Multi-Head Attention** — 3 attention heads met verschillende patronen
7. **Feed-Forward Update** — vectoren verfijnen via feed-forward netwerk
8. **Voorspelling** — kansen voor volgende token, met temperatuur-slider

## Aan de slag

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in je browser.

## Bouwen

```bash
npm run build
```

De geoptimaliseerde output staat in `dist/` (niet meegecommit).

## Tech stack

- React 18 + Vite
- Plain CSS (geen Tailwind, geen CSS modules)
- SVG voor attention-visualisaties
- Geen externe dependencies buiten React/Vite
