// pharma.Co Client App Logic
let currentUser = null;
let currentView = 'dashboard';
let salesChart = null;
let audioEnabled = true;

// Cart State for POS
let cart = [];
let allMedicines = [];
let allCustomers = [];
let currentDiscount = 0;
let currentCoupon = '';

// Web Audio API Synthesizer (Zero external dependencies)
let audioCtx = null;
function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

function playSound(type) {
    if (!audioEnabled) return;
    try {
        const ctx = getAudioContext();
        if (type === 'pop') {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(440, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.15, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.1);
        } else if (type === 'kaching') {
            const now = ctx.currentTime;
            [987, 1318].forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, now + i * 0.08);
                gain.gain.setValueAtTime(0.2, now + i * 0.08);
                gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + 0.25);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now + i * 0.08);
                osc.stop(now + i * 0.08 + 0.25);
            });
        } else if (type === 'chime') {
            const now = ctx.currentTime;
            [523, 659, 784, 1046].forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now + i * 0.06);
                gain.gain.setValueAtTime(0.15, now + i * 0.06);
                gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.06 + 0.3);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now + i * 0.06);
                osc.stop(now + i * 0.06 + 0.3);
            });
        }
    } catch (e) {
        // Audio fallback
    }
}

function toggleAudio() {
    audioEnabled = !audioEnabled;
    const icon = document.getElementById('sound-icon');
    const label = document.getElementById('sound-label');
    if (audioEnabled) {
        icon.setAttribute('data-lucide', 'volume-2');
        label.textContent = 'Audio ON';
    } else {
        icon.setAttribute('data-lucide', 'volume-x');
        label.textContent = 'Audio Muted';
    }
    if (window.lucide) lucide.createIcons();
}

function toggleDarkMode() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('pharmaco_theme', isDark ? 'dark' : 'light');
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) {
        themeIcon.setAttribute('data-lucide', isDark ? 'sun' : 'moon');
        if (window.lucide) lucide.createIcons();
    }
    if (currentView === 'dashboard') {
        loadDashboard();
    }
}

// App Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Theme load
    if (localStorage.getItem('pharmaco_theme') === 'dark') {
        document.documentElement.classList.add('dark');
        const themeIcon = document.getElementById('theme-icon');
        if (themeIcon) themeIcon.setAttribute('data-lucide', 'sun');
    }

    // Session check
    const saved = localStorage.getItem('pharmaco_user');
    if (saved) {
        try {
            currentUser = JSON.parse(saved);
            showAppLayout();
        } catch (e) {
            showLoginScreen();
        }
    } else {
        showLoginScreen();
    }

    // Live clock
    updateClock();
    setInterval(updateClock, 1000);

    // Form listeners
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('forgot-form').addEventListener('submit', handleForgotPassword);
});

function updateClock() {
    const el = document.getElementById('live-datetime');
    if (el) {
        const now = new Date();
        el.textContent = now.toLocaleDateString('en-US', {
            weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        });
    }
}

// ----------------- AUTHENTICATION -----------------
function showLoginScreen() {
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('app-layout').classList.add('hidden');
}

function showAppLayout() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('app-layout').classList.remove('hidden');

    document.getElementById('current-username').textContent = currentUser.username;
    document.getElementById('current-role').textContent = currentUser.role === 'admin' ? 'Administrator' : 'Apothecary Staff';
    document.getElementById('user-avatar').textContent = (currentUser.username || 'P')[0].toUpperCase();

    // Admin only views
    const navUsers = document.getElementById('nav-users');
    if (currentUser.role !== 'admin') {
        navUsers.classList.add('hidden');
    } else {
        navUsers.classList.remove('hidden');
    }

    navigate('dashboard');
    playSound('chime');
}

async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value.trim();
    const errBox = document.getElementById('login-error');
    const errText = document.getElementById('login-error-text');
    errBox.classList.add('hidden');

    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();

        if (res.ok && data.success) {
            currentUser = data.user;
            localStorage.setItem('pharmaco_user', JSON.stringify(currentUser));
            showAppLayout();
        } else {
            errText.textContent = data.error || 'Authentication denied';
            errBox.classList.remove('hidden');
        }
    } catch (e) {
        errText.textContent = 'Server connection error';
        errBox.classList.remove('hidden');
    }
}

function handleLogout() {
    if (confirm('Sign out of pharma.Co terminal?')) {
        localStorage.removeItem('pharmaco_user');
        currentUser = null;
        showLoginScreen();
    }
}

function openForgotPassword() {
    document.getElementById('forgot-modal').classList.remove('hidden');
}

function closeForgotPassword() {
    document.getElementById('forgot-modal').classList.add('hidden');
}

async function handleForgotPassword(e) {
    e.preventDefault();
    const email = document.getElementById('forgot-email').value.trim();
    const newPassword = document.getElementById('forgot-new-pwd').value.trim();

    try {
        const res = await fetch('/api/auth/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, newPassword })
        });
        const data = await res.json();
        if (res.ok && data.success) {
            alert('Passkey updated successfully! Log in with new credentials.');
            closeForgotPassword();
        } else {
            alert(data.error || 'Could not reset passkey');
        }
    } catch (e) {
        alert('Server error');
    }
}

