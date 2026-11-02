import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function Suppliers() {
    const [suppliers, setSuppliers] = useState([]);
    const [search, setSearch] = useState('');
    const [form, setForm] = useState({
        id: '',
        supplierName: '',
        email: '',
        contactNum: '',
        reliabilityRating: '5.0 ★'
    });

    useEffect(() => {
        loadData();
    }, [search]);

    const loadData = async () => {
        try {
            const data = await api.getSuppliers(search);
            setSuppliers(data);
        } catch (e) {
            console.error(e);
        }
    };

    const handleSelectRow = (s) => {
        setForm({
            id: s.id,
            supplierName: s.supplierName,
            email: s.email || '',
            contactNum: s.contactNum,
            reliabilityRating: s.reliabilityRating || '5.0 ★'
        });
    };

    const handleClear = () => {
        setForm({ id: '', supplierName: '', email: '', contactNum: '', reliabilityRating: '5.0 ★' });
    };

    const handleSave = async () => {
        if (!form.supplierName || !form.contactNum) return alert('Name and contact are required');
        const ok = await api.saveSupplier(form);
        if (ok) {
            handleClear();
            loadData();
            alert('Supplier saved');
        }
    };

    const handleUpdate = async () => {
        if (!form.id) return alert('Select partner to update');
        const ok = await api.updateSupplier(form.id, form);
        if (ok) {
            handleClear();
            loadData();
            alert('Partner updated');
        }
    };

    const handleDelete = async () => {
        if (!form.id) return alert('Select partner to delete');
        if (!confirm('Remove partner?')) return;
        const ok = await api.deleteSupplier(form.id);
        if (ok) {
            handleClear();
            loadData();
            alert('Partner removed');
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="glass-card p-6">
                <h3 className="font-bold text-white text-sm mb-4">Supply Partner Credentials</h3>
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">Company / Entity Name *</label>
                        <input
                            type="text"
                            required
                            placeholder="Lanka Pharma Distributors"
                            value={form.supplierName}
                            onChange={(e) => setForm({ ...form, supplierName: e.target.value })}
                            className="glass-input w-full px-3 py-2 text-xs"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">Official Communications Email</label>
                        <input
                            type="email"
                            placeholder="info@supplier.com"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="glass-input w-full px-3 py-2 text-xs"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">Hotline Contact *</label>
                        <input
                            type="text"
                            required
                            placeholder="0772345678"
                            value={form.contactNum}
                            onChange={(e) => setForm({ ...form, contactNum: e.target.value })}
                            className="glass-input w-full px-3 py-2 font-mono text-xs"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">Reliability Index</label>
                        <input
                            type="text"
                            placeholder="5.0 ★"
                            value={form.reliabilityRating}
                            onChange={(e) => setForm({ ...form, reliabilityRating: e.target.value })}
                            className="glass-input w-full px-3 py-2 font-mono text-xs"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2">
                        <button type="button" onClick={handleSave} className="glass-btn-primary py-2 text-xs">Save Partner</button>
                        <button type="button" onClick={handleUpdate} className="glass-btn-secondary py-2 text-xs">Update</button>
                        <button type="button" onClick={handleDelete} className="glass-btn-danger py-2 text-xs">Remove</button>
                        <button type="button" onClick={handleClear} className="glass-btn-ghost py-2 text-xs">Reset</button>
                    </div>
                </form>
            </div>

            <div className="lg:col-span-2 glass-card p-6 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="font-bold text-white text-sm">Allied Supply Partners</h3>
                        <p className="text-xs text-zinc-400">Authenticated vendor registry</p>
                    </div>
                    <div className="relative w-64">
                        <i data-lucide="search" className="w-4 h-4 absolute left-3 top-2.5 text-zinc-500"></i>
                        <input
                            type="text"
                            placeholder="Search supplier..."
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
                                <th>Partner Entity</th>
                                <th>Email</th>
                                <th>Hotline</th>
                                <th>Reliability Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {suppliers.map(s => (
                                <tr key={s.id} onClick={() => handleSelectRow(s)} className="hover:bg-white/[0.04] cursor-pointer transition-colors">
                                    <td className="p-3 font-mono text-xs text-zinc-400">#SUPP-{s.id}</td>
                                    <td className="p-3 font-medium text-white">{s.supplierName}</td>
                                    <td className="p-3 text-zinc-400 text-xs">{s.email || '-'}</td>
                                    <td className="p-3 font-mono text-zinc-300 text-xs">{s.contactNum}</td>
                                    <td className="p-3"><span className="glass-badge glass-badge-amber font-mono">{s.reliabilityRating || '5.0 ★'}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
