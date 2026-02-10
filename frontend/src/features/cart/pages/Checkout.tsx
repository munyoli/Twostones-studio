import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../../auth/context/AuthContext';
import { orderApi } from '../../../services/api';
import { CreditCard, Smartphone, Wallet } from 'lucide-react';

const Checkout = () => {
    const navigate = useNavigate();
    const { items, total, clearCart } = useCart();
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        shippingAddress: '',
        customerEmail: user?.email || '',
        customerPhone: '',
        paymentMethod: 'manual'
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const response = await orderApi.checkout({
                shippingAddress: formData.shippingAddress,
                paymentMethod: formData.paymentMethod,
                customerEmail: formData.customerEmail,
                customerPhone: formData.customerPhone
            });

            clearCart();
            navigate(`/order-confirmation/${response.data.orderId}`);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Checkout failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    console.log('[Checkout] Items:', items);
    console.log('[Checkout] Total:', total);

    if (!items || items.length === 0) {
        console.warn('[Checkout] No items, redirecting to cart');
        navigate('/cart');
        return null;
    }

    return (
        <div className="min-h-screen pt-32 pb-20 px-6 bg-brand-bg">
            <div className="max-w-6xl mx-auto">
                <header className="mb-12 border-b border-stone-100 pb-8">
                    <h1 className="text-4xl font-serif font-bold text-brand-primary tracking-tight">Checkout</h1>
                    <p className="text-stone-500 mt-2 font-light">Complete your order with excellence</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Checkout Form */}
                    <div>
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Shipping Address */}
                            <section className="bg-white p-8 shadow-sm border border-stone-100">
                                <h2 className="text-xs uppercase tracking-widest font-bold text-brand-primary mb-6">Shipping Address</h2>
                                <textarea
                                    required
                                    rows={4}
                                    value={formData.shippingAddress}
                                    onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                                    className="w-full border border-stone-200 p-4 outline-none focus:border-brand-secondary transition-colors text-brand-primary"
                                    placeholder="Enter your full shipping address including city and postal code"
                                />
                            </section>

                            {/* Contact Information */}
                            <section className="bg-white p-8 shadow-sm border border-stone-100">
                                <h2 className="text-xs uppercase tracking-widest font-bold text-brand-primary mb-6">Contact Information</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 block mb-2">Email</label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.customerEmail}
                                            onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                                            className="w-full border border-stone-200 p-4 outline-none focus:border-brand-secondary transition-colors text-brand-primary"
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 block mb-2">Phone Number</label>
                                        <input
                                            type="tel"
                                            required
                                            value={formData.customerPhone}
                                            onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                                            className="w-full border border-stone-200 p-4 outline-none focus:border-brand-secondary transition-colors text-brand-primary"
                                            placeholder="+254 700 000 000"
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Payment Method */}
                            <section className="bg-white p-8 shadow-sm border border-stone-100">
                                <h2 className="text-xs uppercase tracking-widest font-bold text-brand-primary mb-6">Payment Method</h2>
                                <div className="space-y-3">
                                    <label className={`flex items-center gap-4 p-4 border-2 cursor-pointer transition-all ${formData.paymentMethod === 'manual' ? 'border-brand-secondary bg-stone-50' : 'border-stone-200 hover:border-stone-300'}`}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="manual"
                                            checked={formData.paymentMethod === 'manual'}
                                            onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                                            className="w-4 h-4"
                                        />
                                        <Wallet className="text-brand-secondary" size={20} />
                                        <div className="flex-grow">
                                            <p className="font-bold text-brand-primary">Manual Payment / M-Pesa</p>
                                            <p className="text-xs text-stone-500">Pay via M-Pesa after order confirmation</p>
                                        </div>
                                    </label>

                                    <label className={`flex items-center gap-4 p-4 border-2 cursor-pointer transition-all opacity-50 ${formData.paymentMethod === 'mpesa' ? 'border-brand-secondary bg-stone-50' : 'border-stone-200'}`}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="mpesa"
                                            disabled
                                            className="w-4 h-4"
                                        />
                                        <Smartphone className="text-stone-400" size={20} />
                                        <div className="flex-grow">
                                            <p className="font-bold text-stone-400">M-Pesa STK Push</p>
                                            <p className="text-xs text-stone-400">Coming soon</p>
                                        </div>
                                    </label>

                                    <label className={`flex items-center gap-4 p-4 border-2 cursor-pointer transition-all opacity-50 ${formData.paymentMethod === 'card' ? 'border-brand-secondary bg-stone-50' : 'border-stone-200'}`}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="card"
                                            disabled
                                            className="w-4 h-4"
                                        />
                                        <CreditCard className="text-stone-400" size={20} />
                                        <div className="flex-grow">
                                            <p className="font-bold text-stone-400">Credit / Debit Card</p>
                                            <p className="text-xs text-stone-400">Coming soon</p>
                                        </div>
                                    </label>
                                </div>
                            </section>

                            {/* M-Pesa Payment Details */}
                            {formData.paymentMethod === 'manual' && (
                                <section className="bg-amber-50 border-l-4 border-brand-secondary p-8 shadow-sm">
                                    <h2 className="text-xs uppercase tracking-widest font-bold text-brand-primary mb-4 flex items-center gap-2">
                                        <Smartphone className="text-brand-secondary" size={18} />
                                        M-Pesa Payment Details
                                    </h2>
                                    <p className="text-sm text-stone-600 mb-4">Please complete your M-Pesa payment before placing your order:</p>

                                    <div className="bg-white p-6 rounded border border-stone-200 space-y-3">
                                        <div className="flex justify-between items-center pb-3 border-b border-stone-100">
                                            <span className="text-xs uppercase tracking-widest font-bold text-stone-400">M-Pesa Number</span>
                                            <span className="text-xl font-serif font-bold text-brand-primary">0715961659</span>
                                        </div>
                                        <div className="flex justify-between items-center pb-3 border-b border-stone-100">
                                            <span className="text-xs uppercase tracking-widest font-bold text-stone-400">Amount</span>
                                            <span className="text-xl font-serif font-bold text-brand-primary">KES {total.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs uppercase tracking-widest font-bold text-stone-400">Reference</span>
                                            <span className="text-sm font-medium text-stone-600">Your Name</span>
                                        </div>
                                    </div>

                                    <p className="text-xs text-stone-500 mt-4 italic">
                                        After completing payment, click "Place Order" below. You will receive an email confirmation with your order details.
                                    </p>
                                </section>
                            )}

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-600 p-4 text-sm">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full btn-primary disabled:opacity-50"
                            >
                                {isSubmitting ? 'Processing...' : 'Place Order'}
                            </button>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div>
                        <div className="bg-white p-8 shadow-sm border border-stone-100 sticky top-32">
                            <h2 className="text-xs uppercase tracking-widest font-bold text-brand-primary mb-6 pb-4 border-b border-stone-100">Order Summary</h2>

                            <div className="space-y-6 mb-8">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="w-20 h-28 flex-shrink-0 bg-stone-100 overflow-hidden">
                                            <img
                                                src={item.product.images?.[0]?.image_url}
                                                alt={item.product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-grow">
                                            <h3 className="font-serif font-medium text-sm">{item.product.name}</h3>
                                            <p className="text-xs text-stone-400 mt-1">Qty: {item.quantity}</p>
                                            <p className="font-medium mt-2">KES {Number(item.product.price).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-stone-200 pt-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-stone-500 uppercase tracking-widest text-xs font-medium">Total</span>
                                    <span className="text-2xl font-serif font-bold text-brand-primary">KES {total.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Debug Info (Temporary) */}
                <div className="mt-12 p-4 bg-stone-100 border border-stone-300 rounded text-xs font-mono text-stone-600">
                    <p className="font-bold mb-2">Debug Info:</p>
                    <p>User Authenticated: {user ? 'Yes' : 'No'}</p>
                    <p>User Email: {user?.email}</p>
                    <p>Token in Storage: {localStorage.getItem('token') ? 'Yes' : 'No'}</p>
                    <p>Token Preview: {localStorage.getItem('token')?.substring(0, 10)}...</p>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
