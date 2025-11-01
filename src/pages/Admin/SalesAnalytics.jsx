// import React from "react";
// import AveargeTotals from "../../components/sales/AveargeTotals";
// import BarChart from "../../components/sales/charts/BarChart";
// import LineChart from "../../components/sales/charts/LineChart";
// import SalesReportChart from "../../components/sales/charts/SalesReportChart";
// import {
//   salesLineChartData,
//   salesLineChartOptions,
//   salesReportPieChartData,
//   salesReportPieChartOptions,
// } from "../../data/chartData";

// const SalesAnalytics = () => {
//   return (
//     <div className="pt-20 pb-5">
//       <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
//         Sales Analytics
//       </h1>

//       <div className="mt-2 pb-2">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           <div className="md:col-span-1 lg:col-span-2">
//             <LineChart
//               chartOptions={salesLineChartOptions}
//               chartData={salesLineChartData}
//             />
//           </div>
//           <div className="md:col-span-1 lg:col-span-1">
//             <div
//               className="
//                 rounded-xl border border-gray-200 dark:border-gray-700 p-5
//                 bg-white dark:bg-gray-800 shadow-sm h-full
//               "
//             >
//               <BarChart />
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="mt-2 pb-2">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="md:col-span-1">
//             <AveargeTotals />
//           </div>
//           <div className="md:col-span-1">
//             <div
//               className="
//                 rounded-xl border border-gray-200 dark:border-gray-700 p-5
//                 bg-white dark:bg-gray-800 shadow-sm h-full
//               "
//             >
//               <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
//                 Sales Report
//               </h2>
//               <SalesReportChart
//                 chartOptions={salesReportPieChartOptions}
//                 chartData={salesReportPieChartData}
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SalesAnalytics;