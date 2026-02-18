/*
This JavaScript file controls all the functionality of the photo editor. 
It loads an image chosen by the user and draws it on a canvas, then applies filters 
like brightness, saturation, inversion, grayscale, sepia, blur, and rotation using 
the slider and buttons. It also supports flipping the image horizontally and vertically. 
The code keeps a history of changes so the user can undo, redo, or click any past state 
from the history panel. It also follows the roll number rule by snapping the final filter 
values to a step of 2 or 3, and it allows saving the edited image by downloading it.
*/

const lastTwoDigits = 4; // Last 2 digits are 04, hence we keep it 4
const STEP = (lastTwoDigits % 2 === 0) ? 2 : 3;

const MAX_DISPLAY_W = 700;
const MAX_DISPLAY_H = 450;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const fileInput = document.getElementById("fileInput");
const chooseBtn = document.getElementById("chooseBtn");
const saveBtn = document.getElementById("saveBtn");
const resetBtn = document.getElementById("resetBtn");

const undoBtn = document.getElementById("undoBtn");
const redoBtn = document.getElementById("redoBtn");

const filterNameEl = document.getElementById("filterName");
const filterValueEl = document.getElementById("filterValue");
const filterSlider = document.getElementById("filterSlider");
const hintText = document.getElementById("hintText");

const rotLeft = document.getElementById("rotLeft");
const rotRight = document.getElementById("rotRight");
const flipH = document.getElementById("flipH");
const flipV = document.getElementById("flipV");

const historyPanel = document.getElementById("historyPanel");
const filterButtons = document.querySelectorAll(".fbtn");

let img = new Image();
let imageLoaded = false;

let displayW = 0;
let displayH = 0;

let settings = {
  brightness: 100,
  saturation: 100, 
  inversion: 0, 
  grayscale: 0, 
  sepia: 0, 
  blur: 0,
  rotate: 0, 
  flipX: 1,
  flipY: 1
};

let activeFilter = "brightness";

let states = [];
let currentIndex = -1;

function copySettings(obj){
  return JSON.parse(JSON.stringify(obj));
}

function applyStepRule(value){
  return Math.round(value / STEP) * STEP;
}

function updateDisplaySize(){
  const scale = Math.min(
    1,
    MAX_DISPLAY_W / img.width,
    MAX_DISPLAY_H / img.height
  );

  displayW = Math.floor(img.width * scale);
  displayH = Math.floor(img.height * scale);
}

function setSliderForFilter(filterName){
  activeFilter = filterName;

  filterButtons.forEach(btn => btn.classList.remove("active"));
  const activeBtn = document.querySelector(`.fbtn[data-filter="${filterName}"]`);
  if(activeBtn) activeBtn.classList.add("active");

  if(filterName === "brightness" || filterName === "saturation"){
    filterSlider.min = 0;
    filterSlider.max = 200;
    filterSlider.step = STEP;
    filterSlider.value = settings[filterName];
    filterValueEl.innerText = settings[filterName] + "%";
  }
  else if(filterName === "inversion" || filterName === "grayscale" || filterName === "sepia"){
    filterSlider.min = 0;
    filterSlider.max = 100;
    filterSlider.step = STEP;
    filterSlider.value = settings[filterName];
    filterValueEl.innerText = settings[filterName] + "%";
  }
  else if(filterName === "blur"){
    filterSlider.min = 0;
    filterSlider.max = 20;
    filterSlider.step = STEP;
    filterSlider.value = settings.blur;
    filterValueEl.innerText = settings.blur + "px";
  }
  else if(filterName === "rotate"){
    filterSlider.min = -180;
    filterSlider.max = 180;
    filterSlider.step = STEP;
    filterSlider.value = settings.rotate;
    filterValueEl.innerText = settings.rotate + "deg";
  }

  filterNameEl.innerText = filterName.charAt(0).toUpperCase() + filterName.slice(1);
}

function drawImage(){
  if(!imageLoaded) return;

  const w = displayW;
  const h = displayH;

  const angle = settings.rotate * Math.PI / 180;
  const sin = Math.abs(Math.sin(angle));
  const cos = Math.abs(Math.cos(angle));

  const newW = w * cos + h * sin;
  const newH = w * sin + h * cos;

  canvas.width = Math.floor(newW);
  canvas.height = Math.floor(newH);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.filter =
    `brightness(${settings.brightness}%) ` +
    `saturate(${settings.saturation}%) ` +
    `invert(${settings.inversion}%) ` +
    `grayscale(${settings.grayscale}%) ` +
    `sepia(${settings.sepia}%) ` +
    `blur(${settings.blur}px)`;

  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(angle);
  ctx.scale(settings.flipX, settings.flipY);

  ctx.drawImage(img, -w / 2, -h / 2, w, h);

  ctx.restore();
  hintText.style.display = "none";
}

function pushState(actionText){
  if(currentIndex < states.length - 1){
    states.splice(currentIndex + 1);
  }

  states.push({
    settingsCopy: copySettings(settings),
    actionText: actionText
  });

  currentIndex = states.length - 1;
  updateHistoryUI();
  updateUndoRedoButtons();
}

