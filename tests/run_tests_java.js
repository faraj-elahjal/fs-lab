// node site/tests/run_tests_java.js — Java interpreter: programs vs expected output (or expected error)
globalThis.window = globalThis;
require('../js/java.js');
const { runAll, compile, Interp } = globalThis.FSJava;
const M = (body, extra) => `${extra || ''}\npublic class Main {\n  public static void main(String[] args) {\n${body}\n  }\n}`;
const cases = [
  ['hello', M('System.out.println("Hello World !");'), '', 'Hello World !'],
  ['arith', M('int a = 7, b = 2; System.out.println(a / b); System.out.println(a % b); System.out.println(a / 2.0); double d = 10; System.out.println(d); System.out.println(1.0 / 3);'), '', '3\n1\n3.5\n10.0\n0.3333333333333333'],
  ['concat', M('int x = 5; System.out.println("x = " + x); System.out.println(1 + 2 + "a" + 1 + 2); char c = \'A\'; System.out.println(c + 1); System.out.println("" + c + 1);'), '', 'x = 5\n3a12\n66\nA1'],
  ['class basic', M('Student s = new Student("Ali", 20); s.show(); System.out.println(s.getName());', 'class Student { private String name; private int age; public Student(String name, int age) { this.name = name; this.age = age; } public String getName() { return name; } public void show() { System.out.println(name + " " + age); } }'), '', 'Ali 20\nAli'],
  ['default ctor + defaults', M('Box b = new Box(); System.out.println(b.n + " " + b.s + " " + b.f);', 'class Box { int n; String s; boolean f; }'), '', '0 null false'],
  ['ctor overloading + this()', M('Rect a = new Rect(); Rect b = new Rect(4); Rect c = new Rect(2, 3); System.out.println(a.area() + " " + b.area() + " " + c.area());', 'class Rect { int w, h; Rect() { this(1, 1); } Rect(int s) { this(s, s); } Rect(int w, int h) { this.w = w; this.h = h; } int area() { return w * h; } }'), '', '1 16 6'],
  ['reference aliasing', M('P a = new P(); a.x = 1; P b = a; b.x = 9; System.out.println(a.x); P c = new P(); System.out.println(a == b); System.out.println(a == c);', 'class P { int x; }'), '', '9\ntrue\nfalse'],
  ['static counter', M('new C(); new C(); C k = new C(); System.out.println(C.count + " " + k.id); System.out.println(C.twice(4));', 'class C { static int count = 0; int id; C() { count++; id = count; } static int twice(int x) { return 2 * x; } }'), '', '3 3\n8'],
  ['inheritance + super', M('Dog d = new Dog("Rex"); d.speak(); System.out.println(d.getName());', 'class Animal { protected String name; Animal(String n) { name = n; System.out.println("Animal ctor"); } String getName() { return name; } void speak() { System.out.println("..."); } }\nclass Dog extends Animal { Dog(String n) { super(n); System.out.println("Dog ctor"); } void speak() { super.speak(); System.out.println(name + " says Woof"); } }'), '', 'Animal ctor\nDog ctor\n...\nRex says Woof\nRex'],
  ['polymorphism', M('Shape[] arr = { new Circle(1), new Square(2) }; for (Shape s : arr) System.out.printf("%.2f%n", s.area());', 'abstract class Shape { abstract double area(); }\nclass Circle extends Shape { double r; Circle(double r) { this.r = r; } double area() { return Math.PI * r * r; } }\nclass Square extends Shape { double a; Square(double a) { this.a = a; } double area() { return a * a; } }'), '', '3.14\n4.00'],
  ['interface', M('Payable p = new Emp(1000); System.out.println(p.pay()); p.info();', 'interface Payable { double RATE = 0.1; double pay(); default void info() { System.out.println("payable"); } }\nclass Emp implements Payable { double s; Emp(double s) { this.s = s; } public double pay() { return s - s * RATE; } }'), '', '900.0\npayable'],
  ['toString', M('Pt p = new Pt(1, 2); System.out.println(p); System.out.println("p = " + p);', 'class Pt { int x, y; Pt(int x, int y) { this.x = x; this.y = y; } public String toString() { return "(" + x + ", " + y + ")"; } }'), '', '(1, 2)\np = (1, 2)'],
  ['equals override', M('T a = new T("A", 1), b = new T("A", 1); System.out.println(a == b); System.out.println(a.equals(b));', 'class T { String n; int k; T(String n, int k) { this.n = n; this.k = k; } public boolean equals(Object o) { T t = (T) o; return n.equals(t.n) && k == t.k; } }'), '', 'false\ntrue'],
  ['string methods', M('String s = "Hello World"; System.out.println(s.length() + " " + s.charAt(4) + " " + s.toUpperCase() + " " + s.substring(6) + " " + s.indexOf("o") + " " + s.contains("World"));'), '', '11 o HELLO WORLD World 4 true'],
  ['string ==', M('String a = "hi"; String b = "hi"; String c = new String("hi"); System.out.println(a == b); System.out.println(a == c); System.out.println(a.equals(c));'), '', 'true\nfalse\ntrue'],
  ['scanner', M('Scanner sc = new Scanner(System.in); int n = sc.nextInt(); String w = sc.next(); double d = sc.nextDouble(); System.out.println(n * 2 + " " + w + " " + d);', 'import java.util.Scanner;'), '21 Ali 2.5', '42 Ali 2.5'],
  ['scanner nextLine', M('Scanner sc = new Scanner(System.in); int n = sc.nextInt(); sc.nextLine(); String line = sc.nextLine(); System.out.println(n + ":" + line);', 'import java.util.*;'), '5\nAli Omar', '5:Ali Omar'],
  ['arrays', M('int[] a = new int[4]; for (int i = 0; i < a.length; i++) a[i] = i * i; int s = 0; for (int x : a) s += x; System.out.println(s + " " + a.length); int[][] m = {{1, 2}, {3, 4, 5}}; System.out.println(m[1].length + " " + m[1][2]); System.out.println(java.util.Arrays.toString(a));'), '', '14 4\n3 5\n[0, 1, 4, 9]'],
  ['arraylist', M('ArrayList<String> l = new ArrayList<>(); l.add("a"); l.add("b"); l.add(0, "z"); System.out.println(l + " " + l.size() + " " + l.get(1)); l.remove("a"); System.out.println(l); for (String x : l) System.out.print(x); System.out.println();', 'import java.util.ArrayList;'), '', '[z, a, b] 3 a\n[z, b]\nzb'],
  ['linkedlist', M('LinkedList<String> c = new LinkedList<>(); c.add("Tripoli"); c.addFirst("Zliten"); c.addLast("Sabha"); System.out.println(c.getFirst() + " " + c.getLast() + " " + c);', 'import java.util.LinkedList;'), '', 'Zliten Sabha [Zliten, Tripoli, Sabha]'],
  ['list of objects', M('ArrayList<St> l = new ArrayList<>(); l.add(new St("A", 90)); l.add(new St("B", 70)); double s = 0; for (St x : l) s += x.mark; System.out.println(s / l.size());', 'import java.util.ArrayList;\nclass St { String n; int mark; St(String n, int m) { this.n = n; mark = m; } }'), '', '80.0'],
  ['generics', M('Box<Integer> b = new Box<>(5); Box<String> c = new Box<>("x"); System.out.println(b.get() + 1); System.out.println(c.get()); Pair<String, Integer> p = new Pair<>("a", 1); System.out.println(p.k + p.v); show(new Integer[]{1, 2});', 'class Box<T> { private T v; Box(T v) { this.v = v; } T get() { return v; } }\nclass Pair<K, V> { K k; V v; Pair(K k, V v) { this.k = k; this.v = v; } }'), '', '6\nx\na1\n12'],
  ['enum', M('Day d = Day.TUE; System.out.println(d + " " + d.ordinal() + " " + d.name()); for (Day x : Day.values()) System.out.print(x + " "); System.out.println(); switch (d) { case MON: System.out.println("m"); break; case TUE: System.out.println("t"); break; default: System.out.println("?"); }', 'enum Day { MON, TUE, WED }'), '', 'TUE 1 TUE\nMON TUE WED \nt'],
  ['enum fields', M('System.out.println(Planet.EARTH.getMass() + " " + Planet.MARS);', 'enum Planet { EARTH(5.97), MARS(0.642); private final double mass; Planet(double m) { mass = m; } double getMass() { return mass; } }'), '', '5.97 MARS'],
  ['instanceof + cast', M('Animal a = new Dog(); if (a instanceof Dog) { Dog d = (Dog) a; d.bark(); } System.out.println(a instanceof Animal);', 'class Animal { }\nclass Dog extends Animal { void bark() { System.out.println("Woof"); } }'), '', 'Woof\ntrue'],
  ['exceptions', M('try { int x = 5 / 0; } catch (ArithmeticException e) { System.out.println("Error: " + e.getMessage()); } finally { System.out.println("done"); } try { int[] a = new int[2]; a[3] = 1; } catch (Exception e) { System.out.println(e); }'), '', 'Error: / by zero\ndone\njava.lang.ArrayIndexOutOfBoundsException: Index 3 out of bounds for length 2'],
  ['custom exception', M('try { check(-5); } catch (BadAge e) { System.out.println(e.getMessage()); }', 'class BadAge extends Exception { BadAge(String m) { super(m); } }\nclass U { }'), '', 'ERR'],
  ['overloading', M('System.out.println(add(1, 2) + " " + add(1.5, 2) + " " + add(1, 2, 3) + " " + add("a", "b"));'), '', '3 3.5 6 ab'],
  ['aggregation', M('Dept d = new Dept("IT"); Emp e1 = new Emp("Ali"); d.add(e1); d.add(new Emp("Omar")); System.out.println(d.name + " " + d.list.size() + " " + d.list.get(1).name);', 'import java.util.ArrayList;\nclass Emp { String name; Emp(String n) { name = n; } }\nclass Dept { String name; ArrayList<Emp> list = new ArrayList<>(); Dept(String n) { name = n; } void add(Emp e) { list.add(e); } }'), '', 'IT 2 Omar'],
  ['printf', M('System.out.printf("%d %5.2f %s|%-4s|%n", 7, 3.14159, "ok", "ab"); System.out.println(String.format("%03d", 5));'), '', '7  3.14 ok|ab  |\n005'],
  ['comparable sort', M('ArrayList<S> l = new ArrayList<>(); l.add(new S(3)); l.add(new S(1)); l.add(new S(2)); Collections.sort(l); for (S x : l) System.out.print(x.v); System.out.println(); int[] a = {3, 1, 2}; Arrays.sort(a); System.out.println(Arrays.toString(a));', 'import java.util.*;\nclass S implements Comparable<S> { int v; S(int v) { this.v = v; } public int compareTo(S o) { return v - o.v; } }'), '', '123\n[1, 2, 3]'],
  ['multilevel', M('C c = new C(); c.who();', 'class A { A() { System.out.println("A"); } void who() { System.out.println("I am A"); } }\nclass B extends A { B() { System.out.println("B"); } }\nclass C extends B { C() { System.out.println("C"); } }'), '', 'A\nB\nC\nI am A'],
  ['default object toString', M('Q q = new Q(); String s = "" + q; System.out.println(s.startsWith("Q@"));', 'class Q { }'), '', 'true'],
  ['while/do/switch/string', M('int i = 0; do { i += 3; } while (i < 10); System.out.println(i); String op = "+"; switch (op) { case "+": System.out.println("plus"); break; default: System.out.println("other"); }'), '', '12\nplus'],
  ['ternary + math', M('int a = 4, b = 9; System.out.println(a > b ? a : b); System.out.println(Math.max(a, b) + " " + Math.sqrt(b) + " " + Math.pow(2, 10) + " " + Math.abs(-3) + " " + Math.round(2.5));'), '', '9\n9 3.0 1024.0 3 3'],
  ['char/int casts', M('char c = \'a\'; c++; int k = c; System.out.println(c + " " + k + " " + (char) (k + 1) + " " + (int) 3.99 + " " + (double) 7 / 2);'), '', 'b 98 c 3 3.5'],
];
// fix custom exception case program
cases.find((c) => c[0] === 'custom exception')[1] = M('try { check(-5); } catch (BadAge e) { System.out.println(e.getMessage()); }') .replace('public class Main {', 'class BadAge extends Exception { BadAge(String m) { super(m); } }\npublic class Main {\n  static void check(int a) throws BadAge { if (a < 0) throw new BadAge("ERR"); }');
cases.find((c) => c[0] === 'overloading')[1] = M('System.out.println(add(1, 2) + " " + add(1.5, 2) + " " + add(1, 2, 3) + " " + add("a", "b"));').replace('public class Main {', 'public class Main {\n  static int add(int a, int b) { return a + b; }\n  static double add(double a, double b) { return a + b; }\n  static int add(int a, int b, int c) { return a + b + c; }\n  static String add(String a, String b) { return a + b; }');
cases.find((c) => c[0] === 'generics')[1] = cases.find((c) => c[0] === 'generics')[1].replace('public class Main {', 'public class Main {\n  static <T> void show(T[] a) { for (T x : a) System.out.print(x); System.out.println(); }');

