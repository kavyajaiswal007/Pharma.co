import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function Customers() {
    const [customers, setCustomers] = useState([]);
    const [search, setSearch] = useState('');
    const [form, setForm] = useState({
        id: '',
        name: '',
        contact: '',
        address: '',
        loyaltyTier: 'Bronze'
    });

    useEffect(() => {
        loadData();
    }, [search]);

    const loadData = async () => {
        try {
            const data = await api.getCustomers(search);
            setCustomers(data);
        } catch (e) {
            console.error(e);
        }
    };

    const handleSelectRow = (c) => {
        setForm({
            id: c.id,
            name: c.name,
            contact: c.contact,
            address: c.address || '',
            loyaltyTier: c.loyaltyTier || 'Bronze'
        });
    };

    const handleClear = () => {
        setForm({ id: '', name: '', contact: '', address: '', loyaltyTier: 'Bronze' });
    };

    const handleSave = async () => {
        if (!form.name || !form.contact) return alert('Name and contact are required');
        const ok = await api.saveCustomer(form);
        if (ok) {
            handleClear();
            loadData();
            alert('Client enrolled');
        }
    };

    const handleUpdate = async () => {
        if (!form.id) return alert('Select client from table');
        const ok = await api.updateCustomer(form.id, form);
        if (ok) {
            handleClear();
            loadData();
            alert('Client updated');
        }
    };

    const handleDelete = async () => {
        if (!form.id) return alert('Select client to remove');
        if (!confirm('Remove client profile?')) return;
        const ok = await api.deleteCustomer(form.id);
        if (ok) {
            handleClear();
            loadData();
            alert('Client removed');
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="glass-card p-6">
                <h3 className="font-bold text-white text-sm mb-4">Client Record Registration</h3>
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">Full Legal Name *</label>
                        <input
                            type="text"
                            required
                            placeholder="John Doe"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="glass-input w-full px-3 py-2 text-xs"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">Contact Hotline *</label>
                        <input
                            type="text"
                            required
                            placeholder="0771234567"
                            value={form.contact}
                            onChange={(e) => setForm({ ...form, contact: e.target.value })}
                            className="glass-input w-full px-3 py-2 font-mono text-xs"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">Prescription Address</label>
                        <textarea
                            rows="3"
                            placeholder="Residential delivery address..."
                            value={form.address}
                            onChange={(e) => setForm({ ...form, address: e.target.value })}
                            className="glass-input w-full px-3 py-2 text-xs"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">Loyalty Tier Classification</label>
                        <select
                            value={form.loyaltyTier}
                            onChange={(e) => setForm({ ...form, loyaltyTier: e.target.value })}
                            className="glass-input w-full px-3 py-2 text-xs"
                        >
                            <option value="Bronze">Bronze Tier</option>
                            <option value="Silver">Silver Tier</option>
                            <option value="Gold VIP">Gold VIP</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2">
                        <button type="button" onClick={handleSave} className="glass-btn-primary py-2 text-xs">Enrol Client</button>
                        <button type="button" onClick={handleUpdate} className="glass-btn-secondary py-2 text-xs">Update</button>
                        <button type="button" onClick={handleDelete} className="glass-btn-danger py-2 text-xs">Remove</button>
                        <button type="button" onClick={handleClear} className="glass-btn-ghost py-2 text-xs">Reset</button>
                    </div>
                </form>
            </div>

            <div className="lg:col-span-2 glass-card p-6 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="font-bold text-white text-sm">Enrolled Client Directory</h3>
                        <p className="text-xs text-zinc-400">Click a record to inspect or modify details</p>
                    </div>
                    <div className="relative w-64">
                        <i data-lucide="search" className="w-4 h-4 absolute left-3 top-2.5 text-zinc-500"></i>
                        <input
                            type="text"
                            placeholder="Search name or contact..."
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
                                <th>Client Name</th>
                                <th>Contact Hotline</th>
                                <th>Loyalty Tier</th>
                                <th>Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map(c => (
                                <tr key={c.id} onClick={() => handleSelectRow(c)} className="hover:bg-white/[0.04] cursor-pointer transition-colors">
                                    <td className="p-3 font-mono text-xs text-zinc-400">#CUST-{c.id}</td>
                                    <td className="p-3 font-medium text-white">{c.name}</td>
                                    <td className="p-3 font-mono text-zinc-300 text-xs">{c.contact}</td>
                                    <td className="p-3"><span className={`glass-badge ${c.loyaltyTier === 'Gold VIP' ? 'glass-badge-amber' : ''}`}>{c.loyaltyTier || 'Bronze'}</span></td>
                                    <td className="p-3 text-zinc-400 text-xs">{c.address || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
