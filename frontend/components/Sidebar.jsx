import React from 'react';

export default function Sidebar({ currentView, navigate, currentUser, handleLogout, audioEnabled, toggleAudio }) {
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
        { id: 'order', label: 'Express POS', icon: 'zap' },
        { id: 'medicines', label: 'Catalog & Stock', icon: 'pill' },
        { id: 'customers', label: 'Client Directory', icon: 'users' },
        { id: 'suppliers', label: 'Supply Partners', icon: 'truck' },
        { id: 'supply', label: 'Inflow Restock', icon: 'package-plus' },
        { id: 'ai', label: 'Clinical Heuristic Lab', icon: 'sparkles' },
        ...(currentUser?.role === 'admin' ? [{ id: 'users', label: 'Staff Governance', icon: 'shield-check' }] : [])
    ];

    return (
        <aside className="w-64 glass-panel flex flex-col shrink-0 select-none z-20">
            {/* Brand Mark */}
            <div className="p-5 flex items-center gap-3 border-b border-white/[0.08]">
                <div className="w-9 h-9 rounded-xl bg-white/[0.07] border border-white/[0.18] flex items-center justify-center shrink-0 shadow-inner">
                    <i data-lucide="pill" className="w-4 h-4 text-emerald-400"></i>
                </div>
                <div className="overflow-hidden">
                    <h2 className="font-bold text-white text-base tracking-tight truncate flex items-center gap-0.5">
                        <span>pharma</span><span className="text-emerald-400">.Co</span>
                    </h2>
                    <p className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase">Clinical OS 2.0</p>
                </div>
            </div>

            {/* Navigation Links */}
            <div className="p-3 flex-1 overflow-y-auto space-y-1">
                <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider px-3 my-2">Command Center</div>
                {navItems.map(item => {
                    const isActive = currentView === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => navigate(item.id)}
                            className={`nav-item ${isActive ? 'nav-active' : ''}`}
                        >
                            <i data-lucide={item.icon} className="w-4 h-4"></i>
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/[0.08] space-y-3 bg-black/20">
                <div className="flex items-center justify-between px-1">
                    <button
                        onClick={toggleAudio}
                        className="glass-btn-secondary px-2.5 py-1.5 text-xs flex items-center gap-1.5"
                    >
                        <i data-lucide={audioEnabled ? "volume-2" : "volume-x"} className="w-3.5 h-3.5 text-emerald-400"></i>
                        <span className="text-[11px]">{audioEnabled ? 'Audio ON' : 'Audio Muted'}</span>
                    </button>
                </div>

                <div className="flex items-center gap-3 pt-1">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.08] border border-white/[0.16] text-white font-bold flex items-center justify-center text-xs">
                        {(currentUser?.username || 'A')[0].toUpperCase()}
                    </div>
                    <div className="overflow-hidden flex-1">
                        <p className="font-semibold text-white text-xs leading-tight truncate">{currentUser?.username || 'Admin'}</p>
                        <p className="text-[10px] text-zinc-400 font-mono">{(currentUser?.role || 'ADMIN').toUpperCase()}</p>
                    </div>
                    <button onClick={handleLogout} title="Sign Out" className="p-1.5 text-zinc-400 hover:text-red-400 transition">
                        <i data-lucide="log-out" className="w-4 h-4"></i>
                    </button>
                </div>
            </div>
        </aside>
    );
}