function applyState(index){
  if(index < 0 || index >= states.length) return;

  currentIndex = index;
  settings = copySettings(states[currentIndex].settingsCopy);

  setSliderForFilter(activeFilter);
  drawImage();
  updateHistoryUI();
  updateUndoRedoButtons();
}

function updateUndoRedoButtons(){
  undoBtn.disabled = (!imageLoaded || currentIndex <= 0);
  redoBtn.disabled = (!imageLoaded || currentIndex >= states.length - 1);
}

function updateHistoryUI(){
  historyPanel.innerHTML = "";

  for(let i = 0; i < states.length; i++){
    const btn = document.createElement("button");
    btn.className = "history-item";
    btn.innerText = (i + 1) + ". " + states[i].actionText;

    if(i === currentIndex){
      btn.classList.add("active");
    }

    btn.addEventListener("click", function(){
      applyState(i);
    });

    historyPanel.appendChild(btn);
  }
}

function resetAll(){
  settings = {
    brightness: 100,
    saturation: 100,
    inversion: 0,
    grayscale: 0,
    sepia: 0,
    blur: 0,
    rotate: 0,
    flipX: 1,
    flipY: 1
  };

  setSliderForFilter(activeFilter);
  drawImage();
  pushState("Reset Filters");
}

chooseBtn.addEventListener("click", function(){
  fileInput.click();
});

fileInput.addEventListener("change", function(){
  const file = fileInput.files[0];
  if(!file) return;

  const reader = new FileReader();
  reader.onload = function(){
    img = new Image();
    img.onload = function(){
      imageLoaded = true;
      saveBtn.disabled = false;
      updateDisplaySize();

      settings = {
        brightness: 100,
        saturation: 100,
        inversion: 0,
        grayscale: 0,
        sepia: 0,
        blur: 0,
        rotate: 0,
        flipX: 1,
        flipY: 1
      };

      states = [];
      currentIndex = -1;

      setSliderForFilter("brightness");
      drawImage();
      pushState("Original");
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
});

saveBtn.addEventListener("click", function(){
  if(!imageLoaded) return;

  const link = document.createElement("a");
  link.download = "edited-image.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});

filterButtons.forEach(btn => {
  btn.addEventListener("click", function(){
    const f = btn.getAttribute("data-filter");
    setSliderForFilter(f);
  });
});

filterSlider.addEventListener("input", function () {
  if (!imageLoaded) return;

  const val = Number(filterSlider.value);
  settings[activeFilter] = val;

  if (activeFilter === "blur") {
    filterValueEl.innerText = val + "px";
  } else if (activeFilter === "rotate") {
    filterValueEl.innerText = val + "deg";
  } else {
    filterValueEl.innerText = val + "%";
  }

  drawImage();
});

filterSlider.addEventListener("change", function () {
  if (!imageLoaded) return;

  let val = Number(filterSlider.value);
  val = applyStepRule(val); 
  filterSlider.value = val; 
  settings[activeFilter] = val;

  if (activeFilter === "blur") {
    filterValueEl.innerText = val + "px";
  } else if (activeFilter === "rotate") {
    filterValueEl.innerText = val + "deg";
  } else {
    filterValueEl.innerText = val + "%";
  }

  drawImage();

  let text = "";
  if (activeFilter === "blur") {
    text = "Blur: " + val + "px";
  } else if (activeFilter === "rotate") {
    text = "Rotate: " + val + "deg";
  } else {
    text = activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1) + ": " + val + "%";
  }

  pushState(text);
});

rotLeft.addEventListener("click", function(){
  if(!imageLoaded) return;

  settings.rotate = applyStepRule(settings.rotate - 90);
  drawImage();
  setSliderForFilter(activeFilter);
  pushState("Rotate Left: " + settings.rotate + "deg");
});

rotRight.addEventListener("click", function(){
  if(!imageLoaded) return;

  settings.rotate = applyStepRule(settings.rotate + 90);
  drawImage();
  setSliderForFilter(activeFilter);
  pushState("Rotate Right: " + settings.rotate + "deg");
});

flipH.addEventListener("click", function(){
  if(!imageLoaded) return;

  settings.flipX = settings.flipX * -1;
  drawImage();
  pushState("Flip Horizontal");
});

flipV.addEventListener("click", function(){
  if(!imageLoaded) return;

  settings.flipY = settings.flipY * -1;
  drawImage();
  pushState("Flip Vertical");
});

resetBtn.addEventListener("click", function(){
  if(!imageLoaded) return;
  resetAll();
});

undoBtn.addEventListener("click", function(){
  if(!imageLoaded) return;
  if(currentIndex > 0){
    applyState(currentIndex - 1);
  }
});

redoBtn.addEventListener("click", function(){
  if(!imageLoaded) return;
  if(currentIndex < states.length - 1){
    applyState(currentIndex + 1);
  }
});

setSliderForFilter("brightness");
updateUndoRedoButtons();