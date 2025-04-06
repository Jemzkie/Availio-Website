import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CustomLineChart = () => {
  const data = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Last 6 Months",
        data: [500, 20000, 30000, 40000, 50000, 60000],
        fill: true,
        backgroundColor: "rgba(0, 0, 255, 0.2)",
        borderColor: "#ADD8E6",
        tension: 0.4,
      },
      {
        label: "Same Period Last Year",
        data: [500, 1000, 2000, 1500, 2000, 3000],
        fill: true,
        backgroundColor: "rgba(0, 0, 255, 0.2)",
        borderColor: "#D3D3D3",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };
  return (
    <div className="w-full">
      <Line options={options} data={data} />
    </div>
  );
};

export default CustomLineChart;
