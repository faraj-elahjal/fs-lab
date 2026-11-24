/* FS_Lab — Java subset interpreter for the OOP course (step by step, Arabic explanations).
   API mirrors FSCpp: compile(src) → prog, new Interp(prog).run() generator of step/input events, snapshot(), runAll(src, input). */
(function (G) {
'use strict';
const MAX_STEPS = 30000, MAX_DEPTH = 300;
class JavaError extends Error { constructor(msg, line) { super(msg); this.line = line; } }
class BreakSig { constructor(line) { this.line = line; } }
class ContinueSig { constructor(line) { this.line = line; } }
class ReturnSig { constructor(line, val) { this.line = line; this.val = val; } }
class ThrowSig { constructor(ref, line) { this.ref = ref; this.line = line; } }

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const C = (s) => `<code dir="ltr">${esc(s)}</code>`;
const PRIM = new Set(['int', 'long', 'short', 'byte', 'double', 'float', 'char', 'boolean', 'void']);
const WRAP = { Integer: 'int', Long: 'long', Short: 'short', Byte: 'byte', Double: 'double', Float: 'float', Character: 'char', Boolean: 'boolean' };
const KW = new Set(['class', 'interface', 'enum', 'extends', 'implements', 'public', 'private', 'protected', 'static', 'final', 'abstract', 'new', 'return',
  'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'default', 'break', 'continue', 'this', 'super', 'null', 'true', 'false', 'instanceof',
  'try', 'catch', 'finally', 'throw', 'throws', 'import', 'package', 'void', 'int', 'long', 'short', 'byte', 'double', 'float', 'char', 'boolean']);
const OPS = ['>>>=', '<<=', '>>=', '>>>', '...', '++', '--', '&&', '||', '==', '!=', '<=', '>=', '+=', '-=', '*=', '/=', '%=', '&=', '|=', '^=', '->', '::', '<<', '>>'];

/* ================= tokenizer ================= */
function tokenize(src) {
  const T = [];
  let i = 0, line = 1;
  const n = src.length;
  while (i < n) {
    const c = src[i];
    if (c === '\n') { line++; i++; continue; }
    if (/\s/.test(c)) { i++; continue; }
    if (c === '/' && src[i + 1] === '/') { while (i < n && src[i] !== '\n') i++; continue; }
    if (c === '/' && src[i + 1] === '*') {
      const s = line; i += 2;
      while (i < n && !(src[i] === '*' && src[i + 1] === '/')) { if (src[i] === '\n') line++; i++; }
      if (i >= n) throw new JavaError('تعليق /* لم يُغلق بـ */', s);
      i += 2; continue;
    }
    const st = i;
    if (/[0-9]/.test(c) || (c === '.' && /[0-9]/.test(src[i + 1]))) {
      let m = src.slice(i).match(/^(0[xX][0-9a-fA-F_]+|[0-9][0-9_]*\.?[0-9_]*([eE][-+]?[0-9]+)?|\.[0-9]+([eE][-+]?[0-9]+)?)([lLfFdD]?)/);
      const raw = m[0], body = m[1].replace(/_/g, ''), suf = m[4].toLowerCase();
      let t = 'int', v;
      if (/^0[xX]/.test(body)) v = parseInt(body, 16);
      else { v = Number(body); if (/[.eE]/.test(body)) t = 'double'; }
      if (suf === 'l') t = 'long'; else if (suf === 'f') t = 'float'; else if (suf === 'd') t = 'double';
      if (t === 'int' && v > 2147483647) throw new JavaError(`العدد ${C(raw)} أكبر من أقصى قيمة لـ int. أضف L في آخره ليصبح long`, line);
      T.push({ t: 'num', v, nt: t, line, s: st, e: i + raw.length }); i += raw.length; continue;
    }
    if (/[A-Za-z_$]/.test(c)) {
      let j = i; while (j < n && /[A-Za-z0-9_$]/.test(src[j])) j++;
      const w = src.slice(i, j);
      T.push({ t: KW.has(w) ? 'kw' : 'id', v: w, line, s: st, e: j }); i = j; continue;
    }
    if (c === '"') {
      let j = i + 1, s = '';
      while (j < n && src[j] !== '"') {
        if (src[j] === '\n') throw new JavaError('النص بين علامتي التنصيص " لم يُغلق في السطر نفسه', line);
        if (src[j] === '\\') { s += unesc(src[j + 1], line); j += 2; } else s += src[j++];
      }
      if (j >= n) throw new JavaError('النص بين علامتي التنصيص " لم يُغلق', line);
      T.push({ t: 'str', v: s, line, s: st, e: j + 1 }); i = j + 1; continue;
    }
    if (c === "'") {
      let j = i + 1, s;
      if (src[j] === '\\') { s = unesc(src[j + 1], line); j += 2; } else s = src[j++];
      if (src[j] !== "'") throw new JavaError("الحرف char يُكتب بين علامتين مفردتين ويحتوي حرفًا واحدًا فقط، مثل 'A'. والنص يُكتب بين \" \"", line);
      T.push({ t: 'chr', v: s.charCodeAt(0), line, s: st, e: j + 1 }); i = j + 1; continue;
    }
    if (c === '@') { let j = i + 1; while (j < n && /[A-Za-z0-9_]/.test(src[j])) j++; i = j; if (src[i] === '(') { let d = 0; do { if (src[i] === '(') d++; if (src[i] === ')') d--; i++; } while (i < n && d > 0); } continue; }
    const op = OPS.find((o) => src.startsWith(o, i)) || c;
    if (!/[-+*/%=<>!&|^~?:;,.(){}\[\]]/.test(op[0])) throw new JavaError(`الرمز ${C(c)} غير معروف في Java`, line);
    T.push({ t: 'op', v: op, line, s: st, e: i + op.length }); i += op.length;
  }
  T.push({ t: 'eof', v: '', line, s: n, e: n });
  return T;
}
function unesc(ch, line) {
  const m = { n: '\n', t: '\t', '\\': '\\', '"': '"', "'": "'", '0': '\0', r: '\r', b: '\b' };
  if (!(ch in m)) throw new JavaError(`رمز الهروب \\${ch} غير معروف`, line);
  return m[ch];
}

/* ================= parser ================= */
function parse(src, opts) {
  const T = tokenize(src);
  let p = 0;
  const peek = (k) => T[p + (k || 0)];
  const next = () => T[p++];
  const is = (v, k) => { const t = T[p + (k || 0)]; return (t.t === 'op' || t.t === 'kw') && t.v === v; };
  const isId = (k) => T[p + (k || 0)].t === 'id';
  const eat = (v) => { if (is(v)) { p++; return true; } return false; };
  const prevLine = () => (p > 0 ? T[p - 1].line : 1);
  const expect = (v, what) => {
    if (is(v)) return next();
    const t = peek();
    if (v === ';') throw new JavaError(`ينقص الفاصلة المنقوطة ${C(';')} في نهاية السطر ${prevLine()}`, prevLine());
    throw new JavaError(`متوقع ${C(v)}${what ? ' ' + what : ''} ولكن وُجد ${C(t.v || 'نهاية الملف')}`, t.line);
  };
  const ident = (what) => { const t = peek(); if (t.t !== 'id') throw new JavaError(`متوقع اسم ${what || ''} ولكن وُجد ${C(t.v || 'نهاية الملف')}`, t.line); p++; return t.v; };
  const srcOf = (a, b) => src.slice(T[a].s, T[b - 1].e).replace(/\s+/g, ' ');
  const mk = (o, a) => { o.src = srcOf(a, p); o.line = o.line || T[a].line; return o; };
  // '>>' inside generics: split it
  const closeAngle = () => {
    const t = peek();
    if (is('>')) { p++; return; }
    if (t.t === 'op' && (t.v === '>>' || t.v === '>>>')) { T.splice(p, 1, Object.assign({}, t, { v: '>', e: t.s + 1 }), Object.assign({}, t, { v: t.v.slice(1), s: t.s + 1 })); p++; return; }
    if (t.t === 'op' && (t.v === '>=' || t.v === '>>=')) throw new JavaError('صيغة الأنواع العامة غير صحيحة', t.line);
    throw new JavaError(`متوقع ${C('>')} لإغلاق النوع العام`, t.line);
  };
  function typeArgs() {
    const out = [];
    if (!is('<')) return out;
    p++;
    if (is('>')) { p++; return ['<>']; }
    for (;;) {
      if (eat('?')) { if (eat('extends') || eat('super')) out.push(type()); else out.push({ k: 'cls', n: 'Object', args: [] }); }
      else out.push(type());
      if (!eat(',')) break;
    }
    closeAngle();
    return out;
  }
  function type() {
    const t = peek();
    let base;
    if (t.t === 'kw' && PRIM.has(t.v)) { p++; base = { k: 'prim', n: t.v }; }
    else if (t.t === 'id') {
      let name = next().v;
      while (is('.') && T[p + 1].t === 'id' && /^[a-z]/.test(name)) { p++; name = next().v; }   // java.util.Scanner → Scanner
      base = { k: 'cls', n: name, args: typeArgs() };
    } else throw new JavaError(`متوقع نوع بيانات ولكن وُجد ${C(t.v || 'نهاية الملف')}`, t.line);
    while (is('[') && is(']', 1)) { p += 2; base = { k: 'arr', of: base }; }
    if (is('...')) { p++; base = { k: 'arr', of: base, varargs: true }; }
    return base;
  }
  function tryType() { const s = p; try { return type(); } catch (e) { p = s; return null; } }
  // does a local variable declaration start here?  Type name (= | ; | , | : | [)
  function declAhead() {
    const s = p;
    if (is('final')) { p = s; return true; }
    const t = tryType();
    let ok = false;
    if (t && isId() && (is('=', 1) || is(';', 1) || is(',', 1) || is(':', 1) || is('[', 1))) ok = true;
    p = s;
    return ok;
  }
  function mods() {
    const m = {};
    for (;;) {
      const t = peek();
      if (t.t === 'kw' && ['public', 'private', 'protected', 'static', 'final', 'abstract'].includes(t.v)) { if (m[t.v]) throw new JavaError(`الكلمة ${C(t.v)} مكررة`, t.line); m[t.v] = true; p++; continue; }
      if (t.t === 'id' && ['synchronized', 'transient', 'volatile', 'native', 'strictfp'].includes(t.v)) { p++; continue; }
      if (t.t === 'kw' && t.v === 'default' && !is(':', 1)) { m.default = true; p++; continue; }
      break;
    }
    m.access = m.private ? 'private' : m.protected ? 'protected' : m.public ? 'public' : 'package';
    return m;
  }

  /* ---- declarations ---- */
  const classes = [];
  function program() {
    if (eat('package')) { while (!is(';') && peek().t !== 'eof') p++; expect(';'); }
    while (is('import')) { p++; while (!is(';') && peek().t !== 'eof') p++; expect(';'); }
    while (peek().t !== 'eof') {
      if (eat(';')) continue;
      const m = mods();
      classDecl(m, null);
    }
  }
  function classDecl(m, outer) {
    const t = peek();
    let kind;
    if (eat('class')) kind = 'class'; else if (eat('interface')) kind = 'interface'; else if (eat('enum')) kind = 'enum';
    else throw new JavaError(`متوقع ${C('class')} ولكن وُجد ${C(t.v || 'نهاية الملف')}. في Java كل الكود يُكتب داخل كلاس`, t.line);
    const name = ident('الكلاس');
    const tparams = [];
    if (is('<')) { p++; for (;;) { tparams.push(ident('النوع العام')); if (eat('extends')) { type(); while (eat('&')) type(); } if (!eat(',')) break; } closeAngle(); }
    const cd = { name, kind, line: t.line, mods: m, tparams, sup: null, ifaces: [], fields: [], methods: [], ctors: [], consts: [], prelude: !!(opts && opts.prelude), outer };
    if (kind !== 'interface' && eat('extends')) { const st = type(); cd.sup = st.n; cd.supLine = t.line; }
    if (kind === 'interface' && eat('extends')) { do cd.ifaces.push(type().n); while (eat(',')); }
    if (eat('implements')) { do cd.ifaces.push(type().n); while (eat(',')); }
    expect('{', `لفتح جسم الكلاس ${name}`);
    if (kind === 'enum') {
      while (isId()) {
        const ln = peek().line, cn = next().v;
        let args = [];
        if (is('(')) args = argList();
        if (is('{')) throw new JavaError('جسم خاص لكل ثابت في enum غير مدعوم في المختبر', ln);
        cd.consts.push({ name: cn, args, line: ln });
        if (!eat(',')) break;
      }
      if (!eat(';') && !is('}')) throw new JavaError(`بعد ثوابت enum ضع ${C(';')} قبل الحقول والدوال`, peek().line);
    }
    while (!is('}')) {
      if (peek().t === 'eof') throw new JavaError(`ينقص القوس ${C('}')} لإغلاق الكلاس ${name}`, prevLine());
      if (eat(';')) continue;
      const ln = peek().line;
      const mm = mods();
      if (is('class') || is('interface') || is('enum')) { classDecl(mm, cd); continue; }
      if (is('{')) throw new JavaError('كتل التهيئة { } داخل الكلاس غير مدعومة في المختبر. ضع الكود داخل constructor', ln);
      let mt = [];
      if (is('<')) { p++; for (;;) { mt.push(ident()); if (eat('extends')) { type(); while (eat('&')) type(); } if (!eat(',')) break; } closeAngle(); }
      if (isId() && peek().v === name && is('(', 1)) {          // constructor
        p++;
        const params = paramList();
        if (eat('throws')) { do type(); while (eat(',')); }
        const body = block();
        cd.ctors.push({ name, params, body, line: ln, mods: mm, isCtor: true, cls: name });
        continue;
      }
      if (isId() && is('(', 1) && peek().v !== name) {
        const t2 = peek();
        throw new JavaError(`الدالة ${C(t2.v)} ينقصها نوع الإرجاع (مثل ${C('void')} أو ${C('int')}). وإن كانت constructor فاسمها يجب أن يطابق اسم الكلاس ${C(name)}`, t2.line);
      }
      const ty = type();
      const nm = ident('العضو');
      if (is('(')) {
        const params = paramList();
        while (is('[')) { p += 2; }
        if (eat('throws')) { do type(); while (eat(',')); }
        let body = null;
        if (is('{')) body = block(); else expect(';', 'بعد تعريف الدالة');
        const abs = !body;
        if (abs && kind === 'class' && !mm.abstract && !mm.native) throw new JavaError(`الدالة ${C(nm)} بدون جسم يجب أن تكون ${C('abstract')}، أو أضف لها جسمًا { }`, ln);
        if (mm.abstract && body) throw new JavaError(`الدالة المجردة ${C('abstract')} ${C(nm)} لا يكون لها جسم، وتنتهي بـ ${C(';')}`, ln);
        if (mm.abstract && kind === 'class' && !cd.mods.abstract) throw new JavaError(`الكلاس ${C(name)} فيه دالة abstract، فيجب أن يُعرَّف هو أيضًا ${C('abstract class')}`, ln);
        const meth = { name: nm, params, ret: ty, body, line: ln, mods: mm, abstract: abs, static: !!mm.static, tparams: mt, cls: name };
        if (kind === 'interface') { if (!mm.private) mm.access = 'public'; if (!body) meth.abstract = true; }
        cd.methods.push(meth);
        continue;
      }
      // fields
      let fty = ty, fname = nm;
      for (;;) {
        while (is('[') && is(']', 1)) { p += 2; fty = { k: 'arr', of: fty }; }
        let init = null;
        if (eat('=')) init = is('{') ? arrInit() : expr();
        const f = { name: fname, type: fty, init, line: ln, mods: mm, static: !!mm.static, final: !!mm.final, cls: name };
        if (kind === 'interface') { f.static = true; f.final = true; mm.access = 'public'; if (!init) throw new JavaError(`المتغير ${C(fname)} داخل interface ثابت، ويجب إعطاؤه قيمة`, ln); }
        cd.fields.push(f);
        if (!eat(',')) break;
        fty = ty; fname = ident('الحقل');
      }
      expect(';');
    }
    expect('}');
    classes.push(cd);
    return cd;
  }
  function paramList() {
    expect('(');
    const ps = [];
    if (!is(')')) {
      for (;;) {
        eat('final');
        const ln = peek().line;
        let ty = type();
        const nm = ident('المعامل');
        while (is('[') && is(']', 1)) { p += 2; ty = { k: 'arr', of: ty }; }
        ps.push({ name: nm, type: ty, line: ln });
        if (!eat(',')) break;
      }
    }
    expect(')', 'لإغلاق قائمة المعاملات');
    return ps;
  }

  /* ---- statements ---- */
  function block() {
    const a = p;
    expect('{');
    const body = [];
    while (!is('}')) {
      if (peek().t === 'eof') throw new JavaError(`ينقص القوس ${C('}')} لإغلاق الكتلة التي بدأت في السطر ${T[a].line}`, prevLine());
      body.push(stmt());
    }
    const end = next();
    return { k: 'block', body, line: T[a].line, endLine: end.line };
  }
  function localDecl(noSemi) {
    const a = p;
    const fin = eat('final');
    const ty = type();
    const decls = [];
    for (;;) {
      const ln = peek().line;
      const nm = ident('المتغير');
      let t2 = ty;
      while (is('[') && is(']', 1)) { p += 2; t2 = { k: 'arr', of: t2 }; }
      let init = null;
      if (eat('=')) init = is('{') ? arrInit() : expr();
      decls.push({ name: nm, type: t2, init, line: ln });
      if (!eat(',')) break;
    }
    if (!noSemi) expect(';');
    return mk({ k: 'local', decls, final: fin, type: ty }, a);
  }
  function arrInit() {
    const a = p;
    expect('{');
    const items = [];
    while (!is('}')) { items.push(is('{') ? arrInit() : expr()); if (!eat(',')) break; }
    expect('}');
    return mk({ k: 'arrinit', items }, a);
  }
  function stmt() {
    const a = p, t = peek();
    if (is('{')) return block();
    if (eat(';')) return { k: 'empty', line: t.line };
    if (t.t === 'kw') switch (t.v) {
      case 'if': {
        p++; expect('('); const c = expr(); expect(')', 'لإغلاق شرط if');
        if (is(';')) throw new JavaError(`الفاصلة المنقوطة بعد ${C('if (...)')} مباشرة تجعل جسم if فارغًا. احذفها`, t.line);
        const th = stmt(); let el = null;
        if (eat('else')) el = stmt();
        return { k: 'if', cond: c, then: th, els: el, line: t.line };
      }
      case 'while': {
        p++; expect('('); const c = expr(); expect(')');
        if (is(';')) throw new JavaError(`الفاصلة المنقوطة بعد ${C('while (...)')} تجعل الحلقة بلا جسم. احذفها`, t.line);
        return { k: 'while', cond: c, body: stmt(), line: t.line };
      }
      case 'do': {
        p++; const body = stmt(); const wl = peek().line; expect('while', 'بعد جسم do'); expect('('); const c = expr(); expect(')'); expect(';');
        return { k: 'dowhile', cond: c, body, line: t.line, condLine: wl };
      }
      case 'for': {
        p++; expect('(');
        if (declAhead()) {
          const s = p;
          const fin = eat('final');
          const ty = type();
          if (isId() && is(':', 1)) {
            const nm = next().v; p++;
            const it = expr(); expect(')');
            return { k: 'foreach', type: ty, name: nm, iter: it, body: stmt(), line: t.line, final: fin };
          }
          p = s;
        }
        let init = null;
        if (!is(';')) {
          if (declAhead()) init = localDecl(true);
          else { const es = [expr()]; while (eat(',')) es.push(expr()); init = { k: 'exprs', es }; }
        }
        expect(';', 'بين أجزاء for');
        const c = is(';') ? null : expr();
        expect(';', 'بين أجزاء for');
        const upd = [];
        if (!is(')')) { upd.push(expr()); while (eat(',')) upd.push(expr()); }
        expect(')');
        if (is(';')) throw new JavaError(`الفاصلة المنقوطة بعد ${C('for (...)')} تجعل الحلقة بلا جسم. احذفها`, t.line);
        return { k: 'for', init, cond: c, upd, body: stmt(), line: t.line, src: srcOf(a, p) };
      }
      case 'switch': {
        p++; expect('('); const e = expr(); expect(')'); expect('{');
        const cases = [];
        while (!is('}')) {
          const cl = peek().line;
          if (eat('default')) { expect(':'); cases.push({ def: true, vals: [], stmts: [], line: cl }); }
          else {
            expect('case', 'داخل switch');
            const vals = [expr()];
            while (eat(',')) vals.push(expr());
            if (is('->')) throw new JavaError('صيغة case -> الحديثة غير مدعومة في المختبر. استخدم case ...: مع break', cl);
            expect(':', 'بعد case');
            cases.push({ vals, stmts: [], line: cl });
          }
          const cur = cases[cases.length - 1];
          while (!is('case') && !is('default') && !is('}')) cur.stmts.push(stmt());
        }
        expect('}');
        return { k: 'switch', e, cases, line: t.line };
      }
      case 'break': p++; expect(';'); return { k: 'break', line: t.line };
      case 'continue': p++; expect(';'); return { k: 'continue', line: t.line };
      case 'return': { p++; const e = is(';') ? null : expr(); expect(';'); return mk({ k: 'return', e }, a); }
      case 'throw': { p++; const e = expr(); expect(';'); return mk({ k: 'throw', e }, a); }
      case 'try': {
        p++;
        if (is('(')) throw new JavaError('try-with-resources غير مدعومة في المختبر', t.line);
        const body = block(); const catches = []; let fin = null;
        while (is('catch')) {
          const cl = next().line; expect('(');
          eat('final');
          const types = [type().n]; while (eat('|')) types.push(type().n);
          const nm = ident(); expect(')');
          catches.push({ types, name: nm, body: block(), line: cl });
        }
        if (eat('finally')) fin = block();
        if (!catches.length && !fin) throw new JavaError(`${C('try')} يحتاج ${C('catch')} أو ${C('finally')}`, t.line);
        return { k: 'try', body, catches, fin, line: t.line };
      }
      case 'else': throw new JavaError(`${C('else')} بدون ${C('if')} قبلها. تأكد من الأقواس { } ومن عدم وجود ; بعد if`, t.line);
      case 'class': case 'interface': case 'enum': throw new JavaError('تعريف كلاس داخل دالة غير مدعوم. عرّفه خارج الدوال', t.line);
      case 'this': case 'super':
        if (is('(', 1)) { p++; const args = argList(); expect(';'); return mk({ k: 'ctorcall', which: t.v, args }, a); }
        break;
      case 'case': case 'default': throw new JavaError(`${C(t.v)} تُستخدم داخل switch فقط`, t.line);
    }
    if (declAhead()) return localDecl(false);
    const e = expr();
    if (!['assign', 'pre', 'post', 'call', 'mcall', 'new', 'print', 'supercall'].includes(e.k))
      throw new JavaError(`${C(e.src)} ليست جملة صحيحة في Java. الجملة يجب أن تكون إسنادًا أو استدعاء دالة أو ++/--`, t.line);
    expect(';');
    return { k: 'expr', e, line: t.line };
  }

  /* ---- expressions ---- */
  function argList() {
    expect('(');
    const args = [];
    if (!is(')')) { for (;;) { args.push(expr()); if (!eat(',')) break; } }
    expect(')', 'لإغلاق قوس الاستدعاء');
    return args;
  }
  function expr() { return assign(); }
  const ASG = ['=', '+=', '-=', '*=', '/=', '%=', '&=', '|=', '^=', '<<=', '>>='];
  function assign() {
    const a = p;
    const l = tern();
    const t = peek();
    if (t.t === 'op' && ASG.includes(t.v)) {
      if (!['var', 'field', 'index'].includes(l.k)) throw new JavaError(`الطرف الأيسر من ${C(t.v)} يجب أن يكون متغيرًا`, t.line);
      p++;
      const r = is('{') ? arrInit() : assign();
      return mk({ k: 'assign', op: t.v, target: l, e: r }, a);
    }
    return l;
  }
  function tern() {
    const a = p;
    const c = binary(0);
    if (eat('?')) { const x = assign(); expect(':', 'في العملية الشرطية ?:'); const y = assign(); return mk({ k: 'tern', c, a: x, b: y }, a); }
    return c;
  }
  const LEVELS = [['||'], ['&&'], ['|'], ['^'], ['&'], ['==', '!='], ['<', '>', '<=', '>=', 'instanceof'], ['<<', '>>', '>>>'], ['+', '-'], ['*', '/', '%']];
  function binary(lv) {
    if (lv >= LEVELS.length) return unary();
    const a = p;
    let l = binary(lv + 1);
    for (;;) {
      const t = peek();
      if ((t.t === 'op' || t.t === 'kw') && LEVELS[lv].includes(t.v)) {
        p++;
        if (t.v === 'instanceof') { const ty = type(); l = mk({ k: 'instanceof', e: l, type: ty }, a); continue; }
        const r = binary(lv + 1);
        l = mk({ k: 'bin', op: t.v, l, r }, a);
      } else break;
    }
    return l;
  }
  function castAhead() {
    // ( prim ) x   or   ( Name ) x   where x starts an operand
    if (!is('(')) return null;
    const s = p; p++;
    const t = tryType();
    if (!t || !is(')')) { p = s; return null; }
    p++;
    const nx = peek();
    const prim = t.k === 'prim' || (t.k === 'arr');
    const starts = nx.t === 'id' || nx.t === 'num' || nx.t === 'str' || nx.t === 'chr' || (nx.t === 'kw' && ['this', 'new', 'null', 'true', 'false', 'super'].includes(nx.v)) || (nx.t === 'op' && ['(', '!', '~'].includes(nx.v));
    const startsPrim = starts || (nx.t === 'op' && ['-', '+', '++', '--'].includes(nx.v));
    if ((prim && startsPrim) || (t.k === 'cls' && /^[A-Z]/.test(t.n) && starts)) return t;
    p = s; return null;
  }
  function unary() {
    const a = p, t = peek();
    if (t.t === 'op' && ['-', '+', '!', '~'].includes(t.v)) { p++; const e = unary(); return mk({ k: 'un', op: t.v, e }, a); }
    if (t.t === 'op' && (t.v === '++' || t.v === '--')) { p++; const e = unary(); if (!['var', 'field', 'index'].includes(e.k)) throw new JavaError(`${C(t.v)} تُستخدم مع متغير`, t.line); return mk({ k: 'pre', op: t.v, target: e }, a); }
    const ct = castAhead();
    if (ct) { const e = unary(); return mk({ k: 'cast', type: ct, e }, a); }
    return postfix();
  }
  function postfix() {
    const a = p;
    let e = primary();
    for (;;) {
      if (is('.')) {
        p++;
        if (is('<')) typeArgs();
        const nt = peek();
        if (nt.t === 'kw' && nt.v === 'class') throw new JavaError('.class غير مدعومة في المختبر', nt.line);
        if (nt.t === 'kw' && nt.v === 'this') { p++; e = mk({ k: 'this' }, a); continue; }
        const name = ident('العضو بعد النقطة');
        if (is('(')) {
          const args = argList();
          if (e.k === 'field' && e.obj.k === 'var' && e.obj.name === 'System' && (e.name === 'out' || e.name === 'err') && ['println', 'print', 'printf', 'format'].includes(name))
            e = mk({ k: 'print', fn: name === 'format' ? 'printf' : name, args, err: e.name === 'err' }, a);
          else e = mk({ k: 'mcall', obj: e, name, args }, a);
        } else e = mk({ k: 'field', obj: e, name }, a);
        continue;
      }
      if (is('[')) { p++; const i = expr(); expect(']'); e = mk({ k: 'index', arr: e, idx: i }, a); continue; }
      if (is('++') || is('--')) { const op = next().v; if (!['var', 'field', 'index'].includes(e.k)) throw new JavaError(`${C(op)} تُستخدم مع متغير`, T[p - 1].line); e = mk({ k: 'post', op, target: e }, a); continue; }
      if (is('::')) throw new JavaError('مراجع الدوال :: غير مدعومة في المختبر', peek().line);
      break;
    }
    return e;
  }
  function primary() {
    const a = p, t = next();
    switch (t.t) {
      case 'num': return mk({ k: 'num', v: t.v, nt: t.nt }, a);
      case 'str': return mk({ k: 'str', v: t.v }, a);
      case 'chr': return mk({ k: 'chr', v: t.v }, a);
      case 'id':
        if (is('->')) throw new JavaError('تعبيرات lambda غير مدعومة في المختبر', t.line);
        if ((t.v === 'java' || t.v === 'javax') && is('.')) {           // java.util.Arrays → Arrays
          while (is('.') && isId(1) && /^[a-z]/.test(T[p + 1].v)) p += 2;
          if (is('.') && isId(1)) { p++; const c = next(); if (is('(')) throw new JavaError('استدعاء غير صحيح', c.line); return mk({ k: 'var', name: c.v }, a); }
        }
        if (is('(')) { const args = argList(); return mk({ k: 'call', name: t.v, args }, a); }
        return mk({ k: 'var', name: t.v }, a);
      case 'kw':
        switch (t.v) {
          case 'true': case 'false': return mk({ k: 'bool', v: t.v === 'true' }, a);
          case 'null': return mk({ k: 'null' }, a);
          case 'this': return mk({ k: 'this' }, a);
          case 'super': {
            expect('.', 'بعد super');
            const name = ident();
            if (is('(')) { const args = argList(); return mk({ k: 'supercall', name, args }, a); }
            return mk({ k: 'superfield', name }, a);
          }
          case 'new': {
            const st = peek();
            let base;
            if (st.t === 'kw' && PRIM.has(st.v)) { p++; base = { k: 'prim', n: st.v }; }
            else { let name = ident('الكلاس بعد new'); while (is('.') && isId(1)) { p++; name = next().v; } base = { k: 'cls', n: name, args: typeArgs() }; }
            if (is('[')) {
              const dims = [];
              while (is('[')) {
                p++;
                if (is(']')) { p++; dims.push(null); continue; }
                dims.push(expr()); expect(']');
              }
              let init = null;
              if (is('{')) { if (dims.some((d) => d)) throw new JavaError('لا تكتب حجم المصفوفة مع قائمة القيم { }', st.line); init = arrInit(); }
              else if (!dims[0]) throw new JavaError(`حدد حجم المصفوفة، مثل ${C('new int[5]')}`, st.line);
              let ty = base; for (let i = 0; i < dims.length; i++) ty = { k: 'arr', of: ty };
              return mk({ k: 'newarr', type: ty, dims: dims.filter((d) => d), init }, a);
            }
            if (base.k === 'prim') throw new JavaError(`لا يمكن استخدام new مع النوع البسيط ${base.n}`, st.line);
            const args = argList();
            if (is('{')) throw new JavaError('الكلاسات المجهولة (anonymous classes) غير مدعومة في المختبر', st.line);
            return mk({ k: 'new', type: base, args }, a);
          }
          case 'int': case 'double': case 'long': case 'char': case 'boolean': case 'float': case 'short': case 'byte':
            throw new JavaError(`لا يمكن استخدام النوع ${C(t.v)} هنا. هل تقصد تعريف متغير؟`, t.line);
        }
        break;
      case 'op':
        if (t.v === '(') { const e = expr(); expect(')', 'لإغلاق القوس'); e.paren = true; e.src = srcOf(a, p); return e; }
        break;
    }
    throw new JavaError(t.t === 'eof' ? 'البرنامج انتهى قبل اكتمال الجملة. تأكد من الأقواس' : `لم أتوقع ${C(t.v)} هنا`, t.line);
  }

  program();
  return classes;
}

/* ================= values ================= */
const I = (x) => ({ t: 'int', v: x | 0 });
const LNG = (x) => ({ t: 'long', v: Math.trunc(x) });
const D = (x) => ({ t: 'double', v: x });
const FL = (x) => ({ t: 'float', v: Math.fround(x) });
const B = (x) => ({ t: 'boolean', v: !!x });
const CH = (x) => ({ t: 'char', v: x & 0xffff });
let SID = 0;
const STRPOOL = new Map();
const S = (x) => ({ t: 'String', v: x, id: ++SID });
const SLIT = (x) => { if (!STRPOOL.has(x)) STRPOOL.set(x, ++SID); return { t: 'String', v: x, id: STRPOOL.get(x) }; };
const NUL = { t: 'null' };
const REF = (o) => ({ t: 'ref', o });
const VOID = { t: 'void' };
const NUMT = ['byte', 'short', 'char', 'int', 'long', 'float', 'double'];
const isNum = (v) => NUMT.includes(v.t);
const isIntT = (t) => ['byte', 'short', 'char', 'int', 'long'].includes(t);
const rank = { byte: 1, short: 2, char: 2, int: 3, long: 4, float: 5, double: 6 };
function tstr(t) {
  if (!t) return '?';
  if (t.k === 'prim') return t.n;
  if (t.k === 'arr') return tstr(t.of) + '[]';
  return t.n + (t.args && t.args.length && t.args[0] !== '<>' ? '<' + t.args.map(tstr).join(', ') + '>' : '');
}
function fmtDouble(x, isFloat) {
  if (Number.isNaN(x)) return 'NaN';
  if (!Number.isFinite(x)) return x > 0 ? 'Infinity' : '-Infinity';
  if (x === 0) return Object.is(x, -0) ? '-0.0' : '0.0';
  let s;
  if (isFloat) { for (let pr = 1; pr <= 9; pr++) { const c = Number(x.toPrecision(pr)); if (Math.fround(c) === Math.fround(x)) { x = c; break; } } }
  const ax = Math.abs(x);
  if (ax >= 1e7 || ax < 1e-3) {
    const [m, e] = x.toExponential().split('e');
    s = (m.includes('.') ? m : m + '.0') + 'E' + Number(e);
  } else { s = String(x); if (!s.includes('.')) s += '.0'; }
  return s;
}
const hashOf = (o) => (0x1b6d3586 + o.id * 0x2f1a3b7) >>> 0;
/* plain text of a primitive or string (objects go through the generator jstr) */
function prim2s(v) {
  switch (v.t) {
    case 'int': case 'long': case 'short': case 'byte': return String(v.v);
    case 'double': return fmtDouble(v.v, false);
    case 'float': return fmtDouble(v.v, true);
    case 'char': return String.fromCharCode(v.v);
    case 'boolean': return v.v ? 'true' : 'false';
    case 'String': return v.v;
    case 'null': return 'null';
  }
  return null;
}
function show(v) {                    // short display in memory boxes / explanations
  if (v === undefined) return '؟';
  if (v.t === 'String') return '"' + v.v + '"';
  if (v.t === 'char') return "'" + String.fromCharCode(v.v) + "'";
  if (v.t === 'ref') return '→ #' + v.o.id;
  if (v.t === 'class') return v.cls.name;
  const s = prim2s(v);
  return s === null ? '؟' : s;
}

/* ================= runtime objects ================= */
let UID = 0;
class Cell { constructor(type, label, o) { this.uid = ++UID; this.type = type; this.label = label; Object.assign(this, o || {}); } }
const defVal = (t) => {
  if (!t) return NUL;
  if (t.k === 'prim') {
    switch (t.n) { case 'boolean': return B(false); case 'double': return D(0); case 'float': return FL(0); case 'char': return CH(0); case 'long': return LNG(0); default: return I(0); }
  }
  return NUL;
};

const PRELUDE = `
class Object { public String toString() { return __qname(this) + "@" + __hex(this); } public boolean equals(Object o) { return this == o; } public int hashCode() { return __hash(this); } }
class Throwable { private String message; public Throwable() { } public Throwable(String message) { this.message = message; } public String getMessage() { return message; }
  public String toString() { if (message == null) return __qname(this); return __qname(this) + ": " + message; } public void printStackTrace() { __trace(this); } }
class Exception extends Throwable { public Exception() { } public Exception(String m) { super(m); } }
class RuntimeException extends Exception { public RuntimeException() { } public RuntimeException(String m) { super(m); } }
class ArithmeticException extends RuntimeException { public ArithmeticException() { } public ArithmeticException(String m) { super(m); } }
class IndexOutOfBoundsException extends RuntimeException { public IndexOutOfBoundsException() { } public IndexOutOfBoundsException(String m) { super(m); } }
class ArrayIndexOutOfBoundsException extends IndexOutOfBoundsException { public ArrayIndexOutOfBoundsException() { } public ArrayIndexOutOfBoundsException(String m) { super(m); } }
class StringIndexOutOfBoundsException extends IndexOutOfBoundsException { public StringIndexOutOfBoundsException() { } public StringIndexOutOfBoundsException(String m) { super(m); } }
class NullPointerException extends RuntimeException { public NullPointerException() { } public NullPointerException(String m) { super(m); } }
class IllegalArgumentException extends RuntimeException { public IllegalArgumentException() { } public IllegalArgumentException(String m) { super(m); } }
class IllegalStateException extends RuntimeException { public IllegalStateException() { } public IllegalStateException(String m) { super(m); } }
class NumberFormatException extends IllegalArgumentException { public NumberFormatException() { } public NumberFormatException(String m) { super(m); } }
class ClassCastException extends RuntimeException { public ClassCastException() { } public ClassCastException(String m) { super(m); } }
class NoSuchElementException extends RuntimeException { public NoSuchElementException() { } public NoSuchElementException(String m) { super(m); } }
class InputMismatchException extends NoSuchElementException { public InputMismatchException() { } public InputMismatchException(String m) { super(m); } }
class UnsupportedOperationException extends RuntimeException { public UnsupportedOperationException() { } public UnsupportedOperationException(String m) { super(m); } }
`;
const PKG = { InputMismatchException: 'java.util.', NoSuchElementException: 'java.util.' };
let PRE = null;
function prelude() { if (!PRE) PRE = parse(PRELUDE, { prelude: true }); return PRE; }
const NATIVE_CLS = new Set(['String', 'Math', 'Integer', 'Double', 'Long', 'Float', 'Character', 'Boolean', 'Short', 'Byte', 'System', 'Scanner', 'ArrayList', 'LinkedList', 'List', 'Arrays', 'Comparable', 'Iterable', 'Collection', 'Collections', 'Number', 'Objects']);

/* ================= compile: class table + static checks ================= */
function compile(src) {
  const user = parse(src);
  const all = new Map();
  for (const cd of prelude()) all.set(cd.name, cd);
  for (const cd of user) {
    if (all.has(cd.name) && !all.get(cd.name).prelude) throw new JavaError(`الكلاس ${C(cd.name)} معرَّف مرتين`, cd.line);
    if (NATIVE_CLS.has(cd.name) || (all.has(cd.name) && all.get(cd.name).prelude)) throw new JavaError(`الاسم ${C(cd.name)} محجوز لكلاس جاهز في Java. اختر اسمًا آخر`, cd.line);
    all.set(cd.name, cd);
  }
  const info = new Map();
  for (const [name, cd] of all) {
    info.set(name, {
      name, decl: cd, kind: cd.kind, prelude: cd.prelude, abstract: !!cd.mods.abstract || cd.kind === 'interface', final: !!cd.mods.final,
      sup: null, ifaces: [], fields: cd.fields, methods: new Map(), ctors: cd.ctors, tparams: cd.tparams,
    });
  }
  const known = (n) => info.has(n) || NATIVE_CLS.has(n) || WRAP[n];
  for (const [, ci] of info) {
    const cd = ci.decl;
    if (cd.kind === 'class' && name0(ci) !== 'Object') {
      const sn = cd.sup || 'Object';
      if (!info.has(sn)) throw new JavaError(known(sn) ? `لا يمكن الوراثة من ${C(sn)} في المختبر` : `الكلاس ${C(sn)} غير معرَّف، فلا يمكن أن يرث منه ${C(cd.name)}`, cd.line);
      const sc = info.get(sn);
      if (sc.kind === 'interface') throw new JavaError(`${C(sn)} واجهة interface، والكلاس يطبّقها بـ ${C('implements')} وليس ${C('extends')}`, cd.line);
      if (sc.final) throw new JavaError(`لا يمكن الوراثة من الكلاس ${C(sn)} لأنه ${C('final')}. الكلاس final لا يُورَث`, cd.line);
      if (sc.kind === 'enum') throw new JavaError('لا يمكن الوراثة من enum', cd.line);
      ci.sup = sc;
    }
    if (cd.kind === 'enum') ci.sup = info.get('Object');
    for (const n of cd.ifaces) {
      if (['Comparable', 'Iterable', 'Cloneable', 'Serializable', 'Runnable'].includes(n)) { ci.ifaces.push({ name: n, native: true }); continue; }
      if (!info.has(n)) throw new JavaError(`الواجهة ${C(n)} غير معرَّفة`, cd.line);
      const ii = info.get(n);
      if (ii.kind !== 'interface') throw new JavaError(`${C(n)} كلاس وليست واجهة، فالوراثة منه تكون بـ ${C('extends')}${cd.kind === 'class' && cd.sup ? '. وJava لا تسمح بالوراثة من أكثر من كلاس واحد (multiple inheritance)' : ''}`, cd.line);
      ci.ifaces.push(ii);
    }
    for (const m of cd.methods) {
      const l = ci.methods.get(m.name) || [];
      const sig = m.params.map((q) => tstr(q.type)).join(',');
      const dup = l.find((x) => x.params.map((q) => tstr(q.type)).join(',') === sig);
      if (dup) throw new JavaError(tstr(dup.ret) !== tstr(m.ret)
        ? `الدالة ${C(m.name)} معرَّفة مرتين بنفس المعاملات ونوع إرجاع مختلف. هذا ليس overloading؛ الـ overloading يحتاج اختلافًا في المعاملات (العدد أو النوع أو الترتيب) وليس في نوع الإرجاع فقط`
        : `الدالة ${C(m.name + '(' + sig + ')')} معرَّفة مرتين في الكلاس ${C(cd.name)}`, m.line);
      l.push(m); ci.methods.set(m.name, l);
    }
    const sigs = new Set();
    for (const k of cd.ctors) {
      const sig = k.params.map((q) => tstr(q.type)).join(',');
      if (sigs.has(sig)) throw new JavaError(`الـ constructor ${C(cd.name + '(' + sig + ')')} معرَّف مرتين`, k.line);
      sigs.add(sig);
    }
    const fn = new Set();
    for (const f of cd.fields) { if (fn.has(f.name)) throw new JavaError(`الحقل ${C(f.name)} معرَّف مرتين في الكلاس ${C(cd.name)}`, f.line); fn.add(f.name); }
  }
  // cycles
  for (const [, ci] of info) { let c = ci.sup, k = 0; while (c) { if (c === ci || ++k > 50) throw new JavaError(`وراثة دائرية في الكلاس ${C(ci.name)}`, ci.decl.line); c = c.sup; } }
  // overriding checks + abstract completeness
  const sigOf = (m) => m.name + '(' + m.params.map((q) => tstr(q.type)).join(',') + ')';
  for (const [, ci] of info) {
    if (ci.prelude) continue;
    const cd = ci.decl;
    for (const m of cd.methods) {
      for (let s = ci.sup; s; s = s.sup) {
        const pm = (s.methods.get(m.name) || []).find((x) => sigOf(x) === sigOf(m));
        if (!pm) continue;
        if (pm.mods.final) throw new JavaError(`لا يمكن إعادة تعريف (override) الدالة ${C(m.name)} لأنها ${C('final')} في الكلاس ${C(s.name)}`, m.line);
        if (pm.static !== m.static) throw new JavaError(pm.static ? `الدالة ${C(m.name)} static في ${C(s.name)}، والدوال static لا يُعاد تعريفها (override)` : `لا يمكن أن تكون ${C(m.name)} static وهي تعيد تعريف دالة عادية في ${C(s.name)}`, m.line);
        const ar = { private: 0, package: 1, protected: 2, public: 3 };
        if (pm.mods.access !== 'private' && ar[m.mods.access] < ar[pm.mods.access]) throw new JavaError(`عند إعادة تعريف ${C(m.name)} لا يجوز تضييق مستوى الوصول (كانت ${pm.mods.access} في ${C(s.name)})`, m.line);
        if (tstr(pm.ret) !== tstr(m.ret) && pm.ret.k === 'prim') throw new JavaError(`نوع الإرجاع في ${C(m.name)} يجب أن يطابق الدالة الأصلية في ${C(s.name)} (${tstr(pm.ret)})`, m.line);
        break;
      }
      for (const ii of allIfaces(ci)) {
        const pm = (ii.methods.get(m.name) || []).find((x) => sigOf(x) === sigOf(m));
        if (pm && !m.static && m.mods.access !== 'public') throw new JavaError(`الدالة ${C(m.name)} تطبّق دالة من الواجهة ${C(ii.name)}، فيجب أن تكون ${C('public')}`, m.line);
      }
    }
    if (cd.kind === 'class' && !ci.abstract) {
      const missing = [];
      const has = (sig) => { for (let s = ci; s; s = s.sup) { const m = [...s.methods.values()].flat().find((x) => sigOf(x) === sig && !x.abstract); if (m) return true; } for (const ii of allIfaces(ci)) { const m = [...ii.methods.values()].flat().find((x) => sigOf(x) === sig && x.body); if (m) return true; } return false; };
      for (let s = ci.sup; s; s = s.sup) for (const m of [...s.methods.values()].flat()) if (m.abstract && !has(sigOf(m))) missing.push([m, s]);
      for (const ii of allIfaces(ci)) for (const m of [...ii.methods.values()].flat()) if (m.abstract && !m.static && !has(sigOf(m))) missing.push([m, ii]);
      if (missing.length) {
        const [m, s] = missing[0];
        throw new JavaError(`الكلاس ${C(cd.name)} ليس abstract، فيجب أن يعيد تعريف الدالة المجردة ${C(sigOf(m))} الموجودة في ${C(s.name)}، أو يُعرَّف هو ${C('abstract')}`, cd.line);
      }
    }
  }
  // static methods cannot use instance members directly (compile error in Java)
  for (const [, ci] of info) {
    if (ci.prelude) continue;
    for (const m of ci.decl.methods) if (m.static && m.body) checkStatic(ci, m);
  }
  // main
  let mainCls = null;
  for (const cd of user) {
    const m = (cd.methods || []).find((x) => x.name === 'main' && x.static);
    if (m) { mainCls = cd.name; break; }
  }
  if (!mainCls) {
    const wrong = user.flatMap((cd) => cd.methods).find((x) => x.name === 'main');
    throw new JavaError(wrong ? `الدالة ${C('main')} يجب أن تكون ${C('public static void main(String[] args)')}` : `لا توجد الدالة ${C('public static void main(String[] args)')}. البرنامج يبدأ منها`, wrong ? wrong.line : 1);
  }
  return { info, user, mainCls, src };
}
function name0(ci) { return ci.name; }
function checkStatic(ci, m) {
  const locals = new Set(m.params.map((q) => q.name));
  const walkDecl = (n) => {
    if (!n || typeof n !== 'object') return;
    if (Array.isArray(n)) { n.forEach(walkDecl); return; }
    if (n.k === 'local') n.decls.forEach((d) => locals.add(d.name));
    if (n.k === 'foreach') locals.add(n.name);
    if (n.catches) n.catches.forEach((c) => locals.add(c.name));
    for (const k in n) if (k !== 'src' && n[k] && typeof n[k] === 'object') walkDecl(n[k]);
  };
  walkDecl(m.body);
  const inst = (name) => { for (let c = ci; c; c = c.sup) { const f = c.fields.find((x) => x.name === name); if (f) return !f.static; } return false; };
  const instM = (name) => { let any = false, st = false; for (let c = ci; c; c = c.sup) for (const x of c.methods.get(name) || []) { any = true; if (x.static) st = true; } return any && !st; };
  const walk = (n) => {
    if (!n || typeof n !== 'object') return;
    if (Array.isArray(n)) { n.forEach(walk); return; }
    if (n.k === 'var' && !locals.has(n.name) && inst(n.name)) throw new JavaError(`لا يمكن استخدام الحقل ${C(n.name)} داخل الدالة static ${C(m.name)} لأنه ينتمي لكل كائن على حدة (non-static variable cannot be referenced from a static context). أنشئ كائنًا واستخدم ${C('obj.' + n.name)}`, n.line);
    if (n.k === 'call' && instM(n.name)) throw new JavaError(`لا يمكن استدعاء الدالة ${C(n.name + '()')} مباشرة داخل الدالة static ${C(m.name)}، لأنها ليست static وتحتاج كائنًا (non-static method cannot be referenced from a static context). اجعلها ${C('static')} أو أنشئ كائنًا واستدعها به`, n.line);
    if (n.k === 'this' || n.k === 'supercall' || n.k === 'superfield') throw new JavaError(`لا يمكن استخدام ${C(n.k === 'this' ? 'this' : 'super')} داخل الدالة static ${C(m.name)}، لأنه لا يوجد كائن حالي`, n.line);
    for (const k in n) if (k !== 'src' && n[k] && typeof n[k] === 'object') walk(n[k]);
  };
  walk(m.body);
}
function allIfaces(ci) {
  const out = [], seen = new Set();
  const add = (x) => { if (!x || x.native || seen.has(x)) return; seen.add(x); out.push(x); x.ifaces.forEach(add); };
  for (let c = ci; c; c = c.sup) c.ifaces.forEach(add);
  return out;
}
function isSub(ci, name) {
  if (!ci) return false;
  if (name === 'Object') return true;
  for (let c = ci; c; c = c.sup) { if (c.name === name) return true; if (c.ifaces.some((x) => x.name === name || (!x.native && isSub(x, name)))) return true; }
  return false;
}

/* ================= interpreter ================= */
class Interp {
  constructor(prog) {
    this.prog = prog;
    this.info = prog.info;
    this.frames = [];
    this.heap = [];
    this.heapCount = 0;
    this.statics = new Map();      // class name → Map(field → Cell)
    this.output = '';
    this.inbuf = '';
    this.changed = new Set();
    this.lastChanged = new Set();
    this.loops = [];
    this.count = 0;
    this.notes = [];
    this.pendingWarn = null;
    this.silent = 0;
    this.done = false;
    this.inited = new Set();
  }
  get top() { return this.frames[this.frames.length - 1]; }
  get scopes() { return this.top.scopes; }
  pushFrame(fn, label, callLine, thisObj, cls, isStatic) {
    if (this.frames.length > MAX_DEPTH) throw new JavaError(`تجاوز عدد الاستدعاءات المتداخلة ${MAX_DEPTH} (StackOverflowError). يبدو أن الاستدعاء الذاتي لا يصل إلى حالة التوقف`, callLine);
    this.frames.push({ fn, label, callLine, scopes: [new Map()], ctx: [], active: [], thisObj, cls, isStatic, silent: this.silent > 0, temps: [] });
  }
  step(line, msg, extra) {
    if (++this.count > MAX_STEPS) throw new JavaError(`توقف البرنامج بعد ${MAX_STEPS} خطوة، ويبدو أن هناك حلقة لا تنتهي. تأكد من تحديث العدّاد داخل الحلقة ومن شرطها`, line);
    if (this.notes.length) { msg += ' ' + this.notes.join(' '); this.notes = []; }
    const ev = Object.assign({ type: 'step', line, msg, depth: this.frames.length }, extra || {});
    if (this.pendingWarn) { ev.warn = [this.pendingWarn]; this.pendingWarn = null; }
    this.lastChanged = this.changed;
    this.changed = new Set();
    return ev;
  }
  *quiet(g) {                       // run built-in (prelude) code without visible steps
    this.silent++;
    try { let r = g.next(); while (!r.done) r = g.next(); return r.value; } finally { this.silent--; }
  }
  touch(c) { this.changed.add(c.uid); }
  err(msg, line) { return new JavaError(msg, line); }

  /* ---- exceptions thrown by the runtime ---- */
  *jthrow(cls, msg, line) {
    const ref = yield* this.construct(this.info.get(cls), [S(msg)], line, true);
    throw new ThrowSig(ref, line);
  }

  /* ---- class loading (static fields) ---- */
  *loadClass(ci, line) {
    if (!ci || this.inited.has(ci.name) || ci.prelude) return;
    this.inited.add(ci.name);
    if (ci.sup) yield* this.loadClass(ci.sup, line);
    const m = new Map();
    this.statics.set(ci.name, m);
    if (ci.kind === 'enum') {
      ci.consts = [];
      for (let k = 0; k < ci.decl.consts.length; k++) {
        const ec = ci.decl.consts[k];
        const cell = new Cell({ k: 'cls', n: ci.name }, ci.name + '.' + ec.name, { final: true, static: true, cls: ci.name });
        m.set(ec.name, cell);
        const args = []; for (const a of ec.args) args.push(yield* this.ev(a));
        const ref = yield* this.construct(ci, args, ec.line, true, { name: ec.name, ordinal: k });
        cell.val = ref; ci.consts.push(ref);
      }
      yield this.step(ci.decl.line, `تحميل الـ enum ${C(ci.name)}: أُنشئت ثوابته ${ci.decl.consts.map((c) => C(c.name)).join(' و ')}، وكل ثابت كائن واحد فقط في الذاكرة.`);
    }
    for (const f of ci.fields) {
      if (!f.static) continue;
      const cell = new Cell(f.type, ci.name + '.' + f.name, { final: f.final, static: true, cls: ci.name, field: f });
      cell.val = defVal(f.type);
      m.set(f.name, cell);
    }
    for (const f of ci.fields) {
      if (!f.static || !f.init) continue;
      const cell = m.get(f.name);
      this.pushFrame({ name: '<clinit>' }, ci.name, line, null, ci, true);
      try { cell.val = yield* this.assignConv(yield* this.evInit(f.init, f.type), f.type, f.line, f.name); } finally { this.frames.pop(); }
      cell.inited = true;
      this.touch(cell);
      yield this.step(f.line, `الحقل الثابت ${C('static ' + f.name)} يأخذ القيمة <b>${esc(show(cell.val))}</b>. الحقول static تُهيَّأ مرة واحدة عند تحميل الكلاس ${C(ci.name)}، وهي مشتركة بين كل كائناته.`);
    }
  }

  /* ---- program ---- */
  *run() {
    const ci = this.info.get(this.prog.mainCls);
    const main = ci.methods.get('main').find((m) => m.static);
    try {
      this.pushFrame(main, 'main', null, null, ci, true);
      const scope = this.top.scopes[0];
      if (main.params.length) { const c = new Cell(main.params[0].type, 'args', {}); c.val = REF({ id: 0, kind: 'arr', elemType: main.params[0].type.of, type: main.params[0].type, elems: [] }); c.hidden = true; c.inited = true; scope.set(main.params[0].name, c); }
      yield this.step(main.line, `يبدأ تنفيذ البرنامج من الدالة ${C('main')} في الكلاس ${C(ci.name)}.`);
      for (const cd of this.prog.user) yield* this.loadClass(this.info.get(cd.name), main.line);
      yield* this.block(main.body.body, false);
    } catch (e) {
      if (e instanceof ThrowSig) {
        const o = e.ref.o;
        const txt = yield* this.quiet(this.callVirtual(e.ref, 'toString', [], e.line));
        this.output += '';
        throw new JavaError(`استثناء لم يُلتقط: ${C('Exception in thread "main" ' + txt.v)}. ${this.excHint(o.cls.name)}`, e.line);
      }
      if (!(e instanceof ReturnSig)) throw e;
    }
    this.done = true;
    yield { type: 'step', line: null, msg: 'انتهى تنفيذ البرنامج.', end: true };
  }
  excHint(n) {
    return {
      ArithmeticException: 'القسمة على صفر في الأعداد الصحيحة غير مسموحة.',
      ArrayIndexOutOfBoundsException: 'الفهرس خارج حدود المصفوفة: الفهارس من 0 إلى length - 1.',
      IndexOutOfBoundsException: 'الفهرس خارج حدود القائمة: الفهارس من 0 إلى size() - 1.',
      NullPointerException: 'استُخدم مرجع قيمته null، أي لا يشير إلى أي كائن. أنشئ الكائن بـ new أولًا.',
      ClassCastException: 'لا يمكن تحويل الكائن إلى كلاس ليس من نوعه الحقيقي.',
      InputMismatchException: 'القيمة المدخلة لا تناسب نوع القراءة.',
      NumberFormatException: 'النص لا يمثل عددًا صحيحًا.',
      StringIndexOutOfBoundsException: 'الفهرس خارج حدود النص.',
    }[n] || 'استخدم try و catch لالتقاط الاستثناء.';
  }
  *block(stmts, fresh) {
    if (fresh) this.scopes.push(new Map());
    try { for (const s of stmts) yield* this.exec(s); } finally { if (fresh) this.scopes.pop(); }
  }

  /* ---- variables ---- */
  lookup(name) {
    for (let i = this.scopes.length - 1; i >= 0; i--) { const c = this.scopes[i].get(name); if (c) return c; }
    return null;
  }
  fieldCell(obj, name) { return obj.fields ? obj.fields.get(name) : null; }
  findField(ci, name) { for (let c = ci; c; c = c.sup) { const f = c.fields.find((x) => x.name === name); if (f) return { f, owner: c }; } for (const ii of allIfaces(ci)) { const f = ii.fields.find((x) => x.name === name); if (f) return { f, owner: ii }; } return null; }
  staticCell(ci, name) {
    if (!ci) return null;
    for (let c = ci; c; c = c.sup) { const m = this.statics.get(c.name); if (m && m.has(name)) return m.get(name); }
    for (const ii of allIfaces(ci)) { const m = this.statics.get(ii.name); if (m && m.has(name)) return m.get(name); }
    return null;
  }
  checkAccess(member, owner, line, what) {
    if (!member.mods || owner.prelude) return;
    const cur = this.top.cls;
    if (member.mods.access === 'private' && cur && cur.name !== owner.name && !this.sameOuter(cur, owner))
      throw this.err(`${what} ${C(member.name)} معرَّف ${C('private')} في الكلاس ${C(owner.name)}، فلا يمكن الوصول إليه من خارجه (خطأ ترجمة). استخدم دالة get/set عامة`, line);
  }
  sameOuter(a, b) { const oa = a.decl.outer ? a.decl.outer.name : a.name, ob = b.decl.outer ? b.decl.outer.name : b.name; return oa === ob; }
  *resolveVar(n) {                  // → {cell} | {cls}
    const c = this.lookup(n.name);
    if (c) return { cell: c };
    const fr = this.top;
    const ci = fr.cls;
    if (ci) {
      const r = this.findField(ci, n.name);
      if (r) {
        if (r.f.static) { yield* this.loadClass(r.owner, n.line); return { cell: this.staticCell(ci, n.name) }; }
        if (!fr.thisObj) throw this.err(`لا يمكن استخدام الحقل ${C(n.name)} داخل دالة ${C('static')} لأنه ينتمي لكل كائن على حدة (non-static variable cannot be referenced from a static context). أنشئ كائنًا واستخدم ${C('obj.' + n.name)}`, n.line);
        this.checkAccess(r.f, r.owner, n.line, 'الحقل');
        return { cell: fr.thisObj.fields.get(n.name), implicitThis: true };
      }
      const sc = this.staticCell(ci, n.name);
      if (sc) return { cell: sc };
    }
    if (this.info.has(n.name) && !this.info.get(n.name).prelude) return { cls: this.info.get(n.name) };
    if (NATIVE_CLS.has(n.name) || WRAP[n.name] || this.info.has(n.name)) return { native: n.name };
    // enum constant inside switch-case is handled by the switch
    throw this.err(`المتغير ${C(n.name)} غير معرَّف (cannot find symbol). تأكد من تعريفه قبل استخدامه ومن كتابة اسمه بالحروف نفسها (Java تفرّق بين الكبيرة والصغيرة)`, n.line);
  }
  readCell(c, line, label) {
    if (c.val === undefined) throw this.err(`المتغير ${C(label || c.label)} لم يُعطَ قيمة قبل استخدامه (variable might not have been initialized). المتغيرات المحلية في Java لا تأخذ قيمة افتراضية`, line);
    return c.val;
  }
  *lv(n) {                          // lvalue → {cell, label, owner?}
    switch (n.k) {
      case 'var': {
        const r = yield* this.resolveVar(n);
        if (!r.cell) throw this.err(`${C(n.name)} اسم كلاس وليس متغيرًا`, n.line);
        return { cell: r.cell, label: n.name };
      }
      case 'field': case 'superfield': {
        if (n.k === 'superfield' || n.obj.k === 'this') {
          const o = this.thisOrErr(n);
          const c = o.fields.get(n.name);
          if (!c) { const sc = this.top.cls && this.staticCell(this.top.cls, n.name); if (sc) return { cell: sc, label: n.src }; throw this.err(`الكلاس ${C(o.cls.name)} لا يحتوي حقلًا اسمه ${C(n.name)}`, n.line); }
          return { cell: c, label: n.src };
        }
        if (n.obj.k === 'var') {
          const r = yield* this.resolveVar(n.obj);
          if (r.cls) {
            yield* this.loadClass(r.cls, n.line);
            const sc = this.staticCell(r.cls, n.name);
            if (!sc) {
              if (this.findField(r.cls, n.name)) throw this.err(`الحقل ${C(n.name)} ليس static، فيُستخدم عن طريق كائن وليس عن طريق اسم الكلاس ${C(r.cls.name)}`, n.line);
              throw this.err(`الكلاس ${C(r.cls.name)} لا يحتوي حقلًا اسمه ${C(n.name)}`, n.line);
            }
            const ff = this.findField(r.cls, n.name); if (ff) this.checkAccess(ff.f, ff.owner, n.line, 'الحقل');
            return { cell: sc, label: n.src };
          }
        }
        const v = yield* this.ev(n.obj);
        if (v.t === 'null') yield* this.jthrow('NullPointerException', `Cannot access field "${n.name}" because "${n.obj.src}" is null`, n.line);
        if (v.t !== 'ref' || !v.o.fields) throw this.err(`لا يمكن الوصول إلى ${C('.' + n.name)} هنا`, n.line);
        const c = v.o.fields.get(n.name);
        if (!c) {
          const sc = this.staticCell(v.o.cls, n.name);
          if (sc) return { cell: sc, label: n.src };
          throw this.err(`الكلاس ${C(v.o.cls.name)} لا يحتوي حقلًا اسمه ${C(n.name)}`, n.line);
        }
        const ff = this.findField(v.o.cls, n.name); if (ff) this.checkAccess(ff.f, ff.owner, n.line, 'الحقل');
        return { cell: c, label: n.src };
      }
      case 'index': {
        const av = yield* this.ev(n.arr);
        const iv = yield* this.ev(n.idx);
        if (av.t === 'null') yield* this.jthrow('NullPointerException', `Cannot load from array because "${n.arr.src}" is null`, n.line);
        if (av.t !== 'ref' || av.o.kind !== 'arr') throw this.err(`${C(n.arr.src)} ليست مصفوفة. للقوائم استخدم ${C('get(i)')}، وللنصوص ${C('charAt(i)')}`, n.line);
        if (!isIntT(iv.t) || iv.t === 'long') throw this.err('فهرس المصفوفة يجب أن يكون عددًا صحيحًا int', n.line);
        const k = iv.v, len = av.o.elems.length;
        if (k < 0 || k >= len) yield* this.jthrow('ArrayIndexOutOfBoundsException', `Index ${k} out of bounds for length ${len}`, n.line);
        return { cell: av.o.elems[k], label: `${n.arr.src}[${k}]` };
      }
    }
    throw this.err(`${C(n.src)} لا يمكن الإسناد إليه`, n.line);
  }
  thisOrErr(n) {
    const o = this.top.thisObj;
    if (!o) throw this.err(`لا يمكن استخدام ${C(n.k === 'superfield' ? 'super' : 'this')} داخل دالة ${C('static')}، لأنه لا يوجد كائن حالي`, n.line);
    return o;
  }
  *setCell(lv, v, line) {
    const c = lv.cell;
    if (c.final && c.inited && !this.inCtorOf(c)) throw this.err(`لا يمكن تغيير قيمة ${C(lv.label)} لأنه ${C('final')} (ثابت). المتغير final يأخذ قيمة واحدة فقط`, line);
    if (c.final && c.inited && c.static) throw this.err(`لا يمكن تغيير قيمة الثابت ${C(lv.label)} لأنه ${C('final')}`, line);
    c.val = yield* this.assignConv(v, c.type, line, lv.label);
    c.inited = true;
    this.touch(c);
    if (c.owner) this.touch(c.owner);
  }
  inCtorOf(c) { const f = this.top; return f.fn && f.fn.isCtor && c.owner && f.thisObj === c.owner && !c.ctorSet && !c.static && c.inited !== 'done'; }

  /* ---- conversions ---- */
  *assignConv(v, type, line, name) {
    if (!type) return v;
    if (type.k === 'prim') {
      const t = type.n;
      if (v.t === 'ref' && WRAP[v.o.cls && v.o.cls.name]) v = v.o.box;
      if (v.t === 'null') throw this.err(`لا يمكن إسناد ${C('null')} إلى ${C(name)} من النوع البسيط ${t}`, line);
      if (!isNum(v) && v.t !== 'boolean') throw this.err(`لا يمكن وضع ${this.tname(v)} في ${C(name)} من النوع ${t} (incompatible types)`, line);
      if (t === 'boolean' || v.t === 'boolean') { if (t !== v.t) throw this.err(`لا يمكن تحويل ${this.tname(v)} إلى ${t}${t === 'boolean' ? '. في Java الشرط يجب أن يكون true أو false وليس عددًا' : ''}`, line); return v; }
      const fits = v.lit && v.t === 'int' && ({ char: [0, 65535], byte: [-128, 127], short: [-32768, 32767] }[t] || [1, 0]);
      if (rank[v.t] > rank[t] && !(fits && v.v >= fits[0] && v.v <= fits[1])) {
        throw this.err(`لا يمكن وضع قيمة من النوع ${v.t} في ${C(name)} من النوع ${t} دون تحويل صريح (possible lossy conversion). استخدم ${C('(' + t + ')')}`, line);
      }
      return this.castPrim(v, t);
    }
    if (type.k === 'cls' && WRAP[type.n]) {
      if (v.t === 'null') return v;
      if (v.t === 'ref') return v;
      const pt = WRAP[type.n];
      if (pt !== v.t && !(pt === 'double' && isNum(v) && v.t !== 'char') && !(pt === 'long' && isIntT(v.t))) throw this.err(`لا يمكن وضع ${this.tname(v)} في ${C(name)} من النوع ${type.n}`, line);
      return this.castPrim(v, pt);
    }
    if (type.k === 'cls' && type.n === 'String') {
      if (v.t === 'String' || v.t === 'null') return v;
      throw this.err(`لا يمكن وضع ${this.tname(v)} في متغير من النوع String. للتحويل استخدم ${C('String.valueOf(x)')} أو ${C('"" + x')}`, line);
    }
    if (v.t === 'null') return v;
    if (type.k === 'cls' && (type.n === 'Object' || this.isTypeParam(type.n))) return v;
    if (type.k === 'arr') {
      if (v.t !== 'ref' || v.o.kind !== 'arr') throw this.err(`${C(name)} من النوع ${tstr(type)} يستقبل مصفوفة`, line);
      return v;
    }
    if (type.k === 'cls') {
      if (isNum(v) || v.t === 'boolean' || v.t === 'String') {
        if (['Comparable', 'Number', 'Object'].includes(type.n)) return v;
        throw this.err(`لا يمكن وضع ${this.tname(v)} في ${C(name)} من النوع ${type.n}`, line);
      }
      if (v.t === 'ref') {
        const o = v.o;
        if (o.kind === 'obj' && this.info.has(type.n) && !isSub(o.cls, type.n)) {
          throw this.err(`لا يمكن وضع كائن من النوع ${C(o.cls.name)} في ${C(name)} من النوع ${C(type.n)} (incompatible types)` + (isSub(this.info.get(type.n), o.cls.name) ? `. الكلاس ${C(type.n)} يرث من ${C(o.cls.name)} وليس العكس، فيلزم تحويل صريح ${C('(' + type.n + ')')}` : ''), line);
        }
      }
    }
    return v;
  }
  isTypeParam(n) {
    if (n.length <= 2 && /^[A-Z][0-9]?$/.test(n)) return true;
    const f = this.top; return !!(f && f.cls && f.cls.tparams.includes(n)) || !!(f && f.fn && f.fn.tparams && f.fn.tparams.includes(n));
  }
  castPrim(v, t) {
    if (v.t === 'boolean') return v;
    const x = v.v;
    switch (t) {
      case 'int': return I(Number.isFinite(x) ? Math.trunc(x) : (Number.isNaN(x) ? 0 : x > 0 ? 2147483647 : -2147483648));
      case 'long': return LNG(Math.trunc(x));
      case 'short': return { t: 'short', v: (Math.trunc(x) << 16) >> 16 };
      case 'byte': return { t: 'byte', v: (Math.trunc(x) << 24) >> 24 };
      case 'char': return CH(Math.trunc(x));
      case 'double': return D(x);
      case 'float': return FL(x);
    }
    return v;
  }
  tname(v) {
    if (v.t === 'ref') return v.o.kind === 'arr' ? 'مصفوفة' : `كائن ${C(v.o.cls ? v.o.cls.name : v.o.kind)}`;
    if (v.t === 'null') return 'null';
    return { int: 'عدد صحيح int', long: 'long', double: 'عدد عشري double', float: 'float', char: 'حرف char', boolean: 'قيمة boolean', String: 'نص String' }[v.t] || v.t;
  }

  /* ---- string conversion (may run user toString) ---- */
  *jstr(v, line) {
    const s = prim2s(v);
    if (s !== null) return s;
    if (v.t === 'ref') {
      const o = v.o;
      if (o.kind === 'arr') return (o.elemType.k === 'prim' ? '[' + { int: 'I', double: 'D', char: 'C', boolean: 'Z', long: 'J', float: 'F' }[o.elemType.n] : '[L' + tstr(o.elemType) + ';') + '@' + hashOf(o).toString(16);
      if (o.kind === 'list') { const parts = []; for (const c of o.elems) parts.push(yield* this.jstr(c.val, line)); return '[' + parts.join(', ') + ']'; }
      if (o.kind === 'scanner') return 'java.util.Scanner';
      if (o.enumName !== undefined && !this.findOwn(o.cls, 'toString')) return o.enumName;
      const r = yield* this.callVirtual(v, 'toString', [], line);
      return r.t === 'null' ? 'null' : r.v;
    }
    return '?';
  }

  /* ---- expression evaluation ---- */
  *ev(n) {
    switch (n.k) {
      case 'num': { const v = n.nt === 'double' ? D(n.v) : n.nt === 'float' ? FL(n.v) : n.nt === 'long' ? LNG(n.v) : I(n.v); if (n.nt === 'int') v.lit = true; return v; }
      case 'str': return SLIT(n.v);
      case 'chr': return CH(n.v);
      case 'bool': return B(n.v);
      case 'null': return NUL;
      case 'this': return REF(this.thisOrErr(n));
      case 'var': {
        const r = yield* this.resolveVar(n);
        if (r.cell) return this.readCell(r.cell, n.line, n.name);
        if (r.cls) return { t: 'class', cls: r.cls };
        return { t: 'native', name: r.native };
      }
      case 'field': case 'superfield': {
        if (n.k === 'field' && n.name === 'length') {
          const ov = yield* this.ev(n.obj);
          if (ov.t === 'ref' && ov.o.kind === 'arr') return I(ov.o.elems.length);
          if (ov.t === 'null') yield* this.jthrow('NullPointerException', `Cannot read the array length because "${n.obj.src}" is null`, n.line);
          if (ov.t === 'String') throw this.err(`طول النص يُحسب بالدالة ${C(n.obj.src + '.length()')} مع القوسين، أما ${C('length')} بدون أقواس فهي للمصفوفات`, n.line);
          if (ov.t === 'ref' && ov.o.kind === 'list') throw this.err(`حجم القائمة يُحسب بـ ${C(n.obj.src + '.size()')}`, n.line);
        }
        if (n.k === 'field' && n.obj.k === 'var' && !this.lookup(n.obj.name) && !(this.top.cls && this.findField(this.top.cls, n.obj.name)) && (NATIVE_CLS.has(n.obj.name) || WRAP[n.obj.name])) {
          const nv = this.nativeField(n.obj.name, n.name, n.line);
          if (nv) return nv;
          throw this.err(`${C(n.src)} غير مدعومة في المختبر`, n.line);
        }
        const lv = yield* this.lv(n);
        return this.readCell(lv.cell, n.line, lv.label);
      }
      case 'index': { const lv = yield* this.lv(n); return this.readCell(lv.cell, n.line, lv.label); }
      case 'assign': {
        const lv = yield* this.lv(n.target);
        let v;
        if (n.op === '=') v = n.e.k === 'arrinit' ? yield* this.arrFromInit(lv.cell.type, n.e) : yield* this.ev(n.e);
        else {
          const old = this.readCell(lv.cell, n.line, lv.label);
          const r = yield* this.ev(n.e);
          v = yield* this.binop(n.op.slice(0, -1), old, r, n);
          if (lv.cell.type.k === 'prim' && v.t !== 'String') v = this.castPrim(v, lv.cell.type.n);   // compound assignment casts implicitly
        }
        if (n.op === '=' && n.target.k === 'field' && n.target.obj.k === 'this' && n.e.k === 'var' && n.e.name === n.target.name) { /* this.x = x: fine */ }
        if (n.op === '=' && n.target.k === 'var' && n.e.k === 'var' && n.target.name === n.e.name && this.top.thisObj && this.lookup(n.target.name) && this.top.thisObj.fields.has(n.target.name))
          this.pendingWarn = `${C(n.src)} تُسند المعامل إلى نفسه، والحقل لا يتغير. لأن المعامل له اسم الحقل نفسه، استخدم ${C('this.' + n.target.name + ' = ' + n.e.name)}`;
        yield* this.setCell(lv, v, n.line);
        return lv.cell.val;
      }
      case 'pre': case 'post': {
        const lv = yield* this.lv(n.target);
        const old = this.readCell(lv.cell, n.line, lv.label);
        if (!isNum(old)) throw this.err(`${C(n.op)} تُستخدم مع الأعداد`, n.line);
        const nv = this.castPrim({ t: old.t, v: old.v + (n.op === '++' ? 1 : -1) }, old.t);
        yield* this.setCell(lv, nv, n.line);
        return n.k === 'pre' ? nv : old;
      }
      case 'un': {
        const v = yield* this.ev(n.e);
        if (n.op === '!') { if (v.t !== 'boolean') throw this.err(`${C('!')} تُستخدم مع قيمة boolean`, n.line); return B(!v.v); }
        if (!isNum(v)) throw this.err(`${C(n.op)} تُستخدم مع الأعداد`, n.line);
        const t = rank[v.t] < 3 ? 'int' : v.t;
        if (n.op === '-') return this.castPrim({ t, v: -v.v }, t);
        if (n.op === '~') return this.castPrim({ t, v: ~v.v }, t);
        return this.castPrim(v, t);
      }
      case 'bin': {
        if (n.op === '&&' || n.op === '||') {
          const a = yield* this.ev(n.l);
          if (a.t !== 'boolean') throw this.err(`${C(n.op)} تعمل مع قيم boolean (true/false)`, n.line);
          if (n.op === '&&' ? !a.v : a.v) return a;
          const b = yield* this.ev(n.r);
          if (b.t !== 'boolean') throw this.err(`${C(n.op)} تعمل مع قيم boolean (true/false)`, n.line);
          return b;
        }
        const a = yield* this.ev(n.l), b = yield* this.ev(n.r);
        return yield* this.binop(n.op, a, b, n);
      }
      case 'tern': {
        const c = yield* this.ev(n.c);
        if (c.t !== 'boolean') throw this.err('شرط العملية ?: يجب أن يكون boolean', n.line);
        return yield* this.ev(c.v ? n.a : n.b);
      }
      case 'cast': {
        const v = yield* this.ev(n.e);
        const t = n.type;
        if (t.k === 'prim') {
          if (t.n === 'boolean' || v.t === 'boolean') { if (v.t !== t.n) throw this.err(`لا يمكن تحويل ${this.tname(v)} إلى ${t.n}`, n.line); return v; }
          if (v.t === 'ref' && v.o.box) return this.castPrim(v.o.box, t.n);
          if (!isNum(v)) throw this.err(`لا يمكن تحويل ${this.tname(v)} إلى ${t.n}`, n.line);
          return this.castPrim(v, t.n);
        }
        if (v.t === 'null') return v;
        if (t.k === 'cls' && t.n === 'String') { if (v.t !== 'String') throw this.err(`لا يمكن تحويل ${this.tname(v)} إلى String بالـ cast. استخدم ${C('String.valueOf(x)')}`, n.line); return v; }
        if (t.k === 'cls' && WRAP[t.n]) return yield* this.assignConv(v, t, n.line, n.src);
        if (t.k === 'cls' && v.t === 'ref' && v.o.kind === 'obj' && this.info.has(t.n)) {
          if (!isSub(v.o.cls, t.n)) yield* this.jthrow('ClassCastException', `class ${v.o.cls.name} cannot be cast to class ${t.n}`, n.line);
          this.notes.push(`التحويل ${C('(' + t.n + ')')} نجح لأن الكائن الحقيقي من النوع ${C(v.o.cls.name)} (downcasting).`);
        }
        return v;
      }
      case 'instanceof': {
        const v = yield* this.ev(n.e);
        if (v.t === 'null') return B(false);
        if (v.t === 'ref' && v.o.kind === 'obj') return B(isSub(v.o.cls, n.type.n));
        if (v.t === 'String') return B(['String', 'Object', 'Comparable'].includes(n.type.n));
        if (v.t === 'ref' && v.o.kind === 'list') return B(['ArrayList', 'List', 'LinkedList', 'Object', 'Collection'].includes(n.type.n) && (n.type.n !== 'LinkedList' || v.o.ln === 'LinkedList'));
        return B(n.type.n === 'Object');
      }
      case 'new': return yield* this.newExpr(n);
      case 'newarr': {
        if (n.init) return yield* this.arrFromInit(n.type, n.init);
        const dims = [];
        for (const d of n.dims) {
          const v = yield* this.ev(d);
          if (!isIntT(v.t) || v.t === 'long') throw this.err('حجم المصفوفة يجب أن يكون عددًا صحيحًا int', n.line);
          if (v.v < 0) yield* this.jthrow('NegativeArraySizeException' in {} ? 'RuntimeException' : 'RuntimeException', `NegativeArraySizeException: ${v.v}`, n.line);
          if (v.v > 500) throw this.err('المختبر يدعم مصفوفات حتى 500 عنصر', n.line);
          dims.push(v.v);
        }
        const mkA = (type, k) => {
          const arr = this.newArr(type, []);
          for (let i = 0; i < dims[k]; i++) {
            const c = new Cell(type.of, `[${i}]`, { owner: arr });
            c.val = k + 1 < dims.length ? REF(mkA(type.of, k + 1)) : defVal(type.of);
            c.inited = true;
            arr.elems.push(c);
          }
          return arr;
        };
        const a = mkA(n.type, 0);
        return REF(a);
      }
      case 'arrinit': throw this.err('قائمة القيم { } تُستخدم عند تعريف المصفوفة فقط، أو مع new مثل new int[]{1, 2}', n.line);
      case 'call': return yield* this.callUnqualified(n);
      case 'mcall': return yield* this.callMember(n);
      case 'supercall': {
        const o = this.thisOrErr(n);
        const ci = this.top.cls;
        if (!ci.sup) throw this.err('لا يوجد كلاس أب', n.line);
        const args = []; for (const a of n.args) args.push(yield* this.ev(a));
        const m = this.findMethod(ci.sup, n.name, args, n.line, true);
        if (!m) throw this.err(`الكلاس الأب ${C(ci.sup.name)} لا يحتوي الدالة ${C(n.name)}`, n.line);
        if (m.m.abstract) throw this.err(`لا يمكن استدعاء الدالة المجردة ${C('super.' + n.name + '()')} لأنها بلا جسم`, n.line);
        return yield* this.invoke(m.m, m.owner, REF(o), args, n, 'super');
      }
      case 'print': return yield* this.print(n);
    }
    throw this.err(`التعبير ${C(n.src)} غير مدعوم في المختبر`, n.line);
  }
  nativeField(cls, name, line) {
    const M = { 'Math.PI': D(Math.PI), 'Math.E': D(Math.E), 'Integer.MAX_VALUE': I(2147483647), 'Integer.MIN_VALUE': I(-2147483648),
      'Double.MAX_VALUE': D(Number.MAX_VALUE), 'Double.MIN_VALUE': D(Number.MIN_VALUE), 'Long.MAX_VALUE': LNG(Number.MAX_SAFE_INTEGER), 'Long.MIN_VALUE': LNG(Number.MIN_SAFE_INTEGER) };
    const k = cls + '.' + name;
    if (k in M) return M[k];
    if (cls === 'System' && name === 'in') return { t: 'native', name: 'System.in' };
    if (cls === 'System' && name === 'out') throw this.err(`استخدم ${C('System.out.println(...)')} أو ${C('System.out.print(...)')}`, line);
    return null;
  }
  *binop(op, a, b, n) {
    const line = n.line;
    if (op === '+' && (a.t === 'String' || b.t === 'String')) {
      if (a.t === 'void' || b.t === 'void') throw this.err('لا يمكن جمع نتيجة دالة void مع نص', line);
      return S((yield* this.jstr(a, line)) + (yield* this.jstr(b, line)));
    }
    if (op === '==' || op === '!=') {
      let eq;
      if (a.t === 'ref' && a.o.box) a = a.o.box; if (b.t === 'ref' && b.o.box) b = b.o.box;
      if (isNum(a) && isNum(b)) eq = a.v === b.v;
      else if (a.t === 'boolean' && b.t === 'boolean') eq = a.v === b.v;
      else if (a.t === 'String' && b.t === 'String') {
        eq = a.id === b.id;
        if (!eq && a.v === b.v) this.pendingWarn = `${C(n.src)} تقارن المرجعين (العنوانين) وليس المحتوى، لذلك النتيجة false رغم أن النصين متساويان. لمقارنة محتوى النصوص استخدم ${C('equals')}`;
        else if (eq) this.notes.push(`(${C('==')} مع النصوص تقارن المراجع، ولمقارنة المحتوى استخدم ${C('equals')}.)`);
      } else if ((a.t === 'ref' || a.t === 'null' || a.t === 'String') && (b.t === 'ref' || b.t === 'null' || b.t === 'String')) eq = a.t === 'null' ? b.t === 'null' : b.t !== 'null' && a.o === b.o;
      else throw this.err(`لا يمكن مقارنة ${this.tname(a)} مع ${this.tname(b)} بـ ${C(op)}`, line);
      return B(op === '==' ? eq : !eq);
    }
    if (a.t === 'ref' && a.o.box) a = a.o.box; if (b.t === 'ref' && b.o.box) b = b.o.box;
    if (['&', '|', '^'].includes(op) && a.t === 'boolean' && b.t === 'boolean') return B(op === '&' ? a.v && b.v : op === '|' ? a.v || b.v : a.v !== b.v);
    if (!isNum(a) || !isNum(b)) {
      if (a.t === 'null' || b.t === 'null') yield* this.jthrow('NullPointerException', 'null value in arithmetic', line);
      throw this.err(`العملية ${C(op)} لا تعمل مع ${this.tname(a.t !== 'String' && isNum(a) ? b : a)}${a.t === 'String' || b.t === 'String' ? '. مع النصوص تعمل + فقط للدمج' : ''}`, line);
    }
    const rt = Math.max(rank[a.t], rank[b.t], 3);
    const t = rt === 6 ? 'double' : rt === 5 ? 'float' : rt === 4 ? 'long' : 'int';
    const x = a.v, y = b.v;
    switch (op) {
      case '<': return B(x < y); case '>': return B(x > y); case '<=': return B(x <= y); case '>=': return B(x >= y);
      case '+': return this.castPrim({ t, v: x + y }, t);
      case '-': return this.castPrim({ t, v: x - y }, t);
      case '*': return t === 'int' ? I(Math.imul(x, y)) : this.castPrim({ t, v: x * y }, t);
      case '/':
        if (t === 'int' || t === 'long') {
          if (y === 0) yield* this.jthrow('ArithmeticException', '/ by zero', line);
          return this.castPrim({ t, v: Math.trunc(x / y) }, t);
        }
        return this.castPrim({ t, v: x / y }, t);
      case '%':
        if ((t === 'int' || t === 'long') && y === 0) yield* this.jthrow('ArithmeticException', '/ by zero', line);
        return this.castPrim({ t, v: x % y }, t);
      case '&': return this.castPrim({ t, v: x & y }, t); case '|': return this.castPrim({ t, v: x | y }, t); case '^': return this.castPrim({ t, v: x ^ y }, t);
      case '<<': return I(x << y); case '>>': return I(x >> y); case '>>>': return I(x >>> y);
    }
    throw this.err(`العملية ${C(op)} غير مدعومة`, line);
  }
  *evInit(e, type) { return e.k === 'arrinit' ? yield* this.arrFromInit(type, e) : yield* this.ev(e); }
  temp(o) { if (this.frames.length) this.top.temps.push(o); return o; }
  newArr(type, elems) {
    const o = { id: ++this.heapCount, kind: 'arr', elemType: type.of || type, type, elems };
    this.heap.push(o); this.temp(o);
    return o;
  }
  *arrFromInit(type, init) {
    if (type.k !== 'arr') throw this.err('قائمة القيم { } تُستخدم مع المصفوفات فقط', init.line);
    const arr = this.newArr(type, []);
    for (let i = 0; i < init.items.length; i++) {
      const it = init.items[i];
      const c = new Cell(type.of, `[${i}]`, { owner: arr });
      c.val = it.k === 'arrinit' ? yield* this.arrFromInit(type.of, it) : yield* this.assignConv(yield* this.ev(it), type.of, init.line, `عنصر المصفوفة`);
      c.inited = true;
      arr.elems.push(c);
    }
    return REF(arr);
  }

  /* ---- objects ---- */
  *newExpr(n) {
    const name = n.type.n;
    const args = []; for (const a of n.args) args.push(yield* this.ev(a));
    if (name === 'Scanner') {
      if (!(args.length === 1 && args[0].t === 'native' && args[0].name === 'System.in')) throw this.err(`في المختبر يُنشأ Scanner هكذا: ${C('new Scanner(System.in)')}`, n.line);
      const o = { id: 0, kind: 'scanner', hidden: true };
      this.heap.push(o);
      return REF(o);
    }
    if (name === 'ArrayList' || name === 'LinkedList') {
      const o = { id: ++this.heapCount, kind: 'list', ln: name, elems: [], elemT: n.type.args && n.type.args[0] !== '<>' ? n.type.args[0] : null };
      if (args.length === 1 && args[0].t === 'ref' && args[0].o.kind === 'list') for (const c of args[0].o.elems) o.elems.push(this.listCell(o, c.val));
      this.heap.push(o); this.temp(o);
      return REF(o);
    }
    if (name === 'String') {
      if (!args.length) return S('');
      if (args[0].t === 'String') return S(args[0].v);
      if (args[0].t === 'ref' && args[0].o.kind === 'arr') return S(args[0].o.elems.map((c) => String.fromCharCode(c.val.v)).join(''));
    }
    if (WRAP[name]) { if (args.length !== 1) throw this.err('عدد القيم غير صحيح', n.line); return yield* this.assignConv(args[0], { k: 'cls', n: name }, n.line, name); }
    if (name === 'Object') { const ci = this.info.get('Object'); return yield* this.construct(ci, args, n.line, true); }
    const ci = this.info.get(name);
    if (!ci) throw this.err(`الكلاس ${C(name)} غير معرَّف${NATIVE_CLS.has(name) ? ' في المختبر' : ''}`, n.line);
    if (ci.kind === 'interface') throw this.err(`لا يمكن إنشاء كائن من الواجهة ${C(name)} بـ new، لأن دوالها بلا جسم. أنشئ كائنًا من كلاس يطبّقها (implements)`, n.line);
    if (ci.abstract) throw this.err(`لا يمكن إنشاء كائن من الكلاس المجرد ${C('abstract')} ${C(name)}. أنشئ كائنًا من كلاس ابن يرث منه`, n.line);
    if (ci.kind === 'enum') throw this.err(`لا يمكن إنشاء enum بـ new. استخدم ثوابته مثل ${C(name + '.' + (ci.decl.consts[0] ? ci.decl.consts[0].name : 'X'))}`, n.line);
    yield* this.loadClass(ci, n.line);
    return yield* this.construct(ci, args, n.line, ci.prelude, null, n);
  }
  allocObj(ci) {
    const o = { id: ++this.heapCount, kind: 'obj', cls: ci, fields: new Map() };
    const chain = []; for (let c = ci; c; c = c.sup) chain.unshift(c);
    for (const c of chain) for (const f of c.fields) {
      if (f.static) continue;
      const cell = new Cell(f.type, f.name, { owner: o, final: f.final, field: f, decl: c.name });
      cell.val = defVal(f.type);
      o.fields.set(f.name, cell);
    }
    if (!ci.prelude || ci.name !== 'Object') this.heap.push(o);
    this.temp(o);
    return o;
  }
  *construct(ci, args, line, quietAll, enumInfo, node) {
    const o = this.allocObj(ci);
    if (enumInfo) { o.enumName = enumInfo.name; o.ordinal = enumInfo.ordinal; }
    if (ci.prelude && !enumInfo) o.builtin = true;
    const ref = REF(o);
    if (!quietAll && !this.silent) {
      const fl = [...o.fields.values()];
      yield this.step(line, `${C('new')} تحجز كائنًا جديدًا ${C('#' + o.id)} من الكلاس ${C(ci.name)} في الذاكرة (heap)` +
        (fl.length ? `، وحقوله ${fl.map((c) => C(c.label)).join(' و ')} تبدأ بالقيم الافتراضية (0 للأعداد، و false، و null للمراجع)` : '') + '. بعدها يُستدعى الـ constructor.');
    }
    const g = this.runCtor(ci, o, args, line, node);
    if (quietAll || ci.prelude) yield* this.quiet(g); else yield* g;
    for (const c of o.fields.values()) if (c.final) c.inited = 'done';
    return ref;
  }
  pickCtor(ci, args, line) {
    const list = ci.ctors;
    if (!list.length) {
      if (args.length) throw this.err(`الكلاس ${C(ci.name)} ليس فيه constructor يستقبل ${args.length} ${args.length === 1 ? 'قيمة' : 'قيم'}. يوجد فقط الـ default constructor بدون معاملات`, line);
      return null;
    }
    const best = this.bestOverload(list, args);
    if (!best) {
      const sigs = list.map((k) => C(ci.name + '(' + k.params.map((q) => tstr(q.type)).join(', ') + ')')).join(' أو ');
      throw this.err(`لا يوجد constructor في ${C(ci.name)} يناسب القيم (${args.map((a) => this.tname(a)).join('، ') || 'بدون قيم'}). الموجود: ${sigs}` + (args.length === 0 ? `. عندما تكتب constructor بمعاملات، لا يضيف Java الـ default constructor تلقائيًا` : ''), line);
    }
    return best;
  }
  *runCtor(ci, o, args, line, node) {
    const k = this.pickCtor(ci, args, line);
    const label = `${ci.name}(${k ? k.params.map((q) => q.name).join(', ') : ''})`;
    this.pushFrame(k || { name: ci.name, isCtor: true, params: [] }, label, line, o, ci, false);
    this.top.fn.isCtor = true;
    try {
      const scope = this.top.scopes[0];
      const binds = [];
      if (k) for (let i = 0; i < k.params.length; i++) {
        const q = k.params[i];
        const c = new Cell(q.type, q.name, {});
        c.val = yield* this.assignConv(args[i], q.type, line, q.name); c.inited = true;
        scope.set(q.name, c); this.touch(c);
        binds.push(`${C(q.name)} = <b>${esc(show(c.val))}</b>`);
      }
      if (!ci.prelude) {
        if (k) yield this.step(k.line, `يُنفَّذ الـ constructor ${C(label)} لتهيئة الكائن ${C('#' + o.id)}، و${C('this')} يشير إليه` + (binds.length ? `. المعاملات: ${binds.join('، ')}.` : '.'), { call: true });
        else yield this.step(ci.decl.line, `الكلاس ${C(ci.name)} ليس فيه constructor، فيستخدم Java الـ default constructor تلقائيًا (بدون معاملات).`, { call: true });
      }
      const body = k ? k.body.body : [];
      let rest = body;
      const first = body[0];
      if (first && first.k === 'ctorcall' && first.which === 'this') {
        const a2 = []; for (const a of first.args) a2.push(yield* this.ev(a));
        if (!ci.prelude) yield this.step(first.line, `${C(first.src)} تستدعي constructor آخر من الكلاس نفسه ${C(ci.name)}.`);
        yield* this.runCtor(ci, o, a2, first.line, node);
        rest = body.slice(1);
      } else {
        if (ci.sup) {
          let a2 = [];
          if (first && first.k === 'ctorcall' && first.which === 'super') { for (const a of first.args) a2.push(yield* this.ev(a)); rest = body.slice(1); }
          const sk = ci.sup.ctors.length ? this.bestOverload(ci.sup.ctors, a2) : null;
          if (ci.sup.ctors.length && !sk) throw this.err(a2.length ? `لا يوجد constructor في الكلاس الأب ${C(ci.sup.name)} يناسب ${C(first.src)}` : `الكلاس الأب ${C(ci.sup.name)} ليس فيه constructor بدون معاملات، فيجب أن يبدأ constructor الابن بـ ${C('super(...)')} مع القيم المطلوبة`, k ? k.line : ci.decl.line);
          if (!ci.sup.prelude && !ci.prelude) yield this.step(first && first.k === 'ctorcall' ? first.line : (k ? k.line : ci.decl.line), first && first.k === 'ctorcall'
            ? `${C(first.src)} تستدعي constructor الكلاس الأب ${C(ci.sup.name)} أولًا ليهيّئ الحقول الموروثة.`
            : `قبل جسم الـ constructor يُستدعى تلقائيًا ${C('super()')}، أي constructor الكلاس الأب ${C(ci.sup.name)} بدون معاملات.`);
          const g = this.runCtor(ci.sup, o, a2, line, node);
          if (ci.sup.prelude) yield* this.quiet(g); else yield* g;
        }
        for (const st of body) if (st.k === 'ctorcall' && st !== first) throw this.err(`${C(st.which + '(...)')} يجب أن تكون أول جملة في الـ constructor`, st.line);
        // field initializers of this class
        for (const f of ci.fields) {
          if (f.static || !f.init) continue;
          const c = o.fields.get(f.name);
          c.val = yield* this.assignConv(yield* this.evInit(f.init, f.type), f.type, f.line, f.name); c.inited = true; this.touch(c);
          if (!ci.prelude) yield this.step(f.line, `تهيئة الحقل ${C(f.name)} بالقيمة <b>${esc(show(c.val))}</b> كما كُتبت عند تعريفه.`);
        }
      }
      try { yield* this.block(rest, false); }
      catch (e) { if (!(e instanceof ReturnSig)) throw e; }
      if (!ci.prelude && k) yield this.step(k.body.endLine, `انتهى الـ constructor ${C(label)}، والكائن ${C('#' + o.id)} جاهز.`);
    } finally { this.frames.pop(); }
  }

  /* ---- methods ---- */
  argT(v) {
    if (v.t === 'ref') { const o = v.o; if (o.kind === 'arr') return tstr(o.type); if (o.kind === 'list') return o.ln; return o.cls ? o.cls.name : o.kind; }
    return v.t;
  }
  score(params, args) {                       // lower is better, -1 = no match
    let s = 0;
    const va = params.length && params[params.length - 1].type.varargs;
    if (!va && params.length !== args.length) return -1;
    if (va && args.length < params.length - 1) return -1;
    for (let i = 0; i < args.length; i++) {
      const q = va && i >= params.length - 1 ? { type: params[params.length - 1].type.of } : params[i];
      const t = q.type, a = args[i];
      if (t.k === 'prim') {
        let at = a.t;
        if (a.t === 'ref' && a.o.box) at = a.o.box.t;
        if (at === t.n) continue;
        if (t.n === 'boolean' || at === 'boolean' || !NUMT.includes(at)) return -1;
        if (rank[at] > rank[t.n] && !(a.lit && t.n !== 'char' && rank[t.n] < 3)) return -1;
        if (t.n === 'char' && at !== 'char') return -1;
        s += rank[t.n] - rank[at] + 1;
      } else if (t.k === 'cls' && WRAP[t.n]) {
        if (a.t === WRAP[t.n] || a.t === 'null') { s += 1; continue; }
        return -1;
      } else if (t.k === 'cls' && t.n === 'String') { if (a.t !== 'String' && a.t !== 'null') return -1; }
      else if (t.k === 'arr') { if (a.t === 'null') continue; if (a.t !== 'ref' || a.o.kind !== 'arr') return -1; }
      else if (t.k === 'cls') {
        if (a.t === 'null') { s += 1; continue; }
        if (t.n === 'Object' || this.isTypeParamName(t.n)) { s += 10; continue; }
        if (a.t === 'ref' && a.o.kind === 'obj') { if (!isSub(a.o.cls, t.n)) return -1; let d = 0; for (let c = a.o.cls; c && c.name !== t.n; c = c.sup) d++; s += d; }
        else if (a.t === 'ref' && a.o.kind === 'list') { if (!['ArrayList', 'LinkedList', 'List', 'Collection'].includes(t.n)) return -1; }
        else if (['Comparable', 'Number'].includes(t.n)) s += 5;
        else return -1;
      }
    }
    return s + (va ? 50 : 0);
  }
  isTypeParamName(n) { return /^[A-Z][0-9]?$/.test(n); }
  bestOverload(list, args) {
    let best = null, bs = Infinity;
    for (const m of list) { const s = this.score(m.params, args); if (s >= 0 && s < bs) { bs = s; best = m; } }
    return best;
  }
  findMethod(ci, name, args, line, quietMissing) {
    for (let c = ci; c; c = c.sup) {
      const l = c.methods.get(name);
      if (l) { const m = this.bestOverload(l, args); if (m) return { m, owner: c }; }
    }
    for (const ii of allIfaces(ci)) {
      const l = ii.methods.get(name);
      if (l) { const m = this.bestOverload(l, args); if (m) return { m, owner: ii }; }
    }
    return null;
  }
  noMethod(ci, name, args, line) {
    let any = null;
    for (let c = ci; c && !any; c = c.sup) if (c.methods.get(name)) any = c.methods.get(name);
    for (const ii of allIfaces(ci)) if (!any && ii.methods.get(name)) any = ii.methods.get(name);
    if (any) return this.err(`لا توجد نسخة من الدالة ${C(name)} تناسب القيم (${args.map((a) => this.tname(a)).join('، ') || 'بدون قيم'}). الموجود: ${any.map((m) => C(name + '(' + m.params.map((q) => tstr(q.type)).join(', ') + ')')).join(' أو ')}`, line);
    return this.err(`الكلاس ${C(ci.name)} لا يحتوي الدالة ${C(name + '()')} (cannot find symbol)`, line);
  }
  *callUnqualified(n) {
    if (n.name.startsWith('__')) return yield* this.nativeHelper(n);
    const ci = this.top.cls;
    const args = []; for (const a of n.args) args.push(yield* this.ev(a));
    let r = ci && this.findMethod(ci, n.name, args, n.line);
    if (!r && ci && ci.decl.outer) { const oc = this.info.get(ci.decl.outer.name); r = this.findMethod(oc, n.name, args, n.line); }
    if (!r) {
      if (n.name === 'println' || n.name === 'print') throw this.err(`الطباعة في Java تُكتب ${C('System.out.' + n.name + '(...)')}`, n.line);
      throw ci ? this.noMethod(ci, n.name, args, n.line) : this.err(`الدالة ${C(n.name)} غير معرَّفة`, n.line);
    }
    if (r.m.static) return yield* this.invoke(r.m, r.owner, null, args, n, 'static');
    const o = this.top.thisObj;
    if (!o) throw this.err(`لا يمكن استدعاء الدالة ${C(n.name + '()')} مباشرة داخل دالة ${C('static')} مثل main، لأنها ليست static وتحتاج كائنًا (non-static method cannot be referenced from a static context). اجعلها ${C('static')} أو أنشئ كائنًا واستدعها به`, n.line);
    return yield* this.dispatch(REF(o), n.name, args, n, r);
  }
  *dispatch(ref, name, args, n, hint) {
    const r = this.findMethod(ref.o.cls, name, args, n.line) || hint;
    if (!r) throw this.noMethod(ref.o.cls, name, args, n.line);
    return yield* this.invoke(r.m, r.owner, ref, args, n, 'virtual');
  }
  *callVirtual(ref, name, args, line) {
    const r = this.findMethod(ref.o.cls, name, args, line);
    if (!r) throw this.noMethod(ref.o.cls, name, args, line);
    return yield* this.invoke(r.m, r.owner, ref, args, { line, src: name + '()', args: [] }, 'virtual');
  }
  *callMember(n) {
    // static / native class targets
    if (n.obj.k === 'var' && !this.lookup(n.obj.name) && !(this.top.cls && this.findField(this.top.cls, n.obj.name))) {
      const nm = n.obj.name;
      if (this.info.has(nm) && !this.info.get(nm).prelude) {
        const ci = this.info.get(nm);
        yield* this.loadClass(ci, n.line);
        const args = []; for (const a of n.args) args.push(yield* this.ev(a));
        if (ci.kind === 'enum' && n.name === 'values' && !args.length) return REF(this.newArr({ k: 'arr', of: { k: 'cls', n: nm } }, ci.consts.map((r, i) => Object.assign(new Cell({ k: 'cls', n: nm }, `[${i}]`), { val: r, inited: true }))));
        if (ci.kind === 'enum' && n.name === 'valueOf' && args.length === 1) { const r = ci.consts.find((x) => x.o.enumName === args[0].v); if (!r) yield* this.jthrow('IllegalArgumentException', 'No enum constant ' + nm + '.' + args[0].v, n.line); return r; }
        const r = this.findMethod(ci, n.name, args, n.line);
        if (!r) throw this.noMethod(ci, n.name, args, n.line);
        if (!r.m.static) throw this.err(`الدالة ${C(n.name)} ليست static، فتُستدعى عن طريق كائن وليس عن طريق اسم الكلاس ${C(nm)}`, n.line);
        this.checkAccess(r.m, r.owner, n.line, 'الدالة');
        return yield* this.invoke(r.m, r.owner, null, args, n, 'static');
      }
      if (NATIVE_CLS.has(nm) || WRAP[nm]) {
        const args = []; for (const a of n.args) args.push(yield* this.ev(a));
        return yield* this.staticNative(nm, n.name, args, n);
      }
    }
    const ov = yield* this.ev(n.obj);
    const args = []; for (const a of n.args) args.push(yield* this.ev(a));
    if (ov.t === 'null') yield* this.jthrow('NullPointerException', `Cannot invoke "${n.name}()" because "${n.obj.src}" is null`, n.line);
    if (ov.t === 'String') return yield* this.strMethod(ov, n, args);
    if (ov.t === 'class') {
      const r = this.findMethod(ov.cls, n.name, args, n.line);
      if (!r) throw this.noMethod(ov.cls, n.name, args, n.line);
      return yield* this.invoke(r.m, r.owner, null, args, n, 'static');
    }
    if (isNum(ov) || ov.t === 'boolean') return yield* this.boxMethod(ov, n, args);
    if (ov.t !== 'ref') throw this.err(`لا يمكن استدعاء ${C('.' + n.name + '()')} على ${this.tname(ov)}`, n.line);
    const o = ov.o;
    if (o.kind === 'scanner') return yield* this.scanner(n, args);
    if (o.kind === 'list') return yield* this.listMethod(ov, n, args);
    if (o.kind === 'arr') {
      if (n.name === 'length') throw this.err(`طول المصفوفة ${C(n.obj.src + '.length')} بدون أقواس`, n.line);
      if (n.name === 'clone') { const a = this.newArr(o.type, o.elems.map((c, i) => Object.assign(new Cell(c.type, `[${i}]`), { val: c.val, inited: true }))); a.elems.forEach((c) => { c.owner = a; }); return REF(a); }
      throw this.err(`المصفوفات لا تحتوي الدالة ${C(n.name + '()')}`, n.line);
    }
    if (o.kind === 'obj' && o.enumName !== undefined) {
      if (n.name === 'name' && !args.length) return S(o.enumName);
      if (n.name === 'ordinal' && !args.length) return I(o.ordinal);
      if (n.name === 'compareTo' && args.length === 1) return I(o.ordinal - args[0].o.ordinal);
      if (n.name === 'toString' && !args.length && !this.findOwn(o.cls, 'toString')) return S(o.enumName);
    }
    // static type check: method must exist in the declared type of the variable
    const decl = this.declaredClass(n.obj);
    if (decl && decl !== o.cls && !this.findMethod(decl, n.name, args, n.line) && this.findMethod(o.cls, n.name, args, n.line))
      throw this.err(`المتغير ${C(n.obj.src)} نوعه ${C(decl.name)}، والكلاس ${C(decl.name)} لا يحتوي الدالة ${C(n.name + '()')}، رغم أن الكائن الحقيقي من النوع ${C(o.cls.name)}. المترجم ينظر إلى نوع المتغير، فاستخدم التحويل ${C('((' + o.cls.name + ') ' + n.obj.src + ').' + n.name + '()')}`, n.line);
    const r = this.findMethod(o.cls, n.name, args, n.line);
    if (!r) throw this.noMethod(o.cls, n.name, args, n.line);
    this.checkAccess(r.m, r.owner, n.line, 'الدالة');
    return yield* this.invoke(r.m, r.owner, r.m.static ? null : ov, args, n, r.m.static ? 'static' : 'virtual');
  }
  findOwn(ci, name) { for (let c = ci; c && !c.prelude; c = c.sup) if (c.methods.get(name)) return true; return false; }
  declaredClass(node) {
    let c = null;
    if (node.k === 'var') c = this.lookup(node.name) || (this.top.thisObj && this.top.thisObj.fields.get(node.name));
    if (!c || !c.type || c.type.k !== 'cls') return null;
    const ci = this.info.get(c.type.n);
    return ci && !ci.prelude ? ci : null;
  }
  *invoke(m, owner, ref, args, n, how) {
    if (m.abstract && !m.body) throw this.err(`الدالة ${C(m.name)} مجردة (بلا جسم)`, n.line);
    const quiet = owner.prelude || this.silent > 0;
    const o = ref ? ref.o : null;
    const label = `${owner.name}.${m.name}(${m.params.map((q) => q.name).join(', ')})`;
    const decl = n.obj ? this.declaredClass(n.obj) : null;
    const g = this.invokeBody(m, owner, o, args, n, how, label, decl);
    if (quiet) return yield* this.quiet(g);
    return yield* g;
  }
  *invokeBody(m, owner, o, args, n, how, label, decl) {
    const callLine = n.line;
    this.pushFrame(m, label, callLine, m.static ? null : o, owner, m.static);
    try {
      const scope = this.top.scopes[0];
      const binds = [];
      const va = m.params.length && m.params[m.params.length - 1].type.varargs;
      for (let i = 0; i < m.params.length; i++) {
        const q = m.params[i];
        const c = new Cell(q.type, q.name, {});
        if (va && i === m.params.length - 1) {
          const rest = args.slice(i);
          const arr = this.newArr(q.type, []);
          for (let j = 0; j < rest.length; j++) arr.elems.push(Object.assign(new Cell(q.type.of, `[${j}]`, { owner: arr }), { val: rest[j], inited: true }));
          c.val = REF(arr);
        } else c.val = yield* this.assignConv(args[i], q.type, callLine, q.name);
        c.inited = true;
        scope.set(q.name, c); this.touch(c);
        const isRef = c.val.t === 'ref';
        binds.push(`${C(q.name)} = <b>${esc(show(c.val))}</b>${isRef ? ' (نسخة من المرجع، تشير إلى الكائن نفسه)' : ''}`);
      }
      if (!this.silent) {
        let who = '';
        if (how === 'virtual' && o) {
          who = `على الكائن ${C('#' + o.id)} (${C('this')} يشير إليه)`;
          if (o.cls !== owner || (decl && decl !== o.cls)) {
            if (decl && decl !== o.cls && owner !== decl) who += `. المتغير نوعه ${C(decl.name)} لكن الكائن الحقيقي من النوع ${C(o.cls.name)}، فتُنفَّذ نسخة ${C(owner.name)} (تعدد الأشكال polymorphism)`;
            else if (o.cls !== owner) who += `. الكلاس ${C(o.cls.name)} لم يعِد تعريفها، فتُنفَّذ النسخة الموروثة من ${C(owner.name)}`;
          }
        } else if (how === 'super') who = `من الكلاس الأب ${C(owner.name)} على الكائن نفسه ${C('#' + o.id)}`;
        else if (how === 'static') who = `(دالة ${C('static')} تُستدعى بدون كائن)`;
        yield this.step(m.line, `استدعاء الدالة ${C(owner.name + '.' + m.name)} من السطر ${callLine} ${who}` + (binds.length ? `. المعاملات: ${binds.join('، ')}.` : '.'), { call: true });
      }
      try { yield* this.block(m.body.body, false); }
      catch (e) {
        if (e instanceof ReturnSig) {
          if (m.ret.k === 'prim' && m.ret.n === 'void') return VOID;
          return yield* this.assignConv(e.val, m.ret, e.line, 'القيمة الراجعة');
        }
        throw e;
      }
      if (!(m.ret.k === 'prim' && m.ret.n === 'void')) throw this.err(`الدالة ${C(m.name)} يجب أن تُرجع قيمة من النوع ${tstr(m.ret)} بـ ${C('return')} (missing return statement)`, m.body.endLine);
      if (!this.silent) yield this.step(m.body.endLine, `انتهت الدالة ${C(m.name)}، ويعود التنفيذ إلى السطر ${callLine}.`);
      return VOID;
    } finally { this.frames.pop(); }
  }
  *nativeHelper(n) {
    const args = []; for (const a of n.args) args.push(yield* this.ev(a));
    const o = args[0] && args[0].o;
    switch (n.name) {
      case '__qname': return S((PKG[o.cls.name] || (o.cls.prelude ? 'java.lang.' : '')) + o.cls.name);
      case '__hex': return S(hashOf(o).toString(16));
      case '__hash': return I(hashOf(o));
      case '__trace': { const t = yield* this.quiet(this.callVirtual(args[0], 'toString', [], n.line)); this.output += t.v + '\n'; this.lastPrint = t.v + '\n'; return VOID; }
    }
    throw this.err('دالة غير معروفة', n.line);
  }

  /* ---- printing ---- */
  *print(n) {
    let text = '', desc = '';
    if (n.fn === 'printf') {
      if (!n.args.length) throw this.err('printf تحتاج نص التنسيق', n.line);
      const vals = []; for (const a of n.args) vals.push(yield* this.ev(a));
      text = yield* this.format(vals, n.line);
      desc = `${C('printf')} تطبع النص بعد تعويض ${C('%d')} و ${C('%s')} و ${C('%.2f')} بالقيم`;
    } else {
      if (n.args.length > 1) throw this.err(`${C(n.fn)} تستقبل قيمة واحدة. لطباعة أكثر من قيمة اجمعها بـ ${C('+')}، مثل ${C('System.out.println("x = " + x)')}`, n.line);
      if (n.args.length) {
        const a = n.args[0];
        const v = yield* this.ev(a);
        if (v.t === 'void') throw this.err(`الدالة ${C(a.src)} من النوع void ولا تُرجع قيمة لطباعتها`, n.line);
        if (v.t === 'ref' && v.o.kind === 'arr' && v.o.elemType.k === 'prim' && v.o.elemType.n === 'char') text = v.o.elems.map((c) => String.fromCharCode(c.val.v)).join('');
        else text = yield* this.jstr(v, n.line);
        if (v.t === 'ref' && v.o.kind === 'arr') this.pendingWarn = `طباعة المصفوفة مباشرة تُظهر نوعها وعنوانها وليس عناصرها. اطبع العناصر بحلقة أو بـ ${C('Arrays.toString(' + a.src + ')')}`;
        if (v.t === 'ref' && v.o.kind === 'obj' && !this.findOwn(v.o.cls, 'toString') && v.o.enumName === undefined) this.pendingWarn = `الكلاس ${C(v.o.cls.name)} لم يعِد تعريف ${C('toString()')}، فطُبعت النسخة الموروثة من Object: اسم الكلاس و@ ورقم. أضف ${C('public String toString()')} لطباعة بيانات الكائن`;
        desc = a.k === 'str' ? `${C('System.out.' + n.fn)} تطبع النص ${C('"' + a.v.replace(/\n/g, '\\n') + '"')}` : `${C('System.out.' + n.fn)} تطبع قيمة ${C(a.src)}`;
      } else desc = `${C('System.out.println()')} تطبع سطرًا فارغًا`;
      if (n.fn === 'println') { text += '\n'; desc += n.args.length ? '، ثم تنتقل إلى سطر جديد' : ''; }
    }
    this.output += text;
    this.lastPrint = text;
    return VOID;
  }
  *format(vals, line) {
    if (vals[0].t !== 'String') throw this.err('أول قيمة في printf هي نص التنسيق', line);
    const f = vals[0].v; let k = 1, out = '';
    for (let i = 0; i < f.length; i++) {
      if (f[i] !== '%') { out += f[i]; continue; }
      const m = f.slice(i).match(/^%([-0+ ,]*)(\d+)?(\.\d+)?([dfsnceSbx%])/);
      if (!m) throw this.err(`صيغة التنسيق ${C(f.slice(i, i + 3))} غير مدعومة`, line);
      i += m[0].length - 1;
      const [, flags, width, prec, conv] = m;
      if (conv === 'n') { out += '\n'; continue; }
      if (conv === '%') { out += '%'; continue; }
      const v = vals[k++];
      if (!v) throw this.err('عدد القيم في printf أقل من عدد العلامات %', line);
      let s;
      switch (conv) {
        case 'd': if (!isIntT(v.t) || v.t === 'char') throw this.err(`${C('%d')} للأعداد الصحيحة، والقيمة ${this.tname(v)}. استخدم ${C('%f')} للعشرية`, line); s = String(v.v); if (flags.includes(',')) s = Number(v.v).toLocaleString('en-US'); break;
        case 'f': case 'e': if (!isNum(v) || isIntT(v.t)) throw this.err(`${C('%' + conv)} للأعداد العشرية، والقيمة ${this.tname(v)}. استخدم ${C('%d')} للصحيحة`, line); s = conv === 'f' ? v.v.toFixed(prec ? +prec.slice(1) : 6) : v.v.toExponential(prec ? +prec.slice(1) : 6).replace(/e([+-])(\d)$/, 'e$10$2'); break;
        case 'c': s = v.t === 'char' ? String.fromCharCode(v.v) : String.fromCharCode(v.v); break;
        case 'b': s = v.t === 'boolean' ? String(v.v) : String(v.t !== 'null'); break;
        case 'x': s = (v.v >>> 0).toString(16); break;
        default: s = yield* this.jstr(v, line); if (prec) s = s.slice(0, +prec.slice(1)); if (conv === 'S') s = s.toUpperCase();
      }
      if (width) s = flags.includes('-') ? s.padEnd(+width) : s.padStart(+width, flags.includes('0') && conv !== 's' ? '0' : ' ');
      out += s;
    }
    return out;
  }

  /* ---- strings ---- */
  *strMethod(sv, n, args) {
    const s = sv.v, line = n.line;
    const need = (a, b) => { if (args.length < a || args.length > (b === undefined ? a : b)) throw this.err(`عدد القيم في ${C(n.name + '()')} غير صحيح`, line); };
    const str = (v) => { if (v.t === 'String') return v.v; if (v.t === 'char') return String.fromCharCode(v.v); throw this.err(`${C(n.name)} تستقبل نصًا`, line); };
    const idx = (v) => { if (!isIntT(v.t)) throw this.err('الفهرس يجب أن يكون عددًا صحيحًا', line); return v.v; };
    switch (n.name) {
      case 'length': need(0); return I(s.length);
      case 'charAt': { need(1); const k = idx(args[0]); if (k < 0 || k >= s.length) yield* this.jthrow('StringIndexOutOfBoundsException', `Index ${k} out of bounds for length ${s.length}`, line); return CH(s.charCodeAt(k)); }
      case 'equals': need(1); return B(args[0].t === 'String' && args[0].v === s);
      case 'equalsIgnoreCase': need(1); return B(args[0].t === 'String' && args[0].v.toLowerCase() === s.toLowerCase());
      case 'compareTo': { need(1); const t = str(args[0]); for (let i = 0; i < Math.min(s.length, t.length); i++) if (s[i] !== t[i]) return I(s.charCodeAt(i) - t.charCodeAt(i)); return I(s.length - t.length); }
      case 'compareToIgnoreCase': { need(1); const a = s.toLowerCase(), t = str(args[0]).toLowerCase(); for (let i = 0; i < Math.min(a.length, t.length); i++) if (a[i] !== t[i]) return I(a.charCodeAt(i) - t.charCodeAt(i)); return I(a.length - t.length); }
      case 'toUpperCase': need(0); return S(s.toUpperCase());
      case 'toLowerCase': need(0); return S(s.toLowerCase());
      case 'trim': need(0); return S(s.trim());
      case 'isEmpty': need(0); return B(s.length === 0);
      case 'isBlank': need(0); return B(s.trim().length === 0);
      case 'contains': need(1); return B(s.includes(str(args[0])));
      case 'startsWith': need(1); return B(s.startsWith(str(args[0])));
      case 'endsWith': need(1); return B(s.endsWith(str(args[0])));
      case 'indexOf': need(1, 2); return I(s.indexOf(str(args[0]), args[1] ? idx(args[1]) : 0));
      case 'lastIndexOf': need(1); return I(s.lastIndexOf(str(args[0])));
      case 'substring': {
        need(1, 2); const a = idx(args[0]), b = args.length > 1 ? idx(args[1]) : s.length;
        if (a < 0 || b > s.length || a > b) yield* this.jthrow('StringIndexOutOfBoundsException', `begin ${a}, end ${b}, length ${s.length}`, line);
        return S(s.slice(a, b));
      }
      case 'concat': need(1); return S(s + str(args[0]));
      case 'replace': need(2); return S(s.split(str(args[0])).join(str(args[1])));
      case 'repeat': need(1); return S(s.repeat(Math.max(0, idx(args[0]))));
      case 'toCharArray': { need(0); const a = this.newArr({ k: 'arr', of: { k: 'prim', n: 'char' } }, []); [...s].forEach((ch, i) => a.elems.push(Object.assign(new Cell({ k: 'prim', n: 'char' }, `[${i}]`, { owner: a }), { val: CH(ch.charCodeAt(0)), inited: true }))); return REF(a); }
      case 'split': {
        need(1); const parts = s.split(new RegExp(str(args[0]))); while (parts.length > 1 && parts[parts.length - 1] === '') parts.pop();
        const a = this.newArr({ k: 'arr', of: { k: 'cls', n: 'String', args: [] } }, []);
        parts.forEach((x, i) => a.elems.push(Object.assign(new Cell({ k: 'cls', n: 'String' }, `[${i}]`, { owner: a }), { val: S(x), inited: true })));
        return REF(a);
      }
      case 'hashCode': { let h = 0; for (let i = 0; i < s.length; i++) h = (Math.imul(h, 31) + s.charCodeAt(i)) | 0; return I(h); }
      case 'toString': return sv;
      case 'chars': throw this.err('streams غير مدعومة في المختبر', line);
    }
    throw this.err(`الدالة ${C('.' + n.name + '()')} غير مدعومة للنصوص في المختبر`, line);
  }
  *boxMethod(v, n, args) {
    const line = n.line;
    switch (n.name) {
      case 'equals': return B(args.length === 1 && isNum(args[0]) === isNum(v) && args[0].v === v.v && args[0].t === v.t);
      case 'compareTo': return I(v.v < args[0].v ? -1 : v.v > args[0].v ? 1 : 0);
      case 'intValue': return I(v.v); case 'doubleValue': return D(v.v); case 'longValue': return LNG(v.v);
      case 'toString': return S(prim2s(v));
    }
    throw this.err(`لا يمكن استدعاء ${C('.' + n.name + '()')} على قيمة بسيطة من النوع ${v.t}`, line);
  }
  *staticNative(cls, name, args, n) {
    const line = n.line;
    const num = (i) => { const v = args[i]; if (!v || !isNum(v)) throw this.err(`${C(cls + '.' + name)} تستقبل أعدادًا`, line); return v; };
    const wide = (a, b) => (rank[a.t] >= rank[b.t] ? a.t : b.t);
    if (cls === 'Math') {
      switch (name) {
        case 'max': case 'min': { const a = num(0), b = num(1); const t = rank[wide(a, b)] < 3 ? 'int' : wide(a, b); return this.castPrim({ t, v: Math[name](a.v, b.v) }, t); }
        case 'abs': { const a = num(0); const t = rank[a.t] < 3 ? 'int' : a.t; return this.castPrim({ t, v: Math.abs(a.v) }, t); }
        case 'pow': return D(Math.pow(num(0).v, num(1).v));
        case 'sqrt': return D(Math.sqrt(num(0).v));
        case 'cbrt': return D(Math.cbrt(num(0).v));
        case 'round': { const a = num(0); return a.t === 'float' ? I(Math.floor(a.v + 0.5)) : LNG(Math.floor(a.v + 0.5)); }
        case 'floor': return D(Math.floor(num(0).v));
        case 'ceil': return D(Math.ceil(num(0).v));
        case 'random': throw this.err(`${C('Math.random()')} تعطي قيمًا عشوائية، والمختبر يحتاج نتائج ثابتة. استخدم قيمًا محددة`, line);
        case 'sin': case 'cos': case 'tan': case 'log': case 'log10': case 'exp': return D(Math[name](num(0).v));
      }
    }
    if (cls === 'Integer' || cls === 'Long' || cls === 'Short') {
      if (name === 'parseInt' || name === 'valueOf' || name === 'parseLong') {
        const a = args[0];
        if (a.t !== 'String') { if (name === 'valueOf' && isIntT(a.t)) return I(a.v); throw this.err(`${C(cls + '.' + name)} تحوّل نصًا إلى عدد`, line); }
        if (!/^[-+]?\d+$/.test(a.v.trim()) || a.v.trim() !== a.v) yield* this.jthrow('NumberFormatException', `For input string: "${a.v}"`, line);
        return cls === 'Long' || name === 'parseLong' ? LNG(Number(a.v)) : I(Number(a.v));
      }
      if (name === 'toString') return S(prim2s(args[0]));
      if (name === 'max' || name === 'min') return I(Math[name](args[0].v, args[1].v));
      if (name === 'compare') return I(args[0].v < args[1].v ? -1 : args[0].v > args[1].v ? 1 : 0);
      if (name === 'sum') return I(args[0].v + args[1].v);
    }
    if (cls === 'Double' || cls === 'Float') {
      if (name === 'parseDouble' || name === 'valueOf' || name === 'parseFloat') {
        const a = args[0];
        if (a.t !== 'String') { if (isNum(a)) return D(a.v); throw this.err(`${C(cls + '.' + name)} تحوّل نصًا إلى عدد`, line); }
        if (!/^\s*[-+]?(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?[dDfF]?\s*$/.test(a.v)) yield* this.jthrow('NumberFormatException', `For input string: "${a.v}"`, line);
        return D(parseFloat(a.v));
      }
      if (name === 'toString') return S(prim2s(args[0]));
      if (name === 'compare') return I(args[0].v < args[1].v ? -1 : args[0].v > args[1].v ? 1 : 0);
    }
    if (cls === 'Character') {
      const c = args[0] && args[0].t === 'char' ? String.fromCharCode(args[0].v) : null;
      if (c === null) throw this.err(`${C('Character.' + name)} تستقبل حرفًا char`, line);
      switch (name) {
        case 'isDigit': return B(/[0-9]/.test(c)); case 'isLetter': return B(/[A-Za-z؀-ۿ]/.test(c));
        case 'isLetterOrDigit': return B(/[A-Za-z0-9]/.test(c)); case 'isUpperCase': return B(/[A-Z]/.test(c));
        case 'isLowerCase': return B(/[a-z]/.test(c)); case 'isWhitespace': return B(/\s/.test(c));
        case 'toUpperCase': return CH(c.toUpperCase().charCodeAt(0)); case 'toLowerCase': return CH(c.toLowerCase().charCodeAt(0));
        case 'getNumericValue': return I(/[0-9]/.test(c) ? +c : -1);
        case 'toString': return S(c);
      }
    }
    if (cls === 'String') {
      if (name === 'valueOf') { if (args[0].t === 'ref' && args[0].o.kind === 'arr') return S(args[0].o.elems.map((c) => String.fromCharCode(c.val.v)).join('')); return S(yield* this.jstr(args[0], line)); }
      if (name === 'format') return S(yield* this.format(args, line));
      if (name === 'join') { const parts = []; const src = args.slice(1); const list = src.length === 1 && src[0].t === 'ref' ? src[0].o.elems.map((c) => c.val) : src; for (const v of list) parts.push(yield* this.jstr(v, line)); return S(parts.join(args[0].v)); }
    }
    if (cls === 'Boolean' && name === 'parseBoolean') return B(args[0].v.toLowerCase() === 'true');
    if (cls === 'Arrays') {
      const a = args[0];
      if (!a || a.t !== 'ref' || a.o.kind !== 'arr') throw this.err(`${C('Arrays.' + name)} تستقبل مصفوفة`, line);
      if (name === 'toString') { const parts = []; for (const c of a.o.elems) parts.push(yield* this.jstr(c.val, line)); return S('[' + parts.join(', ') + ']'); }
      if (name === 'sort') { yield* this.sortCells(a.o.elems, line); a.o.elems.forEach((c, i) => { c.label = `[${i}]`; this.touch(c); }); return VOID; }
      if (name === 'fill') { for (const c of a.o.elems) { c.val = yield* this.assignConv(args[1], a.o.elemType, line, 'عنصر'); this.touch(c); } return VOID; }
      if (name === 'equals') return B(args[1].t === 'ref' && a.o.elems.length === args[1].o.elems.length && a.o.elems.every((c, i) => c.val.v === args[1].o.elems[i].val.v));
    }
    if (cls === 'Collections') {
      const a = args[0];
      if (!a || a.t !== 'ref' || a.o.kind !== 'list') throw this.err(`${C('Collections.' + name)} تستقبل قائمة`, line);
      if (name === 'sort') { yield* this.sortCells(a.o.elems, line); a.o.elems.forEach((c, i) => { c.label = `[${i}]`; this.touch(c); }); return VOID; }
      if (name === 'reverse') { a.o.elems.reverse(); a.o.elems.forEach((c, i) => { c.label = `[${i}]`; this.touch(c); }); return VOID; }
      if (name === 'max' || name === 'min') { let best = null; for (const c of a.o.elems) { if (!best || (yield* this.cmp(c.val, best.val, line)) * (name === 'max' ? 1 : -1) > 0) best = c; } if (!best) yield* this.jthrow('NoSuchElementException', '', line); return best.val; }
    }
    if (cls === 'Objects' && name === 'equals') return B(yield* this.jequals(args[0], args[1], line));
    if (cls === 'System' && name === 'exit') throw new ReturnSig(line, null);
    throw this.err(`${C(cls + '.' + name + '()')} غير مدعومة في المختبر`, line);
  }
  *cmp(a, b, line) {
    if (isNum(a) && isNum(b)) return a.v < b.v ? -1 : a.v > b.v ? 1 : 0;
    if (a.t === 'String' && b.t === 'String') return a.v < b.v ? -1 : a.v > b.v ? 1 : 0;
    if (a.t === 'ref' && a.o.kind === 'obj') {
      if (!isSub(a.o.cls, 'Comparable') && !this.findOwn(a.o.cls, 'compareTo')) throw this.err(`لترتيب كائنات ${C(a.o.cls.name)} يجب أن يطبّق الكلاس ${C('Comparable')} ويعيد تعريف ${C('compareTo')}`, line);
      const r = yield* this.callVirtual(a, 'compareTo', [b], line);
      return r.v;
    }
    throw this.err('لا يمكن مقارنة هذه القيم للترتيب', line);
  }
  *sortCells(cells, line) {
    const vals = cells.map((c) => c.val);
    for (let i = 1; i < vals.length; i++) { const x = vals[i]; let j = i - 1; while (j >= 0 && (yield* this.cmp(vals[j], x, line)) > 0) { vals[j + 1] = vals[j]; j--; } vals[j + 1] = x; }
    cells.forEach((c, i) => { c.val = vals[i]; });
  }
  *jequals(a, b, line) {
    if (a.t === 'null' || b.t === 'null') return a.t === b.t;
    if (a.t === 'String') return b.t === 'String' && a.v === b.v;
    if (isNum(a) || a.t === 'boolean') return a.t === b.t && a.v === b.v;
    if (a.t === 'ref' && a.o.kind === 'obj') { const r = yield* this.callVirtual(a, 'equals', [b], line); return r.v; }
    return a.t === 'ref' && b.t === 'ref' && a.o === b.o;
  }

  /* ---- Scanner ---- */
  *readTok(kind, n) {
    for (;;) {
      this.inbuf = this.inbuf.replace(/^\s+/, '');
      if (this.inbuf.length) break;
      yield { type: 'input', line: n.line, msg: `${C(n.src)} تنتظر أن يُدخل المستخدم ${kind}. اكتب القيمة في الكونسول ثم اضغط Enter.`, varName: n.obj.src };
      if (this.eof) yield* this.jthrow('NoSuchElementException', 'No line found', n.line);
    }
    const m = this.inbuf.match(/^\S+/);
    return m[0];
  }
  *scanner(n, args) {
    const line = n.line;
    const take = (tok) => { this.inbuf = this.inbuf.replace(/^\s+/, '').slice(tok.length); };
    switch (n.name) {
      case 'nextInt': case 'nextLong': case 'nextShort': case 'nextByte': {
        const tok = yield* this.readTok('عددًا صحيحًا', n);
        if (!/^[-+]?\d+$/.test(tok)) yield* this.jthrow('InputMismatchException', `For input string: "${tok}"`, line);
        take(tok); this.notes.push(`أدخل المستخدم <b>${esc(tok)}</b>.`); this.lastNum = true;
        return n.name === 'nextLong' ? LNG(Number(tok)) : I(Number(tok));
      }
      case 'nextDouble': case 'nextFloat': {
        const tok = yield* this.readTok('عددًا', n);
        if (!/^[-+]?(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?$/.test(tok)) yield* this.jthrow('InputMismatchException', `For input string: "${tok}"`, line);
        take(tok); this.notes.push(`أدخل المستخدم <b>${esc(tok)}</b>.`); this.lastNum = true;
        return n.name === 'nextFloat' ? FL(Number(tok)) : D(Number(tok));
      }
      case 'nextBoolean': {
        const tok = yield* this.readTok('true أو false', n);
        if (!/^(true|false)$/i.test(tok)) yield* this.jthrow('InputMismatchException', `For input string: "${tok}"`, line);
        take(tok); this.notes.push(`أدخل المستخدم <b>${esc(tok)}</b>.`); this.lastNum = true;
        return B(tok.toLowerCase() === 'true');
      }
      case 'next': {
        const tok = yield* this.readTok('كلمة', n);
        take(tok); this.notes.push(`أدخل المستخدم <b>${esc(tok)}</b>. ${C('next()')} تقرأ كلمة واحدة فقط حتى أول مسافة.`); this.lastNum = true;
        return S(tok);
      }
      case 'nextLine': {
        if (!this.inbuf.length) {
          yield { type: 'input', line, msg: `${C(n.src)} تنتظر أن يُدخل المستخدم سطرًا كاملًا. اكتبه في الكونسول ثم اضغط Enter.`, varName: n.obj.src };
          if (this.eof && !this.inbuf.length) yield* this.jthrow('NoSuchElementException', 'No line found', line);
        }
        const k = this.inbuf.indexOf('\n');
        const s = k < 0 ? this.inbuf : this.inbuf.slice(0, k);
        this.inbuf = k < 0 ? '' : this.inbuf.slice(k + 1);
        if (s === '' && this.lastNum) this.pendingWarn = `${C('nextLine()')} أعادت نصًا فارغًا لأنها قرأت بقية السطر السابق (Enter) بعد ${C('nextInt()')} أو ${C('next()')}. ضع ${C(n.obj.src + '.nextLine();')} إضافية قبلها لتتخلص من نهاية السطر`;
        else this.notes.push(`أدخل المستخدم <b>${esc(s)}</b>. ${C('nextLine()')} تقرأ السطر كاملًا مع المسافات.`);
        this.lastNum = false;
        return S(s);
      }
      case 'hasNextInt': { this.inbuf = this.inbuf.replace(/^\s+/, ''); return B(/^[-+]?\d+(\s|$)/.test(this.inbuf)); }
      case 'hasNext': { this.inbuf = this.inbuf.replace(/^\s+/, ''); return B(this.inbuf.length > 0); }
      case 'close': return VOID;
    }
    throw this.err(`الدالة ${C('Scanner.' + n.name + '()')} غير مدعومة في المختبر`, line);
  }

  /* ---- ArrayList / LinkedList ---- */
  listCell(o, v) { const c = new Cell(o.elemT || { k: 'cls', n: 'Object' }, '', { owner: o }); c.val = v; c.inited = true; return c; }
  relabel(o) { o.elems.forEach((c, i) => { c.label = `[${i}]`; }); }
  *listMethod(lv, n, args) {
    const o = lv.o, L = o.elems, line = n.line;
    const idx = (v, max) => { if (!isIntT(v.t)) throw this.err('الفهرس يجب أن يكون عددًا صحيحًا', line); return v.v; };
    const conv = function* (v) { return o.elemT ? yield* this.assignConv(v, o.elemT, line, 'عنصر القائمة') : v; }.bind(this);
    const oob = function* (k) { yield* this.jthrow('IndexOutOfBoundsException', `Index ${k} out of bounds for length ${L.length}`, line); }.bind(this);
    const find = function* (v) { for (let i = 0; i < L.length; i++) if (yield* this.jequals(v, L[i].val, line)) return i; return -1; }.bind(this);
    switch (n.name) {
      case 'add': case 'addLast': {
        if (args.length === 2 && n.name === 'add') { const k = idx(args[0]); if (k < 0 || k > L.length) yield* oob(k); const c = this.listCell(o, yield* conv(args[1])); L.splice(k, 0, c); this.relabel(o); this.touch(c); return VOID; }
        const c = this.listCell(o, yield* conv(args[0])); L.push(c); this.relabel(o); this.touch(c); return n.name === 'add' ? B(true) : VOID;
      }
      case 'addFirst': { const c = this.listCell(o, yield* conv(args[0])); L.unshift(c); this.relabel(o); this.touch(c); return VOID; }
      case 'get': { const k = idx(args[0]); if (k < 0 || k >= L.length) yield* oob(k); return L[k].val; }
      case 'getFirst': case 'peek': case 'peekFirst': if (!L.length) { if (n.name !== 'getFirst') return NUL; yield* this.jthrow('NoSuchElementException', '', line); } return L[0].val;
      case 'getLast': case 'peekLast': if (!L.length) { if (n.name !== 'getLast') return NUL; yield* this.jthrow('NoSuchElementException', '', line); } return L[L.length - 1].val;
      case 'set': { const k = idx(args[0]); if (k < 0 || k >= L.length) yield* oob(k); const old = L[k].val; L[k].val = yield* conv(args[1]); this.touch(L[k]); return old; }
      case 'remove': {
        if (!args.length) { if (!L.length) yield* this.jthrow('NoSuchElementException', '', line); const c = L.shift(); this.relabel(o); this.touch(o); return c.val; }
        if (isIntT(args[0].t) && args[0].t !== 'char') { const k = args[0].v; if (k < 0 || k >= L.length) yield* oob(k); const c = L.splice(k, 1)[0]; this.relabel(o); this.touch(o); return c.val; }
        const k = yield* find(args[0]); if (k < 0) return B(false); L.splice(k, 1); this.relabel(o); this.touch(o); return B(true);
      }
      case 'removeFirst': case 'poll': case 'pollFirst': { if (!L.length) { if (n.name !== 'removeFirst') return NUL; yield* this.jthrow('NoSuchElementException', '', line); } const c = L.shift(); this.relabel(o); this.touch(o); return c.val; }
      case 'removeLast': case 'pollLast': { if (!L.length) { if (n.name !== 'removeLast') return NUL; yield* this.jthrow('NoSuchElementException', '', line); } const c = L.pop(); this.touch(o); return c.val; }
      case 'size': return I(L.length);
      case 'isEmpty': return B(L.length === 0);
      case 'contains': return B((yield* find(args[0])) >= 0);
      case 'indexOf': return I(yield* find(args[0]));
      case 'clear': L.length = 0; this.touch(o); return VOID;
      case 'toString': return S(yield* this.jstr(lv, line));
      case 'addAll': { for (const c of args[0].o.elems) L.push(this.listCell(o, c.val)); this.relabel(o); this.touch(o); return B(true); }
      case 'push': { const c = this.listCell(o, yield* conv(args[0])); L.unshift(c); this.relabel(o); this.touch(c); return VOID; }
      case 'pop': { if (!L.length) yield* this.jthrow('NoSuchElementException', '', line); const c = L.shift(); this.relabel(o); this.touch(o); return c.val; }
      case 'offer': { const c = this.listCell(o, yield* conv(args[0])); L.push(c); this.relabel(o); this.touch(c); return B(true); }
    }
    throw this.err(`الدالة ${C(o.ln + '.' + n.name + '()')} غير مدعومة في المختبر`, line);
  }

  /* ---- statements ---- */
  sub(n) {                          // expression text with current values substituted
    const w = (s) => (n.paren ? `(${s})` : s);
    try {
      switch (n.k) {
        case 'var': { const c = this.lookup(n.name) || (this.top.thisObj && this.top.thisObj.fields.get(n.name)); if (!c || c.val === undefined) return n.src; if (c.val.t === 'ref') return n.src; return w(show(c.val)); }
        case 'field': { if (n.obj.k === 'this' && this.top.thisObj) { const c = this.top.thisObj.fields.get(n.name); if (c && c.val && c.val.t !== 'ref') return w(show(c.val)); } return n.src; }
        case 'bin': return w(`${this.sub(n.l)} ${n.op} ${this.sub(n.r)}`);
        case 'un': return w(`${n.op}${this.sub(n.e)}`);
        default: return n.src;
      }
    } catch (e) { return n.src; }
  }
  condMsg(n, ok, before, prefix) {
    return `${prefix || 'الشرط'} ${C(n.src)}` + (before !== n.src ? ` يصبح ${C(before)}` : '') + `، والنتيجة: <b class="${ok ? 'yes' : 'no'}">${ok ? 'true' : 'false'}</b>`;
  }
  *exec(s) {
    switch (s.k) {
      case 'block': yield* this.block(s.body, true); return;
      case 'empty': return;
      case 'local': yield* this.declare(s); return;
      case 'expr': {
        const e = s.e;
        const before = e.k === 'assign' ? this.sub(e.e) : null;
        const oldOut = this.output.length;
        this.lastPrint = null;
        const v = yield* this.ev(e);
        const ev = this.step(s.line, this.exprMsg(e, v, before), this.output.length > oldOut ? { out: this.output.slice(oldOut) } : undefined);
        this.top.temps.length = 0;
        yield ev;
        return;
      }
      case 'ctorcall': throw this.err(`${C(s.which + '(...)')} تُستخدم كأول جملة داخل constructor فقط`, s.line);
      case 'if': {
        const before = this.sub(s.cond);
        const v = yield* this.ev(s.cond);
        if (v.t !== 'boolean') throw this.err(`شرط if يجب أن يكون true أو false (boolean)، و${C(s.cond.src)} ${this.tname(v)}. هل تقصد ${C('==')} بدل ${C('=')}؟`, s.line);
        const ok = v.v;
        const what = ok ? 'فيُنفَّذ جسم if' : s.els ? (s.els.k === 'if' ? 'فننتقل إلى الشرط التالي else if' : 'فيُنفَّذ جسم else') : 'فيُتجاوز جسم if';
        yield this.step(s.line, this.condMsg(s.cond, ok, before) + `، ${what}.`, { cond: { text: s.cond.src, ok } });
        if (ok) yield* this.exec(s.then); else if (s.els) yield* this.exec(s.els);
        return;
      }
      case 'while': case 'for': case 'dowhile': yield* this.loop(s); return;
      case 'foreach': yield* this.foreach(s); return;
      case 'switch': yield* this.switchStmt(s); return;
      case 'break': {
        const inner = this.top.ctx[this.top.ctx.length - 1];
        if (!inner) throw this.err(`${C('break')} تُستخدم داخل حلقة أو switch فقط`, s.line);
        yield this.step(s.line, inner === 'switch' ? `${C('break')} تُنهي جملة switch.` : `${C('break')} تُنهي الحلقة فورًا.`);
        throw new BreakSig(s.line);
      }
      case 'continue': {
        if (!this.top.ctx.includes('loop')) throw this.err(`${C('continue')} تُستخدم داخل حلقة فقط`, s.line);
        yield this.step(s.line, `${C('continue')} تتجاوز باقي أوامر هذه الدورة وتنتقل إلى الدورة التالية.`);
        throw new ContinueSig(s.line);
      }
      case 'return': {
        const fn = this.top.fn;
        const isVoid = !fn.ret || (fn.ret.k === 'prim' && fn.ret.n === 'void');
        let val = null, msg;
        if (s.e) {
          if (isVoid) throw this.err(fn.isCtor ? 'الـ constructor لا يُرجع قيمة' : `الدالة ${C(fn.name)} من النوع void لا تُرجع قيمة`, s.line);
          const before = this.sub(s.e);
          val = yield* this.ev(s.e);
          const shown = show(val);
          msg = `${C('return')} تُرجع ${C(s.e.src)}` + (before !== s.e.src && before !== shown ? ` ← ${C(before)}` : '') + ` = <b>${esc(shown)}</b>، فتنتهي الدالة ${C(fn.name)} وتعود القيمة إلى السطر ${this.top.callLine}.`;
        } else {
          if (!isVoid) throw this.err(`الدالة ${C(fn.name)} يجب أن تُرجع قيمة من النوع ${tstr(fn.ret)}`, s.line);
          msg = this.frames.length <= 1 ? `${C('return')} تُنهي main والبرنامج.` : `${C('return')} تُنهي الدالة ${C(fn.name)}، ويعود التنفيذ إلى السطر ${this.top.callLine}.`;
        }
        yield this.step(s.line, msg);
        throw new ReturnSig(s.line, val);
      }
      case 'throw': {
        const v = yield* this.ev(s.e);
        if (v.t === 'null') yield* this.jthrow('NullPointerException', 'throw null', s.line);
        if (v.t !== 'ref' || v.o.kind !== 'obj' || !isSub(v.o.cls, 'Throwable')) throw this.err(`${C('throw')} ترمي كائن استثناء فقط (من كلاس يرث من Exception)`, s.line);
        const msgv = v.o.fields.get('message');
        yield this.step(s.line, `${C('throw')} ترمي استثناء من النوع ${C(v.o.cls.name)}` + (msgv && msgv.val.t === 'String' ? ` برسالة ${C('"' + msgv.val.v + '"')}` : '') + '، فيتوقف التنفيذ العادي ويُبحث عن catch مناسب.');
        throw new ThrowSig(v, s.line);
      }
      case 'try': yield* this.tryStmt(s); return;
    }
    throw this.err('جملة غير مدعومة', s.line);
  }
  exprMsg(e, v, before) {
    if (e.k === 'print') return this.lastPrint !== null && this.lastPrint !== undefined
      ? `${C('System.out.' + e.fn)} تطبع: ${C(this.lastPrint.replace(/\n/g, '⏎') || ' ')}` + (e.fn === 'println' ? '، ثم تنتقل إلى سطر جديد.' : '.')
      : 'طباعة.';
    if (e.k === 'assign') {
      const tg = e.target.src;
      const objNote = e.target.k === 'field' || (e.target.k === 'var' && !this.lookup(e.target.name) && this.top.thisObj) ? ` (حقل في الكائن ${C('#' + (this.top.thisObj ? this.top.thisObj.id : '?'))})` : '';
      if (e.op === '=') {
        if (v.t === 'ref' && v.o.kind === 'obj') return `${C(tg)} يشير الآن إلى الكائن ${C('#' + v.o.id)} من الكلاس ${C(v.o.cls.name)}${e.e.k === 'var' ? `، أي الكائن نفسه الذي يشير إليه ${C(e.e.src)} (نسخ المرجع لا ينسخ الكائن)` : ''}.`;
        const lit = ['num', 'str', 'chr', 'bool', 'null'].includes(e.e.k);
        return lit ? `إسناد: وضع القيمة <b>${esc(show(v))}</b> في ${C(tg)}${objNote}.`
          : `إسناد: يُحسب ${C(e.e.src)}` + (before && before !== e.e.src && before !== show(v) ? ` ← ${C(before)}` : '') + ` = <b>${esc(show(v))}</b>، ثم يُخزَّن في ${C(tg)}${objNote}.`;
      }
      return `${C(e.src)} تعني ${C(`${tg} = ${tg} ${e.op[0]} ${e.e.src}`)}، فيصبح ${C(tg)} = <b>${esc(show(v))}</b>${objNote}.`;
    }
    if (e.k === 'post' || e.k === 'pre') {
      const c = (() => { try { return e.target.k === 'var' ? (this.lookup(e.target.name) || (this.top.thisObj && this.top.thisObj.fields.get(e.target.name)) || this.staticCell(this.top.cls, e.target.name)) : null; } catch (x) { return null; } })();
      return `${C(e.src)} ${e.op === '++' ? 'تزيد' : 'تنقص'} قيمة ${C(e.target.src)} بمقدار 1` + (c && c.val ? `، فتصبح <b>${esc(show(c.val))}</b>` : '') + '.';
    }
    if (e.k === 'mcall' || e.k === 'call' || e.k === 'supercall') {
      if (v && v.t !== 'void' && !(v.t === 'boolean' && e.name === 'add')) return `انتهى تنفيذ ${C(e.src)}، والقيمة الراجعة <b>${esc(show(v))}</b> لم تُستخدم.`;
      return `انتهى تنفيذ ${C(e.src)}.`;
    }
    if (e.k === 'new') return `أُنشئ كائن ${C(e.type.n)} ولم يُخزَّن مرجعه في أي متغير.`;
    return `تنفيذ ${C(e.src)}.`;
  }
  *declare(s) {
    const scope = this.scopes[this.scopes.length - 1];
    for (const d of s.decls) {
      for (const sc of this.scopes) if (sc.has(d.name)) throw this.err(`المتغير ${C(d.name)} معرَّف مسبقًا في هذه الدالة، ولا يجوز تعريفه مرتين`, d.line);
      const type = d.type;
      if (type.k === 'cls' && !this.info.has(type.n) && !NATIVE_CLS.has(type.n) && !WRAP[type.n] && type.n !== 'Object' && !this.isTypeParam(type.n))
        throw this.err(`النوع ${C(type.n)} غير معرَّف (cannot find symbol)${type.n.toLowerCase() === 'string' ? `. هل تقصد ${C('String')} بحرف S كبير؟` : type.n === 'Scanner' ? '' : ''}`, d.line);
      const cell = new Cell(type, d.name, { final: s.final });
      let msg;
      const T = C(tstr(type));
      const before = d.init && d.init.k !== 'arrinit' ? this.sub(d.init) : null;
      if (d.init) {
        const v = yield* this.evInit(d.init, type);
        cell.val = yield* this.assignConv(v, type, d.line, d.name);
        cell.inited = true;
        const val = cell.val;
        if (val.t === 'ref') {
          const o = val.o;
          if (o.kind === 'scanner') msg = `إنشاء كائن ${C('Scanner')} اسمه ${C(d.name)} لقراءة المدخلات من لوحة المفاتيح (${C('System.in')}).`;
          else if (o.kind === 'arr') msg = `تعريف المصفوفة ${C(d.name)} من النوع ${T}` + (d.init.k === 'arrinit' || (d.init.k === 'newarr' && d.init.init) ? ` بالقيم ${C((d.init.init || d.init).src)}` : ` بحجم ${o.elems.length} (الفهارس من 0 إلى ${o.elems.length - 1})، وعناصرها تبدأ بالقيمة الافتراضية ${C(show(defVal(o.elemType)))}`) + `. المصفوفة كائن في الذاكرة ${C('#' + o.id)}، و${C(d.name)} مرجع يشير إليها.`;
          else if (o.kind === 'list') msg = `إنشاء قائمة ${C(o.ln)} فارغة اسمها ${C(d.name)}${o.elemT ? ` تخزّن عناصر من النوع ${C(tstr(o.elemT))}` : ''}. حجمها يكبر ويصغر تلقائيًا.`;
          else if (d.init.k === 'new') msg = `${C(d.name)} متغير مرجعي (reference) من النوع ${T}، ويشير الآن إلى الكائن الجديد ${C('#' + o.id)}.` + (o.cls.name !== tstr(type) ? ` لاحظ أن نوع المتغير ${T} والكائن الحقيقي من النوع ${C(o.cls.name)}، وهذا مسموح لأن ${C(o.cls.name)} ${this.info.get(tstr(type)) && this.info.get(tstr(type)).kind === 'interface' ? 'يطبّق الواجهة' : 'يرث من'} ${T}.` : '');
          else msg = `تعريف ${C(d.name)} من النوع ${T}، ويشير إلى الكائن ${C('#' + o.id)}${d.init.k === 'var' ? ` نفسه الذي يشير إليه ${C(d.init.src)} (نسخ المرجع لا ينسخ الكائن)` : ''}.`;
        } else if (val.t === 'null') msg = `تعريف المرجع ${C(d.name)} من النوع ${T} بقيمة ${C('null')}: لا يشير إلى أي كائن بعد.`;
        else {
          const lit = ['num', 'str', 'chr', 'bool'].includes(d.init.k) || (d.init.k === 'un' && d.init.e.k === 'num');
          msg = `تعريف ${s.final ? 'الثابت' : 'المتغير'} ${C(d.name)} من النوع ${T}` + (lit ? ` وإعطاؤه القيمة <b>${esc(show(val))}</b>.` : ` وإعطاؤه قيمة ${C(d.init.src)}` + (before && before !== d.init.src && before !== show(val) ? ` ← ${C(before)}` : '') + ` = <b>${esc(show(val))}</b>.`);
          if (type.k === 'prim' && ['int', 'long'].includes(type.n) && d.init.k === 'bin' && d.init.op === '/' && v.t === 'int') this.notes.push('(قسمة عددين صحيحين في Java تحذف الجزء العشري.)');
        }
      } else msg = `تعريف ${C(d.name)} من النوع ${T} دون قيمة. المتغير المحلي لا يأخذ قيمة افتراضية، ويجب إعطاؤه قيمة قبل استخدامه.`;
      scope.set(d.name, cell);
      this.touch(cell);
      const ev = this.step(d.line, msg);
      this.top.temps.length = 0;
      yield ev;
    }
  }
  loopRow(L, ok, before) {
    const vals = {};
    for (const nm of new Set([...L.tracked, ...this.visibleNames()])) {
      const c = this.lookup(nm);
      if (!c || c.hidden) continue;
      vals[nm] = c.val === undefined ? '؟' : c.val.t === 'ref' ? (c.val.o.kind === 'list' ? `size ${c.val.o.elems.length}` : '#' + c.val.o.id) : show(c.val);
    }
    L.rows.push({ n: L.rows.length + 1, before, ok, vals });
  }
  visibleNames() { const out = []; for (const sc of this.top.scopes) for (const [k, c] of sc) if (!c.hidden && !(c.val && c.val.t === 'ref' && c.val.o.kind === 'scanner')) out.push(k); return out; }
  newLoop(kind, line, cond) {
    const L = { kind, line, cond: cond ? cond.src : 'true', rows: [], tracked: new Set() };
    if (cond) for (const nm of varsIn(cond)) L.tracked.add(nm);
    this.loops.push(L); this.top.active.push(L);
    return L;
  }
  *loop(s) {
    const kindAr = { while: 'while', for: 'for', dowhile: 'do-while' }[s.k];
    if (s.k === 'for') this.scopes.push(new Map());
    const L = this.newLoop(s.k, s.line, s.cond);
    this.top.ctx.push('loop');
    try {
      if (s.k === 'for' && s.init) {
        if (s.init.k === 'local') {
          const scope = this.scopes[this.scopes.length - 1];
          for (const d of s.init.decls) {
            for (const sc of this.scopes) if (sc !== scope && sc.has(d.name)) throw this.err(`المتغير ${C(d.name)} معرَّف مسبقًا في هذه الدالة`, d.line);
            const c = new Cell(d.type, d.name, {});
            if (d.init) { c.val = yield* this.assignConv(yield* this.ev(d.init), d.type, d.line, d.name); c.inited = true; }
            scope.set(d.name, c); this.touch(c); L.tracked.add(d.name);
          }
          const c0 = scope.get(s.init.decls[0].name);
          yield this.step(s.line, `تهيئة الحلقة ${C('for')}: ${C(s.init.src.replace(/;\s*$/, ''))}، فيبدأ العدّاد ${C(c0.label)} بالقيمة <b>${esc(show(c0.val))}</b>. التهيئة تُنفَّذ مرة واحدة فقط.`);
        } else { for (const e of s.init.es) yield* this.ev(e); yield this.step(s.line, `تهيئة الحلقة ${C('for')}. التهيئة تُنفَّذ مرة واحدة فقط.`); }
      }
      if (s.k === 'dowhile') yield this.step(s.line, `حلقة ${C('do-while')}: يُنفَّذ الجسم أولًا، ثم يُختبر الشرط في النهاية.`);
      let first = true;
      for (;;) {
        if (s.k !== 'dowhile' || !first) {
          const cline = s.k === 'dowhile' ? s.condLine : s.line;
          let ok = true, before = 'true';
          if (s.cond) {
            before = this.sub(s.cond);
            const v = yield* this.ev(s.cond);
            if (v.t !== 'boolean') throw this.err(`شرط الحلقة يجب أن يكون boolean (true/false)`, cline);
            ok = v.v;
          }
          this.loopRow(L, ok, before);
          const n = L.rows.length;
          if (s.k === 'dowhile') yield this.step(cline, this.condMsg(s.cond, ok, before, `بعد الدورة ${n}: الشرط`) + (ok ? '، فيُعاد تنفيذ الجسم.' : `، فتنتهي الحلقة بعد ${countAr(n)}.`), { cond: { text: s.cond.src, ok }, loop: true });
          else {
            const msg = ok ? (s.cond ? this.condMsg(s.cond, true, before, `الدورة ${n}: الشرط`) : `الدورة ${n}: لا يوجد شرط`) + '، فيُنفَّذ جسم الحلقة.'
              : this.condMsg(s.cond, false, before) + (n - 1 === 0 ? `، فلا يُنفَّذ جسم حلقة ${kindAr} ولا مرة.` : `، فتنتهي حلقة ${kindAr} بعد ${countAr(n - 1)}.`);
            yield this.step(cline, msg, { cond: { text: s.cond ? s.cond.src : 'true', ok }, loop: true });
          }
          if (!ok) break;
        }
        first = false;
        try { yield* this.exec(s.body); }
        catch (e) { if (e instanceof BreakSig) break; if (!(e instanceof ContinueSig)) throw e; }
        if (s.k === 'for' && s.upd.length) {
          for (const u of s.upd) yield* this.ev(u);
          const u = s.upd[0];
          const tc = (u.k === 'assign' || u.k === 'pre' || u.k === 'post') && u.target.k === 'var' ? this.lookup(u.target.name) : null;
          yield this.step(s.line, `التحديث ${C(s.upd.map((x) => x.src).join(', '))}` + (tc && tc.val ? `: أصبح ${C(u.target.src)} يساوي <b>${esc(show(tc.val))}</b>` : '') + '، ثم يُختبر الشرط مرة أخرى.');
        }
      }
    } finally {
      this.top.ctx.pop(); this.top.active.pop();
      if (s.k === 'for') this.scopes.pop();
    }
  }
  *foreach(s) {
    const it = yield* this.ev(s.iter);
    if (it.t === 'null') yield* this.jthrow('NullPointerException', `"${s.iter.src}" is null`, s.line);
    if (it.t !== 'ref' || (it.o.kind !== 'arr' && it.o.kind !== 'list')) throw this.err(`حلقة for-each تعمل مع المصفوفات والقوائم، و${C(s.iter.src)} ليست كذلك`, s.line);
    const elems = it.o.elems.slice();
    this.scopes.push(new Map());
    const L = this.newLoop('for', s.line, null);
    L.cond = `${s.name} : ${s.iter.src}`;
    L.tracked.add(s.name);
    this.top.ctx.push('loop');
    try {
      const c = new Cell(s.type, s.name, { final: s.final });
      this.scopes[this.scopes.length - 1].set(s.name, c);
      for (let i = 0; i <= elems.length; i++) {
        const ok = i < elems.length;
        if (ok) { c.val = yield* this.assignConv(elems[i].val, s.type, s.line, s.name); c.inited = true; this.touch(c); }
        this.loopRow(L, ok, ok ? `${s.name} = ${show(c.val)}` : 'لا عناصر');
        if (!ok) { yield this.step(s.line, `انتهت عناصر ${C(s.iter.src)}، فتنتهي حلقة for-each بعد ${countAr(elems.length)}.`, { cond: { text: 'hasNext', ok: false }, loop: true }); break; }
        yield this.step(s.line, `الدورة ${i + 1}: ${C(s.name)} يأخذ العنصر رقم ${i} من ${C(s.iter.src)} = <b>${esc(show(c.val))}</b>.`, { loop: true });
        try { yield* this.exec(s.body); }
        catch (e) { if (e instanceof BreakSig) break; if (!(e instanceof ContinueSig)) throw e; }
      }
    } finally { this.top.ctx.pop(); this.top.active.pop(); this.scopes.pop(); }
  }
  *switchStmt(s) {
    const v = yield* this.ev(s.e);
    const isEnum = v.t === 'ref' && v.o.enumName !== undefined;
    if (!isEnum && !['int', 'char', 'short', 'byte', 'String'].includes(v.t)) throw this.err(`جملة switch تعمل مع int و char و String و enum، ولا تعمل مع ${this.tname(v)}`, s.line);
    let idx = -1;
    outer: for (let i = 0; i < s.cases.length; i++) {
      for (const cv of s.cases[i].vals) {
        let m;
        if (isEnum) { if (cv.k !== 'var') throw this.err('في switch على enum اكتب اسم الثابت فقط بعد case', cv.line); m = cv.name === v.o.enumName; }
        else { const x = yield* this.ev(cv); m = v.t === 'String' ? x.v === v.v : x.v === v.v; }
        if (m) { idx = i; break outer; }
      }
    }
    let how;
    if (idx >= 0) how = `، فيبدأ التنفيذ من ${C('case ' + s.cases[idx].vals.map((x) => x.src).join(', '))}.`;
    else { idx = s.cases.findIndex((c) => c.def); how = idx >= 0 ? `، ولا توجد حالة مطابقة، فيُنفَّذ ${C('default')}.` : '، ولا توجد حالة مطابقة ولا default، فتُتجاوز switch.'; }
    yield this.step(s.line, `قيمة ${C(s.e.src)} = <b>${esc(isEnum ? v.o.enumName : show(v))}</b>${how}`);
    if (idx < 0) return;
    this.top.ctx.push('switch');
    try {
      for (let i = idx; i < s.cases.length; i++) {
        if (i > idx) yield this.step(s.cases[i].line, `لا يوجد ${C('break')} قبل هذه الحالة، فيستمر التنفيذ إليها دون اختبار قيمتها (fall-through).`);
        yield* this.block(s.cases[i].stmts, false);
      }
    } catch (e) { if (!(e instanceof BreakSig)) throw e; }
    finally { this.top.ctx.pop(); }
  }
  *tryStmt(s) {
    const depth = this.frames.length, sc = this.scopes.length, ctx = this.top.ctx.length, act = this.top.active.length;
    yield this.step(s.line, `${C('try')}: يُنفَّذ الكود داخلها، وإذا حدث استثناء ينتقل التنفيذ إلى ${C('catch')} المناسب.`);
    try {
      try { yield* this.block(s.body.body, true); }
      catch (e) {
        if (!(e instanceof ThrowSig)) throw e;
        while (this.frames.length > depth) this.frames.pop();
        this.top.scopes.length = sc; this.top.ctx.length = ctx; this.top.active.length = act;
        const o = e.ref.o;
        const c = s.catches.find((k) => k.types.some((t) => isSub(o.cls, t)));
        if (!c) throw e;
        this.scopes.push(new Map());
        try {
          const cell = new Cell({ k: 'cls', n: c.types[0] }, c.name, {}); cell.val = e.ref; cell.inited = true;
          this.scopes[this.scopes.length - 1].set(c.name, cell); this.touch(cell);
          const mv = o.fields.get('message');
          yield this.step(c.line, `حدث استثناء ${C(o.cls.name)}` + (mv && mv.val.t === 'String' ? ` (${C(mv.val.v)})` : '') + ` في السطر ${e.line}، فالتقطه ${C('catch (' + c.types.join(' | ') + ' ' + c.name + ')')}، ويستمر البرنامج بدل أن يتوقف.`);
          yield* this.block(c.body.body, false);
        } finally { this.scopes.pop(); }
      }
    } finally {
      if (s.fin) {
        yield this.step(s.fin.line, `${C('finally')} تُنفَّذ دائمًا، سواء حدث استثناء أم لا.`);
        yield* this.block(s.fin.body, true);
      }
    }
  }

  /* ---- snapshot for the UI ---- */
  desc(c, ch) {
    const base = { chg: ch.has(c.uid) };
    const v = c.val;
    if (v === undefined) return Object.assign(base, { kind: 'val', show: '؟', garbage: true });
    if (v.t === 'ref') { const o = v.o; return Object.assign(base, { kind: 'ptr', show: o.kind === 'scanner' ? 'Scanner' : '→ #' + o.id }); }
    if (v.t === 'null') return Object.assign(base, { kind: 'ptr', show: 'null', null: true });
    return Object.assign(base, { kind: 'val', show: show(v) });
  }
  objDesc(o, ch) {
    if (o.kind === 'arr' || o.kind === 'list') return { kind: 'arr', chg: ch.has(o.uid || -1), cells: o.elems.map((c) => Object.assign(this.desc(c, ch), {})) };
    return { kind: 'struct', name: o.enumName !== undefined ? o.cls.name + '.' + o.enumName : o.cls.name, fields: [...o.fields].filter(([k]) => !(o.cls.prelude && k === 'message' && false)).map(([k, c]) => ({ name: k, d: this.desc(c, ch) })) };
  }
  snapshot() {
    const ch = this.lastChanged;
    const vars = (m) => [...m].filter(([, c]) => !c.hidden).map(([k, c]) => ({ name: k, type: tstr(c.type), isConst: !!c.final, d: this.desc(c, ch) }));
    const frames = [];
    const st = [];
    for (const [cn, m] of this.statics) for (const [k, c] of m) st.push({ name: cn + '.' + k, type: (c.final ? 'static final ' : 'static ') + tstr(c.type), isConst: !!c.final, d: this.desc(c, ch) });
    if (st.length) frames.push({ title: 'الحقول الثابتة static', global: true, vars: st });
    const vis = this.frames.filter((f) => !f.silent && f.fn && f.fn.name !== '<clinit>');
    vis.forEach((fr, i) => {
      const v = [];
      if (fr.thisObj) v.push({ name: 'this', type: fr.cls.name, d: { kind: 'ptr', show: '→ #' + fr.thisObj.id } });
      for (const sc of fr.scopes) v.push(...vars(sc));
      frames.push({ title: fr.fn.name === 'main' && i === 0 ? 'main' : fr.label, current: i === vis.length - 1, callLine: fr.callLine, vars: v });
    });
    // reachability: objects nobody points to are garbage (Java frees them automatically)
    const reach = new Set();
    const mark = (val) => {
      if (!val || val.t !== 'ref' || reach.has(val.o)) return;
      const o = val.o; reach.add(o);
      if (o.fields) for (const c of o.fields.values()) mark(c.val);
      if (o.elems) for (const c of o.elems) mark(c.val);
    };
    for (const m of this.statics.values()) for (const c of m.values()) mark(c.val);
    for (const fr of this.frames) { if (fr.thisObj) mark(REF(fr.thisObj)); for (const sc of fr.scopes) for (const c of sc.values()) mark(c.val); for (const o of fr.temps) mark(REF(o)); }
    const heap = this.heap.filter((o) => !o.hidden && !o.builtin).map((o) => ({
      id: o.id, label: '#' + o.id + (o.enumName !== undefined ? ' ' + o.enumName : ''), type: o.kind === 'arr' ? tstr(o.type) + (o.elems.length ? '' : ' (فارغة)') : o.kind === 'list' ? `${o.ln}${o.elemT ? '<' + tstr(o.elemT) + '>' : ''} · size ${o.elems.length}` : o.cls.name,
      freed: false, gc: !reach.has(o), d: this.objDesc(o, ch),
    }));
    const loop = this.loops.length ? this.loops[this.loops.length - 1] : null;
    return {
      frames, heap, structures: [], output: this.output,
      loop: loop && { kind: loop.kind, line: loop.line, cond: loop.cond, tracked: [...loop.tracked], rows: loop.rows.map((r) => Object.assign({}, r)) },
    };
  }
}
const countAr = (n) => (n === 0 ? 'أي دورة' : n === 1 ? 'دورة واحدة' : n === 2 ? 'دورتين' : n <= 10 ? `${n} دورات` : `${n} دورة`);
function varsIn(n, out = []) {
  if (!n || typeof n !== 'object') return out;
  if (n.k === 'var') { if (!out.includes(n.name)) out.push(n.name); }
  for (const key of ['l', 'r', 'e', 'c', 'a', 'b', 'target', 'obj', 'arr', 'idx']) if (n[key] && typeof n[key] === 'object') varsIn(n[key], out);
  if (n.args) n.args.forEach((a) => varsIn(a, out));
  return out;
}

function runAll(src, input) {
  let it;
  try {
    it = new Interp(compile(src));
    it.inbuf = input || '';
    it.eof = true;
    const g = it.run();
    for (let r = g.next(); !r.done; r = g.next()) { /* input events: eof set */ }
    return { output: it.output };
  } catch (e) {
    if (e instanceof JavaError) return { output: it ? it.output : '', error: e.message, line: e.line };
    throw e;
  }
}

G.FSJava = { compile, Interp, runAll, JavaError, CppError: JavaError, fmtDouble, tokenize };
})(typeof window !== 'undefined' ? window : globalThis);
