import PropTypes from "prop-types";
// Import the classnames utility
import classNames from 'classnames';
import GridCard from '../Cards/GridCard';

const GridList = (
  {
    games, 
    listTitle, 
    smCols,
    mdCols,
    lgCols,
  }) => {
    
  /*
    Note: Tailwind cannot handle dynamic class names unless the class name is somewhere in the source code.
    This is because when we deploy tailwind parses the code and creates a style sheet based on what it sees
    therefore w-{width} will be read literally as w-{width} and the width class will not be added. 
    Therefore a caviat is that we need to include the class somewhere in the source code
  */
  const lgGridClassStyles = {
    5: "lg:grid-cols-5",
    4: "lg:grid-cols-4",
    3: "lg:grid-cols-3",
    2: "lg:grid-cols-2",
  };

  const mdGridClassStyles = {
    5: "lg:grid-cols-5",
    4: "lg:grid-cols-4",
    3: "lg:grid-cols-3",
    2: "lg:grid-cols-2",
  };

  const smGridClassStyles = {
    5: "lg:grid-cols-5",
    4: "lg:grid-cols-4",
    3: "lg:grid-cols-3",
    2: "lg:grid-cols-2",
  };

  // Create a dynamic Tailwind class using a template literal
  const gridClasses = classNames(
    `mb-6 grid ${mdGridClassStyles[mdCols]} gap-x-4 gap-y-8  sm:gap-x-6 ${smGridClassStyles[smCols]} ${lgGridClassStyles[lgCols]} xl:gap-x-8`
  );

  return (
    <div>
      <div className={`${listTitle === "" ? "hidden" : "relative mb-5"}`}>
        <div className="relative flex justify-start">
          <span className="bg-black pr-3 text-base font-semibold leading-6 text-gray-200">
            {listTitle}
          </span>
        </div>
      </div>
      <ul role="list" className={gridClasses}>
        {games.map((game, index) => (
          <li key={index} className="relative">
            {/* <div className={cardClasses}>
              <img src={game.source} alt="" className="pointer-events-none object-cover group-hover:opacity-75" />
              <button type="button" className="absolute  inset-0 focus:outline-none">
                <span className="sr-only">View details for {game.title}</span>
              </button>
            </div>
            <p className="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900">{game.title}</p>
            <p className="pointer-events-none block text-sm font-medium text-gray-500">{game.size}</p> */}
            <GridCard game={game}></GridCard>
          </li>
        ))}
      </ul>
    </div>
  );
};

// This is where you define the equivalent of your TypeScript interface
GridList.propTypes = {
  listTitle: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired,
  aspectHeight: PropTypes.number.isRequired,
  aspectWidth: PropTypes.number.isRequired,
  games: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      size: PropTypes.string.isRequired,
      source: PropTypes.string.isRequired,
    })
  ).isRequired,
  smCols: PropTypes.string.isRequired,
  mdCols: PropTypes.string.isRequired,
  lgCols: PropTypes.string.isRequired,
};

// If you want to specify default values for your props, you can do so as follows:
GridList.defaultProps = {
  listTitle: "",
  smCols: "3",
  mdCols: "2",
  lgCols: "4",
};

export default GridList;
