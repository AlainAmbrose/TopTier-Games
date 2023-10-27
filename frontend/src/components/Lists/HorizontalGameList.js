import React from 'react'
import PropTypes from 'prop-types';
import ScrollCard from '../Cards/ScrollCard';

const HorizontalGameList = ({ listTitle, games }) => {
  return (
    <div className="relative">
      {" "}
      {/* This container is positioned relatively */}
      {/* Title */}
      <div className="mb-2">
        <div className="flex justify-start">
          <span className="bg-black pr-3 text-base font-semibold leading-6 text-gray-200">
            {listTitle}
          </span>
        </div>
      </div>
      {/* Scroll container with overlay gradients */}
      <div className="relative overflow-hidden">
        {" "}
        {/* Container to hold the list and overlays */}
        <ul
          role="list"
          className="mb-4 px-4 overflow-x-auto whitespace-nowrap scrollable-div"
        >
          {games.map((game, index) => (
            <li key={index} className="inline-block w-48 h-48 m-2 rounded">
              <ScrollCard game={game}></ScrollCard>
            </li>
          ))}
        </ul>
        {/* Overlay gradients */}
        <div className="absolute top-0 left-0 bottom-0 w-3 pointer-events-none bg-gradient-to-r from-black to-transparent"></div>
        <div className="absolute top-0 right-0 bottom-0 w-3 pointer-events-none bg-gradient-to-l from-black to-transparent"></div>
      </div>
    </div>
  );
};

// This is where you define the equivalent of your TypeScript interface
HorizontalGameList.propTypes = {
  listTitle: PropTypes.string.isRequired,
  games: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      size: PropTypes.string.isRequired,
      source: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default HorizontalGameList;
