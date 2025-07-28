// import React from "react";
// import Table from "../../components/Table";

// // Example mock data for a suppliers table
// const suppliersData = [
//   { id: 1, name: "Global Supply Co.", contact: "jane@supplyco.com", phone: "555-1234" },
//   { id: 2, name: "Tech Parts Inc.", contact: "john@techparts.com", phone: "555-5678" },
// ];

// const suppliersColumns = [
//   { accessorKey: "name", header: "Supplier Name" },
//   { accessorKey: "contact", header: "Contact Email" },
//   { accessorKey: "phone", header: "Phone" },
// ];

// const Suppliers = () => {
//   return (
//     <div className="pt-20 pb-5">
//       <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
//         Suppliers
//       </h2>
//       <Table
//         data={suppliersData}
//         fields={suppliersColumns}
//         numberOfRows={suppliersData.length}
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

// export default Suppliers;