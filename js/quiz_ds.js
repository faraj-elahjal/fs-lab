/* Data Structures — self-test questions and extra essay questions */
(function () {
const { F } = window.FS_Q, add = window.FS_addQuiz;
const NODE = 'struct Node {\n    int data;\n    Node* next;\n};';
const PUSHF = 'void insertFront(Node*& head, int x) {\n    Node* n = new Node;\n    n->data = x;\n    n->next = head;\n    head = n;\n}';
const PUSHB = 'void insertEnd(Node*& head, int x) {\n    Node* n = new Node;\n    n->data = x;\n    n->next = nullptr;\n    if (head == nullptr) {\n        head = n;\n        return;\n    }\n    Node* p = head;\n    while (p->next != nullptr)\n        p = p->next;\n    p->next = n;\n}';
const PRINT = 'void printList(Node* head) {\n    for (Node* p = head; p != nullptr; p = p->next)\n        cout << p->data << " ";\n    cout << endl;\n}';
const READ = 'Node* head = nullptr;\nint n, x;\ncin >> n;\nfor (int i = 0; i < n; i++) {\n    cin >> x;\n    insertEnd(head, x);\n}';
const TNODE = 'struct Node {\n    int key;\n    Node* left;\n    Node* right;\n};';
const INS = 'Node* insert(Node* root, int k) {\n    if (root == nullptr) {\n        Node* n = new Node;\n        n->key = k;\n        n->left = nullptr;\n        n->right = nullptr;\n        return n;\n    }\n    if (k < root->key)\n        root->left = insert(root->left, k);\n    else\n        root->right = insert(root->right, k);\n    return root;\n}';
const TREAD = 'Node* root = nullptr;\nint n, x;\ncin >> n;\nfor (int i = 0; i < n; i++) {\n    cin >> x;\n    root = insert(root, x);\n}';
const STK = 'int st[50];\nint top = -1;\n\nvoid push(int x) {\n    st[++top] = x;\n}\n\nint pop() {\n    return st[top--];\n}\n\nbool isEmpty() {\n    return top == -1;\n}';
const ess = (id, title, task, fns, fnsRef, body, bodyRef, inputs) => ({ id, title, task, code: F(fns, body), ref: F(fnsRef, bodyRef), inputs });

add('ds1', [
  { k: 'mcq', q: 'مما تتكون العقدة (Node) في القائمة المترابطة الأحادية؟', opts: ['قيمة فقط', 'قيمة ومؤشر إلى العقدة التالية', 'مؤشرين فقط', 'مصفوفة'], a: 1 },
  { k: 'mcq', q: 'ما الذي يدل على نهاية القائمة؟', opts: ['عقدة قيمتها 0', 'المؤشر next لآخر عقدة يساوي nullptr', 'head يساوي nullptr', 'حجم ثابت'], a: 1 },
  { k: 'mcq', q: 'ما ميزة القائمة المترابطة على المصفوفة؟', opts: ['الوصول المباشر للعنصر i', 'حجمها يتغير أثناء التشغيل والإضافة والحذف لا يحتاجان إزاحة العناصر', 'تستهلك ذاكرة أقل دائمًا', 'أسرع في البحث'], a: 1 },
  { k: 'mcq', q: 'ما عيب القائمة المترابطة مقارنة بالمصفوفة؟', opts: ['حجمها ثابت', 'لا يمكن الوصول مباشرة إلى العنصر رقم i، بل نمرّ على العقد من البداية', 'لا تقبل أعدادًا سالبة', 'لا تُحذف'], a: 1 },
  { k: 'mcq', q: 'كيف نصل إلى قيمة العقدة الثانية من head؟', opts: ['<code>head-&gt;data</code>', '<code>head-&gt;next-&gt;data</code>', '<code>head[1]</code>', '<code>head.next.data</code>'], a: 1 },
  { k: 'mcq', q: 'لماذا نستخدم مؤشرًا مساعدًا <code>p</code> للمرور على القائمة بدل تحريك head؟', opts: ['لا فرق', 'حتى لا نفقد بداية القائمة', 'لأن head ثابت', 'لتوفير الذاكرة'], a: 1 },
  { k: 'out', code: F(NODE, 'Node* a = new Node;\nNode* b = new Node;\na->data = 5;\nb->data = 8;\na->next = b;\nb->next = nullptr;\ncout << a->data + a->next->data;') },
  { k: 'out', code: F(NODE + '\n\n' + PUSHF, 'Node* head = nullptr;\ninsertFront(head, 1);\ninsertFront(head, 2);\ninsertFront(head, 3);\nfor (Node* p = head; p != nullptr; p = p->next)\n    cout << p->data << " ";') },
  { k: 'out', code: F(NODE + '\n\n' + PUSHF, 'Node* head = nullptr;\nfor (int i = 1; i <= 4; i++)\n    insertFront(head, i * 10);\nint c = 0, s = 0;\nfor (Node* p = head; p != nullptr; p = p->next) {\n    c++;\n    s += p->data;\n}\ncout << c << " " << s;') },
], [
  ess('qds1a', 'طول القائمة ومجموعها', 'اكتب الدالتين <code>int length(Node* head)</code> و <code>int sum(Node* head)</code>. البرنامج الرئيسي يبني القائمة من الإدخال ويطبع النتيجتين.',
    NODE + '\n\n' + PUSHB + '\n\nint length(Node* head) {\n    // اكتب الحل هنا\n    return 0;\n}\n\nint sum(Node* head) {\n    // اكتب الحل هنا\n    return 0;\n}',
    NODE + '\n\n' + PUSHB + '\n\nint length(Node* head) {\n    int c = 0;\n    for (Node* p = head; p != nullptr; p = p->next)\n        c++;\n    return c;\n}\n\nint sum(Node* head) {\n    int s = 0;\n    for (Node* p = head; p != nullptr; p = p->next)\n        s += p->data;\n    return s;\n}',
    READ + '\ncout << length(head) << " " << sum(head);', READ + '\ncout << length(head) << " " << sum(head);', ['4 1 2 3 4', '0', '3 10 -5 7']),
  ess('qds1b', 'أكبر قيمة في القائمة', 'اكتب الدالة <code>int maxNode(Node* head)</code> التي تُرجع أكبر قيمة في قائمة غير فارغة.',
    NODE + '\n\n' + PUSHB + '\n\nint maxNode(Node* head) {\n    // اكتب الحل هنا\n    return 0;\n}',
    NODE + '\n\n' + PUSHB + '\n\nint maxNode(Node* head) {\n    int m = head->data;\n    for (Node* p = head->next; p != nullptr; p = p->next)\n        if (p->data > m) m = p->data;\n    return m;\n}',
    READ + '\ncout << maxNode(head);', READ + '\ncout << maxNode(head);', ['5 3 9 2 9 1', '3 -4 -1 -8']),
]);

add('ds2', [
  { k: 'mcq', q: 'لماذا نمرر head بالمرجع <code>Node*&amp; head</code> في دالة الإضافة في البداية؟', opts: ['لتسريع الدالة', 'لأن الدالة تغيّر head نفسه ليشير إلى العقدة الجديدة', 'لأن المؤشرات تُمرَّر هكذا دائمًا', 'لا حاجة لذلك'], a: 1 },
  { k: 'mcq', q: 'ما ترتيب الخطوات الصحيح للإضافة في البداية؟', opts: ['<code>head = n;</code> ثم <code>n-&gt;next = head;</code>', '<code>n-&gt;next = head;</code> ثم <code>head = n;</code>', 'الترتيب لا يهم', '<code>head-&gt;next = n;</code>'], a: 1, why: 'لو بدأنا بـ head = n لفقدنا القائمة القديمة.' },
  { k: 'mcq', q: 'ما الحالة الخاصة عند الإضافة في <b>النهاية</b>؟', opts: ['إذا كانت القائمة فارغة (head == nullptr) فتصبح العقدة الجديدة هي head', 'إذا كانت القيمة سالبة', 'لا توجد حالة خاصة', 'إذا كان طول القائمة زوجيًا'], a: 0 },
  { k: 'mcq', q: 'للإضافة في النهاية، متى نتوقف عند المرور على القائمة؟', opts: ['عندما <code>p == nullptr</code>', 'عندما <code>p-&gt;next == nullptr</code>', 'عند العقدة الأولى', 'بعد n خطوات دائمًا'], a: 1, why: 'نحتاج آخر عقدة حتى نربط next الخاص بها بالعقدة الجديدة.' },
  { k: 'mcq', q: 'أدخلنا 1 ثم 2 ثم 3 <b>في البداية</b>. كيف تبدو القائمة؟', opts: ['1 2 3', '3 2 1', '1 3 2', '2 1 3'], a: 1 },
  { k: 'mcq', q: 'للإضافة بعد العقدة p، أي ترتيب صحيح؟', opts: ['<code>p-&gt;next = n; n-&gt;next = p-&gt;next;</code>', '<code>n-&gt;next = p-&gt;next; p-&gt;next = n;</code>', '<code>n = p-&gt;next;</code>', '<code>p = n;</code>'], a: 1 },
  { k: 'out', code: F(NODE + '\n\n' + PUSHF + '\n\n' + PUSHB + '\n\n' + PRINT, 'Node* head = nullptr;\ninsertEnd(head, 1);\ninsertFront(head, 2);\ninsertEnd(head, 3);\ninsertFront(head, 4);\nprintList(head);') },
  { k: 'out', code: F(NODE + '\n\n' + PUSHB + '\n\n' + PRINT, 'Node* head = nullptr;\nfor (int i = 1; i <= 3; i++)\n    insertEnd(head, i);\nNode* n = new Node;\nn->data = 9;\nn->next = head->next;\nhead->next = n;\nprintList(head);') },
  { k: 'out', code: F(NODE + '\n\n' + PUSHF + '\n\n' + PRINT, 'Node* head = nullptr;\nint a[5] = {5, 1, 4, 2, 3};\nfor (int i = 0; i < 5; i++)\n    if (a[i] % 2 == 1)\n        insertFront(head, a[i]);\nprintList(head);') },
], [
  ess('qds2a', 'الإضافة في موقع', 'اكتب الدالة <code>void insertAt(Node*&amp; head, int pos, int x)</code> التي تضيف x بحيث يصبح فهرسه pos (0 تعني البداية). افترض أن pos بين 0 وطول القائمة.',
    NODE + '\n\n' + PUSHB + '\n\n' + PRINT + '\n\nvoid insertAt(Node*& head, int pos, int x) {\n    // اكتب الحل هنا\n}',
    NODE + '\n\n' + PUSHB + '\n\n' + PRINT + '\n\nvoid insertAt(Node*& head, int pos, int x) {\n    Node* n = new Node;\n    n->data = x;\n    if (pos == 0) {\n        n->next = head;\n        head = n;\n        return;\n    }\n    Node* p = head;\n    for (int i = 0; i < pos - 1; i++)\n        p = p->next;\n    n->next = p->next;\n    p->next = n;\n}',
    READ + '\nint pos, v;\ncin >> pos >> v;\ninsertAt(head, pos, v);\nprintList(head);', READ + '\nint pos, v;\ncin >> pos >> v;\ninsertAt(head, pos, v);\nprintList(head);', ['3 1 2 3 1 9', '3 1 2 3 0 9', '3 1 2 3 3 9', '0 0 5']),
  ess('qds2b', 'الإضافة مرتبة', 'اكتب الدالة <code>void insertSorted(Node*&amp; head, int x)</code> التي تضيف x في مكانه بحيث تبقى القائمة مرتبة تصاعديًا. البرنامج يقرأ أعدادًا ويضيفها بالترتيب ثم يطبع.',
    NODE + '\n\n' + PRINT + '\n\nvoid insertSorted(Node*& head, int x) {\n    // اكتب الحل هنا\n}',
    NODE + '\n\n' + PRINT + '\n\nvoid insertSorted(Node*& head, int x) {\n    Node* n = new Node;\n    n->data = x;\n    if (head == nullptr || x < head->data) {\n        n->next = head;\n        head = n;\n        return;\n    }\n    Node* p = head;\n    while (p->next != nullptr && p->next->data < x)\n        p = p->next;\n    n->next = p->next;\n    p->next = n;\n}',
    'Node* head = nullptr;\nint n, x;\ncin >> n;\nfor (int i = 0; i < n; i++) {\n    cin >> x;\n    insertSorted(head, x);\n}\nprintList(head);', 'Node* head = nullptr;\nint n, x;\ncin >> n;\nfor (int i = 0; i < n; i++) {\n    cin >> x;\n    insertSorted(head, x);\n}\nprintList(head);', ['5 4 1 3 5 2', '4 9 8 7 6', '3 2 2 1']),
]);

add('ds3', [
  { k: 'mcq', q: 'لحذف عقدة من وسط القائمة، أي عقدة نحتاج للوصول إليها؟', opts: ['العقدة نفسها فقط', 'العقدة التي <b>قبلها</b>', 'آخر عقدة', 'head فقط'], a: 1, why: 'لنربط next للعقدة السابقة بما بعد المحذوفة.' },
  { k: 'mcq', q: 'ما الخطوة التي تمنع تسرب الذاكرة عند حذف عقدة؟', opts: ['<code>p = nullptr;</code>', '<code>delete</code> للعقدة بعد فصلها', 'طباعة القائمة', 'لا شيء'], a: 1 },
  { k: 'mcq', q: 'ما الخطأ في: <code>delete p; p = p-&gt;next;</code>؟', opts: ['لا خطأ', 'نستخدم p بعد حذفه (مؤشر معلّق)، والصحيح حفظ التالي أولًا', 'يجب delete[]', 'p لا يتغير'], a: 1 },
  { k: 'mcq', q: 'لحذف أول عقدة:', opts: ['<code>head = head-&gt;next;</code> فقط', 'نحفظ head في t، ثم <code>head = head-&gt;next;</code> ثم <code>delete t;</code>', '<code>delete head;</code> فقط', '<code>head = nullptr;</code>'], a: 1 },
  { k: 'mcq', q: 'في البحث الخطي داخل القائمة، ما أسوأ عدد للمقارنات لقائمة طولها n؟', opts: ['1', 'n', 'log n', 'n²'], a: 1 },
  { k: 'mcq', q: 'ما الشرط الصحيح للمرور بحثًا عن x؟', opts: ['<code>while (p-&gt;data != x)</code>', '<code>while (p != nullptr &amp;&amp; p-&gt;data != x)</code>', '<code>while (p-&gt;data != x &amp;&amp; p != nullptr)</code>', '<code>while (p == nullptr)</code>'], a: 1, why: 'نفحص p != nullptr أولًا؛ وإلا قد نصل إلى p-&gt;data و p فارغ.' },
  { k: 'out', code: F(NODE + '\n\n' + PUSHB + '\n\n' + PRINT, 'Node* head = nullptr;\nfor (int i = 1; i <= 5; i++)\n    insertEnd(head, i);\nNode* p = head->next;\nNode* d = p->next;\np->next = d->next;\ndelete d;\nprintList(head);') },
  { k: 'out', code: F(NODE + '\n\n' + PUSHB, 'Node* head = nullptr;\nint a[6] = {4, 7, 1, 7, 3, 7};\nfor (int i = 0; i < 6; i++)\n    insertEnd(head, a[i]);\nint pos = 0, first = -1, c = 0;\nfor (Node* p = head; p != nullptr; p = p->next) {\n    if (p->data == 7) {\n        c++;\n        if (first == -1) first = pos;\n    }\n    pos++;\n}\ncout << first << " " << c;') },
  { k: 'out', code: F(NODE + '\n\n' + PUSHB + '\n\n' + PRINT, 'Node* head = nullptr;\nfor (int i = 1; i <= 4; i++)\n    insertEnd(head, i * 5);\nNode* t = head;\nhead = head->next;\ndelete t;\nprintList(head);') },
], [
  ess('qds3a', 'حذف قيمة', 'اكتب الدالة <code>void removeValue(Node*&amp; head, int x)</code> التي تحذف أول عقدة قيمتها x (إن وجدت) وتحرر ذاكرتها.',
    NODE + '\n\n' + PUSHB + '\n\n' + PRINT + '\n\nvoid removeValue(Node*& head, int x) {\n    // اكتب الحل هنا\n}',
    NODE + '\n\n' + PUSHB + '\n\n' + PRINT + '\n\nvoid removeValue(Node*& head, int x) {\n    if (head == nullptr) return;\n    if (head->data == x) {\n        Node* t = head;\n        head = head->next;\n        delete t;\n        return;\n    }\n    Node* p = head;\n    while (p->next != nullptr && p->next->data != x)\n        p = p->next;\n    if (p->next != nullptr) {\n        Node* t = p->next;\n        p->next = t->next;\n        delete t;\n    }\n}',
    READ + '\nint v;\ncin >> v;\nremoveValue(head, v);\nprintList(head);', READ + '\nint v;\ncin >> v;\nremoveValue(head, v);\nprintList(head);', ['4 1 2 3 4 3', '4 1 2 3 4 1', '3 1 2 3 9', '4 5 6 5 7 5']),
  ess('qds3b', 'حذف كل الأعداد الزوجية', 'اكتب الدالة <code>void removeEvens(Node*&amp; head)</code> التي تحذف كل عقدة قيمتها زوجية وتحرر ذاكرتها.',
    NODE + '\n\n' + PUSHB + '\n\n' + PRINT + '\n\nvoid removeEvens(Node*& head) {\n    // اكتب الحل هنا\n}',
    NODE + '\n\n' + PUSHB + '\n\n' + PRINT + '\n\nvoid removeEvens(Node*& head) {\n    while (head != nullptr && head->data % 2 == 0) {\n        Node* t = head;\n        head = head->next;\n        delete t;\n    }\n    if (head == nullptr) return;\n    Node* p = head;\n    while (p->next != nullptr) {\n        if (p->next->data % 2 == 0) {\n            Node* t = p->next;\n            p->next = t->next;\n            delete t;\n        } else {\n            p = p->next;\n        }\n    }\n}',
    READ + '\nremoveEvens(head);\nprintList(head);', READ + '\nremoveEvens(head);\nprintList(head);', ['6 2 3 4 5 6 7', '4 1 3 5 7', '5 2 4 6 1 8']),
]);

const DNODE = 'struct DNode {\n    int data;\n    DNode* prev;\n    DNode* next;\n};';
add('ds4', [
  { k: 'mcq', q: 'ما الذي تضيفه القائمة الثنائية (doubly) للعقدة؟', opts: ['قيمة ثانية', 'مؤشر prev إلى العقدة السابقة', 'مصفوفة', 'لا شيء'], a: 1 },
  { k: 'mcq', q: 'ما ميزة القائمة الثنائية؟', opts: ['أقل استهلاكًا للذاكرة', 'المرور في الاتجاهين، وحذف عقدة دون البحث عن السابقة لها', 'لا تحتاج new', 'لا تحتاج مؤشرات'], a: 1 },
  { k: 'mcq', q: 'في القائمة الدائرية (circular)، إلى أين يشير next لآخر عقدة؟', opts: ['nullptr', 'أول عقدة head', 'نفسها', 'العقدة السابقة'], a: 1 },
  { k: 'mcq', q: 'ما شرط التوقف عند المرور على قائمة دائرية؟', opts: ['<code>p != nullptr</code>', 'الرجوع إلى head مرة أخرى', 'بعد 100 خطوة', 'لا تتوقف'], a: 1, why: 'لا يوجد nullptr في القائمة الدائرية، فنستخدم do-while حتى نعود إلى head.' },
  { k: 'mcq', q: 'عند إضافة عقدة n بين a و b في قائمة ثنائية، كم مؤشرًا نعدّل؟', opts: ['1', '2', '4', '3'], a: 2, why: 'n-&gt;prev و n-&gt;next و a-&gt;next و b-&gt;prev.' },
  { k: 'mcq', q: 'في القائمة الثنائية، ما قيمة <code>head-&gt;prev</code>؟', opts: ['آخر عقدة', 'nullptr', 'head', 'العقدة الثانية'], a: 1 },
  { k: 'out', code: F(DNODE, 'DNode* a = new DNode;\nDNode* b = new DNode;\nDNode* c = new DNode;\na->data = 1; b->data = 2; c->data = 3;\na->prev = nullptr; a->next = b;\nb->prev = a; b->next = c;\nc->prev = b; c->next = nullptr;\nfor (DNode* p = c; p != nullptr; p = p->prev)\n    cout << p->data << " ";') },
  { k: 'out', code: F(NODE, 'Node* a = new Node;\nNode* b = new Node;\nNode* c = new Node;\na->data = 4; b->data = 5; c->data = 6;\na->next = b; b->next = c; c->next = a;\nNode* p = b;\nfor (int i = 0; i < 5; i++) {\n    cout << p->data << " ";\n    p = p->next;\n}') },
  { k: 'out', code: F(NODE, 'Node* a = new Node;\nNode* b = new Node;\nNode* c = new Node;\na->data = 2; b->data = 4; c->data = 8;\na->next = b; b->next = c; c->next = a;\nint s = 0;\nNode* p = a;\ndo {\n    s += p->data;\n    p = p->next;\n} while (p != a);\ncout << s;') },
], [
  ess('qds4a', 'طباعة الثنائية بالاتجاهين', 'الإضافة في نهاية قائمة ثنائية جاهزة. اكتب الدالة <code>void printBoth(DNode* head)</code> التي تطبع القائمة من البداية في سطر، ثم من النهاية إلى البداية (باستخدام prev) في السطر التالي.',
    DNODE + '\n\nvoid addEnd(DNode*& head, DNode*& tail, int x) {\n    DNode* n = new DNode;\n    n->data = x;\n    n->next = nullptr;\n    n->prev = tail;\n    if (tail == nullptr) head = n;\n    else tail->next = n;\n    tail = n;\n}\n\nvoid printBoth(DNode* head) {\n    // اكتب الحل هنا\n}',
    DNODE + '\n\nvoid addEnd(DNode*& head, DNode*& tail, int x) {\n    DNode* n = new DNode;\n    n->data = x;\n    n->next = nullptr;\n    n->prev = tail;\n    if (tail == nullptr) head = n;\n    else tail->next = n;\n    tail = n;\n}\n\nvoid printBoth(DNode* head) {\n    DNode* last = head;\n    for (DNode* p = head; p != nullptr; p = p->next) {\n        cout << p->data << " ";\n        last = p;\n    }\n    cout << endl;\n    for (DNode* p = last; p != nullptr; p = p->prev)\n        cout << p->data << " ";\n}',
    'DNode* head = nullptr;\nDNode* tail = nullptr;\nint n, x;\ncin >> n;\nfor (int i = 0; i < n; i++) {\n    cin >> x;\n    addEnd(head, tail, x);\n}\nprintBoth(head);', 'DNode* head = nullptr;\nDNode* tail = nullptr;\nint n, x;\ncin >> n;\nfor (int i = 0; i < n; i++) {\n    cin >> x;\n    addEnd(head, tail, x);\n}\nprintBoth(head);', ['4 1 2 3 4', '1 7']),
  ess('qds4b', 'عدّ عقد القائمة الدائرية', 'البرنامج يبني قائمة دائرية. اكتب الدالة <code>int countCircular(Node* head)</code> التي تُرجع عدد عقدها (ابدأ من head وتوقف عند الرجوع إليه).',
    NODE + '\n\nint countCircular(Node* head) {\n    // اكتب الحل هنا\n    return 0;\n}',
    NODE + '\n\nint countCircular(Node* head) {\n    if (head == nullptr) return 0;\n    int c = 0;\n    Node* p = head;\n    do {\n        c++;\n        p = p->next;\n    } while (p != head);\n    return c;\n}',
    'Node* head = nullptr;\nNode* tail = nullptr;\nint n, x;\ncin >> n;\nfor (int i = 0; i < n; i++) {\n    cin >> x;\n    Node* t = new Node;\n    t->data = x;\n    if (head == nullptr) head = t;\n    else tail->next = t;\n    tail = t;\n    tail->next = head;\n}\ncout << countCircular(head);', 'Node* head = nullptr;\nNode* tail = nullptr;\nint n, x;\ncin >> n;\nfor (int i = 0; i < n; i++) {\n    cin >> x;\n    Node* t = new Node;\n    t->data = x;\n    if (head == nullptr) head = t;\n    else tail->next = t;\n    tail = t;\n    tail->next = head;\n}\ncout << countCircular(head);', ['5 1 2 3 4 5', '1 9', '0']),
]);

add('ds5', [
  { k: 'mcq', q: 'على أي مبدأ يعمل المكدس (Stack)؟', opts: ['FIFO: أول من يدخل أول من يخرج', 'LIFO: آخر من يدخل أول من يخرج', 'عشوائي', 'حسب القيمة'], a: 1 },
  { k: 'mcq', q: 'دفعنا 1 ثم 2 ثم 3 ثم نفذنا pop مرة. ما العنصر في القمة (top)؟', opts: ['1', '2', '3', 'المكدس فارغ'], a: 1 },
  { k: 'mcq', q: 'في المكدس بمصفوفة مع <code>top = -1</code> في البداية، متى يكون المكدس فارغًا؟', opts: ['<code>top == 0</code>', '<code>top == -1</code>', '<code>top == MAX</code>', 'دائمًا'], a: 1 },
  { k: 'mcq', q: 'ما الـ Stack Overflow في المكدس بمصفوفة؟', opts: ['pop من مكدس فارغ', 'push في مكدس ممتلئ (top == MAX - 1)', 'حذف المكدس', 'طباعة المكدس'], a: 1, why: 'أما pop من مكدس فارغ فاسمه Underflow.' },
  { k: 'mcq', q: 'أي تطبيق يستخدم المكدس؟', opts: ['طابور الطباعة', 'زر التراجع (Undo) وفحص الأقواس واستدعاء الدوال', 'ترتيب الطلبة أبجديًا', 'البحث الثنائي'], a: 1 },
  { k: 'mcq', q: 'لفحص توازن الأقواس <code>(()())</code> بالمكدس، ماذا نفعل عند <code>)</code>؟', opts: ['push', 'pop، وإذا كان المكدس فارغًا فالأقواس غير متوازنة', 'نتجاهله', 'نوقف البرنامج'], a: 1 },
  { k: 'out', code: F(STK, 'push(4);\npush(7);\npush(1);\ncout << pop() << " ";\npush(9);\ncout << pop() << " " << pop() << " " << top;') },
  { k: 'out', code: F(STK, 'int n = 13;\nwhile (n > 0) {\n    push(n % 2);\n    n /= 2;\n}\nwhile (!isEmpty())\n    cout << pop();') },
  { k: 'out', code: F(STK, 'int a[5] = {3, 8, 2, 6, 5};\nfor (int i = 0; i < 5; i++) {\n    if (!isEmpty() && st[top] < a[i])\n        pop();\n    push(a[i]);\n}\nwhile (!isEmpty())\n    cout << pop() << " ";') },
], [
  ess('qds5a', 'توازن الأقواس', 'اقرأ نصًّا من الأقواس <code>(</code> و <code>)</code> فقط، واستخدم المكدس الجاهز لتطبع <code>Balanced</code> أو <code>Not balanced</code>.',
    STK, STK, 'string s;\ncin >> s;\n// اكتب الحل هنا\n',
    'string s;\ncin >> s;\nbool ok = true;\nfor (int i = 0; i < s.length(); i++) {\n    if (s[i] == \'(\') push(1);\n    else if (isEmpty()) ok = false;\n    else pop();\n}\nif (ok && isEmpty()) cout << "Balanced";\nelse cout << "Not balanced";', ['(()())', '(()', '())(', '((()))']),
  ess('qds5b', 'التحويل إلى الثنائي', 'اقرأ عددًا موجبًا واطبع تمثيله الثنائي باستخدام المكدس الجاهز (ادفع باقي القسمة على 2، ثم أخرج العناصر).',
    STK, STK, 'int n;\ncin >> n;\n// اكتب الحل هنا\n',
    'int n;\ncin >> n;\nwhile (n > 0) {\n    push(n % 2);\n    n /= 2;\n}\nwhile (!isEmpty())\n    cout << pop();', ['13', '8', '255', '1']),
]);

const QARR = 'const int MAX = 5;\nint q[MAX];\nint front = 0, rear = -1, cnt = 0;\n\nvoid enqueue(int x) {\n    rear = (rear + 1) % MAX;\n    q[rear] = x;\n    cnt++;\n}\n\nint dequeue() {\n    int x = q[front];\n    front = (front + 1) % MAX;\n    cnt--;\n    return x;\n}';
add('ds6', [
  { k: 'mcq', q: 'على أي مبدأ يعمل الطابور (Queue)؟', opts: ['LIFO', 'FIFO: أول من يدخل أول من يخرج', 'حسب الأولوية دائمًا', 'عشوائي'], a: 1 },
  { k: 'mcq', q: 'من أين يُضاف العنصر في الطابور ومن أين يُحذف؟', opts: ['يُضاف ويُحذف من الأمام', 'يُضاف من الخلف (rear) ويُحذف من الأمام (front)', 'يُضاف من الأمام ويُحذف من الخلف', 'من الوسط'], a: 1 },
  { k: 'mcq', q: 'لماذا نستخدم الطابور الدائري بدل العادي في المصفوفة؟', opts: ['أسهل في الكتابة', 'لإعادة استخدام الأماكن التي فرغت في بداية المصفوفة', 'لأنه أسرع في البحث', 'لا فرق'], a: 1 },
  { k: 'mcq', q: 'في الطابور الدائري بحجم MAX، كيف ننقل rear للأمام؟', opts: ['<code>rear++</code>', '<code>rear = (rear + 1) % MAX</code>', '<code>rear = MAX</code>', '<code>rear--</code>'], a: 1 },
  { k: 'mcq', q: 'أدخلنا A ثم B ثم C، ونفذنا dequeue مرتين. ما العنصر الباقي؟', opts: ['A', 'B', 'C', 'لا شيء'], a: 2 },
  { k: 'mcq', q: 'أي تطبيق يناسبه الطابور؟', opts: ['زر التراجع', 'طابور أوامر الطباعة وخدمة العملاء بالترتيب', 'فحص الأقواس', 'العودة من الدوال'], a: 1 },
  { k: 'out', code: F(QARR, 'enqueue(10);\nenqueue(20);\nenqueue(30);\ncout << dequeue() << " ";\nenqueue(40);\ncout << dequeue() << " " << cnt;') },
  { k: 'out', code: F(QARR, 'for (int i = 1; i <= 5; i++)\n    enqueue(i);\ndequeue();\ndequeue();\nenqueue(6);\nenqueue(7);\ncout << rear << " " << front << " " << q[0];') },
  { k: 'out', code: F(QARR, 'for (int i = 1; i <= 4; i++)\n    enqueue(i);\nfor (int k = 0; k < 3; k++)\n    enqueue(dequeue());\nwhile (cnt > 0)\n    cout << dequeue() << " ";') },
], [
  ess('qds6a', 'طابور بقائمة مترابطة', 'اكتب الدالتين <code>enqueue</code> و <code>dequeue</code> لطابور بقائمة مترابطة (المؤشران front و rear). البرنامج يقرأ n عددًا ويدخلها، ثم يخرجها كلها ويطبعها.',
    NODE + '\n\nNode* front = nullptr;\nNode* rear = nullptr;\n\nvoid enqueue(int x) {\n    // اكتب الحل هنا\n}\n\nint dequeue() {\n    // اكتب الحل هنا\n    return 0;\n}',
    NODE + '\n\nNode* front = nullptr;\nNode* rear = nullptr;\n\nvoid enqueue(int x) {\n    Node* n = new Node;\n    n->data = x;\n    n->next = nullptr;\n    if (rear == nullptr) front = n;\n    else rear->next = n;\n    rear = n;\n}\n\nint dequeue() {\n    Node* t = front;\n    int x = t->data;\n    front = front->next;\n    if (front == nullptr) rear = nullptr;\n    delete t;\n    return x;\n}',
    'int n, x;\ncin >> n;\nfor (int i = 0; i < n; i++) {\n    cin >> x;\n    enqueue(x);\n}\nwhile (front != nullptr)\n    cout << dequeue() << " ";', 'int n, x;\ncin >> n;\nfor (int i = 0; i < n; i++) {\n    cin >> x;\n    enqueue(x);\n}\nwhile (front != nullptr)\n    cout << dequeue() << " ";', ['4 5 6 7 8', '1 3']),
  ess('qds6b', 'لعبة الدور (Josephus مبسّطة)', 'الطابور الدائري جاهز (حجمه 5). أدخل الأعداد من 1 إلى n (n ≤ 5)، ثم كرر حتى يبقى عنصر واحد: انقل عنصرًا من الأمام إلى الخلف، ثم أخرج العنصر التالي واطبعه. في النهاية اطبع العنصر الباقي في سطر جديد.',
    QARR, QARR, 'int n;\ncin >> n;\n// اكتب الحل هنا\n',
    'int n;\ncin >> n;\nfor (int i = 1; i <= n; i++)\n    enqueue(i);\nwhile (cnt > 1) {\n    enqueue(dequeue());\n    cout << dequeue() << " ";\n}\ncout << endl << dequeue();', ['5', '4', '1']),
]);

add('ds7', [
  { k: 'mcq', q: 'ما الشرطان الأساسيان في أي دالة ذاتية الاستدعاء؟', opts: ['حلقة ومصفوفة', 'حالة توقف (أساس) واستدعاء يقترب منها', 'متغير عام و return', 'مؤشر و new'], a: 1 },
  { k: 'mcq', q: 'ما ناتج <code>fact(4)</code> حيث <code>fact(n) = n * fact(n - 1)</code> و <code>fact(0) = 1</code>؟', opts: ['10', '24', '16', '4'], a: 1 },
  { k: 'mcq', q: 'كم مرة تُستدعى <code>f</code> عند تنفيذ <code>f(3)</code>؟ <code>void f(int n) { if (n == 0) return; f(n - 1); }</code>', opts: ['3', '4', '2', '1'], a: 1, why: 'f(3) ثم f(2) ثم f(1) ثم f(0).' },
  { k: 'mcq', q: 'أين تُحفظ استدعاءات الدوال المتتالية أثناء الاستدعاء الذاتي؟', opts: ['في الطابور', 'في مكدس الاستدعاءات (call stack)', 'في heap', 'في ملف'], a: 1 },
  { k: 'mcq', q: 'في <code>void p(int n) { if (n == 0) return; p(n - 1); cout &lt;&lt; n; }</code> ماذا يطبع <code>p(3)</code>؟', opts: ['321', '123', '3', '0123'], a: 1, why: 'الطباعة بعد الاستدعاء، فتُنفَّذ أثناء الرجوع: 1 ثم 2 ثم 3.' },
  { k: 'mcq', q: 'ما عيب حساب فيبوناتشي بالاستدعاء الذاتي المباشر <code>fib(n-1) + fib(n-2)</code>؟', opts: ['خطأ في الناتج', 'تكرار حساب القيم نفسها مرات كثيرة فيصبح بطيئًا', 'لا يعمل مع n = 0', 'يحتاج مصفوفة'], a: 1 },
  { k: 'out', code: F('int f(int n) {\n    if (n == 0) return 0;\n    return n % 10 + f(n / 10);\n}', 'cout << f(4729);') },
  { k: 'out', code: F('void show(int n) {\n    if (n == 0) return;\n    cout << n << " ";\n    show(n - 1);\n    cout << n << " ";\n}', 'show(3);') },
  { k: 'out', code: F('int g(int a, int b) {\n    if (b == 0) return 1;\n    return a * g(a, b - 1);\n}', 'cout << g(3, 4) << " " << g(5, 0);') },
], [
  ess('qds7a', 'مجموع مصفوفة ذاتيًا', 'اكتب الدالة <code>int sumArr(int a[], int n)</code> بالاستدعاء الذاتي دون أي حلقة: مجموع n عنصر = a[n-1] + مجموع أول n-1 عنصر.',
    'int sumArr(int a[], int n) {\n    // اكتب الحل هنا\n    return 0;\n}', 'int sumArr(int a[], int n) {\n    if (n == 0) return 0;\n    return a[n - 1] + sumArr(a, n - 1);\n}',
    'int a[50], n;\ncin >> n;\nfor (int i = 0; i < n; i++)\n    cin >> a[i];\ncout << sumArr(a, n);', 'int a[50], n;\ncin >> n;\nfor (int i = 0; i < n; i++)\n    cin >> a[i];\ncout << sumArr(a, n);', ['4 1 2 3 4', '1 9', '5 -1 -2 3 4 10']),
  ess('qds7b', 'طباعة الأرقام بالعكس ذاتيًا', 'اكتب الدالة <code>void rev(int n)</code> بالاستدعاء الذاتي التي تطبع أرقام n بالعكس دون مسافات. مثال: 1234 ← 4321',
    'void rev(int n) {\n    // اكتب الحل هنا\n}', 'void rev(int n) {\n    cout << n % 10;\n    if (n >= 10) rev(n / 10);\n}',
    'int n;\ncin >> n;\nrev(n);', 'int n;\ncin >> n;\nrev(n);', ['1234', '7', '9050']),
  ess('qds7c', 'عدّ رقم معيّن ذاتيًا', 'اكتب الدالة <code>int countDigit(int n, int d)</code> بالاستدعاء الذاتي التي تُرجع كم مرة يظهر الرقم d في العدد n.',
    'int countDigit(int n, int d) {\n    // اكتب الحل هنا\n    return 0;\n}', 'int countDigit(int n, int d) {\n    if (n == 0) return 0;\n    return (n % 10 == d ? 1 : 0) + countDigit(n / 10, d);\n}',
    'int n, d;\ncin >> n >> d;\ncout << countDigit(n, d);', 'int n, d;\ncin >> n >> d;\ncout << countDigit(n, d);', ['1213141 1', '5555 5', '2024 7']),
]);

add('ds8', [
  { k: 'mcq', q: 'ما خاصية شجرة البحث الثنائية (BST)؟', opts: ['كل عقدة لها ابنان دائمًا', 'كل ما في اليسار أصغر من العقدة، وكل ما في اليمين أكبر منها (أو يساويها)', 'الجذر أصغر عنصر', 'العناصر مرتبة حسب الإدخال'], a: 1 },
  { k: 'mcq', q: 'أي اجتياز (traversal) يطبع عناصر BST مرتبة تصاعديًا؟', opts: ['Preorder', 'Inorder (يسار، جذر، يمين)', 'Postorder', 'لا يوجد'], a: 1 },
  { k: 'mcq', q: 'أين يوجد أصغر عنصر في BST؟', opts: ['في الجذر', 'أقصى اليسار', 'أقصى اليمين', 'في أي ورقة'], a: 1 },
  { k: 'mcq', q: 'أدخلنا 50 ثم 30 ثم 70 ثم 20. أين تقع 20؟', opts: ['يمين 70', 'يسار 30', 'يمين 30', 'يسار 70'], a: 1 },
  { k: 'mcq', q: 'ما ترتيب Preorder؟', opts: ['يسار، جذر، يمين', 'جذر، يسار، يمين', 'يسار، يمين، جذر', 'يمين، جذر، يسار'], a: 1 },
  { k: 'mcq', q: 'إذا أدخلنا أعدادًا مرتبة 1، 2، 3، 4، 5 في BST، كيف تصبح الشجرة؟', opts: ['متوازنة', 'مائلة كالقائمة (كل عقدة لها ابن أيمن فقط)', 'كاملة', 'فارغة'], a: 1, why: 'فيصبح البحث بطيئًا مثل القائمة المترابطة.' },
  { k: 'out', code: F(TNODE + '\n\n' + INS + '\n\nvoid inorder(Node* r) {\n    if (r == nullptr) return;\n    inorder(r->left);\n    cout << r->key << " ";\n    inorder(r->right);\n}', 'Node* root = nullptr;\nint a[6] = {40, 20, 60, 10, 30, 50};\nfor (int i = 0; i < 6; i++)\n    root = insert(root, a[i]);\ninorder(root);') },
  { k: 'out', code: F(TNODE + '\n\n' + INS + '\n\nvoid pre(Node* r) {\n    if (r == nullptr) return;\n    cout << r->key << " ";\n    pre(r->left);\n    pre(r->right);\n}', 'Node* root = nullptr;\nint a[5] = {8, 3, 10, 1, 6};\nfor (int i = 0; i < 5; i++)\n    root = insert(root, a[i]);\npre(root);') },
  { k: 'out', code: F(TNODE + '\n\n' + INS + '\n\nint height(Node* r) {\n    if (r == nullptr) return 0;\n    int a = height(r->left), b = height(r->right);\n    return 1 + (a > b ? a : b);\n}', 'Node* root = nullptr;\nint a[6] = {5, 2, 8, 1, 9, 10};\nfor (int i = 0; i < 6; i++)\n    root = insert(root, a[i]);\ncout << height(root) << " " << root->right->right->key;') },
], [
  ess('qds8a', 'عدد العقد والأوراق', 'اكتب الدالتين <code>int countNodes(Node* r)</code> و <code>int countLeaves(Node* r)</code> (الورقة عقدة بلا أبناء). البرنامج يبني الشجرة من الإدخال.',
    TNODE + '\n\n' + INS + '\n\nint countNodes(Node* r) {\n    // اكتب الحل هنا\n    return 0;\n}\n\nint countLeaves(Node* r) {\n    // اكتب الحل هنا\n    return 0;\n}',
    TNODE + '\n\n' + INS + '\n\nint countNodes(Node* r) {\n    if (r == nullptr) return 0;\n    return 1 + countNodes(r->left) + countNodes(r->right);\n}\n\nint countLeaves(Node* r) {\n    if (r == nullptr) return 0;\n    if (r->left == nullptr && r->right == nullptr) return 1;\n    return countLeaves(r->left) + countLeaves(r->right);\n}',
    TREAD + '\ncout << countNodes(root) << " " << countLeaves(root);', TREAD + '\ncout << countNodes(root) << " " << countLeaves(root);', ['6 40 20 60 10 30 50', '3 1 2 3', '1 5']),
  ess('qds8b', 'البحث وأكبر عنصر', 'اكتب الدالتين <code>bool search(Node* r, int k)</code> و <code>int maxKey(Node* r)</code>. البرنامج يطبع <code>Found</code> أو <code>Not found</code> ثم أكبر عنصر.',
    TNODE + '\n\n' + INS + '\n\nbool search(Node* r, int k) {\n    // اكتب الحل هنا\n    return false;\n}\n\nint maxKey(Node* r) {\n    // اكتب الحل هنا\n    return 0;\n}',
    TNODE + '\n\n' + INS + '\n\nbool search(Node* r, int k) {\n    while (r != nullptr) {\n        if (k == r->key) return true;\n        if (k < r->key) r = r->left;\n        else r = r->right;\n    }\n    return false;\n}\n\nint maxKey(Node* r) {\n    while (r->right != nullptr)\n        r = r->right;\n    return r->key;\n}',
    TREAD + '\nint k;\ncin >> k;\nif (search(root, k)) cout << "Found";\nelse cout << "Not found";\ncout << endl << maxKey(root);', TREAD + '\nint k;\ncin >> k;\nif (search(root, k)) cout << "Found";\nelse cout << "Not found";\ncout << endl << maxKey(root);', ['5 50 30 70 20 40 40', '5 50 30 70 20 40 65', '1 9 9']),
]);

const SORTMAIN = 'int a[50], n;\ncin >> n;\nfor (int i = 0; i < n; i++)\n    cin >> a[i];';
const PRINTA = '\nfor (int i = 0; i < n; i++)\n    cout << a[i] << " ";';
add('ds9', [
  { k: 'mcq', q: 'ما فكرة الترتيب بالفقاعة (Bubble Sort)؟', opts: ['اختيار أصغر عنصر ووضعه في البداية', 'مقارنة كل عنصرين متجاورين وتبديلهما إذا كانا بالترتيب الخطأ، فيطفو الأكبر إلى النهاية', 'تقسيم المصفوفة نصفين', 'إدراج كل عنصر في مكانه'], a: 1 },
  { k: 'mcq', q: 'ما فكرة الترتيب بالاختيار (Selection Sort)؟', opts: ['في كل دورة نبحث عن أصغر عنصر في الجزء غير المرتب ونضعه في مكانه', 'نبدّل المتجاورين', 'ندرج العنصر في الجزء المرتب', 'نستخدم مكدسًا'], a: 0 },
  { k: 'mcq', q: 'ما فكرة الترتيب بالإدراج (Insertion Sort)؟', opts: ['نختار الأكبر', 'نأخذ العنصر التالي وننقله إلى مكانه الصحيح في الجزء المرتب قبله', 'نقسم المصفوفة', 'نبدّل الأول والأخير'], a: 1 },
  { k: 'mcq', q: 'كم دورة خارجية يحتاج Bubble Sort لمصفوفة من n عنصر في أسوأ حالة؟', opts: ['n − 1', 'n²', '1', 'log n'], a: 0 },
  { k: 'mcq', q: 'ما تعقيد Bubble و Selection و Insertion في أسوأ حالة؟', opts: ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'], a: 1 },
  { k: 'mcq', q: 'لترتيب تنازلي في Bubble Sort نغيّر شرط التبديل إلى:', opts: ['<code>a[j] &gt; a[j+1]</code>', '<code>a[j] &lt; a[j+1]</code>', '<code>a[j] == a[j+1]</code>', 'لا يمكن'], a: 1 },
  { k: 'out', q: 'ما شكل المصفوفة بعد <b>دورة خارجية واحدة</b> من Bubble Sort؟', code: F('', 'int a[5] = {5, 1, 4, 2, 8};\nfor (int j = 0; j < 4; j++)\n    if (a[j] > a[j + 1]) {\n        int t = a[j];\n        a[j] = a[j + 1];\n        a[j + 1] = t;\n    }\nfor (int i = 0; i < 5; i++)\n    cout << a[i] << " ";') },
  { k: 'out', q: 'ما شكل المصفوفة بعد <b>دورتين</b> من Selection Sort؟', code: F('', 'int a[5] = {29, 10, 14, 37, 13};\nfor (int i = 0; i < 2; i++) {\n    int m = i;\n    for (int j = i + 1; j < 5; j++)\n        if (a[j] < a[m]) m = j;\n    int t = a[i];\n    a[i] = a[m];\n    a[m] = t;\n}\nfor (int i = 0; i < 5; i++)\n    cout << a[i] << " ";') },
  { k: 'out', q: 'كم عملية تبديل (swap) نفّذ Bubble Sort؟', code: F('', 'int a[4] = {4, 3, 2, 1};\nint swaps = 0;\nfor (int i = 0; i < 3; i++)\n    for (int j = 0; j < 3 - i; j++)\n        if (a[j] > a[j + 1]) {\n            int t = a[j];\n            a[j] = a[j + 1];\n            a[j + 1] = t;\n            swaps++;\n        }\ncout << swaps;') },
], [
  ess('qds9a', 'ترتيب تنازلي بالفقاعة', 'اقرأ n ثم n عددًا، ورتّبها <b>تنازليًا</b> باستخدام Bubble Sort، ثم اطبعها.',
    '', '', SORTMAIN + '\n// اكتب الحل هنا\n' + PRINTA,
    SORTMAIN + '\nfor (int i = 0; i < n - 1; i++)\n    for (int j = 0; j < n - 1 - i; j++)\n        if (a[j] < a[j + 1]) {\n            int t = a[j];\n            a[j] = a[j + 1];\n            a[j + 1] = t;\n        }' + PRINTA, ['5 3 9 1 7 5', '4 1 2 3 4', '3 -1 -5 0']),
  ess('qds9b', 'الترتيب بالإدراج', 'اقرأ n ثم n عددًا، ورتّبها تصاعديًا باستخدام Insertion Sort، ثم اطبعها.',
    '', '', SORTMAIN + '\n// اكتب الحل هنا\n' + PRINTA,
    SORTMAIN + '\nfor (int i = 1; i < n; i++) {\n    int key = a[i];\n    int j = i - 1;\n    while (j >= 0 && a[j] > key) {\n        a[j + 1] = a[j];\n        j--;\n    }\n    a[j + 1] = key;\n}' + PRINTA, ['5 3 9 1 7 5', '4 4 3 2 1', '1 8']),
  ess('qds9c', 'ترتيب الطلبة بالدرجات', 'عرّف <code>struct Student { string name; int mark; };</code>. اقرأ n ثم n طالبًا، ورتّبهم تنازليًا حسب الدرجة بأي خوارزمية، واطبع الأسماء بالترتيب بينها مسافة.',
    'struct Student {\n    string name;\n    int mark;\n};', 'struct Student {\n    string name;\n    int mark;\n};',
    'Student s[30];\nint n;\ncin >> n;\nfor (int i = 0; i < n; i++)\n    cin >> s[i].name >> s[i].mark;\n// اكتب الحل هنا\n',
    'Student s[30];\nint n;\ncin >> n;\nfor (int i = 0; i < n; i++)\n    cin >> s[i].name >> s[i].mark;\nfor (int i = 0; i < n - 1; i++) {\n    int m = i;\n    for (int j = i + 1; j < n; j++)\n        if (s[j].mark > s[m].mark) m = j;\n    Student t = s[i];\n    s[i] = s[m];\n    s[m] = t;\n}\nfor (int i = 0; i < n; i++)\n    cout << s[i].name << " ";', ['3 Ali 70 Sara 95 Omar 82', '4 A 10 B 40 C 30 D 20']),
]);

add('ds10', [
  { k: 'mcq', q: 'ما شرط استخدام البحث الثنائي (Binary Search)؟', opts: ['أن تكون المصفوفة صغيرة', 'أن تكون المصفوفة مرتبة', 'أن تكون العناصر موجبة', 'لا شرط'], a: 1 },
  { k: 'mcq', q: 'ما أقصى عدد مقارنات للبحث الثنائي في مصفوفة من 1024 عنصرًا تقريبًا؟', opts: ['1024', '512', 'حوالي 10 أو 11', '100'], a: 2, why: 'كل مقارنة تقسم المجال نصفين: 2^10 = 1024.' },
  { k: 'mcq', q: 'في البحث الثنائي، إذا كان <code>x &gt; a[mid]</code> فماذا نفعل؟', opts: ['<code>high = mid - 1</code>', '<code>low = mid + 1</code>', '<code>mid++</code>', 'نتوقف'], a: 1 },
  { k: 'mcq', q: 'ما تعقيد البحث الخطي والبحث الثنائي؟', opts: ['O(n) و O(log n)', 'O(log n) و O(n)', 'O(n²) و O(n)', 'O(1) لكليهما'], a: 0 },
  { k: 'mcq', q: 'ما شرط الحلقة في البحث الثنائي؟', opts: ['<code>while (low &lt; high)</code> فقط', '<code>while (low &lt;= high)</code>', '<code>while (mid != x)</code>', '<code>while (true)</code>'], a: 1, why: 'مع <code>&lt;</code> فقط قد نفوّت الحالة التي يبقى فيها عنصر واحد.' },
  { k: 'mcq', q: 'متى نفضّل البحث الخطي؟', opts: ['المصفوفة كبيرة ومرتبة', 'المصفوفة غير مرتبة أو صغيرة، أو القائمة مترابطة', 'دائمًا', 'أبدًا'], a: 1 },
  { k: 'out', q: 'ما قيم mid المتتالية، ثم الفهرس الناتج؟', code: F('', 'int a[9] = {2, 5, 8, 12, 16, 23, 38, 56, 72};\nint x = 23, low = 0, high = 8, pos = -1;\nwhile (low <= high) {\n    int mid = (low + high) / 2;\n    cout << mid << " ";\n    if (a[mid] == x) {\n        pos = mid;\n        break;\n    }\n    if (x > a[mid]) low = mid + 1;\n    else high = mid - 1;\n}\ncout << endl << pos;') },
  { k: 'out', q: 'كم مقارنة احتاج البحث الثنائي حتى قرر أن 7 غير موجود؟', code: F('', 'int a[8] = {1, 3, 5, 9, 11, 13, 15, 17};\nint x = 7, low = 0, high = 7, c = 0;\nbool found = false;\nwhile (low <= high) {\n    int mid = (low + high) / 2;\n    c++;\n    if (a[mid] == x) {\n        found = true;\n        break;\n    }\n    if (x > a[mid]) low = mid + 1;\n    else high = mid - 1;\n}\ncout << found << " " << c;') },
  { k: 'out', code: F('', 'int a[6] = {4, 9, 2, 9, 7, 9};\nint last = -1;\nfor (int i = 0; i < 6; i++)\n    if (a[i] == 9) last = i;\ncout << last;') },
], [
  ess('qds10a', 'البحث الثنائي', 'اكتب الدالة <code>int binarySearch(int a[], int n, int x)</code> التي تُرجع فهرس x في مصفوفة مرتبة تصاعديًا، أو <code>-1</code>.',
    'int binarySearch(int a[], int n, int x) {\n    // اكتب الحل هنا\n    return -1;\n}', 'int binarySearch(int a[], int n, int x) {\n    int low = 0, high = n - 1;\n    while (low <= high) {\n        int mid = (low + high) / 2;\n        if (a[mid] == x) return mid;\n        if (x > a[mid]) low = mid + 1;\n        else high = mid - 1;\n    }\n    return -1;\n}',
    SORTMAIN + '\nint x;\ncin >> x;\ncout << binarySearch(a, n, x);', SORTMAIN + '\nint x;\ncin >> x;\ncout << binarySearch(a, n, x);', ['7 1 3 5 7 9 11 13 9', '7 1 3 5 7 9 11 13 1', '5 2 4 6 8 10 7', '1 5 5']),
  ess('qds10b', 'عدد مرات الظهور', 'اقرأ n ثم n عددًا ثم x. اطبع عدد مرات ظهور x، ثم فهارس ظهوره في السطر التالي بينها مسافة (أو <code>none</code> إذا لم يظهر).',
    '', '', SORTMAIN + '\nint x;\ncin >> x;\n// اكتب الحل هنا\n',
    SORTMAIN + '\nint x;\ncin >> x;\nint c = 0;\nfor (int i = 0; i < n; i++)\n    if (a[i] == x) c++;\ncout << c << endl;\nif (c == 0) cout << "none";\nfor (int i = 0; i < n; i++)\n    if (a[i] == x) cout << i << " ";', ['6 4 9 2 9 7 9 9', '3 1 2 3 5']),
]);
})();
