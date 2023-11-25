import React, { useState } from 'react';

const LongText = ({ content, limit = 100 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleIsExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const toDisplay = isExpanded ? content : `${content.substring(0, limit)}...`;

  return (
    <div className="space-y-2">
      <p className="text-gray-200">{toDisplay}</p>
      <button 
        onClick={toggleIsExpanded} 
        className="text-blue-600 hover:text-blue-800 transition duration-300 ease-in-out"
      >
        {isExpanded ? 'Show Less' : 'Show More'}
      </button>
    </div>
  );
};

export default LongText;
