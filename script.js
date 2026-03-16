const WHATS_NUMBER = "55SEUNUMEROAQUI"; // Ex.: "5511999999999" (DDD + número, sem espaços)
const HIGHLIGHT_WHATS_NUMBERS = [
  "5562999990002",
  "5562985113556",
  "5562985113556",
  "5562984824653",
  "556235428406",
  "5562985585994",
];
const WHATS_DEFAULT = "Olá! Vim pelo site da Oxcartt e quero ajuda para escolher uma peça.";

function openWhats(text, number = WHATS_NUMBER) {
  const msg = encodeURIComponent(text);
  const phone = String(number || "").replace(/\D/g, "");
  const url = `https://wa.me/${phone}?text=${msg}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

function randomItem(items) {
  if (!Array.isArray(items) || !items.length) return "";
  const index = Math.floor(Math.random() * items.length);
  return items[index];
}

function buildHighlightWhatsMessage(category, imagePath, position) {
  const imageUrl = new URL(imagePath, window.location.href).href;
  return [
    "Ola! Vim pelo site da Oxcartt e quero comprar este look.",
    `Categoria: ${category}.`,
    `Look selecionado: ${position}.`,
    `Foto: ${imageUrl}`
  ].join(" ");
}

document.getElementById("year").textContent = String(new Date().getFullYear());

const whatsMain = document.getElementById("whatsMain");
if (whatsMain) {
  whatsMain.addEventListener("click", (e) => {
    e.preventDefault();
    openWhats(WHATS_DEFAULT);
  });
}

document.addEventListener("click", (event) => {
  const whatsButton = event.target.closest("[data-whats]");
  if (!whatsButton) return;

  event.preventDefault();
  openWhats(whatsButton.getAttribute("data-whats"));
});

const sendWhats = document.getElementById("sendWhats");
if (sendWhats) {
  sendWhats.addEventListener("click", () => {
    const nameEl = document.getElementById("name");
    const topicEl = document.getElementById("topic");
    const msgEl = document.getElementById("msg");

    const name = nameEl ? nameEl.value.trim() : "";
    const topic = topicEl ? topicEl.value : "Atendimento";
    const msg = msgEl ? msgEl.value.trim() : "";

    const parts = [
      "Olá! Vim pelo site da Oxcartt.",
      name ? `Meu nome é ${name}.` : "",
      `Assunto: ${topic}.`,
      msg ? `Mensagem: ${msg}` : "Quero ajuda para escolher tamanho/modelo."
    ].filter(Boolean);

    openWhats(parts.join(" "));
  });
}

// Mobile menu
const toggle = document.querySelector(".nav__toggle");
const menu = document.getElementById("navMenu");

toggle.addEventListener("click", () => {
  const isOpen = menu.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", String(isOpen));
});

menu.querySelectorAll("a").forEach(a => {
  a.addEventListener("click", () => {
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  });
});

// Hero carousel
const carouselTrack = document.getElementById("heroCarousel");
const carouselDots = Array.from(document.querySelectorAll(".carousel__dot"));
const carouselSlides = carouselTrack ? Array.from(carouselTrack.querySelectorAll(".carousel__slide")) : [];

if (carouselTrack && carouselDots.length && carouselSlides.length) {
  let currentSlide = 0;
  const totalSlides = carouselSlides.length;
  let timerId;

  function setSlide(index) {
    currentSlide = (index + totalSlides) % totalSlides;
    carouselSlides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === currentSlide);
      slide.setAttribute("aria-hidden", String(i !== currentSlide));
    });
    carouselDots.forEach((dot, i) => {
      dot.classList.toggle("is-active", i === currentSlide);
      dot.setAttribute("aria-selected", String(i === currentSlide));
    });
  }

  function startAutoplay() {
    stopAutoplay();
    timerId = setInterval(() => setSlide(currentSlide + 1), 4500);
  }

  function stopAutoplay() {
    if (timerId) clearInterval(timerId);
  }

  carouselDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      setSlide(Number(dot.dataset.slide));
      startAutoplay();
    });
  });

  const carousel = document.querySelector(".carousel");
  if (carousel) {
    carousel.addEventListener("mouseenter", stopAutoplay);
    carousel.addEventListener("mouseleave", startAutoplay);
    carousel.addEventListener("focusin", stopAutoplay);
    carousel.addEventListener("focusout", startAutoplay);
  }

  setSlide(0);
  startAutoplay();
}

function renderHighlights(items, category, fallbackImage) {
  const list = document.getElementById("collectionHighlights");
  if (!list) return;

  list.innerHTML = "";

  items.forEach((item, index) => {
    const article = document.createElement("article");
    article.className = "product";

    const media = document.createElement("div");
    media.className = "product__img";

    const image = document.createElement("img");
    const imagePath = item.img || fallbackImage || "";
    image.src = imagePath;
    image.alt = `Look ${index + 1} da categoria ${category || "colecao"}`;
    image.loading = "lazy";
    image.addEventListener("error", () => {
      image.removeAttribute("src");
      image.alt = "Imagem indisponivel";
    });

    const body = document.createElement("div");
    body.className = "product__body";

    const button = document.createElement("button");
    button.className = "btn btn--primary product__cta";
    button.type = "button";
    button.textContent = "Compre agora";
    button.addEventListener("click", () => {
      const selectedNumber = randomItem(HIGHLIGHT_WHATS_NUMBERS);
      const message = buildHighlightWhatsMessage(category, imagePath, index + 1);
      openWhats(message, selectedNumber);
    });

    media.appendChild(image);
    body.appendChild(button);
    article.append(media, body);
    list.appendChild(article);
  });
}

function renderCategories(collections, activeCategory) {
  const list = document.getElementById("categoriesList");
  if (!list) return;

  list.innerHTML = "";

  collections.forEach((item) => {
    const link = document.createElement("a");
    link.className = "category-image";
    if (item.category === activeCategory) {
      link.classList.add("is-active");
    }

    link.href = "#colecao";
    link.setAttribute("aria-label", `Categoria ${item.category || ""}`.trim());
    link.dataset.category = item.category || "";

    const image = document.createElement("img");
    image.src = item.categoryImage || "";
    image.alt = item.category || "Categoria";
    image.loading = "lazy";

    link.appendChild(image);
    list.appendChild(link);
  });
}

async function loadCollections() {
  const categoriesList = document.getElementById("categoriesList");
  const highlightsList = document.getElementById("collectionHighlights");
  if (!categoriesList || !highlightsList) return;

  try {
    const response = await fetch("./data/collections.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Falha ao carregar data/collections.json");

    const collections = await response.json();
    if (!Array.isArray(collections) || !collections.length) {
      throw new Error("JSON de colecoes invalido");
    }

    let activeCategory = collections[0].category;

    const updateCollection = (category) => {
      const selectedCollection = collections.find((item) => item.category === category) || collections[0];
      activeCategory = selectedCollection.category;
      renderCategories(collections, activeCategory);
      renderHighlights(
        Array.isArray(selectedCollection.highlights) ? selectedCollection.highlights : [],
        selectedCollection.category || "",
        selectedCollection.categoryImage || ""
      );
    };

    categoriesList.addEventListener("click", (event) => {
      const categoryLink = event.target.closest("[data-category]");
      if (!categoryLink) return;

      event.preventDefault();
      updateCollection(categoryLink.dataset.category);
    });

    updateCollection(activeCategory);
  } catch (error) {
    console.error(error);
  }
}

function initialsFromName(name) {
  return String(name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("") || "OX";
}

function whatsappUrl(rawNumber, sellerName) {
  const number = String(rawNumber || "").replace(/\D/g, "");
  if (!number) return "";
  const message = encodeURIComponent(`Ola ${sellerName || ""}! Vim pelo site da Oxcartt e gostaria de atendimento.`);
  return `https://wa.me/${number}?text=${message}`;
}

