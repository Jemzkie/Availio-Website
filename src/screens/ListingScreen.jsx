import React, { useEffect, useState } from "react";

import Menu from "../components/General/Menu";
import Listing from "../components/Listing/Listing";
import { fetchVehicles } from "../hooks/vehicleService";
import Loader from "../components/General/Loader";
import { useSession } from "../context/SessionContext";
import fetchUser from "../hooks/userData";

const ListingScreen = () => {
  const ViewData = "Listing";
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const { user } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRequest = await fetchUser(user.uid);
        setUserData(userRequest);

        const vehicles = await fetchVehicles();
        const userListings = vehicles.filter(
          (vehicle) => vehicle.ownerId === user.uid
        );
        setListings(userListings);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
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
        <Listing userData={userData} listings={listings} />
      </div>
    </div>
  );
};

export default ListingScreen;
