export const sentences = [
  {
    id: 'sentence-1',
    text: "De bank staat aan het water.",
    tokens: [
      { id: 0, text: "De", tokenId: 1001 },
      { id: 1, text: "bank", tokenId: 2847 },
      { id: 2, text: "staat", tokenId: 3124 },
      { id: 3, text: "aan", tokenId: 1592 },
      { id: 4, text: "het", tokenId: 1003 },
      { id: 5, text: "water", tokenId: 4201 },
      { id: 6, text: ".", tokenId: 18 },
    ],
    embeddings: [
      [0.2, 0.7, -0.1],
      [0.8, -0.3, 0.5],
      [-0.1, 0.6, 0.4],
      [0.3, 0.2, -0.6],
      [0.1, 0.9, 0.2],
      [0.6, -0.4, 0.7],
      [-0.2, 0.1, 0.3],
    ],
    positionalEncodings: [
      [0.0, 0.0, 0.0],
      [0.1, 0.0, -0.1],
      [0.0, 0.1, 0.1],
      [-0.1, 0.1, 0.0],
      [0.1, 0.0, 0.1],
      [0.0, -0.1, 0.1],
      [-0.1, 0.0, 0.0],
    ],
    attentionHeads: [
      {
        name: "Head 1 (syntaxis)",
        description: "Let op grammaticale structuur: onderwerp, werkwoord, object.",
        weights: [
          [0.5, 0.2, 0.1, 0.1, 0.05, 0.03, 0.02],
          [0.1, 0.5, 0.2, 0.1, 0.05, 0.03, 0.02],
          [0.05, 0.1, 0.5, 0.2, 0.1, 0.03, 0.02],
          [0.05, 0.1, 0.2, 0.5, 0.1, 0.03, 0.02],
          [0.1, 0.05, 0.1, 0.2, 0.5, 0.03, 0.02],
          [0.05, 0.1, 0.05, 0.1, 0.2, 0.45, 0.05],
          [0.05, 0.05, 0.05, 0.1, 0.1, 0.2, 0.45],
        ]
      },
      {
        name: "Head 2 (semantiek)",
        description: "Let op woordbetekenis en semantische relaties tussen woorden.",
        weights: [
          [0.3, 0.05, 0.05, 0.05, 0.05, 0.45, 0.05],
          [0.05, 0.4, 0.1, 0.05, 0.05, 0.3, 0.05],
          [0.05, 0.1, 0.4, 0.15, 0.05, 0.2, 0.05],
          [0.05, 0.05, 0.15, 0.45, 0.15, 0.1, 0.05],
          [0.05, 0.05, 0.1, 0.15, 0.5, 0.1, 0.05],
          [0.2, 0.3, 0.1, 0.05, 0.05, 0.25, 0.05],
          [0.1, 0.05, 0.05, 0.05, 0.05, 0.1, 0.6],
        ]
      },
      {
        name: "Head 3 (positie)",
        description: "Let op positie en nabijheid van tokens in de zin.",
        weights: [
          [0.6, 0.2, 0.1, 0.05, 0.03, 0.01, 0.01],
          [0.2, 0.5, 0.2, 0.05, 0.03, 0.01, 0.01],
          [0.05, 0.2, 0.5, 0.15, 0.05, 0.04, 0.01],
          [0.01, 0.05, 0.2, 0.5, 0.15, 0.08, 0.01],
          [0.01, 0.01, 0.05, 0.2, 0.55, 0.15, 0.03],
          [0.01, 0.01, 0.03, 0.05, 0.2, 0.6, 0.1],
          [0.01, 0.01, 0.01, 0.03, 0.05, 0.2, 0.69],
        ]
      }
    ],
    updatedEmbeddings: [
      [0.25, 0.65, -0.05],
      [0.75, -0.25, 0.55],
      [-0.05, 0.65, 0.45],
      [0.35, 0.25, -0.55],
      [0.15, 0.85, 0.25],
      [0.65, -0.35, 0.75],
      [-0.15, 0.15, 0.35],
    ],
    predictions: [
      { token: "ligt", probability: 0.42 },
      { token: "staat", probability: 0.28 },
      { token: "is", probability: 0.15 },
      { token: "gaat", probability: 0.09 },
      { token: "loopt", probability: 0.06 },
    ]
  },
  {
    id: 'sentence-2',
    text: "De kat ligt op de mat.",
    tokens: [
      { id: 0, text: "De", tokenId: 1001 },
      { id: 1, text: "kat", tokenId: 3301 },
      { id: 2, text: "ligt", tokenId: 2215 },
      { id: 3, text: "op", tokenId: 1088 },
      { id: 4, text: "de", tokenId: 1002 },
      { id: 5, text: "mat", tokenId: 3887 },
      { id: 6, text: ".", tokenId: 18 },
    ],
    embeddings: [
      [0.15, 0.75, -0.05],
      [0.7, 0.2, -0.4],
      [-0.3, 0.5, 0.6],
      [0.4, -0.1, 0.3],
      [0.1, 0.8, 0.1],
      [0.5, 0.3, -0.5],
      [-0.1, 0.2, 0.4],
    ],
    positionalEncodings: [
      [0.0, 0.0, 0.0],
      [0.09, 0.0, -0.09],
      [0.0, 0.09, 0.09],
      [-0.09, 0.09, 0.0],
      [0.09, 0.0, 0.09],
      [0.0, -0.09, 0.09],
      [-0.09, 0.0, 0.0],
    ],
    attentionHeads: [
      {
        name: "Head 1 (syntaxis)",
        description: "Let op grammaticale structuur: onderwerp, werkwoord, object.",
        weights: [
          [0.45, 0.25, 0.1, 0.1, 0.05, 0.03, 0.02],
          [0.15, 0.45, 0.25, 0.05, 0.05, 0.03, 0.02],
          [0.05, 0.15, 0.45, 0.2, 0.1, 0.03, 0.02],
          [0.05, 0.1, 0.25, 0.45, 0.1, 0.03, 0.02],
          [0.1, 0.05, 0.1, 0.25, 0.45, 0.03, 0.02],
          [0.05, 0.1, 0.05, 0.1, 0.25, 0.4, 0.05],
          [0.05, 0.05, 0.05, 0.1, 0.1, 0.25, 0.4],
        ]
      },
      {
        name: "Head 2 (semantiek)",
        description: "Let op woordbetekenis: 'kat' en 'mat' zijn concreet en verwant.",
        weights: [
          [0.3, 0.1, 0.05, 0.05, 0.05, 0.4, 0.05],
          [0.05, 0.35, 0.15, 0.05, 0.05, 0.3, 0.05],
          [0.05, 0.15, 0.35, 0.2, 0.05, 0.15, 0.05],
          [0.05, 0.05, 0.2, 0.4, 0.2, 0.05, 0.05],
          [0.05, 0.05, 0.1, 0.2, 0.45, 0.1, 0.05],
          [0.15, 0.35, 0.1, 0.05, 0.05, 0.25, 0.05],
          [0.1, 0.05, 0.05, 0.05, 0.05, 0.1, 0.6],
        ]
      },
      {
        name: "Head 3 (positie)",
        description: "Let op positie en nabijheid van tokens in de zin.",
        weights: [
          [0.55, 0.25, 0.1, 0.05, 0.03, 0.01, 0.01],
          [0.25, 0.45, 0.2, 0.05, 0.03, 0.01, 0.01],
          [0.05, 0.25, 0.45, 0.15, 0.05, 0.04, 0.01],
          [0.01, 0.05, 0.25, 0.45, 0.15, 0.08, 0.01],
          [0.01, 0.01, 0.05, 0.25, 0.5, 0.15, 0.03],
          [0.01, 0.01, 0.03, 0.05, 0.25, 0.55, 0.1],
          [0.01, 0.01, 0.01, 0.03, 0.05, 0.25, 0.64],
        ]
      }
    ],
    updatedEmbeddings: [
      [0.18, 0.72, 0.0],
      [0.65, 0.25, -0.35],
      [-0.25, 0.55, 0.65],
      [0.45, -0.05, 0.35],
      [0.15, 0.75, 0.15],
      [0.55, 0.35, -0.45],
      [-0.05, 0.25, 0.45],
    ],
    predictions: [
      { token: "en", probability: 0.38 },
      { token: "maar", probability: 0.25 },
      { token: "terwijl", probability: 0.18 },
      { token: "want", probability: 0.12 },
      { token: "als", probability: 0.07 },
    ]
  },
  {
    id: 'sentence-3',
    text: "Ik drink koffie met melk.",
    tokens: [
      { id: 0, text: "Ik", tokenId: 512 },
      { id: 1, text: "drink", tokenId: 1844 },
      { id: 2, text: "koffie", tokenId: 4052 },
      { id: 3, text: "met", tokenId: 1215 },
      { id: 4, text: "melk", tokenId: 3798 },
      { id: 5, text: ".", tokenId: 18 },
    ],
    embeddings: [
      [0.9, -0.2, 0.3],
      [-0.1, 0.7, 0.4],
      [0.5, 0.3, -0.6],
      [0.2, -0.5, 0.8],
      [0.4, 0.6, -0.3],
      [-0.3, 0.2, 0.5],
    ],
    positionalEncodings: [
      [0.0, 0.0, 0.0],
      [0.1, 0.0, -0.1],
      [0.0, 0.1, 0.1],
      [-0.1, 0.1, 0.0],
      [0.1, 0.0, 0.1],
      [-0.1, 0.0, 0.0],
    ],
    attentionHeads: [
      {
        name: "Head 1 (syntaxis)",
        description: "Let op grammaticale structuur: subject 'Ik', werkwoord 'drink'.",
        weights: [
          [0.5, 0.3, 0.1, 0.05, 0.03, 0.02],
          [0.2, 0.45, 0.2, 0.08, 0.05, 0.02],
          [0.05, 0.15, 0.5, 0.15, 0.12, 0.03],
          [0.05, 0.1, 0.2, 0.45, 0.15, 0.05],
          [0.05, 0.1, 0.15, 0.2, 0.45, 0.05],
          [0.05, 0.05, 0.1, 0.1, 0.2, 0.5],
        ]
      },
      {
        name: "Head 2 (semantiek)",
        description: "Let op semantiek: 'koffie' en 'melk' zijn gerelateerde dranken.",
        weights: [
          [0.35, 0.4, 0.1, 0.05, 0.05, 0.05],
          [0.3, 0.3, 0.2, 0.1, 0.05, 0.05],
          [0.05, 0.1, 0.4, 0.1, 0.3, 0.05],
          [0.05, 0.1, 0.15, 0.4, 0.25, 0.05],
          [0.05, 0.05, 0.35, 0.2, 0.3, 0.05],
          [0.1, 0.05, 0.1, 0.1, 0.15, 0.5],
        ]
      },
      {
        name: "Head 3 (positie)",
        description: "Let op positie en nabijheid van tokens in de zin.",
        weights: [
          [0.6, 0.25, 0.08, 0.04, 0.02, 0.01],
          [0.25, 0.5, 0.15, 0.06, 0.03, 0.01],
          [0.05, 0.2, 0.5, 0.15, 0.08, 0.02],
          [0.01, 0.05, 0.25, 0.5, 0.15, 0.04],
          [0.01, 0.01, 0.05, 0.25, 0.58, 0.1],
          [0.01, 0.01, 0.02, 0.05, 0.2, 0.71],
        ]
      }
    ],
    updatedEmbeddings: [
      [0.88, -0.15, 0.35],
      [-0.05, 0.75, 0.45],
      [0.55, 0.35, -0.55],
      [0.25, -0.45, 0.85],
      [0.45, 0.65, -0.25],
      [-0.25, 0.25, 0.55],
    ],
    predictions: [
      { token: "en", probability: 0.35 },
      { token: "zonder", probability: 0.3 },
      { token: "maar", probability: 0.18 },
      { token: "of", probability: 0.1 },
      { token: "later", probability: 0.07 },
    ]
  }
];

