// ═══════════════════════════════════════════════════════
//  CBT EXAM SYSTEM — script.js
//  Demo credentials: REG/2024/001  |  pass: demo123
// ═══════════════════════════════════════════════════════

/* ─── DEMO DATABASE ─── */
const DEMO_STUDENTS = {
  "REG/2024/001": {
    password: "demo123",
    name: "Adesanya Miracle",
    class: "SS3A",
    photo: "https://i.pravatar.cc/150?img=33",
  },
  "REG/2024/002": {
    password: "pass456",
    name: "Bello Fatima",
    class: "SS3B",
    photo: "https://i.pravatar.cc/150?img=47",
  }
};

const EXAMS = {
  mathematics: {
    label: "Mathematics",
    duration: 40 * 60,  // seconds
    questions: [
      { q: "If 3x + 7 = 22, what is the value of x?", opts: ["3","4","5","6"], ans: 2 },
      { q: "What is the value of √144?", opts: ["10","11","12","13"], ans: 2 },
      { q: "Simplify: 2³ × 2² =", opts: ["2⁵","2⁶","2⁴","2⁷"], ans: 0 },
      { q: "A triangle has angles 60°, 80°, and x°. Find x.", opts: ["30°","40°","50°","60°"], ans: 1 },
      { q: "If the ratio of boys to girls in a class is 3:5 and there are 24 girls, how many boys are there?", opts: ["12","14","16","18"], ans: 2 },
      { q: "What is the LCM of 4, 6, and 9?", opts: ["18","24","36","48"], ans: 2 },
      { q: "The circumference of a circle with radius 7 cm is (use π = 22/7):", opts: ["22 cm","44 cm","66 cm","33 cm"], ans: 1 },
      { q: "If P = {1,2,3,4} and Q = {3,4,5,6}, what is P ∩ Q?", opts: ["{1,2}","{3,4}","{5,6}","{1,2,5,6}"], ans: 1 },
      { q: "Express 0.00045 in standard form:", opts: ["4.5 × 10⁻⁴","4.5 × 10⁻³","45 × 10⁻⁵","0.45 × 10⁻³"], ans: 0 },
      { q: "The gradient of a line passing through (2,3) and (4,7) is:", opts: ["1","2","3","4"], ans: 1 },
    ]
  },
  english: {
    label: "English Language",
    duration: 45 * 60,
    questions: [
      { q: "Choose the word that is closest in meaning to 'BENEVOLENT':", opts: ["Cruel","Kind","Proud","Lazy"], ans: 1 },
      { q: "Identify the part of speech of the underlined word: 'She runs QUICKLY'.", opts: ["Adjective","Noun","Adverb","Verb"], ans: 2 },
      { q: "Which sentence is grammatically correct?", opts: ["He don't like it","She have gone","They were playing","I has finished"], ans: 2 },
      { q: "The plural of 'datum' is:", opts: ["datums","datas","data","datum"], ans: 2 },
      { q: "Choose the antonym of 'VERBOSE':", opts: ["Talkative","Concise","Wordy","Fluent"], ans: 1 },
      { q: "A figure of speech that attributes human qualities to non-human things is:", opts: ["Simile","Metaphor","Personification","Hyperbole"], ans: 2 },
      { q: "Which word correctly completes this sentence? 'She is taller ___ her sister.'", opts: ["then","than","that","as"], ans: 1 },
      { q: "Identify the mood of this sentence: 'If I were rich, I would travel the world.'", opts: ["Indicative","Imperative","Subjunctive","Interrogative"], ans: 2 },
    ]
  },
  biology: {
    label: "Biology",
    duration: 40 * 60,
    questions: [
      { q: "The powerhouse of the cell is the:", opts: ["Nucleus","Ribosome","Mitochondria","Golgi body"], ans: 2 },
      { q: "Photosynthesis occurs in which organelle?", opts: ["Chloroplast","Lysosome","Vacuole","Nucleus"], ans: 0 },
      { q: "The process by which plants lose water through their leaves is called:", opts: ["Osmosis","Transpiration","Diffusion","Absorption"], ans: 1 },
      { q: "Which blood group is the universal donor?", opts: ["A","B","AB","O"], ans: 3 },
      { q: "DNA stands for:", opts: ["Deoxyribose Nucleic Acid","Deoxyribonucleic Acid","Dextrose Nucleic Acid","Diribonucleic Acid"], ans: 1 },
      { q: "The part of the brain responsible for balance and coordination is the:", opts: ["Cerebrum","Medulla","Cerebellum","Hypothalamus"], ans: 2 },
      { q: "Which enzyme is responsible for breaking down starch?", opts: ["Lipase","Pepsin","Amylase","Trypsin"], ans: 2 },
    ]
  }
};

