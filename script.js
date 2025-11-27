
// ---- Utility: Asia/Colombo timezone handling ----
// Since browsers use local time, we keep inputs in local and calculate differences using Date.
// For Sri Lanka (UTC+5:30), developers accessing locally will see correct values automatically.

const els = {
  goliveInput: document.getElementById('goliveInput'),
  deadlineInput: document.getElementById('deadlineInput'),
  reminderDays: document.getElementById('reminderDays'),
  titleInput: document.getElementById('titleInput'),
  form: document.getElementById('configForm'),
  resetBtn: document.getElementById('resetBtn'),
  since: document.getElementById('sinceGolive'),
  countdown: document.getElementById('countdown'),
  deadlineLabel: document.getElementById('deadlineLabel'),
  reminderBadge: document.getElementById('reminderBadge'),
  reminderBullets: document.getElementById('reminderBullets'),
  progressBar: document.getElementById('progressBar'),
  progressPct: document.getElementById('progressPct'),
  progressTitle: document.getElementById('progressTitle'),
  now: document.getElementById('now'),
  shareLink: document.getElementById('shareLink'),
  themeToggle: document.getElementById('themeToggle'),
  footerTitle: document.getElementById('footerTitle'),
};

// Theme toggle (persist)
(function initTheme() {
  const mode = localStorage.getItem('theme-mode');
  if (mode === 'light') document.documentElement.style.colorScheme = 'light';
  if (mode === 'dark') document.documentElement.style.colorScheme = 'dark';
  els.themeToggle.addEventListener('click', () => {
    const current = getComputedStyle(document.documentElement).colorScheme;
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.style.colorScheme = next;
    localStorage.setItem('theme-mode', next);
  });
})();

// URL param helpers
function getParams() {
  const u = new URL(window.location.href);
  return Object.fromEntries(u.searchParams.entries());
}
function setShareLink() {
  const p = {
    golive: els.goliveInput.value,
    deadline: els.deadlineInput.value,
    title: els.titleInput.value,
    r: els.reminderDays.value,
  };
  const url = new URL(window.location.href);
  Object.entries(p).forEach(([k,v]) => { if (v) url.searchParams.set(k, v); });
  els.shareLink.href = url.toString();
}

// Load config from localStorage or URL params
function loadConfig() {
  const params = getParams();
  const cfg = JSON.parse(localStorage.getItem('golive-config') || '{}');
  const golive = params.golive ?? cfg.golive ?? '';
  const deadline = params.deadline ?? cfg.deadline ?? '';
  const title = params.title ?? cfg.title ?? '';
  const r = params.r ?? cfg.reminderDays ?? 7;

  els.goliveInput.value = golive;
  els.deadlineInput.value = deadline;
  els.titleInput.value = title;
  els.reminderDays.value = r;
  setShareLink();
}

function saveConfig(e) {
  if (e) e.preventDefault();
  const cfg = {
    golive: els.goliveInput.value,
    deadline: els.deadlineInput.value,
    title: els.titleInput.value,
    reminderDays: parseInt(els.reminderDays.value||'7',10),
  };
  localStorage.setItem('golive-config', JSON.stringify(cfg));
  updateAll();
  setShareLink();
}

function resetConfig() {
  localStorage.removeItem('golive-config');
  els.goliveInput.value = '';
  els.deadlineInput.value = '';
  els.titleInput.value = '';
  els.reminderDays.value = 7;
  updateAll();
  setShareLink();
}

els.form.addEventListener('submit', saveConfig);
els.resetBtn.addEventListener('click', resetConfig);

// Format helpers
const pad = (n) => String(n).padStart(2, '0');
function fmtDuration(ms) {
  if (isNaN(ms) || !isFinite(ms)) return '—';
  const s = Math.max(0, Math.floor(ms/1000));
  const days = Math.floor(s / 86400);
  const hours = Math.floor((s % 86400) / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  return `${days}d ${pad(hours)}h ${pad(mins)}m ${pad(secs)}s`;
}

function updateAll() {
  const cfg = JSON.parse(localStorage.getItem('golive-config') || '{}');
  const title = cfg.title?.trim();
  els.footerTitle.textContent = title ? title : 'Go‑Live Reminder';
  els.progressTitle.textContent = title ? `${title} Progress` : 'Milestone Progress';

  const now = new Date();
  els.now.textContent = now.toLocaleString();

  // Count-up since go-live
  if (cfg.golive) {
    const goliveDate = new Date(cfg.golive);
    const sinceMs = now - goliveDate;
    els.since.textContent = fmtDuration(sinceMs);
  } else {
    els.since.textContent = 'Set the Go‑Live date above';
  }

  // Countdown to deadline and progress
  if (cfg.deadline && cfg.golive) {
    const start = new Date(cfg.golive);
    const end = new Date(cfg.deadline);
    const totalMs = end - start;
    const leftMs = end - now;

    els.countdown.textContent = fmtDuration(leftMs);
    els.deadlineLabel.textContent = leftMs < 0 ? `Deadline passed on ${end.toLocaleString()}` : `Deadline: ${end.toLocaleString()}`;

    let pct = 0;
    if (totalMs > 0) {
      const elapsedMs = Math.max(0, now - start);
      pct = Math.min(100, Math.max(0, (elapsedMs / totalMs) * 100));
    }
    els.progressBar.style.width = `${pct.toFixed(2)}%`;
    els.progressPct.textContent = `${pct.toFixed(0)}%`;
  } else {
    els.countdown.textContent = 'Set Go‑Live & Deadline above';
    els.deadlineLabel.textContent = 'No deadline set.';
    els.progressBar.style.width = '0%';
    els.progressPct.textContent = '0%';
  }

  // Reminder window badges
  els.reminderBullets.innerHTML = '';
  if (cfg.deadline) {
    const end = new Date(cfg.deadline);
    const daysWindow = Number(cfg.reminderDays || 7);
    const now = new Date();
    const leftDays = Math.ceil((end - now) / 86400000);

    let cls = 'ok', text = 'On track';
    if (leftDays <= daysWindow && leftDays > 0) { cls = 'warn'; text = `Due in ${leftDays} day(s)`; }
    if (leftDays <= 0) { cls = 'danger'; text = 'Deadline passed'; }
    els.reminderBadge.className = `badge ${cls}`;
    els.reminderBadge.textContent = text;

    const tips = [];
    if (cls === 'warn') {
      tips.push('Prioritize P1 issues and freeze non-critical changes.');
      tips.push('Ensure monitoring/alerts are green and actionable.');
      tips.push('Share a daily status update with stakeholders.');
    } else if (cls === 'danger') {
      tips.push('Conduct post-deadline review and update the plan.');
      tips.push('Communicate slippages with mitigation steps.');
      tips.push('Re-baseline timeline and notify affected teams.');
    } else {
      tips.push('Keep clearing backlog and track risks.');
      tips.push('Validate backups, DR drills, and observability.');
    }

    tips.forEach(t => {
      const li = document.createElement('li');
      li.textContent = t;
      els.reminderBullets.appendChild(li);
    });
  } else {
    els.reminderBadge.className = 'badge';
    els.reminderBadge.textContent = 'No reminder';
  }
}

// Live ticking clock every second
setInterval(() => {
  updateAll();
}, 1000);

// Initialize on load
window.addEventListener('DOMContentLoaded', () => {
  loadConfig();
  updateAll();
});
