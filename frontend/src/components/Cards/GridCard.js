import { useState } from "react";
import PropTypes from "prop-types";
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton'
import CardPopup from "../CardPopup";
import { useQuery } from "react-query";


const app_name = "poosd-large-project-group-8-1502fa002270"
function buildPath(route) {
  if (process.env.NODE_ENV === 'production') {
    return 'https://' + app_name + '.herokuapp.com/' + route
  } else {
    return 'http://localhost:3001/' + route
  }
}


function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const fetchGameInformation = async (gameId) => {
  console.log("GETTING Game INFO : ", gameId)
  var obj = {gameId};
  var js = JSON.stringify(obj);
  
  try {
    const response = await fetch(buildPath("Games/api/getgameinfo"), {
      method: 'POST',
      body: js,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const jsonResponse = await response.json();
    console.log("jsonResponse for gameInfo: ", jsonResponse);

    return jsonResponse.gameInfo; // Remove Me!

    // Retrieve the games
    // try {
    //   const fetchPromises = jsonResponse.similarGames.map(async (id) => {
    //     let obj = { genre: id, size: 7 };
    //     let js = JSON.stringify(obj);
    //     console.log("request", js);
        
    //     // THIS NEEDS TO BE AN ENDPOINT THAT LETS ME GET A SINGLE GAME OR MULTIPLE GAMES AT A TIME.
    //     const response = await fetch(buildPath("Games/api/populatehomepage"), {
    //       method: 'POST',
    //       body: js,
    //       headers: {
    //         'Content-Type': 'application/json'
    //       }
    //     });
  
    //     if (!response.ok) {
    //       throw new Error(`HTTP error! status: ${response.status}`);
    //     }
  
    //     const data = await response.json();
    //     return data.result;
    //   });
  
    //   const results = await Promise.all(fetchPromises);
  
    //   jsonResponse.similarGames = results.map((game, index) => {
    //     return {...game};
    //   });

    //   console.log("Similar Games: ", jsonResponse.similarGames);
  
    //   return jsonResponse;
    // } catch (e) {
    //   alert(e.toString());
    //   // setSearchResults(e.toString());
    // }

    // return jsonResponse; // Accessing the 'result' property
  }
  catch(e)
  {
      alert(e.toString());
      throw e; // Rethrow the error for React Query to catch
  }
}


const GridCard = ({ game, skeleton }) => {
  const [open, setOpen] = useState(false);

 // Triggers the query when the popup is open and the game ID is available
 const { data: gameInfo, isLoading: isLoadingGameInfo, isError, error } = useQuery(
    ['RecommendedGames', game.id], 
    () => fetchGameInformation(game.id), 
    { 
      enabled: open && game.id != null && skeleton === false,
    }
  );

  const cardClasses = classNames(`group aspect-h-5 aspect-w-8 block w-full overflow-hidden rounded-lg bg-black transform transition-transform duration-300
  ease-in-out group hover:scale-105  hover:shadow-md  hover:shadow-gray-950`);


  return (
    <>
      {/* Button */}

      {!skeleton ? (<>
        <div className={cardClasses}>
          <img src={game.url} alt="" className="pointer-events-none object-cover group-hover:opacity-90" />
          <button type="button" className="absolute  inset-0 focus:outline-none" onClick={() => {setOpen(true)}}>
            <span className="sr-only">View details for {game.name}</span>
          </button>
        </div>
        <p className="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-300">
          {game.name}
        </p>
        <p className="pointer-events-none block text-sm font-medium text-gray-500">
          {game.id}
        </p>
      </>): 
      (<>
        <div className={cardClasses}>
          <SkeletonTheme baseColor="black" borderRadius="0.5rem" highlightColor="#202020">
            <Skeleton className="pointer-events-none object-cover aspect-h-7 aspect-w-10 group-hover:opacity-90"></Skeleton>
          </SkeletonTheme>
        </div>
        <p className="pointer-events-none w-8/12 mt-2 block truncate ">
          <SkeletonTheme baseColor="black" highlightColor="#202020">
            <Skeleton  count={2} ></Skeleton>
          </SkeletonTheme>
        </p>
      </>)}
      
      {/* POP UP */}
      <CardPopup game={game} gameInfo={gameInfo} isLoadingGameInfo={isLoadingGameInfo} open={open} setOpen={setOpen} skeleton={skeleton}></CardPopup>
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
    url: "/#"
  },
  skeleton: false,
};

export default GridCard;
