window.addEventListener("DOMContentLoaded", () => {
  //Get page elements
  const startBtn = document.getElementById("startBtn");
  const resetBtn = document.getElementById("resetBtn");
  const quizContainer = document.getElementById("quizContainer");
  const questionCountInput = document.getElementById("question-count");
  const correctCountSpan = document.getElementById("correctCount");
  const incorrectCountSpan = document.getElementById("incorrectCount");
  const bestScoreSpan = document.getElementById("bestScore");
  const errorDiv = document.getElementById("error");
  const difficultySelect = document.getElementById("difficulty");

  let correctAnswers = 0;
  let incorrectAnswers = 0;

 //Load best score from local storage
  const savedBest = localStorage.getItem("bestScore");
  if (savedBest) bestScoreSpan.textContent = savedBest;

  //When "Start Game" is clicked
  startBtn.addEventListener("click", () => {
    const count = parseInt(questionCountInput.value);
    const difficulty = difficultySelect.value;

    //Validate input
    if (isNaN(count) || count < 5 || count > 10) {
      errorDiv.textContent = "❗ Please enter a number between 5 and 10.";
      return;
    }

    errorDiv.textContent = "";
    fetchQuestions(count, difficulty);
  });

  //Reset the quiz
  resetBtn.addEventListener("click", () => {
    quizContainer.innerHTML = "";
    questionCountInput.value = "";
    correctCountSpan.textContent = "0";
    incorrectCountSpan.textContent = "0";
    errorDiv.textContent = "";
    correctAnswers = 0;
    incorrectAnswers = 0;
  });

  
  //Show message on double-click reset
  resetBtn.addEventListener("dblclick", () => {
    alert("🔄 Game has been fully reset!");
  });

  questionCountInput.addEventListener("input", () => {
    errorDiv.textContent = "";
  });

  //Fetch trivia questions from the API
  function fetchQuestions(count, difficulty) {
    fetch(`https://opentdb.com/api.php?amount=${count}&difficulty=${difficulty}&type=multiple`)
      .then(response => response.json())
      .then(data => {
        quizContainer.innerHTML = "";
        data.results.forEach((questionData, index) => {
          const questionDiv = document.createElement("div");
          questionDiv.classList.add("question");

          const questionText = document.createElement("p");
          questionText.innerHTML = `<strong>Q${index + 1}:</strong> ${questionData.question}`;
          questionDiv.appendChild(questionText);

          const answers = [...questionData.incorrect_answers];
          const correct = questionData.correct_answer;
          answers.splice(Math.floor(Math.random() * 4), 0, correct);

          answers.forEach(answer => {
            const button = document.createElement("button");
            button.textContent = answer;
            button.addEventListener("click", () => {
              // Check if the selected answer is correct
              if (answer === correct) {
                correctAnswers++;
                correctCountSpan.textContent = correctAnswers;
                button.style.backgroundColor = "green";
              } else {
                incorrectAnswers++;
                incorrectCountSpan.textContent = incorrectAnswers;
                button.style.backgroundColor = "red";
              }
              Array.from(button.parentElement.querySelectorAll("button")).forEach(btn => btn.disabled = true);
              
              //Update best score
              const best = parseInt(localStorage.getItem("bestScore") || "0");
              if (correctAnswers > best) {
                localStorage.setItem("bestScore", correctAnswers);
                bestScoreSpan.textContent = correctAnswers;
              }
            });
            questionDiv.appendChild(button);
          });

          quizContainer.appendChild(questionDiv);
        });
      })
      .catch(() => {
        errorDiv.textContent = "⚠️ Error fetching questions. Try again later.";
      });
  }
});