const errors = [
  ['private access', M('Acc a = new Acc(); a.bal = 5;', 'class Acc { private int bal; }'), 'private'],
  ['abstract new', M('Sh s = new Sh();', 'abstract class Sh { }'), 'المجرد'],
  ['interface new', M('I x = new I();', 'interface I { void f(); }'), 'الواجهة'],
  ['final var', M('final int x = 5; x = 6;'), 'final'],
  ['final method', M('', 'class A { final void f() { } }\nclass B extends A { void f() { } }'), 'final'],
  ['final class', M('', 'final class A { }\nclass B extends A { }'), 'final'],
  ['missing abstract impl', M('', 'abstract class A { abstract void f(); }\nclass B extends A { }'), 'abstract'],
  ['static ctx', M('', 'class X { int v; static void f() { v = 1; } }').replace('public class Main {', 'public class Main {\n  int y;\n  static void g() { y = 2; }'), null],
  ['return type overload', M('', 'class A { int f(int x) { return x; } double f(int x) { return x; } }'), 'overloading'],
  ['no default ctor', M('A a = new A();', 'class A { A(int x) { } }'), 'default constructor'],
  ['multiple inheritance', M('', 'class A { }\nclass B { }\nclass C extends A, B { }'), null],
  ['uninitialized', M('int x; System.out.println(x);'), 'initialized'],
  ['lossy', M('float f = 152.12;'), 'lossy'],
  ['downcast needed', M('Animal a = new Dog(); a.bark();', 'class Animal { }\nclass Dog extends Animal { void bark() { } }'), 'التحويل'],
  ['npe', M('String s = null; System.out.println(s.length());'), 'NullPointerException'],
  ['class cast', M('Animal a = new Animal(); Dog d = (Dog) a;', 'class Animal { }\nclass Dog extends Animal { }'), 'ClassCastException'],
  ['missing semicolon', M('int x = 5\nSystem.out.println(x);'), ';'],
];
let pass = 0, fail = 0;
for (const [name, src, input, exp] of cases) {
  let r;
  try { r = runAll(src, input); } catch (e) { r = { error: 'JS: ' + e.stack }; }
  const out = (r.output || '').replace(/\s+$/, '');
  if (!r.error && out === exp) pass++;
  else { fail++; console.log(`✗ ${name}\n  expected: ${JSON.stringify(exp)}\n  got:      ${JSON.stringify(out)}${r.error ? '\n  error: ' + r.error + ' (line ' + r.line + ')' : ''}`); }
}
for (const [name, src, frag] of errors) {
  let r;
  try { r = runAll(src, ''); } catch (e) { r = { error: 'JS: ' + e.stack, js: true }; }
  if (r.error && !r.js && (!frag || r.error.includes(frag))) pass++;
  else { fail++; console.log(`✗ error case ${name}: ${r.error || 'no error, output ' + JSON.stringify(r.output)}`); }
}
// stepping: every program yields steps and a snapshot without throwing
for (const [name, src, input] of cases) {
  try {
    const it = new Interp(compile(src)); it.inbuf = input; it.eof = true;
    const g = it.run(); let k = 0;
    for (let r = g.next(); !r.done; r = g.next()) { it.snapshot(); if (++k > 5000) break; }
  } catch (e) { if (!(e instanceof globalThis.FSJava.JavaError)) { fail++; console.log(`✗ stepping ${name}: ${e.stack}`); } }
}
console.log(`${pass} passed, ${fail} failed`);
process.exitCode = fail ? 1 : 0;
