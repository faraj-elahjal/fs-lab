// node site/tests/check_lessons.js — runs every lesson example and checks reference solutions against the challenge tests
globalThis.window = globalThis;
require('../js/interpreter.js');
require('../js/lessons.js');
require('../js/lessons_p2.js');
require('../js/lessons_p2b.js');
require('../js/lessons_ds.js');
const { runAll } = globalThis.FSCpp;
const P = (b) => `#include <iostream>\nusing namespace std;\nint main() {\n${b}\nreturn 0;\n}`;
const Q = (fns, b) => `#include <iostream>
using namespace std;
${fns}
int main() {
${b}
return 0;
}`;
const REF = {
  vc1: P('double len, wid; cin >> len >> wid; cout << len * wid << endl; cout << 2 * (len + wid);'),
  vc2: P('int a, b; cin >> a >> b; int t = a; a = b; b = t; cout << a << " " << b;'),
  ac1: P('int n; cin >> n; cout << n % 10 + n / 10 % 10 + n / 100;'),
  ac2: P('int s; cin >> s; cout << s / 3600 << " " << s % 3600 / 60 << " " << s % 60;'),
  cc1: P('int n; cin >> n; if (n > 0) cout << "Positive"; else if (n < 0) cout << "Negative"; else cout << "Zero";'),
  cc2: P('int a, b, c; cin >> a >> b >> c; int m = a; if (b > m) m = b; if (c > m) m = c; cout << m;'),
  cc3: P('double a, b; char op; cin >> a >> op >> b; switch (op) { case \'+\': cout << a + b; break; case \'-\': cout << a - b; break; case \'*\': cout << a * b; break; case \'/\': if (b == 0) cout << "Error"; else cout << a / b; break; }'),
  fc1: P('int n, s = 0, c = 0; cin >> n; for (int i = 1; i <= n; i += 2) { s += i; c++; } cout << s << " " << c;'),
  fc2: P('int n; cin >> n; for (int i = 1; i <= 10; i++) cout << n << " x " << i << " = " << n * i << endl;'),
  fc3: P('int n; cin >> n; for (int i = 1; i <= n; i++) { for (int j = 1; j <= i; j++) cout << j; cout << endl; }'),
  wc1: P('int n, c = 0; cin >> n; do { c++; n /= 10; } while (n > 0); cout << c;'),
  wc2: P('int x, sum = 0; cin >> x; while (x != 0) { sum += x; cin >> x; } cout << sum;'),
  wc3: P('int n, r = 0; cin >> n; while (n != 0) { r = r * 10 + n % 10; n /= 10; } cout << r;'),
  ec1: P('int n; cin >> n; bool p = n >= 2; for (int i = 2; i < n; i++) if (n % i == 0) { p = false; break; } if (p) cout << "Prime"; else cout << "Not prime";'),
  ec2: P('double a, b, c; cin >> a >> b >> c; if (a + b <= c || a + c <= b || b + c <= a) cout << "Not a triangle"; else if (a == b && b == c) cout << "Equilateral"; else if (a == b || b == c || a == c) cout << "Isosceles"; else cout << "Scalene";'),
  p2fc1: Q('int maxOf(int a, int b) { return a > b ? a : b; }', 'int a, b; cin >> a >> b; cout << maxOf(a, b);'),
  p2fc2: Q('bool isEven(int n) { return n % 2 == 0; }', 'int n; cin >> n; if (isEven(n)) cout << "Even"; else cout << "Odd";'),
  p2fc3: Q('void printStars(int n) { for (int i = 0; i < n; i++) cout << "*"; cout << endl; }', 'int n; cin >> n; printStars(n); printStars(2);'),
  p2rc1: Q('void doubleIt(int &n) { n *= 2; }', 'int n; cin >> n; doubleIt(n); cout << n;'),
  p2rc2: Q('void minMax(int a, int b, int &mn, int &mx) { if (a < b) { mn = a; mx = b; } else { mn = b; mx = a; } }', 'int a, b, mn, mx; cin >> a >> b; minMax(a, b, mn, mx); cout << mn << " " << mx;'),
  p2ac1: Q('', 'int n; int a[10]; cin >> n; double s = 0; for (int i = 0; i < n; i++) { cin >> a[i]; s += a[i]; } double avg = s / n; int c = 0; for (int i = 0; i < n; i++) if (a[i] > avg) c++; cout << c;'),
  p2ac2: Q('', 'int a[5]; for (int i = 0; i < 5; i++) cin >> a[i]; for (int i = 4; i >= 0; i--) cout << a[i] << " ";'),
  p2mc1: Q('', 'int m[3][3]; for (int i = 0; i < 3; i++) for (int j = 0; j < 3; j++) cin >> m[i][j]; int d = 0; for (int i = 0; i < 3; i++) d += m[i][i]; cout << d;'),
  p2mc2: Q('', 'int m[2][3]; for (int i = 0; i < 2; i++) for (int j = 0; j < 3; j++) cin >> m[i][j]; for (int j = 0; j < 3; j++) cout << m[0][j] + m[1][j] << " ";'),
  p2xc1: Q('int countEven(int a[], int n) { int c = 0; for (int i = 0; i < n; i++) if (a[i] % 2 == 0) c++; return c; }', 'int a[6]; for (int i = 0; i < 6; i++) cin >> a[i]; cout << countEven(a, 6);'),
  p2xc2: Q('int getSmallest2D(int m[][3], int r) { int s = m[0][0]; for (int i = 0; i < r; i++) for (int j = 0; j < 3; j++) if (m[i][j] < s) s = m[i][j]; return s; }', 'int m[2][3]; for (int i = 0; i < 2; i++) for (int j = 0; j < 3; j++) cin >> m[i][j]; cout << getSmallest2D(m, 2);'),
  p2xc3: Q('int power(int b, int e = 2) { int r = 1; for (int i = 0; i < e; i++) r *= b; return r; }', 'int b, e; cin >> b >> e; cout << power(b) << " " << power(b, e);'),
  p2ec1: Q('void reverseArray(int a[], int n) { for (int i = 0; i < n / 2; i++) { int t = a[i]; a[i] = a[n - 1 - i]; a[n - 1 - i] = t; } }', 'int a[5]; for (int i = 0; i < 5; i++) cin >> a[i]; reverseArray(a, 5); for (int i = 0; i < 5; i++) cout << a[i] << " ";'),
  p2ec2: Q('int stats(int a[], int n, int &mx, int &mn) { int s = 0; mx = a[0]; mn = a[0]; for (int i = 0; i < n; i++) { s += a[i]; if (a[i] > mx) mx = a[i]; if (a[i] < mn) mn = a[i]; } return s; }', 'int a[4], hi, lo; for (int i = 0; i < 4; i++) cin >> a[i]; int s = stats(a, 4, hi, lo); cout << s << " " << hi << " " << lo;'),
  p2ec3: Q('int rowSum(int m[][4], int r) { int s = 0; for (int j = 0; j < 4; j++) s += m[r][j]; return s; } int maxRow(int m[][4], int rows) { int b = 0; for (int i = 1; i < rows; i++) if (rowSum(m, i) > rowSum(m, b)) b = i; return b; }', 'int m[3][4]; for (int i = 0; i < 3; i++) for (int j = 0; j < 4; j++) cin >> m[i][j]; cout << maxRow(m, 3);'),
  sc1: Q("", "string w; char c; cin >> w >> c; int k = 0; for (int i = 0; i < w.length(); i++) if (w[i] == c) k++; cout << k;"),
  sc2: Q("", "string w; cin >> w; for (int i = w.length() - 1; i >= 0; i--) cout << w[i];"),
  sc3: Q("", "string line; getline(cin, line); int c = 1; for (int i = 0; i < line.length(); i++) if (line[i] == ' ') c++; cout << c;"),
  ptc1: Q("int sumP(int* p, int n) { int s = 0; for (int i = 0; i < n; i++) s += *(p + i); return s; }", "int a[5]; for (int i = 0; i < 5; i++) cin >> a[i]; cout << sumP(a, 5);"),
  ptc2: Q("void minMax(int a[], int n, int* mn, int* mx) { *mn = a[0]; *mx = a[0]; for (int i = 1; i < n; i++) { if (a[i] < *mn) *mn = a[i]; if (a[i] > *mx) *mx = a[i]; } }", "int a[4], lo, hi; for (int i = 0; i < 4; i++) cin >> a[i]; minMax(a, 4, &lo, &hi); cout << lo << \" \" << hi;"),
  dyc1: Q("", "int n; cin >> n; int* a = new int[n]; for (int i = 0; i < n; i++) cin >> a[i]; for (int i = n - 1; i >= 0; i--) cout << a[i] << \" \"; delete[] a;"),
  rc1: Q("struct Student { string name; double gpa; };", "Student st[3]; double s = 0; for (int i = 0; i < 3; i++) { cin >> st[i].name >> st[i].gpa; s += st[i].gpa; } cout << s / 3;"),
  rc2: Q("struct Person { string name; int age; };", "int n; Person p[5]; cin >> n; int b = 0; for (int i = 0; i < n; i++) { cin >> p[i].name >> p[i].age; if (p[i].age > p[b].age) b = i; } cout << p[b].name;"),
  d1c1: Q("struct Node { int data; Node* next; }; int maxNode(Node* h) { int m = h->data; for (Node* p = h; p; p = p->next) if (p->data > m) m = p->data; return m; }", "Node* head = nullptr; int n, x; cin >> n; for (int i = 0; i < n; i++) { cin >> x; Node* t = new Node; t->data = x; t->next = head; head = t; } cout << maxNode(head);"),
  d2c1: Q("struct Node { int data; Node* next; }; void insertEnd(Node*& h, int x) { Node* n = new Node; n->data = x; n->next = nullptr; if (!h) { h = n; return; } Node* p = h; while (p->next) p = p->next; p->next = n; } void printList(Node* head) { for (Node* p = head; p != nullptr; p = p->next) cout << p->data << \" \"; cout << endl; }", "Node* head = nullptr; int n, x; cin >> n; for (int i = 0; i < n; i++) { cin >> x; insertEnd(head, x); } printList(head);"),
  d3c1: Q("struct Node { int data; Node* next; };void insertFront(Node*& head, int x) { Node* n = new Node; n->data = x; n->next = head; head = n; } int countValue(Node* h, int x) { int c = 0; for (Node* p = h; p; p = p->next) if (p->data == x) c++; return c; }", "Node* head = nullptr; int n, v, x; cin >> n; for (int i = 0; i < n; i++) { cin >> v; insertFront(head, v); } cin >> x; cout << countValue(head, x);"),
  d3c2: Q("struct Node { int data; Node* next; };void insertFront(Node*& head, int x) { Node* n = new Node; n->data = x; n->next = head; head = n; } void removeLast(Node*& h) { if (!h) return; if (!h->next) { delete h; h = nullptr; return; } Node* p = h; while (p->next->next) p = p->next; delete p->next; p->next = nullptr; } void printList(Node* head) { for (Node* p = head; p != nullptr; p = p->next) cout << p->data << \" \"; cout << endl; }", "Node* head = nullptr; int n, v; cin >> n; for (int i = 0; i < n; i++) { cin >> v; insertFront(head, v); } removeLast(head); printList(head);"),
  d4c1: Q("struct Node { int data; Node* next; }; int circularLength(Node* h) { int c = 1; Node* p = h->next; while (p != h) { c++; p = p->next; } return c; }", "int n; cin >> n; Node* head = new Node; head->data = 1; Node* last = head; for (int i = 2; i <= n; i++) { Node* t = new Node; t->data = i; last->next = t; last = t; } last->next = head; cout << circularLength(head);"),
  d5c1: Q("int st[20]; int top = -1; void push(int x) { st[++top] = x; } int pop() { return st[top--]; }", "int n, x; cin >> n; for (int i = 0; i < n; i++) { cin >> x; push(x); } while (top != -1) cout << pop() << \" \";"),
  d6c1: Q("const int MAX = 4; struct Queue { int items[MAX]; int front = 0; int rear = -1; int count = 0; }; void enqueue(Queue &q, int x) { q.rear = (q.rear + 1) % MAX; q.items[q.rear] = x; q.count++; } int dequeue(Queue &q) { int x = q.items[q.front]; q.front = (q.front + 1) % MAX; q.count--; return x; }", "Queue q; int x, k; for (int i = 0; i < 4; i++) { cin >> x; enqueue(q, x); } cin >> k; for (int i = 0; i < k; i++) enqueue(q, dequeue(q)); while (q.count > 0) cout << dequeue(q) << \" \";"),
  d7c1: Q("int power(int b, int e) { if (e == 0) return 1; return b * power(b, e - 1); }", "int b, e; cin >> b >> e; cout << power(b, e);"),
  d7c2: Q("int digitSum(int n) { if (n < 10) return n; return n % 10 + digitSum(n / 10); }", "int n; cin >> n; cout << digitSum(n);"),
  d8c1: Q("struct Node { int key; Node* left; Node* right; };Node* insert(Node* r, int k) { if (r == nullptr) { Node* n = new Node; n->key = k; n->left = nullptr; n->right = nullptr; return n; } if (k < r->key) r->left = insert(r->left, k); else r->right = insert(r->right, k); return r; } int countNodes(Node* r) { if (!r) return 0; return 1 + countNodes(r->left) + countNodes(r->right); }", "Node* root = nullptr; int n, x; cin >> n; for (int i = 0; i < n; i++) { cin >> x; root = insert(root, x); } cout << countNodes(root);"),
  d8c2: Q("struct Node { int key; Node* left; Node* right; };Node* insert(Node* r, int k) { if (r == nullptr) { Node* n = new Node; n->key = k; n->left = nullptr; n->right = nullptr; return n; } if (k < r->key) r->left = insert(r->left, k); else r->right = insert(r->right, k); return r; } int countLeaves(Node* r) { if (!r) return 0; if (!r->left && !r->right) return 1; return countLeaves(r->left) + countLeaves(r->right); }", "Node* root = nullptr; int n, x; cin >> n; for (int i = 0; i < n; i++) { cin >> x; root = insert(root, x); } cout << countLeaves(root);"),
  d9c1: Q("", "int a[5]; for (int i = 0; i < 5; i++) cin >> a[i]; for (int i = 0; i < 4; i++) for (int j = 0; j < 4 - i; j++) if (a[j] < a[j + 1]) { int t = a[j]; a[j] = a[j + 1]; a[j + 1] = t; } for (int i = 0; i < 5; i++) cout << a[i] << \" \";"),
  d10c1: Q("int bs(int a[], int lo, int hi, int k) { if (lo > hi) return -1; int m = (lo + hi) / 2; if (a[m] == k) return m; if (a[m] < k) return bs(a, m + 1, hi, k); return bs(a, lo, m - 1, k); }", "int a[7] = {1, 3, 5, 7, 9, 11, 13}; int k; cin >> k; cout << bs(a, 0, 6, k);"),
  ec3: P('int n, x, mx, neg = 0; cin >> n; for (int i = 1; i <= n; i++) { cin >> x; if (i == 1 || x > mx) mx = x; if (x < 0) neg++; } cout << mx << " " << neg;'),
};
const norm = (s) => s.replace(/\r/g, '').split('\n').map((l) => l.replace(/\s+$/, '')).join('\n').replace(/\n+$/, '');
let bad = 0;
for (const L of window.FS_LESSONS) {
  for (const x of L.examples) {
    const r = runAll(x.code, x.input || '');
    console.log(`[${x.id}] ${r.error ? 'ERROR line ' + r.line + ': ' + r.error.replace(/<[^>]+>/g, '') : JSON.stringify(r.output)}`);
  }
  for (const c of L.challenges) {
    const starter = runAll(c.code, c.tests[0].input);
    if (starter.error && !/غير معرَّفة|غير معرف/.test(starter.error)) { bad++; console.log(`  starter ${c.id} does not compile: ${starter.error}`); }
    if (!REF[c.id]) { bad++; console.log('  no reference for', c.id); continue; }
    for (const t of c.tests) {
      const r = runAll(REF[c.id], t.input);
      if (r.error || norm(r.output) !== norm(t.output)) { bad++; console.log(`  REF FAIL ${c.id}`, JSON.stringify(t), JSON.stringify(r)); }
    }
  }
}
console.log(bad ? `${bad} problems` : 'all challenge tests pass with reference solutions');
