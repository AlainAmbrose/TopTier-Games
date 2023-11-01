import React from 'react'
import { useState, useEffect, useRef, forwardRef } from 'react';
import PropTypes from 'prop-types';
import ScrollCard from '../Cards/ScrollCard';
import { MdArrowBackIosNew, MdArrowForwardIos} from 'react-icons/md'


const HorizontalGameList = forwardRef(({ genre, size  }, ref) => {
  const [gameList, setGameList] = useState([]);
  const scrollContainerRef = useRef(null);
  const [scrollStep, setScrollStep] = useState(0);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true); // assuming there's content to scroll initially
  const [isHovering, setIsHovering] = useState(false); // State to track if the mouse is hovering over the list

  // console.log("Genre:", genre.title)
  useEffect(() => {
    if (ref !== null) console.log("ref:", ref.current)
  }, [])

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
  

  // Dynamically calculate how much the scroll step should be based on the screen size
  useEffect(() => {
    const calculateScrollStep = () => {
      if (scrollContainerRef.current) {
        // Get the width of the container and a single card
        const containerWidth = scrollContainerRef.current.offsetWidth;
        const cardWidth = 192; // As an example; this should be obtained based on your actual card width
        const cardMargin = 16; // As above, based on your actual margin

        // Calculate total card width including margins
        const totalCardWidth = 208;

        // Calculate the number of cards in view based on container width
        const cardCountInView = Math.floor(containerWidth / totalCardWidth);

        // Update the scroll step
        setScrollStep(totalCardWidth * cardCountInView);
      }
    };

    // Initial calculation
    calculateScrollStep();

    // Re-calculate on window resize
    window.addEventListener('resize', calculateScrollStep);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', calculateScrollStep);
    };
  }, []); // Empty dependency array means this useEffect runs once when the component mounts and not on every re-render


  const scrollToLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -scrollStep, behavior: 'smooth' });
    }
  };

  const scrollToRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: scrollStep, behavior: 'smooth' });
    }
  };

  // Dynamically calculate when to show the buttons to move left and right
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    if (!scrollContainer) {
      return;
    }

    const handleScroll = () => {
      // Step 3: Check the current scroll position
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
      const maxScrollLeft = scrollWidth - clientWidth;

      // Step 4: Update state to control button visibility
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft < maxScrollLeft);
    };

    // Adding the event listener
    scrollContainer.addEventListener('scroll', handleScroll);

    // Initial check in case the component is not at the start
    handleScroll();

    // Clean up event listener on component unmount
    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, []); // Dependency array can be empty if nothing inside the effect needs to be referenced

  // Handlers for mouse events
  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return (
    <>
      <div ref={ref} className='bg-black h-2 w-2 mb-2 text-white'></div>
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
        <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="relative overflow-hidden">
          {" "}
          {/* Container to hold the list and overlays */}
          <ul
            ref={scrollContainerRef}
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
              [...Array(8)].map((_, index) => 
                <li key={index} className="inline-block w-48 h-48 m-2 rounded">
                  <ScrollCard skeleton={true}></ScrollCard>
                </li>
              ) 
            )}

          </ul>
          {/* Overlay gradients */}
          {/* <div className="absolute top-0 left-0 bottom-0 w-3 pointer-events-none bg-gradient-to-r from-black to-transparent"></div>
          <div className="absolute top-0 right-0 bottom-0 w-3 pointer-events-none bg-gradient-to-l from-black to-transparent"></div> */}
          {showLeftButton && (
            <button 
              className="absolute top-0 left-0 bottom-0 w-10 z-10 pb-10 bg-gradient-to-r from-black to-transparent" 
              onClick={scrollToLeft}
              style={{ backdropFilter: "blur(2px)" }} // Optional: for glassmorphism effect
            >
              {/* Optionally, insert an icon or <span> here for the button's appearance, e.g., a "<" character or arrow icon */}
              {isHovering && (<MdArrowBackIosNew className='text-white h-full transform transition-transform duration-300
    ease-in-out group hover:scale-150' size={32} ></MdArrowBackIosNew>)}
            </button>
          )}
          {showRightButton && (
            <button 
              className="absolute top-0 right-0 bottom-0 w-10 z-10 pb-10 bg-gradient-to-l from-black to-transparent" 
              onClick={scrollToRight}
              style={{ backdropFilter: "blur(2px)" }} // Optional: for glassmorphism effect
            >
              {/* Optionally, insert an icon or <span> here for the button's appearance, e.g., a ">" character or arrow icon */}
              {isHovering && (<MdArrowForwardIos className='text-white mb-28  h-full transform transition-transform duration-300
    ease-in-out group hover:scale-150' size={32}></MdArrowForwardIos>)}
            </button>
          )}
        </div>
      </div>
    </>
  );
});

// This is where you define the equivalent of your TypeScript interface
HorizontalGameList.propTypes = {
  genre: PropTypes.shape(
      {
        title: PropTypes.string.isRequired,
        id: PropTypes.number.isRequired,
        href: PropTypes.string.isRequired,
      }
    ).isRequired,
  size: PropTypes.number.isRequired,
};

export default HorizontalGameList;
