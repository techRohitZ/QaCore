const bcrypt = require('bcryptjs'); // Fixed typo from 'bycrypt'
const jwt = require('jsonwebtoken');
const User = require('./user.model');

/**
 * PROFESSIONAL AUTH SERVICE
 * Handles business logic for User registration and authentication.
 */

/**
 * Registers a new user with a hashed password.
 * @param {Object} userData - Contains name, email, and password.
 */
async function register({ name, email, password }) {
    // 1. Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
        throw new Error('Email already registered');
    }

    // 2. Hash password securely
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);

    // 3. Create user in database
    return await User.create({
        name,
        email,
        passwordHash: hash
    });
}

/**
 * Authenticates a user and generates a JWT.
 * @param {Object} credentials - Contains email and password.
 */
async function login({ email, password }) {
    // 1. Find user by email
    const user = await User.findOne({ email });
    
    // 2. Validate user existence and password
    // Professional Tip: Use generic "Invalid credentials" for security.
    if (!user) {
        throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    // 3. Ensure JWT_SECRET is available
    if (!process.env.JWT_SECRET) {
        console.error("CRITICAL: JWT_SECRET is not defined in environment variables.");
        throw new Error('Server configuration error');
    }

    // 4. Generate Token
    const token = jwt.sign(
        { 
            userId: user._id, 
            email: user.email // Added email to payload for easier frontend access
        },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

    return { 
        token, 
        user: { id: user._id, name: user.name, email: user.email } // Return user info for the UI
    };
}

module.exports = { register, login };

// const bycrypt = require('bcryptjs');
// const jwt =require('jsonwebtoken');
// const User =require('./user.model');

// const JWT_SECRET =process.env.JWT_SECRET;

// async function register({name,email,password}) {
//     const existing =await User.findOne({email});

//     if(existing) throw new Error('Email already registered');

//     const hash = await bycrypt.hash(password,10);

//     return User.create({
//         name,
//         email,
//         passwordHash:hash
//     });
// }

//  async function login({email,password}) {
//     const user =await User.findOne({email});
//     console.log('JWT_SECRET:', process.env.JWT_SECRET);

//     if(!user) throw new Error('Invalid credentials ')

//         const token = jwt.sign(
//             {
//                 userId: user._id
//             },
//               process.env.JWT_SECRET,
//             {expiresIn:'1d'}
//         );
//         return {token};
//  }

//  module.exports= {register,login};