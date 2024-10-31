"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode"; // Remova o uso de chaves para jwtDecode, pois ele não é um default export
import NavBar from "@/components/Navbar";
import MainContent from "@/components/MainContent";

export default function AuthHome() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Estado para verificar carregamento da autenticação
  const [activities, setActivities] = useState([]);
  const [coupleData, setCoupleData] = useState(null);
  const [userData, setUserData] = useState({ user1: null, user2: null });
  const [daysTogether, setDaysTogether] = useState(0);
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
          console.log("Token expirado");
          localStorage.removeItem("token");
          router.push("/");
        } else {
          console.log("Autenticado");
          setIsAuthenticated(true);
          await fetchCoupleData(decodedToken.id);
        }
      } catch (error) {
        console.error("Erro ao decodificar o token:", error);
        localStorage.removeItem("token");
        router.push("/");
      } finally {
        setIsLoading(false); // Marca o fim da verificação de autenticação
      }
    };

    validateToken();
  }, [router]);

  useEffect(() => {
    // Redireciona somente após a autenticação ter sido verificada
    if (!isLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, router]);

  const fetchCoupleData = async (userId) => {
    try {
      const response = await fetch(`/api/couple/${userId}`);
      const data = await response.json();
      if (response.ok) {
        setCoupleData(data.couple);
        fetchUserData(data.couple.user1_id, data.couple.user2_id);
        fetchAllTasks(data.couple.id);
      } else {
        console.error("Erro ao buscar dados do casal");
      }
    } catch (error) {
      console.error("Erro ao buscar dados do casal:", error);
    }
  };

  useEffect(() => {
    if (coupleData?.since) {
      const days = Math.floor((new Date() - new Date(coupleData.since)) / (1000 * 60 * 60 * 24));
      setDaysTogether(days);
    }
  }, [coupleData?.since]);

  const fetchUserData = async (user1Id, user2Id) => {
    try {
      const response = await fetch(`/api/user/users/${user1Id}/${user2Id}`);
      const data = await response.json();
      if (response.ok) {
        const userMap = {};
        data.users.forEach((user) => {
          const firstName = user.name.split(" ")[0];
          userMap[user.id] = firstName;
        });
        setUserData({ user1: userMap[user1Id], user2: userMap[user2Id] });
      } else {
        console.error("Erro ao buscar dados dos usuários");
      }
    } catch (error) {
      console.error("Erro ao buscar dados dos usuários:", error);
    }
  };

  const fetchAllTasks = async (coupleId) => {
    try {
      const response = await fetch(`/api/couple/tasks/${coupleId}`);
      const data = await response.json();
      if (response.ok) {
        setActivities(data.allTasks);
      } else {
        console.error("Erro ao buscar tarefas");
      }
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
    }
  };

  // Retorna nulo enquanto a verificação de autenticação está em progresso
  if (isLoading) {
    return null;
  }

  return (
    <>
      <NavBar />
      <MainContent 
        activities={activities}
        coupleData={coupleData}
        userData={userData}
        daysTogether={daysTogether}
      />
    </>
  );
}
