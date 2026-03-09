import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  MessageSquare,
  TrendingUp,
  Dumbbell,
  Calendar,
  Settings,
  Menu,
  X,
  GraduationCap,
} from 'lucide-react';
import { useStudentStore } from '../../stores/useStudentStore';

const navItems = [
  { to: '/', icon: Home, label: 'Tableau de bord' },
  { to: '/homework', icon: MessageSquare, label: 'Aide aux devoirs' },
  { to: '/weaknesses', icon: TrendingUp, label: 'Points faibles' },
  { to: '/exercises', icon: Dumbbell, label: 'Exercices' },
  { to: '/planner', icon: Calendar, label: 'Planning' },
  { to: '/settings', icon: Settings, label: 'Paramètres' },
];

export const Sidebar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { student } = useStudentStore();

  const NavContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 pt-6 pb-8">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#F7931A] to-[#FF6B00] flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-base font-bold bg-gradient-to-r from-[#F7931A] to-[#FF6B00] bg-clip-text text-transparent">
              Mistral
            </span>
            <span className="text-base font-bold text-gray-900 dark:text-white"> Education</span>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.to === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.to);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={`sidebar-link ${
                isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute right-3 w-1.5 h-1.5 rounded-full bg-[#F7931A]"
                />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Student info at bottom */}
      <div className="px-3 pb-6 pt-4 border-t border-gray-200 dark:border-white/5">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-100 dark:bg-white/5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F7931A] to-[#FF6B00] flex items-center justify-center flex-shrink-0 text-sm font-bold text-white">
            {student.firstName[0]}{student.lastName[0]}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {student.firstName} {student.lastName}
            </p>
            <p className="text-xs text-gray-400 dark:text-white/40 truncate">{student.grade}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 bg-white dark:bg-[#111113] border-r border-gray-200 dark:border-white/5 h-screen sticky top-0">
        <NavContent />
      </aside>

      {/* Mobile toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-white dark:bg-[#111113] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/60 z-40"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-[#111113] border-r border-gray-200 dark:border-white/5 z-50"
            >
              <NavContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
