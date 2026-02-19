// =============================================================
// script.js — Lógica principal do F1 Track Draw
// =============================================================
// FASE 1: Setup básico
//   - Conectar ao canvas
//   - Confirmar que tudo carregou
//   - Desenhar algo simples para testar
//
// O código está propositalmente simples agora.
// Vamos adicionar complexidade fase a fase.
// =============================================================


// -------------------------------------------------------------
// 1. AGUARDAR O DOM CARREGAR
// -------------------------------------------------------------
// O evento 'DOMContentLoaded' dispara quando o HTML foi totalmente
// lido e processado. Isso garante que o <canvas> já existe quando
// tentamos acessá-lo com getElementById.
//
// Sem isso, se o script estiver no <head>, getElementById retorna null!
// (Como colocamos o script no final do <body>, isso não seria estritamente
// necessário aqui, mas é uma boa prática manter.)
// -------------------------------------------------------------

document.addEventListener('DOMContentLoaded', function() {

    // ----------------------------------------------------------
    // 2. PEGAR REFERÊNCIAS DOS ELEMENTOS DA PÁGINA
    // ----------------------------------------------------------
    // Guardamos referências em variáveis para não precisar
    // chamar getElementById toda vez (é mais rápido e limpo).
    // ----------------------------------------------------------

    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d'); // Contexto 2D — onde os métodos de desenho vivem

    const trackNameEl = document.getElementById('track-name');
    const currentStateEl = document.getElementById('current-state');
    const btnClear = document.getElementById('btn-clear');

    // ----------------------------------------------------------
    // 3. VERIFICAÇÃO DE SANIDADE (debugging)
    // ----------------------------------------------------------
    // console.log é seu melhor amigo durante o desenvolvimento.
    // Abra o DevTools (F12) → aba Console para ver essas mensagens.
    // ----------------------------------------------------------

    console.log('✅ Canvas encontrado:', canvas);
    console.log('✅ Contexto 2D:', ctx);
    console.log('✅ Pistas carregadas:', TRACKS.length, 'pistas');
    console.log('✅ Canvas size:', canvas.width, 'x', canvas.height);


    // ----------------------------------------------------------
    // 4. PISTA ATUAL
    // ----------------------------------------------------------
    // Por enquanto, sempre usamos a primeira pista.
    // Nas próximas fases: sistema de "pista do dia".
    // ----------------------------------------------------------

    const currentTrack = TRACKS[0];
    trackNameEl.textContent = currentTrack.name;

    console.log('🏁 Pista atual:', currentTrack.name);


    // ----------------------------------------------------------
    // 5. TESTE DE DESENHO NO CANVAS
    // ----------------------------------------------------------
    // Vamos desenhar algo simples para confirmar que o canvas
    // está funcionando antes de implementar a lógica real.
    //
    // CONCEITO: O canvas usa um sistema de coordenadas onde
    // (0,0) é o canto SUPERIOR ESQUERDO.
    //   → X aumenta para a DIREITA
    //   → Y aumenta para BAIXO (diferente da matemática!)
    // ----------------------------------------------------------

    function drawTestContent() {
        // Limpa o canvas (boa prática sempre limpar antes de desenhar)
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // --- Texto de boas-vindas ---
        ctx.fillStyle = '#444';      // Cor de preenchimento
        ctx.font = '18px Segoe UI'; // Fonte e tamanho
        ctx.textAlign = 'center';   // Alinhamento horizontal
        ctx.fillText(
            'Clique e arraste para desenhar a pista!',
            canvas.width / 2,        // X: centro horizontal
            canvas.height / 2 - 10  // Y: um pouco acima do centro
        );

        ctx.font = '14px Segoe UI';
        ctx.fillStyle = '#333';
        ctx.fillText(
            'Fase 1: Setup ✓ | Fase 2: Captura de pontos em breve...',
            canvas.width / 2,
            canvas.height / 2 + 20
        );

        // --- Ponto central como referência visual ---
        ctx.beginPath();
        ctx.arc(
            canvas.width / 2,   // X do centro do círculo
            canvas.height / 2,  // Y do centro
            4,                  // raio em pixels
            0,                  // ângulo inicial (0 = direita)
            Math.PI * 2         // ângulo final (2π = volta completa)
        );
        ctx.fillStyle = '#e10600';
        ctx.fill();
    }

    // Chama a função de teste imediatamente
    drawTestContent();

    // ----------------------------------------------------------
    // 6. BOTÃO "NOVA TENTATIVA"
    // ----------------------------------------------------------
    // Por enquanto, apenas limpa o canvas e redesenha o conteúdo inicial.
    // Nas próximas fases, vai limpar o desenho do jogador.
    // ----------------------------------------------------------

    btnClear.addEventListener('click', function() {
        console.log('🔄 Nova tentativa!');
        drawTestContent();
        currentStateEl.textContent = 'READY';
    });


    // ----------------------------------------------------------
    // 7. PRÓXIMO PASSO: EVENTOS DE MOUSE (Fase 2)
    // ----------------------------------------------------------
    // Aqui vão entrar os listeners para:
    //   canvas.addEventListener('mousedown', ...)
    //   canvas.addEventListener('mousemove', ...)
    //   canvas.addEventListener('mouseup', ...)
    //
    // Por enquanto, apenas logamos para mostrar que os eventos existem.
    // ----------------------------------------------------------

    canvas.addEventListener('mousedown', function(event) {
        // event.offsetX e event.offsetY dão a posição do mouse
        // RELATIVA ao canvas (não à página inteira — muito útil!)
        console.log('🖱️ Mouse pressionado em:', event.offsetX, event.offsetY);
        currentStateEl.textContent = 'DRAWING';
    });

    canvas.addEventListener('mouseup', function(event) {
        console.log('🖱️ Mouse solto em:', event.offsetX, event.offsetY);
    });

    // ----------------------------------------------------------
    // 8. FIM DO DOMContentLoaded
    // ----------------------------------------------------------
    console.log('🏎️ F1 Track Draw inicializado com sucesso!');

}); // Fecha o DOMContentLoaded
