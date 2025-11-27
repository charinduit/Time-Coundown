// Hardcoded title and target date/time (local time)
const title = 'Countdown to SYSTEM LIVE';
// !!! Set your target below (local time ISO or parseable string)
const targetDate = new Date('2025-12-31T23:59:59');

// Init UI
const titleEl = document.getElementById('title');
const targetEl = document.getElementById('targetDate');
const alarmEl = document.getElementById('alarm');
const bannerEl = document.getElementById('banner');
const timerEl = document.getElementById('timer');

let alarmEnabled = true;

function fmt2(n){ return String(n).padStart(2,'0'); }
function setDigits(d,h,m,s){
  document.getElementById('days').textContent = d;
  document.getElementById('hours').textContent = fmt2(h);
  document.getElementById('minutes').textContent = fmt2(m);
  document.getElementById('seconds').textContent = fmt2(s);
}

function applyUrgency(ms){
  timerEl.classList.remove('pulse-warn','pulse-bad','glow');
  if (ms <= 0) { timerEl.classList.add('pulse-bad'); return; }
  const minutes = ms / 60000;
  if (minutes <= 15) { // critical
    timerEl.classList.add('pulse-bad');
  } else if (minutes <= 60) { // warning
    timerEl.classList.add('pulse-warn');
  } else {
    timerEl.classList.add('glow');
  }
}

function tick(){
  const now = new Date();
  let diff = targetDate.getTime() - now.getTime();
  if (diff < 0) diff = 0;
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff / 3600000) % 24);
  const minutes = Math.floor((diff / 60000) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  setDigits(days,hours,minutes,seconds);
  applyUrgency(diff);
  if (diff === 0 && alarmEnabled) {
    try { alarmEl.currentTime = 0; alarmEl.play(); } catch(e) { /* autoplay may be blocked; user can press Space */ }
  }
}

// Set static labels
titleEl.textContent = title;
targetEl.textContent = targetDate.toLocaleString();

// Wake Lock to keep the screen alive (where supported)
let wakeLock = null;
async function enableWakeLock(){
  try { if ('wakeLock' in navigator) { wakeLock = await navigator.wakeLock.request('screen'); } }
  catch(e) { /* ignore */ }
}

enableWakeLock();
setInterval(tick, 250); tick();

// Auto-request fullscreen once (browsers may require user gesture; fallback to helper text)
document.addEventListener('DOMContentLoaded', () => {
  if (document.documentElement.requestFullscreen) {
    // Try to request fullscreen shortly after load
    setTimeout(() => { document.documentElement.requestFullscreen().catch(()=>{}); }, 600);
  }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') { // mute/unmute
    alarmEnabled = !alarmEnabled;
    bannerEl.textContent = (alarmEnabled ? '🔔 Alarm ON — ' : '🔕 Alarm OFF — ') + 'Maintenance window approaching — please prepare!';
  }
  if (e.key.toLowerCase() === 'b') { // toggle banner
    bannerEl.style.display = (bannerEl.style.display === 'none') ? '' : 'none';
  }
});
