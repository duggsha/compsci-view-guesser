// Shortcut to grab an element from the page by its id
const $ = (id) => document.getElementById(id);

// All screen sections we swap between during the game
const panels = ["start", "game", "result", "again", "end"];

// Game state kept in memory while the page is open (not saved anywhere)
let mode = "normal";
let score = 0;
let round = 0;
let correct = 0;
let wrong = 0;
let current = null;
let resultTimer = null;

// Show one screen and hide all the others
function show(name) {
  panels.forEach((p) => $(p).classList.toggle("hidden", p !== name));
  $("error").classList.add("hidden");
}

// Format view counts with commas (e.g. 6400000000 -> 6,400,000,000)
function fmt(n) {
  return Number(n).toLocaleString();
}

// Load a YouTube video into an iframe using its video id
function setFrame(id, videoId) {
  $(id).src = `https://www.youtube.com/embed/${videoId}`;
}

// Fetch a new pair of videos from the server and display them
async function loadRound() {
  $("error").classList.add("hidden");
  document.querySelectorAll(".guess").forEach((b) => (b.disabled = true));

  const res = await fetch("/api/round");
  if (!res.ok) throw new Error("could not load this round. try again in a sec.");
  current = await res.json();
  round += 1;

  $("round").textContent = round;
  $("modeLabel").textContent = mode;
  $("titleA").textContent = current.videoA.title;
  $("titleB").textContent = current.videoB.title;
  setFrame("frameA", current.videoA.id);
  setFrame("frameB", current.videoB.id);

  document.querySelectorAll(".guess").forEach((b) => (b.disabled = false));
  show("game");
}

// Figure out which video (A or B) has more views
function winner() {
  return current.videoA.views >= current.videoB.views ? "A" : "B";
}

// Build and show the final stats screen
function showFinalStats() {
  if (resultTimer) clearTimeout(resultTimer);
  const pct = round ? Math.round((correct / round) * 100) : 0;
  $("finalStats").innerHTML =
    `rounds played: <strong>${round}</strong><br>` +
    `correct: <strong>${correct}</strong> | wrong: <strong>${wrong}</strong><br>` +
    `final score: <strong>${score}</strong><br>` +
    `accuracy: <strong>${pct}%</strong><br>` +
    `mode: <strong>${mode}</strong>`;
  show("end");
}

// After showing the result, normal mode auto-continues; streak mode asks to play again
function afterResult() {
  if (resultTimer) clearTimeout(resultTimer);
  if (mode === "normal") {
    resultTimer = setTimeout(async () => {
      try {
        await loadRound();
      } catch (e) {
        $("error").textContent = e.message;
        $("error").classList.remove("hidden");
      }
    }, 1400);
  } else {
    resultTimer = setTimeout(() => show("again"), 1400);
  }
}

// Run when the user picks a video; update score and show the result
function handleGuess(side) {
  document.querySelectorAll(".guess").forEach((b) => (b.disabled = true));
  const win = winner();
  const ok = side === win;

  if (ok) {
    score += 1;
    correct += 1;
    $("resultTitle").textContent = "you got it";
    $("resultTitle").className = "correct";
  } else {
    wrong += 1;
    if (mode === "streak") score = 0;
    $("resultTitle").textContent = "not this time";
    $("resultTitle").className = "incorrect";
  }

  const a = current.videoA;
  const b = current.videoB;
  const leader = a.views >= b.views ? a.title : b.title;
  $("resultDetail").textContent =
    `${a.title}: ${fmt(a.views)} views. ${b.title}: ${fmt(b.views)} views. ` +
    `${leader} was the bigger one.`;
  $("score").textContent = score;
  $("resultScore").textContent = score;
  show("result");
  afterResult();
}

// Start button: read the chosen mode, reset stats, and load the first round
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

// Wire up both "this one has more views" buttons on the video cards
document.querySelectorAll(".guess").forEach((btn) => {
  btn.onclick = () => handleGuess(btn.closest(".video-card").dataset.side);
});

// Yes button: load another round with the same mode and score
$("yesBtn").onclick = async () => {
  try {
    await loadRound();
  } catch (e) {
    $("error").textContent = e.message;
    $("error").classList.remove("hidden");
  }
};

// No button: show final stats and end the game (streak mode)
$("noBtn").onclick = () => showFinalStats();

// End game button on the play screen (normal mode)
$("quitBtn").onclick = () => showFinalStats();

// Restart button: go back to the start screen to pick a mode again
$("restartBtn").onclick = () => show("start");
