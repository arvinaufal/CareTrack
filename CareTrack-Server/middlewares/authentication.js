
const { verifyToken } = require("../helpers/jwt");
const { User } = require("../models");

const authentication = async (req, res, next) => {
    try {

        
        if (!req.headers.authorization) throw ({ name: "Unauthenticated", origin: 'middleware' });
        const token = req.headers.authorization.split(' ').at(-1);
        
        if (!token) throw ({ name: "Unauthenticated", origin: 'middleware' });
        
        const { id } = verifyToken(token);
        const user = await User.findByPk(id);

        if (!user) throw ({ name: "Unauthenticated", origin: 'middleware' });

        req.user = {
            id: user.id,
            email: user.email
        };

        next();
    } catch (error) {
        next(error);
    }
}

module.exports = authentication;