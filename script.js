'use strict';
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const colorPickInput = document.getElementById("color-pick-input");
const lineWidthInput = document.getElementById("line-width-input");
const clearBtn = document.getElementById("clear-btn");
const saveBtn = document.getElementById("save-btn");
const colorList = document.getElementById("color-list");
const toolsList = document.getElementById("tools-list");

const BOARD_WIDTH = canvas.width;
const BOARD_HEIGHT = canvas.height;

let lineWidth = lineWidthInput.value;
let currentColor = colorPickInput.value;
let isDrawing = false;

const colors = ['black', 'red', 'green', 'blue', 'orange', 'yellow', 'white', 'grey'];

const tools = {
  brush: 'brush',
  rectangle: 'rectangle',
  line: 'line',
  arrow: 'arrow',
  dashed: 'dashed arrow',
  wavy  : 'wavy arrow',
  number: 'number'
};

let currentTool = tools.brush;
let prevMouseX = 0;
let prevMouseY = 0;
let snapshot = null;

function drawArrow(fromX, fromY, toX, toY, dashed = false, wavy = false) {
  ctx.putImageData(snapshot, 0, 0);

  ctx.beginPath();
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = currentColor;

  if (dashed) {
    const dash = 5 + lineWidth * 2;
    ctx.setLineDash([dash, dash * 1.5]);
  } else {
    ctx.setLineDash([]);
  }

  let endX = toX;
  let endY = toY;

  if (wavy) {
    const amplitude = 10;
    const wavelength = 50;

    const dx = toX - fromX;
    const dy = toY - fromY;
    const distance = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx);

    let lastX = fromX;
    let lastY = fromY;

    const headLength = 15 + lineWidth * 2 ;

    for (let i = 0; i < distance - headLength; i++) {
      const x = fromX + Math.cos(angle) * i;
      const y = fromY + Math.sin(angle) * i +
        Math.sin(i / wavelength * Math.PI * 2) * amplitude;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);

      lastX = x;
      lastY = y;
    }

    endX = lastX;
    endY = lastY;
  } else {
    const angle = Math.atan2(toY - fromY, toX - fromX);
    const headLength = 5 + lineWidth * 2;

    const lineEndX = toX - headLength * Math.cos(angle);
    const lineEndY = toY - headLength * Math.sin(angle);

    ctx.moveTo(fromX, fromY);
    ctx.lineTo(lineEndX, lineEndY);
  }

  ctx.stroke();
  ctx.setLineDash([]);

  // \arrow end head
  const headLength = 5 + lineWidth * 2;
  const angle = Math.atan2(endY - fromY, endX - fromX);

  ctx.beginPath();
  ctx.moveTo(endX, endY);

  ctx.lineTo(
    endX - headLength * Math.cos(angle - Math.PI / 6),
    endY - headLength * Math.sin(angle - Math.PI / 6)
  );

  ctx.lineTo(
    endX - headLength * Math.cos(angle + Math.PI / 6),
    endY - headLength * Math.sin(angle + Math.PI / 6)
  );

  ctx.closePath();
  ctx.fillStyle = currentColor;
  ctx.fill();
}

function drawBrush(e) {
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
}

function drawRect(e) {
  ctx.putImageData(snapshot, 0, 0);
  const width = e.offsetX - prevMouseX;
  const height = e.offsetY - prevMouseY;
  ctx.strokeRect(prevMouseX, prevMouseY, width, height);
}

