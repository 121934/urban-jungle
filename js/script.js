// --- 1. FİLTRELEME FONKSİYONU ---
const filterButtons = document.querySelectorAll('.filter-btn');
const plantCards = document.querySelectorAll('.plant-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Aktif butonu değiştir
        const activeBtn = document.querySelector('.filter-btn.active');
        if (activeBtn) activeBtn.classList.remove('active');
        button.classList.add('active');

        const filterValue = button.getAttribute('data-filter');

        plantCards.forEach(card => {
            
            if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                card.style.display = 'flex'; 
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// --- 2. SCROLLSPY (INTERSECTION OBSERVER) ---

const options = {
    root: null,
    rootMargin: '-10% 0px -70% 0px', 
    threshold: 0 
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            
            
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });

           
            const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
}, options);

// Sadece Bakım Rehberi sayfasındaysak (plant-section varsa) gözlemle
const sections = document.querySelectorAll('.plant-section');
if (sections.length > 0) {
    sections.forEach(section => {
        observer.observe(section);
    });
}
function displayCart() {
    const cartList = document.getElementById('cart-list');
    const totalPriceElement = document.getElementById('cart-total-price');
    
    // Eğer bu sayfada cart-list yoksa (yani sepet sayfasında değilsek) fonksiyonu çalıştırma
    if (!cartList) return;

    let cartData = JSON.parse(localStorage.getItem('urbanJungleCart')) || [];
    cartList.innerHTML = ''; 
    let total = 0;

    if (cartData.length === 0) {
        cartList.innerHTML = '<p class="empty-msg">Sepetiniz şu an boş. 🌿</p>';
        if (totalPriceElement) totalPriceElement.innerText = 'Toplam: 0 TL';
        return;
    }

    cartData.forEach((item, index) => {
        total += item.price * item.quantity;
        cartList.innerHTML += `
            <div class="cart-item">
                <img src="${item.img}" alt="${item.name}">
                <div class="cart-details">
                    <h4>${item.name}</h4>
                    <p>${item.price} TL x ${item.quantity}</p>
                </div>
                <button class="btn-remove" onclick="removeFromCart(${index})">Kaldır</button>
            </div>
        `;
    });

    if (totalPriceElement) totalPriceElement.innerText = `Toplam: ${total} TL`;
}

// Ürün silme fonksiyonu 
window.removeFromCart = function(index) {
    let cartData = JSON.parse(localStorage.getItem('urbanJungleCart')) || [];
    cartData.splice(index, 1);
    localStorage.setItem('urbanJungleCart', JSON.stringify(cartData));
    displayCart();      // Listeyi yenile
    updateCartBadge();  // Navbar'daki sayıyı yenile
};

// Sayfa yüklendiğinde sepeti göster
document.addEventListener('DOMContentLoaded', displayCart);
// Sepet verisini tutacak dizi (Tarayıcı hafızasından al, yoksa boş başlat)
let cart = JSON.parse(localStorage.getItem('urbanJungleCart')) || [];

const addButtons = document.querySelectorAll('.btn-add-cart');

addButtons.forEach(button => {
    button.addEventListener('click', () => {
        const name = button.getAttribute('data-name');
        const price = parseFloat(button.getAttribute('data-price'));
        const img = button.getAttribute('data-img');

        const product = { name, price, img, quantity: 1 };
        const existingProduct = cart.find(item => item.name === name);

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push(product);
        }

        localStorage.setItem('urbanJungleCart', JSON.stringify(cart));

        
        updateCartBadge(); 
        
        showToast(`${name} başarıyla sepete eklendi!`);
    });
});
// Navbar'daki sepet sayısını güncelleyen fonksiyon
function updateCartBadge() {
    const cartData = JSON.parse(localStorage.getItem('urbanJungleCart')) || [];
    const badge = document.getElementById('cart-badge');
    
    if (badge) {
        // Sepetteki toplam ürün miktarını (adet bazlı) hesapla
        const totalItems = cartData.reduce((total, item) => total + item.quantity, 0);
        badge.innerText = totalItems;
        
        // Sepet boşsa sayacı gizle, doluysa göster (İsteğe bağlı)
        badge.style.display = totalItems > 0 ? 'inline-block' : 'none';
    }
}


// Sayfa her yüklendiğinde hafızadaki ürün miktarını kontrol et
function initCartBadge() {
    const cartData = JSON.parse(localStorage.getItem('urbanJungleCart')) || [];
    const badge = document.getElementById('cart-badge');
    
    if (badge) {
        const totalItems = cartData.reduce((total, item) => total + item.quantity, 0);
        badge.innerText = totalItems;
        badge.style.display = totalItems > 0 ? 'inline-block' : 'none';
    }
}

// Sayfa yüklenmesi bittiğinde fonksiyonu çalıştır
document.addEventListener('DOMContentLoaded', initCartBadge);
function showToast(message) {
    // Varsa eski toast'ı temizle (üst üste binmesinler)
    const oldToast = document.querySelector('.toast-notification');
    if (oldToast) oldToast.remove();

    // Yeni toast oluştur
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `<span>🌿</span> ${message}`;

    document.body.appendChild(toast);

    // 3 saniye sonra ekrandan kaldır
    setTimeout(() => {
        toast.remove();
    }, 3000);
}