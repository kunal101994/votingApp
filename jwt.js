const jwt = require('jsonwebtoken');

const jwtAuthMiddleware = (req, res, next) => {
    // extract the jwt token from the request headers

    // first check request headers has authorization or not
    const authorization = req.headers.authorization
    if(!authorization)
        return res.status(401).json({error: "Token Not Found"});

    const token = req.headers.authorization.split(' ')[1];
    if(!token) 
        return res.status(401).json({error: "Unauthorized"});
    try {
        // jwt authentication varify
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // ATTACH USER INFORMATION TO THE REQUEST OBJECT
        req.user = decoded
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({error: "Invalid token"});
    }
}

// function to generate jwt token
const generateToken = (userData) => {
    // Generate a new JWT token using user data
    return jwt.sign(userData, process.env.JWT_SECRET, {expiresIn: 3000});
}

module.exports = {jwtAuthMiddleware, generateToken}