let timeLeft = 2 * 60 * 60;
let gameActive = true;
let countdownInterval;
let wireStates = [false, false];
let progressValue = 0;
let processingInput = [false, false];
let secretPhaseActive = false;

const input1 = document.getElementById("input1");
const input2 = document.getElementById("input2");
const messageLeft = document.getElementById("messageLeft");
const messageRight = document.getElementById("messageRight");
const progressBar = document.getElementById("progressBar");
const progressPercentage = document.getElementById("progressPercentage");
const capsuleImage = document.getElementById("capsuleImage");
const capsuleOverlay = document.getElementById("capsuleOverlay");
const ledRed = document.getElementById("ledRed");
const ledGreen = document.getElementById("ledGreen");
const capsuleGlow = document.getElementById("capsuleGlow");
const sevenSegmentDisplay = document.querySelector(".seven-segment-display");
const secretPhase = document.getElementById("secretPhase");
const secretInput = document.getElementById("secretInput");
const finalOverlay = document.getElementById("finalOverlay");
const bombFinal = document.getElementById("bombFinal");
const particles = document.getElementById("particles");
const victoryMessage = document.getElementById("victoryMessage");
const victoryOverlay = document.getElementById("victoryOverlay");
const input1Indicator = document.getElementById("input1Indicator");
const input2Indicator = document.getElementById("input2Indicator");
const input1Status = document.getElementById("input1Status");
const input2Status = document.getElementById("input2Status");

const correctWords = ["plaisir", "combativité"];
const secretWord = "ensemble";

const segmentConfig = {
  0: ["a", "b", "c", "d", "e", "f"],
  1: ["b", "c"],
  2: ["a", "b", "g", "e", "d"],
  3: ["a", "b", "g", "c", "d"],
  4: ["f", "g", "b", "c"],
  5: ["a", "f", "g", "c", "d"],
  6: ["a", "f", "g", "c", "d", "e"],
  7: ["a", "b", "c"],
  8: ["a", "b", "c", "d", "e", "f", "g"],
  9: ["a", "b", "c", "d", "f", "g"],
};

function displayDigit(digitId, number) {
  const digit = document.getElementById(digitId);
  const segments = digit.querySelectorAll(".segment");

  segments.forEach((segment) => {
    segment.classList.add("off");
  });

  if (segmentConfig[number]) {
    segmentConfig[number].forEach((segmentName) => {
      const segment = digit.querySelector(`.${segmentName}`);
      if (segment) {
        segment.classList.remove("off");
      }
    });
  }
}

function updateSevenSegmentDisplay(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  displayDigit("hour1", Math.floor(hours / 10));
  displayDigit("hour2", hours % 10);

  displayDigit("min1", Math.floor(minutes / 10));
  displayDigit("min2", minutes % 10);

  displayDigit("sec1", Math.floor(seconds / 10));
  displayDigit("sec2", seconds % 10);
}

function startGame() {
  updateCountdown();
  countdownInterval = setInterval(updateCountdown, 1000);

  input1.addEventListener("input", () => debounceValidation(1));
  input2.addEventListener("input", () => debounceValidation(2));

  if (typeof handleSecretInput === "function") {
    secretInput.addEventListener("input", handleSecretInput);
  }
}

function triggerSecretPhase() {
  if (!gameActive || secretPhaseActive) return;

  console.log("Déclenchement de la phase secrète...");
  secretPhaseActive = true;

  capsuleImage.style.animation = "none";
  capsuleImage.offsetHeight;
  capsuleImage.style.animation = "capsuleShakeAndGrow 3s ease-in-out";

  const capsuleFrame = document.querySelector(".capsule-frame");
  capsuleFrame.style.animation = "none";
  capsuleFrame.offsetHeight;
  capsuleFrame.style.animation = "capsuleFrameGlow 3s ease-in-out";

  setTimeout(() => {
    console.log("Affichage de la popup secrète...");
    secretPhase.classList.add("show");

    setTimeout(() => {
      secretInput.focus();
    }, 100);
  }, 3000);
}

let secretValidationTimeout;
let secretProcessing = false;

function debounceSecretValidation() {
  if (!gameActive || !secretPhaseActive || secretProcessing) return;

  clearTimeout(secretValidationTimeout);
  secretValidationTimeout = setTimeout(() => validateSecretInput(), 1000);
}

