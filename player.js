const audio = document.getElementById("audio");
const title = document.getElementById("title");
const list = document.getElementById("list");

const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");

let current = 0;

// Load track
function loadTrack(i) {
  audio.src = playlist[i].file;
  title.textContent = playlist[i].title;
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

// Render playlist UI
function renderList() {
  list.innerHTML = "";
  playlist.forEach((track, i) => {
    const li = document.createElement("li");
    li.textContent = track.title;
    li.onclick = () => {
      current = i;
      loadTrack(current);
      audio.play();
    };
    list.appendChild(li);
  });
}

// Highlight current track
function highlight() {
  [...list.children].forEach((li, i) => {
    li.classList.toggle("active", i === current);
  });
}

// Button bindings
playBtn.onclick = togglePlay;
nextBtn.onclick = nextTrack;
prevBtn.onclick = prevTrack;

// Spacebar (desktop)
document.addEventListener("keydown", e => {
  if (e.code === "Space") {
    e.preventDefault();
    togglePlay();
  }
});

// Auto-play next
audio.addEventListener("ended", nextTrack);

// Init
renderList();
loadTrack(current);
