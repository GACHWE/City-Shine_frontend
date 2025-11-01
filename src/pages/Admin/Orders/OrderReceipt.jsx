// import React, { useRef, useState } from "react";
// import {
//   FaTimes,
//   FaDownload,
//   FaPrint,
//   FaStore,
//   FaPhone,
//   FaEnvelope,
//   FaReceipt,
//   FaUser,
//   FaMapMarkerAlt,
//   FaBox,
//   FaTruck,
// } from "react-icons/fa";
// import { useReactToPrint } from "react-to-print";
// import { formatCurrency, formatDate, formatOrderId } from "../../../utils/format";
// import Logo from "../../../assets/img/Logo.webp"
// const OrderReceipt = ({ order, onClose }) => {
//   const receiptRef = useRef(null);
//   const [isPrinting, setIsPrinting] = useState(false);

//   const handlePrint = useReactToPrint({
//     content: () => receiptRef.current,
//     onBeforeGetContent: () => setIsPrinting(true),
//     onAfterPrint: () => setIsPrinting(false),
//     documentTitle: `Receipt_${formatOrderId(order?.id)}`,
//   });

//   if (!order) return null;

//   const handleDownload = async () => {
//   try {
//     const response = await fetch('/api/download-file');
//     const blob = await response.blob();
//     const url = window.URL.createObjectURL(blob);
    
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = `${order.id}.pdf`; // Set the filename
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     window.URL.revokeObjectURL(url);
//   } catch (error) {
//     console.error('Download failed:', error);
//   }
// };

//   const calculateSubtotal = () => {
//     return (
//       order.orderItemList?.reduce(
//         (total, item) => total + parseFloat(item.itemPrice) * item.quantity,
//         0
//       ) || 0
//     );
//   };

 

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//         <div className="p-6">
//           <div className="flex justify-between items-center mb-6">
//             <div className="flex items-center gap-3">
//               <FaReceipt className="w-8 h-8 text-blue-600" />
//               <div>
//                 <h3 className="text-xl font-semibold text-gray-800">
//                   Order Receipt
//                 </h3>
//                 <p className="text-sm text-gray-600">{formatOrderId(order.id)}</p>
//               </div>
//             </div>
//             <div className="flex gap-2">
//              <button
//                 onClick={handleDownload}
//                 className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
//               >
//                <FaDownload className="w-4 h-4 mr-2" /> 
//                 Download
//               </button>
//               <button
//                 onClick={handlePrint}
//                 disabled={isPrinting}
//                 className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors flex items-center disabled:opacity-50"
//               >
//                 <FaPrint className="w-4 h-4 mr-2" />
//                 Print
//               </button>
//               <button
//                 onClick={onClose}
//                 className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
//               >
//                 <FaTimes className="w-5 h-5" />
//               </button>
//             </div>
//           </div>

