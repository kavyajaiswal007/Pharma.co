import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function Medicines() {
    const [medicines, setMedicines] = useState([]);
    const [search, setSearch] = useState('');
    const [form, setForm] = useState({
        id: '',
        medName: '',
        brand: '',
        qtyInStock: '',
        unitPrice: '',
        category: 'Pain Relief',
        funTag: '',
        expDate: ''
    });

    useEffect(() => {
        loadData();
    }, [search]);

    const loadData = async () => {
        try {
            const data = await api.getMedicines(search);
            setMedicines(data);
        } catch (e) {
            console.error(e);
        }
    };

    const handleSelectRow = (m) => {
        setForm({
            id: m.id,
            medName: m.medName,
            brand: m.brand,
            qtyInStock: m.qtyInStock,
            unitPrice: m.unitPrice,
            category: m.category || 'Pain Relief',
            funTag: m.funTag || '',
            expDate: m.expDate
        });
    };

    const handleClear = () => {
        setForm({
            id: '',
            medName: '',
            brand: '',
            qtyInStock: '',
            unitPrice: '',
            category: 'Pain Relief',
            funTag: '',
            expDate: ''
        });
    };

    const handleSave = async () => {
        if (!form.medName || !form.brand || !form.qtyInStock || !form.unitPrice || !form.expDate) {
            return alert('All formulation fields required');
        }
        const ok = await api.saveMedicine({
            medName: form.medName,
            brand: form.brand,
            qtyInStock: parseInt(form.qtyInStock),
            unitPrice: parseFloat(form.unitPrice),
            expDate: form.expDate,
            category: form.category,
            funTag: form.funTag
        });
        if (ok) {
            handleClear();
            loadData();
            alert('Formulation saved to catalog');
        }
    };

    const handleUpdate = async () => {
        if (!form.id) return alert('Select formulation from catalog table to update');
        const ok = await api.updateMedicine(form.id, {
            medName: form.medName,
            brand: form.brand,
            qtyInStock: parseInt(form.qtyInStock),
            unitPrice: parseFloat(form.unitPrice),
            expDate: form.expDate,
            category: form.category,
            funTag: form.funTag
        });
        if (ok) {
            handleClear();
            loadData();
            alert('Formulation record updated');
        }
    };

    const handleDelete = async () => {
        if (!form.id) return alert('Select formulation from table to archive');
        if (!confirm('Archive this formulation?')) return;
        const ok = await api.deleteMedicine(form.id);
        if (ok) {
            handleClear();
            loadData();
            alert('Formulation archived');
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form */}
            <div className="glass-card p-6">
                <h3 className="font-bold text-white text-sm mb-4">Pill &amp; Formulation Specification</h3>
                <form className="space-y-3.5" onSubmit={(e) => e.preventDefault()}>
                    <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">Medication Name *</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Paracetamol 500mg"
                            value={form.medName}
                            onChange={(e) => setForm({ ...form, medName: e.target.value })}
                            className="glass-input w-full px-3 py-2 text-xs"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">Brand Name *</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Panadol"
                            value={form.brand}
                            onChange={(e) => setForm({ ...form, brand: e.target.value })}
                            className="glass-input w-full px-3 py-2 text-xs"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-zinc-300 mb-1">Inventory Qty *</label>
                            <input
                                type="number"
                                required
                                min="0"
                                placeholder="100"
                                value={form.qtyInStock}
                                onChange={(e) => setForm({ ...form, qtyInStock: e.target.value })}
                                className="glass-input w-full px-3 py-2 font-mono text-xs"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-zinc-300 mb-1">Unit Price (Rs) *</label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                min="0"
                                placeholder="25.00"
                                value={form.unitPrice}
                                onChange={(e) => setForm({ ...form, unitPrice: e.target.value })}
                                className="glass-input w-full px-3 py-2 font-mono text-xs"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-zinc-300 mb-1">Therapeutic Class</label>
                            <select
                                value={form.category}
                                onChange={(e) => setForm({ ...form, category: e.target.value })}
                                className="glass-input w-full px-3 py-2 text-xs"
                            >
                                <option value="Pain Relief">Pain Relief</option>
                                <option value="Immunity Boosters">Immunity Boosters</option>
                                <option value="Antibiotics">Antibiotics</option>
                                <option value="Digestive Health">Digestive Health</option>
                                <option value="Brain &amp; Focus">Brain &amp; Focus</option>
                                <option value="Beauty &amp; Glow">Beauty &amp; Glow</option>
                                <option value="Bone Health">Bone Health</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-zinc-300 mb-1">Clinical Tag</label>
                            <input
                                type="text"
                                placeholder="e.g. Bestseller"
                                value={form.funTag}
                                onChange={(e) => setForm({ ...form, funTag: e.target.value })}
                                className="glass-input w-full px-3 py-2 text-xs"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">Expiry Date *</label>
                        <input
                            type="date"
                            required
                            value={form.expDate}
                            onChange={(e) => setForm({ ...form, expDate: e.target.value })}
                            className="glass-input w-full px-3 py-2 font-mono text-xs"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2">
                        <button type="button" onClick={handleSave} className="glass-btn-primary py-2 text-xs">Save Formulation</button>
                        <button type="button" onClick={handleUpdate} className="glass-btn-secondary py-2 text-xs">Update Details</button>
                        <button type="button" onClick={handleDelete} className="glass-btn-danger py-2 text-xs">Archive</button>
                        <button type="button" onClick={handleClear} className="glass-btn-ghost py-2 text-xs">Reset Form</button>
                    </div>
                </form>
            </div>

            {/* Table */}
            <div className="lg:col-span-2 glass-card p-6 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="font-bold text-white text-sm">Formulation Catalog</h3>
                        <p className="text-xs text-zinc-400">Click any row to load into editor</p>
                    </div>
                    <div className="relative w-64">
                        <i data-lucide="search" className="w-4 h-4 absolute left-3 top-2.5 text-zinc-500"></i>
                        <input
                            type="text"
                            placeholder="Search pill or brand..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="glass-input w-full pl-9 pr-3 py-1.5 text-xs"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto flex-1 max-h-[480px]">
                    <table className="glass-table">
                        <thead className="sticky top-0 z-10">
                            <tr>
                                <th>Identifier</th>
                                <th>Formulation Name</th>
                                <th>Brand</th>
                                <th>Stock</th>
                                <th>Unit Price</th>
                                <th>Expiry</th>
                            </tr>
                        </thead>
                        <tbody>
                            {medicines.map(m => (
                                <tr key={m.id} onClick={() => handleSelectRow(m)} className="hover:bg-white/[0.04] cursor-pointer transition-colors">
                                    <td className="p-3 font-mono text-xs text-zinc-400">#MED-{m.id}</td>
                                    <td className="p-3">
                                        <p className="font-medium text-white">{m.medName}</p>
                                        {m.funTag && <span className="text-[10px] text-zinc-400">{m.funTag}</span>}
                                    </td>
                                    <td className="p-3 text-zinc-400">{m.brand}</td>
                                    <td className="p-3"><span className={`glass-badge ${m.qtyInStock < 30 ? 'glass-badge-amber' : 'glass-badge-emerald'} font-mono`}>{m.qtyInStock}</span></td>
                                    <td className="p-3 font-mono text-white font-medium">Rs. {Number(m.unitPrice).toFixed(2)}</td>
                                    <td className="p-3 font-mono text-zinc-400 text-xs">{m.expDate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
