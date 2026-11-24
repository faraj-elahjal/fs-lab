/* FS_Lab — Object-Oriented Programming in C++ (البرمجة الشيئية OOP, C++ version; the Java version is lessons_oop.js).
   Both versions share the course name; the course page switches between them (variant 'cpp' / 'java'). */
(function () {
const ind = (b) => b.replace(/^/gm, '    ').replace(/^\s+$/gm, '');
const P = (classes, body) => `#include <iostream>\n#include <string>\nusing namespace std;\n\n${classes ? classes.trim() + '\n\n' : ''}int main() {\n${ind(body.trim())}\n    return 0;\n}\n`;
const L = (o) => Object.assign({ course: 'البرمجة الشيئية OOP', variant: 'cpp', challenges: [] }, o);

window.FS_LESSONS.push(
L({
  id: 'coop1', title: 'الكلاس والكائن', tag: 'OOP1 · C++',
  concept: `<p><b>البرمجة الشيئية (OOP)</b> تنظّم البرنامج حول <b>الكائنات</b>: كل كائن يجمع بياناته والدوال التي تعمل عليها في وحدة واحدة، بدل أن تكون البيانات منفصلة عن الدوال كما في البرمجة الإجرائية.</p>
    <ul><li><b>الكلاس <code>class</code></b> قالب يحدد <b>الحقول</b> (البيانات) و<b>الدوال الأعضاء</b> (السلوك)، وينتهي تعريفه بفاصلة منقوطة <code>};</code>.</li>
    <li><b>الكائن</b> نسخة من الكلاس: <code>Car c;</code> تنشئ كائنًا في الذاكرة مباشرة، ولكل كائن نسخته الخاصة من الحقول.</li>
    <li>الأعضاء في <code>class</code> تكون <code>private</code> افتراضيًا، ونكتب <code>public:</code> قبل ما نريد استخدامه من خارج الكلاس. أما في <code>struct</code> فهي <code>public</code> افتراضيًا.</li>
    <li>نصل إلى أعضاء الكائن بالنقطة <code>c.model</code>، وعبر المؤشر بالسهم <code>p->model</code>.</li>
    <li>في ${'<bdi dir="ltr">C++</bdi>'} نسخ كائن <code>Car b = a;</code> ينشئ <b>كائنًا مستقلًا</b> بنسخة من الحقول، بخلاف المؤشر <code>Car* p = &amp;a;</code> الذي يشير إلى الكائن نفسه.</li>
    <li>الحقل الذي لم يُعطَ قيمة في كائن محلي تكون قيمته عشوائية (؟) حتى نعطيه قيمة.</li></ul>`,
  examples: [
    { id: 'co1a', title: 'أول كلاس وأول كائن', note: 'public والحقول والدوال', code: P(`class Car {
public:
    string model;
    int year;

    void show() {
        cout << model << " - " << year << endl;
    }
};`, `Car c;
c.model = "Toyota";
c.year = 2020;
c.show();`) },
    { id: 'co1b', title: 'كائنان من الكلاس نفسه', note: 'لكل كائن نسخته من الحقول', code: P(`class Student {
public:
    string name;
    double gpa;

    void print() {
        cout << name << " : " << gpa << endl;
    }
};`, `Student s1, s2;
s1.name = "Ali";
s1.gpa = 3.2;
s2.name = "Sara";
s2.gpa = 3.8;
s1.print();
s2.print();`) },
    { id: 'co1c', title: 'نسخة مستقلة أم مؤشر؟', note: 'b = a و p = &a', code: P(`class Point {
public:
    int x, y;
};`, `Point a;
a.x = 1;
a.y = 2;
Point b = a;
b.x = 99;
Point* p = &a;
p->y = 50;
cout << a.x << " " << a.y << endl;
cout << b.x << " " << b.y << endl;`) },
    { id: 'co1d', title: 'إدخال بيانات الكائن', note: 'cin مع الحقول', input: 'Omar 21', code: P(`class Person {
public:
    string name;
    int age;

    void greet() {
        cout << "Hi " << name << ", you are " << age << endl;
    }
};`, `Person p;
cout << "Name and age: ";
cin >> p.name >> p.age;
p.greet();`) },
    { id: 'co1e', title: 'خطأ: عضو private افتراضيًا', note: 'class بدون public', err: true, code: P(`class Wallet {
    int money;
};`, `Wallet w;
w.money = 100;`) },
  ],
}),
L({
  id: 'coop2', title: 'الـ Constructor والـ Destructor', tag: 'OOP2 · C++',
  concept: `<p><b>الـ constructor</b> دالة خاصة تُنفَّذ تلقائيًا عند إنشاء الكائن لتهيئة حقوله، و<b>الـ destructor</b> تُنفَّذ تلقائيًا عند انتهاء عمر الكائن.</p>
    <ul><li>الـ constructor اسمه اسم الكلاس، وليس له نوع إرجاع. ويمكن كتابة أكثر من constructor بمعاملات مختلفة (overloading)، أو إعطاء المعاملات قيمًا افتراضية.</li>
    <li>إذا لم تكتب أي constructor يضيف المترجم <b>default constructor</b>. وإذا كتبت constructor بمعاملات فلن يُضاف، و<code>Student s;</code> تصبح خطأ.</li>
    <li><b>قائمة التهيئة</b>: <code>Student(string n, int a) : name(n), age(a) { }</code> تعطي الحقول قيمها قبل جسم الـ constructor.</li>
    <li><code>this</code> مؤشر إلى الكائن الحالي: <code>this->name = name;</code> تميّز الحقل عن المعامل الذي له الاسم نفسه.</li>
    <li>الـ destructor <code>~Student()</code> بلا معاملات ولا نوع إرجاع، ويُستدعى عند خروج الكائن من نطاقه <code>}</code> أو عند <code>delete</code>. والكائنات تُهدم بعكس ترتيب إنشائها.</li>
    <li><b>Copy constructor</b> <code>Student(const Student&amp; other)</code> يُستدعى عند إنشاء كائن نسخةً من آخر: <code>Student b = a;</code> أو عند تمرير الكائن بالقيمة.</li>
    <li>تنبيه: <code>Student s();</code> لا تنشئ كائنًا بل تعرّف دالة، والصحيح <code>Student s;</code>.</li></ul>`,
  examples: [
    { id: 'co2a', title: 'Constructor بمعاملات', note: 'التهيئة عند الإنشاء', code: P(`class Student {
private:
    string name;
    int age;

public:
    Student(string n, int a) {
        name = n;
        age = a;
    }

    void show() {
        cout << name << " (" << age << ")" << endl;
    }
};`, `Student s("Ali", 20);
s.show();
Student t("Mona", 22);
t.show();`) },
    { id: 'co2b', title: 'قائمة التهيئة و this', note: ': name(name) و this->', code: P(`class Book {
    string title;
    double price;

public:
    Book(string title, double price) : title(title) {
        this->price = price;
    }

    void print() {
        cout << title << " costs " << price << endl;
    }
};`, `Book b("C++ Basics", 25.5);
b.print();`) },
    { id: 'co2c', title: 'عدة Constructors وقيم افتراضية', note: 'overloading', code: P(`class Rect {
    int width, height;

public:
    Rect() {
        width = 1;
        height = 1;
    }

    Rect(int side) {
        width = side;
        height = side;
    }

    Rect(int w, int h) : width(w), height(h) {}

    int area() {
        return width * height;
    }
};`, `Rect a;
Rect b(4);
Rect c(2, 5);
cout << a.area() << " " << b.area() << " " << c.area() << endl;`) },
    { id: 'co2d', title: 'متى يُنفَّذ الـ Destructor؟', note: 'ترتيب الإنشاء والهدم', code: P(`class Tracker {
    string name;

public:
    Tracker(string n) : name(n) {
        cout << "Create " << name << endl;
    }

    ~Tracker() {
        cout << "Destroy " << name << endl;
    }
};`, `Tracker a("A");
{
    Tracker b("B");
    cout << "inside block" << endl;
}
Tracker c("C");
cout << "end of main" << endl;`) },
    { id: 'co2e', title: 'Copy constructor', note: 'نسخة من كائن آخر', code: P(`class Teacher {
public:
    string name;
    int age;

    Teacher(string n, int a) : name(n), age(a) {}

    Teacher(const Teacher& other) {
        name = other.name;
        age = other.age;
        cout << "copy of " << other.name << endl;
    }

    bool isEqual(const Teacher& t) const {
        return name == t.name && age == t.age;
    }
};`, `Teacher t1("Salem", 40);
Teacher t2 = t1;
cout << t1.isEqual(t2) << endl;
t2.age = 41;
cout << t1.isEqual(t2) << endl;`) },
    { id: 'co2f', title: 'خطأ: لا يوجد default constructor', note: 'بعد كتابة constructor بمعاملات', err: true, code: P(`class Item {
    string name;

public:
    Item(string n) : name(n) {}
};`, `Item a("Pen");
Item b;`) },
  ],
}),
L({
  id: 'coop3', title: 'التغليف Encapsulation', tag: 'OOP3 · C++',
  concept: `<p><b>التغليف</b> يعني إخفاء بيانات الكائن (<code>private</code>) وجعل الوصول إليها <b>مضبوطًا</b> عن طريق دوال عامة (<code>public</code>)، فلا يضع أحد من الخارج قيمًا غير صحيحة.</p>
    <ul><li>محددات الوصول: <code>private</code> داخل الكلاس فقط، و<code>protected</code> للكلاس والكلاسات الوارثة، و<code>public</code> من أي مكان.</li>
    <li><b>getter</b> للقراءة مثل <code>getAge()</code>، و<b>setter</b> للتعديل مثل <code>setAge(int a)</code>، والـ setter مكان مناسب للتحقق من القيمة.</li>
    <li>الدالة التي لا تغيّر الكائن نكتب بعدها <code>const</code>: <code>int getAge() const</code>، فإذا حاولت تعديل حقل داخلها يكون خطأ.</li>
    <li>يمكن كتابة نموذج الدالة داخل الكلاس وتعريفها خارجه باستخدام <code>::</code>: <code>void Account::deposit(double x) { ... }</code>.</li>
    <li>الحقل الذي له getter فقط يكون للقراءة فقط من خارج الكلاس.</li></ul>`,
  examples: [
    { id: 'co3a', title: 'حساب بنكي محمي', note: 'private + دوال تتحقق', code: P(`class Account {
private:
    string owner;
    double balance;

public:
    Account(string o) : owner(o), balance(0) {}

    void deposit(double amount) {
        if (amount > 0) balance += amount;
        else cout << "Invalid amount" << endl;
    }

    void withdraw(double amount) {
        if (amount <= balance) balance -= amount;
        else cout << "Not enough balance" << endl;
    }

    double getBalance() const {
        return balance;
    }
};`, `Account acc("Ali");
acc.deposit(500);
acc.withdraw(200);
acc.withdraw(1000);
acc.deposit(-50);
cout << acc.getBalance() << endl;`) },
    { id: 'co3b', title: 'Getters و Setters مع التحقق', note: 'الدرجة من 0 إلى 100', code: P(`class Student {
private:
    string name;
    int mark;

public:
    void setName(string n) { name = n; }
    string getName() const { return name; }

    void setMark(int m) {
        if (m >= 0 && m <= 100) mark = m;
        else cout << "Mark must be 0..100" << endl;
    }

    int getMark() const { return mark; }
};`, `Student s;
s.setName("Huda");
s.setMark(87);
s.setMark(150);
cout << s.getName() << " " << s.getMark() << endl;`) },
    { id: 'co3c', title: 'التعريف خارج الكلاس بـ ::', note: 'النموذج داخل والجسم خارج', code: P(`class Circle {
private:
    double radius;

public:
    Circle(double r);
    double area() const;
    void setRadius(double r);
};

Circle::Circle(double r) : radius(r) {}

double Circle::area() const {
    return 3.14 * radius * radius;
}

void Circle::setRadius(double r) {
    if (r > 0) radius = r;
}`, `Circle c(2);
cout << c.area() << endl;
c.setRadius(3);
cout << c.area() << endl;`) },
    { id: 'co3d', title: 'خطأ: الوصول إلى عضو private', note: 'من main', err: true, code: P(`class Wallet {
private:
    int money = 100;
};`, `Wallet w;
w.money = 1000000;`) },
    { id: 'co3e', title: 'خطأ: تعديل حقل داخل دالة const', note: 'const تقرأ فقط', err: true, code: P(`class Counter {
    int value = 0;

public:
    int get() const {
        value++;
        return value;
    }
};`, `Counter c;
cout << c.get();`) },
  ],
}),
L({
  id: 'coop4', title: 'static و friend و Overloading', tag: 'OOP4 · C++',
  concept: `<p>الكلمة <b><code>static</code></b> تجعل العضو تابعًا <b>للكلاس نفسه</b>: نسخة واحدة مشتركة بين كل الكائنات.</p>
    <ul><li>الحقل الثابت يُعلَن داخل الكلاس <code>static int count;</code> ويُعرَّف مرة واحدة خارجه <code>int Car::count = 0;</code>، ونصل إليه بـ <code>Car::count</code>.</li>
    <li>الدالة الثابتة <code>static int getCount()</code> تُستدعى بدون كائن <code>Car::getCount()</code>، ولا يوجد فيها <code>this</code>، فلا تستخدم الحقول العادية مباشرة.</li>
    <li><b>التحميل الزائد (Overloading)</b>: عدة دوال بالاسم نفسه تختلف في عدد المعاملات أو أنواعها. واختلاف نوع الإرجاع وحده لا يكفي.</li>
    <li><b>الدالة الصديقة <code>friend</code></b>: دالة ليست عضوًا في الكلاس، لكنها تستطيع الوصول إلى أعضائه الخاصة لأن الكلاس أعلنها صديقة له.</li></ul>`,
  examples: [
    { id: 'co4a', title: 'عدّاد الكائنات static', note: 'نسخة واحدة مشتركة', code: P(`class Car {
public:
    static int count;
    string model;
    int number;

    Car(string m) : model(m) {
        count++;
        number = count;
    }

    static int getCount() {
        return count;
    }
};

int Car::count = 0;`, `Car a("Kia");
Car b("BMW");
Car c("Fiat");
cout << "Cars created: " << Car::getCount() << endl;
cout << b.model << " is car number " << b.number << endl;`) },
    { id: 'co4b', title: 'Overloading داخل الكلاس', note: 'الاسم نفسه ومعاملات مختلفة', code: P(`class Calc {
public:
    int add(int a, int b) { return a + b; }
    int add(int a, int b, int c) { return a + b + c; }
    double add(double a, double b) { return a + b; }
    string add(string a, string b) { return a + b; }
};`, `Calc c;
cout << c.add(2, 3) << endl;
cout << c.add(2, 3, 4) << endl;
cout << c.add(2.5, 1.5) << endl;
cout << c.add(string("OO"), string("P")) << endl;`) },
    { id: 'co4c', title: 'دالة صديقة friend', note: 'تصل إلى private', code: P(`class Box {
private:
    double width;

public:
    Box(double w) : width(w) {}
    friend void printWidth(const Box& b);
};

void printWidth(const Box& b) {
    cout << "Width = " << b.width << endl;
}`, `Box b(7.5);
printWidth(b);`) },
    { id: 'co4d', title: 'خطأ: static تستخدم حقلًا عاديًا', note: 'لا يوجد this', err: true, code: P(`class Counter {
    int value;

public:
    static void increase() {
        value++;
    }
};`, `Counter::increase();`) },
    { id: 'co4e', title: 'خطأ: حقل static بدون تعريف خارجي', note: 'int A::n = 0;', err: true, code: P(`class A {
public:
    static int n;
};`, `cout << A::n;`) },
  ],
}),
L({
  id: 'coop5', title: 'الوراثة Inheritance', tag: 'OOP5 · C++',
  concept: `<p><b>الوراثة</b> تسمح لكلاس جديد (الابن) أن يأخذ حقول ودوال كلاس موجود (الأب) ويضيف عليها، فنعيد استخدام الكود. وتمثل علاقة <b>is-a</b>: الطالب هو شخص.</p>
    <ul><li>تُكتب <code>class Student : public Person</code>. ونوع الوراثة <code>public</code> أو <code>protected</code> أو <code>private</code> يحدد كيف تظهر أعضاء الأب العامة في الابن.</li>
    <li>عند إنشاء كائن الابن يُنفَّذ <b>constructor الأب أولًا</b>، ونمرر له القيم في قائمة التهيئة: <code>Student(...) : Person(n, a) { }</code>. وعند الهدم يُنفَّذ destructor الابن أولًا ثم الأب.</li>
    <li>العضو <code>private</code> في الأب لا يراه الابن، والعضو <code>protected</code> يراه الابن ولا يراه main.</li>
    <li><code>Person::introduce()</code> داخل الابن تستدعي نسخة الأب من الدالة.</li>
    <li>أنواع الوراثة: <b>Single</b> (أب وابن)، و<b>Multilevel</b> (جد ← أب ← ابن)، و<b>Hierarchical</b> (أب وعدة أبناء)، و<b>Multiple</b>: ${'<bdi dir="ltr">C++</bdi>'} تسمح بالوراثة من أكثر من كلاس <code>class C : public A, public B</code>.</li></ul>`,
  examples: [
    { id: 'co5a', title: 'Person و Student', note: 'public inheritance و constructor الأب', code: P(`class Person {
protected:
    string name;
    int age;

public:
    Person(string n, int a) : name(n), age(a) {}

    void introduce() {
        cout << "I am " << name << ", " << age << endl;
    }
};

class Student : public Person {
    string major;

public:
    Student(string n, int a, string m) : Person(n, a), major(m) {}

    void study() {
        cout << name << " studies " << major << endl;
    }
};`, `Student s("Ali", 20, "IT");
s.introduce();
s.study();`) },
    { id: 'co5b', title: 'ترتيب الـ Constructors والـ Destructors', note: 'A ثم B ثم C، والهدم بالعكس', code: P(`class A {
public:
    A() { cout << "A constructor" << endl; }
    ~A() { cout << "A destructor" << endl; }
};

class B : public A {
public:
    B() { cout << "B constructor" << endl; }
    ~B() { cout << "B destructor" << endl; }
};

class C : public B {
public:
    C() { cout << "C constructor" << endl; }
    ~C() { cout << "C destructor" << endl; }
};`, `C obj;
cout << "--- end of main ---" << endl;`) },
    { id: 'co5c', title: 'استدعاء دالة الأب', note: 'Vehicle::info()', code: P(`class Vehicle {
public:
    void info() {
        cout << "Vehicle: moves on roads" << endl;
    }
};

class Bus : public Vehicle {
    int seats = 40;

public:
    void info() {
        Vehicle::info();
        cout << "Bus: " << seats << " seats" << endl;
    }
};`, `Bus b;
b.info();`) },
    { id: 'co5d', title: 'وراثة متعددة', note: 'Multiple inheritance', code: P(`class Printer {
public:
    void print() { cout << "Printing..." << endl; }
};

class Scanner {
public:
    void scan() { cout << "Scanning..." << endl; }
};

class Copier : public Printer, public Scanner {
public:
    void copy() {
        scan();
        print();
    }
};`, `Copier c;
c.copy();`) },
    { id: 'co5e', title: 'خطأ: الابن والعضو private', note: 'استخدم protected', err: true, code: P(`class Animal {
private:
    string name = "Cat";
};

class Cat : public Animal {
public:
    void show() {
        cout << name << endl;
    }
};`, `Cat c;
c.show();`) },
  ],
}),
L({
  id: 'coop6', title: 'تعدد الأشكال و virtual', tag: 'OOP6 · C++',
  concept: `<p><b>تعدد الأشكال (Polymorphism)</b>: مؤشر أو مرجع من نوع الأب يمكن أن يشير إلى كائن من أي كلاس ابن، مثل <code>Animal* a = new Dog();</code>.</p>
    <ul><li>إذا كانت الدالة في الأب <code>virtual</code> تُنفَّذ نسخة <b>الكائن الحقيقي</b> وقت التشغيل (Dog)، وإذا لم تكن virtual تُنفَّذ نسخة <b>نوع المؤشر</b> (Animal).</li>
    <li>إعادة التعريف (Overriding): الابن يكتب دالة بنفس الاسم والمعاملات، ونكتب بعدها <code>override</code> ليتأكد المترجم أنها تعيد تعريف دالة virtual فعلًا.</li>
    <li>تعدد الأشكال يعمل عبر <b>المؤشرات والمراجع</b> فقط. أما نسخ كائن الابن في متغير من نوع الأب <code>Animal a = d;</code> فيقطع أجزاء الابن (object slicing).</li>
    <li>عند حذف كائن ابن عبر مؤشر الأب يجب أن يكون الـ destructor في الأب <code>virtual</code>، وإلا لا يُستدعى destructor الابن.</li>
    <li><code>dynamic_cast&lt;Dog*&gt;(a)</code> تحوّل مؤشر الأب إلى مؤشر الابن إذا كان الكائن الحقيقي من نوعه، وإلا تُرجع <code>nullptr</code>.</li></ul>`,
  examples: [
    { id: 'co6a', title: 'virtual أم لا؟', note: 'نوع المؤشر أم الكائن الحقيقي', code: P(`class Animal {
public:
    void eat() { cout << "Animal eats" << endl; }
    virtual void sound() { cout << "Some sound" << endl; }
};

class Dog : public Animal {
public:
    void eat() { cout << "Dog eats bones" << endl; }
    void sound() override { cout << "Woof" << endl; }
};`, `Dog d;
Animal* a = &d;
a->eat();
a->sound();
d.eat();`) },
    { id: 'co6b', title: 'مصفوفة مؤشرات من نوع الأب', note: 'حلقة واحدة لكل الأشكال', code: P(`class Shape {
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

class Square : public Shape {
    double side;

public:
    Square(double s) : side(s) {}
    double area() override { return side * side; }
};`, `Shape* shapes[3] = { new Circle(2), new Square(3), new Circle(1) };
double total = 0;
for (int i = 0; i < 3; i++) {
    total += shapes[i]->area();
}
cout << "Total area = " << total << endl;
for (int i = 0; i < 3; i++) delete shapes[i];`) },
    { id: 'co6c', title: 'مرجع من نوع الأب', note: 'دالة واحدة لكل الأبناء', code: P(`class Employee {
public:
    virtual double salary() { return 1000; }
};

class Manager : public Employee {
public:
    double salary() override { return 2500; }
};

void printSalary(Employee& e) {
    cout << "Salary: " << e.salary() << endl;
}`, `Employee e;
Manager m;
printSalary(e);
printSalary(m);`) },
    { id: 'co6d', title: 'virtual destructor', note: 'الحذف عبر مؤشر الأب', code: P(`class Base {
public:
    virtual ~Base() { cout << "~Base" << endl; }
};

class Derived : public Base {
public:
    ~Derived() { cout << "~Derived" << endl; }
};`, `Base* p = new Derived();
delete p;`) },
    { id: 'co6e', title: 'dynamic_cast', note: 'هل الكائن من هذا النوع؟', code: P(`class Animal {
public:
    virtual ~Animal() {}
};

class Bird : public Animal {
public:
    void fly() { cout << "Flying" << endl; }
};

class Fish : public Animal {
};`, `Animal* list[2] = { new Bird(), new Fish() };
for (int i = 0; i < 2; i++) {
    Bird* b = dynamic_cast<Bird*>(list[i]);
    if (b != nullptr) b->fly();
    else cout << "Not a bird" << endl;
}`) },
    { id: 'co6f', title: 'خطأ: دالة الابن عبر مؤشر الأب', note: 'المترجم ينظر لنوع المؤشر', err: true, code: P(`class Animal {
public:
    virtual ~Animal() {}
};

class Bird : public Animal {
public:
    void fly() { cout << "Flying" << endl; }
};`, `Animal* a = new Bird();
a->fly();`) },
  ],
}),
L({
  id: 'coop7', title: 'الكلاسات المجردة Abstract', tag: 'OOP7 · C++',
  concept: `<p><b>التجريد (Abstraction)</b> يعني تحديد <b>ماذا</b> يفعل الكائن دون تفاصيل <b>كيف</b> يفعله.</p>
    <ul><li><b>الدالة المجردة (pure virtual)</b> تُكتب بلا جسم: <code>virtual double area() = 0;</code>.</li>
    <li>الكلاس الذي فيه دالة مجردة واحدة على الأقل يصبح <b>كلاسًا مجردًا</b>: لا يمكن إنشاء كائن منه، لكن يمكن تعريف مؤشر أو مرجع من نوعه.</li>
    <li>الكلاس الابن يجب أن يعيد تعريف كل الدوال المجردة ليصبح كلاسًا عاديًا، وإلا يبقى مجردًا هو أيضًا.</li>
    <li>الكلاس المجرد يمكن أن يحتوي حقولًا وconstructor ودوالًا عادية بجسم.</li>
    <li>الكلاس الذي كل دواله مجردة يعمل عمل <b>الواجهة (interface)</b>، ويمكن للكلاس أن يرث من أكثر من واجهة.</li></ul>`,
  examples: [
    { id: 'co7a', title: 'كلاس مجرد Shape', note: 'دالة = 0 ودالة عادية', code: P(`class Shape {
protected:
    string name;

public:
    Shape(string n) : name(n) {}
    virtual double area() = 0;
    virtual ~Shape() {}

    void describe() {
        cout << name << " area = " << area() << endl;
    }
};

class Rectangle : public Shape {
    double w, h;

public:
    Rectangle(double w, double h) : Shape("Rectangle"), w(w), h(h) {}
    double area() override { return w * h; }
};

class Circle : public Shape {
    double r;

public:
    Circle(double r) : Shape("Circle"), r(r) {}
    double area() override { return 3.14 * r * r; }
};`, `Rectangle r(4, 5);
Circle c(1);
r.describe();
c.describe();`) },
    { id: 'co7b', title: 'واجهة كل دوالها مجردة', note: 'Payable', code: P(`class Payable {
public:
    virtual double getPayment() = 0;
    virtual ~Payable() {}
};

class Employee : public Payable {
    double salary;

public:
    Employee(double s) : salary(s) {}
    double getPayment() override { return salary - salary * 0.1; }
};

class Invoice : public Payable {
    int qty;
    double price;

public:
    Invoice(int q, double p) : qty(q), price(p) {}
    double getPayment() override { return qty * price; }
};`, `Payable* items[2] = { new Employee(1000), new Invoice(3, 50) };
for (int i = 0; i < 2; i++) {
    cout << items[i]->getPayment() << endl;
}`) },
    { id: 'co7c', title: 'خطأ: كائن من كلاس مجرد', note: 'لا يمكن إنشاؤه', err: true, code: P(`class Animal {
public:
    virtual void sound() = 0;
};`, `Animal a;`) },
    { id: 'co7d', title: 'خطأ: الابن لم يعرّف الدالة المجردة', note: 'فبقي مجردًا', err: true, code: P(`class Animal {
public:
    virtual void sound() = 0;
};

class Cat : public Animal {
};`, `Cat c;`) },
  ],
}),
L({
  id: 'coop8', title: 'تحميل العوامل Operator Overloading', tag: 'OOP8 · C++',
  concept: `<p><b>تحميل العوامل</b> يسمح باستخدام العوامل مثل <code>+</code> و<code>==</code> و<code>&lt;&lt;</code> مع كائنات كلاساتنا كما نستخدمها مع الأعداد.</p>
    <ul><li>نعرّف دالة اسمها <code>operator</code> متبوعًا بالعامل: <code>Point operator+(const Point&amp; o) const</code>، فتصبح <code>a + b</code> تعني <code>a.operator+(b)</code>.</li>
    <li>عوامل المقارنة <code>==</code> و<code>&lt;</code> تُرجع <code>bool</code>.</li>
    <li><code>operator+=</code> يعدّل الكائن نفسه ويُرجع <code>*this</code>.</li>
    <li>لطباعة الكائن بـ <code>cout &lt;&lt; p</code> نكتب دالة خارج الكلاس <code>ostream&amp; operator&lt;&lt;(ostream&amp; out, const Point&amp; p)</code>، وغالبًا نجعلها <code>friend</code> لتصل إلى الحقول الخاصة.</li>
    <li>نمرر الكائنات بـ <code>const&amp;</code> لتجنّب النسخ وحماية الأصل من التعديل.</li></ul>`,
  examples: [
    { id: 'co8a', title: 'جمع نقطتين بـ +', note: 'operator+', code: P(`class Point {
public:
    int x, y;

    Point(int x = 0, int y = 0) : x(x), y(y) {}

    Point operator+(const Point& o) const {
        return Point(x + o.x, y + o.y);
    }

    bool operator==(const Point& o) const {
        return x == o.x && y == o.y;
    }
};`, `Point a(1, 2), b(3, 4);
Point c = a + b;
cout << c.x << ", " << c.y << endl;
cout << (a == b) << " " << (c == Point(4, 6)) << endl;`) },
    { id: 'co8b', title: 'طباعة الكائن بـ <<', note: 'friend operator<<', code: P(`class Fraction {
    int num, den;

public:
    Fraction(int n, int d) : num(n), den(d) {}

    Fraction operator*(const Fraction& o) const {
        return Fraction(num * o.num, den * o.den);
    }

    friend ostream& operator<<(ostream& out, const Fraction& f);
};

ostream& operator<<(ostream& out, const Fraction& f) {
    out << f.num << "/" << f.den;
    return out;
}`, `Fraction a(1, 2), b(3, 4);
cout << a << " * " << b << " = " << a * b << endl;`) },
    { id: 'co8c', title: 'العامل += يعدّل الكائن', note: 'return *this', code: P(`class Money {
public:
    int dinars;

    Money(int d) : dinars(d) {}

    Money& operator+=(const Money& o) {
        dinars += o.dinars;
        return *this;
    }
};`, `Money wallet(10);
Money salary(250);
wallet += salary;
wallet += Money(5);
cout << wallet.dinars << " LYD" << endl;`) },
  ],
}),
L({
  id: 'coop9', title: 'العلاقات بين الكلاسات', tag: 'OOP9 · C++',
  concept: `<p>الكلاسات تتعامل مع بعضها بعلاقات مختلفة، ونرسمها في <b>مخطط الكلاسات (Class Diagram)</b>.</p>
    <ul><li><b>الارتباط (Association)</b>: علاقة <b>uses-a</b> بين كائنين مستقلين، مثل مدرّس يدرّس مادة: كائن يُمرَّر إلى دالة كائن آخر.</li>
    <li><b>التجميع (Aggregation)</b>: علاقة <b>has-a</b> ضعيفة؛ الكلاس يحمل <b>مؤشرات</b> إلى كائنات أُنشئت خارجه، وتبقى بعد انتهائه، مثل قسم فيه موظفون. يُرسم بمعيّن فارغ ◇.</li>
    <li><b>التركيب (Composition)</b>: علاقة <b>part-of</b> قوية؛ الكلاس يحتوي <b>كائنًا عضوًا</b> يُنشأ معه ويُهدم معه، مثل سيارة ومحركها. يُرسم بمعيّن ممتلئ ◆.</li>
    <li>في التركيب يُنشأ الكائن العضو <b>قبل</b> جسم constructor الحاوي، ويُهدم <b>بعد</b> destructor الحاوي.</li>
    <li>في مخطط الكلاسات: <code>-</code> private، و<code>+</code> public، و<code>#</code> protected، والسهم المثلث المفرغ للوراثة.</li></ul>`,
  examples: [
    { id: 'co9a', title: 'ارتباط Association', note: 'كائن يُمرَّر لدالة كائن آخر', code: P(`class Course {
public:
    string title;
    Course(string t) : title(t) {}
};

class Teacher {
    string name;

public:
    Teacher(string n) : name(n) {}

    void teach(const Course& c) {
        cout << name << " teaches " << c.title << endl;
    }
};`, `Teacher t("Dr. Salem");
Course c1("OOP"), c2("Networks");
t.teach(c1);
t.teach(c2);`) },
    { id: 'co9b', title: 'تجميع Aggregation', note: 'مؤشرات لكائنات خارجية', code: P(`class Employee {
public:
    string name;
    Employee(string n) : name(n) {}
};

class Department {
    string name;
    Employee* staff[5];
    int count = 0;

public:
    Department(string n) : name(n) {}

    void add(Employee* e) {
        staff[count] = e;
        count++;
    }

    void print() {
        cout << name << " has " << count << " employees:" << endl;
        for (int i = 0; i < count; i++) cout << "- " << staff[i]->name << endl;
    }
};`, `Employee e1("Ali"), e2("Mona");
{
    Department d("IT");
    d.add(&e1);
    d.add(&e2);
    d.print();
}
cout << e1.name << " still exists" << endl;`) },
    { id: 'co9c', title: 'تركيب Composition', note: 'كائن عضو يُنشأ ويُهدم مع الحاوي', code: P(`class Engine {
    int power;

public:
    Engine(int p) : power(p) { cout << "Engine " << power << "hp built" << endl; }
    ~Engine() { cout << "Engine destroyed" << endl; }
    void start() { cout << "Engine started" << endl; }
};

class Car {
    string model;
    Engine engine;

public:
    Car(string m, int p) : model(m), engine(p) { cout << model << " built" << endl; }
    ~Car() { cout << model << " destroyed" << endl; }
    void drive() { engine.start(); cout << model << " is moving" << endl; }
};`, `Car car("Hyundai", 120);
car.drive();`) },
  ],
}),
L({
  id: 'coop10', title: 'القوالب Templates', tag: 'OOP10 · C++',
  concept: `<p><b>القوالب (Templates)</b> تسمح بكتابة دالة أو كلاس مرة واحدة يعمل مع أنواع بيانات مختلفة، والمترجم يولّد النسخة المناسبة لكل نوع.</p>
    <ul><li>قالب الدالة: <code>template &lt;typename T&gt; T maxOf(T a, T b)</code> تعمل مع <code>int</code> و<code>double</code> و<code>string</code>.</li>
    <li>قالب الكلاس: <code>template &lt;class T&gt; class Box { T value; ... };</code> ونحدد النوع عند الإنشاء: <code>Box&lt;int&gt; b(5);</code>.</li>
    <li>يمكن استخدام أكثر من نوع عام: <code>template &lt;typename K, typename V&gt;</code>.</li>
    <li>القوالب أساس مكتبة ${'<bdi dir="ltr">C++</bdi>'} القياسية مثل <code>vector&lt;int&gt;</code>.</li></ul>`,
  examples: [
    { id: 'co10a', title: 'قالب دالة', note: 'دالة واحدة لأنواع متعددة', code: `#include <iostream>
#include <string>
using namespace std;

template <typename T>
T maxOf(T a, T b) {
    if (a > b) return a;
    return b;
}

template <typename T>
void swapValues(T& a, T& b) {
    T temp = a;
    a = b;
    b = temp;
}

int main() {
    cout << maxOf(3, 9) << endl;
    cout << maxOf(2.5, 1.5) << endl;
    cout << maxOf(string("apple"), string("banana")) << endl;
    int x = 1, y = 2;
    swapValues(x, y);
    cout << x << " " << y << endl;
    return 0;
}
` },
    { id: 'co10b', title: 'قالب كلاس', note: 'Box<int> و Box<string>', code: `#include <iostream>
#include <string>
using namespace std;

template <class T>
class Box {
    T value;

public:
    Box(T v) : value(v) {}
    T get() { return value; }
    void set(T v) { value = v; }
};

int main() {
    Box<int> a(5);
    Box<string> b("OOP");
    a.set(a.get() * 2);
    cout << a.get() << endl;
    cout << b.get() << " in C++" << endl;
    return 0;
}
` },
    { id: 'co10c', title: 'قالب بنوعين', note: 'Pair<K, V>', code: `#include <iostream>
#include <string>
using namespace std;

template <typename K, typename V>
class Pair {
    K key;
    V value;

public:
    Pair(K k, V v) : key(k), value(v) {}
    void print() { cout << key << " = " << value << endl; }
};

int main() {
    Pair<string, int> p("Age", 21);
    Pair<string, double> q("GPA", 3.5);
    p.print();
    q.print();
    return 0;
}
` },
  ],
}),
L({
  id: 'coopexam', title: 'مراجعة الامتحان', tag: 'OOP · C++',
  concept: `<p>مراجعة سريعة لأهم مفاهيم المقرر:</p>
    <ul><li>مبادئ OOP الأربعة: <b>التغليف</b> و<b>الوراثة</b> و<b>تعدد الأشكال</b> و<b>التجريد</b>.</li>
    <li>الـ constructor: اسم الكلاس، بلا نوع إرجاع، يُنفَّذ عند الإنشاء ويمكن عمل overloading له. والـ destructor <code>~X()</code> بلا معاملات، ويُنفَّذ عند نهاية النطاق أو <code>delete</code>.</li>
    <li>ترتيب الإنشاء: الأب ← الأعضاء ← جسم الابن، والهدم بالعكس.</li>
    <li><code>this</code> مؤشر للكائن الحالي، و<code>static</code> عضو مشترك للكلاس، و<code>friend</code> دالة خارجية تصل إلى الخاص، و<code>const</code> بعد الدالة تمنعها من تعديل الكائن.</li>
    <li>Overloading: الاسم نفسه ومعاملات مختلفة. Overriding: الابن يعيد تعريف دالة الأب، ومع <code>virtual</code> يعمل تعدد الأشكال عبر المؤشرات والمراجع.</li>
    <li>الكلاس المجرد فيه دالة <code>= 0</code> ولا يُنشأ منه كائن.</li></ul>`,
  examples: [
    { id: 'coxa', title: 'برنامج شامل: نظام موظفين', note: 'abstract + وراثة + virtual + static', code: P(`class Employee {
protected:
    string name;
    static int count;

public:
    Employee(string n) : name(n) { count++; }
    virtual ~Employee() {}
    virtual double salary() const = 0;
    static int getCount() { return count; }

    void print() const {
        cout << name << ": " << salary() << endl;
    }
};

int Employee::count = 0;

class FullTime : public Employee {
    double monthly;

public:
    FullTime(string n, double m) : Employee(n), monthly(m) {}
    double salary() const override { return monthly; }
};

class PartTime : public Employee {
    int hours;
    double rate;

public:
    PartTime(string n, int h, double r) : Employee(n), hours(h), rate(r) {}
    double salary() const override { return hours * rate; }
};`, `Employee* staff[2] = { new FullTime("Ali", 2500), new PartTime("Sara", 40, 15) };
double total = 0;
for (int i = 0; i < 2; i++) {
    staff[i]->print();
    total += staff[i]->salary();
}
cout << "Employees: " << Employee::getCount() << ", total = " << total << endl;
for (int i = 0; i < 2; i++) delete staff[i];`) },
    { id: 'coxb', title: 'تتبع: الإنشاء والهدم', note: 'ماذا يُطبع؟', code: P(`class Base {
public:
    Base() { cout << "Base() "; }
    virtual void show() { cout << "Base::show "; }
    virtual ~Base() { cout << "~Base "; }
};

class Derived : public Base {
public:
    Derived() { cout << "Derived() "; }
    void show() override { cout << "Derived::show "; }
    ~Derived() { cout << "~Derived "; }
};`, `Base* p = new Derived();
p->show();
delete p;
cout << endl;`) },
  ],
}),
);
})();
