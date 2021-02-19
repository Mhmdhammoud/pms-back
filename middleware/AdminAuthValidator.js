import jwt from 'jsonwebtoken';

export default async (req, res, next) => {
  let token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({
      message: 'Not Authorized',
      error: 'This route needs a higher clearance level',
    });
  }

  if (token.startsWith('Bearer')) {
    // Splice token and remove the word bearer and get the whole token
    token = token.slice(7, token.length).trimLeft();
  }
  try {
    // Verify that the passed token is valid with the system JWT Secret
    let decodedToken = jwt.verify(token, process.env.ADMIN_SECRET);
    const { id, image, fullName, email } = decodedToken;
    let user = {
      id,
      image,
      fullName,
      email,
    };
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};
