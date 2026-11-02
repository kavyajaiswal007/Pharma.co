import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ReceiptModal from './components/ReceiptModal';
import Dashboard from './pages/Dashboard';
import OrderTerminal from './pages/OrderTerminal';
import Medicines from './pages/Medicines';
import Customers from './pages/Customers';
import Suppliers from './pages/Suppliers';
import SupplyRestock from './pages/SupplyRestock';
import AiPharmacist from './pages/AiPharmacist';
import Users from './pages/Users';
import LoginModal from './pages/LoginModal';
import './style.css';

export default function App() {
    const [currentUser, setCurrentUser] = useState(() => {
        try {
            const saved = localStorage.getItem('pharmaco_user');
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    const [currentView, setCurrentView] = useState('dashboard');
    const [audioEnabled, setAudioEnabled] = useState(true);
    const [receiptOrder, setReceiptOrder] = useState(null);

    useEffect(() => {
        if (window.lucide) window.lucide.createIcons();
    }, [currentView, currentUser, receiptOrder]);

    const playSound = (type) => {
        if (!audioEnabled) return;
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            if (type === 'pop') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(440, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
                gain.gain.setValueAtTime(0.12, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 0.1);
            } else if (type === 'kaching') {
                [987, 1318].forEach((freq, i) => {
                    const o = ctx.createOscillator();
                    const g = ctx.createGain();
                    o.type = 'triangle';
                    o.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
                    g.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.08);
                    g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.08 + 0.22);
                    o.connect(g);
                    g.connect(ctx.destination);
                    o.start(ctx.currentTime + i * 0.08);
                    o.stop(ctx.currentTime + i * 0.08 + 0.22);
                });
            }
        } catch (e) {
            // Audio fallback
        }
    };

    const handleLoginSuccess = (user) => {
        setCurrentUser(user);
        localStorage.setItem('pharmaco_user', JSON.stringify(user));
        playSound('pop');
    };

    const handleLogout = () => {
        setCurrentUser(null);
        localStorage.removeItem('pharmaco_user');
    };

    if (!currentUser) {
        return <LoginModal onLoginSuccess={handleLoginSuccess} />;
    }

    return (
        <div className="flex h-screen overflow-hidden bg-[#060709] text-zinc-100">
            <Sidebar
                currentView={currentView}
                navigate={setCurrentView}
                currentUser={currentUser}
                handleLogout={handleLogout}
                audioEnabled={audioEnabled}
                toggleAudio={() => setAudioEnabled(!audioEnabled)}
            />

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#060709]">
                <Header currentView={currentView} />

                <div className="flex-1 overflow-y-auto p-8 relative z-0">
                    {currentView === 'dashboard' && <Dashboard navigate={setCurrentView} />}
                    {currentView === 'order' && <OrderTerminal onOrderPlaced={setReceiptOrder} playSound={playSound} />}
                    {currentView === 'medicines' && <Medicines />}
                    {currentView === 'customers' && <Customers />}
                    {currentView === 'suppliers' && <Suppliers />}
                    {currentView === 'supply' && <SupplyRestock />}
                    {currentView === 'ai' && <AiPharmacist />}
                    {currentView === 'users' && <Users />}
                </div>
            </main>

            {receiptOrder && (
                <ReceiptModal order={receiptOrder} onClose={() => setReceiptOrder(null)} />
            )}
        </div>
    );
}