function formatWhatsappNumber(rawNumber) {
  let digits = String(rawNumber || "").replace(/\D/g, "");
  if (!digits) return "";

  if (digits.startsWith("55") && (digits.length === 12 || digits.length === 13)) {
    digits = digits.slice(2);
  }

  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return digits;
}

function renderSellers(items) {
  const list = document.getElementById("sellersList");
  if (!list) return;

  list.innerHTML = "";

  items.forEach((item) => {
    const card = document.createElement("article");
    card.className = "seller";

    const img = document.createElement("img");
    img.className = "seller__photo";
    img.src = item["img-source"] || "";
    img.alt = `Foto de ${item.name || "vendedor"}`;
    img.addEventListener("error", () => {
      img.src = `https://placehold.co/160x160/222/efc100?text=${initialsFromName(item.name)}`;
    });

    const title = document.createElement("h3");
    title.textContent = item.name || "Nome nao informado";

    const desc = document.createElement("p");
    desc.textContent = item.description || "";

    const waUrl = whatsappUrl(item.whastapp, item.name);
    if (waUrl) {
      const waLink = document.createElement("a");
      waLink.className = "seller__whatsapp";
      waLink.href = waUrl;
      waLink.target = "_blank";
      waLink.rel = "noopener noreferrer";
      waLink.setAttribute("aria-label", `Conversar no WhatsApp com ${item.name || "vendedor"}`);

      const waIcon = document.createElement("span");
      waIcon.className = "seller__whatsappIcon";
      waIcon.setAttribute("aria-hidden", "true");
      waIcon.innerHTML = '<svg viewBox="0 0 24 24" focusable="false" aria-hidden="true"><path fill="currentColor" d="M20.52 3.48A11.86 11.86 0 0 0 12.07 0C5.5 0 .15 5.34.14 11.91a11.8 11.8 0 0 0 1.6 5.95L0 24l6.35-1.66a11.92 11.92 0 0 0 5.7 1.45h.01c6.57 0 11.92-5.35 11.93-11.92a11.85 11.85 0 0 0-3.47-8.39zM12.06 21.8h-.01a9.9 9.9 0 0 1-5.03-1.37l-.36-.21-3.77.99 1-3.68-.23-.38a9.87 9.87 0 0 1-1.5-5.25c0-5.46 4.44-9.9 9.9-9.9a9.84 9.84 0 0 1 7.01 2.9 9.84 9.84 0 0 1 2.9 7 9.9 9.9 0 0 1-9.91 9.9zm5.43-7.4c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.64.07-.3-.15-1.24-.46-2.36-1.47-.87-.78-1.46-1.74-1.63-2.04-.17-.3-.02-.45.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.57-.48-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.9 1.22 3.1.15.2 2.1 3.2 5.1 4.49.71.3 1.26.48 1.69.61.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.41.25-.69.25-1.28.17-1.4-.07-.12-.27-.2-.57-.35z"/></svg>';

      const waNumber = document.createElement("span");
      waNumber.className = "seller__whatsappNumber";
      waNumber.textContent = formatWhatsappNumber(item.whastapp);

      waLink.append(waIcon, waNumber);
      card.append(img, title, desc, waLink);
    } else {
      card.append(img, title, desc);
    }

    list.appendChild(card);
  });
}

