
const enigmes = [
  {
    question: "Enigme 1",
    reponse: "MTUwNjU1" 
  },
  {
    question: "Enigme 2",
    reponse: "bWFydGluZQ=="
  },
  {
    question: "Enigme 3",
    reponse: "Y2hvY29sYXQ="
  },
  {
    question: "Enigme 4",
    reponse: "aGFwcHkgYmlydGhkYXkgbWFydGluZQ=="
  },
  {
    question: "Enigme 5",
    reponse: "NzA="
  }
];

let currentStep = 0;
let essais = 0;
let cooldown = 0;
let teamName = localStorage.getItem("teamName") || "";

const endpoint = "https://script.google.com/macros/s/AKfycbzc0_pOuGbrNsD79z8vIER1BBfUgKfDxgLJEfYF1dcVrQb15QSIoupX2lU1ryOufxk/exec";

document.addEventListener("DOMContentLoaded", () => {
  let teamName = localStorage.getItem("teamName");

  while (!teamName || teamName.trim() === "") {
    teamName = prompt("Entrez le nom de votre équipe (obligatoire) :");
  }

  localStorage.setItem("teamName", teamName);

  afficherEnigme();

  document.getElementById("valider").addEventListener("click", () => {
    if (cooldown > 0) return;
    verifierReponse();
  });
});

function afficherEnigme() {
  const enigme = enigmes[currentStep];
  document.getElementById("titre").textContent = enigme.question;
  document.getElementById("reponse").value = "";
  document.getElementById("message").textContent = "";
}

function verifierReponse() {
  const userInput = document.getElementById("reponse").value.trim().toLowerCase();
  const encoded = btoa(userInput);

  if (encoded === enigmes[currentStep].reponse) {
    document.getElementById("message").textContent = "✅ Bonne réponse ! Allez voir le maître du jeu.";
    sendProgress(teamName, enigmes[currentStep].question, essais);
    currentStep++;
    essais = 0;

    if (currentStep < enigmes.length) {
      setTimeout(() => {
        afficherEnigme();
      }, 4000);
    } else {
      document.getElementById("titre").textContent = "🎉 Félicitations !";
      document.getElementById("valider").disabled = true;
      document.getElementById("reponse").disabled = true;
    }

  } else {
    essais++;
    document.getElementById("message").textContent = "❌ Mauvaise réponse. Essaie encore.";

    if (essais >= 3) {
      let waitTime = Math.min(Math.pow(2, essais - 3) * 10, 60);
      activerCooldown(waitTime);
    }
  }
}

function activerCooldown(duree) {
  cooldown = duree;
  const bouton = document.getElementById("valider");
  bouton.disabled = true;
  updateBoutonCooldown();

  const interval = setInterval(() => {
    cooldown--;
    updateBoutonCooldown();

    if (cooldown <= 0) {
      clearInterval(interval);
      bouton.disabled = false;
      bouton.textContent = "Valider";
    }
  }, 1000);
}

function updateBoutonCooldown() {
  const bouton = document.getElementById("valider");
  bouton.textContent = `Réessayer dans ${cooldown}s`;
}

function sendProgress(team, step, attempts) {
  fetch(endpoint, {
    method: "POST",
    body: JSON.stringify({ team, step, attempts }),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then((res) => res.text())
    .then((data) => console.log("Progression envoyée :", data))
    .catch((err) => console.error("Erreur envoi :", err));
}