//           <div ref={receiptRef} className="p-6 bg-white">
//             <div className="flex justify-between items-center mb-8">
//               <div className="flex items-center gap-3">
//                 <img src= {Logo} alt="" className="w-24 h-24 text-blue-600" />
//                 <div>
//                   <h2 className="text-2xl font-bold text-gray-800">
//                     CityShine Store
//                   </h2>
//                   <p className="text-sm text-gray-600">
//                     Nairobi, Kenya
//                   </p>
//                   <p className="text-sm text-gray-600 flex items-center gap-1">
//                     <FaPhone className="w-4 h-4" />
//                     +254 700 123 456
//                   </p>
//                   <p className="text-sm text-gray-600 flex items-center gap-1">
//                     <FaEnvelope className="w-4 h-4" />
//                     support@cityshinestore.com
//                   </p>
//                 </div>
//               </div>
//               <div className="text-right">
//                 <h3 className="text-lg font-semibold text-gray-800">
//                   Receipt {formatOrderId(order.id)}
//                 </h3>
//                 <p className="text-sm text-gray-600">
//                   Date: {formatDate(order.orderDate)}
//                 </p>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//               <div>
//                 <h4 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
//                   <FaUser className="w-5 h-5 mr-2 text-green-600" />
//                   Customer Information
//                 </h4>
//                 <div className="bg-gray-50 p-4 rounded-lg space-y-3">
//                   <p className="text-sm text-gray-600">
//                     <span className="font-medium">Name:</span> {`${order.customerName} ${order.customerLastName}` || "N/A"}
//                   </p>
//                   <p className="text-sm text-gray-600">
//                     <span className="font-medium">Phone Number:</span> {order.address?.phoneNumber || "N/A"}
//                   </p>
//                   <p className="text-sm text-gray-600">
//                     <span className="font-medium">Email:</span> {order.customerEmail || "N/A"}
//                   </p>
//                 </div>
//               </div>
//               <div>
//                 <h4 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
//                   <FaMapMarkerAlt className="w-5 h-5 mr-2 text-orange-600" />
//                   Delivery Information
//                 </h4>
//                 <div className="bg-gray-50 p-4 rounded-lg space-y-3">
//                   {order.address ? (
//                     <>
//                       <p className="text-sm text-gray-600">
//                         <span className="font-medium">Recipient:</span> {order.address.name}
//                       </p>
//                       <p className="text-sm text-gray-600">
//                         <span className="font-medium">Address:</span>{" "}
//                         {`${order.address.estate}, ${order.address.county}`}
//                       </p>
//                       {order.address.phoneNumber && (
//                         <p className="text-sm text-gray-600">
//                           <span className="font-medium">Phone:</span> {order.address.phoneNumber}
//                         </p>
//                       )}
//                     </>
//                   ) : (
//                     <p className="text-sm text-gray-600">No delivery address provided</p>
//                   )}
//                   <p className="text-sm text-gray-600">
//                     <span className="font-medium">Expected Delivery:</span>{" "}
//                     {formatDate(order.expectedDeliveryDate) || "To be confirmed"}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="mb-8">
//               <h4 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
//                 <FaBox className="w-5 h-5 mr-2 text-purple-400" />
//                 Order Items
//               </h4>
//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <table className="w-full">
//                   <thead>
//                     <tr className="text-left text-sm text-gray-600 border-b">
//                       <th className="pb-2 font-medium">Item</th>
//                       <th className="pb-2 font-medium">Qty</th>
//                       <th className="pb-2 font-medium">Unit Price</th>
//                       <th className="pb-2 font-medium">Total</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {order.orderItemList?.map((item, index) => (
//                       <tr key={index} className="border-b last:border-b-0">
//                         <td className="py-3 text-sm">
//                           {item.product?.name || "Product"}
//                           {item.color && (
//                             <span className="text-gray-500"> ({item.color})</span>
//                           )}
//                           {item.productVariantId && (
//                             <span className="text-gray-500"> (Variant: {item.productVariantId})</span>
//                           )}
//                         </td>
//                         <td className="py-3 text-sm">{item.quantity}</td>
//                         <td className="py-3 text-sm">{formatCurrency(item.itemPrice)}</td>
//                         <td className="py-3 text-sm">
//                           {formatCurrency((parseFloat(item.itemPrice) * item.quantity).toString())}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             <div className="mb-8">
//               <h4 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
//                 <FaTruck className="w-5 h-5 mr-2 text-blue-600" />
//                 Order Summary
//               </h4>
//               <div className="bg-gray-50 p-4 rounded-lg space-y-3">
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Subtotal (Tax Inclusive):</span>
//                   <span>{formatCurrency(calculateSubtotal().toString())}</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Delivery:</span>
//                   <span className="text-green-600">Free</span>
//                 </div>
//                 <div className="flex justify-between font-semibold text-base border-t pt-3">
//                   <span>Total:</span>
//                   <span>{formatCurrency(order.totalAmount)}</span>
//                 </div>
//               </div>
//             </div>

//             <div>
//               <h4 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
//                 <FaReceipt className="w-5 h-5 mr-2 text-green-600" />
//                 Payment Information
//               </h4>
//               <div className="bg-gray-50 p-4 rounded-lg space-y-3">
//                 <p className="text-sm text-gray-600">
//                   <span className="font-medium">Payment Method:</span> {order.paymentMethod}
//                 </p>
//                 <p className="text-sm text-gray-600">
//                   <span className="font-medium">Payment Status:</span>{" "}
//                   {order.paymentStatus || "Pending"}
//                 </p>
//                 {order.mpesaReceiptNumber && (
//                   <p className="text-sm text-gray-600">
//                     <span className="font-medium">M-Pesa Receipt:</span> {order.mpesaReceiptNumber}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>

//           <div className="mt-6 text-center text-sm text-gray-600">
//             <p>Thank you for shopping with CityShine Store!</p>
//             <p>Contact us at support@cityshinestore.com for any inquiries.</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrderReceipt;

import React, { useRef, useState } from "react";
import {
  FaTimes,
  FaDownload,
  FaPrint,
  FaPhone,
  FaEnvelope,
  FaReceipt,
  FaUser,
  FaMapMarkerAlt,
  FaBox,
  FaTruck,
  FaSpinner,
} from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import html2pdf from "html2pdf.js";
import { formatCurrency, formatDate, formatOrderId } from "../../../utils/format";
import Logo from "../../../assets/img/Logo.webp";

