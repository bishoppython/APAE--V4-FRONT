const display = document.getElementById("display");
let realExpression = "";
let displayExpression = "";

function appendToDisplay(input) {
  const operadores = ["+", "-", "*", "/"];
  const operadoresDisplay = { "*": "×", "/": "÷" };

  const lastChar = realExpression.slice(-1);

  if (operadores.includes(input)) {
    if (realExpression === "" || operadores.includes(lastChar)) {
      return;
    }
    realExpression += input;
    displayExpression += operadoresDisplay[input] || input;
  } else {
    realExpression += input;
    displayExpression += input;
  }

  display.value = displayExpression;

  // 🔊 Reproduz som para números ou operadores
  const audio = document.getElementById(`audio_${input}`);
  if (audio) {
    audio.currentTime = 0;
    audio.play();
  }
}

function clearDisplay() {
  realExpression = "";
  displayExpression = "";
  display.value = "";

  const audio = document.getElementById("audio_C");
  if (audio) {
    audio.currentTime = 0;
    audio.play();
  }
}

function calculate() {
  try {
    const result = eval(realExpression);
    display.value = result;
    realExpression = result.toString();
    displayExpression = result.toString();
  } catch (error) {
    display.value = "Erro";
    realExpression = "";
    displayExpression = "";
  }

  const audio = document.getElementById("audio_=");
  if (audio) {
    audio.currentTime = 0;
    audio.play();
  }
}

