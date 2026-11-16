/* FS interactive lab — UI: editor, stepping, memory boxes, trace table, console, challenges */
(function () {
'use strict';
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const bidi = (t) => t.replace(/([A-Za-z][A-Za-z0-9+_\[\]-]*)/g, '<bdi>$1</bdi>');
const store = {
  get(k, d) { try { const v = localStorage.getItem('fslab.' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('fslab.' + k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } },
};

/* ---------------- editor ---------------- */
const code = $('code'), hl = $('hl'), gutter = $('gutter'), wrap = $('wrap'), lnbar = $('lnbar');
const KW = new Set(['return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'default', 'break', 'continue', 'using', 'namespace', 'const', 'true', 'false']);
const TY = new Set(['int', 'double', 'float', 'char', 'bool', 'string', 'void', 'long', 'short', 'unsigned', 'auto']);
const LIB = new Set(['cout', 'cin', 'endl', 'std', 'main', 'pow', 'sqrt', 'abs', 'static_cast']);
const TOK = /(\/\/.*$)|(#.*$)|("(?:[^"\\]|\\.)*"?)|('(?:[^'\\]|\\.)*'?)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_]\w*)|(\s+)|(.)/gm;
function colorize(src) {
  let out = '', m;
  TOK.lastIndex = 0;
  while ((m = TOK.exec(src))) {
    const s = esc(m[0]);
    if (m[1]) out += `<span class="cm">${s}</span>`;
    else if (m[2]) out += `<span class="pp">${s}</span>`;
    else if (m[3] || m[4]) out += `<span class="s">${s}</span>`;
    else if (m[5]) out += `<span class="n">${s}</span>`;
    else if (m[6]) out += KW.has(m[6]) ? `<span class="k">${s}</span>` : TY.has(m[6]) ? `<span class="t">${s}</span>` : LIB.has(m[6]) ? `<span class="lib">${s}</span>` : `<span class="id">${s}</span>`;
    else out += s;
  }
  return out;
}
let curLine = null, errLine = null;
function paint() {
  const src = code.value;
  hl.innerHTML = colorize(src) + '\n';
  const n = src.split('\n').length;
  let g = '';
  for (let i = 1; i <= n; i++) g += `<div class="${i === curLine ? 'cur' : i === errLine ? 'err' : ''}">${i}</div>`;
  gutter.innerHTML = g;
  // size textarea to content so the wrapper scrolls both layers together
  code.style.height = 'auto';
  code.style.height = Math.max(code.scrollHeight, wrap.clientHeight) + 'px';
  code.style.width = 'auto';
  code.style.width = Math.max(code.scrollWidth, wrap.clientWidth) + 'px';
  placeBar();
}
function lineH() { return parseFloat(getComputedStyle(code).lineHeight); }
function placeBar() {
  const L = curLine || errLine;
  if (!L) { lnbar.style.display = 'none'; return; }
  lnbar.style.display = 'block';
  lnbar.className = 'lnbar' + (!curLine && errLine ? ' err' : '');
  lnbar.style.top = (12 + (L - 1) * lineH()) + 'px';
  lnbar.style.width = Math.max(code.scrollWidth, wrap.clientWidth) + 'px';
}
function scrollToLine(L) {
  const y = 12 + (L - 1) * lineH();
  if (y < wrap.scrollTop + 10 || y > wrap.scrollTop + wrap.clientHeight - 40) wrap.scrollTop = Math.max(0, y - wrap.clientHeight / 3);
}
wrap.addEventListener('scroll', () => { gutter.scrollTop = wrap.scrollTop; });
code.addEventListener('input', () => { if (session) resetRun(); errLine = null; paint(); saveCode(); });
code.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    e.preventDefault();
    const s = code.selectionStart;
    code.setRangeText('    ', s, code.selectionEnd, 'end');
    code.dispatchEvent(new Event('input'));
  } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault(); runAllNow();
  } else if (e.key === 'Enter') {
    const s = code.selectionStart, before = code.value.slice(0, s);
    const ind = (before.split('\n').pop().match(/^\s*/) || [''])[0] + (/\{\s*$/.test(before) ? '    ' : '');
    e.preventDefault();
    code.setRangeText('\n' + ind, s, code.selectionEnd, 'end');
    code.dispatchEvent(new Event('input'));
  } else if (e.key === '}') {
    const s = code.selectionStart, lineStart = code.value.lastIndexOf('\n', s - 1) + 1;
    if (/^\s{4,}$/.test(code.value.slice(lineStart, s))) { e.preventDefault(); code.setRangeText('}', s - 4, s, 'end'); code.dispatchEvent(new Event('input')); }
  }
});
window.addEventListener('resize', paint);

/* ---------------- lessons + navigation (hash routes: #/ · #/c/<i> · #/l/<id>/<tab>/<k>) ---------------- */
const LESSONS = window.FS_LESSONS;
let lesson = LESSONS[0], item = null, solved = store.get('solved', {});
const COURSES = [...new Set(LESSONS.map((L) => L.course))];
const COURSE_INFO = {
  'برمجة 1': { sub: 'المتغيرات، والعمليات الحسابية، والشروط، والحلقات، والمصفوفات الأحادية.', c: '#2dd4bf' },
  'برمجة 2': { sub: 'الدوال، والمصفوفات الأحادية والثنائية، والنصوص، والمؤشرات، والذاكرة الديناميكية، والسجلات.', c: '#3b82f6' },
  'هياكل البيانات': { sub: 'القوائم المترابطة، والمكدس، والطابور، والاستدعاء الذاتي، والأشجار، والترتيب والبحث.', c: '#f59e42' },
};
const cinfo = (c) => COURSE_INFO[c] || { sub: '', c: '#2dd4bf' };
const QN = 10;                                           // questions per quiz attempt (drawn from the lesson's bank)
let seen = store.get('seen', {}), tab = 'concept', traceItem = null;
const strip = (s) => String(s).replace(/<[^>]*>/g, '');
const solvedIn = (L) => L.challenges.filter((c) => solved[c.id]).length;
const nQuiz = (L) => (L.quiz || []).length;
const quizBest = (L) => { const b = store.get('quiz.' + L.id, null); return b === null ? null : typeof b === 'number' ? { s: b, n: nQuiz(L) } : b; };
const lessonsOf = (c) => LESSONS.filter((L) => L.course === c);
function lessonProg(L) {
  const ex = L.examples.filter((x) => seen[x.id]).length, ch = solvedIn(L), b = quizBest(L);
  const tot = L.examples.length + L.challenges.length + (nQuiz(L) ? 1 : 0);
  return { ex, ch, b, pc: tot ? (ex + ch + (b && b.s / b.n >= .8 ? 1 : 0)) / tot : 0 };
}
const courseProg = (c) => { const Ls = lessonsOf(c); return Ls.reduce((a, L) => a + lessonProg(L).pc, 0) / Ls.length; };
const pct = (x) => `<bdi dir="ltr">${Math.round(100 * x)}%</bdi>`;
const href = (L, t, k) => '#/l/' + L.id + (t ? '/' + t : '') + (k != null ? '/' + k : '');
function go(h) { if (location.hash === h) route(); else location.hash = h; }
const itemsOf = (t) => (t === 'ch' ? lesson.challenges : t === 'trace' ? [traceItem] : lesson.examples);

function show(v) {
  ['vHome', 'vCourse', 'vLesson'].forEach((id) => { $(id).hidden = id !== v; });
  document.body.dataset.view = v;
  setMenu(false);
}
function setMenu(on) { document.body.classList.toggle('menu-open', on); $('menuBtn').setAttribute('aria-expanded', on); }
$('menuBtn').onclick = () => setMenu(!document.body.classList.contains('menu-open'));
function renderNav(active) {
  $('nav').innerHTML = `<a href="#/" class="${active === 'home' ? 'on' : ''}">الرئيسية</a>` +
    COURSES.map((c, i) => `<a href="#/c/${i}" class="${active === c ? 'on' : ''}" style="--c:${cinfo(c).c}">${esc(c)}</a>`).join('');
}
const bar = (x, c) => `<div class="bar"><i style="width:${Math.round(100 * x)}%;${c ? 'background:' + c : ''}"></i></div>`;

/* ---- home ---- */
function viewHome() {
  show('vHome'); renderNav('home'); document.title = 'FS_Lab · مختبر C++ التفاعلي';
  const lastH = store.get('last', ''), last = parseHash(lastH), lastL = last[0] === 'l' && LESSONS.find((L) => L.id === last[1]);
  const nQ = LESSONS.reduce((a, L) => a + nQuiz(L), 0), nC = LESSONS.reduce((a, L) => a + L.challenges.length, 0), nE = LESSONS.reduce((a, L) => a + L.examples.length, 0);
  const cont = lastL
    ? `<a class="btn main big" href="${lastH}">تابع من حيث توقفت <i>←</i></a>`
    : `<a class="btn main big" href="${href(LESSONS[0])}">ابدأ من الدرس الأول <i>←</i></a>`;
  $('vHome').innerHTML = `
  <section class="hero">
    <div class="hero-t">
      <span class="eyebrow">مختبر <bdi dir="ltr">C++</bdi> التفاعلي</span>
      <h1>افهم ما يحدث <em>داخل</em> برنامجك، سطرًا بسطر</h1>
      <p>اختر مثالًا أو اكتب برنامجك، ثم نفّذه خطوة بخطوة: ترى قيمة كل متغير في الذاكرة، ونتيجة كل شرط، وجدول تتبّع الحلقات، وما يظهر على الشاشة، مع شرح بالعربية لكل خطوة.</p>
      <div class="cta">${cont}<a class="btn big ghost" href="#/c/0" id="toCourses">تصفّح المواد</a></div>
      ${lastL ? `<div class="last">آخر درس فتحته: <a href="${lastH}">${bidi(lastL.title)}</a> <span>· ${esc(lastL.course)}</span></div>` : ''}
    </div>
    <div class="demo" aria-hidden="true">
      <div class="demo-bar"><i></i><i></i><i></i><span>main.cpp</span></div>
      <div class="demo-code"><div><em>1</em><span class="t">int</span> <span class="id">x</span> = <span class="n">5</span>;</div><div class="on"><em>2</em><span class="id">x</span> = <span class="id">x</span> * <span class="n">2</span>;</div><div><em>3</em><span class="lib">cout</span> &lt;&lt; <span class="id">x</span>;</div></div>
      <div class="demo-side">
        <div class="demo-msg"><span class="sn">2</span> تُحسب قيمة <code>x * 2</code> وتُخزَّن في <code>x</code>، فتصبح 10.</div>
        <div class="demo-mem"><div class="var chg"><div class="nm">x</div><div class="bx">10</div><div class="ty">int</div></div></div>
      </div>
    </div>
  </section>
  <section class="stats">
    <div><b>${LESSONS.length}</b><span>درسًا تفاعليًا</span></div>
    <div><b>${nE}</b><span>مثالًا يُنفَّذ خطوة بخطوة</span></div>
    <div><b>${nC}</b><span>سؤالًا مقاليًا يُصحَّح تلقائيًا</span></div>
    <div><b>${nQ}</b><span>سؤال اختبار ذاتي</span></div>
  </section>
  <section class="sec" id="courses">
    <h2>المواد</h2>
    <div class="courses">${COURSES.map((c, i) => {
      const Ls = lessonsOf(c), p = courseProg(c), info = cinfo(c);
      return `<a class="ccard" href="#/c/${i}" style="--c:${info.c}">
        <span class="cc-n">${String(i + 1).padStart(2, '0')}</span>
        <h3>${esc(c)}</h3><p>${info.sub}</p>
        <div class="cc-meta">${Ls.length} دروس · ${Ls.reduce((a, L) => a + L.examples.length, 0)} مثالًا · ${Ls.reduce((a, L) => a + nQuiz(L) + L.challenges.length, 0)} سؤالًا</div>
        ${bar(p, info.c)}<div class="cc-f"><span>${p ? pct(p) + ' مكتمل' : 'لم تبدأ بعد'}</span><b>ادخل ←</b></div>
      </a>`;
    }).join('')}</div>
  </section>
  <section class="sec">
    <h2>كيف تتعلّم في <bdi dir="ltr">FS_Lab</bdi>؟</h2>
    <ol class="how">
      <li><b>اقرأ الفكرة</b><span>شرح مختصر لمفهوم الدرس في بطاقة واحدة.</span></li>
      <li><b>نفّذ الأمثلة</b><span>خطوة بخطوة، وارجع أو انتقل إلى أي خطوة من شريط الخطوات.</span></li>
      <li><b>حلّ الأسئلة المقالية</b><span>اكتب البرنامج، ويُختبر حلّك على أكثر من إدخال.</span></li>
      <li><b>اختبر نفسك</b><span>عشرة أسئلة عشوائية في كل محاولة، ونتيجتك فورًا.</span></li>
    </ol>
    <p class="note">يُحفظ تقدّمك على هذا الجهاز تلقائيًا، ولا يُرسَل الكود إلى أي خادم.</p>
  </section>`;
  $('toCourses').onclick = (e) => { e.preventDefault(); $('courses').scrollIntoView({ behavior: 'smooth' }); };
}

/* ---- course: lesson cards ---- */
function viewCourse(i) {
  const c = COURSES[i] || COURSES[0], info = cinfo(c), Ls = lessonsOf(c), p = courseProg(c);
  show('vCourse'); renderNav(c); document.title = c + ' · FS_Lab';
  $('vCourse').innerHTML = `
  <section class="chead" style="--c:${info.c}">
    <nav class="crumbs"><a href="#/">الرئيسية</a><i>/</i><span>${esc(c)}</span></nav>
    <h1>${esc(c)}</h1><p>${info.sub}</p>
    <div class="cprog">${bar(p, info.c)}<span>${pct(p)} مكتمل · ${Ls.length} دروس</span></div>
  </section>
  <section class="lgrid">${Ls.map((L, k) => {
    const g = lessonProg(L), st = g.pc >= 1 ? 'done' : g.pc > 0 ? 'go' : '';
    return `<a class="lcard ${st}" href="${href(L)}" style="--c:${info.c}">
      <div class="lc-top"><span class="lc-n">${g.pc >= 1 ? '✓' : k + 1}</span><span class="ltag">${esc(L.tag)}</span>${st ? `<span class="lc-st">${st === 'done' ? 'مكتمل' : 'قيد التعلّم'}</span>` : ''}</div>
      <h3>${bidi(L.title)}</h3>
      <ul class="lc-meta">
        <li><b>${g.ex}/${L.examples.length}</b> أمثلة</li>
        ${L.challenges.length ? `<li><b>${g.ch}/${L.challenges.length}</b> أسئلة مقالية</li>` : ''}
        ${nQuiz(L) ? `<li>${g.b ? `<b>${g.b.s}/${g.b.n}</b> أفضل نتيجة` : `<b>${nQuiz(L)}</b> سؤال اختبار`}</li>` : ''}
      </ul>
      ${bar(g.pc, info.c)}
    </a>`;
  }).join('')}</section>`;
  window.scrollTo(0, 0);
}

/* ---- lesson: header + tabs, concept, quiz card, workspace ---- */
function renderLHead() {
  const L = lesson, i = COURSES.indexOf(L.course), info = cinfo(L.course), Ls = lessonsOf(L.course), k = Ls.indexOf(L);
  const idx = LESSONS.indexOf(L), prev = LESSONS[idx - 1], next = LESSONS[idx + 1], g = lessonProg(L);
  const T = [['concept', 'الفكرة', ''], ['ex', 'الأمثلة', `${g.ex}/${L.examples.length}`]];
  if (L.challenges.length) T.push(['ch', 'الأسئلة المقالية', `${g.ch}/${L.challenges.length}`]);
  if (nQuiz(L)) T.push(['quiz', 'اختبر نفسك', g.b ? `${g.b.s}/${g.b.n}` : '']);
  const cur = tab === 'trace' ? 'ex' : tab;
  $('lhead').style.setProperty('--c', info.c);
  $('lhead').innerHTML = `
    <div class="lh-row">
      <nav class="crumbs"><a href="#/">الرئيسية</a><i>/</i><a href="#/c/${i}">${esc(L.course)}</a><i>/</i><span>الدرس ${k + 1} من ${Ls.length}</span></nav>
      <div class="lh-nav">${prev ? `<a class="btn sm ghost" href="${href(prev)}" title="${esc(strip(prev.title))}"><i>→</i> الدرس السابق</a>` : ''}${next ? `<a class="btn sm ghost" href="${href(next)}" title="${esc(strip(next.title))}">الدرس التالي <i>←</i></a>` : ''}</div>
    </div>
    <div class="lh-title"><h1>${bidi(L.title)}</h1><div class="lprog">${bar(g.pc, info.c)}<span>${pct(g.pc)}</span></div></div>
    <nav class="tabs" role="tablist">${T.map(([t, name, n], j) => `<a role="tab" aria-selected="${t === cur}" class="tab ${t === cur ? 'on' : ''}" href="${href(L, t)}"><b>${j + 1}</b><span>${name}</span>${n ? `<span class="cnt"><bdi dir="ltr">${n}</bdi></span>` : ''}</a>`).join('')}</nav>`;
}
function renderConcept() {
  const L = lesson, n = L.examples.length;
  $('lConcept').innerHTML = `<article class="concept-card"><h2>فكرة الدرس</h2><div class="concept">${L.concept}</div></article>
    <div class="next-cta"><a class="btn main big" href="${href(L, 'ex', 0)}">نفّذ الأمثلة خطوة بخطوة <i>←</i></a><span>${n} ${n > 10 ? 'مثالًا' : 'أمثلة'} جاهزة في هذا الدرس</span></div>`;
}
function renderQuizPane() {
  const L = lesson, nq = nQuiz(L), b = quizBest(L), nx = LESSONS[LESSONS.indexOf(L) + 1];
  $('lQuiz').innerHTML = `<article class="quiz-card">
    <h2>اختبر نفسك في «${bidi(L.title)}»</h2>
    <p>في كل محاولة <b>${Math.min(QN, nq)} أسئلة</b> عشوائية من بنك فيه <b>${nq}</b> سؤالًا: اختيار من متعدد، وأسئلة تتبّع تكتب فيها ناتج البرنامج. تظهر الإجابة الصحيحة وسببها بعد كل سؤال.</p>
    ${b ? `<div class="best"><span>أفضل نتيجة لك</span><b><bdi dir="ltr">${b.s} / ${b.n}</bdi></b>${b.s / b.n >= .8 ? '<em>ممتاز</em>' : ''}</div>` : ''}
    <div class="cta"><button class="btn main big" id="quizGo">${b ? 'محاولة جديدة' : 'ابدأ الاختبار'} <i>←</i></button>${nx ? `<a class="btn big ghost" href="${href(nx)}">الدرس التالي</a>` : ''}</div>
  </article>`;
  $('quizGo').onclick = () => startQuiz(L);
}
function renderRail() {
  const list = itemsOf(tab), isCh = tab === 'ch', k = list.indexOf(item);
  const ok = (x) => (isCh ? solved[x.id] : seen[x.id]);
  const n = nextStep();
  $('rail').innerHTML = `<div class="rh"><b>${tab === 'trace' ? 'سؤال تتبّع' : isCh ? 'الأسئلة المقالية' : 'الأمثلة'}</b>${tab === 'trace' ? '' : `<span><bdi dir="ltr">${list.filter(ok).length}/${list.length}</bdi></span>`}</div>
    <div class="rl">${list.map((x, i) => `<a href="${tab === 'trace' ? href(lesson, 'trace') : href(lesson, tab, i)}" class="ri ${x === item ? 'on' : ''} ${ok(x) ? 'ok' : ''}"><span class="ix">${ok(x) ? '✓' : i + 1}</span><span class="rt">${x.title}${x.note ? `<small>${x.note}</small>` : ''}</span></a>`).join('')}</div>
    ${n ? `<a class="rnext" href="${n.href}"><small>بعد ذلك</small>${bidi(esc(n.label))} ←</a>` : ''}`;
  $('itSel').innerHTML = list.map((x, i) => `<option value="${i}" ${x === item ? 'selected' : ''}>${i + 1}. ${esc(strip(x.title))}${ok(x) ? ' ✓' : ''}</option>`).join('');
  $('itSel').disabled = list.length < 2;
  $('itPrev').disabled = k <= 0; $('itNext').disabled = k < 0 || k >= list.length - 1;
}
$('itSel').onchange = () => go(href(lesson, tab, +$('itSel').value));
$('itPrev').onclick = () => { const k = itemsOf(tab).indexOf(item); if (k > 0) go(href(lesson, tab, k - 1)); };
$('itNext').onclick = () => { const l = itemsOf(tab), k = l.indexOf(item); if (k < l.length - 1) go(href(lesson, tab, k + 1)); };
function refreshProgress() { renderLHead(); if (!$('work').hidden) renderRail(); }

function parseHash(h) { return String(h || '').replace(/^#\/?/, '').split('/'); }
function route() {
  if (Q) closeQuiz();
  const p = parseHash(location.hash);
  if (p[0] === 'c') return viewCourse(+p[1] || 0);
  if (p[0] === 'l') { const L = LESSONS.find((x) => x.id === p[1]); if (L) return viewLesson(L, p[2], p[3]); }
  viewHome();
  window.scrollTo(0, 0);
}
function viewLesson(L, t, k) {
  if (!['concept', 'ex', 'ch', 'quiz', 'trace'].includes(t)) t = 'concept';
  if (t === 'ch' && !L.challenges.length) t = 'ex';
  if (t === 'quiz' && !nQuiz(L)) t = 'ex';
  if (t === 'trace' && (!traceItem || L !== lesson)) t = 'ex';
  const moved = L !== lesson || t !== tab || document.body.dataset.view !== 'vLesson';
  lesson = L; tab = t;
  store.set('lesson', L.id); store.set('last', href(L, t));
  show('vLesson'); renderNav(L.course); document.title = strip(L.title) + ' · FS_Lab';
  const work = t === 'ex' || t === 'ch' || t === 'trace';
  $('lConcept').hidden = t !== 'concept'; $('lQuiz').hidden = t !== 'quiz'; $('work').hidden = !work;
  $('work').dataset.tab = t;
  if (t === 'concept') renderConcept();
  if (t === 'quiz') renderQuizPane();
  if (work) {
    const list = itemsOf(t), key = 'idx.' + L.id + '.' + t;
    let j = k === undefined || k === '' ? store.get(key, 0) : +k || 0;
    j = Math.max(0, Math.min(list.length - 1, j));
    const x = list[j];
    if (t !== 'trace') { store.set(key, j); store.set('last', href(L, t, j)); }
    if (x !== item) openItem(x); else { renderRail(); paint(); }
  }
  renderLHead();
  if (moved) window.scrollTo(0, 0);
}
function markSeen() {
  if (!item || !item.id || seen[item.id] || !lesson.examples.includes(item)) return;
  seen[item.id] = true; store.set('seen', seen); refreshProgress();
}
/* what comes after the current item: next example → essays → quiz → next lesson */
function nextStep() {
  const list = itemsOf(tab), k = list.indexOf(item), L = lesson, nx = LESSONS[LESSONS.indexOf(L) + 1];
  if (tab === 'ex' && k < list.length - 1) return { label: 'المثال التالي: ' + strip(list[k + 1].title), href: href(L, 'ex', k + 1) };
  if (tab === 'ch' && k < list.length - 1) return { label: 'السؤال التالي: ' + strip(list[k + 1].title), href: href(L, 'ch', k + 1) };
  if (tab === 'ex' && L.challenges.length) return { label: 'انتقل إلى الأسئلة المقالية', href: href(L, 'ch', 0) };
  if (nQuiz(L)) return { label: 'اختبر نفسك في هذا الدرس', href: href(L, 'quiz') };
  return nx ? { label: 'الدرس التالي: ' + strip(nx.title), href: href(nx) } : null;
}
function nextBtn() {
  const n = nextStep();
  return n ? `<a class="btn main nextb" href="${n.href}">${bidi(esc(n.label))} <i>←</i></a>` : '';
}
function openItem(x) {
  item = x;
  const isCh = !!x.tests;
  const saved = store.get('code.' + x.id, null);
  code.value = (isCh && saved) || x.code;
  $('edKind').textContent = tab === 'trace' ? 'سؤال تتبّع من الاختبار' : isCh ? 'سؤال مقالي' : 'مثال';
  $('edTitle').innerHTML = x.title;
  $('task').className = 'task' + (isCh ? ' on' : '');
  $('task').innerHTML = isCh ? `<b class="t">المطلوب</b><div>${x.task}</div>` : '';
  $('checkrow').className = 'checkrow' + (isCh ? ' on' : '');
  $('bSol').style.display = x.ref ? '' : 'none';
  $('results').className = 'box results';
  errLine = null; resetRun(); renderRail(); paint();
  wrap.scrollTop = 0;
}
function saveCode() { if (item && item.tests) store.set('code.' + item.id, code.value); }

/* ---------------- run session ---------------- */
let session = null, playTimer = null;
function resetRun() {
  stopPlay();
  session = null; curLine = null;
  $('inrow').className = 'inrow';
  renderIdle();
  placeBar(); paintGutterOnly();
}
function paintGutterOnly() {
  [...gutter.children].forEach((d, i) => { d.className = i + 1 === curLine ? 'cur' : i + 1 === errLine ? 'err' : ''; });
}
function renderIdle() {
  $('bStep').classList.add('invite');
  lastOut = 0;
  const sv = item && item.id ? store.get('pos.' + item.id, null) : null;
  const canResume = sv && sv.h === hashCode(code.value) && sv.p > 0;
  $('explain').innerHTML = `${canResume ? `<button class="btn main resume" id="bResume">▶ تابع من حيث توقفت · الخطوة ${sv.p + 1}</button>` : ''}<div class="hint"><p>اضغط <b>خطوة</b> لتنفيذ البرنامج سطرًا بسطر، وسيظهر هنا شرح كل خطوة. يمكنك تعديل الكود في أي وقت.</p>
    <ul class="keys"><li><kbd>←</kbd> خطوة</li><li><kbd>→</kbd> رجوع</li><li><kbd>مسافة</kbd> تشغيل تلقائي</li><li><kbd dir="ltr">Ctrl+Enter</kbd> النتيجة مباشرة</li><li>اضغط <b>رقم السطر</b> للانتقال إلى تنفيذه</li></ul></div>`;
  if (canResume) $('bResume').onclick = () => resumeTo(sv);
  if (typeof updTimeline === 'function') updTimeline();
  $('mem').innerHTML = '<div class="empty">لا توجد متغيرات بعد</div>';
  $('trace').innerHTML = '<div class="none">يظهر الجدول عند تنفيذ حلقة</div>';
  $('traceCap').textContent = '';
  $('console').innerHTML = '';
}
function begin() {
  errLine = null;
  let prog;
  try { prog = FSCpp.compile(code.value); }
  catch (e) { showError(e); return false; }
  const it = new FSCpp.Interp(prog);
  session = { it, gen: it.run(), hist: [], pos: -1, waiting: null, finished: false, transcript: [], error: null, inputs: [], errAt: null };
  ahead();
  return true;
}
/* steps are computed ahead (until input is needed or the program ends) so the student can jump to any step */
const AHEAD = 2500;
function produce() {
  const S = session;
  if (!S || S.waiting || S.finished) return false;
  let r;
  try { r = S.gen.next(); } catch (e) { S.finished = true; S.errAt = e; return false; }
  if (r.done) { S.finished = true; return false; }
  const ev = r.value;
  if (ev.type === 'input') { S.waiting = ev; return false; }
  if (ev.out) S.transcript.push({ t: 'out', s: ev.out });
  S.hist.push({ ev, snap: S.it.snapshot(), tr: S.transcript.slice() });
  if (ev.end) S.finished = true;
  return true;
}
function ahead(n) { let k = 0; while (k < (n || AHEAD) && produce()) k++; updTimeline(); }
function feed(v) {
  const S = session;
  S.it.inbuf += v + '\n';
  S.transcript.push({ t: 'in', s: v + '\n' });
  S.inputs.push(v);
  S.waiting = null;
  ahead();
}
/* jump to a step (index in hist) */
function goTo(p) {
  const S = session;
  if (!S || !S.hist.length) return;
  stopPlay();
  S.pos = Math.max(0, Math.min(p, S.hist.length - 1));
  if (S.hist.length - S.pos < 50) ahead();
  $('inrow').className = 'inrow';
  render();
}
/* timeline: slider over all known steps, green ticks = output printed, red ticks = a condition was false */
let tlMarksFor = null;
function updTimeline() {
  const S = session, r = $('tlR');
  if (!S || !S.hist.length) { $('tl').classList.add('off'); r.max = 0; r.value = 0; $('tlL').textContent = 'شريط الخطوات: اسحبه للانتقال إلى أي مرحلة'; $('tlM').innerHTML = ''; tlMarksFor = null; return; }
  $('tl').classList.remove('off');
  const n = S.hist.length;
  r.max = n - 1; r.value = Math.max(0, S.pos);
  $('tlL').innerHTML = `الخطوة <b>${Math.max(1, S.pos + 1)}</b> من ${n}${S.finished ? '' : S.waiting ? ' <small>(ثم بانتظار الإدخال)</small>' : '+'}`;
  const key = n + ':' + S.finished + ':' + hashCode(code.value);
  if (tlMarksFor === key || n < 2) return;
  tlMarksFor = key;
  let m = '';
  const step = Math.max(1, Math.ceil(n / 300));
  for (let i = 0; i < n; i += step) {
    let kind = '';
    for (let j = i; j < Math.min(n, i + step); j++) { const e = S.hist[j].ev; if (e.out) { kind = 'o'; break; } if (e.cond && !e.cond.ok) kind = 'c'; }
    if (kind) m += `<i class="${kind}" style="right:${100 * i / (n - 1)}%"></i>`;
  }
  $('tlM').innerHTML = m;
}
$('tlR').addEventListener('input', () => {
  if (!session && !begin()) return;
  goTo(+$('tlR').value);
  atEndActions();
});
$('bFirst').onclick = () => { if (!session && !begin()) return; goTo(0); };
$('bLast').onclick = () => {
  if (!session && !begin()) return;
  ahead(25000);
  goTo(session.hist.length - 1);
  atEndActions();
};
/* jump between the times the same line runs (loop rounds, repeated calls) */
function lineOcc(L) {
  const S = session, o = [];
  S.hist.forEach((h, i) => { if (h.ev.line === L) o.push(i); });
  return o;
}
function hopLine(dir) {
  const S = session; if (!S || S.pos < 0) return;
  const L = S.hist[S.pos].ev.line;
  jumpLine(L, dir);
}
function jumpLine(L, dir) {
  if (!session && !begin()) return;
  const S = session;
  const find = () => {
    if (dir < 0) { for (let i = S.pos - 1; i >= 0; i--) if (S.hist[i].ev.line === L) return i; return -1; }
    for (let i = S.pos + 1; i < S.hist.length; i++) if (S.hist[i].ev.line === L) return i;
    return -1;
  };
  let p = find();
  while (p < 0 && dir > 0 && !S.finished && !S.waiting && S.hist.length < 25000) { ahead(); p = find(); }
  if (p < 0) { toast(dir > 0 ? `السطر ${L} لن يُنفَّذ بعد هذه الخطوة${S.waiting ? ' قبل الإدخال' : ''}` : `هذه أول مرة يُنفَّذ فيها السطر ${L}`); return; }
  goTo(p);
}
gutter.addEventListener('click', (e) => {
  const d = e.target.closest('div'); if (!d || d === gutter) return;
  const L = [...gutter.children].indexOf(d) + 1;
  if (L > 0) jumpLine(L, 1);
});
gutter.title = 'اضغط رقم السطر للانتقال إلى المرة التالية التي يُنفَّذ فيها';
/* remember where the student stopped (per example / question), and offer to continue from there */
const hashCode = (s) => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return h; };
function savePos() {
  const S = session; if (!S || !item || !item.id || S.pos < 1) return;
  store.set('pos.' + item.id, { h: hashCode(code.value), p: S.pos, in: S.inputs });
}
function resumeTo(sv) {
  resetRun();
  if (!begin()) return;
  const S = session; let k = 0;
  S.usedPreset = true;
  while (S.hist.length <= sv.p && S.waiting && k < sv.in.length) feed(sv.in[k++]);
  goTo(sv.p);
  atEndActions();
}
function atEndActions() {                // reached the last known step: ask for input or show the error
  const S = session;
  if (S.pos < S.hist.length - 1) return;
  if (S.waiting) askInput(S.waiting);
  else if (S.errAt) showError(S.errAt);
}
function showError(e) {
  if (!(e instanceof FSCpp.CppError)) { console.error(e); e = { message: 'حدث خطأ غير متوقع في المختبر', line: null }; }
  stopPlay();
  errLine = e.line; curLine = null;
  if (session) { session.error = e; session.finished = true; }
  $('explain').innerHTML = `<div class="stepno"><span>خطأ</span></div><div class="error"><b>خطأ${e.line ? ' في السطر ' + e.line : ''}:</b> ${e.message}</div>`;
  $('inrow').className = 'inrow';
  paint();
  if (e.line) scrollToLine(e.line);
}
function forward() {
  if (!session && !begin()) return false;
  const S = session;
  if (S.pos >= S.hist.length - 1) ahead();
  if (S.pos < S.hist.length - 1) { S.pos++; if (S.hist.length - S.pos < 50) ahead(); render(); return true; }
  if (S.waiting) { askInput(S.waiting); return false; }
  if (S.errAt) { showError(S.errAt); return false; }
  return false;
}
function back() {
  if (!session || session.pos <= 0) return;
  stopPlay();
  session.pos--;
  if (session.waiting) $('inrow').className = 'inrow';
  render();
}
function askInput(ev) {
  curLine = ev.line; paintGutterOnly(); placeBar(); scrollToLine(ev.line);
  $('explain').innerHTML = `<div class="stepno"><span>بانتظار الإدخال</span></div><div class="msg">${ev.msg}</div>`;
  const preset = item && item.input && !session.usedPreset ? item.input : '';
  $('inrow').className = 'inrow on';
  const f = $('inField');
  f.value = preset;
  f.focus();
  renderConsole(session.transcript, true);
}
function sendInput() {
  const S = session;
  if (!S || !S.waiting) return;
  const v = $('inField').value;
  if (!v.trim()) { $('inField').focus(); return; }
  S.usedPreset = true;
  feed(v);
  $('inrow').className = 'inrow';
  forward();
  if (S.running) runRest();
  else if (playTimer === null && S.autoplay) play();
}
$('inSend').onclick = sendInput;
$('inField').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); sendInput(); } });

function render() {
  const S = session, h = S.hist[S.pos];
  const ev = h.ev;
  curLine = ev.line; errLine = null;
  paintGutterOnly(); placeBar();
  if (ev.line) scrollToLine(ev.line);
  $('bStep').classList.remove('invite');
  const isEnd = S.finished && S.pos === S.hist.length - 1;
  const total = isEnd ? ' · انتهى البرنامج' : '';
  let html = `<div class="stepno"><span>الخطوة <b class="sn">${S.pos + 1}</b>${total}</span><span>${ev.line ? 'السطر ' + ev.line : ''}</span></div><div class="msg">${ev.msg}</div>`;
  if (isEnd) {
    html += `<div class="fin">✓ انتهى تنفيذ البرنامج في ${S.hist.length} خطوة${item && !item.tests && tab === 'ex' ? nextBtn() : ''}</div>`;
  }
  if (ev.cond) html += `<div class="pill ${ev.cond.ok ? 'yes' : 'no'}">${esc(ev.cond.text)}<span>${ev.cond.ok ? 'صح' : 'خطأ'}</span></div>`;
  if (ev.warn) html += ev.warn.map((w) => `<div class="warn">${w}</div>`).join('');
  if (ev.line) {
    const occ = lineOcc(ev.line), k = occ.indexOf(S.pos);
    if (occ.length > 1 || !S.finished) html += `<div class="hop"><span>نُفِّذ السطر ${ev.line} هنا للمرة <b>${k + 1}</b> من ${occ.length}${S.finished ? '' : '+'}</span>
      <button class="btn" id="hopP" ${k <= 0 ? 'disabled' : ''}>→ المرة السابقة</button><button class="btn" id="hopN" ${k === occ.length - 1 && S.finished ? 'disabled' : ''}>المرة التالية ←</button></div>`;
  }
  $('explain').innerHTML = html;
  if ($('hopP')) { $('hopP').onclick = () => hopLine(-1); $('hopN').onclick = () => hopLine(1); }
  updTimeline(); savePos();
  if (isEnd && item && !item.tests) markSeen();
  renderMem(h.snap.frames, h.snap.heap, h.snap.structures);
  renderTrace(h.snap.loop);
  renderConsole(h.tr, S.pos === S.hist.length - 1 && !S.finished);
}
/* ---- memory: values, pointers, arrays, structs, heap, linked structures ---- */
function cls(d, extra) { return [extra || '', d.chg ? 'chg' : '', d.garbage ? 'garb' : '', d.freed ? 'freed' : ''].join(' '); }
function descHtml(d) {
  if (d.kind === 'val') return `<div class="bx ${cls(d)}">${esc(d.show)}</div>`;
  if (d.kind === 'ptr') return `<div class="bx ptr ${cls(d)} ${d.null ? 'null' : ''} ${d.dangling ? 'dangling' : ''}">${esc(d.show)}</div>`;
  if (d.kind === 'chars') return `<div class="cells">${d.cells.map((c, i) => `<div class="cl ${c.chg ? 'chg' : ''} ${c.garbage ? 'garb' : ''}"><div class="cv">${esc(c.show)}</div><div class="ci">${i}</div></div>`).join('')}</div>`;
  if (d.kind === 'arr') {
    const kids = d.cells;
    if (kids.length && kids[0].kind === 'arr') {             // 2D grid
      const C = kids[0].cells.length;
      let g = `<div class="grid" style="grid-template-columns: 22px repeat(${C}, auto)"><div></div>`;
      for (let j = 0; j < C; j++) g += `<div class="ci">${j}</div>`;
      kids.forEach((row, i) => { g += `<div class="ci">${i}</div>`; row.cells.forEach((c) => { g += `<div class="cl ${c.chg ? 'chg' : ''} ${c.garbage ? 'garb' : ''}"><div class="cv">${esc(c.show)}</div></div>`; }); });
      return g + '</div>';
    }
    if (kids.length && kids[0].kind === 'struct') return `<div class="sarr">${kids.map((c, i) => `<div class="sitem"><div class="ci">[${i}]</div>${descHtml(c)}</div>`).join('')}</div>`;
    return `<div class="cells">${kids.map((c, i) => `<div class="cl ${c.chg ? 'chg' : ''} ${c.garbage ? 'garb' : ''} ${c.kind === 'ptr' ? 'p' : ''}"><div class="cv">${esc(c.show)}</div><div class="ci">${i}</div></div>`).join('')}</div>`;
  }
  if (d.kind === 'struct') return `<div class="st ${cls(d)}"><div class="sth">${esc(d.name)}</div>${d.fields.map((f) => `<div class="sf"><span class="fn">${esc(f.name)}</span>${descHtml(f.d)}</div>`).join('')}</div>`;
  return '';
}
function varHtml(v) {
  const nm = `<div class="nm">${esc(v.name)}</div>`;
  if (v.kind === 'aref') return `<div class="var ref">${nm}<div class="bx">→ ${esc(v.to)}</div><div class="ty">المصفوفة نفسها</div></div>`;
  if (v.kind === 'ref') return `<div class="var ref ${v.d.chg ? 'chg' : ''}">${nm}${descHtml(v.d)}<div class="ty">${esc(v.type)} → ${esc(v.to)}</div></div>`;
  const k = v.d.kind;
  return `<div class="var ${k === 'arr' || k === 'chars' ? 'arr' : ''} ${k === 'struct' ? 'stv' : ''} ${v.isConst ? 'const' : ''} ${v.d.chg ? 'chg' : ''}">${nm}${descHtml(v.d)}<div class="ty">${v.isConst ? 'const ' : ''}${esc(v.type)}</div></div>`;
}
function chainHtml(s) {
  const link = s.doubly ? '<span class="lk dbl"><i>→</i><i>←</i></span>' : '<span class="lk">→</span>';
  const nodes = s.nodes.map((n) => `<div class="ln ${n.chg ? 'chg' : ''}"><div class="lnames">${n.names.map(esc).join(' · ') || '&nbsp;'}</div><div class="lbox"><span class="ld">${esc(n.data)}</span><span class="lp">•</span></div><div class="lid">${n.id}</div></div>`);
  const end = s.circular ? `<div class="lend circ">↩ ${esc(s.circular)}</div>` : s.joins ? `<div class="lend circ">${esc(s.joins)}</div>` : '<div class="lend">nullptr</div>';
  return `<div class="chain">${nodes.join(link)}${link}${end}</div>`;
}
function treeHtml(n) {
  if (!n) return '<div class="tn"><div class="tnull">∅</div></div>';
  const kids = n.left || n.right ? `<div class="tch"><div class="tc">${treeHtml(n.left)}</div><div class="tc">${treeHtml(n.right)}</div></div>` : '';
  return `<div class="tn"><div class="tnames">${n.names.map(esc).join(' · ')}</div><div class="tnode ${n.chg ? 'chg' : ''}" title="${n.id}">${esc(n.data)}</div>${kids}</div>`;
}
function renderMem(frames, heap, structures) {
  let html = '';
  if (structures && structures.length) {
    html += `<div class="frame structs"><div class="fh">رسم الهيكل <span>· العقد في الذاكرة الديناميكية والمؤشرات التي تشير إليها</span></div><div class="sv">${structures.map((s) => (s.kind === 'tree' ? `<div class="tree">${treeHtml(s.root)}</div>` : chainHtml(s))).join('')}</div></div>`;
  }
  const real = frames.filter((f) => f.vars.length || f.current);
  const many = real.length > 1;
  if (!real.some((f) => f.vars.length) && !(heap && heap.length)) { $('mem').innerHTML = '<div class="empty">لا توجد متغيرات بعد</div>'; return; }
  html += real.map((f) => `<div class="frame ${many && f.current ? 'cur' : ''} ${f.global ? 'glob' : ''} ${many || (heap && heap.length) ? '' : 'plain'}">
    ${many || (heap && heap.length) ? `<div class="fh">${f.global ? 'المتغيرات العامة' : f.title === 'main' ? 'الدالة main' : 'الدالة ' + esc(f.title)}${f.callLine ? ` <span>· استُدعيت من السطر ${f.callLine}</span>` : ''}</div>` : ''}
    <div class="fv">${f.vars.length ? f.vars.map(varHtml).join('') : '<div class="empty">لا توجد متغيرات</div>'}</div></div>`).join('');
  if (heap && heap.length) {
    html += `<div class="frame heap"><div class="fh">الذاكرة الديناميكية (heap) <span>· ما حُجز بـ new</span></div><div class="fv">${heap.map((h) =>
      `<div class="var hp ${h.freed ? 'freed' : ''} ${h.d.chg ? 'chg' : ''}"><div class="nm">${esc(h.label)}${h.freed ? ' · محذوفة' : ''}</div>${descHtml(h.d)}<div class="ty">${esc(h.type)}</div></div>`).join('')}</div></div>`;
  }
  $('mem').innerHTML = html;
}
function renderTrace(L) {
  if (!L || !L.rows.length) { $('trace').innerHTML = '<div class="none">يظهر الجدول عند تنفيذ حلقة</div>'; $('traceCap').textContent = ''; return; }
  const kind = { for: 'for', while: 'while', dowhile: 'do-while' }[L.kind];
  $('traceCap').textContent = `· حلقة ${kind} في السطر ${L.line}`;
  const cols = L.tracked;
  let t = `<table><tr><th>#</th>${cols.map((c) => `<th>${esc(c)}</th>`).join('')}<th>${esc(L.cond)}</th><th>النتيجة</th></tr>`;
  L.rows.forEach((r, i) => {
    t += `<tr class="${i === L.rows.length - 1 ? 'last' : ''}"><td>${r.n}</td>${cols.map((c) => `<td>${esc(r.vals[c] ?? '')}</td>`).join('')}<td>${esc(r.before)}</td><td class="${r.ok ? 'yes' : 'no'}">${r.ok ? 'صح' : 'خطأ'}</td></tr>`;
  });
  $('trace').innerHTML = t + '</table>';
  const tr = $('trace'); tr.scrollTop = tr.scrollHeight;
}
let lastOut = 0;                       // transcript length last drawn, to flash only new output
function renderConsole(tr, live) {
  const grew = tr.length > lastOut;
  const html = tr.map((x, i) => {
    const nw = grew && i >= lastOut ? ' new' : '';
    return x.t === 'in' ? `<span class="in${nw}">${esc(x.s)}</span>` : nw ? `<span class="${nw.trim()}">${esc(x.s)}</span>` : esc(x.s);
  }).join('');
  lastOut = tr.length;
  $('console').innerHTML = html + (live ? '<span class="cursor"></span>' : '');
  const c = $('console'); c.scrollTop = c.scrollHeight;
}

/* ---------------- controls ---------------- */
function delay() { return 1700 - (+$('speed').value) * 150; }
function play() {
  if (!session && !begin()) return;
  session.autoplay = true;
  $('bPlay').innerHTML = '⏸ <span>إيقاف</span>';
  const tick = () => {
    const ok = forward();
    if (!ok) { stopPlay(session && session.waiting ? 'wait' : null); return; }
    playTimer = setTimeout(tick, delay());
  };
  playTimer = setTimeout(tick, 50);
}
function stopPlay(reason) {
  if (playTimer) clearTimeout(playTimer);
  playTimer = null;
  if (session && reason !== 'wait') session.autoplay = false;
  $('bPlay').innerHTML = '▶ <span>تلقائي</span>';
}
function runRest() {
  const S = session;
  S.running = true;
  while (forward()) { if (S.hist.length > 25000) break; }
  if (!S.waiting) S.running = false;
}
function runAllNow() {
  stopPlay();
  resetRun();
  if (!begin()) return;
  runRest();
}
$('bStep').onclick = () => { stopPlay(); forward(); };
$('bBack').onclick = back;
$('bPlay').onclick = () => (playTimer ? stopPlay() : play());
$('bRun').onclick = runAllNow;
$('bReset').onclick = () => { if (item && item.id) store.set('pos.' + item.id, null); errLine = null; resetRun(); paint(); };
document.addEventListener('keydown', (e) => {
  if (Q || $('work').hidden || document.activeElement === code || /^(INPUT|TEXTAREA)$/.test((document.activeElement || {}).tagName)) return;
  if (e.key === 'ArrowLeft' || e.key === 'F10') { e.preventDefault(); stopPlay(); forward(); }
  if (e.key === 'ArrowRight') { e.preventDefault(); back(); }
  if (e.key === 'Home') { e.preventDefault(); $('bFirst').click(); }
  if (e.key === 'End') { e.preventDefault(); $('bLast').click(); }
  if (e.key === ' ' && !(document.activeElement && document.activeElement.tagName === 'BUTTON')) { e.preventDefault(); playTimer ? stopPlay() : play(); }
});

/* ---------------- celebration ---------------- */
const calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
function toast(html) {
  const t = document.createElement('div');
  t.className = 'toast'; t.innerHTML = html;
  document.body.appendChild(t);
  setTimeout(() => t.classList.add('out'), 2600);
  setTimeout(() => t.remove(), 3200);
}
function confetti() {
  if (calm) return;
  const cv = document.createElement('canvas'), W = innerWidth, H = innerHeight;
  cv.className = 'confetti'; cv.width = W; cv.height = H;
  document.body.appendChild(cv);
  const g = cv.getContext('2d'), cols = ['#2dd4bf', '#facc15', '#f59e42', '#3b82f6', '#6ee7b7', '#ecf0f6'];
  const P = Array.from({ length: 140 }, () => ({
    x: W / 2 + (Math.random() - .5) * 200, y: H * .55, vx: (Math.random() - .5) * 16, vy: -Math.random() * 18 - 6,
    r: Math.random() * 6 + 4, a: Math.random() * 6, va: (Math.random() - .5) * .4, c: cols[Math.random() * cols.length | 0] }));
  const t0 = performance.now();
  (function frame(t) {
    const k = (t - t0) / 1800;
    g.clearRect(0, 0, W, H);
    P.forEach((p) => {
      p.vy += .5; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.a += p.va;
      g.save(); g.globalAlpha = Math.max(0, 1 - k); g.translate(p.x, p.y); g.rotate(p.a);
      g.fillStyle = p.c; g.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); g.restore();
    });
    if (k < 1) requestAnimationFrame(frame); else cv.remove();
  })(t0);
}

