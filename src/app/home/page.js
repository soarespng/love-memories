"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import NavBar from "@/components/Navbar";
import MainContent from "@/components/MainContent";
import Gallery from "@/components/Gallery";

export default function AuthHome() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("home");
  const [dataLoaded, setDataLoaded] = useState(false);
  const [activities, setActivities] = useState([]);
  const [finishedActivities, setFinishedActivities] = useState(0);
  const [coupleData, setCoupleData] = useState(null);
  const [collections, setCollections] = useState([]);
  const [userData, setUserData] = useState({ user1: null, user2: null });
  const [currentUser, setCurrentUser] = useState([])
  const [daysTogether, setDaysTogether] = useState(0);
  const router = useRouter();

  const revalidateData = async () => {
    if (coupleData?.id) {
      await fetchAllDates(coupleData.id);
      await fetchCollections(coupleData.id);
    }
  };

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
          await fetchCoupleData(decodedToken.id);
          await fetchCurrentUser(decodedToken.id);
        }
      } catch (error) {
        console.error("Erro ao decodificar o token:", error);
        localStorage.removeItem("token");
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, [router]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, router]);

  const fetchCurrentUser = async (userId) => {
    try {
      const response = await fetch(`/api/user/${userId}`);
      const data = await response.json();

      if (response.ok) {
        setCurrentUser(data);
      }
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
    }
  };

  const fetchCoupleData = async (userId) => {
    try {
      const response = await fetch(`/api/couple/${userId}`);
      const data = await response.json();
      if (response.ok) {
        setCoupleData(data.couple);
        await fetchUsersData(data.couple.user1_id, data.couple.user2_id);
        await fetchAllDates(data.couple.id);
        await fetchCollections(data.couple.id);

        setDataLoaded(true);
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

  const fetchUsersData = async (user1Id, user2Id) => {
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

  const fetchAllDates = async (coupleId) => {
    try {
      const response = await fetch(`/api/couple/dates/${coupleId}`);
      const data = await response.json();
      if (response.ok) {
        setActivities(data.allDates);
        setFinishedActivities(data.allDates.filter((activity) => activity.date_finished === true).length);
      } else {
        console.error("Erro ao buscar tarefas");
      }
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
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

  if (isLoading || !dataLoaded) {
    return null;
  }

  return (
    <>
      <NavBar currentUser={currentUser} collections={collections} setActiveSection={setActiveSection} revalidateData={revalidateData} />
      <div className="flex">
        <div className="hidden sm:block sm:min-w-64 max-w-64 h-screen"></div>

        {activeSection === "home" && (
          <MainContent
            activities={activities}
            coupleData={coupleData}
            userData={userData}
            daysTogether={daysTogether}
            finishedActivities={finishedActivities}
            revalidateData={revalidateData} />
        )}

        {activeSection === "gallery" && (
          <Gallery activities={activities} />
        )}
      </div>
    </>
  );
}