import React, { useState } from 'react';
import { api } from '../services/api';

export default function LoginModal({ onLoginSuccess }) {
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('123');
    const [error, setError] = useState('');
    const [showForgot, setShowForgot] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotPwd, setForgotPwd] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const data = await api.login(username, password);
            if (data.success || data.id) {
                onLoginSuccess(data.user || data);
            } else {
                setError(data.message || 'Invalid operator credentials');
            }
        } catch (err) {
            setError('Server connection failure');
        }
    };

    const handleForgot = async (e) => {
        e.preventDefault();
        try {
            const msg = await api.forgotPassword(forgotEmail, forgotPwd);
            alert(msg);
            setShowForgot(false);
        } catch (err) {
            alert('Request failed');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 glass-modal-backdrop">
            <div className="glass-card max-w-4xl w-full flex flex-col md:flex-row overflow-hidden border border-white/[0.16] shadow-2xl">
                <div className="md:w-1/2 p-10 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/[0.08] bg-white/[0.02]">
                    <div>
                        <div className="flex items-center gap-2.5 mb-6">
                            <div className="w-9 h-9 rounded-xl bg-white/[0.08] border border-white/[0.18] flex items-center justify-center shadow-inner">
                                <i data-lucide="pill" className="w-4 h-4 text-emerald-400"></i>
                            </div>
                            <span className="glass-badge text-[11px] font-mono text-zinc-300">Enterprise OS 2.0</span>
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight text-white">pharma<span className="text-emerald-400">.Co</span></h1>
                        <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                            Precision apothecary inventory control, compliant retail POS and clinical dispensary intelligence.
                        </p>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/[0.06]">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-2">Authorised Demonstrator Access</p>
                        <div className="glass-well p-3 space-y-2 text-xs">
                            <div className="flex items-center justify-between text-zinc-400">
                                <span className="font-medium">Administrator</span>
                                <button type="button" onClick={() => { setUsername('admin'); setPassword('123'); }} className="font-mono text-zinc-200 hover:text-emerald-400 transition">admin / 123</button>
                            </div>
                            <div className="flex items-center justify-between text-zinc-400">
                                <span className="font-medium">Staff Dispensary</span>
                                <button type="button" onClick={() => { setUsername('isuru'); setPassword('456'); }} className="font-mono text-zinc-200 hover:text-emerald-400 transition">isuru / 456</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="md:w-1/2 p-10 flex flex-col justify-center">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold tracking-tight text-white">System Sign In</h2>
                        <p className="text-zinc-400 text-xs mt-1">Authenticate to access the clinical control center</p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-950/40 border border-red-500/30 text-red-300 text-xs rounded-xl flex items-center gap-2">
                            <i data-lucide="alert-circle" className="w-4 h-4 shrink-0 text-red-400"></i>
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Operator ID or Email</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="glass-input w-full px-3 py-2 text-xs"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Passkey</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="glass-input w-full px-3 py-2 text-xs"
                            />
                        </div>

                        <div className="flex items-center justify-between text-xs pt-1">
                            <span className="text-zinc-400">Default: admin / 123</span>
                            <button type="button" onClick={() => setShowForgot(true)} className="text-zinc-400 hover:text-white transition">Reset passkey</button>
                        </div>

                        <button type="submit" className="glass-btn-primary w-full py-2.5 text-xs font-semibold mt-2">
                            <span>Authenticate Session</span>
                            <i data-lucide="arrow-right" className="w-4 h-4"></i>
                        </button>
                    </form>
                </div>
            </div>

            {/* Forgot Modal */}
            {showForgot && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 glass-modal-backdrop">
                    <div className="glass-modal-sheet max-w-md w-full p-6">
                        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                            <h3 className="font-bold text-white text-sm">Credential Recovery</h3>
                            <button onClick={() => setShowForgot(false)} className="text-zinc-400 hover:text-white"><i data-lucide="x" className="w-4 h-4"></i></button>
                        </div>
                        <form onSubmit={handleForgot} className="space-y-4 mt-4">
                            <div>
                                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Registered Email</label>
                                <input
                                    type="email"
                                    required
                                    value={forgotEmail}
                                    onChange={(e) => setForgotEmail(e.target.value)}
                                    className="glass-input w-full px-3 py-2 text-xs"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">New Passkey</label>
                                <input
                                    type="password"
                                    required
                                    value={forgotPwd}
                                    onChange={(e) => setForgotPwd(e.target.value)}
                                    className="glass-input w-full px-3 py-2 text-xs"
                                />
                            </div>
                            <div className="flex gap-2 pt-1">
                                <button type="button" onClick={() => setShowForgot(false)} className="glass-btn-secondary flex-1 py-2 text-xs">Cancel</button>
                                <button type="submit" className="glass-btn-primary flex-1 py-2 text-xs font-semibold">Update Key</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
