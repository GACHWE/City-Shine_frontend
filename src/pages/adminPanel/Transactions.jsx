// import React from "react";
// import Table from "../../components/Table";

// // Example mock data for a transactions table
// const transactionsData = [
//   { id: 1, type: "Sale", amount: "$120.00", date: "2024-07-20" },
//   { id: 2, type: "Refund", amount: "$-25.50", date: "2024-07-19" },
//   { id: 3, type: "Sale", amount: "$500.00", date: "2024-07-18" },
// ];

// const transactionsColumns = [
//   { accessorKey: "id", header: "Transaction ID" },
//   { accessorKey: "type", header: "Type" },
//   { accessorKey: "amount", header: "Amount" },
//   { accessorKey: "date", header: "Date" },
// ];

// const Transactions = () => {
//   return (
//     <div className="pt-20 pb-5">
//       <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
//         Transactions
//       </h2>
//       <Table
//         data={transactionsData}
//         fields={transactionsColumns}
//         numberOfRows={transactionsData.length}
//         enableTopToolBar={true}
//         enableBottomToolBar={true}
//         enablePagination={true}
//         enableRowSelection={true}
//         enableColumnFilters={true}
//         enableEditing={true}
//         enableColumnDragging={true}
//       />
//     </div>
//   );
// };

// export default Transactions;