/* ---------------- challenges ---------------- */
const norm = (s) => s.replace(/\r/g, '').split('\n').map((l) => l.replace(/\s+$/, '')).join('\n').replace(/\n+$/, '');
$('bCheck').onclick = () => {
  if (!item || !item.tests) return;
  let pass = 0;
  const rows = item.tests.map((t, i) => {
    const r = FSCpp.runAll(code.value, t.input);
    const ok = !r.error && norm(r.output) === norm(t.output);
    if (ok) pass++;
    return `<div class="t ${ok ? 'ok' : 'bad'}"><b>${ok ? '✓' : '✗'} الاختبار ${i + 1}</b>
      ${t.input ? `<div>المدخلات:</div><pre>${esc(t.input)}</pre>` : ''}
      <div>الناتج المتوقع:</div><pre>${esc(t.output)}</pre>
      ${ok ? '' : r.error ? `<div>حدث خطأ${r.line ? ' في السطر ' + r.line : ''}: ${r.error}</div>` : `<div>ناتج برنامجك:</div><pre>${esc(r.output) || '(لا شيء)'}</pre>`}</div>`;
  });
  const all = pass === item.tests.length;
  if (all) {
    const first = !solved[item.id];
    solved[item.id] = true; store.set('solved', solved); refreshProgress();
    confetti();
    toast(first ? '✓ أحسنت! حللت السؤال' : '✓ الحل ما زال صحيحًا');
  }
  $('results').className = 'box results on';
  $('results').innerHTML = `<div class="sum ${all ? 'ok' : 'bad'}">${all ? 'أحسنت! نجح الحل في كل الاختبارات' : `نجح ${pass} من ${item.tests.length} اختبارات. راجع الاختبارات التي لم تنجح`}</div>${all ? nextBtn() : ''}${rows.join('')}`;
  $('results').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
};

