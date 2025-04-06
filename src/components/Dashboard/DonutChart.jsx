import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register required components
ChartJS.register(ArcElement, Tooltip, Legend);

const CustomDoughnutChart = () => {
  const data = {
    labels: ["Completed", "Pending", "In Route"],
    datasets: [
      {
        label: "Today",
        data: [45, 25, 30],
        backgroundColor: ["#0000FF", "#FFC107", "#E60000"],
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
