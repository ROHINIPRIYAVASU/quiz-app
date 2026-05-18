// ---- SELECTING ALL HTML ELEMENTS ----
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const categorySelect = document.getElementById('category');
const difficultySelect = document.getElementById('difficulty');
const questionEl = document.getElementById('question');
const answersEl = document.getElementById('answers');
const currentEl = document.getElementById('current');
const scoreEl = document.getElementById('score');

// ---- GAME VARIABLES ----
let questions = [];
let currentQuestion = 0;
let score = 0;

// ---- FETCH QUESTIONS FROM API ----
async function fetchQuestions() {
    const category = categorySelect.value;
    const difficulty = difficultySelect.value;
    const url = `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=multiple`;
    
    const response = await fetch(url);
    const data = await response.json();
    questions = data.results;
}

// ---- SHOW A QUESTION ----
function showQuestion() {
    const q = questions[currentQuestion];
    questionEl.innerHTML = q.question;
    currentEl.textContent = currentQuestion + 1;

    // Mix correct + wrong answers together
    const allAnswers = [...q.incorrect_answers, q.correct_answer];
    allAnswers.sort(() => Math.random() - 0.5);

    answersEl.innerHTML = '';
    allAnswers.forEach(answer => {
        const btn = document.createElement('button');
        btn.innerHTML = answer;
        btn.classList.add('answer-btn');
        btn.onclick = () => checkAnswer(btn, answer, q.correct_answer);
        answersEl.appendChild(btn);
    });
}

// ---- CHECK IF ANSWER IS CORRECT ----
function checkAnswer(btn, selected, correct) {
    const allBtns = answersEl.querySelectorAll('.answer-btn');
    
    // Disable all buttons after clicking
    allBtns.forEach(b => b.disabled = true);

    if (selected === correct) {
        btn.classList.add('correct');
        score++;
    } else {
        btn.classList.add('wrong');
        // Show correct answer in green
        allBtns.forEach(b => {
            if (b.innerHTML === correct) b.classList.add('correct');
        });
    }

    // Move to next question after 1 second
    setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < questions.length) {
            showQuestion();
        } else {
            showResult();
        }
    }, 1000);
}

// ---- SHOW FINAL RESULT ----
function showResult() {
    quizScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');
    scoreEl.textContent = score;
}

// ---- START QUIZ ----
startBtn.onclick = async () => {
    await fetchQuestions();
    startScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    showQuestion();
}

// ---- RESTART QUIZ ----
restartBtn.onclick = () => {
    currentQuestion = 0;
    score = 0;
    resultScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
}