// ----------------- NAVIGATION -----------------
function navigate(viewName) {
    currentView = viewName;

    // Reset styles
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.remove('bg-gradient-to-r', 'from-emerald-600', 'to-teal-600', 'text-white', 'shadow-md');
        btn.classList.add('text-slate-400');
    });

    const activeBtn = document.getElementById(`nav-${viewName}`);
    if (activeBtn) {
        activeBtn.classList.add('bg-gradient-to-r', 'from-emerald-600', 'to-teal-600', 'text-white', 'shadow-md');
        activeBtn.classList.remove('text-slate-400');
    }

    // Hide all
    document.querySelectorAll('#view-container > section').forEach(sec => sec.classList.add('hidden'));

    // Show target
    const target = document.getElementById(`view-${viewName}`);
    if (target) target.classList.remove('hidden');

    const titles = {
        dashboard: 'Dashboard Overview',
        order: 'Express POS & Billing Terminal',
        medicines: 'Pill Inventory & Formulations',
        customers: 'Loyal Customer Directory',
        suppliers: 'Allied Supply Partners',
        supply: 'Inflow Restock Management',
        ai: 'Dr. PillBot AI Clinical Lab',
        users: 'Staff Account Management'
    };
    document.getElementById('page-title').textContent = titles[viewName] || 'pharma.Co';

    // Route loaders
    switch (viewName) {
        case 'dashboard': loadDashboard(); break;
        case 'order': initPosView(); break;
        case 'medicines': loadMedicines(); break;
        case 'customers': loadCustomers(); break;
        case 'suppliers': loadSuppliers(); break;
        case 'supply': loadSupplies(); break;
        case 'users': loadUsers(); break;
    }

    if (window.lucide) lucide.createIcons();
}

