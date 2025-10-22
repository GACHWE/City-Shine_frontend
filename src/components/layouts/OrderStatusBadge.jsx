import React from 'react';
import { 
  FaClock, FaCheck, FaBox, FaTruck, FaTimes, 
  FaMoneyBillWave, FaQuestion, FaExclamationTriangle 
} from 'react-icons/fa';

const ORDER_STATUS_CONFIG = {
  PENDING: {
    icon: FaClock,
    color: 'yellow',
    label: 'Pending',
    description: 'Order is awaiting confirmation'
  },
  CONFIRMED: {
    icon: FaCheck,
    color: 'blue',
    label: 'Confirmed',
    description: 'Order has been confirmed'
  },
  PROCESSING: {
    icon: FaBox,
    color: 'purple',
    label: 'Processing',
    description: 'Order is being processed'
  },
  DELIVERED: {
    icon: FaTruck,
    color: 'green',
    label: 'Delivered',
    description: 'Order has been delivered'
  },
  CANCELLED: {
    icon: FaTimes,
    color: 'red',
    label: 'Cancelled',
    description: 'Order has been cancelled'
  },
  PAYMENT_FAILED: {
    icon: FaExclamationTriangle,
    color: 'red',
    label: 'Payment Failed',
    description: 'Payment processing failed'
  }
};

const PAYMENT_STATUS_CONFIG = {
  PENDING: {
    icon: FaClock,
    color: 'yellow',
    label: 'Pending',
    description: 'Payment is pending'
  },
  COMPLETED: {
    icon: FaCheck,
    color: 'green',
    label: 'Completed',
    description: 'Payment completed successfully'
  },
  FAILED: {
    icon: FaTimes,
    color: 'red',
    label: 'Failed',
    description: 'Payment failed'
  }
};

export const OrderStatusBadge = ({ 
  status, 
  type = 'order', 
  size = 'md',
  showDescription = false,
  className = '' 
}) => {
  if (!status) return null;

  const config = type === 'payment' 
    ? PAYMENT_STATUS_CONFIG[status] 
    : ORDER_STATUS_CONFIG[status];
  
  const effectiveConfig = config || {
    icon: FaQuestion,
    color: 'gray',
    label: status,
    description: `Status: ${status}`
  };

  const Icon = effectiveConfig.icon;
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <div className={`inline-flex flex-col items-start ${className}`}>
      <span
        className={`
          ${sizeClasses[size]} 
          bg-${effectiveConfig.color}-100 text-${effectiveConfig.color}-800 
          dark:bg-${effectiveConfig.color}-900 dark:text-${effectiveConfig.color}-200 
          rounded-full font-medium inline-flex items-center gap-2 border border-${effectiveConfig.color}-200
          transition-colors duration-200
        `}
        title={effectiveConfig.description}
      >
        <Icon className="w-3 h-3 flex-shrink-0" />
        <span className="truncate">{effectiveConfig.label}</span>
      </span>
      
      {showDescription && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {effectiveConfig.description}
        </p>
      )}
    </div>
  );
};

// Helper hooks for status checking
export const useOrderStatus = () => {
  const canCancel = (status) => {
    return ['PENDING', 'CONFIRMED'].includes(status);
  };

  const canProcess = (status) => {
    return status === 'CONFIRMED';
  };

  const canDeliver = (status) => {
    return status === 'PROCESSING';
  };

  const isFinalStatus = (status) => {
    return ['DELIVERED', 'CANCELLED', 'PAYMENT_FAILED'].includes(status);
  };

  return {
    canCancel,
    canProcess,
    canDeliver,
    isFinalStatus
  };
};

export default OrderStatusBadge;