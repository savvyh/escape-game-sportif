// === VARIABLES GLOBALES ===
let timeLeft = 2 * 60 * 60; // 2 heures en secondes (7200 secondes)
let gameActive = true;
let countdownInterval;
let wireStates = [false, false];
let progressPercentage = 0;
let processingInput = [false, false]; // Pour éviter les multiples validations
let secretPhaseActive = false; // Nouvelle variable pour l'étape secrète

// === ÉLÉMENTS DOM ===
const input1 = document.getElementById("input1");
const input2 = document.getElementById("input2");
const wire1Active = document.getElementById("wire1Active");
const wire2Active = document.getElementById("wire2Active");
const messageLeft = document.getElementById("messageLeft");
const messageRight = document.getElementById("messageRight");
const progressBar = document.getElementById("progressBar");
const progressLabel = document.getElementById("progressLabel");
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

// === CONFIGURATION DU JEU ===
// Mots-clés corrects (insensibles à la casse)
const correctWords = ["plaisir", "combativité"];
const secretWord = "ensemble";

// === CONFIGURATION 7 SEGMENTS ===
// Configuration des segments pour chaque chiffre (0-9)
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

// === FONCTIONS 7 SEGMENTS ===
function displayDigit(digitId, number) {
  const digit = document.getElementById(digitId);
  const segments = digit.querySelectorAll(".segment");

  // Éteindre tous les segments
  segments.forEach((segment) => {
    segment.classList.add("off");
  });

  // Allumer les segments nécessaires
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

  // Afficher les heures (2 chiffres)
  displayDigit("hour1", Math.floor(hours / 10));
  displayDigit("hour2", hours % 10);

  // Afficher les minutes (2 chiffres)
  displayDigit("min1", Math.floor(minutes / 10));
  displayDigit("min2", minutes % 10);

  // Afficher les secondes (2 chiffres)
  displayDigit("sec1", Math.floor(seconds / 10));
  displayDigit("sec2", seconds % 10);
}

// === DÉMARRAGE DU JEU ===
function startGame() {
  updateCountdown();
  countdownInterval = setInterval(updateCountdown, 1000);

  // Événements sur les inputs avec délai de validation
  input1.addEventListener("input", () => debounceValidation(1));
  input2.addEventListener("input", () => debounceValidation(2));

  // Événement pour l'input secret (définir après que handleSecretInput existe)
  if (typeof handleSecretInput === "function") {
    secretInput.addEventListener("input", handleSecretInput);
  }
}

// === DÉCLENCHEMENT DE LA PHASE SECRÈTE ===
function triggerSecretPhase() {
  if (!gameActive || secretPhaseActive) return;

  console.log("Déclenchement de la phase secrète..."); // Debug
  secretPhaseActive = true;

  // Animation de la capsule pour montrer qu'elle n'est pas encore désarmée
  capsuleImage.style.animation = "none";
  capsuleImage.offsetHeight; // Force reflow
  capsuleImage.style.animation = "capsuleShake 1.5s ease-in-out";

  // Déclencher directement la phase secrète
  setTimeout(() => {
    // Afficher l'interface de la phase secrète
    console.log("Affichage de la popup secrète..."); // Debug
    secretPhase.classList.add("show");

    // Mettre le focus sur l'input secret après un court délai
    setTimeout(() => {
      secretInput.focus();
    }, 100);
  }, 1500);
}

// === GESTION DE L'INPUT SECRET ===
function handleSecretInput() {
  if (!gameActive || !secretPhaseActive) return;

  const value = secretInput.value.toLowerCase().trim();

  // Validation en temps réel du mot secret
  if (value === secretWord) {
    secretInput.classList.add("processing");
    secretInput.disabled = true;

    // Délai pour l'effet dramatique
    setTimeout(() => {
      completeDefusingFinal();
    }, 1000);
  }
}

// === FINALISATION COMPLÈTE DU DÉSAMORÇAGE ===
function completeDefusingFinal() {
  if (!gameActive) return;

  gameActive = false;
  clearInterval(countdownInterval);

  // Activer la LED verte et désactiver la rouge
  ledRed.style.opacity = "0";
  ledGreen.classList.add("active");

  // Masquer la phase secrète
  secretPhase.classList.remove("show");

  // Déclencher l'animation finale spectaculaire
  setTimeout(() => {
    startFinalAnimation();
  }, 500);
}

// === ANIMATION FINALE SPECTACULAIRE ===
function startFinalAnimation() {
  // 1. Afficher l'overlay sombre avec la capsule
  finalOverlay.classList.add("active");

  setTimeout(() => {
    // 2. Zoom sur la capsule
    bombFinal.classList.add("zoom-in");

    setTimeout(() => {
      // 3. Animation de désactivation de la bombe
      bombFinal.classList.add("deactivating");

      // 4. Créer des particules de succès
      setTimeout(() => {
        createSuccessParticles();
      }, 1500);

      // 5. Afficher le message de victoire
      setTimeout(() => {
        showVictoryMessage();
        console.log(
          "🎉✨ CAPSULE COMPLÈTEMENT DÉSAMORCÉE ! MISSION ACCOMPLIE ! ✨🎉"
        );
      }, 2000);

      // 7. NE PAS faire de fade out - garder l'image de la capsule affichée
    }, 500);
  }, 200);

  // Désactiver tous les inputs
  input1.disabled = true;
  input2.disabled = true;
  secretInput.disabled = true;

  console.log("Animation finale en cours...");
}

// === CRÉATION DE PARTICULES DE SUCCÈS ===
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

      // Supprimer la particule après l'animation
      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 2000);
    }, i * 100);
  }
}

// === AFFICHAGE DU MESSAGE DE VICTOIRE ===
function showVictoryMessage() {
  // Attendre 8 secondes puis afficher le fond sombre
  setTimeout(() => {
    victoryOverlay.style.animation =
      "victoryOverlayAppear 0.8s ease-out forwards";
  }, 8000);

  // Attendre 8.5 secondes puis afficher le texte
  setTimeout(() => {
    victoryMessage.style.animation =
      "victoryMessageAppear 1s ease-out forwards";
  }, 8500);
}

// === MISE À JOUR DE LA PROGRESSION (MODIFIÉE) ===
function updateProgress() {
  const correctCount = wireStates.filter((state) => state).length;
  let displayPercentage = (correctCount / 2) * 100;

  // Si phase secrète active, montrer que ce n'est que 66% complet
  if (secretPhaseActive && displayPercentage === 100) {
    displayPercentage = 66;
    progressLabel.textContent = `PROGRESSION: ${displayPercentage}% - ÉTAPE SECRÈTE REQUISE`;
  } else {
    progressLabel.textContent = `PROGRESSION: ${Math.round(
      displayPercentage
    )}%`;
  }

  progressBar.style.width = displayPercentage + "%";
}

