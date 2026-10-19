/* ============================================
   GADO GADO PRAPATAN · Script
   ============================================ */

const WA = '6285183103489'; // ← Ganti nomor WA Anda di sini

// ─── NAV ────────────────────────────────────
const burger = document.getElementById('burger');
const navMenu = document.getElementById('navMenu');

burger.addEventListener('click', () => navMenu.classList.toggle('open'));

document.querySelectorAll('.nav-menu a').forEach(a => {
    a.addEventListener('click', () => navMenu.classList.remove('open'));
});

// Navbar scroll
window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', scrollY > 30);
});

// ─── MENU FILTER & CATEGORY ROLL ────────────────────────────
const tabs = document.querySelectorAll('.tab');
const menuCards = document.querySelectorAll('.mc');
const tabBar = document.getElementById('tabBar');
const tabRollLeft = document.getElementById('tabRollLeft');
const tabRollRight = document.getElementById('tabRollRight');

// Roll left / right buttons
if (tabRollLeft && tabBar) {
    tabRollLeft.addEventListener('click', () => {
        tabBar.scrollBy({ left: -160, behavior: 'smooth' });
    });
}
if (tabRollRight && tabBar) {
    tabRollRight.addEventListener('click', () => {
        tabBar.scrollBy({ left: 160, behavior: 'smooth' });
    });
}

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Scroll active tab into view smoothly
        tab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });

        const f = tab.dataset.filter;
        menuCards.forEach(card => {
            const cats = (card.dataset.cat || '').trim().split(/\s+/);
            const show = f === 'semua' || cats.includes(f);
            card.classList.toggle('hidden', !show);
        });
    });
});

// Product detail modal elements
const pdOverlay = document.getElementById('pdOverlay');
const pdClose   = document.getElementById('pdClose');
const pdIcon    = document.getElementById('pdIcon');
const pdTag     = document.getElementById('pdTag');
const pdName    = document.getElementById('pdName');
const pdPrice   = document.getElementById('pdPrice');
const pdDesc    = document.getElementById('pdDesc');
const pdInfo    = document.getElementById('pdInfo');
const pdQtyNum  = document.getElementById('pdQtyNum');
const pdMinus   = document.getElementById('pdMinus');
const pdPlus    = document.getElementById('pdPlus');
const pdAddBtn  = document.getElementById('pdAddBtn');

let currentProduct = null;
let currentQty = 1;

