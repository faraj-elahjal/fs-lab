/* Programming 2 — question bank (extra self-test and essay questions in the style of the course exams) */
(function () {
const { P, F } = window.FS_Q, add = window.FS_addQuiz;
const H = (inc, fns, body) => '#include <iostream>\n' + inc + 'using namespace std;\n\n' + (fns ? fns.trim() + '\n\n' : '') + 'int main() {\n' + body.replace(/^/gm, '    ').replace(/^\s+$/gm, '') + '\n    return 0;\n}\n';
const CS = (fns, body) => H('#include <cstring>\n', fns, body);
const ST = (fns, body) => H('#include <string>\n', fns, body);

add('fn', [
  { k: 'out', code: F('int X(int x) {\n    return x = x + 10;\n}\n\nvoid y() {\n    int x = 33;\n    cout << X(x) << " " << x;\n}', 'y();') },
  { k: 'mcq', q: 'أين الخطأ في البرنامج التالي؟<pre class="qcode" dir="ltr">void print(int x, int y) {\n    cout &lt;&lt; x;\n    return y;\n}\nint main() {\n    int a, b;\n    cin &gt;&gt; a &gt;&gt; b;\n    cout &lt;&lt; print(x, y) &lt;&lt; endl;\n}</pre>', opts: ['لا يوجد خطأ', 'الدالة void لا تُرجع قيمة، و x و y غير معرّفين داخل main، ولا يمكن طباعة نتيجة دالة void', 'يجب كتابة main قبل print', 'الخطأ فقط في cin'], a: 1, why: 'التصحيح: نجعل الدالة <code>int</code> ونستدعيها بـ <code>print(a, b)</code>.' },
  { k: 'mcq', q: 'أي مما يلي <b>ليس</b> من مزايا استخدام الدوال؟', opts: ['تقليل حجم البرنامج وتكرار الكود', 'سهولة التطوير وتصحيح الأخطاء', 'إعادة استخدامها في برامج أخرى', 'تجعل البرنامج يعمل بدون main'], a: 3, why: 'كل برنامج C++ يبدأ من main دائمًا.' },
  { k: 'out', code: F('int f(int n) {\n    int s = 0;\n    while (n > 0) {\n        s += n % 10;\n        n /= 10;\n    }\n    return s;\n}', 'cout << f(2024) << " " << f(f(99999));') },
], [
  { id: 'bfn1', title: 'قيمة x من a و b و c', task: 'اكتب الدالة <code>double calc(double a, double b, double c)</code> التي تُرجع <code>x = (3 + 4ab) / 2c</code>. الدالة main تقرأ a و b و c وتطبع الناتج.',
    code: F('double calc(double a, double b, double c) {\n    // اكتب الحل هنا\n    return 0;\n}', 'double a, b, c;\ncin >> a >> b >> c;\ncout << calc(a, b, c);'),
    ref: F('double calc(double a, double b, double c) {\n    return (3 + 4 * a * b) / (2 * c);\n}', 'double a, b, c;\ncin >> a >> b >> c;\ncout << calc(a, b, c);'), inputs: ['1 2 1', '0 5 3', '2 2 0.5'] },
  { id: 'bfn2', title: 'العدد وثلاثة زوجية بعده', task: 'اكتب دالة تستقبل عددًا n وتُرجع مجموعه مع أول ثلاثة أعداد زوجية أكبر منه. مثال: 5 ← 5+6+8+10 = 29، و 2 ← 2+4+6+8 = 20.',
    code: F('int sum4(int n) {\n    // اكتب الحل هنا\n    return 0;\n}', 'int n;\ncin >> n;\ncout << sum4(n);'),
    ref: F('int sum4(int n) {\n    int s = n, e = (n % 2 == 0) ? n + 2 : n + 1;\n    for (int k = 0; k < 3; k++) {\n        s += e;\n        e += 2;\n    }\n    return s;\n}', 'int n;\ncin >> n;\ncout << sum4(n);'), inputs: ['5', '2', '0', '11'] },
  { id: 'bfn3', title: 'آلة حاسبة بالدوال', task: 'اقرأ عددين ثم رمز العملية (<code>+ - * /</code>). استخدم switch لاختيار العملية، ونفّذ كل عملية في دالة منفصلة. إذا كانت القسمة على صفر اطبع <code>Error</code>، وإذا كان الرمز غير معروف اطبع <code>Invalid</code>.',
    code: F('// اكتب الدوال هنا', 'double a, b;\nchar op;\ncin >> a >> b >> op;\n// اكتب الحل هنا\n'),
    ref: F('double add(double a, double b) { return a + b; }\ndouble sub(double a, double b) { return a - b; }\ndouble mul(double a, double b) { return a * b; }\ndouble dvd(double a, double b) { return a / b; }', 'double a, b;\nchar op;\ncin >> a >> b >> op;\nswitch (op) {\n    case \'+\': cout << add(a, b); break;\n    case \'-\': cout << sub(a, b); break;\n    case \'*\': cout << mul(a, b); break;\n    case \'/\':\n        if (b == 0)\n            cout << "Error";\n        else\n            cout << dvd(a, b);\n        break;\n    default: cout << "Invalid";\n}'),
    inputs: ['6 3 +', '6 3 -', '2.5 4 *', '7 2 /', '1 0 /', '1 2 %'] },
  { id: 'bfn4', title: 'مساحة المثلث القائم', task: 'اكتب الدالة <code>double tria_area(double base, double h)</code> التي تُرجع مساحة مثلث قائم الزاوية (نصف القاعدة × الارتفاع). الدالة main تقرأ القاعدة والارتفاع وتطبع المساحة.',
    code: F('double tria_area(double base, double h) {\n    // اكتب الحل هنا\n    return 0;\n}', 'double b, h;\ncin >> b >> h;\ncout << tria_area(b, h);'),
    ref: F('double tria_area(double base, double h) {\n    return base * h / 2;\n}', 'double b, h;\ncin >> b >> h;\ncout << tria_area(b, h);'), inputs: ['6 4', '3 5', '10 0.5'] },
]);

add('ref', [
  { k: 'out', code: F('void fun1(int &p1, int &p2) {\n    p1 += p2;\n    p2 += ++p1;\n}', 'int x = 5, y = 10;\ncout << x << " " << y << endl;\n++x;\nfun1(x, y);\ncout << x << " " << y;') },
  { k: 'out', code: F('void f(int a, int &b) {\n    a = a * 2;\n    b = b + a;\n}', 'int x = 3, y = 4;\nf(x, y);\nf(y, x);\ncout << x << " " << y;') },
], [
  { id: 'bref1', title: 'تبديل قيمتين', task: 'اكتب الدالة <code>void swapV(int &amp;a, int &amp;b)</code> التي تبدّل قيمتي متغيرين. الدالة main تقرأ x و y، وتطبعهما قبل التبديل وبعده.',
    code: F('void swapV(int &a, int &b) {\n    // اكتب الحل هنا\n}', 'int x, y;\ncin >> x >> y;\ncout << x << " " << y << endl;\nswapV(x, y);\ncout << x << " " << y;'),
    ref: F('void swapV(int &a, int &b) {\n    int t = a;\n    a = b;\n    b = t;\n}', 'int x, y;\ncin >> x >> y;\ncout << x << " " << y << endl;\nswapV(x, y);\ncout << x << " " << y;'), inputs: ['3 9', '-1 0'] },
]);

add('arr1', [
  { k: 'out', code: P('int s = 0, f = 1, a[5] = {2, 4, 7, 9, 5};\nfor (int i = 0; i < 5; i++)\n    if (a[i] > 0) {\n        for (int j = 1; j <= a[i]; j++)\n            f *= j;\n        s += f;\n        f = 1;\n    }\ncout << s;') },
  { k: 'out', code: P('int s = 0, f = 1, a[3] = {2, 4, 3};\nfor (int i = 0; i < 3; i++)\n    if (a[i] > 0) {\n        for (int j = 1; j <= a[i]; j++)\n            f *= j;\n        s += f;\n        f = 1;\n    }\ncout << s;') },
  { k: 'out', code: P('int a = 1, b = 0, i;\nfor (i = 1; i < 55; i++) {\n    i = a + b;\n    b = a;\n    a = i;\n    cout << " " << i;\n}') },
], [
  { id: 'barr1', title: 'عدد مرات ظهور قيمة', task: 'اقرأ n ثم n عددًا ثم قيمة x، واطبع كم مرة ظهرت x في المصفوفة.',
    code: P('int a[100], n, x;\ncin >> n;\n// اكتب الحل هنا\n'), ref: P('int a[100], n, x, c = 0;\ncin >> n;\nfor (int i = 0; i < n; i++)\n    cin >> a[i];\ncin >> x;\nfor (int i = 0; i < n; i++)\n    if (a[i] == x)\n        c++;\ncout << c;'), inputs: ['6 1 3 1 2 1 5 1', '3 4 4 4 9', '1 7 7'] },
  { id: 'barr2', title: 'دمج مصفوفتين', task: 'اقرأ 3 أعداد في المصفوفة a و 3 أعداد في b، ثم ضع عناصر a متبوعة بعناصر b في مصفوفة c من 6 عناصر واطبعها.',
    code: P('int a[3], b[3], c[6];\n// اكتب الحل هنا\n'), ref: P('int a[3], b[3], c[6];\nfor (int i = 0; i < 3; i++)\n    cin >> a[i];\nfor (int i = 0; i < 3; i++)\n    cin >> b[i];\nfor (int i = 0; i < 3; i++) {\n    c[i] = a[i];\n    c[i + 3] = b[i];\n}\nfor (int i = 0; i < 6; i++)\n    cout << c[i] << " ";'), inputs: ['1 2 3 4 5 6', '9 8 7 0 0 1'] },
  { id: 'barr3', title: 'الوسيط (Median)', task: 'اقرأ n ثم n عددًا حقيقيًا. رتّب المصفوفة تصاعديًا واطبعها، ثم اطبع الوسيط في السطر التالي: العنصر الأوسط إذا كان n فرديًا، أو متوسط العنصرين الأوسطين إذا كان زوجيًا.',
    code: P('double x[50];\nint n;\ncin >> n;\n// اكتب الحل هنا\n'), ref: P('double x[50];\nint n;\ncin >> n;\nfor (int i = 0; i < n; i++)\n    cin >> x[i];\nfor (int i = 0; i < n - 1; i++)\n    for (int j = i + 1; j < n; j++)\n        if (x[i] > x[j]) {\n            double k = x[i];\n            x[i] = x[j];\n            x[j] = k;\n        }\nfor (int i = 0; i < n; i++)\n    cout << x[i] << " ";\ncout << endl;\nif (n % 2 == 0)\n    cout << (x[n / 2 - 1] + x[n / 2]) / 2;\nelse\n    cout << x[n / 2];'), inputs: ['5 7 1 9 3 5', '4 10 2 8 4', '1 3.5'] },
  { id: 'barr4', title: 'طباعة المصفوفة ثم عكسها', task: 'اقرأ n ثم n عددًا، واطبع المصفوفة كما هي في سطر، ثم مقلوبة في السطر التالي.',
    code: P('int a[100], n;\ncin >> n;\n// اكتب الحل هنا\n'), ref: P('int a[100], n;\ncin >> n;\nfor (int i = 0; i < n; i++)\n    cin >> a[i];\nfor (int i = 0; i < n; i++)\n    cout << a[i] << " ";\ncout << endl;\nfor (int i = n - 1; i >= 0; i--)\n    cout << a[i] << " ";'), inputs: ['4 1 2 3 4', '1 9'] },
]);

add('arr2', [
  { k: 'mcq', q: 'ما ناتج البرنامج؟<pre class="qcode" dir="ltr">int m[3][3], i, j;\nfor (i = 0; i &lt; 3; i++)\n  for (j = 0; j &lt; 3; j++)\n    if (i == j) m[i][j] = 0;\n    else m[i][j] = i + j;\n// ثم طباعة m صفًا صفًا</pre>', opts: ['<pre dir="ltr">0 1 2\n1 0 3\n2 3 0</pre>', '<pre dir="ltr">2 1 0\n5 0 3\n0 7 6</pre>', '<pre dir="ltr">0 7 6\n5 0 3\n2 1 0</pre>', 'كل الإجابات السابقة خاطئة'], a: 0, why: 'القطر الرئيسي أصفار، وبقية العناصر i + j.' },
  { k: 'out', code: P('int darray[3][3] = {{0, 1, 2}, {3, 4, 5}, {6, 7, 8}};\nfor (int j = 0; j < 3; j++) {\n    for (int k = 2; k >= 0; k--)\n        cout << darray[j][k] << " ";\n    cout << endl;\n}') },
  { k: 'out', code: P('float A[3][3] = {{1, 1, 1}, {2, 2, 2}, {3, 3, 3}};\nfor (int i = 0; i < 3; i++)\n    A[0][i] = A[1][i] + A[2][i];\nfor (int i = 0; i < 3; i++) {\n    for (int j = 0; j < 3; j++)\n        cout << A[i][j] << " ";\n    cout << endl;\n}') },
  { k: 'out', code: P('int a[3][3] = {{5, 2, 9}, {3, 1, 4}, {8, 6, 7}};\nint b[3] = {0, 0, 0};\nfor (int i = 0; i < 3; i++)\n    b[i] += a[i][i] + a[i][2 - i];\nfor (int i = 0; i < 3; i++)\n    cout << b[i] << " ";') },
], [
  { id: 'bm1', title: 'أصغر عنصر في القطر الرئيسي', task: 'اقرأ مصفوفة 3×3، واطبع أصغر عنصر في القطر الرئيسي، ثم مجموع عناصر القطر في السطر التالي. مثال: القطر 5 و 1 و 7 ← 1 ثم 13.',
    code: P('int A[3][3];\n// اكتب الحل هنا\n'), ref: P('int A[3][3];\nfor (int i = 0; i < 3; i++)\n    for (int j = 0; j < 3; j++)\n        cin >> A[i][j];\nint mn = A[0][0], s = 0;\nfor (int i = 0; i < 3; i++) {\n    if (A[i][i] < mn) mn = A[i][i];\n    s += A[i][i];\n}\ncout << mn << endl << s;'), inputs: ['5 2 9 3 1 4 8 6 7', '1 1 1 1 1 1 1 1 1', '-2 0 0 0 4 0 0 0 -9'] },
  { id: 'bm2', title: 'أكبر قيمة في كل عمود', task: 'اقرأ مصفوفة 3×3، وضع أكبر قيمة في كل عمود في مصفوفة أحادية B، ثم اطبع B. مثال: الأعمدة (10 7 6) و (2 1 0) و (100 3 30) ← <code>10 2 100</code>.',
    code: P('int A[3][3], B[3];\n// اكتب الحل هنا\n'), ref: P('int A[3][3], B[3];\nfor (int i = 0; i < 3; i++)\n    for (int j = 0; j < 3; j++)\n        cin >> A[i][j];\nfor (int j = 0; j < 3; j++) {\n    B[j] = A[0][j];\n    for (int i = 1; i < 3; i++)\n        if (A[i][j] > B[j]) B[j] = A[i][j];\n}\nfor (int j = 0; j < 3; j++)\n    cout << B[j] << " ";'), inputs: ['10 2 100 7 1 3 6 0 30', '1 2 3 4 5 6 7 8 9'] },
  { id: 'bm3', title: 'ترتيب كل صف تصاعديًا', task: 'اقرأ مصفوفة 3×3، ورتّب عناصر كل صف تصاعديًا، ثم اطبع المصفوفة (كل صف في سطر).',
    code: P('int A[3][3];\n// اكتب الحل هنا\n'), ref: P('int A[3][3];\nfor (int i = 0; i < 3; i++)\n    for (int j = 0; j < 3; j++)\n        cin >> A[i][j];\nfor (int r = 0; r < 3; r++)\n    for (int i = 0; i < 2; i++)\n        for (int j = i + 1; j < 3; j++)\n            if (A[r][i] > A[r][j]) {\n                int t = A[r][i];\n                A[r][i] = A[r][j];\n                A[r][j] = t;\n            }\nfor (int i = 0; i < 3; i++) {\n    for (int j = 0; j < 3; j++)\n        cout << A[i][j] << " ";\n    cout << endl;\n}'), inputs: ['3 2 7 8 4 6 5 1 9', '9 8 7 6 5 4 3 2 1'] },
  { id: 'bm4', title: 'المنقول (Transpose)', task: 'اقرأ مصفوفة 2×3 واطبع منقولها (3×2): الصف يصبح عمودًا.',
    code: P('int A[2][3];\n// اكتب الحل هنا\n'), ref: P('int A[2][3];\nfor (int i = 0; i < 2; i++)\n    for (int j = 0; j < 3; j++)\n        cin >> A[i][j];\nfor (int j = 0; j < 3; j++) {\n    for (int i = 0; i < 2; i++)\n        cout << A[i][j] << " ";\n    cout << endl;\n}'), inputs: ['1 2 3 4 5 6', '0 -1 7 8 9 2'] },
  { id: 'bm5', title: 'عمود مجاميع الصفوف', task: 'اقرأ مصفوفة 3×3 في مصفوفة حجمها 3×4، ثم ضع في العمود الأخير مجموع كل صف، واطبع المصفوفة 3×4.',
    code: P('int A[3][4];\n// اكتب الحل هنا\n'), ref: P('int A[3][4];\nfor (int i = 0; i < 3; i++)\n    for (int j = 0; j < 3; j++)\n        cin >> A[i][j];\nfor (int i = 0; i < 3; i++) {\n    A[i][3] = 0;\n    for (int j = 0; j < 3; j++)\n        A[i][3] += A[i][j];\n}\nfor (int i = 0; i < 3; i++) {\n    for (int j = 0; j < 4; j++)\n        cout << A[i][j] << " ";\n    cout << endl;\n}'), inputs: ['1 2 3 4 5 6 7 8 9', '0 0 1 -1 1 0 5 5 5'] },
]);

add('fnarr', [
  { k: 'mcq', q: 'ما ناتج البرنامج؟<pre class="qcode" dir="ltr">void da(int a[2][2], int b[2][2], int c[2][2]) {\n  for (int i = 0; i &lt; 2; i++)\n    for (int j = 0; j &lt; 2; j++)\n      if (a[i][j] &gt; b[i][j]) c[i][j] = a[i][j];\n      else c[i][j] = b[i][j];\n}\n// a = {{2,3},{9,0}}  b = {{1,3},{5,7}}\n// da(a, b, c) ثم طباعة c</pre>', opts: ['<pre dir="ltr">2 3\n7 9</pre>', '<pre dir="ltr">2 3\n9 7</pre>', '<pre dir="ltr">3 2\n9 7</pre>', 'كل الإجابات السابقة خاطئة'], a: 1, why: 'كل عنصر في c هو الأكبر من العنصرين المتقابلين في a و b.' },
  { k: 'out', code: F('void pr(int c[][2]) {\n    for (int i = 0; i < 2; i++) {\n        for (int j = 0; j < 2; j++)\n            cout << c[i][j] << " ";\n        cout << endl;\n    }\n}\n\nvoid da(int a[][2], int b[][2], int c[][2]) {\n    for (int i = 0; i < 2; i++)\n        for (int j = 0; j < 2; j++)\n            c[i][j] = a[i][j] + b[i][j] * 2;\n}', 'int a[2][2] = {{2, 3}, {9, 0}}, b[2][2] = {{1, 3}, {5, 7}}, c[2][2];\nda(a, b, c);\npr(c);') },
], [
  { id: 'bfa1', title: 'مجموع مربعات حاصل الضرب', task: 'اقرأ مصفوفتين a و b كل منهما 3×3. اكتب دالة تحسب <code>sum = Σ (a[i][j] * b[i][j])²</code> على كل العناصر، واطبع الناتج.',
    code: F('int sumSq(int a[][3], int b[][3]) {\n    // اكتب الحل هنا\n    return 0;\n}', 'int a[3][3], b[3][3];\nfor (int i = 0; i < 3; i++)\n    for (int j = 0; j < 3; j++)\n        cin >> a[i][j];\nfor (int i = 0; i < 3; i++)\n    for (int j = 0; j < 3; j++)\n        cin >> b[i][j];\ncout << sumSq(a, b);'),
    ref: F('int sumSq(int a[][3], int b[][3]) {\n    int s = 0;\n    for (int i = 0; i < 3; i++)\n        for (int j = 0; j < 3; j++)\n            s += (a[i][j] * b[i][j]) * (a[i][j] * b[i][j]);\n    return s;\n}', 'int a[3][3], b[3][3];\nfor (int i = 0; i < 3; i++)\n    for (int j = 0; j < 3; j++)\n        cin >> a[i][j];\nfor (int i = 0; i < 3; i++)\n    for (int j = 0; j < 3; j++)\n        cin >> b[i][j];\ncout << sumSq(a, b);'),
    inputs: ['1 1 1 1 1 1 1 1 1 1 2 3 1 2 3 1 2 3', '1 0 0 0 1 0 0 0 1 2 2 2 2 2 2 2 2 2'] },
  { id: 'bfa2', title: 'الدالتان array_max و array_median', task: 'اكتب الدالة <code>array_max</code> التي تُرجع أكبر عنصر في مصفوفة من 11 عنصرًا، والدالة <code>array_median</code> التي ترتّب المصفوفة تصاعديًا وتُرجع العنصر ذا الدليل 5. الدالة main تقرأ 11 عددًا وتطبع النتيجتين بينهما مسافة.',
    code: F('int array_max(int a[]) {\n    // اكتب الحل هنا\n    return 0;\n}\n\nint array_median(int a[]) {\n    // اكتب الحل هنا\n    return 0;\n}', 'int a[11];\nfor (int i = 0; i < 11; i++)\n    cin >> a[i];\ncout << array_max(a) << " " << array_median(a);'),
    ref: F('int array_max(int a[]) {\n    int m = a[0];\n    for (int i = 1; i < 11; i++)\n        if (a[i] > m) m = a[i];\n    return m;\n}\n\nint array_median(int a[]) {\n    for (int i = 0; i < 10; i++)\n        for (int j = i + 1; j < 11; j++)\n            if (a[i] > a[j]) {\n                int t = a[i];\n                a[i] = a[j];\n                a[j] = t;\n            }\n    return a[5];\n}', 'int a[11];\nfor (int i = 0; i < 11; i++)\n    cin >> a[i];\ncout << array_max(a) << " " << array_median(a);'),
    inputs: ['5 3 9 1 7 2 8 6 4 0 10', '1 1 1 1 1 9 9 9 9 9 9'] },
  { id: 'bfa3', title: 'ترتيب صف معيّن', task: 'اكتب الدالة <code>void sortRow(int a[][4], int r)</code> التي ترتّب الصف r فقط تصاعديًا. الدالة main تقرأ مصفوفة 3×4 ثم رقم الصف، وتطبع المصفوفة بعد الترتيب.',
    code: F('void sortRow(int a[][4], int r) {\n    // اكتب الحل هنا\n}', 'int a[3][4], r;\nfor (int i = 0; i < 3; i++)\n    for (int j = 0; j < 4; j++)\n        cin >> a[i][j];\ncin >> r;\nsortRow(a, r);\nfor (int i = 0; i < 3; i++) {\n    for (int j = 0; j < 4; j++)\n        cout << a[i][j] << " ";\n    cout << endl;\n}'),
    ref: F('void sortRow(int a[][4], int r) {\n    for (int i = 0; i < 3; i++)\n        for (int j = i + 1; j < 4; j++)\n            if (a[r][i] > a[r][j]) {\n                int t = a[r][i];\n                a[r][i] = a[r][j];\n                a[r][j] = t;\n            }\n}', 'int a[3][4], r;\nfor (int i = 0; i < 3; i++)\n    for (int j = 0; j < 4; j++)\n        cin >> a[i][j];\ncin >> r;\nsortRow(a, r);\nfor (int i = 0; i < 3; i++) {\n    for (int j = 0; j < 4; j++)\n        cout << a[i][j] << " ";\n    cout << endl;\n}'),
    inputs: ['4 3 2 1 8 7 6 5 1 9 0 2 1', '4 3 2 1 8 7 6 5 1 9 0 2 2'] },
]);

add('exam2', [
  { k: 'out', code: P('int a[3][3] = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};\nint s = 0;\nfor (int i = 0; i < 3; i++)\n    for (int j = 0; j < 3; j++)\n        if (i > j)\n            s += a[i][j];\ncout << s;') },
], [
  { id: 'bx1', title: 'مجموع مضاريب عناصر المصفوفة', task: 'اكتب الدالة <code>int fact(int n)</code>، ثم استخدمها لحساب <code>x = a[0]! + a[1]! + ...</code> لمصفوفة من 5 عناصر تقرؤها main. اطبع x.',
    code: F('int fact(int n) {\n    // اكتب الحل هنا\n    return 1;\n}', 'int a[5];\nfor (int i = 0; i < 5; i++)\n    cin >> a[i];\n// اكتب الحل هنا\n'),
    ref: F('int fact(int n) {\n    int f = 1;\n    for (int i = 2; i <= n; i++)\n        f *= i;\n    return f;\n}', 'int a[5], x = 0;\nfor (int i = 0; i < 5; i++)\n    cin >> a[i];\nfor (int i = 0; i < 5; i++)\n    x += fact(a[i]);\ncout << x;'), inputs: ['2 4 7 9 6', '1 1 1 1 1', '0 3 3 2 5'] },
  { id: 'bx2', title: 'العدد ومضروبه', task: 'اقرأ 5 أعداد صحيحة، واطبع لكل عدد سطرًا بالشكل <code>5! = 120</code> باستخدام دالة لحساب المضروب.',
    code: F('int fact(int n) {\n    // اكتب الحل هنا\n    return 1;\n}', '// اكتب الحل هنا\n'),
    ref: F('int fact(int n) {\n    int f = 1;\n    for (int i = 2; i <= n; i++)\n        f *= i;\n    return f;\n}', 'int x;\nfor (int i = 0; i < 5; i++) {\n    cin >> x;\n    cout << x << "! = " << fact(x) << endl;\n}'), inputs: ['3 5 0 1 6', '2 2 2 2 2'] },
]);

add('str', [
  { k: 'out', code: CS('', 'char s[21] = "Information technolo";\ns[4] = \'\\0\';\ncout << s << endl;\ns[4] = \'o\';\ncout << s;') },
  { k: 'out', code: CS('', 'char a[100] = "Ahmad Ali";\nint L = strlen(a);\na[7] = \'M\';\ncout << a << L;') },
  { k: 'mcq', q: 'ما ناتج <code>cout &lt;&lt; strcmp("c++", "ali");</code> في الشائع؟', opts: ['0 لأنهما متساويان في الطول', 'عدد موجب لأن c تأتي بعد a في الترتيب', 'عدد سالب', 'خطأ في الترجمة'], a: 1, why: 'strcmp تقارن حرفًا حرفًا: الحرف c أكبر من a، فالناتج موجب (يطبع 1 في كثير من المترجمات).' },
], [
  { id: 'bs1', title: 'دمج نصين وطوله', task: 'اقرأ كلمتين، وادمجهما في نص ثالث، واطبعه ثم اطبع طوله في السطر التالي.',
    code: ST('', 'string s1, s2;\ncin >> s1 >> s2;\n// اكتب الحل هنا\n'), ref: ST('', 'string s1, s2;\ncin >> s1 >> s2;\nstring s3 = s1 + s2;\ncout << s3 << endl << s3.length();'), inputs: ['FS Lab', 'hello world', 'a b'] },
  { id: 'bs2', title: 'البحث عن حرف واستبداله', task: 'اقرأ اسمًا ثم حرفًا للبحث ثم حرفًا جديدًا. إذا وُجد الحرف اطبع موقعه (أول ظهور، الدليل يبدأ من 0) واستبدله بالحرف الجديد ثم اطبع الاسم بعد التعديل في السطر التالي. إذا لم يوجد اطبع <code>Not found</code>.',
    code: ST('', 'string name;\nchar c, r;\ncin >> name >> c >> r;\n// اكتب الحل هنا\n'), ref: ST('', 'string name;\nchar c, r;\ncin >> name >> c >> r;\nint pos = -1;\nfor (int i = 0; i < name.length(); i++)\n    if (name[i] == c) {\n        pos = i;\n        break;\n    }\nif (pos == -1)\n    cout << "Not found";\nelse {\n    name[pos] = r;\n    cout << pos << endl << name;\n}'), inputs: ['Farag a o', 'Ali z x', 'Mona M N'] },
]);

add('ptr', [
  { k: 'out', code: F('void g(int *x, int *y) {\n    *x = *y + 1;\n    *y = *y + 2;\n    cout << *x << endl << *y << endl;\n}\n\nvoid f(int *p, int *q) {\n    int n = 17;\n    g(q, &n);\n    cout << *p << endl << *q << endl;\n}', 'int i = 42;\nint j = 10;\nint n = 374;\nf(&i, &j);\ncout << i << endl << j << endl << n << endl;\ng(&n, &n);\ncout << i << endl << j << endl << n << endl;') },
  { k: 'out', code: P('int c = 100;\nint *a;\nint x = 50;\na = &x;\ncout << "x=" << x << " *a=" << *a << endl;\na = &c;\ncout << "x=" << x << " *a=" << *a << " c=" << c;') },
  { k: 'out', code: F('void fun1(int *p1, int *p2) {\n    *p1 += *p2;\n    *p2 += (++(*p1));\n}', 'int x = 5, y = 10;\ncout << x << endl << y << endl;\n++x;\nfun1(&x, &y);\ncout << x << endl << y;') },
  { k: 'out', code: F('void array_fun(int *p, int *a, int *b, int *c, int *d) {\n    for (int i = 0; i < 9; i++) {\n        if (*(p + i) > 0) {\n            *a += *(p + i);\n            *b += 1;\n        } else {\n            *c += *(p + i);\n            *d += 1;\n        }\n    }\n}', 'int a[9] = {11, -9, -5, 7, 6, 3, -1, 2, 4};\nint x = 0, y = 0, z = 0, w = 0;\narray_fun(&a[0], &x, &y, &z, &w);\ncout << x << endl << y << endl << z << endl << w;') },
], [
  { id: 'bp1', title: 'جمع مصفوفتين بالمؤشرات', task: 'اكتب الدالة <code>void addArr(int *a, int *b, int *c, int n)</code> التي تجمع a و b عنصرًا بعنصر في c باستخدام المؤشرات (<code>*(a + i)</code>). الدالة main تقرأ 5 عناصر لكل مصفوفة وتطبع c.',
    code: F('void addArr(int *a, int *b, int *c, int n) {\n    // اكتب الحل هنا\n}', 'int a[5], b[5], c[5];\nfor (int i = 0; i < 5; i++)\n    cin >> a[i];\nfor (int i = 0; i < 5; i++)\n    cin >> b[i];\naddArr(a, b, c, 5);\nfor (int i = 0; i < 5; i++)\n    cout << c[i] << " ";'),
    ref: F('void addArr(int *a, int *b, int *c, int n) {\n    for (int i = 0; i < n; i++)\n        *(c + i) = *(a + i) + *(b + i);\n}', 'int a[5], b[5], c[5];\nfor (int i = 0; i < 5; i++)\n    cin >> a[i];\nfor (int i = 0; i < 5; i++)\n    cin >> b[i];\naddArr(a, b, c, 5);\nfor (int i = 0; i < 5; i++)\n    cout << c[i] << " ";'),
    inputs: ['1 2 3 4 5 10 20 30 40 50', '0 0 0 0 1 -1 -1 -1 -1 -1'] },
  { id: 'bp2', title: 'تبديل بالمؤشرات', task: 'اكتب الدالة <code>void swapP(int *a, int *b)</code> التي تبدّل قيمتي متغيرين باستخدام المؤشرات. الدالة main تقرأ x و y وتطبعهما بعد التبديل.',
    code: F('void swapP(int *a, int *b) {\n    // اكتب الحل هنا\n}', 'int x, y;\ncin >> x >> y;\nswapP(&x, &y);\ncout << x << " " << y;'),
    ref: F('void swapP(int *a, int *b) {\n    int t = *a;\n    *a = *b;\n    *b = t;\n}', 'int x, y;\ncin >> x >> y;\nswapP(&x, &y);\ncout << x << " " << y;'), inputs: ['4 7', '0 -3'] },
  { id: 'bp3', title: 'مصفوفة ثنائية إلى أحادية', task: 'اقرأ مصفوفة 2×3، وانسخ عناصرها صفًا بعد صف إلى مصفوفة أحادية من 6 عناصر باستخدام مؤشر يتحرك على الأحادية (<code>*p = ...; p++;</code>). اطبع الأحادية ثم مجموع عناصرها في السطر التالي.',
    code: P('int A[2][3], B[6];\nint *p = B;\n// اكتب الحل هنا\n'), ref: P('int A[2][3], B[6];\nint *p = B;\nfor (int i = 0; i < 2; i++)\n    for (int j = 0; j < 3; j++)\n        cin >> A[i][j];\nfor (int i = 0; i < 2; i++)\n    for (int j = 0; j < 3; j++) {\n        *p = A[i][j];\n        p++;\n    }\nint s = 0;\nfor (int k = 0; k < 6; k++) {\n    cout << B[k] << " ";\n    s += B[k];\n}\ncout << endl << s;'), inputs: ['6 0 9 3 8 4', '1 2 3 4 5 6'] },
]);

add('dyn', [
  { k: 'out', code: P('int n = 4;\nint *a = new int[n];\nfor (int i = 0; i < n; i++)\n    a[i] = (i + 1) * (i + 1);\nint *p = a;\nfor (int i = n - 1; i >= 0; i--)\n    cout << *(p + i) << " ";\ndelete[] a;') },
], [
  { id: 'bd1', title: 'عدّ قيمة في مصفوفة ديناميكية', task: 'اقرأ n، وأنشئ مصفوفة ديناميكية بـ <code>new int[n]</code>، واقرأ عناصرها ثم قيمة op، واطبع عدد مرات ظهور op. لا تنسَ <code>delete[]</code>.',
    code: P('int n;\ncin >> n;\n// اكتب الحل هنا\n'), ref: P('int n, op, c = 0;\ncin >> n;\nint *a = new int[n];\nfor (int i = 0; i < n; i++)\n    cin >> a[i];\ncin >> op;\nfor (int i = 0; i < n; i++)\n    if (a[i] == op)\n        c++;\ncout << c;\ndelete[] a;'), inputs: ['5 2 7 2 2 9 2', '3 1 2 3 4'] },
  { id: 'bd2', title: 'الفردية والزوجية في مصفوفتين', task: 'اقرأ n ثم n عددًا في مصفوفة ديناميكية. انقل الأعداد الزوجية إلى مصفوفة ديناميكية ثانية والفردية إلى ثالثة، ثم اطبع الزوجية في سطر والفردية في السطر التالي.',
    code: P('int n;\ncin >> n;\n// اكتب الحل هنا\n'), ref: P('int n, ne = 0, no = 0;\ncin >> n;\nint *a = new int[n];\nint *ev = new int[n];\nint *od = new int[n];\nfor (int i = 0; i < n; i++) {\n    cin >> a[i];\n    if (a[i] % 2 == 0)\n        ev[ne++] = a[i];\n    else\n        od[no++] = a[i];\n}\nfor (int i = 0; i < ne; i++)\n    cout << ev[i] << " ";\ncout << endl;\nfor (int i = 0; i < no; i++)\n    cout << od[i] << " ";\ndelete[] a;\ndelete[] ev;\ndelete[] od;'), inputs: ['6 1 2 3 4 5 6', '3 7 9 8'] },
]);

add('struct', [
  { k: 'out', code: F('struct Date {\n    int d, m, y;\n};\n\nint later(Date *a, Date *b) {\n    if (a->y != b->y) return a->y > b->y ? 1 : 2;\n    if (a->m != b->m) return a->m > b->m ? 1 : 2;\n    return a->d >= b->d ? 1 : 2;\n}', 'Date x = {15, 3, 2024}, y = {2, 11, 2023};\ncout << later(&x, &y) << endl;\ny.y = 2024;\ncout << later(&x, &y);') },
], [
  { id: 'bst1', title: 'ترتيب الطلاب حسب الدرجة', task: 'سجل الطالب <code>Student</code> فيه: رقم <code>no</code> واسم <code>name</code> (كلمة واحدة) ودرجة <code>degree</code>. اقرأ n ثم بيانات n طالبًا، ورتّبهم تصاعديًا حسب الدرجة واطبع كل طالب في سطر <code>no name degree</code>، ثم اطبع اسم صاحب أعلى درجة، ثم متوسط الدرجات.',
    code: ST('struct Student {\n    int no;\n    string name;\n    double degree;\n};', 'Student s[50];\nint n;\ncin >> n;\n// اكتب الحل هنا\n'),
    ref: ST('struct Student {\n    int no;\n    string name;\n    double degree;\n};', 'Student s[50];\nint n;\ncin >> n;\ndouble sum = 0;\nfor (int i = 0; i < n; i++) {\n    cin >> s[i].no >> s[i].name >> s[i].degree;\n    sum += s[i].degree;\n}\nfor (int i = 0; i < n - 1; i++)\n    for (int j = i + 1; j < n; j++)\n        if (s[i].degree > s[j].degree) {\n            Student t = s[i];\n            s[i] = s[j];\n            s[j] = t;\n        }\nfor (int i = 0; i < n; i++)\n    cout << s[i].no << " " << s[i].name << " " << s[i].degree << endl;\ncout << s[n - 1].name << endl;\ncout << sum / n;'),
    inputs: ['3 1 Ali 70 2 Sara 95 3 Omar 60', '1 7 Mona 88'] },
  { id: 'bst2', title: 'التاريخ الأحدث', task: 'سجل التاريخ <code>Date</code> فيه يوم وشهر وسنة. اكتب دالة تستقبل مؤشرين إلى سجلين وتُرجع مؤشرًا إلى التاريخ الأحدث. الدالة main تقرأ تاريخين وتطبع الأحدث بالشكل <code>d/m/y</code>.',
    code: F('struct Date {\n    int d, m, y;\n};\n\nDate* newer(Date *a, Date *b) {\n    // اكتب الحل هنا\n    return a;\n}', 'Date a, b;\ncin >> a.d >> a.m >> a.y >> b.d >> b.m >> b.y;\nDate *r = newer(&a, &b);\ncout << r->d << "/" << r->m << "/" << r->y;'),
    ref: F('struct Date {\n    int d, m, y;\n};\n\nDate* newer(Date *a, Date *b) {\n    if (a->y != b->y) return a->y > b->y ? a : b;\n    if (a->m != b->m) return a->m > b->m ? a : b;\n    return a->d >= b->d ? a : b;\n}', 'Date a, b;\ncin >> a.d >> a.m >> a.y >> b.d >> b.m >> b.y;\nDate *r = newer(&a, &b);\ncout << r->d << "/" << r->m << "/" << r->y;'),
    inputs: ['1 1 2024 31 12 2023', '5 6 2020 6 6 2020', '9 9 1999 9 10 1999'] },
]);
})();
