import passportJwt from 'passport-jwt';
import passport from 'passport';
import User from '../model/userModel.js'; // Add .js extension if using ES modules

const JWTstrategy = passportJwt.Strategy;
const ExtractJWT = passportJwt.ExtractJwt;

var opts = {};
opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'my-token-secret';

// Fixed: Using async/await instead of callback - THIS WAS THE PROBLEM!
passport.use(new JWTstrategy(opts, async function (jwt_payload, done) {
    try {
        // This line was causing the error - now fixed with await
        const user = await User.findOne({ _id: jwt_payload.id._id });
        
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (err) {
        return done(err, false);
    }
}));

export default passport;