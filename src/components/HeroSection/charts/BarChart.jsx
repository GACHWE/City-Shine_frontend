import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";

const BarChart = () => {
  const [chartData] = useState({
    series: [
      {
        name: "Sales",
        data: [44, 55, 41, 67, 22, 43, 21, 33, 45, 31, 87, 65],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded",
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        labels: {
          style: {
            colors: "var(--apexcharts-text-color)",
          },
        },
        axisBorder: {
          show: true,
          color: "var(--apexcharts-border-color)",
        },
        axisTicks: {
          show: true,
          color: "var(--apexcharts-border-color)",
        },
      },
      yaxis: {
        title: {
          text: "Sales ($)",
          style: {
            color: "var(--apexcharts-text-color)",
          },
        },
        labels: {
          style: {
            colors: "var(--apexcharts-text-color)",
          },
        },
      },
      fill: {
        opacity: 1,
        colors: ["#3B82F6"], // Blue
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return "$ " + val + " thousands";
          },
        },
        theme: "dark",
      },
      grid: {
        borderColor: "var(--apexcharts-grid-color)",
      },
    },
  });

  return (
    <div
      className="
        rounded-xl border border-gray-200 dark:border-gray-700 p-5
        bg-white dark:bg-gray-800 shadow-sm h-full
      "
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Monthly Sales
        </h2>
        {/* You can add a dropdown or button here */}
      </div>
      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type="bar"
        height={350}
      />
    </div>
  );
};

export default BarChart;