function drawLine(e) {
  ctx.putImageData(snapshot, 0, 0);
  ctx.beginPath();
  ctx.moveTo(prevMouseX, prevMouseY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
}

function draw(e) {
  if (!isDrawing) return;

  if (currentTool === tools.brush) {
    drawBrush(e);
  } 
  else if (currentTool === tools.rectangle) {
    drawRect(e);
  } 
  else if (currentTool === tools.line) {
    drawLine(e);
  } 
  else if (currentTool === tools.arrow) {
    drawArrow(prevMouseX, prevMouseY, e.offsetX, e.offsetY);
  } 
  else if (currentTool === tools.dashed) {
    drawArrow(prevMouseX, prevMouseY, e.offsetX, e.offsetY, true);
  } 
  else if (currentTool === tools.wavy) {
    drawArrow(prevMouseX, prevMouseY, e.offsetX, e.offsetY, false, true);
  }
  else if (currentTool === tools.number) {
    ctx.putImageData(snapshot, 0, 0);
    const number = prompt("enter the number:");
    if (number !== null) {
      ctx.font = "20px Arial";
      ctx.fillStyle = currentColor;
      ctx.fillText(number, e.offsetX, e.offsetY);
    }
    stopDrawing();
  }
}

function startDrawing(e) {
  isDrawing = true;

  prevMouseX = e.offsetX;
  prevMouseY = e.offsetY;

  ctx.strokeStyle = currentColor;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.moveTo(prevMouseX, prevMouseY);

  snapshot = ctx.getImageData(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
}

function stopDrawing() {
  isDrawing = false;
  ctx.closePath();
}

function clearBoard() {
  ctx.clearRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);

  const elements = field.querySelectorAll('div');
  elements.forEach(el => {
    if (!el.classList.contains('field'))
      el.remove();
  });
}

function changeColor(e) {
  currentColor = e.target.value;
}

function changeLineWidth(e) {
  lineWidth = e.target.value;
}

function saveDrawing() {

  const field = document.querySelector(".field");

  html2canvas(field, {
  useCORS: true,
  backgroundColor: null
}).then(canvas => {

    const image = canvas.toDataURL("image/png");

    const data = {
      image: image,
      comment: document.getElementById("coachComment").value,
      name: document.getElementById("trainingName").value,
      age: document.getElementById("trainingAge").value,
      type: document.getElementById("trainingType").value
    };

    fetch("save.php", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(res => res.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "training-plan.pdf";
      a.click();
    });

  });
}

function createElement(name, text = null, classes = [], listeners = []) {
  const element = document.createElement(name);

  if (text) element.textContent = text;
  if (classes.length) element.classList.add(...classes);

  listeners.forEach(listener => {
    element.addEventListener(listener.event, listener.handler);
  });

  return element;
}

function displayTools() {
  for (const tool in tools) {

    const listeners = [
      {
        event: 'click',
        handler: () => currentTool = tools[tool]
      }
    ];

    const li = createElement('li');

    const input = createElement('input', null, [], listeners);
    input.type = 'radio';
    input.name = 'tool';

    if (tool === 'brush') input.checked = true;

    const label = createElement('label', tool);

    li.append(label, input);
    toolsList.appendChild(li);
  }
}

function displayColors() {
  colors.forEach(color => {

    const listeners = [
      {
        event: 'click',
        handler: () => currentColor = color
      }
    ];

    const li = createElement(
      'li',
      null,
      ['color-list-item'],
      listeners
    );

    li.style.backgroundColor = color;
    colorList.appendChild(li);
  });
}

displayColors();
displayTools();

canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mouseup', stopDrawing);

clearBtn.addEventListener('click', clearBoard);
colorPickInput.addEventListener('change', changeColor);
lineWidthInput.addEventListener('change', changeLineWidth);
saveBtn.addEventListener('click', saveDrawing);


function makeDraggable(elem) {

  const field = document.querySelector('.field');

  elem.addEventListener('mousedown', function (e) {

    e.stopPropagation();

    const fieldRect = field.getBoundingClientRect();
    const elemRect = elem.getBoundingClientRect();

    const shiftX = e.clientX - elemRect.left;
    const shiftY = e.clientY - elemRect.top;

    elem.style.cursor = "grabbing";

    function moveAt(e) {

      let newLeft = e.clientX - fieldRect.left - shiftX;
      let newTop = e.clientY - fieldRect.top - shiftY;

      newLeft = Math.max(0, Math.min(newLeft, field.clientWidth - elem.offsetWidth));
      newTop = Math.max(0, Math.min(newTop, field.clientHeight - elem.offsetHeight));

      elem.style.left = newLeft + 'px';
      elem.style.top = newTop + 'px';
    }

    function onMouseMove(e) {
      moveAt(e);
    }

    document.addEventListener('mousemove', onMouseMove);

    document.addEventListener('mouseup', function () {
      document.removeEventListener('mousemove', onMouseMove);
      elem.style.cursor = "grab";
    }, { once: true });

  });

  elem.ondragstart = () => false;
}

const field = document.querySelector('.field');
const addBlue = document.getElementById('addBlue');
const addRed = document.getElementById('addRed');

function addPlayer(color) {
  const player = document.createElement('div');

  player.style.width = '35px';
  player.style.height = '45px';
  player.style.borderRadius = '50%';
  player.style.position = 'absolute';
  player.style.cursor = 'grab';
  player.style.zIndex = '5';
  player.style.border = '1px solid white';
  player.style.display = 'flex';
  player.style.alignItems = 'center';
  player.style.justifyContent = 'center';

  const arm1 = document.createElement('div');
  arm1.style.position = 'absolute';
  arm1.style.width = '10px';
  arm1.style.height = '6px';
  arm1.style.top = '30px';
  arm1.style.border = '1px solid white';

  const arm2 = document.createElement('div');
  arm2.style.position = 'absolute';
  arm2.style.width = '10px';
  arm2.style.height = '6px';
  arm2.style.top = '10px';
  arm2.style.border = '1px solid white';

  if (color === 'red') {
    player.style.backgroundColor = "rgb(255, 0, 25)";
    player.style.left = '100px';
    player.style.top = '100px';
    arm1.style.right = '-5px';   //right
    arm2.style.right = '-5px';
    arm1.style.backgroundColor = "rgb(255, 0, 25)";
    arm2.style.backgroundColor = "rgb(190, 30,45)";
  } else {
    player.style.backgroundColor = "rgb(17, 0, 255)";
    player.style.left = '870px';
    player.style.top = '100px';
    arm1.style.left = '-5px';    //left
    arm2.style.left = '-5px';
    arm1.style.backgroundColor = "rgb(17, 0, 255)";
    arm2.style.backgroundColor = "rgb(17, 0, 255)";
  } 

  player.appendChild(arm1);
  player.appendChild(arm2);
  

  field.appendChild(player);
  makeDraggable(player);
}

const addCone = document.getElementById('addCone');

function addConeElement(color = 'orange') {
  const cone = document.createElement('div');

  cone.style.width = '0';
  cone.style.height = '0';
  cone.style.borderLeft = '10px solid transparent';
  cone.style.borderRight = '10px solid transparent';
  cone.style.borderBottom = `25px solid ${color}`;
  cone.style.position = 'absolute';
  cone.style.left = '150px';
  cone.style.top = '150px';
  cone.style.cursor = 'grab';
  cone.style.zIndex = '5';

  field.appendChild(cone);
  makeDraggable(cone);
}

addCone.addEventListener('click', () => addConeElement(currentColor));

addBlue.addEventListener('click', () => addPlayer('blue'));
addRed.addEventListener('click', () => addPlayer('red'));

makeDraggable(document.getElementById('ball'));