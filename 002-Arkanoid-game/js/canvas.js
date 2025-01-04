import { canvas, ballRadius, sprites, bricks } from "./ballVariables.js";
let ctx = canvas.getContext('2d');



//pelota VAriables
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 4;
let dy = -4;

//plataform vaRIABLES
const plataformHeight = 10;
const plataformWidth = 50;
let plataformX = (canvas.width - plataformWidth) / 2;
let plataformY = canvas.height - plataformHeight - 10;
let RightPressed = false;
let LeftPressed = false;

//ladrillos variables

const brickRowCount = 6;
const brickColumnCount = 13;
const brickWidth = 30;
const brickHeight = 14;
const brickPadding = 2;
const brickOffsetTop = 80;
const brickOffsetLeft = 43;
let ladrillos = [];
const BRICKS_STATUS = {
  VISIBLE: 1,
  HIT: 0,
}

for (let c = 0; c < brickColumnCount; c++) {
  ladrillos[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
    const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;

    const random = Math.floor(Math.random() * 8); //indices de los ladrillos (oimagenes)

    //guardar datos
    ladrillos[c][r] = { x: brickX, y: brickY, status: BRICKS_STATUS.VISIBLE, spriteIndex: random };
  }


}



//drawings
function drawBall() {
  //dibujar la pelotita, necesitamso decirle que empiece a dibujar, que es un circulo, que color, y que lo rellene;
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#111';
  ctx.fill();
  //termiando eso le decimos que deje de dibujar la pelota (ayuda con el rendimiento)
  ctx.closePath();
}
// draw plataform
function drawPlataform() {

  ctx.drawImage(sprites, //imagen
    29, //sector X del corte
    174,  //sector Y del corte
    plataformWidth, //ancho del corte
    plataformHeight, //alto del corte
    plataformX, //posicion X en el canvas
    plataformY, //posicion Y en el canvas
    plataformWidth, //ancho en el canvas
    plataformHeight //alto en el canvas
  );

}
//draw bricks
function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const currentBlock = ladrillos[c][r];
      if (currentBlock.status === BRICKS_STATUS.HIT) continue;
      ctx.fillStyle = 'white';
      ctx.fill()
      const clipX = currentBlock.spriteIndex * 32;
      ctx.drawImage(
        bricks,
        clipX,
        0,
        31,
        14,
        currentBlock.x,
        currentBlock.y,
        brickWidth,
        brickHeight
      )
    }
  }
}
//player movement
function initEvents() {
  document.addEventListener('keydown', KeydownHandler)
  document.addEventListener('keyup', KeyupHandler)


  function KeydownHandler(event) {
    const { key } = event;

    if (key === 'Right' || key === 'ArrowRight') {
      RightPressed = true;
    }
    else if (key === 'Left' || key === 'ArrowLeft') {
      LeftPressed = true;
    }
  }

  function KeyupHandler(event) {
    const { key } = event;

    if (key === 'Right' || key === 'ArrowRight') {
      RightPressed = false;
    }
    else if (key === 'Left' || key === 'ArrowLeft') {
      LeftPressed = false;
    }
  }
}

//colisiones y movimientos
function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const currentBlock = ladrillos[c][r];
      if (currentBlock.status === BRICKS_STATUS.HIT) continue;

      const isBallSameXToBrick = x > currentBlock.x && x < currentBlock.x + brickWidth;
      const isBallSameYToBrick = y > currentBlock.y && y < currentBlock.y + brickHeight;


      if (isBallSameXToBrick && isBallSameYToBrick) {
        dy = -dy;
        currentBlock.status = BRICKS_STATUS.HIT;
      }
    }
  }
}

function ballMovement() {
  //la pelota toca la plataforma?
  const isballsameXToPlataform = x > plataformX && x < plataformX + plataformWidth;
  const isballSameYToPlataform = y > plataformY - 3;
  if (isballsameXToPlataform && isballSameYToPlataform) {
    dy = -dy;
  }
  //cambiar la posicion de la pelota en cada colision de pared 
  if (x + dx > canvas.width - ballRadius || //pared derecha
    x < ballRadius//pared izquierda
  ) {
    dx = -dx;
  }
  if (y + dy < ballRadius) {//pared de arriba
    dy = -dy;
  }
  else if (y + dy > canvas.height - ballRadius ) {//pared de abajo
    x = 0;
    y = 0;
    document.location.reload();
  }
  x += dx;
  y += dy
}
function plataformMovement() {
  if (RightPressed && plataformX < canvas.width - plataformWidth) {
    plataformX += 7;
  } else if (LeftPressed && plataformX > 0) {
    plataformX -= 7;
  }
}
//clean canvas
function cleanCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

//--------------------------------------------------------------DRAW GAME-----------------------------------------------
function draw() {
  //funcion para limpiar el canvas en cada frame (desde la posision x0,y0 hasta el ancho y alto del canvas)
  cleanCanvas();

  //window.requestAnimationFrame(draw); base de cualqueir juego, ya que esta ejecutandose constantemente por frame para estar actualizadose y dibujar
  //hay que pensarlo que es ocmo un loop pero no es loop propiamente dicho

  //que es lo primero que hay que pensar? que es lo que quiero dibujar!! (depende del juego en este caso):
  //la pelotita ⚾, Ladrillos 🧱 y nuestra plataforma 🛹
  drawBall();
  drawBricks();
  drawPlataform();

  //que es lo segundo para pensar? que es lo que quiero que haga? (depende del juego en este caso):
  //Colisiones y movimientos 🤸‍♂️
  collisionDetection();
  ballMovement()
  plataformMovement();


  window.requestAnimationFrame(draw);
}
draw();
initEvents();

