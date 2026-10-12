'use strict';

/* =========================================================
   Fatma Kassim Abdulla — portfolio interactions
   Static HTML/CSS/JS only. No libraries, no build step.
   Progressive enhancement: all content is visible without JS.
   Animations replay: hero on load/refresh/bfcache, and section
   reveals when a section leaves the viewport and returns.
   ========================================================= */

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');

/* ---------- Verified professional data (source: CV) ---------- */
const roles = {
  jumbi:{date:'September 2026 – Present',title:'Operational Manager — Jumbi Market',company:'V-Clean Company Limited (VIGOR Group)',summary:'Coordinating daily market operations, staff and revenue processes to support orderly workflows and consistent service delivery.',points:['Supervise cleaners, cashiers and field teams.','Monitor stall rent and daily collections, supporting accurate reporting.','Coordinate trader registration, vendor compliance and stakeholder engagement.','Follow up maintenance and cleanliness needs with the relevant teams.','Prepare daily, weekly and monthly operational reports.'],tags:['Team supervision','Revenue reporting','Trader coordination']},
  mombasa:{date:'February 2026 – August 2026',title:'Operational Manager — Mombasa Market',company:'V-Clean Company Limited (VIGOR Group)',summary:'Oversaw daily market operations, combining staff supervision, collection processes and trader coordination.',points:['Supervised cleaners, cashiers and field teams.','Managed rent and daily revenue collections.','Coordinated trader registration and stakeholder engagement.','Maintained cleanliness, compliance and operational standards.','Prepared daily, weekly and monthly reports for management.'],tags:['Market operations','Cash management','Operational standards']},
  cashier:{date:'July 2025 – February 2026',title:'Cashier',company:'V-Clean Company Limited (VIGOR Group)',summary:'Handled daily financial transactions and customer enquiries while maintaining accurate cash records.',points:['Managed revenue collection and prepared financial reports.','Maintained accountability and transparency in financial operations.','Provided customer support and resolved payment-related enquiries.','Assisted with collection efficiency and record-keeping systems.'],tags:['Cash records','Revenue collection','Customer support']},
  hotel:{date:'October 2024 – January 2025',title:'Receptionist',company:'Oceanic Bay Hotel & Resort · Bagamoyo',summary:'Provided front desk services and supported guests through bookings, billing and reservations.',points:['Handled bookings, billing and reservation enquiries.','Coordinated with other hotel departments.','Maintained administrative records and supported front desk service delivery.'],tags:['Hospitality','Guest relations','Administration']},
  community:{date:'2023 – Present',title:'Secretary — Kikwajuni Constituency',company:'UVCCM',summary:'Supported youth engagement and community initiatives through communication, administration and programme coordination.',points:['Managed official correspondence and office operations.','Supported youth engagement and community initiatives.','Assisted with planning programmes and events.'],tags:['Community engagement','Correspondence','Event coordination']}
};

/* =========================================================
   Experience tabs
   ========================================================= */
const tabs = Array.from(document.querySelectorAll('[data-role]'));
const panel = document.getElementById('role-panel');
let switchTimer = null;
let heightClear = null;

function renderRole(root, key){
  const role = roles[key];
  if(!root || !role) return;
  ['date','title','company','summary'].forEach(field=>{
    const el = root.querySelector('[id="role-'+field+'"]');
    if(el) el.textContent = role[field];
  });
  ['points','tags'].forEach(field=>{
    const parent = root.querySelector('[id="role-'+field+'"]');
    if(!parent) return;
    parent.replaceChildren(...role[field].map(text=>{
      const el = document.createElement(field === 'points' ? 'li' : 'span');
      el.textContent = text;
      return el;
    }));
  });
}

function selectRole(button, animate){
  const key = button.dataset.role;
  const motion = animate !== false && !prefersReduced.matches;
  tabs.forEach(b=>{
    const active = b === button;
    b.setAttribute('aria-selected', String(active));
    b.tabIndex = active ? 0 : -1;
  });
  if(panel) panel.setAttribute('aria-labelledby', button.id);
  clearTimeout(switchTimer);
  clearTimeout(heightClear);
  if(!panel) return;

  if(!motion){
    panel.classList.remove('is-switching');
    panel.style.height = '';
    renderRole(panel, key);
    return;
  }

  /* Gently fade the content, then smoothly animate the panel height so
     switching roles never jumps or clips text. */
  const start = panel.getBoundingClientRect().height;
  panel.style.height = start + 'px';
  panel.classList.add('is-switching');
  switchTimer = setTimeout(()=>{
    renderRole(panel, key);
    panel.style.height = 'auto';
    const target = panel.getBoundingClientRect().height;
    panel.style.height = start + 'px';
    void panel.offsetHeight;
    panel.style.height = target + 'px';
    panel.classList.remove('is-switching');
    const finish = ()=>{ if(panel) panel.style.height = ''; };
    heightClear = setTimeout(finish, 560);
    const onEnd = event=>{
      if(event.target !== panel || event.propertyName !== 'height') return;
      panel.removeEventListener('transitionend', onEnd);
      clearTimeout(heightClear);
      finish();
    };
    panel.addEventListener('transitionend', onEnd);
  }, 210);
}

