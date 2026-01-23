import React, { useState, useMemo } from 'react';
import { 
    MagnifyingGlassIcon, 
    ChevronLeftIcon, 
    ChevronRightIcon, 
    TableCellsIcon, 
    ListBulletIcon,
    UserPlusIcon,
    ClockIcon,
    CalendarIcon,
    MapPinIcon,
    VideoCameraIcon
} from '@heroicons/react/24/outline';

const ShiftTable = ({ shifts = [], onAddShift }) => {
    const [viewMode, setViewMode] = useState('regular'); // 'regular' | 'compact'
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [jumpPage, setJumpPage] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'asc' });
    const ITEMS_PER_PAGE = viewMode === 'compact' ? 8 : 5;

    // --- LOGIC ---
    
    const formatDisplayDate = (dateString) => {
        if (!dateString) return '-';
        let date;
        if (dateString.includes('/')) {
            const [d, m, y] = dateString.split('/');
            date = new Date(`${y}-${m}-${d}`);
        } else {
            date = new Date(dateString);
        }
        if (isNaN(date.getTime())) return dateString;

        // NEW FORMAT: Day dd/mm (e.g., Fri 17/08)
        const dayName = date.toLocaleDateString('id-ID', { weekday: 'short' });
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        
        return `${dayName} ${day}/${month}`;
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const processedShifts = useMemo(() => {
        let data = [...shifts].filter(s => {
            const shiftName = s.shift ? s.shift.toString().toLowerCase() : '';
            const dateStr = s.date ? s.date.toString().toLowerCase() : '';
            const placeStr = s.place ? s.place.toString().toLowerCase() : '';
            const query = searchQuery.toLowerCase();
            return shiftName.includes(query) || dateStr.includes(query) || placeStr.includes(query);
        });

        if (sortConfig.key) {
            data.sort((a, b) => {
                let aVal = a[sortConfig.key] || '';
                let bVal = b[sortConfig.key] || '';
                
                if (sortConfig.key === 'availability') {
                    const aLeft = (a.quota || 0) - (a.caasBooked ? a.caasBooked.length : 0);
                    const bLeft = (b.quota || 0) - (b.caasBooked ? b.caasBooked.length : 0);
                    return sortConfig.direction === 'asc' ? aLeft - bLeft : bLeft - aLeft;
                }
                
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

    const handleJumpPage = (e) => {
        if (e.key === 'Enter') {
            const pageNum = parseInt(jumpPage);
            if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
                setCurrentPage(pageNum);
            }
            setJumpPage(''); 
        }
    };

    const styles = `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(34, 211, 238, 0.3); border-radius: 10px; }
        .atlantean-panel { background: rgba(15, 28, 46, 0.75); backdrop-filter: blur(12px); border: 4px double rgba(6, 182, 212, 0.3); }
    `;

    return (
        <div className="w-full max-w-[1200px] mx-auto font-sans text-white">
            <style>{styles}</style>

            {/* HEADER */}
            <div className="atlantean-panel p-4 md:p-6 flex flex-col md:flex-row justify-between items-center gap-6 rounded-t-2xl shadow-[0_0_30px_rgba(8,145,178,0.15)]">
                
                <div className="flex items-center gap-4">
                    <div className="m-auto sm:p-3 bg-cyan-900/30 border border-cyan-500/30 rounded-sm transform rotate-45">
                        <TableCellsIcon className="w-6 h-6 text-cyan-200 -rotate-45" />
                    </div>
                    <div className='ml-4'>
                        <h1 className="text-xl sm:text-2xl font-serif font-bold text-white uppercase tracking-widest text-shadow">Choose wisely</h1>
                        <h1 className="text-sm text-red-400/70 font-bold uppercase tracking-[0.2em]">It will be an irreversible process</h1>
                    </div>
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
                        <input 
                          type="text" 
                          placeholder="Filter shifts..." 
                          value={searchQuery} 
                          onChange={(e) => setSearchQuery(e.target.value)} 
                          className="w-full bg-black/30 border border-white/10 rounded-sm pl-10 pr-4 py-2.5 text-xs text-cyan-100 focus:outline-none focus:border-cyan-500/50 transition-all tracking-wider font-mono placeholder-white/20" 
                        />
                    </div>
                </div>
            </div>

            {/* TABLE */}
            <div className="atlantean-panel flex flex-col border-t-0 rounded-b-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        
                        <thead className="bg-[#0f1c2e]/95 sticky top-0 z-10 border-b border-white/10 text-cyan-100/70 font-serif text-[10px] md:text-xs uppercase tracking-widest select-none">
                            <tr>
                                <th className="p-4 w-12 pl-6">No</th>
                                <th className="p-4 cursor-pointer hover:text-cyan-400" onClick={() => handleSort('shift')}>
                                    <div className="flex items-center gap-2">Shift {sortConfig.key === 'shift' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</div>
                                </th>
                                {/* WIDENED LOCATION HEADER */}
                                <th className="p-4 w-1/4 cursor-pointer hover:text-cyan-400" onClick={() => handleSort('place')}>
                                    <div className="flex items-center gap-2">Location {sortConfig.key === 'place' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</div>
                                </th>
                                <th className="p-4 cursor-pointer hover:text-cyan-400" onClick={() => handleSort('date')}>
                                    <div className="flex items-center gap-2">Date {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</div>
                                </th>
                                <th className="p-4 cursor-pointer hover:text-cyan-400" onClick={() => handleSort('time')}>
                                    <div className="flex items-center gap-2">Time {sortConfig.key === 'time' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</div>
                                </th>
                                <th className="p-4 cursor-pointer hover:text-cyan-400" onClick={() => handleSort('availability')}>
                                    <div className="flex items-center gap-2">Availability {sortConfig.key === 'availability' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</div>
                                </th>
                                <th className="p-4 pr-6 text-center">Action</th>
                            </tr>
                        </thead>

                        <tbody className="font-sans">
                            {paginatedShifts.map((item, index) => {
                                const bookedCount = item.caasBooked ? item.caasBooked.length : 0;
                                const quota = item.quota || 0;
                                const available = quota - bookedCount;
                                const isFull = available <= 0;
                                const availabilityPercent = Math.round((available / quota) * 100);
                                const isOnline = item.type?.toLowerCase() === 'online';

                                return (
                                    <tr key={item.id} className="border-b border-white/5 hover:bg-cyan-400/5 transition-colors group">
                                        
                                        <td className={`${viewMode === 'compact' ? 'py-2' : 'p-4'} pl-6 font-mono text-white/30 text-[10px]`}>
                                            {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                                        </td>
                                        
                                        <td className={`${viewMode === 'compact' ? 'py-2 text-sm' : 'p-4 text-base'} font-bold uppercase tracking-widest text-white`}>
                                            {item.shift}
                                        </td>

                                        {/* ENLARGED LOCATION CELL */}
                                        <td className={`${viewMode === 'compact' ? 'py-2' : 'p-4'}`}>
                                            {/* CONDITIONAL LAYOUT: 
                                                Compact = Horizontal (Row) 
                                                Regular = Vertical (Col) 
                                            */}
                                            <div className={`flex ${viewMode === 'compact' ? 'flex-row items-center gap-3' : 'flex-col gap-1.5'}`}>
                                                
                                                {/* TYPE ICON + TEXT */}
                                                <div className="flex items-center gap-2 md:gap-3 shrink-0">
                                                    {isOnline ? (
                                                        <VideoCameraIcon className="w-6 h-6 text-purple-400 shrink-0" />
                                                    ) : (
                                                        <MapPinIcon className="w-6 h-6 text-amber-400 shrink-0" />
                                                    )}
                                                    <span className={`text-sm md:text-base font-bold uppercase tracking-wider ${isOnline ? 'text-purple-200' : 'text-amber-200'}`}>
                                                        {item.type}
                                                    </span>
                                                </div>

                                                {/* PLACE NAME 
                                                    - Regular: pl-9 indentation, multiline ok
                                                    - Compact: truncate, max-width limit, inline
                                                */}
                                                <span className={`
                                                    text-xs md:text-sm text-white/80 font-mono tracking-wide
                                                    ${viewMode === 'compact' 
                                                        ? 'truncate max-w-[150px] border-l border-white/20 pl-3 ml-1' // Horizontal divider for compact
                                                        : 'pl-9' // Vertical indent for regular
                                                    }
                                                `}>
                                                    {item.place || 'TBA'}
                                                </span>
                                            </div>
                                        </td>
                                        
                                        <td className={`${viewMode === 'compact' ? 'py-2' : 'p-4'} text-sm font-mono text-cyan-100`}>
                                            <div className="flex items-center gap-2">
                                                <CalendarIcon className="w-4 h-4 text-cyan-500/50" />
                                                {formatDisplayDate(item.date)}
                                            </div>
                                        </td>

                                        <td className={`${viewMode === 'compact' ? 'py-2' : 'p-4'} text-sm font-mono text-white/80`}>
                                            <div className="flex items-center gap-2">
                                                <ClockIcon className="w-4 h-4 text-cyan-500/50" />
                                                {item.timeStart} - {item.timeEnd}
                                            </div>
                                        </td>

                                        <td className={`${viewMode === 'compact' ? 'py-2' : 'p-4'}`}>
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-baseline gap-2">
                                                    <span className={`text-lg font-bold ${isFull ? 'text-rose-400' : 'text-emerald-400'}`}>
                                                        {available}
                                                    </span>
                                                    <span className="text-[10px] text-white/40 uppercase tracking-wider">Left</span>
                                                </div>
                                                <div className="w-20 h-1 bg-white/10 rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full ${isFull ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                                                        style={{ width: `${Math.max(0, availabilityPercent)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        
                                        <td className={`${viewMode === 'compact' ? 'py-2' : 'p-4'} pr-6 text-center`}>
                                            <button 
                                                onClick={() => !isFull && onAddShift(item)}
                                                disabled={isFull}
                                                className={`
                                                    group relative inline-flex items-center justify-center gap-2
                                                    ${viewMode === 'compact' ? 'px-4 py-1.5' : 'px-6 py-2.5'}
                                                    ${isFull ? 'opacity-50 cursor-not-allowed bg-slate-800 border-slate-700' : 'bg-cyan-600/20 hover:bg-cyan-500 border-cyan-500/50 hover:border-cyan-400'}
                                                    border border-double rounded-sm transition-all duration-300 shadow-lg
                                                `}
                                            >
                                                {isFull ? (
                                                    <span className="text-[10px] font-serif font-bold uppercase tracking-widest text-white/40">Closed</span>
                                                ) : (
                                                    <>
                                                        <UserPlusIcon className="w-4 h-4 text-cyan-200 group-hover:text-white" />
                                                        <span className="text-[10px] font-serif font-bold uppercase tracking-widest text-cyan-100 group-hover:text-white">Add</span>
                                                    </>
                                                )}
                                                {!isFull && <div className="absolute inset-0 bg-cyan-400/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t border-white/5 bg-[#0f1c2e]/80 backdrop-blur-md flex justify-between items-center text-xs text-white">
                    <div className="flex items-center gap-6 font-serif">
                        <span className="text-sm text-white/50 font-bold uppercase tracking-widest">
                            Page <span className="text-cyan-400">{currentPage}</span> of {totalPages}
                        </span>
                        
                        <div className="flex items-center gap-3 border-l border-white/10 pl-6">
                            <span className="text-[10px] text-cyan-500/50 uppercase font-bold tracking-widest">Jump</span>
                            <input 
                                type="text" 
                                value={jumpPage} 
                                onChange={(e) => setJumpPage(e.target.value)} 
                                onKeyDown={handleJumpPage} 
                                className="w-12 bg-black/40 border-b border-cyan-500/30 text-center text-cyan-100 py-1 focus:outline-none font-mono text-xs focus:border-cyan-400 transition-colors" 
                                placeholder="0" 
                            />
                        </div>
                    </div>
                    
                    <div className="flex gap-2">
                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 border border-white/10 text-cyan-100 hover:bg-cyan-500/20 disabled:opacity-20 transition-all rounded-sm">
                            <ChevronLeftIcon className="w-5 h-5" />
                        </button>
                        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 border border-white/10 text-cyan-100 hover:bg-cyan-500/20 disabled:opacity-20 transition-all rounded-sm">
                            <ChevronRightIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShiftTable;