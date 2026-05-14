import React, { useState, useEffect } from 'react';

interface StatCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}

export const StatCounter: React.FC<StatCounterProps> = ({
  value,
  suffix = '',
  prefix = '',
  duration = 2,
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const increment = value / (duration * 60);
    const interval = setInterval(() => {
      setCount((prev) => {
        const newCount = prev + increment;
        return newCount >= value ? value : newCount;
      });
    }, 16);

    return () => clearInterval(interval);
  }, [value, duration]);

  return (
    <span>
      {prefix}
      {Math.floor(count).toLocaleString()}
      {suffix}
    </span>
  );
};
