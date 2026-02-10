import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { Package, Clock, CheckCircle, Truck, DollarSign, AlertCircle } from 'lucide-react';
import { useState } from 'react';

const AdminOrders = () => {
    const queryClient = useQueryClient();
    const [confirmingPayment, setConfirmingPayment] = useState<number | null>(null);

    const { data: orders, isLoading } = useQuery({
        queryKey: ['admin-orders'],
        queryFn: () => api.get('/admin/orders').then(res => res.data)
    });

    const statusMutation = useMutation({
        mutationFn: (data: { id: number, status: string }) => api.patch(`/admin/orders/${data.id}/status`, { status: data.status }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
    });

    const markPaidMutation = useMutation({
        mutationFn: (orderId: number) => api.put(`/admin/orders/${orderId}/mark-paid`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
            setConfirmingPayment(null);
        }
    });

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return <Clock className="text-amber-500" size={16} />;
            case 'processing': return <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />;
            case 'shipped': return <Truck className="text-sky-500" size={16} />;
            case 'delivered': return <CheckCircle className="text-emerald-500" size={16} />;
            default: return <Package className="text-stone-400" size={16} />;
        }
    };

    const getPaymentStatusBadge = (paymentStatus: string) => {
        switch (paymentStatus) {
            case 'paid':
                return <span className="px-2 py-1 bg-green-100 text-green-700 text-[9px] uppercase tracking-widest font-bold rounded">Paid</span>;
            case 'unpaid':
                return <span className="px-2 py-1 bg-amber-100 text-amber-700 text-[9px] uppercase tracking-widest font-bold rounded">Pending</span>;
            case 'refunded':
                return <span className="px-2 py-1 bg-red-100 text-red-700 text-[9px] uppercase tracking-widest font-bold rounded">Refunded</span>;
            default:
                return <span className="px-2 py-1 bg-stone-100 text-stone-500 text-[9px] uppercase tracking-widest font-bold rounded">Unknown</span>;
        }
    };

    if (isLoading) return <div className="p-20 text-center text-stone-300 animate-pulse">Loading order stream...</div>;

    return (
        <div className="p-8">
            <h3 className="text-xl font-serif font-bold mb-8">Order Stream</h3>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-stone-100 text-[10px] uppercase tracking-widest text-stone-400 font-bold">
                            <th className="pb-4 font-bold">Order ID</th>
                            <th className="pb-4 font-bold">Customer</th>
                            <th className="pb-4 font-bold">Items</th>
                            <th className="pb-4 font-bold">Total</th>
                            <th className="pb-4 font-bold">Payment</th>
                            <th className="pb-4 font-bold">Status</th>
                            <th className="pb-4 text-right font-bold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-50">
                        {orders?.map((order: any) => (
                            <tr key={order.id} className="group hover:bg-stone-50/50 transition-colors">
                                <td className="py-5 font-medium text-xs text-stone-500 uppercase">#{order.id.toString().padStart(6, '0')}</td>
                                <td className="py-5">
                                    <div className="text-sm font-medium text-brand-primary">{order.user?.name}</div>
                                    <div className="text-[10px] text-stone-400">{order.customer_email || order.user?.email}</div>
                                    {order.customer_phone && <div className="text-[10px] text-stone-400">{order.customer_phone}</div>}
                                </td>
                                <td className="py-5">
                                    <div className="text-xs text-stone-500">{order.items?.length} Items</div>
                                    <div className="text-[9px] text-stone-400 uppercase">{order.payment_method || 'manual'}</div>
                                </td>
                                <td className="py-5 text-sm font-bold text-brand-primary">
                                    KES {Number(order.total_amount).toLocaleString()}
                                </td>
                                <td className="py-5">
                                    {getPaymentStatusBadge(order.payment_status)}
                                </td>
                                <td className="py-5">
                                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold">
                                        {getStatusIcon(order.status)}
                                        <span>{order.status}</span>
                                    </div>
                                </td>
                                <td className="py-5 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        {order.payment_status === 'unpaid' && (
                                            confirmingPayment === order.id ? (
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => markPaidMutation.mutate(order.id)}
                                                        className="text-[9px] uppercase tracking-widest font-bold bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 transition-colors"
                                                    >
                                                        Confirm
                                                    </button>
                                                    <button
                                                        onClick={() => setConfirmingPayment(null)}
                                                        className="text-[9px] uppercase tracking-widest font-bold bg-stone-200 text-stone-600 px-3 py-2 rounded hover:bg-stone-300 transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setConfirmingPayment(order.id)}
                                                    className="text-[9px] uppercase tracking-widest font-bold bg-brand-secondary text-white px-3 py-2 rounded hover:bg-brand-primary transition-colors flex items-center gap-1"
                                                >
                                                    <DollarSign size={12} />
                                                    Mark Paid
                                                </button>
                                            )
                                        )}
                                        <select
                                            className="text-[10px] uppercase tracking-widest font-bold bg-stone-100 border-none outline-none p-2 rounded cursor-pointer hover:bg-stone-200 transition-colors"
                                            value={order.status}
                                            onChange={(e) => statusMutation.mutate({ id: order.id, status: e.target.value })}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="processing">Processing</option>
                                            <option value="paid">Paid</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {(!orders || orders.length === 0) && (
                    <div className="text-center py-20">
                        <AlertCircle className="mx-auto text-stone-300 mb-4" size={48} />
                        <p className="text-stone-400 font-light italic">No orders yet</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminOrders;
