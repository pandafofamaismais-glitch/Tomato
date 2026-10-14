const animeCatalog = [
  {
    id: "night",
    title: "Uma Noite Pecaminosa",
    score: "5.5",
    genres: "Animação • Drama",
    description: "Uma história dramática sobre encontros inesperados.",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80",
    youtubeId: ""
  },
  {
    id: "doraemon",
    title: "Doraemon: O Gato do Futuro",
    score: "8.1",
    genres: "Ação e Aventura • Animação",
    description: "Nobita e Doraemon vivem aventuras com invenções do futuro.",
    image: "https://images.unsplash.com/photo-1560972550-aba3456b5564?auto=format&fit=crop&w=600&q=80",
    youtubeId: "cLuAEGhsEtY"
  },
  {
    id: "naruto",
    title: "Naruto",
    score: "8.4",
    genres: "Animação • Ação e Aventura",
    description: "Um jovem ninja sonha em se tornar líder de sua vila.",
    image: "https://images.unsplash.com/photo-1614583225154-5fcubby?auto=format&fit=crop&w=600&q=80",
    youtubeId: "f2IPmx7AWig"
  },
  {
    id: "chibi",
    title: "Chibi Maruko-chan",
    score: "7.8",
    genres: "Animação • Comédia",
    description: "O cotidiano divertido de uma menina e sua família.",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80",
    youtubeId: "fwooE8ZLQMA"
  },
  {
    id: "bleach",
    title: "Bleach",
    score: "8.4",
    genres: "Ação e Aventura • Animação",
    description: "Um estudante enfrenta ameaças sobrenaturais.",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80",
    youtubeId: "TjoxIpiWIAc"
  },
  {
    id: "mushoku",
    title: "Mushoku Tensei: Jobless Reincarnation",
    score: "8.4",
    genres: "Aventura • Fantasia",
    description: "Uma nova vida em um mundo de fantasia.",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
    youtubeId: ""
  },
  {
    id: "pokemon",
    title: "Pokémon: A Série",
    score: "8.0",
    genres: "Aventura • Família",
    description: "Treinadores e Pokémon viajam para aprender e competir.",
    image: "https://images.unsplash.com/photo-1542779283-429940ce8336?auto=format&fit=crop&w=600&q=80",
    youtubeId: "z3hMX65Khtg"
  },
  {
    id: "ninjas",
    title: "Os Pequenos Ninjas",
    score: "6.8",
    genres: "Ação • Comédia",
    description: "Jovens ninjas aprendem a trabalhar em equipe.",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
    youtubeId: ""
  },
  {
    id: "dragon",
    title: "Dragon Ball",
    score: "8.4",
    genres: "Ação • Aventura",
    description: "Guerreiros treinam e enfrentam desafios.",
    image: "https://images.unsplash.com/photo-1560972550-aba3456b5564?auto=format&fit=crop&w=600&q=80",
    youtubeId: "EzN5SW2QOWY"
  },
  {
    id: "harem",
    title: "Romance de Verão",
    score: "7.0",
    genres: "Romance • Comédia",
    description: "Amizades e encontros transformam as férias.",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80",
    youtubeId: ""
  },
  {
    id: "rezero",
    title: "Re:Zero - Começando uma Vida em Outro Mundo",
    score: "8.1",
    genres: "Fantasia • Drama",
    description: "Um jovem transportado para outro mundo enfrenta desafios.",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
    youtubeId: "98sI1knk-6k"
  },
  {
    id: "jujutsu",
    title: "Jujutsu Kaisen",
    score: "8.6",
    genres: "Ação • Sobrenatural",
    description: "Um estudante entra no mundo das maldições.",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80",
    youtubeId: "iVmcufvaO3M"
  }
];

const $ = id => document.getElementById(id);

const grid = $("animeGrid");
const libraryGrid = $("libraryGrid");
const searchInput = $("searchInput");
const detailModal = $("detailModal");
const playerModal = $("playerModal");
const youtubePlayer = $("youtubePlayer");

let currentAnime = animeCatalog.find(anime => anime.id === "doraemon");
let showAll = false;

function getLibrary() {
  try {
    return JSON.parse(localStorage.getItem("tomato-library") || "[]");
  } catch {
    return [];
  }
}

function setLibrary(ids) {
  localStorage.setItem("tomato-library", JSON.stringify(ids));
}

function saved(id) {
  return getLibrary().includes(id);
}

function toggleSave(id) {
  const items = getLibrary();

  setLibrary(
    items.includes(id)
      ? items.filter(item => item !== id)
      : [...items, id]
  );

  renderCards();
  renderLibrary();
  updateSaveButton();
}

