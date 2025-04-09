import React, { useState, useEffect } from "react";
import Menu from "../components/General/Menu";
import Analytics from "../components/Dashboard/Analytics";
import WalletModal from "../components/Wallet/WalletModal";
import fetchUser from "../hooks/userData";
import { useSession } from "../context/SessionContext";
import Loader from "../components/General/Loader";
import {
  fetchIncomeandExpenses,
  fetchBookingStatus,
  fetchEarningSummary,
} from "../hooks/analyticsService";
import { fetchVehicles } from "../hooks/vehicleService";

const Dashboard = () => {
  const ViewData = "Dashboard";
  const [TopUpModal, setTopUpModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [bookingStatusData, setBookingStatusData] = useState(null);
  const [listings, setListings] = useState([]);
  const [earningData, setEarningData] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const { user } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRequest = await fetchUser(user.uid);
        setUserData(userRequest);

        const analyticsRequest = await fetchIncomeandExpenses(user.uid);
        setAnalyticsData(analyticsRequest);

        const bookingStatusRequest = await fetchBookingStatus(user.uid);
        setBookingStatusData(bookingStatusRequest);

        const vehicles = await fetchVehicles();
        const userListings = vehicles.filter(
          (vehicle) => vehicle.ownerId === user.uid
        );
        setListings(userListings);

        const earningSummaryRequest = await fetchEarningSummary(user.uid);
        setEarningData(earningSummaryRequest);

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
    <div className="w-full flex flex-col min-h-screen h-auto">
      <div className={`flex flex-row ${TopUpModal ? "blur-xs" : ""}`}>
        <Menu ViewData={ViewData} />
        <Analytics
          userData={userData}
          analyticsData={analyticsData}
          isOpen={TopUpModal}
          setTopUpModal={setTopUpModal}
          bookingStatusData={bookingStatusData}
          listingsData={listings}
          earningData={earningData}
        />
      </div>
      <WalletModal
        user={user}
        userData={userData}
        isOpen={TopUpModal}
        setTopUpModal={setTopUpModal}
      />
    </div>
  );
};

export default Dashboard;
