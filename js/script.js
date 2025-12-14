const hamburger = document.querySelector("#hamburger-menu");
const navbarNav = document.querySelector(".navbar-nav");

// Toggle Search
const searchForm = document.querySelector(".search-form");
const searchBox = document.querySelector("#search-box");
const searchBtn = document.querySelector("#search-button");

// Shopping Cart
const shoppingCart = document.querySelector(".shopping-cart");
const shoppingBtn = document.querySelector("#shopping-cart-button");

// Toggle menu (hamburger)
hamburger.addEventListener("click", function (e) {
  e.preventDefault();
  e.stopPropagation();

  // Tutup search saat hamburger dibuka
  searchForm.classList.remove("active");

  navbarNav.classList.toggle("active");

  shoppingCart.classList.remove("active");
});

// Toggle search
searchBtn.addEventListener("click", function (e) {
  e.preventDefault();
  e.stopPropagation();

  // Tutup navbar saat search dibuka
  navbarNav.classList.remove("active");

  shoppingCart.classList.remove("active");

  searchForm.classList.toggle("active");
  searchBox.focus();
});

// Toggle shopping cart
shoppingBtn.addEventListener("click", function (e) {
  e.preventDefault();
  e.stopPropagation();

  // Tutup navbar & search saat cart dibuka
  navbarNav.classList.remove("active");
  searchForm.classList.remove("active");

  shoppingCart.classList.toggle("active");
});

// Klik di luar semua menu
document.addEventListener("click", function (e) {
  // Tutup navbar
  if (!hamburger.contains(e.target) && !navbarNav.contains(e.target)) {
    navbarNav.classList.remove("active");
  }

  // Tutup search
  if (!searchBtn.contains(e.target) && !searchForm.contains(e.target)) {
    searchForm.classList.remove("active");
  }

  // Tutup shopping cart
  if (!shoppingBtn.contains(e.target) && !shoppingCart.contains(e.target)) {
    shoppingCart.classList.remove("active");
  }
});

// ========= DETAIL MODAL =========
const itemDetailModal = document.querySelector("#item-detail-modal");

// Fungsi isi modal
function showProductDetail(item) {
  // Isi konten modal
  document.querySelector("#detail-img").src = "img/" + item.img;
  document.querySelector("#detail-title").textContent = item.name;
  document.querySelector("#detail-price").textContent = rupiah(item.price);
  document.querySelector("#detail-description").textContent =
    item.description || "Tidak ada deskripsi.";

  // Tampilkan modal
  itemDetailModal.classList.add("active");
}

// tombol eye
document.addEventListener("click", function (e) {
  const btn = e.target.closest(".detail-btn");

  if (btn) {
    e.preventDefault();

    // Ambil data dari atribut HTML
    const item = {
      img: btn.dataset.img,
      name: btn.dataset.name,
      price: parseInt(btn.dataset.price),
      description: btn.dataset.desc,
    };

    showProductDetail(item);
  }
});

// tombol close
const modalClose = document.querySelector(".modal .close-icon");
modalClose.addEventListener("click", function () {
  itemDetailModal.classList.remove("active");
});

// klik di luar modal
window.addEventListener("click", function (e) {
  if (e.target === itemDetailModal) {
    itemDetailModal.classList.remove("active");
  }
});
