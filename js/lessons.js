/* Programming 1 lessons for the FS lab: concept (formal Arabic), ready examples, auto-checked challenges.
   Each example: {id, title, note?, code, input?}. Each challenge: {id, title, task, code (starter), tests: [{input, output}]} */
(function () {
const P = (body) => `#include <iostream>\nusing namespace std;\n\nint main() {\n${body.replace(/^/gm, '    ').replace(/^\s+$/gm, '')}\n    return 0;\n}\n`;
const PM = (body) => `#include <iostream>\n#include <cmath>\nusing namespace std;\n\nint main() {\n${body.replace(/^/gm, '    ').replace(/^\s+$/gm, '')}\n    return 0;\n}\n`;

window.FS_LESSONS = [
{
  course: 'برمجة 1', id: 'vars', title: 'المتغيرات وأنواع البيانات', tag: 'L1 · C++',
  concept: `<p><b>المتغير</b> موقع في الذاكرة يُحجز لتخزين قيمة، وله اسم ونوع وقيمة يمكن أن تتغير أثناء التنفيذ.</p>
    <ul><li>الأنواع: <code>int</code> صحيح، <code>double</code> عشري، <code>char</code> حرف، <code>bool</code> منطقي، <code>string</code> نص.</li>
    <li>الإسناد <code>=</code> يُنفَّذ من اليمين إلى اليسار.</li>
    <li><code>cout</code> للإخراج مع <code>&lt;&lt;</code>، و <code>cin</code> للإدخال مع <code>&gt;&gt;</code>.</li></ul>`,
  examples: [
    { id: 'v1', title: 'تعريف المتغيرات وطباعتها', code: P(`int age = 20;\ndouble price = 12.5;\nchar grade = 'A';\nstring name = "Ali";\nbool ok = true;\ncout << name << " " << age << endl;\ncout << price << " " << grade << " " << ok;`) },
    { id: 'v2', title: 'الإسناد: x = x + 2', code: P(`int x = 5;\nx = x + 2;\ncout << x;`) },
    { id: 'v3', title: 'تتبع امتحان: تبديل قيمتين', note: 'بدون متغير ثالث', code: P(`int a = 5, b = 3;\na = a + b;\nb = a - b;\na = a - b;\ncout << a << " " << b << endl;\nint c = a * 2;\nc = c + a;\ncout << "c = " << c;`) },
    { id: 'v4', title: 'الإدخال بـ cin', code: P(`int age;\ncout << "Enter your age: ";\ncin >> age;\ncout << "Next year: " << age + 1 << endl;`), input: '19' },
    { id: 'v5', title: 'متغير دون قيمة ابتدائية', note: 'ماذا يحدث عند استخدامه؟', code: P(`int x;\ncout << x << endl;\nx = 10;\ncout << x;`) },
    { id: 'v6', title: 'الثوابت const', code: P(`const double PI = 3.14;\ndouble r = 2;\ndouble area = PI * r * r;\ncout << "Area = " << area;`) },
  ],
  challenges: [
    { id: 'vc1', title: 'مساحة المستطيل ومحيطه', task: 'اقرأ طول المستطيل ثم عرضه، واطبع المساحة في سطر ثم المحيط في السطر التالي، دون أي نص إضافي. مثال: المدخلات <code>5 3</code> والناتج <code>15</code> ثم <code>16</code>.',
      code: P(`double len, wid;\n// اكتب الحل هنا\n`), tests: [{ input: '5 3', output: '15\n16' }, { input: '2.5 4', output: '10\n13' }, { input: '7 7', output: '49\n28' }] },
    { id: 'vc2', title: 'تبديل قيمتين', task: 'اقرأ عددين صحيحين في a و b، ثم بدّل قيمتيهما واطبع a ثم b بينهما مسافة. مثال: المدخلات <code>4 9</code> والناتج <code>9 4</code>.',
      code: P(`int a, b;\ncin >> a >> b;\n// بدّل القيمتين هنا\n\ncout << a << " " << b;`), tests: [{ input: '4 9', output: '9 4' }, { input: '-1 7', output: '7 -1' }, { input: '5 5', output: '5 5' }] },
  ],
},
{
  course: 'برمجة 1', id: 'arith', title: 'العمليات الحسابية', tag: 'L2 · C++',
  concept: `<p><b>التعبير الحسابي</b> يتكون من معاملات تربط بينها عوامل، ويُحسب لينتج قيمة واحدة.</p>
    <ul><li>قسمة صحيحين ناتجها صحيح: <code>7 / 2 = 3</code>، و <code>%</code> باقي القسمة للصحيح فقط.</li>
    <li>الأولوية: الأقواس، ثم <code>* / %</code>، ثم <code>+ -</code>، والمستوى الواحد من اليسار إلى اليمين.</li>
    <li><code>x++</code> تستخدم القيمة ثم تزيد، و <code>++x</code> تزيد ثم تستخدم.</li></ul>`,
  examples: [
    { id: 'a1', title: 'القسمة الصحيحة والعشرية', code: P(`cout << 7 / 2 << endl;\ncout << 7.0 / 2 << endl;\ncout << 9 / 10 << endl;\ncout << 17 % 5;`) },
    { id: 'a2', title: 'أولويات التنفيذ', code: P(`int r = 2 + 3 * 4 - 8 / 2 % 3;\ncout << r << endl;\nint avg1 = 4 + 8 / 2;\nint avg2 = (4 + 8) / 2;\ncout << avg1 << " " << avg2;`) },
    { id: 'a3', title: 'تحويل الأنواع (casting)', code: P(`int sum = 7, count = 2;\ndouble a = sum / count;\ndouble b = (double)sum / count;\nint c = 9.8;\ncout << a << " " << b << " " << c;`) },
    { id: 'a4', title: 'x++ و ++x', code: P(`int x = 5;\nint y = x++;\ncout << x << " " << y << endl;\nint z = ++x;\ncout << x << " " << z;`) },
    { id: 'a5', title: 'تفكيك العدد إلى خاناته', code: P(`int n = 472;\nint ones = n % 10;\nint tens = n / 10 % 10;\nint hundreds = n / 100;\ncout << hundreds << " " << tens << " " << ones;`) },
    { id: 'a6', title: 'تتبع امتحان', code: P(`int a = 17, b = 5;\nint q = a / b;\nint r = a % b;\ndouble d = a / b;\ndouble e = (double)a / b;\na += r * 2;\ncout << q << " " << r << endl;\ncout << d << " " << e << endl;\ncout << a % 4 + b * 2;`) },
    { id: 'a7', title: 'الدوال الرياضية cmath', code: PM(`cout << pow(2, 3) << endl;\ncout << sqrt(16) << endl;\ncout << abs(-7);`) },
  ],
  challenges: [
    { id: 'ac1', title: 'مجموع خانات عدد ثلاثي', task: 'اقرأ عددًا صحيحًا من ثلاث خانات، واطبع مجموع خاناته فقط. مثال: <code>472</code> ناتجه <code>13</code>.',
      code: P(`int n;\ncin >> n;\n// اكتب الحل هنا\n`), tests: [{ input: '472', output: '13' }, { input: '905', output: '14' }, { input: '100', output: '1' }] },
    { id: 'ac2', title: 'تحويل الثواني', task: 'اقرأ عددًا من الثواني، واطبع الساعات ثم الدقائق ثم الثواني في سطر واحد بينها مسافات. مثال: <code>3725</code> ناتجه <code>1 2 5</code>.',
      code: P(`int s;\ncin >> s;\n// اكتب الحل هنا\n`), tests: [{ input: '3725', output: '1 2 5' }, { input: '59', output: '0 0 59' }, { input: '7200', output: '2 0 0' }] },
  ],
},
{
  course: 'برمجة 1', id: 'cond', title: 'الجمل الشرطية و switch', tag: 'L3 · C++',
  concept: `<p><b>الجملة الشرطية</b> تجعل البرنامج يتخذ قرارًا: إذا تحقق الشرط نُفِّذت أوامر معينة، وإلا تُجووزت أو نُفِّذت أوامر أخرى.</p>
    <ul><li>المقارنة بـ <code>==</code> وليس <code>=</code>.</li>
    <li>في سلسلة <code>else if</code> يُنفَّذ أول شرط صحيح فقط.</li>
    <li><code>&amp;&amp;</code> تحتاج الشرطين، و <code>||</code> يكفيها أحدهما.</li>
    <li><code>switch</code> مع int و char، وبدون <code>break</code> يستمر التنفيذ.</li></ul>`,
  examples: [
    { id: 'c1', title: 'زوجي أم فردي', code: P(`int n;\ncin >> n;\nif (n % 2 == 0)\n    cout << "Even";\nelse\n    cout << "Odd";`), input: '7' },
    { id: 'c2', title: 'التقديرات بـ else if', code: P(`int mark;\ncin >> mark;\nif (mark >= 85)\n    cout << "A";\nelse if (mark >= 75)\n    cout << "B";\nelse if (mark >= 65)\n    cout << "C";\nelse if (mark >= 50)\n    cout << "D";\nelse\n    cout << "F";`), input: '78' },
    { id: 'c3', title: 'العوامل المنطقية والتحقق من النطاق', code: P(`int mark;\ncin >> mark;\nif (mark >= 0 && mark <= 100) {\n    if (mark >= 50)\n        cout << "Pass";\n    else\n        cout << "Fail";\n} else {\n    cout << "Invalid mark";\n}`), input: '120' },
    { id: 'c4', title: 'switch: أيام الأسبوع', code: P(`int day;\ncin >> day;\nswitch (day) {\n    case 1:\n        cout << "Saturday";\n        break;\n    case 2:\n        cout << "Sunday";\n        break;\n    case 3:\n        cout << "Monday";\n        break;\n    default:\n        cout << "Other day";\n}`), input: '2' },
    { id: 'c5', title: 'switch بدون break', note: 'ماذا يُطبع؟', code: P(`int n = 2;\nswitch (n) {\n    case 1: cout << "one ";\n    case 2: cout << "two ";\n    case 3: cout << "three ";\n        break;\n    default: cout << "other";\n}`) },
    { id: 'c6', title: 'تتبع امتحان', code: P(`int x = 7, y = 3;\nif (x > 5 && y > 5)\n    cout << "A";\nelse if (x > 5 || y > 5)\n    cout << "B";\nelse\n    cout << "C";\nif (x % 2 == 1)\n    y = y + x;\nif (y > 9)\n    cout << " " << y;\nelse\n    cout << " small";`) },
    { id: 'c7', title: 'أخطاء: = بدل == و ; بعد if', note: 'شاهد التنبيهات', code: P(`int x = 3;\nif (x = 5)\n    cout << "five" << endl;\nif (x > 10);\n    cout << "big";`) },
  ],
  challenges: [
    { id: 'cc1', title: 'موجب أم سالب أم صفر', task: 'اقرأ عددًا صحيحًا واطبع <code>Positive</code> أو <code>Negative</code> أو <code>Zero</code>.',
      code: P(`int n;\ncin >> n;\n// اكتب الحل هنا\n`), tests: [{ input: '5', output: 'Positive' }, { input: '-3', output: 'Negative' }, { input: '0', output: 'Zero' }] },
    { id: 'cc2', title: 'أكبر ثلاثة أعداد', task: 'اقرأ ثلاثة أعداد صحيحة، واطبع أكبرها فقط.',
      code: P(`int a, b, c;\ncin >> a >> b >> c;\n// اكتب الحل هنا\n`), tests: [{ input: '4 9 2', output: '9' }, { input: '7 3 7', output: '7' }, { input: '-5 -2 -9', output: '-2' }, { input: '1 2 3', output: '3' }] },
    { id: 'cc3', title: 'الآلة الحاسبة بـ switch', task: 'اقرأ عددًا ثم عملية (+ أو - أو * أو /) ثم عددًا، واطبع الناتج. وإذا كانت القسمة على صفر اطبع <code>Error</code>. مثال: <code>8 / 2</code> ناتجه <code>4</code>.',
      code: P(`double a, b;\nchar op;\ncin >> a >> op >> b;\n// اكتب الحل هنا\n`), tests: [{ input: '3 + 4', output: '7' }, { input: '8 / 2', output: '4' }, { input: '5 * 1.5', output: '7.5' }, { input: '9 / 0', output: 'Error' }, { input: '2 - 6', output: '-4' }] },
  ],
},
{
  course: 'برمجة 1', id: 'for', title: 'الحلقة التكرارية for', tag: 'L4 · C++',
  concept: `<p><b>الحلقة التكرارية</b> تكرر تنفيذ أوامر ما دام شرطها صحيحًا، وتُستخدم <b>for</b> غالبًا عندما يكون عدد التكرارات معروفًا.</p>
    <ul><li>الترتيب: التهيئة مرة واحدة، ثم الشرط، ثم الجسم، ثم التحديث، ثم الشرط...</li>
    <li><code>i = a; i &lt; b</code> تدور b - a مرة، ومع <code>&lt;=</code> مرة إضافية.</li>
    <li>تابع <b>جدول التتبع</b> أثناء التنفيذ: كل صف دورة.</li></ul>`,
  examples: [
    { id: 'f1', title: 'جمع الأعداد من 1 إلى 5', code: P(`int sum = 0;\nfor (int i = 1; i <= 5; i++)\n    sum = sum + i;\ncout << "sum = " << sum;`) },
    { id: 'f2', title: 'العد التنازلي والزيادة بـ 2', code: P(`for (int i = 10; i >= 1; i -= 3)\n    cout << i << " ";\ncout << endl;\nfor (int i = 0; i < 10; i += 2)\n    cout << i << " ";`) },
    { id: 'f3', title: 'المضروب', code: P(`int n = 5;\nint f = 1;\nfor (int i = 1; i <= n; i++)\n    f = f * i;\ncout << n << "! = " << f;`) },
    { id: 'f4', title: 'متوسط n عدد', code: P(`int n;\ndouble x, sum = 0;\ncin >> n;\nfor (int i = 1; i <= n; i++) {\n    cin >> x;\n    sum += x;\n}\ncout << "Average = " << sum / n;`), input: '4 10 20 30 40' },
    { id: 'f5', title: 'حلقتان متداخلتان: مثلث نجوم', code: P(`for (int i = 1; i <= 4; i++) {\n    for (int j = 1; j <= i; j++)\n        cout << "*";\n    cout << endl;\n}`) },
    { id: 'f6', title: 'break و continue', code: P(`for (int i = 1; i <= 10; i++) {\n    if (i == 6)\n        break;\n    if (i % 2 == 0)\n        continue;\n    cout << i << " ";\n}`) },
    { id: 'f7', title: 'تتبع امتحان', code: P(`int s = 0;\nfor (int i = 1; i <= 10; i += 3) {\n    s += i;\n    cout << i << " ";\n}\ncout << endl << s;`) },
  ],
  challenges: [
    { id: 'fc1', title: 'مجموع الفردية وعددها', task: 'اقرأ عددًا n، واطبع مجموع الأعداد الفردية من 1 إلى n ثم عددها، بينهما مسافة. مثال: <code>7</code> ناتجه <code>16 4</code>.',
      code: P(`int n;\ncin >> n;\n// اكتب الحل هنا\n`), tests: [{ input: '7', output: '16 4' }, { input: '1', output: '1 1' }, { input: '10', output: '25 5' }] },
    { id: 'fc2', title: 'جدول الضرب', task: 'اقرأ عددًا n، واطبع جدول ضربه من 1 إلى 10، كل سطر بالشكل <code>n x i = ناتج</code>. مثال لأول سطر عند 3: <code>3 x 1 = 3</code>.',
      code: P(`int n;\ncin >> n;\n// اكتب الحل هنا\n`), tests: [{ input: '3', output: Array.from({ length: 10 }, (_, i) => `3 x ${i + 1} = ${3 * (i + 1)}`).join('\n') }, { input: '7', output: Array.from({ length: 10 }, (_, i) => `7 x ${i + 1} = ${7 * (i + 1)}`).join('\n') }] },
    { id: 'fc3', title: 'نمط الأرقام', task: 'اقرأ عددًا n، واطبع n سطرًا: السطر i يحتوي على الأرقام من 1 إلى i متلاصقة. مثال عند 3: <code>1</code> ثم <code>12</code> ثم <code>123</code>.',
      code: P(`int n;\ncin >> n;\n// اكتب الحل هنا\n`), tests: [{ input: '3', output: '1\n12\n123' }, { input: '5', output: '1\n12\n123\n1234\n12345' }] },
  ],
},
{
  course: 'برمجة 1', id: 'while', title: 'حلقتا while و do-while', tag: 'L5 · C++',
  concept: `<p><b>حلقة while</b> تختبر الشرط قبل كل دورة، وتُستخدم عندما يكون عدد التكرارات غير معروف مسبقًا. أما <b>do-while</b> فتنفّذ الجسم أولًا ثم تختبر الشرط، فتُنفَّذ مرة على الأقل.</p>
    <ul><li>التهيئة قبل الحلقة، والتحديث داخل جسمها، ونسيانه يجعل الحلقة لا تنتهي.</li>
    <li><b>القيمة الحارسة</b> قيمة خاصة تُنهي الإدخال، مثل -1.</li></ul>`,
  examples: [
    { id: 'w1', title: 'مجموع خانات العدد', code: P(`int n = 472, s = 0;\nwhile (n > 0) {\n    s = s + n % 10;\n    n = n / 10;\n}\ncout << s;`) },
    { id: 'w2', title: 'القيمة الحارسة -1', code: P(`int x, sum = 0, count = 0;\ncin >> x;\nwhile (x != -1) {\n    sum += x;\n    count++;\n    cin >> x;\n}\ncout << "sum = " << sum << ", count = " << count;`), input: '5 8 2 -1' },
    { id: 'w3', title: 'التحقق من الإدخال', code: P(`int mark;\ncin >> mark;\nwhile (mark < 0 || mark > 100) {\n    cout << "Invalid, try again: ";\n    cin >> mark;\n}\ncout << "OK: " << mark;`), input: '120 -5 87' },
    { id: 'w4', title: 'while أم do-while؟', note: 'الشرط خطأ من البداية', code: P(`int x = 10;\nwhile (x < 5) {\n    cout << "while ";\n    x++;\n}\ndo {\n    cout << "do-while ";\n    x++;\n} while (x < 5);`) },
    { id: 'w5', title: 'عكس العدد', code: P(`int n = 1234, r = 0;\nwhile (n != 0) {\n    r = r * 10 + n % 10;\n    n = n / 10;\n}\ncout << r;`) },
    { id: 'w6', title: 'تتبع امتحان', code: P(`int a = 1, b = 20;\nwhile (a < b) {\n    a = a * 2;\n    b = b - 3;\n    cout << a << " " << b << endl;\n}\ncout << "end " << a + b;`) },
    { id: 'w7', title: 'خطأ: حلقة لا تنتهي', note: 'التحديث منسي', code: P(`int i = 1;\nwhile (i <= 5)\n    cout << i;`) },
  ],
  challenges: [
    { id: 'wc1', title: 'عدد الخانات', task: 'اقرأ عددًا صحيحًا موجبًا، واطبع عدد خاناته. مثال: <code>45021</code> ناتجه <code>5</code>.',
      code: P(`int n;\ncin >> n;\n// اكتب الحل هنا\n`), tests: [{ input: '45021', output: '5' }, { input: '7', output: '1' }, { input: '1000', output: '4' }] },
    { id: 'wc2', title: 'المجموع حتى الصفر', task: 'اقرأ أعدادًا حتى يُدخل المستخدم 0، واطبع مجموعها. مثال: <code>4 6 10 0</code> ناتجه <code>20</code>.',
      code: P(`int x, sum = 0;\n// اكتب الحل هنا\n`), tests: [{ input: '4 6 10 0', output: '20' }, { input: '0', output: '0' }, { input: '-3 5 0', output: '2' }] },
    { id: 'wc3', title: 'العدد مقلوبًا', task: 'اقرأ عددًا صحيحًا موجبًا، واطبع العدد بعد عكس خاناته. مثال: <code>1234</code> ناتجه <code>4321</code>.',
      code: P(`int n;\ncin >> n;\n// اكتب الحل هنا\n`), tests: [{ input: '1234', output: '4321' }, { input: '5', output: '5' }, { input: '908', output: '809' }] },
  ],
},
{
  course: 'برمجة 1', id: 'p1arr', title: 'المصفوفات الأحادية', tag: 'L6 · C++',
  concept: `<p><b>المصفوفة</b> مجموعة من الخانات المتتالية في الذاكرة، كلها من النوع نفسه وتحت اسم واحد. نصل إلى كل خانة برقمها (الفهرس) بين قوسين مربعين: <code>a[0]</code>، <code>a[1]</code>، ...</p>
    <ul><li>التعريف: <code>int a[5];</code> يحجز 5 خانات من النوع int، أو مع قيم ابتدائية: <code>int a[5] = {4, 7, 1, 9, 3};</code></li>
    <li>الفهرس يبدأ من <b>0</b>، وآخر فهرس هو <b>الحجم − 1</b>. في <code>int a[5]</code> الفهارس من 0 إلى 4.</li>
    <li>نمر على كل العناصر بحلقة: <code>for (int i = 0; i &lt; 5; i++)</code> ونستخدم <code>a[i]</code> داخلها، للإدخال أو الطباعة أو الجمع.</li>
    <li>الفهرس خارج الحدود (مثل <code>a[5]</code> في مصفوفة حجمها 5) خطأ شائع، والمختبر ينبّهك إليه.</li></ul>`,
  examples: [
    { id: 'r1', title: 'تعريف المصفوفة والوصول إلى عناصرها', code: P(`int a[5] = {4, 7, 1, 9, 3};\ncout << a[0] << " " << a[4] << endl;\na[2] = 100;\nfor (int i = 0; i < 5; i++)\n    cout << a[i] << " ";`) },
    { id: 'r2', title: 'إدخال العناصر بحلقة والمجموع والمتوسط', code: P(`int a[5];\nint sum = 0;\nfor (int i = 0; i < 5; i++) {\n    cin >> a[i];\n    sum += a[i];\n}\ncout << "sum = " << sum << endl;\ncout << "avg = " << (double) sum / 5;`), input: '8 3 10 6 4' },
    { id: 'r3', title: 'أكبر عنصر وأصغر عنصر', code: P(`int a[6] = {12, 5, 30, 7, 30, 1};\nint mx = a[0], mn = a[0];\nfor (int i = 1; i < 6; i++) {\n    if (a[i] > mx)\n        mx = a[i];\n    if (a[i] < mn)\n        mn = a[i];\n}\ncout << "max = " << mx << ", min = " << mn;`) },
    { id: 'r4', title: 'البحث عن قيمة', note: 'البحث الخطي مع break', code: P(`int a[6] = {5, 8, 2, 9, 8, 4};\nint x, pos = -1;\ncin >> x;\nfor (int i = 0; i < 6; i++) {\n    if (a[i] == x) {\n        pos = i;\n        break;\n    }\n}\nif (pos == -1)\n    cout << "not found";\nelse\n    cout << "found at " << pos;`), input: '9' },
    { id: 'r5', title: 'عدّ الزوجي والفردي', code: P(`int a[7] = {3, 6, 9, 12, 7, 10, 1};\nint even = 0, odd = 0;\nfor (int i = 0; i < 7; i++) {\n    if (a[i] % 2 == 0)\n        even++;\n    else\n        odd++;\n}\ncout << "even = " << even << ", odd = " << odd;`) },
    { id: 'r6', title: 'نسخ المصفوفة بالعكس', code: P(`int a[5] = {1, 2, 3, 4, 5};\nint b[5];\nfor (int i = 0; i < 5; i++)\n    b[i] = a[4 - i];\nfor (int i = 0; i < 5; i++)\n    cout << b[i] << " ";`) },
    { id: 'r7', title: 'تتبع امتحان: كل عنصر يجمع ما قبله', code: P(`int a[5] = {2, 3, 1, 4, 5};\nfor (int i = 1; i < 5; i++)\n    a[i] = a[i] + a[i - 1];\nfor (int i = 0; i < 5; i++)\n    cout << a[i] << " ";`) },
    { id: 'r8', title: 'خطأ: فهرس خارج الحدود', note: 'i <= 5 بدل i < 5', code: P(`int a[5] = {1, 2, 3, 4, 5};\nfor (int i = 0; i <= 5; i++)\n    cout << a[i] << " ";`) },
  ],
  challenges: [],
},
{
  course: 'برمجة 1', id: 'exam', title: 'مراجعة الامتحان', tag: 'Exam · C++',
  concept: `<p>أسئلة تتبع ومقالي بأسلوب الامتحان تجمع مواضيع برمجة 1 كلها.</p>
    <ul><li>في التتبع: حاول توقّع الناتج أولًا، ثم نفّذ خطوة بخطوة وقارن.</li>
    <li>في التحديات: اكتب البرنامج كاملًا ثم اضغط «تحقّق من الحل».</li></ul>`,
  examples: [
    { id: 'e1', title: 'تتبع 1: القسمة والإسناد المركب', code: P(`int a = 7, b = 2;\ndouble c = a / b;\ndouble d = (double)a / b;\na %= 4;\nb += a * 3;\ncout << c << " " << d << endl;\ncout << a << " " << b;`) },
    { id: 'e2', title: 'تتبع 2: الشروط و switch', code: P(`int x = 15;\nif (x % 3 == 0 && x % 5 == 0)\n    cout << "FizzBuzz";\nelse if (x % 3 == 0)\n    cout << "Fizz";\nelse\n    cout << x;\ncout << endl;\nswitch (x / 5) {\n    case 1: cout << "one ";\n    case 3: cout << "three ";\n    case 4: cout << "four";\n        break;\n    default: cout << "other";\n}`) },
    { id: 'e3', title: 'تتبع 3: حلقتان متداخلتان', code: P(`int count = 0;\nfor (int i = 1; i <= 4; i++) {\n    for (int j = i; j <= 4; j++) {\n        if ((i + j) % 2 == 0)\n            count++;\n    }\n}\ncout << count;`) },
    { id: 'e4', title: 'تتبع 4: while مع break', code: P(`int n = 48, steps = 0;\nwhile (n != 1) {\n    if (n % 2 == 0)\n        n = n / 2;\n    else\n        n = n * 3 + 1;\n    steps++;\n    if (steps == 5)\n        break;\n}\ncout << n << " " << steps;`) },
    { id: 'e5', title: 'هرم النجوم', code: P(`int n;\ncin >> n;\nfor (int i = 1; i <= n; i++) {\n    for (int s = 1; s <= n - i; s++)\n        cout << " ";\n    for (int k = 1; k <= 2 * i - 1; k++)\n        cout << "*";\n    cout << endl;\n}`), input: '4' },
  ],
  challenges: [
    { id: 'ec1', title: 'العدد الأولي', task: 'اقرأ عددًا صحيحًا، واطبع <code>Prime</code> إذا كان أوليًا، وإلا <code>Not prime</code>.',
      code: P(`int n;\ncin >> n;\n// اكتب الحل هنا\n`), tests: [{ input: '7', output: 'Prime' }, { input: '9', output: 'Not prime' }, { input: '2', output: 'Prime' }, { input: '1', output: 'Not prime' }, { input: '97', output: 'Prime' }] },
    { id: 'ec2', title: 'نوع المثلث', task: 'اقرأ أطوال ثلاثة أضلاع. اطبع <code>Not a triangle</code> إذا لم تكوّن مثلثًا، وإلا اطبع <code>Equilateral</code> أو <code>Isosceles</code> أو <code>Scalene</code>.',
      code: P(`double a, b, c;\ncin >> a >> b >> c;\n// اكتب الحل هنا\n`), tests: [{ input: '3 3 3', output: 'Equilateral' }, { input: '5 5 8', output: 'Isosceles' }, { input: '3 4 5', output: 'Scalene' }, { input: '1 2 3', output: 'Not a triangle' }, { input: '2 7 2', output: 'Not a triangle' }] },
    { id: 'ec3', title: 'أكبر عدد وعدد السوالب', task: 'اقرأ عددًا n ثم n عددًا، واطبع أكبرها ثم عدد السالب منها، بينهما مسافة. مثال: <code>5  3 -2 8 -7 1</code> ناتجه <code>8 2</code>.',
      code: P(`int n;\ncin >> n;\n// اكتب الحل هنا\n`), tests: [{ input: '5 3 -2 8 -7 1', output: '8 2' }, { input: '3 -1 -5 -3', output: '-1 3' }, { input: '1 4', output: '4 0' }] },
  ],
},
];
})();
