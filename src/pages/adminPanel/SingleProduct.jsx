// import React from "react";
// import { useParams } from "react-router-dom";
// import Table from "../../components/Table";
// import { customers } from "../../data/customers";
// import { invoiceData, invoiceDataColumns } from "../../data/invoiceList";

// const SingleProduct = () => {
//   const { id } = useParams();
//   const customer = customers.find((customer) => customer.id === parseInt(id));

//   if (!customer) {
//     return (
//       <div className="pt-20 pb-5 text-center text-gray-500">
//         Customer not found.
//       </div>
//     );
//   }

//   const { customer_name, email, address, phone, img } = customer;

//   return (
//     <div className="pt-20 pb-5">
//       <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
//         Customer Details
//       </h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
//         <div className="md:col-span-1 lg:col-span-1">
//           <div
//             className="
//               rounded-xl border border-gray-200 dark:border-gray-700 p-5
//               bg-white dark:bg-gray-800 shadow-sm
//             "
//           >
//             <div className="text-center">
//               <img
//                 src={img}
//                 alt={customer_name}
//                 className="w-20 h-20 rounded-full mx-auto"
//               />
//               <h2 className="text-xl font-semibold my-2 text-gray-900 dark:text-gray-100">
//                 {customer_name}
//               </h2>

//               <div className="mt-4">
//                 <p className="text-base text-gray-600 dark:text-gray-400 mb-2">
//                   Email: <span className="opacity-70">{email}</span>
//                 </p>
//                 <p className="text-base text-gray-600 dark:text-gray-400 mb-2">
//                   Phone: <span className="opacity-70">{phone}</span>
//                 </p>
//                 <p className="text-base text-gray-600 dark:text-gray-400 mb-2">
//                   Address: <span className="opacity-70">{address}</span>
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="md:col-span-1 lg:col-span-2">
//           <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
//             Invoice List
//           </h2>
//           <Table
//             data={invoiceData}
//             fields={invoiceDataColumns}
//             numberOfRows={invoiceData.length}
//             enableTopToolBar={false}
//             enableBottomToolBar={false}
//             enablePagination={false}
//             enableRowSelection={false}
//             enableColumnFilters={false}
//             enableEditing={false}
//             enableColumnDragging={false}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SingleProduct;