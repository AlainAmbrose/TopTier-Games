import React from 'react'
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ScrollCard from '../Cards/ScrollCard';

const HorizontalGameList = ({ genre, size }) => {
  const [gameList, setGameList] = useState([]);

  // // Check if game exists before trying to access its properties
  // if (!genre) {
  //   return <div>Loading...</div>; // or some other placeholder
  // }
  console.log("Genre:", genre.title)

  var _ud = localStorage.getItem('user_data');
  var ud = JSON.parse(_ud);
  var userId = ud.id;
  var firstName = ud.firstName;
  var lastName = ud.lastName;

  const app_name = "poosd-large-project-group-8-1502fa002270"
  function buildPath(route) {
    if (process.env.NODE_ENV === 'production') {
      return 'https://' + app_name + '.herokuapp.com/' + route
    } else {
      return 'http://localhost:5000/' + route
    }
  }

  useEffect (() => {
    const populateGames = async event => {
  
      var obj = {genre: genre.id, size: size};
      var js = JSON.stringify(obj);
      console.log("request: ", js);
      try
      {
          const response = await fetch(buildPath("Games/api/populatehomepage"), {
            method:'POST',
            body:js,
            headers:{
              'Content-Type': 
              'application/json'
            }});
  
          // var txt = await response.text();
          // var res = JSON.parse(txt);
          // var _results = res.results;

          // Assuming the server response is JSON
          const data = await response.json();
          const games = data.result
          console.log("@PopulateGames, genre: " + genre.id + " data: ", games)
          setGameList(games);
      }
      catch(e)
      {
          alert(e.toString());
          // setSearchResults(e.toString());
      }
    }

    populateGames();
  }, []) 
  



  return (
    <div className="relative">
      {" "}
      {/* This container is positioned relatively */}
      {/* Title */}
      <div className="mb-2">
        <div className="flex justify-start">
          <span className="bg-black pr-3 text-base font-semibold leading-6 text-gray-200">
            {genre.title}
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
          {gameList && gameList.length > 0 ? (
            gameList.map((game, index) => (
              <li key={index} className="inline-block w-48 h-48 m-2 rounded">
                <ScrollCard game={game}></ScrollCard>
              </li>
            ))
          ) : (
          <p>Loading games...</p> // or any other indicator or message you prefer
          )}

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
  genre: PropTypes.shape(
      {
        title: PropTypes.string.isRequired,
        id: PropTypes.number.isRequired,
        href: PropTypes.string.isRequired,
      }
    ).isRequired,
  size: PropTypes.number.isRequired
};

export default HorizontalGameList;