const OrderReceipt = ({ order, onClose }) => {
  const receiptRef = useRef(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handlePrint = useReactToPrint({
    content: () => receiptRef.current,
    onBeforeGetContent: () => setIsPrinting(true),
    onAfterPrint: () => setIsPrinting(false),
    documentTitle: `Receipt_${formatOrderId(order?.id)}`,
  });

  const handleDownload = async () => {
    setIsGeneratingPDF(true);
    try {
      const element = receiptRef.current;
      
      if (!element) {
        throw new Error("Receipt content not found");
      }

      // Create descriptive filename
      const date = new Date(order.orderDate || new Date()).toISOString().split('T')[0];
      const filename = `invoice-${formatOrderId(order.id)}-${date}.pdf`;
      
      const options = {
        margin: [0.5, 0.5, 0.5, 0.5], // [top, right, bottom, left]
        filename: filename,
        image: { 
          type: 'jpeg', 
          quality: 0.98 
        },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: false
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait' 
        },
        pagebreak: { 
          mode: ['avoid-all', 'css', 'legacy'] 
        }
      };

      await html2pdf().set(options).from(element).save();
      
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const calculateSubtotal = () => {
    return (
      order.orderItemList?.reduce(
        (total, item) => total + parseFloat(item.itemPrice) * item.quantity,
        0
      ) || 0
    );
  };

  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <FaReceipt className="w-8 h-8 text-blue-600" />
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Order Receipt
                </h3>
                <p className="text-sm text-gray-600">{formatOrderId(order.id)}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleDownload}
                disabled={isGeneratingPDF}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGeneratingPDF ? (
                  <FaSpinner className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <FaDownload className="w-4 h-4 mr-2" />
                )}
                {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
              </button>
              <button
                onClick={handlePrint}
                disabled={isPrinting}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaPrint className="w-4 h-4 mr-2" />
                {isPrinting ? 'Printing...' : 'Print'}
              </button>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div ref={receiptRef} className="p-6 bg-white">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <img src={Logo} alt="CityShine Store Logo" className="w-24 h-24" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    CityShine Store
                  </h2>
                  <p className="text-sm text-gray-600">
                    Nairobi, Kenya
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <FaPhone className="w-4 h-4" />
                    +254 700 123 456
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <FaEnvelope className="w-4 h-4" />
                    support@cityshinestore.com
                  </p>
                </div>
              </div>
              <div className="text-right">
                <h3 className="text-lg font-semibold text-gray-800">
                  Receipt {formatOrderId(order.id)}
                </h3>
                <p className="text-sm text-gray-600">
                  Date: {formatDate(order.orderDate)}
                </p>
                <p className="text-sm text-gray-600">
                  Time: {new Date(order.orderDate).toLocaleTimeString()}
                </p>
              </div>
            </div>

            {/* Customer & Delivery Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h4 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
                  <FaUser className="w-5 h-5 mr-2 text-green-600" />
                  Customer Information
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Name:</span> {`${order.customerName} ${order.customerLastName}` || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Phone Number:</span> {order.address?.phoneNumber || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Email:</span> {order.customerEmail || "N/A"}
                  </p>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
                  <FaMapMarkerAlt className="w-5 h-5 mr-2 text-orange-600" />
                  Delivery Information
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  {order.address ? (
                    <>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Recipient:</span> {order.address.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Address:</span>{" "}
                        {`${order.address.estate}, ${order.address.county}`}
                      </p>
                      {order.address.phoneNumber && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Phone:</span> {order.address.phoneNumber}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-gray-600">No delivery address provided</p>
                  )}
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Expected Delivery:</span>{" "}
                    {formatDate(order.expectedDeliveryDate) || "To be confirmed"}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-8">
              <h4 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
                <FaBox className="w-5 h-5 mr-2 text-purple-400" />
                Order Items
              </h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-600 border-b">
                      <th className="pb-2 font-medium">Item</th>
                      <th className="pb-2 font-medium">Qty</th>
                      <th className="pb-2 font-medium">Unit Price</th>
                      <th className="pb-2 font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.orderItemList?.map((item, index) => (
                      <tr key={index} className="border-b last:border-b-0">
                        <td className="py-3 text-sm">
                          {item.product.name || "Product"}
                          {item.color && (
                            <span className="text-gray-500"> ({item.color})</span>
                          )}
                          {item.productVariantId && (
                            <span className="text-gray-500"> (Variant: {item.productVariantId})</span>
                          )}
                        </td>
                        <td className="py-3 text-sm">{item.quantity}</td>
                        <td className="py-3 text-sm">{formatCurrency(item.itemPrice)}</td>
                        <td className="py-3 text-sm">
                          {formatCurrency((parseFloat(item.itemPrice) * item.quantity).toString())}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Order Summary */}
            <div className="mb-8">
              <h4 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
                <FaTruck className="w-5 h-5 mr-2 text-blue-600" />
                Order Summary
              </h4>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal (Tax Inclusive):</span>
                  <span>{formatCurrency(calculateSubtotal().toString())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery:</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between font-semibold text-base border-t pt-3">
                  <span>Total:</span>
                  <span>{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
                <FaReceipt className="w-5 h-5 mr-2 text-green-600" />
                Payment Information
              </h4>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Payment Method:</span> {order.paymentMethod}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Payment Status:</span>{" "}
                  {order.paymentStatus || "Pending"}
                </p>
                {order.mpesaReceiptNumber && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">M-Pesa Receipt:</span> {order.mpesaReceiptNumber}
                  </p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center text-sm text-gray-600">
              <p>Thank you for shopping with CityShine Store!</p>
              <p>Contact us at support@cityshinestore.com for any inquiries.</p>
            </div>
          </div>

          {/* Additional Info Outside PDF */}
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>You can download as PDF or print this receipt for your records.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderReceipt;