import { ReactNode } from 'react';

type TooltipProps = {
  children: ReactNode;
  content: ReactNode;
};

const Tooltip: React.FC<TooltipProps> = ({ children, content }) => {
  return (
    <div className="tooltip relative inline-block group">
      {children}
      <div className="tooltiptext absolute z-[9999] px-3 py-1 text-white bg-gray-900 text-sm rounded-md shadow-lg bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-100 transition-opacity duration-300 w-max dark:bg-gray-700">
        {content}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900" />
      </div>
    </div>
  );
};

export default Tooltip;
