const jwt = require('jsonwebtoken');

const verifyJWT = async (req, res, next) =>
{
    const cookies = req.cookies;
    if (!cookies?.jwt_access) {
        console.log("unauthorized: no jwt_access", cookies);
        return res.sendStatus(401); 
    }
    const token = cookies.jwt_access;

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) =>
        {
            if (err) return res.sendStatus(403);
            req.user = decoded._id;
            next();
        });
};

module.exports = verifyJWT;