function createCard(anime) {
  const card = document.createElement("article");
  card.className = "anime-card";
  card.tabIndex = 0;
  card.setAttribute("aria-label", anime.title);

  const coverWrap = document.createElement("div");
  coverWrap.className = "cover-wrap";

  const image = document.createElement("img");
  image.className = "cover";
  image.src = anime.image;
  image.alt = "Capa ilustrativa de " + anime.title;
  image.loading = "lazy";

  image.addEventListener("error", () => {
    image.alt = "Capa ilustrativa indisponível";
  });

  const rating = document.createElement("span");
  rating.className = "rating";
  rating.textContent = "★ " + anime.score;

  const actions = document.createElement("div");
  actions.className = "card-actions";

  const saveButton = document.createElement("button");
  saveButton.className = "save-btn" + (saved(anime.id) ? " saved" : "");
  saveButton.textContent = saved(anime.id) ? "✓" : "+";
  saveButton.title = "Minha Biblioteca";
  saveButton.setAttribute("aria-label", "Alternar biblioteca");

  saveButton.addEventListener("click", event => {
    event.stopPropagation();
    toggleSave(anime.id);
  });

  actions.appendChild(saveButton);
  coverWrap.append(image, rating, actions);

  const info = document.createElement("div");
  info.className = "card-info";

  const title = document.createElement("h3");
  title.className = "card-title";
  title.textContent = anime.title;

  const tags = document.createElement("div");
  tags.className = "card-tags";
  tags.textContent = anime.genres;

  info.append(title, tags);
  card.append(coverWrap, info);

  card.addEventListener("click", () => openDetails(anime));
  card.addEventListener("keydown", event => {
    if (event.key === "Enter") openDetails(anime);
  });

  return card;
}

function renderCards() {
  const query = searchInput.value.trim().toLocaleLowerCase("pt-BR");

  const filtered = animeCatalog.filter(anime =>
    `${anime.title} ${anime.genres}`
      .toLocaleLowerCase("pt-BR")
      .includes(query)
  );

  const list = showAll || query ? filtered : filtered.slice(0, 12);

  grid.replaceChildren();

  if (!list.length) {
    const message = document.createElement("p");
    message.className = "no-results";
    message.textContent = "Nenhum anime encontrado para essa busca.";
    grid.appendChild(message);
    return;
  }

  list.forEach(anime => grid.appendChild(createCard(anime)));
}

function renderLibrary() {
  const ids = getLibrary();
  const list = animeCatalog.filter(anime => ids.includes(anime.id));

  libraryGrid.replaceChildren();
  list.forEach(anime => libraryGrid.appendChild(createCard(anime)));

  $("emptyLibrary").classList.toggle("hidden", list.length > 0);
}

function openDetails(anime) {
  currentAnime = anime;

  $("detailCover").src = anime.image;
  $("detailCover").alt = anime.title;
  $("detailTitle").textContent = anime.title;
  $("detailMeta").textContent = `★ ${anime.score} • ${anime.genres}`;
  $("detailDescription").textContent = anime.description;

  updateSaveButton();
  detailModal.classList.remove("hidden");
}

function updateSaveButton() {
  $("detailSave").textContent = saved(currentAnime.id)
    ? "✓ Salvo na Biblioteca"
    : "＋ Minha Biblioteca";
}

function watchAnime(anime) {
  currentAnime = anime;

  if (!anime.youtubeId) {
    $("playerTitle").textContent = anime.title;
    $("playerNote").textContent =
      "Ainda não há um vídeo configurado para este título.";
    youtubePlayer.src = "";
    detailModal.classList.add("hidden");
    playerModal.classList.remove("hidden");
    return;
  }

  $("playerTitle").textContent = anime.title;
  $("playerNote").textContent =
    "Reprodução fornecida pelo YouTube. A disponibilidade depende do vídeo original.";

  const params = new URLSearchParams({
    autoplay: "1",
    playsinline: "1"
  });

  youtubePlayer.src =
    `https://www.youtube-nocookie.com/embed/${encodeURIComponent(anime.youtubeId)}?${params}`;

  detailModal.classList.add("hidden");
  playerModal.classList.remove("hidden");
}

function closeModal(modal) {
  modal.classList.add("hidden");

  if (modal === playerModal) {
    youtubePlayer.src = "";
  }
}

function showLibrary() {
  $("trendingSection").classList.add("hidden");
  $("librarySection").classList.remove("hidden");
  $("libraryBtn").classList.add("active");
  $("homeBtn").classList.remove("active");

  renderLibrary();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showHome() {
  $("librarySection").classList.add("hidden");
  $("trendingSection").classList.remove("hidden");
  $("homeBtn").classList.add("active");
  $("libraryBtn").classList.remove("active");

  window.scrollTo({ top: 0, behavior: "smooth" });
}

$("heroWatch").addEventListener("click", () => watchAnime(currentAnime));
$("heroInfo").addEventListener("click", () => openDetails(currentAnime));
$("detailWatch").addEventListener("click", () => watchAnime(currentAnime));
$("detailSave").addEventListener("click", () => toggleSave(currentAnime.id));

$("homeBtn").addEventListener("click", showHome);
$("libraryBtn").addEventListener("click", showLibrary);
$("backHome").addEventListener("click", showHome);

$("viewAll").addEventListener("click", () => {
  showAll = !showAll;
  $("viewAll").textContent = showAll ? "Ver menos ↑" : "Ver Todos →";
  renderCards();
});

searchInput.addEventListener("input", renderCards);

document.querySelectorAll("[data-close='detail']").forEach(element => {
  element.addEventListener("click", () => closeModal(detailModal));
});

document.querySelectorAll("[data-close='player']").forEach(element => {
  element.addEventListener("click", () => closeModal(playerModal));
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeModal(detailModal);
    closeModal(playerModal);
  }
});

$("heroTitle").textContent = currentAnime.title;
$("heroDescription").textContent = currentAnime.description;
$("heroGenres").innerHTML = currentAnime.genres
  .split(" • ")
  .map(genre => `<span>${genre}</span>`)
  .join("");

renderCards();
renderLibrary();