// Generate deterministic fake data for custom sentences
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function seededRandom(seed) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function generateEmbedding(tokenText, dim = 3) {
  const seed = simpleHash(tokenText);
  return Array.from({ length: dim }, (_, i) => {
    const val = seededRandom(seed + i * 100) * 2 - 1;
    return Math.round(val * 10) / 10;
  });
}

function generateAttentionRow(tokenCount, focusIdx) {
  const raw = Array.from({ length: tokenCount }, (_, i) => {
    const distance = Math.abs(i - focusIdx);
    return Math.max(0.05, 0.5 - distance * 0.12) + seededRandom(focusIdx * 100 + i) * 0.1;
  });
  const sum = raw.reduce((a, b) => a + b, 0);
  return raw.map(v => Math.round((v / sum) * 100) / 100);
}

export function generateCustomSentenceData(text) {
  const wordParts = text.split(/(\s+|(?<=[^\s])[.,!?;:])/u).filter(Boolean);
  const rawTokens = [];
  for (const part of wordParts) {
    const trimmed = part.trim();
    if (trimmed) rawTokens.push(trimmed);
  }

  const tokens = rawTokens.map((t, i) => ({
    id: i,
    text: t,
    tokenId: 1000 + simpleHash(t) % 5000,
  }));

  const n = tokens.length;
  const embeddings = tokens.map(t => generateEmbedding(t.text));
  const positionalEncodings = tokens.map((_, i) => [
    Math.round(Math.sin(i) * 0.1 * 10) / 10,
    Math.round(Math.cos(i) * 0.1 * 10) / 10,
    Math.round(Math.sin(i * 0.5) * 0.1 * 10) / 10,
  ]);

  const headNames = [
    { name: "Head 1 (syntaxis)", description: "Let op grammaticale structuur." },
    { name: "Head 2 (semantiek)", description: "Let op semantische relaties." },
    { name: "Head 3 (positie)", description: "Let op positionele patronen." },
  ];

  const attentionHeads = headNames.map((h, hi) => ({
    name: h.name,
    description: h.description,
    weights: Array.from({ length: n }, (_, i) => generateAttentionRow(n, (i + hi) % n)),
  }));

  const updatedEmbeddings = embeddings.map(emb =>
    emb.map(v => Math.round((v + seededRandom(simpleHash(String(v))) * 0.2 - 0.1) * 100) / 100)
  );

  const predictionWords = ["en", "maar", "is", "zijn", "was", "de", "het", "een", "niet", "ook"];
  const predRaw = predictionWords.slice(0, 5).map((w, i) => ({
    token: w,
    raw: seededRandom(simpleHash(text) + i * 77),
  }));
  predRaw.sort((a, b) => b.raw - a.raw);
  const predSum = predRaw.reduce((s, p) => s + p.raw, 0);
  const predictions = predRaw.map(p => ({
    token: p.token,
    probability: Math.round((p.raw / predSum) * 100) / 100,
  }));

  return {
    id: 'custom',
    text,
    tokens,
    embeddings,
    positionalEncodings,
    attentionHeads,
    updatedEmbeddings,
    predictions,
  };
}
