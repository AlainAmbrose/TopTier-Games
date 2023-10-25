import React from 'react'
import PropTypes from 'prop-types';
import GamePreview from './HorizontalGame';

const HorizontalButtonList = ({genres}) => {

  return (
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
  )
}


HorizontalButtonList.propTypes = {
  genres: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
  })).isRequired
};

export default HorizontalButtonList