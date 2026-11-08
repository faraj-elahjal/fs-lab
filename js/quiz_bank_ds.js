/* Data Structures — question bank (extra self-test and essay questions in the style of the course exams) */
(function () {
const { F } = window.FS_Q, add = window.FS_addQuiz;
const NODE = 'struct Node {\n    int data;\n    Node* next;\n};';
const PUSHB = 'void insertEnd(Node*& head, int x) {\n    Node* n = new Node;\n    n->data = x;\n    n->next = nullptr;\n    if (head == nullptr) {\n        head = n;\n        return;\n    }\n    Node* p = head;\n    while (p->next != nullptr)\n        p = p->next;\n    p->next = n;\n}';
const PRINT = 'void printList(Node* head) {\n    for (Node* p = head; p != nullptr; p = p->next)\n        cout << p->data << " ";\n    cout << endl;\n}';
const READ = 'Node* head = nullptr;\nint n, x;\ncin >> n;\nfor (int i = 0; i < n; i++) {\n    cin >> x;\n    insertEnd(head, x);\n}';
const TNODE = 'struct Node {\n    int key;\n    Node* left;\n    Node* right;\n};';
const INS = 'Node* insert(Node* root, int k) {\n    if (root == nullptr) {\n        Node* n = new Node;\n        n->key = k;\n        n->left = nullptr;\n        n->right = nullptr;\n        return n;\n    }\n    if (k < root->key)\n        root->left = insert(root->left, k);\n    else\n        root->right = insert(root->right, k);\n    return root;\n}';
const TREAD = 'Node* root = nullptr;\nint n, x;\ncin >> n;\nfor (int i = 0; i < n; i++) {\n    cin >> x;\n    root = insert(root, x);\n}';
const STK = 'int st[50];\nint top = -1;\n\nvoid push(int x) {\n    st[++top] = x;\n}\n\nint pop() {\n    return st[top--];\n}\n\nbool isEmpty() {\n    return top == -1;\n}';
const ess = (id, title, task, fns, fnsRef, body, bodyRef, inputs) => ({ id, title, task, code: F(fns, body), ref: F(fnsRef, bodyRef), inputs });

add('ds1', [
  { k: 'mcq', q: 'أي هيكل بيانات يخزّن عناصر من النوع نفسه (homogeneous) في مواقع متتالية؟', opts: ['المصفوفات Arrays', 'السجلات Records', 'المؤشرات Pointers', 'لا شيء مما سبق'], a: 0, why: 'السجل struct قد يجمع أنواعًا مختلفة، أما المصفوفة فكل عناصرها من نوع واحد.' },
  { k: 'mcq', q: 'ما المقصود بتجريد البيانات (Data Abstraction)؟', opts: ['حذف البيانات غير المهمة', 'فصل الخصائص المنطقية لنوع البيانات عن طريقة تنفيذه', 'ضغط البيانات لتقليل حجمها', 'تحويل البيانات إلى أرقام'], a: 1, why: 'نعرف ماذا يفعل النوع (العمليات) دون أن نهتم بكيف نُفِّذ داخليًا. وهذا أساس الـ ADT.' },
  { k: 'mcq', q: 'أي مجموعة كلها هياكل بيانات <b>ديناميكية</b>؟', opts: ['المصفوفة الثابتة، السجل', 'القائمة المترابطة، المكدس بالقائمة، الطابور بالقائمة، الشجرة', 'int و double', 'المصفوفة الثنائية فقط'], a: 1, why: 'الهياكل الديناميكية يتغير حجمها أثناء التشغيل بحجز العقد بـ new وتحريرها بـ delete.' },
  { k: 'mcq', q: 'أي التعريفات التالية هو الصحيح للمؤشرات <code>h</code> و <code>t</code> و <code>b</code> إلى عقد؟', opts: ['<code>Node *h, t, b;</code>', '<code>Node *h, *t, *b;</code>', '<code>Node h*, t*, b*;</code>', '<code>Node* (h, t, b);</code>'], a: 1, why: 'في <code>Node *h, t, b;</code> المؤشر هو h فقط، أما t و b فعقدتان عاديتان. كل مؤشر يحتاج نجمته.' },
], []);

add('ds2', [
  { k: 'out', code: F(NODE + '\n\n' + PUSHB + '\n\n' + PRINT, 'Node* head = nullptr;\nfor (int i = 1; i <= 5; i++)\n    if (i % 2)\n        insertEnd(head, i * i);\nprintList(head);') },
], [
  ess('bds2a', 'تبديل العقدتين الأولى والثانية', 'اكتب الدالة <code>void swapFirstTwo(Node*&amp; head)</code> التي تبدّل مكان أول عقدتين بتغيير الروابط (وليس القيم). إذا كانت في القائمة أقل من عقدتين لا تفعل شيئًا.',
    NODE + '\n\n' + PUSHB + '\n\n' + PRINT + '\n\nvoid swapFirstTwo(Node*& head) {\n    // اكتب الحل هنا\n}',
    NODE + '\n\n' + PUSHB + '\n\n' + PRINT + '\n\nvoid swapFirstTwo(Node*& head) {\n    if (head == nullptr || head->next == nullptr)\n        return;\n    Node* a = head;\n    Node* b = head->next;\n    a->next = b->next;\n    b->next = a;\n    head = b;\n}',
    READ + '\nswapFirstTwo(head);\nprintList(head);', READ + '\nswapFirstTwo(head);\nprintList(head);', ['4 1 2 3 4', '2 9 8', '1 5']),
]);

add('ds3', [
  { k: 'mcq', q: 'لحذف العقدة رقم N من <b>نهاية</b> قائمة أحادية بطريقة العدّ، ما الخطوة الأولى؟', opts: ['حذف head مباشرة', 'عدّ عقد القائمة c، ثم الوصول إلى العقدة رقم c - N من البداية', 'عكس القائمة دائمًا', 'المرور من النهاية إلى البداية باستخدام next'], a: 1, why: 'القائمة الأحادية لا يمكن المرور عليها للخلف، فنحسب موقع العقدة من البداية: c - N.' },
], [
  ess('bds3a', 'حذف العقدة رقم N من النهاية', 'اكتب الدالة <code>void delFromEnd(Node*&amp; head, int N)</code> التي تحذف العقدة رقم N من نهاية القائمة (N = 1 تعني آخر عقدة). افترض أن N صحيح.',
    NODE + '\n\n' + PUSHB + '\n\n' + PRINT + '\n\nvoid delFromEnd(Node*& head, int N) {\n    // اكتب الحل هنا\n}',
    NODE + '\n\n' + PUSHB + '\n\n' + PRINT + '\n\nvoid delFromEnd(Node*& head, int N) {\n    int c = 0;\n    for (Node* p = head; p != nullptr; p = p->next)\n        c++;\n    int k = c - N;\n    if (k == 0) {\n        Node* t = head;\n        head = head->next;\n        delete t;\n        return;\n    }\n    Node* prev = head;\n    for (int i = 1; i < k; i++)\n        prev = prev->next;\n    Node* t = prev->next;\n    prev->next = t->next;\n    delete t;\n}',
    READ + '\nint N;\ncin >> N;\ndelFromEnd(head, N);\nprintList(head);', READ + '\nint N;\ncin >> N;\ndelFromEnd(head, N);\nprintList(head);', ['5 1 2 3 4 5 2', '5 1 2 3 4 5 5', '3 7 8 9 1']),
  ess('bds3b', 'تقاطع قائمتين', 'اكتب الدالة <code>Node* intersect(Node* a, Node* b)</code> التي تُرجع قائمة جديدة فيها القيم الموجودة في القائمتين معًا (بترتيب ظهورها في a، ودون تكرار). اطبع النتيجة، وإذا كانت فارغة اطبع <code>empty</code>.',
    NODE + '\n\n' + PUSHB + '\n\n' + PRINT + '\n\nNode* intersect(Node* a, Node* b) {\n    // اكتب الحل هنا\n    return nullptr;\n}',
    NODE + '\n\n' + PUSHB + '\n\n' + PRINT + '\n\nbool has(Node* h, int x) {\n    for (Node* p = h; p != nullptr; p = p->next)\n        if (p->data == x)\n            return true;\n    return false;\n}\n\nNode* intersect(Node* a, Node* b) {\n    Node* r = nullptr;\n    for (Node* p = a; p != nullptr; p = p->next)\n        if (has(b, p->data) && !has(r, p->data))\n            insertEnd(r, p->data);\n    return r;\n}',
    'Node* a = nullptr;\nNode* b = nullptr;\nint n, x;\ncin >> n;\nfor (int i = 0; i < n; i++) {\n    cin >> x;\n    insertEnd(a, x);\n}\ncin >> n;\nfor (int i = 0; i < n; i++) {\n    cin >> x;\n    insertEnd(b, x);\n}\nNode* r = intersect(a, b);\nif (r == nullptr)\n    cout << "empty";\nelse\n    printList(r);',
    'Node* a = nullptr;\nNode* b = nullptr;\nint n, x;\ncin >> n;\nfor (int i = 0; i < n; i++) {\n    cin >> x;\n    insertEnd(a, x);\n}\ncin >> n;\nfor (int i = 0; i < n; i++) {\n    cin >> x;\n    insertEnd(b, x);\n}\nNode* r = intersect(a, b);\nif (r == nullptr)\n    cout << "empty";\nelse\n    printList(r);',
    ['5 1 2 3 4 5 4 4 2 9 1', '3 1 2 3 2 7 8', '4 5 5 6 6 3 6 5 5']),
]);

add('ds4', [
  { k: 'mcq', q: 'عند حذف عقدة d من وسط قائمة <b>ثنائية</b> الربط، ما الربطان اللذان نعدّلهما؟', opts: ['<code>d-&gt;next = nullptr</code> فقط', '<code>d-&gt;prev-&gt;next = d-&gt;next</code> و <code>d-&gt;next-&gt;prev = d-&gt;prev</code>', '<code>head = d</code>', 'لا نعدّل شيئًا، نكتفي بـ delete d'], a: 1, why: 'السابق يشير إلى التالي، والتالي يشير إلى السابق، ثم نحرر d.' },
], []);

add('ds5', [
  { k: 'mcq', q: 'أي هيكل بيانات يُستخدم لتنفيذ الاستدعاء الذاتي (Recursion)؟', opts: ['المكدس Stack', 'الطابور Queue', 'القائمة List', 'المصفوفة Array'], a: 0, why: 'كل استدعاء يُدفع في مكدس الاستدعاءات، ويخرج آخر استدعاء أولًا (LIFO).' },
  { k: 'mcq', q: 'ما قيمة التعبير اللاحق (postfix) التالي: <code dir="ltr">6 3 2 4 + - *</code>؟', opts: ['74', '-18', '22', '40'], a: 1, why: '2 + 4 = 6، ثم 3 - 6 = -3، ثم 6 × -3 = -18.' },
  { k: 'mcq', q: 'ما الصيغة اللاحقة (postfix) للتعبير <code dir="ltr">a*(b+a)/c-x</code>؟', opts: ['<code dir="ltr">a b a + * c / x -</code>', '<code dir="ltr">a b * a + c / x -</code>', '<code dir="ltr">a b a * + c x / -</code>', '<code dir="ltr">* a + b a / c - x</code>'], a: 0, why: 'الأقواس أولًا: b a +، ثم الضرب في a، ثم القسمة على c، ثم طرح x.' },
  { k: 'mcq', q: 'ما الصيغة اللاحقة (postfix) للتعبير <code dir="ltr">x+y*z-(a*(a+b))</code>؟', opts: ['<code dir="ltr">x y z * + a a b + * -</code>', '<code dir="ltr">x y + z * a a b + * -</code>', '<code dir="ltr">x y z + * a a * b + -</code>', '<code dir="ltr">x y z * a a b + * + -</code>'], a: 0 },
  { k: 'out', code: F(STK, 'push(3);\npush(5);\npush(4);\npush(6);\nint t[4], n = 0;\nwhile (!isEmpty()) {\n    int x = pop(), f = 1;\n    for (int i = 2; i <= x; i++)\n        f *= i;\n    t[n++] = f;\n}\nfor (int i = n - 1; i >= 0; i--)\n    push(t[i]);\nwhile (!isEmpty())\n    cout << pop() << " ";') },
], [
  ess('bds5a', 'أكبر عنصر في المكدس', 'الدوال push و pop و isEmpty جاهزة. اقرأ n ثم n عددًا وادفعها في المكدس. اكتب الدالة <code>int stackMax()</code> التي تُرجع أكبر عنصر في المكدس <b>مع الحفاظ عليه كما هو</b> (أخرج العناصر إلى مكدس مساعد ثم أعدها). اطبع الأكبر ثم اطبع المكدس بإخراجه.',
    STK + '\n\nint stackMax() {\n    // اكتب الحل هنا\n    return 0;\n}',
    STK + '\n\nint stackMax() {\n    int tmp[50], k = 0, m = st[top];\n    while (!isEmpty()) {\n        int x = pop();\n        if (x > m) m = x;\n        tmp[k++] = x;\n    }\n    while (k > 0)\n        push(tmp[--k]);\n    return m;\n}',
    'int n, x;\ncin >> n;\nfor (int i = 0; i < n; i++) {\n    cin >> x;\n    push(x);\n}\ncout << stackMax() << endl;\nwhile (!isEmpty())\n    cout << pop() << " ";',
    'int n, x;\ncin >> n;\nfor (int i = 0; i < n; i++) {\n    cin >> x;\n    push(x);\n}\ncout << stackMax() << endl;\nwhile (!isEmpty())\n    cout << pop() << " ";', ['5 3 9 2 7 1', '1 -4', '4 -1 -5 -2 -8']),
  ess('bds5b', 'العناصر الزوجية بالعكس', 'الدوال جاهزة. اقرأ n ثم n عددًا وادفعها في المكدس. اطبع العناصر الزوجية فقط بترتيب إخراجها من المكدس، مع إبقاء العناصر الفردية في المكدس، ثم اطبع في السطر التالي ما بقي في المكدس بإخراجه.',
    STK, STK,
    'int n, x;\ncin >> n;\nfor (int i = 0; i < n; i++) {\n    cin >> x;\n    push(x);\n}\n// اكتب الحل هنا\n',
    'int n, x;\ncin >> n;\nfor (int i = 0; i < n; i++) {\n    cin >> x;\n    push(x);\n}\nint odd[50], k = 0;\nwhile (!isEmpty()) {\n    int y = pop();\n    if (y % 2 == 0)\n        cout << y << " ";\n    else\n        odd[k++] = y;\n}\ncout << endl;\nwhile (k > 0)\n    push(odd[--k]);\nwhile (!isEmpty())\n    cout << pop() << " ";', ['6 1 2 3 4 5 6', '3 7 9 11', '4 2 4 6 8']),
]);

add('ds6', [
  { k: 'mcq', q: 'في الطابور الدائري بمصفوفة حجمها SIZE وبمتغير count لعدد العناصر، متى يكون الطابور ممتلئًا؟', opts: ['<code>front == 0</code>', '<code>count == SIZE</code>', '<code>rear == front</code> دائمًا', '<code>count == 0</code>'], a: 1, why: 'عدد العناصر وصل إلى سعة المصفوفة. وبدون count يُستخدم الشرط <code>(rear + 1) % SIZE == front</code> مع ترك خانة فارغة.' },
  { k: 'mcq', q: 'لماذا نستخدم <code>(rear + 1) % SIZE</code> في الطابور الدائري؟', opts: ['لترتيب العناصر', 'حتى يرجع المؤشر إلى أول المصفوفة بعد آخر خانة ونستفيد من الأماكن التي فرغت', 'لحساب عدد العناصر', 'لحذف العنصر الأخير'], a: 1 },
], [
  ess('bds6a', 'عدّ الفردي والزوجي في الطابور', 'الطابور الدائري جاهز (enqueue و dequeue و count). اقرأ n ثم n عددًا وأدخلها في الطابور. اطبع عدد العناصر الفردية ثم الزوجية بينهما مسافة <b>مع إبقاء الطابور كما هو</b>، ثم اطبع عناصره بإخراجها في السطر التالي.',
    'const int MAX = 10;\nint q[MAX], front = 0, rear = -1, count = 0;\n\nvoid enqueue(int x) {\n    rear = (rear + 1) % MAX;\n    q[rear] = x;\n    count++;\n}\n\nint dequeue() {\n    int x = q[front];\n    front = (front + 1) % MAX;\n    count--;\n    return x;\n}',
    'const int MAX = 10;\nint q[MAX], front = 0, rear = -1, count = 0;\n\nvoid enqueue(int x) {\n    rear = (rear + 1) % MAX;\n    q[rear] = x;\n    count++;\n}\n\nint dequeue() {\n    int x = q[front];\n    front = (front + 1) % MAX;\n    count--;\n    return x;\n}',
    'int n, x;\ncin >> n;\nfor (int i = 0; i < n; i++) {\n    cin >> x;\n    enqueue(x);\n}\n// اكتب الحل هنا\n',
    'int n, x;\ncin >> n;\nfor (int i = 0; i < n; i++) {\n    cin >> x;\n    enqueue(x);\n}\nint odd = 0, even = 0;\nfor (int i = 0; i < n; i++) {\n    int y = dequeue();\n    if (y % 2 == 0) even++;\n    else odd++;\n    enqueue(y);\n}\ncout << odd << " " << even << endl;\nwhile (count > 0)\n    cout << dequeue() << " ";', ['5 1 2 3 4 5', '3 2 4 6', '1 7']),
]);

add('ds8', [
  { k: 'mcq', q: 'عند حذف عقدة لها <b>ابنان</b> من شجرة البحث الثنائية، ماذا نفعل؟', opts: ['نحذفها ونحذف أبناءها', 'نضع مكانها أصغر قيمة في الفرع الأيمن (أو أكبر قيمة في الفرع الأيسر) ثم نحذف تلك العقدة', 'نضع مكانها الجذر', 'لا يمكن حذفها'], a: 1, why: 'هكذا تبقى خاصية BST صحيحة: كل ما في اليسار أصغر وكل ما في اليمين أكبر.' },
  { k: 'mcq', q: 'إلى ماذا يرمز الاختصار AVL في شجرة AVL؟', opts: ['Array Value List', 'أسماء مخترعيها Adelson-Velsky و Landis', 'Automatic Value Loader', 'Average Value Level'], a: 1, why: 'شجرة AVL شجرة بحث ثنائية متوازنة: الفرق بين ارتفاعي الفرعين لأي عقدة لا يزيد على 1.' },
  { k: 'mcq', q: 'ما الحالات الثلاث عند حذف عقدة من BST؟', opts: ['جذر، ورقة، فرع', 'عقدة ورقة بلا أبناء، عقدة لها ابن واحد، عقدة لها ابنان', 'قيمة موجبة، سالبة، صفر', 'يسار، يمين، وسط'], a: 1 },
], [
  ess('bds8a', 'نسخ مستوى معيّن إلى مصفوفة', 'اكتب الدالة <code>void copyLevel(Node* r, int level, int a[], int &amp;k)</code> التي تنسخ مفاتيح العقد الموجودة في المستوى المطلوب (الجذر مستوى 0) من اليسار إلى اليمين إلى المصفوفة a. اطبع العناصر، وإذا كان المستوى فارغًا اطبع <code>empty</code>.',
    TNODE + '\n\n' + INS + '\n\nvoid copyLevel(Node* r, int level, int a[], int &k) {\n    // اكتب الحل هنا\n}',
    TNODE + '\n\n' + INS + '\n\nvoid copyLevel(Node* r, int level, int a[], int &k) {\n    if (r == nullptr)\n        return;\n    if (level == 0) {\n        a[k++] = r->key;\n        return;\n    }\n    copyLevel(r->left, level - 1, a, k);\n    copyLevel(r->right, level - 1, a, k);\n}',
    TREAD + '\nint L, a[50], k = 0;\ncin >> L;\ncopyLevel(root, L, a, k);\nif (k == 0)\n    cout << "empty";\nfor (int i = 0; i < k; i++)\n    cout << a[i] << " ";',
    TREAD + '\nint L, a[50], k = 0;\ncin >> L;\ncopyLevel(root, L, a, k);\nif (k == 0)\n    cout << "empty";\nfor (int i = 0; i < k; i++)\n    cout << a[i] << " ";', ['7 50 30 70 20 40 60 80 2', '7 50 30 70 20 40 60 80 1', '3 5 3 8 0', '2 1 2 5']),
]);

add('ds9', [
  { k: 'mcq', q: 'رتّب <code dir="ltr">100 15 -3 60 0 11 -150 9</code> تصاعديًا بالترتيب بالإدراج (Insertion Sort). ما شكل المصفوفة بعد إدراج أول <b>ثلاثة</b> عناصر بعد الأول (أي بعد 3 دورات)؟', opts: ['<code dir="ltr">-3 15 60 100 0 11 -150 9</code>', '<code dir="ltr">-150 -3 0 15 100 60 11 9</code>', '<code dir="ltr">15 100 -3 60 0 11 -150 9</code>', '<code dir="ltr">-3 15 100 60 0 11 -150 9</code>'], a: 0, why: 'الدورة 1 تُدرج 15، والدورة 2 تُدرج -3، والدورة 3 تُدرج 60. الجزء الأول (أول 4 عناصر) يصبح مرتبًا وبقية العناصر لم تتغير.' },
  { k: 'mcq', q: 'في الترتيب بالاختيار (Selection Sort) للبيانات <code dir="ltr">100 15 -3 60 0 11 -150 9</code>، ما شكل المصفوفة بعد الدورة الأولى؟', opts: ['<code dir="ltr">-150 15 -3 60 0 11 100 9</code>', '<code dir="ltr">15 100 -3 60 0 11 -150 9</code>', '<code dir="ltr">-150 -3 15 60 0 11 100 9</code>', '<code dir="ltr">15 -3 60 0 11 -150 9 100</code>'], a: 0, why: 'نبحث عن أصغر عنصر (-150) ونبدّله مع العنصر الأول (100).' },
  { k: 'out', code: F('void insertionSort(int a[], int n) {\n    for (int i = 1; i < n; i++) {\n        int t = a[i], j = i - 1;\n        while (j >= 0 && a[j] > t) {\n            a[j + 1] = a[j];\n            j--;\n        }\n        a[j + 1] = t;\n        if (i <= 3) {\n            for (int k = 0; k < n; k++)\n                cout << a[k] << " ";\n            cout << endl;\n        }\n    }\n}', 'int a[8] = {100, 15, -3, 60, 0, 11, -150, 9};\ninsertionSort(a, 8);') },
], []);

add('ds10', [
  { k: 'mcq', q: 'أي مما يلي <b>ليس</b> شرطًا لاستخدام البحث الثنائي؟', opts: ['أن تكون القائمة مرتبة', 'إمكانية الوصول المباشر إلى العنصر الأوسط في أي جزء', 'وجود آلية لحذف العناصر أو إضافتها في القائمة', 'لا شيء مما سبق'], a: 2, why: 'البحث الثنائي يحتاج قائمة مرتبة ووصولًا مباشرًا للوسط فقط، والحذف والإضافة لا علاقة لهما به.' },
  { k: 'mcq', q: 'نبحث بالبحث الثنائي عن 78 في المصفوفة (الأدلة من 0 إلى 14):<br><code dir="ltr">9 15 23 44 51 51 78 82 99 100 120 125 131 199 200</code><br>ما قيم mid بالترتيب حتى نجد 78؟', opts: ['<code dir="ltr">7 → 3 → 5 → 6</code>', '<code dir="ltr">7 → 6</code>', '<code dir="ltr">0 → 1 → ... → 6</code>', '<code dir="ltr">7 → 11 → 9</code>'], a: 0, why: 'L=0 R=14 → mid=7 (82 أكبر) → R=6 → mid=3 (44 أصغر) → L=4 → mid=5 (51 أصغر) → L=6 → mid=6 وجدنا 78.' },
  { k: 'out', code: F('int binSearch(int a[], int n, int v) {\n    int L = 0, R = n - 1;\n    while (L <= R) {\n        int mid = (L + R) / 2;\n        cout << "L=" << L << " R=" << R << " mid=" << mid << endl;\n        if (a[mid] == v)\n            return mid;\n        if (v < a[mid])\n            R = mid - 1;\n        else\n            L = mid + 1;\n    }\n    return -1;\n}', 'int a[17] = {9, 15, 23, 44, 51, 51, 78, 82, 99, 100, 120, 125, 131, 199, 200, 398, 422};\ncout << binSearch(a, 17, 190);') },
], [
  ess('bds10a', 'البحث الثنائي مع عدد المقارنات', 'اقرأ n ثم n عددًا مرتبًا تصاعديًا ثم القيمة المطلوبة v. نفّذ البحث الثنائي واطبع دليل v (أو -1 إذا لم توجد) ثم عدد مرات حساب mid بينهما مسافة.',
    '', '',
    'int a[100], n, v;\ncin >> n;\nfor (int i = 0; i < n; i++)\n    cin >> a[i];\ncin >> v;\n// اكتب الحل هنا\n',
    'int a[100], n, v;\ncin >> n;\nfor (int i = 0; i < n; i++)\n    cin >> a[i];\ncin >> v;\nint L = 0, R = n - 1, pos = -1, c = 0;\nwhile (L <= R) {\n    int mid = (L + R) / 2;\n    c++;\n    if (a[mid] == v) {\n        pos = mid;\n        break;\n    }\n    if (v < a[mid])\n        R = mid - 1;\n    else\n        L = mid + 1;\n}\ncout << pos << " " << c;',
    ['15 9 15 23 44 51 51 78 82 99 100 120 125 131 199 200 78', '17 9 15 23 44 51 51 78 82 99 100 120 125 131 199 200 398 422 182', '5 1 3 5 7 9 1']),
]);
})();
