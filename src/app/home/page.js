"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import NavBar from "@/components/Navbar";
import MainContent from "@/components/MainContent";

export default function AuthHome() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activities, setActivities] = useState([]);
  const [coupleData, setCoupleData] = useState(null);
  const [userData, setUserData] = useState({ user1: null, user2: null });
  const [daysTogether, setDaysTogether] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    try {
      if (typeof window === "undefined") return;

      const decodedToken = jwtDecode(token);
      console.log(decodedToken);
      const currentTime = Math.floor(Date.now() / 1000);

      if (decodedToken.exp < currentTime) {
        localStorage.removeItem("token");
        router.push("/");
      } else {
        setIsAuthenticated(true);
        fetchCoupleData(decodedToken.id);
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      localStorage.removeItem("token");
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

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
