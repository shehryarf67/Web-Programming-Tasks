let gameArea = document.getElementById("gameArea");
let bow = document.getElementById("bow");
let arrow = document.getElementById("arrow");
let target = document.getElementById("target");

let scoreSpan = document.getElementById("score");
let timeSpan = document.getElementById("time");
let message = document.getElementById("message");

let startBtn = document.getElementById("startBtn");
let resetBtn = document.getElementById("resetBtn");

let score = 0;
let timeLeft = 30;

let gameRunning = false;

let arrowFlying = false;
let arrowX = 110;
let arrowY = 190;

let targetY = 140;
let targetDir = 1;

let moveLoop = null;
let timerLoop = null;

function clamp(v, min, max){
  if (v < min) return min;
  if (v > max) return max;
  return v;
}

function resetArrow(){
  arrowFlying = false;
  arrowX = 110;

  let bowTop = parseInt(bow.style.top) || 140;
  arrowY = bowTop + 50;

  arrow.style.left = arrowX + "px";
  arrow.style.top = arrowY + "px";
}

function placeTargetRandom(){
  targetY = 30 + Math.floor(Math.random() * 250);
  target.style.top = targetY + "px";
}

function startGame(){
  score = 0;
  timeLeft = 30;

  scoreSpan.textContent = score;
  timeSpan.textContent = timeLeft;

  message.textContent = "Game running";
  gameRunning = true;

  resetArrow();
  placeTargetRandom();

  if (moveLoop) clearInterval(moveLoop);
  if (timerLoop) clearInterval(timerLoop);

  moveLoop = setInterval(gameTick, 20);

  timerLoop = setInterval(function(){
    if (!gameRunning) return;

    timeLeft = timeLeft - 1;
    timeSpan.textContent = timeLeft;

    if (timeLeft <= 0){
      endGame();
    }
  }, 1000);
}

function endGame(){
  gameRunning = false;
  message.textContent = "Game over";

  if (moveLoop) clearInterval(moveLoop);
  if (timerLoop) clearInterval(timerLoop);

  arrowFlying = false;
}

function resetGame(){
  gameRunning = false;

  if (moveLoop) clearInterval(moveLoop);
  if (timerLoop) clearInterval(timerLoop);

  score = 0;
  timeLeft = 30;

  scoreSpan.textContent = score;
  timeSpan.textContent = timeLeft;

  bow.style.top = "140px";
  message.textContent = "Press Start";

  target.style.top = "140px";
  resetArrow();
}

function shoot(){
  if (!gameRunning) return;
  if (arrowFlying) return;

  arrowFlying = true;
}

function rectanglesOverlap(r1, r2){
  if (r1.right < r2.left) return false;
  if (r1.left > r2.right) return false;
  if (r1.bottom < r2.top) return false;
  if (r1.top > r2.bottom) return false;
  return true;
}

function gameTick(){
  if (!gameRunning) return;

  targetY = targetY + (targetDir * 3);

  if (targetY <= 20) targetDir = 1;
  if (targetY >= 300) targetDir = -1;

  target.style.top = targetY + "px";

  if (arrowFlying){
    arrowX = arrowX + 12; 
    arrow.style.left = arrowX + "px";

    let a = arrow.getBoundingClientRect();
    let t = target.getBoundingClientRect();

    if (rectanglesOverlap(a, t)){
      score = score + 1;
      scoreSpan.textContent = score;

      message.textContent = "Hit!";
      setTimeout(function(){
        if (gameRunning) message.textContent = "Game running";
      }, 200);

      resetArrow();
      placeTargetRandom();
    }

    if (arrowX > 820){
      resetArrow();
    }
  }
}

gameArea.addEventListener("mousemove", function(e){
  if (!gameRunning) return;

  let rect = gameArea.getBoundingClientRect();
  let y = e.clientY - rect.top;

  let newTop = y - 80;
  newTop = clamp(newTop, 10, 250);

  bow.style.top = newTop + "px";

  if (!arrowFlying){
    resetArrow();
  }
});

gameArea.addEventListener("click", function(){
  shoot();
});

window.addEventListener("keydown", function(e){
  if (e.key === " "){
    e.preventDefault();
    shoot();
  }
});

startBtn.addEventListener("click", startGame);
resetBtn.addEventListener("click", resetGame);

resetGame();
