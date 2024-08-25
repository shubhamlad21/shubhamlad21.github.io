let currentQuestion = 0;
const questions = document.querySelectorAll('.question-box');
const timerDisplay = document.getElementById('timer');
const scoreDisplay = document.getElementById('score');
const progressBar = document.getElementById('progress-bar');
const lifelineButton = document.getElementById('lifeline-button');
const totalQuestions = questions.length; // Total number of questions
let timeLeft = 25; // Set timer for each question
let score = 0; // Initialize score
let countdown; // Reference to the timer

function startQuiz() {
    showQuestion(currentQuestion);
    startTimer();
    updateProgressBar(); // Initialize progress bar
    lifelineButton.disabled = false; // Enable lifeline button
}

function showQuestion(index) {
    if (index < questions.length) {
        questions.forEach(q => q.style.display = 'none'); // Hide all questions
        questions[index].style.display = 'block'; // Show the current question
        updateQuestionNumber(); // Update question number
        resetOptions(); // Reset options
    } else {
        endQuiz(); // End the quiz if no more questions
    }
}

function startTimer() {
    countdown = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(countdown);
            nextQuestion();
        }
    }, 1000);
}

function checkAnswer(option, isCorrect) {
    clearInterval(countdown); // Stop the timer when an answer is clicked

    if (isCorrect) {
        score += 1; // Correct answer adds 1 point
    } else {
        score -= 0.5; // Wrong answer subtracts 0.5 points
    }
    scoreDisplay.textContent = score.toFixed(1); // Update score display
    nextQuestion();
}

function nextQuestion() {
    currentQuestion++;
    timeLeft = 25; // Reset time for next question
    showQuestion(currentQuestion);
    if (currentQuestion < questions.length) {
        startTimer();
        updateProgressBar(); // Update progress bar
    }
}

function updateProgressBar() {
    const progress = (currentQuestion / (questions.length - 1)) * 100; // Calculate progress percentage
    document.getElementById('progress-bar-fill').style.width = `${progress}%`;
    document.getElementById('progress-text').textContent = `${Math.round(progress)}%`; // Update text overlay
}

function updateQuestionNumber() {
    const questionHeading = document.getElementById('question-heading');
    questionHeading.textContent = `Question ${currentQuestion + 1}`;
}

function resetOptions() {
    const options = document.querySelectorAll('.question-box')[currentQuestion].querySelectorAll('.option');
    options.forEach(option => {
        option.style.display = 'block'; // Ensure all options are visible before applying the lifeline
    });
}

function useLifeline() {
    const options = document.querySelectorAll('.question-box')[currentQuestion].querySelectorAll('.option');
    const incorrectOptions = Array.from(options).filter(option => !option.getAttribute('onclick').includes('true'));

    if (incorrectOptions.length > 1) {
        // Randomly select two incorrect options to hide
        for (let i = 0; i < 2; i++) {
            const randomIndex = Math.floor(Math.random() * incorrectOptions.length);
            incorrectOptions[randomIndex].style.display = 'none';
            incorrectOptions.splice(randomIndex, 1); // Remove selected option from the array
        }
    }

    lifelineButton.disabled = true; // Disable lifeline button after use
}

const askColleagueButton = document.getElementById('ask-colleague-button');

askColleagueButton.addEventListener('click', () => {
    askColleagueButton.disabled = true; // Disable the button on click
});


function endQuiz() {
    document.getElementById('quiz-container').innerHTML = `<h1>Quiz Finished!</h1><p>Your final score is: ${score.toFixed(1)}</p>`;
}

// Disable right-click, text selection, and key combinations for copying
document.addEventListener('contextmenu', event => event.preventDefault());
document.addEventListener('selectstart', event => event.preventDefault()); // Disable text selection
document.addEventListener('copy', event => event.preventDefault()); // Disable copy action

document.addEventListener('keydown', event => {
    if (event.ctrlKey || event.metaKey || event.keyCode === 67 || event.keyCode === 85 || event.keyCode === 123) {
        // Ctrl+C, Cmd+C, Ctrl+U (view source), F12 (DevTools)
        event.preventDefault();
    }
});

window.onload = startQuiz;
