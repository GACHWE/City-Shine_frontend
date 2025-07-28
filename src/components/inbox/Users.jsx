// import React, { useState } from "react";
// import { FiSearch } from "react-icons/fi";

// const mockUsers = [
//   {
//     id: 1,
//     name: "John Doe",
//     lastMessage: "Hey, are you free this weekend?",
//     avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
//     status: "online",
//   },
//   {
//     id: 2,
//     name: "Jane Smith",
//     lastMessage: "I received the product. Thanks!",
//     avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704e",
//     status: "offline",
//   },
//   {
//     id: 3,
//     name: "Alex Johnson",
//     lastMessage: "Can you send the report?",
//     avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704f",
//     status: "away",
//   },
//   {
//     id: 4,
//     name: "Sarah Williams",
//     lastMessage: "Sure, I'll check on that.",
//     avatar: "https://i.pravatar.cc/150?u=a042581f4e29026705d",
//     status: "online",
//   },
// ];

// const Users = () => {
//   const [selectedUser, setSelectedUser] = useState(mockUsers[0]);

//   const handleUserClick = (user) => {
//     setSelectedUser(user);
//     // In a real app, you would also fetch the chat history for this user
//   };

//   return (
//     <div className="h-full flex flex-col">
//       {/* Search Bar */}
//       <div className="relative mb-4">
//         <input
//           type="text"
//           placeholder="Search users..."
//           className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
//         />
//         <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-400" />
//       </div>

//       {/* User List */}
//       <div className="flex-1 overflow-y-auto space-y-2">
//         {mockUsers.map((user) => (
//           <div
//             key={user.id}
//             onClick={() => handleUserClick(user)}
//             className={`
//               flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-colors
//               ${
//                 selectedUser.id === user.id
//                   ? "bg-blue-100 dark:bg-blue-700"
//                   : "bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
//               }
//             `}
//           >
//             <div className="relative">
//               <img
//                 src={user.avatar}
//                 alt={user.name}
//                 className="w-10 h-10 rounded-full"
//               />
//               <span
//                 className={`
//                   absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white dark:ring-gray-800
//                   ${
//                     user.status === "online"
//                       ? "bg-green-500"
//                       : user.status === "away"
//                       ? "bg-yellow-500"
//                       : "bg-gray-400"
//                   }
//                 `}
//               />
//             </div>
//             <div className="flex-1 min-w-0">
//               <p className="text-sm font-semibold truncate text-gray-900 dark:text-gray-100">
//                 {user.name}
//               </p>
//               <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
//                 {user.lastMessage}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Users;