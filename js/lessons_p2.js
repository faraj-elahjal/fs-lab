/* Programming 2 lessons for FS_Lab: functions, value/reference, scope, arrays (1D/2D), functions with arrays,
   overloading, default arguments, recursion. Appended to window.FS_LESSONS. */
(function () {
const ind = (b) => b.replace(/^/gm, '    ').replace(/^\s+$/gm, '');
// F(functions, mainBody): full program with functions written before main
const F = (fns, body) => `#include <iostream>\nusing namespace std;\n\n${fns ? fns.trim() + '\n\n' : ''}int main() {\n${ind(body)}\n    return 0;\n}\n`;
const P2 = 'برمجة 2';

window.FS_LESSONS.push(
{
  course: P2, id: 'fn', title: 'الدوال: الأساسيات', tag: 'F1 · C++',
  concept: `<p><b>الدالة</b> مجموعة من التعليمات تُجمع تحت اسم واحد لأداء مهمة محددة، ولا تُنفَّذ إلا عند استدعائها.</p>
    <ul><li>الشكل: نوع الإرجاع، ثم الاسم، ثم المعاملات بين قوسين، ثم الجسم.</li>
    <li><code>return</code> تُرجع قيمة وتنهي الدالة، والدالة <code>void</code> لا تُرجع قيمة.</li>
    <li>تابع في <b>الذاكرة</b> إطار كل دالة عند استدعائها، وكيف يعود التنفيذ إلى مكان الاستدعاء.</li></ul>`,
  examples: [
    { id: 'p2f1', title: 'دالة تجمع عددين', code: F(`int add(int a, int b) {\n    return a + b;\n}`, `int s = add(3, 4);\ncout << s << endl;\ncout << add(10, 5);`) },
    { id: 'p2f2', title: 'دالة void تطبع سطرًا', code: F(`void printLine() {\n    for (int i = 0; i < 10; i++)\n        cout << "*";\n    cout << endl;\n}`, `printLine();\ncout << "Hello" << endl;\nprintLine();`) },
    { id: 'p2f3', title: 'تتبع امتحان: square و addTen', note: 'لماذا بقيت a تساوي 3؟', code: F(`int square(int x) {\n    return x * x;\n}\n\nint addTen(int n) {\n    n = n + 10;\n    return n;\n}`, `int a = 3;\nint b = square(a);\ncout << b << endl;\nint c = addTen(a);\ncout << a << " " << c;`) },
    { id: 'p2f4', title: 'النموذج الأولي (prototype)', code: `#include <iostream>\nusing namespace std;\n\nint add(int a, int b);\n\nint main() {\n    cout << add(2, 3);\n    return 0;\n}\n\nint add(int a, int b) {\n    return a + b;\n}\n` },
    { id: 'p2f5', title: 'استدعاء متداخل f(f(1))', code: F(`int f(int x) {\n    return x * 2 + 1;\n}`, `int y = f(3);\ncout << f(y) << endl;\ncout << f(f(1));`) },
    { id: 'p2f6', title: 'دالة bool: هل العدد أولي؟', code: F(`bool isPrime(int n) {\n    if (n < 2)\n        return false;\n    for (int i = 2; i < n; i++)\n        if (n % i == 0)\n            return false;\n    return true;\n}`, `for (int i = 1; i <= 10; i++)\n    if (isPrime(i))\n        cout << i << " ";`) },
  ],
  challenges: [
    { id: 'p2fc1', title: 'الدالة maxOf', task: 'اكتب الدالة <code>maxOf</code> التي تستقبل عددين صحيحين وتُرجع الأكبر منهما. الدالة main جاهزة.',
      code: F(`// اكتب الدالة maxOf هنا\n`, `int a, b;\ncin >> a >> b;\ncout << maxOf(a, b);`), tests: [{ input: '4 9', output: '9' }, { input: '7 -2', output: '7' }, { input: '5 5', output: '5' }] },
    { id: 'p2fc2', title: 'الدالة isEven', task: 'اكتب الدالة <code>isEven</code> التي تُرجع <code>true</code> إذا كان العدد زوجيًا. الدالة main جاهزة وتطبع Even أو Odd.',
      code: F(`// اكتب الدالة isEven هنا\n`, `int n;\ncin >> n;\nif (isEven(n))\n    cout << "Even";\nelse\n    cout << "Odd";`), tests: [{ input: '8', output: 'Even' }, { input: '7', output: 'Odd' }, { input: '0', output: 'Even' }, { input: '-3', output: 'Odd' }] },
    { id: 'p2fc3', title: 'الدالة printStars', task: 'اكتب دالة <code>void</code> اسمها <code>printStars</code> تستقبل عددًا n وتطبع n نجمة ثم تنتقل لسطر جديد. الدالة main جاهزة.',
      code: F(`// اكتب الدالة printStars هنا\n`, `int n;\ncin >> n;\nprintStars(n);\nprintStars(2);`), tests: [{ input: '3', output: '***\n**' }, { input: '5', output: '*****\n**' }] },
  ],
},
{
  course: P2, id: 'ref', title: 'التمرير بالقيمة وبالمرجع', tag: 'F2 · C++',
  concept: `<p><b>التمرير بالقيمة</b>: تستقبل الدالة نسخة، فلا يتغير المتغير الأصلي. <b>التمرير بالمرجع</b> <code>&amp;</code>: يصبح المعامل اسمًا آخر للمتغير الأصلي نفسه.</p>
    <ul><li>في الذاكرة: المعامل بالمرجع يظهر بإطار متقطع وسهم إلى المتغير الأصلي.</li>
    <li><b>النطاق</b>: المتغير المحلي يُرى داخل دالته فقط، والمتغير العام تراه كل الدوال.</li></ul>`,
  examples: [
    { id: 'p2r1', title: 'بالقيمة: الأصل لا يتغير', code: F(`void change(int x) {\n    x = 100;\n}`, `int a = 5;\nchange(a);\ncout << a;`) },
    { id: 'p2r2', title: 'بالمرجع &: الأصل يتغير', code: F(`void change(int &x) {\n    x = 100;\n}`, `int a = 5;\nchange(a);\ncout << a;`) },
    { id: 'p2r3', title: 'swap بالطريقتين', code: F(`void swapV(int a, int b) {\n    int t = a;\n    a = b;\n    b = t;\n}\n\nvoid swapR(int &a, int &b) {\n    int t = a;\n    a = b;\n    b = t;\n}`, `int x = 3, y = 7;\nswapV(x, y);\ncout << x << " " << y << endl;\nswapR(x, y);\ncout << x << " " << y;`) },
    { id: 'p2r4', title: 'إرجاع أكثر من قيمة', code: F(`void calc(int a, int b, int &s, double &avg) {\n    s = a + b;\n    avg = s / 2.0;\n}`, `int total;\ndouble av;\ncalc(6, 9, total, av);\ncout << total << " " << av;`) },
    { id: 'p2r5', title: 'المتغير المحلي والعام', code: `#include <iostream>\nusing namespace std;\n\nint g = 10;\n\nvoid f() {\n    int g = 1;\n    g++;\n    cout << g << endl;\n}\n\nvoid h() {\n    g++;\n}\n\nint main() {\n    f();\n    h();\n    cout << g;\n    return 0;\n}\n` },
    { id: 'p2r6', title: 'تتبع امتحان: Value و Reference معًا', code: F(`void f(int a, int &b) {\n    a = a + 1;\n    b = b + a;\n}`, `int x = 2, y = 5;\nf(x, y);\ncout << x << " " << y << endl;\nf(y, x);\ncout << x << " " << y;`) },
    { id: 'p2r7', title: 'خطأ: إرسال رقم لمعامل بالمرجع', note: 'شاهد رسالة الخطأ', code: F(`void addOne(int &x) {\n    x++;\n}`, `int a = 4;\naddOne(a);\naddOne(5);\ncout << a;`) },
  ],
  challenges: [
    { id: 'p2rc1', title: 'الدالة doubleIt', task: 'اكتب الدالة <code>doubleIt</code> التي تضاعف قيمة المتغير المرسل إليها بحيث يتغير الأصل. الدالة main جاهزة.',
      code: F(`// اكتب الدالة doubleIt هنا\n`, `int n;\ncin >> n;\ndoubleIt(n);\ncout << n;`), tests: [{ input: '5', output: '10' }, { input: '-4', output: '-8' }, { input: '0', output: '0' }] },
    { id: 'p2rc2', title: 'الدالة minMax', task: 'اكتب الدالة <code>minMax(a, b, mn, mx)</code> التي تضع الأصغر في mn والأكبر في mx. الدالة main جاهزة.',
      code: F(`// اكتب الدالة minMax هنا\n`, `int a, b, mn, mx;\ncin >> a >> b;\nminMax(a, b, mn, mx);\ncout << mn << " " << mx;`), tests: [{ input: '4 9', output: '4 9' }, { input: '8 -1', output: '-1 8' }, { input: '3 3', output: '3 3' }] },
  ],
},
{
  course: P2, id: 'arr1', title: 'المصفوفات الأحادية', tag: 'A1 · C++',
  concept: `<p><b>المصفوفة</b> مجموعة من المتغيرات من النوع نفسه تحت اسم واحد، ويُصل إلى كل عنصر بفهرسه.</p>
    <ul><li>الفهرس يبدأ من 0، وآخر فهرس هو الحجم ناقص 1.</li>
    <li>نمر على العناصر بحلقة for من 0 إلى أقل من الحجم.</li>
    <li>تظهر المصفوفة في الذاكرة كصف من الخانات، والخانة التي تغيّرت تتلوّن.</li></ul>`,
  examples: [
    { id: 'p2a1', title: 'تعريف المصفوفة وطباعتها', code: F('', `int a[5] = {4, 7, 1, 9, 3};\nfor (int i = 0; i < 5; i++)\n    cout << a[i] << " ";`) },
    { id: 'p2a2', title: 'إدخال العناصر وجمعها', code: F('', `int a[4];\nint sum = 0;\nfor (int i = 0; i < 4; i++) {\n    cin >> a[i];\n    sum += a[i];\n}\ncout << "sum = " << sum;`), input: '5 8 2 10' },
    { id: 'p2a3', title: 'أكبر عنصر وموقعه', code: F('', `int a[6] = {3, 8, 2, 11, 5, 7};\nint mx = a[0], pos = 0;\nfor (int i = 1; i < 6; i++) {\n    if (a[i] > mx) {\n        mx = a[i];\n        pos = i;\n    }\n}\ncout << mx << " at " << pos;`) },
    { id: 'p2a4', title: 'الطباعة بالعكس', code: F('', `int a[5] = {1, 2, 3, 4, 5};\nfor (int i = 4; i >= 0; i--)\n    cout << a[i] << " ";`) },
    { id: 'p2a5', title: 'القيم الناقصة تصبح 0', code: F('', `int a[5] = {6, 2};\nfor (int i = 0; i < 5; i++)\n    cout << a[i] << " ";`) },
    { id: 'p2a6', title: 'خطأ: فهرس خارج الحدود', note: 'i <= 5 بدل i < 5', code: F('', `int a[5] = {1, 2, 3, 4, 5};\nfor (int i = 0; i <= 5; i++)\n    cout << a[i] << " ";`) },
  ],
  challenges: [
    { id: 'p2ac1', title: 'المتوسط والأكبر منه', task: 'اقرأ عددًا n (لا يزيد على 10) ثم n عددًا في مصفوفة، واطبع عدد العناصر الأكبر من المتوسط. مثال: <code>4  2 4 6 8</code> ناتجه <code>2</code>.',
      code: F('', `int n;\nint a[10];\ncin >> n;\n// اكتب الحل هنا\n`), tests: [{ input: '4 2 4 6 8', output: '2' }, { input: '3 5 5 5', output: '0' }, { input: '5 1 1 1 1 6', output: '1' }] },
    { id: 'p2ac2', title: 'الطباعة بالعكس', task: 'اقرأ 5 أعداد في مصفوفة، ثم اطبعها بالترتيب العكسي بينها مسافات.',
      code: F('', `int a[5];\n// اكتب الحل هنا\n`), tests: [{ input: '1 2 3 4 5', output: '5 4 3 2 1' }, { input: '9 0 -1 7 3', output: '3 7 -1 0 9' }] },
  ],
},
{
  course: P2, id: 'arr2', title: 'المصفوفات الثنائية', tag: 'A2 · C++',
  concept: `<p><b>المصفوفة الثنائية</b> جدول من صفوف وأعمدة، ويُصل إلى العنصر بفهرسين: <code>m[i][j]</code> حيث i رقم الصف و j رقم العمود.</p>
    <ul><li>نمر على العناصر بحلقتين متداخلتين: الخارجية للصفوف والداخلية للأعمدة.</li>
    <li>تظهر في الذاكرة كجدول مرقم الصفوف والأعمدة.</li></ul>`,
  examples: [
    { id: 'p2m1', title: 'طباعة جدول', code: F('', `int m[2][3] = {{1, 2, 3},\n               {4, 5, 6}};\nfor (int i = 0; i < 2; i++) {\n    for (int j = 0; j < 3; j++)\n        cout << m[i][j] << " ";\n    cout << endl;\n}`) },
    { id: 'p2m2', title: 'مجموع كل صف', code: F('', `int m[3][3] = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};\nfor (int i = 0; i < 3; i++) {\n    int s = 0;\n    for (int j = 0; j < 3; j++)\n        s += m[i][j];\n    cout << "row " << i << ": " << s << endl;\n}`) },
    { id: 'p2m3', title: 'مجموع القطر الرئيسي', code: F('', `int m[3][3] = {{2, 0, 1}, {4, 5, 6}, {7, 8, 3}};\nint d = 0;\nfor (int i = 0; i < 3; i++)\n    d += m[i][i];\ncout << d;`) },
    { id: 'p2m4', title: 'المنقول (Transpose)', code: F('', `int m[2][3] = {{1, 2, 3}, {4, 5, 6}};\nfor (int j = 0; j < 3; j++) {\n    for (int i = 0; i < 2; i++)\n        cout << m[i][j] << " ";\n    cout << endl;\n}`) },
  ],
  challenges: [
    { id: 'p2mc1', title: 'مجموع القطر', task: 'اقرأ مصفوفة 3×3 صفًا بعد صف، واطبع مجموع عناصر القطر الرئيسي.',
      code: F('', `int m[3][3];\n// اكتب الحل هنا\n`), tests: [{ input: '1 2 3 4 5 6 7 8 9', output: '15' }, { input: '0 1 1 1 0 1 1 1 0', output: '0' }] },
    { id: 'p2mc2', title: 'مجموع كل عمود', task: 'اقرأ مصفوفة 2×3 صفًا بعد صف، واطبع مجموع كل عمود بينها مسافات. مثال: <code>1 2 3 4 5 6</code> ناتجه <code>5 7 9</code>.',
      code: F('', `int m[2][3];\n// اكتب الحل هنا\n`), tests: [{ input: '1 2 3 4 5 6', output: '5 7 9' }, { input: '0 0 1 2 -2 3', output: '2 -2 4' }] },
  ],
},
{
  course: P2, id: 'fnarr', title: 'الدوال مع المصفوفات و Overloading', tag: 'F3 · C++',
  concept: `<p>المصفوفة تُمرَّر إلى الدالة <b>بالمرجع دائمًا</b> دون <code>&amp;</code>، ويُرسل حجمها في معامل مستقل. وفي المصفوفة الثنائية يُكتب عدد الأعمدة.</p>
    <ul><li><b>تعدد التعريف (Overloading)</b>: دوال بالاسم نفسه تختلف في عدد المعاملات أو أنواعها.</li>
    <li><b>القيم الافتراضية</b>: تُكتب من اليمين، ويأخذها المعامل إذا لم تُرسل له قيمة.</li>
    <li><b>الاستدعاء الذاتي</b>: دالة تستدعي نفسها حتى تصل إلى حالة توقف.</li></ul>`,
  examples: [
    { id: 'p2x1', title: 'مجموع عناصر مصفوفة بدالة', code: F(`int sumArr(int a[], int n) {\n    int s = 0;\n    for (int i = 0; i < n; i++)\n        s += a[i];\n    return s;\n}`, `int arr[5] = {4, 7, 1, 9, 3};\ncout << sumArr(arr, 5);`) },
    { id: 'p2x2', title: 'الدالة تعدّل المصفوفة الأصلية', code: F(`void doubleAll(int a[], int n) {\n    for (int i = 0; i < n; i++)\n        a[i] = a[i] * 2;\n}`, `int arr[3] = {1, 2, 3};\ndoubleAll(arr, 3);\nfor (int i = 0; i < 3; i++)\n    cout << arr[i] << " ";`) },
    { id: 'p2x3', title: 'مصفوفة ثنائية في دالة', code: F(`int sum2D(int m[][3], int rows) {\n    int s = 0;\n    for (int i = 0; i < rows; i++)\n        for (int j = 0; j < 3; j++)\n            s += m[i][j];\n    return s;\n}`, `int m[2][3] = {{1, 2, 3}, {4, 5, 6}};\ncout << sum2D(m, 2);`) },
    { id: 'p2x4', title: 'تعدد التعريف: area', code: F(`int area(int side) {\n    return side * side;\n}\n\nint area(int w, int h) {\n    return w * h;\n}\n\ndouble area(double r) {\n    return 3.14 * r * r;\n}`, `cout << area(4) << endl;\ncout << area(3, 5) << endl;\ncout << area(2.0);`) },
    { id: 'p2x5', title: 'القيم الافتراضية', code: F(`void greet(string name, int times = 1) {\n    for (int i = 0; i < times; i++)\n        cout << "Hi " << name << endl;\n}`, `greet("Ali");\ngreet("Sara", 2);`) },
    { id: 'p2x6', title: 'تتبع امتحان: مصفوفة ومتغير', code: F(`void f(int a[], int n, int x) {\n    for (int i = 0; i < n; i++)\n        a[i] = a[i] + x;\n    x = 0;\n}`, `int arr[3] = {1, 2, 3};\nint k = 5;\nf(arr, 3, k);\ncout << arr[0] << " " << arr[2] << " " << k;`) },
    { id: 'p2x7', title: 'الاستدعاء الذاتي: المضروب', note: 'تابع الإطارات في الذاكرة', code: F(`int fact(int n) {\n    if (n <= 1)\n        return 1;\n    return n * fact(n - 1);\n}`, `cout << fact(4);`) },
  ],
  challenges: [
    { id: 'p2xc1', title: 'الدالة countEven', task: 'اكتب الدالة <code>countEven(a, n)</code> التي تُرجع عدد العناصر الزوجية في المصفوفة. الدالة main جاهزة.',
      code: F(`// اكتب الدالة countEven هنا\n`, `int a[6];\nfor (int i = 0; i < 6; i++)\n    cin >> a[i];\ncout << countEven(a, 6);`), tests: [{ input: '1 2 3 4 5 6', output: '3' }, { input: '1 3 5 7 9 11', output: '0' }, { input: '0 -2 4 8 10 12', output: '6' }] },
    { id: 'p2xc2', title: 'الدالة getSmallest2D', task: 'اكتب الدالة <code>getSmallest2D(m, rows)</code> التي تُرجع أصغر عنصر في مصفوفة ثنائية عدد أعمدتها 3. الدالة main جاهزة.',
      code: F(`// اكتب الدالة getSmallest2D هنا\n`, `int m[2][3];\nfor (int i = 0; i < 2; i++)\n    for (int j = 0; j < 3; j++)\n        cin >> m[i][j];\ncout << getSmallest2D(m, 2);`), tests: [{ input: '4 9 2 7 5 8', output: '2' }, { input: '-1 0 3 6 -7 2', output: '-7' }] },
    { id: 'p2xc3', title: 'الدالة power بقيمة افتراضية', task: 'اكتب الدالة <code>power(b, e)</code> التي تُرجع b مرفوعة للقوة e، وتكون قيمة e الافتراضية 2. الدالة main جاهزة.',
      code: F(`// اكتب الدالة power هنا\n`, `int b, e;\ncin >> b >> e;\ncout << power(b) << " " << power(b, e);`), tests: [{ input: '5 3', output: '25 125' }, { input: '2 0', output: '4 1' }, { input: '3 4', output: '9 81' }] },
  ],
},
{
  course: P2, id: 'exam2', title: 'مراجعة امتحان برمجة 2', tag: 'Exam · C++',
  concept: `<p>أسئلة تتبع ومقالي بأسلوب الامتحان على الدوال والمصفوفات.</p>
    <ul><li>في التتبع: توقّع الناتج أولًا، ثم نفّذ خطوة بخطوة وراقب إطارات الدوال.</li>
    <li>في التحديات: اكتب الدالة المطلوبة، والدالة main جاهزة.</li></ul>`,
  examples: [
    { id: 'p2e1', title: 'تتبع 1: Value و Reference ومتغير عام', code: `#include <iostream>\nusing namespace std;\n\nint c = 0;\n\nint f(int x, int &y) {\n    c++;\n    x = x + y;\n    y = x * 2;\n    return x - y;\n}\n\nint main() {\n    int a = 1, b = 2;\n    int r = f(a, b);\n    cout << a << " " << b << " " << r << endl;\n    r = f(b, a);\n    cout << a << " " << b << " " << r << endl;\n    cout << c;\n    return 0;\n}\n` },
    { id: 'p2e2', title: 'تتبع 2: مصفوفة تُزاح مرتين', code: F(`void shift(int a[], int n) {\n    int first = a[0];\n    for (int i = 0; i < n - 1; i++)\n        a[i] = a[i + 1];\n    a[n - 1] = first;\n}`, `int v[5] = {1, 2, 3, 4, 5};\nshift(v, 5);\nshift(v, 5);\nfor (int i = 0; i < 5; i++)\n    cout << v[i] << " ";`) },
    { id: 'p2e3', title: 'تتبع 3: Overloading وقيمة افتراضية', code: F(`int calc(int a, int b = 3) {\n    return a * b;\n}\n\ndouble calc(double a) {\n    return a / 2;\n}`, `cout << calc(4) << endl;\ncout << calc(4, 1) << endl;\ncout << calc(5.0) << endl;\ncout << calc(calc(2), 2);`) },
    { id: 'p2e4', title: 'تتبع 4: قطر مصفوفة ثنائية', code: F(`int diag(int m[][3], int n) {\n    int s = 0;\n    for (int i = 0; i < n; i++) {\n        s += m[i][i];\n        m[i][i] = 0;\n    }\n    return s;\n}`, `int m[3][3] = {{1, 2, 3},\n               {4, 5, 6},\n               {7, 8, 9}};\ncout << diag(m, 3) << endl;\ncout << diag(m, 3) << " " << m[1][1];`) },
  ],
  challenges: [
    { id: 'p2ec1', title: 'الدالة reverseArray', task: 'اكتب الدالة <code>reverseArray(a, n)</code> التي تعكس ترتيب عناصر المصفوفة في المصفوفة نفسها. الدالة main جاهزة.',
      code: F(`// اكتب الدالة reverseArray هنا\n`, `int a[5];\nfor (int i = 0; i < 5; i++)\n    cin >> a[i];\nreverseArray(a, 5);\nfor (int i = 0; i < 5; i++)\n    cout << a[i] << " ";`), tests: [{ input: '1 2 3 4 5', output: '5 4 3 2 1' }, { input: '9 9 0 1 2', output: '2 1 0 9 9' }] },
    { id: 'p2ec2', title: 'الدالة stats', task: 'اكتب الدالة <code>stats(a, n, mx, mn)</code> التي تُرجع المجموع، وتضع الأكبر في mx والأصغر في mn. الدالة main جاهزة.',
      code: F(`// اكتب الدالة stats هنا\n`, `int a[4], hi, lo;\nfor (int i = 0; i < 4; i++)\n    cin >> a[i];\nint s = stats(a, 4, hi, lo);\ncout << s << " " << hi << " " << lo;`), tests: [{ input: '4 -2 9 1', output: '12 9 -2' }, { input: '5 5 5 5', output: '20 5 5' }] },
    { id: 'p2ec3', title: 'الدالة maxRow', task: 'اكتب الدالة <code>maxRow(m, rows)</code> التي تُرجع رقم الصف صاحب أكبر مجموع في مصفوفة عدد أعمدتها 4. الدالة main جاهزة.',
      code: F(`// اكتب الدالة maxRow هنا\n`, `int m[3][4];\nfor (int i = 0; i < 3; i++)\n    for (int j = 0; j < 4; j++)\n        cin >> m[i][j];\ncout << maxRow(m, 3);`), tests: [{ input: '1 1 1 1 5 5 0 0 2 2 2 2', output: '1' }, { input: '9 9 9 9 0 0 0 0 1 1 1 1', output: '0' }, { input: '0 0 0 0 1 0 0 0 0 0 0 7', output: '2' }] },
  ],
},
);
})();
