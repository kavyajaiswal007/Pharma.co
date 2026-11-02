import React from 'react';

export default function ReceiptModal({ order, onClose }) {
    if (!order) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 glass-modal-backdrop">
            <div id="receipt-modal-content" className="glass-modal-sheet max-w-sm w-full p-6">
                {/* Header */}
                <div className="text-center pb-4 border-b border-white/[0.12]">
                    <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-white/[0.08] border border-white/[0.18] flex items-center justify-center">
                        <i data-lucide="pill" className="w-5 h-5 text-emerald-400"></i>
                    </div>
                    <h2 className="text-base font-bold tracking-tight text-white uppercase">
                        pharma<span className="text-emerald-400">.Co</span>
                    </h2>
                    <p className="text-[11px] text-zinc-400">Clinical Dispensary &amp; Wellness OS</p>
                    <div className="mt-2 inline-block px-2.5 py-0.5 glass-well text-zinc-300 font-mono text-[11px] font-semibold">
                        ORDER #{order.id}
                    </div>
                </div>

                {/* Metadata */}
                <div className="py-3 border-b border-white/[0.08] text-xs space-y-1 text-zinc-300">
                    <div className="flex justify-between">
                        <span className="text-zinc-500">Timestamp:</span>
                        <span className="font-mono text-[11px]">{order.orderDate} {order.orderTime || ''}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-zinc-500">Member:</span>
                        <span className="font-medium text-white">{order.customer?.name || 'Walk-in Retail'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-zinc-500">Dispenser:</span>
                        <span className="font-mono text-zinc-300">{order.user?.username || 'admin'}</span>
                    </div>
                </div>

                {/* Line Items */}
                <div className="py-3 border-b border-white/[0.08]">
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="text-[10px] uppercase font-mono text-zinc-500 text-left border-b border-white/[0.06]">
                                <th className="pb-1.5">Item</th>
                                <th className="pb-1.5 text-center">Qty</th>
                                <th className="pb-1.5 text-right">Rate</th>
                                <th className="pb-1.5 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(order.items || []).map((item, idx) => (
                                <tr key={idx} className="border-b border-white/5">
                                    <td className="py-1.5 font-medium text-white">{item.medicine?.medName || 'Medicine'}</td>
                                    <td className="py-1.5 text-center font-mono text-zinc-300">{item.qty}</td>
                                    <td className="py-1.5 text-right font-mono text-zinc-300">{Number(item.unitPrice).toFixed(2)}</td>
                                    <td className="py-1.5 text-right font-mono font-semibold text-white">{Number(item.lineTotal).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totals */}
                <div className="py-3 border-b border-white/[0.08] text-xs space-y-1.5 font-mono">
                    <div className="flex justify-between text-zinc-400">
                        <span>Subtotal:</span>
                        <span className="text-zinc-200">Rs. {Number(order.subTotal || 0).toFixed(2)}</span>
                    </div>
                    {order.discount > 0 && (
                        <div className="flex justify-between text-emerald-400 font-medium">
                            <span>Promo Discount:</span>
                            <span>-Rs. {Number(order.discount).toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between font-bold text-sm text-white pt-1 border-t border-white/[0.08]">
                        <span>Grand Total:</span>
                        <span className="text-emerald-400">Rs. {Number(order.total || 0).toFixed(2)}</span>
                    </div>
                    {order.payment && (
                        <>
                            <div className="flex justify-between text-zinc-400 pt-1 text-[11px]">
                                <span>Tendered ({order.payment.paymentMethod || 'Cash'}):</span>
                                <span className="text-zinc-300">Rs. {Number(order.payment.cashReceived || order.total).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-zinc-300 font-semibold text-[11px]">
                                <span>Change Returned:</span>
                                <span className="text-emerald-400">Rs. {Number(order.payment.balanceChange || 0).toFixed(2)}</span>
                            </div>
                        </>
                    )}
                </div>

                {/* Clinical Note */}
                <div className="py-2.5 text-center glass-well my-2.5 p-2">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">Clinical Prescription Advisory</p>
                    <p className="text-[11px] text-zinc-300 italic mt-0.5">{order.funHealthTip || 'Follow prescription guidelines & stay hydrated.'}</p>
                </div>

                {/* Print Buttons */}
                <div className="mt-4 grid grid-cols-2 gap-2 no-print">
                    <button onClick={() => window.print()} className="glass-btn-primary py-2 text-xs font-semibold">
                        <i data-lucide="printer" className="w-3.5 h-3.5"></i>
                        <span>Print Bill</span>
                    </button>
                    <button onClick={onClose} className="glass-btn-secondary py-2 text-xs">
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}
