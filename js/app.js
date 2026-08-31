const screens = [...document.querySelectorAll('.screen')];
const dateForm = document.getElementById('dateForm');
const dateInput = document.getElementById('dateInput');
const dateError = document.getElementById('dateError');
const giftButton = document.getElementById('giftButton');
const progressFill = document.getElementById('progressFill');
const tapText = document.getElementById('tapText');
const envelopeScene = document.getElementById('envelopeScene');
const envelopeButton = document.getElementById('envelopeButton');
const envelopeInstruction = document.getElementById('envelopeInstruction');
const letterPaper = document.getElementById('letterPaper');
const finalButton = document.getElementById('finalButton');
const finalTitle = document.getElementById('finalTitle');
const finalMessage = document.getElementById('finalMessage');
const loadingGift = document.getElementById('loadingGift');
const restartButton = document.getElementById('restartButton');
const confettiLayer = document.getElementById('confettiLayer');

const requiredDate = '07.09';
const requiredTaps = 20;
let taps = 0;
let envelopeOpened = false;

function showScreen(id) {
  screens.forEach(screen => screen.classList.toggle('active', screen.id === id));
}

function normalizeDate(value) {
  return value.trim().replace(/[\/-]/g, '.');
}

dateInput.addEventListener('input', event => {
  let digits = event.target.value.replace(/\D/g, '').slice(0, 4);
  if (digits.length > 2) digits = `${digits.slice(0, 2)}.${digits.slice(2)}`;
  event.target.value = digits;
  dateError.textContent = '';
});

dateForm.addEventListener('submit', event => {
  event.preventDefault();
  if (normalizeDate(dateInput.value) === requiredDate) {
    showScreen('gift');
    return;
  }
  dateError.textContent = 'Mmm... to nije nas datum, lepa devojko. ♡';
  dateForm.animate(
    [{ transform: 'translateX(0)' }, { transform: 'translateX(-7px)' }, { transform: 'translateX(7px)' }, { transform: 'translateX(0)' }],
    { duration: 280 }
  );
});

giftButton.addEventListener('click', () => {
  if (taps >= requiredTaps) return;
  taps += 1;
  const remaining = requiredTaps - taps;
  progressFill.style.width = `${(taps / requiredTaps) * 100}%`;
  giftButton.classList.remove('bump');
  void giftButton.offsetWidth;
  giftButton.classList.add('bump');

  if (remaining <= 5 && remaining > 0) giftButton.classList.add('almost');
  tapText.textContent = remaining === 1 ? 'I jos jedan...' : `jos ${remaining} klika...`;

  if (taps === requiredTaps) {
    tapText.textContent = 'Otvoreno!';
    giftButton.classList.remove('almost');
    launchConfetti(70);
    setTimeout(() => showScreen('envelopeStage'), 650);
  }
});

envelopeButton.addEventListener('click', () => {
  if (envelopeOpened) return;
  envelopeOpened = true;
  envelopeScene.classList.add('open');
  envelopeInstruction.textContent = 'Otvaram pismo...';
  letterPaper.setAttribute('aria-hidden', 'false');

  setTimeout(() => {
    envelopeInstruction.textContent = 'Voli me zauvek ♡';
    letterPaper.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 2100);
});

finalButton.addEventListener('click', () => {
  showScreen('final');
  finalMessage.hidden = true;
  restartButton.hidden = true;
  loadingGift.hidden = false;
  finalTitle.hidden = false;

  setTimeout(() => {
    loadingGift.hidden = true;
    finalTitle.hidden = true;
    finalMessage.hidden = false;
    restartButton.hidden = false;
    launchConfetti(45);
  }, 1750);
});

restartButton.addEventListener('click', () => {
  taps = 0;
  envelopeOpened = false;
  dateInput.value = '';
  dateError.textContent = '';
  progressFill.style.width = '0%';
  tapText.textContent = 'jos 20 klika ostalo...';
  envelopeScene.classList.remove('open');
  envelopeInstruction.textContent = 'Klikni na vosak kako bi otvorila pismo.';
  letterPaper.setAttribute('aria-hidden', 'true');
  showScreen('login');
});

function launchConfetti(amount) {
  const colors = ['#a83f45', '#d98787', '#efd7d0', '#fff4dc', '#793038'];
  for (let i = 0; i < amount; i += 1) {
    const piece = document.createElement('i');
    piece.className = 'confetti-piece';
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.setProperty('--duration', `${2.4 + Math.random() * 2.4}s`);
    piece.style.setProperty('--drift', `${-90 + Math.random() * 180}px`);
    piece.style.setProperty('--rotation', `${Math.random() * 180}deg`);
    piece.style.animationDelay = `${Math.random() * .45}s`;
    piece.style.borderRadius = Math.random() > .65 ? '50%' : '2px';
    confettiLayer.appendChild(piece);
    setTimeout(() => piece.remove(), 5200);
  }
}
