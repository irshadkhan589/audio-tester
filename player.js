const audio = document.getElementById("audio");
const title = document.getElementById("title");
const list = document.getElementById("list");

const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");

const popup = document.getElementById("popup");
const popupTitle = document.getElementById("popup-title");
const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("current-time");
const totalTimeEl = document.getElementById("total-time");

const popupPlay = document.getElementById("popup-play");
const popupNext = document.getElementById("popup-next");
const popupPrev = document.getElementById("popup-prev");

let current = 0;

// Format time
function formatTime(sec) {
  if (isNaN(sec)) return "00:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

// Load track
function loadTrack(i) {
  audio.src = playlist[i].file;
  title.textContent = playlist[i].title;

  // Show popup
  popup.classList.remove("hidden");
  popupTitle.textContent = playlist[i].title;

  // Reset timers
  document.querySelectorAll(".song-time").forEach(t => {
    t.textContent = "♬";
  });

  const span = document.getElementById(`time-${i}`);
  if (span) span.textContent = "00:00 / 00:00";

  highlight();
}

// Play / pause
function togglePlay() {
  audio.paused ? audio.play() : audio.pause();
}

// Next / Prev
function nextTrack() {
  current = (current + 1) % playlist.length;
  loadTrack(current);
  audio.play();
}

function prevTrack() {
  current = (current - 1 + playlist.length) % playlist.length;
  loadTrack(current);
  audio.play();
}

// Render playlist
function renderList() {
  list.innerHTML = "";

  renderCategory(`Energy / Phonk 🔥 (${energyPhonk.length})`, energyPhonk, 0);

  renderCategory(`Requests (${irfSongs.length})`, irfSongs, energyPhonk.length);

  renderCategory(
    `Calm 🍃 (${calmSongs.length})`,
    calmSongs,
    energyPhonk.length + irfSongs.length + rapSongs.length
  );

  renderCategory(
    `Sad 🫶 (${sadSongs.length})`,
    sadSongs,
    energyPhonk.length +
      irfSongs.length +
      rapSongs.length +
      calmSongs.length +
      ramzanSongs.length
  );

  renderCategory(
    `Breakup 💔 (${healSongs.length})`,
    healSongs,
    energyPhonk.length +
      irfSongs.length +
      rapSongs.length +
      calmSongs.length +
      ramzanSongs.length +
      sadSongs.length
  );
}

// Render category
function renderCategory(titleText, songsArray, offset) {
  const card = document.createElement("div");
  card.className = "category-card";

  const titleDiv = document.createElement("div");
  titleDiv.className = "category-title";
  titleDiv.textContent = titleText;
  card.appendChild(titleDiv);

  const ul = document.createElement("ul");
  ul.className = "category-songs";

  songsArray.forEach((song, i) => {
    const index = offset + i;

    const li = document.createElement("li");
    li.className = "song-item";
    li.dataset.index = index;

    li.innerHTML = `
      <span class="song-title">${song.title}</span>
      <span class="song-time" id="time-${index}">--:-- / --:--</span>
    `;

    li.onclick = () => {
      current = index;
      loadTrack(current);
      audio.play();
    };

    ul.appendChild(li);
  });

  card.appendChild(ul);
  list.appendChild(card);
}

// Highlight current
function highlight() {
  document.querySelectorAll(".song-item").forEach(li => {
    li.classList.toggle("active", Number(li.dataset.index) === current);
  });
}

// Button bindings
playBtn.onclick = togglePlay;
nextBtn.onclick = nextTrack;
prevBtn.onclick = prevTrack;

popupPlay.onclick = togglePlay;
popupNext.onclick = nextTrack;
popupPrev.onclick = prevTrack;

// Spacebar
document.addEventListener("keydown", e => {
  if (e.code === "Space") {
    e.preventDefault();
    togglePlay();
  }
});

// Auto next
audio.addEventListener("ended", nextTrack);

// Time update + progress bar
audio.addEventListener("timeupdate", () => {
  const currentTime = audio.currentTime;
  const duration = audio.duration;

  if (!isNaN(duration)) {
    progress.value = (currentTime / duration) * 100;
    currentTimeEl.textContent = formatTime(currentTime);
    totalTimeEl.textContent = formatTime(duration);
  }

  const span = document.getElementById(`time-${current}`);
  if (span) {
    span.textContent = `${formatTime(currentTime)} / ${formatTime(duration)}`;
  }
});

// Seek
progress.addEventListener("input", () => {
  const duration = audio.duration;
  if (!isNaN(duration)) {
    audio.currentTime = (progress.value / 100) * duration;
  }
});

// Init
renderList();
loadTrack(current);