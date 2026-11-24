/* Self-test + essay questions for the OOP (Java) course. */
(function () {
const { J } = window.FS_Q;
const SC = 'import java.util.Scanner;';
const AL = 'import java.util.ArrayList;';
const SCAL = 'import java.util.ArrayList;\nimport java.util.Scanner;';
const TF = ['صح', 'خطأ'];
const mcq = (q, opts, a, why, code) => ({ k: 'mcq', q, opts, a, why, code });
const tf = (q, ok, why) => ({ k: 'mcq', q, opts: TF, a: ok ? 0 : 1, why });
const out = (code, input, q) => ({ k: 'out', code, input, q });

FS_addQuiz('oop1', [
  mcq('ما الفرق الأساسي بين الكلاس والكائن؟', ['الكلاس قالب يُكتب مرة واحدة، والكائن نسخة منه تُحجز في الذاكرة', 'الكائن قالب والكلاس نسخة منه', 'لا فرق بينهما', 'الكلاس يُحجز في الذاكرة بـ new والكائن لا'], 0, 'الكلاس مخطط (blueprint)، والكائن نسخة حقيقية منه تُنشأ بـ <code>new</code>.'),
  mcq('الكائن (Object) يتكوّن من:', ['حالة (State) + سلوك (Behavior)', 'حالة + متغيرات', 'اسم + دوال فقط', 'كلاس + حزمة'], 0, 'الحالة هي قيم الحقول، والسلوك هو الدوال.'),
  mcq('أي كلمة تُستخدم لإنشاء كائن جديد في Java؟', ['new', 'create', 'object', 'class'], 0),
  mcq('ما القيمة الافتراضية لحقل من النوع <code>String</code> في كائن جديد؟', ['null', '""', '0', 'لا قيمة له ويحدث خطأ'], 0, 'الحقول المرجعية تبدأ بـ <code>null</code>.'),
  mcq('الكائنات تُعتبر من نوع:', ['Non-Primitive (Reference) Data Type', 'Primitive Data Type'], 0),
  tf('Java لغة إجرائية (Procedural) وليست كائنية.', false, 'Java لغة برمجة كائنية التوجه (Object-Oriented).'),
  tf('يمكن إنشاء كائن من كلاس عادي بدون استخدام الكلمة new.', false, 'الكائنات العادية تُنشأ بـ <code>new</code> (باستثناء النصوص الحرفية مثل "abc").'),
  tf('المتغيرات المحلية داخل الدوال تأخذ قيمة افتراضية تلقائيًا.', false, 'المتغير المحلي يجب إعطاؤه قيمة قبل استخدامه، وإلا يحدث خطأ ترجمة.'),
  tf('اسم الكلاس العام public يجب أن يطابق اسم الملف.', true),
  tf('الحزمة java.lang تُستورد تلقائيًا في كل برنامج.', true, 'لهذا نستخدم <code>String</code> و<code>Math</code> و<code>System</code> بدون import.'),
  tf('Java فيها Garbage Collector يحرّر الكائنات التي لا يشير إليها أي متغير تلقائيًا.', true),
  mcq('كيف نقرأ أول حرف من إدخال المستخدم بكائن <code>Scanner in</code>؟', ['<code>in.next().charAt(0)</code>', '<code>in.nextChar()</code>', '<code>in.nextLine()</code>', '<code>in.char()</code>'], 0, 'لا توجد <code>nextChar()</code> في Scanner، فنقرأ كلمة ونأخذ حرفها الأول.'),
  mcq('لمقارنة محتوى نصين <code>a</code> و<code>b</code> في Java نستخدم:', ['<code>a.equals(b)</code>', '<code>a == b</code>', '<code>a = b</code>', '<code>a.compare(b)</code>'], 0, '<code>==</code> تقارن العناوين (المراجع) وليس المحتوى.'),
  out(J(`class Counter {
    int value;
}`, `Counter a = new Counter();
Counter b = a;
a.value = 5;
b.value++;
System.out.println(a.value + " " + b.value);`)),
  out(J(`class Pt {
    int x;
}`, `Pt p = new Pt();
Pt q = new Pt();
p.x = 3;
q.x = p.x * 2;
p = q;
p.x++;
System.out.println(q.x);`)),
  out(J('', `String s = "Libya";
System.out.println(s.length() + " " + s.charAt(0) + " " + s.toUpperCase());`)),
], [
  { id: 'eo1a', title: 'كلاس مستطيل', task: 'اكتب الكلاس <code>Rectangle</code> فيه الحقلان <code>width</code> و<code>height</code> (double)، والدالتان <code>area()</code> و<code>perimeter()</code>. في main أنشئ كائنًا، واقرأ العرض والطول، ثم اطبع المساحة في سطر والمحيط في السطر التالي.',
    code: J(`class Rectangle {
    // اكتب الحقول والدوال هنا
}`, `Scanner in = new Scanner(System.in);
// أنشئ الكائن واقرأ القيم واطبع المساحة والمحيط`, SC),
    ref: J(`class Rectangle {
    double width;
    double height;

    double area() {
        return width * height;
    }

    double perimeter() {
        return 2 * (width + height);
    }
}`, `Scanner in = new Scanner(System.in);
Rectangle r = new Rectangle();
r.width = in.nextDouble();
r.height = in.nextDouble();
System.out.println(r.area());
System.out.println(r.perimeter());`, SC), inputs: ['4 5', '2.5 2', '10 1'] },
  { id: 'eo1b', title: 'بيانات طالب', task: 'اكتب الكلاس <code>Student</code> فيه <code>name</code> و<code>mark</code> (int)، والدالة <code>getGrade()</code> التي تُرجع <code>"Pass"</code> إذا كانت الدرجة 50 فأكثر و<code>"Fail"</code> غير ذلك. اقرأ الاسم والدرجة، واطبع: <code>الاسم: Pass</code> مثل <code>Ali: Pass</code>.',
    code: J(`class Student {
    // الحقول والدالة getGrade
}`, `Scanner in = new Scanner(System.in);
`, SC),
    ref: J(`class Student {
    String name;
    int mark;

    String getGrade() {
        if (mark >= 50) return "Pass";
        return "Fail";
    }
}`, `Scanner in = new Scanner(System.in);
Student s = new Student();
s.name = in.next();
s.mark = in.nextInt();
System.out.println(s.name + ": " + s.getGrade());`, SC), inputs: ['Ali 75', 'Sara 49', 'Omar 50'] },
  { id: 'eo1c', title: 'مقارنة كلمتي مرور', task: 'اقرأ كلمتين بـ <code>next()</code>، واطبع <code>Match</code> إذا كانتا متطابقتين في المحتوى و<code>No match</code> غير ذلك. تذكّر أن <code>==</code> لا تقارن محتوى النصوص.',
    code: J('', `Scanner in = new Scanner(System.in);
`, SC),
    ref: J('', `Scanner in = new Scanner(System.in);
String a = in.next();
String b = in.next();
if (a.equals(b)) System.out.println("Match");
else System.out.println("No match");`, SC), inputs: ['abc123 abc123', 'abc abd', 'Java java'] },
]);

FS_addQuiz('oop2', [
  mcq('الـ constructor يجب أن يكون:', ['بنفس اسم الكلاس وبدون نوع إرجاع', 'بنفس اسم الكلاس ويُرجع قيمة', 'باسم init ونوعه void', 'باسم أي دالة'], 0),
  mcq('ما الذي يميّز الـ constructor عن الدالة العادية؟', ['يهيّئ الكائن ويحمل اسم الكلاس ويُنفَّذ تلقائيًا عند الإنشاء', 'له نوع إرجاع دائمًا', 'لا يمكن عمل overloading له', 'يستدعيه المبرمج صراحة مثل الدوال'], 0),
  mcq('ماذا تعني <code>this.name = name;</code> داخل الـ constructor؟', ['وضع قيمة المعامل name في حقل الكائن name', 'وضع قيمة الحقل في المعامل', 'لا تفعل شيئًا', 'تنشئ كائنًا جديدًا'], 0, '<code>this.name</code> هو الحقل، و<code>name</code> وحده هو المعامل.'),
  mcq('إذا كتبنا في الكلاس constructor بمعاملات فقط، فماذا يحدث عند <code>new A()</code>؟', ['خطأ ترجمة لأن الـ default constructor لا يُضاف تلقائيًا', 'يُستدعى default constructor تلقائيًا', 'تأخذ المعاملات القيمة 0', 'يُنشأ الكائن بقيم null'], 0),
  mcq('أين يجب أن تُكتب <code>this(...)</code> داخل الـ constructor؟', ['في أول سطر', 'في آخر سطر', 'في أي مكان', 'خارج الـ constructor'], 0),
  mcq('ما الذي لا تفعله الكلمة <code>this</code> في Java؟', ['استدعاء دالة من الكلاس الأب', 'الإشارة إلى متغيرات الكائن الحالي', 'تمرير الكائن الحالي كمعامل لدالة', 'استدعاء constructor آخر من الكلاس نفسه'], 0, 'استدعاء دالة الأب يكون بـ <code>super</code>.'),
  tf('يمكن أن يُرجع الـ constructor قيمة.', false, 'الـ constructor ليس له نوع إرجاع.'),
  tf('يمكن أن يحتوي الكلاس أكثر من constructor بمعاملات مختلفة.', true, 'هذا constructor overloading.'),
  tf('الـ constructor يُورَث للكلاسات الابن.', false),
  out(J(`class A {
    int x;

    A() {
        this(5);
        x = x * 2;
    }

    A(int x) {
        this.x = x + 1;
    }
}`, `A a = new A();
System.out.println(a.x);`)),
  out(J(`class Item {
    String name;
    int qty;

    Item(String name, int qty) {
        name = name;
        this.qty = qty;
    }
}`, `Item it = new Item("Pen", 3);
System.out.println(it.name + " " + it.qty);`), '', 'ما ناتج البرنامج؟ انتبه إلى الـ constructor.'),
  out(J(`class Box {
    int size;

    Box(int s) {
        size = s;
        System.out.println("Box " + size);
    }

    Box(Box other) {
        this(other.size + 1);
    }
}`, `Box a = new Box(2);
Box b = new Box(a);
System.out.println(a.size + b.size);`)),
], [
  { id: 'eo2a', title: 'Constructor لكلاس كتاب', task: 'اكتب الكلاس <code>Book</code> بالحقول <code>title</code> و<code>author</code> و<code>price</code>، وconstructor يستقبل القيم الثلاث، والدالة <code>show()</code> التي تطبع <code>title by author: price</code>. اقرأ العنوان والمؤلف (كلمة واحدة لكل منهما) والسعر، ثم أنشئ الكائن واستدعِ show.',
    code: J(`class Book {
    // الحقول و constructor و show
}`, `Scanner in = new Scanner(System.in);
`, SC),
    ref: J(`class Book {
    String title;
    String author;
    double price;

    Book(String title, String author, double price) {
        this.title = title;
        this.author = author;
        this.price = price;
    }

    void show() {
        System.out.println(title + " by " + author + ": " + price);
    }
}`, `Scanner in = new Scanner(System.in);
Book b = new Book(in.next(), in.next(), in.nextDouble());
b.show();`, SC), inputs: ['Java Ahmed 30', 'OOP Sara 25.5'] },
  { id: 'eo2b', title: 'Constructors متعددة لنقطة', task: 'اكتب الكلاس <code>Point</code> بالحقلين <code>x</code> و<code>y</code> (int) وثلاثة constructors: بدون معاملات (0, 0)، وبمعامل واحد (x = y = القيمة)، وبمعاملين. استخدم <code>this(...)</code>. اقرأ عددين a و b واطبع النقاط الثلاث <code>new Point()</code> و<code>new Point(a)</code> و<code>new Point(a, b)</code> كل واحدة بالشكل <code>(x, y)</code> في سطر.',
    code: J(`class Point {
    int x, y;
    // ثلاثة constructors
}`, `Scanner in = new Scanner(System.in);
`, SC),
    ref: J(`class Point {
    int x, y;

    Point() {
        this(0, 0);
    }

    Point(int v) {
        this(v, v);
    }

    Point(int x, int y) {
        this.x = x;
        this.y = y;
    }

    String text() {
        return "(" + x + ", " + y + ")";
    }
}`, `Scanner in = new Scanner(System.in);
int a = in.nextInt(), b = in.nextInt();
System.out.println(new Point().text());
System.out.println(new Point(a).text());
System.out.println(new Point(a, b).text());`, SC), inputs: ['3 7', '-1 4'] },
  { id: 'eo2c', title: 'نسخة من مدرّس', task: 'اكتب الكلاس <code>Teacher</code> فيه <code>name</code> و<code>age</code>، وconstructor عادي، وcopy constructor يستقبل <code>Teacher</code>، والدالة <code>same(Teacher t)</code> التي تُرجع true إذا تطابق الاسم والعمر. اقرأ اسمًا وعمرًا، أنشئ t1 ثم t2 نسخة منه، واطبع <code>t1 == t2</code> ثم <code>t1.same(t2)</code>، ثم زد عمر t2 بواحد واطبع <code>t1.same(t2)</code>.',
    code: J(`class Teacher {
    String name;
    int age;
}`, `Scanner in = new Scanner(System.in);
`, SC),
    ref: J(`class Teacher {
    String name;
    int age;

    Teacher(String name, int age) {
        this.name = name;
        this.age = age;
    }

    Teacher(Teacher other) {
        this.name = other.name;
        this.age = other.age;
    }

    boolean same(Teacher t) {
        return name.equals(t.name) && age == t.age;
    }
}`, `Scanner in = new Scanner(System.in);
Teacher t1 = new Teacher(in.next(), in.nextInt());
Teacher t2 = new Teacher(t1);
System.out.println(t1 == t2);
System.out.println(t1.same(t2));
t2.age++;
System.out.println(t1.same(t2));`, SC), inputs: ['Salem 40', 'Huda 33'] },
]);

FS_addQuiz('oop3', [
  mcq('ماذا يوفّر التغليف (Encapsulation) للبيانات الخاصة private؟', ['وصول مضبوط (Controlled access)', 'وصول مباشر', 'لا وصول أبدًا', 'وصول عام'], 0),
  mcq('أي محدد وصول يجعل الحقل مرئيًا داخل الكلاس فقط؟', ['private', 'public', 'protected', 'بدون كلمة (default)'], 0),
  mcq('لجعل الكلاس متاحًا من كل ملفات المشروع نستخدم:', ['public', 'private', 'shared', 'static'], 0),
  mcq('ما فائدة كتابة getter دون setter لحقل private؟', ['يصبح الحقل للقراءة فقط من خارج الكلاس', 'يصبح الحقل للكتابة فقط', 'يُحذف الحقل', 'لا فائدة'], 0),
  mcq('أين المكان المناسب للتحقق من صحة القيمة قبل تخزينها في الحقل؟', ['داخل دالة setter', 'داخل getter', 'داخل main فقط', 'لا يمكن التحقق'], 0),
  tf('الـ setters والـ getters تُستخدم لتغليف الحقول private وتوفير وصول مضبوط إليها.', true),
  tf('باستخدام getter يمكن توفير قراءة فقط لحقل private دون كشفه مباشرة.', true),
  tf('يمكن الوصول إلى حقل private من كلاس آخر في الحزمة نفسها.', false),
  tf('الأعضاء protected يمكن الوصول إليها في الحزمة نفسها وفي الكلاسات الوارثة حتى لو كانت في حزمة أخرى.', true),
  out(J(`class Temp {
    private int c;

    void setC(int c) {
        if (c >= -50 && c <= 60) this.c = c;
    }

    int getC() {
        return c;
    }
}`, `Temp t = new Temp();
t.setC(25);
t.setC(100);
System.out.println(t.getC());`)),
  out(J(`class Acc {
    private double bal = 100;

    boolean pay(double x) {
        if (x > bal) return false;
        bal -= x;
        return true;
    }

    double getBal() {
        return bal;
    }
}`, `Acc a = new Acc();
System.out.println(a.pay(30) + " " + a.pay(80) + " " + a.getBal());`)),
], [
  { id: 'eo3a', title: 'حساب بنكي', task: 'اكتب الكلاس <code>Account</code> بحقل <code>private double balance</code>، والدوال <code>deposit</code> (تقبل المبلغ الموجب فقط)، و<code>withdraw</code> (تطبع <code>Rejected</code> إذا كان المبلغ أكبر من الرصيد)، و<code>getBalance</code>. اقرأ عدد العمليات n ثم n عملية، كل عملية حرف <code>d</code> أو <code>w</code> ثم مبلغ، ونفّذها، ثم اطبع الرصيد النهائي.',
    code: J(`class Account {
    private double balance;
    // deposit و withdraw و getBalance
}`, `Scanner in = new Scanner(System.in);
`, SC),
    ref: J(`class Account {
    private double balance;

    void deposit(double x) {
        if (x > 0) balance += x;
    }

    void withdraw(double x) {
        if (x > balance) System.out.println("Rejected");
        else balance -= x;
    }

    double getBalance() {
        return balance;
    }
}`, `Scanner in = new Scanner(System.in);
Account a = new Account();
int n = in.nextInt();
for (int i = 0; i < n; i++) {
    char op = in.next().charAt(0);
    double x = in.nextDouble();
    if (op == 'd') a.deposit(x);
    else a.withdraw(x);
}
System.out.println(a.getBalance());`, SC), inputs: ['3\nd 500\nw 200\nw 400', '4\nd 100\nd -50\nw 30\nd 10', '1\nw 5'] },
  { id: 'eo3b', title: 'عمر بقيمة صحيحة', task: 'اكتب الكلاس <code>Person</code> بحقل <code>private int age</code>، والدالة <code>setAge</code> التي تقبل العمر من 0 إلى 120 فقط وتطبع <code>Invalid age</code> غير ذلك، و<code>getAge</code>. اقرأ ثلاثة أعمار ومرّرها إلى setAge بالترتيب، ثم اطبع العمر المخزّن.',
    code: J(`class Person {
    private int age;
}`, `Scanner in = new Scanner(System.in);
`, SC),
    ref: J(`class Person {
    private int age;

    void setAge(int a) {
        if (a >= 0 && a <= 120) age = a;
        else System.out.println("Invalid age");
    }

    int getAge() {
        return age;
    }
}`, `Scanner in = new Scanner(System.in);
Person p = new Person();
for (int i = 0; i < 3; i++) p.setAge(in.nextInt());
System.out.println(p.getAge());`, SC), inputs: ['20 -5 30', '150 40 200', '-1 -2 -3'] },
]);

FS_addQuiz('oop4', [
  mcq('لماذا لا يمكن إعادة تعريف (override) الدوال static؟', ['لأنها لا تتبع أي كائن وتُحدَّد وقت الترجمة', 'لأنها بلا توقيع', 'لأنها لا تدعم overloading', 'لأنها final تلقائيًا'], 0),
  mcq('في الـ overloading، أي اختلاف <b>لا</b> يكفي لتمييز الدالتين؟', ['اختلاف نوع الإرجاع فقط', 'اختلاف عدد المعاملات', 'اختلاف أنواع المعاملات', 'اختلاف ترتيب أنواع المعاملات'], 0),
  mcq('ماذا يحدث إذا كان في الكلاس دالتان بنفس الاسم والمعاملات ونوع إرجاع مختلف؟', ['خطأ ترجمة بسبب الغموض', 'overloading ناجح', 'يختار المترجم حسب السياق', 'تُنفَّذ الدالتان'], 0),
  mcq('لاستدعاء دالة من كلاس دون إنشاء كائن نجعلها:', ['static', 'public', 'private', 'final'], 0),
  mcq('لتعريف ثابت مشترك يمكن الوصول إليه من كل الحزمة نستخدم:', ['static final', 'static فقط', 'final فقط', 'private'], 0),
  mcq('ماذا يحدث عند محاولة تغيير قيمة متغير final؟', ['خطأ ترجمة', 'تتغير القيمة', 'تتغير وقت التشغيل', 'يتجاهلها البرنامج'], 0),
  tf('الدوال static يمكنها الوصول مباشرة إلى الحقول غير static.', false, 'الدالة static لا تملك كائنًا حاليًا (<code>this</code>).'),
  tf('الحقل static مشترك بين كل كائنات الكلاس ويحتفظ بقيمته.', true),
  tf('يمكن كتابة دالة في الكلاس نستخدمها دون إنشاء كائن.', true, 'إذا كانت static.'),
  out(J(`class C {
    static int s = 0;
    int k = 0;

    C() {
        s++;
        k++;
    }
}`, `C a = new C();
C b = new C();
C c = new C();
System.out.println(C.s + " " + c.k);`)),
  out(J(`class M {
    static int f(int x) {
        return x + 1;
    }

    static double f(double x) {
        return x * 2;
    }

    static String f(String x) {
        return x + x;
    }
}`, `System.out.println(M.f(3) + " " + M.f(3.0) + " " + M.f("ab"));`)),
  out(J(`class T {
    static int n;
    int id;

    T() {
        id = ++n;
    }
}`, `T x = new T();
T y = new T();
x.n = 10;
T z = new T();
System.out.println(x.id + " " + y.id + " " + z.id + " " + T.n);`)),
], [
  { id: 'eo4a', title: 'عدّاد الطلبة', task: 'اكتب الكلاس <code>Student</code> فيه حقل <code>static int count</code> يزيد بواحد في الـ constructor، وحقل <code>id</code> يأخذ قيمة count. اقرأ n ثم n اسمًا، وأنشئ طالبًا لكل اسم واطبع <code>id: name</code>، وفي النهاية اطبع <code>Total: count</code>.',
    code: J(`class Student {
    static int count = 0;
    int id;
    String name;
}`, `Scanner in = new Scanner(System.in);
`, SC),
    ref: J(`class Student {
    static int count = 0;
    int id;
    String name;

    Student(String name) {
        this.name = name;
        count++;
        id = count;
    }
}`, `Scanner in = new Scanner(System.in);
int n = in.nextInt();
for (int i = 0; i < n; i++) {
    Student s = new Student(in.next());
    System.out.println(s.id + ": " + s.name);
}
System.out.println("Total: " + Student.count);`, SC), inputs: ['3\nAli Sara Omar', '1\nHuda'] },
  { id: 'eo4b', title: 'دالة max محمّلة', task: 'اكتب في الكلاس <code>Util</code> ثلاث دوال static باسم <code>max</code>: لعددين صحيحين، ولثلاثة أعداد صحيحة، ولعددين عشريين. اقرأ ثلاثة أعداد صحيحة ثم عددين عشريين، واطبع max لأول عددين، ثم max للثلاثة، ثم max للعشريين.',
    code: J(`class Util {
    // ثلاث دوال max
}`, `Scanner in = new Scanner(System.in);
`, SC),
    ref: J(`class Util {
    static int max(int a, int b) {
        return a > b ? a : b;
    }

    static int max(int a, int b, int c) {
        return max(max(a, b), c);
    }

    static double max(double a, double b) {
        return a > b ? a : b;
    }
}`, `Scanner in = new Scanner(System.in);
int a = in.nextInt(), b = in.nextInt(), c = in.nextInt();
double x = in.nextDouble(), y = in.nextDouble();
System.out.println(Util.max(a, b));
System.out.println(Util.max(a, b, c));
System.out.println(Util.max(x, y));`, SC), inputs: ['3 9 5 1.5 0.5', '7 2 10 -1 -0.5'] },
]);

FS_addQuiz('oop5', [
  mcq('ما أنواع الوراثة الثلاثة في Java بالكلاسات؟', ['Single و Multilevel و Hierarchical', 'Single و Multiple و Hybrid', 'Multilevel و Hybrid و Interface', 'Single و Multilevel و Multiple'], 0),
  mcq('لماذا لا تدعم Java الوراثة المتعددة بالكلاسات؟', ['لتجنب التعارض مثل مشكلة المعيّن (diamond problem)', 'لأنها تزيد تكرار الكود', 'لأن Java لا تعرف العلاقات الهرمية', 'لأنها لا تناسب JVM'], 0),
  mcq('<code>class Person extends Account</code> تعني:', ['Account هو الأب و Person هو الابن', 'Person هو الأب', 'لا علاقة بينهما', 'Account يرث من Person'], 0),
  mcq('عند إنشاء كائن من الكلاس الابن، أي constructor يُنفَّذ أولًا؟', ['constructor الأب', 'constructor الابن', 'لا يُنفَّذ إلا constructor الابن', 'حسب ترتيب الكتابة في الملف'], 0),
  mcq('كيف نجعل الكلاس لا يمكن الوراثة منه؟', ['نكتب <code>final</code> قبل class', 'نكتب <code>static</code>', 'نجعله <code>private</code>', 'نجعله <code>abstract</code>'], 0),
  mcq('أي ميزة <b>ليست</b> من مزايا OOP على البرمجة الإجرائية؟', ['دعم غير محدود للوراثة المتعددة في Java', 'حماية البيانات بالتغليف', 'إعادة استخدام الكود بالوراثة', 'تسهيل التعامل مع البرامج الكبيرة'], 0),
  tf('الكلاس الابن يستطيع الوصول مباشرة إلى حقول الأب المعرّفة private.', false),
  tf('<code>super(...)</code> يجب أن تكون أول جملة في constructor الابن.', true),
  tf('الوراثة تمثل علاقة is-a.', true),
  out(J(`class A {
    A() {
        System.out.print("A");
    }
}

class B extends A {
    B() {
        System.out.print("B");
    }
}

class C extends B {
    C() {
        super();
        System.out.print("C");
    }
}`, `new C();
new B();
System.out.println();`)),
  out(J(`class P {
    int v = 1;

    void inc() {
        v += 10;
    }
}

class Q extends P {
    void inc() {
        super.inc();
        v *= 2;
    }
}`, `Q q = new Q();
q.inc();
System.out.println(q.v);`)),
  out(J(`class Animal {
    String name;

    Animal(String n) {
        name = n;
    }
}

class Cat extends Animal {
    int lives = 9;

    Cat(String n) {
        super(n + "y");
    }
}`, `Cat c = new Cat("Kitt");
System.out.println(c.name + " " + c.lives);`)),
], [
  { id: 'eo5a', title: 'شخص وطالب', task: 'اكتب الكلاس <code>Person</code> فيه <code>protected String name</code> وconstructor والدالة <code>info()</code> التي تُرجع الاسم. واكتب <code>Student extends Person</code> فيه <code>gpa</code>، وconstructor يستدعي <code>super</code>، وأعد تعريف <code>info()</code> لتُرجع <code>name (gpa)</code> مستخدمًا <code>super.info()</code>. اقرأ اسمًا ومعدلًا واطبع info للطالب.',
    code: J(`class Person {
}

class Student extends Person {
}`, `Scanner in = new Scanner(System.in);
`, SC),
    ref: J(`class Person {
    protected String name;

    Person(String name) {
        this.name = name;
    }

    String info() {
        return name;
    }
}

class Student extends Person {
    double gpa;

    Student(String name, double gpa) {
        super(name);
        this.gpa = gpa;
    }

    String info() {
        return super.info() + " (" + gpa + ")";
    }
}`, `Scanner in = new Scanner(System.in);
Student s = new Student(in.next(), in.nextDouble());
System.out.println(s.info());`, SC), inputs: ['Ali 3.5', 'Sara 2.75'] },
  { id: 'eo5b', title: 'مركبة وسيارة', task: 'اكتب <code>Vehicle</code> فيه <code>speed</code> والدالة <code>move(int t)</code> التي تُرجع المسافة <code>speed * t</code>. واكتب <code>Car extends Vehicle</code> بحقل <code>turbo</code> (boolean)، وإذا كان true تكون المسافة ضعف مسافة الأب. اقرأ السرعة والزمن وقيمة turbo (true/false)، واطبع المسافة.',
    code: J(`class Vehicle {
}

class Car extends Vehicle {
}`, `Scanner in = new Scanner(System.in);
`, SC),
    ref: J(`class Vehicle {
    int speed;

    Vehicle(int speed) {
        this.speed = speed;
    }

    int move(int t) {
        return speed * t;
    }
}

class Car extends Vehicle {
    boolean turbo;

    Car(int speed, boolean turbo) {
        super(speed);
        this.turbo = turbo;
    }

    int move(int t) {
        int d = super.move(t);
        if (turbo) return d * 2;
        return d;
    }
}`, `Scanner in = new Scanner(System.in);
int s = in.nextInt(), t = in.nextInt();
Car c = new Car(s, in.nextBoolean());
System.out.println(c.move(t));`, SC), inputs: ['60 2 false', '60 2 true', '15 4 true'] },
]);

FS_addQuiz('oop6', [
  mcq('ماذا يحدث عند تعريف دالة <code>final</code> في الكلاس الأب ثم محاولة إعادة تعريفها في الابن؟', ['خطأ ترجمة لأن إعادة تعريفها غير مسموحة', 'تُتجاهل دالة الابن', 'يُسمح بها إذا تطابق التوقيع', 'تتحول إلى static'], 0),
  mcq('<code>Animal a = new Dog(); a.sound();</code> إذا أعاد Dog تعريف sound، أي نسخة تُنفَّذ؟', ['نسخة Dog', 'نسخة Animal', 'الاثنتان', 'خطأ ترجمة'], 0, 'تُحدَّد الدالة حسب نوع الكائن الحقيقي وقت التشغيل.'),
  mcq('ما الخاصية التي تسمح بالـ Overloading والـ Overriding؟', ['Polymorphism', 'Encapsulation', 'Abstraction', 'Aggregation'], 0),
  mcq('ما الذي يجب أن يتطابق عند إعادة تعريف (override) دالة؟', ['الاسم والمعاملات ونوع الإرجاع', 'الاسم فقط', 'نوع الإرجاع فقط', 'عدد المعاملات فقط'], 0),
  mcq('<code>Animal a = new Bird();</code> وBird فيها الدالة fly فقط. كيف نستدعيها؟', ['<code>((Bird) a).fly()</code>', '<code>a.fly()</code>', '<code>Bird.fly()</code>', '<code>super.fly()</code>'], 0),
  mcq('إذا لم يُعِد الكلاس تعريف <code>toString()</code>، ماذا يطبع <code>System.out.println(obj)</code>؟', ['اسم الكلاس و@ ورقمًا مثل <code>Book@1b6d3586</code>', 'قيم الحقول', 'null', 'خطأ ترجمة'], 0),
  tf('الـ Overloading يُحدَّد وقت الترجمة، والـ Overriding يُحدَّد وقت التشغيل.', true),
  tf('يمكن لمتغير من نوع الأب أن يشير إلى كائن من الكلاس الابن.', true),
  tf('يمكن لمتغير من نوع الابن أن يشير إلى كائن من الكلاس الأب بدون تحويل.', false),
  out(J(`class A {
    String who() {
        return "A";
    }

    void print() {
        System.out.println("I am " + who());
    }
}

class B extends A {
    String who() {
        return "B";
    }
}`, `A x = new B();
x.print();
A y = new A();
y.print();`)),
  out(J(`class Shape {
    double area() {
        return 1;
    }
}

class Sq extends Shape {
    double s;

    Sq(double s) {
        this.s = s;
    }

    double area() {
        return s * s;
    }
}`, `Shape[] arr = { new Shape(), new Sq(2), new Sq(3) };
double t = 0;
for (Shape sh : arr) t += sh.area();
System.out.println(t);`)),
  out(J(`class P {
    int x;

    P(int x) {
        this.x = x;
    }

    public String toString() {
        return "P" + x;
    }
}`, `P a = new P(4);
P b = new P(4);
System.out.println(a + " " + (a == b) + " " + a.toString().equals(b.toString()));`)),
], [
  { id: 'eo6a', title: 'أصوات الحيوانات', task: 'اكتب الكلاس <code>Animal</code> بدالة <code>sound()</code> تُرجع <code>"..."</code>، والكلاسين <code>Dog</code> و<code>Cat</code> اللذين يعيدان تعريفها لترجع <code>"Woof"</code> و<code>"Meow"</code>. اقرأ n ثم n كلمة (<code>dog</code> أو <code>cat</code> أو أي كلمة أخرى)، وخزّن في مصفوفة <code>Animal[]</code> الكائن المناسب (أي كلمة أخرى → Animal)، ثم اطبع صوت كل عنصر في سطر.',
    code: J(`class Animal {
}`, `Scanner in = new Scanner(System.in);
`, SC),
    ref: J(`class Animal {
    String sound() {
        return "...";
    }
}

class Dog extends Animal {
    String sound() {
        return "Woof";
    }
}

class Cat extends Animal {
    String sound() {
        return "Meow";
    }
}`, `Scanner in = new Scanner(System.in);
int n = in.nextInt();
Animal[] arr = new Animal[n];
for (int i = 0; i < n; i++) {
    String w = in.next();
    if (w.equals("dog")) arr[i] = new Dog();
    else if (w.equals("cat")) arr[i] = new Cat();
    else arr[i] = new Animal();
}
for (Animal a : arr) System.out.println(a.sound());`, SC), inputs: ['3\ndog cat cow', '2\ncat cat'] },
  { id: 'eo6b', title: 'toString و equals', task: 'اكتب الكلاس <code>Fraction</code> بالحقلين <code>num</code> و<code>den</code>، وأعد تعريف <code>toString()</code> ليُرجع <code>num/den</code>، و<code>equals(Object o)</code> ليعتبر الكسرين متساويين إذا كان <code>num1 * den2 == num2 * den1</code>. اقرأ كسرين (أربعة أعداد) واطبع الكسرين في سطر بينهما مسافة، ثم نتيجة equals.',
    code: J(`class Fraction {
}`, `Scanner in = new Scanner(System.in);
`, SC),
    ref: J(`class Fraction {
    int num, den;

    Fraction(int num, int den) {
        this.num = num;
        this.den = den;
    }

    @Override
    public String toString() {
        return num + "/" + den;
    }

    @Override
    public boolean equals(Object o) {
        Fraction f = (Fraction) o;
        return num * f.den == f.num * den;
    }
}`, `Scanner in = new Scanner(System.in);
Fraction a = new Fraction(in.nextInt(), in.nextInt());
Fraction b = new Fraction(in.nextInt(), in.nextInt());
System.out.println(a + " " + b);
System.out.println(a.equals(b));`, SC), inputs: ['1 2 2 4', '1 3 2 3'] },
]);

FS_addQuiz('oop7', [
  mcq('أي عبارة صحيحة عن الكلاس المجرد abstract؟', ['يمكن أن يحتوي دوالًا مجردة ودوالًا عادية، ولا يُنشأ منه كائن', 'كل دواله يجب أن تكون مجردة', 'يمكن إنشاء كائن منه بـ new', 'لا يمكن أن يحتوي constructor'], 0),
  mcq('كيف يطبّق الكلاس واجهة interface؟', ['<code>implements</code>', '<code>extends</code>', '<code>inherits</code>', '<code>uses</code>'], 0),
  mcq('متغيرات الواجهة interface تكون تلقائيًا:', ['public static final', 'private', 'protected', 'متغيرات عادية لكل كائن'], 0),
  mcq('كم واجهة يمكن أن يطبّقها الكلاس الواحد؟', ['أكثر من واجهة', 'واجهة واحدة فقط', 'لا يمكنه تطبيق واجهات', 'اثنتان فقط'], 0),
  mcq('ماذا يحدث إذا لم يُعِد الكلاس غير المجرد تعريف دالة abstract موروثة؟', ['خطأ ترجمة', 'تُنفَّذ دالة فارغة', 'تُرجع null', 'لا شيء'], 0),
  mcq('ما الذي يحدد مبدأ التجريد Abstraction؟', ['إظهار الوظائف الأساسية وإخفاء التفاصيل', 'إخفاء الحقول بـ private فقط', 'الوراثة من أكثر من كلاس', 'تكرار الكود'], 0),
  tf('الكلاس المجرد يمكن أن يحتوي دوالًا مجردة بلا جسم ودوالًا عادية بجسم.', true),
  tf('يمكن إنشاء كائن من الواجهة مباشرة بـ new.', false),
  tf('الدالة المجردة تنتهي بفاصلة منقوطة وليس لها جسم { }.', true),
  out(J(`abstract class S {
    abstract int f();

    int g() {
        return f() + 1;
    }
}

class T extends S {
    int f() {
        return 10;
    }
}`, `S s = new T();
System.out.println(s.g());`)),
  out(J(`interface I {
    int K = 3;

    int calc(int x);
}

class Sq implements I {
    public int calc(int x) {
        return x * x + K;
    }
}`, `I obj = new Sq();
System.out.println(obj.calc(4) + " " + I.K);`)),
], [
  { id: 'eo7a', title: 'أشكال مجردة', task: 'اكتب <code>abstract class Shape</code> بدالة مجردة <code>double area()</code>، والكلاسين <code>Circle</code> (نصف قطر، المساحة <code>3.14 * r * r</code>) و<code>Rect</code> (عرض وطول). اقرأ n ثم n شكلًا: حرف <code>c</code> بعده نصف القطر، أو <code>r</code> بعده العرض والطول. اطبع مجموع المساحات.',
    code: J(`abstract class Shape {
}`, `Scanner in = new Scanner(System.in);
`, SC),
    ref: J(`abstract class Shape {
    abstract double area();
}

class Circle extends Shape {
    double r;

    Circle(double r) {
        this.r = r;
    }

    double area() {
        return 3.14 * r * r;
    }
}

class Rect extends Shape {
    double w, h;

    Rect(double w, double h) {
        this.w = w;
        this.h = h;
    }

    double area() {
        return w * h;
    }
}`, `Scanner in = new Scanner(System.in);
int n = in.nextInt();
double total = 0;
for (int i = 0; i < n; i++) {
    String t = in.next();
    Shape s;
    if (t.equals("c")) s = new Circle(in.nextDouble());
    else s = new Rect(in.nextDouble(), in.nextDouble());
    total += s.area();
}
System.out.println(total);`, SC), inputs: ['2\nc 1\nr 2 3', '3\nr 1 1\nr 2 2\nc 2'] },
  { id: 'eo7b', title: 'واجهة قابل للدفع', task: 'اكتب الواجهة <code>Payable</code> بدالة <code>double pay()</code>. واكتب <code>Worker</code> (ساعات × سعر الساعة) و<code>Manager</code> (راتب ثابت + مكافأة 200) يطبّقانها. اقرأ ساعات العامل وسعر الساعة ثم راتب المدير، وخزّنهما في مصفوفة <code>Payable[]</code>، واطبع ما يُدفع لكل منهما ثم المجموع.',
    code: J(`interface Payable {
}`, `Scanner in = new Scanner(System.in);
`, SC),
    ref: J(`interface Payable {
    double pay();
}

class Worker implements Payable {
    int hours;
    double rate;

    Worker(int hours, double rate) {
        this.hours = hours;
        this.rate = rate;
    }

    public double pay() {
        return hours * rate;
    }
}

class Manager implements Payable {
    double salary;

    Manager(double salary) {
        this.salary = salary;
    }

    public double pay() {
        return salary + 200;
    }
}`, `Scanner in = new Scanner(System.in);
Payable[] all = new Payable[2];
all[0] = new Worker(in.nextInt(), in.nextDouble());
all[1] = new Manager(in.nextDouble());
double sum = 0;
for (Payable p : all) {
    System.out.println(p.pay());
    sum += p.pay();
}
System.out.println(sum);`, SC), inputs: ['40 12.5 3000', '10 20 1000'] },
]);

FS_addQuiz('oop8', [
  mcq('العلاقة التي يكون فيها الجزء مستقلًا ويمكن أن يعيش بدون الكل تسمى:', ['Aggregation', 'Composition', 'Inheritance', 'Overriding'], 0),
  mcq('العلاقة التي يُنشأ فيها الجزء داخل الكل ويموت بموته تسمى:', ['Composition', 'Aggregation', 'Association', 'Dependency'], 0),
  mcq('علاقة "uses-a" بين كائنين مستقلين دون ملكية تسمى:', ['Association', 'Composition', 'Inheritance', 'Encapsulation'], 0),
  mcq('في مخطط الكلاسات UML، الرمز <code>-</code> قبل الحقل يعني:', ['private', 'public', 'protected', 'static'], 0),
  mcq('سيارة ومحركها الذي يُنشأ داخل constructor السيارة مثال على:', ['Composition', 'Aggregation', 'Association', 'Inheritance'], 0),
  tf('التجميع Aggregation يمثل علاقة has-a ويمكن للكائن الجزء أن يوجد مستقلًا عن الحاوي.', true),
  tf('التجميع يسمح للكلاس أن يحتوي مراجع لعدة كائنات من كلاس آخر دون امتلاكها.', true),
  tf('في الـ Composition يبقى الجزء موجودًا بعد حذف الكل.', false),
  out(J(`class Engine {
    int hp;

    Engine(int hp) {
        this.hp = hp;
    }
}

class Car {
    Engine e;

    Car(int hp) {
        e = new Engine(hp);
    }
}`, `Car a = new Car(100);
Car b = new Car(150);
b.e.hp += a.e.hp;
System.out.println(a.e.hp + " " + b.e.hp);`)),
  out(J(`class Emp {
    String n;

    Emp(String n) {
        this.n = n;
    }
}

class Team {
    ArrayList<Emp> list = new ArrayList<>();
}`, `Emp x = new Emp("A");
Team t1 = new Team();
Team t2 = new Team();
t1.list.add(x);
t2.list.add(x);
x.n = "B";
System.out.println(t1.list.get(0).n + t2.list.get(0).n + t1.list.size());`, AL)),
], [
  { id: 'eo8a', title: 'قسم وموظفون', task: 'اكتب <code>Employee</code> (اسم وراتب) و<code>Department</code> يحتوي <code>ArrayList&lt;Employee&gt;</code> والدوال <code>add</code> و<code>totalSalary()</code> و<code>highest()</code> التي تُرجع الموظف صاحب أعلى راتب. اقرأ n ثم n موظفًا (اسم وراتب)، وأضفهم للقسم، واطبع مجموع الرواتب ثم اسم صاحب أعلى راتب.',
    code: J(`class Employee {
}

class Department {
}`, `Scanner in = new Scanner(System.in);
`, SCAL),
    ref: J(`class Employee {
    String name;
    double salary;

    Employee(String name, double salary) {
        this.name = name;
        this.salary = salary;
    }
}

class Department {
    ArrayList<Employee> staff = new ArrayList<>();

    void add(Employee e) {
        staff.add(e);
    }

    double totalSalary() {
        double t = 0;
        for (Employee e : staff) t += e.salary;
        return t;
    }

    Employee highest() {
        Employee best = staff.get(0);
        for (Employee e : staff) if (e.salary > best.salary) best = e;
        return best;
    }
}`, `Scanner in = new Scanner(System.in);
Department d = new Department();
int n = in.nextInt();
for (int i = 0; i < n; i++) d.add(new Employee(in.next(), in.nextDouble()));
System.out.println(d.totalSalary());
System.out.println(d.highest().name);`, SCAL), inputs: ['3\nAli 1200\nSara 1500\nOmar 900', '1\nHuda 2000'] },
]);

FS_addQuiz('oop9', [
  mcq('ما فائدة Generics الأساسية؟', ['كلاس أو دالة واحدة تعمل مع أنواع مختلفة مع التحقق من النوع وقت الترجمة', 'تسريع البرنامج', 'إخفاء الحقول', 'الوراثة المتعددة'], 0),
  mcq('أي تعريف صحيح لقائمة أعداد صحيحة؟', ['<code>ArrayList&lt;Integer&gt; list</code>', '<code>ArrayList&lt;int&gt; list</code>', '<code>ArrayList(int) list</code>', '<code>ArrayList[int] list</code>'], 0, 'الأنواع العامة لا تقبل الأنواع البسيطة، فنستخدم الكلاس المغلِّف <code>Integer</code>.'),
  mcq('ماذا تُرجع الدالة <code>ordinal()</code> لثابت enum؟', ['ترتيبه بدءًا من 0', 'اسمه', 'عدد الثوابت', 'قيمته المخزنة'], 0),
  mcq('ماذا تُرجع <code>values()</code> في enum؟', ['مصفوفة بكل الثوابت', 'أول ثابت', 'عدد الثوابت', 'قائمة الأسماء كنص واحد'], 0),
  tf('يمكن أن يحتوي enum حقولًا وconstructor ودوالًا.', true),
  tf('يمكن استخدام enum مع جملة switch.', true),
  tf('يمكن إنشاء ثابت enum جديد بـ new.', false),
  out(J(`enum Size {
    S, M, L, XL
}`, `Size s = Size.L;
System.out.println(s + " " + s.ordinal() + " " + Size.values().length);`)),
  out(J(`class Box<T> {
    T v;

    Box(T v) {
        this.v = v;
    }
}`, `Box<String> a = new Box<>("ab");
Box<Integer> b = new Box<>(7);
System.out.println(a.v + b.v + b.v);`)),
  out(J(`enum Op {
    ADD, MUL
}`, `int x = 3, y = 4;
for (Op o : Op.values()) {
    switch (o) {
        case ADD:
            System.out.print(x + y);
            break;
        case MUL:
            System.out.print(" " + x * y);
            break;
    }
}
System.out.println();`)),
], [
  { id: 'eo9a', title: 'زوج عام', task: 'اكتب الكلاس العام <code>Pair&lt;A, B&gt;</code> بحقلين first و second وconstructor والدالة <code>swap()</code> التي تُرجع <code>Pair&lt;B, A&gt;</code> جديدًا بالترتيب المعكوس، و<code>toString()</code> بالشكل <code>(first, second)</code>. اقرأ كلمة وعددًا صحيحًا، وأنشئ <code>Pair&lt;String, Integer&gt;</code>، واطبعه ثم اطبع نتيجة swap.',
    code: J(`class Pair<A, B> {
}`, `Scanner in = new Scanner(System.in);
`, SC),
    ref: J(`class Pair<A, B> {
    A first;
    B second;

    Pair(A first, B second) {
        this.first = first;
        this.second = second;
    }

    Pair<B, A> swap() {
        return new Pair<>(second, first);
    }

    public String toString() {
        return "(" + first + ", " + second + ")";
    }
}`, `Scanner in = new Scanner(System.in);
Pair<String, Integer> p = new Pair<>(in.next(), in.nextInt());
System.out.println(p);
System.out.println(p.swap());`, SC), inputs: ['age 21', 'x -5'] },
  { id: 'eo9b', title: 'إشارة المرور', task: 'اكتب <code>enum Light</code> بالثوابت <code>RED</code> و<code>YELLOW</code> و<code>GREEN</code>، ولكل ثابت حقل <code>seconds</code> (30 و5 و25) وconstructor ودالة <code>getSeconds()</code>. اقرأ اسم ثابت (مثل GREEN) وابحث عنه بحلقة على <code>values()</code>، واطبع ترتيبه ثم ثوانيه، أو <code>Unknown</code> إذا لم يوجد.',
    code: J(`enum Light {
    RED, YELLOW, GREEN
}`, `Scanner in = new Scanner(System.in);
`, SC),
    ref: J(`enum Light {
    RED(30), YELLOW(5), GREEN(25);

    private final int seconds;

    Light(int seconds) {
        this.seconds = seconds;
    }

    int getSeconds() {
        return seconds;
    }
}`, `Scanner in = new Scanner(System.in);
String w = in.next();
boolean found = false;
for (Light l : Light.values()) {
    if (l.name().equals(w)) {
        System.out.println(l.ordinal() + " " + l.getSeconds());
        found = true;
    }
}
if (!found) System.out.println("Unknown");`, SC), inputs: ['GREEN', 'RED', 'BLUE'] },
]);

FS_addQuiz('oop10', [
  mcq('ما القيمة الأولية لعناصر <code>Student[] s = new Student[3];</code>؟', ['null', 'كائنات Student جديدة', '0', 'خطأ ترجمة'], 0),
  mcq('كيف نعرف عدد عناصر المصفوفة <code>a</code>؟', ['<code>a.length</code>', '<code>a.length()</code>', '<code>a.size()</code>', '<code>a.count</code>'], 0),
  mcq('كيف نعرف عدد عناصر <code>ArrayList list</code>؟', ['<code>list.size()</code>', '<code>list.length</code>', '<code>list.length()</code>', '<code>list.count()</code>'], 0),
  mcq('أي هيكل مناسب للإضافة والحذف الكثير من البداية والنهاية؟', ['LinkedList', 'المصفوفة العادية', 'المصفوفة الثنائية', 'ArrayList'], 0),
  mcq('أي هيكل أسرع في الوصول العشوائي بالفهرس <code>get(i)</code>؟', ['ArrayList', 'LinkedList'], 0),
  mcq('المصفوفة التي صفوفها بأطوال مختلفة تسمى:', ['Jagged array', 'Dynamic array', 'ArrayList', 'Linked list'], 0),
  tf('حجم المصفوفة العادية في Java ثابت ولا يمكن أن يكبر بعد إنشائها.', true),
  tf('ArrayList يكبر حجمها تلقائيًا عند الإضافة.', true),
  tf('عند تعريف مصفوفة يمكن كتابة أقواس الأبعاد بعد النوع أو بعد الاسم: <code>int[] x</code> أو <code>int x[]</code>.', true),
  out(J('', `ArrayList<Integer> a = new ArrayList<>();
for (int i = 1; i <= 5; i++) a.add(i * i);
a.remove(0);
a.set(0, 100);
System.out.println(a + " " + a.size() + " " + a.get(2));`, AL)),
  out(J('', `int[][] m = new int[3][];
m[0] = new int[] {1};
m[1] = new int[] {2, 3};
m[2] = new int[] {4, 5, 6};
int s = 0;
for (int[] row : m) s += row[row.length - 1];
System.out.println(s);`)),
  out(J('', `LinkedList<String> q = new LinkedList<>();
q.add("b");
q.addFirst("a");
q.addLast("c");
q.removeFirst();
System.out.println(q + " " + q.getFirst());`, 'import java.util.LinkedList;')),
], [
  { id: 'eo10a', title: 'قائمة الدرجات', task: 'اقرأ أعدادًا صحيحة حتى يُدخل المستخدم <code>-1</code>، وخزّنها في <code>ArrayList&lt;Integer&gt;</code>. اطبع عدد الدرجات، ثم المتوسط، ثم الدرجات الأكبر من المتوسط مفصولة بمسافة.',
    code: J('', `Scanner in = new Scanner(System.in);
`, SCAL),
    ref: J('', `Scanner in = new Scanner(System.in);
ArrayList<Integer> marks = new ArrayList<>();
int x = in.nextInt();
while (x != -1) {
    marks.add(x);
    x = in.nextInt();
}
double sum = 0;
for (int m : marks) sum += m;
double avg = sum / marks.size();
System.out.println(marks.size());
System.out.println(avg);
for (int m : marks) {
    if (m > avg) System.out.print(m + " ");
}
System.out.println();`, SCAL), inputs: ['70 80 90 -1', '50 60 -1', '100 -1'] },
  { id: 'eo10b', title: 'أفضل طالب', task: 'اكتب الكلاس <code>Student</code> (اسم ودرجة). اقرأ n ثم n طالبًا في مصفوفة <code>Student[]</code>، واطبع اسم صاحب أعلى درجة، ثم عدد الناجحين (الدرجة 50 فأكثر).',
    code: J(`class Student {
}`, `Scanner in = new Scanner(System.in);
`, SC),
    ref: J(`class Student {
    String name;
    int mark;

    Student(String name, int mark) {
        this.name = name;
        this.mark = mark;
    }
}`, `Scanner in = new Scanner(System.in);
int n = in.nextInt();
Student[] arr = new Student[n];
for (int i = 0; i < n; i++) arr[i] = new Student(in.next(), in.nextInt());
Student best = arr[0];
int pass = 0;
for (Student s : arr) {
    if (s.mark > best.mark) best = s;
    if (s.mark >= 50) pass++;
}
System.out.println(best.name);
System.out.println(pass);`, SC), inputs: ['3\nAli 45\nSara 88\nOmar 60', '2\nHuda 30\nMona 20'] },
]);

FS_addQuiz('oopexam', [
  mcq('مبادئ البرمجة الشيئية الأساسية هي:', ['Encapsulation و Inheritance و Polymorphism و Abstraction', 'Class و Object و Method و Variable', 'Array و List و Map و Set', 'Compile و Run و Debug و Test'], 0),
  mcq('ماذا يحدث إذا كان في كلاس Java دالتان لهما الاسم نفسه والمعاملات نفسها ونوع إرجاع مختلف؟', ['خطأ ترجمة بسبب الغموض', 'overloading ناجح', 'يختار المترجم حسب السياق', 'تُنفَّذ الدالتان بالتسلسل'], 0),
  mcq('ما الذي لا تفعله <code>this</code> في Java؟', ['استدعاء دالة من الكلاس الأب', 'الإشارة إلى متغيرات الكائن الحالي', 'تمرير الكائن الحالي لدالة', 'استدعاء constructor آخر من الكلاس نفسه'], 0),
  mcq('لماذا لا يمكن إعادة تعريف الدوال static؟', ['لأنها لا تنتمي لأي كائن وتُحدَّد وقت الترجمة', 'لأنها بلا توقيع', 'لأنها لا تدعم overloading', 'لأنها final تلقائيًا'], 0),
  mcq('ماذا يوفّر التغليف للبيانات private؟', ['وصول مضبوط', 'وصول مباشر', 'لا وصول', 'وصول عام'], 0),
  mcq('ما الفرق بين الـ constructor والدالة في Java؟', ['الـ constructor يهيّئ الكائن وله اسم الكلاس', 'الـ constructor له نوع إرجاع', 'الـ constructor لا يُحمَّل تحميلًا زائدًا', 'الـ constructor يستدعيه المستخدم صراحة'], 0),
  mcq('ماذا يحدث عند محاولة تغيير قيمة متغير final؟', ['خطأ وقت الترجمة', 'تتغير بنجاح', 'تتغير وقت التشغيل', 'يُتجاهل'], 0),
  mcq('أي عبارة عن الـ Compile Error صحيحة؟', ['يحدث أثناء ترجمة الكود قبل تشغيل البرنامج', 'يحدث بعد إدخال قيمة خاطئة أثناء التشغيل', 'لا يمكن اكتشافه إلا بالتجربة', 'هو نفسه Runtime Error'], 0),
  mcq('القسمة على صفر في الأعداد الصحيحة أثناء التشغيل تسبب:', ['Runtime Error (ArithmeticException)', 'Compile Error', 'تُطبع القيمة 0', 'لا شيء'], 0),
  tf('الكلمة this يمكن استخدامها للإشارة إلى متغيرات الكائن الحالي واستدعاء دواله واستدعاء constructor آخر من الكلاس نفسه.', true),
  tf('الـ constructor له اسم الكلاس نفسه ويُستخدم لتهيئة الكائن تلقائيًا بدون نوع إرجاع.', true),
  tf('الدوال static يمكنها الوصول فقط إلى الأعضاء static ولا تصل مباشرة إلى متغيرات الكائن.', true),
  tf('الحقل static مشترك بين كل الكائنات ويحتفظ بقيمته.', true),
  tf('الكلاس المجرد يمكن أن يحتوي دوالًا مجردة ودوالًا بجسم.', true),
  tf('<code>float x = 152.12;</code> جملة صحيحة في Java.', false, 'القيمة العشرية من النوع double افتراضيًا، والصحيح <code>152.12f</code>.'),
  tf('الـ constructor يمكن أن يُرجع قيمة.', false),
  tf('الكلاس قالب (blueprint) لكائناته.', true),
  mcq('كيف نصنع كلاسًا لا يمكن الوراثة منه؟', ['نضع <code>final</code> قبل تعريف الكلاس', 'نجعله <code>abstract</code>', 'نجعل حقوله <code>private</code>', 'نضع <code>static</code> قبله'], 0),
  out(J(`class Base {
    static int n = 0;
    int v;

    Base() {
        n++;
        v = 10;
    }

    void show() {
        System.out.println("Base " + v);
    }
}

class Derived extends Base {
    Derived() {
        v += 5;
    }

    void show() {
        System.out.println("Derived " + v);
    }
}`, `Base a = new Derived();
Base b = new Base();
a.show();
b.show();
System.out.println(Base.n);`)),
  out(J(`class X {
    int k;

    X(int k) {
        this.k = k;
    }

    X add(X o) {
        return new X(k + o.k);
    }
}`, `X a = new X(2);
X b = new X(5);
X c = a.add(b).add(a);
System.out.println(a.k + " " + b.k + " " + c.k);`)),
], [
  { id: 'eox1', title: 'كلاس المدرّس', task: 'اكتب الكلاس <code>Teacher</code> بالحقول <code>name</code> و<code>age</code> و<code>address</code> و<code>gender</code> (char)، وconstructor يستقبل الاسم والجنس والعمر (والعنوان نص فارغ)، والدالة <code>Equals(Teacher b)</code> التي تُرجع true إذا تطابقت كل الحقول، وcopy constructor. اقرأ بيانات مدرّسَين (اسم وجنس وعمر لكل منهما)، واطبع نتيجة Equals بينهما، ثم أنشئ نسخة من الأول واطبع Equals بين الأول ونسخته.',
    code: J(`class Teacher {
}`, `Scanner in = new Scanner(System.in);
`, SC),
    ref: J(`class Teacher {
    int age;
    String name;
    String address;
    char gender;

    Teacher(String nme, char sex, int howOld) {
        age = howOld;
        gender = sex;
        name = nme;
        address = "";
    }

    Teacher(Teacher b) {
        this.name = b.name;
        this.age = b.age;
        this.gender = b.gender;
        this.address = b.address;
    }

    boolean Equals(Teacher b) {
        if (this.address.equals(b.address))
            if (this.age == b.age)
                if (this.gender == b.gender)
                    if (this.name.equals(b.name))
                        return true;
        return false;
    }
}`, `Scanner in = new Scanner(System.in);
Teacher t1 = new Teacher(in.next(), in.next().charAt(0), in.nextInt());
Teacher t2 = new Teacher(in.next(), in.next().charAt(0), in.nextInt());
System.out.println(t1.Equals(t2));
Teacher t3 = new Teacher(t1);
System.out.println(t1.Equals(t3));`, SC), inputs: ['Ali M 40\nAli M 40', 'Ali M 40\nSara F 35'] },
  { id: 'eox2', title: 'نظام موظفين مختصر', task: 'اكتب <code>abstract class Employee</code> (اسم، ودالة مجردة <code>double salary()</code>، و<code>toString</code> يُرجع <code>name: salary</code>)، و<code>FullTime</code> (راتب شهري) و<code>PartTime</code> (ساعات × سعر). اقرأ n ثم n موظفًا: <code>f</code> اسم راتب، أو <code>p</code> اسم ساعات سعر، وخزّنهم في <code>ArrayList&lt;Employee&gt;</code>. اطبع كل موظف في سطر ثم مجموع الرواتب.',
    code: J(`abstract class Employee {
}`, `Scanner in = new Scanner(System.in);
`, SCAL),
    ref: J(`abstract class Employee {
    String name;

    Employee(String name) {
        this.name = name;
    }

    abstract double salary();

    public String toString() {
        return name + ": " + salary();
    }
}

class FullTime extends Employee {
    double monthly;

    FullTime(String name, double monthly) {
        super(name);
        this.monthly = monthly;
    }

    double salary() {
        return monthly;
    }
}

class PartTime extends Employee {
    int hours;
    double rate;

    PartTime(String name, int hours, double rate) {
        super(name);
        this.hours = hours;
        this.rate = rate;
    }

    double salary() {
        return hours * rate;
    }
}`, `Scanner in = new Scanner(System.in);
ArrayList<Employee> list = new ArrayList<>();
int n = in.nextInt();
for (int i = 0; i < n; i++) {
    String t = in.next();
    if (t.equals("f")) list.add(new FullTime(in.next(), in.nextDouble()));
    else list.add(new PartTime(in.next(), in.nextInt(), in.nextDouble()));
}
double sum = 0;
for (Employee e : list) {
    System.out.println(e);
    sum += e.salary();
}
System.out.println(sum);`, SCAL), inputs: ['2\nf Ali 2500\np Sara 40 15', '1\np Omar 10 7.5'] },
]);
})();
