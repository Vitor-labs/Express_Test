const JWT = require('jsonwebtoken');

const verify_token = (req, res, next) => {
    const token = req.headers.token;
    if (!token) {
        return res.status(401).send({ auth: false, message: 'No token provided.' });
    }
    JWT.verify(token, process.env.JWT_SEC, (err, decoded) => {
        if (err) {
            return res.status(403).send({ auth: false, message: 'Failed to authenticate token.' });
        }
        req.user = decoded;
        next();
    });
}

const verifyTokenAuth = (req, res, next) => {
    verify_token(req, res, () => {
        if (req.user.id !== req.params.id || req.user.isAdmin) {
            return res.status(403).send({ auth: false, message: 'Unauthorized' });
        }
        next();
    });
}

const verifyTokenAndAdmin = (req, res, next) => {
    verify_token(req, res, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("You are not alowed to do that!");
        }
    });
};

module.exports = { verifyTokenAndAdmin, verifyTokenAuth };