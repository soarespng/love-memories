import React, { useState } from 'react';
import { Home, Image, Users2, User, Plus, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { BaseModal, FormField, ModalActions } from '@/components/Modals';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const NavBar = ({ currentUser, coupleData, activeSection, setActiveSection, revalidateData, revalidateCoupleData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({destiny: '', event: '', calendar: '', category: ''});
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryData, setCategoryData] = useState({ coupleId: '', category: '' });

  const router = useRouter();

  const showSuccessAlert = (message) => {
    MySwal.fire({
      text: message,
      toast: true,
      position: 'top-end',
      icon: 'success',
      showConfirmButton: false,
      timer: 3000,
      customClass: {
        popup: 'bg-blue-500 p-4 rounded-md shadow-lg',
        title: 'font-bold text-lg',
      }
    });
  };

  const showErrorAlert = (message) => {
    MySwal.fire({
      text: message,
      toast: true,
      position: 'top-end',
      icon: 'error',
      showConfirmButton: false,
      timer: 3000,
      customClass: {
        popup: 'bg-blue-500 p-4 rounded-md shadow-lg',
        title: 'font-bold text-lg',
      }
    });
  };

  const handleNewDate = () => setIsOpen(true);

  const handleClose = () => {
    setIsOpen(false);
    setFormData({ destiny: '', event: '', calendar: '', category: '' });
  };

  const handleCategoryClose = () => {
    setIsCategoryModalOpen(false);
    setCategoryData({ coupleId: '', category: '' });
  };

  const handleSaveDate = async (e) => {
    e.preventDefault();
    try {
      formData.coupleId = coupleData.id;
      const response = await fetch('/api/date/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Falha ao criar novo date');

      showSuccessAlert("Date criado com sucesso!");
      setIsOpen(false);
      setFormData({ destiny: '', event: '', calendar: '', category: '' });
      revalidateData();
    } catch (error) {
      console.error('Erro ao salvar date:', error);
      showErrorAlert(error.message);
    }
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    try {
      categoryData.coupleId = coupleData.id;
      const response = await fetch('/api/couple/dates/updateCategory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) throw new Error('Falha ao criar nova categoria');

      showSuccessAlert("Categoria criada com sucesso!");

      setIsCategoryModalOpen(false);
      setCategoryData({ coupleId: '', category: '' });
      revalidateCoupleData();
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
      showErrorAlert(error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const { name, value } = e.target;
    setCategoryData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  const isLoading = !currentUser;

  return (
    <>
      {isLoading ? (
        <div className="text-center text-gray-500">Carregando dados...</div>
      ) : (
        <>
          {/* Navbar Desktop */}
          <div className="hidden md:flex flex-col fixed z-20 left-0 top-0 h-screen w-64 bg-white shadow-lg">
            <div className="p-4 border-b">
              <div className="flex items-center space-x-3">
                <User className="w-8 h-8 text-gray-600" />
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800">
                    {currentUser?.user?.name || 'Carregando...'}
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
                    <Plus className="w-6 h-6 text-gray-600" />
                    <span className="text-gray-700">Novo Date</span>
                  </button>
                </li>
                <li>
                  <a
                    onClick={() => setActiveSection("home")}
                    className={`flex items-center w-full space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${activeSection === "home" ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    <Home className={`w-6 h-6 ${activeSection === "home" ? 'text-blue-700' : 'text-gray-600'}`} />
                    <span>Home</span>
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => setActiveSection("gallery")}
                    className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${activeSection === "gallery" ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    <Image className={`w-6 h-6 ${activeSection === "gallery" ? 'text-blue-700' : 'text-gray-600'}`} />
                    <span>Galeria</span>
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => setActiveSection("coupleProfile")}
                    className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${activeSection === "coupleProfile" ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    <Users2 className={`w-6 h-6 ${activeSection === "coupleProfile" ? 'text-blue-700' : 'text-gray-600'}`} />
                    <span>Perfil do casal</span>
                  </a>
                </li>
              </ul>
            </nav>

            <div className="p-4 border-t">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-100 transition-colors text-red-600"
              >
                <LogOut className="w-6 h-6" />
                <span>Sair</span>
              </button>
            </div>
          </div>

          {/* Navbar Mobile */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-30">
            <div className="flex justify-between items-center px-6 py-2">
              <a onClick={() => setActiveSection("home")} className="flex flex-col items-center p-2">
                <Home className={`w-6 h-6 ${activeSection === "home" ? 'text-blue-700' : 'text-gray-600'}`} />
                <span className={`text-xs ${activeSection === "home" ? 'text-blue-700' : 'text-gray-600'} mt-1`}>Home</span>
              </a>
              <a onClick={() => setActiveSection("gallery")} className="flex flex-col items-center p-2">
                <Image className={`w-6 h-6 ${activeSection === "gallery" ? 'text-blue-700' : 'text-gray-600'}`} />
                <span className={`text-xs ${activeSection === "gallery" ? 'text-blue-700' : 'text-gray-600'} mt-1`}>Galeria</span>
              </a>
              <div className="relative -top-5">
                <button
                  onClick={handleNewDate}
                  className="flex items-center justify-center w-16 h-16 rounded-full bg-red-300 text-white shadow-lg"
                >
                  <Plus className="w-8 h-8" />
                </button>
              </div>
              <a onClick={() => setActiveSection("coupleProfile")} className="flex flex-col items-center p-2">
                <Users2 className={`w-6 h-6 ${activeSection === "coupleProfile" ? 'text-blue-700' : 'text-gray-600'}`} />
                <span className={`text-xs ${activeSection === "coupleProfile" ? 'text-blue-700' : 'text-gray-600'} mt-1`}>Perfil</span>
              </a>
              <button onClick={handleLogout} className="flex flex-col items-center p-2">
                <LogOut className="w-6 h-6 text-red-600" />
                <span className="text-xs text-red-600 mt-1">Sair</span>
              </button>
            </div>
          </div>

          {/* Modal */}
          <BaseModal isOpen={isOpen} onClose={handleClose} title="Novo date">
            <FormField label="Destino">
              <input
                required
                type="text"
                name="destiny"
                value={formData.destiny || ''}
                onChange={handleChange}
                className="w-full py-2 px-4 border rounded-lg"
                placeholder="Pra onde vamos?"
              />
            </FormField>

            <FormField label="Evento">
              <input
                type="text"
                name="event"
                value={formData.event || ''}
                onChange={handleChange}
                className="w-full py-2 px-4 border rounded-lg"
                placeholder="Aniversário de namoro"
              />
            </FormField>

            <FormField label="Data (Opcional)">
              <input
                type="datetime-local"
                name="calendar"
                value={formData.calendar || ''}
                onChange={handleChange}
                className="w-full py-2 px-4 border rounded-lg"
              />
            </FormField>

            <FormField label="Categoria">
              <select
                name="category"
                value={formData.category || ''}
                onChange={handleChange}
                className="w-full py-2 px-4 border rounded-lg"
              >
                <option value="" disabled hidden>Selecione uma categoria</option>
                {coupleData.dates_categories.length > 0 && coupleData.dates_categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <button onClick={() => setIsCategoryModalOpen(true)} className="border rounded-lg ml-3 p-2"><Plus /></button>
            </FormField>

            <ModalActions onClose={handleClose} onSubmit={handleSaveDate} agreeMessage={'Salvar'} desagreeMessage={'Cancelar'} />
          </BaseModal>

          <BaseModal isOpen={isCategoryModalOpen} onClose={handleCategoryClose} title="Nova Categoria">
            <FormField label="Categoria">
              <input
                required
                type="text"
                name="category"
                value={categoryData.category || ''}
                onChange={handleCategoryChange}
                className="w-full py-2 px-4 border rounded-lg"
                placeholder="Filmes, restaurantes, festivais..."
              />
            </FormField>

            <ModalActions onClose={handleCategoryClose} onSubmit={handleSaveCategory} agreeMessage={'Salvar'} desagreeMessage={'Cancelar'} />
          </BaseModal>
        </>
      )}
    </>
  );
};

export default NavBar;
