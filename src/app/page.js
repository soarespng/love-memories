"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import LoginForm from "@/components/LoginForm";

const MySwal = withReactContent(Swal);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isUserInCouple, setIsUserInCouple] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          localStorage.removeItem("token");
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Erro ao decodificar o token:", error);
        localStorage.removeItem("token");
        setIsAuthenticated(false);
      }
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      checkUserInCouple(decodedToken.id);
    } else {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const showSuccessAlert = () => {
    MySwal.fire({
      text: 'Redirecionando',
      toast: true,
      position: 'top-end',
      icon: 'success',
      showConfirmButton: false,
      timer: 3000,
      customClass: {
        popup: 'bg-green-500 p-4 rounded-md shadow-lg',
        title: 'font-bold text-lg',
      },
    });
  };

  const showErrorAlert = () => {
    MySwal.fire({
      text: 'Usuário e/ou senha inválidos',
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        setIsAuthenticated(true);
        showSuccessAlert();
      } else {
        showErrorAlert();
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      showErrorAlert("Erro de conexão com o servidor");
    }
  };

  const checkUserInCouple = async (userId) => {
    try {
      const res = await fetch(`http://localhost:3000/api/couple/checkUserCouple/${userId}`);
      const data = await res.json();

      if (data.exists) {
        setIsUserInCouple(true);
        setTimeout(() => {
          router.push("/home");
        }, 3000);
      } else {
        setIsUserInCouple(false);
        setTimeout(() => {
          router.push("/sync");
        }, 3000);
      }
    } catch {
      console.error("Erro ao verificar associação do usuário:", error);
    }
  }

  return (
    <div className="min-h-screen w-full">
      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col min-h-screen bg-white">
        <div className="flex-1 p-6 flex flex-col">
          <div className="mb-8 p-8 bg-blue-300 rounded-2xl">
            <img
              src="https://nrvzuwrimkiqhphdsusa.supabase.co/storage/v1/object/public/home-images/slider-images/Couple%20on%20a%20dinner%20date.png"
              alt="Ilustração de um casal"
              className="w-full h-48 object-cover rounded-xl"
            />
          </div>
          <h1 className="text-1xl font-bold">Bem-vindo à 4Us</h1>
          <p className="mb-8">A plataforma de dates para casais.</p>
          <LoginForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            handleSubmit={handleSubmit}
          />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex w-full justify-center items-center">
        <div className="flex h-screen w-full">
          <div className="w-1/2 flex items-center justify-center">
            <div className="w-8/12">
              <div>
                <h2 className="text-3xl font-bold">Bem-vindo à 4Us</h2>
                <p className="mb-6">A plataforma de atividades e cronogramas divertidos para casais.</p>
              </div>
              <LoginForm
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                handleSubmit={handleSubmit}
              />
            </div>
          </div>
          <div className="w-1/2 flex items-center p-16 justify-center">
            <div className="h-full bg-blue-300 rounded-2xl w-full overflow-hidden flex flex-col">
              <div className="flex-grow flex items-center justify-center px-8">
                <img
                  src="https://nrvzuwrimkiqhphdsusa.supabase.co/storage/v1/object/public/home-images/slider-images/Couple%20on%20a%20dinner%20date.png"
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
