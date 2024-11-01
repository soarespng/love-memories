import React, { useState, useEffect } from 'react';
import { Home, Image, Settings, User, Plus, LogOut, X, Calendar, Collection, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from "jwt-decode";
import { BaseModal, FormField, ModalActions, ImageUpload } from '@/components/Modals';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [collections, setCollections] = useState([]);
  const [formData, setFormData] = useState({ title: '', collectionId: '' });
  const router = useRouter();

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/");
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);

        if (decodedToken.exp < currentTime) {
          localStorage.removeItem("token");
          router.push("/");
        } else {
          setIsAuthenticated(true);
          await fetchUserData(decodedToken.id);
          await fetchCoupleData(decodedToken.id);
        }
      } catch (error) {
        console.error("Erro ao decodificar o token:", error);
        localStorage.removeItem("token");
        router.push("/");
      }
    };

    validateToken();
  }, [router]);

  const fetchUserData = async (userId) => {
    try {
      const response = await fetch(`/api/user/${userId}`);
      const data = await response.json();

      if (response.ok) {
        setUserData(data);
      }
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
    }
  };

  const fetchCoupleData = async (userId) => {
    try {
      const response = await fetch(`/api/couple/${userId}`);

      if (response.ok) {
        const data = await response.json();
        fetchCollections(data.couple.id);
      }
    } catch (error) {
      console.error('Erro ao buscar coleções:', error);
    }
  };

  const fetchCollections = async (coupleId) => {
    try {
      const response = await fetch(`/api/collections/${coupleId}`);

      if (response.ok) {
        const data = await response.json();
        setCollections(data);
      }
    } catch (error) {
      console.error('Erro ao buscar coleções:', error);
    }
  };

  const handleNewDate = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setFormData({ title: '', collectionId: '' });
  };

  const handleSaveDate = async (e) => {
    e.preventDefault();
    console.log(JSON.stringify(formData));
    try {
      const response = await fetch('/api/date/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Falha ao criar novo date');
      }

      setIsOpen(false);
      setFormData({ title: '', collectionId: '' });
      window.location.href = '/home';
    } catch (error) {
      console.error('Erro ao salvar date:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  const isLoading = !userData || !collections.collections;

  return (
    <>
      {isLoading ? (
        <div className="text-center text-gray-500">Carregando dados...</div>
      ) : (
        <>
          <div className="hidden md:flex flex-col fixed z-20 left-0 top-0 h-screen w-64 bg-white shadow-lg">
            <div className="p-4 border-b">
              <div className="flex items-center space-x-3">
                <User className="w-8 h-8 text-gray-600" />
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800">
                    {userData?.user?.name || 'Carregando...'}
                  </span>
                </div>
              </div>
            </div>

            <nav className="flex-1 p-4">
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={handleNewDate}
                    className="flex items-center w-full space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">Novo Date</span>
                  </button>
                </li>
                <li>
                  <a
                    href="/home"
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Home className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">Home</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/settings"
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Settings className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">Configurações</span>
                  </a>
                </li>
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
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-30">
            <div className="flex justify-between items-center px-6 py-2">
              <a href="/home" className="flex flex-col items-center p-2">
                <Home className="w-6 h-6 text-gray-600" />
                <span className="text-xs text-gray-600 mt-1">Home</span>
              </a>
              <a href="/history" className="flex flex-col items-center p-2">
                <Image className="w-6 h-6 text-gray-600" />
                <span className="text-xs text-gray-600 mt-1">Galeria</span>
              </a>
              <div className="relative -top-5">
                <button
                  onClick={handleNewDate}
                  className="flex items-center justify-center w-16 h-16 rounded-full bg-red-300 text-white shadow-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-8 h-8" />
                </button>
              </div>
              <a href="/settings" className="flex flex-col items-center p-2">
                <Settings className="w-6 h-6 text-gray-600" />
                <span className="text-xs text-gray-600 mt-1">Config</span>
              </a>
              <button onClick={handleLogout} className="flex flex-col items-center p-2">
                <LogOut className="w-6 h-6 text-red-600" />
                <span className="text-xs text-red-600 mt-1">Sair</span>
              </button>
            </div>
          </div>
          {/* Modal */}
          <BaseModal isOpen={isOpen} onClose={handleClose} title="Adicionar Novo Date">
            <FormField label="Título">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full py-2 px-4 border rounded-lg"
                placeholder="Digite o título"
              />
            </FormField>

            <FormField label="Coleção">
              <select
                name="collectionId"
                value={formData.collectionId}
                onChange={handleChange}
                className="w-full py-2 px-4 border rounded-lg"
              >
                <option value="">Selecione uma coleção</option>
                {collections.collections.length > 0 && collections.collections.map((collection) => (
                  <option key={collection.id} value={collection.id}>
                    {collection.title}
                  </option>
                ))}
              </select>
            </FormField>

            <ModalActions onClose={handleClose} onSubmit={handleSaveDate} />
          </BaseModal>
        </>
      )}
    </>
  );
};

export default NavBar;