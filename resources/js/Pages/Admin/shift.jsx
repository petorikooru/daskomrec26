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
    PencilSquareIcon, TrashIcon, PlusIcon, UserGroupIcon,
    ChevronLeftIcon, ChevronRightIcon, XMarkIcon,
    IdentificationIcon, ExclamationTriangleIcon, UserPlusIcon,
    ListBulletIcon, TableCellsIcon, UserMinusIcon, ChartBarIcon,
    MagnifyingGlassIcon, ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

// --- THEMED STAT CARD ---
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
                    {isTotal ? <TableCellsIcon className="w-5 h-5" /> : <ChartBarIcon className="w-5 h-5" />}
                </div>
            </div>
            <div className="flex flex-col relative z-10">
                <span className={`text-[10px] font-serif font-bold uppercase tracking-[0.2em] ${isTotal ? 'text-cyan-200/60' : 'text-amber-200/60'}`}>{label}</span>
                <span className="text-2xl font-serif text-white tracking-wide">{value}</span>
            </div>
        </div>
    );
};

export default function Shift() {
    const backgroundRef = useRef(null);
    const [showImage, setShowImage] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isZooming, setIsZooming] = useState(true);
    const [inputLocked, setInputLocked] = useState(true);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [viewMode, setViewMode] = useState('regular'); 
    const ITEMS_PER_PAGE = viewMode === 'compact' ? 10 : 5; 

    const [shifts, setShifts] = useState([
        { 
            id: 1, shift: 'Shift 1', type: 'Onsite', place: 'GKU 03', date: '2026-11-01', 
            timeStart: '06:30', timeEnd: '09:30', quota: 20, 
            guardians: ['JYO', 'KAY', 'VIM', 'GTR', 'WIL', 'UZY', 'RYU'], 
            caasBooked: [
                { id: '10101230001', name: 'Muhammad Hafiz', major: 'Teknik Elektro' },
                { id: '10101230002', name: 'Stevannie Pratama', major: 'Teknik Telekomunikasi' }
            ] 
        },
    ]);

    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [jumpPage, setJumpPage] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'asc' });
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isPlotterOpen, setIsPlotterOpen] = useState(false);
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', type: 'danger', onConfirm: () => {} });
    const [currentFormData, setCurrentFormData] = useState({ id: null, shift: '', type: 'Onsite', place: '', date: '', timeStart: '', timeEnd: '', quota: 0, guardians: [], caasBooked: [] });
    const [activeShift, setActiveShift] = useState(null);
    const [newPlotterName, setNewPlotterName] = useState('');

    const closeAllModals = useCallback(() => {
        setIsFormOpen(false);
        setIsPlotterOpen(false);
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
    }, []);

    useEffect(() => {
        const showTimer = setTimeout(() => setShowImage(true), 300);
        const zoomTimer = setTimeout(() => { setIsZooming(false); setInputLocked(false); }, 100);
        const skipIntro = () => {
            clearTimeout(showTimer); clearTimeout(zoomTimer);
            setShowImage(true); setIsZooming(false); setInputLocked(false);
        };
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                if (isFormOpen || isPlotterOpen || confirmModal.isOpen) closeAllModals();
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
    }, [isFormOpen, isPlotterOpen, confirmModal.isOpen, closeAllModals]);

    const totalCandidatesCount = useMemo(() => shifts.reduce((acc, curr) => acc + curr.caasBooked.length, 0), [shifts]);

    const handleSort = (key) => {
        let direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
        setSortConfig({ key, direction });
    };

    const processedShifts = useMemo(() => {
        let data = [...shifts].filter(s => s.shift.toLowerCase().includes(searchQuery.toLowerCase()));
        if (sortConfig.key) {
            data.sort((a, b) => {
                let aVal = a[sortConfig.key]; let bVal = b[sortConfig.key];
                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return data;
    }, [shifts, searchQuery, sortConfig]);

    const totalPages = Math.max(1, Math.ceil(processedShifts.length / ITEMS_PER_PAGE));
    const paginatedShifts = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return processedShifts.slice(start, start + ITEMS_PER_PAGE);
    }, [currentPage, processedShifts, ITEMS_PER_PAGE]);

    const formatDisplayDate = (dateString) => {
        if (!dateString) return '-';
        const [y, m, d] = dateString.split('-').map(Number);
        const date = new Date(y, m - 1, d);
        return `${['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][date.getDay()]}, ${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}`;
    };

    const handleSaveShift = (e) => {
        e.preventDefault();
        if (currentFormData.id) setShifts(prev => prev.map(s => s.id === currentFormData.id ? currentFormData : s));
        else setShifts(prev => [...prev, { ...currentFormData, id: Date.now() }]);
        setIsFormOpen(false);
    };

    const handleAddPlotter = (e) => {
        if (e) e.preventDefault();
        if (!newPlotterName.trim()) return;
        const updated = [...activeShift.guardians, newPlotterName.trim()];
        setShifts(prev => prev.map(s => s.id === activeShift.id ? { ...s, guardians: updated } : s));
        setActiveShift(prev => ({ ...prev, guardians: updated }));
        setNewPlotterName('');
    };

    const handleJumpPage = (e) => {
        if (e.key === 'Enter') {
            const pageNum = parseInt(jumpPage);
            if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) setCurrentPage(pageNum);
            setJumpPage('');
        }
    };

    const handleExportExcel = () => {
        const exportData = shifts.map(s => ({
            Shift: s.shift, Date: s.date, Start: s.timeStart, End: s.timeEnd,
            Booked: s.caasBooked.length, Quota: s.quota, Plotters: s.guardians.join(', ')
        }));
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Shifts");
        XLSX.writeFile(workbook, "ShiftData.xlsx");
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
        .cold-blue-filter { filter: brightness(0.9) contrast(1.1) saturate(1.5) hue-rotate(15deg) sepia(0.1); }
        .pulse-effect { animation: subtlePulse 3s ease-in-out infinite; }
        .atlantean-panel { background: rgba(15, 28, 46, 0.75); backdrop-filter: blur(12px); border: 4px double rgba(6, 182, 212, 0.3); }
        .input-etched { background: rgba(0,0,0,0.2); border-bottom: 2px solid rgba(255,255,255,0.1); color: white; transition: all 0.3s; padding: 12px; }
        .input-etched:focus { outline: none; border-bottom-color: #22d3ee; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(34, 211, 238, 0.3); border-radius: 10px; }
        @keyframes popIn { 0% { opacity: 0; transform: scale(0.95); } 100% { opacity: 1; transform: scale(1); } }
        .animate-popIn { animation: popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }

        input[type="time"]::-webkit-calendar-picker-indicator{
            filter: invert(75%);
        }

        input[type="date"]::-webkit-calendar-picker-indicator{
            filter: invert(75%);
        }
    `;

    return (
        <>
            <Head title="Shift Management" />
            <style>{styles}</style>
            
            {/* SCROLLABLE ONLY ON MOBILE via overflow-y-auto on small screens */}
            <div className="fixed inset-0 w-full h-full bg-[#0a2a4a] text-white overflow-y-auto md:overflow-hidden font-sans">
                
                {/* Fixed Background */}
                <div className="fixed inset-0 z-0 pointer-events-none">
                    <img 
                        ref={backgroundRef} src={background} alt="bg" 
                        onLoad={() => setImageLoaded(true)}
                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-1500 ease-out ${showImage && imageLoaded ? 'opacity-100' : 'opacity-0'} ${!isZooming ? 'pulse-effect' : ''} cold-blue-filter`} 
                        style={{ transform: showImage && imageLoaded ? (isZooming ? 'scale(1.5)' : 'scale(1.0)') : 'scale(1.3)', transformOrigin: 'center' }} 
                    />
                    <UnderwaterEffect />
                    <div className={`absolute inset-0 bg-linear-to-b from-black/25 via-transparent to-black/30 transition-opacity duration-1000 ${showImage && imageLoaded ? 'opacity-100' : 'opacity-0'}`} />
                </div>

                {/* Content Layer */}
                <div className={`relative md:absolute md:inset-0 z-10 flex flex-col items-center justify-start md:justify-center p-4 md:p-8 transition-all duration-1000 ${isZooming ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                    
                    <div className="text-center relative z-10 mb-8 w-auto md:w-full max-w-7xl flex flex-col md:flex-row items-center md:items-end justify-between gap-6 mt-20 md:mt-0">
                        <div className="text-center md:text-left">
                            <h1 className="text-5xl md:text-7xl font-bold leading-tight" style={{ fontFamily: 'Cormorant Infant, serif', textShadow: '0 2px 20px rgba(0,0,0,.8)' }}>
                                Shift Management
                            </h1>
                            <p className="text-sm text-cyan-400/80 font-serif tracking-[0.3em] uppercase mt-1">Manage the shift</p>
                        </div>
                        <div className="flex gap-4 w-full md:w-auto">
                            <StatCard label="Total Shift" value={shifts.length} type="total" />
                            <StatCard label="Filled Shift" value={totalCandidatesCount} type="passed" />
                        </div>
                    </div>

                    <div className="w-full max-w-7xl pb-20 md:pb-0">
                        <div className="atlantean-panel p-6 flex flex-col xl:flex-row justify-between items-center gap-6 rounded-t-2xl">
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => {
                                        setCurrentFormData({
                                            id: null, 
                                            shift: '', 
                                            type: 'Onsite', 
                                            place: '', 
                                            date: '', 
                                            timeStart: '', 
                                            timeEnd: '', 
                                            quota: 0, 
                                            guardians: [], 
                                            caasBooked: []
                                        }); setIsFormOpen(true);}} 
                                    className="px-6 py-3 bg-cyan-600/80 border border-cyan-400/50 hover:bg-cyan-500 rounded-sm font-serif font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg transition-all text-xs"
                                >
                                    <PlusIcon className="w-4 h-4" /> New Shift
                                </button>
                                <button 
                                    onClick={handleExportExcel} 
                                    className="p-3 border border-emerald-500/40 text-emerald-300 rounded-sm hover:bg-emerald-900/20 transition-all" title="Export excel"
                                >
                                    <ArrowDownTrayIcon className="w-5 h-5" />
                                </button>
                            </div>
                            
                            <div className="flex flex-wrap items-center justify-center gap-4">
                                <div className="bg-black/30 p-1 rounded-sm border border-white/10 flex">
                                    <button 
                                        onClick={() => setViewMode('regular')} 
                                        className={`p-2 rounded-sm transition-all ${viewMode === 'regular' ? 'bg-cyan-600 text-white' : 'text-white/40 hover:text-white'}`}
                                    >
                                        <TableCellsIcon className="w-5 h-5" />
                                    </button>
                                    <button 
                                        onClick={() => setViewMode('compact')} 
                                        className={`p-2 rounded-sm transition-all ${viewMode === 'compact' ? 'bg-cyan-600 text-white' : 'text-white/40 hover:text-white'}`}
                                    >
                                        <ListBulletIcon className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="relative group w-48 md:w-64">
                                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-500/50" />
                                    <input type="text" placeholder="Filter table..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-black/30 border border-white/10 rounded-sm pl-10 pr-4 py-2.5 text-xs text-cyan-100 focus:outline-none focus:border-cyan-500/50 transition-all tracking-wider" />
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setConfirmModal({isOpen: true, title: 'Reset Plotters?', message: 'Remove all guardians?', type: 'warning', onConfirm: () => { setShifts(s => s.map(x => ({...x, guardians: []}))); closeAllModals(); }})} className="p-2.5 border border-amber-500/40 text-amber-300 rounded-sm hover:bg-amber-900/20 transition-all"><UserMinusIcon className="w-5 h-5" /></button>
                                    <button onClick={() => setConfirmModal({isOpen: true, title: 'Wipe System?', message: 'Delete all shifts?', type: 'danger', onConfirm: () => { setShifts([]); closeAllModals(); }})} className="p-2.5 border border-rose-500/40 text-rose-300 rounded-sm hover:bg-rose-900/20 transition-all"><TrashIcon className="w-5 h-5" /></button>
                                </div>
                            </div>
                        </div>

                        <div className="atlantean-panel flex flex-col border-t-0 rounded-b-2xl overflow-hidden">
                            <div className="overflow-x-auto custom-scrollbar">
                                <table className="w-full text-left border-collapse min-w-[950px]">
                                    <thead className="bg-[#0f1c2e]/95 sticky top-0 z-10 border-b border-white/10 text-cyan-100/70 font-serif text-[10px] md:text-xs uppercase tracking-widest">
                                        <tr>
                                            <th className="p-4 w-16 pl-8">No</th>
                                            <th className="p-4 cursor-pointer hover:text-cyan-400" onClick={() => handleSort('shift')}>Shift</th>
                                            <th className="p-4 cursor-pointer hover:text-cyan-400" onClick={() => handleSort('date')}>Date</th>
                                            <th className="p-4">Quota</th>
                                            <th className="p-4">Assistants</th>
                                            <th className="p-4 pr-8 text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="font-sans">
                                        {paginatedShifts.map((item, index) => (
                                            <tr key={item.id} className="border-b border-white/5 hover:bg-cyan-400/5 transition-colors group">
                                                <td className={`${viewMode === 'compact' ? 'py-1.5' : 'p-4'} pl-8 font-mono text-white/30 text-[10px]`}>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                                                <td className={`${viewMode === 'compact' ? 'py-1.5 text-sm' : 'p-4 text-base md:text-lg'} font-bold uppercase tracking-widest`}>{item.shift}</td>
                                                <td className={`${viewMode === 'compact' ? 'py-1.5 text-[11px]' : 'p-4 text-sm'} font-mono`}><span className="text-cyan-100">{formatDisplayDate(item.date)}</span> <span className="text-cyan-500/30 mx-1">|</span> <span className="text-white/60">{item.timeStart}</span></td>
                                                <td className={`${viewMode === 'compact' ? 'py-1.5 text-[11px]' : 'p-4 text-sm'} font-medium`}>{item.caasBooked.length} <span className="text-white/20">/</span> {item.quota}</td>
                                                <td className={`${viewMode === 'compact' ? 'py-1.5' : 'p-4'}`}>
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        {item.guardians.slice(0, 5).map((g, i) => (
                                                            <span key={i} className={`px-2.5 py-1 bg-cyan-900/40 border border-cyan-500/30 rounded-sm font-bold text-cyan-100 ${viewMode === 'compact' ? 'text-[9px]' : 'text-[11px]'}`}>{g}</span>
                                                        ))}
                                                        {item.guardians.length > 5 && <span className="text-cyan-400/70 font-mono italic font-bold ml-1 text-[10px]">... +{item.guardians.length - 5}</span>}
                                                    </div>
                                                </td>
                                                <td className={`${viewMode === 'compact' ? 'py-1.5' : 'p-4'} pr-8`}>
                                                    <div className="flex justify-center gap-3">
                                                        <button onClick={() => { setActiveShift(item); setIsPlotterOpen(true); }} className={`${viewMode === 'compact' ? 'p-1.5' : 'p-2.5'} border border-cyan-500/30 text-cyan-400 hover:text-white rounded-sm hover:bg-cyan-500/10 transition-all`}><UserPlusIcon className="w-5 h-5" /></button>
                                                        <button onClick={() => { setCurrentFormData(item); setIsFormOpen(true); }} className={`${viewMode === 'compact' ? 'p-1.5' : 'p-2.5'} border border-amber-500/30 text-amber-400 hover:text-white rounded-sm hover:bg-amber-500/10 transition-all`}><PencilSquareIcon className="w-5 h-5" /></button>
                                                        <button onClick={() => setConfirmModal({isOpen: true, title: 'Delete Shift?', message: `Remove ${item.shift} permanently?`, type: 'danger', onConfirm: () => { setShifts(s => s.filter(x => x.id !== item.id)); closeAllModals(); }})} className={`${viewMode === 'compact' ? 'p-1.5' : 'p-2.5'} border border-rose-500/30 text-rose-400 hover:text-white rounded-sm hover:bg-rose-500/10 transition-all`}><TrashIcon className="w-5 h-5" /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="p-4 border-t border-white/5 bg-[#0f1c2e]/80 backdrop-blur-md flex justify-between items-center text-xs">
                                <div className="flex items-center gap-6 font-serif">
                                    <span className="text-sm text-white/50 font-bold uppercase tracking-widest">Page {currentPage} of {totalPages}</span>
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

                {/* MODALS */}
                {isFormOpen && createPortal(
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-[#020406]/90 backdrop-blur-sm" onClick={closeAllModals} />
                        <div className="relative w-full max-w-xl bg-[#0a121d] border-2 border-double border-cyan-600/30 p-10 shadow-2xl animate-popIn">
                            <button onClick={closeAllModals} className="absolute top-4 right-4 text-white/40 hover:text-white transition-all"><XMarkIcon className="w-6 h-6"/></button>
                            <div className="flex items-center gap-4 border-b border-white/5 pb-4 mb-8">
                                <PencilSquareIcon className="w-8 h-8" style={{ color: '#ffffff' }} />
                                <h2 className="text-3xl font-serif font-bold text-cyan-100 uppercase tracking-widest">Update Shift</h2>
                            </div>
                            <form onSubmit={handleSaveShift} className="flex flex-col gap-6 text-sm text-white">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-cyan-500/60 font-bold uppercase tracking-widest text-[10px]">Shift Name</label>
                                        <input type="text" required className="input-etched w-full" value={currentFormData.shift} onChange={e => setCurrentFormData({...currentFormData, shift: e.target.value})} />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-cyan-500/60 font-bold uppercase tracking-widest text-[10px]">Quota</label>
                                        <input type="number" required className="input-etched w-full" value={currentFormData.quota} onChange={e => setCurrentFormData({...currentFormData, quota: e.target.value})} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-cyan-500/60 font-bold uppercase tracking-widest text-[10px]">Start Time</label>
                                        <input type="time" required className="input-etched w-full" value={currentFormData.timeStart} onChange={e => setCurrentFormData({...currentFormData, timeStart: e.target.value})} />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-cyan-500/60 font-bold uppercase tracking-widest text-[10px]">End Time</label>
                                        <input type="time" required className="input-etched w-full" value={currentFormData.timeEnd} onChange={e => setCurrentFormData({...currentFormData, timeEnd: e.target.value})} />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-cyan-500/60 font-bold uppercase tracking-widest text-[10px]">Shift Date</label>
                                    <input type="date" required className="input-etched w-full" value={currentFormData.date} onChange={e => setCurrentFormData({...currentFormData, date: e.target.value})} />
                                </div>
                                <button type="submit" className="w-full py-4 bg-cyan-700/20 border border-cyan-500/50 text-cyan-100 font-bold font-serif uppercase tracking-[0.2em] hover:bg-cyan-600 hover:text-black transition-all">Confirm Shift</button>
                            </form>
                        </div>
                    </div>, document.body
                )}

                {/* Other Modals (Plotter/Confirm) */}
                {isPlotterOpen && activeShift && createPortal(
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-[#020406]/95 backdrop-blur-md" onClick={closeAllModals} />
                        <div className="relative w-full max-w-5xl bg-[#0a121d] border-2 border-double border-cyan-600/30 shadow-2xl animate-popIn flex flex-col h-[90vh] md:h-[85vh] overflow-hidden">
                            <div className="p-8 border-b border-white/5 bg-[#050a10] flex justify-between items-center">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-cyan-500/60 uppercase tracking-[0.3em] mb-1">Shift Control</span>
                                    <h2 className="text-4xl font-serif font-bold text-cyan-100 tracking-widest uppercase">{activeShift.shift}</h2>
                                </div>
                                <button onClick={closeAllModals} className="text-white/40 hover:text-white transition-all"><XMarkIcon className="w-8 h-8"/></button>
                            </div>
                            <div className="flex-1 flex flex-col md:flex-row overflow-hidden text-white">
                                <div className="w-full md:w-1/2 p-10 md:border-r border-white/5 flex flex-col gap-8 bg-black/20 overflow-y-auto custom-scrollbar">
                                    <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-3"><UserPlusIcon className="w-6 h-6"/> Assign Assistants</h3>
                                    <form onSubmit={handleAddPlotter} className="flex gap-3">
                                        <input type="text" placeholder="Entry ID..." value={newPlotterName} onChange={(e) => setNewPlotterName(e.target.value)} className="flex-1 input-etched !p-3 !text-sm border-white/5" />
                                        <button type="submit" className="px-8 bg-cyan-700/30 border border-cyan-500/40 text-cyan-100 font-bold uppercase text-[10px] rounded-sm hover:bg-cyan-600 transition-all">Add</button>
                                    </form>
                                    <div className="flex flex-wrap content-start gap-3">
                                        {activeShift.guardians.map((name, idx) => (
                                            <div key={idx} className="flex items-center gap-3 px-4 py-2.5 bg-cyan-950/40 border border-cyan-500/30 rounded-sm">
                                                <span className="text-sm font-medium tracking-wider">{name}</span>
                                                <button onClick={() => {
                                                    const updated = activeShift.guardians.filter((_, i) => i !== idx);
                                                    setShifts(s => s.map(x => x.id === activeShift.id ? {...x, guardians: updated} : x));
                                                    setActiveShift(prev => ({...prev, guardians: updated}));
                                                }} className="text-rose-500/40 hover:text-rose-400 transition-all"><XMarkIcon className="w-4 h-4" /></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex-1 p-10 flex flex-col gap-8 overflow-y-auto custom-scrollbar">
                                    <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-3"><IdentificationIcon className="w-6 h-6"/> Shifted Subjects</h3>
                                    <div className="flex flex-col gap-4">
                                        {activeShift.caasBooked.map(caas => (
                                            <div key={caas.id} className="p-5 bg-emerald-950/10 border border-white/5 flex justify-between items-center rounded-sm transition-all group">
                                                <div className="flex flex-col">
                                                    <span className="text-white text-lg font-serif tracking-wide">{caas.name}</span>
                                                    <span className="text-cyan-500/40 text-[10px] font-mono uppercase tracking-[0.2em]">{caas.id}</span>
                                                </div>
                                                <UserGroupIcon className="w-6 h-6 text-white/5 group-hover:text-emerald-500/20 transition-all" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 bg-[#050a10] border-t border-white/5 flex justify-end"><button onClick={closeAllModals} className="px-14 py-4 bg-cyan-900/20 border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all text-xs font-serif font-bold uppercase tracking-[0.3em]">Finalize Shift</button></div>
                        </div>
                    </div>, document.body
                )}
                {/* CONFIRMATION DIALOG */}
                {confirmModal.isOpen && createPortal(
                    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/95 backdrop-blur-sm" onClick={closeAllModals} />
                        <div className="relative bg-[#0a121d] border-2 border-double border-amber-600/30 p-12 max-w-md w-full text-center animate-popIn shadow-2xl text-white">
                            <div className="mb-6 flex justify-center text-amber-500/80 drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]"><ExclamationTriangleIcon className="w-16 h-16" /></div>
                            <h3 className="text-3xl font-serif font-bold mb-4 uppercase tracking-widest">{confirmModal.title}</h3>
                            <p className="text-amber-100/60 text-sm mb-10 leading-relaxed font-light">{confirmModal.message}</p>
                            <div className="flex gap-6">
                                <button onClick={closeAllModals} className="flex-1 py-3 border border-white/10 hover:bg-white/5 transition-all text-white/40 hover:text-white text-xs font-bold uppercase tracking-widest">Abort</button>
                                <button onClick={confirmModal.onConfirm} className={`flex-1 py-3 font-bold text-white text-xs uppercase tracking-widest shadow-lg ${confirmModal.type === 'danger' ? 'bg-rose-700/20 border border-rose-500/50 hover:bg-rose-600' : 'bg-amber-700/20 border border-amber-500/50 hover:bg-amber-600'} hover:text-black transition-all`}>Confirm</button>
                            </div>
                        </div>
                    </div>, document.body
                )}
                {/* UI Fixed Elements */}
                <div className={`fixed top-6 left-6 z-[60] transition-all duration-700 ease-out ${!isZooming && !isLoggingOut ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6 pointer-events-none'}`}>
                    <ButtonSidebar onClick={() => setIsSidebarOpen(prev => !prev)} />
                </div>
                <div className={`fixed top-6 right-6 z-[60] transition-all duration-700 ease-out ${!isZooming && !isLoggingOut ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6 pointer-events-none'}`}>
                    <ButtonHome onClick={() => router.visit('/admin/home')} />
                </div>

                <AdminSidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    onLogout={handleLogout}
                />

                <div className="fixed inset-0 z-[70] pointer-events-none transition-opacity duration-1000 ease-in-out" style={{ background: 'linear-gradient(to bottom, #0a2a4a, #0c365b)', opacity: isLoggingOut ? 1 : 0 }} />
                {inputLocked && <div className="fixed inset-0 z-[80] pointer-events-auto" />}
            </div>
        </>
    );
}