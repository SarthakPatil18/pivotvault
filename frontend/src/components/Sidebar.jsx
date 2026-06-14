import React from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Skull, Search, Zap, BarChart2, MessageSquare, Share2, Menu, X, Sparkles,
  Bookmark, Brain, GitCompare, ClipboardCheck, Sun, Moon, LogOut, User,
  FileText, ChevronRight, PanelLeftClose, PanelLeft
} from 'lucide-react';
import  clsx  from 'clsx';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const SidebarItem = ({ item, isCollapsed, onClick }) => {
  const Icon = item.icon;
  
  return (
    <NavLink
      to={item.path}
      onClick={onClick}
      className={({ isActive }) => clsx(
        "relative flex items-center rounded-lg transition-all duration-200 group mb-1",
        isCollapsed ? "justify-center h-12 w-12 mx-auto" : "px-3 py-2.5 gap-3 mx-2",
        isActive 
          ? "text-accent bg-accent/10 font-bold" 
          : "text-text-secondary hover:text-text-primary hover:bg-surface-2"
      )}
    >
      {({ isActive }) => (
        <>
          <Icon className={clsx(
            "shrink-0 transition-transform duration-200 group-hover:scale-110", 
            isCollapsed ? "w-6 h-6" : "w-5 h-5",
            isActive ? "text-accent" : "text-text-muted group-hover:text-text-primary"
          )} />
          
          {!isCollapsed && <span className="text-sm tracking-tight whitespace-nowrap">{item.name}</span>}
          
          {/* Active Indicator */}
          {isActive && (
            <motion.div
              layoutId="sidebar-active-indicator"
              className={clsx(
                "absolute bg-accent rounded-full",
                isCollapsed ? "right-0 w-1 h-6" : "left-0 w-1 h-5"
              )}
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}

          {/* Tooltip for collapsed mode */}
          {isCollapsed && (
            <div className="absolute left-16 px-2 py-1 bg-text-primary text-bg text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 uppercase tracking-widest shadow-xl">
              {item.name}
            </div>
          )}
        </>
      )}
    </NavLink>
  );
};

const Sidebar = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthed, user, logout } = useAuth();

  const coreNav = [
    { name: 'Explore', path: '/explore', icon: Search },
    { name: 'AI Assistant', path: '/assistant', icon: Sparkles },
    { name: 'Risk Scanner', path: '/scan', icon: Zap },
    { name: 'Founder Playbook', path: '/playbook', icon: ClipboardCheck },
  ];

  const analysisNav = [
    { name: 'Pitch Deck Autopsy', path: '/autopsy', icon: FileText },
    { name: 'Competitor Compare', path: '/compare', icon: GitCompare },
    { name: 'Insights Dashboard', path: '/insights', icon: BarChart2 },
    { name: 'Startup Graph', path: '/graph', icon: Share2 },
  ];

  const learnNav = [
    { name: 'Failure Quiz', path: '/quiz', icon: Brain },
    { name: 'Founder Confessions', path: '/confessions', icon: MessageSquare },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Header with Logo & Toggle */}
      <div className={clsx(
        "flex items-center shrink-0 h-20 border-b border-border/40 mb-6",
        isCollapsed ? "justify-center" : "px-6 justify-between"
      )}>
        <Link to="/" className="flex items-center gap-3 group min-w-0">
          <div className="relative shrink-0">
            <Skull className="w-8 h-8 text-accent animate-pulse group-hover:scale-110 transition-transform" />
            {!isCollapsed && <div className="absolute inset-0 bg-accent/20 blur-lg rounded-full" />}
          </div>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="min-w-0"
            >
              <div className="font-display font-black text-lg tracking-tight text-text-primary leading-none truncate">PIVOTVAULT</div>
              <div className="text-[9px] text-text-muted font-bold mt-1 uppercase tracking-tighter">Failure Intel</div>
            </motion.div>
          )}
        </Link>
        
        {!isCollapsed && (
          <button 
            onClick={() => setIsCollapsed(true)}
            className="p-1.5 rounded-md hover:bg-surface-2 text-text-muted hover:text-text-primary transition-colors hidden lg:block"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-border/40 px-2 py-2">
        <NavSection title="Core" items={coreNav} isCollapsed={isCollapsed} onItemClick={() => setIsMobileOpen(false)} />
        <NavSection title="Analysis" items={analysisNav} isCollapsed={isCollapsed} onItemClick={() => setIsMobileOpen(false)} />
        <NavSection title="Learn" items={learnNav} isCollapsed={isCollapsed} onItemClick={() => setIsMobileOpen(false)} />
        
        {/* Utilities */}
        <div className="mt-4 pt-4 border-t border-border/40">
          {!isCollapsed && <div className="px-4 mb-3 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">System</div>}
          
          <SidebarItem item={{ name: 'Bookmarks', path: '/bookmarks', icon: Bookmark }} isCollapsed={isCollapsed} onClick={() => setIsMobileOpen(false)} />
          
          <button
            onClick={toggleTheme}
            className={clsx(
              "w-full relative flex items-center rounded-lg transition-all duration-200 text-text-secondary hover:text-text-primary hover:bg-surface-2 group mb-1",
              isCollapsed ? "justify-center h-12 w-12 mx-auto" : "px-3 py-2.5 gap-3 mx-2"
            )}
          >
            {theme === 'blue' ? <Sun className="w-5 h-5 shrink-0" /> : <Moon className="w-5 h-5 shrink-0" />}
            {!isCollapsed && <span className="text-sm tracking-tight whitespace-nowrap">{theme === 'blue' ? 'Light Mode' : 'Dark Mode'}</span>}
            {isCollapsed && (
              <div className="absolute left-16 px-2 py-1 bg-text-primary text-bg text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 uppercase tracking-widest shadow-xl">
                {theme === 'blue' ? 'Light Mode' : 'Dark Mode'}
              </div>
            )}
          </button>

          <SidebarItem item={{ name: 'Profile', path: '/history', icon: User }} isCollapsed={isCollapsed} onClick={() => setIsMobileOpen(false)} />
          
          {isAuthed && (
            <button
              onClick={() => { logout(); setIsMobileOpen(false); }}
              className={clsx(
                "w-full relative flex items-center rounded-lg transition-all duration-200 text-text-secondary hover:text-red hover:bg-red/5 group mb-1",
                isCollapsed ? "justify-center h-12 w-12 mx-auto" : "px-3 py-2.5 gap-3 mx-2"
              )}
            >
              <LogOut className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span className="text-sm tracking-tight whitespace-nowrap">Sign Out</span>}
            </button>
          )}
        </div>
      </div>

      {/* Footer / User Profile */}
      <div className={clsx(
        "mt-auto p-4 border-t border-border/40 transition-all",
        isCollapsed ? "items-center" : "bg-surface-2/30"
      )}>
        {isAuthed ? (
          <div className={clsx("flex items-center gap-3 min-w-0", isCollapsed ? "justify-center" : "px-2")}>
            <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center border border-accent/20 shrink-0">
              <User className="w-5 h-5 text-accent" />
            </div>
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-text-primary truncate">{user?.name}</div>
                <div className="text-[10px] text-text-muted truncate uppercase font-bold tracking-tighter">Founder</div>
              </div>
            )}
          </div>
        ) : (
          <Link 
            to="/login" 
            onClick={() => setIsMobileOpen(false)}
            className={clsx(
              "flex items-center justify-center bg-accent hover:bg-orange-600 text-white transition-all shadow-lg shadow-accent/20",
              isCollapsed ? "w-10 h-10 rounded-full" : "w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest"
            )}
          >
            {isCollapsed ? <LogOut className="w-4 h-4 rotate-180" /> : "Access Vault"}
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 px-6 bg-bg/80 backdrop-blur-xl border-b border-border/40 z-[50] flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Skull className="w-7 h-7 text-accent" />
          <span className="font-display font-black text-sm tracking-tighter uppercase">PIVOTVAULT</span>
        </Link>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 rounded-lg bg-surface-2 border border-border/50 text-text-primary"
        >
          {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Collapsed/Expanded Trigger for Desktop (Floating button when collapsed) */}
      {isCollapsed && (
        <button 
          onClick={() => setIsCollapsed(false)}
          className="hidden lg:flex fixed top-6 left-6 z-[60] p-2 bg-bg border border-border/50 rounded-lg text-text-muted hover:text-accent shadow-xl"
        >
          <PanelLeft className="w-5 h-5" />
        </button>
      )}

      {/* Desktop Sidebar */}
      <motion.aside 
        animate={{ width: isCollapsed ? 72 : 280 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="hidden lg:flex fixed top-0 left-0 bottom-0 bg-bg/70 backdrop-blur-2xl border-r border-border/40 z-[40] overflow-hidden"
      >
        <div className={clsx("h-full transition-opacity duration-300", isCollapsed ? "w-[72px]" : "w-[280px]")}>
          {sidebarContent}
        </div>
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] bg-bg z-[70] lg:hidden shadow-2xl"
            >
              <div className="w-[280px] h-full">
                {sidebarContent}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

const NavSection = ({ title, items, isCollapsed, onItemClick }) => (
  <div className="mb-4">
    {!isCollapsed && (
      <div className="px-4 mb-2 text-[10px] font-black text-text-muted uppercase tracking-[0.2em] opacity-60">
        {title}
      </div>
    )}
    <div className="space-y-0.5">
      {items.map((item) => (
        <SidebarItem key={item.path} item={item} isCollapsed={isCollapsed} onClick={onItemClick} />
      ))}
    </div>
  </div>
);

export default Sidebar;
