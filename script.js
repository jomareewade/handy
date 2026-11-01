// ===== eSIM activation prototype =====
// Three screens: 1) checklist, 2) simulated QR scan, 3) success.

const CHECKS = [
  { title: 'Phone supports eSIM and is unlocked', help: 'Not sure? Dial *#06# and look for an EID number.' },
  { title: 'Connected to Wi-Fi', help: 'A stable connection is needed to download your eSIM.' },
  { title: 'QR code is ready', help: 'Open the email or app screen that shows your QR code.' },
  { title: 'Keep your current SIM in place', help: "Don't remove it until your eSIM is active." },
];

const HINTS = {
  aim: 'Hold your phone steady so the code fits inside the frame.',
  locked: 'Got it. Hold still for a moment.',
  activating: 'Keep this screen open until setup finishes.',
};
const STATUSES = {
  aim: 'Looking for a QR code…',
  locked: 'Code detected',
  activating: 'Activating your eSIM',
};

// Grab the elements we'll update
const phone = document.querySelector('.phone');
const screens = [null, document.getElementById('screen1'), document.getElementById('screen2'), document.getElementById('screen3')];
const backBtn = document.getElementById('backBtn');
const backSpacer = document.getElementById('backSpacer');
const stepCount = document.getElementById('stepCount');
const checklist = document.getElementById('checklist');
const readyLabel = document.getElementById('readyLabel');
const scanBtn = document.getElementById('scanBtn');
const camera = document.querySelector('.camera');
const scanHint = document.getElementById('scanHint');
const statusText = document.getElementById('statusText');
const progressBar = document.getElementById('progressBar');
const stepEls = document.querySelectorAll('#activationSteps li');

let checks = [false, false, false, false];
let timers = [];

// ---- Screen switching ----
function showScreen(n) {
  phone.dataset.screen = n;
  screens.forEach((el, i) => { if (el) el.hidden = i !== n; });
  backBtn.hidden = n !== 2;
  backSpacer.hidden = n === 2;
  stepCount.textContent = n + '/3';
  stepCount.setAttribute('aria-label', 'Step ' + n + ' of 3');
}

// ---- Step 1: checklist ----
function buildChecklist() {
  checklist.innerHTML = CHECKS.map((c, i) => `
    <button class="check-item" role="checkbox" aria-checked="false" data-i="${i}">
      <span class="box">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>
      </span>
      <span class="check-text">
        <span class="check-title">${c.title}</span>
        <span class="check-help">${c.help}</span>
      </span>
    </button>`).join('');

  checklist.querySelectorAll('.check-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      const i = Number(btn.dataset.i);
      checks[i] = !checks[i];
      updateChecklist();
    });
  });
}

function updateChecklist() {
  checklist.querySelectorAll('.check-item').forEach((btn, i) => {
    btn.setAttribute('aria-checked', checks[i] ? 'true' : 'false');
  });
  const count = checks.filter(Boolean).length;
  const allReady = count === CHECKS.length;
  readyLabel.textContent = allReady ? 'All set. Ready to scan' : count + ' of 4 ready';
  scanBtn.disabled = !allReady;
}

document.getElementById('markAllBtn').addEventListener('click', () => {
  checks = checks.map(() => true);
  updateChecklist();
});

// ---- Step 2: simulated scan ----
function setPhase(phase) {
  camera.dataset.phase = phase;
  scanHint.textContent = HINTS[phase];
  statusText.textContent = STATUSES[phase];
}

function setActivationStep(step) {
  progressBar.style.width = [28, 58, 88, 100][Math.min(step, 3)] + '%';
  stepEls.forEach((li, i) => {
    li.classList.toggle('done', step > i);
    li.classList.toggle('active', step === i);
  });
}

function later(ms, fn) { timers.push(setTimeout(fn, ms)); }
function clearTimers() { timers.forEach(clearTimeout); timers = []; }

scanBtn.addEventListener('click', () => {
  if (!checks.every(Boolean)) return;
  clearTimers();
  setPhase('aim');
  setActivationStep(0);
  showScreen(2);
  later(1800, () => setPhase('locked'));
  later(2900, () => { setPhase('activating'); setActivationStep(0); });
  later(3900, () => setActivationStep(1));
  later(4800, () => setActivationStep(2));
  later(5700, () => setActivationStep(3));
  later(6500, () => showScreen(3));
});

backBtn.addEventListener('click', () => {
  clearTimers();
  setPhase('aim');
  showScreen(1);
});

// ---- Step 3: done → start over ----
document.getElementById('doneBtn').addEventListener('click', () => {
  clearTimers();
  checks = checks.map(() => false);
  updateChecklist();
  setPhase('aim');
  showScreen(1);
});

// ---- Mock QR code (a pattern that looks like a QR, not a real one) ----
function buildQr() {
  const n = 21;
  let seed = 11;
  const finderDark = (x, y) => {
    const ox = x > 12 ? x - 14 : x;
    const oy = y > 12 ? y - 14 : y;
    if (ox < 0 || oy < 0 || ox > 6 || oy > 6) return false;
    const edge = ox === 0 || ox === 6 || oy === 0 || oy === 6;
    const core = ox >= 2 && ox <= 4 && oy >= 2 && oy <= 4;
    return edge || core;
  };
  let html = '';
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const inFinder = (x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12);
      let dark;
      if (inFinder) dark = finderDark(x, y);
      else if (y === 6 && x >= 8 && x <= 12) dark = x % 2 === 0;
      else if (x === 6 && y >= 8 && y <= 12) dark = y % 2 === 0;
      else { seed = (seed * 48271) % 2147483647; dark = seed % 100 < 46; }
      if (dark) html += `<div style="grid-column:${x + 1};grid-row:${y + 1}"></div>`;
    }
  }
  document.getElementById('qrGrid').innerHTML = html;
}

// ---- Start ----
buildChecklist();
updateChecklist();
buildQr();
showScreen(1);
