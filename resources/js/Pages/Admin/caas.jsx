import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { Head, router } from '@inertiajs/react';
import { createPortal } from 'react-dom';
import * as XLSX from 'xlsx';

// Components
import UnderwaterEffect from '@components/UnderwaterEffect';
import background from '@assets/backgrounds/AssistantBackground.png';
import ButtonSidebar from '@components/ButtonSidebar';
import ButtonHome from '@components/ButtonHome';
import AdminSidebar from '@components/AdminSidebar';

// Icons
import { 
    PencilSquareIcon, TrashIcon, EyeIcon, PlusIcon, 
    ChevronLeftIcon, ChevronRightIcon, ArrowDownTrayIcon, 
    ArrowUpTrayIcon, MagnifyingGlassIcon, ArrowsUpDownIcon, 
    ChevronUpIcon, ChevronDownIcon, ListBulletIcon, 
    TableCellsIcon, UserGroupIcon, XMarkIcon ,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

// --- THEMED STAT CARD (Sharp UI) ---
const StatCard = ({ label, value, type }) => {
    const isTotal = type === 'total';
    return (
        <div className={`
            relative overflow-hidden rounded-sm p-4 flex items-center gap-4 group
            border-double border-4 backdrop-blur-md transition-all duration-500 flex-1
            ${isTotal 
                ? 'bg-[#0f1c2e]/60 border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.1)] hover:border-cyan-400/50' 
                : 'bg-[#0f1c2e]/60 border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.1)] hover:border-amber-400/50'}
        `}>
            <div className={`absolute -right-8 -top-8 w-24 h-24 rounded-full blur-[50px] opacity-20 transition-opacity group-hover:opacity-40 ${isTotal ? 'bg-cyan-500' : 'bg-amber-500'}`} />
            <div className={`w-10 h-10 border border-white/10 flex items-center justify-center relative z-10 rotate-45 group-hover:rotate-0 transition-transform duration-500 ${isTotal ? 'bg-cyan-900/30 text-cyan-200' : 'bg-amber-900/30 text-amber-200'}`}>
                <div className="-rotate-45 group-hover:rotate-0 transition-transform duration-500">
                    <UserGroupIcon className="w-5 h-5" />
                </div>
            </div>
            <div className="flex flex-col relative z-10">
                <span className={`text-[10px] font-serif font-bold uppercase tracking-[0.2em] ${isTotal ? 'text-cyan-200/60' : 'text-amber-200/60'}`}>{label}</span>
                <span className="text-2xl font-serif text-white tracking-wide">{value}</span>
            </div>
        </div>
    );
};

export default function Caas() {
    const backgroundRef = useRef(null);
    const fileInputRef = useRef(null);
    
    // --- UI & Cinematic States ---
    const [showImage, setShowImage] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isZooming, setIsZooming] = useState(true);
    const [inputLocked, setInputLocked] = useState(true);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // --- View State ---
    const [viewMode, setViewMode] = useState('regular'); 
    const ITEMS_PER_PAGE = viewMode === 'small' ? 10 : 5; 
    const stateOptions = ["Administration", "Coding and Writing Test", "Interview", "Grouping Task", "Teaching Test", "Rising"];

    // --- Data States ---
    const [caasList, setCaasList] = useState([
        { id: '10101230001', name: 'Muhammad Hafiz', email: 'hafiz@student.telkom.co.id', password: '123', major: 'Teknik Elektro', class: 'EL-45-01', state: 'Rising', status: 'Passed' },
        { id: '10101230002', name: 'Stevannie Pratama', email: 'stev@student.telkom.co.id', password: '123', major: 'Teknik Telekomunikasi', class: 'TT-45-02', state: 'Interview', status: 'Failed' },
    ]);

    // --- Table UI States ---
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [jumpPage, setJumpPage] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });

    // --- Modals ---
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null });
    const [currentFormData, setCurrentFormData] = useState(null);
    const [viewData, setViewData] = useState(null);

    const closeAllModals = useCallback(() => {
        setIsFormOpen(false);
        setIsViewOpen(false);
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
    }, []);

    // --- Listeners ---
    useEffect(() => {
        const showTimer = setTimeout(() => setShowImage(true), 300);
        const zoomTimer = setTimeout(() => { setIsZooming(false); setInputLocked(false); }, 100);
        const skipIntro = () => {
            clearTimeout(showTimer); clearTimeout(zoomTimer);
            setShowImage(true); setIsZooming(false); setInputLocked(false);
        };
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                if (isFormOpen || isViewOpen || confirmModal.isOpen) closeAllModals();
                else skipIntro();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('click', skipIntro);
        return () => {
            clearTimeout(showTimer); clearTimeout(zoomTimer);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('click', skipIntro);
        };
    }, [isFormOpen, isViewOpen, confirmModal.isOpen, closeAllModals]);

    // --- Sorting & Filtering Logic ---
    const filteredAndSortedData = useMemo(() => {
        let items = [...caasList];
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            items = items.filter(s => s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q) || s.major.toLowerCase().includes(q));
        }
        if (sortConfig.key) {
            items.sort((a, b) => {
                const aVal = a[sortConfig.key] || '';
                const bVal = b[sortConfig.key] || '';
                if (aVal < bVal) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        return items;
    }, [caasList, sortConfig, searchQuery]);

    const totalPages = Math.max(1, Math.ceil(filteredAndSortedData.length / ITEMS_PER_PAGE));
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredAndSortedData.slice(start, start + ITEMS_PER_PAGE);
    }, [currentPage, filteredAndSortedData, ITEMS_PER_PAGE]);

    const requestSort = (key) => {
        let direction = sortConfig.key === key && sortConfig.direction === 'ascending' ? 'descending' : 'ascending';
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return <ArrowsUpDownIcon className="w-4 h-4 text-white/20" />;
        return sortConfig.direction === 'ascending' ? <ChevronUpIcon className="w-4 h-4 text-cyan-400" /> : <ChevronDownIcon className="w-4 h-4 text-cyan-400" />;
    };

    const getStatusColor = (status) => {
        if (status === 'Passed') return 'text-emerald-400 border-emerald-500/30 bg-emerald-900/20';
        return 'text-rose-400 border-rose-500/30 bg-rose-900/20';
    };

    // --- Actions ---
    const handleSave = (e) => {
        e.preventDefault();
        const existingIndex = caasList.findIndex(c => c.id === currentFormData.id);
        if (existingIndex >= 0) setCaasList(prev => prev.map(c => c.id === currentFormData.id ? currentFormData : c));
        else setCaasList(prev => [...prev, currentFormData]);
        setIsFormOpen(false);
    };

    const handleDelete = (id) => {
        setConfirmModal({
            isOpen: true,
            title: 'Delete Record',
            message: `Permanently delete subject ${id}?`,
            onConfirm: () => {
                setCaasList(prev => prev.filter(c => c.id !== id));
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    const handleExportExcel = () => {
        const exportData = caasList.map(c => ({
            id: c.id, name: c.name, email: c.email, major: c.major, class: c.class, stage: c.state, result: c.status
        }));
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "CaAs");
        XLSX.writeFile(workbook, "CaAs_Manifest_Archive.xlsx");
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, { type: 'binary' });
            const data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
            const newEntries = data.map(row => ({
                id: String(row.id || row.ID || row.nim || row.NIM || Date.now()),
                name: row.name || row.Name || 'Unknown',
                email: row.email || row.Email || '',
                major: row.major || row.Major || '-',
                class: row.class || row.Class || '-',
                password: String(row.id || row.ID || '123'),
                state: 'Administration',
                status: 'Passed'
            }));
            setCaasList(prev => [...prev, ...newEntries]);
        };
        reader.readAsBinaryString(file);
        e.target.value = null;
    };

    const handleJumpPage = (e) => {
        if (e.key === 'Enter') {
            const pageNum = parseInt(jumpPage);
            if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) setCurrentPage(pageNum);
            setJumpPage('');
        }
    };

    const handleLogout = () => {
        setInputLocked(true);
        setIsSidebarOpen(false);
        setTimeout(() => {
            setIsLoggingOut(true);
            setTimeout(() => router.visit('/'), 300); 
        }, 350);
    };

    const styles = `
        @keyframes subtlePulse { 0%,100% { opacity:1 } 50% { opacity:.95 } }
        .cold-blue-filter { filter: brightness(0.9) contrast(1.1) saturate(1.2) hue-rotate(15deg) sepia(0.1); }
        .pulse-effect { animation: subtlePulse 3s ease-in-out infinite; }
        .atlantean-panel { background: rgba(15, 28, 46, 0.75); backdrop-filter: blur(12px); border: 4px double rgba(6, 182, 212, 0.3); }
        .input-etched { background: rgba(0,0,0,0.2); border-bottom: 2px solid rgba(255,255,255,0.1); color: white; transition: all 0.3s; padding: 12px; }
        .input-etched:focus { outline: none; border-bottom-color: #22d3ee; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(6, 182, 212, 0.4); border-radius: 3px; }
        @keyframes popIn { 0% { opacity: 0; transform: scale(0.95); } 100% { opacity: 1; transform: scale(1); } }
        .animate-popIn { animation: popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
    `;

    return (
        <>
            <Head title="CaAs Management" />
            <style>{styles}</style>
            
            <div className="fixed inset-0 w-full h-full bg-[#0a2a4a] text-white overflow-hidden font-sans">

                {/* BACKGROUND */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <img 
                        ref={backgroundRef} src={background} alt="bg" 
                        onLoad={() => setImageLoaded(true)}
                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-1500 ease-out ${showImage && imageLoaded ? 'opacity-100' : 'opacity-0'} ${!isZooming ? 'pulse-effect' : ''} cold-blue-filter`} 
                        style={{ transform: showImage && imageLoaded ? (isZooming ? 'scale(1.5)' : 'scale(1.0)') : 'scale(1.3)', transformOrigin: 'center' }} 
                    />
                    <UnderwaterEffect />
                    <div className={`absolute inset-0 bg-linear-to-b from-black/25 via-transparent to-black/30 transition-opacity duration-1000 ${showImage && imageLoaded ? 'opacity-100' : 'opacity-0'}`} />
                </div>

                {/* MAIN CONTENT AREA */}
                <div className={`absolute inset-0 z-10 flex flex-col items-center justify-center p-4 md:p-8 transition-all duration-1000 ${isZooming ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                    
                    <div className="text-center relative z-10 mb-8 w-full max-w-7xl flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
                        <div className="text-center md:text-left">
                            <h1 className="text-5xl md:text-7xl font-bold leading-tight" style={{ fontFamily: 'Cormorant Infant, serif', textShadow: '0 2px 20px rgba(0,0,0,.8)' }}>
                                CaAs Management
                            </h1>
                            <p className="text-sm text-cyan-400/80 font-serif tracking-[0.3em] uppercase mt-1">Find the true gem</p>
                        </div>
                        <div className="flex gap-4 w-full md:w-auto">
                            <StatCard label="Total Subjects" value={caasList.length} type="total" />
                        </div>
                    </div>

                    <div className="w-full max-w-7xl">
                        {/* Control Header */}
                        <div className="atlantean-panel p-6 flex flex-col xl:flex-row justify-between items-center gap-6 rounded-t-2xl">
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => {
                                        setCurrentFormData({ id: '', name: '', email: '', password: '', major: '', class: '', state: 'Administration', status: 'Passed' }); 
                                        setIsFormOpen(true);
                                    }} 
                                    className="px-6 py-3 bg-cyan-600/80 border border-cyan-400/50 hover:bg-cyan-500 rounded-sm font-serif font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg transition-all text-xs"
                                >
                                    <PlusIcon className="w-4 h-4" /> 
                                    New CaAs
                                </button>
                                <button 
                                    onClick={() => 
                                        setConfirmModal({
                                            isOpen: true,
                                            title: 'Import CaAs',
                                            message: `Do you want to import CaAs?`,
                                            onConfirm: () => {
                                                fileInputRef.current.click();
                                                closeAllModals();
                                            }
                                        })
                                    }
                                    className="p-3 border border-blue-500/40 text-blue-300 rounded-sm hover:bg-blue-900/20 transition-all"
                                >
                                    <ArrowUpTrayIcon className="w-5 h-5" />
                                </button>
                                <button 
                                    onClick={handleExportExcel} 
                                    className="p-3 border border-emerald-500/40 text-emerald-300 rounded-sm hover:bg-emerald-900/20 transition-all"
                                >
                                    <ArrowDownTrayIcon className="w-5 h-5" />
                                </button>
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    onChange={handleFileChange} 
                                    accept=".xlsx, .xls" 
                                    className="hidden" 
                                />
                            </div>
                            
                            <div className="flex flex-wrap items-center justify-center gap-4">
                                <div className="bg-black/30 p-1 rounded-sm border border-white/10 flex">
                                    <button onClick={() => setViewMode('regular')} className={`p-2 rounded-sm transition-all ${viewMode === 'regular' ? 'bg-cyan-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'text-white/40 hover:text-white'}`}><TableCellsIcon className="w-5 h-5" /></button>
                                    <button onClick={() => setViewMode('small')} className={`p-2 rounded-sm transition-all ${viewMode === 'small' ? 'bg-cyan-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'text-white/40 hover:text-white'}`}><ListBulletIcon className="w-5 h-5" /></button>
                                </div>

                                <div className="relative group w-48 md:w-64" onClick={(e) => e.stopPropagation()}>
                                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-500/50" />
                                    <input type="text" placeholder="Search manifest..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-black/30 border border-white/10 rounded-sm pl-10 pr-4 py-2.5 text-xs text-cyan-100 focus:outline-none focus:border-cyan-500/50 transition-all tracking-widest" />
                                </div>
                            </div>
                        </div>

                        {/* Table Body */}
                        <div className="atlantean-panel flex flex-col border-t-0 rounded-b-2xl overflow-hidden">
                            <div className="overflow-x-auto custom-scrollbar">
                                <table className="w-full text-left border-collapse min-w-[950px]">
                                    <thead className="bg-[#0f1c2e]/95 sticky top-0 z-10 border-b border-white/10 text-cyan-100/70 font-serif text-[10px] md:text-xs uppercase tracking-widest">
                                        <tr>
                                            <th className="p-4 w-16 pl-8">#</th>
                                            <th className="p-4 cursor-pointer hover:text-cyan-400" onClick={() => requestSort('name')}>Identity {getSortIcon('name')}</th>
                                            <th className="p-4 cursor-pointer hover:text-cyan-400" onClick={() => requestSort('major')}>Major {getSortIcon('major')}</th>
                                            <th className="p-4 cursor-pointer hover:text-cyan-400" onClick={() => requestSort('status')}>Status {getSortIcon('status')}</th>
                                            <th className="p-4 cursor-pointer hover:text-cyan-400" onClick={() => requestSort('state')}>Stage {getSortIcon('state')}</th>
                                            <th className="p-4 pr-8 text-center">Manage</th>
                                        </tr>
                                    </thead>
                                    <tbody className="font-sans">
                                        {paginatedData.map((item, index) => (
                                            <tr key={item.id} className="border-b border-white/5 hover:bg-cyan-400/5 transition-colors group">
                                                <td className={`${viewMode === 'small' ? 'py-1.5' : 'p-4'} pl-8 font-mono text-white/30 text-[10px]`}>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                                                <td className={`${viewMode === 'small' ? 'py-1.5' : 'p-4'}`}>
                                                    <div className="flex flex-col">
                                                        <span className={`${viewMode === 'small' ? 'text-sm' : 'text-base font-bold'} uppercase tracking-wider text-white`}>{item.name}</span>
                                                        <span className="text-[10px] font-mono text-cyan-500/60 uppercase tracking-widest">{item.id}</span>
                                                    </div>
                                                </td>
                                                <td className={`${viewMode === 'small' ? 'py-1.5 text-[11px]' : 'p-4 text-sm'} italic font-light text-cyan-100/70`}>{item.major}</td>
                                                <td className={`${viewMode === 'small' ? 'py-1.5' : 'p-4'}`}>
                                                    <span className={`px-2.5 py-1 border rounded-sm font-bold uppercase tracking-widest text-[9px] ${getStatusColor(item.status)}`}>{item.status}</span>
                                                </td>
                                                <td className={`${viewMode === 'small' ? 'py-1.5 text-[11px]' : 'p-4 text-sm'} font-semibold text-cyan-100`}>{item.state}</td>
                                                <td className={`${viewMode === 'small' ? 'py-1.5' : 'p-4'} pr-8`}>
                                                    <div className="flex justify-center gap-3">
                                                        <button onClick={() => {setViewData(item); setIsViewOpen(true);}} className="p-2 border border-cyan-500/30 text-cyan-400 hover:text-white rounded-sm hover:bg-cyan-500/10 transition-all"><EyeIcon className="w-4 h-4" /></button>
                                                        <button onClick={() => {setCurrentFormData(item); setIsFormOpen(true);}} className="p-2 border border-amber-500/30 text-amber-400 hover:text-white rounded-sm hover:bg-amber-500/10 transition-all"><PencilSquareIcon className="w-4 h-4" /></button>
                                                        <button onClick={() => handleDelete(item.id)} className="p-2 border border-rose-500/30 text-rose-400 hover:text-white rounded-sm hover:bg-rose-500/10 transition-all"><TrashIcon className="w-4 h-4" /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Footer */}
                            <div className="p-4 border-t border-white/5 bg-[#0f1c2e]/80 backdrop-blur-md flex justify-between items-center text-xs font-serif">
                                <div className="flex items-center gap-6">
                                    <span className="font-bold uppercase tracking-widest text-white/50">Page {currentPage} of {totalPages}</span>
                                    <div className="flex items-center gap-3 border-l border-white/10 pl-6">
                                        <span className="text-[10px] text-cyan-500/50 uppercase font-bold tracking-widest">Jump</span>
                                        <input type="text" value={jumpPage} onChange={(e) => setJumpPage(e.target.value)} onKeyDown={handleJumpPage} className="w-12 bg-black/40 border-b border-cyan-500/30 text-center text-cyan-100 py-1 focus:outline-none font-mono" placeholder="0" />
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 border border-white/10 hover:bg-cyan-500/20 disabled:opacity-20 transition-all"><ChevronLeftIcon className="w-6 h-6" /></button>
                                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 border border-white/10 hover:bg-cyan-500/20 disabled:opacity-20 transition-all"><ChevronRightIcon className="w-6 h-6" /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FIXED UI ELEMENTS */}
                <div className={`absolute top-6 left-6 z-[60] transition-all duration-700 ease-out ${!isZooming && !isLoggingOut ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6 pointer-events-none'}`}>
                    <ButtonSidebar onClick={() => setIsSidebarOpen(prev => !prev)} />
                </div>
                <div className={`absolute top-6 right-6 z-[60] transition-all duration-700 ease-out ${!isZooming && !isLoggingOut ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6 pointer-events-none'}`}>
                    <ButtonHome onClick={() => router.visit('/admin/home')} />
                </div>

                <AdminSidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    onLogout={handleLogout}
                />

                <div className="absolute inset-0 z-[70] pointer-events-none transition-opacity duration-1000 ease-in-out" style={{ background: 'linear-gradient(to bottom, #0a2a4a, #0c365b)', opacity: isLoggingOut ? 1 : 0 }} />
                {inputLocked && <div className="absolute inset-0 z-[80] pointer-events-auto" />}

                {/* MODALS (Form, View, Confirm) */}
                {isFormOpen && createPortal(
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-[#020406]/90 backdrop-blur-sm" onClick={closeAllModals} />
                        <div className="relative w-full max-w-2xl bg-[#0a121d] border-2 border-double border-cyan-600/30 p-10 shadow-2xl animate-popIn">
                            <button onClick={closeAllModals} className="absolute top-4 right-4 text-white/40 hover:text-white transition-all"><XMarkIcon className="w-6 h-6"/></button>
                            <h2 className="text-3xl font-serif font-bold text-cyan-100 border-b border-white/5 pb-4 mb-8 uppercase tracking-widest text-center">Subject Update</h2>
                            <form onSubmit={handleSave} className="flex flex-col gap-6 text-sm text-white">
                                <div className="grid grid-cols-2 gap-6">
                                    <div><label className="text-cyan-500/60 text-[10px] font-bold uppercase tracking-widest block mb-2">Subject Identity</label><input type="text" required className="input-etched w-full" value={currentFormData?.name || ''} onChange={e => setCurrentFormData({...currentFormData, name: e.target.value})} /></div>
                                    <div><label className="text-cyan-500/60 text-[10px] font-bold uppercase tracking-widest block mb-2">NIM / ID</label><input type="text" required className="input-etched w-full" value={currentFormData?.id || ''} onChange={e => setCurrentFormData({...currentFormData, id: e.target.value})} /></div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div><label className="text-cyan-500/60 text-[10px] font-bold uppercase tracking-widest block mb-2">Email Address</label><input type="email" required className="input-etched w-full" value={currentFormData?.email || ''} onChange={e => setCurrentFormData({...currentFormData, email: e.target.value})} /></div>
                                    <div><label className="text-cyan-500/60 text-[10px] font-bold uppercase tracking-widest block mb-2">Stored Passcode</label><input type="text" required className="input-etched w-full font-mono" value={currentFormData?.password || ''} onChange={e => setCurrentFormData({...currentFormData, password: e.target.value})} /></div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div><label className="text-cyan-500/60 text-[10px] font-bold uppercase tracking-widest block mb-2">Major</label><input type="text" required className="input-etched w-full" value={currentFormData?.major || ''} onChange={e => setCurrentFormData({...currentFormData, major: e.target.value})} /></div>
                                    <div><label className="text-cyan-500/60 text-[10px] font-bold uppercase tracking-widest block mb-2">Assigned Class</label><input type="text" required className="input-etched w-full font-mono" value={currentFormData?.class || ''} onChange={e => setCurrentFormData({...currentFormData, class: e.target.value})} /></div>
                                </div>
                                <button type="submit" className="w-full py-4 bg-cyan-700/20 border border-cyan-500/50 text-cyan-100 font-bold font-serif uppercase tracking-[0.2em] hover:bg-cyan-600 hover:text-black transition-all">Authorize Record</button>
                            </form>
                        </div>
                    </div>, document.body
                )}

                {isViewOpen && viewData && createPortal(
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-[#020406]/95 backdrop-blur-md" onClick={closeAllModals} />
                        <div className="relative w-full max-w-2xl bg-[#0a121d] border-2 border-double border-cyan-600/30 shadow-2xl animate-popIn flex flex-col overflow-hidden">
                            <div className="p-8 border-b border-white/5 bg-[#050a10]">
                                <h2 className="text-3xl font-serif font-bold text-cyan-100 tracking-widest uppercase text-center">Subject Manifest</h2>
                                <p className="text-white/40 text-[10px] font-mono uppercase text-center mt-1">Unique Record Identifier: {viewData.id}</p>
                            </div>
                            <div className="p-10 flex flex-col gap-8 text-sm text-white">
                                <div className="grid grid-cols-2 gap-8">
                                    <div><span className="block text-cyan-500/50 text-[10px] font-bold uppercase mb-1 tracking-widest">Subject Identity</span><span className="text-2xl font-serif">{viewData.name}</span></div>
                                    <div><span className="block text-cyan-500/50 text-[10px] font-bold uppercase mb-1 tracking-widest">NIM / ID</span><span className="text-lg font-mono text-cyan-200">{viewData.id}</span></div>
                                </div>
                                <div className="grid grid-cols-2 gap-8 pt-6 border-t border-white/5">
                                    <div><span className="block text-cyan-500/50 text-[10px] font-bold uppercase mb-1 tracking-widest">Major</span><span className="text-base">{viewData.major}</span></div>
                                    <div><span className="block text-cyan-500/50 text-[10px] font-bold uppercase mb-1 tracking-widest">Class Code</span><span className="text-base font-mono">{viewData.class}</span></div>
                                </div>
                                <div className="grid grid-cols-2 gap-8 pt-6 border-t border-white/5">
                                    <div><span className="block text-cyan-500/50 text-[10px] font-bold uppercase mb-1 tracking-widest">Recruitment Stage</span><span className="text-cyan-200 font-bold uppercase tracking-wider">{viewData.state}</span></div>
                                    <div><span className="block text-cyan-500/50 text-[10px] font-bold uppercase mb-2 tracking-widest">Evaluation Result</span><span className={`px-4 py-1.5 rounded-sm border text-[10px] font-bold uppercase tracking-widest ${getStatusColor(viewData.status)}`}>{viewData.status}</span></div>
                                </div>
                            </div>
                            <div className="p-6 border-t border-white/5 bg-[#050a10] flex justify-center">
                                <button onClick={closeAllModals} className="px-14 py-4 bg-cyan-900/20 border border-white/10 text-white/60 hover:text-white transition-all text-xs font-serif font-bold uppercase tracking-[0.3em]">Finalize Observation</button>
                            </div>
                        </div>
                    </div>, document.body
                )}

                {confirmModal.isOpen && createPortal(
                    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/95 backdrop-blur-sm" onClick={closeAllModals} />
                        <div className="relative bg-[#0a121d] border-2 border-double border-amber-600/30 p-12 max-w-md w-full text-center animate-popIn shadow-2xl text-white">
                            <div className="mb-6 flex justify-center text-amber-500/80 drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]"><ExclamationTriangleIcon className="w-16 h-16" /></div>
                            <h3 className="text-3xl font-serif font-bold mb-4 uppercase tracking-widest">{confirmModal.title}</h3>
                            <p className="text-amber-100/60 text-sm mb-10 leading-relaxed font-light">{confirmModal.message}</p>
                            <div className="flex gap-6">
                                <button onClick={closeAllModals} className="flex-1 py-3 border border-white/10 hover:bg-white/5 transition-all text-white/40 hover:text-white text-xs font-bold uppercase tracking-widest">Abort</button>
                                <button onClick={confirmModal.onConfirm} className={`flex-1 py-3 font-bold text-white text-xs uppercase tracking-widest shadow-lg bg-rose-700/20 border border-rose-500/50 hover:bg-rose-600 hover:text-black transition-all`}>Confirm</button>
                            </div>
                        </div>
                    </div>, document.body
                )}
            </div>
        </>
    );
}