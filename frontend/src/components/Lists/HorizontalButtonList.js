import React from 'react'
import PropTypes from 'prop-types';
import { useState, useEffect, useRef, forwardRef } from "react";
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";

const HorizontalButtonList = ({ genres, searchGenre }) => {
  const scrollContainerRef = useRef(null);
  const [scrollStep, setScrollStep] = useState(0);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true); // assuming there's content to scroll initially
  const [isHovering, setIsHovering] = useState(false); // State to track if the mouse is hovering over the list

  const handleGenreClick = (genre) => {
    console.log("handleGenreClick: ", genre)
    searchGenre(genre)
  }

  // Dynamically calculate how much the scroll step should be based on the screen size
  useEffect(() => {
      const calculateScrollStep = () =>
      {
        if (scrollContainerRef.current)
        {
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
      window.addEventListener("resize", calculateScrollStep);
  
      // Clean up the event listener on component unmount
      return () => {
        window.removeEventListener("resize", calculateScrollStep);
      };
  }, []); // Empty dependency array means this useEffect runs once when the component mounts and not on every re-render

  const scrollToLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -scrollStep,
        behavior: "smooth",
      });
    }
  };

  const scrollToRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: scrollStep,
        behavior: "smooth",
      });
    }
  };

  // Dynamically calculate when to show the buttons to move left and right
  useEffect(() =>
  {
    const scrollContainer = scrollContainerRef.current;

    if (!scrollContainer)
    {
      return;
    }

    const handleScroll = () =>
    {
      // Step 3: Check the current scroll position
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
      const maxScrollLeft = scrollWidth - clientWidth;

      // Step 4: Update state to control button visibility
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft < maxScrollLeft);
    };

    // Adding the event listener
    scrollContainer.addEventListener("scroll", handleScroll);

    // Initial check in case the component is not at the start
    handleScroll();

    // Clean up event listener on component unmount
    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, []); // Dependency array can be empty if nothing inside the effect needs to be referenced


  // Handlers for mouse events
  const handleMouseEnter = () =>
  {
    setIsHovering(true);
  };

  const handleMouseLeave = () =>
  {
    setIsHovering(false);
  };
  

  return (
    // <div className="relative">
    //   {" "}
    //   {/* This container is positioned relatively */}
    //   {/* Scroll container with overlay gradients */}
    //   <ul
    //     className=" px-4 overflow-x-auto scrollable-div whitespace-nowrap"
    //   >
    //     {genres.map((genre) => (
    //       <li
    //         key={genre.id}
    //         className="inline-block w-fit h-fit m-2  rounded"
    //       >
    //         <button
    //           type="button"
    //           className="rounded-full mb-6 italic bg-gray-400 px-10 py-.05 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-400 hover:bg-gray-300"
    //           onClick={() => {handleGenreClick(genre.title)}}
    //         >
    //           {genre.title}
    //         </button>
    //       </li>
    //     ))}
    //   </ul>
    //   {/* Overlay gradients */}
    //   <div className="absolute top-0 left-0 bottom-0 w-5 pointer-events-none bg-gradient-to-r from-black to-transparent"></div>
    //   <div className="absolute top-0 right-0 bottom-0 w-10 pointer-events-none bg-gradient-to-l from-black to-transparent"></div>
    // </div>
    <>
      <div className="relative">
        {/* This container is positioned relatively */}
        {/* Scroll container with overlay gradients */}
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="relative overflow-hidden"
        >
          {" "}
          {/* Container to hold the list and overlays */}
          {/* <ul
            ref={scrollContainerRef}
            role="list"
            className="mb-4 px-4 overflow-x-auto whitespace-nowrap scrollable-div"
          >
            {!skeleton ?  (
              games.map((game, index) => (
                <li key={index} className="inline-block w-48 h-48 m-2 rounded">
                  <ScrollCard game={game}></ScrollCard>
                </li>
              ))
            ) : (
              [...Array(skeletoncount)].map((_, index) => 
                <li key={index} className="inline-block w-48 h-48 m-2 rounded">
                  <ScrollCard skeleton={true}></ScrollCard>
                </li>
              )
            )}

          </ul> */}
          <ul
            ref={scrollContainerRef}
            role="list"
            className="px-4 overflow-x-auto scrollable-div whitespace-nowrap"
          >
            {genres.map((genre) => (
              <li
                key={genre.id}
                className="inline-block w-fit h-fit m-2  rounded"
              >
                <button
                  type="button"
                  className="rounded-full mb-6 italic bg-gray-400 px-10 py-.05 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-400 hover:bg-gray-300"
                  onClick={() => {handleGenreClick(genre.title)}}
                >
                  {genre.title}
                </button>
              </li>
            ))}
          </ul>
          {/* Overlay gradients */}
          {/* <div className="absolute top-0 left-0 bottom-0 w-3 pointer-events-none bg-gradient-to-r from-black to-transparent"></div>
          <div className="absolute top-0 right-0 bottom-0 w-3 pointer-events-none bg-gradient-to-l from-black to-transparent"></div> */}
          {showLeftButton && (
            <button
              className="absolute top-0 left-0 bottom-0 w-10 z-10 pb-6 pr-2 bg-gradient-to-r from-black to-transparent"
              onClick={scrollToLeft}
              // style={{ backdropFilter: "blur(2px)" }} // Optional: for glassmorphism effect
            >
              {/* Optionally, insert an icon or <span> here for the button's appearance, e.g., a "<" character or arrow icon */}
              {isHovering && (
                <MdArrowBackIosNew
                  className="text-white h-full transform transition-transform duration-300
    ease-in-out group hover:scale-150"
                  size={32}
                ></MdArrowBackIosNew>
              )}
            </button>
          )}
          {showRightButton && (
            <button
              className="absolute top-0 right-0 bottom-0 w-10 z-10 pb-6 pl-2 bg-gradient-to-l from-black to-transparent"
              onClick={scrollToRight}
              // style={{ backdropFilter: "blur(2px)" }} // Optional: for glassmorphism effect
            >
              {/* Optionally, insert an icon or <span> here for the button's appearance, e.g., a ">" character or arrow icon */}
              {isHovering && (
                <MdArrowForwardIos
                  className="text-white mb-28  h-full transform transition-transform duration-300
    ease-in-out group hover:scale-150"
                  size={32}
                ></MdArrowForwardIos>
              )}
            </button>
          )}
        </div>
      </div>
    </>
  );
};

HorizontalButtonList.propTypes = {
  genres: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
      href: PropTypes.string.isRequired,
    })
  ).isRequired,
  searchGenre: PropTypes.func.isRequired,
};

export default HorizontalButtonList;
