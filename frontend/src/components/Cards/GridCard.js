import { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import CardPopup from "../CardPopup";
import { useQuery } from "react-query";
import { AuthContext } from "../Authorizations/AuthContext";
import { classNames } from "../../utils/utils";
import { fetchGameInformation } from "../../utils/gridcardUtils";

const GridCard = ({ game, skeleton, apsectHeight, apsectWidth }) => {
  const [open, setOpen] = useState(false);
  const authContext = useContext(AuthContext);
  const { user, isAuthenticated, userSignup, userLogin, userLogout } =
    authContext;

  // Triggers the query when the popup is open and the game ID is available
  const {
    data: gameInfo,
    isLoading: isLoadingGameInfo,
    isError,
    error,
  } = useQuery(
    ["RecommendedGames", game.id],
    () => fetchGameInformation(game.id),
    {
      enabled: open && game.id != null && skeleton === false,
    }
  );
  // was h-5 and w-8
  const cardClasses =
    classNames(`group aspect-h-8 aspect-w-36 block w-full overflow-hidden rounded-lg bg-black transform transition-transform duration-300 ease-in-out group hover:scale-105  hover:shadow-md  hover:shadow-gray-950`);

  return (
    <>
      {/* Button */}

      {!skeleton ? (
        <>
          <div className={cardClasses}>
            <img
              src={game.url}
              alt=""
              className="pointer-events-none object-cover group-hover:opacity-90"
            />
            <button
              type="button"
              className="absolute  inset-0 focus:outline-none"
              onClick={() => {
                setOpen(true);
              }}
            >
              <span className="sr-only">View details for {game.name}</span>
            </button>
          </div>
          <p className="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-300">
            {game.name}
          </p>
          <p className="pointer-events-none block text-sm font-medium text-gray-500">
            {game.id}
          </p>
        </>
      ) : (
        <>
          <div className={cardClasses}>
            <SkeletonTheme
              baseColor="black"
              borderRadius="0.5rem"
              highlightColor="#202020"
            >
              <Skeleton className="pointer-events-none object-cover aspect-h-9 aspect-w-8 group-hover:opacity-90"></Skeleton>
            </SkeletonTheme>
          </div>
          <p className="pointer-events-none w-8/12 mt-2 block truncate ">
            <SkeletonTheme baseColor="black" highlightColor="#202020">
              <Skeleton count={2}></Skeleton>
            </SkeletonTheme>
          </p>
        </>
      )}

      {/* POP UP */}
      <CardPopup
        game={game}
        gameInfo={gameInfo}
        isLoadingGameInfo={isLoadingGameInfo}
        open={open}
        setOpen={setOpen}
        skeleton={skeleton}
      ></CardPopup>
    </>
  );
};

GridCard.propTypes = {
  game: PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
  skeleton: PropTypes.bool.isRequired,
};

GridCard.defaultProps = {
  game: {
    name: "loading",
    id: -1,
    url: "/#",
  },
  skeleton: false,
};

export default GridCard;
