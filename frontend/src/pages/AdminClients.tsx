import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { Search, Edit, Trash2, X, Save } from 'lucide-react';
import { useState } from 'react';

const AdminClients = () => {
    const [search, setSearch] = useState('');
    const [editingClient, setEditingClient] = useState<any>(null);
    const queryClient = useQueryClient();

    const { data: clients, isLoading } = useQuery({
        queryKey: ['admin-clients', search],
        queryFn: () => api.get(`/admin/clients?search=${search}`).then(res => res.data)
    });

    const updateMutation = useMutation({
        mutationFn: (data: any) => api.put(`/admin/clients/${data.id}`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-clients'] });
            setEditingClient(null);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => api.delete(`/admin/clients/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-clients'] })
    });

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this client?')) {
            deleteMutation.mutate(id);
        }
    };

    if (isLoading) return <div className="p-20 text-center text-stone-300 animate-pulse">Synchronizing records...</div>;

    if (!isLoading && clients?.length === 0 && !search) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-center h-[500px]">
                <div className="w-32 h-32 mb-6 overflow-hidden rounded-full border-4 border-white shadow-xl relative bg-stone-200">
                    <img src="/images/models/heritage-01.svg" alt="Heritage" className="w-full h-full object-cover opacity-80" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-brand-primary mb-2">Client Registry Empty</h3>
                <p className="text-stone-500 max-w-xs mx-auto text-sm leading-relaxed">
                    The sanctuary is open. Awaiting the first members of the tribe.
                </p>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-serif font-bold">Client Directory</h3>
                <div className="relative w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:border-brand-secondary outline-none transition-colors"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-stone-100 text-[10px] uppercase tracking-widest text-stone-400 font-bold">
                            <th className="pb-4 font-bold">Client Info</th>
                            <th className="pb-4 font-bold">Measurements</th>
                            <th className="pb-4 font-bold">Joined</th>
                            <th className="pb-4 text-right font-bold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-50">
                        {clients?.map((client: any) => (
                            <tr key={client.id} className="group hover:bg-stone-50/50 transition-colors">
                                <td className="py-5">
                                    <div className="font-medium text-brand-primary">{client.name}</div>
                                    <div className="text-xs text-stone-400">{client.email}</div>
                                </td>
                                <td className="py-5">
                                    <div className="text-xs space-x-2 text-stone-500">
                                        <span>B: {client.measurements?.bust || '-'}</span>
                                        <span>W: {client.measurements?.waist || '-'}</span>
                                        <span>H: {client.measurements?.hips || '-'}</span>
                                        <span>L: {client.measurements?.length || '-'}</span>
                                    </div>
                                </td>
                                <td className="py-5 text-sm text-stone-400">
                                    {new Date(client.createdAt).toLocaleDateString()}
                                </td>
                                <td className="py-5 text-right space-x-2">
                                    <button
                                        onClick={() => setEditingClient(client)}
                                        className="p-2 text-stone-400 hover:text-brand-primary transition-colors"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(client.id)}
                                        className="p-2 text-stone-400 hover:text-brand-accent transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            {editingClient && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-brand-primary/20 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-slide-up">
                        <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50">
                            <h4 className="text-lg font-serif font-bold">Edit Client: {editingClient.name}</h4>
                            <button onClick={() => setEditingClient(null)} className="text-stone-400 hover:text-brand-primary">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-8 grid grid-cols-2 gap-6">
                            <div className="col-span-1">
                                <label className="block text-[10px] uppercase tracking-widest text-stone-400 mb-2 font-bold">Full Name</label>
                                <input
                                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-brand-secondary"
                                    value={editingClient.name}
                                    onChange={(e) => setEditingClient({ ...editingClient, name: e.target.value })}
                                />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-[10px] uppercase tracking-widest text-stone-400 mb-2 font-bold">Email Address</label>
                                <input
                                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-brand-secondary"
                                    value={editingClient.email}
                                    onChange={(e) => setEditingClient({ ...editingClient, email: e.target.value })}
                                />
                            </div>

                            <div className="col-span-2 mt-4">
                                <h5 className="text-xs uppercase tracking-widest text-brand-secondary font-bold mb-4">Measurements (Inches)</h5>
                                <div className="grid grid-cols-3 gap-4">
                                    {['bust', 'waist', 'hips', 'shoulder', 'length'].map((key) => (
                                        <div key={key}>
                                            <label className="block text-[10px] uppercase tracking-widest text-stone-400 mb-1 font-bold">{key}</label>
                                            <input
                                                className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-brand-secondary"
                                                value={editingClient.measurements?.[key] || ''}
                                                onChange={(e) => setEditingClient({
                                                    ...editingClient,
                                                    measurements: { ...editingClient.measurements, [key]: e.target.value }
                                                })}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="col-span-2">
                                <label className="block text-[10px] uppercase tracking-widest text-stone-400 mb-2 font-bold">Notes</label>
                                <textarea
                                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-brand-secondary h-20"
                                    value={editingClient.measurements?.notes || ''}
                                    onChange={(e) => setEditingClient({
                                        ...editingClient,
                                        measurements: { ...editingClient.measurements, notes: e.target.value }
                                    })}
                                />
                            </div>
                        </div>
                        <div className="p-6 bg-stone-50 border-t border-stone-100 flex justify-end gap-3">
                            <button onClick={() => setEditingClient(null)} className="px-6 py-2 text-stone-500 font-medium hover:bg-stone-100 transition-colors rounded-lg">Cancel</button>
                            <button
                                onClick={() => updateMutation.mutate(editingClient)}
                                className="px-6 py-2 bg-brand-primary text-white font-medium hover:bg-brand-accent transition-colors flex items-center gap-2 rounded-lg"
                            >
                                <Save size={18} /> Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminClients;
