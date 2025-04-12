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

const CustomLineChart = ({ earningData, filterOptions }) => {
  if (filterOptions === "Yearly") {
    filterOptions = "Monthly";
  }

  const type = filterOptions.toLowerCase();
  const incomeData = earningData?.income?.[type] || {};
  const expenseData = earningData?.expense?.[type] || {};

  const labels = Object.keys(incomeData);

  const data = {
    labels,
    datasets: [
      {
        label: `${
          filterOptions.charAt(0).toUpperCase() + filterOptions.slice(1)
        } Gross Profit`,
        data: labels.map((label) => incomeData[label] || 0),
        fill: true,
        backgroundColor: "rgba(0, 0, 255, 0.2)",
        borderColor: "#007bff",
        tension: 0.4,
      },
      {
        label: `${filterOptions} Net Profit`,
        data: labels.map((label) => expenseData[label] || 0),
        fill: true,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "#ff6384",
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
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
      },
    },
  };

  return (
    <div className="w-auto h-auto flex justify-center">
      <Line options={options} data={data} />
    </div>
  );
};

export default CustomLineChart;
