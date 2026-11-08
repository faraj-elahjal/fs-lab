/* Data Structures course for FS_Lab (struct + pointers): nodes, linked lists, doubly/circular lists, stack, queue,
   recursion, binary search trees, sorting, searching. The memory panel draws lists and trees automatically. */
(function () {
const ind = (b) => b.replace(/^/gm, '    ').replace(/^\s+$/gm, '');
const F = (fns, body) => `#include <iostream>\nusing namespace std;\n\n${fns ? fns.trim() + '\n\n' : ''}int main() {\n${ind(body)}\n    return 0;\n}\n`;
const DS = 'هياكل البيانات';
const NODE = `struct Node {\n    int data;\n    Node* next;\n};`;
const PUSHF = `void insertFront(Node*& head, int x) {\n    Node* n = new Node;\n    n->data = x;\n    n->next = head;\n    head = n;\n}`;
const PRINT = `void printList(Node* head) {\n    Node* p = head;\n    while (p != nullptr) {\n        cout << p->data << " ";\n        p = p->next;\n    }\n    cout << endl;\n}`;
const TNODE = `struct Node {\n    int key;\n    Node* left;\n    Node* right;\n};`;
const INSERT_BST = `Node* insert(Node* root, int k) {\n    if (root == nullptr) {\n        Node* n = new Node;\n        n->key = k;\n        n->left = nullptr;\n        n->right = nullptr;\n        return n;\n    }\n    if (k < root->key)\n        root->left = insert(root->left, k);\n    else\n        root->right = insert(root->right, k);\n    return root;\n}`;

window.FS_LESSONS.push(
{
  course: DS, id: 'ds1', title: 'العقدة والقائمة المترابطة', tag: 'DS1 · C++',
  concept: `<p><b>القائمة المترابطة (Linked List)</b> مجموعة عقد، كل <b>عقدة</b> فيها بيانات ومؤشر <code>next</code> إلى العقدة التالية، وآخر عقدة يشير مؤشرها إلى <code>nullptr</code>.</p>
    <ul><li>العقد تُحجز بـ <code>new</code> في الذاكرة الديناميكية، و <code>head</code> يشير إلى أول عقدة.</li>
    <li>تابع <b>رسم الهيكل</b> في الذاكرة: العقد مربوطة بأسهم، وفوق كل عقدة أسماء المؤشرات التي تشير إليها.</li>
    <li>المرور على القائمة: نبدأ من head وننتقل بـ <code>p = p-&gt;next</code> حتى nullptr.</li></ul>`,
  examples: [
    { id: 'd1a', title: 'بناء ثلاث عقد يدويًا', code: F(NODE, `Node* a = new Node;\nNode* b = new Node;\nNode* c = new Node;\na->data = 10;\nb->data = 20;\nc->data = 30;\na->next = b;\nb->next = c;\nc->next = nullptr;\nNode* head = a;\ncout << head->next->data;`) },
    { id: 'd1b', title: 'طباعة القائمة', code: F(NODE + '\n\n' + PRINT, `Node* head = nullptr;\nfor (int i = 3; i >= 1; i--) {\n    Node* n = new Node;\n    n->data = i * 10;\n    n->next = head;\n    head = n;\n}\nprintList(head);`) },
    { id: 'd1c', title: 'عدّ العقد ومجموعها', code: F(NODE, `Node* head = nullptr;\nfor (int i = 1; i <= 4; i++) {\n    Node* n = new Node;\n    n->data = i;\n    n->next = head;\n    head = n;\n}\nint count = 0, sum = 0;\nfor (Node* p = head; p != nullptr; p = p->next) {\n    count++;\n    sum += p->data;\n}\ncout << count << " " << sum;`) },
  ],
  challenges: [
    { id: 'd1c1', title: 'أكبر قيمة في القائمة', task: 'القائمة تُبنى في main. اكتب الدالة <code>maxNode(Node* head)</code> التي تُرجع أكبر قيمة في القائمة.',
      code: F(NODE + `\n\n// اكتب الدالة maxNode هنا\n`, `Node* head = nullptr;\nint n, x;\ncin >> n;\nfor (int i = 0; i < n; i++) {\n    cin >> x;\n    Node* t = new Node;\n    t->data = x;\n    t->next = head;\n    head = t;\n}\ncout << maxNode(head);`), tests: [{ input: '4 3 9 2 7', output: '9' }, { input: '3 -5 -1 -8', output: '-1' }, { input: '1 4', output: '4' }] },
  ],
},
{
  course: DS, id: 'ds2', title: 'القائمة المترابطة: الإضافة', tag: 'DS2 · C++',
  concept: `<p>الإضافة في القائمة المترابطة لا تحتاج إزاحة عناصر كالمصفوفة، بل تغيير مؤشرات فقط.</p>
    <ul><li><b>في البداية</b>: العقدة الجديدة تشير إلى head، ثم تصبح هي head.</li>
    <li><b>في النهاية</b>: نمشي حتى آخر عقدة ونربطها بالجديدة.</li>
    <li>نمرر <code>Node*&amp; head</code> بالمرجع لأن الدالة قد تغيّر head نفسه.</li></ul>`,
  examples: [
    { id: 'd2a', title: 'الإضافة في البداية', code: F(NODE + '\n\n' + PUSHF + '\n\n' + PRINT, `Node* head = nullptr;\ninsertFront(head, 30);\ninsertFront(head, 20);\ninsertFront(head, 10);\nprintList(head);`) },
    { id: 'd2b', title: 'الإضافة في النهاية', code: F(NODE + `\n\nvoid insertEnd(Node*& head, int x) {\n    Node* n = new Node;\n    n->data = x;\n    n->next = nullptr;\n    if (head == nullptr) {\n        head = n;\n        return;\n    }\n    Node* p = head;\n    while (p->next != nullptr)\n        p = p->next;\n    p->next = n;\n}\n\n` + PRINT, `Node* head = nullptr;\ninsertEnd(head, 10);\ninsertEnd(head, 20);\ninsertEnd(head, 30);\nprintList(head);`) },
    { id: 'd2c', title: 'الإضافة مع الحفاظ على الترتيب', code: F(NODE + `\n\nvoid insertSorted(Node*& head, int x) {\n    Node* n = new Node;\n    n->data = x;\n    if (head == nullptr || x < head->data) {\n        n->next = head;\n        head = n;\n        return;\n    }\n    Node* p = head;\n    while (p->next != nullptr && p->next->data < x)\n        p = p->next;\n    n->next = p->next;\n    p->next = n;\n}\n\n` + PRINT, `Node* head = nullptr;\nint a[5] = {40, 10, 30, 50, 20};\nfor (int i = 0; i < 5; i++)\n    insertSorted(head, a[i]);\nprintList(head);`) },
  ],
  challenges: [
    { id: 'd2c1', title: 'الدالة insertEnd', task: 'اكتب الدالة <code>insertEnd(Node*&amp; head, int x)</code> التي تضيف x في نهاية القائمة. الدالة main تقرأ الأعداد وتطبع القائمة.',
      code: F(NODE + `\n\n// اكتب الدالة insertEnd هنا\n\n` + PRINT, `Node* head = nullptr;\nint n, x;\ncin >> n;\nfor (int i = 0; i < n; i++) {\n    cin >> x;\n    insertEnd(head, x);\n}\nprintList(head);`), tests: [{ input: '3 5 6 7', output: '5 6 7' }, { input: '1 9', output: '9' }] },
  ],
},
{
  course: DS, id: 'ds3', title: 'القائمة المترابطة: البحث والحذف', tag: 'DS3 · C++',
  concept: `<p><b>الحذف</b> من القائمة: نربط العقدة السابقة بالعقدة التي بعد المحذوفة، ثم نحرر المحذوفة بـ <code>delete</code>.</p>
    <ul><li>حذف أول عقدة حالة خاصة لأن head يتغير.</li>
    <li>في البحث عن السابقة نتوقف عند <code>p-&gt;next-&gt;data == x</code>.</li>
    <li>تابع العقدة المحذوفة في الذاكرة الديناميكية: تصبح باهتة ومكتوبًا عليها «محذوفة».</li></ul>`,
  examples: [
    { id: 'd3a', title: 'البحث عن قيمة', code: F(NODE + '\n\n' + PUSHF + `\n\nbool search(Node* head, int x) {\n    for (Node* p = head; p != nullptr; p = p->next)\n        if (p->data == x)\n            return true;\n    return false;\n}`, `Node* head = nullptr;\nfor (int i = 1; i <= 4; i++)\n    insertFront(head, i * 5);\ncout << search(head, 15) << " " << search(head, 7);`) },
    { id: 'd3b', title: 'حذف أول عقدة', code: F(NODE + '\n\n' + PUSHF + '\n\n' + PRINT, `Node* head = nullptr;\ninsertFront(head, 3);\ninsertFront(head, 2);\ninsertFront(head, 1);\nNode* temp = head;\nhead = head->next;\ndelete temp;\nprintList(head);`) },
    { id: 'd3c', title: 'حذف عقدة بقيمتها', code: F(NODE + '\n\n' + PUSHF + `\n\nvoid removeValue(Node*& head, int x) {\n    if (head == nullptr)\n        return;\n    if (head->data == x) {\n        Node* t = head;\n        head = head->next;\n        delete t;\n        return;\n    }\n    Node* p = head;\n    while (p->next != nullptr && p->next->data != x)\n        p = p->next;\n    if (p->next != nullptr) {\n        Node* t = p->next;\n        p->next = t->next;\n        delete t;\n    }\n}\n\n` + PRINT, `Node* head = nullptr;\nfor (int i = 4; i >= 1; i--)\n    insertFront(head, i);\nremoveValue(head, 3);\nprintList(head);`) },
    { id: 'd3d', title: 'حذف القائمة كاملة', code: F(NODE + '\n\n' + PUSHF, `Node* head = nullptr;\nfor (int i = 1; i <= 3; i++)\n    insertFront(head, i);\nwhile (head != nullptr) {\n    Node* t = head;\n    head = head->next;\n    delete t;\n}\ncout << "empty";`) },
  ],
  challenges: [
    { id: 'd3c1', title: 'الدالة countValue', task: 'اكتب الدالة <code>countValue(Node* head, int x)</code> التي تُرجع عدد مرات ظهور x في القائمة.',
      code: F(NODE + '\n\n' + PUSHF + `\n\n// اكتب الدالة countValue هنا\n`, `Node* head = nullptr;\nint n, v, x;\ncin >> n;\nfor (int i = 0; i < n; i++) {\n    cin >> v;\n    insertFront(head, v);\n}\ncin >> x;\ncout << countValue(head, x);`), tests: [{ input: '5 1 2 1 3 1 1', output: '3' }, { input: '3 4 5 6 9', output: '0' }] },
    { id: 'd3c2', title: 'حذف آخر عقدة', task: 'اكتب الدالة <code>removeLast(Node*&amp; head)</code> التي تحذف آخر عقدة في القائمة (وإذا كانت فيها عقدة واحدة تصبح فارغة).',
      code: F(NODE + '\n\n' + PUSHF + `\n\n// اكتب الدالة removeLast هنا\n\n` + PRINT, `Node* head = nullptr;\nint n, v;\ncin >> n;\nfor (int i = 0; i < n; i++) {\n    cin >> v;\n    insertFront(head, v);\n}\nremoveLast(head);\nprintList(head);`), tests: [{ input: '3 1 2 3', output: '3 2' }, { input: '1 7', output: '' }] },
  ],
},
{
  course: DS, id: 'ds4', title: 'القائمة الثنائية والدائرية', tag: 'DS4 · C++',
  concept: `<p><b>القائمة الثنائية (Doubly)</b>: كل عقدة فيها مؤشران <code>prev</code> و <code>next</code>، فنقدر نمشي للأمام وللخلف. <b>القائمة الدائرية (Circular)</b>: آخر عقدة تشير إلى أول عقدة بدل nullptr.</p>
    <ul><li>في الرسم: الثنائية تظهر بسهمين بين العقد، والدائرية تنتهي بسهم يعود إلى أول عقدة.</li></ul>`,
  examples: [
    { id: 'd4a', title: 'قائمة ثنائية: للأمام وللخلف', code: F(`struct Node {\n    int data;\n    Node* prev;\n    Node* next;\n};`, `Node* head = nullptr;\nNode* tail = nullptr;\nfor (int i = 1; i <= 3; i++) {\n    Node* n = new Node;\n    n->data = i;\n    n->next = nullptr;\n    n->prev = tail;\n    if (tail == nullptr)\n        head = n;\n    else\n        tail->next = n;\n    tail = n;\n}\nfor (Node* p = head; p != nullptr; p = p->next)\n    cout << p->data << " ";\ncout << endl;\nfor (Node* p = tail; p != nullptr; p = p->prev)\n    cout << p->data << " ";`) },
    { id: 'd4b', title: 'قائمة دائرية', code: F(NODE, `Node* a = new Node;\nNode* b = new Node;\nNode* c = new Node;\na->data = 1;\nb->data = 2;\nc->data = 3;\na->next = b;\nb->next = c;\nc->next = a;\nNode* p = a;\ndo {\n    cout << p->data << " ";\n    p = p->next;\n} while (p != a);`) },
  ],
  challenges: [
    { id: 'd4c1', title: 'طول القائمة الدائرية', task: 'اكتب الدالة <code>circularLength(Node* head)</code> التي تُرجع عدد العقد في قائمة دائرية (الدالة main تبنيها).',
      code: F(NODE + `\n\n// اكتب الدالة circularLength هنا\n`, `int n;\ncin >> n;\nNode* head = new Node;\nhead->data = 1;\nNode* last = head;\nfor (int i = 2; i <= n; i++) {\n    Node* t = new Node;\n    t->data = i;\n    last->next = t;\n    last = t;\n}\nlast->next = head;\ncout << circularLength(head);`), tests: [{ input: '4', output: '4' }, { input: '1', output: '1' }, { input: '7', output: '7' }] },
  ],
},
{
  course: DS, id: 'ds5', title: 'المكدس Stack', tag: 'DS5 · C++',
  concept: `<p><b>المكدس</b> هيكل يعمل بمبدأ <b>آخر من يدخل أول من يخرج (LIFO)</b> مثل كومة الأطباق. العمليات: <code>push</code> إضافة في القمة، و <code>pop</code> حذف من القمة، و <code>top</code> قراءة القمة.</p>
    <ul><li>يُبنى بمصفوفة ومؤشر <code>top</code>، أو بقائمة مترابطة تكون الإضافة والحذف فيها من البداية.</li>
    <li>من تطبيقاته: عكس النص، والتحقق من توازن الأقواس.</li></ul>`,
  examples: [
    { id: 'd5a', title: 'مكدس بمصفوفة', code: F(`const int MAX = 5;\nint st[MAX];\nint top = -1;\n\nvoid push(int x) {\n    if (top == MAX - 1) {\n        cout << "Stack full" << endl;\n        return;\n    }\n    top++;\n    st[top] = x;\n}\n\nint pop() {\n    if (top == -1) {\n        cout << "Stack empty" << endl;\n        return -1;\n    }\n    int x = st[top];\n    top--;\n    return x;\n}`, `push(10);\npush(20);\npush(30);\ncout << pop() << endl;\ncout << pop() << endl;\npush(99);\ncout << pop();`) },
    { id: 'd5b', title: 'مكدس بقائمة مترابطة', code: F(NODE + `\n\nNode* top = nullptr;\n\nvoid push(int x) {\n    Node* n = new Node;\n    n->data = x;\n    n->next = top;\n    top = n;\n}\n\nint pop() {\n    Node* t = top;\n    int x = t->data;\n    top = top->next;\n    delete t;\n    return x;\n}`, `for (int i = 1; i <= 3; i++)\n    push(i * 10);\nwhile (top != nullptr)\n    cout << pop() << " ";`) },
    { id: 'd5c', title: 'تطبيق: توازن الأقواس', code: F(`char st[50];\nint top = -1;`, `string s;\ncin >> s;\nbool ok = true;\nfor (int i = 0; i < s.length(); i++) {\n    if (s[i] == '(')\n        st[++top] = '(';\n    else if (s[i] == ')') {\n        if (top == -1)\n            ok = false;\n        else\n            top--;\n    }\n}\nif (top != -1)\n    ok = false;\nif (ok)\n    cout << "Balanced";\nelse\n    cout << "Not balanced";`), input: '(()(()))' },
  ],
  challenges: [
    { id: 'd5c1', title: 'عكس الأعداد بمكدس', task: 'اقرأ n ثم n عددًا، وادفعها في المكدس (الدالتان push و pop جاهزتان)، ثم اطبعها بالعكس بإخراجها من المكدس.',
      code: F(`int st[20];\nint top = -1;\n\nvoid push(int x) {\n    st[++top] = x;\n}\n\nint pop() {\n    return st[top--];\n}`, `int n, x;\ncin >> n;\n// اكتب الحل هنا\n`), tests: [{ input: '4 1 2 3 4', output: '4 3 2 1' }, { input: '2 7 8', output: '8 7' }] },
  ],
},
{
  course: DS, id: 'ds6', title: 'الطابور Queue', tag: 'DS6 · C++',
  concept: `<p><b>الطابور</b> هيكل يعمل بمبدأ <b>أول من يدخل أول من يخرج (FIFO)</b> مثل طابور المصرف. العمليات: <code>enqueue</code> الإضافة في الخلف (rear)، و <code>dequeue</code> الحذف من الأمام (front).</p>
    <ul><li><b>الطابور الدائري</b> بمصفوفة يستخدم <code>(rear + 1) % MAX</code> ليعود إلى بداية المصفوفة.</li>
    <li>بالقائمة المترابطة نحتفظ بمؤشرين: front و rear.</li></ul>`,
  examples: [
    { id: 'd6a', title: 'طابور دائري بمصفوفة', code: F(`const int MAX = 4;\n\nstruct Queue {\n    int items[MAX];\n    int front = 0;\n    int rear = -1;\n    int count = 0;\n};\n\nvoid enqueue(Queue &q, int x) {\n    if (q.count == MAX) {\n        cout << "Queue full" << endl;\n        return;\n    }\n    q.rear = (q.rear + 1) % MAX;\n    q.items[q.rear] = x;\n    q.count++;\n}\n\nint dequeue(Queue &q) {\n    int x = q.items[q.front];\n    q.front = (q.front + 1) % MAX;\n    q.count--;\n    return x;\n}`, `Queue q;\nfor (int i = 1; i <= 4; i++)\n    enqueue(q, i * 10);\ncout << dequeue(q) << " " << dequeue(q) << endl;\nenqueue(q, 50);\nenqueue(q, 60);\nwhile (q.count > 0)\n    cout << dequeue(q) << " ";`) },
    { id: 'd6b', title: 'طابور بقائمة مترابطة', code: F(NODE + `\n\nstruct Queue {\n    Node* front = nullptr;\n    Node* rear = nullptr;\n};\n\nvoid enqueue(Queue &q, int x) {\n    Node* n = new Node;\n    n->data = x;\n    n->next = nullptr;\n    if (q.rear == nullptr) {\n        q.front = n;\n        q.rear = n;\n    } else {\n        q.rear->next = n;\n        q.rear = n;\n    }\n}\n\nint dequeue(Queue &q) {\n    Node* t = q.front;\n    int x = t->data;\n    q.front = t->next;\n    if (q.front == nullptr)\n        q.rear = nullptr;\n    delete t;\n    return x;\n}`, `Queue q;\nenqueue(q, 7);\nenqueue(q, 8);\nenqueue(q, 9);\ncout << dequeue(q) << " ";\ncout << dequeue(q) << " ";\ncout << dequeue(q);`) },
  ],
  challenges: [
    { id: 'd6c1', title: 'تدوير الطابور', task: 'الطابور الدائري جاهز. اقرأ 4 أعداد وأدخلها، ثم اقرأ k ونفّذ k مرة: أخرج العنصر من الأمام وأعده إلى الخلف. ثم اطبع العناصر بإخراجها كلها.',
      code: F(`const int MAX = 4;\n\nstruct Queue {\n    int items[MAX];\n    int front = 0;\n    int rear = -1;\n    int count = 0;\n};\n\nvoid enqueue(Queue &q, int x) {\n    q.rear = (q.rear + 1) % MAX;\n    q.items[q.rear] = x;\n    q.count++;\n}\n\nint dequeue(Queue &q) {\n    int x = q.items[q.front];\n    q.front = (q.front + 1) % MAX;\n    q.count--;\n    return x;\n}`, `Queue q;\nint x, k;\nfor (int i = 0; i < 4; i++) {\n    cin >> x;\n    enqueue(q, x);\n}\ncin >> k;\n// اكتب الحل هنا\n`), tests: [{ input: '1 2 3 4 1', output: '2 3 4 1' }, { input: '5 6 7 8 2', output: '7 8 5 6' }] },
  ],
},
{
  course: DS, id: 'ds7', title: 'الاستدعاء الذاتي Recursion', tag: 'DS7 · C++',
  concept: `<p><b>الاستدعاء الذاتي</b> أن تستدعي الدالة نفسها لحل نسخة أصغر من المسألة، حتى تصل إلى <b>حالة التوقف</b> التي تُحل مباشرة.</p>
    <ul><li>بدون حالة توقف يستمر الاستدعاء إلى ما لا نهاية.</li>
    <li>تابع في الذاكرة إطارات الدالة وهي تتراكم ثم تعود واحدًا واحدًا.</li></ul>`,
  examples: [
    { id: 'd7a', title: 'المضروب', code: F(`int fact(int n) {\n    if (n <= 1)\n        return 1;\n    return n * fact(n - 1);\n}`, `cout << fact(4);`) },
    { id: 'd7b', title: 'متتالية فيبوناتشي', code: F(`int fib(int n) {\n    if (n <= 1)\n        return n;\n    return fib(n - 1) + fib(n - 2);\n}`, `for (int i = 0; i < 7; i++)\n    cout << fib(i) << " ";`) },
    { id: 'd7c', title: 'مجموع مصفوفة بالاستدعاء الذاتي', code: F(`int sumArr(int a[], int n) {\n    if (n == 0)\n        return 0;\n    return a[n - 1] + sumArr(a, n - 1);\n}`, `int a[4] = {3, 1, 4, 2};\ncout << sumArr(a, 4);`) },
    { id: 'd7d', title: 'طباعة القائمة بالعكس', code: F(NODE + '\n\n' + PUSHF + `\n\nvoid printReverse(Node* p) {\n    if (p == nullptr)\n        return;\n    printReverse(p->next);\n    cout << p->data << " ";\n}`, `Node* head = nullptr;\nfor (int i = 3; i >= 1; i--)\n    insertFront(head, i);\nprintReverse(head);`) },
  ],
  challenges: [
    { id: 'd7c1', title: 'القوة بالاستدعاء الذاتي', task: 'اكتب الدالة <code>power(b, e)</code> التي تحسب b مرفوعة للقوة e بالاستدعاء الذاتي (e غير سالب).',
      code: F(`// اكتب الدالة power هنا\n`, `int b, e;\ncin >> b >> e;\ncout << power(b, e);`), tests: [{ input: '2 10', output: '1024' }, { input: '5 0', output: '1' }, { input: '3 3', output: '27' }] },
    { id: 'd7c2', title: 'مجموع الأرقام', task: 'اكتب الدالة <code>digitSum(n)</code> التي تُرجع مجموع أرقام العدد n بالاستدعاء الذاتي.',
      code: F(`// اكتب الدالة digitSum هنا\n`, `int n;\ncin >> n;\ncout << digitSum(n);`), tests: [{ input: '472', output: '13' }, { input: '9', output: '9' }, { input: '1000', output: '1' }] },
  ],
},
{
  course: DS, id: 'ds8', title: 'شجرة البحث الثنائية BST', tag: 'DS8 · C++',
  concept: `<p><b>الشجرة الثنائية</b>: كل عقدة لها ابن أيسر <code>left</code> وابن أيمن <code>right</code>. وفي <b>شجرة البحث الثنائية</b> كل ما في اليسار أصغر من العقدة، وكل ما في اليمين أكبر منها.</p>
    <ul><li>الإضافة والبحث: نقارن بالجذر وننزل يسارًا أو يمينًا.</li>
    <li>طرق المرور: <b>inorder</b> (يسار، جذر، يمين) يطبعها مرتبة، و <b>preorder</b> و <b>postorder</b>.</li>
    <li>تُرسم الشجرة في الذاكرة تلقائيًا وأنت تضيف العقد.</li></ul>`,
  examples: [
    { id: 'd8a', title: 'بناء الشجرة و inorder', code: F(TNODE + '\n\n' + INSERT_BST + `\n\nvoid inorder(Node* r) {\n    if (r == nullptr)\n        return;\n    inorder(r->left);\n    cout << r->key << " ";\n    inorder(r->right);\n}`, `Node* root = nullptr;\nint a[6] = {50, 30, 70, 20, 40, 60};\nfor (int i = 0; i < 6; i++)\n    root = insert(root, a[i]);\ninorder(root);`) },
    { id: 'd8b', title: 'preorder و postorder', code: F(TNODE + '\n\n' + INSERT_BST + `\n\nvoid preorder(Node* r) {\n    if (r == nullptr)\n        return;\n    cout << r->key << " ";\n    preorder(r->left);\n    preorder(r->right);\n}\n\nvoid postorder(Node* r) {\n    if (r == nullptr)\n        return;\n    postorder(r->left);\n    postorder(r->right);\n    cout << r->key << " ";\n}`, `Node* root = nullptr;\nint a[5] = {8, 3, 10, 1, 6};\nfor (int i = 0; i < 5; i++)\n    root = insert(root, a[i]);\npreorder(root);\ncout << endl;\npostorder(root);`) },
    { id: 'd8c', title: 'البحث والارتفاع وأصغر قيمة', code: F(TNODE + '\n\n' + INSERT_BST + `\n\nbool search(Node* r, int k) {\n    if (r == nullptr)\n        return false;\n    if (r->key == k)\n        return true;\n    if (k < r->key)\n        return search(r->left, k);\n    return search(r->right, k);\n}\n\nint height(Node* r) {\n    if (r == nullptr)\n        return 0;\n    return 1 + max(height(r->left), height(r->right));\n}`, `Node* root = nullptr;\nint a[6] = {50, 30, 70, 20, 40, 60};\nfor (int i = 0; i < 6; i++)\n    root = insert(root, a[i]);\ncout << search(root, 40) << " " << search(root, 45) << endl;\ncout << "height = " << height(root) << endl;\nNode* p = root;\nwhile (p->left != nullptr)\n    p = p->left;\ncout << "min = " << p->key;`) },
  ],
  challenges: [
    { id: 'd8c1', title: 'عدد العقد', task: 'اكتب الدالة <code>countNodes(Node* r)</code> التي تُرجع عدد العقد في الشجرة. الدالة main تبني الشجرة من المدخلات.',
      code: F(TNODE + '\n\n' + INSERT_BST + `\n\n// اكتب الدالة countNodes هنا\n`, `Node* root = nullptr;\nint n, x;\ncin >> n;\nfor (int i = 0; i < n; i++) {\n    cin >> x;\n    root = insert(root, x);\n}\ncout << countNodes(root);`), tests: [{ input: '5 8 3 10 1 6', output: '5' }, { input: '1 4', output: '1' }] },
    { id: 'd8c2', title: 'عدد الأوراق', task: 'اكتب الدالة <code>countLeaves(Node* r)</code> التي تُرجع عدد الأوراق (العقد التي ليس لها أبناء).',
      code: F(TNODE + '\n\n' + INSERT_BST + `\n\n// اكتب الدالة countLeaves هنا\n`, `Node* root = nullptr;\nint n, x;\ncin >> n;\nfor (int i = 0; i < n; i++) {\n    cin >> x;\n    root = insert(root, x);\n}\ncout << countLeaves(root);`), tests: [{ input: '5 8 3 10 1 6', output: '3' }, { input: '3 1 2 3', output: '1' }] },
  ],
},
{
  course: DS, id: 'ds9', title: 'خوارزميات الترتيب', tag: 'DS9 · C++',
  concept: `<p><b>الترتيب</b> إعادة ترتيب العناصر تصاعديًا أو تنازليًا. تابع المصفوفة في الذاكرة: الخانات التي تتبدل في كل خطوة تتلوّن.</p>
    <ul><li><b>الفقاعات (Bubble)</b>: نقارن كل عنصرين متجاورين ونبدّلهما إذا كانا بترتيب خاطئ.</li>
    <li><b>الاختيار (Selection)</b>: نختار الأصغر ونضعه في مكانه.</li>
    <li><b>الإدراج (Insertion)</b>: ندرج كل عنصر في مكانه بين العناصر المرتبة قبله.</li></ul>`,
  examples: [
    { id: 'd9a', title: 'ترتيب الفقاعات', code: F('', `int a[5] = {5, 1, 4, 2, 8};\nfor (int i = 0; i < 4; i++) {\n    for (int j = 0; j < 4 - i; j++) {\n        if (a[j] > a[j + 1]) {\n            int t = a[j];\n            a[j] = a[j + 1];\n            a[j + 1] = t;\n        }\n    }\n}\nfor (int i = 0; i < 5; i++)\n    cout << a[i] << " ";`) },
    { id: 'd9b', title: 'ترتيب الاختيار', code: F('', `int a[5] = {29, 10, 14, 37, 13};\nfor (int i = 0; i < 4; i++) {\n    int minI = i;\n    for (int j = i + 1; j < 5; j++)\n        if (a[j] < a[minI])\n            minI = j;\n    int t = a[i];\n    a[i] = a[minI];\n    a[minI] = t;\n}\nfor (int i = 0; i < 5; i++)\n    cout << a[i] << " ";`) },
    { id: 'd9c', title: 'ترتيب الإدراج', code: F('', `int a[5] = {12, 11, 13, 5, 6};\nfor (int i = 1; i < 5; i++) {\n    int key = a[i];\n    int j = i - 1;\n    while (j >= 0 && a[j] > key) {\n        a[j + 1] = a[j];\n        j--;\n    }\n    a[j + 1] = key;\n}\nfor (int i = 0; i < 5; i++)\n    cout << a[i] << " ";`) },
  ],
  challenges: [
    { id: 'd9c1', title: 'ترتيب تنازلي', task: 'اقرأ 5 أعداد ورتّبها <b>تنازليًا</b> بأي خوارزمية، ثم اطبعها بينها مسافات.',
      code: F('', `int a[5];\nfor (int i = 0; i < 5; i++)\n    cin >> a[i];\n// اكتب الحل هنا\n`), tests: [{ input: '3 9 1 7 5', output: '9 7 5 3 1' }, { input: '1 1 2 2 0', output: '2 2 1 1 0' }] },
  ],
},
{
  course: DS, id: 'ds10', title: 'خوارزميات البحث', tag: 'DS10 · C++',
  concept: `<p><b>البحث الخطي</b> يمر على العناصر واحدًا واحدًا، ويصلح لأي مصفوفة. <b>البحث الثنائي</b> يعمل على مصفوفة <b>مرتبة</b>: يقارن بالعنصر الأوسط ويستبعد نصف المصفوفة في كل خطوة، فهو أسرع بكثير.</p>
    <ul><li>تابع جدول التتبع في البحث الثنائي: قيم low و high و mid في كل دورة.</li></ul>`,
  examples: [
    { id: 'd10a', title: 'البحث الخطي', code: F(`int linearSearch(int a[], int n, int key) {\n    for (int i = 0; i < n; i++)\n        if (a[i] == key)\n            return i;\n    return -1;\n}`, `int a[6] = {7, 3, 9, 1, 5, 8};\ncout << linearSearch(a, 6, 5) << " " << linearSearch(a, 6, 4);`) },
    { id: 'd10b', title: 'البحث الثنائي', code: F(`int binarySearch(int a[], int n, int key) {\n    int low = 0, high = n - 1;\n    while (low <= high) {\n        int mid = (low + high) / 2;\n        if (a[mid] == key)\n            return mid;\n        if (a[mid] < key)\n            low = mid + 1;\n        else\n            high = mid - 1;\n    }\n    return -1;\n}`, `int a[8] = {2, 5, 8, 12, 16, 23, 38, 56};\ncout << binarySearch(a, 8, 23) << endl;\ncout << binarySearch(a, 8, 7);`) },
  ],
  challenges: [
    { id: 'd10c1', title: 'البحث الثنائي بالاستدعاء الذاتي', task: 'اكتب الدالة <code>bs(a, low, high, key)</code> التي تبحث بحثًا ثنائيًا بالاستدعاء الذاتي وتُرجع الموقع أو -1.',
      code: F(`// اكتب الدالة bs هنا\n`, `int a[7] = {1, 3, 5, 7, 9, 11, 13};\nint k;\ncin >> k;\ncout << bs(a, 0, 6, k);`), tests: [{ input: '9', output: '4' }, { input: '1', output: '0' }, { input: '4', output: '-1' }, { input: '13', output: '6' }] },
  ],
},
);
})();
