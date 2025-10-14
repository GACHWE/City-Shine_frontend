// components/DeliveryDatePicker.jsx
import React from 'react';

const DeliveryDatePicker = ({ selectedDate, setSelectedDate, setSelectedTime }) => {
  const generateDeliveryDates = () => {
    const today = new Date();
    const currentHour = today.getHours();
    const dates = [];

    // Start from today if it's before 2 PM, otherwise start from tomorrow
    const startDay = currentHour >= 14 ? 1 : 0;
    
    // Generate dates for the next 7 days
    for (let i = startDay; i < startDay + 7; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      
      // Format date for display
      const dayOfWeek = date.toLocaleDateString('en-KE', { weekday: 'long' });
      const isWeekend = date.getDay() === 0 ;
      
      dates.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('en-KE', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        }),
        isWeekend: isWeekend,
        fullLabel: `${dayOfWeek}, ${date.toLocaleDateString('en-KE', {
          day: 'numeric',
          month: 'short'
        })}`
      });
    }
    return dates;
  };

  const deliveryDates = generateDeliveryDates();

  return (
    <div className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-sm">
      <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Choose Delivery Date</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {deliveryDates.map((date) => (
          <button
            key={date.value}
            type="button"
            className={`p-3 rounded-lg text-center border transition-colors ${
              selectedDate === date.value 
                ? 'bg-green-600 text-white border-green-600' 
                : date.isWeekend
                ? 'bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700 text-orange-800 dark:text-orange-200'
                : 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white'
            }`}
            onClick={() => {
              setSelectedDate(date.value);
              setSelectedTime('');
            }}
          >
            <div className="font-medium">{date.label.split(' ')[0]}</div>
            <div className="text-sm">{date.label.split(' ').slice(1).join(' ')}</div>
            {date.isWeekend && (
              <div className="text-xs mt-1">Afternoon only</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DeliveryDatePicker;