async function loadSellers() {
  const list = document.getElementById("sellersList");
  if (!list) return;

  try {
    const response = await fetch("./data/funcionarios.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Falha ao carregar data/funcionarios.json");

    const data = await response.json();
    if (!Array.isArray(data)) throw new Error("JSON de funcionarios invalido");

    renderSellers(data);
  } catch (error) {
    list.innerHTML = '<p class="muted">Nao foi possivel carregar a lista de vendedores.</p>';
    console.error(error);
  }
}

loadSellers();
loadCollections();

function setMapFromAddress(mapId, addressId) {
  const map = document.getElementById(mapId);
  const addressEl = document.getElementById(addressId);
  if (!map || !addressEl) return;

  const query = (map.dataset.query || "").trim();
  const zoom = (map.dataset.zoom || "17").trim();
  if (query) {
    map.src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=${zoom}&output=embed`;
    return;
  }

  const lat = (map.dataset.lat || "").trim();
  const lng = (map.dataset.lng || "").trim();
  const label = (map.dataset.label || "").trim();
  if (lat && lng) {
    if (label) {
      map.src = `https://www.google.com/maps?q=${encodeURIComponent(label)}&ll=${lat},${lng}&z=${zoom}&output=embed`;
    } else {
      map.src = `https://www.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`;
    }
    return;
  }

  const address = addressEl.textContent.trim();
  if (!address) return;
  map.src = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
}

setMapFromAddress("map1", "address1");
setMapFromAddress("map2", "address2");
