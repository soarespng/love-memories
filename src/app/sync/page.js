"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export default function SyncPage() {
  const router = useRouter();
  const [codeArray, setCodeArray] = useState([]);
  const [inputCode, setInputCode] = useState('');

  const showSuccessAlert = () => {
    MySwal.fire({
      text: 'Vinculados com sucesso',
      toast: true,
      position: 'top-end',
      icon: 'success',
      showConfirmButton: false,
      timer: 3000,
      customClass: {
        popup: 'bg-green-500 p-4 rounded-md shadow-lg',
        title: 'font-bold text-lg',
      },
      didClose: () => {
        router.push('/home');
      },
    });
  };

  const showErrorAlert = (message) => {
    MySwal.fire({
      text: message || 'Erro ao vincular o casal',
      toast: true,
      position: 'top-end',
      icon: 'error',
      showConfirmButton: false,
      timer: 3000,
      customClass: {
        popup: 'bg-red-500 p-4 rounded-md shadow-lg',
        title: 'font-bold text-lg',
      },
    });
  };

  useEffect(() => {
    const validateToken = async () => {
      if (typeof window === "undefined") return;

      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const currentTime = Math.floor(Date.now() / 1000);

          if (decodedToken.exp < currentTime) {
            localStorage.removeItem("token");
          } else {
            await fetchUserCode(decodedToken.id);
          }
        } catch (error) {
          console.error("Erro ao decodificar o token:", error);
          localStorage.removeItem("token");
        }
      }
    };

    validateToken();
  }, []);

  const fetchUserCode = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/user/${userId}`);
      const data = await response.json();
      if (response.ok) {
        const userCode = data.user.sync_code;
        setCodeArray(userCode.split(''));
      } else {
        console.error("Erro ao buscar dados do usuário");
      }
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
    }
  };

  const handleSync = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/user/link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userCurrentId: jwtDecode(localStorage.getItem("token")).id,
          syncCode: inputCode
        })
      });

      if (response.ok) {
        showSuccessAlert();
      } else {
        showErrorAlert();
      }
    } catch (error) {
      showErrorAlert();
    }
  };

  return (
    <div className="min-h-screen w-full">
      <div className="lg:hidden flex flex-col min-h-screen bg-white">
        <div className="flex-1 p-6 flex flex-col">
          <div className="mb-8 p-8 bg-blue-300 rounded-2xl">
            <img
              src="https://nrvzuwrimkiqhphdsusa.supabase.co/storage/v1/object/public/home-images/slider-images/Woman%20and%20man%20giving%20each%20other%20high%20five.png"
              alt="High five illustration"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-2">Seu código:</h2>
            <p className="text-sm text-gray-700 mb-2">
              Mande este código de verificação para seu parceiro
            </p>
          </div>

          <div className="flex gap-2 mb-2">
            {codeArray.map((digit, index) => (
              <div
                key={index}
                className="flex-1 h-16 bg-white rounded-lg flex items-center justify-center text-2xl border border-gray-200 shadow-sm"
              >
                {digit}
              </div>
            ))}
          </div>

          <div className="mt-6 mb-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Ou</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSync} className="space-y-4 w-full">
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Insira o código:
              </label>
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-200"
                placeholder="Enter sync code"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gray-900 text-white p-3 rounded-lg hover:bg-gray-800"
            >
              Sincronizar
            </button>
            <button
              type="button"
              className="w-full bg-red-700 text-white p-3 rounded-lg"
              onClick={() => localStorage.removeItem("token")}
            >
              Voltar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
