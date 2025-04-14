import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register required components
ChartJS.register(ArcElement, Tooltip, Legend);

const CustomDoughnutChart = ({ bookingStatusData, filterOptions }) => {
  const statusData = bookingStatusData[filterOptions.toLowerCase()] || {
    complete: 0,
    cancelled: 0,
    ongoing: 0,
    pending: 0,
  };

  const { complete, ongoing, cancelled, pending } = statusData;

  const data = {
    labels: ["Complete", "Cancelled", "On-Going", "Pending"],
    datasets: [
      {
        label: filterOptions,
        data: [complete, ongoing, cancelled, pending],
        backgroundColor: ["#05df72", "#E60000", "#d97706", "#FFC107"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    cutout: "75%",
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  if (complete === 0 && cancelled === 0 && pending === 0 && ongoing === 0) {
    return (
      <div className="flex items-center justify-center text-gray-500">
        No Data Found
      </div>
    );
  }

  return (
    <div className="mx-auto max-h-60 items-center flex justify-center">
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default CustomDoughnutChart;
