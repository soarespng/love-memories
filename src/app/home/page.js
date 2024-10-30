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
  const [completedTasksCount, setCompletedTasksCount] = useState(0);
  const [daysTogether, setDaysTogether] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

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
      const response = await fetch(`http://localhost:3000/api/couple/${userId}`);
      const data = await response.json();
      if (response.ok) {
        setCoupleData(data.couple);
        setDaysTogether(Math.floor((new Date() - new Date(data.couple.since)) / (1000 * 60 * 60 * 24)));
        fetchUserData(data.couple.user1_id, data.couple.user2_id);
        fetchAllTasks(data.couple.id);
        fetchCompletedTasks(data.couple.id);
      } else {
        console.error("Erro ao buscar dados do casal");
      }
    } catch (error) {
      console.error("Erro ao buscar dados do casal:", error);
    }
  };

  const fetchUserData = async (user1Id, user2Id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/couple/users/${user1Id}/${user2Id}`);
      const data = await response.json();
      if (response.ok) {
        const userMap = {};
        data.users.forEach((user) => {
          const firstName = user.username.split(" ")[0];
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
      const response = await fetch(`http://localhost:3000/api/couple/tasks/${coupleId}`);
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

  const fetchCompletedTasks = async (coupleId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/couple/tasks/completed/${coupleId}`);
      const data = await response.json();
      if (response.ok) {
        setCompletedTasksCount(data.completedTasksCount);
      } else {
        console.error("Erro ao buscar tarefas concluídas");
      }
    } catch (error) {
      console.error("Erro ao buscar tarefas concluídas:", error);
    }
  };

  return (
    <>
      <NavBar />
      <MainContent 
      activities={activities}
      coupleData={coupleData}
      userData={userData}
      completedTasksCount={completedTasksCount}
      daysTogether={daysTogether}
      />
    </>
  );
}
