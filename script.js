window.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("startBtn");
  const resetBtn = document.getElementById("resetBtn");
  const quizContainer = document.getElementById("quizContainer");
  const questionCountInput = document.getElementById("question-count");
  const correctCountSpan = document.getElementById("correctCount");
  const incorrectCountSpan = document.getElementById("incorrectCount");
  const errorDiv = document.getElementById("error");
  const difficultySelect = document.getElementById("difficulty");

  let correctAnswers = 0;
  let incorrectAnswers = 0;

  // Event1: Start game
  startBtn.addEventListener("click", () => {
    const count = parseInt(questionCountInput.value);
    const difficulty = difficultySelect.value;

    // Validate input
    if (isNaN(count) || count < 5 || count > 10) {
      errorDiv.textContent = "❗ Please enter a number between 5 and 10.";
      return;
    }

    errorDiv.textContent = "";
    fetchQuestions(count, difficulty); // Fetch questions
  });

  // Event2: Reset game
  resetBtn.addEventListener("click", () => {
    quizContainer.innerHTML = ""; // Clear questions
    questionCountInput.value = ""; // Clear input
    correctCountSpan.textContent = "0"; // Reset correct count
    incorrectCountSpan.textContent = "0"; // Reset incorrect count
    errorDiv.textContent = ""; // Clear error messages
    correctAnswers = 0; // Reset scores
    incorrectAnswers = 0;
  });

  // Event3: Double click on reset
  resetBtn.addEventListener("dblclick", () => {
    alert("🔄 Game has been fully reset!");
  });

  // Event4: Input change
  questionCountInput.addEventListener("input", () => {
    errorDiv.textContent = ""; // Clear error on input change
  });

  // Fetch questions from API
  function fetchQuestions(count, difficulty) {
    fetch(`https://opentdb.com/api.php?amount=${count}&difficulty=${difficulty}&type=multiple`)
      .then(response => response.json())
      .then(data => {
        quizContainer.innerHTML = ""; // Clear previous questions
        data.results.forEach((questionData, index) => {
          const questionDiv = document.createElement("div");
          questionDiv.classList.add("question"); // Add class for styling

          const questionText = document.createElement("p");
          questionText.innerHTML = `<strong>Q${index + 1}:</strong> ${questionData.question}`;
          questionDiv.appendChild(questionText); // Add question text

          const answers = [...questionData.incorrect_answers];
          const correct = questionData.correct_answer;
          answers.splice(Math.floor(Math.random() * 4), 0, correct); // Randomize answers

          answers.forEach(answer => {
            const button = document.createElement("button");
            button.textContent = answer; // Set button text
            button.addEventListener("click", () => {
              // Check answer
              if (answer === correct) {
                correctAnswers++;
                correctCountSpan.textContent = correctAnswers; // Update correct count
                button.style.backgroundColor = "green"; // Highlight correct answer
              } else {
                incorrectAnswers++;
                incorrectCountSpan.textContent = incorrectAnswers; // Update incorrect count
                button.style.backgroundColor = "red"; // Highlight incorrect answer
              }
              Array.from(button.parentElement.querySelectorAll("button")).forEach(btn => btn.disabled = true); // Disable all buttons
            });
            questionDiv.appendChild(button); // Add answer button
          });

          quizContainer.appendChild(questionDiv); // Add question to container
        });
      })
      .catch(err => {
        errorDiv.textContent = "⚠️ Error fetching questions. Try again later."; // Error handling
      });
  }
});