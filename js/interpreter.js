/* FS_Lab C++ teaching interpreter — a C++ subset for Programming 1, Programming 2 and Data Structures:
   variables, arithmetic, conditions, switch, loops, cin/cout/getline, functions (value / reference / default arguments /
   overloading / recursion), global variables, 1D/2D arrays, strings and char arrays, pointers, new/delete, struct,
   linked structures (lists, stacks, queues, trees).
   Memory model: every variable, array element and struct field is a Cell; pointers point to Cells; `new` makes heap Cells.
   It runs step by step and explains every step in Arabic.
   Usage:  const prog = FSCpp.compile(src);            // throws FSCpp.CppError {message, line}
           const it = new FSCpp.Interp(prog);  it.inbuf = "5 3";
           for (const ev of it.run()) ...             // ev.type: 'step' | 'input' (fill it.inbuf, then next())
           it.snapshot() -> {frames, heap, structures, output, loop}
           FSCpp.runAll(src, input) -> {output, error, line}                                            */
(function (G) {
'use strict';

const PRIMS = new Set(['int', 'double', 'float', 'char', 'bool', 'string', 'long', 'short', 'unsigned', 'auto', 'void']);
const RESERVED = new Set(['if', 'else', 'for', 'while', 'do', 'switch', 'case', 'default', 'break', 'continue', 'return', 'const',
  'true', 'false', 'cout', 'cin', 'endl', 'using', 'namespace', 'struct', 'new', 'delete', 'nullptr', 'NULL', ...PRIMS]);
const MAX_STEPS = 30000;
const MAX_DEPTH = 400;

class CppError extends Error { constructor(msg, line) { super(msg); this.line = line; } }
class BreakSig { constructor(line) { this.line = line; } }
class ContinueSig { constructor(line) { this.line = line; } }
class ReturnSig { constructor(line, val) { this.line = line; this.val = val; } }

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const C = (s) => `<code dir="ltr">${esc(s)}</code>`;
const CPP = '<bdi dir="ltr">C++</bdi>';

/* ======================= types ======================= */
const normPrim = (t) => (t === 'long' || t === 'short' || t === 'unsigned' ? 'int' : t);
const TP = (k) => ({ k });
const TPtr = (to) => ({ k: 'ptr', to });
const TArr = (of, n) => ({ k: 'arr', of, n });
const TSt = (name) => ({ k: 'struct', name });
const isFloatK = (k) => k === 'double' || k === 'float';
function tstr(t) {
  if (!t) return '?';
  if (t.k === 'ptr') return tstr(t.to) + '*';
  if (t.k === 'arr') { let b = t, d = ''; while (b.k === 'arr') { d += `[${b.n == null ? '' : typeof b.n === 'object' ? b.n.name : b.n}]`; b = b.of; } return tstr(b) + d; }
  if (t.k === 'struct') return t.name;
  return t.k;
}
const sameT = (a, b) => tstr(a) === tstr(b);
const elemBase = (t) => { while (t.k === 'arr') t = t.of; return t; };

/* ======================= tokenizer ======================= */
function tokenize(src) {
  const toks = []; let i = 0, line = 1;
  const OPS = ['<<=', '>>=', '<<', '>>', '->', '++', '--', '+=', '-=', '*=', '/=', '%=', '==', '!=', '<=', '>=', '&&', '||', '::',
    '+', '-', '*', '/', '%', '=', '<', '>', '!', '?', ':', ';', ',', '(', ')', '{', '}', '[', ']', '.', '&'];
  const push = (t, v, s, e, extra) => toks.push(Object.assign({ t, v, line, s, e }, extra || {}));
  while (i < src.length) {
    const c = src[i];
    if (c === '\n') { line++; i++; continue; }
    if (/\s/.test(c)) { i++; continue; }
    if (src.startsWith('//', i)) { while (i < src.length && src[i] !== '\n') i++; continue; }
    if (src.startsWith('/*', i)) {
      const j = src.indexOf('*/', i + 2), end = j < 0 ? src.length : j + 2;
      for (let k = i; k < end; k++) if (src[k] === '\n') line++;
      i = end; continue;
    }
    if (c === '#') { let j = i; while (j < src.length && src[j] !== '\n') j++; push('pp', src.slice(i, j), i, j); i = j; continue; }
    if (/[0-9]/.test(c) || (c === '.' && /[0-9]/.test(src[i + 1] || ''))) {
      let j = i; while (j < src.length && /[0-9.]/.test(src[j])) j++;
      let s = src.slice(i, j);
      if (/[eE]/.test(src[j] || '') && /[-+0-9]/.test(src[j + 1] || '')) { j++; if (/[-+]/.test(src[j])) j++; while (/[0-9]/.test(src[j] || '')) j++; s = src.slice(i, j); }
      if (/[fF]/.test(src[j] || '')) j++;
      if (/[A-Za-z_]/.test(src[j] || '')) {
        let k = j; while (k < src.length && /[A-Za-z0-9_]/.test(src[k])) k++;
        throw new CppError(`الاسم ${C(src.slice(i, k))} غير صحيح: اسم المتغير لا يمكن أن يبدأ برقم`, line);
      }
      if ((s.match(/\./g) || []).length > 1) throw new CppError(`العدد ${C(s)} غير صحيح`, line);
      push('num', s, i, j, { isFloat: /[.eE]/.test(s) }); i = j; continue;
    }
    if (/[A-Za-z_]/.test(c)) {
      let j = i; while (j < src.length && /[A-Za-z0-9_]/.test(src[j])) j++;
      const w = src.slice(i, j);
      if (w === 'std' && src.startsWith('::', j)) { i = j + 2; continue; }
      push('id', w, i, j); i = j; continue;
    }
    if (c === '"') {
      let j = i + 1, s = '';
      while (j < src.length && src[j] !== '"') {
        if (src[j] === '\n') throw new CppError('النص بين علامتي التنصيص " " لم يُغلق في السطر نفسه', line);
        if (src[j] === '\\') { const n = src[j + 1]; s += n === 'n' ? '\n' : n === 't' ? '\t' : n === '0' ? '\0' : n; j += 2; } else s += src[j++];
      }
      if (j >= src.length) throw new CppError('علامة التنصيص " لم تُغلق', line);
      push('str', s, i, j + 1); i = j + 1; continue;
    }
    if (c === "'") {
      let j = i + 1, s = '';
      while (j < src.length && src[j] !== "'" && src[j] !== '\n') {
        if (src[j] === '\\') { const n = src[j + 1]; s += n === 'n' ? '\n' : n === 't' ? '\t' : n === '0' ? '\0' : n; j += 2; } else s += src[j++];
      }
      if (src[j] !== "'") throw new CppError("علامة التنصيص المفردة ' لم تُغلق", line);
      if (s.length !== 1) throw new CppError(`النوع char يخزن حرفًا واحدًا فقط بين علامتين مفردتين، أما النص فيُكتب بين علامتين مزدوجتين "${esc(s)}"`, line);
      push('chr', s, i, j + 1); i = j + 1; continue;
    }
    const op = OPS.find((o) => src.startsWith(o, i));
    if (op) { push('op', op, i, i + op.length); i += op.length; continue; }
    throw new CppError(`رمز غير معروف في ${CPP}: ${C(c)}`, line);
  }
  toks.push({ t: 'eof', v: '', line, s: src.length, e: src.length });
  return toks;
}

/* ======================= parser ======================= */
function parse(src) {
  const toks = tokenize(src);
  const warnings = [];
  const structs = new Map();     // name -> {name, fields:[{name, type, init}], line}
  let p = 0;
  const peek = (o = 0) => toks[Math.min(p + o, toks.length - 1)];
  const is = (v, o = 0) => { const t = peek(o); return (t.t === 'op' || t.t === 'id') && t.v === v; };
  const next = () => toks[p++];
  const prevLine = () => (p > 0 ? toks[p - 1].line : 1);
  const expect = (v, msg) => {
    if (is(v)) return next();
    const t = peek();
    const line = v === ';' ? prevLine() : t.line;
    throw new CppError(msg || `متوقع ${C(v)}` + (t.t === 'eof' ? ' قبل نهاية البرنامج' : ` قبل ${C(t.v)}`), line);
  };
  const mk = (p0, node) => { node.src = src.slice(toks[p0].s, toks[p - 1].e); if (node.line == null) node.line = toks[p0].line; return node; };
  const warn = (line, msg) => warnings.push({ line, msg });
  const LV = new Set(['var', 'index', 'member', 'arrow', 'deref']);
  const isLv = (n) => LV.has(n.k);
  const isTypeName = (o = 0) => {
    const t = peek(o);
    if (t.t !== 'id') return false;
    if (PRIMS.has(t.v) || structs.has(t.v)) return true;
    if (t.v === 'struct' && peek(o + 1).t === 'id' && structs.has(peek(o + 1).v)) return true;
    return false;
  };
  const isTypeStart = () => is('const') ? isTypeName(1) : isTypeName(0);

  // ---- expressions ----
  function parseExpr() { return parseAssign(); }
  function parseAssign() {
    const p0 = p;
    const left = parseTernary();
    const t = peek();
    if (t.t === 'op' && ['=', '+=', '-=', '*=', '/=', '%='].includes(t.v)) {
      next();
      if (!isLv(left)) throw new CppError(`الطرف الأيسر من ${C(t.v)} يجب أن يكون متغيرًا أو عنصرًا أو حقلًا`, t.line);
      const right = is('{') && t.v === '=' ? parseInitList() : parseAssign();
      return mk(p0, { k: 'assign', op: t.v, target: left, e: right, line: t.line });
    }
    return left;
  }
  function parseTernary() {
    const p0 = p;
    const c = parseOr();
    if (is('?')) { next(); const a = parseAssign(); expect(':', `العامل الثلاثي يحتاج ${C(':')} بين القيمتين`); const b = parseAssign(); return mk(p0, { k: 'tern', c, a, b }); }
    return c;
  }
  function binOp(ops, sub) {
    const p0 = p;
    let l = sub();
    while (peek().t === 'op' && ops.includes(peek().v)) {
      const o = next();
      const r = sub();
      l = mk(p0, { k: 'bin', op: o.v, l, r, line: o.line });
      if (['<', '>', '<=', '>='].includes(o.v) && l.l.k === 'bin' && ['<', '>', '<=', '>='].includes(l.l.op))
        warn(o.line, `الكتابة ${C(l.src)} بالأسلوب الرياضي لا تعمل كما تتوقع في ${CPP}. اكتبها بشرطين يربط بينهما ${C('&&')}`);
    }
    return l;
  }
  function parseOr() { return binOp(['||'], parseAnd); }
  function parseAnd() { return binOp(['&&'], parseEq); }
  function parseEq() { return binOp(['==', '!='], parseRel); }
  function parseRel() { return binOp(['<', '>', '<=', '>='], parseAdd); }
  function parseAdd() { return binOp(['+', '-'], parseMul); }
  function parseMul() { return binOp(['*', '/', '%'], parseUnary); }
  function parseUnary() {
    const p0 = p, t = peek();
    if (t.t === 'op' && (t.v === '!' || t.v === '-' || t.v === '+')) { next(); const e = parseUnary(); return mk(p0, { k: 'un', op: t.v, e, line: t.line }); }
    if (t.t === 'op' && (t.v === '++' || t.v === '--')) {
      next(); const target = parseUnary();
      if (!isLv(target)) throw new CppError(`بعد ${C(t.v)} يجب أن يأتي متغير`, t.line);
      return mk(p0, { k: 'pre', op: t.v, target, line: t.line });
    }
    if (t.t === 'op' && t.v === '*') { next(); const e = parseUnary(); return mk(p0, { k: 'deref', e, line: t.line }); }
    if (t.t === 'op' && t.v === '&') {
      next(); const e = parseUnary();
      if (!isLv(e)) throw new CppError(`العامل ${C('&')} يأخذ عنوان متغير، فيجب أن يأتي بعده متغير`, t.line);
      return mk(p0, { k: 'addr', e, line: t.line });
    }
    if (is('(') && isTypeName(1)) {
      const q = p; next();
      const ty = parseTypeOnly();
      if (is(')')) { next(); const e = parseUnary(); return mk(p0, { k: 'cast', type: ty, e, line: t.line }); }
      p = q;
    }
    return parsePostfix();
  }
  function parsePostfix() {
    const p0 = p;
    let e = parsePrimary();
    for (;;) {
      if (is('[')) {
        const b = next();
        const idx = parseExpr();
        expect(']', `القوس ${C('[')} لم يُغلق بـ ${C(']')}`);
        e = mk(p0, { k: 'index', base: e, idx, line: b.line });
        continue;
      }
      if (peek().t === 'op' && (peek().v === '++' || peek().v === '--')) {
        const o = next();
        if (!isLv(e)) throw new CppError(`العامل ${C(o.v)} يُطبق على متغير فقط`, o.line);
        e = mk(p0, { k: 'post', op: o.v, target: e, line: o.line });
        continue;
      }
      if ((is('.') || is('->')) && peek(1).t === 'id') {
        const dot = next(); const m = next().v;
        if (is('(')) {
          next(); const args = [];
          if (!is(')')) { do { args.push(parseAssign()); } while (is(',') && next()); }
          expect(')');
          e = mk(p0, { k: 'mcall', obj: e, name: m, args, arrow: dot.v === '->', line: dot.line });
        } else e = mk(p0, { k: dot.v === '->' ? 'arrow' : 'member', obj: e, name: m, line: dot.line });
        continue;
      }
      return e;
    }
  }
  function parseTypeOnly() {                 // type used in casts and new: base + stars
    if (is('struct')) next();
    const t = next();
    let base;
    if (structs.has(t.v)) base = TSt(t.v);
    else if (PRIMS.has(t.v)) base = TP(normPrim(t.v));
    else throw new CppError(`النوع ${C(t.v)} غير معروف`, t.line);
    while (is('*')) { next(); base = TPtr(base); }
    return base;
  }
  function parsePrimary() {
    const p0 = p, t = next();
    if (t.t === 'num') return mk(p0, { k: 'num', v: Number(t.v), isFloat: t.isFloat });
    if (t.t === 'str') return mk(p0, { k: 'str', v: t.v });
    if (t.t === 'chr') return mk(p0, { k: 'chr', v: t.v.charCodeAt(0) });
    if (t.t === 'op' && t.v === '(') {
      const e = parseExpr();
      expect(')', `القوس ${C('(')} لم يُغلق بـ ${C(')')}`);
      return mk(p0, Object.assign({}, e, { paren: true }));
    }
    if (t.t === 'id') {
      if (t.v === 'true' || t.v === 'false') return mk(p0, { k: 'bool', v: t.v === 'true' });
      if (t.v === 'nullptr' || t.v === 'NULL') return mk(p0, { k: 'null' });
      if (t.v === 'endl') return mk(p0, { k: 'endl' });
      if (t.v === 'string' && is('::') && peek(1).v === 'npos') { next(); next(); return mk(p0, { k: 'num', v: -1 }); }
      if (t.v === 'new') {
        const ty = parseTypeOnly();
        let n = null, zero = false, init = null;
        if (is('[')) { next(); n = parseExpr(); expect(']'); }
        if (is('(')) { next(); if (!is(')')) init = parseAssign(); expect(')'); zero = true; }
        else if (is('{')) { init = parseInitList(); zero = true; }
        return mk(p0, { k: 'new', type: ty, n, zero, init });
      }
      if (t.v === 'static_cast') {
        expect('<'); const ty = parseTypeOnly(); expect('>'); expect('(');
        const e = parseExpr(); expect(')');
        return mk(p0, { k: 'cast', type: ty, e });
      }
      if (t.v === 'cin' && (is(',') || is(')') || is('.'))) return mk(p0, { k: 'cinobj' });
      if (is('(')) {
        next(); const args = [];
        if (!is(')')) { do { args.push(parseAssign()); } while (is(',') && next()); }
        expect(')', `القوس ${C('(')} في استدعاء الدالة ${C(t.v)} لم يُغلق`);
        return mk(p0, { k: 'call', name: t.v, args });
      }
      if (t.v === 'cout' || t.v === 'cin') throw new CppError(`${C(t.v)} لا تُستخدم داخل تعبير، بل في بداية جملة مستقلة`, t.line);
      if (PRIMS.has(t.v) || structs.has(t.v)) throw new CppError(`لا يمكن كتابة النوع ${C(t.v)} هنا. النوع يُكتب عند التعريف فقط`, t.line);
      return mk(p0, { k: 'var', name: t.v });
    }
    if (t.t === 'op' && t.v === '{') throw new CppError(`القائمة ${C('{ }')} تُستخدم عند التعريف فقط`, t.line);
    if (t.t === 'eof') throw new CppError('انتهى البرنامج قبل اكتمال التعبير', prevLine());
    if (t.v === ';') throw new CppError('يوجد تعبير ناقص قبل الفاصلة المنقوطة', t.line);
    throw new CppError(`رمز غير متوقع ${C(t.v)}`, t.line);
  }
  function parseInitList() {
    const p0 = p; const o = expect('{');
    const items = [];
    if (!is('}')) { do { if (is('}')) break; items.push(is('{') ? parseInitList() : parseAssign()); } while (is(',') && next()); }
    expect('}', `القائمة ${C('{')} لم تُغلق بـ ${C('}')}`);
    return mk(p0, { k: 'list', items, line: o.line });
  }

  // ---- types and declarations ----
  function parseBase() {
    let isConst = false;
    if (is('const')) { next(); isConst = true; }
    if (is('struct')) next();
    const t = next();
    let base;
    if (t.t === 'id' && structs.has(t.v)) base = TSt(t.v);
    else if (t.t === 'id' && PRIMS.has(t.v)) {
      let name = t.v;
      while (peek().t === 'id' && ['long', 'int', 'short'].includes(peek().v) && ['long', 'unsigned', 'short'].includes(name)) next();
      base = TP(normPrim(name));
    } else throw new CppError('متوقع نوع بيانات مثل int أو double', t.line);
    if (is('const')) next();
    return { base, isConst, shown: t.v, line: t.line };
  }
  function parseDims() {
    const dims = [];
    while (is('[')) {
      const b = next();
      if (is(']')) { next(); dims.push(null); continue; }
      dims.push(parseExpr()); expect(']', `القوس ${C('[')} لم يُغلق بـ ${C(']')}`);
      if (dims.length > 2) throw new CppError('المختبر يدعم المصفوفات الأحادية والثنائية فقط', b.line);
    }
    return dims;
  }
  function parseDeclarator(base) {          // stars, &, name, dims
    let type = base, ref = false;
    while (is('*')) { next(); type = TPtr(type); }
    if (is('&')) { next(); ref = true; }
    const id = next();
    return { type, ref, id };
  }
  function parseDeclRest(p0, bt, first, inFor) {
    const decls = [];
    let d = first;
    for (;;) {
      const id = d.id;
      if (id.t !== 'id') throw new CppError('متوقع اسم المتغير بعد النوع', id.line);
      if (RESERVED.has(id.v)) throw new CppError(`لا يمكن استخدام الكلمة المحجوزة ${C(id.v)} اسمًا لمتغير`, id.line);
      if (d.type.k === 'void') throw new CppError('لا يمكن تعريف متغير من النوع void', id.line);
      const dims = parseDims();
      let init = null;
      if (is('=')) { next(); init = is('{') ? parseInitList() : parseAssign(); }
      else if (is('{') && (dims.length || d.type.k === 'struct')) init = parseInitList();
      else if (bt.isConst) throw new CppError('الثابت const يجب أن يُعطى قيمة عند تعريفه', id.line);
      else if (d.ref) throw new CppError(`المرجع ${C('&' + id.v)} يجب أن يُربط بمتغير عند تعريفه، مثل ${C(`int &${id.v} = x;`)}`, id.line);
      if (dims.length && dims.some((x, i) => x === null && (i > 0 || !init))) throw new CppError('يجب تحديد حجم المصفوفة بين القوسين [ ]', id.line);
      if (!dims.length && init && init.k === 'list' && d.type.k !== 'struct') throw new CppError(`القائمة ${C('{ }')} تُستخدم مع المصفوفات والسجلات`, id.line);
      decls.push({ name: id.v, type: d.type, ref: d.ref, dims, init, line: id.line });
      if (!is(',')) break;
      next(); d = parseDeclarator(bt.base);
    }
    expect(';', inFor ? `متوقع ${C(';')} بعد التهيئة في رأس for` : `نسيت الفاصلة المنقوطة ${C(';')} في نهاية السطر`);
    return mk(p0, { k: 'decl', isConst: bt.isConst, decls, line: bt.line });
  }
  function parseDecl(inFor) {
    const p0 = p;
    const bt = parseBase();
    const d = parseDeclarator(bt.base);
    if (is('(') && d.id.t === 'id') throw new CppError('لا يمكن تعريف دالة داخل دالة أخرى. اكتبها خارج main', d.id.line);
    return parseDeclRest(p0, bt, d, inFor);
  }
  function bodyWarn(kw, body, line) {
    if (body.k === 'empty') warn(line, `توجد فاصلة منقوطة ${C(';')} مباشرة بعد ${C(kw + ' (...)')}، فيصبح جسم ${kw} فارغًا والسطر الذي بعدها لا يتبعها`);
  }
  function condWarn(cond) {
    if (cond && cond.k === 'assign' && cond.op === '=')
      warn(cond.line, `داخل الشرط استخدمت ${C('=')} وهي إسناد وليست مقارنة. هل تقصد ${C(cond.target.src + ' == ' + cond.e.src)}؟`);
  }

  // ---- statements ----
  function parseBlock() {
    const t = expect('{');
    const body = [];
    while (!is('}')) {
      if (peek().t === 'eof') throw new CppError(`القوس ${C('{')} لم يُغلق بـ ${C('}')}`, t.line);
      body.push(parseStmt());
    }
    const close = next();
    return { k: 'block', body, line: t.line, endLine: close.line };
  }
  function parseStmt() {
    const t = peek(), p0 = p;
    if (is('{')) return parseBlock();
    if (is(';')) { next(); return { k: 'empty', line: t.line }; }
    if (isTypeStart()) return parseDecl();
    if (is('if')) {
      next(); expect('(', `الشرط بعد ${C('if')} يُكتب بين قوسين`);
      const cond = parseExpr(); expect(')', `القوس ${C('(')} لم يُغلق بعد الشرط`);
      condWarn(cond);
      const then = parseStmt(); bodyWarn('if', then, t.line);
      let els = null;
      if (is('else')) { next(); els = parseStmt(); }
      return { k: 'if', cond, then, els, line: t.line };
    }
    if (is('else')) throw new CppError(`${C('else')} بدون ${C('if')} قبلها. تأكد من عدم وجود فاصلة منقوطة أو أمر آخر بين جسم if و else`, t.line);
    if (is('while')) {
      next(); expect('('); const cond = parseExpr(); expect(')'); condWarn(cond);
      const body = parseStmt(); bodyWarn('while', body, t.line);
      return { k: 'while', cond, body, line: t.line };
    }
    if (is('do')) {
      next(); const body = parseStmt();
      const w = expect('while', `متوقع ${C('while')} بعد جسم ${C('do')}`);
      expect('('); const cond = parseExpr(); expect(')'); condWarn(cond);
      expect(';', `حلقة do-while تنتهي بفاصلة منقوطة ${C(';')} بعد ${C('while (...)')}`);
      return { k: 'dowhile', body, cond, line: t.line, condLine: w.line };
    }
    if (is('for')) {
      next(); expect('(', `رأس ${C('for')} يُكتب بين قوسين`);
      let init = null;
      if (isTypeStart()) init = parseDecl(true);
      else if (is(';')) next();
      else { const q = p; init = { k: 'expr', e: parseExpr(), line: toks[q].line }; expect(';', `متوقع ${C(';')} بعد التهيئة في رأس for`); }
      let cond = null; if (!is(';')) cond = parseExpr();
      expect(';', `رأس for يحتوي على ثلاثة أجزاء يفصل بينها ${C(';')}`);
      condWarn(cond);
      let upd = null; if (!is(')')) upd = parseExpr();
      expect(')', `القوس ${C('(')} في رأس for لم يُغلق`);
      const body = parseStmt(); bodyWarn('for', body, t.line);
      return { k: 'for', init, cond, upd, body, line: t.line };
    }
    if (is('switch')) {
      next(); expect('('); const e = parseExpr(); expect(')'); expect('{', `جسم ${C('switch')} يُكتب بين ${C('{ }')}`);
      const cases = [];
      while (!is('}')) {
        const ct = peek();
        if (ct.t === 'eof') throw new CppError(`القوس ${C('{')} في switch لم يُغلق`, t.line);
        if (is('case')) {
          next(); const v = parseTernary(); expect(':', `بعد قيمة ${C('case')} توضع نقطتان ${C(':')}`);
          if (!['num', 'chr', 'bool'].includes(v.k) && !(v.k === 'un' && v.e.k === 'num'))
            throw new CppError(`القيمة بعد case يجب أن تكون ثابتًا مثل ${C('case 1:')} أو ${C("case 'A':")}`, ct.line);
          cases.push({ val: v, stmts: [], line: ct.line });
        } else if (is('default')) {
          next(); expect(':'); cases.push({ def: true, stmts: [], line: ct.line });
        } else {
          if (!cases.length) throw new CppError(`متوقع ${C('case')} داخل switch`, ct.line);
          cases[cases.length - 1].stmts.push(parseStmt());
        }
      }
      next();
      return { k: 'switch', e, cases, line: t.line };
    }
    if (is('case') || is('default')) throw new CppError(`${C(t.v)} تُستخدم داخل switch فقط`, t.line);
    if (is('break')) { next(); expect(';'); return { k: 'break', line: t.line }; }
    if (is('continue')) { next(); expect(';'); return { k: 'continue', line: t.line }; }
    if (is('return')) { next(); let e = null; if (!is(';')) e = parseExpr(); expect(';'); return { k: 'return', e, line: t.line }; }
    if (is('delete')) {
      next(); let arr = false;
      if (is('[')) { next(); expect(']'); arr = true; }
      const e = parseExpr(); expect(';');
      return mk(p0, { k: 'delete', e, arr, line: t.line });
    }
    if (is('cout')) {
      next();
      if (is('>>')) throw new CppError(`${C('cout')} للإخراج وتُستخدم مع ${C('<<')}، أما ${C('>>')} فمع ${C('cin')}`, t.line);
      if (!is('<<')) throw new CppError(`${C('cout')} تُستخدم مع العامل ${C('<<')}`, t.line);
      const items = [];
      while (is('<<')) { next(); items.push(parseTernary()); }
      expect(';', `نسيت الفاصلة المنقوطة ${C(';')} في نهاية جملة cout`);
      return mk(p0, { k: 'cout', items, line: t.line });
    }
    if (is('cin') && !is('.', 1)) {
      next();
      if (is('<<')) throw new CppError(`${C('cin')} للإدخال وتُستخدم مع ${C('>>')}، أما ${C('<<')} فمع ${C('cout')}`, t.line);
      if (!is('>>')) throw new CppError(`${C('cin')} تُستخدم مع العامل ${C('>>')}`, t.line);
      const targets = [];
      while (is('>>')) {
        next(); const q = peek();
        const tg = parseUnaryLv();
        if (!isLv(tg)) throw new CppError(`بعد ${C('>>')} في cin يجب أن يأتي متغير تُخزَّن فيه القيمة`, q.line);
        targets.push(tg);
      }
      expect(';', `نسيت الفاصلة المنقوطة ${C(';')} في نهاية جملة cin`);
      return mk(p0, { k: 'cin', targets, line: t.line });
    }
    const q = p;
    const e = parseExpr();
    if (peek().t === 'id' && e.k === 'var') throw new CppError(`${C(e.name)} ليس نوع بيانات معروفًا. هل تقصد ${C('int')} أو ${C('double')}؟`, t.line);
    expect(';', `نسيت الفاصلة المنقوطة ${C(';')} في نهاية السطر`);
    return { k: 'expr', e, line: toks[q].line };
  }
  function parseUnaryLv() {
    if (is('*')) { const p0 = p; const t = next(); const e = parseUnaryLv(); return mk(p0, { k: 'deref', e, line: t.line }); }
    return parsePostfix();
  }

  // ---- functions and structs ----
  function parseParams() {
    const params = [];
    expect('(');
    if (is('void') && is(')', 1)) next();
    if (!is(')')) {
      do {
        const bt = parseBase();
        const d = parseDeclarator(bt.base);
        if (d.type.k === 'void') throw new CppError('لا يمكن أن يكون نوع المعامل void', bt.line);
        const id = d.id;
        if (id.t !== 'id' || RESERVED.has(id.v)) throw new CppError('متوقع اسم المعامل بعد نوعه', id.line);
        let arr = 0, cols = null;
        while (is('[')) {
          next();
          if (!is(']')) { const dd = parseExpr(); if (arr === 1) cols = dd; }
          expect(']'); arr++;
        }
        if (arr === 2 && !cols) throw new CppError(`عند تمرير مصفوفة ثنائية يجب كتابة عدد الأعمدة، مثل ${C(`int ${id.v}[][3]`)}`, id.line);
        let type = d.type;
        if (arr === 1) type = TArr(type, null);
        if (arr === 2) type = TArr(TArr(type, cols.k === 'num' ? cols.v : null), null);
        let def = null;
        if (is('=')) { next(); def = parseTernary(); }
        else if (params.some((x) => x.def)) throw new CppError(`القيم الافتراضية تُكتب من اليمين: المعامل ${C(id.v)} بعد معامل له قيمة افتراضية يجب أن تكون له قيمة افتراضية أيضًا`, id.line);
        params.push({ type, isConst: bt.isConst, ref: d.ref, name: id.v, arr, def, line: id.line });
      } while (is(',') && next());
    }
    expect(')', `القوس ${C('(')} بعد اسم الدالة لم يُغلق`);
    return params;
  }
  function parseStruct() {
    const kw = next();
    const id = next();
    if (id.t !== 'id' || RESERVED.has(id.v)) throw new CppError('متوقع اسم السجل بعد struct', kw.line);
    const def = { name: id.v, fields: [], line: id.line };
    structs.set(id.v, def);
    expect('{', `جسم السجل ${C(id.v)} يُكتب بين ${C('{ }')}`);
    while (!is('}')) {
      if (peek().t === 'eof') throw new CppError(`القوس ${C('{')} في struct لم يُغلق`, id.line);
      const bt = parseBase();
      for (;;) {
        const d = parseDeclarator(bt.base);
        if (d.id.t !== 'id') throw new CppError('متوقع اسم الحقل', d.id.line);
        if (is('(')) throw new CppError('الدوال داخل struct ليست ضمن المختبر حاليًا. اكتب الدالة خارج السجل', d.id.line);
        if (d.type.k === 'struct' && d.type.name === id.v) throw new CppError(`السجل ${C(id.v)} لا يمكن أن يحتوي على نفسه. استخدم مؤشرًا ${C(id.v + '* next;')}`, d.id.line);
        const dims = parseDims();
        let type = d.type;
        for (let i = dims.length - 1; i >= 0; i--) {
          if (!dims[i] || (dims[i].k !== 'num' && dims[i].k !== 'var')) throw new CppError('حجم المصفوفة داخل السجل يجب أن يكون عددًا ثابتًا أو ثابتًا عامًا مثل MAX', d.id.line);
          type = TArr(type, dims[i].k === 'num' ? dims[i].v : dims[i]);
        }
        let init = null;
        if (is('=')) { next(); init = parseTernary(); }
        if (def.fields.some((f) => f.name === d.id.v)) throw new CppError(`الحقل ${C(d.id.v)} مكرر في السجل`, d.id.line);
        def.fields.push({ name: d.id.v, type, init, line: d.id.line });
        if (!is(',')) break;
        next();
      }
      expect(';', `نسيت الفاصلة المنقوطة ${C(';')} بعد الحقل`);
    }
    next();
    expect(';', `تعريف ${C('struct')} ينتهي بفاصلة منقوطة ${C(';')} بعد القوس ${C('}')}`);
    return def;
  }

  // ---- program ----
  const funcs = new Map();
  const globals = [];
  while (peek().t === 'pp') next();
  if (is('using')) { next(); expect('namespace'); next(); expect(';', `متوقع ${C(';')} بعد ${C('using namespace std')}`); }
  const hasMain = toks.some((t, i) => t.t === 'id' && t.v === 'main' && toks[i + 1] && toks[i + 1].v === '(');
  let snippet = null;
  if (!hasMain) {
    const stmts = [];
    while (peek().t !== 'eof') {
      if (is('struct') && peek(1).t === 'id' && is('{', 2)) { parseStruct(); continue; }
      if (isTypeStart() && peek(1).t === 'id' && is('(', 2)) throw new CppError(`البرنامج يحتوي على دوال ولا يحتوي على ${C('int main()')}`, peek().line);
      stmts.push(parseStmt());
    }
    snippet = { k: 'block', body: stmts, line: 1 };
  } else {
    while (peek().t !== 'eof') {
      while (peek().t === 'pp') next();
      if (peek().t === 'eof') break;
      if (is('struct') && peek(1).t === 'id' && (is('{', 2))) { parseStruct(); continue; }
      if (is('using')) { next(); while (!is(';')) next(); next(); continue; }
      if (!isTypeStart()) throw new CppError('خارج الدوال يُسمح فقط بتعريف دوال أو سجلات struct أو متغيرات عامة', peek().line);
      const p0 = p;
      const bt = parseBase();
      const d = parseDeclarator(bt.base);
      const id = d.id;
      if (id.t !== 'id') throw new CppError('متوقع اسم بعد النوع', id.line);
      if (is('(')) {
        if (id.v === 'main' && tstr(d.type) !== 'int') throw new CppError(`الدالة main تُكتب ${C('int main()')}`, id.line);
        const params = parseParams();
        const sig = params.map((x) => tstr(x.type) + (x.ref ? '&' : '')).join(',');
        const list = funcs.get(id.v) || [];
        let f = list.find((x) => x.sig === sig);
        const ret = d.type;
        if (is(';')) {
          next();
          if (!f) { f = { name: id.v, ret, params, sig, line: id.line, body: null }; list.push(f); funcs.set(id.v, list); }
          continue;
        }
        const body = parseBlock();
        if (f && f.body) throw new CppError(`الدالة ${C(id.v)} معرَّفة مسبقًا بالمعاملات نفسها`, id.line);
        if (f) {
          if (!sameT(f.ret, ret)) throw new CppError(`نوع الإرجاع لا يطابق النموذج الأولي للدالة ${C(id.v)}`, id.line);
          if (params.some((x) => x.def) && f.params.some((x) => x.def)) throw new CppError('القيمة الافتراضية تُكتب في النموذج الأولي فقط، وليس مرة ثانية في التعريف', id.line);
          if (!f.params.some((x) => x.def)) f.params = params; else f.params.forEach((x, i) => { x.name = params[i].name; });
          f.body = body; f.line = id.line;
        } else {
          if (list.some((x) => x.params.length === params.length && x.params.every((q, i) => sameT(q.type, params[i].type))))
            throw new CppError(`لا يكفي اختلاف نوع الإرجاع أو & لتعريف دالة ثانية باسم ${C(id.v)}؛ يجب أن تختلف المعاملات في العدد أو النوع`, id.line);
          list.push({ name: id.v, ret, params, sig, line: id.line, body });
          funcs.set(id.v, list);
        }
        continue;
      }
      globals.push(parseDeclRest(p0, bt, d, false));
    }
    if (!funcs.has('main')) throw new CppError(`البرنامج يجب أن يحتوي على الدالة ${C('int main()')}`, 1);
    for (const [name, list] of funcs) for (const f of list) if (!f.body) throw new CppError(`الدالة ${C(name)} لها نموذج أولي (prototype) لكن لا يوجد تعريف لها`, f.line);
  }
  return { funcs, globals, snippet, warnings, structs };
}

/* ======================= values ======================= */
const I = (x) => ({ t: 'int', v: Math.trunc(x) | 0 });
const D = (x) => ({ t: 'double', v: x });
const B = (x) => ({ t: 'bool', v: !!x });
const S = (x) => ({ t: 'string', v: x });
const CH = (x) => ({ t: 'char', v: x & 255 });
const NULLP = (to) => ({ t: 'ptr', to: to || null, cell: null, arr: null, idx: 0 });
const numv = (a) => (a.t === 'bool' ? (a.v ? 1 : 0) : a.v);
const isNumT = (t) => ['int', 'double', 'float', 'char', 'bool'].includes(t);

function fmtDouble(x) {
  if (!isFinite(x)) return isNaN(x) ? 'nan' : (x > 0 ? 'inf' : '-inf');
  if (x === 0) return '0';
  const ax = Math.abs(x);
  if (ax >= 1e-5 && ax < 1e6) {
    let s = x.toPrecision(6);
    if (s.includes('.')) s = s.replace(/0+$/, '').replace(/\.$/, '');
    return s;
  }
  let s = x.toExponential(5);
  let [m, e] = s.split('e');
  if (m.includes('.')) m = m.replace(/0+$/, '').replace(/\.$/, '');
  const sign = e[0] === '-' ? '-' : '+';
  e = e.replace(/^[-+]/, '').padStart(2, '0');
  return `${m}e${sign}${e}`;
}
const addrOf = (cell) => '0x' + (0x61fe00 + cell.uid * 16).toString(16);
function ptrTarget(v) { return v.cell || (v.arr ? null : null); }
function ptrLabel(v) {
  if (!v.cell && !v.arr) return 'nullptr';
  if (!v.cell) return `${v.arr.label}+${v.idx}`;
  return v.cell.label;
}
function charsOf(arrCell) {              // char array -> JS string up to '\0'
  let s = '';
  for (const c of arrCell.elems) { const v = c.val; if (!v || v.v === 0) break; s += String.fromCharCode(v.v); }
  return s;
}
function fmtOut(a) {
  if (a.t === 'char') return String.fromCharCode(a.v);
  if (a.t === 'bool') return a.v ? '1' : '0';
  if (a.t === 'string') return a.v;
  if (isFloatK(a.t)) return fmtDouble(a.v);
  if (a.t === 'ptr') return a.cell ? addrOf(a.cell) : a.arr ? addrOf(a.arr) + '+' + a.idx : '0';
  return String(a.v);
}
function fmtShow(a) {
  if (!a) return '؟';
  if (a.t === 'array') {
    if (elemBase(a.cell.type).k === 'char' && a.cell.type.of.k === 'char') return `"${charsOf(a.cell)}"`;
    return `{${a.cell.elems.map((c) => fmtShow(c.type.k === 'arr' ? { t: 'array', cell: c } : c.val)).join(', ')}}`;
  }
  if (a.t === 'struct') return `{${[...a.f].map(([k, v]) => `${k}: ${fmtShow(v)}`).join(', ')}}`;
  if (a.t === 'ptr') return a.cell || a.arr ? '→ ' + ptrLabel(a) : 'nullptr';
  if (a.t === 'char') return a.v === 0 ? "'\\0'" : `'${String.fromCharCode(a.v)}'`;
  if (a.t === 'bool') return a.v ? 'true' : 'false';
  if (a.t === 'string') return `"${a.v}"`;
  if (isFloatK(a.t)) { const s = fmtDouble(a.v); return /^-?\d+$/.test(s) ? s + '.0' : s; }
  if (a.t === 'void') return '';
  return String(a.v);
}
const countAr = (n) => (n === 0 ? 'أي دورة' : n === 1 ? 'دورة واحدة' : n === 2 ? 'دورتين' : n <= 10 ? `${n} دورات` : `${n} دورة`);
const typeAr = { int: 'عدد صحيح int', double: 'عدد عشري double', float: 'عدد عشري float', char: 'حرف char', bool: 'قيمة منطقية bool', string: 'نص string', array: 'مصفوفة', ptr: 'مؤشر', struct: 'سجل', void: 'void' };
const garbageOf = (k) => (isFloatK(k) ? D(-9.25596e61) : k === 'string' ? S('') : k === 'char' ? CH(204) : k === 'bool' ? B(true) : I(-858993460));

let UID = 0;
class Cell { constructor(type, label, o) { this.uid = ++UID; this.type = type; this.label = label; Object.assign(this, o || {}); } }

/* ======================= interpreter ======================= */
class Interp {
  constructor(prog) {
    this.prog = prog;
    this.structs = prog.structs;
    this.globals = new Map();
    this.frames = [];
    this.heap = [];
    this.heapCount = 0;
    this.output = '';
    this.inbuf = '';
    this.inputLog = [];
    this.changed = new Set();
    this.lastChanged = new Set();
    this.loops = [];
    this.count = 0;
    this.warnByLine = new Map();
    for (const w of prog.warnings) { if (!this.warnByLine.has(w.line)) this.warnByLine.set(w.line, []); this.warnByLine.get(w.line).push(w.msg); }
    this.shownWarn = new Set();
    this.notes = [];
    this.done = false;
  }
  get top() { return this.frames[this.frames.length - 1]; }
  get scopes() { return this.top.scopes; }
  pushFrame(fn, label, callLine) {
    if (this.frames.length > MAX_DEPTH) throw new CppError(`تجاوز عدد الاستدعاءات المتداخلة ${MAX_DEPTH}. يبدو أن الاستدعاء الذاتي لا يصل إلى حالة التوقف`, callLine);
    this.frames.push({ fn, label, callLine, scopes: [new Map()], ctx: [], active: [] });
  }

  // ---- cells ----
  makeCell(type, label, o) {
    if (type.k === 'arr' && typeof type.n === 'object' && type.n) { const g = this.globals.get(type.n.name); if (g && g.isConst && g.val) type = TArr(type.of, g.val.v); }
    const c = new Cell(type, label, o);
    if (type.k === 'arr') {
      if (type.n == null) throw new CppError('حجم المصفوفة غير معروف', 0);
      if (typeof type.n === 'object') {
        const g = this.globals.get(type.n.name);
        if (!g || !g.isConst || !g.val || g.val.t !== 'int') throw new CppError(`حجم المصفوفة ${C(type.n.name)} داخل السجل يجب أن يكون ثابتًا عامًا معرَّفًا قبله، مثل ${C('const int ' + type.n.name + ' = 5;')}`, type.n.line);
        type = TArr(type.of, g.val.v);
      }
      c.elems = [];
      for (let i = 0; i < type.n; i++) c.elems.push(this.makeCell(type.of, `${label}[${i}]`, { parent: c, index: i, heap: c.heap }));
    } else if (type.k === 'struct') {
      const def = this.structs.get(type.name);
      c.fields = new Map();
      for (const f of def.fields) {
        const fc = this.makeCell(f.type, `${label}.${f.name}`, { parent: c, field: f.name, heap: c.heap });
        if (f.init) fc.val = this.convert(this.constEval(f.init), f.type, f.line, f.name);
        c.fields.set(f.name, fc);
      }
    }
    return c;
  }
  constEval(n) {
    switch (n.k) {
      case 'num': return n.isFloat ? D(n.v) : I(n.v);
      case 'chr': return CH(n.v);
      case 'str': return S(n.v);
      case 'bool': return B(n.v);
      case 'null': return NULLP();
      case 'un': if (n.op === '-') { const v = this.constEval(n.e); return isFloatK(v.t) ? D(-v.v) : I(-v.v); } break;
    }
    throw new CppError('القيمة الابتدائية للحقل يجب أن تكون ثابتًا', n.line);
  }
  zero(c) {
    if (c.elems) c.elems.forEach((e) => this.zero(e));
    else if (c.fields) c.fields.forEach((f) => { if (f.val === undefined || f.fields || f.elems) this.zero(f); });
    else c.val = c.type.k === 'ptr' ? NULLP(c.type.to) : this.convert(I(0), c.type, 0);
  }
  rootName(c) { while (c.parent) c = c.parent; return c.heap ? null : c.label; }
  touch(c) {
    this.changed.add(c.uid);
    for (let p = c.parent; p; p = p.parent) this.changed.add(p.uid);
    const r = this.rootName(c);
    if (r && this.frames.length) for (const L of this.top.active) L.tracked.add(r);
  }
  read(c, line, label) {
    if (c.freed) throw new CppError(`استخدام ذاكرة محذوفة: ${C(c.label)} حُذفت بـ delete، والمؤشر ما زال يحمل عنوانها القديم (dangling pointer)`, line);
    if (c.type.k === 'arr') return { t: 'array', cell: c };
    if (c.type.k === 'struct') return { t: 'struct', name: c.type.name, f: new Map([...c.fields].map(([k, fc]) => [k, fc.type.k === 'arr' ? this.copyArr(fc) : fc.type.k === 'struct' ? this.read(fc, line) : fc.val])) };
    let v = c.val;
    if (v === undefined) {
      this.pendingWarn = `${c.type.k === 'ptr' ? 'المؤشر' : c.parent ? 'العنصر' : 'المتغير'} ${C(label || c.label)} استُخدم قبل إعطائه قيمة، فقيمته عشوائية (garbage)`;
      if (c.type.k === 'ptr') throw new CppError(`المؤشر ${C(label || c.label)} لم يُعطَ قيمة، ويشير إلى مكان عشوائي. أعطه عنوانًا أو ${C('nullptr')} قبل استخدامه`, line);
      v = garbageOf(c.type.k); c.val = v; c.garbage = true;
    }
    return v;
  }
  copyArr(c) { return { t: 'arrcopy', vals: c.elems.map((e) => (e.type.k === 'arr' ? this.copyArr(e) : e.type.k === 'struct' ? this.read(e, 0) : e.val)) }; }
  write(c, v, line, label) {
    if (c.freed) throw new CppError(`الكتابة في ذاكرة محذوفة: ${C(c.label)} حُذفت بـ delete`, line);
    if (c.isConst || (c.parent && this.constRoot(c))) throw new CppError(`لا يمكن تغيير قيمة الثابت ${C(label || c.label)} لأنه معرَّف بـ const`, line);
    if (c.type.k === 'arr') {
      if (v.t === 'string' && c.type.of.k === 'char') return this.writeChars(c, v.v, line);
      if (v.t === 'arrcopy') { c.elems.forEach((e, i) => this.writeRaw(e, v.vals[i], line)); return v; }
      throw new CppError('لا يمكن إسناد مصفوفة كاملة دفعة واحدة. استخدم حلقة لنسخ العناصر، أو strcpy للنصوص', line);
    }
    if (c.type.k === 'struct') {
      if (v.t !== 'struct' || v.name !== c.type.name) throw new CppError(`لا يمكن تخزين ${typeAr[v.t] || v.t} في السجل ${C(label || c.label)} من النوع ${c.type.name}`, line);
      for (const [k, fv] of v.f) this.writeRaw(c.fields.get(k), fv, line);
      this.touch(c);
      return v;
    }
    const now = this.convert(v, c.type, line, label || c.label);
    if (c.type.k === 'int' && isFloatK(v.t) && v.v !== Math.trunc(v.v))
      this.pendingWarn = `القيمة ${fmtShow(v)} خُزِّنت في ${C(label || c.label)} من النوع int، فحُذف الجزء العشري وأصبحت ${now.v}`;
    c.val = now; c.garbage = false;
    this.touch(c);
    return now;
  }
  writeRaw(c, v, line) {
    if (v === undefined) { c.val = undefined; return; }
    if (c.type.k === 'arr') { c.elems.forEach((e, i) => this.writeRaw(e, v.vals[i], line)); return; }
    if (c.type.k === 'struct') { for (const [k, fv] of v.f) this.writeRaw(c.fields.get(k), fv, line); return; }
    c.val = v; this.touch(c);
  }
  writeChars(c, s, line) {
    if (s.length + 1 > c.elems.length) throw new CppError(`النص ${C('"' + s + '"')} (${s.length} حروف + '\\0') أطول من حجم المصفوفة ${C(c.label)} وهو ${c.elems.length}`, line);
    for (let i = 0; i <= s.length; i++) { c.elems[i].val = CH(i < s.length ? s.charCodeAt(i) : 0); this.touch(c.elems[i]); }
    return S(s);
  }
  constRoot(c) { for (let p = c.parent; p; p = p.parent) if (p.isConst) return true; return false; }
  convert(v, type, line, name) {
    const where = name ? ' ' + C(name) : '';
    if (v.t === 'void') throw new CppError(`الدالة من النوع void لا تُرجع قيمة يمكن تخزينها${where}`, line);
    if (type.k === 'auto') return v;
    if (type.k === 'ptr') {
      if (v.t === 'ptr') return Object.assign({}, v, { to: type.to });
      if (v.t === 'array') { const c0 = v.cell.elems[0]; return { t: 'ptr', to: type.to, cell: c0, arr: v.cell, idx: 0 }; }
      if (v.t === 'int' && v.v === 0) return NULLP(type.to);
      throw new CppError(`لا يمكن تخزين ${typeAr[v.t] || v.t} في المؤشر${where}. المؤشر يخزن عنوانًا مثل ${C('&x')} أو ${C('nullptr')}`, line);
    }
    if (type.k === 'struct') {
      if (v.t === 'struct' && v.name === type.name) return v;
      throw new CppError(`لا يمكن تخزين ${typeAr[v.t] || v.t} في${where} من النوع ${type.name}`, line);
    }
    if (v.t === 'array') throw new CppError(`لا يمكن استخدام المصفوفة كاملة كقيمة${where}. استخدم عنصرًا مثل ${C('a[0]')}`, line);
    if (v.t === 'ptr') throw new CppError(`لا يمكن تخزين عنوان (مؤشر) في${where} من النوع ${type.k}. هل نسيت ${C('*')} قبل المؤشر؟`, line);
    if (v.t === 'struct') throw new CppError(`لا يمكن تخزين سجل كامل في${where} من النوع ${type.k}. استخدم حقلًا مثل ${C('s.age')}`, line);
    if (type.k === 'string') {
      if (v.t === 'string') return v;
      if (v.t === 'char') return S(String.fromCharCode(v.v));
      throw new CppError(`لا يمكن تخزين ${typeAr[v.t] || v.t} في نص string${where}`, line);
    }
    if (v.t === 'string') throw new CppError(`لا يمكن تخزين نص في${where} من النوع ${type.k}`, line);
    const x = numv(v);
    if (type.k === 'int') return I(x);
    if (isFloatK(type.k)) return { t: type.k, v: type.k === 'float' ? Math.fround(x) : x };
    if (type.k === 'char') return CH(Math.trunc(x));
    if (type.k === 'bool') return B(x !== 0);
    return v;
  }

  // ---- names and lvalues ----
  entry(name, line, quiet) {
    const sc = this.top.scopes;
    for (let i = sc.length - 1; i >= 0; i--) if (sc[i].has(name)) return sc[i].get(name);
    if (this.globals.has(name)) return this.globals.get(name);
    if (quiet) return null;
    if (this.prog.funcs.has(name)) throw new CppError(`${C(name)} اسم دالة. لاستدعائها اكتب ${C(name + '(...)')}`, line);
    throw new CppError(`المتغير ${C(name)} غير معرَّف` + (this.frames.length > 1 ? ` داخل الدالة ${C(this.top.fn.name)}. المتغيرات المحلية لـ main لا تُرى هنا، فمرّرها كمعاملات` : `. يجب تعريفه أولًا مثل ${C('int ' + name + ';')}`) + this.similar(name), line);
  }
  similar(name) {
    const all = [...this.top.scopes.flatMap((s) => [...s.keys()]), ...this.globals.keys()];
    const k = all.find((x) => x.toLowerCase() === name.toLowerCase());
    return k ? `. هل تقصد ${C(k)}؟ لغة ${CPP} تفرق بين الحروف الكبيرة والصغيرة` : '';
  }
  cellOf(name, line) { const e = this.entry(name, line); return e.isRef ? e.cell : e; }
  derefPtr(v, line, src) {
    if (v.t !== 'ptr') throw new CppError(`${C(src)} ليس مؤشرًا، فلا يمكن استخدام ${C('*')} أو ${C('->')} معه`, line);
    if (!v.cell && !v.arr) throw new CppError(`المؤشر ${C(src)} قيمته ${C('nullptr')} ولا يشير إلى أي شيء، فلا يمكن الوصول عبره`, line);
    if (!v.cell) throw new CppError(`المؤشر ${C(src)} يشير بعد نهاية المصفوفة، فلا يمكن الوصول عبره`, line);
    if (v.cell.freed) throw new CppError(`المؤشر ${C(src)} يشير إلى ذاكرة حُذفت بـ delete (dangling pointer)`, line);
    return v.cell;
  }
  ptrMove(v, k, line) {
    if (!v.arr) {
      if (k === 0) return v;
      if (!v.cell) throw new CppError(`لا يمكن إجراء عمليات حسابية على المؤشر ${C('nullptr')}`, line);
      if (v.cell.parent && v.cell.parent.type.k === 'arr') return this.ptrMove({ t: 'ptr', to: v.to, cell: v.cell, arr: v.cell.parent, idx: v.cell.index }, k, line);
      throw new CppError('الحساب على المؤشرات مسموح فقط داخل مصفوفة', line);
    }
    const j = v.idx + k, n = v.arr.elems.length;
    if (j < 0 || j > n) throw new CppError(`المؤشر خرج من حدود المصفوفة ${C(v.arr.label)}: الموضع ${j} والمسموح من 0 إلى ${n - 1}`, line);
    return { t: 'ptr', to: v.to, arr: v.arr, idx: j, cell: j < n ? v.arr.elems[j] : null };
  }
  normPtr(v) { if (v.t === 'ptr' && !v.arr && v.cell && v.cell.parent && v.cell.parent.type.k === 'arr') return { t: 'ptr', to: v.to, cell: v.cell, arr: v.cell.parent, idx: v.cell.index }; return v; }
  *lv(n) {        // lvalue -> {cell} or {str: cell, i}
    switch (n.k) {
      case 'var': return { cell: this.cellOf(n.name, n.line) };
      case 'index': {
        let base = null;
        if (['var', 'index', 'member', 'arrow', 'deref'].includes(n.base.k)) base = (yield* this.lv(n.base));
        const iv = yield* this.ev(n.idx);
        if (iv.t === 'string' || isFloatK(iv.t) || iv.t === 'ptr') throw new CppError('الفهرس يجب أن يكون عددًا صحيحًا', n.line);
        const k = numv(iv);
        let bc = base && base.cell;
        if (base && base.str) throw new CppError('لا يمكن استخدام [ ] مرتين على نص', n.line);
        if (bc && bc.type.k === 'arr') {
          if (k < 0 || k >= bc.elems.length) throw new CppError(`الفهرس ${k} خارج حدود المصفوفة ${C(n.base.src)}: الفهارس المسموح بها من 0 إلى ${bc.elems.length - 1}`, n.line);
          return { cell: bc.elems[k] };
        }
        if (bc && bc.type.k === 'string') {
          const s = this.read(bc, n.line).v;
          if (k < 0 || k >= s.length) throw new CppError(`الفهرس ${k} خارج حدود النص ${C(n.base.src)} الذي طوله ${s.length}: الفهارس من 0 إلى ${s.length - 1}`, n.line);
          return { str: bc, i: k };
        }
        const pv = bc ? this.read(bc, n.line, n.base.src) : yield* this.ev(n.base);
        if (pv.t === 'ptr') { const q = this.ptrMove(this.normPtr(pv), k, n.line); return { cell: this.derefPtr(q, n.line, n.src) }; }
        if (pv.t === 'array') { const c = pv.cell; if (k < 0 || k >= c.elems.length) throw new CppError(`الفهرس ${k} خارج حدود المصفوفة`, n.line); return { cell: c.elems[k] }; }
        throw new CppError(`${C(n.base.src)} ليس مصفوفة ولا مؤشرًا ولا نصًا، فلا يمكن استخدام ${C('[ ]')} معه`, n.line);
      }
      case 'member': {
        const o = yield* this.lv(n.obj);
        if (!o.cell || o.cell.type.k !== 'struct') {
          if (o.cell && o.cell.type.k === 'ptr') throw new CppError(`${C(n.obj.src)} مؤشر. للوصول إلى حقوله استخدم ${C('->')}: ${C(n.obj.src + '->' + n.name)}`, n.line);
          throw new CppError(`${C(n.obj.src)} ليس سجلًا، فلا يمكن استخدام ${C('.')} معه`, n.line);
        }
        const f = o.cell.fields.get(n.name);
        if (!f) throw new CppError(`السجل ${C(o.cell.type.name)} لا يحتوي على حقل اسمه ${C(n.name)}`, n.line);
        if (o.cell.freed) throw new CppError(`استخدام ذاكرة محذوفة: ${C(o.cell.label)}`, n.line);
        return { cell: f };
      }
      case 'arrow': {
        const pv = yield* this.ev(n.obj);
        if (pv.t === 'struct') throw new CppError(`${C(n.obj.src)} سجل وليس مؤشرًا. استخدم النقطة: ${C(n.obj.src + '.' + n.name)}`, n.line);
        const c = this.derefPtr(pv, n.line, n.obj.src);
        if (c.type.k !== 'struct') throw new CppError(`${C(n.obj.src)} لا يشير إلى سجل`, n.line);
        const f = c.fields.get(n.name);
        if (!f) throw new CppError(`السجل ${C(c.type.name)} لا يحتوي على حقل اسمه ${C(n.name)}`, n.line);
        return { cell: f };
      }
      case 'deref': {
        const pv = yield* this.ev(n.e);
        return { cell: this.derefPtr(pv, n.line, n.e.src) };
      }
    }
    throw new CppError('متوقع متغير', n.line);
  }
  getLv(lv, line, label) {
    if (lv.str) return CH(this.read(lv.str, line).v.charCodeAt(lv.i));
    return this.read(lv.cell, line, label);
  }
  setLv(lv, v, line, label) {
    if (lv.str) {
      const s = this.read(lv.str, line).v;
      const ch = this.convert(v, TP('char'), line);
      lv.str.val = S(s.slice(0, lv.i) + String.fromCharCode(ch.v) + s.slice(lv.i + 1));
      this.touch(lv.str);
      return ch;
    }
    return this.write(lv.cell, v, line, label);
  }

  // ---- expressions ----
  peekCell(n) {
    switch (n.k) {
      case 'var': { const e = this.entry(n.name, 0, true); return e ? (e.isRef ? e.cell : e) : null; }
      case 'index': {
        const b = this.peekCell(n.base); const k = this.peekVal(n.idx);
        if (!b || !k || k.t !== 'int') return null;
        if (b.type.k === 'arr') return b.elems[k.v] || null;
        if (b.type.k === 'ptr' && b.val && b.val.t === 'ptr') { try { const q = this.ptrMove(this.normPtr(b.val), k.v, 0); return q.cell; } catch (e) { return null; } }
        return null;
      }
      case 'member': { const o = this.peekCell(n.obj); return o && o.fields ? o.fields.get(n.name) || null : null; }
      case 'arrow': { const v = this.peekVal(n.obj); return v && v.t === 'ptr' && v.cell && v.cell.fields && !v.cell.freed ? v.cell.fields.get(n.name) || null : null; }
      case 'deref': { const v = this.peekVal(n.e); return v && v.t === 'ptr' && v.cell && !v.cell.freed ? v.cell : null; }
    }
    return null;
  }
  peekVal(n) {
    if (n.k === 'num') return n.isFloat ? D(n.v) : I(n.v);
    if (n.k === 'index' && n.base.k === 'var') {
      const b = this.peekCell(n.base);
      if (b && b.type.k === 'string' && b.val) { const k = this.peekVal(n.idx); if (k && k.t === 'int' && k.v >= 0 && k.v < b.val.v.length) return CH(b.val.v.charCodeAt(k.v)); return null; }
    }
    const c = this.peekCell(n);
    if (!c || c.freed) return null;
    if (c.type.k === 'arr') return { t: 'array', cell: c };
    if (c.type.k === 'struct') return null;
    return c.val;
  }
  sub(n) {
    const w = (s) => (n.paren ? `(${s})` : s);
    switch (n.k) {
      case 'var': case 'index': case 'member': case 'arrow': case 'deref': {
        const v = this.peekVal(n);
        if (v === null) return n.src;
        if (v === undefined) return w('؟');
        if (v.t === 'array') return n.src;
        return w(fmtShow(v));
      }
      case 'bin': return w(`${this.sub(n.l)} ${n.op} ${this.sub(n.r)}`);
      case 'un': return w(`${n.op}${this.sub(n.e)}`);
      case 'tern': return w(`${this.sub(n.c)} ? ${this.sub(n.a)} : ${this.sub(n.b)}`);
      case 'cast': return w(`(${tstr(n.type)})${this.sub(n.e)}`);
      case 'call': return w(`${n.name}(${n.args.map((a) => (a.k === 'var' ? a.name : this.sub(a))).join(', ')})`);
      default: return n.src;
    }
  }
  arith(op, a, b, line) {
    if (a.t === 'array') a = this.convert(a, TPtr(a.cell.type.of), line);
    if (b.t === 'array') b = this.convert(b, TPtr(b.cell.type.of), line);
    if (a.t === 'ptr' || b.t === 'ptr') return this.ptrArith(op, a, b, line);
    if (a.t === 'struct' || b.t === 'struct') throw new CppError(`لا يمكن تطبيق ${C(op)} على سجل كامل. استخدم حقوله`, line);
    if (a.t === 'string' || b.t === 'string') {
      const sv = (x) => (x.t === 'string' ? x.v : x.t === 'char' ? String.fromCharCode(x.v) : null);
      const x = sv(a), y = sv(b);
      if (op === '+' && x !== null && y !== null) return S(x + y);
      if (a.t === 'string' && b.t === 'string' && ['==', '!=', '<', '>', '<=', '>='].includes(op))
        return B({ '==': x === y, '!=': x !== y, '<': x < y, '>': x > y, '<=': x <= y, '>=': x >= y }[op]);
      throw new CppError(`لا يمكن تطبيق العامل ${C(op)} بين ${typeAr[a.t]} و ${typeAr[b.t]}`, line);
    }
    const isD = isFloatK(a.t) || isFloatK(b.t);
    const x = numv(a), y = numv(b);
    switch (op) {
      case '+': return isD ? D(x + y) : I(x + y);
      case '-': return isD ? D(x - y) : I(x - y);
      case '*': return isD ? D(x * y) : I(Math.imul(x, y));
      case '/':
        if (!isD) { if (y === 0) throw new CppError('قسمة عدد صحيح على صفر! هذا خطأ يوقف البرنامج', line); return I(Math.trunc(x / y)); }
        return D(x / y);
      case '%':
        if (isD) throw new CppError(`العامل ${C('%')} (باقي القسمة) يُستخدم مع الأعداد الصحيحة فقط، ولا يعمل مع double`, line);
        if (y === 0) throw new CppError('باقي القسمة على صفر غير معرَّف، وهو خطأ يوقف البرنامج', line);
        return I(x % y);
      case '<': return B(x < y);
      case '>': return B(x > y);
      case '<=': return B(x <= y);
      case '>=': return B(x >= y);
      case '==': return B(x === y);
      case '!=': return B(x !== y);
    }
    throw new CppError(`عامل غير مدعوم ${C(op)}`, line);
  }
  ptrArith(op, a, b, line) {
    const isNullLike = (v) => v.t === 'int' && v.v === 0;
    if (op === '==' || op === '!=') {
      const pa = a.t === 'ptr' ? this.normPtr(a) : isNullLike(a) ? NULLP() : null;
      const pb = b.t === 'ptr' ? this.normPtr(b) : isNullLike(b) ? NULLP() : null;
      if (!pa || !pb) throw new CppError(`لا يمكن مقارنة مؤشر بـ ${typeAr[(a.t === 'ptr' ? b : a).t]}`, line);
      const same = pa.cell === pb.cell && pa.arr === pb.arr && (pa.arr ? pa.idx === pb.idx : true);
      return B(op === '==' ? same : !same);
    }
    if (['<', '>', '<=', '>='].includes(op) && a.t === 'ptr' && b.t === 'ptr') {
      const pa = this.normPtr(a), pb = this.normPtr(b);
      if (!pa.arr || pa.arr !== pb.arr) throw new CppError('مقارنة المؤشرات بـ < و > مسموحة داخل المصفوفة نفسها فقط', line);
      return B({ '<': pa.idx < pb.idx, '>': pa.idx > pb.idx, '<=': pa.idx <= pb.idx, '>=': pa.idx >= pb.idx }[op]);
    }
    if (op === '+' || op === '-') {
      if (a.t === 'ptr' && b.t === 'ptr' && op === '-') {
        const pa = this.normPtr(a), pb = this.normPtr(b);
        if (!pa.arr || pa.arr !== pb.arr) throw new CppError('طرح مؤشرين مسموح داخل المصفوفة نفسها فقط', line);
        return I(pa.idx - pb.idx);
      }
      const p = a.t === 'ptr' ? a : b, k = a.t === 'ptr' ? b : a;
      if (!isNumT(k.t) || isFloatK(k.t)) throw new CppError('يمكن جمع عدد صحيح فقط مع المؤشر', line);
      if (op === '-' && b.t === 'ptr') throw new CppError('لا يمكن طرح مؤشر من عدد', line);
      return this.ptrMove(this.normPtr(p), op === '+' ? numv(k) : -numv(k), line);
    }
    throw new CppError(`لا يمكن تطبيق ${C(op)} على المؤشرات`, line);
  }
  truthy(v, line) {
    if (v.t === 'ptr') return !!(v.cell || v.arr);
    if (v.t === 'string' || v.t === 'array' || v.t === 'struct') throw new CppError(`لا يمكن استخدام ${typeAr[v.t]} كشرط`, line);
    return numv(v) !== 0;
  }
  *ev(n) {
    switch (n.k) {
      case 'num': return n.isFloat ? D(n.v) : I(n.v);
      case 'str': return S(n.v);
      case 'chr': return CH(n.v);
      case 'bool': return B(n.v);
      case 'null': return NULLP();
      case 'endl': throw new CppError(`${C('endl')} تُستخدم مع cout فقط`, n.line);
      case 'list': throw new CppError(`القائمة ${C('{ }')} تُستخدم عند التعريف فقط`, n.line);
      case 'cinobj': throw new CppError(`${C('cin')} لا تُستخدم هنا`, n.line);
      case 'var': case 'index': case 'member': case 'arrow': case 'deref': { const lv = yield* this.lv(n); return this.getLv(lv, n.line, n.src); }
      case 'addr': {
        const lv = yield* this.lv(n.e);
        if (lv.str) throw new CppError('لا يمكن أخذ عنوان حرف داخل string في المختبر', n.line);
        const c = lv.cell;
        if (c.type.k === 'arr') return { t: 'ptr', to: c.type, cell: c, arr: null, idx: 0 };
        return this.normPtr({ t: 'ptr', to: c.type, cell: c, arr: null, idx: 0 });
      }
      case 'new': return this.newObj(n, yield* (n.n ? this.ev(n.n) : (function* () { return null; })()), n.init ? yield* (n.init.k === 'list' ? this.evList(n.init) : this.ev(n.init)) : null);
      case 'bin': {
        if (n.op === '&&') { const l = this.truthy(yield* this.ev(n.l), n.line); return l ? B(this.truthy(yield* this.ev(n.r), n.line)) : B(false); }
        if (n.op === '||') { const l = this.truthy(yield* this.ev(n.l), n.line); return l ? B(true) : B(this.truthy(yield* this.ev(n.r), n.line)); }
        const a = yield* this.ev(n.l), b = yield* this.ev(n.r);
        return this.arith(n.op, a, b, n.line);
      }
      case 'un': {
        const v = yield* this.ev(n.e);
        if (n.op === '!') return B(!this.truthy(v, n.line));
        if (!isNumT(v.t)) throw new CppError(`لا يمكن تطبيق ${C(n.op)} على ${typeAr[v.t]}`, n.line);
        const x = numv(v);
        return n.op === '-' ? (isFloatK(v.t) ? D(-x) : I(-x)) : (isFloatK(v.t) ? D(x) : I(x));
      }
      case 'pre': case 'post': {
        const lv = yield* this.lv(n.target);
        const old = this.getLv(lv, n.line, n.target.src);
        if (!isNumT(old.t) && old.t !== 'ptr') throw new CppError(`لا يمكن تطبيق ${C(n.op)} على ${typeAr[old.t]}`, n.line);
        const now = this.setLv(lv, this.arith(n.op === '++' ? '+' : '-', old, I(1), n.line), n.line, n.target.src);
        return n.k === 'pre' ? now : old;
      }
      case 'assign': {
        const lv = yield* this.lv(n.target);
        let v;
        if (n.e.k === 'list') {
          if (!lv.cell || lv.cell.type.k !== 'struct') throw new CppError(`القائمة ${C('{ }')} تُسند إلى سجل فقط`, n.line);
          v = yield* this.structFromList(lv.cell.type, n.e, n.line);
        } else v = yield* this.ev(n.e);
        if (n.op !== '=') v = this.arith(n.op[0], this.getLv(lv, n.line, n.target.src), v, n.line);
        return this.setLv(lv, v, n.line, n.target.src);
      }
      case 'tern': return this.truthy(yield* this.ev(n.c), n.line) ? yield* this.ev(n.a) : yield* this.ev(n.b);
      case 'cast': return this.convert(yield* this.ev(n.e), n.type, n.line);
      case 'call': return yield* this.call(n);
      case 'mcall': return yield* this.method(n);
    }
    throw new CppError('تعبير غير مدعوم', n.line);
  }
  *evList(l) { const out = []; for (const it of l.items) out.push(it.k === 'list' ? yield* this.evList(it) : yield* this.ev(it)); return out; }
  newObj(n, count, init) {
    const id = ++this.heapCount;
    let cell;
    if (n.n) {
      if (count.t !== 'int' || count.v <= 0) throw new CppError('حجم المصفوفة في new يجب أن يكون عددًا صحيحًا موجبًا', n.line);
      if (count.v > 400) throw new CppError('المختبر يدعم مصفوفات حتى 400 عنصر', n.line);
      cell = this.makeCell(TArr(n.type, count.v), '#' + id, { heap: true, id });
      if (n.zero) this.zero(cell);
      this.heap.push(cell);
      this.notes.push(`${C('new')} حجزت في الذاكرة الديناميكية (heap) مصفوفة ${C('#' + id)} من ${count.v} عناصر من النوع ${C(tstr(n.type))}.`);
      return { t: 'ptr', to: n.type, arr: cell, idx: 0, cell: cell.elems[0] };
    }
    cell = this.makeCell(n.type, '#' + id, { heap: true, id });
    if (n.zero) this.zero(cell);
    if (init !== null && init !== undefined) {
      if (Array.isArray(init)) {
        if (n.type.k !== 'struct') throw new CppError('القائمة { } مع new تُستخدم مع السجلات', n.line);
        const def = this.structs.get(n.type.name);
        init.forEach((v, i) => { if (def.fields[i]) this.write(cell.fields.get(def.fields[i].name), v, n.line); });
      } else this.write(cell, init, n.line);
    }
    this.heap.push(cell);
    this.notes.push(`${C('new')} حجزت في الذاكرة الديناميكية (heap) ${n.type.k === 'struct' ? 'عقدة' : 'مكانًا'} جديدًا ${C('#' + id)} من النوع ${C(tstr(n.type))}` + (n.type.k === 'struct' && !n.zero ? '، وحقولها لم تُعطَ قيمًا بعد.' : '.'));
    return { t: 'ptr', to: n.type, cell, arr: null, idx: 0 };
  }
  *structFromList(type, list, line) {
    const def = this.structs.get(type.name);
    if (list.items.length > def.fields.length) throw new CppError(`عدد القيم أكبر من عدد حقول السجل ${C(type.name)}`, line);
    const f = new Map();
    for (let i = 0; i < def.fields.length; i++) {
      const fd = def.fields[i], it = list.items[i];
      if (!it) { f.set(fd.name, undefined); continue; }
      if (fd.type.k === 'struct') f.set(fd.name, it.k === 'list' ? yield* this.structFromList(fd.type, it, line) : yield* this.ev(it));
      else if (fd.type.k === 'arr') {
        if (it.k === 'str' && fd.type.of.k === 'char') { const s = it.v; f.set(fd.name, { t: 'arrcopy', vals: Array.from({ length: fd.type.n }, (_, k) => CH(k < s.length ? s.charCodeAt(k) : 0)) }); }
        else if (it.k === 'list') { const vals = []; for (let k = 0; k < fd.type.n; k++) vals.push(it.items[k] ? this.convert(yield* this.ev(it.items[k]), fd.type.of, line) : this.convert(I(0), fd.type.of, line)); f.set(fd.name, { t: 'arrcopy', vals }); }
        else throw new CppError(`الحقل ${C(fd.name)} مصفوفة، فقيمته تُكتب بين ${C('{ }')}`, line);
      } else f.set(fd.name, this.convert(yield* this.ev(it), fd.type, line, fd.name));
    }
    return { t: 'struct', name: type.name, f };
  }

  // ---- string methods, cin.ignore ----
  *method(n) {
    if (n.obj.k === 'cinobj') {
      if (n.name === 'ignore') {
        const lim = n.args.length ? numv(yield* this.ev(n.args[0])) : 1;
        const nl = this.inbuf.indexOf('\n');
        const cut = n.args.length > 1 ? (nl < 0 ? this.inbuf.length : Math.min(nl + 1, lim)) : Math.min(1, this.inbuf.length);
        this.inbuf = this.inbuf.slice(n.args.length > 1 ? cut : Math.min(lim, this.inbuf.length));
        this.notes.push(`${C('cin.ignore')} تتجاهل ما تبقّى في الإدخال (مثل نهاية السطر) قبل getline.`);
        return { t: 'void' };
      }
      throw new CppError(`${C('cin.' + n.name)} غير مدعومة في المختبر`, n.line);
    }
    if (n.arrow) throw new CppError(`الدوال داخل السجلات ليست ضمن المختبر حاليًا`, n.line);
    let lv = null, v;
    if (['var', 'index', 'member', 'arrow', 'deref'].includes(n.obj.k)) { lv = yield* this.lv(n.obj); v = this.getLv(lv, n.line, n.obj.src); }
    else v = yield* this.ev(n.obj);
    if (v.t !== 'string') throw new CppError(`${C('.' + n.name + '()')} تُستخدم مع النصوص string`, n.line);
    const s = v.v;
    const args = []; for (const a of n.args) args.push(yield* this.ev(a));
    const str = (x) => (x.t === 'string' ? x.v : x.t === 'char' ? String.fromCharCode(x.v) : x.t === 'array' ? charsOf(x.cell) : null);
    const mut = (ns) => { if (!lv) throw new CppError('هذه الدالة تعدّل النص، فاستخدمها مع متغير', n.line); this.setLv(lv, S(ns), n.line, n.obj.src); return { t: 'void' }; };
    const need = (a, b) => { if (args.length < a || args.length > b) throw new CppError(`عدد القيم في ${C(n.name + '()')} غير صحيح`, n.line); };
    switch (n.name) {
      case 'length': case 'size': need(0, 0); return I(s.length);
      case 'empty': need(0, 0); return B(s.length === 0);
      case 'at': {
        need(1, 1); const k = numv(args[0]);
        if (k < 0 || k >= s.length) throw new CppError(`${C('at(' + k + ')')} خارج حدود النص الذي طوله ${s.length}`, n.line);
        return CH(s.charCodeAt(k));
      }
      case 'substr': {
        need(1, 2); const a = numv(args[0]);
        if (a < 0 || a > s.length) throw new CppError(`بداية substr (${a}) خارج حدود النص الذي طوله ${s.length}`, n.line);
        return S(args.length > 1 ? s.substr(a, numv(args[1])) : s.slice(a));
      }
      case 'find': {
        need(1, 2); const x = str(args[0]);
        if (x === null) throw new CppError('find تبحث عن نص أو حرف', n.line);
        return I(s.indexOf(x, args.length > 1 ? numv(args[1]) : 0));
      }
      case 'push_back': need(1, 1); return mut(s + String.fromCharCode(numv(args[0])));
      case 'append': need(1, 1); return mut(s + str(args[0]));
      case 'clear': need(0, 0); return mut('');
      case 'insert': need(2, 2); return mut(s.slice(0, numv(args[0])) + str(args[1]) + s.slice(numv(args[0])));
      case 'erase': need(1, 2); { const a = numv(args[0]); return mut(s.slice(0, a) + (args.length > 1 ? s.slice(a + numv(args[1])) : '')); }
    }
    throw new CppError(`الدالة ${C('.' + n.name + '()')} غير مدعومة في المختبر`, n.line);
  }

  // ---- function calls ----
  *call(n) {
    if (n.name === 'getline') return yield* this.getline(n);
    const user = this.prog.funcs.get(n.name);
    if (!user) return yield* this.builtin(n);
    const args = [];
    for (const a of n.args) {
      if (['var', 'index', 'member', 'arrow', 'deref'].includes(a.k)) {
        const lv = yield* this.lv(a);
        const v = this.getLv(lv, a.line, a.src);
        args.push({ v, lv, node: a });
      } else args.push({ v: yield* this.ev(a), lv: null, node: a });
    }
    const f = this.resolve(user, args, n);
    const binds = [];
    const label = `${f.name}(${f.params.map((p) => p.name).join(', ')})`;
    const callerLine = n.line;
    this.pushFrame(f, label, callerLine);
    const scope = this.top.scopes[0];
    try {
      for (let i = 0; i < f.params.length; i++) {
        const p = f.params[i], a = args[i];
        let v, lv = null;
        if (!a) v = yield* this.ev(p.def); else { v = a.v; lv = a.lv; }
        if (p.type.k === 'arr' && v.t === 'array') {
          scope.set(p.name, { isRef: true, arrParam: true, name: p.name, cell: v.cell });
          binds.push(`${C(p.name)} هي المصفوفة ${C(a.node.src)} نفسها (المصفوفة تُمرَّر بالمرجع دائمًا)`);
        } else if (p.ref) {
          if (!lv || lv.str) throw new CppError(`المعامل ${C(p.name)} بالمرجع ${C('&')} يجب أن يستقبل متغيرًا`, n.line);
          scope.set(p.name, { isRef: true, name: p.name, cell: lv.cell });
          binds.push(`${C(p.name)} مرجع إلى ${C(a.node.src)}، أي اسم آخر للمتغير نفسه`);
        } else {
          const ptype = p.type.k === 'arr' ? TPtr(p.type.of) : p.type;
          const cell = this.makeCell(ptype, p.name, { isConst: p.isConst && ptype.k !== 'ptr' });
          if (ptype.k === 'struct') this.writeRaw(cell, this.convert(v, ptype, callerLine, p.name), callerLine);
          else cell.val = this.convert(v, ptype, callerLine, p.name);
          scope.set(p.name, cell);
          this.touch(cell);
          const shown = ptype.k === 'struct' ? 'نسخة من السجل' : `<b>${esc(fmtShow(this.read(cell, callerLine)))}</b> (${!a ? 'القيمة الافتراضية' : ptype.k === 'ptr' ? 'نسخة من العنوان' : 'نسخة'})`;
          binds.push(`${C(p.name)} = ${shown}`);
        }
      }
      yield this.step(f.line, `استدعاء الدالة ${C(f.name)} من السطر ${callerLine}: ` + (binds.length ? binds.join('، و') + '.' : 'دون معاملات.'), { call: true });
      try {
        yield* this.block(f.body.body, false);
      } catch (e) {
        if (e instanceof ReturnSig) {
          if (f.ret.k === 'void') return { t: 'void' };
          return this.convert(e.val, f.ret, e.line);
        }
        throw e;
      }
      if (f.ret.k !== 'void' && f.name !== 'main') {
        this.pendingWarn = `الدالة ${C(f.name)} من النوع ${tstr(f.ret)} انتهت دون ${C('return')}، فالقيمة الراجعة عشوائية`;
        yield this.step(f.body.endLine, `انتهت الدالة ${C(f.name)} دون return.`);
        return f.ret.k === 'ptr' ? NULLP(f.ret.to) : garbageOf(f.ret.k);
      }
      yield this.step(f.body.endLine, `انتهت الدالة ${C(f.name)}، ويعود التنفيذ إلى السطر ${callerLine}.`);
      return { t: 'void' };
    } finally {
      this.frames.pop();
    }
  }
  resolve(list, args, n) {
    const argT = (a) => (a.v.t === 'array' ? a.v.cell.type : a.v.t === 'ptr' ? TPtr(a.v.to || TP('?')) : a.v.t === 'struct' ? TSt(a.v.name) : TP(a.v.t));
    const score = (f) => {
      const ps = f.params;
      if (args.length > ps.length) return -1;
      if (ps.slice(args.length).some((p) => !p.def)) return -1;
      let s = 0;
      for (let i = 0; i < args.length; i++) {
        const p = ps[i], a = args[i], v = a.v, at = argT(a);
        if (p.ref) {
          if (!a.lv || a.lv.str) return -1;
          if (!sameT(a.lv.cell.type, p.type) && !(p.type.k === 'ptr' && at.k === 'ptr' && (!at.to || at.to.k === '?' || sameT(p.type.to, at.to)))) return -1;
          s += 3; continue;
        }
        if (p.type.k === 'arr') {
          if (v.t === 'array' && sameT(elemBase(v.cell.type), elemBase(p.type)) && (v.cell.type.of.k === 'arr') === (p.type.of.k === 'arr')) { s += 3; continue; }
          if (v.t === 'ptr' && v.to && sameT(v.to, p.type.of)) { s += 2; continue; }
          return -1;
        }
        if (p.type.k === 'ptr') {
          if (v.t === 'ptr') { if (!v.to || v.to.k === '?' || (!v.cell && !v.arr) || sameT(v.to, p.type.to)) { s += 3; continue; } return -1; }
          if (v.t === 'array' && sameT(v.cell.type.of, p.type.to)) { s += 2; continue; }
          if (v.t === 'int' && v.v === 0) { s += 1; continue; }
          return -1;
        }
        if (p.type.k === 'struct') { if (v.t === 'struct' && v.name === p.type.name) { s += 3; continue; } return -1; }
        if (v.t === 'array' || v.t === 'ptr' || v.t === 'struct') {
          if (p.type.k === 'string' && v.t === 'array' && v.cell.type.of.k === 'char') { s += 1; continue; }
          return -1;
        }
        if (v.t === p.type.k || (isFloatK(v.t) && isFloatK(p.type.k))) s += 3;
        else if (p.type.k === 'string' || v.t === 'string') { if (!(p.type.k === 'string' && v.t === 'char')) return -1; s += 1; }
        else s += 1;
      }
      return s;
    };
    const scored = list.map((f) => ({ f, s: score(f) })).filter((x) => x.s >= 0).sort((a, b) => b.s - a.s);
    if (!scored.length) {
      const f = list[0];
      const need = f.params.filter((p) => !p.def).length;
      if (list.length === 1 && (args.length < need || args.length > f.params.length))
        throw new CppError(`الدالة ${C(f.name)} تحتاج ${need === f.params.length ? need : `من ${need} إلى ${f.params.length}`} ${f.params.length === 1 ? 'قيمة' : 'قيم'}، وأُرسل إليها ${args.length}`, n.line);
      const refIdx = f.params.findIndex((p, i) => p.ref && args[i] && !args[i].lv);
      if (list.length === 1 && refIdx >= 0) throw new CppError(`المعامل ${C(f.params[refIdx].name)} بالمرجع ${C('&')} يجب أن يستقبل متغيرًا، و ${C(args[refIdx].node.src)} ليس متغيرًا`, n.line);
      if (list.length === 1) {
        const bad = f.params.findIndex((p, i) => args[i] && score({ params: [p] }) === -1 && i === 0) ;
        const k = f.params.findIndex((p, i) => args[i] && (() => { const save = args; return false; })());
        void bad; void k;
        const idx = f.params.findIndex((p, i) => args[i] && (p.type.k === 'arr' ? args[i].v.t !== 'array' && args[i].v.t !== 'ptr' : args[i].v.t === 'array' && p.type.k !== 'ptr' && p.type.k !== 'string'));
        if (idx >= 0) throw new CppError(f.params[idx].type.k === 'arr' ? `المعامل ${C(f.params[idx].name)} مصفوفة، فيجب إرسال اسم مصفوفة دون أقواس` : `المعامل ${C(f.params[idx].name)} ليس مصفوفة، ولا يمكن إرسال مصفوفة كاملة إليه`, n.line);
      }
      throw new CppError(`لا توجد دالة ${C(n.name)} تناسب القيم المرسلة ${C(n.src)}`, n.line);
    }
    if (scored.length > 1 && scored[0].s === scored[1].s) throw new CppError(`الاستدعاء ${C(n.src)} غامض: أكثر من دالة ${C(n.name)} تناسبه بالدرجة نفسها`, n.line);
    return scored[0].f;
  }
  *getline(n) {
    if (n.args.length < 2 || n.args[0].k !== 'cinobj') throw new CppError(`الصيغة الصحيحة: ${C('getline(cin, s);')}`, n.line);
    const tg = n.args[1];
    const lv = yield* this.lv(tg);
    const isChars = lv.cell && lv.cell.type.k === 'arr' && lv.cell.type.of.k === 'char';
    if (!isChars && (!lv.cell || lv.cell.type.k !== 'string')) throw new CppError('getline تقرأ سطرًا كاملًا في متغير من النوع string', n.line);
    while (!this.inbuf.length) {
      yield { type: 'input', line: n.line, msg: `${C('getline')} تنتظر أن يُدخل المستخدم سطرًا كاملًا في ${C(tg.src)}. اكتب السطر ثم اضغط Enter.`, varName: tg.src };
      if (this.eof && !this.inbuf.length) throw new CppError(`البرنامج طلب سطرًا لـ ${C(tg.src)} ولم يجد إدخالًا`, n.line);
    }
    const nl = this.inbuf.indexOf('\n');
    const line = nl < 0 ? this.inbuf : this.inbuf.slice(0, nl);
    this.inbuf = nl < 0 ? '' : this.inbuf.slice(nl + 1);
    if (line === '' && this.lastWasToken) this.pendingWarn = `${C('getline')} قرأت سطرًا فارغًا، لأن ${C('cin >>')} السابقة تركت نهاية السطر في الإدخال. اكتب ${C('cin.ignore();')} قبل getline`;
    this.lastWasToken = false;
    if (isChars) this.writeChars(lv.cell, line, n.line); else this.setLv(lv, S(line), n.line, tg.src);
    this.inputLog.push(line);
    this.notes.push(`قرأت ${C('getline')} السطر <b>${esc(line || '(فارغ)')}</b> كاملًا بمسافاته، وخزّنته في ${C(tg.src)}.`);
    return { t: 'void' };
  }
  *builtin(n) {
    const args = [];
    for (const a of n.args) args.push(yield* this.ev(a));
    const need = (k) => { if (args.length !== k) throw new CppError(`الدالة ${C(n.name)} تحتاج ${k} ${k === 1 ? 'قيمة' : 'قيم'}`, n.line); };
    const x = args[0] && isNumT(args[0].t) ? numv(args[0]) : 0;
    const cstr = (v, i) => {
      if (v.t === 'string') return v.v;
      if (v.t === 'array' && v.cell.type.of.k === 'char') return charsOf(v.cell);
      throw new CppError(`المعامل ${i + 1} في ${C(n.name)} يجب أن يكون مصفوفة حروف char[] أو نصًا`, n.line);
    };
    const chArg = () => { need(1); if (!isNumT(args[0].t)) throw new CppError(`${C(n.name)} تستقبل حرفًا`, n.line); return String.fromCharCode(numv(args[0])); };
    switch (n.name) {
      case 'pow': need(2); return D(Math.pow(x, numv(args[1])));
      case 'sqrt': need(1); if (x < 0) this.pendingWarn = 'الجذر التربيعي لعدد سالب غير معرَّف (nan)'; return D(Math.sqrt(x));
      case 'abs': need(1); return isFloatK(args[0].t) ? D(Math.abs(x)) : I(Math.abs(x));
      case 'fabs': need(1); return D(Math.abs(x));
      case 'ceil': need(1); return D(Math.ceil(x));
      case 'floor': need(1); return D(Math.floor(x));
      case 'round': need(1); return D(Math.round(x));
      case 'max': case 'min': {
        need(2); const y = numv(args[1]);
        const r = n.name === 'max' ? Math.max(x, y) : Math.min(x, y);
        return isFloatK(args[0].t) || isFloatK(args[1].t) ? D(r) : I(r);
      }
      case 'strlen': need(1); return I(cstr(args[0], 0).length);
      case 'strcmp': { need(2); const a = cstr(args[0], 0), b = cstr(args[1], 1); return I(a === b ? 0 : a < b ? -1 : 1); }
      case 'strcpy': case 'strcat': {
        need(2);
        if (args[0].t !== 'array' || args[0].cell.type.of.k !== 'char') throw new CppError(`المعامل الأول في ${C(n.name)} يجب أن يكون مصفوفة حروف`, n.line);
        const s = (n.name === 'strcat' ? charsOf(args[0].cell) : '') + cstr(args[1], 1);
        this.writeChars(args[0].cell, s, n.line);
        return args[0];
      }
      case 'toupper': return I(chArg().toUpperCase().charCodeAt(0));
      case 'tolower': return I(chArg().toLowerCase().charCodeAt(0));
      case 'isdigit': return B(/[0-9]/.test(chArg()));
      case 'isalpha': return B(/[A-Za-z]/.test(chArg()));
      case 'isupper': return B(/[A-Z]/.test(chArg()));
      case 'islower': return B(/[a-z]/.test(chArg()));
      case 'isspace': return B(/\s/.test(chArg()));
      case 'to_string': need(1); return S(isFloatK(args[0].t) ? args[0].v.toFixed(6) : String(numv(args[0])));
    }
    throw new CppError(`الدالة ${C(n.name)} غير معرَّفة. عرّفها قبل main، أو اكتب نموذجها الأولي (prototype) قبل main`, n.line);
  }

  // ---- step events ----
  step(line, msg, extra) {
    if (++this.count > MAX_STEPS) throw new CppError(`توقف البرنامج بعد ${MAX_STEPS} خطوة، ويبدو أن هناك حلقة لا تنتهي. تأكد من تحديث العدّاد داخل الحلقة ومن شرطها`, line);
    if (this.notes.length) { msg += ' ' + this.notes.join(' '); this.notes = []; }
    const ev = Object.assign({ type: 'step', line, msg, depth: this.frames.length, fn: this.frames.length ? this.top.fn.name : null }, extra || {});
    const w = [];
    if (this.pendingWarn) { w.push(this.pendingWarn); this.pendingWarn = null; }
    if (this.warnByLine.has(line) && !this.shownWarn.has(line)) { this.shownWarn.add(line); w.push(...this.warnByLine.get(line)); }
    if (w.length) ev.warn = w;
    this.lastChanged = this.changed;
    this.changed = new Set();
    return ev;
  }
  condMsg(n, ok, before, prefix) {
    const t = n.src;
    return `${prefix || 'الشرط'} ${C(t)}` + (before !== t ? ` يصبح ${C(before)}` : '') +
      `، والنتيجة: <b class="${ok ? 'yes' : 'no'}">${ok ? 'صحيح' : 'خطأ'}</b>`;
  }
  exprMsg(n, val, rhsSub, oldSub) {
    if (n.k === 'assign') {
      const tg = n.target.src;
      if (n.op === '=') {
        const r = n.e;
        const lit = ['num', 'str', 'chr', 'bool', 'null'].includes(r.k);
        return lit ? `إسناد: وضع القيمة <b>${esc(fmtShow(val))}</b> في ${C(tg)}.`
          : `إسناد: يُحسب الطرف الأيمن ${C(r.src)}` + (rhsSub && rhsSub !== r.src && rhsSub !== fmtShow(val) ? ` ← ${C(rhsSub)}` : '') +
            ` = <b>${esc(fmtShow(val))}</b>، ثم يُخزَّن الناتج في ${C(tg)}.`;
      }
      const rhs = n.e.paren || ['num', 'var', 'index', 'chr', 'member', 'arrow'].includes(n.e.k) ? n.e.src : `(${n.e.src})`;
      return `${C(n.src)} تعني ${C(`${tg} = ${tg} ${n.op[0]} ${rhs}`)} ← ${C(`${oldSub} ${n.op[0]} ${rhsSub}`)} = <b>${esc(fmtShow(val))}</b>.`;
    }
    if (n.k === 'post' || n.k === 'pre') {
      const nv = this.peekVal(n.target);
      return `${C(n.src)} ${n.op === '++' ? 'تزيد' : 'تنقص'} قيمة ${C(n.target.src)} بمقدار 1، فتصبح <b>${esc(fmtShow(nv || val))}</b>.`;
    }
    if (n.k === 'call') return `انتهى تنفيذ ${C(n.src)}.`;
    if (n.k === 'mcall') return `تنفيذ ${C(n.src)}.`;
    return `تنفيذ ${C(n.src)}.`;
  }
  loopRow(L, ok, before) {
    const vals = {};
    for (const nm of new Set([...L.tracked, ...this.visibleNames()])) {
      const e = this.entry(nm, 0, true);
      if (!e) continue;
      const c = e.isRef ? e.cell : e;
      if (c.type.k === 'arr') vals[nm] = fmtShow({ t: 'array', cell: c });
      else if (c.type.k === 'struct') vals[nm] = '{…}';
      else vals[nm] = c.val === undefined ? '؟' : fmtShow(c.val);
    }
    L.rows.push({ n: L.rows.length + 1, before, ok, vals });
  }
  visibleNames() { const out = []; for (const sc of this.top.scopes) for (const k of sc.keys()) out.push(k); return out; }
  newLoop(kind, line, cond) {
    const L = { kind, line, fn: this.top.fn.name, cond: cond ? cond.src : 'true', rows: [], tracked: new Set() };
    if (cond) for (const nm of varsIn(cond)) L.tracked.add(nm);
    this.loops.push(L); this.top.active.push(L);
    return L;
  }

  // ---- program ----
  *run() {
    const P = this.prog;
    try {
      if (P.snippet) {
        this.pushFrame({ name: 'main', ret: TP('int'), params: [] }, 'main', null);
        yield* this.block(P.snippet.body, false);
      } else {
        this.pushFrame({ name: 'global', ret: TP('void'), params: [] }, 'global', null);
        for (const d of P.globals) yield* this.declare(d, this.globals, true);
        this.frames.pop();
        const main = P.funcs.get('main')[0];
        this.pushFrame(main, 'main', null);
        yield this.step(main.line, `يبدأ تنفيذ البرنامج من الدالة ${C('main')}.`);
        yield* this.block(main.body.body, false);
      }
    } catch (e) {
      if (!(e instanceof ReturnSig)) throw e;
    }
    this.done = true;
    const leak = this.heap.filter((h) => !h.freed).length;
    yield { type: 'step', line: null, msg: 'انتهى تنفيذ البرنامج.' + (leak ? ` بقي في الذاكرة الديناميكية ${leak} ${leak === 1 ? 'مكان' : 'أماكن'} لم تُحذف بـ ${C('delete')} (memory leak).` : ''), end: true };
  }
  *block(stmts, fresh) {
    if (fresh) this.scopes.push(new Map());
    try { for (const s of stmts) yield* this.exec(s); }
    finally { if (fresh) this.scopes.pop(); }
  }
  *readToken(type, label, stmtLine) {
    for (;;) {
      this.inbuf = this.inbuf.replace(/^\s+/, '');
      if (this.inbuf.length) break;
      yield { type: 'input', line: stmtLine, msg: `${C('cin')} تنتظر أن يُدخل المستخدم قيمة لـ ${C(label)} من النوع ${type}. اكتب القيمة في الكونسول ثم اضغط Enter.`, varName: label };
      if (this.eof) throw new CppError(`البرنامج طلب إدخال قيمة لـ ${C(label)} ولم يجد قيمة`, stmtLine);
    }
    this.lastWasToken = true;
    let tok, m;
    if (type === 'char') { tok = this.inbuf[0]; this.inbuf = this.inbuf.slice(1); return { val: CH(tok.charCodeAt(0)), tok }; }
    if (type === 'string') { m = this.inbuf.match(/^\S+/); tok = m[0]; this.inbuf = this.inbuf.slice(tok.length); return { val: S(tok), tok }; }
    const re = isFloatK(type) ? /^[-+]?(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?/ : /^[-+]?\d+/;
    m = this.inbuf.match(re);
    if (!m) { const bad = this.inbuf.match(/^\S+/)[0]; throw new CppError(`القيمة المدخلة ${C(bad)} لا تناسب ${C(label)} من النوع ${type}`, stmtLine); }
    tok = m[0]; this.inbuf = this.inbuf.slice(tok.length);
    if (type === 'bool') return { val: B(Number(tok) !== 0), tok };
    return { val: isFloatK(type) ? D(Number(tok)) : I(Number(tok)), tok };
  }
  *declare(s, scope, isGlobal) {
    for (const d of s.decls) {
      if (scope.has(d.name)) throw new CppError(`المتغير ${C(d.name)} معرَّف مسبقًا في النطاق نفسه، ولا يجوز تعريفه مرتين`, d.line);
      if (d.ref) {
        const lv = yield* this.lv(d.init);
        if (lv.str) throw new CppError('لا يمكن ربط مرجع بحرف داخل نص', d.line);
        if (!sameT(lv.cell.type, d.type)) throw new CppError(`نوع المرجع ${C(d.name)} يجب أن يطابق نوع ${C(d.init.src)}`, d.line);
        scope.set(d.name, { isRef: true, name: d.name, cell: lv.cell });
        yield this.step(d.line, `تعريف المرجع ${C(d.name)}: اسم آخر للمتغير ${C(d.init.src)} نفسه، وأي تغيير على أحدهما يظهر في الآخر.`);
        continue;
      }
      let type = d.type;
      if (d.dims.length) {
        const dims = [];
        for (let i = 0; i < d.dims.length; i++) {
          if (d.dims[i] === null) {
            if (d.init.k === 'str') { dims.push(d.init.v.length + 1); continue; }
            dims.push(d.init.items.length); continue;
          }
          const v = yield* this.ev(d.dims[i]);
          if (v.t !== 'int' || v.v <= 0) throw new CppError('حجم المصفوفة يجب أن يكون عددًا صحيحًا موجبًا', d.line);
          dims.push(v.v);
        }
        if (dims.reduce((a, b) => a * b, 1) > 400) throw new CppError('المختبر يدعم مصفوفات حتى 400 عنصر', d.line);
        for (let i = dims.length - 1; i >= 0; i--) type = TArr(type, dims[i]);
      }
      const cell = this.makeCell(type, d.name, { isConst: s.isConst, global: isGlobal });
      if (isGlobal && !d.init) this.zero(cell);
      let msg;
      const T = tstr(d.dims.length ? elemBase(type) : type);
      const kindAr = type.k === 'arr' ? (type.of.k === 'char' ? 'مصفوفة الحروف' : 'المصفوفة') : type.k === 'ptr' ? 'المؤشر' : type.k === 'struct' ? 'السجل' : isGlobal ? 'المتغير العام' : s.isConst ? 'الثابت' : 'المتغير';
      const head = `تعريف ${kindAr}${isGlobal && type.k !== 'int' ? ' العام' : ''} ${C(d.name)} من النوع ${C(type.k === 'arr' ? tstr(type) : T)}`;
      if (type.k === 'arr') {
        const dims = []; for (let t = type; t.k === 'arr'; t = t.of) dims.push(t.n);
        const size = dims.length === 1 ? `${dims[0]} عناصر` : `${dims[0]} صفوف و ${dims[1]} أعمدة`;
        if (d.init) {
          if (d.init.k === 'str') {
            if (type.of.k !== 'char') throw new CppError('النص بين علامتي التنصيص يُخزَّن في مصفوفة حروف char[]', d.line);
            this.writeChars(cell, d.init.v, d.line);
            for (let i = d.init.v.length + 1; i < cell.elems.length; i++) cell.elems[i].val = CH(0);
            msg = `${head} بحجم ${dims[0]} وتخزين النص ${C('"' + d.init.v + '"')} فيها حرفًا حرفًا، وبعده الحرف ${C("'\\0'")} الذي يحدد نهاية النص.`;
          } else {
            yield* this.fillArray(cell, d.init, d.line);
            msg = `${head} بحجم ${size}` + (dims.length === 1 ? ` (الفهارس من 0 إلى ${dims[0] - 1})` : '') + ` وإعطاء عناصرها القيم ${C(d.init.src)}.`;
          }
        } else msg = `${head} بحجم ${size}` + (dims.length === 1 ? ` (الفهارس من 0 إلى ${dims[0] - 1})` : '') + (isGlobal ? '، وعناصرها تبدأ بالقيمة 0 لأنها عامة.' : '. لم تُعطَ عناصرها قيمًا، فهي عشوائية (؟) حتى نعطيها قيمًا.');
      } else if (type.k === 'struct') {
        if (d.init) {
          const v = d.init.k === 'list' ? yield* this.structFromList(type, d.init, d.line) : yield* this.ev(d.init);
          this.writeRaw(cell, this.convert(v, type, d.line, d.name), d.line);
          msg = `${head}، وهو يجمع الحقول ${this.structs.get(type.name).fields.map((f) => C(f.name)).join(' و ')}، مع إعطائها القيم ${C(d.init.src)}.`;
        } else msg = `${head}، وهو يجمع الحقول ${this.structs.get(type.name).fields.map((f) => C(f.name)).join(' و ')}` + (isGlobal ? '، وقيمها تبدأ بـ 0.' : '. لم تُعطَ الحقول قيمًا بعد.');
      } else if (d.init) {
        const before = this.sub(d.init);
        const v = yield* this.ev(d.init);
        cell.val = this.convert(v, type, d.line, d.name);
        if (type.k === 'int' && isFloatK(v.t) && v.v !== Math.trunc(v.v))
          this.pendingWarn = `القيمة ${fmtShow(v)} خُزِّنت في متغير int، فحُذف الجزء العشري وأصبحت ${cell.val.v}`;
        const lit = ['num', 'str', 'chr', 'bool', 'null'].includes(d.init.k) || (d.init.k === 'un' && d.init.e.k === 'num');
        const shown = fmtShow(cell.val);
        if (type.k === 'ptr') msg = head + (cell.val.cell || cell.val.arr ? `، ويُخزَّن فيه عنوان ${C(ptrLabel(cell.val))}، أي أنه يشير إليه.` : `، وقيمته ${C('nullptr')}: لا يشير إلى أي شيء.`);
        else msg = head + (lit ? ` وإعطاؤه القيمة <b>${esc(shown)}</b>.`
          : ` وإعطاؤه قيمة ${C(d.init.src)}` + (before !== d.init.src ? ` ← ${C(before)}` : '') + ` = <b>${esc(shown)}</b>.`);
      } else if (isGlobal) msg = head + '. المتغير العام دون قيمة ابتدائية يبدأ بالقيمة 0، وتراه كل الدوال.';
      else msg = head + (type.k === 'ptr' ? ' دون قيمة، فهو يشير إلى مكان عشوائي. أعطه عنوانًا أو nullptr قبل استخدامه.' : ' دون قيمة ابتدائية، فقيمته الآن عشوائية (؟) حتى نعطيه قيمة.');
      scope.set(d.name, cell);
      this.touch(cell);
      yield this.step(d.line, msg);
    }
  }
  *fillArray(cell, list, line) {
    if (list.k !== 'list') throw new CppError(`قيم المصفوفة تُكتب بين ${C('{ }')}`, line);
    if (list.items.length > cell.elems.length) throw new CppError(`عدد القيم في القائمة (${list.items.length}) أكبر من حجم المصفوفة ${cell.elems.length}`, line);
    for (let i = 0; i < cell.elems.length; i++) {
      const e = cell.elems[i], it = list.items[i];
      if (e.type.k === 'arr') { if (it) yield* this.fillArray(e, it, line); else this.zero(e); continue; }
      if (e.type.k === 'struct') { if (it) this.writeRaw(e, it.k === 'list' ? yield* this.structFromList(e.type, it, line) : yield* this.ev(it), line); else this.zero(e); continue; }
      if (it && it.k === 'list') throw new CppError(`كل صف في المصفوفة الثنائية يُكتب بين ${C('{ }')}`, line);
      e.val = it ? this.convert(yield* this.ev(it), e.type, line) : this.convert(I(0), e.type, line);
    }
  }
  *exec(s) {
    switch (s.k) {
      case 'block': yield* this.block(s.body, true); return;
      case 'empty': return;
      case 'decl': yield* this.declare(s, this.scopes[this.scopes.length - 1], false); return;
      case 'expr': {
        const e = s.e;
        let rhsSub = null, oldSub = null;
        if (e.k === 'assign') { rhsSub = this.sub(e.e); oldSub = this.sub(e.target); }
        const v = yield* this.ev(e);
        yield this.step(s.line, this.exprMsg(e, v, rhsSub, oldSub));
        return;
      }
      case 'delete': {
        const v = yield* this.ev(s.e);
        if (v.t !== 'ptr') throw new CppError(`${C('delete')} تُستخدم مع مؤشر`, s.line);
        if (!v.cell && !v.arr) { yield this.step(s.line, `حذف ${C('nullptr')} لا يفعل شيئًا.`); return; }
        const tgt = v.arr && v.arr.heap ? v.arr : v.cell;
        if (!tgt.heap || (v.arr && v.idx !== 0) || (tgt.parent && !v.arr)) throw new CppError(`${C('delete')} تُستخدم فقط مع عنوان حُجز بـ ${C('new')}`, s.line);
        if (tgt.freed) throw new CppError(`${C(tgt.label)} حُذفت مسبقًا، ولا يجوز حذفها مرتين`, s.line);
        if (tgt.type.k === 'arr' && !s.arr) this.pendingWarn = `المصفوفة التي حُجزت بـ ${C('new[]')} تُحذف بـ ${C('delete[]')}`;
        const mark = (c) => { c.freed = true; this.changed.add(c.uid); if (c.elems) c.elems.forEach(mark); if (c.fields) c.fields.forEach(mark); };
        mark(tgt);
        yield this.step(s.line, `${C(s.src.replace(/;$/, ''))} تحرّر ${tgt.type.k === 'struct' ? 'العقدة' : 'الذاكرة'} ${C(tgt.label)} من الذاكرة الديناميكية. المؤشر ${C(s.e.src)} ما زال يحمل العنوان القديم، فلا تستخدمه بعد الآن قبل أن تعطيه قيمة جديدة.`);
        return;
      }
      case 'cout': {
        let text = '';
        const parts = [];
        for (const it of s.items) {
          if (it.k === 'endl') { text += '\n'; parts.push(C('endl') + ' (سطر جديد)'); continue; }
          const before = this.sub(it);
          const v = yield* this.ev(it);
          if (v.t === 'void') throw new CppError(`الدالة ${C(it.src)} من النوع void ولا تُرجع قيمة لطباعتها`, s.line);
          if (v.t === 'struct') throw new CppError(`لا يمكن طباعة السجل ${C(it.src)} كاملًا. اطبع حقوله واحدًا واحدًا مثل ${C(it.src + '.name')}`, s.line);
          let o;
          if (v.t === 'array') {
            if (v.cell.type.of.k === 'char') o = charsOf(v.cell);
            else throw new CppError(`لا يمكن طباعة المصفوفة ${C(it.src)} كاملة بـ cout. اطبع عناصرها بحلقة`, s.line);
          } else o = fmtOut(v);
          text += o;
          if (it.k === 'str') parts.push(`النص ${C('"' + it.v.replace(/\n/g, '\\n') + '"')}`);
          else if (v.t === 'ptr') parts.push(`قيمة المؤشر ${C(it.src)} وهي عنوان: <b>${esc(o)}</b>`);
          else parts.push(`قيمة ${C(it.src)}` + (before !== it.src && before !== fmtShow(v) && it.k !== 'call' ? ` ← ${C(before)}` : '') + ` = <b>${esc(o)}</b>`);
        }
        this.output += text;
        const shown = text.replace(/\n/g, '⏎');
        yield this.step(s.line, `${C('cout')} تطبع على الشاشة: ${parts.join('، ثم ')}.` + (shown.trim() ? ` يظهر في الكونسول: ${C(shown)}` : ''), { out: text });
        return;
      }
      case 'cin': {
        for (const tg of s.targets) {
          const lv = yield* this.lv(tg);
          const c = lv.cell;
          if (c && (c.isConst || this.constRoot(c))) throw new CppError(`لا يمكن إدخال قيمة في الثابت ${C(tg.src)}`, s.line);
          if (c && c.type.k === 'arr') {
            if (c.type.of.k !== 'char') throw new CppError(`لا يمكن إدخال مصفوفة كاملة بـ cin. أدخل عناصرها بحلقة مثل ${C('cin >> a[i];')}`, s.line);
            const r = yield* this.readToken('string', tg.src, s.line);
            this.writeChars(c, r.tok, s.line);
            this.inputLog.push(r.tok);
            yield this.step(s.line, `أدخل المستخدم <b>${esc(r.tok)}</b>، فخُزِّن في مصفوفة الحروف ${C(tg.src)} حرفًا حرفًا وبعده ${C("'\\0'")}. ${C('cin >>')} تقرأ كلمة واحدة وتتوقف عند أول مسافة.`, { input: r.tok });
            continue;
          }
          if (c && (c.type.k === 'ptr' || c.type.k === 'struct')) throw new CppError(`لا يمكن إدخال ${typeAr[c.type.k]} بـ cin. أدخل حقلًا أو قيمة عادية`, s.line);
          const type = lv.str ? 'char' : c.type.k;
          const r = yield* this.readToken(type, tg.src, s.line);
          this.inputLog.push(r.tok);
          this.setLv(lv, r.val, s.line, tg.src);
          yield this.step(s.line, `أدخل المستخدم <b>${esc(r.tok)}</b>، فخُزِّنت في ${C(tg.src)}.` + (type === 'string' ? ` ${C('cin >>')} تقرأ كلمة واحدة فقط وتتوقف عند أول مسافة، ولقراءة سطر كامل استخدم ${C('getline')}.` : ''), { input: r.tok });
        }
        return;
      }
      case 'if': {
        const before = this.sub(s.cond);
        const ok = this.truthy(yield* this.ev(s.cond), s.line);
        const what = ok ? 'فيُنفَّذ جسم if' : s.els ? (s.els.k === 'if' ? 'فننتقل إلى الشرط التالي else if' : 'فيُنفَّذ جسم else') : 'فيُتجاوز جسم if';
        yield this.step(s.line, this.condMsg(s.cond, ok, before) + `، ${what}.`, { cond: { text: s.cond.src, ok } });
        if (ok) yield* this.exec(s.then);
        else if (s.els) yield* this.exec(s.els);
        return;
      }
      case 'while': case 'for': case 'dowhile': yield* this.loop(s); return;
      case 'switch': {
        const before = this.sub(s.e);
        const v = yield* this.ev(s.e);
        if (!['int', 'char', 'bool'].includes(v.t)) throw new CppError(`جملة switch تعمل مع int و char فقط، ولا تعمل مع ${v.t}`, s.line);
        let idx = -1;
        for (let i = 0; i < s.cases.length; i++) if (!s.cases[i].def && numv(yield* this.ev(s.cases[i].val)) === numv(v)) { idx = i; break; }
        let how;
        if (idx >= 0) how = `، فيبدأ التنفيذ من ${C('case ' + s.cases[idx].val.src)}.`;
        else { idx = s.cases.findIndex((c) => c.def); how = idx >= 0 ? `، ولا توجد حالة مطابقة، فيُنفَّذ ${C('default')}.` : '، ولا توجد حالة مطابقة ولا default، فتُتجاوز جملة switch.'; }
        yield this.step(s.line, `قيمة ${C(s.e.src)}` + (before !== s.e.src ? ` هي ${C(before)}` : '') + ` = <b>${esc(fmtShow(v))}</b>${how}`);
        if (idx < 0) return;
        this.top.ctx.push('switch');
        try {
          for (let i = idx; i < s.cases.length; i++) {
            if (i > idx) yield this.step(s.cases[i].line, `لا يوجد ${C('break')} قبل هذه الحالة، فيستمر التنفيذ إلى ${C(s.cases[i].def ? 'default' : 'case ' + s.cases[i].val.src)} دون اختبار قيمتها.`);
            yield* this.block(s.cases[i].stmts, false);
          }
        } catch (e) {
          if (!(e instanceof BreakSig)) throw e;
        } finally { this.top.ctx.pop(); }
        return;
      }
      case 'break': {
        const inner = this.top.ctx[this.top.ctx.length - 1];
        if (!inner) throw new CppError(`${C('break')} تُستخدم داخل حلقة أو switch فقط`, s.line);
        yield this.step(s.line, inner === 'switch' ? `${C('break')} تُنهي جملة switch، وينتقل التنفيذ إلى ما بعدها.` : `${C('break')} تُنهي الحلقة فورًا، وينتقل التنفيذ إلى ما بعدها.`);
        throw new BreakSig(s.line);
      }
      case 'continue': {
        if (!this.top.ctx.includes('loop')) throw new CppError(`${C('continue')} تُستخدم داخل حلقة فقط`, s.line);
        yield this.step(s.line, `${C('continue')} تتجاوز باقي أوامر هذه الدورة، وتنتقل إلى الدورة التالية.`);
        throw new ContinueSig(s.line);
      }
      case 'return': {
        const fn = this.top.fn;
        let val = null, msg;
        if (s.e) {
          if (fn.ret.k === 'void' && fn.name !== 'main') throw new CppError(`الدالة ${C(fn.name)} من النوع void لا تُرجع قيمة. احذف القيمة بعد return أو غيّر نوع الدالة`, s.line);
          const before = this.sub(s.e);
          val = yield* this.ev(s.e);
          if (fn.name === 'main' && this.frames.length <= 1) msg = `${C('return ' + s.e.src)} تُنهي الدالة main، وبذلك ينتهي البرنامج.`;
          else {
            const shown = fmtShow(this.convert(val, fn.ret, s.line));
            msg = `${C('return')} تُرجع ${C(s.e.src)}` + (before !== s.e.src && before !== shown ? ` ← ${C(before)}` : '') +
              ` = <b>${esc(shown)}</b>، فتنتهي الدالة ${C(fn.name)} وتعود القيمة إلى مكان استدعائها في السطر ${this.top.callLine}.`;
          }
        } else {
          if (fn.ret.k !== 'void' && fn.name !== 'main') throw new CppError(`الدالة ${C(fn.name)} من النوع ${tstr(fn.ret)} يجب أن تُرجع قيمة بعد return`, s.line);
          msg = this.frames.length <= 1 ? `${C('return')} تُنهي البرنامج.` : `${C('return')} تُنهي الدالة ${C(fn.name)}، ويعود التنفيذ إلى السطر ${this.top.callLine}.`;
        }
        yield this.step(s.line, msg);
        throw new ReturnSig(s.line, val);
      }
    }
    throw new CppError('جملة غير مدعومة', s.line);
  }
  *loop(s) {
    const kindAr = { while: 'while', for: 'for', dowhile: 'do-while' }[s.k];
    if (s.k === 'for') this.scopes.push(new Map());
    const L = this.newLoop(s.k, s.line, s.cond);
    this.top.ctx.push('loop');
    try {
      if (s.k === 'for' && s.init) {
        if (s.init.k === 'decl') {
          const scope = this.scopes[this.scopes.length - 1];
          for (const dd of s.init.decls) {
            const cell = this.makeCell(dd.type, dd.name, {});
            if (dd.init) cell.val = this.convert(yield* this.ev(dd.init), dd.type, dd.line, dd.name);
            scope.set(dd.name, cell); this.touch(cell); L.tracked.add(dd.name);
          }
          const d = s.init.decls[0];
          const c0 = scope.get(d.name);
          yield this.step(s.line, `تهيئة الحلقة ${C('for')}: ${C(s.init.src.replace(/;\s*$/, ''))}، فيبدأ ${c0.type.k === 'ptr' ? 'المؤشر' : 'العدّاد'} ${C(d.name)} بالقيمة <b>${esc(fmtShow(c0.val))}</b>. التهيئة تُنفَّذ مرة واحدة فقط.`);
        } else {
          yield* this.ev(s.init.e);
          yield this.step(s.line, `تهيئة الحلقة ${C('for')}: ${C(s.init.e.src)}. التهيئة تُنفَّذ مرة واحدة فقط.`);
        }
      }
      if (s.k === 'dowhile') yield this.step(s.line, `حلقة ${C('do-while')}: يُنفَّذ الجسم أولًا، ثم يُختبر الشرط في النهاية.`);
      let first = true;
      for (;;) {
        if (s.k !== 'dowhile' || !first) {
          const cline = s.k === 'dowhile' ? s.condLine : s.line;
          let ok = true, before = 'true';
          if (s.cond) { before = this.sub(s.cond); ok = this.truthy(yield* this.ev(s.cond), cline); }
          this.loopRow(L, ok, before);
          const n = L.rows.length;
          if (s.k === 'dowhile') {
            yield this.step(cline, this.condMsg(s.cond, ok, before, `بعد الدورة ${n}: الشرط`) + (ok ? '، فيُعاد تنفيذ الجسم.' : `، فتنتهي الحلقة بعد ${countAr(n)}.`), { cond: { text: s.cond.src, ok }, loop: true });
          } else {
            const msg = ok
              ? (s.cond ? this.condMsg(s.cond, true, before, `الدورة ${n}: الشرط`) : `الدورة ${n}: لا يوجد شرط، فالحلقة تستمر`) + '، فيُنفَّذ جسم الحلقة.'
              : this.condMsg(s.cond, false, before) + (n - 1 === 0 ? `، فلا يُنفَّذ جسم حلقة ${kindAr} ولا مرة.` : `، فتنتهي حلقة ${kindAr} بعد ${countAr(n - 1)}.`);
            yield this.step(cline, msg, { cond: { text: s.cond ? s.cond.src : 'true', ok }, loop: true });
          }
          if (!ok) break;
        }
        first = false;
        try {
          yield* this.exec(s.body);
        } catch (e) {
          if (e instanceof BreakSig) break;
          if (!(e instanceof ContinueSig)) throw e;
        }
        if (s.k === 'for' && s.upd) {
          yield* this.ev(s.upd);
          const target = s.upd.k === 'assign' || s.upd.k === 'pre' || s.upd.k === 'post' ? s.upd.target : null;
          const cur = target ? this.peekVal(target) : null;
          yield this.step(s.line, `التحديث ${C(s.upd.src)}` + (cur ? `: أصبح ${C(target.src)} يساوي <b>${esc(fmtShow(cur))}</b>` : '') + '، ثم يُختبر الشرط مرة أخرى.');
        }
      }
    } finally {
      this.top.ctx.pop();
      this.top.active.pop();
      if (s.k === 'for') this.scopes.pop();
    }
  }

  // ---- snapshot for the UI ----
  desc(c, ch) {
    const show = (v) => (v === undefined ? '؟' : fmtShow(v));
    const base = { chg: ch.has(c.uid), freed: !!c.freed };
    if (c.type.k === 'arr') {
      if (c.type.of.k === 'char') return Object.assign(base, { kind: 'chars', cells: c.elems.map((e) => ({ show: e.val === undefined ? '؟' : e.val.v === 0 ? '\\0' : String.fromCharCode(e.val.v), chg: ch.has(e.uid), garbage: e.val === undefined })) });
      return Object.assign(base, { kind: 'arr', cells: c.elems.map((e) => this.desc(e, ch)) });
    }
    if (c.type.k === 'struct') return Object.assign(base, { kind: 'struct', name: c.type.name, fields: [...c.fields].map(([k, fc]) => ({ name: k, d: this.desc(fc, ch) })) });
    if (c.type.k === 'ptr') {
      const v = c.val;
      return Object.assign(base, { kind: 'ptr', show: v === undefined ? '؟' : (v.cell || v.arr ? '→ ' + ptrLabel(v) : 'nullptr'), null: v !== undefined && !v.cell && !v.arr, garbage: v === undefined, dangling: !!(v && v.cell && v.cell.freed) });
    }
    return Object.assign(base, { kind: 'val', show: show(c.val), garbage: c.val === undefined || c.garbage });
  }
  snapshot() {
    const ch = this.lastChanged;
    const varOf = (name, e) => {
      if (e.isRef) {
        if (e.arrParam) return { name, kind: 'aref', type: tstr(e.cell.type), to: e.cell.label };
        return { name, kind: 'ref', type: tstr(e.cell.type) + '&', to: e.cell.label, d: this.desc(e.cell, ch) };
      }
      return { name, type: tstr(e.type), isConst: e.isConst, d: this.desc(e, ch) };
    };
    const frames = [];
    if (this.globals.size) frames.push({ title: 'المتغيرات العامة', global: true, vars: [...this.globals].map(([k, e]) => varOf(k, e)) });
    this.frames.forEach((fr, i) => {
      if (fr.label === 'global') return;
      const vars = [];
      for (const sc of fr.scopes) for (const [k, e] of sc) vars.push(varOf(k, e));
      frames.push({ title: fr.fn.name === 'main' ? 'main' : fr.label, current: i === this.frames.length - 1, callLine: fr.callLine, vars });
    });
    const heap = this.heap.map((c) => ({ id: c.id, label: c.label, type: tstr(c.type), freed: !!c.freed, d: this.desc(c, ch) }));
    const loop = this.loops.length ? this.loops[this.loops.length - 1] : null;
    return {
      frames, heap, structures: this.structures(ch), output: this.output,
      loop: loop && { kind: loop.kind, line: loop.line, fn: loop.fn, cond: loop.cond, tracked: [...loop.tracked], rows: loop.rows.map((r) => Object.assign({}, r)) },
    };
  }
  // linked structures drawn as chains (lists) or trees, from the heap nodes and the pointers that point at them
  structures(ch) {
    const nodes = this.heap.filter((c) => c.type.k === 'struct' && !c.freed);
    if (!nodes.length) return [];
    const names = new Map();      // node uid -> [pointer names]
    const addName = (v, nm) => { if (v && v.t === 'ptr' && v.cell && v.cell.type.k === 'struct' && v.cell.heap) { const l = names.get(v.cell.uid) || []; if (!l.includes(nm)) l.push(nm); names.set(v.cell.uid, l); } };
    const scanCell = (c, nm) => {
      if (c.type.k === 'ptr') addName(c.val, nm);
      else if (c.type.k === 'struct' && !c.heap) c.fields.forEach((f, k) => scanCell(f, `${nm}.${k}`));
      else if (c.type.k === 'arr' && c.type.of.k === 'ptr') c.elems.forEach((e, i) => addName(e.val, `${nm}[${i}]`));
    };
    for (const [k, e] of this.globals) if (!e.isRef) scanCell(e, k);
    this.frames.forEach((fr, fi) => {
      const top = fi === this.frames.length - 1;
      for (const sc of fr.scopes) for (const [k, e] of sc) { if (e.isRef) { if (top) scanCell(e.cell, k); } else if (top || fr.fn.name === 'main') scanCell(e, k); }
    });
    const result = [];
    const byType = new Map();
    for (const n of nodes) { const l = byType.get(n.type.name) || []; l.push(n); byType.set(n.type.name, l); }
    for (const [tname, list] of byType) {
      const def = this.structs.get(tname);
      const self = def.fields.filter((f) => f.type.k === 'ptr' && f.type.to.k === 'struct' && f.type.to.name === tname).map((f) => f.name);
      if (!self.length) continue;
      const dataFields = def.fields.filter((f) => !self.includes(f.name));
      const label = (c) => {
        const parts = dataFields.map((f) => { const fc = c.fields.get(f.name); const v = fc.type.k === 'arr' ? { t: 'array', cell: fc } : fc.val; return v === undefined ? '؟' : fmtShow(v); });
        return parts.join(' · ');
      };
      const nodeInfo = (c) => ({ uid: c.uid, id: '#' + c.id, data: label(c), names: names.get(c.uid) || [], chg: ch.has(c.uid) || [...c.fields.values()].some((f) => ch.has(f.uid)) });
      const tgt = (c, f) => { const v = c.fields.get(f).val; return v && v.cell && v.cell.type.k === 'struct' && v.cell.heap && !v.cell.freed ? v.cell : null; };
      const isTree = self.length >= 2 && (self.includes('left') || self.includes('right') || !self.includes('next'));
      if (isTree) {
        const [lf, rf] = self.includes('left') ? ['left', 'right'] : self;
        const incoming = new Set();
        list.forEach((c) => { const a = tgt(c, lf), b = tgt(c, rf); if (a) incoming.add(a.uid); if (b) incoming.add(b.uid); });
        const seen = new Set();
        const build = (c, depth) => {
          if (!c || seen.has(c.uid) || depth > 8) return null;
          seen.add(c.uid);
          return Object.assign(nodeInfo(c), { left: build(tgt(c, lf), depth + 1), right: build(tgt(c, rf), depth + 1) });
        };
        list.filter((c) => !incoming.has(c.uid)).forEach((c) => { const t = build(c, 0); if (t) result.push({ kind: 'tree', type: tname, root: t }); });
        continue;
      }
      const nf = self.includes('next') ? 'next' : self[0];
      const pf = self.find((f) => f !== nf);
      const incoming = new Set();
      list.forEach((c) => { const a = tgt(c, nf); if (a) incoming.add(a.uid); });
      const done = new Set();
      const chain = (start) => {
        const out = []; let c = start, circular = null, joins = null;
        const mine = new Set();
        while (c && out.length < 40) {
          if (mine.has(c.uid)) { circular = '#' + c.id; break; }
          if (done.has(c.uid)) { joins = '#' + c.id; break; }
          mine.add(c.uid);
          done.add(c.uid); out.push(Object.assign(nodeInfo(c), { prev: pf ? !!tgt(c, pf) : false }));
          c = tgt(c, nf);
        }
        return { kind: 'chain', type: tname, doubly: !!pf, next: nf, nodes: out, circular, joins };
      };
      list.filter((c) => !incoming.has(c.uid)).forEach((c) => result.push(chain(c)));
      list.forEach((c) => { if (!done.has(c.uid) && (names.get(c.uid) || []).length) result.push(chain(c)); });
      list.forEach((c) => { if (!done.has(c.uid)) result.push(chain(c)); });
    }
    return result;
  }
}

function varsIn(n, out = []) {
  if (!n) return out;
  if (n.k === 'var') { if (!out.includes(n.name)) out.push(n.name); }
  for (const key of ['l', 'r', 'e', 'c', 'a', 'b', 'target', 'base', 'idx', 'obj']) if (n[key] && typeof n[key] === 'object') varsIn(n[key], out);
  if (n.args) n.args.forEach((a) => varsIn(a, out));
  return out;
}

function compile(src) { return parse(src); }

function runAll(src, input) {
  let it;
  try {
    it = new Interp(compile(src));
    it.inbuf = input || '';
    it.eof = true;
    const g = it.run();
    for (let r = g.next(); !r.done; r = g.next()) { /* input events: eof set, readToken throws */ }
    return { output: it.output };
  } catch (e) {
    if (e instanceof CppError) return { output: it ? it.output : '', error: e.message, line: e.line };
    throw e;
  }
}

G.FSCpp = { compile, Interp, runAll, CppError, fmtDouble, tokenize };
})(typeof window !== 'undefined' ? window : globalThis);
