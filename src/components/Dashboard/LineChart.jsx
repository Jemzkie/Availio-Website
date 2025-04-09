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

const CustomLineChart = ({ earningData }) => {
  const [
    January,
    February,
    March,
    April,
    May,
    June,
    July,
    August,
    September,
    October,
    November,
    December,
  ] = earningData;

  console.log(earningData);

  const data = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: "Last 12 Months",
        data: [
          January,
          February,
          March,
          April,
          May,
          June,
          July,
          August,
          September,
          October,
          November,
          December,
        ],
        fill: true,
        backgroundColor: "rgba(0, 0, 255, 0.2)",
        borderColor: "#ADD8E6",
        tension: 0.4,
      },
      // {
      //   label: "Same Period Last Year",
      //   data: [500, 1000, 2000, 1500, 2000, 3000],
      //   fill: true,
      //   backgroundColor: "rgba(0, 0, 255, 0.2)",
      //   borderColor: "#D3D3D3",
      //   tension: 0.4,
      // },
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
    <div className="w-auto h-auto flex justify-center">
      <Line options={options} data={data} />
    </div>
  );
};

export default CustomLineChart;
