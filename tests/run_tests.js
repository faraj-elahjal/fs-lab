// node site/tests/run_tests.js  — checks the interpreter against the Programming 1 sheet programs
require('../js/interpreter.js');
const { runAll, compile, Interp } = globalThis.FSCpp;
const H = '#include <iostream>\nusing namespace std;\nint main() {\n';
const E = '\n}';
const cases = [
  ['swap trace', `int a = 5, b = 3;\na = a + b;\nb = a - b;\na = a - b;\ncout << a << " " << b << endl;\nint c = a * 2;\nc = c + a;\ncout << "c = " << c;`, '', '3 5\nc = 9'],
  ['division', `cout << 7 / 2 << endl;\ncout << 7.0 / 2 << endl;\ncout << 9 / 10 << endl;\ncout << -7 / 2;`, '', '3\n3.5\n0\n-3'],
  ['precedence', `cout << 2 + 3 * 4 - 8 / 2 % 3;`, '', '13'],
  ['casting', `int sum = 7, count = 2;\ndouble a = sum / count;\ndouble b = (double)sum / count;\nint c = 9.8;\ncout << a << " " << b << " " << c;`, '', '3 3.5 9'],
  ['incdec', `int x = 4;\nint y = x++ + 2;\nint z = ++x * 2;\nx -= y;\ncout << x << " " << y << " " << z;`, '', '0 6 12'],
  ['arith trace', `int a = 17, b = 5;\nint q = a / b;\nint r = a % b;\ndouble d = a / b;\ndouble e = (double)a / b;\na += r * 2;\ncout << q << " " << r << endl;\ncout << d << " " << e << endl;\ncout << a % 4 + b * 2;`, '', '3 2\n3 3.4\n11'],
  ['cmath', `cout << pow(2, 3) << " " << sqrt(16) << " " << abs(-7) << " " << 3.14 * 2.0 * 2.0;`, '', '8 4 7 12.56'],
  ['io', `int age;\ncout << "Enter your age: ";\ncin >> age;\ncout << "Next year: " << age + 1 << endl;`, '19', 'Enter your age: Next year: 20\n'],
  ['cond trace', `int x = 7, y = 3;\nif (x > 5 && y > 5)\n cout << "A";\nelse if (x > 5 || y > 5)\n cout << "B";\nelse\n cout << "C";\nif (x % 2 == 1)\n y = y + x;\nif (y > 9)\n cout << " " << y;\nelse\n cout << " small";`, '', 'B 10'],
  ['switch fall', `int n = 2;\nswitch (n) {\n case 1: cout << "one ";\n case 2: cout << "two ";\n case 3: cout << "three ";\n break;\n default: cout << "other";\n}`, '', 'two three '],
  ['dangling else', `int a = 12;\nif (a > 10)\n if (a % 5 == 0)\n  cout << "X";\n else\n  cout << "Y";\nelse\n cout << "Z";`, '', 'Y'],
  ['grades', `int mark;\ncin >> mark;\nif (mark >= 85) cout << "A";\nelse if (mark >= 75) cout << "B";\nelse if (mark >= 65) cout << "C";\nelse if (mark >= 50) cout << "D";\nelse cout << "F";`, '78', 'B'],
  ['ternary', `int a = 4, b = 9;\nint mx = (a > b) ? a : b;\ncout << mx;`, '', '9'],
  ['for sum', `int sum = 0;\nfor (int i = 1; i <= 5; i++)\n sum = sum + i;\ncout << "sum = " << sum;`, '', 'sum = 15'],
  ['for step', `int s = 0;\nfor (int i = 1; i <= 10; i += 3) {\n s += i;\n cout << i << " ";\n}\ncout << endl << s;`, '', '1 4 7 10 \n22'],
  ['triangle', `for (int i = 1; i <= 4; i++) {\n for (int j = 1; j <= i; j++)\n  cout << "*";\n cout << endl;\n}`, '', '*\n**\n***\n****\n'],
  ['break continue', `for (int i = 1; i <= 10; i++) {\n if (i == 6)\n  break;\n if (i % 2 == 0)\n  continue;\n cout << i << " ";\n}`, '', '1 3 5 '],
  ['factorial', `int f = 1;\nfor (int i = 1; i <= 5; i++) f = f * i;\ncout << f;`, '', '120'],
  ['average', `int n;\ndouble x, sum = 0;\ncin >> n;\nfor (int i = 1; i <= n; i++) {\n cin >> x;\n sum += x;\n}\ncout << "Average = " << sum / n;`, '4\n10 20 30 40', 'Average = 25'],
  ['digit sum while', `int n = 472, s = 0;\nwhile (n > 0) {\n s = s + n % 10;\n n = n / 10;\n}\ncout << s;`, '', '13'],
  ['sentinel', `int x, sum = 0, count = 0;\ncin >> x;\nwhile (x != -1) {\n sum += x;\n count++;\n cin >> x;\n}\ncout << sum << " " << count;`, '5 8 2 -1', '15 3'],
  ['dowhile once', `int x = 10;\ndo {\n cout << x;\n x++;\n} while (x < 5);`, '', '10'],
  ['while trace', `int a = 1, b = 20;\nwhile (a < b) {\n a = a * 2;\n b = b - 3;\n cout << a << " " << b << endl;\n}\ncout << "end " << a + b;`, '', '2 17\n4 14\n8 11\n16 8\nend 24'],
  ['reverse', `int n = 1234, r = 0;\nwhile (n != 0) {\n r = r * 10 + n % 10;\n n = n / 10;\n}\ncout << r;`, '', '4321'],
  ['exam t1', `int a = 7, b = 2;\ndouble c = a / b;\ndouble d = (double)a / b;\na %= 4;\nb += a * 3;\ncout << c << " " << d << endl;\ncout << a << " " << b;`, '', '3 3.5\n3 11'],
  ['exam t3', `int count = 0;\nfor (int i = 1; i <= 4; i++) {\n for (int j = i; j <= 4; j++) {\n  if ((i + j) % 2 == 0)\n   count++;\n }\n}\ncout << count;`, '', '6'],
  ['exam t4', `int n = 48, steps = 0;\nwhile (n != 1) {\n if (n % 2 == 0)\n  n = n / 2;\n else\n  n = n * 3 + 1;\n steps++;\n if (steps == 5)\n  break;\n}\ncout << n << " " << steps;`, '', '10 5'],
  ['char string bool', `char c = 'A';\nstring s = "Ali";\nbool ok = true;\ncout << c << " " << s << " " << ok;`, '', 'A Ali 1'],
  ['calc', `double a, b;\nchar op, again;\ndo {\n cin >> a >> op >> b;\n switch (op) {\n  case '+': cout << a + b << endl; break;\n  case '/':\n   if (b != 0) cout << a / b << endl;\n   else cout << "Division by zero" << endl;\n   break;\n  default: cout << "Unknown" << endl;\n }\n cin >> again;\n} while (again == 'y');`, '3 + 4 y 8 / 0 y 9 / 2 n', '7\nDivision by zero\n4.5\n'],
  ['pyramid', `int n;\ncin >> n;\nfor (int i = 1; i <= n; i++) {\n for (int s = 1; s <= n - i; s++) cout << " ";\n for (int k = 1; k <= 2 * i - 1; k++) cout << "*";\n cout << endl;\n}`, '3', '  *\n ***\n*****\n'],
  ['snippet', `int x = 5;\nx += 2;\ncout << x;`, '', '7', true],
];
const errors = [
  ['no semicolon', `int x = 5\ncout << x;`, 4],
  ['undeclared', `x = 10;`, 4],
  ['mod double', `double x = 7.5;\nint r = x % 2;`, 5],
  ['char quotes', `char c = "A";`, 4],
  ['const', `const double PI = 3.14;\nPI = 3.5;`, 5],
  ['div zero', `int a = 5, b = 0;\ncout << a / b;`, 5],
  ['infinite', `for (int i = 10; i > 0; i++) { }`, 4],
  ['name digit', `int 2num = 5;`, 4],
  ['case sens', `int age = 3;\ncout << Age;`, 5],
];
let pass = 0, fail = 0;
for (const [name, body, input, want, raw] of cases) {
  const src = raw ? body : H + body + E;
  const r = runAll(src, input);
  if (!r.error && r.output === want) pass++;
  else { fail++; console.log('FAIL', name, JSON.stringify(r), 'want', JSON.stringify(want)); }
}
for (const [name, body, line] of errors) {
  const r = runAll(H + body + E, '');
  if (r.error && r.line === line) pass++;
  else { fail++; console.log('FAIL(err)', name, JSON.stringify(r), 'want line', line); }
}
// warnings
const w = compile(H + 'int x = 3;\nif (x = 5) cout << 1;\nfor (int i = 0; i < 3; i++);\nif (0 < x < 10) cout << 2;' + E).warnings;
if (w.length === 3) pass++; else { fail++; console.log('FAIL warnings', w); }
// step messages sample
const it = new Interp(compile(H + 'int x = 5;\nx = x + 2;\nfor (int i = 0; i < 2; i++) cout << i;' + E));
const msgs = [];
for (const ev of it.run()) msgs.push(ev.line + ': ' + ev.msg.replace(/<[^>]+>/g, ''));
console.log(msgs.join('\n'));
console.log(JSON.stringify(it.snapshot().loop));
console.log(`${pass} passed, ${fail} failed`);
