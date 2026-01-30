// components/Product/CountdownTimer.jsx
import React, { useState, useEffect } from 'react';
import { FiClock } from 'react-icons/fi';

const CountdownTimer = ({ targetDate, onCountdownEnd, showUrgency = true, size = 'medium' }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalSeconds: 0
  });

  const [hasEnded, setHasEnded] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setHasEnded(true);
        if (onCountdownEnd) onCountdownEnd();
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          totalSeconds: 0
        };
      }

      const totalSeconds = Math.floor(difference / 1000);
      const days = Math.floor(totalSeconds / (3600 * 24));
      const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      return { days, hours, minutes, seconds, totalSeconds };
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onCountdownEnd]);

  const sizeClasses = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  };

  const containerClasses = {
    small: 'px-2 py-1',
    medium: 'px-3 py-2',
    large: 'px-4 py-3'
  };

  const isUrgent = timeLeft.days === 0 && timeLeft.hours < 24;
  const isVeryUrgent = timeLeft.days === 0 && timeLeft.hours < 6;

  if (hasEnded) {
    return (
      <div className={`inline-flex items-center gap-2 ${containerClasses[size]} bg-gray-100 dark:bg-gray-800 rounded-lg`}>
        <FiClock className="text-gray-500" />
        <span className={`${sizeClasses[size]} text-gray-600 dark:text-gray-400 font-medium`}>
          Offer expired
        </span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-3 ${containerClasses[size]} rounded-lg transition-all duration-300 ${
      isVeryUrgent 
        ? 'bg-red-50 dark:bg-red-900/30 border border-red-300 dark:border-red-700 animate-pulse' 
        : isUrgent
        ? 'bg-red-50 dark:bg-red-300 border border-red-300 dark:border-red-700'
        : 'bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700'
    }`}>
      <div className="flex items-center gap-2">
        <FiClock className={`${
          isVeryUrgent ? 'text-red-600' : isUrgent ? 'text-red-600' : 'text-blue-600'
        }`} />
        <span className={`${sizeClasses[size]} font-medium ${
          isVeryUrgent ? 'text-red-700 dark:text-red-300' : 
          isUrgent ? 'text-red-700 dark:text-red-300' : 
          'text-blue-700 dark:text-blue-300'
        }`}>
          {timeLeft.days > 0 ? `${timeLeft.days}d ` : ''}
          {timeLeft.hours.toString().padStart(2, '0')}:
          {timeLeft.minutes.toString().padStart(2, '0')}:
          {timeLeft.seconds.toString().padStart(2, '0')}
        </span>
      </div>
      
      {/* {showUrgency && isVeryUrgent && (
        <span className={`${sizeClasses[size]} font-bold text-red-600 dark:text-red-400`}>
          Ends soon!
        </span>
      )} */}
      {showUrgency && isUrgent && !isVeryUrgent && (
        <span className={`${sizeClasses[size]} font-medium text-red-600 dark:text-red-400`}>
         Ends Soon!
        </span>
      )}
    </div>
  );
};

export default CountdownTimer;