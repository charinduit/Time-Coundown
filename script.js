
// --- Simple, single countdown ---
// Configure via hardcoded date or URL param ?target=YYYY-MM-DDTHH:MM:SS
// Optional title via ?title=Your%20Text

function getParams(){const u=new URL(window.location.href);return Object.fromEntries(u.searchParams.entries());}
const params = getParams();
const titleText = params.title || 'Countdown to Next Maintenance Window';
const targetStr = params.target || '2025-12-31T23:59:59'; // change as needed
const targetDate = new Date(targetStr);

const titleEl = document.getElementById('title');
const targetEl = document.getElementById('targetDate');
const bannerEl = document.getElementById('banner');
const timerEl = document.getElementById('timer');

let alarmEnabled = true; // Space to toggle
let wakeLock = null;

// WebAudio beep generator (no external audio file required)
let ctx, osc;
function playBeep(){
  try{
    if(!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type='sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime+0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime+0.6);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime+0.65);
  }catch(e){/* ignore */}
}

function fmt2(n){return String(n).padStart(2,'0');}
function setDigits(d,h,m,s){
  document.getElementById('days').textContent = d;
  document.getElementById('hours').textContent = fmt2(h);
  document.getElementById('minutes').textContent = fmt2(m);
  document.getElementById('seconds').textContent = fmt2(s);
}
function applyUrgency(ms){
  timerEl.classList.remove('pulse-warn','pulse-bad','glow');
  if(ms<=0){timerEl.classList.add('pulse-bad');return;}
  const minutes = ms/60000;
  if(minutes<=15){timerEl.classList.add('pulse-bad');}
  else if(minutes<=60){timerEl.classList.add('pulse-warn');}
  else{timerEl.classList.add('glow');}
}

function tick(){
  const now = new Date();
  let diff = targetDate.getTime()-now.getTime();
  if(diff<0) diff=0;
  const days = Math.floor(diff/86400000);
  const hours = Math.floor((diff/3600000)%24);
  const minutes = Math.floor((diff/60000)%60);
  const seconds = Math.floor((diff/1000)%60);
  setDigits(days,hours,minutes,seconds);
  applyUrgency(diff);
  if(diff===0 && alarmEnabled){ playBeep(); }
}

async function enableWakeLock(){
  try{ if('wakeLock' in navigator){ wakeLock = await navigator.wakeLock.request('screen'); } }
  catch(e){ /* ignore */ }
}

// Init
titleEl.textContent = titleText;
try{ targetEl.textContent = targetDate.toLocaleString(); }catch(e){ targetEl.textContent = targetStr; }

enableWakeLock();
setInterval(tick, 250); tick();

// Keyboard shortcuts
document.addEventListener('keydown', (e)=>{
  if(e.code==='Space'){
    alarmEnabled = !alarmEnabled;
    bannerEl.textContent = (alarmEnabled? '🔔 Alarm ON — ' : '🔕 Alarm OFF — ') + 'Maintenance window approaching — please prepare!';
  }
  if(e.key.toLowerCase()==='b'){
    bannerEl.style.display = (bannerEl.style.display==='none')? '' : 'none';
  }
});

// Try to enter fullscreen shortly after load (may require user gesture)
document.addEventListener('DOMContentLoaded', ()=>{
  if(document.documentElement.requestFullscreen){
    setTimeout(()=>{ document.documentElement.requestFullscreen().catch(()=>{}); }, 600);
  }
});