// ----------------- 1. DASHBOARD -----------------
async function loadDashboard() {
    try {
        const res = await fetch('/api/dashboard');
        const data = await res.json();

        document.getElementById('dash-total-meds').textContent = data.totalMedicines;
        document.getElementById('dash-active-customers').textContent = data.activeCustomers;
        document.getElementById('dash-today-income').textContent = `Rs. ${Number(data.todayIncome).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
        document.getElementById('dash-total-revenue').textContent = `Rs. ${Number(data.totalRevenue).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
        document.getElementById('dash-orders-count').textContent = `${data.totalOrders} total orders placed`;
        document.getElementById('dash-fun-fact').textContent = data.funFactOfDay || 'Hydration keeps you healthy!';

        // Expiring
        const expTbody = document.getElementById('dash-expiring-tbody');
        if (data.expiringSoon && data.expiringSoon.length > 0) {
            expTbody.innerHTML = data.expiringSoon.map(m => `
                <tr class="hover:bg-rose-100/50 dark:hover:bg-rose-950/40">
                    <td class="py-2 font-bold text-slate-800 dark:text-slate-200">${m.medName} <span class="text-[10px] text-slate-400">(${m.brand})</span></td>
                    <td class="py-2 text-rose-600 font-black">${m.qtyInStock}</td>
                    <td class="py-2 text-rose-500 font-semibold">${m.expDate}</td>
                </tr>
            `).join('');
        } else {
            expTbody.innerHTML = `<tr><td colspan="3" class="py-4 text-center text-slate-400">All medicines healthy and fresh ✨</td></tr>`;
        }

        // Low stock
        const lowTbody = document.getElementById('dash-lowstock-tbody');
        if (data.lowStock && data.lowStock.length > 0) {
            lowTbody.innerHTML = data.lowStock.map(m => `
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td class="p-3 font-mono font-bold text-emerald-600">#MED-${m.id}</td>
                    <td class="p-3 font-bold text-slate-900 dark:text-white">${m.medName}</td>
                    <td class="p-3 text-slate-500">${m.brand}</td>
                    <td class="p-3"><span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">${m.category}</span></td>
                    <td class="p-3"><span class="px-2.5 py-0.5 rounded-full text-xs font-black ${m.qtyInStock < 15 ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'}">${m.qtyInStock} Units</span></td>
                    <td class="p-3 font-bold text-slate-800 dark:text-slate-200">Rs. ${Number(m.unitPrice).toFixed(2)}</td>
                    <td class="p-3">
                        <button onclick="navigate('supply')" class="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-bold">Restock</button>
                    </td>
                </tr>
            `).join('');
        } else {
            lowTbody.innerHTML = `<tr><td colspan="7" class="p-4 text-center text-slate-400">Stock levels are well stocked!</td></tr>`;
        }

        renderSalesChart(data.salesTrends);

    } catch (e) {
        console.error(e);
    }
}

function renderSalesChart(trends) {
    const canvas = document.getElementById('pharmaSalesChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (salesChart) salesChart.destroy();

    const labels = (trends && trends.length) ? trends.map(t => t.date) : ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'];
    const values = (trends && trends.length) ? trends.map(t => t.total) : [250, 450, 800, 1200, 1500];

    const isDark = document.documentElement.classList.contains('dark');
    const gradient = ctx.createLinearGradient(0, 0, 0, 250);
    gradient.addColorStop(0, 'rgba(16, 185, 129, 0.45)');
    gradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)');

    salesChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Revenue (Rs)',
                data: values,
                borderColor: '#10b981',
                borderWidth: 3,
                backgroundColor: gradient,
                fill: true,
                tension: 0.38,
                pointBackgroundColor: '#047857',
                pointRadius: 4,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (ctx) => ` Rs. ${Number(ctx.raw).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: isDark ? '#94a3b8' : '#64748b', font: { size: 11 } }
                },
                y: {
                    grid: { color: isDark ? '#1e293b' : '#f1f5f9' },
                    ticks: {
                        color: isDark ? '#94a3b8' : '#64748b',
                        font: { size: 11 },
                        callback: val => 'Rs. ' + val
                    }
                }
            }
        }
    });
}

// ----------------- 2. EXPRESS POS BILLING -----------------
async function initPosView() {
    try {
        const [custRes, medRes] = await Promise.all([
            fetch('/api/customers'),
            fetch('/api/medicines')
        ]);
        allCustomers = await custRes.json();
        allMedicines = await medRes.json();

        // Customer Select
        const custSelect = document.getElementById('pos-customer');
        custSelect.innerHTML = `<option value="">-- Walk-in Retail Customer --</option>` +
            allCustomers.map(c => `<option value="${c.id}">${c.name} (${c.contact})</option>`).join('');

        // Medicine Select
        const medSelect = document.getElementById('pos-medicine');
        medSelect.innerHTML = `<option value="">-- Choose Formulation / Pill --</option>` +
            allMedicines.map(m => `<option value="${m.id}">${m.medName} (${m.brand}) - Rs.${Number(m.unitPrice).toFixed(2)} [${m.funTag || ''}]</option>`).join('');

        onPosCustomerChange();
        onPosMedicineChange();
        renderCart();
    } catch (e) {
        console.error(e);
    }
}

function onPosCustomerChange() {
    const custId = document.getElementById('pos-customer').value;
    const cust = allCustomers.find(c => c.id == custId);
    const badge = document.getElementById('pos-loyalty-badge');

    if (cust) {
        document.getElementById('pos-customer-details').value = `${cust.contact} • ${cust.address || 'Colombo'}`;
        badge.textContent = cust.loyaltyTier || 'Silver';
        if (cust.loyaltyTier === 'Gold VIP') {
            badge.className = 'px-2.5 py-1 text-[11px] font-bold rounded-lg bg-amber-500 text-white whitespace-nowrap shadow-sm';
        } else {
            badge.className = 'px-2.5 py-1 text-[11px] font-bold rounded-lg bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300 whitespace-nowrap';
        }
    } else {
        document.getElementById('pos-customer-details').value = 'Walk-in Retail Customer';
        badge.textContent = 'Bronze';
        badge.className = 'px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 whitespace-nowrap';
    }
}

function onPosMedicineChange() {
    const medId = document.getElementById('pos-medicine').value;
    const med = allMedicines.find(m => m.id == medId);
    if (med) {
        document.getElementById('pos-qty-on-hand').value = `${med.qtyInStock} Units`;
        document.getElementById('pos-unit-price').value = `Rs. ${Number(med.unitPrice).toFixed(2)}`;
        document.getElementById('pos-qty').max = med.qtyInStock;
        document.getElementById('pos-qty').value = 1;
    } else {
        document.getElementById('pos-qty-on-hand').value = '0';
        document.getElementById('pos-unit-price').value = 'Rs. 0.00';
    }
}

function addToCart() {
    const medId = document.getElementById('pos-medicine').value;
    if (!medId) return alert('Please select a medicine first');

    const med = allMedicines.find(m => m.id == medId);
    if (!med) return;

    const qty = parseInt(document.getElementById('pos-qty').value, 10);
    if (!qty || qty <= 0) return alert('Enter a valid quantity');

    if (qty > med.qtyInStock) {
        return alert(`Cannot add more than available stock (${med.qtyInStock})`);
    }

    const existingIdx = cart.findIndex(i => i.medicineId == med.id);
    if (existingIdx > -1) {
        const newQty = cart[existingIdx].qty + qty;
        if (newQty > med.qtyInStock) {
            return alert(`Cart quantity would exceed shelf stock (${med.qtyInStock})`);
        }
        cart[existingIdx].qty = newQty;
        cart[existingIdx].lineTotal = newQty * med.unitPrice;
    } else {
        cart.push({
            medicineId: med.id,
            medName: med.medName,
            brand: med.brand,
            unitPrice: med.unitPrice,
            qty: qty,
            lineTotal: qty * med.unitPrice
        });
    }

    playSound('pop');
    renderCart();
}

function removeFromCart(idx) {
    cart.splice(idx, 1);
    renderCart();
}

function clearCart() {
    cart = [];
    currentDiscount = 0;
    currentCoupon = '';
    document.getElementById('pos-coupon').value = '';
    renderCart();
}

function setPromo(code) {
    document.getElementById('pos-coupon').value = code;
    applyPromoCode();
}

function applyPromoCode() {
    const code = document.getElementById('pos-coupon').value.trim().toUpperCase();
    currentCoupon = code;
    renderCart();
    playSound('chime');
}

function renderCart() {
    const tbody = document.getElementById('pos-cart-tbody');
    let subtotal = 0;

    if (cart.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="p-8 text-center text-slate-400">Cart is empty. Select a medicine above.</td></tr>`;
        document.getElementById('pos-net-total').textContent = 'Rs. 0.00';
        document.getElementById('pos-balance').textContent = 'Rs. 0.00';
        document.getElementById('pos-discount-note').textContent = 'No discount applied';
        return;
    }

    tbody.innerHTML = cart.map((item, idx) => {
        subtotal += item.lineTotal;
        return `
            <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td class="p-2.5 font-mono text-emerald-600 font-bold">#MED-${item.medicineId}</td>
                <td class="p-2.5 font-bold text-slate-800 dark:text-slate-200">${item.medName} <span class="text-[10px] text-slate-400">(${item.brand})</span></td>
                <td class="p-2.5 font-black text-emerald-600">${item.qty}</td>
                <td class="p-2.5 text-slate-600 dark:text-slate-300">Rs. ${Number(item.unitPrice).toFixed(2)}</td>
                <td class="p-2.5 font-black text-slate-900 dark:text-white">Rs. ${Number(item.lineTotal).toFixed(2)}</td>
                <td class="p-2.5 text-center">
                    <button onclick="removeFromCart(${idx})" class="text-rose-500 hover:text-rose-700 p-1">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');

    // Calculate discount
    let discount = 0;
    let note = 'No discount applied';
    if (currentCoupon === 'MAGICPILL') {
        discount = subtotal * 0.15;
        note = 'MAGICPILL: 15% Magic Discount Applied! 🎉';
    } else if (currentCoupon === 'STUDENTREVIVE') {
        discount = subtotal * 0.10;
        note = 'STUDENTREVIVE: 10% Cramming Relief Applied! 📚';
    } else if (currentCoupon === 'HAPPYPILL') {
        discount = Math.min(100.0, subtotal);
        note = 'HAPPYPILL: Flat Rs. 100 Happiness Credit! 🌟';
    } else if (currentCoupon === 'IMMUNITYBOOST') {
        discount = subtotal * 0.20;
        note = 'IMMUNITYBOOST: 20% Immune Supercharger Applied! 🛡️';
    }

    currentDiscount = discount;
    const finalTotal = Math.max(0, subtotal - discount);

    document.getElementById('pos-net-total').textContent = `Rs. ${finalTotal.toFixed(2)}`;
    document.getElementById('pos-discount-note').textContent = note;
    calculatePosBalance();

    if (window.lucide) lucide.createIcons();
}

function calculatePosBalance() {
    let subtotal = 0;
    cart.forEach(i => subtotal += i.lineTotal);
    const finalTotal = Math.max(0, subtotal - currentDiscount);

    const cashInput = parseFloat(document.getElementById('pos-cash-received').value);
    if (!isNaN(cashInput) && cashInput >= finalTotal) {
        document.getElementById('pos-balance').textContent = `Rs. ${(cashInput - finalTotal).toFixed(2)}`;
        document.getElementById('pos-balance').className = 'text-base font-black text-emerald-600';
    } else if (!isNaN(cashInput) && cashInput < finalTotal) {
        document.getElementById('pos-balance').textContent = `Short: Rs. ${(finalTotal - cashInput).toFixed(2)}`;
        document.getElementById('pos-balance').className = 'text-xs font-bold text-rose-500';
    } else {
        document.getElementById('pos-balance').textContent = 'Rs. 0.00';
        document.getElementById('pos-balance').className = 'text-base font-black text-emerald-600';
    }
}

async function placeOrder() {
    if (cart.length === 0) return alert('Pill Cart is empty! Add medicines first.');

    let subtotal = 0;
    cart.forEach(i => subtotal += i.lineTotal);
    const finalTotal = Math.max(0, subtotal - currentDiscount);

    const cashInput = parseFloat(document.getElementById('pos-cash-received').value);
    if (isNaN(cashInput) || cashInput < finalTotal) {
        if (!confirm(`Tendered amount is below Total Rs. ${finalTotal.toFixed(2)}. Proceed as exact payment?`)) {
            return;
        }
    }

    const payload = {
        customerId: document.getElementById('pos-customer').value || null,
        userId: currentUser ? currentUser.id : 1,
        paymentMethod: document.getElementById('pos-payment-method').value,
        cashReceived: !isNaN(cashInput) ? cashInput : finalTotal,
        couponCode: currentCoupon,
        items: cart.map(i => ({ medicineId: i.medicineId, qty: i.qty }))
    };

    try {
        const res = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const order = await res.json();

        if (res.ok && order.id) {
            // Sound & Confetti celebration
            playSound('kaching');
            if (window.confetti) {
                confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
            }

            // Clear Cart
            clearCart();
            document.getElementById('pos-cash-received').value = '';

            // Open Receipt Modal
            openReceiptModal(order);
        } else {
            alert(order.message || 'Order could not be fulfilled');
        }
    } catch (e) {
        alert('Server communication error');
    }
}

// ----------------- RECEIPT MODAL -----------------
function openReceiptModal(order) {
    document.getElementById('rec-order-id').textContent = order.id;
    document.getElementById('rec-date').textContent = `${order.orderDate} ${order.orderTime || ''}`;
    document.getElementById('rec-customer').textContent = order.customer ? order.customer.name : 'Walk-in Retail';
    document.getElementById('rec-cashier').textContent = order.user ? order.user.username : 'admin';

    const tbody = document.getElementById('rec-items-tbody');
    tbody.innerHTML = (order.items || []).map(item => `
        <tr>
            <td class="py-1 font-semibold">${item.medicine ? item.medicine.medName : 'Medicine'}</td>
            <td class="py-1 text-center font-bold">${item.qty}</td>
            <td class="py-1 text-right">${Number(item.unitPrice).toFixed(2)}</td>
            <td class="py-1 text-right font-black">${Number(item.lineTotal).toFixed(2)}</td>
        </tr>
    `).join('');

    document.getElementById('rec-subtotal').textContent = `Rs. ${Number(order.subTotal).toFixed(2)}`;
    document.getElementById('rec-discount').textContent = `-Rs. ${Number(order.discount).toFixed(2)}`;
    document.getElementById('rec-total').textContent = `Rs. ${Number(order.total).toFixed(2)}`;

    if (order.payment) {
        document.getElementById('rec-method').textContent = order.payment.paymentMethod || 'Cash';
        document.getElementById('rec-paid').textContent = `Rs. ${Number(order.payment.cashReceived || order.total).toFixed(2)}`;
        document.getElementById('rec-balance').textContent = `Rs. ${Number(order.payment.balanceChange || 0).toFixed(2)}`;
    }

    document.getElementById('rec-fun-tip').textContent = order.funHealthTip || 'Drink water and smile!';

    document.getElementById('receipt-modal').classList.remove('hidden');
    if (window.lucide) lucide.createIcons();
}

function closeReceiptModal() {
    document.getElementById('receipt-modal').classList.add('hidden');
}

// ----------------- 3. MEDICINES CATALOG -----------------
async function loadMedicines(search = '') {
    try {
        const url = search ? `/api/medicines?search=${encodeURIComponent(search)}` : '/api/medicines';
        const res = await fetch(url);
        const list = await res.json();
        allMedicines = list;

        const tbody = document.getElementById('medicines-tbody');
        if (list.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-slate-400">No medicines found</td></tr>`;
            return;
        }

        tbody.innerHTML = list.map(m => `
            <tr onclick='selectMedicineRow(${JSON.stringify(m).replace(/'/g, "&#39;")})' class="hover:bg-emerald-50/50 dark:hover:bg-slate-800/40 transition">
                <td class="p-3 font-mono font-bold text-emerald-600">#MED-${m.id}</td>
                <td class="p-3">
                    <p class="font-bold text-slate-900 dark:text-white">${m.medName}</p>
                    <span class="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">${m.funTag || ''}</span>
                </td>
                <td class="p-3 text-slate-500">${m.brand}</td>
                <td class="p-3"><span class="px-2.5 py-0.5 rounded-full text-xs font-black ${m.qtyInStock < 30 ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'}">${m.qtyInStock}</span></td>
                <td class="p-3 font-bold text-slate-900 dark:text-white">Rs. ${Number(m.unitPrice).toFixed(2)}</td>
                <td class="p-3 text-slate-500">${m.expDate}</td>
            </tr>
        `).join('');
    } catch (e) {
        console.error(e);
    }
}

