// import React from "react";
// import DonutChart from "../../components/DonutChart";
// import Table from "../../components/Table";
// import {
//   productSalesDognutChartData,
//   productSalesDognutChartOptions,
// } from "../../data/chartData";
// import { productSales, productSalesColumns } from "../../data/productSales";

// const ProductSales = () => {
//   return (
//     <div className="pt-20 pb-5">
//       <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
//         Product Sales
//       </h1>

//       {/* Donut Chart and Title */}
//       <div className="mt-2 pb-2">
//         <div
//           className="
//             rounded-xl border border-gray-200 dark:border-gray-700 p-5
//             bg-white dark:bg-gray-800 shadow-sm
//           "
//         >
//           <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
//             Product Sales per Category
//           </h2>
//           <DonutChart
//             chartOptions={productSalesDognutChartOptions}
//             chartData={productSalesDognutChartData}
//           />
//         </div>
//       </div>

//       {/* Sales Table */}
//       <div className="mt-2 pb-2">
//         <Table
//           data={productSales}
//           fields={productSalesColumns}
//           numberOfRows={productSales.length}
//           enableTopToolBar={true}
//           enableBottomToolBar={true}
//           enablePagination={true}
//           enableRowSelection={true}
//           enableColumnFilters={true}
//           enableEditing={true}
//           enableColumnDragging={true}
//         />
//       </div>
//     </div>
//   );
// };

// export default ProductSales;