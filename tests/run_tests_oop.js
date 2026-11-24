// node site/tests/run_tests_oop.js — C++ classes (OOP): programs vs expected g++ output, plus expected errors
globalThis.window = globalThis;
require('../js/interpreter.js');
const { runAll, compile, Interp } = globalThis.FSCpp;
const H = '#include <iostream>\n#include <string>\nusing namespace std;\n';
const M = (classes, body) => `${H}\n${classes}\n\nint main() {\n${body}\n    return 0;\n}\n`;
const cases = [
  ['basic class', M(`class Car {
public:
    string model;
    int year;
    void show() { cout << model << " - " << year << endl; }
};`, `Car c; c.model = "Kia"; c.year = 2020; c.show();`), '', 'Kia - 2020'],
  ['ctor + private + getter', M(`class Student {
private:
    string name;
    int age;
public:
    Student(string n, int a) { name = n; age = a; }
    string getName() { return name; }
    int getAge() const { return age; }
};`, `Student s("Ali", 20); cout << s.getName() << " " << s.getAge() << endl;`), '', 'Ali 20'],
  ['init list + this', M(`class P {
    int x, y;
public:
    P(int x, int y) : x(x), y(0) { this->y = y; }
    int sum() { return this->x + y; }
};`, `P p(3, 4); cout << p.sum();`), '', '7'],
  ['overloaded ctors + default', M(`class Rect {
    int w, h;
public:
    Rect() { w = 1; h = 1; }
    Rect(int s) { w = s; h = s; }
    Rect(int a, int b) { w = a; h = b; }
    int area() { return w * h; }
};`, `Rect a; Rect b(4); Rect c(2, 5); cout << a.area() << " " << b.area() << " " << c.area();`), '', '1 16 10'],
  ['default args ctor', M(`class Box {
    int v;
public:
    Box(int v = 7) : v(v) {}
    int get() { return v; }
};`, `Box a; Box b(2); cout << a.get() << b.get();`), '', '72'],
  ['out-of-class definitions', M(`class Counter {
    int n;
public:
    Counter();
    void inc();
    int get() const;
};
Counter::Counter() : n(0) {}
void Counter::inc() { n++; }
int Counter::get() const { return n; }`, `Counter c; c.inc(); c.inc(); cout << c.get();`), '', '2'],
  ['destructor order', M(`class T {
    string n;
public:
    T(string s) : n(s) { cout << "ctor " << n << endl; }
    ~T() { cout << "dtor " << n << endl; }
};`, `T a("a");
{ T b("b"); }
T c("c");`), '', 'ctor a\nctor b\ndtor b\nctor c\ndtor c\ndtor a'],
  ['static member', M(`class C {
public:
    static int count;
    C() { count++; }
    static int get() { return count; }
};
int C::count = 0;`, `C a; C b; C c; cout << C::count << " " << C::get() << " " << a.count;`), '', '3 3 3'],
  ['inheritance + ctor order', M(`class A {
public:
    A() { cout << "A "; }
    ~A() { cout << "~A "; }
};
class B : public A {
public:
    B() { cout << "B "; }
    ~B() { cout << "~B "; }
};`, `{ B b; }
cout << endl;`), '', 'A B ~B ~A'],
  ['base ctor with args + protected', M(`class Person {
protected:
    string name;
public:
    Person(string n) : name(n) {}
    void hi() { cout << "I am " << name << endl; }
};
class Student : public Person {
    double gpa;
public:
    Student(string n, double g) : Person(n), gpa(g) {}
    void show() { cout << name << " " << gpa << endl; }
};`, `Student s("Sara", 3.5); s.hi(); s.show();`), '', 'I am Sara\nSara 3.5'],
  ['virtual polymorphism', M(`class Shape {
public:
    virtual double area() { return 0; }
    virtual ~Shape() {}
};
class Circle : public Shape {
    double r;
public:
    Circle(double r) : r(r) {}
    double area() override { return 3.14 * r * r; }
};
class Sq : public Shape {
    double a;
public:
    Sq(double a) : a(a) {}
    double area() override { return a * a; }
};`, `Shape* arr[2] = { new Circle(1), new Sq(2) };
for (int i = 0; i < 2; i++) cout << arr[i]->area() << endl;
for (int i = 0; i < 2; i++) delete arr[i];`), '', '3.14\n4'],
  ['non-virtual hides', M(`class A {
public:
    void f() { cout << "A::f" << endl; }
    virtual void g() { cout << "A::g" << endl; }
};
class B : public A {
public:
    void f() { cout << "B::f" << endl; }
    void g() { cout << "B::g" << endl; }
};`, `B b; A* p = &b; p->f(); p->g(); A& r = b; r.f(); r.g();`), '', 'A::f\nB::g\nA::f\nB::g'],
  ['pure virtual / abstract', M(`class Animal {
public:
    virtual string sound() = 0;
    void speak() { cout << sound() << endl; }
};
class Dog : public Animal {
public:
    string sound() { return "Woof"; }
};
class Cat : public Animal {
public:
    string sound() { return "Meow"; }
};`, `Dog d; Cat c; d.speak(); c.speak(); Animal* a = &c; a->speak();`), '', 'Woof\nMeow\nMeow'],
  ['base method call', M(`class V {
public:
    virtual void info() { cout << "Vehicle" << endl; }
};
class Bus : public V {
public:
    void info() { V::info(); cout << "Bus" << endl; }
};`, `Bus b; b.info();`), '', 'Vehicle\nBus'],
  ['operator overloading', M(`class Pt {
public:
    int x, y;
    Pt(int x = 0, int y = 0) : x(x), y(y) {}
    Pt operator+(const Pt& o) const { return Pt(x + o.x, y + o.y); }
    bool operator==(const Pt& o) const { return x == o.x && y == o.y; }
};
ostream& operator<<(ostream& out, const Pt& p) {
    out << "(" << p.x << ", " << p.y << ")";
    return out;
}`, `Pt a(1, 2), b(3, 4);
Pt c = a + b;
cout << c << " " << (a == b) << " " << (c == Pt(4, 6)) << endl;
cout << a + b + c << endl;`), '', '(4, 6) 0 1\n(8, 12)'],
  ['friend function', M(`class Box {
    int secret;
public:
    Box(int s) : secret(s) {}
    friend void reveal(const Box& b);
};
void reveal(const Box& b) { cout << b.secret << endl; }`, `Box b(42); reveal(b);`), '', '42'],
  ['copy constructor', M(`class A {
public:
    int v;
    A(int v) : v(v) {}
    A(const A& o) : v(o.v + 100) { cout << "copy" << endl; }
};
void f(A a) { cout << a.v << endl; }`, `A x(1); A y = x; A z(x); f(x); cout << y.v << " " << z.v << endl;`), '', 'copy\ncopy\ncopy\n101\n101 101'],
  ['object copy is independent', M(`class P { public: int x; };`, `P a; a.x = 1; P b = a; b.x = 9; cout << a.x << b.x; P* p = &a; p->x = 5; cout << a.x;`), '', '195'],
  ['composition order', M(`class Engine {
public:
    Engine() { cout << "Engine "; }
    ~Engine() { cout << "~Engine "; }
};
class Car {
    Engine e;
public:
    Car() { cout << "Car "; }
    ~Car() { cout << "~Car "; }
};`, `{ Car c; }
cout << endl;`), '', 'Engine Car ~Car ~Engine'],
  ['new/delete object', M(`class N {
public:
    int v;
    N(int v) : v(v) { cout << "new " << v << endl; }
    ~N() { cout << "del " << v << endl; }
};`, `N* p = new N(5); cout << p->v << endl; delete p;`), '', 'new 5\n5\ndel 5'],
  ['virtual destructor missing', M(`class B { public: ~B() { cout << "~B" << endl; } };
class D : public B { public: ~D() { cout << "~D" << endl; } };`, `B* p = new D(); delete p;`), '', '~B'],
  ['virtual destructor', M(`class B { public: virtual ~B() { cout << "~B" << endl; } };
class D : public B { public: ~D() { cout << "~D" << endl; } };`, `B* p = new D(); delete p;`), '', '~D\n~B'],
  ['array of objects', M(`class S {
public:
    string n; int m;
    S() : n("?"), m(0) {}
    S(string n, int m) : n(n), m(m) {}
};`, `S arr[3] = { S("A", 90), S("B", 70) };
int t = 0; for (int i = 0; i < 3; i++) t += arr[i].m;
cout << t << " " << arr[2].n;`), '', '160 ?'],
  ['dynamic_cast', M(`class A { public: virtual ~A() {} };
class B : public A { public: void hi() { cout << "B!" << endl; } };`, `A* a = new B(); A* b = new A();
B* x = dynamic_cast<B*>(a); B* y = dynamic_cast<B*>(b);
if (x) x->hi();
cout << (y == nullptr) << endl;`), '', 'B!\n1'],
  ['function template', `${H}
template <typename T>
T maxOf(T a, T b) { return a > b ? a : b; }
int main() {
    cout << maxOf(3, 9) << " " << maxOf(2.5, 1.5) << " " << maxOf(string("ab"), string("b")) << endl;
    return 0;
}`, '', '9 2.5 b'],
  ['class template', `${H}
template <class T>
class Box {
    T val;
public:
    Box(T v) : val(v) {}
    T get() { return val; }
};
int main() {
    Box<int> a(5);
    Box<string> b("hi");
    cout << a.get() + 1 << " " << b.get() << endl;
    return 0;
}`, '', '6 hi'],
  ['multiple inheritance', M(`class Fly { public: void fly() { cout << "fly "; } };
class Swim { public: void swim() { cout << "swim "; } };
class Duck : public Fly, public Swim {};`, `Duck d; d.fly(); d.swim(); cout << endl;`), '', 'fly swim'],
  ['struct still works (P2)', M(`struct Node { int data; Node* next; };`, `Node* h = new Node{1, nullptr}; h->next = new Node{2, nullptr}; cout << h->data + h->next->data;`), '', '3'],
  ['plus-equals operator', M(`class Money {
public:
    int d;
    Money(int d) : d(d) {}
    Money& operator+=(const Money& o) { d += o.d; return *this; }
};`, `Money a(5), b(7); a += b; a += b; cout << a.d;`), '', '19'],
  ['input into object', M(`class P { public: string n; int a; };`, `P p; cin >> p.n >> p.a; cout << p.n << ":" << p.a;`), 'Ali 30', 'Ali:30'],
];
const errors = [
  ['private from main', M(`class A { int x; };`, `A a; a.x = 5;`), 'private'],
  ['protected from main', M(`class A { protected: int x; };`, `A a; a.x = 5;`), 'protected'],
  ['private base field in derived', M(`class A { int x; };
class B : public A { public: void f() { x = 1; } };`, `B b; b.f();`), 'private'],
  ['abstract object', M(`class S { public: virtual double area() = 0; };`, `S s;`), 'المجرد'],
  ['abstract not overridden', M(`class S { public: virtual double area() = 0; };
class C : public S { };`, `C c;`), 'المجرد'],
  ['no default ctor', M(`class A { public: A(int x) {} };`, `A a;`), 'default constructor'],
  ['most vexing parse', M(`class A { public: int v; };`, `A a();`), 'most vexing'],
  ['const method modifies', M(`class A { int v; public: void set() const { v = 1; } };`, `A a; a.set();`), 'const'],
  ['override nothing', M(`class A { public: void f() {} };
class B : public A { public: void f() override {} };`, ``), 'override'],
  ['static undefined', M(`class A { public: static int n; };`, `cout << A::n;`), 'خارج الكلاس'],
  ['static uses field', M(`class A { int v; public: static void f() { v = 2; } };`, `A::f();`), 'static'],
  ['child method via base ptr', M(`class A { public: virtual ~A() {} };
class B : public A { public: void hi() {} };`, `A* p = new B(); p->hi();`), 'dynamic_cast'],
  ['base to derived ptr', M(`class A { };
class B : public A { };`, `A* a = new A(); B* b = a;`), 'dynamic_cast'],
  ['return type only overload', M(`class A { public: int f() { return 1; } double f() { return 2; } };`, ``), 'overloading'],
  ['private inheritance', M(`class A { public: void f() {} };
class B : private A { };`, `B b; b.f();`), 'private'],
];
let pass = 0, fail = 0;
for (const [name, src, input, exp] of cases) {
  let r;
  try { r = runAll(src, input); } catch (e) { r = { error: 'JS: ' + e.stack }; }
  const out = (r.output || '').replace(/\s+$/, '');
  if (!r.error && out === exp) pass++;
  else { fail++; console.log(`✗ ${name}\n  expected: ${JSON.stringify(exp)}\n  got:      ${JSON.stringify(out)}${r.error ? '\n  error: ' + r.error.replace(/<[^>]+>/g, '') + ' (line ' + r.line + ')' : ''}`); }
}
for (const [name, src, frag] of errors) {
  let r;
  try { r = runAll(src, ''); } catch (e) { r = { error: 'JS: ' + e.stack, js: true }; }
  if (r.error && !r.js && r.error.includes(frag)) pass++;
  else { fail++; console.log(`✗ error case ${name}: ${r.error ? r.error.replace(/<[^>]+>/g, '').slice(0, 300) : 'no error, output ' + JSON.stringify(r.output)}`); }
}
for (const [name, src, input] of cases) {
  try {
    const it = new Interp(compile(src)); it.inbuf = input; it.eof = true;
    const g = it.run(); let k = 0;
    for (let r = g.next(); !r.done; r = g.next()) { it.snapshot(); if (++k > 5000) break; }
  } catch (e) { if (!(e instanceof globalThis.FSCpp.CppError)) { fail++; console.log(`✗ stepping ${name}: ${e.stack}`); } }
}
console.log(`${pass} passed, ${fail} failed`);
process.exitCode = fail ? 1 : 0;
