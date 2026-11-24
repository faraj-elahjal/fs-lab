/* Self-test + essay questions for the OOP course, C++ version. */
(function () {
const ind = (b) => b.replace(/^/gm, '    ').replace(/^\s+$/gm, '');
const P = (classes, body) => `#include <iostream>\n#include <string>\nusing namespace std;\n\n${classes ? classes.trim() + '\n\n' : ''}int main() {\n${ind(body.trim())}\n    return 0;\n}\n`;
const TF = ['صح', 'خطأ'];
const mcq = (q, opts, a, why) => ({ k: 'mcq', q, opts, a, why });
const tf = (q, ok, why) => ({ k: 'mcq', q, opts: TF, a: ok ? 0 : 1, why });
const out = (code, input, q) => ({ k: 'out', code, input, q });

FS_addQuiz('coop1', [
  mcq('ما الفرق الأساسي بين الكلاس والكائن؟', ['الكلاس قالب، والكائن نسخة منه لها مكان في الذاكرة', 'الكائن قالب والكلاس نسخة منه', 'لا فرق بينهما', 'الكلاس متغير والكائن دالة'], 0),
  mcq('الكائن يتكوّن من:', ['حالة (قيم الحقول) + سلوك (الدوال)', 'حالة + متغيرات', 'اسم + دوال فقط', 'كلاس + مكتبة'], 0),
  mcq('ما مستوى الوصول الافتراضي لأعضاء <code>class</code> في C++؟', ['private', 'public', 'protected', 'لا يوجد'], 0, 'في <code>struct</code> يكون الافتراضي public.'),
  mcq('كيف نصل إلى الحقل <code>name</code> عبر المؤشر <code>p</code>؟', ['<code>p->name</code>', '<code>p.name</code>', '<code>*p->name</code>', '<code>p::name</code>'], 0),
  mcq('بعد <code>Car b = a;</code> وتغيير <code>b.year</code>، ماذا يحدث لـ <code>a.year</code>؟', ['لا يتغير، لأن b نسخة مستقلة', 'يتغير معه', 'يصبح عشوائيًا', 'خطأ ترجمة'], 0),
  tf('تعريف الكلاس في C++ ينتهي بفاصلة منقوطة بعد القوس <code>};</code>.', true),
  tf('يمكن الوصول إلى عضو private من الدالة main مباشرة.', false),
  tf('لكل كائن نسخته الخاصة من الحقول العادية (غير static).', true),
  out(P(`class Counter {
public:
    int value;
};`, `Counter a;
a.value = 5;
Counter b = a;
b.value++;
Counter* p = &a;
p->value += 10;
cout << a.value << " " << b.value << endl;`)),
  out(P(`class Box {
public:
    int w, h;
    int area() { return w * h; }
};`, `Box b;
b.w = 3;
b.h = b.w + 2;
cout << b.area() << endl;`)),
], [
  { id: 'eco1a', title: 'كلاس مستطيل', task: 'اكتب الكلاس <code>Rectangle</code> فيه الحقلان <code>width</code> و<code>height</code> (double) public، والدالتان <code>area()</code> و<code>perimeter()</code>. اقرأ العرض والطول في كائن، ثم اطبع المساحة في سطر والمحيط في السطر التالي.',
    code: P(`class Rectangle {
public:
    // الحقول والدوال
};`, `// أنشئ الكائن واقرأ القيم`),
    ref: P(`class Rectangle {
public:
    double width, height;
    double area() { return width * height; }
    double perimeter() { return 2 * (width + height); }
};`, `Rectangle r;
cin >> r.width >> r.height;
cout << r.area() << endl;
cout << r.perimeter() << endl;`), inputs: ['4 5', '2.5 2', '10 1'] },
  { id: 'eco1b', title: 'بيانات طالب', task: 'اكتب الكلاس <code>Student</code> فيه <code>name</code> و<code>mark</code>، والدالة <code>grade()</code> التي تُرجع <code>"Pass"</code> إذا كانت الدرجة 50 فأكثر و<code>"Fail"</code> غير ذلك. اقرأ الاسم والدرجة واطبع مثل <code>Ali: Pass</code>.',
    code: P(`class Student {
public:
};`, ``),
    ref: P(`class Student {
public:
    string name;
    int mark;
    string grade() {
        if (mark >= 50) return "Pass";
        return "Fail";
    }
};`, `Student s;
cin >> s.name >> s.mark;
cout << s.name << ": " << s.grade() << endl;`), inputs: ['Ali 75', 'Sara 49', 'Omar 50'] },
]);

FS_addQuiz('coop2', [
  mcq('الـ constructor في C++:', ['اسمه اسم الكلاس وليس له نوع إرجاع', 'اسمه init ونوعه void', 'يُرجع الكائن', 'يُستدعى يدويًا فقط'], 0),
  mcq('متى يُستدعى الـ destructor لكائن محلي؟', ['عند خروج الكائن من نطاقه (القوس })', 'عند إنشائه', 'عند كل استدعاء لدالة عضو', 'لا يُستدعى أبدًا'], 0),
  mcq('ما ترتيب هدم كائنين a ثم b عُرِّفا في main؟', ['b أولًا ثم a', 'a أولًا ثم b', 'معًا في الوقت نفسه', 'لا يُهدمان'], 0, 'الهدم بعكس ترتيب الإنشاء.'),
  mcq('ماذا تفعل <code>Student s();</code>؟', ['تعرّف دالة اسمها s ولا تنشئ كائنًا', 'تنشئ كائنًا بالـ default constructor', 'خطأ ترجمة دائمًا', 'تنشئ كائنًا قيمه صفر'], 0),
  mcq('إذا كتبنا constructor بمعاملات فقط، فماذا يحدث عند <code>A a;</code>؟', ['خطأ لأن الـ default constructor لم يُضَف', 'يُستدعى default constructor تلقائيًا', 'تأخذ الحقول القيمة 0', 'يُنشأ الكائن بلا تهيئة'], 0),
  mcq('متى يُستدعى الـ copy constructor؟', ['عند إنشاء كائن نسخةً من آخر أو تمريره بالقيمة', 'عند كل إسناد بعد التعريف', 'عند delete', 'عند استدعاء أي دالة'], 0),
  tf('يمكن أن يكون للكلاس أكثر من constructor.', true),
  tf('الـ destructor يمكن أن يستقبل معاملات.', false),
  tf('قائمة التهيئة تعطي الحقول قيمها قبل تنفيذ جسم الـ constructor.', true),
  out(P(`class T {
    int id;
public:
    T(int i) : id(i) { cout << "C" << id << " "; }
    ~T() { cout << "D" << id << " "; }
};`, `T a(1);
{
    T b(2);
    T c(3);
}
T d(4);
cout << "| ";`)),
  out(P(`class A {
public:
    int x;
    A() : x(1) {}
    A(int v) : x(v * 2) {}
    A(int v, int w) : x(v + w) {}
};`, `A a, b(5), c(2, 3);
cout << a.x + b.x + c.x << endl;`)),
], [
  { id: 'eco2a', title: 'كتاب بـ constructor', task: 'اكتب الكلاس <code>Book</code> بحقول private: <code>title</code> و<code>author</code> و<code>price</code>، وconstructor يستقبلها بقائمة التهيئة، والدالة <code>show()</code> التي تطبع <code>title by author: price</code>. اقرأ القيم الثلاث (العنوان والمؤلف كلمة واحدة لكل منهما) وأنشئ الكائن واستدعِ show.',
    code: P(`class Book {
};`, ``),
    ref: P(`class Book {
    string title, author;
    double price;
public:
    Book(string t, string a, double p) : title(t), author(a), price(p) {}
    void show() { cout << title << " by " << author << ": " << price << endl; }
};`, `string t, a;
double p;
cin >> t >> a >> p;
Book b(t, a, p);
b.show();`), inputs: ['Cpp Ahmed 30', 'OOP Sara 25.5'] },
  { id: 'eco2b', title: 'متتبع الإنشاء والهدم', task: 'اكتب الكلاس <code>Tracker</code> يستقبل رقمًا في الـ constructor ويطبع <code>+رقم</code> في سطر، ويطبع <code>-رقم</code> في الـ destructor. اقرأ n ثم أنشئ داخل حلقة من 1 إلى n كائنًا محليًا بالرقم i في كل دورة، ثم اطبع <code>done</code>.',
    code: P(`class Tracker {
};`, ``),
    ref: P(`class Tracker {
    int n;
public:
    Tracker(int v) : n(v) { cout << "+" << n << endl; }
    ~Tracker() { cout << "-" << n << endl; }
};`, `int n;
cin >> n;
for (int i = 1; i <= n; i++) {
    Tracker t(i);
}
cout << "done" << endl;`), inputs: ['2', '3'] },
]);

FS_addQuiz('coop3', [
  mcq('ماذا يوفّر التغليف للبيانات private؟', ['وصول مضبوط عن طريق دوال', 'وصول مباشر', 'لا وصول أبدًا', 'وصول عام'], 0),
  mcq('أي محدد يجعل العضو مرئيًا للكلاس والكلاسات الوارثة فقط؟', ['protected', 'private', 'public', 'friend'], 0),
  mcq('ماذا تعني <code>const</code> بعد الدالة: <code>int get() const</code>؟', ['الدالة لا تعدّل حقول الكائن', 'الدالة تُرجع ثابتًا', 'الدالة static', 'لا يمكن استدعاؤها'], 0),
  mcq('كيف نعرّف الدالة <code>show</code> من الكلاس <code>Student</code> خارج الكلاس؟', ['<code>void Student::show() { }</code>', '<code>void show::Student() { }</code>', '<code>void Student.show() { }</code>', '<code>Student void show() { }</code>'], 0),
  tf('الـ setter مكان مناسب للتحقق من القيمة قبل تخزينها.', true),
  tf('الحقل الذي له getter فقط يكون للقراءة فقط من خارج الكلاس.', true),
  tf('يمكن الوصول إلى حقل protected من main.', false),
  out(P(`class Temp {
    int c = 0;
public:
    void set(int v) { if (v >= -50 && v <= 60) c = v; }
    int get() const { return c; }
};`, `Temp t;
t.set(25);
t.set(100);
t.set(-10);
cout << t.get() << endl;`)),
  out(P(`class Acc {
    double bal = 100;
public:
    bool pay(double x) {
        if (x > bal) return false;
        bal -= x;
        return true;
    }
    double getBal() const { return bal; }
};`, `Acc a;
bool r1 = a.pay(30);
bool r2 = a.pay(80);
cout << r1 << " " << r2 << " " << a.getBal() << endl;`)),
], [
  { id: 'eco3a', title: 'حساب بنكي', task: 'اكتب الكلاس <code>Account</code> بحقل <code>private double balance = 0</code>، والدوال <code>deposit</code> (تقبل الموجب فقط) و<code>withdraw</code> (تطبع <code>Rejected</code> إذا كان المبلغ أكبر من الرصيد) و<code>getBalance() const</code>. اقرأ n ثم n عملية: حرف <code>d</code> أو <code>w</code> ثم مبلغ، ثم اطبع الرصيد النهائي.',
    code: P(`class Account {
    double balance = 0;
public:
};`, ``),
    ref: P(`class Account {
    double balance = 0;
public:
    void deposit(double x) { if (x > 0) balance += x; }
    void withdraw(double x) {
        if (x > balance) cout << "Rejected" << endl;
        else balance -= x;
    }
    double getBalance() const { return balance; }
};`, `Account a;
int n;
cin >> n;
for (int i = 0; i < n; i++) {
    char op;
    double x;
    cin >> op >> x;
    if (op == 'd') a.deposit(x);
    else a.withdraw(x);
}
cout << a.getBalance() << endl;`), inputs: ['3\nd 500\nw 200\nw 400', '4\nd 100\nd -50\nw 30\nd 10', '1\nw 5'] },
  { id: 'eco3b', title: 'عمر صحيح', task: 'اكتب الكلاس <code>Person</code> بحقل <code>private int age = 0</code>، و<code>setAge</code> تقبل 0 إلى 120 وتطبع <code>Invalid age</code> غير ذلك، و<code>getAge() const</code>. عرّف الدالتين خارج الكلاس باستخدام <code>::</code>. اقرأ ثلاثة أعمار ومرّرها إلى setAge بالترتيب، ثم اطبع العمر المخزّن.',
    code: P(`class Person {
    int age = 0;
public:
    void setAge(int a);
    int getAge() const;
};`, ``),
    ref: P(`class Person {
    int age = 0;
public:
    void setAge(int a);
    int getAge() const;
};

void Person::setAge(int a) {
    if (a >= 0 && a <= 120) age = a;
    else cout << "Invalid age" << endl;
}

int Person::getAge() const {
    return age;
}`, `Person p;
for (int i = 0; i < 3; i++) {
    int a;
    cin >> a;
    p.setAge(a);
}
cout << p.getAge() << endl;`), inputs: ['20 -5 30', '150 40 200', '-1 -2 -3'] },
]);

FS_addQuiz('coop4', [
  mcq('أين يُعرَّف الحقل الثابت <code>static int count;</code> المعلن داخل الكلاس Car؟', ['خارج الكلاس: <code>int Car::count = 0;</code>', 'داخل main', 'لا يحتاج تعريفًا', 'داخل الـ constructor'], 0),
  mcq('الدالة الثابتة static:', ['تُستدعى بدون كائن ولا يوجد فيها this', 'تحتاج كائنًا دائمًا', 'تُعدّل الحقول العادية مباشرة', 'لا يمكن أن تُرجع قيمة'], 0),
  mcq('في الـ overloading، أي اختلاف لا يكفي؟', ['اختلاف نوع الإرجاع فقط', 'عدد المعاملات', 'أنواع المعاملات', 'ترتيب أنواع المعاملات'], 0),
  mcq('الدالة الصديقة friend:', ['ليست عضوًا في الكلاس لكنها تصل إلى أعضائه الخاصة', 'دالة عضو عادية', 'دالة static', 'لا تصل إلا إلى public'], 0),
  tf('الحقل static مشترك بين كل الكائنات.', true),
  tf('يمكن استخدام this داخل دالة static.', false),
  out(P(`class C {
public:
    static int s;
    int k = 0;
    C() { s++; k++; }
};

int C::s = 0;`, `C a, b, c;
cout << C::s << " " << c.k << endl;`)),
  out(P(`class M {
public:
    static int f(int x) { return x + 1; }
    static double f(double x) { return x * 2; }
    static string f(string x) { return x + x; }
};`, `cout << M::f(3) << " " << M::f(3.5) << " " << M::f(string("ab")) << endl;`)),
], [
  { id: 'eco4a', title: 'عدّاد الطلبة', task: 'اكتب الكلاس <code>Student</code> فيه <code>static int count</code> (يُعرَّف خارج الكلاس بقيمة 0) يزيد في الـ constructor، وحقل <code>id</code> يأخذ قيمة count. اقرأ n ثم n اسمًا، وأنشئ طالبًا لكل اسم واطبع <code>id: name</code>، وفي النهاية <code>Total: count</code>.',
    code: P(`class Student {
public:
    static int count;
};

int Student::count = 0;`, ``),
    ref: P(`class Student {
public:
    static int count;
    int id;
    string name;
    Student(string n) : name(n) {
        count++;
        id = count;
    }
};

int Student::count = 0;`, `int n;
cin >> n;
for (int i = 0; i < n; i++) {
    string nm;
    cin >> nm;
    Student s(nm);
    cout << s.id << ": " << s.name << endl;
}
cout << "Total: " << Student::count << endl;`), inputs: ['3\nAli Sara Omar', '1\nHuda'] },
  { id: 'eco4b', title: 'دالة صديقة', task: 'اكتب الكلاس <code>Box</code> بحقلين private: <code>w</code> و<code>h</code>، وconstructor، والدالة الصديقة <code>int area(const Box& b)</code> المعرّفة خارج الكلاس. اقرأ عددين واطبع المساحة.',
    code: P(`class Box {
    int w, h;
public:
};`, ``),
    ref: P(`class Box {
    int w, h;
public:
    Box(int a, int b) : w(a), h(b) {}
    friend int area(const Box& b);
};

int area(const Box& b) {
    return b.w * b.h;
}`, `int a, b;
cin >> a >> b;
Box x(a, b);
cout << area(x) << endl;`), inputs: ['3 4', '10 7'] },
]);

FS_addQuiz('coop5', [
  mcq('<code>class Student : public Person</code> تعني:', ['Student يرث من Person', 'Person يرث من Student', 'Student يحتوي كائن Person', 'لا علاقة'], 0),
  mcq('عند إنشاء كائن الابن، أي constructor يُنفَّذ أولًا؟', ['constructor الأب', 'constructor الابن', 'الابن فقط', 'حسب ترتيب الملف'], 0),
  mcq('عند هدم كائن الابن، أي destructor يُنفَّذ أولًا؟', ['destructor الابن ثم الأب', 'destructor الأب ثم الابن', 'الأب فقط', 'الابن فقط'], 0),
  mcq('كيف نمرر القيم إلى constructor الأب؟', ['في قائمة التهيئة: <code>B(int x) : A(x) { }</code>', 'داخل الجسم: <code>A(x);</code>', 'بـ <code>super(x)</code>', 'لا يمكن'], 0),
  mcq('هل تدعم C++ الوراثة من أكثر من كلاس؟', ['نعم (Multiple inheritance)', 'لا', 'فقط مع struct', 'فقط مع الكلاسات المجردة'], 0),
  mcq('عضو public في الأب، والوراثة <code>private</code>. كيف يظهر للعالم الخارجي عبر كائن الابن؟', ['لا يمكن الوصول إليه من الخارج', 'public كما هو', 'protected', 'يُحذف'], 0),
  tf('الابن يستطيع استخدام الحقول private في الأب مباشرة.', false),
  tf('العضو protected يراه الابن ولا تراه main.', true),
  out(P(`class A {
public:
    A() { cout << "A"; }
    ~A() { cout << "a"; }
};

class B : public A {
public:
    B() { cout << "B"; }
    ~B() { cout << "b"; }
};`, `{
    B x;
    A y;
}
cout << endl;`)),
  out(P(`class P {
protected:
    int v;
public:
    P(int x) : v(x) {}
    int get() { return v; }
};

class Q : public P {
public:
    Q(int x) : P(x * 10) { v += 1; }
};`, `Q q(3);
cout << q.get() << endl;`)),
], [
  { id: 'eco5a', title: 'شخص وطالب', task: 'اكتب <code>Person</code> فيه <code>protected string name</code> وconstructor والدالة <code>info()</code> التي تُرجع الاسم، و<code>Student : public Person</code> فيه <code>gpa</code> وconstructor يستدعي constructor الأب، والدالة <code>info()</code> التي تُرجع <code>name (gpa)</code> مستخدمًا <code>Person::info()</code>. اقرأ اسمًا ومعدلًا واطبع info للطالب.',
    code: P(`class Person {
};

class Student : public Person {
};`, ``),
    ref: P(`class Person {
protected:
    string name;
public:
    Person(string n) : name(n) {}
    string info() { return name; }
};

class Student : public Person {
    double gpa;
public:
    Student(string n, double g) : Person(n), gpa(g) {}
    string info() { return Person::info() + " (" + to_string(gpa).substr(0, 4) + ")"; }
};`, `string n;
double g;
cin >> n >> g;
Student s(n, g);
cout << s.info() << endl;`), inputs: ['Ali 3.50', 'Sara 2.75'] },
]);

FS_addQuiz('coop6', [
  mcq('<code>Animal* a = new Dog(); a->sound();</code> و sound ليست virtual. أي نسخة تُنفَّذ؟', ['نسخة Animal (نوع المؤشر)', 'نسخة Dog', 'الاثنتان', 'خطأ'], 0),
  mcq('ونفس السؤال لو كانت sound في Animal معرّفة <code>virtual</code>؟', ['نسخة Dog (الكائن الحقيقي)', 'نسخة Animal', 'خطأ ترجمة', 'لا شيء'], 0),
  mcq('تعدد الأشكال في C++ يعمل عبر:', ['المؤشرات والمراجع', 'نسخ الكائنات بالقيمة', 'الدوال static', 'المتغيرات العامة'], 0),
  mcq('لماذا نجعل destructor الأب <code>virtual</code>؟', ['ليُستدعى destructor الابن عند حذفه عبر مؤشر الأب', 'لتسريع البرنامج', 'لمنع الوراثة', 'لا فائدة'], 0),
  mcq('ماذا تفعل الكلمة <code>override</code> بعد دالة في الابن؟', ['تطلب من المترجم التأكد أنها تعيد تعريف دالة virtual في الأب', 'تجعل الدالة static', 'تمنع إعادة تعريفها', 'تحذف دالة الأب'], 0),
  mcq('ماذا تُرجع <code>dynamic_cast&lt;Dog*&gt;(p)</code> إذا كان الكائن الحقيقي Cat؟', ['nullptr', 'مؤشرًا للكائن', 'خطأ ترجمة', 'كائن Dog جديد'], 0),
  tf('Overloading يُحدَّد وقت الترجمة، و virtual overriding يُحدَّد وقت التشغيل.', true),
  tf('نسخ كائن ابن في متغير من نوع الأب يحتفظ بكل أجزاء الابن.', false, 'هذا object slicing.'),
  out(P(`class A {
public:
    virtual string who() { return "A"; }
    string name() { return "a"; }
};

class B : public A {
public:
    string who() override { return "B"; }
    string name() { return "b"; }
};`, `B obj;
A* p = &obj;
A& r = obj;
cout << p->who() << p->name() << r.who() << obj.name() << endl;`)),
  out(P(`class Shape {
public:
    virtual double area() { return 1; }
};

class Sq : public Shape {
    double s;
public:
    Sq(double s) : s(s) {}
    double area() override { return s * s; }
};`, `Shape* arr[3] = { new Shape(), new Sq(2), new Sq(3) };
double t = 0;
for (int i = 0; i < 3; i++) t += arr[i]->area();
cout << t << endl;`)),
], [
  { id: 'eco6a', title: 'أصوات الحيوانات', task: 'اكتب <code>Animal</code> فيه <code>virtual string sound()</code> تُرجع <code>"..."</code> وdestructor virtual، والكلاسين <code>Dog</code> و<code>Cat</code> اللذين يعيدان تعريفها (<code>"Woof"</code> و<code>"Meow"</code>). اقرأ n ثم n كلمة (<code>dog</code> أو <code>cat</code> أو غيرهما)، وخزّن في مصفوفة <code>Animal*</code> كائنًا مناسبًا بـ new، ثم اطبع صوت كل عنصر واحذف الكائنات.',
    code: P(`class Animal {
};`, ``),
    ref: P(`class Animal {
public:
    virtual string sound() { return "..."; }
    virtual ~Animal() {}
};

class Dog : public Animal {
public:
    string sound() override { return "Woof"; }
};

class Cat : public Animal {
public:
    string sound() override { return "Meow"; }
};`, `int n;
cin >> n;
Animal* arr[10];
for (int i = 0; i < n; i++) {
    string w;
    cin >> w;
    if (w == "dog") arr[i] = new Dog();
    else if (w == "cat") arr[i] = new Cat();
    else arr[i] = new Animal();
}
for (int i = 0; i < n; i++) cout << arr[i]->sound() << endl;
for (int i = 0; i < n; i++) delete arr[i];`), inputs: ['3\ndog cat cow', '2\ncat cat'] },
]);

FS_addQuiz('coop7', [
  mcq('كيف تُكتب الدالة المجردة (pure virtual)؟', ['<code>virtual double area() = 0;</code>', '<code>abstract double area();</code>', '<code>double area() = null;</code>', '<code>virtual double area() {}</code>'], 0),
  mcq('الكلاس الذي فيه دالة مجردة:', ['كلاس مجرد لا يُنشأ منه كائن', 'كلاس عادي', 'لا يمكن الوراثة منه', 'لا يمكن تعريف مؤشر من نوعه'], 0),
  mcq('إذا لم يُعِد الابن تعريف كل الدوال المجردة:', ['يبقى الابن مجردًا ولا يُنشأ منه كائن', 'تُنفَّذ دالة فارغة', 'تُحذف الدالة', 'لا شيء'], 0),
  tf('يمكن تعريف مؤشر من نوع كلاس مجرد.', true),
  tf('الكلاس المجرد يمكن أن يحتوي constructor ودوالًا عادية.', true),
  tf('يمكن إنشاء كائن من كلاس مجرد بـ new.', false),
  out(P(`class S {
public:
    virtual int f() = 0;
    int g() { return f() + 1; }
};

class T : public S {
public:
    int f() override { return 10; }
};`, `T t;
S* p = &t;
cout << p->g() << endl;`)),
], [
  { id: 'eco7a', title: 'أشكال مجردة', task: 'اكتب الكلاس المجرد <code>Shape</code> بدالة <code>virtual double area() = 0</code> وdestructor virtual، والكلاسين <code>Circle</code> (المساحة <code>3.14 * r * r</code>) و<code>Rect</code>. اقرأ n ثم n شكلًا: <code>c</code> بعده نصف القطر أو <code>r</code> بعده العرض والطول، وخزّنها في مصفوفة <code>Shape*</code>، واطبع مجموع المساحات.',
    code: P(`class Shape {
};`, ``),
    ref: P(`class Shape {
public:
    virtual double area() = 0;
    virtual ~Shape() {}
};

class Circle : public Shape {
    double r;
public:
    Circle(double r) : r(r) {}
    double area() override { return 3.14 * r * r; }
};

class Rect : public Shape {
    double w, h;
public:
    Rect(double w, double h) : w(w), h(h) {}
    double area() override { return w * h; }
};`, `int n;
cin >> n;
Shape* arr[10];
double total = 0;
for (int i = 0; i < n; i++) {
    char t;
    cin >> t;
    if (t == 'c') {
        double r;
        cin >> r;
        arr[i] = new Circle(r);
    } else {
        double w, h;
        cin >> w >> h;
        arr[i] = new Rect(w, h);
    }
    total += arr[i]->area();
}
cout << total << endl;
for (int i = 0; i < n; i++) delete arr[i];`), inputs: ['2\nc 1\nr 2 3', '3\nr 1 1\nr 2 2\nc 2'] },
]);

FS_addQuiz('coop8', [
  mcq('ما اسم الدالة التي تعيد تعريف العامل + للكلاس؟', ['<code>operator+</code>', '<code>plus</code>', '<code>add+</code>', '<code>+operator</code>'], 0),
  mcq('<code>a + b</code> حيث a و b كائنان، تعني:', ['<code>a.operator+(b)</code>', '<code>b.operator+(a)</code>', '<code>operator+()</code>', 'خطأ دائمًا'], 0),
  mcq('لطباعة الكائن بـ <code>cout &lt;&lt; p</code> نعرّف:', ['<code>ostream&amp; operator&lt;&lt;(ostream&amp; out, const P&amp; p)</code>', '<code>void print()</code>', '<code>string toString()</code>', '<code>cout::operator&lt;&lt;</code>'], 0),
  mcq('لماذا نمرر الكائن إلى operator بـ <code>const P&amp;</code>؟', ['لتجنب النسخ وحماية الأصل من التعديل', 'لتغيير الأصل', 'لأنه إجباري', 'لتسريع الطباعة فقط'], 0),
  tf('operator== يُرجع عادة قيمة bool.', true),
  out(P(`class V {
public:
    int x;
    V(int x) : x(x) {}
    V operator+(const V& o) const { return V(x + o.x); }
    V operator*(int k) const { return V(x * k); }
};`, `V a(2), b(5);
V c = a + b * 3;
cout << c.x << endl;`)),
], [
  { id: 'eco8a', title: 'جمع الكسور', task: 'اكتب الكلاس <code>Fraction</code> (بسط ومقام) مع <code>operator+</code> (النتيجة <code>a/b + c/d = (a*d + c*b)/(b*d)</code> دون تبسيط)، و<code>operator==</code> (متساويان إذا <code>a*d == c*b</code>)، و<code>operator&lt;&lt;</code> للطباعة بالشكل <code>a/b</code>. اقرأ كسرين (4 أعداد) واطبع المجموع في سطر، ثم نتيجة المقارنة (0 أو 1).',
    code: P(`class Fraction {
};`, ``),
    ref: P(`class Fraction {
public:
    int n, d;
    Fraction(int n, int d) : n(n), d(d) {}
    Fraction operator+(const Fraction& o) const { return Fraction(n * o.d + o.n * d, d * o.d); }
    bool operator==(const Fraction& o) const { return n * o.d == o.n * d; }
};

ostream& operator<<(ostream& out, const Fraction& f) {
    out << f.n << "/" << f.d;
    return out;
}`, `int a, b, c, d;
cin >> a >> b >> c >> d;
Fraction x(a, b), y(c, d);
cout << x + y << endl;
cout << (x == y) << endl;`), inputs: ['1 2 2 4', '1 3 1 6'] },
]);

FS_addQuiz('coop9', [
  mcq('العلاقة التي يكون فيها الجزء كائنًا عضوًا يُنشأ ويُهدم مع الكل:', ['Composition', 'Aggregation', 'Association', 'Inheritance'], 0),
  mcq('العلاقة التي يحمل فيها الكلاس مؤشرات إلى كائنات أُنشئت خارجه وتبقى بعده:', ['Aggregation', 'Composition', 'Inheritance', 'Polymorphism'], 0),
  mcq('في التركيب، متى يُنشأ الكائن العضو؟', ['قبل تنفيذ جسم constructor الحاوي', 'بعد جسم constructor الحاوي', 'عند أول استخدام', 'لا يُنشأ تلقائيًا'], 0),
  mcq('في مخطط الكلاسات UML، الرمز <code>#</code> يعني:', ['protected', 'private', 'public', 'static'], 0),
  tf('الـ Association علاقة uses-a بين كائنين مستقلين.', true),
  tf('في الـ Composition يبقى الجزء موجودًا بعد هدم الكل.', false),
  out(P(`class Engine {
public:
    Engine() { cout << "E"; }
    ~Engine() { cout << "e"; }
};

class Car {
    Engine eng;
public:
    Car() { cout << "C"; }
    ~Car() { cout << "c"; }
};`, `{
    Car x;
}
cout << endl;`)),
], []);

FS_addQuiz('coop10', [
  mcq('ما فائدة القوالب Templates؟', ['كتابة دالة أو كلاس واحد يعمل مع أنواع مختلفة', 'تسريع البرنامج', 'إخفاء البيانات', 'الوراثة المتعددة'], 0),
  mcq('كيف نعرّف كائنًا من قالب الكلاس Box لنوع int؟', ['<code>Box&lt;int&gt; b(5);</code>', '<code>Box b&lt;int&gt;(5);</code>', '<code>int Box b(5);</code>', '<code>Box(int) b;</code>'], 0),
  tf('<code>template &lt;typename T&gt;</code> و <code>template &lt;class T&gt;</code> متساويتان في المعنى.', true),
  out(`#include <iostream>
using namespace std;

template <typename T>
T twice(T x) {
    return x + x;
}

int main() {
    cout << twice(4) << " " << twice(1.5) << " " << twice(string("ab")) << endl;
    return 0;
}
`),
], [
  { id: 'eco10a', title: 'قالب أكبر قيمة', task: 'اكتب قالب الدالة <code>template &lt;typename T&gt; T biggest(T a, T b, T c)</code> الذي يُرجع الأكبر. اقرأ ثلاثة أعداد صحيحة، ثم ثلاثة أعداد عشرية، ثم ثلاث كلمات، واطبع الأكبر من كل مجموعة في سطر.',
    code: `#include <iostream>
#include <string>
using namespace std;

// اكتب القالب هنا

int main() {
    return 0;
}
`,
    ref: `#include <iostream>
#include <string>
using namespace std;

template <typename T>
T biggest(T a, T b, T c) {
    T m = a;
    if (b > m) m = b;
    if (c > m) m = c;
    return m;
}

int main() {
    int a, b, c;
    double x, y, z;
    string p, q, r;
    cin >> a >> b >> c >> x >> y >> z >> p >> q >> r;
    cout << biggest(a, b, c) << endl;
    cout << biggest(x, y, z) << endl;
    cout << biggest(p, q, r) << endl;
    return 0;
}
`, inputs: ['3 9 5 1.5 0.5 2.25 apple pear kiwi', '-1 -7 -3 0.1 0.2 0.3 zed abc mid'] },
]);

FS_addQuiz('coopexam', [
  mcq('مبادئ البرمجة الشيئية الأساسية هي:', ['التغليف والوراثة وتعدد الأشكال والتجريد', 'الكلاس والكائن والدالة والمتغير', 'المصفوفة والمؤشر والقائمة والشجرة', 'الترجمة والتشغيل والتنقيح والاختبار'], 0),
  mcq('ماذا يحدث إذا كان في الكلاس دالتان لهما الاسم والمعاملات نفسها ونوع إرجاع مختلف؟', ['خطأ ترجمة', 'overloading ناجح', 'يختار المترجم حسب السياق', 'تُنفَّذ الدالتان'], 0),
  mcq('ما الفرق بين الـ constructor والدالة العادية؟', ['الـ constructor يحمل اسم الكلاس ولا نوع إرجاع له ويُنفَّذ عند الإنشاء', 'الـ constructor له نوع إرجاع', 'لا يمكن تحميل الـ constructor', 'الـ constructor يُستدعى يدويًا'], 0),
  mcq('ترتيب الإنشاء في كائن ابن يحتوي كائنًا عضوًا:', ['الأب ← الكائن العضو ← جسم الابن', 'جسم الابن ← الأب ← العضو', 'العضو ← الابن ← الأب', 'الأب فقط'], 0),
  mcq('القسمة على صفر في الأعداد الصحيحة تسبب:', ['خطأ وقت التشغيل (Runtime Error)', 'خطأ ترجمة', 'طباعة 0', 'لا شيء'], 0),
  tf('الـ destructor يُستدعى تلقائيًا ولا يستقبل معاملات.', true),
  tf('الكلاس المجرد يمكن أن يحتوي دوالًا مجردة ودوالًا بجسم.', true),
  tf('الدالة static يمكنها استخدام this.', false),
  tf('تعدد الأشكال يعمل عند نسخ الكائنات بالقيمة.', false),
  tf('<code>friend</code> تعطي دالة خارجية حق الوصول إلى الأعضاء private.', true),
  out(P(`class Base {
public:
    static int n;
    int v;
    Base() { n++; v = 10; }
    virtual void show() { cout << "Base " << v << endl; }
};

int Base::n = 0;

class Derived : public Base {
public:
    Derived() { v += 5; }
    void show() override { cout << "Derived " << v << endl; }
};`, `Base* a = new Derived();
Base b;
a->show();
b.show();
cout << Base::n << endl;`)),
  out(P(`class X {
public:
    int k;
    X(int k) : k(k) {}
    X add(const X& o) const { return X(k + o.k); }
};`, `X a(2), b(5);
X c = a.add(b).add(a);
cout << a.k << " " << b.k << " " << c.k << endl;`)),
], [
  { id: 'ecox1', title: 'كلاس المدرّس', task: 'اكتب الكلاس <code>Teacher</code> بالحقول <code>name</code> و<code>age</code> و<code>gender</code> (char)، وconstructor، وcopy constructor، والدالة <code>bool equals(const Teacher& b) const</code> التي تُرجع true إذا تطابقت الحقول. اقرأ بيانات مدرّسَين (اسم وجنس وعمر)، واطبع نتيجة equals بينهما (0 أو 1)، ثم أنشئ نسخة من الأول واطبع equals بينهما.',
    code: P(`class Teacher {
};`, ``),
    ref: P(`class Teacher {
    string name;
    int age;
    char gender;
public:
    Teacher(string n, char g, int a) : name(n), age(a), gender(g) {}
    Teacher(const Teacher& b) : name(b.name), age(b.age), gender(b.gender) {}
    bool equals(const Teacher& b) const {
        return name == b.name && age == b.age && gender == b.gender;
    }
};`, `string n1, n2;
char g1, g2;
int a1, a2;
cin >> n1 >> g1 >> a1 >> n2 >> g2 >> a2;
Teacher t1(n1, g1, a1), t2(n2, g2, a2);
cout << t1.equals(t2) << endl;
Teacher t3 = t1;
cout << t1.equals(t3) << endl;`), inputs: ['Ali M 40\nAli M 40', 'Ali M 40\nSara F 35'] },
]);
})();
