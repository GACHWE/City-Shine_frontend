import React from 'react';

const TimeSlotPicker = ({ selectedDate, selectedTime, setSelectedTime }) => {
  const generateTimeSlots = (dateString) => {
    const slots = [];
    const now = new Date();
    const selected = new Date(dateString);
    const isSunday = selected.getDay() === 0;
    const isToday = now.toDateString() === selected.toDateString();

    if (isSunday) {
      // Sunday slots: 12:00 - 17:00 in 3-hour intervals
      let startHour = 12;
      const endHour = 17; // 5 PM

      if (isToday) {
        const currentHour = now.getHours();
        startHour = Math.max(startHour, currentHour + 1); // At least 1 hour from now
      }

      for (let hour = startHour; hour < endHour; hour += 3) {
        const end = hour + 3;
        if (end <= endHour) {
          slots.push(`${hour}:00 - ${end}:00`);
        }
      }
    } else {
      // Weekday slots: 8:00 - 17:00 in 3-hour intervals
      let startHour = 8;
      const endHour = 17; // 5 PM

      if (isToday) {
        const currentHour = now.getHours();
        startHour = Math.max(startHour, currentHour + 1); // At least 1 hour from now
      }

      for (let hour = startHour; hour < endHour; hour += 3) {
        const end = hour + 3;
        if (end <= endHour) {
          slots.push(`${hour}:00 - ${end}:00`);
        }
      }
    }

    return slots;
  };

  const timeSlots = selectedDate ? generateTimeSlots(selectedDate) : [];

  return (
    <div className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-sm">
      <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
        Choose Time Slot
      </h2>
      
      {timeSlots.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {timeSlots.map((slot) => (
            <button
              key={slot}
              type="button"
              className={`p-3 rounded-lg text-center border transition-colors ${
                selectedTime === slot
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              onClick={() => setSelectedTime(slot)}
            >
              {slot}
            </button>
          ))}
        </div>
      ) : (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-700">
          <p className="text-yellow-700 dark:text-yellow-300 text-center">
            No delivery slots available for this date. Please choose another date.
          </p>
        </div>
      )}
      
      {selectedDate && (
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          <p>
            {new Date(selectedDate).getDay() === 0 
              ? "Sunday deliveries are available in the afternoon only (12:00 PM - 5:00 PM)."
              : "Weekday deliveries are available from 8:00 AM to 5:00 PM."
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default TimeSlotPicker;