/* Quiz helpers: attach self-test questions and extra essay (write-the-program) questions to lessons.
   FS_addQuiz(lessonId, quiz, essays)
   quiz item: {k:'mcq', q, opts:[...], a: index, why?}  |  {k:'out', code, input?, q?, why?}  (answer = interpreter output)
   essay: {id, title, task, code (starter), ref (model answer), inputs:[...]}  — expected outputs come from running ref. */
(function () {
const ind = (b) => b.replace(/^/gm, '    ').replace(/^\s+$/gm, '');
const F = (fns, body) => `#include <iostream>\nusing namespace std;\n\n${fns ? fns.trim() + '\n\n' : ''}int main() {\n${ind(body)}\n    return 0;\n}\n`;
window.FS_Q = {
  F,
  P: (body) => F('', body),
  S: (body) => `#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n${ind(body)}\n    return 0;\n}\n`,
};
window.FS_addQuiz = function (id, quiz, essays) {
  const L = window.FS_LESSONS.find((x) => x.id === id);
  if (!L) throw new Error('no lesson ' + id);
  L.quiz = (L.quiz || []).concat(quiz || []);
  (essays || []).forEach((e) => {
    const c = { id: e.id, title: e.title, task: e.task, code: e.code, ref: e.ref, inputs: e.inputs, essay: true };
    let cache = null;
    Object.defineProperty(c, 'tests', {
      enumerable: true,
      get() { return cache || (cache = c.inputs.map((i) => ({ input: i, output: window.FSCpp.runAll(c.ref, i).output }))); },
    });
    L.challenges.push(c);
  });
};
})();
