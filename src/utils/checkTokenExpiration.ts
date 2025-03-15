import { jwtDecode } from "jwt-decode";

export const checkTokenExpiration = () => {
  const token = localStorage.getItem('token');

  if (!token)
    return false;

  try {
    const decoded = jwtDecode(token);

    if (!decoded.exp)
      return false;

    const expirationTime = decoded.exp * 1000;
    const currentTime = new Date().getTime();

    if (currentTime >= expirationTime)
      return false;

    else return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};