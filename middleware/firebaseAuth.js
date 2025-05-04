import admin from '../firebaseAdmin.js';

export const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // 🔥 This is where uid comes from
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
