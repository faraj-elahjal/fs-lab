// node site/tests/check_quiz.js — every tracing question runs, every MCQ answer index is valid, every essay model answer runs on its inputs
globalThis.window = globalThis;
for (const f of ['interpreter', 'lessons', 'lessons_p2', 'lessons_p2b', 'lessons_ds', 'quiz_core', 'quiz_p1', 'quiz_p2', 'quiz_ds', 'quiz_bank_p1', 'quiz_bank_p2', 'quiz_bank_ds']) require('../js/' + f + '.js');
const { runAll } = globalThis.FSCpp;
const show = process.argv.includes('--show');
let bad = 0, nq = 0, ne = 0;
const ids = new Set();
for (const L of globalThis.FS_LESSONS) {
  (L.quiz || []).forEach((x, i) => {
    nq++;
    const tag = `${L.id} q${i + 1}`;
    if (x.k === 'mcq') {
      if (!(x.a >= 0 && x.a < x.opts.length)) { bad++; console.log(tag, 'bad answer index'); }
      if (x.code) { const r = runAll(x.code, ''); if (r.error) { bad++; console.log(tag, 'mcq code error', r.error); } }
    } else {
      const r = runAll(x.code, x.input || '');
      if (r.error || !r.output.trim()) { bad++; console.log(tag, 'out error', r.line, r.error, JSON.stringify(r.output)); }
      else if (show) console.log(tag, JSON.stringify(r.output));
    }
  });
  for (const c of L.challenges) {
    if (ids.has(c.id)) { bad++; console.log('duplicate id', c.id); }
    ids.add(c.id);
    if (!c.ref) continue;
    ne++;
    for (const t of c.tests) {
      const r = runAll(c.ref, t.input);
      if (r.error || !r.output.trim()) { bad++; console.log(c.id, 'ref error on', JSON.stringify(t.input), r.line, r.error); }
      else if (show) console.log(c.id, JSON.stringify(t.input), '→', JSON.stringify(r.output));
    }
    const s = runAll(c.code, c.inputs[0]);
    if (s.error && !/غير معرَّفة|غير معرف/.test(s.error)) { bad++; console.log(c.id, 'starter error', s.line, s.error); }
  }
}
console.log(`${nq} quiz questions, ${ne} essay questions — ${bad ? bad + ' problems' : 'all OK'}`);