function selectMedicineRow(m) {
    document.getElementById('med-id').value = m.id;
    document.getElementById('med-name').value = m.medName;
    document.getElementById('med-brand').value = m.brand;
    document.getElementById('med-qty').value = m.qtyInStock;
    document.getElementById('med-price').value = m.unitPrice;
    document.getElementById('med-exp').value = m.expDate;
    document.getElementById('med-category').value = m.category || 'General Healthcare';
    document.getElementById('med-tag').value = m.funTag || '';
}

function clearMedicineForm() {
    document.getElementById('medicine-form').reset();
    document.getElementById('med-id').value = '';
}

async function saveMedicine() {
    const medName = document.getElementById('med-name').value.trim();
    const brand = document.getElementById('med-brand').value.trim();
    const qtyInStock = document.getElementById('med-qty').value;
    const unitPrice = document.getElementById('med-price').value;
    const expDate = document.getElementById('med-exp').value;
    const category = document.getElementById('med-category').value;
    const funTag = document.getElementById('med-tag').value;

    if (!medName || !brand || !qtyInStock || !unitPrice || !expDate) return alert('All fields required');

    try {
        const res = await fetch('/api/medicines', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ medName, brand, qtyInStock: parseInt(qtyInStock), unitPrice: parseFloat(unitPrice), expDate, category, funTag })
        });
        if (res.ok) {
            clearMedicineForm();
            loadMedicines();
            playSound('chime');
            alert('New formulation saved to pharma.Co catalog!');
        }
    } catch (e) {
        alert('Server error');
    }
}

