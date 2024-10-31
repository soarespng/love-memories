import React, { useState } from 'react';
import { Home, Image, Settings, User, Plus, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  const menuItems = [
    { icon: Home, label: 'Home', href: '/home' },
    // { icon: Calendar, label: 'Histórico', href: '/history' },
    // { icon: Bell, label: 'Notificações', href: '/notifications' },
    // { icon: Settings, label: 'Configurações', href: '/settings' },
  ];

  const handleNewDate = (e) => {
    e.preventDefault();
    setIsOpen(true);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col fixed z-20 left-0 top-0 h-screen w-64 bg-white shadow-lg">
        <div className="p-4 border-b">
          <div className="flex items-center space-x-3">
            <User className="w-8 h-8 text-gray-600" />
            <span className="font-semibold text-gray-800">Seu Perfil</span>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <a onClick={handleNewDate} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <Plus className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">Novo Date</span>
              </a>
            </li>
            {menuItems.map((item) => (
              <li key={item.label}>
                <a href={item.href} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                  <item.icon className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-100 transition-colors text-red-600"
          >
            <LogOut className="w-5 h-5" />
            <span>Sair</span>
          </button>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="flex justify-between items-center px-6 py-2">
          <a href="/home" className="flex flex-col items-center p-2">
            <Home className="w-6 h-6 text-gray-600" />
          </a>
          <a href="/history" className="flex flex-col items-center p-2">
            <Image className="w-6 h-6 text-gray-600" />
          </a>
          <div className="relative -top-5">
            <button
              onClick={handleNewDate}
              className="flex items-center justify-center w-20 h-20 rounded-full bg-red-300 text-white shadow-lg"
            >
              <Plus className="w-8 h-8" />
            </button>
          </div>
          <a href="/settings" className="flex flex-col items-center p-2">
            <Settings className="w-6 h-6 text-gray-600" />
          </a>
          <a onClick={handleLogout} className="flex flex-col items-center p-2">
            <LogOut className="w-6 h-6 text-gray-600" />
          </a>
        </div>
      </div>
    </>
  );
};

export default NavBar;