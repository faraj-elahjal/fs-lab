/* FS_Lab — Object-Oriented Programming in Java (البرمجة الشيئية OOP), following the Misrata IT faculty syllabus:
   classes & objects, constructors, encapsulation, static & overloading, inheritance, overriding & polymorphism,
   abstraction (abstract / interface), class relationships, generics & enums, arrays & collections, exam review. */
(function () {
const ind = (b, n) => b.replace(/^/gm, ' '.repeat(n)).replace(/^\s+$/gm, '');
const J = (classes, body, imp) => `${imp ? imp + '\n\n' : ''}${classes ? classes.trim() + '\n\n' : ''}public class Main {\n    public static void main(String[] args) {\n${ind(body.trim(), 8)}\n    }\n}\n`;
const SC = 'import java.util.Scanner;';
const AL = 'import java.util.ArrayList;';
const L = (o) => Object.assign({ course: 'البرمجة الشيئية OOP', lang: 'java', variant: 'java', challenges: [] }, o);

window.FS_LESSONS.push(
L({
  id: 'oop1', title: 'الكلاس والكائن', tag: 'OOP1 · Java',
  concept: `<p><b>البرمجة الشيئية (OOP)</b> أسلوب في كتابة البرامج يُنظِّم الكود حول <b>الكائنات</b>: كل كائن يجمع البيانات والعمليات التي تخصه في وحدة واحدة، بدل أن تكون البيانات منفصلة عن الدوال كما في البرمجة الإجرائية.</p>
    <ul><li><b>الكلاس <code>class</code></b>: قالب أو مخطط (blueprint) يُكتب مرة واحدة، ويحدد الصفات (الحقول <b>fields</b>) والسلوك (الدوال <b>methods</b>).</li>
    <li><b>الكائن <code>object</code></b>: نسخة حقيقية من الكلاس تُنشأ بـ <code>new</code> وتُحجز لها مساحة في الذاكرة (heap). الكائن = حالة (state) + سلوك (behavior).</li>
    <li>المتغير من نوع كلاس، مثل <code>Car c</code>، <b>مرجع (reference)</b> يحمل عنوان الكائن وليس الكائن نفسه. لذلك <code>b = a</code> تنسخ المرجع فقط، ويصبح المتغيران يشيران إلى الكائن نفسه.</li>
    <li>حقول الكائن تأخذ قيمًا افتراضية: <code>0</code> للأعداد، و<code>false</code>، و<code>null</code> للمراجع والنصوص. أما المتغيرات المحلية فلا قيمة افتراضية لها.</li>
    <li>الأنواع البسيطة (primitive) مثل <code>int</code> تحمل القيمة نفسها، والأنواع المرجعية مثل <code>String</code> والكائنات تحمل عنوانًا. لمقارنة محتوى النصوص استخدم <code>equals</code> وليس <code>==</code>.</li>
    <li>كل برنامج Java يبدأ من <code>public static void main(String[] args)</code>، والطباعة بـ <code>System.out.println</code>، والإدخال بكائن <code>Scanner</code>.</li></ul>`,
  examples: [
    { id: 'oo1a', title: 'أول كلاس وأول كائن', note: 'الحقول والدوال و new', code: J(`class Car {
    String model;
    int year;

    void show() {
        System.out.println(model + " - " + year);
    }
}`, `Car c = new Car();
c.model = "Toyota";
c.year = 2020;
c.show();`) },
    { id: 'oo1b', title: 'كائنان من الكلاس نفسه', note: 'كل كائن له نسخته من الحقول', code: J(`class Student {
    String name;
    double gpa;

    void print() {
        System.out.println(name + " : " + gpa);
    }
}`, `Student s1 = new Student();
Student s2 = new Student();
s1.name = "Ali";
s1.gpa = 3.2;
s2.name = "Sara";
s2.gpa = 3.8;
s1.print();
s2.print();`) },
    { id: 'oo1c', title: 'القيم الافتراضية للحقول', note: '0 و false و null', code: J(`class Box {
    int count;
    double price;
    boolean full;
    String label;
}`, `Box b = new Box();
System.out.println(b.count);
System.out.println(b.price);
System.out.println(b.full);
System.out.println(b.label);`) },
    { id: 'oo1d', title: 'نسخ المرجع لا ينسخ الكائن', note: 'b = a يجعلهما كائنًا واحدًا', code: J(`class Point {
    int x;
    int y;
}`, `Point a = new Point();
a.x = 1;
Point b = a;
b.x = 99;
System.out.println(a.x);
Point c = new Point();
System.out.println(a == b);
System.out.println(a == c);`) },
    { id: 'oo1e', title: 'إدخال بيانات الكائن بـ Scanner', note: 'nextLine و nextInt', input: 'Omar\n21', code: J(`class Person {
    String name;
    int age;
}`, `Scanner in = new Scanner(System.in);
Person p = new Person();
System.out.print("Name: ");
p.name = in.nextLine();
System.out.print("Age: ");
p.age = in.nextInt();
System.out.println(p.name + " is " + p.age + " years old");`, SC) },
    { id: 'oo1f', title: 'مقارنة النصوص: == أم equals؟', note: 'النص كائن مرجعي', input: 'java', code: J('', `Scanner in = new Scanner(System.in);
String a = "java";
String b = in.next();
System.out.println(a == b);
System.out.println(a.equals(b));`, SC) },
  ],
}),
L({
  id: 'oop2', title: 'الـ Constructor والكلمة this', tag: 'OOP2 · Java',
  concept: `<p><b>الـ constructor</b> دالة خاصة تُنفَّذ تلقائيًا عند إنشاء الكائن بـ <code>new</code>، ووظيفتها تهيئة حقوله.</p>
    <ul><li>اسمه مطابق تمامًا لاسم الكلاس، و<b>ليس له نوع إرجاع</b> ولا حتى <code>void</code>.</li>
    <li>إذا لم تكتب أي constructor يضيف Java <b>default constructor</b> بدون معاملات. وإذا كتبت constructor بمعاملات فلن يُضاف الـ default تلقائيًا.</li>
    <li>يمكن كتابة أكثر من constructor بمعاملات مختلفة (<b>constructor overloading</b>).</li>
    <li><code>this</code> مرجع إلى الكائن الحالي: <code>this.name = name</code> تميّز الحقل عن المعامل الذي له الاسم نفسه. و<code>this(...)</code> في أول سطر تستدعي constructor آخر من الكلاس نفسه.</li>
    <li><b>Copy constructor</b>: constructor يستقبل كائنًا من الكلاس نفسه وينسخ حقوله إلى كائن جديد.</li>
    <li>الفرق بين الـ constructor والدالة العادية: الأول يُنفَّذ مرة عند الإنشاء ولا يُرجع قيمة ولا يُورَث، والدالة تُستدعى متى شئنا ويمكن أن تُرجع قيمة.</li></ul>`,
  examples: [
    { id: 'oo2a', title: 'Constructor بمعاملات', note: 'التهيئة عند الإنشاء', code: J(`class Student {
    String name;
    int age;

    Student(String n, int a) {
        name = n;
        age = a;
    }

    void show() {
        System.out.println(name + " (" + age + ")");
    }
}`, `Student s = new Student("Ali", 20);
s.show();
Student t = new Student("Mona", 22);
t.show();`) },
    { id: 'oo2b', title: 'خطأ شائع: name = name', note: 'لماذا نحتاج this؟', code: J(`class Book {
    String title;
    double price;

    Book(String title, double price) {
        title = title;
        this.price = price;
    }
}`, `Book b = new Book("Java", 25.5);
System.out.println(b.title);
System.out.println(b.price);`) },
    { id: 'oo2c', title: 'عدة Constructors و this()', note: 'constructor overloading', code: J(`class Rect {
    int width;
    int height;

    Rect() {
        this(1, 1);
    }

    Rect(int side) {
        this(side, side);
    }

    Rect(int width, int height) {
        this.width = width;
        this.height = height;
    }

    int area() {
        return width * height;
    }
}`, `Rect a = new Rect();
Rect b = new Rect(4);
Rect c = new Rect(2, 5);
System.out.println(a.area() + " " + b.area() + " " + c.area());`) },
    { id: 'oo2d', title: 'Copy constructor ودالة equals', note: 'مثل كلاس Teacher', code: J(`class Teacher {
    String name;
    int age;
    char gender;

    Teacher(String name, char gender, int age) {
        this.name = name;
        this.gender = gender;
        this.age = age;
    }

    Teacher(Teacher other) {
        this.name = other.name;
        this.gender = other.gender;
        this.age = other.age;
    }

    boolean isEqual(Teacher other) {
        return this.name.equals(other.name) && this.age == other.age && this.gender == other.gender;
    }
}`, `Teacher t1 = new Teacher("Salem", 'M', 40);
Teacher t2 = new Teacher(t1);
System.out.println(t1 == t2);
System.out.println(t1.isEqual(t2));
t2.age = 41;
System.out.println(t1.isEqual(t2));`) },
    { id: 'oo2e', title: 'خطأ: لا يوجد default constructor', note: 'بعد كتابة constructor بمعاملات', err: true, code: J(`class Item {
    String name;

    Item(String name) {
        this.name = name;
    }
}`, `Item a = new Item("Pen");
Item b = new Item();`) },
  ],
}),
L({
  id: 'oop3', title: 'التغليف Encapsulation', tag: 'OOP3 · Java',
  concept: `<p><b>التغليف (Encapsulation)</b> يعني إخفاء بيانات الكائن داخله وجعل الوصول إليها <b>مضبوطًا</b> عن طريق دوال، بحيث لا يستطيع أحد من خارج الكلاس أن يضع فيها قيمًا غير صحيحة.</p>
    <ul><li>محددات الوصول (access modifiers): <code>private</code> داخل الكلاس فقط، وبدون كلمة (default) داخل الحزمة package، و<code>protected</code> للحزمة والكلاسات الوارثة، و<code>public</code> من أي مكان.</li>
    <li>نجعل الحقول <code>private</code>، ونوفّر دوال <code>public</code>: <b>getter</b> للقراءة مثل <code>getAge()</code>، و<b>setter</b> للتعديل مثل <code>setAge(int a)</code>.</li>
    <li>الـ setter مكان مناسب للتحقق من القيمة قبل تخزينها (مثل رفض العمر السالب).</li>
    <li>حقل له getter فقط يكون <b>للقراءة فقط (read-only)</b> من خارج الكلاس.</li>
    <li>محاولة الوصول إلى حقل <code>private</code> من كلاس آخر خطأ ترجمة.</li></ul>`,
  examples: [
    { id: 'oo3a', title: 'حساب بنكي محمي', note: 'private + دوال تتحقق من القيم', code: J(`class Account {
    private String owner;
    private double balance;

    public Account(String owner) {
        this.owner = owner;
    }

    public void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
        } else {
            System.out.println("Invalid amount");
        }
    }

    public void withdraw(double amount) {
        if (amount <= balance) {
            balance -= amount;
        } else {
            System.out.println("Not enough balance");
        }
    }

    public double getBalance() {
        return balance;
    }
}`, `Account acc = new Account("Ali");
acc.deposit(500);
acc.withdraw(200);
acc.withdraw(1000);
acc.deposit(-50);
System.out.println(acc.getBalance());`) },
    { id: 'oo3b', title: 'Getters و Setters مع التحقق', note: 'الدرجة بين 0 و 100', code: J(`class Student {
    private String name;
    private int mark;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getMark() {
        return mark;
    }

    public void setMark(int mark) {
        if (mark >= 0 && mark <= 100) {
            this.mark = mark;
        } else {
            System.out.println("Mark must be 0..100");
        }
    }
}`, `Student s = new Student();
s.setName("Huda");
s.setMark(87);
s.setMark(150);
System.out.println(s.getName() + " " + s.getMark());`) },
    { id: 'oo3c', title: 'خطأ: الوصول إلى حقل private', note: 'من خارج الكلاس', err: true, code: J(`class Wallet {
    private int money = 100;
}`, `Wallet w = new Wallet();
w.money = 1000000;
System.out.println(w.money);`) },
    { id: 'oo3d', title: 'حقل للقراءة فقط', note: 'getter بدون setter', code: J(`class Product {
    private final String code;
    private double price;

    public Product(String code, double price) {
        this.code = code;
        this.price = price;
    }

    public String getCode() {
        return code;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        if (price > 0) this.price = price;
    }
}`, `Product p = new Product("P-100", 12.5);
p.setPrice(15);
System.out.println(p.getCode() + " costs " + p.getPrice());`) },
  ],
}),
L({
  id: 'oop4', title: 'static والتحميل الزائد Overloading', tag: 'OOP4 · Java',
  concept: `<p>الكلمة <b><code>static</code></b> تجعل العضو تابعًا <b>للكلاس نفسه</b> وليس لكل كائن، فهو نسخة واحدة مشتركة بين كل الكائنات.</p>
    <ul><li><b>الحقل static</b> مشترك بين الكائنات ويحتفظ بقيمته، ومثاله عدّاد للكائنات المنشأة. ويُستخدم باسم الكلاس: <code>Counter.count</code>.</li>
    <li><b>الدالة static</b> تُستدعى بدون إنشاء كائن، مثل <code>Math.max(a, b)</code> و<code>main</code>. ولا يمكنها استخدام الحقول والدوال غير static مباشرة.</li>
    <li><code>static final</code> لتعريف ثابت مشترك، مثل <code>static final double PI = 3.14;</code>، والمتغير <code>final</code> لا تتغير قيمته بعد إعطائها.</li>
    <li><b>التحميل الزائد (Overloading)</b>: عدة دوال بالاسم نفسه في الكلاس نفسه، تختلف في <b>عدد المعاملات أو أنواعها أو ترتيبها</b>. ويختار المترجم النسخة المناسبة حسب القيم المرسلة.</li>
    <li>اختلاف <b>نوع الإرجاع فقط</b> لا يكفي للـ overloading، ويسبب خطأ ترجمة.</li></ul>`,
  examples: [
    { id: 'oo4a', title: 'عدّاد الكائنات static', note: 'حقل واحد مشترك', code: J(`class Car {
    static int count = 0;
    String model;
    int number;

    Car(String model) {
        this.model = model;
        count++;
        number = count;
    }
}`, `Car a = new Car("Kia");
Car b = new Car("BMW");
Car c = new Car("Fiat");
System.out.println("Cars created: " + Car.count);
System.out.println(b.model + " is car number " + b.number);`) },
    { id: 'oo4b', title: 'دوال static بدون كائن', note: 'مثل Math', code: J(`class MathUtil {
    static final double PI = 3.14159;

    static int square(int x) {
        return x * x;
    }

    static double circleArea(double r) {
        return PI * r * r;
    }
}`, `System.out.println(MathUtil.square(7));
System.out.println(MathUtil.circleArea(2));
System.out.println(Math.max(4, 9) + " " + Math.sqrt(16));`) },
    { id: 'oo4c', title: 'التحميل الزائد للدوال', note: 'الاسم نفسه ومعاملات مختلفة', code: J(`class Calc {
    int add(int a, int b) {
        return a + b;
    }

    int add(int a, int b, int c) {
        return a + b + c;
    }

    double add(double a, double b) {
        return a + b;
    }

    String add(String a, String b) {
        return a + b;
    }
}`, `Calc c = new Calc();
System.out.println(c.add(2, 3));
System.out.println(c.add(2, 3, 4));
System.out.println(c.add(2.5, 1.5));
System.out.println(c.add("OO", "P"));`) },
    { id: 'oo4d', title: 'خطأ: static تستخدم حقلًا عاديًا', note: 'static context', err: true, code: J(`class Counter {
    int value;

    static void increase() {
        value++;
    }
}`, `Counter.increase();`) },
    { id: 'oo4e', title: 'خطأ: تغيير قيمة final', note: 'الثابت لا يتغير', err: true, code: J('', `final double RATE = 0.15;
double price = 200 * RATE;
System.out.println(price);
RATE = 0.2;`) },
  ],
}),
L({
  id: 'oop5', title: 'الوراثة Inheritance', tag: 'OOP5 · Java',
  concept: `<p><b>الوراثة</b> تسمح لكلاس جديد (الابن <b>subclass</b>) أن يأخذ حقول ودوال كلاس موجود (الأب <b>superclass</b>) ويضيف عليها، فنعيد استخدام الكود بدل تكراره. وتمثل علاقة <b>is-a</b>: الطالب هو شخص.</p>
    <ul><li>تُكتب بـ <code>extends</code>: <code>class Student extends Person</code>.</li>
    <li>عند إنشاء كائن الابن يُنفَّذ <b>constructor الأب أولًا</b>، إما تلقائيًا بـ <code>super()</code> أو صراحة بـ <code>super(قيم)</code> في أول سطر من constructor الابن.</li>
    <li><code>super.method()</code> تستدعي نسخة الأب من الدالة.</li>
    <li>الحقل <code>private</code> في الأب لا يصل إليه الابن مباشرة، والحقل <code>protected</code> يصل إليه.</li>
    <li>أنواع الوراثة في Java بالكلاسات: <b>Single</b> (أب وابن)، و<b>Multilevel</b> (جد ← أب ← ابن)، و<b>Hierarchical</b> (أب واحد وعدة أبناء).</li>
    <li>Java <b>لا تدعم الوراثة المتعددة</b> من كلاسين لتجنّب مشكلة المعيّن (diamond problem)، ويُستعاض عنها بالواجهات interfaces. والكلاس <code>final</code> لا يُورَث.</li></ul>`,
  examples: [
    { id: 'oo5a', title: 'Person و Student', note: 'extends و super(...)', code: J(`class Person {
    protected String name;
    protected int age;

    Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    void introduce() {
        System.out.println("I am " + name + ", " + age);
    }
}

class Student extends Person {
    String major;

    Student(String name, int age, String major) {
        super(name, age);
        this.major = major;
    }

    void study() {
        System.out.println(name + " studies " + major);
    }
}`, `Student s = new Student("Ali", 20, "IT");
s.introduce();
s.study();`) },
    { id: 'oo5b', title: 'ترتيب تنفيذ الـ Constructors', note: 'Multilevel: A ثم B ثم C', code: J(`class A {
    A() {
        System.out.println("A constructor");
    }
}

class B extends A {
    B() {
        System.out.println("B constructor");
    }
}

class C extends B {
    C() {
        System.out.println("C constructor");
    }
}`, `C obj = new C();`) },
    { id: 'oo5c', title: 'وراثة هرمية', note: 'أب واحد وابنان', code: J(`class Employee {
    protected String name;
    protected double salary;

    Employee(String name, double salary) {
        this.name = name;
        this.salary = salary;
    }

    void print() {
        System.out.println(name + " earns " + salary);
    }
}

class Manager extends Employee {
    Manager(String name, double salary) {
        super(name, salary + 500);
    }
}

class Engineer extends Employee {
    Engineer(String name, double salary) {
        super(name, salary);
    }
}`, `Manager m = new Manager("Huda", 2000);
Engineer e = new Engineer("Omar", 1800);
m.print();
e.print();`) },
    { id: 'oo5d', title: 'super.method()', note: 'استدعاء نسخة الأب', code: J(`class Vehicle {
    void info() {
        System.out.println("Vehicle: moves on roads");
    }
}

class Bus extends Vehicle {
    int seats = 40;

    void info() {
        super.info();
        System.out.println("Bus: " + seats + " seats");
    }
}`, `Bus b = new Bus();
b.info();`) },
    { id: 'oo5e', title: 'خطأ: الابن والحقل private', note: 'استخدم protected أو getter', err: true, code: J(`class Animal {
    private String name = "Cat";
}

class Cat extends Animal {
    void show() {
        System.out.println(name);
    }
}`, `Cat c = new Cat();
c.show();`) },
  ],
}),
L({
  id: 'oop6', title: 'إعادة التعريف وتعدد الأشكال', tag: 'OOP6 · Java',
  concept: `<p><b>إعادة التعريف (Overriding)</b>: أن يكتب الكلاس الابن دالة بنفس اسم ومعاملات ونوع إرجاع دالة في الأب، ليغيّر سلوكها. ويُكتب فوقها عادة <code>@Override</code>.</p>
    <ul><li><b>تعدد الأشكال (Polymorphism)</b>: متغير من نوع الأب يمكن أن يشير إلى كائن من أي كلاس ابن، مثل <code>Animal a = new Dog();</code>. وعند استدعاء دالة معاد تعريفها تُنفَّذ نسخة <b>الكائن الحقيقي</b> وقت التشغيل.</li>
    <li>المترجم ينظر إلى <b>نوع المتغير</b>: لا يمكن استدعاء دالة موجودة في الابن فقط عن طريق متغير من نوع الأب، إلا بعد التحويل <code>(Dog) a</code> (downcasting). ونتأكد من النوع أولًا بـ <code>instanceof</code>.</li>
    <li>نعيد عادة تعريف <code>toString()</code> لطباعة بيانات الكائن، و<code>equals(Object o)</code> لمقارنة محتوى كائنين.</li>
    <li>الدالة <code>final</code> لا يُعاد تعريفها، والدالة <code>static</code> لا تُعاد تعريفها لأنها تتبع الكلاس وتُحدَّد وقت الترجمة.</li>
    <li>الفرق: <b>Overloading</b> في الكلاس نفسه بمعاملات مختلفة ويُحدَّد وقت الترجمة، و<b>Overriding</b> بين الأب والابن بنفس التوقيع ويُحدَّد وقت التشغيل.</li></ul>`,
  examples: [
    { id: 'oo6a', title: 'Overriding بسيط', note: 'الابن يغيّر السلوك', code: J(`class Animal {
    void sound() {
        System.out.println("Some sound");
    }
}

class Dog extends Animal {
    @Override
    void sound() {
        System.out.println("Woof");
    }
}

class Cat extends Animal {
    @Override
    void sound() {
        System.out.println("Meow");
    }
}`, `Animal a = new Animal();
Dog d = new Dog();
Cat c = new Cat();
a.sound();
d.sound();
c.sound();`) },
    { id: 'oo6b', title: 'تعدد الأشكال بمصفوفة', note: 'متغير الأب وكائنات الأبناء', code: J(`class Shape {
    double area() {
        return 0;
    }
}

class Circle extends Shape {
    double r;

    Circle(double r) {
        this.r = r;
    }

    @Override
    double area() {
        return 3.14 * r * r;
    }
}

class Square extends Shape {
    double side;

    Square(double side) {
        this.side = side;
    }

    @Override
    double area() {
        return side * side;
    }
}`, `Shape[] shapes = { new Circle(2), new Square(3), new Circle(1) };
double total = 0;
for (Shape s : shapes) {
    total += s.area();
}
System.out.println("Total area = " + total);`) },
    { id: 'oo6c', title: 'إعادة تعريف toString', note: 'طباعة الكائن مباشرة', code: J(`class Book {
    String title;
    double price;

    Book(String title, double price) {
        this.title = title;
        this.price = price;
    }

    @Override
    public String toString() {
        return title + " [" + price + " LYD]";
    }
}

class Note {
    String text = "hi";
}`, `Book b = new Book("Clean Code", 45);
System.out.println(b);
System.out.println("Book: " + b);
Note n = new Note();
System.out.println(n);`) },
    { id: 'oo6d', title: 'instanceof والتحويل Downcasting', note: 'الوصول إلى دالة الابن', code: J(`class Animal {
    String name;

    Animal(String name) {
        this.name = name;
    }
}

class Dog extends Animal {
    Dog(String name) {
        super(name);
    }

    void fetch() {
        System.out.println(name + " fetches the ball");
    }
}`, `Animal a = new Dog("Rex");
Animal b = new Animal("Generic");
if (a instanceof Dog) {
    Dog d = (Dog) a;
    d.fetch();
}
System.out.println(b instanceof Dog);`) },
    { id: 'oo6e', title: 'إعادة تعريف equals', note: 'مقارنة المحتوى', code: J(`class Point {
    int x, y;

    Point(int x, int y) {
        this.x = x;
        this.y = y;
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Point)) return false;
        Point p = (Point) o;
        return x == p.x && y == p.y;
    }
}`, `Point p1 = new Point(2, 3);
Point p2 = new Point(2, 3);
System.out.println(p1 == p2);
System.out.println(p1.equals(p2));`) },
    { id: 'oo6f', title: 'خطأ: دالة الابن عبر متغير الأب', note: 'المترجم ينظر لنوع المتغير', err: true, code: J(`class Animal {
}

class Bird extends Animal {
    void fly() {
        System.out.println("Flying");
    }
}`, `Animal a = new Bird();
a.fly();`) },
  ],
}),
L({
  id: 'oop7', title: 'التجريد: abstract و interface', tag: 'OOP7 · Java',
  concept: `<p><b>التجريد (Abstraction)</b> يعني إظهار ما يفعله الكائن وإخفاء تفاصيل كيف يفعله. وفي Java طريقتان: الكلاس المجرد والواجهة.</p>
    <ul><li><b>الكلاس المجرد <code>abstract class</code></b>: لا يمكن إنشاء كائن منه بـ <code>new</code>. يمكن أن يحتوي دوالًا مجردة بلا جسم (<code>abstract double area();</code>) ودوالًا عادية بجسم وحقولًا وconstructor.</li>
    <li>الكلاس الابن غير المجرد <b>يجب</b> أن يعيد تعريف كل الدوال المجردة، وإلا يكون خطأ ترجمة.</li>
    <li><b>الواجهة <code>interface</code></b>: عقد يحدد ما يجب أن يفعله الكلاس. دوالها مجردة و<code>public</code> افتراضيًا (إلا <code>default</code> و<code>static</code>)، ومتغيراتها ثوابت <code>public static final</code>.</li>
    <li>الكلاس يطبّق الواجهة بـ <code>implements</code>، ويمكنه أن يطبّق <b>أكثر من واجهة</b>، وهذا بديل الوراثة المتعددة.</li>
    <li>متى نستخدم كلًّا منهما؟ الكلاس المجرد لكلاسات قريبة تشترك في حقول وكود، والواجهة لقدرة مشتركة بين كلاسات مختلفة.</li></ul>`,
  examples: [
    { id: 'oo7a', title: 'كلاس مجرد Shape', note: 'دالة abstract وأخرى عادية', code: J(`abstract class Shape {
    String name;

    Shape(String name) {
        this.name = name;
    }

    abstract double area();

    void describe() {
        System.out.println(name + " area = " + area());
    }
}

class Rectangle extends Shape {
    double w, h;

    Rectangle(double w, double h) {
        super("Rectangle");
        this.w = w;
        this.h = h;
    }

    @Override
    double area() {
        return w * h;
    }
}

class Circle extends Shape {
    double r;

    Circle(double r) {
        super("Circle");
        this.r = r;
    }

    @Override
    double area() {
        return 3.14 * r * r;
    }
}`, `Shape s1 = new Rectangle(4, 5);
Shape s2 = new Circle(1);
s1.describe();
s2.describe();`) },
    { id: 'oo7b', title: 'واجهة يطبّقها كلاسان', note: 'implements', code: J(`interface Payable {
    double TAX = 0.1;

    double getPayment();
}

class Employee implements Payable {
    double salary;

    Employee(double salary) {
        this.salary = salary;
    }

    public double getPayment() {
        return salary - salary * TAX;
    }
}

class Invoice implements Payable {
    int qty;
    double price;

    Invoice(int qty, double price) {
        this.qty = qty;
        this.price = price;
    }

    public double getPayment() {
        return qty * price;
    }
}`, `Payable[] items = { new Employee(1000), new Invoice(3, 50) };
for (Payable p : items) {
    System.out.println(p.getPayment());
}`) },
    { id: 'oo7c', title: 'كلاس يطبّق واجهتين', note: 'بديل الوراثة المتعددة', code: J(`interface Flyable {
    void fly();
}

interface Swimmable {
    void swim();
}

class Duck implements Flyable, Swimmable {
    public void fly() {
        System.out.println("Duck flies");
    }

    public void swim() {
        System.out.println("Duck swims");
    }
}`, `Duck d = new Duck();
d.fly();
d.swim();
Flyable f = d;
f.fly();`) },
    { id: 'oo7d', title: 'دالة default في الواجهة', note: 'جسم جاهز يمكن تغييره', code: J(`interface Greeter {
    String name();

    default void greet() {
        System.out.println("Hello, " + name());
    }
}

class Arabic implements Greeter {
    public String name() {
        return "Ahmed";
    }
}`, `Greeter g = new Arabic();
g.greet();`) },
    { id: 'oo7e', title: 'خطأ: كائن من كلاس مجرد', note: 'abstract لا يُنشأ منه كائن', err: true, code: J(`abstract class Animal {
    abstract void sound();
}`, `Animal a = new Animal();`) },
  ],
}),
L({
  id: 'oop8', title: 'العلاقات بين الكلاسات', tag: 'OOP8 · Java',
  concept: `<p>الكلاسات في البرنامج تتعامل مع بعضها بعلاقات مختلفة، ونرسمها في <b>مخطط الكلاسات (Class Diagram)</b>.</p>
    <ul><li><b>الارتباط (Association)</b>: علاقة <b>uses-a</b> بين كائنين مستقلين لا يملك أحدهما الآخر، مثل مدرّس يدرّس طالبًا. وغالبًا يكون كائن معاملًا في دالة أو حقلًا يشير إلى كائن موجود.</li>
    <li><b>التجميع (Aggregation)</b>: علاقة <b>has-a</b> ضعيفة، والكائن الجزء يُنشأ خارج الكل ويمكن أن يعيش بدونه، مثل قسم فيه موظفون. وتُرسم بمعيّن فارغ ◇.</li>
    <li><b>التركيب (Composition)</b>: علاقة <b>part-of</b> قوية، والجزء يُنشأ داخل الكل ويموت بموته، مثل سيارة ومحركها. وتُرسم بمعيّن ممتلئ ◆.</li>
    <li><b>الاعتمادية (Dependency)</b>: كلاس يستخدم كلاسًا آخر مؤقتًا داخل دالة فقط.</li>
    <li>في مخطط الكلاسات: <code>-</code> تعني private، و<code>+</code> public، و<code>#</code> protected، والسهم المثلث المفرغ للوراثة.</li></ul>`,
  examples: [
    { id: 'oo8a', title: 'ارتباط Association', note: 'كائنان مستقلان', code: J(`class Course {
    String title;

    Course(String title) {
        this.title = title;
    }
}

class Teacher {
    String name;

    Teacher(String name) {
        this.name = name;
    }

    void teach(Course c) {
        System.out.println(name + " teaches " + c.title);
    }
}`, `Teacher t = new Teacher("Dr. Salem");
Course c1 = new Course("OOP");
Course c2 = new Course("Networks");
t.teach(c1);
t.teach(c2);`) },
    { id: 'oo8b', title: 'تجميع Aggregation', note: 'الموظفون يعيشون خارج القسم', code: J(`class Employee {
    String name;

    Employee(String name) {
        this.name = name;
    }
}

class Department {
    String name;
    ArrayList<Employee> staff = new ArrayList<>();

    Department(String name) {
        this.name = name;
    }

    void add(Employee e) {
        staff.add(e);
    }

    void print() {
        System.out.println(name + " has " + staff.size() + " employees:");
        for (Employee e : staff) {
            System.out.println("- " + e.name);
        }
    }
}`, `Employee e1 = new Employee("Ali");
Employee e2 = new Employee("Mona");
Department d = new Department("IT");
d.add(e1);
d.add(e2);
d.print();
d = null;
System.out.println(e1.name + " still exists");`, AL) },
    { id: 'oo8c', title: 'تركيب Composition', note: 'المحرك يُنشأ داخل السيارة', code: J(`class Engine {
    int power;

    Engine(int power) {
        this.power = power;
    }

    void start() {
        System.out.println("Engine " + power + "hp started");
    }
}

class Car {
    private String model;
    private Engine engine;

    Car(String model, int power) {
        this.model = model;
        this.engine = new Engine(power);
    }

    void drive() {
        engine.start();
        System.out.println(model + " is moving");
    }
}`, `Car car = new Car("Hyundai", 120);
car.drive();`) },
    { id: 'oo8d', title: 'مكتبة فيها كتب', note: 'قائمة من الكائنات', code: J(`class Book {
    String title;
    boolean borrowed;

    Book(String title) {
        this.title = title;
    }
}

class Library {
    ArrayList<Book> books = new ArrayList<>();

    void addBook(Book b) {
        books.add(b);
    }

    void borrow(String title) {
        for (Book b : books) {
            if (b.title.equals(title) && !b.borrowed) {
                b.borrowed = true;
                System.out.println("Borrowed: " + title);
                return;
            }
        }
        System.out.println("Not available: " + title);
    }
}`, `Library lib = new Library();
lib.addBook(new Book("Java"));
lib.addBook(new Book("C++"));
lib.borrow("Java");
lib.borrow("Java");
lib.borrow("Python");`, AL) },
  ],
}),
L({
  id: 'oop9', title: 'Generics و Enum', tag: 'OOP9 · Java',
  concept: `<p><b>Generics</b> تسمح بكتابة كلاس أو دالة واحدة تعمل مع أنواع مختلفة، مع بقاء التحقق من الأنواع وقت الترجمة (type safety) ودون الحاجة إلى التحويل casting.</p>
    <ul><li>الكلاس العام: <code>class Box&lt;T&gt;</code>، و<code>T</code> نوع يُحدَّد عند الإنشاء: <code>Box&lt;Integer&gt;</code> أو <code>Box&lt;String&gt;</code>. ويمكن أكثر من نوع: <code>Pair&lt;K, V&gt;</code>.</li>
    <li>الدالة العامة: <code>static &lt;T&gt; void printAll(T[] arr)</code>.</li>
    <li>الأنواع العامة تستخدم الكلاسات المغلِّفة (wrapper) بدل الأنواع البسيطة: <code>Integer</code> و<code>Double</code> و<code>Character</code> و<code>Boolean</code>.</li>
    <li><b>Enum</b>: نوع خاص لمجموعة ثابتة من القيم، مثل <code>enum Day { SAT, SUN, MON }</code>. وهو أكثر أمانًا من ثوابت int.</li>
    <li>دوال enum الجاهزة: <code>values()</code> مصفوفة الثوابت، و<code>ordinal()</code> الترتيب من 0، و<code>name()</code> الاسم كنص. ويمكن استخدام enum مع <code>switch</code>، ويمكن أن يحتوي حقولًا وconstructor ودوالًا.</li></ul>`,
  examples: [
    { id: 'oo9a', title: 'كلاس عام Box<T>', note: 'نوع واحد يُحدَّد لاحقًا', code: J(`class Box<T> {
    private T item;

    void put(T item) {
        this.item = item;
    }

    T get() {
        return item;
    }
}`, `Box<Integer> numBox = new Box<>();
numBox.put(42);
Box<String> textBox = new Box<>();
textBox.put("OOP");
int n = numBox.get();
System.out.println(n + 1);
System.out.println(textBox.get().length());`) },
    { id: 'oo9b', title: 'نوعان عامان Pair<K, V>', note: 'مفتاح وقيمة', code: J(`class Pair<K, V> {
    private K key;
    private V value;

    Pair(K key, V value) {
        this.key = key;
        this.value = value;
    }

    K getKey() {
        return key;
    }

    V getValue() {
        return value;
    }
}`, `Pair<String, Integer> p = new Pair<>("Age", 21);
Pair<String, Double> q = new Pair<>("GPA", 3.5);
System.out.println(p.getKey() + " = " + p.getValue());
System.out.println(q.getKey() + " = " + q.getValue());`) },
    { id: 'oo9c', title: 'دالة عامة', note: 'تعمل مع أي مصفوفة', code: `public class Main {
    static <T> void printAll(T[] items) {
        for (T x : items) {
            System.out.print(x + " ");
        }
        System.out.println();
    }

    public static void main(String[] args) {
        Integer[] nums = { 3, 1, 4 };
        String[] names = { "Ali", "Sara" };
        printAll(nums);
        printAll(names);
    }
}
` },
    { id: 'oo9d', title: 'Enum أساسي', note: 'values و ordinal و switch', code: J(`enum Level {
    LOW, MEDIUM, HIGH
}`, `Level lv = Level.MEDIUM;
System.out.println(lv + " " + lv.ordinal());
for (Level x : Level.values()) {
    System.out.print(x.name() + " ");
}
System.out.println();
switch (lv) {
    case LOW:
        System.out.println("relax");
        break;
    case MEDIUM:
        System.out.println("be careful");
        break;
    case HIGH:
        System.out.println("danger!");
        break;
}`) },
    { id: 'oo9e', title: 'Enum بحقول و constructor', note: 'لكل ثابت بياناته', code: J(`enum Coin {
    DIRHAM(0.001), QUARTER(0.25), DINAR(1.0);

    private final double value;

    Coin(double value) {
        this.value = value;
    }

    double getValue() {
        return value;
    }
}`, `double total = Coin.DINAR.getValue() * 2 + Coin.QUARTER.getValue() * 3;
System.out.println("Total = " + total);
System.out.println(Coin.QUARTER + " = " + Coin.QUARTER.getValue());`) },
  ],
}),
L({
  id: 'oop10', title: 'المصفوفات والمجموعات', tag: 'OOP10 · Java',
  concept: `<p><b>المصفوفة (Array)</b> في Java كائن له حجم ثابت يُحدَّد عند الإنشاء، وعناصرها من نوع واحد وفهارسها من 0 إلى <code>length - 1</code>.</p>
    <ul><li><code>int[] a = new int[5];</code> عناصرها تبدأ بـ 0، و<code>Student[] s = new Student[3];</code> عناصرها تبدأ بـ <code>null</code> حتى ننشئ الكائنات. وطولها <code>a.length</code> بدون أقواس.</li>
    <li>المصفوفة الثنائية <code>int[][] m = new int[3][4];</code> مصفوفة من المصفوفات، والمصفوفة <b>المسننة (Jagged)</b> صفوفها بأطوال مختلفة.</li>
    <li><b>ArrayList</b> مصفوفة ديناميكية يكبر حجمها ويصغر تلقائيًا: <code>add</code> و<code>get</code> و<code>set</code> و<code>remove</code> و<code>size()</code> و<code>contains</code>. سريعة في الوصول بالفهرس.</li>
    <li><b>LinkedList</b> قائمة مترابطة مزدوجة، سريعة في الإضافة والحذف من البداية والنهاية: <code>addFirst</code> و<code>addLast</code> و<code>getFirst</code> و<code>removeFirst</code>.</li>
    <li>حلقة <b>for-each</b> <code>for (Type x : collection)</code> تمر على كل العناصر بالترتيب.</li>
    <li>متى نستخدم ماذا؟ بيانات ثابتة الحجم ← مصفوفة، جدول ← مصفوفة ثنائية، حجم متغير ← ArrayList، إضافة وحذف كثير من الأطراف ← LinkedList.</li></ul>`,
  examples: [
    { id: 'oo10a', title: 'مصفوفة كائنات', note: 'العناصر null حتى نُنشئها', code: J(`class Student {
    String name;
    int mark;

    Student(String name, int mark) {
        this.name = name;
        this.mark = mark;
    }
}`, `Student[] list = new Student[3];
list[0] = new Student("Ali", 75);
list[1] = new Student("Sara", 92);
list[2] = new Student("Omar", 60);
Student best = list[0];
for (int i = 1; i < list.length; i++) {
    if (list[i].mark > best.mark) {
        best = list[i];
    }
}
System.out.println("Best: " + best.name + " " + best.mark);`) },
    { id: 'oo10b', title: 'مصفوفة ثنائية ومسننة', note: 'Jagged array', code: J('', `int[][] m = { {1, 2, 3}, {4, 5, 6} };
int sum = 0;
for (int i = 0; i < m.length; i++) {
    for (int j = 0; j < m[i].length; j++) {
        sum += m[i][j];
    }
}
System.out.println("Sum = " + sum);
int[][] jag = new int[3][];
jag[0] = new int[1];
jag[1] = new int[2];
jag[2] = new int[3];
System.out.println(jag[0].length + " " + jag[1].length + " " + jag[2].length);`) },
    { id: 'oo10c', title: 'ArrayList: عمليات أساسية', note: 'add و get و set و remove', code: J('', `ArrayList<String> names = new ArrayList<>();
names.add("Ali");
names.add("Sara");
names.add("Omar");
names.add(1, "Huda");
System.out.println(names + " size " + names.size());
names.set(0, "Aly");
names.remove("Omar");
System.out.println(names.get(0) + " " + names.contains("Sara"));
for (String n : names) {
    System.out.print(n + " ");
}
System.out.println();`, AL) },
    { id: 'oo10d', title: 'LinkedList: المدن', note: 'addFirst و getLast', code: J('', `LinkedList<String> cities = new LinkedList<>();
cities.add("Tripoli");
cities.add("Benghazi");
cities.addFirst("Zliten");
cities.addLast("Sabha");
System.out.println("First city: " + cities.getFirst());
System.out.println("Last city: " + cities.getLast());
System.out.println("City at index 2: " + cities.get(2));
cities.removeFirst();
cities.removeLast();
System.out.println("cities LinkedList: " + cities);`, 'import java.util.LinkedList;') },
    { id: 'oo10e', title: 'ArrayList من الأعداد', note: 'Integer بدل int', input: '5\n8 3 9 1 6', code: J('', `Scanner in = new Scanner(System.in);
int n = in.nextInt();
ArrayList<Integer> nums = new ArrayList<>();
for (int i = 0; i < n; i++) {
    nums.add(in.nextInt());
}
int max = nums.get(0);
for (int x : nums) {
    if (x > max) max = x;
}
System.out.println("Max = " + max);`, 'import java.util.ArrayList;\nimport java.util.Scanner;') },
    { id: 'oo10f', title: 'خطأ: فهرس خارج الحدود', note: 'i <= length', err: true, code: J('', `int[] a = {10, 20, 30};
for (int i = 0; i <= a.length; i++) {
    System.out.println(a[i]);
}`) },
  ],
}),
L({
  id: 'oopexam', title: 'مراجعة الامتحان', tag: 'OOP · Java',
  concept: `<p>مراجعة سريعة لأهم مفاهيم المقرر قبل الامتحان:</p>
    <ul><li>مبادئ OOP الأربعة: <b>التغليف</b> Encapsulation، و<b>الوراثة</b> Inheritance، و<b>تعدد الأشكال</b> Polymorphism، و<b>التجريد</b> Abstraction.</li>
    <li>الكلاس قالب يُكتب مرة واحدة، والكائن نسخة منه تُحجز في الذاكرة بـ <code>new</code>.</li>
    <li>الـ constructor: اسم الكلاس، بلا نوع إرجاع، يُنفَّذ تلقائيًا عند الإنشاء، ولا يُورَث.</li>
    <li><code>this</code>: الكائن الحالي، و<code>super</code>: الكلاس الأب. و<code>final</code>: متغير لا يتغير، ودالة لا يُعاد تعريفها، وكلاس لا يُورَث.</li>
    <li><code>static</code>: عضو مشترك للكلاس، والدالة static لا تصل للحقول العادية مباشرة ولا يُعاد تعريفها.</li>
    <li>Overloading: الاسم نفسه ومعاملات مختلفة. Overriding: التوقيع نفسه في الابن. واختلاف نوع الإرجاع وحده خطأ.</li>
    <li>abstract class لا يُنشأ منه كائن، وinterface عقد يطبّقه الكلاس، ويمكن تطبيق عدة واجهات بدل الوراثة المتعددة.</li>
    <li>Aggregation: has-a والجزء مستقل. Composition: part-of والجزء يموت بموت الكل.</li></ul>`,
  examples: [
    { id: 'ooxa', title: 'برنامج شامل: نظام موظفين', note: 'abstract + وراثة + polymorphism + ArrayList', code: J(`abstract class Employee {
    private static int count = 0;
    protected String name;
    private final int id;

    Employee(String name) {
        this.name = name;
        count++;
        id = count;
    }

    abstract double salary();

    int getId() {
        return id;
    }

    static int getCount() {
        return count;
    }

    @Override
    public String toString() {
        return "#" + id + " " + name + ": " + salary();
    }
}

class FullTime extends Employee {
    private double monthly;

    FullTime(String name, double monthly) {
        super(name);
        this.monthly = monthly;
    }

    @Override
    double salary() {
        return monthly;
    }
}

class PartTime extends Employee {
    private int hours;
    private double rate;

    PartTime(String name, int hours, double rate) {
        super(name);
        this.hours = hours;
        this.rate = rate;
    }

    @Override
    double salary() {
        return hours * rate;
    }
}`, `ArrayList<Employee> staff = new ArrayList<>();
staff.add(new FullTime("Ali", 2500));
staff.add(new PartTime("Sara", 40, 15));
double total = 0;
for (Employee e : staff) {
    System.out.println(e);
    total += e.salary();
}
System.out.println("Employees: " + Employee.getCount() + ", total = " + total);`, AL) },
    { id: 'ooxb', title: 'تتبع: وراثة وconstructors وstatic', note: 'ماذا يُطبع؟', code: J(`class Base {
    static int n = 0;
    int v;

    Base() {
        n++;
        v = 10;
        System.out.println("Base " + n);
    }

    void show() {
        System.out.println("Base v=" + v);
    }
}

class Derived extends Base {
    Derived() {
        super();
        v = v + 5;
        System.out.println("Derived " + n);
    }

    @Override
    void show() {
        System.out.println("Derived v=" + v);
    }
}`, `Base a = new Base();
Base b = new Derived();
a.show();
b.show();
System.out.println(Base.n);`) },
  ],
}),
);
})();
