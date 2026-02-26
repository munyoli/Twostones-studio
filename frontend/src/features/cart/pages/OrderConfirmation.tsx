import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../../../services/api';

const OrderConfirmation = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/orders/${orderId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setOrder(response.data);
            } catch (error) {
                console.error('Error fetching order:', error);
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            fetchOrder();
        }
    }, [orderId]);

    if (loading) {
        return (
            <div className="min-h-screen pt-32 flex items-center justify-center">
                <p className="text-stone-500">Loading order details...</p>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen pt-32 flex flex-col items-center justify-center text-center px-6">
                <h1 className="text-3xl font-serif font-bold text-stone-300 mb-4">Order Not Found</h1>
                <Link to="/" className="btn-primary">Return Home</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-20 px-6 bg-brand-bg">
            <div className="max-w-3xl mx-auto">
                {/* Success Header */}
                <div className="text-center mb-12">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={40} />
                    </div>
                    <h1 className="text-4xl font-serif font-bold text-brand-primary mb-4">Order Received</h1>
                    <p className="text-stone-500 font-light">Thank you for choosing Twostones. Your order has been placed successfully.</p>
                </div>

                {/* Order Details */}
                <div className="bg-white p-8 shadow-sm border border-stone-100 mb-8">
                    <div className="flex items-center gap-3 mb-6 pb-6 border-b border-stone-100">
                        <Package className="text-brand-secondary" size={24} />
                        <h2 className="text-xl font-serif font-bold text-brand-primary">Order #{order.id}</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-1">Order Date</p>
                            <p className="text-brand-primary">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-1">Total Amount</p>
                            <p className="text-2xl font-serif font-bold text-brand-primary">KES {Number(order.total_amount).toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-2">Shipping Address</p>
                        <p className="text-stone-600 whitespace-pre-line">{order.shipping_address}</p>
                    </div>
                </div>

                {/* Payment Confirmation */}
                {order.payment_method === 'manual' && (
                    <div className="bg-green-50 border-l-4 border-green-500 p-8 mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <CheckCircle className="text-green-600" size={24} />
                            <h3 className="text-lg font-serif font-bold text-brand-primary">Payment Received</h3>
                        </div>
                        <p className="text-stone-600 mb-4">Thank you for your payment. Your order has been confirmed and will be processed within 2-3 business days.</p>

                        <p className="text-sm text-stone-500 italic">
                            We will send you a shipping confirmation with tracking details once your order is dispatched.
                        </p>
                    </div>
                )}

                {/* Email Confirmation Notice */}
                <div className="bg-stone-50 p-6 text-center mb-8">
                    <p className="text-stone-600">
                        <strong>Order confirmation sent to:</strong> {order.customer_email}
                    </p>
                    <p className="text-xs text-stone-400 mt-2">Please check your inbox for order details and payment instructions.</p>
                </div>

                {/* Actions */}
                <div className="flex gap-4 justify-center">
                    <Link to="/profile" className="btn-primary">
                        View My Orders
                    </Link>
                    <Link to="/" className="px-8 py-4 border border-stone-300 font-bold uppercase tracking-widest text-[10px] hover:border-brand-primary hover:text-brand-primary transition-all">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;