/* ─── STATE ─── */
let state = {
  student: null,
  exam: null,
  examKey: null,
  currentQ: 0,
  answers: {},
  timerInterval: null,
  timeLeft: 0,
  startTime: null,
};

/* ─── HELPERS ─── */
const $ = (id) => document.getElementById(id);
const pad = (n) => String(n).padStart(2, '0');

function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
}

function formatTime(secs) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  if (h > 0) return `${pad(h)}:${pad(m)}:${pad(s)}`;
  return `${pad(m)}:${pad(s)}`;
}

/* ─── LOGIN ─── */
document.getElementById('btn-login').addEventListener('click', handleLogin);
document.getElementById('login-form').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleLogin();
});

function handleLogin() {
  const reg = $('input-reg').value.trim().toUpperCase();
  const pass = $('input-pass').value.trim();
  const examKey = $('select-exam').value;
  const errEl = $('login-error');

  if (!reg || !pass || !examKey) {
    showError("Please fill in all fields and select an exam.");
    return;
  }

  const student = DEMO_STUDENTS[reg];
  if (!student || student.password !== pass) {
    showError("Invalid registration number or password. Try: REG/2024/001 / demo123");
    return;
  }

  errEl.style.display = 'none';
  state.student = { ...student, reg };
  state.examKey = examKey;
  state.exam = EXAMS[examKey];

  showProfilePage();
}

function showError(msg) {
  const errEl = $('login-error');
  errEl.textContent = msg;
  errEl.style.display = 'block';
}

/* ─── PROFILE PAGE ─── */
function showProfilePage() {
  const { student, exam, examKey } = state;

  $('profile-photo').src = student.photo;
  $('profile-photo').alt = student.name;
  $('profile-name').textContent = student.name;
  $('profile-reg').textContent = student.reg;
  $('profile-class').textContent = student.class;
  $('profile-subject').textContent = exam.label;
  $('profile-questions').textContent = exam.questions.length;
  $('profile-duration').textContent = formatTime(exam.duration);

  showPage('page-profile');
}

document.getElementById('btn-proceed').addEventListener('click', startExam);

/* ─── EXAM PAGE ─── */
function startExam() {
  state.currentQ = 0;
  state.answers = {};
  state.timeLeft = state.exam.duration;
  state.startTime = Date.now();

  // populate topbar
  $('exam-subject').textContent = state.exam.label;
  $('exam-student-photo').src = state.student.photo;
  $('exam-student-name').textContent = state.student.name;
  $('exam-student-class').textContent = state.student.class;

  buildQuestionGrid();
  renderQuestion();
  startTimer();
  showPage('page-exam');
}

function buildQuestionGrid() {
  const grid = $('q-grid');
  grid.innerHTML = '';
  state.exam.questions.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'q-dot';
    dot.textContent = i + 1;
    dot.id = `q-dot-${i}`;
    dot.addEventListener('click', () => jumpToQuestion(i));
    grid.appendChild(dot);
  });
}

function renderQuestion() {
  const { exam, currentQ, answers } = state;
  const total = exam.questions.length;
  const q = exam.questions[currentQ];

  // counter & progress
  $('q-counter').textContent = `Question ${currentQ + 1} of ${total}`;
  $('progress-fill').style.width = `${((currentQ + 1) / total) * 100}%`;

  // question text
  $('question-text').textContent = q.q;

  // options
  const optList = $('options-list');
  optList.innerHTML = '';
  const letters = ['A', 'B', 'C', 'D'];
  q.opts.forEach((opt, i) => {
    const item = document.createElement('div');
    item.className = 'option-item' + (answers[currentQ] === i ? ' selected' : '');
    item.innerHTML = `
      <div class="option-letter">${letters[i]}</div>
      <div class="option-text">${opt}</div>
    `;
    item.addEventListener('click', () => selectAnswer(i));
    optList.appendChild(item);
  });

  // nav buttons
  $('btn-prev').style.visibility = currentQ === 0 ? 'hidden' : 'visible';
  const nextBtn = $('btn-next');
  nextBtn.textContent = currentQ === total - 1 ? 'Finish Exam →' : 'Next →';

  // update grid dots
  updateGridDots();
}

function selectAnswer(optIndex) {
  state.answers[state.currentQ] = optIndex;
  // re-render options
  const items = document.querySelectorAll('.option-item');
  items.forEach((item, i) => {
    item.classList.toggle('selected', i === optIndex);
    const letter = item.querySelector('.option-letter');
    letter.style.background = i === optIndex ? 'var(--accent)' : '';
    letter.style.color = i === optIndex ? 'var(--navy)' : '';
    letter.style.borderColor = i === optIndex ? 'var(--accent)' : '';
  });
  updateGridDots();
}

function updateGridDots() {
  const { currentQ, answers, exam } = state;
  exam.questions.forEach((_, i) => {
    const dot = $(`q-dot-${i}`);
    if (!dot) return;
    dot.classList.remove('current', 'answered');
    if (i === currentQ) dot.classList.add('current');
    else if (answers[i] !== undefined) dot.classList.add('answered');
  });
}

function jumpToQuestion(i) {
  state.currentQ = i;
  renderQuestion();
}

document.getElementById('btn-prev').addEventListener('click', () => {
  if (state.currentQ > 0) {
    state.currentQ--;
    renderQuestion();
  }
});

document.getElementById('btn-next').addEventListener('click', () => {
  const total = state.exam.questions.length;
  if (state.currentQ < total - 1) {
    state.currentQ++;
    renderQuestion();
  } else {
    endExam();
  }
});

/* ─── TIMER ─── */
function startTimer() {
  clearInterval(state.timerInterval);
  updateTimerDisplay();
  state.timerInterval = setInterval(() => {
    state.timeLeft--;
    updateTimerDisplay();
    if (state.timeLeft <= 0) {
      clearInterval(state.timerInterval);
      endExam(true);
    }
  }, 1000);
}

function updateTimerDisplay() {
  const el = $('timer-display');
  el.textContent = formatTime(state.timeLeft);
  el.classList.remove('warning', 'danger');
  if (state.timeLeft <= 60)       el.classList.add('danger');
  else if (state.timeLeft <= 300) el.classList.add('warning');
}

/* ─── FINISH ─── */
function endExam(timeout = false) {
  clearInterval(state.timerInterval);

  const total    = state.exam.questions.length;
  const answered = Object.keys(state.answers).length;
  const elapsed  = Math.floor((Date.now() - state.startTime) / 1000);

  $('finish-subject').textContent  = state.exam.label;
  $('stat-answered').textContent   = answered;
  $('stat-total').textContent      = total;
  $('stat-unanswered').textContent = total - answered;
  $('stat-time').textContent       = formatTime(elapsed);

  if (timeout) {
    $('finish-message').textContent = "Time's up! Your paper has been submitted automatically.";
  } else {
    $('finish-message').textContent =
      `You have answered ${answered} out of ${total} question${total !== 1 ? 's' : ''}. Your paper is ready to submit.`;
  }

  showPage('page-finish');
}

document.getElementById('btn-submit-paper').addEventListener('click', () => {
  // In production this would POST to server
  $('finish-icon').textContent = '✅';
  $('finish-title').textContent = 'Paper Submitted!';
  $('finish-message').textContent = 'Your answers have been recorded. You may now close this window.';
  $('btn-submit-paper').disabled = true;
  $('btn-submit-paper').textContent = 'Submitted ✓';
  $('btn-exit-paper').textContent = 'Close & Exit';
});

document.getElementById('btn-exit-paper').addEventListener('click', () => {
  if (confirm('Are you sure you want to exit? This will log you out.')) {
    // reset state
    state = { student:null, exam:null, examKey:null, currentQ:0, answers:{}, timerInterval:null, timeLeft:0, startTime:null };
    $('input-reg').value = '';
    $('input-pass').value = '';
    $('select-exam').selectedIndex = 0;
    $('login-error').style.display = 'none';
    $('finish-icon').textContent = '🎉';
    $('finish-title').textContent = 'Paper Completed!';
    $('btn-submit-paper').disabled = false;
    $('btn-submit-paper').textContent = '📤 Finish & Submit Paper';
    $('btn-exit-paper').textContent = '🚪 Exit Without Submitting';
    showPage('page-login');
  }
});