import React from "react";
import { useState, useEffect, useRef, forwardRef } from "react";
import PropTypes from "prop-types";
import ScrollCard from "../Cards/ScrollCard";
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";


const HorizontalGameList = forwardRef((
  {
  games,
  skeleton,
  skeletoncount,
  listTitle,
  }, ref) => {

  const scrollContainerRef = useRef(null);
  const [scrollStep, setScrollStep] = useState(0);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true); // assuming there's content to scroll initially
  const [isHovering, setIsHovering] = useState(false); // State to track if the mouse is hovering over the list


  // Dynamically calculate how much the scroll step should be based on the screen size
  useEffect(() =>
  {
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
    <>
      { !skeleton && ref !== undefined && ref !== null && <div ref={ref} className='bg-black h-2 w-2 mb-2 text-white'></div>}
      <div className="relative">
        {" "}
        {/* This container is positioned relatively */}
        {/* Title */}
        <div className="mb-2">
          <div className="flex justify-start">
            <span className="bg-black pr-3 text-4xl pl-6 text-gray-200">
              {listTitle}
            </span>
          </div>
        </div>
        {/* Scroll container with overlay gradients */}
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="relative overflow-hidden"
        >
          {" "}
          {/* Container to hold the list and overlays */}
          <ul
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
              className="absolute top-0 right-0 bottom-0 w-10 z-10 pb-10 bg-gradient-to-l from-black to-transparent"
              onClick={scrollToRight}
              style={{ backdropFilter: "blur(2px)" }} // Optional: for glassmorphism effect
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
});

// This is where you define the equivalent of your TypeScript interface
HorizontalGameList.propTypes = {
  games: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
      url: PropTypes.string.isRequired,
    })
  ),
  skeleton: PropTypes.bool.isRequired, 
  skeletoncount: PropTypes.number,
  listTitle: PropTypes.string.isRequired,
};

// If you want to specify default values for your props, you can do so as follows:
HorizontalGameList.defaultProps = {
  skeleton: false,
  listTitle: "",
};

export default HorizontalGameList;


