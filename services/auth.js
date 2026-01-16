import jwt from "jsonwebtoken";

const secret = "$superMan@123";

export function createTokenForUser(user) {
  const payload = {
    _id: user._id,
    email: user.email,
    role: user.role,
    profileImageURL: user.profileImageURL,

  };

  return jwt.sign(payload, secret, { expiresIn: "1d" });
}

export function validateToken(token) {
  return jwt.verify(token, secret);
}
