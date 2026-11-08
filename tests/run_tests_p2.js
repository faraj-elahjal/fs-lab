// node site/tests/run_tests_p2.js — Programming 2 programs (functions sheets 1-4, arrays) against the interpreter
require('../js/interpreter.js');
const { runAll, compile, Interp } = globalThis.FSCpp;
const H = '#include <iostream>\nusing namespace std;\n';
const cases = [
  ['addTen value', `int square(int x) { return x * x; }\nint addTen(int n) { n = n + 10; return n; }\nint main() { int a = 3; int b = square(a); cout << b << endl; int c = addTen(a); cout << a << " " << c; }`, '', '9\n3 13'],
  ['add', `int add(int a, int b) { return a + b; }\nint main() { int s = add(3, 4); cout << s << endl; cout << add(10, 5); }`, '', '7\n15'],
  ['prototype', `int add(int a, int b);\nint main() { cout << add(2, 3); }\nint add(int a, int b) { return a + b; }`, '', '5'],
  ['void fn', `void printLine() { for (int i = 0; i < 3; i++) cout << "*"; cout << endl; }\nint main() { printLine(); cout << "Hi" << endl; printLine(); }`, '', '***\nHi\n***\n'],
  ['swap value', `void swapV(int a, int b) { int t = a; a = b; b = t; }\nint main() { int x = 3, y = 7; swapV(x, y); cout << x << " " << y; }`, '', '3 7'],
  ['swap ref', `void swapR(int &a, int &b) { int t = a; a = b; b = t; }\nint main() { int x = 3, y = 7; swapR(x, y); cout << x << " " << y; }`, '', '7 3'],
  ['calc refs', `void calc(int a, int b, int &s, double &avg) { s = a + b; avg = s / 2.0; }\nint main() { int total; double av; calc(6, 9, total, av); cout << total << " " << av; }`, '', '15 7.5'],
  ['scope global', `int g = 10;\nvoid f() { int g = 1; g++; cout << g << endl; }\nvoid h() { g++; }\nint main() { f(); h(); cout << g; }`, '', '2\n11'],
  ['trace2', `void f(int a, int &b) { a = a + 1; b = b + a; }\nint main() { int x = 2, y = 5; f(x, y); cout << x << " " << y << endl; f(y, x); cout << x << " " << y; }`, '', '2 8\n11 8'],
  ['p q global', `int n = 1;\nvoid p(int x) { x = x * 10; cout << x << " "; }\nvoid q(int &x) { x = x + n; }\nint main() { int a = 4; p(a); q(a); q(a); cout << a << " " << n; }`, '', '40 6 1'],
  ['half swap', `void s(int &a, int b) { int t = a; a = b; b = t; }\nint main() { int x = 1, y = 9; s(x, y); cout << x << " " << y; }`, '', '9 9'],
  ['sumArr', `int sumArr(int a[], int n) { int s = 0; for (int i = 0; i < n; i++) s += a[i]; return s; }\nint main() { int arr[5] = {4, 7, 1, 9, 3}; cout << sumArr(arr, 5); }`, '', '24'],
  ['doubleAll', `void doubleAll(int a[], int n) { for (int i = 0; i < n; i++) a[i] = a[i] * 2; }\nint main() { int arr[3] = {1, 2, 3}; doubleAll(arr, 3); for (int i = 0; i < 3; i++) cout << arr[i] << " "; }`, '', '2 4 6 '],
  ['findMin search', `int findMin(int a[], int n) { int m = a[0]; for (int i = 1; i < n; i++) if (a[i] < m) m = a[i]; return m; }\nint search(int a[], int n, int key) { for (int i = 0; i < n; i++) if (a[i] == key) return i; return -1; }\nint main() { int a[] = {5, 3, 8, 1, 9}; cout << findMin(a, 5) << " " << search(a, 5, 8) << " " << search(a, 5, 7); }`, '', '1 2 -1'],
  ['sum2D', `int sum2D(int m[][3], int rows) { int s = 0; for (int i = 0; i < rows; i++) for (int j = 0; j < 3; j++) s += m[i][j]; return s; }\nint main() { int m[2][3] = {{1, 2, 3}, {4, 5, 6}}; cout << sum2D(m, 2); }`, '', '21'],
  ['overload area', `int area(int side) { return side * side; }\nint area(int w, int h) { return w * h; }\ndouble area(double r) { return 3.14 * r * r; }\nint main() { cout << area(4) << endl; cout << area(3, 5) << endl; cout << area(2.0); }`, '', '16\n15\n12.56'],
  ['defaults', `void greet(string name, int times = 1) { for (int i = 0; i < times; i++) cout << "Hi " << name << endl; }\nint main() { greet("Ali"); greet("Sara", 2); }`, '', 'Hi Ali\nHi Sara\nHi Sara\n'],
  ['array + value', `void f(int a[], int n, int x) { for (int i = 0; i < n; i++) a[i] = a[i] + x; x = 0; }\nint main() { int arr[3] = {1, 2, 3}; int k = 5; f(arr, 3, k); cout << arr[0] << " " << arr[2]; cout << " " << k; }`, '', '6 8 5'],
  ['a0 trap', `int g(int a[], int n) { int c = 0; for (int i = 0; i < n; i++) { if (a[i] > a[0]) c++; a[i] = a[i] - 1; } return c; }\nint main() { int v[4] = {3, 5, 2, 6}; int r = g(v, 4); cout << r << endl; cout << v[0] << " " << v[3]; }`, '', '2\n2 5'],
  ['show overloads', `void show(int x) { cout << "int " << x << endl; }\nvoid show(double x) { cout << "double " << x << endl; }\nvoid show(int x, int y) { cout << "two " << x + y << endl; }\nint main() { show(7); show(2.5); show(3, 4); }`, '', 'int 7\ndouble 2.5\ntwo 7\n'],
  ['power default', `int power(int b, int e = 2) { int r = 1; for (int i = 0; i < e; i++) r *= b; return r; }\nint main() { cout << power(5) << " "; cout << power(2, 3) << " "; cout << power(3, 0); }`, '', '25 8 1'],
  ['exam t1', `int c = 0;\nint f(int x, int &y) { c++; x = x + y; y = x * 2; return x - y; }\nint main() { int a = 1, b = 2; int r = f(a, b); cout << a << " " << b << " " << r << endl; r = f(b, a); cout << a << " " << b << " " << r << endl; cout << c; }`, '', '1 6 -3\n14 6 -7\n2'],
  ['shift', `void shift(int a[], int n) { int first = a[0]; for (int i = 0; i < n - 1; i++) a[i] = a[i + 1]; a[n - 1] = first; }\nint main() { int v[5] = {1, 2, 3, 4, 5}; shift(v, 5); shift(v, 5); for (int i = 0; i < 5; i++) cout << v[i] << " "; }`, '', '3 4 5 1 2 '],
  ['calc overload nested', `int calc(int a, int b = 3) { return a * b; }\ndouble calc(double a) { return a / 2; }\nint main() { cout << calc(4) << endl; cout << calc(4, 1) << endl; cout << calc(5.0) << endl; cout << calc(calc(2), 2); }`, '', '12\n4\n2.5\n12'],
  ['diag', `int diag(int m[][3], int n) { int s = 0; for (int i = 0; i < n; i++) { s += m[i][i]; m[i][i] = 0; } return s; }\nint main() { int m[3][3] = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}}; cout << diag(m, 3) << endl; cout << diag(m, 3) << " " << m[1][1]; }`, '', '15\n0 0'],
  ['reverse', `void reverseArray(int a[], int n) { for (int i = 0; i < n / 2; i++) { int t = a[i]; a[i] = a[n - 1 - i]; a[n - 1 - i] = t; } }\nint main() { int a[4] = {1, 2, 3, 4}; reverseArray(a, 4); for (int i = 0; i < 4; i++) cout << a[i]; }`, '', '4321'],
  ['stats', `int stats(int a[], int n, int &mx, int &mn) { int s = 0; mx = a[0]; mn = a[0]; for (int i = 0; i < n; i++) { s += a[i]; if (a[i] > mx) mx = a[i]; if (a[i] < mn) mn = a[i]; } return s; }\nint main() { int a[] = {4, -2, 9, 1}; int hi, lo; int s = stats(a, 4, hi, lo); cout << s << " " << hi << " " << lo; }`, '', '12 9 -2'],
  ['maxRow', `int rowSum(int m[][4], int r) { int s = 0; for (int j = 0; j < 4; j++) s += m[r][j]; return s; }\nint maxRow(int m[][4], int rows) { int best = 0; for (int i = 1; i < rows; i++) if (rowSum(m, i) > rowSum(m, best)) best = i; return best; }\nint main() { int m[3][4] = {{1, 1, 1, 1}, {5, 5, 0, 0}, {2, 2, 2, 2}}; cout << maxRow(m, 3); }`, '', '1'],
  ['primes', `bool isPrime(int n) { if (n < 2) return false; for (int i = 2; i < n; i++) if (n % i == 0) return false; return true; }\nint main() { for (int i = 1; i <= 20; i++) if (isPrime(i)) cout << i << " "; }`, '', '2 3 5 7 11 13 17 19 '],
  ['recursion', `int fact(int n) { if (n <= 1) return 1; return n * fact(n - 1); }\nint main() { cout << fact(5); }`, '', '120'],
  ['cin array', `int main() { int a[3]; for (int i = 0; i < 3; i++) cin >> a[i]; cout << a[0] + a[1] + a[2]; }`, '4 5 6', '15'],
  ['global array', `int counts[3];\nint main() { counts[1]++; cout << counts[0] << counts[1] << counts[2]; }`, '', '010'],
  ['ref to element', `void inc(int &x) { x++; }\nint main() { int a[2] = {5, 7}; inc(a[1]); cout << a[0] << " " << a[1]; }`, '', '5 8'],
  ['string param', `void hello(string name) { cout << "Hello " << name; }\nint main() { hello("Ali"); }`, '', 'Hello Ali'],
];
const errors = [
  ['ref literal', `void addOne(int &x) { x++; }\nint main() { addOne(5); }`, 4],
  ['undefined fn', `int main() { foo(3); }`, 3],
  ['out of bounds', `int main() { int a[3] = {1, 2, 3}; cout << a[3]; }`, 3],
  ['void return value', `void f() { return 5; }\nint main() { f(); }`, 3],
  ['wrong arg count', `int add(int a, int b) { return a + b; }\nint main() { cout << add(1); }`, 4],
  ['local not visible', `void f() { cout << x; }\nint main() { int x = 3; f(); }`, 3],
  ['2d without cols', `int s(int m[][], int r) { return 0; }\nint main() { }`, 3],
  ['default not last', `void g(int a = 1, int b) { }\nint main() { }`, 3],
  ['infinite recursion', `int f(int n) { return f(n + 1); }\nint main() { f(1); }`, 3],
];
let pass = 0, fail = 0;
for (const [name, body, input, want] of cases) {
  const r = runAll(H + body, input);
  if (!r.error && r.output === want) pass++;
  else { fail++; console.log('FAIL', name, JSON.stringify(r), 'want', JSON.stringify(want)); }
}
for (const [name, body, line] of errors) {
  const r = runAll(H + body, '');
  if (r.error && r.line === line) pass++;
  else { fail++; console.log('FAIL(err)', name, JSON.stringify(r).slice(0, 300), 'want line', line); }
}
// step sample with a call
const it = new Interp(compile(H + 'void f(int a, int &b) {\n a = a + 1;\n b = b + a;\n}\nint main() {\n int x = 2, y = 5;\n f(x, y);\n cout << y;\n}'));
for (const ev of it.run()) { if (ev.line === 4 || ev.line === 5) console.log(ev.line + ': ' + ev.msg.replace(/<[^>]+>/g, '')); if (ev.line === 5) { console.log(JSON.stringify(it.snapshot().frames)); } }
console.log(`${pass} passed, ${fail} failed`);
