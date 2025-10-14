// components/NumberInput/NumberInput.jsx
import React, { useCallback, useState } from 'react';

export const NumberInput = ({ quantity = 1, max = 10, min = 1, onChangeQuantity }) => {
  const [message, setMessage] = useState('');

  const displayMaxStock = useCallback(() => {
    setMessage('Sorry, we have limited quantity available for this product');
    setTimeout(() => setMessage(''), 2000);
  }, []);

  const displayMinQuantity = useCallback(() => {
    setMessage(`At least ${min} item${min > 1 ? 's' : ''} is required`);
    setTimeout(() => setMessage(''), 2000);
  }, [min]);

  const onIncreaseQuantity = useCallback(() => {
    if (quantity < max) {
      onChangeQuantity?.(1); // increment step
    } else {
      displayMaxStock();
    }
  }, [quantity, max, onChangeQuantity, displayMaxStock]);

  const onReduceQuantity = useCallback(() => {
    if (quantity > min) {
      onChangeQuantity?.(-1); // decrement step
    } else {
      displayMinQuantity();
    }
  }, [quantity, min, onChangeQuantity, displayMinQuantity]);

  return (
    <>
      <div className="flex justify-center items-center">
        <button
          type="button"
          onClick={onReduceQuantity}
          className="bg-gray-500 w-10 hover:bg-gray-600 border border-gray-300 rounded-s-lg p-3 h-11"
        >
          -
        </button>

        <input
          type="text"
          value={quantity}
          readOnly
          className="bg-gray-200 border-x-0 w-12 border-gray-300 h-11 text-center"
        />

        <button
          type="button"
          onClick={onIncreaseQuantity}
          className="bg-gray-500 w-10 hover:bg-gray-600 border border-gray-300 rounded-e-lg p-3 h-11"
        >
          +
        </button>
      </div>

      {message && (
        <p className="text-sm text-center pt-2 text-red-600">{message}</p>
      )}
    </>
  );
};
