/* Programming 1 — self-test questions and extra essay questions */
(function () {
const { P } = window.FS_Q, add = window.FS_addQuiz;

add('vars', [
  { k: 'mcq', q: 'أي نوع بيانات مناسب لتخزين متوسط درجات طالب مثل 85.5؟', opts: ['<code>int</code>', '<code>double</code>', '<code>char</code>', '<code>bool</code>'], a: 1, why: 'القيمة فيها كسر عشري، فنستخدم <code>double</code>.' },
  { k: 'mcq', q: 'أي اسم متغير <b>غير صالح</b> في C++؟', opts: ['<code>total_sum</code>', '<code>_count</code>', '<code>2ndValue</code>', '<code>value2</code>'], a: 2, why: 'لا يجوز أن يبدأ اسم المتغير برقم.' },
  { k: 'mcq', q: 'ما الفرق بين <code>\'A\'</code> و <code>"A"</code>؟', opts: ['لا فرق بينهما', 'الأول حرف واحد char والثاني نص string', 'الأول نص والثاني حرف', 'كلاهما خطأ'], a: 1, why: 'علامة التنصيص المفردة لحرف واحد، والمزدوجة للنص.' },
  { k: 'mcq', q: 'ما قيمة المتغير <code>x</code> بعد: <code>int x = 9.7;</code>', opts: ['9.7', '10', '9', 'خطأ في الترجمة'], a: 2, why: 'عند وضع قيمة عشرية في متغير صحيح يُحذف الجزء العشري (لا يُقرَّب).' },
  { k: 'mcq', q: 'ماذا يحدث عند تنفيذ <code>const int MAX = 10; MAX = 20;</code>؟', opts: ['تصبح MAX تساوي 20', 'تبقى 10 دون خطأ', 'خطأ: لا يجوز تغيير الثابت', 'تصبح 30'], a: 2, why: 'الثابت const لا يمكن تغيير قيمته بعد تعريفه.' },
  { k: 'mcq', q: 'أي عبارة تقرأ عددًا من المستخدم وتخزّنه في <code>n</code>؟', opts: ['<code>cout &gt;&gt; n;</code>', '<code>cin &lt;&lt; n;</code>', '<code>cin &gt;&gt; n;</code>', '<code>cout &lt;&lt; n;</code>'], a: 2, why: 'الإدخال بـ <code>cin</code> مع المعامل <code>&gt;&gt;</code>.' },
  { k: 'out', code: P('int a = 5;\nint b = a;\na = 8;\ncout << a << " " << b;') },
  { k: 'out', code: P('int x = 3;\nx = x * 2;\nx = x + 4;\ncout << x;') },
  { k: 'out', code: P('int a = 2, b = 7;\nint t = a;\na = b;\nb = t;\ncout << a << b << endl;\ncout << a + b;') },
  { k: 'out', code: P('char c = \'B\';\nbool f = false;\ndouble d = 2.50;\ncout << c << " " << f << " " << d;') },
], [
  { id: 'qv1', title: 'العمر بالأشهر والأيام', task: 'اقرأ عمر شخص بالسنوات (عدد صحيح)، ثم اطبع عمره بالأشهر في سطر وبالأيام في السطر التالي (اعتبر السنة 365 يومًا).',
    code: P('int years;\ncin >> years;\n// اكتب الحل هنا\n'), ref: P('int years;\ncin >> years;\ncout << years * 12 << endl;\ncout << years * 365;'), inputs: ['20', '1', '35'] },
  { id: 'qv2', title: 'ترتيب ثلاثة متغيرات بالتدوير', task: 'اقرأ ثلاثة أعداد a ثم b ثم c، ثم دوّر القيم بحيث تأخذ a قيمة b، وتأخذ b قيمة c، وتأخذ c قيمة a القديمة. اطبع a b c بينها مسافة.',
    code: P('int a, b, c;\ncin >> a >> b >> c;\n// اكتب الحل هنا\n'), ref: P('int a, b, c;\ncin >> a >> b >> c;\nint t = a;\na = b;\nb = c;\nc = t;\ncout << a << " " << b << " " << c;'), inputs: ['1 2 3', '9 5 7'] },
  { id: 'qv3', title: 'بطاقة طالب', task: 'اقرأ اسم الطالب (كلمة واحدة) ثم عمره ثم معدله، واطبعها بالشكل: <code>Name: Ali, Age: 20, GPA: 3.5</code>',
    code: P('string name;\nint age;\ndouble gpa;\n// اكتب الحل هنا\n'), ref: P('string name;\nint age;\ndouble gpa;\ncin >> name >> age >> gpa;\ncout << "Name: " << name << ", Age: " << age << ", GPA: " << gpa;'), inputs: ['Ali 20 3.5', 'Sara 19 3.75'] },
]);

add('arith', [
  { k: 'mcq', q: 'ما ناتج <code>7 / 2</code> في C++ إذا كان العددان من النوع int؟', opts: ['3.5', '3', '4', '2'], a: 1, why: 'قسمة عددين صحيحين تعطي عددًا صحيحًا ويُحذف الكسر.' },
  { k: 'mcq', q: 'ما ناتج <code>17 % 5</code>؟', opts: ['3', '2', '3.4', '5'], a: 1, why: '% يعطي باقي القسمة: 17 = 5×3 + 2.' },
  { k: 'mcq', q: 'ما ناتج <code>2 + 3 * 4</code>؟', opts: ['20', '14', '24', '9'], a: 1, why: 'الضرب أولوية أعلى من الجمع: 3×4 = 12 ثم 2 + 12.' },
  { k: 'mcq', q: 'أي عبارة <b>لا</b> تزيد قيمة x بمقدار 1؟', opts: ['<code>x++;</code>', '<code>x += 1;</code>', '<code>x = x + 1;</code>', '<code>x =+ 1;</code>'], a: 3, why: '<code>x =+ 1</code> تعني x = +1 أي تضع 1 في x.' },
  { k: 'mcq', q: 'كيف نحصل على 3.5 من <code>int a = 7, b = 2;</code>؟', opts: ['<code>a / b</code>', '<code>(double) a / b</code>', '<code>(double) (a / b)</code>', '<code>a % b</code>'], a: 1, why: 'نحوّل أحد العددين إلى double قبل القسمة. في الخيار الثالث تحدث القسمة الصحيحة أولًا فتعطي 3.0.' },
  { k: 'mcq', q: 'ما الذي يعطيه <code>n % 10</code>؟', opts: ['أول رقم في n', 'آخر رقم (رقم الآحاد) في n', 'عدد أرقام n', 'n بدون آخر رقم'], a: 1, why: 'باقي القسمة على 10 هو رقم الآحاد. أما <code>n / 10</code> فيحذف آخر رقم.' },
  { k: 'out', code: P('int a = 10, b = 3;\ncout << a / b << " " << a % b << endl;\ncout << a - b * 2;') },
  { k: 'out', code: P('int x = 5;\nx += 3;\nx *= 2;\nx -= 4;\nx /= 3;\ncout << x;') },
  { k: 'out', code: P('int i = 4;\nint j = i++;\nint k = ++i;\ncout << i << " " << j << " " << k;') },
  { k: 'out', code: P('double d = 7 / 2;\ndouble e = 7.0 / 2;\ncout << d << " " << e;') },
], [
  { id: 'qa1', title: 'تحويل الثواني', task: 'اقرأ عددًا من الثواني، واطبع ما يعادله بالساعات والدقائق والثواني بالشكل <code>h:m:s</code>. مثال: 3725 ← 1:2:5',
    code: P('int t;\ncin >> t;\n// اكتب الحل هنا\n'), ref: P('int t;\ncin >> t;\ncout << t / 3600 << ":" << t % 3600 / 60 << ":" << t % 60;'), inputs: ['3725', '59', '86399'] },
  { id: 'qa2', title: 'مساحة الدائرة ومحيطها', task: 'اقرأ نصف قطر دائرة r، واطبع مساحتها في سطر ومحيطها في السطر التالي. استخدم <code>3.14</code> قيمة لـ π.',
    code: P('double r;\ncin >> r;\n// اكتب الحل هنا\n'), ref: P('double r;\ncin >> r;\ncout << 3.14 * r * r << endl;\ncout << 2 * 3.14 * r;'), inputs: ['2', '10', '1.5'] },
  { id: 'qa3', title: 'عكس عدد من ثلاثة أرقام', task: 'اقرأ عددًا من ثلاثة أرقام واطبعه معكوسًا كعدد. مثال: 123 ← 321',
    code: P('int n;\ncin >> n;\n// اكتب الحل هنا\n'), ref: P('int n;\ncin >> n;\ncout << n % 10 * 100 + n / 10 % 10 * 10 + n / 100;'), inputs: ['123', '507', '999'] },
]);

add('cond', [
  { k: 'mcq', q: 'ما الخطأ الشائع في <code>if (x = 5)</code>؟', opts: ['لا يوجد خطأ', 'تضع 5 في x بدل المقارنة، والصحيح <code>==</code>', 'يجب كتابة <code>if x == 5</code>', 'يجب وضع <code>;</code> بعد القوس'], a: 1, why: '<code>=</code> إسناد، و <code>==</code> مقارنة.' },
  { k: 'mcq', q: 'متى يكون الشرط <code>a &gt; 0 &amp;&amp; b &gt; 0</code> صحيحًا؟', opts: ['إذا كان أحدهما موجبًا', 'إذا كان الاثنان موجبين', 'إذا كان الاثنان سالبين', 'دائمًا'], a: 1, why: '<code>&amp;&amp;</code> تحتاج أن يكون الشرطان صحيحين معًا.' },
  { k: 'mcq', q: 'كيف نختبر أن x بين 1 و 10 (شاملة)؟', opts: ['<code>1 &lt;= x &lt;= 10</code>', '<code>x &gt;= 1 &amp;&amp; x &lt;= 10</code>', '<code>x &gt;= 1 || x &lt;= 10</code>', '<code>x == 1 to 10</code>'], a: 1, why: 'الصيغة الرياضية <code>1 &lt;= x &lt;= 10</code> لا تعمل كما نتوقع في C++.' },
  { k: 'mcq', q: 'ماذا يحدث إذا نسينا <code>break</code> في نهاية case داخل switch؟', opts: ['خطأ في الترجمة', 'يستمر التنفيذ في الحالة التالية', 'يخرج البرنامج', 'لا يحدث شيء'], a: 1, why: 'بدون break يُكمل التنفيذ إلى الحالات التي بعدها (fall-through).' },
  { k: 'mcq', q: 'أي نوع <b>لا</b> يصلح أن يكون متغير switch؟', opts: ['<code>int</code>', '<code>char</code>', '<code>double</code>', '<code>bool</code>'], a: 2, why: 'switch يعمل مع الأنواع الصحيحة والحروف فقط.' },
  { k: 'mcq', q: 'ما قيمة <code>!(5 &gt; 3)</code>؟', opts: ['true', 'false', '5', '3'], a: 1, why: '5 &gt; 3 صحيح، والنفي <code>!</code> يقلبه إلى false.' },
  { k: 'out', code: P('int x = 7;\nif (x % 2 == 0)\n    cout << "even";\nelse\n    cout << "odd";') },
  { k: 'out', code: P('int g = 75;\nif (g >= 90)\n    cout << "A";\nelse if (g >= 80)\n    cout << "B";\nelse if (g >= 70)\n    cout << "C";\nelse\n    cout << "F";') },
  { k: 'out', code: P('int n = 2;\nswitch (n) {\n    case 1: cout << "one ";\n    case 2: cout << "two ";\n    case 3: cout << "three ";\n        break;\n    default: cout << "other";\n}') },
  { k: 'out', code: P('int a = 4, b = 9;\nif (a > 5 || b > 5)\n    cout << "yes ";\nif (a > 5 && b > 5)\n    cout << "both";\nelse\n    cout << "not both";') },
], [
  { id: 'qc1', title: 'أكبر ثلاثة أعداد', task: 'اقرأ ثلاثة أعداد صحيحة واطبع أكبرها.',
    code: P('int a, b, c;\ncin >> a >> b >> c;\n// اكتب الحل هنا\n'), ref: P('int a, b, c;\ncin >> a >> b >> c;\nint m = a;\nif (b > m) m = b;\nif (c > m) m = c;\ncout << m;'), inputs: ['3 9 4', '10 2 7', '-5 -2 -9', '6 6 1'] },
  { id: 'qc2', title: 'السنة الكبيسة', task: 'اقرأ سنة واطبع <code>Leap</code> إذا كانت كبيسة و <code>Not leap</code> إذا لم تكن. السنة كبيسة إذا قبلت القسمة على 4 ولم تقبل على 100، أو قبلت القسمة على 400.',
    code: P('int y;\ncin >> y;\n// اكتب الحل هنا\n'), ref: P('int y;\ncin >> y;\nif ((y % 4 == 0 && y % 100 != 0) || y % 400 == 0)\n    cout << "Leap";\nelse\n    cout << "Not leap";'), inputs: ['2024', '1900', '2000', '2023'] },
  { id: 'qc3', title: 'اسم اليوم', task: 'اقرأ رقمًا من 1 إلى 7 واطبع اسم اليوم بالإنجليزية (1 = Saturday، 2 = Sunday ... 7 = Friday) باستخدام switch. أي رقم آخر اطبع <code>Invalid</code>.',
    code: P('int d;\ncin >> d;\n// اكتب الحل هنا\n'), ref: P('int d;\ncin >> d;\nswitch (d) {\n    case 1: cout << "Saturday"; break;\n    case 2: cout << "Sunday"; break;\n    case 3: cout << "Monday"; break;\n    case 4: cout << "Tuesday"; break;\n    case 5: cout << "Wednesday"; break;\n    case 6: cout << "Thursday"; break;\n    case 7: cout << "Friday"; break;\n    default: cout << "Invalid";\n}'), inputs: ['1', '4', '7', '9'] },
]);

add('for', [
  { k: 'mcq', q: 'كم مرة تتكرر الحلقة <code>for (int i = 0; i &lt; 5; i++)</code>؟', opts: ['4', '5', '6', 'لا نهائية'], a: 1, why: 'i تأخذ 0، 1، 2، 3، 4 أي 5 مرات.' },
  { k: 'mcq', q: 'كم مرة تتكرر <code>for (int i = 1; i &lt;= 10; i += 3)</code>؟', opts: ['3', '4', '10', '3.3'], a: 1, why: 'i تأخذ 1، 4، 7، 10 أي 4 مرات.' },
  { k: 'mcq', q: 'ما مشكلة <code>for (int i = 0; i &lt; 5; i++);</code> والفاصلة المنقوطة في نهايتها؟', opts: ['لا مشكلة', 'جسم الحلقة يصبح فارغًا، والسطر التالي ينفَّذ مرة واحدة فقط', 'خطأ في الترجمة', 'تتكرر 6 مرات'], a: 1, why: '<code>;</code> بعد القوس تنهي الحلقة بجسم فارغ.' },
  { k: 'mcq', q: 'ما الذي يجعل الحلقة <code>for (int i = 10; i &gt; 0; i++)</code> مشكلة؟', opts: ['لا تتكرر أبدًا', 'حلقة لا نهائية لأن i تزيد ولا تصبح أبدًا ≤ 0', 'تتكرر 10 مرات', 'تتكرر مرة واحدة'], a: 1, why: 'يجب أن يقترب العداد من إنهاء الشرط، والصحيح هنا <code>i--</code>.' },
  { k: 'mcq', q: 'ماذا تفعل <code>continue</code> داخل الحلقة؟', opts: ['تُنهي الحلقة كليًا', 'تتخطى باقي التكرار الحالي وتنتقل للتكرار التالي', 'تُنهي البرنامج', 'تعيد الحلقة من البداية'], a: 1, why: '<code>break</code> تُنهي الحلقة، و <code>continue</code> تتخطى التكرار الحالي فقط.' },
  { k: 'mcq', q: 'لحساب مجموع الأعداد من 1 إلى n، بأي قيمة نبدأ المتغير sum؟', opts: ['1', '0', 'n', 'لا تهم'], a: 1, why: 'المجموع يبدأ من 0، أما حاصل الضرب فيبدأ من 1.' },
  { k: 'out', code: P('for (int i = 1; i <= 5; i++)\n    cout << i * i << " ";') },
  { k: 'out', code: P('int s = 0;\nfor (int i = 2; i <= 10; i += 2)\n    s += i;\ncout << s;') },
  { k: 'out', code: P('for (int i = 1; i <= 3; i++) {\n    for (int j = 1; j <= i; j++)\n        cout << "*";\n    cout << endl;\n}') },
  { k: 'out', code: P('for (int i = 1; i <= 10; i++) {\n    if (i % 3 == 0) continue;\n    if (i > 7) break;\n    cout << i << " ";\n}') },
], [
  { id: 'qf1', title: 'المضروب', task: 'اقرأ n واطبع n! (حاصل ضرب الأعداد من 1 إلى n). اعتبر 0! = 1.',
    code: P('int n;\ncin >> n;\n// اكتب الحل هنا\n'), ref: P('int n;\ncin >> n;\nint f = 1;\nfor (int i = 1; i <= n; i++)\n    f *= i;\ncout << f;'), inputs: ['5', '0', '7'] },
  { id: 'qf2', title: 'جدول الضرب', task: 'اقرأ عددًا n واطبع جدول ضربه من 1 إلى 10، كل سطر بالشكل <code>n x i = ناتج</code>. مثال: <code>3 x 2 = 6</code>',
    code: P('int n;\ncin >> n;\n// اكتب الحل هنا\n'), ref: P('int n;\ncin >> n;\nfor (int i = 1; i <= 10; i++)\n    cout << n << " x " << i << " = " << n * i << endl;'), inputs: ['3', '7'] },
  { id: 'qf3', title: 'أكبر عدد ومتوسط', task: 'اقرأ n ثم n عددًا صحيحًا. اطبع أكبر عدد في سطر، ومتوسط الأعداد (عشري) في السطر التالي.',
    code: P('int n, x;\ncin >> n;\n// اكتب الحل هنا\n'), ref: P('int n, x;\ncin >> n;\nint mx;\ndouble sum = 0;\nfor (int i = 0; i < n; i++) {\n    cin >> x;\n    if (i == 0 || x > mx) mx = x;\n    sum += x;\n}\ncout << mx << endl;\ncout << sum / n;'), inputs: ['4 3 8 1 6', '3 -2 -7 -1', '1 5'] },
]);

add('while', [
  { k: 'mcq', q: 'ما الفرق الأساسي بين <code>while</code> و <code>do-while</code>؟', opts: ['لا فرق', 'do-while تنفّذ جسمها مرة واحدة على الأقل لأن الشرط يُفحص في النهاية', 'while أسرع', 'do-while لا تقبل شروطًا مركبة'], a: 1, why: 'في do-while يُنفَّذ الجسم أولًا ثم يُفحص الشرط.' },
  { k: 'mcq', q: 'متى نفضّل while على for؟', opts: ['عندما نعرف عدد التكرارات مسبقًا', 'عندما لا نعرف عدد التكرارات مسبقًا ويتوقف التكرار على شرط', 'لا نستخدم while أبدًا', 'عند طباعة الأعداد فقط'], a: 1, why: 'مثل قراءة أعداد حتى يُدخل المستخدم 0.' },
  { k: 'mcq', q: 'كم مرة يُطبع Hi؟ <code>int i = 5; while (i &lt; 5) { cout &lt;&lt; "Hi"; i++; }</code>', opts: ['0', '1', '5', 'لا نهائي'], a: 0, why: 'الشرط 5 &lt; 5 خطأ من البداية فلا يُنفَّذ الجسم.' },
  { k: 'mcq', q: 'كم مرة يُطبع Hi؟ <code>int i = 5; do { cout &lt;&lt; "Hi"; i++; } while (i &lt; 5);</code>', opts: ['0', '1', '5', 'لا نهائي'], a: 1, why: 'do-while تنفّذ مرة واحدة قبل فحص الشرط.' },
  { k: 'mcq', q: 'ماذا يحدث في <code>int i = 0; while (i &lt; 3) cout &lt;&lt; i;</code>؟', opts: ['يطبع 012', 'حلقة لا نهائية لأن i لا تتغير', 'لا يطبع شيئًا', 'خطأ في الترجمة'], a: 1, why: 'نسيان تحديث المتغير داخل الحلقة يجعلها لا نهائية.' },
  { k: 'mcq', q: 'ما الحلقة الأنسب لقائمة خيارات (menu) تظهر للمستخدم مرة واحدة على الأقل؟', opts: ['for', 'while', 'do-while', 'switch'], a: 2, why: 'لأن القائمة يجب أن تظهر قبل أن يختار المستخدم.' },
  { k: 'out', code: P('int n = 1234, s = 0;\nwhile (n > 0) {\n    s += n % 10;\n    n /= 10;\n}\ncout << s;') },
  { k: 'out', code: P('int i = 10;\nwhile (i > 0) {\n    cout << i << " ";\n    i -= 3;\n}') },
  { k: 'out', code: P('int x = 1;\ndo {\n    x *= 2;\n} while (x < 50);\ncout << x;') },
  { k: 'out', code: P('int n, c = 0;\ncin >> n;\nwhile (n != 0) {\n    if (n > 0) c++;\n    cin >> n;\n}\ncout << c;'), input: '4 -2 7 9 -1 0' },
], [
  { id: 'qw1', title: 'عدد الأرقام', task: 'اقرأ عددًا صحيحًا موجبًا واطبع عدد أرقامه. مثال: 4096 ← 4',
    code: P('int n;\ncin >> n;\n// اكتب الحل هنا\n'), ref: P('int n;\ncin >> n;\nint c = 0;\ndo {\n    c++;\n    n /= 10;\n} while (n > 0);\ncout << c;'), inputs: ['4096', '7', '1000000'] },
  { id: 'qw2', title: 'المجموع حتى الصفر', task: 'اقرأ أعدادًا حتى يُدخل المستخدم 0، ثم اطبع مجموعها في سطر وعددها (دون الصفر) في السطر التالي.',
    code: P('int x;\n// اكتب الحل هنا\n'), ref: P('int x;\nint s = 0, c = 0;\ncin >> x;\nwhile (x != 0) {\n    s += x;\n    c++;\n    cin >> x;\n}\ncout << s << endl << c;'), inputs: ['5 3 2 0', '0', '10 -4 7 1 0'] },
  { id: 'qw3', title: 'العدد الأولي', task: 'اقرأ عددًا n أكبر من 1، واطبع <code>Prime</code> إذا كان أوليًا (لا يقبل القسمة إلا على 1 وعلى نفسه) وإلا اطبع <code>Not prime</code>.',
    code: P('int n;\ncin >> n;\n// اكتب الحل هنا\n'), ref: P('int n;\ncin >> n;\nint d = 2;\nbool prime = true;\nwhile (d * d <= n) {\n    if (n % d == 0) prime = false;\n    d++;\n}\nif (prime) cout << "Prime";\nelse cout << "Not prime";'), inputs: ['7', '12', '97', '2', '49'] },
]);

add('exam', [
  { k: 'mcq', q: 'ما ناتج <code>5 / 2 * 2</code> لأعداد صحيحة؟', opts: ['5', '4', '6', '5.0'], a: 1, why: '5 / 2 = 2 (قسمة صحيحة)، ثم 2 × 2 = 4.' },
  { k: 'mcq', q: 'ما قيمة <code>10 % 3 + 10 / 3</code>؟', opts: ['4', '3', '6.33', '1'], a: 0, why: '10 % 3 = 1 و 10 / 3 = 3، والمجموع 4.' },
  { k: 'mcq', q: 'أي شرط يختبر أن العدد n زوجي وموجب؟', opts: ['<code>n % 2 == 0 || n &gt; 0</code>', '<code>n % 2 == 0 &amp;&amp; n &gt; 0</code>', '<code>n / 2 == 0 &amp;&amp; n &gt; 0</code>', '<code>n % 2 == 1 &amp;&amp; n &gt; 0</code>'], a: 1 },
  { k: 'mcq', q: 'ما آخر قيمة لـ i <b>بعد</b> انتهاء <code>int i; for (i = 0; i &lt; 4; i++) {}</code>؟', opts: ['3', '4', '5', '0'], a: 1, why: 'تخرج الحلقة عندما تصبح i = 4 ويفشل الشرط 4 &lt; 4.' },
  { k: 'mcq', q: 'متغير عُرِّف دون قيمة ابتدائية <code>int x;</code> ثم طُبع مباشرة. ما الذي يُطبع؟', opts: ['0', 'قيمة عشوائية (garbage)', 'خطأ في الترجمة', 'لا شيء'], a: 1, why: 'المتغير المحلي غير المهيّأ يحتوي قيمة عشوائية.' },
  { k: 'mcq', q: 'ما ناتج الشرط <code>3 &lt; 2 || 4 &gt; 1 &amp;&amp; 0</code>؟', opts: ['true', 'false', 'خطأ', '1 &gt; 0'], a: 1, why: '&amp;&amp; أولًا: 4 &gt; 1 &amp;&amp; 0 = false، ثم false || false = false.' },
  { k: 'out', code: P('int a = 3, b = 4;\nif (a * 2 > b)\n    a = a + b;\nelse\n    b = b - a;\ncout << a << " " << b;') },
  { k: 'out', code: P('int c = 0;\nfor (int i = 1; i <= 20; i++)\n    if (i % 4 == 0 || i % 6 == 0)\n        c++;\ncout << c;') },
  { k: 'out', code: P('int x = 100;\nint steps = 0;\nwhile (x > 1) {\n    x /= 2;\n    steps++;\n}\ncout << x << " " << steps;') },
  { k: 'out', code: P('for (int i = 3; i >= 1; i--) {\n    for (int j = 1; j <= 3; j++)\n        cout << (j <= i ? "#" : ".");\n    cout << endl;\n}') },
], [
  { id: 'qe1', title: 'تقدير الطالب', task: 'اقرأ درجة من 0 إلى 100 واطبع التقدير: 85 فأكثر <code>Excellent</code>، 75 فأكثر <code>Very good</code>، 65 فأكثر <code>Good</code>، 50 فأكثر <code>Pass</code>، أقل من 50 <code>Fail</code>. وإذا كانت الدرجة خارج المدى اطبع <code>Invalid</code>.',
    code: P('int g;\ncin >> g;\n// اكتب الحل هنا\n'), ref: P('int g;\ncin >> g;\nif (g < 0 || g > 100) cout << "Invalid";\nelse if (g >= 85) cout << "Excellent";\nelse if (g >= 75) cout << "Very good";\nelse if (g >= 65) cout << "Good";\nelse if (g >= 50) cout << "Pass";\nelse cout << "Fail";'), inputs: ['90', '77', '65', '50', '12', '120'] },
  { id: 'qe2', title: 'العدد التام', task: 'العدد التام يساوي مجموع قواسمه الأصغر منه (مثل 6 = 1 + 2 + 3). اقرأ n واطبع <code>Perfect</code> أو <code>Not perfect</code>.',
    code: P('int n;\ncin >> n;\n// اكتب الحل هنا\n'), ref: P('int n;\ncin >> n;\nint s = 0;\nfor (int i = 1; i < n; i++)\n    if (n % i == 0) s += i;\nif (s == n) cout << "Perfect";\nelse cout << "Not perfect";'), inputs: ['6', '28', '12', '496'] },
  { id: 'qe3', title: 'أعداد فيبوناتشي', task: 'اقرأ n واطبع أول n حدًّا من متتالية فيبوناتشي بينها مسافة: 0 1 1 2 3 5 8 ...',
    code: P('int n;\ncin >> n;\n// اكتب الحل هنا\n'), ref: P('int n;\ncin >> n;\nint a = 0, b = 1;\nfor (int i = 0; i < n; i++) {\n    cout << a << " ";\n    int t = a + b;\n    a = b;\n    b = t;\n}'), inputs: ['7', '1', '12'] },
]);
})();
