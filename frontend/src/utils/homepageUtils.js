import { buildPath, chunkArray, doubleChunkArray } from "./utils";

export const genres = [
    {
      id: 2,
      title: "Point-and-click",
      href: "/#",
      data: [],
    },
    {
      id: 4,
      title: "Fighting",
      href: "/#",
      data: [],
    },
    {
      id: 5,
      title: "Shooter",
      href: "/#",
      data: [],
    },
    {
      id: 7,
      title: "Music",
      href: "/#",
      data: [],
    },
    {
      id: 8,
      title: "Platform",
      href: "/#",
      data: [],
    },
    {
      id: 9,
      title: "Puzzle",
      href: "/#",
      data: [],
    },
    {
      id: 10,
      title: "Racing",
      href: "/#",
      data: [],
    },
    {
      id: 11,
      title: "Real Time Strategy (RTS)",
      href: "/#",
      data: [],
    },
    {
      id: 12,
      title: "Role-playing (RPG)",
      href: "/#",
      data: [],
    },
    {
      id: 13,
      title: "Simulator",
      href: "/#",
      data: [],
    },
    {
      id: 14,
      title: "Sport",
      href: "/#",
      data: [],
    },
    {
      id: 15,
      title: "Strategy",
      href: "/#",
      data: [],
    },
    {
      id: 16,
      title: "Turn-based strategy (TBS)",
      href: "/#",
      data: [],
    },
    {
      id: 24,
      title: "Tactical",
      href: "/#",
      data: [],
    },
    {
      id: 25,
      title: "Hack and slash/Beat 'em up",
      href: "/#",
      data: [],
    },
    {
      id: 26,
      title: "Quiz/Trivia",
      href: "/#",
      data: [],
    },
    {
      id: 30,
      title: "Pinball",
      href: "/#",
      data: [],
    },
    {
      id: 31,
      title: "Adventure",
      href: "/#",
      data: [],
    },
    {
      id: 32,
      title: "Indie",
      href: "/#",
      data: [],
    },
    {
      id: 33,
      title: "Arcade",
      href: "/#",
      data: [],
    },
    {
      id: 34,
      title: "Visual Novel",
      href: "/#",
      data: [],
    },
    {
      id: 35,
      title: "Card & Board Game",
      href: "/#",
      data: [],
    },
    {
      id: 36,
      title: "MOBA",
      href: "/#",
      data: [],
    },
];

const searchGenres = {
  "point-and-click": "Point-and-click",
  "fighting": "Fighting",
  "shooter": "Shooter",
  "music": "Music",
  "platform": "Platform",
  "puzzle": "Puzzle",
  "racing": "Racing",
  "real time strategy (rts)": "Real Time Strategy (RTS)",
  "role-playing (rpg)": "Role-playing (RPG)",
  "simulator": "Simulator",
  "sport": "Sport",
  "strategy": "Strategy",
  "turn-based strategy (tbs)": "Turn-based strategy (TBS)",
  "tactical": "Tactical",
  "hack and slash/beat 'em up": "Hack and slash/Beat 'em up",
  "quiz/trivia": "Quiz/Trivia",
  "pinball": "Pinball",
  "adventure": "Adventure",
  "indie": "Indie",
  "arcade": "Arcade",
  "visual novel": "Visual Novel",
  "card & board game": "Card & Board Game",
  "moba": "MOBA",
};


export const fetchGenre = async (page) => {
    const genreToFetch = genres.slice((page - 1) * 2, page * 2);
    const genreIds = genreToFetch.map((genre) => genre.id);
    console.log("GenreToFetch: ", genreIds);

    try {
        const fetchPromises = genreIds.map(async (id) => {
        let obj = { genre: id, size: 7 };
        let js = JSON.stringify(obj);
        console.log("request", js);

        const response = await fetch(buildPath("Games/api/populatehomepage"), {
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

        const data = await response.json();
        return data.result;
        });

        const results = await Promise.all(fetchPromises);

        const retval = genreToFetch.map((genre, index) => {
        return { ...genre, data: results[index] };
        });
        console.log("Updated Genres: ", retval, "Page: ", page);

        return retval;
    } catch (e) {
        console.error(`Error thrown when fetching genre: ${e}`);
        // alert(e.toString());
        // setSearchResults(e.toString());
    }
};

export async function fetchTopGames() {
    var obj = { topGamesFlag: true, limit: 9, size: 7 };
    var js = JSON.stringify(obj);
    // console.log("TOP GAMES request: ", js);
    try {
        const response = await fetch(buildPath("Games/api/populatehomepage"), {
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
        return jsonResponse.result; // Accessing the 'result' property
    } catch (e) {
        console.error(`Error thrown when fetching top games: ${e}`);
        throw e; // Rethrow the error for React Query to catch
    }
}

export const fetchSearchGroup = async (page, searchGroup) => {
    // Promisified setTimeout
    console.log("sdaiogoasdgbasdgbiasdbgoasdigba,", searchGroup)
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log("page: ", page, "searchGroup: ", searchGroup, "searchGroup.slice((page - 1) * 2, page * 2): ", searchGroup.slice((page - 1) * 2, page * 2) || "[]");
    // Assuming 'searchGroup' is an array of arrays and 'page' is the page number

    return searchGroup.slice((page - 1) * 2, page * 2) || [];
};

export async function fetchSearchResults(searchTerm) {
  let genreFlag = false;
  console.log("Original searchTerm==================:", searchTerm);
  const lowerCasedSearchTerm = searchTerm.toLowerCase();
  console.log("Lowercased searchTerm===========================:", lowerCasedSearchTerm);
  
  if (Object.keys(searchGenres).includes(lowerCasedSearchTerm)) {
    genreFlag = true;
    searchTerm = searchGenres[lowerCasedSearchTerm];
    console.log("Match found, updated searchTerm:", searchTerm);
  } else {
    console.log("No match found for:", lowerCasedSearchTerm);
  }

  var obj = { search: searchTerm, genreFlag: genreFlag };
  var js = JSON.stringify(obj);
  console.log("SEARCH request: ", js);
  try {
    const response = await fetch(buildPath("Games/api/searchGame"), {
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
    let jsonResponse = await response.json();
    

    jsonResponse = doubleChunkArray(jsonResponse.games, 14, 7);
    console.log("SEARCH RESULTS1: ", jsonResponse);
    return jsonResponse; 
  } catch (e) {
    console.error(`Error thrown when fetching search results: ${e}`);
    throw e; // Rethrow the error for React Query to catch
  }
}

