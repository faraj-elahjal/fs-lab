/* Programming 2 (continued): strings and char arrays, pointers, dynamic memory, struct.
   Inserted before the Programming 2 exam review. */
(function () {
const ind = (b) => b.replace(/^/gm, '    ').replace(/^\s+$/gm, '');
const F = (fns, body, inc) => `#include <iostream>\n${inc || ''}using namespace std;\n\n${fns ? fns.trim() + '\n\n' : ''}int main() {\n${ind(body)}\n    return 0;\n}\n`;
const STR = '#include <string>\n', CSTR = '#include <cstring>\n';
const P2 = 'برمجة 2';

const add = [
{
  course: P2, id: 'str', title: 'النصوص string و char[]', tag: 'S1 · C++',
  concept: `<p><b>النص (string)</b> سلسلة من الحروف، ويُوصل إلى كل حرف بفهرسه مثل المصفوفة: <code>s[0]</code> أول حرف.</p>
    <ul><li><code>s.length()</code> طول النص، و <code>+</code> للدمج، و <code>==</code> و <code>&lt;</code> للمقارنة.</li>
    <li><code>cin &gt;&gt; s</code> تقرأ كلمة واحدة، و <code>getline(cin, s)</code> تقرأ سطرًا كاملًا.</li>
    <li><b>مصفوفة الحروف</b> <code>char s[20]</code> تنتهي بالحرف <code>'\\0'</code>، وتُستخدم معها دوال مثل <code>strlen</code> و <code>strcpy</code>.</li></ul>`,
  examples: [
    { id: 's1', title: 'أساسيات string', code: F('', `string s = "Hello";\ns = s + " FS";\ncout << s << endl;\ncout << "length = " << s.length() << endl;\ncout << "first = " << s[0] << endl;\ns[0] = 'J';\ncout << s;`, STR) },
    { id: 's2', title: 'عدّ حروف العلة', code: F('', `string w;\ncin >> w;\nint c = 0;\nfor (int i = 0; i < w.length(); i++) {\n    char ch = w[i];\n    if (ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u')\n        c++;\n}\ncout << c;`, STR), input: 'education' },
    { id: 's3', title: 'getline وفخ cin.ignore', note: 'ماذا يحدث لو حذفت cin.ignore()؟', code: F('', `int age;\nstring name;\ncout << "Age: ";\ncin >> age;\ncin.ignore();\ncout << "Full name: ";\ngetline(cin, name);\ncout << name << " is " << age;`, STR), input: '20' },
    { id: 's4', title: 'substr و find', code: F('', `string s = "programming";\ncout << s.substr(0, 7) << endl;\ncout << s.find("gram") << endl;\nif (s.find("xyz") == string::npos)\n    cout << "not found";`, STR) },
    { id: 's5', title: 'تحويل إلى حروف كبيرة', code: F('', `string s = "fs lab";\nfor (int i = 0; i < s.length(); i++)\n    s[i] = toupper(s[i]);\ncout << s;`, STR) },
    { id: 's6', title: 'مصفوفة حروف و cstring', code: F('', `char a[20] = "Ali";\nchar b[20];\nstrcpy(b, a);\nstrcat(b, " Omar");\ncout << b << endl;\ncout << strlen(b) << endl;\ncout << strcmp(a, b);`, CSTR) },
    { id: 's7', title: 'هل الكلمة متناظرة (Palindrome)؟', code: F('', `string w;\ncin >> w;\nbool ok = true;\nint n = w.length();\nfor (int i = 0; i < n / 2; i++)\n    if (w[i] != w[n - 1 - i])\n        ok = false;\nif (ok)\n    cout << "Palindrome";\nelse\n    cout << "Not palindrome";`, STR), input: 'level' },
  ],
  challenges: [
    { id: 'sc1', title: 'عدد تكرار حرف', task: 'اقرأ كلمة ثم حرفًا، واطبع عدد مرات ظهور الحرف في الكلمة. مثال: <code>banana a</code> ناتجه <code>3</code>.',
      code: F('', `string w;\nchar c;\ncin >> w >> c;\n// اكتب الحل هنا\n`, STR), tests: [{ input: 'banana a', output: '3' }, { input: 'hello z', output: '0' }, { input: 'aaaa a', output: '4' }] },
    { id: 'sc2', title: 'عكس الكلمة', task: 'اقرأ كلمة، واطبعها معكوسة. مثال: <code>lab</code> ناتجه <code>bal</code>.',
      code: F('', `string w;\ncin >> w;\n// اكتب الحل هنا\n`, STR), tests: [{ input: 'lab', output: 'bal' }, { input: 'a', output: 'a' }, { input: 'Programming', output: 'gnimmargorP' }] },
    { id: 'sc3', title: 'عدد الكلمات في سطر', task: 'اقرأ سطرًا كاملًا بـ getline، واطبع عدد الكلمات فيه (الكلمات تفصل بينها مسافة واحدة).',
      code: F('', `string line;\ngetline(cin, line);\n// اكتب الحل هنا\n`, STR), tests: [{ input: 'I love C++ very much', output: '5' }, { input: 'hello', output: '1' }] },
  ],
},
{
  course: P2, id: 'ptr', title: 'المؤشرات', tag: 'P1 · C++',
  concept: `<p><b>المؤشر</b> متغير يخزن <b>عنوان</b> متغير آخر في الذاكرة. <code>&amp;x</code> عنوان x، و <code>*p</code> القيمة الموجودة في العنوان الذي يخزنه p.</p>
    <ul><li>يظهر المؤشر في الذاكرة كصندوق فيه سهم إلى المتغير الذي يشير إليه.</li>
    <li>اسم المصفوفة يتحول إلى مؤشر لأول عنصر، و <code>*(p + i)</code> هو <code>p[i]</code>.</li>
    <li><code>nullptr</code> مؤشر لا يشير إلى شيء، ولا يجوز الوصول عبره.</li></ul>`,
  examples: [
    { id: 'pt1', title: 'المؤشر: العنوان والقيمة', code: F('', `int x = 5;\nint* p = &x;\ncout << "x = " << x << endl;\ncout << "*p = " << *p << endl;\n*p = 10;\ncout << "x = " << x;`) },
    { id: 'pt2', title: 'مؤشران إلى المتغير نفسه', code: F('', `int a = 3;\nint* p = &a;\nint* q = p;\n*q = *q + 4;\ncout << a << " " << *p;`) },
    { id: 'pt3', title: 'المؤشرات والمصفوفات', code: F('', `int a[4] = {3, 6, 9, 12};\nint* p = a;\ncout << *p << endl;\ncout << *(p + 2) << endl;\np++;\ncout << *p << " " << p[1];`) },
    { id: 'pt4', title: 'المرور على مصفوفة بمؤشر', code: F('', `int a[5] = {2, 4, 6, 8, 10};\nint sum = 0;\nfor (int* p = a; p < a + 5; p++)\n    sum += *p;\ncout << sum;`) },
    { id: 'pt5', title: 'swap بالمؤشرات', code: F(`void swapP(int* a, int* b) {\n    int t = *a;\n    *a = *b;\n    *b = t;\n}`, `int x = 1, y = 2;\nswapP(&x, &y);\ncout << x << " " << y;`) },
    { id: 'pt6', title: 'خطأ: الوصول عبر nullptr', note: 'شاهد رسالة الخطأ', code: F('', `int* p = nullptr;\ncout << "before" << endl;\ncout << *p;`) },
  ],
  challenges: [
    { id: 'ptc1', title: 'المجموع بمؤشر', task: 'اكتب الدالة <code>sumP(int* p, int n)</code> التي تجمع n عنصرًا بدءًا من العنوان p باستخدام المؤشر. الدالة main جاهزة.',
      code: F(`// اكتب الدالة sumP هنا\n`, `int a[5];\nfor (int i = 0; i < 5; i++)\n    cin >> a[i];\ncout << sumP(a, 5);`), tests: [{ input: '1 2 3 4 5', output: '15' }, { input: '10 -10 0 7 3', output: '10' }] },
    { id: 'ptc2', title: 'الأكبر والأصغر بمؤشرات', task: 'اكتب الدالة <code>minMax(int a[], int n, int* mn, int* mx)</code> التي تضع الأصغر في *mn والأكبر في *mx. الدالة main جاهزة.',
      code: F(`// اكتب الدالة minMax هنا\n`, `int a[4], lo, hi;\nfor (int i = 0; i < 4; i++)\n    cin >> a[i];\nminMax(a, 4, &lo, &hi);\ncout << lo << " " << hi;`), tests: [{ input: '4 -2 9 1', output: '-2 9' }, { input: '5 5 5 5', output: '5 5' }] },
  ],
},
{
  course: P2, id: 'dyn', title: 'الذاكرة الديناميكية new و delete', tag: 'P2 · C++',
  concept: `<p><b>الذاكرة الديناميكية (heap)</b> مكان يُحجز أثناء التشغيل بـ <code>new</code>، ويبقى حتى نحرره بـ <code>delete</code>.</p>
    <ul><li><code>new int</code> تحجز متغيرًا وتُرجع عنوانه، و <code>new int[n]</code> تحجز مصفوفة حجمها يُعرف أثناء التشغيل.</li>
    <li>كل ما يُحجز بـ new يظهر في قسم <b>الذاكرة الديناميكية</b> برقم مثل <code>#1</code>.</li>
    <li>بعد <code>delete</code> يبقى المؤشر يحمل العنوان القديم (dangling)، فيُفضّل أن نجعله <code>nullptr</code>.</li></ul>`,
  examples: [
    { id: 'dy1', title: 'حجز متغير بـ new', code: F('', `int* p = new int;\n*p = 42;\ncout << *p << endl;\ndelete p;\np = nullptr;`) },
    { id: 'dy2', title: 'مصفوفة حجمها من المستخدم', code: F('', `int n;\ncin >> n;\nint* a = new int[n];\nfor (int i = 0; i < n; i++)\n    a[i] = i * i;\nfor (int i = 0; i < n; i++)\n    cout << a[i] << " ";\ndelete[] a;`), input: '5' },
    { id: 'dy3', title: 'خطأ: استخدام بعد delete', note: 'dangling pointer', code: F('', `int* p = new int;\n*p = 7;\ndelete p;\ncout << *p;`) },
    { id: 'dy4', title: 'تسرب الذاكرة (memory leak)', note: 'لاحظ رسالة نهاية البرنامج', code: F('', `int* p = new int;\n*p = 1;\np = new int;\n*p = 2;\ncout << *p;`) },
  ],
  challenges: [
    { id: 'dyc1', title: 'عكس مصفوفة ديناميكية', task: 'اقرأ n ثم n عددًا في مصفوفة تُحجز بـ <code>new</code>، ثم اطبعها بالعكس بينها مسافات، واحذفها بـ <code>delete[]</code>.',
      code: F('', `int n;\ncin >> n;\n// اكتب الحل هنا\n`), tests: [{ input: '4 1 2 3 4', output: '4 3 2 1' }, { input: '1 9', output: '9' }] },
  ],
},
{
  course: P2, id: 'struct', title: 'السجلات struct', tag: 'R1 · C++',
  concept: `<p><b>السجل (struct)</b> نوع بيانات نصنعه نحن، يجمع عدة حقول من أنواع مختلفة تحت اسم واحد، مثل طالب له اسم وعمر ومعدل.</p>
    <ul><li>نصل إلى الحقل بالنقطة: <code>s.age</code>، ومن خلال مؤشر بالسهم: <code>p-&gt;age</code>.</li>
    <li>يظهر السجل في الذاكرة كبطاقة فيها حقوله.</li>
    <li>مصفوفة السجلات تحفظ بيانات عدة طلبة معًا.</li></ul>`,
  examples: [
    { id: 'r1', title: 'تعريف سجل واستخدامه', code: F(`struct Student {\n    string name;\n    int age;\n    double gpa;\n};`, `Student s = {"Ali", 20, 3.5};\ns.age++;\ncout << s.name << " " << s.age << " " << s.gpa;`, STR) },
    { id: 'r2', title: 'إدخال بيانات سجل', code: F(`struct Point {\n    int x;\n    int y;\n};`, `Point p;\ncin >> p.x >> p.y;\ncout << "(" << p.x << ", " << p.y << ")";`), input: '3 7' },
    { id: 'r3', title: 'مصفوفة سجلات: أفضل طالب', code: F(`struct Student {\n    string name;\n    double gpa;\n};`, `Student st[3] = {{"Ali", 3.1}, {"Sara", 3.8}, {"Omar", 2.9}};\nint best = 0;\nfor (int i = 1; i < 3; i++)\n    if (st[i].gpa > st[best].gpa)\n        best = i;\ncout << st[best].name;`, STR) },
    { id: 'r4', title: 'تمرير سجل بالمرجع', code: F(`struct Account {\n    string owner;\n    double balance;\n};\n\nvoid deposit(Account &a, double x) {\n    a.balance += x;\n}`, `Account acc = {"Faraj", 100};\ndeposit(acc, 50);\ncout << acc.owner << ": " << acc.balance;`, STR) },
    { id: 'r5', title: 'مؤشر إلى سجل والسهم ->', code: F(`struct Point {\n    int x;\n    int y;\n};`, `Point a = {1, 2};\nPoint* p = &a;\np->x = 10;\n(*p).y = 20;\ncout << a.x << " " << a.y;`) },
  ],
  challenges: [
    { id: 'rc1', title: 'متوسط المعدلات', task: 'السجل <code>Student</code> جاهز. اقرأ بيانات 3 طلبة (الاسم ثم المعدل) في مصفوفة سجلات، واطبع متوسط المعدلات.',
      code: F(`struct Student {\n    string name;\n    double gpa;\n};`, `Student st[3];\n// اكتب الحل هنا\n`, STR), tests: [{ input: 'Ali 3 Sara 4 Omar 2', output: '3' }, { input: 'A 2.5 B 3.5 C 3', output: '3' }] },
    { id: 'rc2', title: 'أكبر طالب سنًا', task: 'السجل <code>Person</code> جاهز. اقرأ n ثم بيانات n شخص (الاسم ثم العمر، n لا يزيد على 5)، واطبع اسم الأكبر سنًا.',
      code: F(`struct Person {\n    string name;\n    int age;\n};`, `int n;\nPerson p[5];\ncin >> n;\n// اكتب الحل هنا\n`, STR), tests: [{ input: '3 Ali 20 Sara 25 Omar 22', output: 'Sara' }, { input: '1 Faraj 30', output: 'Faraj' }] },
  ],
},
];
const L = window.FS_LESSONS;
const at = L.findIndex((x) => x.id === 'exam2');
L.splice(at < 0 ? L.length : at, 0, ...add);
})();
