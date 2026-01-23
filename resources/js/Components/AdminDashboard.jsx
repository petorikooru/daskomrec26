import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

// --- 1. THEMED SUB-COMPONENTS (With Standard Wording) ---

const StatCard = ({ label, value, type }) => {
    const isTotal = type === 'total';
    return (
        <div className={`
            relative overflow-hidden rounded-sm p-6 flex items-center gap-6 group
            border-double border-4 backdrop-blur-md transition-all duration-500
            ${isTotal 
                ? 'bg-[#0f1c2e]/60 border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.1)] hover:border-cyan-400/50' 
                : 'bg-[#0f1c2e]/60 border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.1)] hover:border-amber-400/50'}
        `}>
            {/* Background Texture Effect */}
            <div className={`absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]`} />
            
            {/* Glowing Orb Background */}
            <div className={`absolute -right-12 -top-12 w-40 h-40 rounded-full blur-[70px] opacity-20 transition-opacity group-hover:opacity-40 ${isTotal ? 'bg-cyan-500' : 'bg-amber-500'}`} />

            {/* Icon Box */}
            <div className={`
                w-16 h-16 border border-white/10 flex items-center justify-center relative z-10 rotate-45 group-hover:rotate-0 transition-transform duration-500
                ${isTotal ? 'bg-cyan-900/30 text-cyan-200' : 'bg-amber-900/30 text-amber-200'}
            `}>
                <div className="-rotate-45 group-hover:rotate-0 transition-transform duration-500">
                    {isTotal ? (
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    ) : (
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    )}
                </div>
            </div>

            {/* Text Content */}
            <div className="flex flex-col relative z-10">
                <span className={`text-xs font-serif font-bold uppercase tracking-[0.25em] mb-1 ${isTotal ? 'text-cyan-200/60' : 'text-amber-200/60'}`}>{label}</span>
                <span className="text-4xl md:text-5xl font-serif text-white tracking-wide drop-shadow-lg">
                    {value}
                </span>
            </div>
        </div>
    );
};

const Toggle = ({ isOn, onClick }) => (
    <button onClick={onClick} className={`relative w-16 h-8 transition-all duration-500 ease-out focus:outline-none group`}>
        {/* Track */}
        <div className={`absolute inset-0 rounded-sm border border-white/10 ${isOn ? 'bg-emerald-900/40' : 'bg-slate-900/60'}`} />
        
        {/* Sliding Stone */}
        <div className={`
            absolute top-1 left-1 w-6 h-6 border border-t-white/20 border-b-black/50 shadow-lg transform transition-transform duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) flex items-center justify-center
            ${isOn ? 'translate-x-8 bg-gradient-to-br from-emerald-400 to-emerald-700' : 'translate-x-0 bg-gradient-to-br from-slate-400 to-slate-600'}
        `}>
            {/* Center Gem */}
            <div className={`w-2 h-2 rotate-45 ${isOn ? 'bg-white shadow-[0_0_10px_white]' : 'bg-slate-800'}`} />
        </div>
    </button>
);

const StatusBadge = ({ isOn, activeText, inactiveText }) => (
    <div className={`
        px-4 py-1.5 border backdrop-blur-sm transition-all duration-300 min-w-[100px] text-center
        text-xs font-serif font-bold tracking-[0.2em] uppercase
        ${isOn 
            ? 'bg-emerald-500/5 border-emerald-500/40 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
            : 'bg-rose-900/20 border-rose-500/30 text-rose-300/60'}
    `}>
        {isOn ? activeText : inactiveText}
    </div>
);

