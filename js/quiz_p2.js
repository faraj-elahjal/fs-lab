/* Programming 2 — self-test questions and extra essay questions */
(function () {
const { F, P, S } = window.FS_Q, add = window.FS_addQuiz;

add('fn', [
  { k: 'mcq', q: 'ماذا تعني <code>void</code> في <code>void show(int x)</code>؟', opts: ['أن الدالة لا تستقبل معاملات', 'أن الدالة لا تُرجع قيمة', 'أن الدالة فارغة', 'أن x لا تتغير'], a: 1 },
  { k: 'mcq', q: 'أي سطر هو <b>نموذج (prototype)</b> صحيح لدالة تجمع عددين صحيحين؟', opts: ['<code>int sum(int a, int b);</code>', '<code>int sum(int a, b);</code>', '<code>sum(int a, int b) int;</code>', '<code>int sum[int a, int b];</code>'], a: 0, why: 'كل معامل يحتاج نوعه، والنموذج ينتهي بـ <code>;</code>.' },
  { k: 'mcq', q: 'متى نحتاج إلى النموذج (prototype) قبل main؟', opts: ['دائمًا', 'عندما نكتب تعريف الدالة بعد main ونستدعيها داخل main', 'عندما تكون الدالة void فقط', 'لا نحتاجه أبدًا'], a: 1 },
  { k: 'mcq', q: 'ماذا يحدث للأسطر التي بعد <code>return</code> داخل الدالة؟', opts: ['تُنفَّذ بعد الرجوع', 'لا تُنفَّذ، لأن return تُنهي الدالة فورًا', 'تُنفَّذ مرتين', 'خطأ في الترجمة'], a: 1 },
  { k: 'mcq', q: 'في <code>int r = sq(4);</code> ما اسم القيمة 4؟', opts: ['معامل شكلي (parameter)', 'وسيط فعلي (argument)', 'قيمة مرجعة', 'متغير عام'], a: 1, why: 'القيمة الممرَّرة عند الاستدعاء وسيط فعلي، والمتغير في تعريف الدالة معامل شكلي.' },
  { k: 'mcq', q: 'دالة <code>int f()</code> انتهت دون تنفيذ أي <code>return</code>. ما المشكلة؟', opts: ['لا مشكلة', 'القيمة المرجعة غير محددة (خطأ منطقي)', 'تُرجع 0 دائمًا', 'لا يمكن استدعاؤها'], a: 1 },
  { k: 'out', code: F('int sq(int x) {\n    return x * x;\n}', 'cout << sq(3) + sq(4);') },
  { k: 'out', code: F('void line(int n, char c) {\n    for (int i = 0; i < n; i++)\n        cout << c;\n    cout << endl;\n}', 'line(3, \'*\');\nline(5, \'-\');') },
  { k: 'out', code: F('int maxOf(int a, int b) {\n    if (a > b) return a;\n    return b;\n}', 'cout << maxOf(maxOf(3, 9), 5);') },
  { k: 'out', code: F('bool isEven(int n) {\n    return n % 2 == 0;\n}', 'int c = 0;\nfor (int i = 1; i <= 9; i++)\n    if (isEven(i)) c++;\ncout << c;') },
], [
  { id: 'qfn1', title: 'دالة الأس', task: 'اكتب الدالة <code>int power(int b, int e)</code> التي تُرجع b مرفوعًا للأس e (e ≥ 0) دون استخدام pow. البرنامج الرئيسي جاهز.',
    code: F('int power(int b, int e) {\n    // اكتب الحل هنا\n    return 0;\n}', 'int b, e;\ncin >> b >> e;\ncout << power(b, e);'),
    ref: F('int power(int b, int e) {\n    int r = 1;\n    for (int i = 0; i < e; i++)\n        r *= b;\n    return r;\n}', 'int b, e;\ncin >> b >> e;\ncout << power(b, e);'), inputs: ['2 10', '5 0', '3 4'] },
  { id: 'qfn2', title: 'دالة العدد الأولي', task: 'اكتب الدالة <code>bool isPrime(int n)</code>، ثم في main اقرأ a و b واطبع كل الأعداد الأولية بينهما (شاملة) بينها مسافة.',
    code: F('bool isPrime(int n) {\n    // اكتب الحل هنا\n    return false;\n}', 'int a, b;\ncin >> a >> b;\n// اكتب الحل هنا\n'),
    ref: F('bool isPrime(int n) {\n    if (n < 2) return false;\n    for (int d = 2; d * d <= n; d++)\n        if (n % d == 0) return false;\n    return true;\n}', 'int a, b;\ncin >> a >> b;\nfor (int i = a; i <= b; i++)\n    if (isPrime(i)) cout << i << " ";'), inputs: ['1 20', '20 40', '90 100'] },
  { id: 'qfn3', title: 'دالة القاسم المشترك الأكبر', task: 'اكتب الدالة <code>int gcd(int a, int b)</code> بخوارزمية إقليدس (ما دامت b لا تساوي 0: نضع في a قيمة b، وفي b قيمة a % b)، ثم اطبع gcd لعددين مُدخلين.',
    code: F('int gcd(int a, int b) {\n    // اكتب الحل هنا\n    return 0;\n}', 'int a, b;\ncin >> a >> b;\ncout << gcd(a, b);'),
    ref: F('int gcd(int a, int b) {\n    while (b != 0) {\n        int t = a % b;\n        a = b;\n        b = t;\n    }\n    return a;\n}', 'int a, b;\ncin >> a >> b;\ncout << gcd(a, b);'), inputs: ['12 18', '17 5', '100 75'] },
]);

add('ref', [
  { k: 'mcq', q: 'ما الفرق بين <code>void f(int x)</code> و <code>void f(int &amp;x)</code>؟', opts: ['لا فرق', 'الأولى تنسخ القيمة، والثانية تعمل على المتغير الأصلي نفسه', 'الثانية أبطأ دائمًا', 'الأولى تغيّر المتغير الأصلي'], a: 1 },
  { k: 'mcq', q: 'أي دالة تبدّل قيمتي متغيرين في main فعلًا؟', opts: ['<code>void swap(int a, int b)</code>', '<code>void swap(int &amp;a, int &amp;b)</code>', '<code>int swap(int a, int b)</code>', 'لا يمكن ذلك بدالة'], a: 1 },
  { k: 'mcq', q: 'هل يمكن استدعاء <code>void inc(int &amp;x)</code> بالشكل <code>inc(5);</code>؟', opts: ['نعم', 'لا، لأن المرجع يحتاج متغيرًا وليس قيمة ثابتة', 'نعم وتصبح 5 تساوي 6', 'نعم لكن لا يحدث شيء'], a: 1 },
  { k: 'mcq', q: 'المتغير المعرَّف داخل دالة (محلي)، متى ينتهي؟', opts: ['عند انتهاء البرنامج', 'عند انتهاء تنفيذ الدالة', 'لا ينتهي أبدًا', 'عند استدعاء دالة أخرى'], a: 1 },
  { k: 'mcq', q: 'كيف تُرجع دالة أكثر من نتيجة (مثل المجموع والمتوسط)؟', opts: ['بكتابة return مرتين', 'باستخدام معاملات بالمرجع <code>&amp;</code>', 'لا يمكن', 'بجعل الدالة void فقط'], a: 1 },
  { k: 'mcq', q: 'متغير عام (global) اسمه x، ومتغير محلي داخل الدالة اسمه x أيضًا. أيهما يُستخدم داخل الدالة؟', opts: ['العام', 'المحلي', 'كلاهما', 'خطأ في الترجمة'], a: 1, why: 'المتغير المحلي يحجب العام داخل نطاقه.' },
  { k: 'out', code: F('void f(int a, int &b) {\n    a = a + 10;\n    b = b + 10;\n}', 'int x = 1, y = 2;\nf(x, y);\ncout << x << " " << y;') },
  { k: 'out', code: F('int g = 5;\n\nvoid change() {\n    int g = 100;\n    g++;\n}\n\nvoid change2() {\n    g++;\n}', 'change();\nchange2();\ncout << g;') },
  { k: 'out', code: F('void calc(int a, int b, int &s, int &p) {\n    s = a + b;\n    p = a * b;\n}', 'int s, p;\ncalc(3, 5, s, p);\ncout << s << " " << p;') },
], [
  { id: 'qr1', title: 'ترتيب عددين بالمرجع', task: 'اكتب الدالة <code>void sort2(int &amp;a, int &amp;b)</code> التي تجعل a الأصغر و b الأكبر. البرنامج الرئيسي جاهز.',
    code: F('void sort2(int &a, int &b) {\n    // اكتب الحل هنا\n}', 'int x, y;\ncin >> x >> y;\nsort2(x, y);\ncout << x << " " << y;'),
    ref: F('void sort2(int &a, int &b) {\n    if (a > b) {\n        int t = a;\n        a = b;\n        b = t;\n    }\n}', 'int x, y;\ncin >> x >> y;\nsort2(x, y);\ncout << x << " " << y;'), inputs: ['9 4', '2 7', '5 5'] },
  { id: 'qr2', title: 'القسمة والباقي معًا', task: 'اكتب الدالة <code>void divide(int a, int b, int &amp;q, int &amp;r)</code> التي تضع ناتج القسمة الصحيحة في q والباقي في r. البرنامج الرئيسي جاهز.',
    code: F('void divide(int a, int b, int &q, int &r) {\n    // اكتب الحل هنا\n}', 'int a, b, q, r;\ncin >> a >> b;\ndivide(a, b, q, r);\ncout << q << " " << r;'),
    ref: F('void divide(int a, int b, int &q, int &r) {\n    q = a / b;\n    r = a % b;\n}', 'int a, b, q, r;\ncin >> a >> b;\ndivide(a, b, q, r);\ncout << q << " " << r;'), inputs: ['17 5', '20 4', '3 7'] },
]);

add('arr1', [
  { k: 'mcq', q: 'في <code>int a[5];</code> ما مدى الفهارس الصحيحة؟', opts: ['من 1 إلى 5', 'من 0 إلى 4', 'من 0 إلى 5', 'من 1 إلى 4'], a: 1 },
  { k: 'mcq', q: 'ما قيمة <code>a[3]</code> بعد <code>int a[5] = {4, 8};</code>؟', opts: ['قيمة عشوائية', '0', '8', 'خطأ'], a: 1, why: 'عند وجود قائمة تهيئة، العناصر الباقية تصبح 0.' },
  { k: 'mcq', q: 'ما مشكلة <code>for (int i = 0; i &lt;= 5; i++) a[i] = 0;</code> مع <code>int a[5]</code>؟', opts: ['لا مشكلة', 'تصل إلى a[5] وهو خارج حدود المصفوفة', 'لا تصل إلى a[4]', 'تبدأ من 1'], a: 1 },
  { k: 'mcq', q: 'أي حلقة تطبع المصفوفة <code>int a[n]</code> بالعكس؟', opts: ['<code>for (int i = n; i &gt;= 0; i--)</code>', '<code>for (int i = n - 1; i &gt;= 0; i--)</code>', '<code>for (int i = 0; i &lt; n; i--)</code>', '<code>for (int i = n - 1; i &gt; 0; i--)</code>'], a: 1, why: 'آخر فهرس n − 1 وأول فهرس 0. الخيار الأخير لا يطبع a[0].' },
  { k: 'mcq', q: 'هل يجوز <code>int a[3] = {1, 2, 3, 4};</code>؟', opts: ['نعم ويُهمل الرابع', 'لا: عدد القيم أكبر من حجم المصفوفة', 'نعم وتكبر المصفوفة', 'نعم ويصبح a[0] = 4'], a: 1 },
  { k: 'mcq', q: 'لإيجاد أكبر عنصر في مصفوفة، بأي قيمة نبدأ max؟', opts: ['0', 'أول عنصر a[0]', '100', '-1'], a: 1, why: 'البدء بـ 0 يفشل إذا كانت كل العناصر سالبة.' },
  { k: 'out', code: P('int a[5] = {3, 1, 4, 1, 5};\nint s = 0;\nfor (int i = 0; i < 5; i++)\n    if (a[i] > 2) s += a[i];\ncout << s;') },
  { k: 'out', code: P('int a[6];\nfor (int i = 0; i < 6; i++)\n    a[i] = i * 2;\nfor (int i = 5; i >= 0; i -= 2)\n    cout << a[i] << " ";') },
  { k: 'out', code: P('int a[5] = {7, 2, 9, 4, 6};\nint m = 0;\nfor (int i = 1; i < 5; i++)\n    if (a[i] < a[m]) m = i;\ncout << m << " " << a[m];') },
], [
  { id: 'qar1', title: 'عدّ الأعداد فوق المتوسط', task: 'اقرأ n (حتى 50) ثم n عددًا في مصفوفة. احسب المتوسط، واطبع عدد العناصر الأكبر من المتوسط.',
    code: P('int a[50], n;\ncin >> n;\n// اكتب الحل هنا\n'), ref: P('int a[50], n;\ncin >> n;\ndouble s = 0;\nfor (int i = 0; i < n; i++) {\n    cin >> a[i];\n    s += a[i];\n}\ndouble avg = s / n;\nint c = 0;\nfor (int i = 0; i < n; i++)\n    if (a[i] > avg) c++;\ncout << c;'), inputs: ['5 1 2 3 4 5', '4 10 10 10 10', '6 9 1 8 2 7 3'] },
  { id: 'qar2', title: 'عكس المصفوفة في مكانها', task: 'اقرأ n ثم n عددًا، واعكس المصفوفة نفسها (بتبديل a[i] مع a[n-1-i]) ثم اطبعها بينها مسافة.',
    code: P('int a[50], n;\ncin >> n;\nfor (int i = 0; i < n; i++)\n    cin >> a[i];\n// اكتب الحل هنا\n'), ref: P('int a[50], n;\ncin >> n;\nfor (int i = 0; i < n; i++)\n    cin >> a[i];\nfor (int i = 0; i < n / 2; i++) {\n    int t = a[i];\n    a[i] = a[n - 1 - i];\n    a[n - 1 - i] = t;\n}\nfor (int i = 0; i < n; i++)\n    cout << a[i] << " ";'), inputs: ['5 1 2 3 4 5', '4 8 6 4 2', '1 7'] },
  { id: 'qar3', title: 'البحث عن عنصر', task: 'اقرأ n ثم n عددًا ثم عددًا x. اطبع فهرس أول ظهور لـ x، أو <code>-1</code> إذا لم يوجد.',
    code: P('int a[50], n, x;\ncin >> n;\nfor (int i = 0; i < n; i++)\n    cin >> a[i];\ncin >> x;\n// اكتب الحل هنا\n'), ref: P('int a[50], n, x;\ncin >> n;\nfor (int i = 0; i < n; i++)\n    cin >> a[i];\ncin >> x;\nint pos = -1;\nfor (int i = 0; i < n; i++)\n    if (a[i] == x) {\n        pos = i;\n        break;\n    }\ncout << pos;'), inputs: ['5 4 7 1 7 2 7', '3 1 2 3 9', '4 5 5 5 5 5'] },
]);

add('arr2', [
  { k: 'mcq', q: 'كم عنصرًا في <code>int m[3][4];</code>؟', opts: ['7', '12', '3', '4'], a: 1 },
  { k: 'mcq', q: 'في <code>m[i][j]</code> ماذا يمثّل i؟', opts: ['رقم العمود', 'رقم الصف', 'عدد العناصر', 'القيمة'], a: 1 },
  { k: 'mcq', q: 'أي شرط يحدد عناصر <b>القطر الرئيسي</b> في مصفوفة مربعة؟', opts: ['<code>i == j</code>', '<code>i + j == n - 1</code>', '<code>i &lt; j</code>', '<code>i &gt; j</code>'], a: 0, why: 'القطر الثانوي شرطه <code>i + j == n - 1</code>.' },
  { k: 'mcq', q: 'لحساب مجموع كل <b>صف</b> على حدة، أين نضع <code>sum = 0</code>؟', opts: ['قبل الحلقتين', 'داخل الحلقة الخارجية قبل الحلقة الداخلية', 'داخل الحلقة الداخلية', 'بعد الحلقتين'], a: 1 },
  { k: 'mcq', q: 'عند تمرير مصفوفة ثنائية لدالة، أي بُعد يجب كتابته؟', opts: ['الأول', 'الثاني (عدد الأعمدة)', 'لا شيء', 'الاثنان معًا دائمًا'], a: 1, why: 'مثل <code>void f(int m[][4], int rows)</code>.' },
  { k: 'mcq', q: 'العناصر <b>فوق</b> القطر الرئيسي يحققها الشرط:', opts: ['<code>i &gt; j</code>', '<code>i &lt; j</code>', '<code>i == j</code>', '<code>i + j &gt; n</code>'], a: 1 },
  { k: 'out', code: P('int m[2][3] = {{1, 2, 3}, {4, 5, 6}};\nfor (int j = 0; j < 3; j++)\n    cout << m[0][j] + m[1][j] << " ";') },
  { k: 'out', code: P('int m[3][3] = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};\nint d = 0, e = 0;\nfor (int i = 0; i < 3; i++) {\n    d += m[i][i];\n    e += m[i][2 - i];\n}\ncout << d << " " << e;') },
  { k: 'out', code: P('int m[3][3];\nfor (int i = 0; i < 3; i++)\n    for (int j = 0; j < 3; j++)\n        m[i][j] = i * j;\nfor (int i = 0; i < 3; i++) {\n    for (int j = 0; j < 3; j++)\n        cout << m[i][j] << " ";\n    cout << endl;\n}') },
], [
  { id: 'qm1', title: 'مجموع كل صف', task: 'اقرأ R و C ثم مصفوفة R×C (حتى 10×10). اطبع مجموع كل صف في سطر مستقل.',
    code: P('int m[10][10], R, C;\ncin >> R >> C;\n// اكتب الحل هنا\n'), ref: P('int m[10][10], R, C;\ncin >> R >> C;\nfor (int i = 0; i < R; i++)\n    for (int j = 0; j < C; j++)\n        cin >> m[i][j];\nfor (int i = 0; i < R; i++) {\n    int s = 0;\n    for (int j = 0; j < C; j++)\n        s += m[i][j];\n    cout << s << endl;\n}'), inputs: ['2 3 1 2 3 4 5 6', '3 2 5 5 0 1 -2 9'] },
  { id: 'qm2', title: 'المنقول (Transpose)', task: 'اقرأ n ثم مصفوفة مربعة n×n، واطبع منقولها (الصف يصبح عمودًا): كل صف في سطر وبين العناصر مسافة.',
    code: P('int m[10][10], n;\ncin >> n;\n// اكتب الحل هنا\n'), ref: P('int m[10][10], n;\ncin >> n;\nfor (int i = 0; i < n; i++)\n    for (int j = 0; j < n; j++)\n        cin >> m[i][j];\nfor (int i = 0; i < n; i++) {\n    for (int j = 0; j < n; j++)\n        cout << m[j][i] << " ";\n    cout << endl;\n}'), inputs: ['2 1 2 3 4', '3 1 2 3 4 5 6 7 8 9'] },
]);

add('fnarr', [
  { k: 'mcq', q: 'عند تمرير مصفوفة لدالة <code>void f(int a[], int n)</code> وتعديل a[0] داخلها، ماذا يحدث للمصفوفة في main؟', opts: ['لا تتغير', 'تتغير، لأن المصفوفة تمرَّر بالمرجع دائمًا', 'تُنسخ ثم تُحذف', 'خطأ'], a: 1 },
  { k: 'mcq', q: 'لماذا نمرر <code>n</code> مع المصفوفة؟', opts: ['لا حاجة له', 'لأن الدالة لا تعرف حجم المصفوفة وحدها', 'لتسريع البرنامج', 'لأن C++ تشترط ذلك في الترجمة'], a: 1 },
  { k: 'mcq', q: 'ما الـ Overloading؟', opts: ['دالة تستدعي نفسها', 'دوال بالاسم نفسه تختلف في عدد المعاملات أو أنواعها', 'دالة بلا return', 'دالة داخل دالة'], a: 1 },
  { k: 'mcq', q: 'هل يكفي اختلاف <b>نوع القيمة المرجعة فقط</b> للـ Overloading؟ <code>int f(int)</code> و <code>double f(int)</code>', opts: ['نعم', 'لا، يجب أن تختلف المعاملات', 'نعم إذا كانت إحداهما void', 'نعم دائمًا'], a: 1 },
  { k: 'mcq', q: 'في <code>void show(int x, int y = 5)</code> ما نتيجة الاستدعاء <code>show(2)</code>؟', opts: ['خطأ', 'x = 2 و y = 5', 'x = 5 و y = 2', 'x = 2 و y = 0'], a: 1, why: 'المعامل الافتراضي يأخذ قيمته إذا لم يُمرَّر.' },
  { k: 'mcq', q: 'أي تعريف للقيم الافتراضية <b>خاطئ</b>؟', opts: ['<code>void f(int a, int b = 1)</code>', '<code>void f(int a = 1, int b = 2)</code>', '<code>void f(int a = 1, int b)</code>', '<code>void f(int a, int b = 1, int c = 2)</code>'], a: 2, why: 'القيم الافتراضية تكون من اليمين: لا يأتي معامل بلا قيمة بعد معامل له قيمة.' },
  { k: 'out', code: F('void dbl(int a[], int n) {\n    for (int i = 0; i < n; i++)\n        a[i] *= 2;\n}', 'int a[3] = {1, 2, 3};\ndbl(a, 3);\ndbl(a, 2);\ncout << a[0] << " " << a[1] << " " << a[2];') },
  { k: 'out', code: F('int area(int s) {\n    return s * s;\n}\n\nint area(int w, int h) {\n    return w * h;\n}\n\ndouble area(double r) {\n    return 3 * r * r;\n}', 'cout << area(4) << " " << area(2, 5) << " " << area(1.5);') },
  { k: 'out', code: F('int total(int a, int b = 10, int c = 100) {\n    return a + b + c;\n}', 'cout << total(1) << " " << total(1, 2) << " " << total(1, 2, 3);') },
], [
  { id: 'qfa1', title: 'دالة أكبر عنصر', task: 'اكتب الدالة <code>int maxIn(int a[], int n)</code> التي تُرجع أكبر عنصر. البرنامج الرئيسي جاهز.',
    code: F('int maxIn(int a[], int n) {\n    // اكتب الحل هنا\n    return 0;\n}', 'int a[50], n;\ncin >> n;\nfor (int i = 0; i < n; i++)\n    cin >> a[i];\ncout << maxIn(a, n);'),
    ref: F('int maxIn(int a[], int n) {\n    int m = a[0];\n    for (int i = 1; i < n; i++)\n        if (a[i] > m) m = a[i];\n    return m;\n}', 'int a[50], n;\ncin >> n;\nfor (int i = 0; i < n; i++)\n    cin >> a[i];\ncout << maxIn(a, n);'), inputs: ['5 3 9 2 7 1', '3 -4 -1 -8', '1 6'] },
  { id: 'qfa2', title: 'دالة إزاحة المصفوفة', task: 'اكتب الدالة <code>void rotate(int a[], int n)</code> التي تزيح العناصر خطوة لليسار، ويصبح العنصر الأول في آخر المصفوفة. مثال: 1 2 3 4 ← 2 3 4 1',
    code: F('void rotate(int a[], int n) {\n    // اكتب الحل هنا\n}', 'int a[50], n;\ncin >> n;\nfor (int i = 0; i < n; i++)\n    cin >> a[i];\nrotate(a, n);\nfor (int i = 0; i < n; i++)\n    cout << a[i] << " ";'),
    ref: F('void rotate(int a[], int n) {\n    int first = a[0];\n    for (int i = 0; i < n - 1; i++)\n        a[i] = a[i + 1];\n    a[n - 1] = first;\n}', 'int a[50], n;\ncin >> n;\nfor (int i = 0; i < n; i++)\n    cin >> a[i];\nrotate(a, n);\nfor (int i = 0; i < n; i++)\n    cout << a[i] << " ";'), inputs: ['4 1 2 3 4', '5 9 8 7 6 5', '2 1 2'] },
]);

add('exam2', [
  { k: 'mcq', q: 'ما الذي تُرجعه <code>f(5)</code>؟ <code>int f(int n) { if (n == 0) return 0; return n + f(n - 1); }</code>', opts: ['5', '15', '10', '120'], a: 1, why: '5 + 4 + 3 + 2 + 1 + 0 = 15.' },
  { k: 'mcq', q: 'دالة تستقبل <code>int &amp;x</code>، واستدعيناها بـ <code>f(a[2])</code>. ما الذي يتغير؟', opts: ['لا شيء', 'العنصر a[2] في المصفوفة الأصلية', 'كل المصفوفة', 'نسخة من a[2] فقط'], a: 1 },
  { k: 'mcq', q: 'لإيجاد أصغر عنصر في مصفوفة ثنائية، المقارنة الصحيحة هي:', opts: ['<code>if (m[i][j] &gt; mn) mn = m[i][j];</code>', '<code>if (m[i][j] &lt; mn) mn = m[i][j];</code>', '<code>if (m[i][j] == mn)</code>', '<code>mn = m[i][j];</code>'], a: 1, why: 'استخدام <code>&gt;</code> يُوجد الأكبر لا الأصغر (خطأ وارد في ورقة النصفي).' },
  { k: 'mcq', q: 'أي استدعاء صحيح لـ <code>void f(int m[][3], int r)</code> مع <code>int x[2][3]</code>؟', opts: ['<code>f(x[][3], 2);</code>', '<code>f(x, 2);</code>', '<code>f(&amp;x, 2);</code>', '<code>f(x[2][3], 2);</code>'], a: 1 },
  { k: 'mcq', q: 'ماذا يحدث عند استدعاء دالة لنفسها دون حالة توقف؟', opts: ['تتوقف بعد 10 مرات', 'استدعاء لا نهائي ينتهي بامتلاء الذاكرة (stack overflow)', 'لا شيء', 'تُرجع 0'], a: 1 },
  { k: 'mcq', q: 'متغير عام <code>int c = 0;</code> ودالة تنفّذ <code>c++</code>. استدعيناها 3 مرات. ما قيمة c؟', opts: ['0', '1', '3', 'غير معروفة'], a: 2 },
  { k: 'out', code: F('int f(int n) {\n    if (n <= 1) return 1;\n    return n * f(n - 2);\n}', 'cout << f(7) << " " << f(6);') },
  { k: 'out', code: F('void g(int &a, int b) {\n    a += b;\n    b += a;\n    cout << a << " " << b << endl;\n}', 'int x = 2, y = 3;\ng(x, y);\ng(y, x);\ncout << x << " " << y;') },
  { k: 'out', code: F('int countIf(int a[], int n, int k) {\n    int c = 0;\n    for (int i = 0; i < n; i++)\n        if (a[i] % k == 0) c++;\n    return c;\n}', 'int a[6] = {6, 9, 12, 5, 18, 7};\ncout << countIf(a, 6, 3) << " " << countIf(a, 6, 2);') },
], [
  { id: 'qx1', title: 'دالة مجموع القطرين', task: 'اكتب الدالة <code>int diagSum(int m[][10], int n)</code> التي تُرجع مجموع القطر الرئيسي والقطر الثانوي معًا (العنصر المشترك في المنتصف يُحسب مرة واحدة عندما n فردي).',
    code: F('int diagSum(int m[][10], int n) {\n    // اكتب الحل هنا\n    return 0;\n}', 'int m[10][10], n;\ncin >> n;\nfor (int i = 0; i < n; i++)\n    for (int j = 0; j < n; j++)\n        cin >> m[i][j];\ncout << diagSum(m, n);'),
    ref: F('int diagSum(int m[][10], int n) {\n    int s = 0;\n    for (int i = 0; i < n; i++) {\n        s += m[i][i];\n        if (i != n - 1 - i) s += m[i][n - 1 - i];\n    }\n    return s;\n}', 'int m[10][10], n;\ncin >> n;\nfor (int i = 0; i < n; i++)\n    for (int j = 0; j < n; j++)\n        cin >> m[i][j];\ncout << diagSum(m, n);'), inputs: ['3 1 2 3 4 5 6 7 8 9', '2 1 2 3 4', '1 7'] },
  { id: 'qx2', title: 'دالة عدّ الزوجي والفردي', task: 'اكتب الدالة <code>void countEO(int a[], int n, int &amp;ev, int &amp;od)</code> التي تحسب عدد العناصر الزوجية والفردية. البرنامج الرئيسي جاهز.',
    code: F('void countEO(int a[], int n, int &ev, int &od) {\n    // اكتب الحل هنا\n}', 'int a[50], n, e, o;\ncin >> n;\nfor (int i = 0; i < n; i++)\n    cin >> a[i];\ncountEO(a, n, e, o);\ncout << e << " " << o;'),
    ref: F('void countEO(int a[], int n, int &ev, int &od) {\n    ev = 0;\n    od = 0;\n    for (int i = 0; i < n; i++)\n        if (a[i] % 2 == 0) ev++;\n        else od++;\n}', 'int a[50], n, e, o;\ncin >> n;\nfor (int i = 0; i < n; i++)\n    cin >> a[i];\ncountEO(a, n, e, o);\ncout << e << " " << o;'), inputs: ['5 1 2 3 4 5', '3 2 4 6', '4 7 9 11 2'] },
]);

add('str', [
  { k: 'mcq', q: 'ما قيمة <code>s.length()</code> إذا كانت <code>string s = "C++ Lab";</code>؟', opts: ['6', '7', '8', '3'], a: 1, why: 'المسافة حرف أيضًا: C + + مسافة L a b = 7.' },
  { k: 'mcq', q: 'ما الفرق بين <code>cin &gt;&gt; s</code> و <code>getline(cin, s)</code>؟', opts: ['لا فرق', 'cin تقرأ حتى أول مسافة، و getline تقرأ السطر كاملًا', 'getline تقرأ كلمة واحدة', 'cin تقرأ السطر كاملًا'], a: 1 },
  { k: 'mcq', q: 'ما ناتج <code>string("Hello").substr(1, 3)</code>؟', opts: ['"Hel"', '"ell"', '"ello"', '"el"'], a: 1, why: 'substr(بداية، عدد الحروف): من الفهرس 1 ثلاثة حروف.' },
  { k: 'mcq', q: 'ماذا تُرجع <code>s.find("x")</code> إذا لم تجد x؟', opts: ['0', '-1 أو string::npos (قيمة تعني غير موجود)', 'طول النص', 'خطأ'], a: 1 },
  { k: 'mcq', q: 'كم حرفًا تحتاج المصفوفة <code>char name[?]</code> لتخزين "Ali"؟', opts: ['3', '4 (الحرف الأخير <code>\'\\0\'</code>)', '2', '5'], a: 1 },
  { k: 'mcq', q: 'كيف نتحقق أن الحرف c رقم؟', opts: ['<code>c &gt;= 0 &amp;&amp; c &lt;= 9</code>', '<code>c &gt;= \'0\' &amp;&amp; c &lt;= \'9\'</code>', '<code>c == "digit"</code>', '<code>c &lt; 10</code>'], a: 1, why: 'نقارن بالحروف \'0\' و \'9\' لا بالأعداد 0 و 9 (أو نستخدم isdigit).' },
  { k: 'out', code: S('string s = "banana";\nint c = 0;\nfor (int i = 0; i < s.length(); i++)\n    if (s[i] == \'a\') c++;\ncout << c << " " << s.length();') },
  { k: 'out', code: S('string a = "Hi", b = "FS";\nstring c = a + " " + b;\nc[0] = \'h\';\ncout << c << " " << c.length();') },
  { k: 'out', code: S('string s = "abcdef";\nfor (int i = s.length() - 1; i >= 0; i -= 2)\n    cout << s[i];') },
], [
  { id: 'qs1', title: 'النص المعكوس والمتناظر', task: 'اقرأ كلمة، واطبعها معكوسة في سطر، ثم اطبع <code>Palindrome</code> إذا كانت تُقرأ بالعكس نفسها، وإلا <code>Not palindrome</code>.',
    code: S('string s;\ncin >> s;\n// اكتب الحل هنا\n'), ref: S('string s;\ncin >> s;\nstring r = "";\nfor (int i = s.length() - 1; i >= 0; i--)\n    r += s[i];\ncout << r << endl;\nif (r == s) cout << "Palindrome";\nelse cout << "Not palindrome";'), inputs: ['level', 'hello', 'abba'] },
  { id: 'qs2', title: 'عدّ الحروف المتحركة', task: 'اقرأ كلمة بحروف إنجليزية صغيرة، واطبع عدد الحروف المتحركة فيها (a, e, i, o, u).',
    code: S('string s;\ncin >> s;\n// اكتب الحل هنا\n'), ref: S('string s;\ncin >> s;\nint c = 0;\nfor (int i = 0; i < s.length(); i++)\n    if (s[i] == \'a\' || s[i] == \'e\' || s[i] == \'i\' || s[i] == \'o\' || s[i] == \'u\') c++;\ncout << c;'), inputs: ['programming', 'education', 'rhythm'] },
  { id: 'qs3', title: 'تحويل لحروف كبيرة', task: 'اقرأ كلمة بحروف صغيرة واطبعها بحروف كبيرة دون استخدام toupper (الفرق بين \'a\' و \'A\' هو 32).',
    code: S('string s;\ncin >> s;\n// اكتب الحل هنا\n'), ref: S('string s;\ncin >> s;\nfor (int i = 0; i < s.length(); i++)\n    if (s[i] >= \'a\' && s[i] <= \'z\')\n        s[i] = s[i] - 32;\ncout << s;'), inputs: ['hello', 'cplusplus', 'fs2026'] },
]);

add('ptr', [
  { k: 'mcq', q: 'ماذا يخزّن المؤشر <code>int *p</code>؟', opts: ['عددًا صحيحًا', 'عنوان متغير من النوع int', 'اسم متغير', 'حرفًا'], a: 1 },
  { k: 'mcq', q: 'إذا كان <code>p = &amp;x;</code> فماذا يعني <code>*p</code>؟', opts: ['عنوان x', 'قيمة x (المتغير الذي يشير إليه p)', 'عنوان p', 'نسخة من p'], a: 1 },
  { k: 'mcq', q: 'ما قيمة x بعد: <code>int x = 5; int *p = &amp;x; *p = 9;</code>', opts: ['5', '9', '14', 'عنوان'], a: 1 },
  { k: 'mcq', q: 'إذا كان <code>p</code> يشير إلى <code>a[0]</code>، فإلى ماذا يشير <code>p + 2</code>؟', opts: ['a[0] + 2', 'a[2]', 'a[1]', 'خطأ'], a: 1, why: 'إضافة عدد للمؤشر تتقدم بعدد العناصر لا بالبايتات.' },
  { k: 'mcq', q: 'ما فائدة <code>nullptr</code>؟', opts: ['حذف المتغير', 'قيمة تعني أن المؤشر لا يشير إلى شيء', 'تصفير المتغير', 'لا فائدة لها'], a: 1 },
  { k: 'mcq', q: 'ما الخطأ في <code>int *p; *p = 5;</code>؟', opts: ['لا خطأ', 'p غير مهيّأ ويشير لمكان عشوائي', 'يجب كتابة &amp;p', 'لا يجوز وضع 5'], a: 1 },
  { k: 'out', code: P('int a = 3, b = 7;\nint *p = &a;\n*p = *p + 10;\np = &b;\n*p = *p * 2;\ncout << a << " " << b;') },
  { k: 'out', code: P('int arr[4] = {10, 20, 30, 40};\nint *p = arr;\np++;\ncout << *p << " ";\np += 2;\ncout << *p << " " << *(p - 1);') },
  { k: 'out', code: F('void inc(int *q) {\n    (*q)++;\n}', 'int x = 4;\ninc(&x);\ninc(&x);\ncout << x;') },
], [
  { id: 'qp1', title: 'التبديل بالمؤشرات', task: 'اكتب الدالة <code>void swapP(int *a, int *b)</code> التي تبدّل القيمتين باستخدام المؤشرات. البرنامج الرئيسي جاهز.',
    code: F('void swapP(int *a, int *b) {\n    // اكتب الحل هنا\n}', 'int x, y;\ncin >> x >> y;\nswapP(&x, &y);\ncout << x << " " << y;'),
    ref: F('void swapP(int *a, int *b) {\n    int t = *a;\n    *a = *b;\n    *b = t;\n}', 'int x, y;\ncin >> x >> y;\nswapP(&x, &y);\ncout << x << " " << y;'), inputs: ['3 8', '-1 4'] },
  { id: 'qp2', title: 'مجموع مصفوفة بمؤشر', task: 'اقرأ n ثم n عددًا في مصفوفة، ثم احسب مجموعها باستخدام مؤشر يتحرك على العناصر (<code>*p</code> و <code>p++</code>) دون استخدام a[i] في الجمع.',
    code: P('int a[50], n;\ncin >> n;\nfor (int i = 0; i < n; i++)\n    cin >> a[i];\nint *p = a;\n// اكتب الحل هنا\n'), ref: P('int a[50], n;\ncin >> n;\nfor (int i = 0; i < n; i++)\n    cin >> a[i];\nint *p = a;\nint s = 0;\nfor (int i = 0; i < n; i++) {\n    s += *p;\n    p++;\n}\ncout << s;'), inputs: ['4 1 2 3 4', '3 10 -5 7'] },
]);

add('dyn', [
  { k: 'mcq', q: 'ماذا يفعل <code>int *p = new int;</code>؟', opts: ['يعرّف متغيرًا عاديًا', 'يحجز مكانًا لعدد صحيح في الذاكرة الديناميكية (heap) ويضع عنوانه في p', 'يحذف p', 'ينسخ p'], a: 1 },
  { k: 'mcq', q: 'ما الطريقة الصحيحة لحذف مصفوفة حُجزت بـ <code>new int[n]</code>؟', opts: ['<code>delete p;</code>', '<code>delete[] p;</code>', '<code>free p;</code>', 'لا تُحذف'], a: 1 },
  { k: 'mcq', q: 'ما تسرّب الذاكرة (memory leak)؟', opts: ['حذف متغير مرتين', 'حجز ذاكرة بـ new دون حذفها بـ delete', 'استخدام مؤشر null', 'تعريف مصفوفة كبيرة'], a: 1 },
  { k: 'mcq', q: 'ما المؤشر المعلّق (dangling pointer)؟', opts: ['مؤشر قيمته nullptr', 'مؤشر يشير إلى ذاكرة حُذفت', 'مؤشر لمصفوفة', 'مؤشر لم يُعرَّف'], a: 1, why: 'لذلك نضع <code>p = nullptr;</code> بعد delete.' },
  { k: 'mcq', q: 'لماذا نستخدم المصفوفة الديناميكية <code>new int[n]</code>؟', opts: ['لأنها أسرع', 'لأن حجمها يمكن أن يُحدَّد أثناء التشغيل (مثلًا من إدخال المستخدم)', 'لأنها لا تحتاج حذفًا', 'لأنها تقبل نصوصًا'], a: 1 },
  { k: 'mcq', q: 'ماذا يحدث عند <code>delete p;</code> مرتين على نفس العنوان؟', opts: ['لا شيء', 'خطأ: حذف مزدوج (double delete)', 'تُحذف الذاكرة مرتين بأمان', 'يصبح p = 0'], a: 1 },
  { k: 'out', code: P('int *p = new int;\n*p = 6;\nint *q = p;\n*q = *q * 7;\ncout << *p;\ndelete p;') },
  { k: 'out', code: P('int n = 4;\nint *a = new int[n];\nfor (int i = 0; i < n; i++)\n    a[i] = (i + 1) * (i + 1);\nint s = 0;\nfor (int i = 0; i < n; i++)\n    s += a[i];\ncout << s;\ndelete[] a;') },
  { k: 'out', code: P('int *p = new int(5);\nint *q = new int(3);\n*p += *q;\ndelete q;\nq = p;\ncout << *q << " " << *p;\ndelete p;') },
], [
  { id: 'qd1', title: 'مصفوفة ديناميكية بالعكس', task: 'اقرأ n، واحجز مصفوفة ديناميكية بحجم n بـ new، واقرأ فيها n عددًا، واطبعها بالعكس، ثم احذفها بـ delete[].',
    code: P('int n;\ncin >> n;\n// اكتب الحل هنا\n'), ref: P('int n;\ncin >> n;\nint *a = new int[n];\nfor (int i = 0; i < n; i++)\n    cin >> a[i];\nfor (int i = n - 1; i >= 0; i--)\n    cout << a[i] << " ";\ndelete[] a;'), inputs: ['4 1 2 3 4', '6 9 8 7 6 5 4'] },
  { id: 'qd2', title: 'دمج مصفوفتين ديناميكيًا', task: 'اقرأ n ثم n عددًا، ثم m ثم m عددًا. احجز مصفوفة ديناميكية بحجم n + m تضم الاثنتين (الأولى ثم الثانية)، واطبعها، ثم احذف كل ما حجزته.',
    code: P('int n, m;\ncin >> n;\n// اكتب الحل هنا\n'), ref: P('int n, m;\ncin >> n;\nint *a = new int[n];\nfor (int i = 0; i < n; i++)\n    cin >> a[i];\ncin >> m;\nint *b = new int[m];\nfor (int i = 0; i < m; i++)\n    cin >> b[i];\nint *c = new int[n + m];\nfor (int i = 0; i < n; i++)\n    c[i] = a[i];\nfor (int i = 0; i < m; i++)\n    c[n + i] = b[i];\nfor (int i = 0; i < n + m; i++)\n    cout << c[i] << " ";\ndelete[] a;\ndelete[] b;\ndelete[] c;'), inputs: ['2 1 2 3 7 8 9', '1 5 1 6'] },
]);

add('struct', [
  { k: 'mcq', q: 'ما الـ struct؟', opts: ['دالة خاصة', 'نوع بيانات جديد يجمع عدة حقول قد تختلف أنواعها', 'مصفوفة من الأعداد فقط', 'مؤشر'], a: 1 },
  { k: 'mcq', q: 'كيف نصل إلى الحقل <code>age</code> في المتغير <code>Student s</code>؟', opts: ['<code>s-&gt;age</code>', '<code>s.age</code>', '<code>age.s</code>', '<code>s[age]</code>'], a: 1 },
  { k: 'mcq', q: 'إذا كان <code>Student *p = &amp;s;</code> فكيف نصل إلى age؟', opts: ['<code>p.age</code>', '<code>p-&gt;age</code> أو <code>(*p).age</code>', '<code>*p.age</code>', '<code>&amp;p.age</code>'], a: 1 },
  { k: 'mcq', q: 'ما الخطأ الشائع في تعريف struct؟', opts: ['نسيان الفاصلة المنقوطة <code>;</code> بعد القوس الأخير', 'كتابة الحقول بأنواع مختلفة', 'تعريفه قبل main', 'استخدام string داخله'], a: 0 },
  { k: 'mcq', q: 'عند تمرير struct لدالة بالقيمة <code>void f(Student s)</code> وتعديل الحقل داخلها:', opts: ['يتغير الأصلي', 'لا يتغير الأصلي، لأن الدالة تعمل على نسخة', 'خطأ', 'تتغير كل الحقول'], a: 1 },
  { k: 'mcq', q: 'كيف نعرّف مصفوفة من 30 طالبًا؟', opts: ['<code>Student[30] s;</code>', '<code>Student s[30];</code>', '<code>struct s[30];</code>', '<code>Student s(30);</code>'], a: 1 },
  { k: 'out', code: F('struct Point {\n    int x;\n    int y;\n};', 'Point a = {2, 3};\nPoint b = a;\nb.x = 10;\ncout << a.x << " " << b.x << " " << a.y + b.y;') },
  { k: 'out', code: F('struct Item {\n    string name;\n    int qty;\n    double price;\n};', 'Item it[3] = {{"pen", 3, 1.5}, {"book", 1, 12}, {"bag", 2, 20}};\ndouble t = 0;\nfor (int i = 0; i < 3; i++)\n    t += it[i].qty * it[i].price;\ncout << t;') },
  { k: 'out', code: F('struct Box {\n    int w = 1;\n    int h = 1;\n};\n\nvoid grow(Box &b) {\n    b.w *= 2;\n    b.h += 3;\n}', 'Box b;\ngrow(b);\ngrow(b);\nBox *p = &b;\ncout << p->w << " " << p->h;') },
], [
  { id: 'qst1', title: 'أعلى طالب', task: 'عرّف <code>struct Student { string name; double gpa; };</code>. اقرأ n ثم n طالبًا (اسم ومعدل)، واطبع اسم صاحب أعلى معدل ومعدله بينهما مسافة.',
    code: F('struct Student {\n    string name;\n    double gpa;\n};', 'Student s[30];\nint n;\ncin >> n;\n// اكتب الحل هنا\n'),
    ref: F('struct Student {\n    string name;\n    double gpa;\n};', 'Student s[30];\nint n;\ncin >> n;\nfor (int i = 0; i < n; i++)\n    cin >> s[i].name >> s[i].gpa;\nint b = 0;\nfor (int i = 1; i < n; i++)\n    if (s[i].gpa > s[b].gpa) b = i;\ncout << s[b].name << " " << s[b].gpa;'), inputs: ['3 Ali 3.2 Sara 3.9 Omar 2.8', '2 Huda 2.5 Salem 3.1'] },
  { id: 'qst2', title: 'المسافة بين نقطتين', task: 'عرّف <code>struct Point { int x; int y; };</code> ودالة <code>int dist2(Point a, Point b)</code> تُرجع مربع المسافة بين النقطتين. اقرأ نقطتين واطبع النتيجة.',
    code: F('struct Point {\n    int x;\n    int y;\n};\n\nint dist2(Point a, Point b) {\n    // اكتب الحل هنا\n    return 0;\n}', 'Point a, b;\ncin >> a.x >> a.y >> b.x >> b.y;\ncout << dist2(a, b);'),
    ref: F('struct Point {\n    int x;\n    int y;\n};\n\nint dist2(Point a, Point b) {\n    int dx = a.x - b.x, dy = a.y - b.y;\n    return dx * dx + dy * dy;\n}', 'Point a, b;\ncin >> a.x >> a.y >> b.x >> b.y;\ncout << dist2(a, b);'), inputs: ['0 0 3 4', '1 2 1 2', '-1 -1 2 3'] },
]);
})();
