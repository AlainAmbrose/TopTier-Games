import PropTypes from "prop-types";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import CardPopup from "../CardPopup";
import { useQuery } from "react-query";
import { useState, useContext } from "react";
import { AuthContext } from "../Authorizations/AuthContext";
function buildPath(route)
{
  if (process.env.NODE_ENV === 'production')
  {
    return 'https://www.toptier.games/' + route;
  } else
  {
    return 'http://localhost:3001/' + route;
  }
}


const fetchGameInformation = async (gameId) =>
{
  console.log("GETTING Game INFO : ", gameId);
  var obj = {
    gameId: gameId,
    options: {
      id: true,
      name: true,
      coverURL: true,
      storyline: true,
      releasedate: true,
      genres: true,
      gameranking: true,
      images: true,
      links: true,
      platforms: true,
      platformlogos: true,
      videos: true,
      ageratings: true,
      similargames: true
    }
  };
  var js = JSON.stringify(obj);

  try
  {
    const response = await fetch(buildPath("Games/api/getgameinfo"), {
      method: 'POST',
      body: js,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok)
    {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const jsonResponse = await response.json();

    let gameInfo = jsonResponse.gameInfo;
    console.log("jsonResponse for gameInfo: ", gameInfo);

    // return jsonResponse.gameInfo; // Remove Me!

    // Retrieve the games
    try
    {
      var obj = {
        gameId: gameInfo.similargames,
        options: {
          id: true,
          name: true,
          coverURL: true,
          gameranking: true,
          links: true,
          platforms: true,
          platformlogos: true,
        }
      };
      console.log("request for similar games", obj);
      let js = JSON.stringify(obj);

      const similarGamesResponse = await fetch(buildPath("Games/api/getgameinfo"), {
        method: 'POST',
        body: js,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!similarGamesResponse.ok)
      {
        throw new Error(`HTTP error! status: ${similarGamesResponse.status}`);
      }

      gameInfo.similargames = similarGamesResponse.map((game, index) =>
      {
        return { ...game };
      });

      console.log("Similar Games: ", gameInfo.similarGames);

      return gameInfo;
    } catch (e)
    {
      console.error(e);
      // setSearchResults(e.toString());
    }

    return jsonResponse; // Accessing the 'result' property
  }
  catch (e)
  {
    alert(e.toString());
    throw e; // Rethrow the error for React Query to catch
  }
};

function classNames(...classes)
{
  return classes.filter(Boolean).join(" ");
}

const ScrollCard = ({ game, skeleton }) =>
{
  const [open, setOpen] = useState(false);
  const authContext = useContext(AuthContext);
  const { user, isAuthenticated, userSignup, userLogin, userLogout } = authContext;


  // Triggers the query when the popup is open and the game ID is available
  const { data: gameInfo, isLoading: isLoadingGameInfo, isError, error } = useQuery(
    ['RecommendedGames', game.id],
    () => fetchGameInformation(game.id),
    {
      enabled: open && game.id != null && skeleton === false,
    }
  );


  const cardClasses = classNames(`group aspect-h-8 aspect-w-36 block w-full overflow-hidden rounded-lg bg-black transform transition-transform duration-300
  ease-in-out group hover:scale-105  hover:shadow-md  hover:shadow-gray-950`);

  return (
    <>
      {/* Button */}
      {!skeleton ? (<>
        <div className={cardClasses}>
          <img src={game.url} alt="" className="pointer-events-none object-cover group-hover:opacity-90" />
          <button type="button" className="absolute inset-0 focus:outline-none" onClick={() => { setOpen(true); }}>
            <span className="sr-only">View details for {game.name}</span>
          </button>
        </div>
        <p className="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-300">
          {game.name}
        </p>
        <p className="pointer-events-none block text-sm font-medium text-gray-500">
          {game.id}
        </p>
      </>) :
        (<>
          <div className={cardClasses}>
            <SkeletonTheme baseColor="black" borderRadius="0.5rem" highlightColor="#202020">
              <Skeleton className="pointer-events-none object-cover aspect-h-9 aspect-w-8 group-hover:opacity-90"></Skeleton>
            </SkeletonTheme>
          </div>
          <p className="pointer-events-none w-8/12 mt-2 block truncate ">
            <SkeletonTheme baseColor="black" highlightColor="#202020">
              <Skeleton count={2} ></Skeleton>
            </SkeletonTheme>
          </p>
        </>)}

      {/* POP UP */}
      <CardPopup game={game} gameInfo={gameInfo} isLoadingGameInfo={isLoadingGameInfo} open={open} setOpen={setOpen} skeleton={skeleton}></CardPopup>
    </>
  );
};


ScrollCard.propTypes = {
  game: PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
  skeleton: PropTypes.bool.isRequired,
};

// If you want to specify default values for your props, you can do so as follows:
ScrollCard.defaultProps = {
  game: {
    name: "loading",
    id: -1,
    url: "/#"
  },
  skeleton: false,
};

export default ScrollCard;
