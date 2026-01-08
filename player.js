const audio = document.getElementById("audio");
const title = document.getElementById("title");
const list = document.getElementById("list");

const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const time = document.getElementById("time");


let current = 0;

// GROUP PLAYLIST BY CATEGORY
function groupByCategory() {
  const map = {};
  playlist.forEach((item, index) => {
    if (!map[item.category]) map[item.category] = [];
    map[item.category].push({ ...item, index });
  });
  return map;
}


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
  // Reset all timers in the list
  document.querySelectorAll(".song-time").forEach(t => {
    t.textContent = "♬";
  });

  // Reset the active song time
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

// Render playlist UI with categories
function renderList() {
  list.innerHTML = "";
  const groups = groupByCategory();

  Object.keys(groups).forEach(category => {
    // Category header
    const catLi = document.createElement("li");
    catLi.textContent = category;
    catLi.className = "category-header";
    list.appendChild(catLi);

    // Songs under category
    groups[category].forEach(song => {
      const li = document.createElement("li");
      li.innerHTML = `
  <span class="song-title">${song.title}</span>
  <span class="song-time" id="time-${song.index}">--:-- / --:--</span>
`;

      li.className = "song-item";
      li.dataset.index = song.index;

      li.onclick = () => {
        current = song.index;
        loadTrack(current);
        audio.play();
      };

      list.appendChild(li);
    });
  });
}

// Highlight current track
function highlight() {
  document.querySelectorAll(".song-item").forEach(li => {
    li.classList.toggle("active", Number(li.dataset.index) === current);
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

audio.addEventListener("timeupdate", () => {
  const span = document.getElementById(`time-${current}`);
  if (span) {
    span.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
  }
});


// Init
renderList();
loadTrack(current);
