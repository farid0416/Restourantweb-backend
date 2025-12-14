document.addEventListener("alpine:init", () => {
  Alpine.data("products", () => ({
    items: [
      { id: 1, name: "Salmon Stew", img: "freepik.png", price: 150000 },
      { id: 2, name: "Croisan", img: "croisan.png", price: 20000 },
      { id: 3, name: "Nasi Goreng", img: "nasi_goreng.png", price: 15000 },
    ],
  }));

  Alpine.store("cart", {
    items: [],
    total: 0,
    quantity: 0,
    add(newItem) {
      // cek apakah ada barang yang sama di cart
      const cartItem = this.items.find((item) => item.id === newItem.id);

      // jika belum ada
      if (!cartItem) {
        this.items.push({ ...newItem, quantity: 1, total: newItem.price });
        this.quantity++;
        this.total += newItem.price;
      } else {
        // jika barang sudah ada, cek apakah barang beda atau sama,

        this.items = this.items.map((item) => {
          // barang beda
          if (item.id !== newItem.id) {
            return item;
          } else {
            // jika barang sudah ada, tambah quantity dan total harga
            item.quantity++;
            item.total = newItem.price * item.quantity;
            this.quantity++;
            this.total += newItem.price;
            return item;
          }
        });
      }
    },

    remove(id) {
      // ambil item yang akan dihapus berdasarkan id
      const cartItem = this.items.find((item) => item.id === id);

      // jika item lebih dari 1, kurangi quantity dan total harga
      if (cartItem.quantity > 1) {
        this.items = this.items.map((item) => {
          if (item.id !== id) {
            return item;
          } else {
            item.quantity--;
            item.total = item.price * item.quantity;
            this.quantity--;
            this.total -= item.price;
            return item;
          }
        });
      } else if (cartItem.quantity === 1) {
        // jika item hanya 1, hapus item dari cart
        this.items = this.items.filter((item) => item.id !== id);
        this.quantity--;
        this.total -= cartItem.price;
      }
    },
  });
});

// Form Validation
const checkoutButton = document.querySelector(".checkout-button");
checkoutButton.disabled = true;

const form = document.querySelector("#checkoutForm");

form.addEventListener("keyup", function () {
  for (let i = 0; i < form.elements.length; i++) {
    if (form.elements[i].value.length !== 0) {
      checkoutButton.classList.remove("disabled");
      checkoutButton.classList.add("disabled");
    } else {
      return false;
    }
  }

  checkoutButton.disabled = false;
  checkoutButton.classList.remove("disabled");
});

// Kirim data ketika tombol checkout diklik
checkoutButton.addEventListener("click", async function (e) {
  e.preventDefault(); // cegah submit default

  const formData = new FormData(form);
  const objData = Object.fromEntries(formData);

  try {
    const response = await fetch("php/create_snap_token.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(objData),
    });

    const data = await response.json();
    console.log("Snap data:", data);

    if (data.token) {
      window.snap.pay(data.token, {
        onSuccess: function (result) {
          console.log("Success:", result);
        },
        onPending: function (result) {
          console.log("Pending:", result);
        },
        onError: function (result) {
          console.log("Error:", result);
        },
      });
    } else {
      console.error("Token tidak ditemukan:", data.error);
      alert("Gagal mendapatkan token pembayaran");
    }
  } catch (err) {
    console.error("Fetch error:", err);
    alert("Terjadi kesalahan koneksi");
  }
});

// format pesan whatsapp
const formatWaMessage = (obj) => {
  return `Data Costumer
  Name: ${obj.name}
  Email : ${obj.email}
  Phone : ${obj.phone}
 Data Pesanan
  ${JSON.parse(obj.items).map(
    (item) => `${item.name} (${item.quantity} x ${rupiah(item.total)}) \n`
  )}
  Total : ${rupiah(obj.total)}
  Terima Kasih`;
};
// Rupiah
const rupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(number);
};
