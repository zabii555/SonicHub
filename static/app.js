let products = [];
let cart = JSON.parse(localStorage.getItem("cart") || "[]");

const fallbackProducts = [
  [1,"AKG N9 Hybrid ANC","Wireless",349,399,4.9,"8_Buy_the_AKG_N9_Hybrid_Premium_Wireless.png","Premium wireless over-ear with adaptive noise cancelling & 100h battery."],
  [2,"Beats Studio Pro","Wireless",329,379,4.8,"2_Beats_Studio_Pro_Premium_Wireless.png","Iconic sound, custom acoustic platform, lossless audio via USB-C."],
  [3,"Green Lion GP32X Gaming","Gaming",89,120,4.6,"3_Green_Lion_GP32X_Gaming_Headphone.png","RGB gaming headset with 7.1 surround sound and noise-cancel mic."],
  [4,"Apple AirPods Pro 2","AirPods",249,299,4.9,"10_Apple_AirPods_Pro_2.png","Active noise cancelling earbuds with H2 chip & 30h total battery."],
  [5,"Roland VMH-S100 Studio","Studio",249,299,4.7,"5_Roland_VMH_S100_Premium_Studio_Headphone.png","Professional studio monitoring headphones, flat reference sound."],
  [6,"HECATE G2II 7.1","Gaming",79,99,4.4,"6_G2II_Black_HECATE_Gaming_Headset.png","360-degree surround sound gaming headset with detachable mic."],
  [7,"Logitech G733 RGB","Gaming",159,199,4.8,"7_Logitech_G733_LIGHTSPEED_Wireless.png","LIGHTSPEED wireless with RGB lighting, only 278g ultra light."],
  [8,"SoundArt M98 Studio","Studio",129,169,4.5,"9_SoundArt_Professional_Premium_Closed.png","Closed-back studio headphones trusted by producers worldwide."],
  [9,"Sony WF-1000XM5","Earbuds",299,349,4.8,"13_Sony_WF_1000XM5_Earbuds.png","Industry leading ANC earbuds with Hi-Res audio & 36h battery."],
  [10,"Beats Studio Buds+","Earbuds",169,199,4.6,"14_Beats_Studio_Buds_Plus.png","Punchy bass, active ANC & seamless one-touch pairing."],
  [11,"Apple AirPods (2nd Gen)","AirPods",129,159,4.7,"21_AirPods_2nd_Gen.png","The iconic AirPods with H1 chip, Hey Siri & wireless charging case."],
  [12,"JBL Tour Pro 2","Earbuds",149,179,4.4,"15_JBL_Tour_Pro_2.png","Smart charging case with touchscreen, ANC & 40h playtime."],
  [13,"Sennheiser Momentum TWS","Earbuds",219,259,4.7,"19_Sennheiser_Momentum_TWS.png","True wireless with audiophile sound & adaptive noise cancelling."],
  [14,"Bose QuietComfort Earbuds","Earbuds",239,279,4.8,"16_Bose_QuietComfort_Earbuds.png","World-class noise cancelling with deep, rich bass response."],
  [15,"Nothing Ear (a)","Earbuds",129,159,4.5,"17_Nothing_Ear_a.png","Clean sound, modern design and low-latency wireless performance."],
  [16,"Bose QC Earbuds II","Earbuds",199,249,4.6,"18_Bose_QC_Earbuds_Black.png","CustomTune sound calibration, compact fit & all-day comfort."],
  [17,"Pro Wired Handsfree","Handsfree",25,35,4.3,"20_Wired_Handsfree.png","Braided-cable 3.5mm earphones with HD mic and deep bass."],
  [18,"Type-C Handsfree HD","Handsfree",19,29,4.5,"22_Handsfree_TypeC.png","Premium metal-body Type-C earphones with noise-isolating mic."],
  [19,"Classic White Handsfree","Handsfree",15,22,4.2,"23_Handsfree_Classic_White.png","Lightweight everyday earphones with crystal-clear calls & music."]
].map(([id,name,category,price,old_price,rating,img,desc]) => ({id,name,category,price,old_price,rating,desc,img:`static/img/${img}`}));