async function updateMedicine() {
    const id = document.getElementById('med-id').value;
    if (!id) return alert('Select medicine from table to update');

    const medName = document.getElementById('med-name').value.trim();
    const brand = document.getElementById('med-brand').value.trim();
    const qtyInStock = document.getElementById('med-qty').value;
    const unitPrice = document.getElementById('med-price').value;
    const expDate = document.getElementById('med-exp').value;
    const category = document.getElementById('med-category').value;
    const funTag = document.getElementById('med-tag').value;

    try {
        const res = await fetch(`/api/medicines/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ medName, brand, qtyInStock: parseInt(qtyInStock), unitPrice: parseFloat(unitPrice), expDate, category, funTag })
        });
        if (res.ok) {
            clearMedicineForm();
            loadMedicines();
            alert('Pill record updated!');
        }
    } catch (e) {
        alert('Server error');
    }
}

async function deleteMedicine() {
    const id = document.getElementById('med-id').value;
    if (!id) return alert('Select medicine from table to delete');
    if (!confirm('Retire this pill from catalog?')) return;

    try {
        await fetch(`/api/medicines/${id}`, { method: 'DELETE' });
        clearMedicineForm();
        loadMedicines();
        alert('Pill archived!');
    } catch (e) {
        alert('Server error');
    }
}

// ----------------- 4. CUSTOMERS -----------------
async function loadCustomers(search = '') {
    try {
        const url = search ? `/api/customers?search=${encodeURIComponent(search)}` : '/api/customers';
        const res = await fetch(url);
        const list = await res.json();
        allCustomers = list;

        const tbody = document.getElementById('customers-tbody');
        if (list.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" class="p-6 text-center text-slate-400">No customers found</td></tr>`;
            return;
        }

        tbody.innerHTML = list.map(c => `
            <tr onclick='selectCustomerRow(${JSON.stringify(c).replace(/'/g, "&#39;")})' class="hover:bg-emerald-50/50 dark:hover:bg-slate-800/40 transition">
                <td class="p-3 font-mono font-bold text-emerald-600">#CUST-${c.id}</td>
                <td class="p-3 font-bold text-slate-900 dark:text-white">${c.name}</td>
                <td class="p-3 text-slate-600 dark:text-slate-300">${c.contact}</td>
                <td class="p-3"><span class="px-2 py-0.5 rounded-md text-[10px] font-bold ${c.loyaltyTier === 'Gold VIP' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' : 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300'}">${c.loyaltyTier || 'Bronze'}</span></td>
                <td class="p-3 text-slate-500">${c.address || '-'}</td>
            </tr>
        `).join('');
    } catch (e) {
        console.error(e);
    }
}

