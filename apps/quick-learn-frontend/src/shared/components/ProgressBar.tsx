import React, { FC } from 'react';

interface Props {
  percentage: number;
}

const ProgressBar: FC<Props> = ({ percentage }) => (
  <div className="w-full bg-gray-200 rounded-full h-2">
    <div
      className="bg-green-500 h-2 rounded-full"
      style={{ width: `${percentage}%` }}
    />
  </div>
);

export default ProgressBar;