/* ---------- Products ---------- */
async function loadProducts() {
  try {
    const res = await fetch("/api/products");
    if (!res.ok) throw new Error("API unavailable");
    products = (await res.json()).products;
  } catch {
    products = fallbackProducts;
  }
  renderProducts("All");
}

function renderProducts(cat) {
  const grid = document.getElementById("product-grid");
  const list = cat === "All" ? products : products.filter(p => p.category === cat);
  grid.innerHTML = list.map(p => `
    <div class="card reveal visible">
      <div class="img-wrap"><img src="${p.img}" alt="${p.name}" loading="lazy"></div>
      <div class="info">
        <span class="cat">${p.category}</span>
        <h3>${p.name}</h3>
        <p class="desc">${p.desc}</p>
        <div class="rating">${"★".repeat(Math.round(p.rating))} ${p.rating}</div>
        <div class="price-row">
          <div class="price">$${p.price}<span class="old">$${p.old_price}</span></div>
          <button class="add-btn" onclick="addToCart(${p.id})">Add +</button>
        </div>
      </div>
    </div>`).join("");
}

function setFilter(cat) {
  document.querySelectorAll(".filter").forEach(b =>
    b.classList.toggle("active", b.dataset.cat === cat));
  renderProducts(cat);
}

document.querySelectorAll(".filter").forEach(btn =>
  btn.addEventListener("click", () => setFilter(btn.dataset.cat)));

function goCategory(cat) {
  setFilter(cat);
  document.getElementById("products").scrollIntoView({ behavior: "smooth" });
}

/* ---------- Cart ---------- */
function addToCart(id) {
  const item = cart.find(i => i.id === id);
  if (item) item.qty++;
  else { const p = products.find(p => p.id === id); cart.push({ id: p.id, name: p.name, price: p.price, img: p.img, qty: 1 }); }
  saveCart(); toast("Added to cart 🎧");
}
function changeQty(id, d) {
  const item = cart.find(i => i.id === id);
  item.qty += d;
  if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
  saveCart();
}
function removeItem(id) { cart = cart.filter(i => i.id !== id); saveCart(); }
function saveCart() { localStorage.setItem("cart", JSON.stringify(cart)); renderCart(); }
function cartTotal() { return cart.reduce((s, i) => s + i.price * i.qty, 0); }

function renderCart() {
  document.getElementById("cart-count").textContent = cart.reduce((s, i) => s + i.qty, 0);
  const box = document.getElementById("cart-items");
  box.innerHTML = !cart.length ? `<p class="empty-cart">Your cart is empty 🛒<br><small>Add some headphones!</small></p>` :
    cart.map(i => `
      <div class="cart-item">
        <img src="${i.img}" alt="">
        <div class="ci-info"><b>${i.name}</b><span>$${i.price} × ${i.qty}</span></div>
        <div class="qty-controls">
          <button onclick="changeQty(${i.id},-1)">−</button><span>${i.qty}</span><button onclick="changeQty(${i.id},1)">+</button>
        </div>
        <button class="remove" onclick="removeItem(${i.id})">🗑</button>
      </div>`).join("");
  document.getElementById("cart-total").textContent = "$" + cartTotal();
}

function toggleCart(open) {
  document.getElementById("cart-drawer").classList.toggle("open", open);
  document.getElementById("overlay").classList.toggle("show", open);
}

