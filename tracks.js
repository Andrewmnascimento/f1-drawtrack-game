// =============================================================
// tracks.js — Gabaritos das pistas de F1
// =============================================================
// Este arquivo contém os dados das pistas que o jogador tenta replicar.
// Cada pista é um objeto com metadados e um array de pontos {x, y}.
//
// Os pontos estão em coordenadas normalizadas (0 a 100),
// não em pixels. O sistema de renderização converte para pixels
// na hora de desenhar, dependendo do tamanho do canvas.
//
// Por enquanto, Monaco tem apenas pontos de placeholder.
// Vamos digitalizar os gabaritos reais nas próximas fases!
// =============================================================

const TRACKS = [
    {
        id: "monaco",
        name: "Monaco",
        country: "🇲🇨 Mônaco",
        difficulty: "hard",
        date: "2025-05-25",     // Fim de semana do GP
        description: "O circuito urbano mais famoso da F1",

        // Pontos do traçado em escala 0-100
        // TODO (Fase 4): Substituir por pontos reais digitalizados
        points: [
            // Placeholder: apenas um quadrado para testar o sistema
            { x: 20, y: 20 },
            { x: 80, y: 20 },
            { x: 80, y: 80 },
            { x: 20, y: 80 }
        ]
    }

    // Próximas pistas (Fase 4):
    // { id: "monza", name: "Monza", ... },
    // { id: "suzuka", name: "Suzuka", ... },
    // { id: "spa", name: "Spa-Francorchamps", ... },
    // { id: "interlagos", name: "Interlagos", ... },
];

// Exporta a lista para uso em script.js
// (Como não usamos módulos ES6 por simplicidade, TRACKS é global)
