//we use express-jwt to secure our server
const expjwt = require('express-jwt');

function authJwt() {
    const secret = process.env.SECRET_KEY;
    const api = process.env.API_URL;

    return expjwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked //we create a callback function to validate ur jwt
    }).unless({ //we use this so we can acces to this sites without login
        path: [
            {url: /\/api\/v1\/products(.*)/ ,methods: ['GET', 'OPTIONS'] },
            {url: /\/api\/v1\/categories(.*)/ ,methods: ['GET', 'OPTIONS'] },
            {url: /\/public\/uploads(.*)/ ,methods: ['GET', 'OPTIONS'] },
            `${api}/users/signIn`,
            `${api}/users/signUp`            
        ]
    });
}

async function isRevoked(req, payload, done) { //one created our function we can use it to validate if is and admin or not so it cannot make post or delete
    if(!payload.isAdmin) {
        return done(null, true);
    } 
    done();
}

module.exports = authJwt;