$('bSol').onclick = () => {
  if (!item || !item.ref) return;
  $('results').className = 'box results on';
  $('results').innerHTML = `<div class="sum">الحل النموذجي <small>(حاول بنفسك أولًا، فهناك أكثر من حل صحيح)</small></div>
    <pre class="solcode">${colorize(item.ref)}</pre><button class="btn" id="bUseSol">انسخه إلى المحرر</button>`;
  $('bUseSol').onclick = () => { code.value = item.ref; errLine = null; resetRun(); paint(); saveCode(); };
};

/* ---------------- self-test quiz (modal) ---------------- */
let Q = null;
const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
const flat = (s) => s.replace(/\r/g, '').trim().split(/\s+/).join(' ');
function startQuiz(L) {
  Q = { L, i: 0, score: 0, answered: false, items: shuffle(L.quiz.slice()).slice(0, QN) };
  let m = $('quiz');
  if (!m) {
    m = document.createElement('div'); m.id = 'quiz'; m.className = 'quiz';
    m.addEventListener('click', (e) => { if (e.target === m) closeQuiz(); });
    document.body.appendChild(m);
  }
  m.classList.add('on');
  quizRender();
}
function closeQuiz() { const m = $('quiz'); if (m) m.classList.remove('on'); Q = null; }
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && Q) closeQuiz(); });
function quizRender() {
  const { L, i } = Q, n = Q.items.length, m = $('quiz');
  const head = `<div class="qh"><b>اختبر نفسك · ${bidi(L.title)}</b><button class="qx" title="إغلاق">✕</button></div>
    <div class="qbar"><i style="width:${100 * i / n}%"></i></div>`;
  if (i >= n) {
    const pc = Q.score / n, prev = quizBest(L);
    if (!prev || pc > prev.s / prev.n) store.set('quiz.' + L.id, { s: Q.score, n });
    if (pc >= .8) confetti();
    const nx = LESSONS[LESSONS.indexOf(L) + 1];
    m.innerHTML = `<div class="qcard">${head}<div class="qend"><div class="big">${Q.score} / ${n}</div>
      <p>${pc === 1 ? 'ممتاز! إجابات كاملة 🎉' : pc >= .8 ? 'أحسنت! مستوى ممتاز 👏' : pc >= .5 ? 'جيد، راجع الأسئلة التي أخطأت فيها ثم أعد المحاولة' : 'راجع شرح الدرس والأمثلة خطوة بخطوة، ثم أعد الاختبار'}</p>
      ${L.quiz.length > n ? `<p class="dim">في كل محاولة تظهر ${n} أسئلة مختلفة من بنك فيه ${L.quiz.length} سؤالًا.</p>` : ''}
      <div class="qact">${pc >= .5 ? '' : '<button class="btn main" id="qAgain">⟲ محاولة جديدة</button>'}${nx ? `<button class="btn ${pc >= .5 ? 'main' : ''}" id="qNextL">الدرس التالي: ${bidi(esc(nx.title))} ←</button>` : ''}${pc >= .5 ? '<button class="btn" id="qAgain">⟲ محاولة جديدة</button>' : ''}<button class="btn" id="qClose">إغلاق</button></div></div></div>`;
    $('qAgain').onclick = () => startQuiz(L); $('qClose').onclick = closeQuiz;
    if ($('qNextL')) $('qNextL').onclick = () => { closeQuiz(); go(href(nx)); };
    m.querySelector('.qx').onclick = closeQuiz;
    refreshProgress(); if (tab === 'quiz') renderQuizPane();
    return;
  }
  const x = Q.items[i];
  Q.answered = false;
  let body = `<div class="qn">السؤال ${i + 1} من ${n} <span>· النتيجة ${Q.score}</span></div>`;
  if (x.k === 'mcq') {
    body += `<div class="qq">${x.q}</div>${x.code ? `<pre class="qcode">${colorize(x.code)}</pre>` : ''}
      <div class="qopts">${shuffle(x.opts.map((o, j) => j)).map((j) => `<button class="qo" data-j="${j}">${x.opts[j]}</button>`).join('')}</div>`;
  } else {
    body += `<div class="qq">${x.q || 'ما ناتج تنفيذ البرنامج التالي؟ اكتب ما يظهر على الشاشة.'}</div>
      <pre class="qcode">${colorize(x.code)}</pre>${x.input ? `<div class="qin">المدخلات: <code>${esc(x.input)}</code></div>` : ''}
      <textarea class="qans" id="qAns" dir="ltr" rows="2" placeholder="اكتب الناتج هنا"></textarea>
      <div class="qact"><button class="btn main" id="qCheck">تحقّق</button></div>`;
  }
  body += `<div class="qfb" id="qFb"></div><div class="qact qnext"><button class="btn main" id="qNext" style="display:none">${i + 1 === n ? 'النتيجة النهائية' : 'السؤال التالي ←'}</button></div>`;
  m.innerHTML = `<div class="qcard">${head}<div class="qbody">${body}</div></div>`;
  m.querySelector('.qx').onclick = closeQuiz;
  $('qNext').onclick = () => { Q.i++; quizRender(); };
  const done = (ok, extra) => {
    Q.answered = true;
    if (ok) Q.score++;
    $('qFb').className = 'qfb on ' + (ok ? 'ok' : 'bad');
    $('qFb').innerHTML = `<b>${ok ? '✓ إجابة صحيحة' : '✗ إجابة خاطئة'}</b>${extra || ''}${x.why ? `<div class="why">${x.why}</div>` : ''}`;
    $('qNext').style.display = '';
    $('qNext').focus();
  };
  if (x.k === 'mcq') {
    m.querySelectorAll('.qo').forEach((b) => b.onclick = () => {
      if (Q.answered) return;
      const j = +b.dataset.j, ok = j === x.a;
      m.querySelectorAll('.qo').forEach((o) => { o.disabled = true; if (+o.dataset.j === x.a) o.classList.add('right'); });
      if (!ok) b.classList.add('wrong');
      done(ok);
    });
  } else {
    const r = FSCpp.runAll(x.code, x.input || '');
    $('qCheck').onclick = () => {
      if (Q.answered) return;
      const v = $('qAns').value;
      if (!v.trim()) { $('qAns').focus(); return; }
      const ok = flat(v) === flat(r.output);
      $('qCheck').disabled = true; $('qAns').readOnly = true;
      done(ok, `<div>الناتج الصحيح:</div><pre class="qout">${esc(r.output)}</pre><button class="btn" id="qTrace">▶ تتبّعه خطوة بخطوة في المختبر</button>`);
      $('qTrace').onclick = () => {
        traceItem = { id: 'quiz-' + L.id + '-' + i, title: 'تتبّع ناتج البرنامج', code: x.code, input: x.input };
        closeQuiz(); go(href(L, 'trace'));
      };
    };
    $('qAns').addEventListener('keydown', (e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) $('qCheck').click(); });
    $('qAns').focus();
  }
}

/* ---------------- start ---------------- */
window.addEventListener('hashchange', route);
route();
})();
