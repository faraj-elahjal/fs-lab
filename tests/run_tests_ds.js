// node site/tests/run_tests_ds.js — strings, char arrays, pointers, new/delete, struct, linked structures
require('../js/interpreter.js');
const { runAll, compile, Interp } = globalThis.FSCpp;
const H = '#include <iostream>\n#include <string>\n#include <cstring>\nusing namespace std;\n';
const M = (b) => H + 'int main() {\n' + b + '\nreturn 0;\n}';
const cases = [
  // strings
  ['string ops', M('string s = "Hello"; s = s + " FS"; cout << s << " " << s.length() << " " << s[1] << endl; s[0] = \'J\'; cout << s;'), '', 'Hello FS 8 e\nJello FS'],
  ['substr find', M('string s = "programming"; cout << s.substr(0, 7) << " " << s.find("gram") << " " << s.find("xyz");'), '', 'program 3 -1'],
  ['count vowels', M('string s; cin >> s; int c = 0; for (int i = 0; i < s.length(); i++) if (s[i] == \'a\' || s[i] == \'e\' || s[i] == \'i\' || s[i] == \'o\' || s[i] == \'u\') c++; cout << c;'), 'education', '5'],
  ['getline', M('string name; getline(cin, name); cout << "Hi " << name;'), 'Faraj Ahjal', 'Hi Faraj Ahjal'],
  ['getline after cin', M('int age; string name; cin >> age; cin.ignore(); getline(cin, name); cout << name << " " << age;'), '20\nAli Omar', 'Ali Omar 20'],
  ['compare strings', M('string a = "abc", b = "abd"; if (a < b) cout << "less"; else cout << "not";'), '', 'less'],
  ['toupper', M('string s = "fs lab"; for (int i = 0; i < s.length(); i++) s[i] = toupper(s[i]); cout << s;'), '', 'FS LAB'],
  ['reverse string', M('string s = "abc", r = ""; for (int i = s.length() - 1; i >= 0; i--) r += s[i]; cout << r;'), '', 'cba'],
  // char arrays
  ['char array', M('char name[10] = "Ali"; cout << name << " " << strlen(name) << endl; strcat(name, "Ko"); cout << name; char b[10]; strcpy(b, name); cout << " " << strcmp(b, name);'), '', 'Ali 3\nAliKo 0'],
  ['cin char array', M('char w[20]; cin >> w; int n = 0; while (w[n] != \'\\0\') n++; cout << n;'), 'hello', '5'],
  // pointers
  ['pointer basics', M('int x = 5; int* p = &x; *p = 10; cout << x << " " << *p;'), '', '10 10'],
  ['pointer arithmetic', M('int a[4] = {3, 6, 9, 12}; int* p = a; cout << *(p + 2) << " "; p++; cout << *p << " " << p[1];'), '', '9 6 9'],
  ['pointer loop', M('int a[3] = {1, 2, 3}; int s = 0; for (int* p = a; p < a + 3; p++) s += *p; cout << s;'), '', '6'],
  ['swap pointers', H + 'void sw(int* a, int* b) { int t = *a; *a = *b; *b = t; }\nint main() { int x = 1, y = 2; sw(&x, &y); cout << x << y; }', '', '21'],
  ['new delete', M('int* p = new int; *p = 42; cout << *p; delete p; p = nullptr; if (p == nullptr) cout << " null";'), '', '42 null'],
  ['dynamic array', M('int n = 4; int* a = new int[n]; for (int i = 0; i < n; i++) a[i] = i * i; cout << a[3]; delete[] a;'), '', '9'],
  // struct
  ['struct', H + 'struct Student { string name; int age; double gpa; };\nint main() { Student s = {"Ali", 20, 3.5}; s.age++; cout << s.name << " " << s.age << " " << s.gpa; }', '', 'Ali 21 3.5'],
  ['struct array', H + 'struct P { int x, y; };\nint main() { P pts[3] = {{1, 2}, {3, 4}, {5, 6}}; int s = 0; for (int i = 0; i < 3; i++) s += pts[i].x * pts[i].y; cout << s; }', '', '44'],
  ['struct by ref', H + 'struct A { int v; };\nvoid inc(A &a) { a.v++; }\nvoid incV(A a) { a.v++; }\nint main() { A a = {1}; inc(a); incV(a); cout << a.v; }', '', '2'],
  ['struct pointer', H + 'struct A { int v; };\nint main() { A a = {7}; A* p = &a; p->v = 9; cout << a.v << (*p).v; }', '', '99'],
  ['struct copy', H + 'struct A { int v; };\nint main() { A a = {1}; A b = a; b.v = 5; cout << a.v << b.v; }', '', '15'],
  // linked list
  ['linked list', H + 'struct Node { int data; Node* next; };\nvoid push(Node*& head, int x) { Node* n = new Node; n->data = x; n->next = head; head = n; }\nvoid print(Node* head) { for (Node* p = head; p != nullptr; p = p->next) cout << p->data << " "; }\nint main() { Node* head = nullptr; push(head, 3); push(head, 2); push(head, 1); print(head); }', '', '1 2 3 '],
  ['append tail + count', H + 'struct Node { int data; Node* next; };\nNode* append(Node* head, int x) { Node* n = new Node{x, nullptr}; if (!head) return n; Node* p = head; while (p->next) p = p->next; p->next = n; return head; }\nint count(Node* h) { if (h == nullptr) return 0; return 1 + count(h->next); }\nint main() { Node* h = nullptr; for (int i = 1; i <= 4; i++) h = append(h, i * 10); cout << count(h) << " " << h->next->next->data; }', '', '4 30'],
  ['delete node', H + 'struct Node { int data; Node* next; };\nvoid removeVal(Node*& head, int x) { if (!head) return; if (head->data == x) { Node* t = head; head = head->next; delete t; return; } Node* p = head; while (p->next && p->next->data != x) p = p->next; if (p->next) { Node* t = p->next; p->next = t->next; delete t; } }\nint main() { Node* h = nullptr; for (int i = 4; i >= 1; i--) { Node* n = new Node; n->data = i; n->next = h; h = n; } removeVal(h, 3); removeVal(h, 1); for (Node* p = h; p; p = p->next) cout << p->data; }', '', '24'],
  ['doubly', H + 'struct Node { int data; Node* prev; Node* next; };\nint main() { Node* a = new Node{1, nullptr, nullptr}; Node* b = new Node{2, a, nullptr}; a->next = b; Node* c = new Node{3, b, nullptr}; b->next = c; for (Node* p = c; p; p = p->prev) cout << p->data; }', '', '321'],
  // stack and queue
  ['stack array', H + 'const int MAX = 5;\nint st[MAX]; int top = -1;\nvoid push(int x) { if (top == MAX - 1) { cout << "full "; return; } st[++top] = x; }\nint pop() { if (top == -1) { cout << "empty "; return -1; } return st[top--]; }\nint main() { push(1); push(2); push(3); cout << pop() << pop() << " "; push(9); cout << pop() << pop(); }', '', '32 91'],
  ['stack linked', H + 'struct Node { int data; Node* next; };\nNode* top = nullptr;\nvoid push(int x) { Node* n = new Node; n->data = x; n->next = top; top = n; }\nint pop() { Node* t = top; int v = t->data; top = top->next; delete t; return v; }\nint main() { for (int i = 1; i <= 3; i++) push(i); while (top != nullptr) cout << pop(); }', '', '321'],
  ['queue circular', H + 'struct Queue { int items[4]; int front = 0; int rear = -1; int count = 0; };\nvoid enqueue(Queue &q, int x) { if (q.count == 4) return; q.rear = (q.rear + 1) % 4; q.items[q.rear] = x; q.count++; }\nint dequeue(Queue &q) { int v = q.items[q.front]; q.front = (q.front + 1) % 4; q.count--; return v; }\nint main() { Queue q; for (int i = 1; i <= 4; i++) enqueue(q, i); cout << dequeue(q) << dequeue(q); enqueue(q, 5); enqueue(q, 6); while (q.count > 0) cout << dequeue(q); }', '', '123456'],
  ['queue linked', H + 'struct Node { int data; Node* next; };\nstruct Queue { Node* front = nullptr; Node* rear = nullptr; };\nvoid enqueue(Queue &q, int x) { Node* n = new Node{x, nullptr}; if (q.rear == nullptr) { q.front = q.rear = n; } else { q.rear->next = n; q.rear = n; } }\nint dequeue(Queue &q) { Node* t = q.front; int v = t->data; q.front = t->next; if (q.front == nullptr) q.rear = nullptr; delete t; return v; }\nint main() { Queue q; enqueue(q, 7); enqueue(q, 8); enqueue(q, 9); cout << dequeue(q) << dequeue(q) << dequeue(q); }', '', '789'],
  // tree
  ['bst', H + 'struct Node { int key; Node* left; Node* right; };\nNode* insert(Node* r, int k) { if (r == nullptr) { Node* n = new Node; n->key = k; n->left = n->right = nullptr; return n; } if (k < r->key) r->left = insert(r->left, k); else r->right = insert(r->right, k); return r; }\nvoid inorder(Node* r) { if (!r) return; inorder(r->left); cout << r->key << " "; inorder(r->right); }\nint height(Node* r) { if (!r) return 0; return 1 + max(height(r->left), height(r->right)); }\nbool search(Node* r, int k) { if (!r) return false; if (r->key == k) return true; return k < r->key ? search(r->left, k) : search(r->right, k); }\nint main() { Node* root = nullptr; int a[] = {50, 30, 70, 20, 40, 60}; for (int i = 0; i < 6; i++) root = insert(root, a[i]); inorder(root); cout << height(root) << search(root, 60) << search(root, 65); }', '', '20 30 40 50 60 70 310'],
  // sorting and searching
  ['bubble', M('int a[5] = {5, 1, 4, 2, 8}; for (int i = 0; i < 4; i++) for (int j = 0; j < 4 - i; j++) if (a[j] > a[j + 1]) { int t = a[j]; a[j] = a[j + 1]; a[j + 1] = t; } for (int i = 0; i < 5; i++) cout << a[i];'), '', '12458'],
  ['binary search', H + 'int bs(int a[], int n, int k) { int lo = 0, hi = n - 1; while (lo <= hi) { int mid = (lo + hi) / 2; if (a[mid] == k) return mid; if (a[mid] < k) lo = mid + 1; else hi = mid - 1; } return -1; }\nint main() { int a[] = {2, 5, 8, 12, 16, 23}; cout << bs(a, 6, 16) << bs(a, 6, 7); }', '', '4-1'],
  ['ref local var', M('int x = 3; int &r = x; r = 8; cout << x;'), '', '8'],
];
const errors = [
  ['null deref', M('int* p = nullptr; cout << *p;'), 6],
  ['dangling', M('int* p = new int; delete p; *p = 3;'), 6],
  ['uninit ptr', M('int* p; *p = 3;'), 6],
  ['arrow on struct', H + 'struct A { int v; };\nint main() { A a; a->v = 1; }', 6],
  ['dot on pointer', H + 'struct A { int v; };\nint main() { A* p = new A; p.v = 1; }', 6],
  ['no field', H + 'struct A { int v; };\nint main() { A a; a.w = 1; }', 6],
  ['string index', M('string s = "abc"; cout << s[5];'), 6],
  ['char overflow', M('char s[4]; strcpy(s, "hello");'), 6],
  ['double delete', M('int* p = new int; delete p; delete p;'), 6],
];
let pass = 0, fail = 0;
for (const [name, src, input, want] of cases) {
  const r = runAll(src, input);
  if (!r.error && r.output === want) pass++;
  else { fail++; console.log('FAIL', name, JSON.stringify(r).slice(0, 400), 'want', JSON.stringify(want)); }
}
for (const [name, src, line] of errors) {
  const r = runAll(src, '');
  if (r.error && r.line === line) pass++;
  else { fail++; console.log('FAIL(err)', name, JSON.stringify(r).slice(0, 300), 'want line', line); }
}
// structure snapshot sample: list after 3 pushes
const it = new Interp(compile(cases[21][1]));
let snap = null;
for (const ev of it.run()) { if (ev.line === 6 && ev.msg.includes('انتهت')) snap = it.snapshot(); }
const it2 = new Interp(compile(cases[29][1]));
let snap2 = null;
for (const ev of it2.run()) { if (ev.msg && ev.msg.includes('inorder')) { snap2 = it2.snapshot(); break; } }
console.log(JSON.stringify((snap2 || {}).structures).slice(0, 600));
console.log(`${pass} passed, ${fail} failed`);
