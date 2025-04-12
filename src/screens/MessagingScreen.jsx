import React, { useState, useEffect } from "react";
import Menu from "../components/General/Menu";
import Messaging from "../components/Messaging/Messaging";
import fetchUser from "../hooks/userData";
import Loader from "../components/General/Loader";
import { useSession } from "../context/SessionContext";

const MessagingScreen = () => {
  const ViewData = "Messaging";
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRequest = await fetchUser(user.uid);
        setUserData(userRequest);

        setIsLoading(false);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user.uid]);

  if (isLoading) {
    return <Loader ViewData={ViewData} />;
  }

  return (
    <div className="w-full flex flex-col h-auto">
      <div className="flex flex-row">
        <Menu ViewData={ViewData} />
        <Messaging userData={userData} ViewData={ViewData} />
      </div>
    </div>
  );
};

export default MessagingScreen;
