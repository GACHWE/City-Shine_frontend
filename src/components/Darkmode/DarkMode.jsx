import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react'; // Import icons

const DarkMode = () => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light'; // Default theme
  });

  useEffect(() => {
    if (typeof window !== 'undefined'){
        const element = document.documentElement;
        if (theme === 'dark') {
          element.classList.add('dark');
          localStorage.setItem('theme', 'dark');
        } else {
          element.classList.remove('dark');
          localStorage.setItem('theme', 'light');
        }
    }
  }, [theme]);

  const changeTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className='relative'>
      {theme === 'light' ? (
        <Moon
          onClick={changeTheme}
          className='w-8 h-6 text-black cursor-pointer transition-all duration-300'
        />
      ) : (
        <Sun
          onClick={changeTheme}
          className='w-8 h-8 text-yellow-400 cursor-pointer transition-all duration-300'
        />
      )}
    </div>
  );
};

export default DarkMode;