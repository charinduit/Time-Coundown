
const timerEl = document.getElementById('timer');
const titleEl = document.getElementById('title');
const targetInput = document.getElementById('targetInput');
const titleInput = document.getElementById('titleInput');
const form = document.getElementById('configForm');
const resetBtn = document.getElementById('resetBtn');

function fmt(ms) {
  if (isNaN(ms) || ms <= 0) return '00d 00h 00m 00s';
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${d}d ${String(h).padStart(2,'0')}h ${String(m).padStart(2,'0')}m ${String(sec).padStart(2,'0')}s`;
}

function updateTimer() {
  const cfg = JSON.parse(localStorage.getItem('countdown-config') || '{}');
  if (cfg.title) titleEl.textContent = cfg.title;
  if (cfg.target) {
    const targetDate = new Date(cfg.target);
    const now = new Date();
    const diff = targetDate - now;
    timerEl.textContent = fmt(diff);
  } else {
    timerEl.textContent = '--';
  }
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const cfg = {
    target: targetInput.value,
    title: titleInput.value
  };
  localStorage.setItem('countdown-config', JSON.stringify(cfg));
  updateTimer();
});

resetBtn.addEventListener('click', () => {
  localStorage.removeItem('countdown-config');
  targetInput.value = '';
  titleInput.value = '';
  titleEl.textContent = 'Countdown Timer';
  timerEl.textContent = '--';
});

setInterval(updateTimer, 1000);
window.addEventListener('DOMContentLoaded', () => {
  const cfg = JSON.parse(localStorage.getItem('countdown-config') || '{}');
  if (cfg.target) targetInput.value = cfg.target;
  if (cfg.title) titleInput.value = cfg.title;
  updateTimer();
});
