import { buildPath } from "./utils";

export const fetchGameInformation = async (gameId) =>
{
  var obj = {
    gameId: gameId,
    options: {
      _id: true,
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
      similargames: true,
      reviewcount: true,
    }
  };
  var js = JSON.stringify(obj);

  try {
    const response = await fetch(buildPath("Games/api/getgameinfo"), {
      method: "POST",
      body: js,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const jsonResponse = await response.json();

    let gameInfo = jsonResponse.gameInfo;

    // Retrieve the similar games
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
        },
      };
      let js = JSON.stringify(obj);

      const similarGamesResponse = await fetch(
        buildPath("Games/api/getgameinfo"),
        {
          method: "POST",
          body: js,
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!similarGamesResponse.ok) {
        throw new Error(`HTTP error! status: ${similarGamesResponse.status}`);
      }

      let resolvedSimilarGames = await similarGamesResponse.json()

      gameInfo.similargames = resolvedSimilarGames.map((game, index) =>
      {
        return { ...game };
      });
      console.log(gameInfo);
      return gameInfo;
    } catch (e) {
      console.error(e);
    }
  }
  catch (e)
  {
    alert(e.toString());
    throw e; // Rethrow the error for React Query to catch
  }
};