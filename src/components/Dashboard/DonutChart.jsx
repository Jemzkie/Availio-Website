import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register required components
ChartJS.register(ArcElement, Tooltip, Legend);

const CustomDoughnutChart = ({ bookingStatusData }) => {
  const { completed, cancel, pending } = bookingStatusData;

  const data = {
    labels: ["Completed", "Cancel", "Pending"],
    datasets: [
      {
        label: "Today",
        data: [completed, cancel, pending],
        backgroundColor: ["#05df72", "#E60000", "#FFC107"],
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

  return (
    <div className="mx-auto max-h-60 items-center flex justify-center">
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default CustomDoughnutChart;
