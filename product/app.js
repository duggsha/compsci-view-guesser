const $ = (id) => document.getElementById(id);
const panels = ["start", "game", "result", "again", "end"];

let mode = "normal";
let score = 0;
let round = 0;
let correct = 0;
let wrong = 0;
let current = null;

function show(name) {
  panels.forEach((p) => $(p).classList.toggle("hidden", p !== name));
  $("error").classList.add("hidden");
}

function fmt(n) {
  return Number(n).toLocaleString();
}

function setFrame(id, videoId) {
  $(id).src = `https://www.youtube.com/embed/${videoId}`;
}

async function loadRound() {
  $("error").classList.add("hidden");
  document.querySelectorAll(".guess").forEach((b) => (b.disabled = true));

  const res = await fetch("/api/round");
  if (!res.ok) throw new Error("Could not load videos");
  current = await res.json();
  round += 1;

  $("round").textContent = round;
  $("titleA").textContent = current.videoA.title;
  $("titleB").textContent = current.videoB.title;
  setFrame("frameA", current.videoA.id);
  setFrame("frameB", current.videoB.id);

  document.querySelectorAll(".guess").forEach((b) => (b.disabled = false));
  show("game");
}

function winner() {
  return current.videoA.views >= current.videoB.views ? "A" : "B";
}

function handleGuess(side) {
  document.querySelectorAll(".guess").forEach((b) => (b.disabled = true));
  const win = winner();
  const ok = side === win;

  if (ok) {
    score += 1;
    correct += 1;
    $("resultTitle").textContent = "Correct!";
    $("resultTitle").className = "correct";
  } else {
    wrong += 1;
    if (mode === "streak") score = 0;
    $("resultTitle").textContent = "Incorrect";
    $("resultTitle").className = "incorrect";
  }

  const a = current.videoA;
  const b = current.videoB;
  $("resultDetail").textContent =
    `${a.title}: ${fmt(a.views)} views | ${b.title}: ${fmt(b.views)} views. ` +
    `${a.title} ${a.views >= b.views ? "has more" : "has fewer"} views.`;
  $("score").textContent = score;
  $("resultScore").textContent = score;
  show("result");
  setTimeout(() => show("again"), 1200);
}

$("playBtn").onclick = async () => {
  mode = document.querySelector('input[name="mode"]:checked').value;
  score = 0;
  round = 0;
  correct = 0;
  wrong = 0;
  $("score").textContent = "0";
  try {
    await loadRound();
  } catch (e) {
    $("error").textContent = e.message;
    $("error").classList.remove("hidden");
  }
};

document.querySelectorAll(".guess").forEach((btn) => {
  btn.onclick = () => handleGuess(btn.closest(".video-card").dataset.side);
});

$("yesBtn").onclick = async () => {
  try {
    await loadRound();
  } catch (e) {
    $("error").textContent = e.message;
    $("error").classList.remove("hidden");
  }
};

$("noBtn").onclick = () => {
  const pct = round ? Math.round((correct / round) * 100) : 0;
  $("finalStats").textContent =
    `Rounds: ${round} | Correct: ${correct} | Wrong: ${wrong} | ` +
    `Final score: ${score} | Accuracy: ${pct}% | Mode: ${mode}`;
  show("end");
};

$("restartBtn").onclick = () => show("start");