function validateSecretInput() {
  if (!gameActive || !secretPhaseActive || secretProcessing) return;

  const value = secretInput.value.toLowerCase().trim();
  if (value === "") return;

  secretProcessing = true;
  secretInput.classList.add("processing");
  secretInput.disabled = true;

  // Animation de la capsule pendant le traitement (comme les codes d'accès)
  setTimeout(() => {
    capsuleImage.style.animation = "none";
    capsuleImage.offsetHeight;
    capsuleImage.style.animation = "capsuleShake 1.5s ease-in-out";

    setTimeout(() => {
      if (value === secretWord) {
        // Mot correct - succès
        secretInput.classList.remove("processing");
        secretInput.classList.add("correct");
        completeDefusingFinal();
      } else {
        // Mot faux - échec comme les codes d'accès
        secretInput.classList.remove("processing");
        secretInput.classList.add("fail");
        secretInput.classList.add(
          "animate__animated",
          "animate__shakeX",
          "animate__flash"
        );

        setTimeout(() => {
          secretInput.value = "";
          secretInput.disabled = false;
          secretInput.classList.remove(
            "fail",
            "animate__animated",
            "animate__shakeX",
            "animate__flash"
          );
          secretProcessing = false;
        }, 2000);
      }
    }, 1500);
  }, 3000);
}

function handleSecretInput() {
  debounceSecretValidation();
}

function completeDefusingFinal() {
  if (!gameActive) return;

  gameActive = false;
  clearInterval(countdownInterval);

  ledRed.style.opacity = "0";
  ledGreen.classList.add("active");

  secretPhase.classList.remove("show");

  setTimeout(() => {
    startFinalAnimation();
  }, 500);
}

function startFinalAnimation() {
  finalOverlay.classList.add("active");

  setTimeout(() => {
    bombFinal.classList.add("zoom-in");

    setTimeout(() => {
      bombFinal.classList.add("deactivating");

      setTimeout(() => {
        createSuccessParticles();
      }, 1500);

      setTimeout(() => {
        showVictoryMessage();
        console.log(
          "🎉✨ CAPSULE COMPLÈTEMENT DÉSAMORCÉE ! MISSION ACCOMPLIE ! ✨🎉"
        );
      }, 2000);
    }, 500);
  }, 200);

  input1.disabled = true;
  input2.disabled = true;
  secretInput.disabled = true;

  console.log("Animation finale en cours...");
}

function createSuccessParticles() {
  const colors = ["#00ff88", "#00ffff", "#ffffff", "#ffff00"];

  for (let i = 0; i < 20; i++) {
    setTimeout(() => {
      const particle = document.createElement("div");
      particle.className = "particle";
      particle.style.background =
        colors[Math.floor(Math.random() * colors.length)];
      particle.style.left = Math.random() * 100 + "%";
      particle.style.top = Math.random() * 100 + "%";
      particle.style.animationDelay = Math.random() * 1 + "s";

      particles.appendChild(particle);

      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 2000);
    }, i * 100);
  }
}

function showVictoryMessage() {
  setTimeout(() => {
    victoryOverlay.style.animation =
      "victoryOverlayAppear 0.8s ease-out forwards";
  }, 5000);

  setTimeout(() => {
    victoryMessage.style.animation =
      "victoryMessageAppear 1s ease-out forwards";
  }, 5500);
}

function updateProgress() {
  const correctCount = wireStates.filter((state) => state).length;
  let displayPercentage = (correctCount / 2) * 100;

  if (secretPhaseActive && displayPercentage === 100) {
    displayPercentage = 66;
    progressPercentage.textContent = `${displayPercentage}%`;
  } else {
    progressPercentage.textContent = `${Math.round(displayPercentage)}%`;
  }

  progressBar.style.width = displayPercentage + "%";
}

function updateCountdown() {
  updateSevenSegmentDisplay(timeLeft);

  if (timeLeft <= 600) {
    sevenSegmentDisplay.classList.add("warning");
  } else {
    sevenSegmentDisplay.classList.remove("warning");
  }

  if (timeLeft <= 0) {
    gameOver(false);
    return;
  }

  timeLeft--;
}

let validationTimeout1, validationTimeout2;

function debounceValidation(inputNumber) {
  if (!gameActive) return;

  if (inputNumber === 1) {
    clearTimeout(validationTimeout1);
    validationTimeout1 = setTimeout(() => validateInput(1), 1000);
  } else {
    clearTimeout(validationTimeout2);
    validationTimeout2 = setTimeout(() => validateInput(2), 1000);
  }
}

