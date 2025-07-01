 let questions = [];
    let currentIndex = 0;
    let rightAnswers = 0;
    let userAnswers = [];
    let timer;
    let timeLimit = 60; // seconds per question

    const countSpan = document.querySelector(".count-span");
    const bulletsContainer = document.querySelector(".spans");
    const questionArea = document.querySelector(".question");
    const answersArea = document.querySelector(".answers-area");
    const submitButton = document.querySelector(".submit-button");
    const prevButton = document.querySelector(".prev-button");
    const resultsContainer = document.querySelector(".results");
    const timerDisplay = document.getElementById("time");

    function createBullets(num) {
        countSpan.textContent = num;
        bulletsContainer.innerHTML = "";
        for (let i = 0; i < num; i++) {
        let span = document.createElement("span");
        if (i === 0) span.className = "on";
        bulletsContainer.appendChild(span);
        }
    }

    function showQuestion(q) {
        questionArea.textContent = q.title;
        answersArea.innerHTML = "";
        for (let key in q.answers) {
        let btn = document.createElement("button");
        btn.textContent = q.answers[key];
        btn.onclick = function () {
            document.querySelectorAll('.answers-area button').forEach(b => b.classList.remove("selected"));
            this.classList.add("selected");
            userAnswers[currentIndex] = this.textContent;
        };
        if (userAnswers[currentIndex] === q.answers[key]) {
        btn.classList.add("selected");
        }
        answersArea.appendChild(btn);
        }
        resetTimer();
    }

    function checkAnswer() {
        let selected = userAnswers[currentIndex];
        return selected && selected === questions[currentIndex].right_answer;
    }

    function handleBullets() {
        let spans = document.querySelectorAll(".spans span");
        spans.forEach((span, index) => {
        span.classList.remove("on");
        if (index === currentIndex) {
            span.classList.add("on");
        }
        });
    }

    function showResults(total, correct) {
    questionArea.remove();
    answersArea.remove();
    document.querySelector(".buttons").remove();
    bulletsContainer.remove();
    document.querySelector(".timer").remove();
        if (correct === total) {
        resultsContainer.innerHTML = `<span style="color: green;">Perfect</span>, ${correct} of ${total}`;
        } else if (correct > total / 2) {
        resultsContainer.innerHTML = `<span style="color: orange;">Good</span>, ${correct} of ${total}`;
        } else {
        resultsContainer.innerHTML = `<span style="color: red;">Fail</span>, ${correct} of ${total}<br><button class='retry-btn' onclick='restartQuiz()'>Try Again</button>`;
        }
    }

    function nextQuestion() {
        if (checkAnswer()) {
        if (!userAnswers[currentIndex + 1]) rightAnswers++;
        }
        currentIndex++;
        if (currentIndex < questions.length) {
        showQuestion(questions[currentIndex]);
        handleBullets();
        } else {
        let finalCorrect = 0;
        questions.forEach((q, i) => {
            if (userAnswers[i] === q.right_answer) finalCorrect++;
        });
        showResults(questions.length, finalCorrect);
            }
    }

    function resetTimer() {
        clearInterval(timer);
        let remaining = timeLimit;
        timerDisplay.textContent = remaining;
        timer = setInterval(() => {
        remaining--;
        timerDisplay.textContent = remaining;
        if (remaining === 0) {
            clearInterval(timer);
            nextQuestion();
        }
        }, 1000);
    }

// try again
    function restartQuiz() {
        location.reload();
    }


    submitButton.onclick = function () {
        clearInterval(timer);
        nextQuestion();
    }


    prevButton.onclick = function () {
        if (currentIndex > 0) {
        currentIndex--;
        showQuestion(questions[currentIndex]);
        handleBullets();
            }
    }



    fetch("questions.json")
        .then(res => res.json())
        .then(data => {
        questions = data;
        createBullets(questions.length);
        showQuestion(questions[currentIndex]);
        });


