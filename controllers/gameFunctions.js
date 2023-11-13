module.exports = {
    getGame: async function (search)
    {
        let txt = `fields *, cover.url; ${search}`;
        let result = await fetch("https://api.igdb.com/v4/games",
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Client-ID': process.env.IGDB_CLIENT_ID,
                    'Authorization': process.env.IGDB_AUTHORIZATION,
                },
                body: txt,
            }
        );

        const json = await result.json();
        return json;
    },

    getGenre: async function (body)
    {
        let result = await fetch("https://api.igdb.com/v4/games",
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Client-ID': process.env.IGDB_CLIENT_ID,
                    'Authorization': process.env.IGDB_AUTHORIZATION,
                },
                body: body
            }
        );

        const json = await result.json();
        return json;
    },

    getGameInfo: async function (gameId)
    {
        let result = await fetch("https://api.igdb.com/v4/games",
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Client-ID': process.env.IGDB_CLIENT_ID,
                    'Authorization': process.env.IGDB_AUTHORIZATION,
                },
                body: `fields *, cover.url; where id = (${gameId});`
            }
        );

        const json = await result.json();
        return json;
    },

    getGameRatingOutOf5: function (rating)
    {
        return rating / 20;
    },

    getAgeRating: async function (ratingId)
    {
        let result = await fetch("https://api.igdb.com/v4/age_ratings",
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Client-ID': process.env.IGDB_CLIENT_ID,
                    'Authorization': process.env.IGDB_AUTHORIZATION,
                },
                body: `fields rating; where id = (${ratingId}) & category = 1;`
            }
        );

        const json = await result.json();
        return json;
    },


    getGameImages: async function (imageId)
    {
        let result = await fetch("https://api.igdb.com/v4/screenshots",
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Client-ID': process.env.IGDB_CLIENT_ID,
                    'Authorization': process.env.IGDB_AUTHORIZATION,
                },
                body: `fields url; where id = (${imageId});`
            }
        );

        const json = await result.json();
        return json;
    },

    getGameVideos: async function (videoId)
    {
        let result = await fetch("https://api.igdb.com/v4/game_videos",
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Client-ID': process.env.IGDB_CLIENT_ID,
                    'Authorization': process.env.IGDB_AUTHORIZATION,
                },
                body: `fields video_id; where id = (${videoId});`
            }
        );

        const json = await result.json();
        return json;
    },

    getGameLinks: async function (linkId)
    {
        let result = await fetch("https://api.igdb.com/v4/websites",
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Client-ID': process.env.IGDB_CLIENT_ID,
                    'Authorization': process.env.IGDB_AUTHORIZATION,
                },
                body: `fields url; where id = (${linkId});`
            }
        );

        const json = await result.json();
        return json;
    },

    getGamePlatforms: async function (platformId)
    {
        let result = await fetch("https://api.igdb.com/v4/platforms",
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Client-ID': process.env.IGDB_CLIENT_ID,
                    'Authorization': process.env.IGDB_AUTHORIZATION,
                },
                body: `fields name, platform_logo; where id = (${platformId});`
            }
        );

        const json = await result.json();
        return json;
    },

    getGamePlatformLogos: async function (platformLogoId)
    {
        let result = await fetch("https://api.igdb.com/v4/platform_logos",
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Client-ID': process.env.IGDB_CLIENT_ID,
                    'Authorization': process.env.IGDB_AUTHORIZATION,
                },
                body: `fields url; where id = (${platformLogoId});`
            }
        );

        const json = await result.json();
        return json;
    },

    updateCoverURL: function (coverURL, size)
    {
        return coverURL.replace(/thumb/g, size);
    }
}

