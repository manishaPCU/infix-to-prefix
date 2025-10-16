let steps = [];
let current = 0;
let intervalId = null;

function displayStep() {
  const step = steps[current];
  const infixDisplay = document.getElementById("infixDisplay");
  const stackDisplay = document.getElementById("stackDisplay");
  const prefixDisplay = document.getElementById("prefixDisplay");
  const infoBox = document.getElementById("infoBox");

  // show scanning highlight
  let infixInput = document.getElementById("infixInput").value;
  let rev = infixInput.split('').reverse().join('');
  let display = "";
  for (let i = 0; i < rev.length; i++) {
    if (i === step.pos) {
      display += `<span class="highlight">${rev[i] || ''}</span>`;
    } else {
      display += rev[i] || '';
    }
  }
  infixDisplay.innerHTML = display;

  // stack
  stackDisplay.innerText = step.afterStack.join(' ');
  // prefix (current built)
  prefixDisplay.innerText = step.afterResult;

  // info / action
  infoBox.style.display = "block";
  infoBox.innerText = `Step ${current + 1}/${steps.length}: ${step.action}`;
}

function stepForward() {
  if (current < steps.length - 1) {
    current++;
    displayStep();
  }
}

function stepBack() {
  if (current > 0) {
    current--;
    displayStep();
  }
}

function playAnimation() {
  if (intervalId) return;
  intervalId = setInterval(() => {
    stepForward();
    if (current === steps.length - 1) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }, 1000);
}

function pauseAnimation() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

function resetAnimation() {
  pauseAnimation();
  current = 0;
  displayStep();
}

// Hook buttons
document.getElementById("startBtn").addEventListener("click", () => {
  let infix = document.getElementById("infixInput").value.trim();
  if (!infix) {
    alert("Please enter an infix expression");
    return;
  }
  steps = generateSteps(infix);
  current = 0;
  displayStep();
  playAnimation();
});
document.getElementById("stepBtn").addEventListener("click", stepForward);
document.getElementById("stepBackBtn").addEventListener("click", stepBack);
document.getElementById("pauseBtn").addEventListener("click", pauseAnimation);
document.getElementById("resetBtn").addEventListener("click", resetAnimation);
