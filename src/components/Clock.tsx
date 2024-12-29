import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Clock as ClockIcon } from 'lucide-react';

export default function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-2 text-gray-700">
      <ClockIcon className="w-5 h-5" />
      <div className="font-mono text-lg">
        {format(time, 'HH:mm:ss')}
      </div>
    </div>
  );
}
