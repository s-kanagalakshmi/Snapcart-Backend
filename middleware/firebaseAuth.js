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
// import admin from "../firebaseAdmin";

// export const verifyFirebaseToken = async (req, res, next) => {
    
//   const token = req.headers.authorization?.split(' ')[1];

//   try {
//     const decodedToken = await admin.auth().verifyIdToken(token);
//     req.user = decodedToken;
//     next();
//   } catch (err) {
//     res.status(401).json({ error: 'Invalid or expired token' });
//   }
// };
// export const verifyFirebaseToken = async (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).json({ error: 'Unauthorized' });
//   }

//   const token = authHeader.split(' ')[1];

//   try {
//     const decodedToken = await getAuth().verifyIdToken(token);
//     req.firebaseUser = {
//       uid: decodedToken.uid,
//       email: decodedToken.email,
//       name: decodedToken.name || '',
//     };
//     next();
//   } catch (error) {
//     console.error('Firebase token verification failed:', error);
//     res.status(401).json({ error: 'Invalid token' });
//   }
// };
