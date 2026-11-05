// ACOLHE TEA — interações e recursos de acessibilidade
"use strict";

const root = document.documentElement;
const accessOpen = document.getElementById("accessOpen");
const accessPanel = document.getElementById("accessPanel");
let fontSize = 16;

// Painel de acessibilidade
accessOpen.addEventListener("click", () => {
  const open = accessPanel.hidden;
  accessPanel.hidden = !open;
  accessOpen.setAttribute("aria-expanded", String(open));
});

document.getElementById("fontUp").addEventListener("click", () => {
  fontSize = Math.min(24, fontSize + 1);
  root.style.setProperty("--body-size", fontSize + "px");
});

document.getElementById("fontDown").addEventListener("click", () => {
  fontSize = Math.max(14, fontSize - 1);
  root.style.setProperty("--body-size", fontSize + "px");
});

const contrast = document.getElementById("contrastToggle");
contrast.addEventListener("click", () => {
  const enabled = document.body.classList.toggle("high-contrast");
  contrast.setAttribute("aria-pressed", String(enabled));
});

const calm = document.getElementById("calmToggle");
calm.addEventListener("click", () => {
  const enabled = document.body.classList.toggle("calm-mode");
  calm.setAttribute("aria-pressed", String(enabled));
});

document.getElementById("resetAccess").addEventListener("click", () => {
  fontSize = 16;
  root.style.setProperty("--body-size", "16px");
  document.body.classList.remove("high-contrast", "calm-mode");
  contrast.setAttribute("aria-pressed", "false");
  calm.setAttribute("aria-pressed", "false");
});

// Navegação mobile
const menu = document.getElementById("menuToggle");
const nav = document.getElementById("mainNav");

menu.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menu.setAttribute("aria-expanded", String(open));
  menu.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
    menu.setAttribute("aria-label", "Abrir menu");
  });
});

// Rotina visual
const form = document.getElementById("routineForm");
const input = document.getElementById("activityInput");
const list = document.getElementById("routineList");
const count = document.getElementById("routineCount");

function updateCount() {
  const total = list.querySelectorAll("li:not(.empty-state)").length;
  count.textContent = total + (total === 1 ? " atividade" : " atividades");
}

function refreshSteps() {
  [...list.children].forEach((item, index) => {
    const step = item.querySelector(".step");
    if (step) step.textContent = index + 1;
  });
}

function showEmptyRoutine() {
  if (list.children.length === 0) {
    const empty = document.createElement("li");
    empty.id = "emptyRoutine";
    empty.className = "empty-state";
    const icon = document.createElement("span");
    icon.className = "empty-icon";
    icon.textContent = "+";
    const message = document.createElement("span");
    message.textContent = "Sua rotina aparecerá aqui quando você adicionar uma atividade.";
    empty.append(icon, message);
    list.append(empty);
  }
}

function addActivity(value) {
  const clean = value.trim();
  if (!clean) {
    input.focus();
    return;
  }

  document.getElementById("emptyRoutine")?.remove();

  const item = document.createElement("li");
  const step = document.createElement("span");
  step.className = "step";
  const label = document.createElement("span");
  label.textContent = clean;
  const remove = document.createElement("button");
  remove.type = "button";
  remove.textContent = "Remover";
  remove.setAttribute("aria-label", "Remover " + clean);

  remove.addEventListener("click", () => {
    item.remove();
    refreshSteps();
    showEmptyRoutine();
    updateCount();
  });

  item.append(step, label, remove);
  list.append(item);
  refreshSteps();
  input.value = "";
  input.focus();
  updateCount();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  addActivity(input.value);
});

document.querySelectorAll("[data-activity]").forEach((button) => {
  button.addEventListener("click", () => addActivity(button.dataset.activity));
});

document.getElementById("clearRoutine").addEventListener("click", () => {
  list.innerHTML = "";
  showEmptyRoutine();
  updateCount();
});

// Mapa das emoções
const emotionMessages = {
  "Feliz": "Que bom que existe alegria por aí. Se quiser, aproveite esse momento do seu jeito.",
  "Calmo(a)": "Que bom encontrar um momento de calma. Você pode permanecer nele pelo tempo que quiser.",
  "Cansado(a)": "Tudo bem precisar descansar. Se puder, respeite seus limites e faça uma pausa.",
  "Ansioso(a)": "Você não precisa resolver tudo agora. Tente ir por partes e procure alguém de confiança se precisar.",
  "Sobrecarregado(a)": "Parece que tem muita coisa acontecendo. Se for possível, diminua os estímulos e procure um espaço confortável.",
  "Não sei dizer": "Tudo bem não saber nomear o que sente. Você não precisa encontrar uma resposta agora."
};

document.querySelectorAll(".emotion").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".emotion").forEach((item) => {
      item.setAttribute("aria-pressed", "false");
    });
    button.setAttribute("aria-pressed", "true");
    const feeling = button.dataset.feeling;
    document.getElementById("feelingResult").textContent =
      feeling + ". " + emotionMessages[feeling];
  });
});

// Pausa consciente de 30 segundos
let pauseTimer = null;
let pauseSeconds = 30;

const pauseButton = document.getElementById("pauseButton");
const pauseMessage = document.getElementById("pauseMessage");

function finishPause(message) {
  if (pauseTimer) {
    clearInterval(pauseTimer);
    pauseTimer = null;
  }
  pauseButton.disabled = false;
  pauseButton.innerHTML = 'Começar pausa de 30 segundos <span>→</span>';
  pauseMessage.textContent = message;
}

pauseButton.addEventListener("click", () => {
  if (pauseTimer) {
    finishPause("Pausa interrompida. Você pode recomeçar quando quiser.");
    return;
  }

  pauseSeconds = 30;
  pauseButton.disabled = true;
  pauseButton.textContent = "Pausa em andamento…";
  pauseMessage.textContent = "Encontre uma posição confortável. Faltam 30 segundos.";

  pauseTimer = window.setInterval(() => {
    pauseSeconds--;
    if (pauseSeconds > 0) {
      pauseMessage.textContent = "Encontre uma posição confortável. Faltam " + pauseSeconds + " segundos.";
    } else {
      finishPause("Pausa concluída! Espero que tenha ajudado a desacelerar um pouquinho.");
    }
  }, 1000);
});
