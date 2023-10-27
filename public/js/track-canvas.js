export class TrackingCanvas {
  constructor(width, height, id, options) {
    const {zIndex, classList} = options;
    this.width = width;
    this.height = height;
    this.id = id;
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.canvas.id = this.id;
    this.canvas.style.zIndex = zIndex || 0;
    this.canvas.classList.add('secondary-canvas');
    Array.from(classList).forEach(element => {
      this.canvas.classList.add(element);
    });
  }

  render(container){
    container.appendChild(this.canvas);
  }

  //scrivi le funzioni setter e getter per width e height
  setWidth(width){
    this.width = width;
    //modifica anche la larghezza del canvas
    this.canvas.width = this.width;
  }

  setHeight(height){
    this.height = height;
    //modifica anche l'altezza del canvas
    this.canvas.height = this.height;
  }

  getWidth(){
    return this.width;
  }

  getHeight(){
    return this.height;
  }

  //funzione draw che disegna dei punti sulla canvas come pallini di colore variabile passato come stringa alla funzione
  drawPath(points, options){
    var {color, lineColor, radius} = options;
    //radius == undefined ? 2 : radius;

    var ctx = this.canvas.getContext('2d');
    ctx.fillStyle = color;
    //outlineColor == undefined ? color  : outlineColor;
    ctx.strokeStyle = lineColor;
    if(points.length == 1){
      return;
    }

    for (let i = 1; i < points.length; i++) {
      const point = points[i-1];
      this.drawLine(points[i-1], points[i], options);
      ctx.beginPath();
      ctx.arc(point.x, point.y, radius, 0, 2 * Math.PI);
      ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(points[points.length-1].x, points[points.length-1].y, radius, 0, 2 * Math.PI);
    ctx.fill();

  }
  //draw points given an array of points (x, y)
  //options:{color, radius}
  drawPoints(points, options){
    var {color, radius} = options;
    //radius == undefined ? 2 : radius;

    var ctx = this.canvas.getContext('2d');
    ctx.fillStyle = color;
    //outlineColor == undefined ? color  : outlineColor;
    if(points.length == 1){
      const point = points[0];
      ctx.beginPath();
      ctx.arc(point.x, point.y, radius, 0, 2 * Math.PI);
      ctx.fill();
      return;
    }

    for (let i = 1; i < points.length; i++) {
      const point = points[i-1];
      ctx.beginPath();
      ctx.arc(point.x, point.y, radius, 0, 2 * Math.PI);
      ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(points[points.length-1].x, points[points.length-1].y, radius, 0, 2 * Math.PI);
    ctx.fill();
  }
  //draw lines given an array of points (x, y), one line for each couple of points
  drawLines(points, options){
    var {lineColor, lineWidth} = options;
    //radius == undefined ? 2 : radius;

    var ctx = this.canvas.getContext('2d');
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;
    if(points.length == 1){
      return;
    }

    for (let i = 1; i < points.length; i++) {
      this.drawLine(points[i-1], points[i], options);
    }
  }

  //draw a line given two points (x, y), called by drawLines and called for incremental drawing
  drawLine(point1, point2, options){
    const {lineColor, lineWidth} = options;

    var ctx = this.canvas.getContext('2d');
    ctx.beginPath();

    ctx.moveTo(point1.x, point1.y);
    ctx.lineTo(point2.x, point2.y);
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }
}

