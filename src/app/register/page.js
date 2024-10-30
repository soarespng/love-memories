"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import RegisterForm from '@/components/RegisterForm';
import 'sweetalert2/dist/sweetalert2.min.css';

const MySwal = withReactContent(Swal);

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState("");
  const router = useRouter();

  const showAlert = () => {
    MySwal.fire({
      text: 'Cadastro realizado!',
      toast: true,
      position: 'top-end',
      icon: 'success',
      showConfirmButton: false,
      timer: 3000,
      customClass: {
        popup: 'bg-blue-500 p-4 rounded-md shadow-lg',
        title: 'font-bold text-lg',
      },
      didClose: () => {
        router.push('/');
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      showAlert();
    } else {
      console.error('Error:', data);
      setError(data.message || 'Erro ao registrar usuário');
    }
  };

  return (
    <div className="min-h-screen w-full">
      {/* mobile */}
      <div className="lg:hidden flex flex-col min-h-screen bg-white">
        <div className="flex-1 p-6 flex flex-col">
          <div className="mb-8 p-8 bg-blue-300 rounded-2xl">
            <img
              src="https://nrvzuwrimkiqhphdsusa.supabase.co/storage/v1/object/public/home-images/slider-images/Man%20puts%20flower%20in%20woman's%20hair.png"
              alt="Ilustração de um casal"
              className="w-full h-48 object-cover rounded-xl"
            />
          </div>
          <div>
            <h2 className="text-1xl font-bold mb-6">Crie sua conta</h2>
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <RegisterForm
            username={username}
            setUsername={setUsername}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            handleSubmit={handleSubmit}
            error={error} />
        </div>
      </div>

      {/* desktop */}
      <div className="flex w-full justify-center items-center">
        <div className="flex h-screen w-full">
          <div className="w-1/2 flex items-center justify-center">
            <div className="w-8/12">
              <div>
                <h2 className="text-3xl font-bold mb-6">Crie sua conta</h2>
              </div>
              {error && <p className="text-red-500">{error}</p>}
              <RegisterForm
                username={username}
                setUsername={setUsername}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                handleSubmit={handleSubmit}
                error={error} />
            </div>
          </div>
          <div className="w-1/2 flex items-center p-16 justify-center">
            <div className="h-full bg-blue-300 rounded-2xl w-full overflow-hidden flex flex-col">
              <div className="flex-grow flex items-center justify-center px-8">
                <img
                  src="https://nrvzuwrimkiqhphdsusa.supabase.co/storage/v1/object/public/home-images/slider-images/Woman%20and%20man%20giving%20each%20other%20high%20five.png"
                  alt="Ilustração de um casal"
                  className="w-fit h-auto"
                />
              </div>
              <div className="p-4 text-center text-sm">
                <a href="#" className="hover:underline">Contatos</a>
                <span className="mx-2">|</span>
                <a href="#" className="hover:underline">Redes sociais</a>
                <span className="mx-2">|</span>
                <a href="#" className="hover:underline">FAQ</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
