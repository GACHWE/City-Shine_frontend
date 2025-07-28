// src/components/DonutChart.jsx

import React from "react";
import ReactApexChart from "react-apexcharts";

const DonutChart = ({ chartData, chartOptions }) => {
  return (
    <div
      className="
        rounded-xl p-5 bg-white dark:bg-gray-800 shadow-sm
        "
    >
      <ReactApexChart
        options={chartOptions}
        series={chartData}
        type="donut"
        height={350}
      />
    </div>
  );
};

export default DonutChart;