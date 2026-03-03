document.addEventListener('DOMContentLoaded', function() {

    // creating the canvas and the context
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');

    // getting the elements from the DOM
    const trackNameEl = document.getElementById('track-name');
    const currentStateEl = document.getElementById('current-state');
    const btnShowTemplate = document.getElementById('btn-show-template');
    const btnClear = document.getElementById('btn-clear');
    const scoreDisplayEl = document.getElementById('score-display');
    const scoreValueEl = document.getElementById('score-value');
    const scoreFeedbackEl = document.getElementById('score-feedback');

    // Constants
    const CLOSE_LOOP_THRESHOLD = 20; // distance in pixels to consider the loop closed
    const SCORE_FACTOR = 7.5;  // factor to convert average distance to score (adjust for difficulty)
    const CANVAS_RESIZE_FACTOR = 1.454545;// factor to resize the canvas to fit the track points (based on the original track dimensions)
    
    let date = new Date();
    const startOfYear = new Date(date.getFullYear(), 0, 0);
    const diff = date - startOfYear;
    const day = Math.floor(diff / (1000 * 60 * 60 * 24)); // get the current day of the year
    let index = day % TRACKS.length; // select the track based on the current day
    const currentTrack = TRACKS[index]; // select the track
    
    // display the track name
    trackNameEl.textContent = currentTrack.name;  

    // create the isDrawing flag and the playerPoints array to store the points of the player's drawing
    let isDrawing = false;
    let playerPoints = [];

    // define a function to clear the canvas
    function clearCanvas(){
        ctx.clearRect(0,0, canvas.width, canvas.height);
    };

    // define a function to render the player's drawing and the central point
    function render(playerPoints = [], type){
        clearCanvas();
        let adjustedPoints = [];
        if (type === "track"){
            adjustedPoints = playerPoints.map(p => ({
            x: p.x * (canvas.width / 100),
            y: p.y * (canvas.height / 100)
            }));
        } else {
            adjustedPoints = playerPoints;
        };
        // drawing the central point as a reference for the player
        if(currentStateEl.textContent !== "COMPLETE"){
            ctx.beginPath();
            ctx.arc(canvas.width / 2, canvas.height / 2, 5, 0, 2 * Math.PI);
            ctx.fillStyle = '#DB2525';
            ctx.fill();
        };
        // drawing the track points
        ctx.beginPath();
        if(playerPoints.length > 0){
            ctx.moveTo(adjustedPoints[0].x, adjustedPoints[0].y);
            for(let position = 1, points_length = adjustedPoints.length; position < points_length; position++){
                ctx.lineTo(adjustedPoints[position].x, adjustedPoints[position].y);
            };
            // stylizing the stroke
            ctx.strokeStyle = '#DB2525';
            ctx.lineWidth = 3;
        };
        ctx.stroke();
    };
    // define a function to render the cursor of the mouse
    function renderCursor(mousePosition){
        // desenhando o cursor do mouse
        if (mousePosition){
            ctx.beginPath();
            ctx.strokeStyle = '#DB2525';
            ctx.arc(mousePosition.x, mousePosition.y, 4, 0, 2 * Math.PI);
            ctx.stroke();
        };
    };
    // define a function to calculate the distance between two points
    function distance(x1, y1, x2, y2){
        const xLeg = x2 - x1;
        const yLeg = y2 - y1;
        return Math.sqrt((xLeg ** 2) + (yLeg ** 2));
    }
    // define a function to get the bounding box of a set of points
    function getBoundingBox(points){
        const minX = Math.min(...points.map(p => p.x));
        const maxX = Math.max(...points.map(p => p.x));
        const minY = Math.min(...points.map(p => p.y));
        const maxY = Math.max(...points.map(p => p.y));
        return {minX, maxX, minY, maxY};
    };
    // define a function to normalize the points to a 0-100 scale based on the bounding box of the points
    function normalizePoints(points){
        const {minX, maxX, minY, maxY} = getBoundingBox(points);
        const width = maxX - minX;
        const height = maxY - minY;
        if (height > 0){
            return points.map(p => ({
            x: ((p.x - minX) / width) * 100,
            y: ((p.y - minY) / height) * 100
            }));
        } else {
            return points.map(p => ({
                x: ((p.x - minX) / width) * 100,
                y: 0
            }))
        };
    };
    // define a function to calculate the score based on the player's points and the track's points using 
    // the average distance from each track point to the closest player point, normalized to a score between 0 and 100
    function calculateScore(playerPoints, trackPoints){
        const normalizedPlayer = normalizePoints(playerPoints);
        const normalizedTrack = normalizePoints(trackPoints);
        let totalDistance = 0;
        for (let i = 0; i < normalizedTrack.length; i++){
            const trackPoint = normalizedTrack[i];
            const closestPlayerPoint = normalizedPlayer.reduce((closest, playerPoint) => {
                const dist = distance(trackPoint.x, trackPoint.y, playerPoint.x, playerPoint.y);
                return dist < closest.distance ? {point: playerPoint, distance: dist} : closest;
            }, {point: null, distance: Infinity});
            totalDistance += closestPlayerPoint.distance;
        };
        const averageDistance = totalDistance / normalizedTrack.length;
        return Math.max(0, 100 - averageDistance * SCORE_FACTOR); // Score entre 0 e 100
    };

    function resizeCanvas(){
        const clientWidth = canvas.parentElement.clientWidth;
        let newHeight = clientWidth / CANVAS_RESIZE_FACTOR;
        if (newHeight > window.innerHeight * 0.8){
            newHeight = window.innerHeight * 0.8;
            canvas.width = newHeight * CANVAS_RESIZE_FACTOR;
            canvas.height = newHeight;
        } else {
            canvas.width = clientWidth;
            canvas.height = newHeight;
        }
    };
    canvas.addEventListener('pointerdown', function(event) {
        // start drawing and reset the playerPoints array
        isDrawing = true;
        playerPoints = [];
        currentStateEl.textContent = 'DRAWING';
    });

    canvas.addEventListener('pointerup', function(event) {
        // finish drawing
        isDrawing = false;
        if (currentStateEl.textContent === 'DRAWING'){
            currentStateEl.textContent = 'READY';
        };
    });

    canvas.addEventListener('pointermove', function(event){
        event.preventDefault();
        // geting the relative mouse position on the canvas by considering the canvas's bounding box and the scale of the canvas
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = (event.clientX - rect.left) * scaleX;
        const y = (event.clientY - rect.top) * scaleY;
        // clear the canvas and render the player's drawing and the cursor at the current mouse position
        clearCanvas();
        render(playerPoints, "player");
        renderCursor({x: x, y: y});

        // if the player is drawing, add the current mouse position to the playerPoints array and check if the loop is closed
        if(isDrawing){
            playerPoints.push({x: x, y: y});
            render(playerPoints, "player");
            renderCursor({x: x, y: y});
            // check if the loop is closed by comparing the distance from the current mouse position to the first point in the playerPoints array
            if(playerPoints.length > 100){
                if(distance(playerPoints[0].x, playerPoints[0].y, x, y) <= CLOSE_LOOP_THRESHOLD){
                    playerPoints.push(playerPoints[0]);
                    isDrawing = false;
                    // calculate the score and display the feedback
                    currentStateEl.textContent = "REVIEW";
                    const score = calculateScore(playerPoints, currentTrack.points);
                    scoreDisplayEl.classList.remove('hidden');
                    scoreValueEl.textContent = `${score.toFixed(2)}`;
                    scoreFeedbackEl.textContent = score >= 90 ? "Excelente! Você capturou a essência da pista!" :
                        score >= 80 ? "Muito Bom! Você tem um bom senso de direção." :
                        score >= 70 ? "Bom trabalho! Com um pouco mais de prática, você pode chegar lá." :
                        score >= 60 ? "Regular. Tente focar mais nos detalhes da pista." :
                        "Parece que você se perdeu na curva! Tente novamente.";
                    currentStateEl.textContent = "COMPLETE";
                    btnShowTemplate.disabled = false;
                    render(playerPoints, "player");

                };
            };
        };
    }, { passive: false });

    // add an event listener to the clear button to reset the game state and clear the canvas
    btnClear.addEventListener('click', function() {
        clearCanvas();
        playerPoints = [];
        scoreDisplayEl.classList.add('hidden');
        currentStateEl.textContent = 'READY';
        btnShowTemplate.disabled = true;
    });
    // add an event listener to the show template button to render the track points on the canvas
    btnShowTemplate.addEventListener('click', function() {
        if (currentTrack.points.length === 0) {
            console.error("No track points available.");
            return;
        }
        const normalizedPoints = normalizePoints(currentTrack.points);
        render(normalizedPoints, "track");
    });

    // add an event listener to the window resize event to resize the canvas
    window.addEventListener('resize', resizeCanvas);
    // initial resize of the canvas
    resizeCanvas();
});
