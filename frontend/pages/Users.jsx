import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function Users() {
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState({
        id: '',
        username: '',
        email: '',
        password: '',
        role: 'employee'
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await api.getUsers();
            setUsers(data);
        } catch (e) {
            console.error(e);
        }
    };

    const handleSelectRow = (u) => {
        setForm({
            id: u.id,
            username: u.username,
            email: u.email,
            password: '',
            role: u.role || 'employee'
        });
    };

    const handleClear = () => {
        setForm({ id: '', username: '', email: '', password: '', role: 'employee' });
    };

    const handleSave = async () => {
        if (!form.username || !form.email || !form.password) return alert('Username, email, and passkey required');
        const ok = await api.saveUser(form);
        if (ok) {
            handleClear();
            loadData();
            alert('Staff credential generated');
        }
    };

    const handleUpdate = async () => {
        if (!form.id) return alert('Select staff member to update');
        const ok = await api.updateUser(form.id, form);
        if (ok) {
            handleClear();
            loadData();
            alert('Staff record updated');
        }
    };

    const handleDelete = async () => {
        if (!form.id) return alert('Select staff member to revoke');
        if (form.id == 1) return alert('Cannot revoke primary system administrator');
        if (!confirm('Revoke staff access?')) return;
        const ok = await api.deleteUser(form.id);
        if (ok) {
            handleClear();
            loadData();
            alert('Staff access revoked');
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="glass-card p-6">
                <h3 className="font-bold text-white text-sm mb-4">Staff Account Privileges</h3>
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">Operator Username *</label>
                        <input
                            type="text"
                            required
                            placeholder="pharmacist1"
                            value={form.username}
                            onChange={(e) => setForm({ ...form, username: e.target.value })}
                            className="glass-input w-full px-3 py-2 text-xs"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">Corporate Email *</label>
                        <input
                            type="email"
                            required
                            placeholder="user@pharmaco.com"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="glass-input w-full px-3 py-2 text-xs"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">Session Passkey *</label>
                        <input
                            type="password"
                            placeholder="Enter passkey"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            className="glass-input w-full px-3 py-2 text-xs"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">Role Privilege *</label>
                        <select
                            value={form.role}
                            onChange={(e) => setForm({ ...form, role: e.target.value })}
                            className="glass-input w-full px-3 py-2 text-xs"
                        >
                            <option value="employee">Employee / Apothecary Staff</option>
                            <option value="admin">Administrator (Full Access)</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2">
                        <button type="button" onClick={handleSave} className="glass-btn-primary py-2 text-xs">Create Staff</button>
                        <button type="button" onClick={handleUpdate} className="glass-btn-secondary py-2 text-xs">Update</button>
                        <button type="button" onClick={handleDelete} className="glass-btn-danger py-2 text-xs">Revoke</button>
                        <button type="button" onClick={handleClear} className="glass-btn-ghost py-2 text-xs">Reset</button>
                    </div>
                </form>
            </div>

            <div className="lg:col-span-2 glass-card p-6 flex flex-col">
                <div className="mb-4">
                    <h3 className="font-bold text-white text-sm">Operator Governance Ledger</h3>
                    <p className="text-xs text-zinc-400">Authenticated personnel accounts</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="glass-table">
                        <thead>
                            <tr>
                                <th>Operator ID</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Role Classification</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u.id} onClick={() => handleSelectRow(u)} className="hover:bg-white/[0.04] cursor-pointer transition-colors">
                                    <td className="p-3 font-mono text-xs text-zinc-400">#UID-{u.id}</td>
                                    <td className="p-3 font-medium text-white">{u.username}</td>
                                    <td className="p-3 text-zinc-400 text-xs">{u.email}</td>
                                    <td className="p-3">
                                        <span className={`glass-badge ${u.role === 'admin' ? 'glass-badge-emerald' : ''}`}>
                                            {u.role.toUpperCase()}
                                        </span>
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