async function placeOrder() {
  const name = document.getElementById("co-name").value.trim();
  const phone = document.getElementById("co-phone").value.trim();
  const address = document.getElementById("co-address").value.trim();
  const paymentMethod = document.getElementById("co-payment").value;
  const paymentReference = document.getElementById("co-reference").value.trim();
  if (!cart.length) return toast("Cart is empty!");
  if (!name || !address) return toast("Please fill name & address");
  const res = await fetch("/api/order", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name, phone, address, payment_method: paymentMethod,
      payment_reference: paymentReference, items: cart, total: cartTotal()
    })
  });
  const data = await res.json();
  if (data.success) {
    cart = []; saveCart(); toggleCart(false);
    toast(data.forwarded
      ? "Order placed and emailed! ID: " + data.order.order_id + " ✅"
      : "Order saved! Gmail is not configured. ID: " + data.order.order_id);
    document.querySelectorAll("#checkout-form input").forEach(i => i.value = "");
  } else toast("Error: " + data.error);
}

/* ---------- Newsletter ---------- */
document.getElementById("newsletter-form").addEventListener("submit", async e => {
  e.preventDefault();
  const email = document.getElementById("nl-email").value.trim();
  const res = await fetch("/api/newsletter", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  });
  if ((await res.json()).success) { e.target.reset(); toast("Subscribed! 10% code sent to your email 🎁"); }
  else toast("Please enter a valid email");
});

/* ---------- Contact ---------- */
document.getElementById("contact-form").addEventListener("submit", async e => {
  e.preventDefault();
  const form = e.target;
  const res = await fetch("/api/contact", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: document.getElementById("contact-name").value.trim(),
      email: document.getElementById("contact-email").value.trim(),
      message: document.getElementById("contact-message").value.trim()
    })
  });
  const data = await res.json();
  if (data.success) {
    form.reset();
    toast(data.forwarded ? "Message sent successfully!" : "Message saved; Gmail is not configured yet.");
  }
  else toast("Error: " + data.error);
});

/* ---------- Countdown ---------- */
const dealEnd = Date.now() + 1000 * 60 * 60 * 26 + 1000 * 60 * 14; // ~26h
setInterval(() => {
  const d = Math.max(0, dealEnd - Date.now());
  const h = Math.floor(d / 3.6e6), m = Math.floor(d % 3.6e6 / 6e4), s = Math.floor(d % 6e4 / 1e3);
  const pad = n => String(n).padStart(2, "0");
  document.getElementById("cd-h").textContent = pad(h);
  document.getElementById("cd-m").textContent = pad(m);
  document.getElementById("cd-s").textContent = pad(s);
}, 1000);

/* ---------- FAQ ---------- */
document.querySelectorAll(".faq-q").forEach(btn => {
  btn.addEventListener("click", () => {
    const item = btn.parentElement, ans = item.querySelector(".faq-a");
    const isOpen = item.classList.contains("open");
    document.querySelectorAll(".faq-item.open").forEach(i => {
      i.classList.remove("open"); i.querySelector(".faq-a").style.maxHeight = null;
    });
    if (!isOpen) { item.classList.add("open"); ans.style.maxHeight = ans.scrollHeight + "px"; }
  });
});

/* ---------- Scroll effects ---------- */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add("visible");
      if (e.target.classList.contains("stock-fill")) e.target.style.width = "78%";
      if (e.target.classList.contains("counter")) animateCounter(e.target);
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal, .stock-fill, .counter").forEach(el => io.observe(el));

function animateCounter(el) {
  const target = +el.dataset.target, dur = 1600, t0 = performance.now();
  const step = now => {
    const p = Math.min((now - t0) / dur, 1);
    el.textContent = Math.floor(target * (1 - Math.pow(1 - p, 3))).toLocaleString() + (target >= 1000 ? "+" : "");
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

window.addEventListener("scroll", () => {
  document.getElementById("navbar").classList.toggle("scrolled", scrollY > 40);
  document.getElementById("to-top").classList.toggle("show", scrollY > 500);
});

function toast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg; t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2600);
}

loadProducts();
renderCart();

/* ---------- Hero headphone assembly ---------- */
window.addEventListener("load", () => {
  setTimeout(() => document.getElementById("asm")?.classList.add("animate"), 350);
});
function replayAssembly() {
  const a = document.getElementById("asm");
  a.classList.remove("animate");
  void a.offsetWidth;
  a.classList.add("animate");
}
