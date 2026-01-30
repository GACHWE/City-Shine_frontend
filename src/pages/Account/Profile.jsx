// import React, { useCallback, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { removeAddress, selectUserInfo } from "../../store/features/user";
// import AddAddress from "./AddAddress";
// import { setLoading } from "../../store/features/common";
// import { deleteAddressAPI } from "../../api/userInfo";
// import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

// const Profile = () => {
//   const userInfo = useSelector(selectUserInfo);
//   const [addAddress, setAddAddress] = useState(false);
//   const dispatch = useDispatch();

//   const onDeleteAddress = useCallback((id) => {
//     dispatch(setLoading(true));
//     deleteAddressAPI(id)
//       .then((res) => {
//         dispatch(removeAddress(id));
//       })
//       .catch((err) => {
//         console.error("Failed to delete address:", err);
//       })
//       .finally(() => {
//         dispatch(setLoading(false));
//       });
//   }, [dispatch]);

//   return (
//     <div>
//       <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Profile</h1>
      
//       {!addAddress ? (
//         <div>
//           {/* Contact Details */}
//           <div className="mb-8">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Contact Details</h2>
//               <button className="flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors">
//                 <FaEdit className="w-4 h-4 mr-1" />
//                 Edit
//               </button>
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
//                 <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Full Name</p>
//                 <p className="text-gray-900 dark:text-white">
//                   {userInfo?.firstName} {userInfo?.lastName}
//                 </p>
//               </div>
              
//               <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
//                 <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Phone Number</p>
//                 <p className="text-gray-900 dark:text-white">{userInfo?.phoneNumber ?? "Not provided"}</p>
//               </div>
              
//               <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg md:col-span-2">
//                 <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Email</p>
//                 <p className="text-gray-900 dark:text-white">{userInfo?.email}</p>
//               </div>
//             </div>
//           </div>

//           {/* Addresses */}
//           <div>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Addresses</h2>
//               <button 
//                 onClick={() => setAddAddress(true)}
//                 className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
//               >
//                 <FaPlus className="w-4 h-4 mr-1" />
//                 Add New
//               </button>
//             </div>

//             {userInfo?.addressList?.length > 0 ? (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {userInfo.addressList.map((address, index) => (
//                   <div
//                     key={index}
//                     className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:shadow-md dark:hover:shadow-gray-800/20 transition-shadow"
//                   >
//                     <p className="font-medium text-gray-900 dark:text-white mb-2">{address?.name}</p>
//                     <p className="text-gray-600 dark:text-gray-400 mb-2">{address?.phoneNumber}</p>
//                     <p className="text-gray-600 dark:text-gray-400 mb-2">
//                       {address?.street}, {address?.city}, {address?.state}
//                     </p>
//                     <p className="text-gray-600 dark:text-gray-400">{address?.zipCode}</p>
                    