tabs.forEach((button,index)=>{
  button.addEventListener('click',()=>selectRole(button));
  button.addEventListener('keydown',event=>{
    let next;
    if(event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if(event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    if(event.key === 'Home') next = 0;
    if(event.key === 'End') next = tabs.length - 1;
    if(next !== undefined){ event.preventDefault(); tabs[next].focus(); selectRole(tabs[next]); }
  });
});

/* =========================================================
   Approach — flip cards (manual only; never flips on its own)
   ========================================================= */
document.querySelectorAll('.flip-card').forEach(card=>{
  card.addEventListener('click',()=>{
    const open = card.getAttribute('aria-expanded') !== 'true';
    card.setAttribute('aria-expanded', String(open));
    card.querySelector('.flip-front').setAttribute('aria-hidden', String(open));
    card.querySelector('.flip-back').setAttribute('aria-hidden', String(!open));
  });
});

/* =========================================================
   Mobile navigation
   ========================================================= */
const menu = document.querySelector('.menu');
const nav = document.getElementById('nav');
if(menu && nav){
  menu.addEventListener('click',()=>{
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    nav.classList.toggle('open', open);
  });
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
    menu.setAttribute('aria-expanded','false');
    menu.setAttribute('aria-label','Open navigation');
    nav.classList.remove('open');
  }));
}

/* =========================================================
   Rotating professional words — smooth vertical slide.
   Runs only while the tab is visible and resumes on return.
   ========================================================= */
const swapHost = document.querySelector('.role-swap');
const roleWords = ['OPERATIONS','FINANCE','COMMUNITY'];
const ROLE_INTERVAL = 4000;
let roleTimer = null;
let roleIndex = 0;
let roleTrack = null;

function stopWords(){ if(roleTimer){ clearInterval(roleTimer); roleTimer = null; } }

function measureWordWidth(){
  const cs = getComputedStyle(swapHost);
  const probe = document.createElement('span');
  probe.style.cssText = 'position:absolute;left:-9999px;top:0;visibility:hidden;white-space:nowrap;display:inline-block;';
  probe.style.fontStyle = cs.fontStyle;
  probe.style.fontWeight = '500';
  probe.style.fontSize = cs.fontSize;
  probe.style.fontFamily = cs.fontFamily;
  probe.style.letterSpacing = cs.letterSpacing;
  document.body.appendChild(probe);
  let max = 0;
  roleWords.forEach(w=>{ probe.textContent = w; max = Math.max(max, probe.getBoundingClientRect().width); });
  probe.remove();
  return max;
}

function snapTrackToStart(){
  if(!roleTrack) return;
  roleTrack.style.transition = 'none';
  roleTrack.style.transform = 'translateY(0)';
  void roleTrack.offsetWidth;
  roleTrack.style.transition = '';
  roleIndex = 0;
}

function tickWords(){
  if(document.hidden || !roleTrack) return;
  roleIndex++;
  roleTrack.style.transform = 'translateY(-' + (roleIndex * 25) + '%)';
  if(roleIndex === roleWords.length){
    const onEnd = ()=>{
      roleTrack.removeEventListener('transitionend', onEnd);
      snapTrackToStart();
    };
    roleTrack.addEventListener('transitionend', onEnd);
  }
}

function startRotation(){
  stopWords();
  if(!roleTrack) return;
  if(roleIndex >= roleWords.length) snapTrackToStart();
  roleTimer = setInterval(tickWords, ROLE_INTERVAL);
}

function buildWords(){
  if(!swapHost) return;
  stopWords();
  const max = measureWordWidth();
  const track = document.createElement('span');
  track.className = 'role-track';
  roleWords.forEach(w=>{ const s = document.createElement('span'); s.textContent = w; track.appendChild(s); });
  track.appendChild(track.firstElementChild.cloneNode(true));
  swapHost.replaceChildren(track);
  swapHost.style.width = Math.ceil(max) + 'px';
  roleTrack = track;
  roleIndex = 0;
  track.style.transform = 'translateY(0)';
  startRotation();
}

function staticWords(){
  if(!swapHost) return;
  stopWords();
  swapHost.style.width = '';
  const s = document.createElement('span');
  s.id = 'changing-role';
  s.textContent = 'OPERATIONS';
  swapHost.replaceChildren(s);
  roleTrack = null;
  roleIndex = 0;
}