function validateInput(inputNumber) {
  if (!gameActive || processingInput[inputNumber - 1]) return;

  const input = inputNumber === 1 ? input1 : input2;
  const message = inputNumber === 1 ? messageLeft : messageRight;
  const indicator = inputNumber === 1 ? input1Indicator : input2Indicator;
  const status = inputNumber === 1 ? input1Status : input2Status;
  const value = input.value.toLowerCase().trim();

  if (value === "") return;

  processingInput[inputNumber - 1] = true;
  input.classList.add("processing");
  indicator.classList.add("active");
  status.textContent = "TRAITEMENT...";

  setTimeout(() => {
    capsuleImage.style.animation = "none";
    capsuleImage.offsetHeight;
    capsuleImage.style.animation = "capsuleShake 1.5s ease-in-out";

    setTimeout(() => {
      if (correctWords.includes(value)) {
        wireSuccess(inputNumber, input, message, indicator, status);
      } else {
        wireFail(inputNumber, input, message, indicator, status);
      }
    }, 1500);
  }, 3000);
}

function wireSuccess(inputNumber, input, message, indicator, status) {
  wireStates[inputNumber - 1] = true;
  input.classList.remove("processing");
  input.classList.add("correct");
  input.disabled = true;
  indicator.classList.remove("active");
  indicator.classList.add("success");
  status.textContent = "CODE VALIDE";

  updateProgress();

  if (wireStates[0] && wireStates[1] && !secretPhaseActive) {
    setTimeout(() => {
      if (gameActive && !secretPhaseActive) {
        triggerSecretPhase();
      }
    }, 2000);
  }

  processingInput[inputNumber - 1] = false;
}

function wireFail(inputNumber, input, message, indicator, status) {
  input.classList.remove("processing");
  input.classList.add("fail");
  indicator.classList.remove("active");
  indicator.classList.add("fail");
  status.textContent = "CODE INVALIDE";

  input.classList.add("animate__animated", "animate__shakeX", "animate__flash");

  setTimeout(() => {
    input.value = "";
    input.classList.remove(
      "fail",
      "animate__animated",
      "animate__shakeX",
      "animate__flash"
    );
    indicator.classList.remove("fail");
    status.textContent = "EN ATTENTE";
    hideFloatingMessage(message);
    processingInput[inputNumber - 1] = false;
  }, 2000);
}

function resetWireFill(wireFill) {
  wireFill.classList.remove("complete");
  wireFill.style.strokeDashoffset = "1000";
}

function hideFloatingMessage(messageElement) {
  messageElement.classList.remove("show");
}

function updateStatus(message, type) {
  status.textContent = message;
  status.className = "status " + type;
}

function gameOver(success) {
  gameActive = false;
  clearInterval(countdownInterval);

  if (!success) {
    console.log("💥 TEMPS ÉCOULÉ ! MISSION ÉCHOUÉE ! 💥");
    input1.disabled = true;
    input2.disabled = true;
  }
}

function resetGame() {
  timeLeft = 2 * 60 * 60;
  gameActive = true;
  wireStates = [false, false];
  progressValue = 0;
  processingInput = [false, false];
  secretPhaseActive = false;

  clearTimeout(validationTimeout1);
  clearTimeout(validationTimeout2);
  clearTimeout(secretValidationTimeout);
  secretProcessing = false;

  input1.value = "";
  input2.value = "";
  input1.disabled = false;
  input2.disabled = false;
  input1.className = "code-input";
  input2.className = "code-input";
  input1Indicator.className = "input-indicator";
  input2Indicator.className = "input-indicator";
  input1Status.textContent = "EN ATTENTE";
  input2Status.textContent = "EN ATTENTE";

  secretInput.value = "";
  secretInput.disabled = false;
  secretInput.className = "secret-input";
  secretPhase.classList.remove("show");

  hideFloatingMessage(messageLeft);
  hideFloatingMessage(messageRight);

  progressBar.style.width = "0%";
  progressPercentage.textContent = "0%";

  finalOverlay.classList.remove("active", "fade-out");
  finalOverlay.style.display = "block";
  bombFinal.classList.remove("zoom-in", "deactivating");
  particles.innerHTML = "";
  victoryMessage.style.opacity = "0";
  victoryOverlay.style.opacity = "0";

  victoryOverlay.style.animation = "";
  victoryMessage.style.animation = "";

  capsuleImage.style.animation = "";
  ledRed.style.opacity = "1";
  ledGreen.classList.remove("active");
  sevenSegmentDisplay.classList.remove("warning");

  startGame();
}

window.addEventListener("load", function () {
  startGame();

  secretInput.addEventListener("input", handleSecretInput);
});

document.addEventListener("keydown", function (e) {
  if (e.ctrlKey && e.key === "n") {
    e.preventDefault();
    resetGame();
  }
});

console.log("Mots-clés corrects:", correctWords);
console.log("Mot secret:", secretWord);
console.log("Appuyez sur Ctrl+N pour redémarrer le jeu");
