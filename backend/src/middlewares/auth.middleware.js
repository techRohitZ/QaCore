const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ CANONICAL USER OBJECT
    req.user = {
      id: decoded.userId,
      email: decoded.email || null,
      role: decoded.role || 'USER'
    };

    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};


// const jwt = require('jsonwebtoken');

// module.exports = function (req, res, next) {
//     const token = req.headers.authorization?.split(' ')[1];
    
//     if (!token) return res.status(401).json({ error: 'Unauthorized' });

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
//         // FIX 1: Attach the whole decoded object to 'req.user'
//         // This ensures req.user.id (or req.user.userId) is available
//         req.user = decoded; 
//         // req.userId = decoded.userId;

        
//         // FIX 2: Debug log to see what's actually inside your token
//         console.log("Decoded Token Data:", req.user); 

//         next();
//     } catch (error) {
//         res.status(401).json({ error: 'Invalid token' });
//     }
// }