import React, { useEffect, useState, useRef } from 'react';
import { api } from '../services/api';

export default function Dashboard({ navigate }) {
    const [stats, setStats] = useState({
        totalMedicines: 0,
        activeCustomers: 0,
        todayIncome: 0,
        totalRevenue: 0,
        totalOrders: 0,
        funFactOfDay: '',
        expiringSoon: [],
        lowStock: [],
        salesTrends: []
    });

    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await api.getDashboardStats();
            setStats(data);
            renderChart(data.salesTrends);
        } catch (e) {
            console.error(e);
        }
    };

    const renderChart = (trends) => {
        if (!chartRef.current || !window.Chart) return;
        const ctx = chartRef.current.getContext('2d');
        if (chartInstance.current) chartInstance.current.destroy();

        const labels = trends?.length ? trends.map(t => t.date) : ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'];
        const values = trends?.length ? trends.map(t => t.total) : [250, 450, 800, 1200, 1500];

        const gradient = ctx.createLinearGradient(0, 0, 0, 240);
        gradient.addColorStop(0, 'rgba(16, 185, 129, 0.22)');
        gradient.addColorStop(1, 'rgba(16, 185, 129, 0.00)');

        chartInstance.current = new window.Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: 'Revenue (Rs)',
                    data: values,
                    borderColor: '#10b981',
                    borderWidth: 2,
                    backgroundColor: gradient,
                    fill: true,
                    tension: 0.35,
                    pointBackgroundColor: '#10b981',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 1.5,
                    pointRadius: 3.5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { display: false }, ticks: { color: '#71717a', font: { size: 11 } } },
                    y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#71717a', font: { size: 11 } } }
                }
            }
        });
    };

    return (
        <div className="space-y-6">
            {/* Intelligence Banner */}
            <div className="glass-card p-5 flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.12] flex items-center justify-center shrink-0">
                        <i data-lucide="info" className="w-4 h-4 text-emerald-400"></i>
                    </div>
                    <div>
                        <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Clinical Apothecary Intelligence</p>
                        <p className="text-xs text-zinc-200 mt-0.5 font-medium">{stats.funFactOfDay || 'Hydration maintains cognitive equilibrium.'}</p>
                    </div>
                </div>
                <button onClick={() => navigate('order')} className="glass-btn-secondary text-xs">
                    <span>Open POS Terminal</span>
                    <i data-lucide="arrow-right" className="w-3 h-3"></i>
                </button>
            </div>

            {/* 4 Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="glass-card p-5 flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-medium text-zinc-400">Catalog Inventory</p>
                        <h3 className="text-2xl font-bold tracking-tight text-white mt-1">{stats.totalMedicines}</h3>
                        <p className="text-[10px] text-zinc-500 font-mono mt-1">Formulations Active</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.10] flex items-center justify-center">
                        <i data-lucide="pill" className="w-4 h-4 text-zinc-400"></i>
                    </div>
                </div>

                <div className="glass-card p-5 flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-medium text-zinc-400">Registered Clients</p>
                        <h3 className="text-2xl font-bold tracking-tight text-white mt-1">{stats.activeCustomers}</h3>
                        <p className="text-[10px] text-zinc-500 font-mono mt-1">Enrolled In Loyalty</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.10] flex items-center justify-center">
                        <i data-lucide="users" className="w-4 h-4 text-zinc-400"></i>
                    </div>
                </div>

                <div className="glass-card p-5 flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-medium text-zinc-400">Session Revenue</p>
                        <h3 className="text-2xl font-bold tracking-tight text-white mt-1 font-mono">Rs. {Number(stats.todayIncome).toFixed(2)}</h3>
                        <p className="text-[10px] text-zinc-400 font-mono mt-1">{stats.totalOrders} orders fulfilled</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.10] flex items-center justify-center">
                        <i data-lucide="receipt" className="w-4 h-4 text-emerald-400"></i>
                    </div>
                </div>

                <div className="glass-card p-5 flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-medium text-zinc-400">Cumulative Inflow</p>
                        <h3 className="text-2xl font-bold tracking-tight text-white mt-1 font-mono">Rs. {Number(stats.totalRevenue).toFixed(2)}</h3>
                        <p className="text-[10px] text-zinc-500 font-mono mt-1">Total Settled</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.10] flex items-center justify-center">
                        <i data-lucide="trending-up" className="w-4 h-4 text-zinc-400"></i>
                    </div>
                </div>
            </div>

            {/* Chart + Expiring Radar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass-card p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="font-bold text-white text-sm">Revenue Trajectory &amp; Velocity</h3>
                            <p className="text-xs text-zinc-400">Dispensary sales performance across settlement cycles</p>
                        </div>
                        <span className="glass-badge text-[10px] font-mono">Real-Time JPA Inflow</span>
                    </div>
                    <div className="h-64">
                        <canvas ref={chartRef}></canvas>
                    </div>
                </div>

                <div className="glass-card p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="font-bold text-white text-sm">Expiring Soon Threshold</h3>
                            <p className="text-xs text-zinc-400">Units approaching shelf expiration</p>
                        </div>
                        <i data-lucide="alert-triangle" className="w-4 h-4 text-amber-400"></i>
                    </div>
                    <div className="flex-1 overflow-y-auto max-h-60 text-xs">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[10px] font-mono uppercase text-zinc-500 border-b border-white/[0.08]">
                                    <th className="py-2">Pill Formulation</th>
                                    <th className="py-2">Stock</th>
                                    <th className="py-2">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.05]">
                                {stats.expiringSoon?.map(m => (
                                    <tr key={m.id} className="hover:bg-white/[0.03] transition-colors">
                                        <td className="py-2.5 font-medium text-white">{m.medName} <span className="text-[11px] text-zinc-400">({m.brand})</span></td>
                                        <td className="py-2.5"><span className="glass-badge glass-badge-rose">{m.qtyInStock} units</span></td>
                                        <td className="py-2.5 text-zinc-400 font-mono text-xs">{m.expDate}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Low Stock Table */}
            <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="font-bold text-white text-sm">Inventory Depletion Radar (&lt; 30 Units)</h3>
                        <p className="text-xs text-zinc-400">Stock lines approaching replenishment thresholds</p>
                    </div>
                    <button onClick={() => navigate('supply')} className="text-xs text-emerald-400 hover:text-emerald-300 font-medium transition flex items-center gap-1">
                        <span>Refill Inflow</span>
                        <i data-lucide="arrow-right" className="w-3 h-3"></i>
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="glass-table">
                        <thead>
                            <tr>
                                <th>Identifier</th>
                                <th>Formulation Name</th>
                                <th>Brand</th>
                                <th>Category</th>
                                <th>Remaining Units</th>
                                <th>Unit Price</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.lowStock?.map(m => (
                                <tr key={m.id} className="hover:bg-white/[0.03] transition-colors">
                                    <td className="p-3 font-mono text-xs text-zinc-400">#MED-{m.id}</td>
                                    <td className="p-3 font-medium text-white">{m.medName}</td>
                                    <td className="p-3 text-zinc-400">{m.brand}</td>
                                    <td className="p-3"><span className="glass-badge">{m.category}</span></td>
                                    <td className="p-3"><span className={`glass-badge ${m.qtyInStock < 15 ? 'glass-badge-rose' : 'glass-badge-amber'} font-mono`}>{m.qtyInStock} Units</span></td>
                                    <td className="p-3 font-mono text-zinc-200">Rs. {Number(m.unitPrice).toFixed(2)}</td>
                                    <td className="p-3">
                                        <button onClick={() => navigate('supply')} className="text-xs text-emerald-400 hover:text-emerald-300 font-medium transition flex items-center gap-1">
                                            <span>Restock</span>
                                            <i data-lucide="arrow-right" className="w-3 h-3"></i>
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