// === GESTION DU COMPTE À REBOURS ===
function updateCountdown() {
  // Mettre à jour l'affichage 7 segments
  updateSevenSegmentDisplay(timeLeft);

  // Mode warning pour les 10 dernières minutes (600 secondes)
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

// === GESTION DU DÉLAI DE VALIDATION ===
let validationTimeout1, validationTimeout2;

function debounceValidation(inputNumber) {
  if (!gameActive) return;

  // Annuler le timeout précédent
  if (inputNumber === 1) {
    clearTimeout(validationTimeout1);
    validationTimeout1 = setTimeout(() => validateInput(1), 1000); // Attendre 1s après la dernière frappe
  } else {
    clearTimeout(validationTimeout2);
    validationTimeout2 = setTimeout(() => validateInput(2), 1000);
  }
}

// === VALIDATION D'UN INPUT AVEC ANIMATION ===
function validateInput(inputNumber) {
  if (!gameActive || processingInput[inputNumber - 1]) return;

  const input = inputNumber === 1 ? input1 : input2;
  const wireActive = inputNumber === 1 ? wire1Active : wire2Active;
  const message = inputNumber === 1 ? messageLeft : messageRight;
  const indicator = inputNumber === 1 ? input1Indicator : input2Indicator;
  const status = inputNumber === 1 ? input1Status : input2Status;
  const value = input.value.toLowerCase().trim();

  if (value === "") return; // Ne rien faire si l'input est vide

  processingInput[inputNumber - 1] = true;
  input.classList.add("processing");
  indicator.classList.add("active");
  status.textContent = "TRAITEMENT...";

  // Démarrer l'animation du fil
  wireActive.classList.add("activated");

  // Animation de la capsule
  setTimeout(() => {
    // Effet de secouement de la capsule
    capsuleImage.style.animation = "none";
    capsuleImage.offsetHeight; // Force reflow
    capsuleImage.style.animation = "capsuleShake 1.5s ease-in-out";

    // Attendre la fin du secouement avant de révéler le résultat
    setTimeout(() => {
      if (correctWords.includes(value)) {
        // Mot correct
        wireSuccess(inputNumber, input, wireActive, message, indicator, status);
      } else {
        // Mot incorrect
        wireFail(inputNumber, input, wireActive, message, indicator, status);
      }
    }, 1500); // Durée du secouement
  }, 3000); // Attendre que le fil arrive à la capsule
}

// === SUCCÈS D'UN FIL ===
function wireSuccess(
  inputNumber,
  input,
  wireActive,
  message,
  indicator,
  status
) {
  wireStates[inputNumber - 1] = true;
  input.classList.remove("processing");
  input.classList.add("correct");
  input.disabled = true;
  indicator.classList.remove("active");
  indicator.classList.add("success");
  status.textContent = "CODE VALIDE";

  // Le fil reste activé et visible
  wireActive.style.opacity = "1";

  // Message de succès
  showFloatingMessage(message, "✅ CODE VALIDE !", "success");

  // Mise à jour de la progression
  updateProgress();

  // Vérifier si les deux fils sont connectés
  if (wireStates[0] && wireStates[1] && !secretPhaseActive) {
    // Au lieu de compléter directement, déclencher la phase secrète
    setTimeout(() => {
      if (gameActive && !secretPhaseActive) {
        triggerSecretPhase();
      }
    }, 2000);
  }

  processingInput[inputNumber - 1] = false;
}

// === ÉCHEC D'UN FIL ===
function wireFail(inputNumber, input, wireActive, message, indicator, status) {
  input.classList.remove("processing");
  input.classList.add("fail");
  indicator.classList.remove("active");
  indicator.classList.add("fail");
  status.textContent = "CODE INVALIDE";

  // Animation de désactivation du fil
  wireActive.style.opacity = "0";

  // Animation de secouement de l'input avec effet de pulsation
  input.classList.add("animate__animated", "animate__shakeX", "animate__flash");

  // Message d'échec
  showFloatingMessage(message, "❌ MAUVAIS CODE !", "fail");

  // Reset après 2 secondes (désactivation du fil + effacement de l'input)
  setTimeout(() => {
    input.value = ""; // Effacer le contenu de l'input
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

// === RESET D'UN CHEMIN DE FIL ===
function resetWireFill(wireFill) {
  wireFill.classList.remove("complete");
  wireFill.style.strokeDashoffset = "1000";
}

// === AFFICHAGE DES MESSAGES FLOTTANTS ===
function showFloatingMessage(messageElement, text, type) {
  messageElement.textContent = text;
  messageElement.className = `floating-message ${
    type === "success" ? "message-left" : "message-right"
  } ${type} show`;
}

function hideFloatingMessage(messageElement) {
  messageElement.classList.remove("show");
}

// === MISE À JOUR DU STATUS ===
function updateStatus(message, type) {
  status.textContent = message;
  status.className = "status " + type;
}

// === FIN DE JEU ===
function gameOver(success) {
  gameActive = false;
  clearInterval(countdownInterval);

  if (!success) {
    console.log("💥 TEMPS ÉCOULÉ ! MISSION ÉCHOUÉE ! 💥");
    input1.disabled = true;
    input2.disabled = true;
  }
}

// === FONCTION DE RESET ===
function resetGame() {
  timeLeft = 2 * 60 * 60; // Reset à 2 heures
  gameActive = true;
  wireStates = [false, false];
  progressPercentage = 0;
  processingInput = [false, false];
  secretPhaseActive = false; // Reset de la phase secrète

  // Clear timeouts
  clearTimeout(validationTimeout1);
  clearTimeout(validationTimeout2);

  // Reset inputs
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

  // Reset secret input
  secretInput.value = "";
  secretInput.disabled = false;
  secretInput.className = "secret-input";
  secretPhase.classList.remove("show");

  // Reset fils
  wire1Active.classList.remove("activated");
  wire2Active.classList.remove("activated");
  wire1Active.style.opacity = "0";
  wire2Active.style.opacity = "0";

  // Reset messages
  hideFloatingMessage(messageLeft);
  hideFloatingMessage(messageRight);

  // Reset progression
  progressBar.style.width = "0%";
  progressLabel.textContent = "PROGRESSION: 0%";

  // Reset final overlay
  finalOverlay.classList.remove("active", "fade-out");
  finalOverlay.style.display = "block";
  bombFinal.classList.remove("zoom-in", "deactivating");
  particles.innerHTML = "";
  victoryMessage.style.opacity = "0";
  victoryOverlay.style.opacity = "0";

  // Reset animations
  victoryOverlay.style.animation = "";
  victoryMessage.style.animation = "";

  // Reset capsule
  capsuleImage.style.animation = "";
  ledRed.style.opacity = "1";
  ledGreen.classList.remove("active");
  sevenSegmentDisplay.classList.remove("warning");

  startGame();
}

// === DÉMARRAGE AUTOMATIQUE AVEC LISTENER SECRET ===
window.addEventListener("load", function () {
  startGame();
  // Ajouter l'event listener pour l'input secret après le chargement
  secretInput.addEventListener("input", handleSecretInput);
});

// === RACCOURCI CLAVIER POUR RESET ===
document.addEventListener("keydown", function (e) {
  if (e.ctrlKey && e.key === "n") {
    e.preventDefault();
    resetGame();
  }
});

// === DEBUG ===
console.log("Mots-clés corrects:", correctWords);
console.log("Mot secret:", secretWord);
console.log("Appuyez sur Ctrl+N pour redémarrer le jeu");