if(swapHost){
  if(prefersReduced.matches) staticWords(); else buildWords();
  const onMotionChange = ()=>{ if(prefersReduced.matches) staticWords(); else buildWords(); };
  if(prefersReduced.addEventListener) prefersReduced.addEventListener('change', onMotionChange);
  else if(prefersReduced.addListener) prefersReduced.addListener(onMotionChange);
}

/* Pause the rotation when the tab is hidden; resume cleanly on return. */
document.addEventListener('visibilitychange',()=>{
  if(document.hidden){ stopWords(); }
  else if(!prefersReduced.matches){ startRotation(); }
});

/* Keep the reserved width correct if the font size changes at a breakpoint. */
let roleResizeTimer = null;
window.addEventListener('resize',()=>{
  clearTimeout(roleResizeTimer);
  roleResizeTimer = setTimeout(()=>{
    if(!swapHost || prefersReduced.matches || !swapHost.querySelector('.role-track')) return;
    swapHost.style.width = Math.ceil(measureWordWidth()) + 'px';
  }, 180);
});

/* =========================================================
   Scroll reveals — replay when a section leaves and returns.
   Uses CSS animation (not transition) so element hover effects
   are never overridden once a reveal has finished.
   States:  hidden = has .reveal | animating = .reveal.in | rest = neither
   ========================================================= */
function initReveals(){
  const items = Array.from(document.querySelectorAll('.reveal'));
  if(!items.length) return;

  const groups = new Map();
  items.forEach(el=>{
    const parent = el.parentElement;
    if(!groups.has(parent)) groups.set(parent, []);
    groups.get(parent).push(el);
  });
  groups.forEach(list=>list.forEach((el,i)=>{ el.dataset.delay = String(Math.min(i * 90, 360)); }));

  const reveal = el=>{
    if(el.classList.contains('in')) return;
    el.style.animationDelay = (el.dataset.delay || 0) + 'ms';
    if(!el.classList.contains('reveal')) el.classList.add('reveal');
    el.classList.add('in');
  };
  const reset = el=>{
    el.classList.remove('in');
    el.style.animationDelay = '';
    el.classList.add('reveal');
  };

  items.forEach(el=>{
    el.addEventListener('animationend', event=>{
      if(event.animationName !== 'revealIn') return;
      el.classList.remove('reveal','in');
      el.style.animationDelay = '';
    });
  });

  if(!('IntersectionObserver' in window)){
    items.forEach(el=>el.classList.remove('reveal'));
    return;
  }

  const enterObs = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{ if(entry.isIntersecting) reveal(entry.target); });
  }, {threshold:.12, rootMargin:'0px 0px -8% 0px'});

  const exitObs = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{ if(!entry.isIntersecting) reset(entry.target); });
  }, {threshold:0, rootMargin:'150px 0px 150px 0px'});

  items.forEach(el=>{ enterObs.observe(el); exitObs.observe(el); });

  /* Ensure anything currently on screen is visible (used after Back/Forward). */
  window.__revealSync = ()=>{
    const vh = window.innerHeight;
    items.forEach(el=>{
      const r = el.getBoundingClientRect();
      if(r.top < vh * .92 && r.bottom > vh * .08 && el.classList.contains('reveal')) reveal(el);
    });
  };
}

/* =========================================================
   Hero entrance replay
   ========================================================= */
const heroSection = document.querySelector('.hero');
function replayHero(){
  if(!heroSection || prefersReduced.matches) return;
  heroSection.classList.remove('hero-animate');
  void heroSection.offsetWidth;
  heroSection.classList.add('hero-animate');
}

/* Back/Forward (bfcache) — keep content visible and replay the entrance. */
window.addEventListener('pageshow',event=>{
  if(event.persisted){
    replayHero();
    if(typeof window.__revealSync === 'function') window.__revealSync();
  }
});

/* =========================================================
   Contact — copy email + footer year
   ========================================================= */
const copyBtn = document.getElementById('copy-email');
if(copyBtn){
  copyBtn.addEventListener('click',async()=>{
    const status = document.getElementById('copy-status');
    try{
      if(!navigator.clipboard) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText('fatmaabdulla858@gmail.com');
      if(status) status.textContent = 'Email address copied.';
    }catch{
      if(status) status.textContent = 'Please copy: fatmaabdulla858@gmail.com';
    }
  });
}

const yearEl = document.getElementById('year');
if(yearEl) yearEl.textContent = new Date().getFullYear();

/* =========================================================
   Boot
   ========================================================= */
if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initReveals);
else initReveals();
