import React from 'react'
import PropTypes from 'prop-types';
import GamePreview from './HorizontalGame';

const HorizontalButtonList = ({genres}) => {
  
  return (
    <div className="relative"> {/* This container is positioned relatively */}
      {/* Scroll container with overlay gradients */}
      <ul role="list" className=" px-4 overflow-x-auto scrollable-div whitespace-nowrap">
      {genres.map((genre) => (
        <li key={genre.title} className="inline-block w-fit h-fit m-2  rounded">
          <button
            type="button"
            className="rounded-full mb-6 italic bg-gray-400 px-10 py-.05 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-400 hover:bg-gray-300" onClick={() => {}}
            >
            {genre.title}
          </button>
        </li>
      ))}
      </ul>
      {/* Overlay gradients */}
      <div className="absolute top-0 left-0 bottom-0 w-5 pointer-events-none bg-gradient-to-r from-black to-transparent"></div>
      <div className="absolute top-0 right-0 bottom-0 w-10 pointer-events-none bg-gradient-to-l from-black to-transparent"></div>
    </div>
    // <div className="relative"> {/* This container is positioned relatively */}
          
    // {/* Title */}
    // <div className="mb-2">
    //   <div className="flex justify-start">
    //     <span className="bg-black pr-3 text-base font-semibold leading-6 text-gray-200">{listTitle}</span>
    //   </div>
    // </div>

    // {/* Scroll container with overlay gradients */}
    // <div className="relative overflow-hidden"> {/* Container to hold the list and overlays */}
    //   <ul role="list" className="mb-4 px-4 overflow-x-auto whitespace-nowrap scrollable-div">
    //     {games.map((game, index) => (
    //       <li key={index} className="inline-block w-48 h-48 m-2 rounded">
    //         <HorizontalGame game={game}></HorizontalGame>
    //       </li>
    //     ))}
    //   </ul>
    //   {/* Overlay gradients */}
    //   <div className="absolute top-0 left-0 bottom-0 w-3 pointer-events-none bg-gradient-to-r from-black to-transparent"></div>
    //   <div className="absolute top-0 right-0 bottom-0 w-3 pointer-events-none bg-gradient-to-l from-black to-transparent"></div>
    // </div>
    // </div>
  )
}


HorizontalButtonList.propTypes = {
  genres: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
  })).isRequired
};

export default HorizontalButtonList