import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function OrderTerminal({ onOrderPlaced, playSound }) {
    const [customers, setCustomers] = useState([]);
    const [medicines, setMedicines] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [selectedMedicine, setSelectedMedicine] = useState('');
    const [qty, setQty] = useState(1);
    const [cart, setCart] = useState([]);
    const [coupon, setCoupon] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [cashReceived, setCashReceived] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [custData, medData] = await Promise.all([api.getCustomers(), api.getMedicines()]);
            setCustomers(custData);
            setMedicines(medData);
        } catch (e) {
            console.error(e);
        }
    };

    const currentCustomer = customers.find(c => c.id == selectedCustomer);
    const currentMed = medicines.find(m => m.id == selectedMedicine);

    const addToCart = () => {
        if (!currentMed) return alert('Select a medication first');
        if (qty <= 0) return alert('Enter valid quantity');
        if (qty > currentMed.qtyInStock) return alert('Cannot exceed shelf stock');

        const existingIdx = cart.findIndex(i => i.medicineId === currentMed.id);
        if (existingIdx > -1) {
            const newQty = cart[existingIdx].qty + qty;
            if (newQty > currentMed.qtyInStock) return alert('Cart quantity would exceed shelf stock');
            const updated = [...cart];
            updated[existingIdx].qty = newQty;
            updated[existingIdx].lineTotal = newQty * currentMed.unitPrice;
            setCart(updated);
        } else {
            setCart([...cart, {
                medicineId: currentMed.id,
                medName: currentMed.medName,
                brand: currentMed.brand,
                unitPrice: currentMed.unitPrice,
                qty,
                lineTotal: qty * currentMed.unitPrice
            }]);
        }
        playSound?.('pop');
    };

    const removeFromCart = (idx) => {
        setCart(cart.filter((_, i) => i !== idx));
    };

    const subtotal = cart.reduce((sum, item) => sum + item.lineTotal, 0);

    let discount = 0;
    let note = 'No discount applied';
    if (appliedCoupon === 'MAGICPILL') {
        discount = subtotal * 0.15;
        note = 'MAGICPILL: 15% Magic Benefit Applied';
    } else if (appliedCoupon === 'STUDENTREVIVE') {
        discount = subtotal * 0.10;
        note = 'STUDENTREVIVE: 10% Scholar Benefit Applied';
    } else if (appliedCoupon === 'HAPPYPILL') {
        discount = Math.min(100.0, subtotal);
        note = 'HAPPYPILL: Flat Rs. 100 Credit Applied';
    }

    const finalTotal = Math.max(0, subtotal - discount);
    const cashNum = parseFloat(cashReceived);
    const changeDue = !isNaN(cashNum) && cashNum >= finalTotal ? cashNum - finalTotal : 0;
    const isShort = !isNaN(cashNum) && cashNum < finalTotal;

    const handleCheckout = async () => {
        if (cart.length === 0) return alert('Cart manifest is empty');
        if (isNaN(cashNum) || cashNum < finalTotal) {
            if (!confirm(`Tender amount is below Rs. ${finalTotal.toFixed(2)}. Proceed as exact payment?`)) return;
        }

        const payload = {
            customerId: selectedCustomer || null,
            userId: 1,
            paymentMethod,
            cashReceived: !isNaN(cashNum) ? cashNum : finalTotal,
            couponCode: appliedCoupon,
            items: cart.map(i => ({ medicineId: i.medicineId, qty: i.qty }))
        };

        try {
            const order = await api.placeOrder(payload);
            if (order && order.id) {
                playSound?.('kaching');
                setCart([]);
                setCashReceived('');
                onOrderPlaced(order);
            }
        } catch (e) {
            alert('Failed to place order');
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Formulations & Cart */}
            <div className="lg:col-span-2 space-y-4">
                <div className="glass-card p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-white/[0.08]">
                        <div>
                            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Registered Client Selection</label>
                            <select
                                value={selectedCustomer}
                                onChange={(e) => setSelectedCustomer(e.target.value)}
                                className="glass-input w-full px-3 py-2 text-xs"
                            >
                                <option value="">-- Walk-in Retail Customer --</option>
                                {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.contact})</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Client Profile / Loyalty Tier</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    readOnly
                                    value={currentCustomer ? `${currentCustomer.contact} • ${currentCustomer.address || 'Colombo'}` : 'Walk-in Retail Customer'}
                                    className="glass-input w-full px-3 py-2 text-zinc-400 text-xs"
                                />
                                <span className={`glass-badge ${currentCustomer?.loyaltyTier === 'Gold VIP' ? 'glass-badge-amber' : ''} whitespace-nowrap`}>
                                    {currentCustomer?.loyaltyTier || 'Bronze'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Select Formulation / Pill</label>
                            <select
                                value={selectedMedicine}
                                onChange={(e) => setSelectedMedicine(e.target.value)}
                                className="glass-input w-full px-3 py-2 text-xs"
                            >
                                <option value="">-- Choose Formulation / Pill --</option>
                                {medicines.map(m => <option key={m.id} value={m.id}>{m.medName} ({m.brand}) - Rs.{Number(m.unitPrice).toFixed(2)}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Stock on Hand</label>
                            <input
                                type="text"
                                readOnly
                                value={currentMed ? `${currentMed.qtyInStock} Units` : '0'}
                                className="glass-input w-full px-3 py-2 font-mono text-zinc-300 text-xs"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Unit Price</label>
                            <input
                                type="text"
                                readOnly
                                value={currentMed ? `Rs. ${Number(currentMed.unitPrice).toFixed(2)}` : 'Rs. 0.00'}
                                className="glass-input w-full px-3 py-2 font-mono text-zinc-200 text-xs"
                            />
                        </div>
                    </div>

                    <div className="flex items-end gap-3 pt-1">
                        <div className="w-32">
                            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Dispense Qty</label>
                            <input
                                type="number"
                                min="1"
                                max={currentMed?.qtyInStock || 100}
                                value={qty}
                                onChange={(e) => setQty(parseInt(e.target.value) || 1)}
                                className="glass-input w-full px-3 py-2 font-mono font-semibold text-xs"
                            />
                        </div>
                        <button type="button" onClick={addToCart} className="glass-btn-primary">
                            <i data-lucide="plus" className="w-4 h-4"></i>
                            <span>Add to Cart Manifest</span>
                        </button>
                    </div>
                </div>

                {/* Cart Manifest Table */}
                <div className="glass-card p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="font-bold text-white text-sm">Dispensary Cart Manifest</h3>
                            <p className="text-xs text-zinc-400">Active medicines staged for order settlement</p>
                        </div>
                        <button onClick={() => setCart([])} className="text-xs text-zinc-400 hover:text-red-400 transition">Empty Manifest</button>
                    </div>

                    <div className="overflow-x-auto min-h-[200px]">
                        <table className="glass-table">
                            <thead>
                                <tr>
                                    <th>Identifier</th>
                                    <th>Formulation &amp; Brand</th>
                                    <th>Qty</th>
                                    <th>Unit Price</th>
                                    <th>Line Total</th>
                                    <th className="text-center">Remove</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.length === 0 ? (
                                    <tr><td colSpan="6" className="p-8 text-center text-zinc-500 text-xs">Cart manifest is empty. Select a formulation above.</td></tr>
                                ) : (
                                    cart.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-white/[0.03] transition-colors">
                                            <td className="p-3 font-mono text-xs text-zinc-400">#MED-{item.medicineId}</td>
                                            <td className="p-3 font-medium text-white">{item.medName} <span className="text-[11px] text-zinc-400">({item.brand})</span></td>
                                            <td className="p-3 font-mono text-white font-semibold">{item.qty}</td>
                                            <td className="p-3 font-mono text-zinc-300">Rs. {Number(item.unitPrice).toFixed(2)}</td>
                                            <td className="p-3 font-mono text-white font-semibold">Rs. {Number(item.lineTotal).toFixed(2)}</td>
                                            <td className="p-3 text-center">
                                                <button onClick={() => removeFromCart(idx)} className="text-zinc-500 hover:text-red-400 p-1 transition">
                                                    <i data-lucide="trash-2" className="w-4 h-4"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Right Column: Checkout Terminal */}
            <div className="glass-card p-6 flex flex-col justify-between">
                <div className="space-y-4">
                    <div>
                        <h3 className="font-bold text-white text-sm">Checkout Terminal</h3>
                        <p className="text-xs text-zinc-400">Order calculation and currency tender</p>
                    </div>

                    <div className="glass-well p-5 text-center">
                        <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Net Amount Due</p>
                        <h2 className="text-3xl font-bold tracking-tight text-white font-mono mt-1">Rs. {finalTotal.toFixed(2)}</h2>
                        <p className="text-[11px] text-zinc-400 mt-1">{note}</p>
                    </div>

                    <div className="glass-well p-3.5 space-y-2">
                        <label className="block text-[11px] font-semibold text-zinc-300">Promo / Benefit Voucher</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="e.g. MAGICPILL"
                                value={coupon}
                                onChange={(e) => setCoupon(e.target.value)}
                                className="glass-input w-full px-3 py-1.5 font-mono uppercase text-xs"
                            />
                            <button onClick={() => setAppliedCoupon(coupon.trim().toUpperCase())} className="glass-btn-secondary px-3 py-1.5 text-xs">
                                Apply
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Settlement Method</label>
                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="glass-input w-full px-3 py-2 text-xs"
                        >
                            <option value="Cash">Cash Currency</option>
                            <option value="Card">Debit / Credit Card</option>
                            <option value="Online">UPI / Digital Clearance</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Cash Tendered (Rs)</label>
                        <input
                            type="number"
                            step="0.01"
                            placeholder="Enter tender amount"
                            value={cashReceived}
                            onChange={(e) => setCashReceived(e.target.value)}
                            className="glass-input w-full px-3 py-2 font-mono text-sm font-semibold"
                        />
                    </div>

                    <div className="glass-well p-3 flex items-center justify-between text-xs">
                        <span className="text-zinc-400">Change Returned:</span>
                        <span className={`text-base font-bold font-mono ${isShort ? 'text-red-400' : 'text-emerald-400'}`}>
                            {isShort ? `Short: Rs. ${(finalTotal - cashNum).toFixed(2)}` : `Rs. ${changeDue.toFixed(2)}`}
                        </span>
                    </div>
                </div>

                <div className="pt-6">
                    <button type="button" onClick={handleCheckout} className="glass-btn-primary w-full py-3 text-xs font-semibold">
                        <i data-lucide="check" className="w-4 h-4"></i>
                        <span>Fulfill Order &amp; Issue Receipt</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