const CoreCard = ({ core, onRequestUpdate }) => {
    const [localCode, setLocalCode] = useState(core.code);
    const [localClue, setLocalClue] = useState(core.clue || ""); // New Clue State
    const [showCode, setShowCode] = useState(false);
    
    // Check if either field has changed
    const hasChanges = localCode !== core.code || localClue !== (core.clue || "");
    
    useEffect(() => { 
        setLocalCode(core.code); 
        setLocalClue(core.clue || "");
    }, [core.code, core.clue]);

    return (
        <div className={`
            relative p-6 border-double border-4 backdrop-blur-md transition-all duration-500 group flex flex-col gap-6
            ${core.isSolved 
                ? 'bg-[#0f1c2e]/60 border-cyan-500/30 hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]' 
                : 'bg-[#0a0f16]/60 border-slate-700/30 hover:border-slate-500/50'}
        `}>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span className="text-amber-100/70 text-xs font-serif font-bold uppercase tracking-[0.2em]">
                    {core.name}
                </span>
                <div className={`w-2 h-2 rotate-45 transition-colors duration-500 ${core.isSolved ? 'bg-cyan-400 shadow-[0_0_10px_#22d3ee]' : 'bg-rose-900 border border-rose-500/50'}`} />
            </div>

            <div className="flex flex-col gap-4">
                
                {/* --- NEW CLUE INPUT SECTION --- */}
                <div className="relative group/input">
                    <label className="text-[9px] text-amber-200/30 uppercase font-bold absolute -top-2 left-0 tracking-widest">
                        Hint / Clue
                    </label>
                    <input 
                        type="text"
                        value={localClue}
                        onChange={(e) => setLocalClue(e.target.value)}
                        placeholder="Enter hint text..."
                        className={`
                            w-full bg-black/10 border-b border-white/10 
                            text-left text-xs font-serif italic text-amber-100/70 py-2 
                            focus:outline-none focus:border-amber-500/40 focus:bg-black/30 
                            transition-all placeholder-white/10
                        `}
                    />
                </div>

                {/* --- PASSCODE INPUT SECTION --- */}
                <div className="relative group/input">
                    <label className="text-[9px] text-cyan-200/40 uppercase font-bold absolute -top-2 left-0 tracking-widest">
                        Passcode Key
                    </label>
                    <div className="relative">
                        <input 
                            type={showCode ? "text" : "password"}
                            value={localCode}
                            onChange={(e) => setLocalCode(e.target.value)}
                            className={`
                                w-full bg-black/20 border-b-2 text-center text-sm font-mono tracking-[0.3em] py-3 focus:outline-none transition-all pr-8
                                ${hasChanges 
                                    ? 'border-amber-500 text-amber-200 shadow-[0_10px_20px_-10px_rgba(245,158,11,0.2)]' 
                                    : core.isSolved 
                                        ? 'border-cyan-500/30 text-cyan-100 focus:border-cyan-400' 
                                        : 'border-white/10 text-slate-400 focus:border-white/30'
                                }
                            `}
                        />
                        {/* Eye Icon */}
                        <button onClick={() => setShowCode(!showCode)} className="absolute right-0 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors p-2">
                            {showCode ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg> : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
                        </button>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className={`transition-all duration-500 overflow-hidden ${hasChanges ? 'max-h-12 opacity-100' : 'max-h-0 opacity-0'}`}>
                {/* Updated to pass localClue as well */}
                <button onClick={() => onRequestUpdate(core.id, localCode, localClue, core.name)} className="w-full py-2 bg-amber-600/20 border border-amber-500/50 hover:bg-amber-600 hover:text-black text-amber-200 text-xs font-serif font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg> Save Changes
                </button>
            </div>
        </div>
    );
};

// --- 2. MAIN COMPONENT ---

export default function AdminDashboard() {
    const [totalUsers, setTotalUsers] = useState(142);
    const [passedUsers, setPassedUsers] = useState(28);

    const [shiftOn, setShiftOn] = useState(true);
    const [announcementOn, setAnnouncementOn] = useState(false);
    const [systemState, setSystemState] = useState('Administration');
    
    // Announcement Data
    const [passMessage, setPassMessage] = useState("Congratulations! You have passed the selection process.");
    const [passLink, setPassLink] = useState("https://discord.gg/example");
    const [failMessage, setFailMessage] = useState("Unfortunately, you did not pass this selection phase.");
    const [failLink, setFailLink] = useState("");

    // Added 'clue' to data structure
    const [cores, setCores] = useState([
        { id: 1, name: 'Core Xurith', code: '8921', clue: 'Binary sequence start', isSolved: true },
        { id: 2, name: 'Core Thevia', code: 'X-99', clue: 'Look under the desk', isSolved: false },
        { id: 3, name: 'Core Euprus', code: '7712', clue: 'Year of establishment', isSolved: false },
        { id: 4, name: 'Core Northgard', code: '33-B', clue: 'Sector 7 G', isSolved: false },
    ]);

    // UI States
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState({ type: '', value: null });
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [isPreviewMode, setIsPreviewMode] = useState(false);

    // Temp Editor States
    const [tempPass, setTempPass] = useState('');
    const [tempPassLink, setTempPassLink] = useState('');
    const [tempFail, setTempFail] = useState('');
    const [tempFailLink, setTempFailLink] = useState('');

    const stateOptions = ["Administration", "Coding and Writing Test", "Interview", "Grouping Task", "Teaching Test", "Rising"];

    // Handlers
    const requestChange = (type, value) => { setPendingAction({ type, value }); setIsConfirmOpen(true); };
    
    // Updated to accept newClue argument
    const requestCoreUpdate = (id, newCode, newClue, name) => { 
        setPendingAction({ type: 'core', value: { id, newCode, newClue, name } }); 
        setIsConfirmOpen(true); 
    };
    
    const applyChange = () => {
        const { type, value } = pendingAction;
        if (type === 'shift') setShiftOn(value);
        if (type === 'announcement') setAnnouncementOn(value);
        if (type === 'state') setSystemState(value);
        
        // Updated to save both code and clue
        if (type === 'core') {
            setCores(prev => prev.map(c => 
                c.id === value.id ? { ...c, code: value.newCode, clue: value.newClue } : c
            ));
        }
        
        setIsConfirmOpen(false); setPendingAction({ type: '', value: null });
    };

    const cancelChange = () => { setIsConfirmOpen(false); setPendingAction({ type: '', value: null }); };
    const openEditor = () => { 
        setTempPass(passMessage); setTempPassLink(passLink);
        setTempFail(failMessage); setTempFailLink(failLink);
        setIsPreviewMode(false); setIsEditorOpen(true); 
    };
    const saveDrafts = () => { 
        setPassMessage(tempPass); setPassLink(tempPassLink);
        setFailMessage(tempFail); setFailLink(tempFailLink);
        setIsEditorOpen(false); 
    };

    const labelStyle = "text-amber-100/60 text-sm font-serif font-bold tracking-[0.25em] uppercase mb-3 block";

    return (
        <div className="relative z-50 w-full flex flex-col items-center gap-8">
            
            {/* STATS */}
            <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                <StatCard label="Total Users" value={totalUsers} type="total" />
                <StatCard label="Passed Users" value={passedUsers} type="passed" />
            </div>

            {/* CONTROL PANEL */}
            <div className="w-full max-w-7xl p-12 bg-[#08101a]/80 backdrop-blur-xl shadow-2xl animate-fadeIn border-y-2 border-white/5" style={{ animationDelay: '0.1s' }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                    
                    {/* LEFT COLUMN */}
                    <div className="flex flex-col justify-center gap-12 md:border-r border-white/5 md:pr-20 relative">
                         {/* Decorative Vertical Line */}
                        <div className="absolute right-[-1px] top-10 bottom-10 w-[1px] bg-gradient-to-b from-transparent via-amber-500/30 to-transparent hidden md:block"></div>

                        <div className="flex items-center justify-between group">
                            <div className="flex flex-col gap-2">
                                <span className={labelStyle}>Shift Selection</span>
                                <StatusBadge isOn={shiftOn} activeText="Online" inactiveText="Offline" />
                            </div>
                            <Toggle isOn={shiftOn} onClick={() => requestChange('shift', !shiftOn)} />
                        </div>
                        <div className="flex items-center justify-between group">
                            <div className="flex flex-col gap-2">
                                <span className={labelStyle}>Announcement</span>
                                <div className="flex items-center gap-3">
                                    <StatusBadge isOn={announcementOn} activeText="Live" inactiveText="Hidden" />
                                    <button onClick={openEditor} className="flex items-center gap-2 px-3 py-1.5 border border-amber-500/30 text-amber-200 hover:bg-amber-500/10 hover:border-amber-400 transition-all text-[10px] font-serif font-bold uppercase tracking-widest">
                                        Manage
                                    </button>
                                </div>
                            </div>
                            <Toggle isOn={announcementOn} onClick={() => requestChange('announcement', !announcementOn)} />
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="flex flex-col justify-center">
                        <label className={labelStyle}>Current Phase</label>
                        <div className="relative group w-full">
                            {/* Decorative Corners for Dropdown */}
                            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-500/50 pointer-events-none"></div>
                            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-amber-500/50 pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-amber-500/50 pointer-events-none"></div>
                            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-amber-500/50 pointer-events-none"></div>

                            <select value={systemState} onChange={(e) => requestChange('state', e.target.value)} className="w-full bg-[#04090f]/80 border border-white/10 text-amber-100 text-xl font-serif px-8 py-6 focus:outline-none focus:border-amber-500/30 appearance-none cursor-pointer transition-all hover:bg-white/5 tracking-wide">
                                {stateOptions.map((opt) => (<option key={opt} value={opt} className="bg-[#0f1c2e] text-amber-100/80 py-2">{opt}</option>))}
                            </select>
                            <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-amber-500/50 transition-transform duration-300 group-hover:translate-y-[-20%]">▼</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CORES */}
            <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                {cores.map((core) => (<CoreCard key={core.id} core={core} onRequestUpdate={requestCoreUpdate} />))}
            </div>

            {/* --- MODALS --- */}
            
            {/* Confirmation Dialog */}
            {isConfirmOpen && typeof document === 'object' && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#020406]/90 backdrop-blur-sm" onClick={cancelChange} />
                    <div className="relative w-full max-w-lg bg-[#0a121d] border-2 border-double border-amber-600/30 p-10 shadow-[0_0_50px_rgba(217,119,6,0.15)] animate-popIn">
                        {/* Decorative Top Border */}
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>

                        <h3 className="text-3xl text-amber-100 font-serif font-bold mb-6 text-center tracking-wide">Confirm Update</h3>
                        <div className="text-amber-100/70 text-base leading-relaxed text-center font-light">
                            {pendingAction.type === 'core' ? (
                                <>
                                    Changing data for <span className="text-white font-bold">{pendingAction.value.name}</span>.
                                    <div className="mt-6 flex flex-col gap-3">
                                        <div className="p-3 bg-black/40 border border-white/5 flex flex-col items-start">
                                            <span className="text-[10px] uppercase tracking-widest text-white/30 block mb-1">Passcode</span>
                                            <span className="text-xl font-mono text-cyan-300 tracking-[0.2em]">{pendingAction.value.newCode}</span>
                                        </div>
                                        <div className="p-3 bg-black/40 border border-white/5 flex flex-col items-start">
                                            <span className="text-[10px] uppercase tracking-widest text-white/30 block mb-1">Clue</span>
                                            <span className="text-sm font-serif italic text-amber-200/80">{pendingAction.value.newClue}</span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>Changing status to: <span className="text-white font-bold block mt-2 text-xl font-serif">{pendingAction.type === 'state' ? pendingAction.value : `${pendingAction.type} ${pendingAction.value ? 'Active' : 'Dormant'}`}</span></>
                            )}
                        </div>
                        <div className="flex items-center justify-center gap-6 pt-8 mt-4">
                            <button onClick={cancelChange} className="px-8 py-3 border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-colors uppercase tracking-widest text-xs font-bold">Cancel</button>
                            <button onClick={applyChange} className="px-10 py-3 bg-amber-700/20 border border-amber-500/50 text-amber-100 hover:bg-amber-600 hover:text-black transition-all uppercase tracking-widest text-xs font-bold shadow-[0_0_20px_rgba(217,119,6,0.2)]">Confirm</button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Editor Dialog */}
            {isEditorOpen && typeof document === 'object' && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 lg:p-10">
                    <div className="absolute inset-0 bg-[#020406]/95 backdrop-blur-md" onClick={() => setIsEditorOpen(false)} />
                    <div className="relative w-full max-w-7xl h-[85vh] bg-[#0a121d] border border-white/10 shadow-2xl flex flex-col overflow-hidden animate-popIn">
                        <div className="flex items-center justify-between p-6 px-8 border-b border-white/5 bg-[#0f1926]">
                            <h2 className="text-2xl font-serif text-amber-100 tracking-wider">Announcement Manager</h2>
                            <div className="flex items-center bg-black/40 p-1 gap-1 border border-white/5">
                                <button onClick={() => setIsPreviewMode(false)} className={`px-6 py-2 text-xs font-serif font-bold uppercase tracking-widest ${!isPreviewMode ? 'bg-amber-700/30 text-amber-100 border border-amber-500/30' : 'text-white/30'}`}>Write</button>
                                <button onClick={() => setIsPreviewMode(true)} className={`px-6 py-2 text-xs font-serif font-bold uppercase tracking-widest ${isPreviewMode ? 'bg-cyan-700/30 text-cyan-100 border border-cyan-500/30' : 'text-white/30'}`}>Preview</button>
                            </div>
                        </div>
                        
                        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
                            {/* PASS COLUMN */}
                            <div className="flex flex-col border-r border-white/5 bg-emerald-900/5 relative">
                                <div className="p-4 border-b border-white/5 bg-emerald-500/5 flex justify-between"><span className="text-emerald-500/60 text-xs font-serif font-bold uppercase tracking-[0.2em]">Pass Content</span></div>
                                <div className="flex-1 p-8 flex flex-col gap-8 overflow-y-auto">
                                    {!isPreviewMode ? (
                                        <>
                                            <div className="flex-1 flex flex-col">
                                                <label className="text-[10px] uppercase font-bold text-emerald-500/40 mb-3 tracking-widest">Message</label>
                                                <textarea value={tempPass} onChange={(e) => setTempPass(e.target.value)} className="w-full flex-1 bg-[#050a10]/50 border border-emerald-500/10 p-6 text-emerald-100/90 resize-none text-xl font-serif leading-relaxed focus:outline-none focus:border-emerald-500/30 placeholder-emerald-900/50" placeholder="Enter message..." />
                                            </div>
                                            <div>
                                                <label className="text-[10px] uppercase font-bold text-emerald-500/40 mb-3 tracking-widest">Attachment Link</label>
                                                <div className="flex items-center bg-[#050a10]/50 border border-emerald-500/10 px-4 py-4 focus-within:border-emerald-500/40">
                                                    <span className="text-emerald-500/30 mr-4 font-serif italic">URL</span>
                                                    <input type="text" value={tempPassLink} onChange={(e) => setTempPassLink(e.target.value)} className="bg-transparent w-full text-sm text-emerald-200 placeholder-emerald-900/50 focus:outline-none font-mono" placeholder="https://..." />
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="h-full flex flex-col border border-emerald-500/20 bg-emerald-900/10 p-8 relative">
                                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
                                            <h4 className="text-2xl font-serif text-emerald-400 mb-6 text-center">Status: PASSED</h4>
                                            <p className="text-emerald-100/80 leading-loose text-lg font-light text-center italic">{tempPass}</p>
                                            {tempPassLink && <a href={tempPassLink} target="_blank" rel="noreferrer" className="mt-auto w-full py-4 border border-emerald-500/40 text-emerald-300 text-center uppercase tracking-[0.25em] text-xs font-bold hover:bg-emerald-500/10 transition-all">Open Link</a>}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* FAIL COLUMN */}
                            <div className="flex flex-col bg-rose-900/5">
                                <div className="p-4 border-b border-white/5 bg-rose-500/5 flex justify-between"><span className="text-rose-500/60 text-xs font-serif font-bold uppercase tracking-[0.2em]">Fail Content</span></div>
                                <div className="flex-1 p-8 flex flex-col gap-8 overflow-y-auto">
                                    {!isPreviewMode ? (
                                        <>
                                            <div className="flex-1 flex flex-col">
                                                <label className="text-[10px] uppercase font-bold text-rose-500/40 mb-3 tracking-widest">Message</label>
                                                <textarea value={tempFail} onChange={(e) => setTempFail(e.target.value)} className="w-full flex-1 bg-[#050a10]/50 border border-rose-500/10 p-6 text-rose-100/90 resize-none text-xl font-serif leading-relaxed focus:outline-none focus:border-rose-500/30 placeholder-rose-900/50" placeholder="Enter message..." />
                                            </div>
                                            <div>
                                                <label className="text-[10px] uppercase font-bold text-rose-500/40 mb-3 tracking-widest">Attachment Link</label>
                                                <div className="flex items-center bg-[#050a10]/50 border border-rose-500/10 px-4 py-4 focus-within:border-rose-500/40">
                                                    <span className="text-rose-500/30 mr-4 font-serif italic">URL</span>
                                                    <input type="text" value={tempFailLink} onChange={(e) => setTempFailLink(e.target.value)} className="bg-transparent w-full text-sm text-rose-200 placeholder-rose-900/50 focus:outline-none font-mono" placeholder="https://..." />
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="h-full flex flex-col border border-rose-500/20 bg-rose-900/10 p-8 relative">
                                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-500/50 to-transparent"></div>
                                            <h4 className="text-2xl font-serif text-rose-400 mb-6 text-center">Status: NOT SELECTED</h4>
                                            <p className="text-rose-100/80 leading-loose text-lg font-light text-center italic">{tempFail}</p>
                                            {tempFailLink && <a href={tempFailLink} target="_blank" rel="noreferrer" className="mt-auto w-full py-4 border border-rose-500/40 text-rose-300 text-center uppercase tracking-[0.25em] text-xs font-bold hover:bg-rose-500/10 transition-all">Open Link</a>}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-white/5 bg-[#0f1926] flex justify-end gap-6">
                            <button onClick={() => setIsEditorOpen(false)} className="text-white/30 hover:text-white text-xs font-bold uppercase tracking-widest px-4">Discard</button>
                            <button onClick={saveDrafts} className="bg-amber-700/20 border border-amber-500/50 text-amber-100 px-8 py-3 hover:bg-amber-600 hover:text-black transition-all text-xs font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(217,119,6,0.15)]">Save Draft</button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            <style>{`
                @keyframes popIn { 0% { opacity: 0; transform: scale(0.95); } 100% { opacity: 1; transform: scale(1); } }
                .animate-popIn { animation: popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
            `}</style>
        </div>
    );
}