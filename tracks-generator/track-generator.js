document.addEventListener('DOMContentLoaded', () => {
  const trackInput = document.getElementById('track-input');
  const canvas = document.getElementById('tracks-canvas');
  const outputJson = document.getElementById('output-json');
  const ctx = canvas.getContext('2d');
  // Listen for file input changes
  trackInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if(file){
      const image = new Image();
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        const url = e.target.result;
        image.src = url;
        image.onload = () => { 
          canvas.width = image.width;
          canvas.height = image.height;
          ctx.drawImage(image, 0, 0);
        };
      };
      fileReader.readAsDataURL(file);
    };
  });

  function distance(x1, y1, x2, y2){
        const xLeg = x2 - x1;
        const yLeg = y2 - y1;
        return Math.sqrt((xLeg ** 2) + (yLeg ** 2));
  };

  let trackPoints = [];

  canvas.addEventListener('click', (event) => {
    trackPoints.push({ x: event.offsetX, y: event.offsetY });
    if(trackPoints.length >= 1){
      for(let i = 0; i < trackPoints.length; i++){
        ctx.beginPath();
        ctx.arc(trackPoints[i].x, trackPoints[i].y, 4, 0, 2 * Math.PI);
      };
      ctx.fillStyle = '#DB2525';
      ctx.fill();
    };
  });

  function createJSON(){
    const trackData = {
      points: trackPoints
    };
    outputJson.textContent = JSON.stringify(trackData, null, 2);
    };
  
  const generateBtn = document.getElementById('generate-btn');
  generateBtn.addEventListener('click', createJSON);
});