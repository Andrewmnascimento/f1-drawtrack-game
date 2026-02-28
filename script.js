document.addEventListener('DOMContentLoaded', function() {

    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d'); // Contexto 2D — onde os métodos de desenho vivem

    const trackNameEl = document.getElementById('track-name');
    const currentStateEl = document.getElementById('current-state');
    const btnClear = document.getElementById('btn-clear');

    const CLOSE_LOOP_THRESHOLD = 20;
    const currentTrack = TRACKS[0];
    trackNameEl.textContent = currentTrack.name;

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
    btnClear.addEventListener('click', function() {
        console.log('🔄 Nova tentativa!');
        drawTestContent();
        currentStateEl.textContent = 'READY';
    });


    // Criando a variavel isDrawing
    let isDrawing = false;
    let playerPoints = [];

    function clearCanvas(){
        ctx.clearRect(0,0, canvas.width, canvas.height);
    };

    function render(){
        clearCanvas();
        // desenhando o ponto central
        if(currentStateEl.textContent !== "COMPLETE"){
            ctx.beginPath();
            ctx.arc(canvas.width / 2, canvas.height / 2, 5, 0, 2 * Math.PI);
            ctx.fillStyle = '#DB2525';
            ctx.fill();
        };
        // desenhando a linha na tela
        ctx.beginPath();
        if(playerPoints.length > 0){
            ctx.moveTo(playerPoints[0].x, playerPoints[0].y);
            for(let position = 1, points_length = playerPoints.length; position < points_length; position++){
                ctx.lineTo(playerPoints[position].x, playerPoints[position].y);
            };
            // estilizando o stroke
            ctx.strokeStyle = '#DB2525';
            ctx.lineWidth = 3;
        };
        ctx.stroke();
    };

    function renderCursor(mousePosition){
        // desenhando o cursor do mouse
        if (mousePosition){
            ctx.beginPath();
            ctx.strokeStyle = '#DB2525';
            ctx.arc(mousePosition.x, mousePosition.y, 4, 0, 2 * Math.PI);
            ctx.stroke();
        };
    };

    function distance(x1, y1, x2, y2){
        const xLeg = x2 - x1;
        const yLeg = y2 - y1;
        return Math.sqrt((xLeg ** 2) + (yLeg ** 2));
    }

    canvas.addEventListener('mousedown', function(event) {
        // event.offsetX e event.offsetY dão a posição do mouse
        // RELATIVA ao canvas (não à página inteira — muito útil!)
        isDrawing = true;
        playerPoints = [];
        currentStateEl.textContent = 'DRAWING';
    });

    canvas.addEventListener('mouseup', function(event) {
        isDrawing = false;
        if (currentStateEl.textContent !== "COMPLETE"){
            currentStateEl.textContent = 'READY';
        };
    });

    canvas.addEventListener('mousemove', function(event){
        clearCanvas();
        render();
        renderCursor({x: event.offsetX, y: event.offsetY});

        if(isDrawing){
            playerPoints.push({x: event.offsetX, y: event.offsetY});
            render();
            renderCursor({x: event.offsetX, y: event.offsetY});
            if(playerPoints.length > 100){
                if(distance(playerPoints[0].x, playerPoints[0].y, event.offsetX, event.offsetY) <= CLOSE_LOOP_THRESHOLD){
                    playerPoints.push(playerPoints[0]);
                    isDrawing = false;
                    currentStateEl.textContent = "COMPLETE";
                    render();
                };
            };
        };
    });

}); 
