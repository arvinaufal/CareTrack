const bcryptjs = require('bcryptjs');

const bcryptHash = (req) => {
    const salt = bcryptjs.genSaltSync(16);
    const hash = bcryptjs.hashSync(req, salt);
    return hash;
}

const bcryptCompare = (req, hashed) => {
    const compare = bcryptjs.compareSync(req, hashed);
    return compare;
}

module.exports = { bcryptHash, bcryptCompare };