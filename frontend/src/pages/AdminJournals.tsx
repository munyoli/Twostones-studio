import { useQuery } from '@tanstack/react-query';
import { journalApi } from '../services/api'; // Ensure you have this export in api.ts
import { Download, Search, Loader, Calendar, User } from 'lucide-react';
import { useState } from 'react';

const AdminJournals = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const { data: reflections, isLoading, isError } = useQuery({
        queryKey: ['admin-reflections'],
        queryFn: () => journalApi.getAllReflections().then(res => res.data),
    });

    const searchLower = searchTerm.toLowerCase();
    const filteredReflections = reflections?.filter((r: any) =>
        (r.User?.name || '').toLowerCase().includes(searchLower) ||
        (r.entry?.title || '').toLowerCase().includes(searchLower)
    );

    const handleExport = (id: string, userName: string) => {
        // Direct download link

        // We need to pass the token since it's an authenticated route, but for a direct link check we might need a blob approach
        // or just use window.open if the browser handles headers correctly. 
        // Actually, since it's a secured route, `window.open` might fail auth.
        // Best practice: Fetch as blob using axios, then download.

        // For simplicity in this protected admin layout, we will assume generic fetch with auth header works:
        // Let's implement a proper download handler using the API instance

        // Actually, let's use a specialized fetch logic here or just rely on the user being logged in?
        // No, 'window.open' won't send the Authorization header by default unless cookies are used.
        // Since we use localStorage Bearer token, we MUST use axios/fetch to get the blob.

        downloadPDF(id, userName);
    };

    const downloadPDF = async (id: string, userName: string) => {
        try {
            // We use the raw axios instance or a helper that already has the interceptor
            // We can't use the URL directly in href because of Auth headers.
            const response = await fetch(journalApi.exportPDF(id), {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) throw new Error('Download failed');

            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = `Reflection-${userName}-${id}.pdf`;
            document.body.appendChild(link);
            link.click();
            window.URL.revokeObjectURL(downloadUrl);
            document.body.removeChild(link);
        } catch (error) {
            console.error(error);
            alert('Failed to download PDF');
        }
    };

    if (isLoading) return <div className="flex justify-center items-center h-full"><Loader className="animate-spin text-brand-primary" /></div>;
    if (isError) return <div className="p-10 text-red-500">Error loading reflections.</div>;

    return (
        <div className="p-8 h-full flex flex-col">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-serif font-bold text-brand-primary">Journal Reflections</h2>
                    <p className="text-stone-500 text-sm">Review, meditate on, and export client reflections.</p>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by client or topic..."
                        className="pl-10 pr-4 py-2 border border-stone-200 rounded-lg outline-none focus:border-brand-primary text-sm w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-lg border border-stone-200 flex-grow overflow-auto shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-stone-50 sticky top-0 z-10">
                        <tr>
                            <th className="p-4 text-[10px] uppercase tracking-widest text-stone-500 font-bold border-b border-stone-200">Reflected On</th>
                            <th className="p-4 text-[10px] uppercase tracking-widest text-stone-500 font-bold border-b border-stone-200">Client</th>
                            <th className="p-4 text-[10px] uppercase tracking-widest text-stone-500 font-bold border-b border-stone-200">Prompt / Topic</th>
                            <th className="p-4 text-[10px] uppercase tracking-widest text-stone-500 font-bold border-b border-stone-200">Reflection Snippet</th>
                            <th className="p-4 text-[10px] uppercase tracking-widest text-stone-500 font-bold border-b border-stone-200 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                        {filteredReflections?.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-20 text-center text-stone-400">
                                    No reflections found. The scrolls are empty.
                                </td>
                            </tr>
                        ) : filteredReflections?.map((r: any) => (
                            <tr key={r.id} className="hover:bg-stone-50/50 transition-colors group">
                                <td className="p-4 text-xs font-medium text-stone-500 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} />
                                        {new Date(r.createdAt).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="p-4 text-sm font-bold text-brand-primary">
                                    <div className="flex items-center gap-2">
                                        <User size={14} className="text-stone-400" />
                                        {r.User?.name || 'Unknown'}
                                        <span className="text-[10px] font-normal text-stone-400 ml-1">({r.User?.email})</span>
                                    </div>
                                </td>
                                <td className="p-4 text-sm font-serif italic text-stone-700">
                                    {r.entry?.title}
                                </td>
                                <td className="p-4 max-w-xs truncate text-stone-500 text-xs">
                                    "{r.reflection_text}"
                                </td>
                                <td className="p-4 text-right">
                                    <button
                                        onClick={() => handleExport(r.id, r.User?.name)}
                                        className="text-brand-secondary hover:text-brand-primary transition-colors flex items-center gap-1 ml-auto text-xs font-bold uppercase tracking-wider border border-brand-secondary/20 px-3 py-1 rounded hover:bg-brand-secondary/5"
                                    >
                                        <Download size={14} /> Export PDF
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminJournals;
