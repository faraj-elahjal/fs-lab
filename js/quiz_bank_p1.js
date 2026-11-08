/* Programming 1 — question bank (extra self-test and essay questions in the style of the course exams) */
(function () {
const { P, F } = window.FS_Q, add = window.FS_addQuiz;
const M = (s) => '#include <iostream>\n#include <cmath>\nusing namespace std;\n\nint main() {\n' + s.replace(/^/gm, '    ').replace(/^\s+$/gm, '') + '\n    return 0;\n}\n';

add('vars', [
  { k: 'mcq', q: 'أي جملة تخصيص (إسناد) من التالية <b>صحيحة</b> في C++؟', opts: ['<code>-sum += value;</code>', '<code>ad = a + b ** 2;</code>', '<code>x_y = y - x;</code>', '<code>f = ++5 - --m;</code>'], a: 2, why: 'لا يجوز أن يكون الطرف الأيسر تعبيرًا مثل -sum، ولا يوجد معامل ** في C++، ولا يمكن زيادة ثابت مثل ++5.' },
  { k: 'mcq', q: 'ما قيمة كل المتغيرات بعد: <code>int m, n, p, w = 4; m = n = p = w;</code>', opts: ['m فقط تساوي 4', 'كلها تساوي 4', 'خطأ في الترجمة', 'm = 0'], a: 1, why: 'الإسناد المتسلسل يُنفَّذ من اليمين: p = w ثم n = p ثم m = n.' },
  { k: 'out', code: P('int n;\nfloat x = 3.8;\nn = (int) x;\ncout << "n = " << (++n + x) << endl;') },
], [
  { id: 'bv1', title: 'قيمة التعبير Z', task: 'اقرأ قيمتي x و y (عددين صحيحين)، ثم احسب واطبع <code>Z = x³ + 2xy + 5</code>. مثال: x = 2 و y = 2 ← 21.',
    code: P('int x, y;\ncin >> x >> y;\n// اكتب الحل هنا\n'), ref: P('int x, y;\ncin >> x >> y;\nint z = x * x * x + 2 * x * y + 5;\ncout << z;'), inputs: ['2 2', '3 -1', '0 7'] },
]);

add('arith', [
  { k: 'out', q: 'ما ناتج البرنامج؟ (تذكّر: 1 يعني صحيح و 0 يعني خطأ)', code: P('float a = 5, b = 3, c = 8, d = 2;\ncout << (c - b > d * 2) << endl;\ncout << (c == (a - 4) * d) << endl;\ncout << (!(!a + !b) == 0) << endl;\ncout << ((c / d >= 4) && (c / d / d == d));') },
  { k: 'out', code: M('float C = -4.5;\ncout << floor(fabs(C - 1)) << endl;\ncout << sqrt(16) + pow(2, 3);') },
  { k: 'out', code: P('int i = 1, j = 1, t = 6, n = 7;\nt = ++i + t;\ni = i + t;\nj += n;\ncout << t << " " << i << " " << j;') },
  { k: 'mcq', q: 'إذا كان <code>char x = \'w\';</code> فما ناتج <code>cout &lt;&lt; (x - 1 != \'u\');</code>؟', opts: ['0', '1', 'v', 'خطأ'], a: 1, why: 'x - 1 هو رمز الحرف v، وهو لا يساوي u، فالشرط صحيح ويُطبع 1.' },
], [
  { id: 'ba1', title: 'عكس عدد من أربعة أرقام', task: 'بدون استخدام الحلقات، اقرأ عددًا صحيحًا من أربعة أرقام واطبعه معكوسًا. مثال: 1234 ← 4321.',
    code: P('int a;\ncin >> a;\n// اكتب الحل هنا\n'), ref: P('int a;\ncin >> a;\nint b = a % 10;\na /= 10;\nint c = a % 10;\na /= 10;\nint d = a % 10;\nint e = a / 10;\ncout << b * 1000 + c * 100 + d * 10 + e;'), inputs: ['1234', '9071', '5555'] },
  { id: 'ba2', title: 'مجموع أرقام عدد من ثلاثة أرقام', task: 'اقرأ عددًا صحيحًا من ثلاثة أرقام، واطبع مجموع أرقامه ثم حاصل ضربها بينهما مسافة. مثال: 352 ← <code>10 30</code>.',
    code: P('int n;\ncin >> n;\n// اكتب الحل هنا\n'), ref: P('int n;\ncin >> n;\nint a = n / 100, b = n / 10 % 10, c = n % 10;\ncout << a + b + c << " " << a * b * c;'), inputs: ['352', '909', '111'] },
]);

add('cond', [
  { k: 'out', q: 'ما ناتج البرنامج إذا أدخل المستخدم 3؟ (انتبه إلى break)', input: '3', code: P('int x = 2, y = 9, op, n;\ncin >> op;\nswitch (op) {\n    case 1: n = 3 * x + 2 * y - 3; break;\n    case 2: n = 2 * y + x + 5; break;\n    case 3: n = 25;\n    default: n = 0;\n}\ncout << n;') },
  { k: 'out', input: '1', code: P('int x = 2, y = 9, op, n;\ncin >> op;\nswitch (op) {\n    case 1: n = 3 * x + 2 * y - 3; break;\n    case 2: n = 2 * y + x + 5; break;\n    case 3: n = 25;\n    default: n = 0;\n}\ncout << n;') },
  { k: 'out', code: P('int i = 1, j = 1, t = 6, n = 7;\ni = i + t;\nj += n;\nt = ++i + t;\nif (t + t >= 12 && j + j >= 15)\n    cout << t << i << j << n;\nelse\n    cout << t;') },
  { k: 'mcq', q: 'في جملة switch، ماذا يحدث إذا نُسيت break في نهاية case؟', opts: ['خطأ في الترجمة', 'يتوقف البرنامج', 'يستمر التنفيذ في الحالات التي بعدها', 'تُنفَّذ default فقط'], a: 2, why: 'بدون break ينتقل التنفيذ إلى الحالة التالية (fall-through) حتى يجد break أو نهاية switch.' },
], [
  { id: 'bc1', title: 'دالة على ثلاث فترات بـ switch', task: 'اقرأ x، واطبع y حيث: <code>y = x + 10</code> إذا x &gt; 0، و <code>y = 1000</code> إذا x = 0، و <code>y = 25 - x</code> إذا x &lt; 0. استخدم <code>switch (x &gt; 0)</code>.',
    code: P('int x;\ncin >> x;\n// اكتب الحل هنا\n'), ref: P('int x;\ncin >> x;\nswitch (x > 0) {\n    case 1:\n        cout << x + 10;\n        break;\n    case 0:\n        if (x == 0)\n            cout << 1000;\n        else\n            cout << 25 - x;\n}'), inputs: ['5', '0', '-4'] },
  { id: 'bc2', title: 'قائمة اختيارات', task: 'اقرأ عددًا صحيحًا ثم حرف الاختيار. إذا كان الحرف <code>A</code> اطبع <code>Even</code> أو <code>Odd</code>، وإذا كان <code>B</code> اطبع <code>More</code> إذا كان للعدد أكثر من 3 أرقام، أو <code>Less</code> إذا كان أقل، أو <code>Three</code> إذا كان 3 أرقام بالضبط (اعتبر القيمة المطلقة). أي حرف آخر اطبع <code>Error</code>.',
    code: P('int x;\nchar c;\ncin >> x >> c;\n// اكتب الحل هنا\n'),
    ref: P('int x;\nchar c;\ncin >> x >> c;\nif (x < 0)\n    x = -x;\nswitch (c) {\n    case \'A\':\n        if (x % 2 == 0)\n            cout << "Even";\n        else\n            cout << "Odd";\n        break;\n    case \'B\':\n        if (x > 999)\n            cout << "More";\n        else if (x < 100)\n            cout << "Less";\n        else\n            cout << "Three";\n        break;\n    default:\n        cout << "Error";\n}'),
    inputs: ['7509 B', '42 A', '-315 B', '8 B', '17 A', '5 C'] },
  { id: 'bc3', title: 'تحويل الوزن', task: 'اقرأ وزنًا بالجرام (عدد حقيقي) ثم رقم اختيار: 1 كيلوجرام (÷1000)، 2 طن (÷1000000)، 3 رطل (÷453)، 4 أونصة (÷28). اطبع الناتج متبوعًا بمسافة واسم الوحدة: <code>kilogram</code> أو <code>ton</code> أو <code>pound</code> أو <code>ounce</code>. لأي اختيار آخر اطبع <code>EXIT!</code>',
    code: P('double g;\nint choice;\ncin >> g >> choice;\n// اكتب الحل هنا\n'),
    ref: P('double g;\nint choice;\ncin >> g >> choice;\nswitch (choice) {\n    case 1: cout << g / 1000 << " kilogram"; break;\n    case 2: cout << g / 1000000 << " ton"; break;\n    case 3: cout << g / 453 << " pound"; break;\n    case 4: cout << g / 28 << " ounce"; break;\n    default: cout << "EXIT!";\n}'),
    inputs: ['2500 1', '906 3', '56 4', '3000000 2', '100 9'] },
  { id: 'bc4', title: 'المعادلة حسب قيمة x', task: 'اقرأ عددين حقيقيين x و y. إذا كانت x ≥ 0 احسب <code>z = (x - y) / 2</code> وإلا احسب <code>z = 30 + 9 * y</code>. اطبع z.',
    code: P('double x, y;\ncin >> x >> y;\n// اكتب الحل هنا\n'), ref: P('double x, y, z;\ncin >> x >> y;\nif (x >= 0)\n    z = (x - y) / 2;\nelse\n    z = 30 + 9 * y;\ncout << z;'), inputs: ['7 3', '-1 2', '0 5'] },
]);

add('for', [
  { k: 'mcq', q: 'كم مرة تُطبع الرسالة <code>good luck</code>؟<pre class="qcode" dir="ltr">for (int a = 1; a &lt; 6; a += 2)\n  for (int b = 6; b &gt; 1; b -= 2)\n    for (int c = b; c &lt;= 3; c++)\n      cout &lt;&lt; "good luck" &lt;&lt; endl;</pre>', opts: ['3', '6', '9', '15'], a: 1, why: 'الحلقة a تتكرر 3 مرات (1، 3، 5). وفي كل مرة b تأخذ 6 و 4 و 2، والحلقة c تعمل فقط عندما b = 2 (c = 2 و 3) أي مرتين. 3 × 2 = 6.' },
  { k: 'out', code: P('for (int i = 85; i >= 10; i -= 15)\n    cout << i << " ";') },
  { k: 'out', code: P('for (int i = 1; i <= 5; i++) {\n    for (int j = i; j <= 5; j++)\n        cout << j << " ";\n    cout << endl;\n}') },
  { k: 'out', code: P('int r;\nfor (r = 2000; r <= 2010; r += 2) {\n    if (r % 4 == 0)\n        cout << "2 is 29";\n    else\n        cout << "2 is 28";\n    cout << endl;\n}\ncout << "good luck";') },
  { k: 'out', code: P('int sum = 0;\nfor (int i = 1; i <= 100; i++)\n    if (i % 3 == 0)\n        sum += i;\ncout << sum;') },
], [
  { id: 'bf1', title: 'المجموع بإشارات متبادلة', task: 'اقرأ n ثم احسب واطبع <code>sum = 1 + 2 - 3 + 4 - 5 + 6 ... n</code> (أول حدّين موجبان ثم تتبادل الإشارة). مثال: n = 12 ← 8.',
    code: P('int n;\ncin >> n;\n// اكتب الحل هنا\n'), ref: P('int n;\ncin >> n;\nint sum = 1, s = 1;\nfor (int x = 2; x <= n; x++) {\n    sum += x * s;\n    s *= -1;\n}\ncout << sum;'), inputs: ['12', '1', '5', '20'] },
  { id: 'bf2', title: 'شكل الأرقام المتزايدة', task: 'اطبع الشكل التالي (أربعة أسطر، كل سطر يبدأ بمسافات بحيث تنتهي الأرقام في نفس العمود):<pre dir="ltr">   4\n  34\n 234\n1234</pre>',
    code: P('// اكتب الحل هنا\n'), ref: P('for (int i = 1; i <= 4; i++) {\n    for (int k = 1; k <= 4 - i; k++)\n        cout << " ";\n    for (int j = 5 - i; j <= 4; j++)\n        cout << j;\n    cout << endl;\n}'), inputs: [''] },
  { id: 'bf3', title: 'شكل 1234 و 4444', task: 'اطبع الشكل التالي باستخدام حلقتين متداخلتين وشرط:<pre dir="ltr">1234\n1244\n1444\n4444</pre>',
    code: P('// اكتب الحل هنا\n'), ref: P('for (int i = 1; i <= 4; i++) {\n    for (int j = 1; j <= 4; j++) {\n        if (i + j <= 4)\n            cout << j;\n        else\n            cout << 4;\n    }\n    cout << endl;\n}'), inputs: [''] },
  { id: 'bf4', title: 'مستطيل مفرغ من النجوم', task: 'اقرأ العرض w والارتفاع h، واطبع مستطيلًا مفرغًا من <code>*</code>: الصف الأول والأخير كاملان، وبقية الصفوف نجمة في البداية ونجمة في النهاية وبينهما مسافات. مثال: 7 4',
    code: P('int w, h;\ncin >> w >> h;\n// اكتب الحل هنا\n'), ref: P('int w, h;\ncin >> w >> h;\nfor (int i = 1; i <= h; i++) {\n    for (int j = 1; j <= w; j++) {\n        if (i == 1 || i == h || j == 1 || j == w)\n            cout << "*";\n        else\n            cout << " ";\n    }\n    cout << endl;\n}'), inputs: ['7 4', '3 3', '5 2'] },
  { id: 'bf5', title: 'مجموع مقلوب المضروب', task: 'اقرأ n، واحسب <code>f = 1/1! + 1/2! + ... + 1/n!</code> واطبع الناتج.',
    code: P('int n;\ncin >> n;\n// اكتب الحل هنا\n'), ref: P('int n;\ncin >> n;\ndouble f = 0, fact = 1;\nfor (int x = 1; x <= n; x++) {\n    fact *= x;\n    f += 1 / fact;\n}\ncout << f;'), inputs: ['1', '3', '6'] },
  { id: 'bf6', title: 'خط مائل من النجوم', task: 'اقرأ n، واطبع خطًا مائلًا من n نجمة يصعد من اليسار إلى اليمين: السطر الأول فيه n-1 مسافة ثم نجمة، والأخير نجمة بدون مسافات.',
    code: P('int n;\ncin >> n;\n// اكتب الحل هنا\n'), ref: P('int n;\ncin >> n;\nfor (int i = 1; i <= n; i++) {\n    for (int k = 1; k <= n - i; k++)\n        cout << " ";\n    cout << "*" << endl;\n}'), inputs: ['4', '1', '6'] },
]);

add('while', [
  { k: 'out', code: P('int i = 5;\nwhile (i > 0) {\n    --i;\n    cout << i - 2 << endl;\n}') },
  { k: 'out', code: P('for (int n = 10; n > -4; n--) {\n    if (n == 4)\n        break;\n    if (n == 5)\n        continue;\n    cout << n << ", ";\n}\ncout << "END";') },
  { k: 'out', code: P('int x = 12;\ndo {\n    cout << x << " ";\n    x++;\n} while (x <= 10);\nwhile (x <= 15) {\n    cout << x << " ";\n    x++;\n}') },
  { k: 'out', code: P('int i = 5, j;\nwhile (true) {\n    i -= 2;\n    cout << "I=" << i << endl;\n    if (i <= 0)\n        break;\n    j = -2;\n    while (true) {\n        j += 2;\n        cout << "J=" << j << endl;\n        if (j > i)\n            break;\n    }\n    cout << "inner" << endl;\n}\ncout << "outer";') },
  { k: 'mcq', q: 'كم سطرًا تطبع الحلقة التالية؟<pre class="qcode" dir="ltr">for (float a = 0; a != 10.0; a += 0.1)\n    cout &lt;&lt; "A=" &lt;&lt; a &lt;&lt; endl;</pre>', opts: ['100 سطر', '101 سطر', 'لا تتوقف أبدًا (حلقة لا نهائية)', 'لا تطبع شيئًا'], a: 2, why: 'العدد 0.1 لا يُمثَّل بدقة في النظام الثنائي، فلا تصل a إلى 10.0 بالضبط ويبقى الشرط != صحيحًا دائمًا. الأفضل استخدام &lt; بدل !=.' },
  { k: 'mcq', q: 'ما الفرق بين <code>break</code> و <code>continue</code> داخل الحلقة؟', opts: ['لا فرق', 'break تخرج من الحلقة نهائيًا، و continue تتخطى بقية الدورة الحالية وتنتقل للدورة التالية', 'continue تخرج من الحلقة، و break تعيد الدورة', 'كلاهما ينهي البرنامج'], a: 1 },
], [
  { id: 'bw1', title: 'عدد أرقام عدد صحيح', task: 'اقرأ عددًا صحيحًا (موجبًا أو سالبًا)، واطبع عدد أرقامه باستخدام while. مثال: -4521 ← 4، و 0 ← 1.',
    code: P('int x;\ncin >> x;\n// اكتب الحل هنا\n'), ref: P('int x;\ncin >> x;\nif (x < 0)\n    x = -x;\nint c = 0;\ndo {\n    c++;\n    x /= 10;\n} while (x != 0);\ncout << c;'), inputs: ['-4521', '0', '7', '100000'] },
  { id: 'bw2', title: 'مجموع الموجبة حتى إدخال سالب', task: 'اقرأ أعدادًا باستمرار، واجمع الموجبة منها، وتوقّف عند إدخال أول عدد سالب. اطبع المجموع.',
    code: P('int x, sum = 0;\n// اكتب الحل هنا\n'), ref: P('int x, sum = 0;\ncin >> x;\nwhile (x >= 0) {\n    sum += x;\n    cin >> x;\n}\ncout << sum;'), inputs: ['5 3 8 -1', '-2', '10 0 20 -7 99'] },
  { id: 'bw3', title: 'المجموع المتناوب 1 - 2 + 3', task: 'اقرأ n، واحسب بـ while: <code>sum = 1 - 2 + 3 - 4 + ... n</code>',
    code: P('int n;\ncin >> n;\n// اكتب الحل هنا\n'), ref: P('int n;\ncin >> n;\nint sum = 0, s = 1, i = 1;\nwhile (i <= n) {\n    sum += s * i;\n    s *= -1;\n    i++;\n}\ncout << sum;'), inputs: ['5', '6', '1'] },
  { id: 'bw4', title: 'الفردي يبقى والزوجي يصبح فرديًا', task: 'اقرأ أعدادًا حتى إدخال 0. لكل عدد: إذا كان فرديًا اطبعه كما هو، وإذا كان زوجيًا أضف إليه 1 واطبعه. افصل بين الأعداد بمسافة.',
    code: P('int x;\n// اكتب الحل هنا\n'), ref: P('int x;\ncin >> x;\nwhile (x != 0) {\n    if (x % 2 == 0)\n        x++;\n    cout << x << " ";\n    cin >> x;\n}'), inputs: ['3 8 5 10 0', '7 0', '2 4 0'] },
]);

add('p1arr', [
  { k: 'mcq', q: 'في التعريف <code>int a[8];</code> ما فهرس آخر عنصر؟', opts: ['8', '7', '9', '0'], a: 1, why: 'الفهرس يبدأ من 0، فآخر فهرس هو الحجم − 1 = 7.' },
  { k: 'mcq', q: 'كم عنصرًا تحجز <code>double m[10];</code>؟', opts: ['9', '10', '11', 'لا تحجز شيئًا حتى نعطيها قيمًا'], a: 1 },
  { k: 'mcq', q: 'ما قيمة <code>a[3]</code> بعد <code>int a[5] = {6, 2};</code>؟', opts: ['2', '6', '0', 'قيمة عشوائية'], a: 2, why: 'عند إعطاء بعض القيم في التعريف، تصبح بقية العناصر 0.' },
  { k: 'mcq', q: 'أي حلقة تمر على كل عناصر <code>int a[5]</code> بدون خروج عن الحدود؟', opts: ['<code>for (int i = 1; i &lt;= 5; i++)</code>', '<code>for (int i = 0; i &lt;= 5; i++)</code>', '<code>for (int i = 0; i &lt; 5; i++)</code>', '<code>for (int i = 0; i &lt; 4; i++)</code>'], a: 2, why: 'الفهارس من 0 إلى 4. الخيار الأول والثاني يصلان إلى a[5] خارج المصفوفة، والرابع يترك آخر عنصر.' },
  { k: 'mcq', q: 'أين الخطأ في <code>int n = 5; int a[n] = {1, 2, 3, 4, 5};</code> في C++ القياسية؟', opts: ['لا يوجد خطأ', 'حجم المصفوفة يجب أن يكون ثابتًا معروفًا وقت الترجمة، مثل <code>const int n = 5;</code>', 'القيم يجب أن تكون بين أقواس عادية', 'لا يجوز تعريف مصفوفة من النوع int'], a: 1 },
  { k: 'mcq', q: 'لماذا نبدأ البحث عن أكبر عنصر بـ <code>mx = a[0]</code> وليس <code>mx = 0</code>؟', opts: ['لا فرق', 'لأن كل العناصر قد تكون سالبة، فيبقى 0 خطأً هو الأكبر', 'لأن a[0] أصغر عنصر دائمًا', 'حتى تعمل الحلقة أسرع'], a: 1 },
  { k: 'out', code: P('int a[5] = {10, 20, 30, 40, 50};\na[1] = a[0] + a[4];\na[3]--;\nfor (int i = 0; i < 5; i++)\n    cout << a[i] << " ";') },
  { k: 'out', code: P('int a[6] = {3, 1, 4, 1, 5, 9};\nint s = 0;\nfor (int i = 0; i < 6; i += 2)\n    s += a[i];\ncout << s;') },
  { k: 'out', code: P('int a[5] = {1, 2, 3, 4, 5};\nfor (int i = 0; i < 2; i++) {\n    int t = a[i];\n    a[i] = a[4 - i];\n    a[4 - i] = t;\n}\nfor (int i = 0; i < 5; i++)\n    cout << a[i];') },
  { k: 'out', code: P('int a[5] = {7, 2, 9, 2, 5};\nint c = 0;\nfor (int i = 0; i < 5; i++)\n    if (a[i] > a[0])\n        c++;\ncout << c;') },
  { k: 'out', code: P('int a[4] = {1, 2, 3, 4};\nfor (int i = 3; i > 0; i--)\n    a[i] = a[i - 1];\na[0] = 0;\nfor (int i = 0; i < 4; i++)\n    cout << a[i] << " ";') },
], [
  { id: 'br1', title: 'المجموع والمتوسط', task: 'اقرأ 5 أعداد صحيحة في مصفوفة، واطبع مجموعها في سطر ومتوسطها في السطر التالي.',
    code: P('int a[5];\n// اكتب الحل هنا\n'), ref: P('int a[5], sum = 0;\nfor (int i = 0; i < 5; i++) {\n    cin >> a[i];\n    sum += a[i];\n}\ncout << sum << endl << (double) sum / 5;'), inputs: ['1 2 3 4 5', '10 0 -5 7 3'] },
  { id: 'br2', title: 'أكبر عنصر وموقعه', task: 'اقرأ n (لا يزيد على 20) ثم n عددًا، واطبع أكبر عنصر ثم فهرسه (أول ظهور) بينهما مسافة.',
    code: P('int a[20], n;\ncin >> n;\n// اكتب الحل هنا\n'), ref: P('int a[20], n;\ncin >> n;\nfor (int i = 0; i < n; i++)\n    cin >> a[i];\nint mx = a[0], pos = 0;\nfor (int i = 1; i < n; i++)\n    if (a[i] > mx) {\n        mx = a[i];\n        pos = i;\n    }\ncout << mx << " " << pos;'), inputs: ['6 3 8 2 11 5 11', '3 -4 -1 -9', '1 7'] },
  { id: 'br3', title: 'البحث عن عدد', task: 'اقرأ 6 أعداد في مصفوفة ثم عددًا x. إذا وُجد x اطبع <code>found at</code> متبوعًا بفهرس أول ظهور، وإلا اطبع <code>not found</code>.',
    code: P('int a[6], x;\n// اكتب الحل هنا\n'), ref: P('int a[6], x, pos = -1;\nfor (int i = 0; i < 6; i++)\n    cin >> a[i];\ncin >> x;\nfor (int i = 0; i < 6; i++)\n    if (a[i] == x) {\n        pos = i;\n        break;\n    }\nif (pos == -1)\n    cout << "not found";\nelse\n    cout << "found at " << pos;'), inputs: ['5 8 2 9 8 4 8', '5 8 2 9 8 4 7', '1 2 3 4 5 6 1'] },
  { id: 'br4', title: 'الأكبر من المتوسط', task: 'اقرأ 6 أعداد في مصفوفة، واحسب متوسطها، ثم اطبع العناصر الأكبر من المتوسط بينها مسافة.',
    code: P('int a[6];\n// اكتب الحل هنا\n'), ref: P('int a[6];\ndouble sum = 0;\nfor (int i = 0; i < 6; i++) {\n    cin >> a[i];\n    sum += a[i];\n}\ndouble avg = sum / 6;\nfor (int i = 0; i < 6; i++)\n    if (a[i] > avg)\n        cout << a[i] << " ";'), inputs: ['1 2 3 4 5 6', '10 10 10 10 10 40', '-3 0 3 -6 6 9'] },
  { id: 'br5', title: 'الموجبة والسالبة', task: 'اقرأ 8 أعداد في مصفوفة، واطبع في سطر عدد الأعداد الموجبة، وفي السطر التالي مجموع الأعداد السالبة.',
    code: P('int a[8];\n// اكتب الحل هنا\n'), ref: P('int a[8], pos = 0, neg = 0;\nfor (int i = 0; i < 8; i++) {\n    cin >> a[i];\n    if (a[i] > 0) pos++;\n    if (a[i] < 0) neg += a[i];\n}\ncout << pos << endl << neg;'), inputs: ['3 -2 0 7 -5 1 -1 4', '-1 -1 -1 -1 -1 -1 -1 -1'] },
  { id: 'br6', title: 'تدوير المصفوفة لليمين', task: 'اقرأ 5 أعداد في مصفوفة، ثم حرّك كل عنصر خانة إلى اليمين بحيث يصبح آخر عنصر في البداية، واطبع المصفوفة. مثال: <code>1 2 3 4 5</code> ← <code>5 1 2 3 4</code>.',
    code: P('int a[5];\n// اكتب الحل هنا\n'), ref: P('int a[5];\nfor (int i = 0; i < 5; i++)\n    cin >> a[i];\nint last = a[4];\nfor (int i = 4; i > 0; i--)\n    a[i] = a[i - 1];\na[0] = last;\nfor (int i = 0; i < 5; i++)\n    cout << a[i] << " ";'), inputs: ['1 2 3 4 5', '9 8 7 6 5'] },
]);

add('exam', [
  { k: 'out', code: P('int n = 5, i;\nint a[5] = {2, 4, 5, 6, 7};\nfor (i = 0; i < n - 1; i = i + 2)\n    a[i] = a[i] * 2;\nfor (i = 1; i < n - 2; i++)\n    cout << a[i] << " ";') },
  { k: 'out', code: P('int a[6] = {4, 6, 6, 3, 33, 24};\na[2] = a[2] / 2;\na[1] = a[2];\na[5] = a[5] - a[0];\na[0] = a[2] - 1;\nfor (int i = 0; i < 6; i++)\n    cout << a[i] << " ";') },
  { k: 'out', code: P('int n = 6, i, j;\nint b[20] = {11, 12, 13, 14, 15, 16};\nfor (i = 0; i < n - 2; i = i + 3)\n    b[i] = b[i + 1] * 2;\nfor (i = 0; i < n; i++)\n    if (i < n - 3)\n        b[i] = b[i + 1];\ni++;\nfor (j = n; j > n; j--)\n    b[j] = b[j];\nfor (i = 0; i < n; i++)\n    cout << b[i] << " ";') },
  { k: 'mcq', q: 'ما ناتج <code>int a = {4, 6, 6};</code>؟', opts: ['تُنشأ مصفوفة من 3 عناصر', 'a تساوي 4', 'خطأ في الترجمة: المتغير a ليس مصفوفة', 'a تساوي 16'], a: 2, why: 'قائمة القيم بين الأقواس تحتاج تعريف مصفوفة مثل <code>int a[3] = {4, 6, 6};</code>.' },
], [
  { id: 'be1', title: 'إحصائيات ستة أعداد', task: 'اقرأ 6 أعداد صحيحة، واطبع في أربعة أسطر: عدد الأعداد التي تقبل القسمة على 3، ثم الأعداد الفردية بينها مسافة، ثم متوسط الأعداد الموجبة، ثم مجموع الأعداد السالبة.',
    code: P('int a[6];\n// اكتب الحل هنا\n'), ref: P('int a[6], d3 = 0, pos = 0, posSum = 0, negSum = 0;\nfor (int i = 0; i < 6; i++) {\n    cin >> a[i];\n    if (a[i] % 3 == 0) d3++;\n    if (a[i] > 0) {\n        posSum += a[i];\n        pos++;\n    }\n    if (a[i] < 0) negSum += a[i];\n}\ncout << d3 << endl;\nfor (int i = 0; i < 6; i++)\n    if (a[i] % 2 != 0)\n        cout << a[i] << " ";\ncout << endl;\ncout << (double) posSum / pos << endl;\ncout << negSum;'), inputs: ['3 6 9 -5 -11 8', '1 2 3 4 5 -6'] },
  { id: 'be2', title: 'عشرة أعداد: المضاعفات والأكبر والأصغر', task: 'اقرأ 10 أعداد في مصفوفة، واطبع في ثلاثة أسطر: مجموع الأعداد التي تقبل القسمة على 4، ثم أكبر عدد، ثم أصغر عدد.',
    code: P('int x[10];\n// اكتب الحل هنا\n'), ref: P('int x[10], s4 = 0;\nfor (int i = 0; i < 10; i++) {\n    cin >> x[i];\n    if (x[i] % 4 == 0) s4 += x[i];\n}\nint big = x[0], small = x[0];\nfor (int i = 1; i < 10; i++) {\n    if (x[i] > big) big = x[i];\n    if (x[i] < small) small = x[i];\n}\ncout << s4 << endl << big << endl << small;'), inputs: ['2 4 8 12 20 40 88 66 30 20', '-4 7 3 9 1 0 5 -8 6 2'] },
  { id: 'be3', title: 'مضاعفة عناصر المواقع الزوجية', task: 'اقرأ n ثم n عددًا في مصفوفة. اضرب العناصر الموجودة في المواقع الزوجية (0، 2، 4، ...) في 2، ثم اطبع المصفوفة بينها مسافة.',
    code: P('int A[100], n;\ncin >> n;\n// اكتب الحل هنا\n'), ref: P('int A[100], n;\ncin >> n;\nfor (int i = 0; i < n; i++)\n    cin >> A[i];\nfor (int i = 0; i < n; i += 2)\n    A[i] *= 2;\nfor (int i = 0; i < n; i++)\n    cout << A[i] << " ";'), inputs: ['5 1 2 3 4 5', '1 7', '4 10 20 30 40'] },
  { id: 'be4', title: 'مجموع الفردية في مدى', task: 'اقرأ عددين a و b، واطبع مجموع الأعداد الفردية المحصورة بينهما (دون a و b). مثال: 500 5000.',
    code: P('int a, b;\ncin >> a >> b;\n// اكتب الحل هنا\n'), ref: P('int a, b, sum = 0;\ncin >> a >> b;\nfor (int i = a + 1; i < b; i++)\n    if (i % 2 != 0)\n        sum += i;\ncout << sum;'), inputs: ['500 5000', '1 10', '4 5'] },
]);
})();