function selectCustomerRow(c) {
    document.getElementById('cust-id').value = c.id;
    document.getElementById('cust-name').value = c.name;
    document.getElementById('cust-contact').value = c.contact;
    document.getElementById('cust-address').value = c.address || '';
    document.getElementById('cust-tier').value = c.loyaltyTier || 'Bronze';
}

function clearCustomerForm() {
    document.getElementById('customer-form').reset();
    document.getElementById('cust-id').value = '';
}

async function saveCustomer() {
    const name = document.getElementById('cust-name').value.trim();
    const contact = document.getElementById('cust-contact').value.trim();
    const address = document.getElementById('cust-address').value.trim();
    const loyaltyTier = document.getElementById('cust-tier').value;

    if (!name || !contact) return alert('Name and contact are required');

    try {
        const res = await fetch('/api/customers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, contact, address, loyaltyTier })
        });
        if (res.ok) {
            clearCustomerForm();
            loadCustomers();
            playSound('chime');
            alert('Loyal customer enrolled!');
        }
    } catch (e) {
        alert('Server error');
    }
}

async function updateCustomer() {
    const id = document.getElementById('cust-id').value;
    if (!id) return alert('Select customer from table');

    const name = document.getElementById('cust-name').value.trim();
    const contact = document.getElementById('cust-contact').value.trim();
    const address = document.getElementById('cust-address').value.trim();
    const loyaltyTier = document.getElementById('cust-tier').value;

    try {
        const res = await fetch(`/api/customers/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, contact, address, loyaltyTier })
        });
        if (res.ok) {
            clearCustomerForm();
            loadCustomers();
            alert('Customer updated!');
        }
    } catch (e) {
        alert('Server error');
    }
}

async function deleteCustomer() {
    const id = document.getElementById('cust-id').value;
    if (!id) return alert('Select customer to delete');
    if (!confirm('Remove customer profile?')) return;

    try {
        await fetch(`/api/customers/${id}`, { method: 'DELETE' });
        clearCustomerForm();
        loadCustomers();
        alert('Customer removed!');
    } catch (e) {
        alert('Server error');
    }
}

// ----------------- 5. SUPPLIERS -----------------
async function loadSuppliers(search = '') {
    try {
        const url = search ? `/api/suppliers?search=${encodeURIComponent(search)}` : '/api/suppliers';
        const res = await fetch(url);
        const list = await res.json();

        const tbody = document.getElementById('suppliers-tbody');
        if (list.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" class="p-6 text-center text-slate-400">No suppliers found</td></tr>`;
            return;
        }

        tbody.innerHTML = list.map(s => `
            <tr onclick='selectSupplierRow(${JSON.stringify(s).replace(/'/g, "&#39;")})' class="hover:bg-emerald-50/50 dark:hover:bg-slate-800/40 transition">
                <td class="p-3 font-mono font-bold text-emerald-600">#SUPP-${s.id}</td>
                <td class="p-3 font-bold text-slate-900 dark:text-white">${s.supplierName}</td>
                <td class="p-3 text-slate-600 dark:text-slate-300">${s.email || '-'}</td>
                <td class="p-3 text-slate-600 dark:text-slate-300">${s.contactNum}</td>
                <td class="p-3 font-bold text-amber-500">${s.reliabilityRating || '5.0 ★'}</td>
            </tr>
        `).join('');
    } catch (e) {
        console.error(e);
    }
}

