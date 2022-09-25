import React from 'react';
import { useCountdown } from '../hooks/useCountdown';

const TimeObject = ( { type, amount, last }) => {
  return (
    <div className="inline-block">
      <div className="inline-block">
        <p className="text-xs md:text-sm opacity-40 text-center">{type}</p>
        <p className="text-xs sm:text-base">{(amount).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}</p>
      </div>
      { !last &&
        <p className="inline-block align-bottom">:</p>
      }
    </div>
  )
}


const CountdownTimer = ({ targetDate, className }) => {
  const [days, hours, minutes, seconds] = useCountdown(targetDate);
  return (
    <div className={className}>
      <TimeObject type="D" amount={days}/>
      <TimeObject type="H" amount={hours}/>
      <TimeObject type="M" amount={minutes}/>
      <TimeObject type="S" amount={seconds} last/>
    </div>
  );
};

export default CountdownTimer;
