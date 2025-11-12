function precedence(c) {
  if (c === '^') return 3;
  if (c === '*' || c === '/') return 2;
  if (c === '+' || c === '-') return 1;
  return -1; // Invalid operator
}

function generateSteps(infix) {
  infix = infix.replace(/\s+/g, '');

  // Step 1: Reverse and swap parentheses
  let rev = infix
    .split('')
    .reverse()
    .map(ch => {
      if (ch === '(') return ')';
      if (ch === ')') return '(';
      return ch;
    })
    .join('');

  let stack = [];
  let postfix = '';
  let steps = [];

  // Step 2: Convert reversed infix to postfix
  for (let i = 0; i < rev.length; i++) {
    let ch = rev[i];
    let action = '';

    if (/[a-zA-Z0-9]/.test(ch)) {
      postfix += ch;
      action = `Operand '${ch}' → added to postfix`;
    } else if (ch === '(') {
      stack.push(ch);
      action = `Push '(' onto stack`;
    } else if (ch === ')') {
      while (stack.length && stack[stack.length - 1] !== '(') {
        postfix += stack.pop();
      }
      stack.pop();
      action = `Pop until '(' found`;
    } else {
      // ✅ Validation: Check for invalid operator
      if (precedence(ch) === -1) {
        alert(`Invalid operator '${ch}' detected! Please enter a valid expression.`);
        steps = [];
        return [];
      }

      while (stack.length && precedence(ch) <= precedence(stack[stack.length - 1])) {
        postfix += stack.pop();
      }
      stack.push(ch);
      action = `Operator '${ch}' processed`;
    }

    steps.push({
      rev,
      pos: i,
      stack: [...stack],
      postfix,
      action,
      prefix: ''
    });
  }

  // Pop remaining stack
  while (stack.length) {
    postfix += stack.pop();
    steps.push({
      rev,
      pos: rev.length,
      stack: [...stack],
      postfix,
      action: `Pop remaining operators`,
      prefix: ''
    });
  }

  // Step 3: Reverse postfix → prefix
  let prefix = postfix.split('').reverse().join('');
  steps.push({
    rev,
    pos: rev.length,
    stack: [],
    postfix,
    prefix,
    action: `Reverse postfix → Prefix`
  });

  return steps;
}

// Globals
let steps = [];
let current = 0;
let autoPlayId = null;

// Update UI
function updateUI() {
  const step = steps[current];
  const scanEl = document.getElementById('scanArea');
  const stackEl = document.getElementById('stackArea');
  const postfixEl = document.getElementById('postfixArea');
  const prefixEl = document.getElementById('outputArea');
  const infoEl = document.getElementById('infoArea');

  // Reversed Expression
  let html = '';
  for (let i = 0; i < step.rev.length; i++) {
    if (i === step.pos) html += `<span class="highlight">${step.rev[i]}</span>`;
    else html += step.rev[i];
  }
  scanEl.innerHTML = html;

  // Stack
  stackEl.innerHTML = '';
  step.stack.forEach((s) => {
    const div = document.createElement('div');
    div.classList.add('stack-item');
    div.textContent = s;
    stackEl.appendChild(div);
  });

  postfixEl.textContent = step.postfix;
  prefixEl.textContent = step.prefix;
  infoEl.textContent = step.action;
}

// Controls
document.getElementById('startBtn').addEventListener('click', () => {
  const infix = document.getElementById('infixInput').value.trim();
  if (!infix) return alert('Enter an infix expression');
  steps = generateSteps(infix);
  if (steps.length === 0) return; // Stop if invalid expression
  current = 0;
  updateUI();
});

document.getElementById('nextBtn').addEventListener('click', () => {
  if (current < steps.length - 1) current++;
  updateUI();
});

document.getElementById('prevBtn').addEventListener('click', () => {
  if (current > 0) current--;
  updateUI();
});

document.getElementById('autoBtn').addEventListener('click', () => {
  if (autoPlayId) return;
  autoPlayId = setInterval(() => {
    if (current < steps.length - 1) {
      current++;
      updateUI();
    } else {
      clearInterval(autoPlayId);
      autoPlayId = null;
    }
  }, 900);
});

document.getElementById('resetBtn').addEventListener('click', () => {
  clearInterval(autoPlayId);
  autoPlayId = null;
  current = 0;
  steps = [];

  // ✅ Clear all UI elements and input field
  document.getElementById('infixInput').value = ''; // Clears input box
  document.getElementById('scanArea').textContent = '';
  document.getElementById('stackArea').innerHTML = '';
  document.getElementById('postfixArea').textContent = '';
  document.getElementById('outputArea').textContent = '';
  document.getElementById('infoArea').textContent = '—';
});