menuCards.forEach(card => {
    card.addEventListener('click', () => {
        const name  = card.dataset.name;
        const price = +card.dataset.price;
        const desc  = card.dataset.desc || '';
        const info  = card.dataset.info || '';
        const iconHtml = card.querySelector('.mc-img').innerHTML;
        const tagEl = card.querySelector('.mc-tag');

        currentProduct = { name, price };
        currentQty = 1;
        pdQtyNum.textContent = currentQty;

        pdIcon.innerHTML = iconHtml;
        pdName.textContent = name;
        pdPrice.textContent = rp(price);
        pdDesc.textContent = desc;
        pdInfo.innerHTML = info;

        if (tagEl) {
            pdTag.className = 'pd-tag ' + tagEl.className.replace('mc-tag', '').trim();
            pdTag.textContent = tagEl.textContent;
            pdTag.style.display = 'inline-block';
        } else {
            pdTag.style.display = 'none';
        }

        pdOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

function closePdModal() {
    pdOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

pdClose.addEventListener('click', closePdModal);
pdOverlay.addEventListener('click', (e) => {
    if (e.target === pdOverlay) closePdModal();
});

pdMinus.addEventListener('click', () => {
    if (currentQty > 1) {
        currentQty--;
        pdQtyNum.textContent = currentQty;
    }
});

pdPlus.addEventListener('click', () => {
    currentQty++;
    pdQtyNum.textContent = currentQty;
});

pdAddBtn.addEventListener('click', () => {
    if (!currentProduct) return;
    const found = cart.find(c => c.name === currentProduct.name);
    if (found) {
        found.qty += currentQty;
    } else {
        cart.push({ name: currentProduct.name, price: currentProduct.price, qty: currentQty });
    }
    renderCart();
    toast(`${currentProduct.name} (${currentQty}x) ditambahkan`);
    closePdModal();
});

// ─── CART ────────────────────────────────────
let cart = [];

const cartBar       = document.getElementById('cartBar');
const cartQty       = document.getElementById('cartQty');
const cartBarTotal   = document.getElementById('cartBarTotal');
const cartDetailBtn  = document.getElementById('cartDetailBtn');
const cartWaBtn      = document.getElementById('cartWaBtn');
const cartModal      = document.getElementById('cartModal');
const cartModalBg    = document.getElementById('cartModalBg');
const cartModalClose = document.getElementById('cartModalClose');
const cartModalList  = document.getElementById('cartModalList');
const cartModalTotal = document.getElementById('cartModalTotal');
const cartModalWa    = document.getElementById('cartModalWa');
const cartClearBtn   = document.getElementById('cartClearBtn');

function renderCart() {
    const qty = cart.reduce((s, c) => s + c.qty, 0);
    const total = cart.reduce((s, c) => s + c.price * c.qty, 0);

    cartQty.textContent = qty;
    cartBarTotal.textContent = rp(total);
    cartModalTotal.textContent = rp(total);
    cartBar.style.display = qty > 0 ? 'block' : 'none';

    cartModalList.innerHTML = cart.map((c, i) => `
        <div class="cm-item">
            <div class="cm-item-info">
                <div class="cm-item-name">${c.name}</div>
            </div>
            <div class="cm-qty">
                <button onclick="cq(${i},-1)">−</button>
                <span>${c.qty}</span>
                <button onclick="cq(${i},1)">+</button>
            </div>
            <span class="cm-price">${rp(c.price * c.qty)}</span>
        </div>
    `).join('');
}

window.cq = (i, d) => {
    cart[i].qty += d;
    if (cart[i].qty <= 0) cart.splice(i, 1);
    renderCart();
};

function rp(n) { return 'Rp ' + n.toLocaleString('id-ID'); }

cartDetailBtn.addEventListener('click', () => { cartModal.style.display = 'flex'; });
cartModalClose.addEventListener('click', () => { cartModal.style.display = 'none'; });
cartModalBg.addEventListener('click', () => { cartModal.style.display = 'none'; });
cartClearBtn.addEventListener('click', () => { cart = []; renderCart(); cartModal.style.display = 'none'; });

function sendWA() {
    if (!cart.length) return;
    const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
    let msg = `Halo kak, mau pesan dari *Gado Gado Prapatan*:\n\n`;
    cart.forEach(c => { msg += `• ${c.name} x${c.qty} = ${rp(c.price * c.qty)}\n`; });
    msg += `\n*Total: ${rp(total)}*\nTerima kasih.`;
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`, '_blank');
}

cartWaBtn.addEventListener('click', sendWA);
cartModalWa.addEventListener('click', sendWA);

function toast(text) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = text;
    document.body.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; t.style.transition = '0.3s'; setTimeout(() => t.remove(), 300); }, 1800);
}

// ─── CHATBOT ────────────────────────────────
const bot = document.getElementById('bot');
const botBtn = document.getElementById('botBtn');
const botChat = document.getElementById('botChat');
const botForm = document.getElementById('botForm');
const botInput = document.getElementById('botInput');

const KB = {
    hi: [
        'Halo! Ada yang bisa dibantu? Mau pesan gado-gado atau ketoprak hari ini?',
        'Hai kak! Selamat datang di Gado Gado Prapatan. Mau tanya apa?',
        'Halo! Mau tau info menu, cara pesan, atau yang lain?'
    ],
    menu: `*Menu Gado-Gado*\n• Gado Gado Lontong Original — 17rb\n• Gado Gado Lontong Telur Dadar — 22rb\n• Gado Gado Lontong Telur Ceplok — 22rb\n• Gado Gado Lontong Telur Bulat — 21rb\n• Gado Gado Lontong Taburan Kacang Mete — 20rb\n• Gado Gado Lontong Taburan Kacang Tanah — 17rb\n• Gado-Gado Komplit (Lontong + Telur + Es Teh) — 20rb\n• Gado-Gado Bumbu Mete (Mede) — 35rb\n\n*Menu Ketoprak*\n• Ketoprak Original — 17rb\n• Ketoprak Telur Dadar — 21rb\n• Ketoprak Telur Ceplok — 21rb\n• Ketoprak Telur Bulat — 21rb\n• Ketoprak Komplit (Ketoprak + Telur + Es Teh) — 20rb\n• Ketoprak Taburan Kacang Mete (Mede) — 20rb\n\n*Minuman & Pelengkap*\n• Jus Mangga - Susu — 20rb \n• Es Pir + Susu — 20rb\n• Jus Alpukat + Susu  — 23rb`,

    pesan: `Gampang banget:\n1. Pilih menu di website, klik menunya\n2. Atur jumlah, klik "Tambah ke Pesanan"\n3. Cek keranjang di bawah layar\n4. Klik "Pesan via WA"\n5. Otomatis terkirim ke WhatsApp kami!\n\n\nAtau langsung chat WA: \n +62 851-8310-2489`,

    jam: `Senin–Sabtu: 07.00–21:00\nMinggu: 07:00–21:00\n\nPesanan online bisa kapan saja, diproses saat jam operasional buka.`,

    alamat: `Jl. Prapatan Raya No. 45\nJakarta Pusat, 10110\n\nLayanan antar gratis radius 3 km (min. 25rb).`,

    harga: `Daftar harga:\n• Gado-Gado: 17rb – 35rb\n• Ketoprak: 17rb – 21rb\n• Paket Komplit (Gado-Gado/Ketoprak + Es Teh): 20rb\n• Minuman: 23rb \nSangat terjangkau & porsi puas!`,

    promo: `Promo saat ini:\n• Beli 3 porsi gado-gado / ketoprak, gratis 1 Es Teh Manis\n• Paket Hemat: Gado-gado Komplit / Ketoprak Komplit + Es Teh = 38rb`,

    antar: `Info pesan antar / delivery:\n• WhatsApp: Gratis ongkir radius 3 km (min. 25rb)\n• GoFood: Buka aplikasi Gojek cari "Gado Gado Prapatan"\n• GrabFood: Tersedia di GrabFood\n• ShopeeFood: Tersedia di ShopeeFood\n\nEstimasi pengantaran 30–45 menit.`,

    thx: 'Sama-sama kak! Ditunggu pesanannya ya.',



    miss: [
        'Coba tanya soal menu, cara pesan, jam buka, atau alamat ya kak.',
        'Maaf belum bisa jawab itu. Mau tanya seputar menu atau cara pemesanan?',
        'Untuk info lebih lanjut, langsung chat WhatsApp kami ya kak.'
    ]
};

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function match(t, keys) { return keys.some(k => t.includes(k)); }

function reply(raw) {
    const t = raw.toLowerCase();
    if (match(t, ['halo','hai','hi','hey','pagi','siang','sore','malam'])) return pick(KB.hi);
    if (match(t, ['menu','daftar','makanan','makan','apa aja','apa saja'])) return KB.menu;
    if (match(t, ['pesan','order','beli','cara','gimana','bagaimana'])) return KB.pesan;
    if (match(t, ['jam','buka','tutup','operasional','waktu'])) return KB.jam;
    if (match(t, ['alamat','lokasi','dimana','di mana','tempat'])) return KB.alamat;
    if (match(t, ['harga','berapa','murah','price'])) return KB.harga;
    if (match(t, ['promo','diskon','gratis'])) return KB.promo;
    if (match(t, ['antar','delivery','kirim','ongkir'])) return KB.antar;
    if (match(t, ['terima kasih','makasih','thanks','thank'])) return KB.thx;
    if (match(t, ['gado','ketoprak','original','spesial','lontong','vegetarian','pedas']))
        return 'Pilihan yang pas! Klik menu untuk memilih porsi, lalu checkout lewat WhatsApp.';
    return pick(KB.miss);
}

function addMsg(text, who) {
    const d = document.createElement('div');
    d.className = `msg msg-${who}`;
    d.innerHTML = text.replace(/\n/g, '<br>').replace(/\*(.*?)\*/g, '<b>$1</b>');
    botChat.appendChild(d);
    botChat.scrollTop = botChat.scrollHeight;
}

botBtn.addEventListener('click', () => {
    bot.classList.toggle('open');
    if (bot.classList.contains('open') && !botChat.children.length) {
        setTimeout(() => addMsg(pick(KB.hi), 'bot'), 400);
    }
});

document.querySelectorAll('.bot-quick button').forEach(b => {
    b.addEventListener('click', () => {
        const msg = b.dataset.msg;
        addMsg(msg, 'user');
        setTimeout(() => addMsg(reply(msg), 'bot'), 600 + Math.random() * 400);
    });
});

botForm.addEventListener('submit', e => {
    e.preventDefault();
    const v = botInput.value.trim();
    if (!v) return;
    addMsg(v, 'user');
    botInput.value = '';
    // typing indicator
    const dot = document.createElement('div');
    dot.className = 'msg msg-bot';
    dot.textContent = '···';
    dot.style.opacity = '0.4';
    botChat.appendChild(dot);
    botChat.scrollTop = botChat.scrollHeight;
    setTimeout(() => { dot.remove(); addMsg(reply(v), 'bot'); }, 700 + Math.random() * 500);
});