function selectSupplierRow(s) {
    document.getElementById('supp-id').value = s.id;
    document.getElementById('supp-name').value = s.supplierName;
    document.getElementById('supp-email').value = s.email || '';
    document.getElementById('supp-contact').value = s.contactNum;
    document.getElementById('supp-rating').value = s.reliabilityRating || '5.0 ★';
}

function clearSupplierForm() {
    document.getElementById('supplier-form').reset();
    document.getElementById('supp-id').value = '';
}

async function saveSupplier() {
    const supplierName = document.getElementById('supp-name').value.trim();
    const email = document.getElementById('supp-email').value.trim();
    const contactNum = document.getElementById('supp-contact').value.trim();
    const reliabilityRating = document.getElementById('supp-rating').value.trim();

    if (!supplierName || !contactNum) return alert('Name and contact are required');

    try {
        const res = await fetch('/api/suppliers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ supplierName, email, contactNum, reliabilityRating })
        });
        if (res.ok) {
            clearSupplierForm();
            loadSuppliers();
            playSound('chime');
            alert('Partner registered!');
        }
    } catch (e) {
        alert('Server error');
    }
}

async function updateSupplier() {
    const id = document.getElementById('supp-id').value;
    if (!id) return alert('Select partner to update');

    const supplierName = document.getElementById('supp-name').value.trim();
    const email = document.getElementById('supp-email').value.trim();
    const contactNum = document.getElementById('supp-contact').value.trim();
    const reliabilityRating = document.getElementById('supp-rating').value.trim();

    try {
        const res = await fetch(`/api/suppliers/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ supplierName, email, contactNum, reliabilityRating })
        });
        if (res.ok) {
            clearSupplierForm();
            loadSuppliers();
            alert('Partner updated!');
        }
    } catch (e) {
        alert('Server error');
    }
}

async function deleteSupplier() {
    const id = document.getElementById('supp-id').value;
    if (!id) return alert('Select partner to delete');
    if (!confirm('Remove partner alliance?')) return;

    try {
        await fetch(`/api/suppliers/${id}`, { method: 'DELETE' });
        clearSupplierForm();
        loadSuppliers();
        alert('Partner removed!');
    } catch (e) {
        alert('Server error');
    }
}

// ----------------- 6. SUPPLY INFLOW REFILL -----------------
async function loadSupplies() {
    try {
        const [suppRes, medRes, historyRes] = await Promise.all([
            fetch('/api/suppliers'),
            fetch('/api/medicines'),
            fetch('/api/supplies')
        ]);
        const suppliers = await suppRes.json();
        const medicines = await medRes.json();
        const supplies = await historyRes.json();

        const suppSelect = document.getElementById('supply-supplier-id');
        suppSelect.innerHTML = suppliers.map(s => `<option value="${s.id}">${s.supplierName}</option>`).join('');

        const medSelect = document.getElementById('supply-med-id');
        medSelect.innerHTML = medicines.map(m => `<option value="${m.id}">${m.medName} (${m.brand})</option>`).join('');

        document.getElementById('supply-date').value = new Date().toISOString().slice(0, 10);

        const tbody = document.getElementById('supplies-tbody');
        if (supplies.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" class="p-6 text-center text-slate-400">No inflow records logged</td></tr>`;
            return;
        }

        tbody.innerHTML = supplies.map(s => `
            <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td class="p-3 font-mono font-bold text-emerald-600">#REFILL-${s.id}</td>
                <td class="p-3 font-bold text-slate-900 dark:text-white">${s.supplier ? s.supplier.supplierName : 'Partner'}</td>
                <td class="p-3 font-medium text-slate-700 dark:text-slate-300">${s.medicine ? s.medicine.medName : 'Pill'}</td>
                <td class="p-3 text-slate-500">${s.date}</td>
                <td class="p-3 font-black text-emerald-600">+${s.qty}</td>
                <td class="p-3 text-slate-600 dark:text-slate-300">Rs. ${Number(s.unitCost).toFixed(2)}</td>
                <td class="p-3 font-black text-slate-900 dark:text-white">Rs. ${Number(s.totalCost).toFixed(2)}</td>
                <td class="p-3 text-center">
                    <button onclick="deleteSupplyRecord(${s.id})" class="text-rose-500 hover:text-rose-700 p-1">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        if (window.lucide) lucide.createIcons();
    } catch (e) {
        console.error(e);
    }
}

function calculateSupplyTotal() {
    const qty = parseFloat(document.getElementById('supply-qty').value) || 0;
    const cost = parseFloat(document.getElementById('supply-unit-cost').value) || 0;
    document.getElementById('supply-total-cost').value = (qty * cost).toFixed(2);
}

async function recordSupply() {
    const supplierId = document.getElementById('supply-supplier-id').value;
    const medicineId = document.getElementById('supply-med-id').value;
    const date = document.getElementById('supply-date').value;
    const qty = document.getElementById('supply-qty').value;
    const unitCost = document.getElementById('supply-unit-cost').value;

    if (!qty || !unitCost) return alert('Quantity and unit cost are required');

    try {
        const res = await fetch('/api/supplies', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                supplierId: parseInt(supplierId),
                medicineId: parseInt(medicineId),
                date,
                qty: parseInt(qty),
                unitCost: parseFloat(unitCost)
            })
        });
        if (res.ok) {
            document.getElementById('supply-qty').value = '';
            document.getElementById('supply-unit-cost').value = '';
            document.getElementById('supply-total-cost').value = '';
            loadSupplies();
            playSound('kaching');
            alert('Inflow logged and pill stock automatically replenished!');
        }
    } catch (e) {
        alert('Server error');
    }
}

async function deleteSupplyRecord(id) {
    if (!confirm('Delete this inflow record?')) return;
    try {
        await fetch(`/api/supplies/${id}`, { method: 'DELETE' });
        loadSupplies();
    } catch (e) {
        alert('Server error');
    }
}

// ----------------- 7. DR. PILLBOT AI LAB -----------------
function askBot(topic) {
    document.getElementById('ai-query-input').value = topic;
    submitAiQuery();
}

async function submitAiQuery() {
    const query = document.getElementById('ai-query-input').value.trim();
    if (!query) return;

    try {
        const res = await fetch(`/api/ai/consult?query=${encodeURIComponent(query)}`);
        const data = await res.json();

        document.getElementById('ai-emoji').textContent = data.moodEmoji || '✨';
        document.getElementById('ai-title').textContent = data.title;
        document.getElementById('ai-advice').textContent = data.advice;
        document.getElementById('ai-warning').textContent = data.warning;

        document.getElementById('ai-result-card').classList.remove('hidden');
        playSound('chime');
        if (window.lucide) lucide.createIcons();
    } catch (e) {
        alert('AI service error');
    }
}

// ----------------- 8. STAFF & USERS -----------------
async function loadUsers() {
    try {
        const res = await fetch('/api/users');
        const list = await res.json();

        const tbody = document.getElementById('users-tbody');
        tbody.innerHTML = list.map(u => `
            <tr onclick='selectUserRow(${JSON.stringify(u)})' class="hover:bg-emerald-50/50 dark:hover:bg-slate-800/40 transition">
                <td class="p-3 font-mono font-bold text-emerald-600">#UID-${u.id}</td>
                <td class="p-3 font-bold text-slate-900 dark:text-white">${u.username}</td>
                <td class="p-3 text-slate-600 dark:text-slate-300">${u.email}</td>
                <td class="p-3">
                    <span class="px-2.5 py-0.5 rounded-full text-xs font-black ${u.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'}">
                        ${u.role.toUpperCase()}
                    </span>
                </td>
            </tr>
        `).join('');
    } catch (e) {
        console.error(e);
    }
}

function selectUserRow(u) {
    document.getElementById('user-id').value = u.id;
    document.getElementById('user-name').value = u.username;
    document.getElementById('user-email').value = u.email;
    document.getElementById('user-pwd').value = '';
    document.getElementById('user-role').value = u.role;
}

function clearUserForm() {
    document.getElementById('user-form').reset();
    document.getElementById('user-id').value = '';
}

async function saveUser() {
    const username = document.getElementById('user-name').value.trim();
    const email = document.getElementById('user-email').value.trim();
    const password = document.getElementById('user-pwd').value.trim();
    const role = document.getElementById('user-role').value;

    if (!username || !email || !password) return alert('Username, email, and password required');

    try {
        const res = await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password, role })
        });
        if (res.ok) {
            clearUserForm();
            loadUsers();
            playSound('chime');
            alert('Staff credential generated!');
        }
    } catch (e) {
        alert('Server error');
    }
}

async function updateUser() {
    const id = document.getElementById('user-id').value;
    if (!id) return alert('Select staff member to update');

    const username = document.getElementById('user-name').value.trim();
    const email = document.getElementById('user-email').value.trim();
    const password = document.getElementById('user-pwd').value.trim();
    const role = document.getElementById('user-role').value;

    try {
        const res = await fetch(`/api/users/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password, role })
        });
        if (res.ok) {
            clearUserForm();
            loadUsers();
            alert('Staff record updated!');
        }
    } catch (e) {
        alert('Server error');
    }
}

async function deleteUser() {
    const id = document.getElementById('user-id').value;
    if (!id) return alert('Select user to delete');
    if (id == 1) return alert('Cannot delete default system administrator');
    if (!confirm('Revoke access for this user?')) return;

    try {
        await fetch(`/api/users/${id}`, { method: 'DELETE' });
        clearUserForm();
        loadUsers();
        alert('Staff account revoked!');
    } catch (e) {
        alert('Server error');
    }
}
