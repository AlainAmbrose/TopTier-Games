const express = require("express");
const router = express.Router();
const verifyJWT = require('../middleware/verifyJWT');

const usersController = require('../controllers/Users');

const refreshController = require('../controllers/refreshToken');
const rankingsController = require('../controllers/RankingCards');
const progressController = require('../controllers/ProgressCards');
const gamesController = require('../controllers/Games');

let jwt_access = "";
let jwt_refresh = "";

describe('User Endpoints', () =>
{
    let id = "";
    it('SignUp API', async () =>
    {
        let js = JSON.stringify({
            login: "NewUser", firstname: "New", lastname: "User", email: "ry326542@ucf.edu", password: "newpassword"
        });

        const response = await fetch("http://localhost:3001/Users/api/signup",
            {
                method: 'POST',
                credentials: 'include',
                body: js,
                headers: { "Content-Type": "application/json", }
            });
        expect(response.status).toBe(200);

        let res = JSON.parse(await response.text());

        id = res.id;
    });

    it('Login API', async () =>
    {
        let js = JSON.stringify({
            login: "NewUser", password: "newpassword"
        });

        const response = await fetch("http://localhost:3001/Users/api/login",
            {
                method: 'POST',
                credentials: 'include',
                body: js,
                headers: { "Content-Type": "application/json", }
            });
        expect(response.status).toBe(200);

        let res = JSON.parse(await response.text());

        jwt_access = res.accessToken;
        jwt_refresh = res.refreshToken;
    });

    it('Get User API', async () =>
    {
        let js = JSON.stringify({
            id: "653aa41e2f3a9ed2b8fd624f"
        });

        const response = await fetch("http://localhost:3001/Users/api/getuser",
            {
                method: 'POST',
                credentials: 'include',
                body: js,
                headers: {
                    "Content-Type": "application/json",
                    "Cookie": `jwt_access=${jwt_access};`
                }
            });
        expect(response.status).toBe(200);
    });

    it('Update User API', async () =>
    {
        let js = JSON.stringify({
            userId: "653aa41e2f3a9ed2b8fd624f", email: "thespiderman@gmail.com"
        });

        const response = await fetch("http://localhost:3001/Users/api/updateuser",
            {
                method: 'POST',
                credentials: 'include',
                body: js,
                headers: {
                    "Content-Type": "application/json",
                    "Cookie": `jwt_access=${jwt_access};`
                }
            });
        expect(response.status).toBe(200);
    });

    it('Delete User API', async () =>
    {
        let js = JSON.stringify({
            userId: id
        });

        const response = await fetch("http://localhost:3001/Users/api/deleteuser",
            {
                method: 'POST',
                credentials: 'include',
                body: js,
                headers: {
                    "Content-Type": "application/json",
                    "Cookie": `jwt_access=${jwt_access};`
                }
            });
        expect(response.status).toBe(200);
    });
});

describe('Game Endpoints', () =>
{
    it('Insert Game API', async () =>
    {
        let js = JSON.stringify({
            gameId: 1942
        });

        const response = await fetch("http://localhost:3001/Games/api/insertgame",
            {
                method: 'POST',
                credentials: 'include',
                body: js,
                headers: {
                    "Content-Type": "application/json",
                    "Cookie": `jwt_access=${jwt_access};`
                }
            });
        expect(response.status).toBe(200);
    });

    it('Search Game API', async () =>
    {
        let js = JSON.stringify({
            search: "the witcher"
        });

        const response = await fetch("http://localhost:3001/Games/api/searchgame",
            {
                method: 'POST',
                credentials: 'include',
                body: js,
                headers: {
                    "Content-Type": "application/json",
                    "Cookie": `jwt_access=${jwt_access};`
                }
            });
        expect(response.status).toBe(200);

        let res = JSON.parse(await response.text());
    });

    it('Populate Home Page API', async () =>
    {
        let js = JSON.stringify({
            topGamesFlag: true, size: 7
        });

        const response = await fetch("http://localhost:3001/Games/api/populatehomepage",
            {
                method: 'POST',
                credentials: 'include',
                body: js,
                headers: {
                    "Content-Type": "application/json",
                    "Cookie": `jwt_access=${jwt_access};`
                }
            });
        expect(response.status).toBe(200);
    });

    it('Get Game Cover API', async () =>
    {
        let js = JSON.stringify({
            id: "426", size: 7
        });

        const response = await fetch("http://localhost:3001/Games/api/getcover",
            {
                method: 'POST',
                credentials: 'include',
                body: js,
                headers: {
                    "Content-Type": "application/json",
                    "Cookie": `jwt_access=${jwt_access};`
                }
            });
        expect(response.status).toBe(200);
    });

    it('Get Game Info API', async () =>
    {
        let js = JSON.stringify({
            gameId: 426
        });

        const response = await fetch("http://localhost:3001/Games/api/getgameinfo",
            {
                method: 'POST',
                credentials: 'include',
                body: js,
                headers: {
                    "Content-Type": "application/json",
                    "Cookie": `jwt_access=${jwt_access};`
                }
            });
        expect(response.status).toBe(200);
    });
});

