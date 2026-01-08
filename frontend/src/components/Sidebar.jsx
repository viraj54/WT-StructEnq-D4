import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, BadgeIndianRupee, History, FileText } from 'lucide-react';

const Sidebar = ({ isOpen, closeSidebar }) => {
  const links = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Customers', path: '/customers', icon: <Users size={20} /> },
    { name: 'Loans', path: '/loans', icon: <BadgeIndianRupee size={20} /> },
    { name: 'Instalments', path: '/instalments', icon: <History size={20} /> },
    // { name: 'Reports', path: '/reports', icon: <FileText size={20} /> },
  ];

  return (
    <aside 
      className={`fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:inset-0 z-20 w-64 bg-primary text-white transition duration-200 ease-in-out flex flex-col`}
    >
      <div className="p-6 text-2xl font-bold border-b border-gray-700 flex justify-between items-center md:block">
        <span>Menu</span>
        <button onClick={closeSidebar} className="md:hidden text-gray-300 hover:text-white">&times;</button>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            onClick={() => window.innerWidth < 768 && closeSidebar()}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded transition ${
                isActive ? 'bg-accent text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            {link.icon}
            <span>{link.name}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-700 text-sm text-gray-400 text-center">
        &copy; 2025 MicroFinance
      </div>
    </aside>
  );
};

export default Sidebar;