//                     <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
//                       <button className="flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm">
//                         <FaEdit className="w-3 h-3 mr-1" />
//                         Edit
//                       </button>
//                       <button 
//                         onClick={() => onDeleteAddress(address?.id)}
//                         className="flex items-center text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm"
//                       >
//                         <FaTrash className="w-3 h-3 mr-1" />
//                         Remove
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-10 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
//                 <p className="text-gray-500 dark:text-gray-400">No addresses saved yet</p>
//                 <button 
//                   onClick={() => setAddAddress(true)}
//                   className="mt-3 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
//                 >
//                   Add your first address
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       ) : (
//         <AddAddress onCancel={() => setAddAddress(false)} />
//       )}
//     </div>
//   );
// };

// export default Profile;

import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeAddress, selectUserInfo} from "../../store/features/user";
import AddressModal from "./AddAddress";
import EditContactDetails from "./EditContactDetails";
import { setLoading } from "../../store/features/common";
import { deleteAddressAPI } from "../../api/userInfo";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const Profile = () => {
  const userInfo = useSelector(selectUserInfo);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showEditContact, setShowEditContact] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const dispatch = useDispatch();

  const onDeleteAddress = useCallback((id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) {
      return;
    }
    
    dispatch(setLoading(true));
    deleteAddressAPI(id)
      .then((res) => {
        dispatch(removeAddress(id));
      })
      .catch((err) => {
        console.error("Failed to delete address:", err);
        alert("Failed to delete address. Please try again.");
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  }, [dispatch]);

  const handleAddAddress = () => {
    setEditingAddress(null);
    setShowAddressModal(true);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setShowAddressModal(true);
  };

  const handleCloseAddressModal = () => {
    setShowAddressModal(false);
    setEditingAddress(null);
  };

  const handleAddressSuccess = (address) => {
    console.log(editingAddress ? 'Address updated:' : 'Address added:', address);
    // Optional: Show success message or perform additional actions
  };

  const handleContactUpdateSuccess = (updatedData) => {
    console.log('Contact details updated:', updatedData);
    setShowEditContact(false);
    // Optional: Show success message
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Profile</h1>
      
      {!showAddressModal && !showEditContact ? (
        <div>
          {/* Contact Details */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Contact Details</h2>
              <button 
                onClick={() => setShowEditContact(true)}
                className="flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
              >
                <FaEdit className="w-4 h-4 mr-1" />
                Edit
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Full Name</p>
                <p className="text-gray-900 dark:text-white">
                  {userInfo?.firstName || 'Not set'} {userInfo?.lastName || ''}
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Phone Number</p>
                <p className="text-gray-900 dark:text-white">{userInfo?.phoneNumber || "Not provided"}</p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg md:col-span-2">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Email</p>
                <p className="text-gray-900 dark:text-white">{userInfo?.email || "Not provided"}</p>
              </div>
            </div>
          </div>

          {/* Addresses */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                Addresses {userInfo?.addressList?.length > 0 && `(${userInfo.addressList.length})`}
              </h2>
              <button 
                onClick={handleAddAddress}
                className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <FaPlus className="w-4 h-4 mr-1" />
                Add New
              </button>
            </div>

            {userInfo?.addressList?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userInfo.addressList.map((address, index) => (
                  <div
                    key={address.id || index}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:shadow-md dark:hover:shadow-gray-800/20 transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium text-gray-900 dark:text-white">{address?.name || `Address ${index + 1}`}</p>
                      {address.isDefault && (
                        <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs px-2 py-1 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-2">{address?.phoneNumber}</p>
                    
                    {/* Kenyan Address Format */}
                    <div className="text-gray-600 dark:text-gray-400 text-sm space-y-1">
                      {address?.estate && (
                        <p><span className="font-medium">Estate:</span> {address.estate}</p>
                      )}
                      {address?.street && (
                        <p><span className="font-medium">Street:</span> {address.street}</p>
                      )}
                      {address?.building && (
                        <p><span className="font-medium">Building:</span> {address.building}</p>
                      )}
                      {address?.ward && (
                        <p><span className="font-medium">Ward:</span> {address.ward}</p>
                      )}
                      {address?.constituency && (
                        <p><span className="font-medium">Constituency:</span> {address.constituency}</p>
                      )}
                      {address?.county && (
                        <p><span className="font-medium">County:</span> {address.county}</p>
                      )}
                      {address?.landmark && (
                        <p><span className="font-medium">Landmark:</span> {address.landmark}</p>
                      )}
                    </div>

                    {address?.additionalInstructions && (
                      <p className="text-gray-500 dark:text-gray-500 text-sm mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                        <span className="font-medium">Instructions:</span> {address.additionalInstructions}
                      </p>
                    )}
                    
                    <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                      <button 
                        onClick={() => handleEditAddress(address)}
                        className="flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm"
                      >
                        <FaEdit className="w-3 h-3 mr-1" />
                        Edit
                      </button>
                      <button 
                        onClick={() => onDeleteAddress(address?.id)}
                        className="flex items-center text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm"
                      >
                        <FaTrash className="w-3 h-3 mr-1" />
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                <p className="text-gray-500 dark:text-gray-400 mb-2">No addresses saved yet</p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mb-4">
                  Add your delivery addresses for faster checkout
                </p>
                <button 
                  onClick={handleAddAddress}
                  className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium"
                >
                  Add your first address
                </button>
              </div>
            )}
          </div>
        </div>
      ) : showAddressModal ? (
        <AddressModal
          onCancel={handleCloseAddressModal}
          mode={editingAddress ? "edit" : "add"}
          initialData={editingAddress}
          onSuccess={handleAddressSuccess}
        />
      ) : (
        <EditContactDetails
          onCancel={() => setShowEditContact(false)}
          initialData={{
            firstName: userInfo?.firstName || '',
            lastName: userInfo?.lastName || '',
            phoneNumber: userInfo?.phoneNumber || '',
            email: userInfo?.email || ''
          }}
          onSuccess={handleContactUpdateSuccess}
        />
      )}
    </div>
  );
};

export default Profile;