describe('Progress Endpoints', () =>
{
    it('Add User Game API', async () =>
    {
        let js = JSON.stringify({
            userId: "653aa41e2f3a9ed2b8fd624f", gameId: "654c43d09620ea69380a813f",
        });

        const response = await fetch("http://localhost:3001/Progress/api/addusergame",
            {
                method: 'POST',
                credentials: 'include',
                body: js,
                headers: {
                    "Content-Type": "application/json",
                    "Cookie": `jwt_access=${jwt_access};`
                }
            });
        expect(response.status).toBe(200);
    });

    it('Get User Game API', async () =>
    {
        let js = JSON.stringify({
            userId: "653aa41e2f3a9ed2b8fd624f",
        });

        const response = await fetch("http://localhost:3001/Progress/api/getusergame",
            {
                method: 'POST',
                credentials: 'include',
                body: js,
                headers: {
                    "Content-Type": "application/json",
                    "Cookie": `jwt_access=${jwt_access};`
                }
            });
        expect(response.status).toBe(200);
    });
});

describe('Rankings Endpoints', () =>
{
    it('Set User Rating API', async () =>
    {
        let js = JSON.stringify({
            userId: "653aa41e2f3a9ed2b8fd624f", gameId: "654c43d09620ea69380a813f", ranking: 4.5
        });

        const response = await fetch("http://localhost:3001/Ranking/api/setranking",
            {
                method: 'POST',
                credentials: 'include',
                body: js,
                headers: {
                    "Content-Type": "application/json",
                    "Cookie": `jwt_access=${jwt_access};`
                }
            });
        expect(response.status).toBe(200);
    });

    it('Set User Review API', async () =>
    {
        let js = JSON.stringify({
            userId: "653aa41e2f3a9ed2b8fd624f", gameId: "654c43d09620ea69380a813f", review: "good game",
        });

        const response = await fetch("http://localhost:3001/Ranking/api/setreview",
            {
                method: 'POST',
                credentials: 'include',
                body: js,
                headers: {
                    "Content-Type": "application/json",
                    "Cookie": `jwt_access=${jwt_access};`
                }
            });
        expect(response.status).toBe(200);
    });

    it('Delete User Game API', async () =>
    {
        let js = JSON.stringify({
            userId: "653aa41e2f3a9ed2b8fd624f", gameId: "654c43d09620ea69380a813f"
        });

        const response = await fetch("http://localhost:3001/Progress/api/deleteusergame",
            {
                method: 'POST',
                credentials: 'include',
                body: js,
                headers: {
                    "Content-Type": "application/json",
                    "Cookie": `jwt_access=${jwt_access};`
                }
            });
        expect(response.status).toBe(200);
    });
});

describe('Refresh Endpoint', () =>
{
    it('Refresh Token API', async () =>
    {
        const response = await fetch("http://localhost:3001/Refresh",
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                    "Cookie": `jwt_refresh=${jwt_refresh};`
                }
            });
        expect(response.status).toBe(200);
    });
});

describe('Logout Endpoint', () =>
{
    it('Logout API', async () =>
    {
        const response = await fetch("http://localhost:3001/Users/api/logout",
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                    "Cookie": `jwt_refresh=${jwt_refresh};`
                }
            });
        expect(response.status).toBe(200);
    });
});