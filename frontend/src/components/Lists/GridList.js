import PropTypes from "prop-types";
// Import the classnames utility
import classNames from "classnames";
import GridCard from "../Cards/GridCard";
import { useQuery, QueryClient } from "react-query";
import { forwardRef, useEffect } from "react";

const GridList = forwardRef((
  {
  games,
  skeleton,
  skeletoncount,
  listTitle,
  aspectHeight = 8,
  aspectWidth = 36,
  smCols,
  mdCols,
  lgCols,
  }, ref) => {
  /*
    Note: Tailwind cannot handle dynamic class names unless the class name is somewhere in the source code.
    This is because when we deploy tailwind parses the code and creates a style sheet based on what it sees
    therefore w-{width} will be read literally as w-{width} and the width class will not be added. 
    Therefore a caviat is that we need to include the class somewhere in the source code
  */
  const lgGridClassStyles = {
    10: "lg:grid-cols-10",
    9: "lg:grid-cols-9",
    8: "lg:grid-cols-8",
    7: "lg:grid-cols-7",
    6: "lg:grid-cols-6",
    5: "lg:grid-cols-5",
    4: "lg:grid-cols-4",
    3: "lg:grid-cols-3",
    2: "lg:grid-cols-2",
  };

  const mdGridClassStyles = {
    10: "md:grid-cols-10",
    9: "md:grid-cols-9",
    8: "md:grid-cols-8",
    7: "md:grid-cols-7",
    6: "md:grid-cols-6",
    5: "md:grid-cols-5",
    4: "md:grid-cols-4",
    3: "md:grid-cols-3",
    2: "md:grid-cols-2",
  };

  const smGridClassStyles = {
    10: "sm:grid-cols-10",
    9: "sm:grid-cols-9",
    8: "sm:grid-cols-8",
    7: "sm:grid-cols-7",
    6: "sm:grid-cols-6",
    5: "sm:grid-cols-5",
    4: "sm:grid-cols-4",
    3: "sm:grid-cols-3",
    2: "sm:grid-cols-2",
  };

  // Create a dynamic Tailwind class using a template literal
  const gridClasses = classNames(
    `mb-6 grid ${mdGridClassStyles[mdCols]} gap-x-4 gap-y-8  sm:gap-x-6 ${smGridClassStyles[smCols]} ${lgGridClassStyles[lgCols]} xl:gap-x-8`
  );

  useEffect(() => {
    if (skeleton !== false) {
      console.log("agmes", games)
      // ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  }
  , [])
  
  return (
    <>
      { !skeleton && ref !== undefined && ref !== null && <div ref={ref} className='bg-black h-2 w-2 mb-2 text-white'></div>}
      <div>
        <div className={`${listTitle === "" ? "hidden" : "relative mb-5 "}`}>
          <div className="relative flex justify-start">
            <p className="bg-black pr-3 text-4xl text-gray-200">{listTitle}</p>
          </div>
        </div>
        {!skeleton ? (
          <>
            <ul role="list" className={gridClasses}>
              {games.map((game, index) => (
                <li key={index} className="relative">
                  <GridCard
                    game={game}
                    aspectHeight={aspectHeight}
                    aspectWidth={aspectWidth}
                  ></GridCard>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <ul role="list" className={gridClasses}>
              {[...Array(skeletoncount)].map((_, index) => (
                <li key={index} className="relative">
                  <GridCard
                    skeleton={true}
                    aspectHeight={aspectHeight}
                    aspectWidth={aspectWidth}
                  ></GridCard>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
});

// This is where you define the equivalent of your TypeScript interface
GridList.propTypes = {
  listTitle: PropTypes.string,
  width: PropTypes.string.isRequired,
  aspectHeight: PropTypes.number,
  aspectWidth: PropTypes.number,
  games: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
      url: PropTypes.string.isRequired,
    })
  ),
  smCols: PropTypes.string.isRequired,
  mdCols: PropTypes.string.isRequired,
  lgCols: PropTypes.string.isRequired,
  skeleton: PropTypes.bool.isRequired,
  skeletoncount: PropTypes.number,
};

// If you want to specify default values for your props, you can do so as follows:
GridList.defaultProps = {
  skeleton: false,
  listTitle: "",
  smCols: "3",
  mdCols: "2",
  lgCols: "4",
};

export default GridList;
