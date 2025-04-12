import React, { useEffect, useState } from "react";
import Menu from "../components/General/Menu";
import Profile from "../components/Profile/Profile";
import { useSession } from "../context/SessionContext";
import fetchUser from "../hooks/userData";
import Loader from "../components/General/Loader";
const ProfileScreen = () => {
  const ViewData = "Profile";
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRequest = await fetchUser(user.uid);
        setUserData(userRequest);

        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
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
        <Profile user={user} userData={userData} />
      </div>
    </div>
  );
};

export default ProfileScreen;
