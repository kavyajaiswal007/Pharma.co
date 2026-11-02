import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function SupplyRestock() {
    const [suppliers, setSuppliers] = useState([]);
    const [medicines, setMedicines] = useState([]);
    const [supplies, setSupplies] = useState([]);
    const [form, setForm] = useState({
        supplierId: '',
        medicineId: '',
        date: new Date().toISOString().slice(0, 10),
        qty: '',
        unitCost: ''
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [suppData, medData, historyData] = await Promise.all([
                api.getSuppliers(),
                api.getMedicines(),
                api.getSupplies()
            ]);
            setSuppliers(suppData);
            setMedicines(medData);
            setSupplies(historyData);
            if (suppData.length && !form.supplierId) setForm(f => ({ ...f, supplierId: suppData[0].id }));
            if (medData.length && !form.medicineId) setForm(f => ({ ...f, medicineId: medData[0].id }));
        } catch (e) {
            console.error(e);
        }
    };

    const handleCommit = async () => {
        if (!form.supplierId || !form.medicineId || !form.qty || !form.unitCost) {
            return alert('All fields required');
        }
        const ok = await api.saveSupply({
            supplierId: parseInt(form.supplierId),
            medicineId: parseInt(form.medicineId),
            date: form.date,
            qty: parseInt(form.qty),
            unitCost: parseFloat(form.unitCost)
        });
        if (ok) {
            setForm(f => ({ ...f, qty: '', unitCost: '' }));
            loadData();
            alert('Inflow logged and stock replenished');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete inflow log?')) return;
        const ok = await api.deleteSupply(id);
        if (ok) loadData();
    };

    const totalBill = (parseFloat(form.qty) || 0) * (parseFloat(form.unitCost) || 0);

    return (
        <div className="space-y-6">
            <div className="glass-card p-6">
                <div className="mb-4">
                    <h3 className="font-bold text-white text-sm">Inflow Replenishment Dock</h3>
                    <p className="text-xs text-zinc-400">Commits incoming batch shipments directly into active catalogue inventory</p>
                </div>
                <form className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 items-end" onSubmit={(e) => e.preventDefault()}>
                    <div className="lg:col-span-2">
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">Partner Supplier *</label>
                        <select
                            value={form.supplierId}
                            onChange={(e) => setForm({ ...form, supplierId: e.target.value })}
                            className="glass-input w-full px-3 py-2 text-xs"
                        >
                            {suppliers.map(s => <option key={s.id} value={s.id}>{s.supplierName}</option>)}
                        </select>
                    </div>
                    <div className="lg:col-span-2">
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">Target Medication *</label>
                        <select
                            value={form.medicineId}
                            onChange={(e) => setForm({ ...form, medicineId: e.target.value })}
                            className="glass-input w-full px-3 py-2 text-xs"
                        >
                            {medicines.map(m => <option key={m.id} value={m.id}>{m.medName} ({m.brand})</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">Restock Date</label>
                        <input
                            type="date"
                            value={form.date}
                            onChange={(e) => setForm({ ...form, date: e.target.value })}
                            className="glass-input w-full px-3 py-2 text-xs font-mono"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">Units Inflow *</label>
                        <input
                            type="number"
                            min="1"
                            placeholder="Qty"
                            value={form.qty}
                            onChange={(e) => setForm({ ...form, qty: e.target.value })}
                            className="glass-input w-full px-3 py-2 text-xs font-mono font-semibold"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">Unit Cost (Rs) *</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="Cost"
                            value={form.unitCost}
                            onChange={(e) => setForm({ ...form, unitCost: e.target.value })}
                            className="glass-input w-full px-3 py-2 text-xs font-mono font-semibold"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">Total Bill (Rs)</label>
                        <input
                            type="text"
                            readOnly
                            value={totalBill.toFixed(2)}
                            className="glass-input w-full px-3 py-2 text-xs font-mono text-zinc-300"
                        />
                    </div>
                    <div className="lg:col-span-2">
                        <button type="button" onClick={handleCommit} className="glass-btn-primary w-full py-2.5 text-xs font-semibold">
                            <i data-lucide="plus" className="w-4 h-4"></i>
                            <span>Commit Inflow Restock</span>
                        </button>
                    </div>
                </form>
            </div>

            <div className="glass-card p-6 flex flex-col">
                <div className="mb-4">
                    <h3 className="font-bold text-white text-sm">Inflow Audit History</h3>
                    <p className="text-xs text-zinc-400">Chronological ledger of inventory arrivals</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="glass-table">
                        <thead>
                            <tr>
                                <th>Refill ID</th>
                                <th>Supplier Partner</th>
                                <th>Medication</th>
                                <th>Date</th>
                                <th>Quantity</th>
                                <th>Unit Cost</th>
                                <th>Total Value</th>
                                <th className="text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {supplies.map(s => (
                                <tr key={s.id} className="hover:bg-white/[0.04] transition-colors">
                                    <td className="p-3 font-mono text-xs text-zinc-400">#REFILL-{s.id}</td>
                                    <td className="p-3 font-medium text-white">{s.supplier?.supplierName || 'Partner'}</td>
                                    <td className="p-3 text-zinc-300">{s.medicine?.medName || 'Pill'}</td>
                                    <td className="p-3 font-mono text-zinc-400 text-xs">{s.date}</td>
                                    <td className="p-3"><span className="glass-badge glass-badge-emerald font-mono">+{s.qty}</span></td>
                                    <td className="p-3 font-mono text-zinc-300">Rs. {Number(s.unitCost).toFixed(2)}</td>
                                    <td className="p-3 font-mono text-white font-semibold">Rs. {Number(s.totalCost).toFixed(2)}</td>
                                    <td className="p-3 text-center">
                                        <button onClick={() => handleDelete(s.id)} className="text-zinc-500 hover:text-red-400 p-1 transition">
                                            <i data-lucide="trash-2" className="w-4 h-4"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
