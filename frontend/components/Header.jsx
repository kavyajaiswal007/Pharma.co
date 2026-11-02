import React, { useState, useEffect } from 'react';

export default function Header({ currentView }) {
    const [datetime, setDatetime] = useState('');

    useEffect(() => {
        const update = () => {
            const now = new Date();
            setDatetime(now.toLocaleDateString('en-US', {
                weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
                hour: '2-digit', minute: '2-digit', second: '2-digit'
            }));
        };
        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, []);

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

    return (
        <header className="h-14 glass-header px-8 flex items-center justify-between shrink-0 z-10">
            <div className="flex items-center gap-3">
                <h1 className="text-sm font-semibold tracking-tight text-white">{titles[currentView] || 'pharma.Co'}</h1>
                <span className="glass-badge text-[10px] font-mono text-zinc-400">Spring Boot 3.3 Edition</span>
            </div>
            <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-xs">
                    <i data-lucide="clock" className="w-3.5 h-3.5 text-zinc-500"></i>
                    <span>{datetime}</span>
                </div>
                <div className="hidden md:flex items-center gap-1.5 text-zinc-400 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span className="font-mono text-[11px]">H2 Storage Engine Active</span>
                </div>
            </div>
        </header>
    );
}
