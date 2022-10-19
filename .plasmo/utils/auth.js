// use this to decode a token and get the user's information out of it
import decode from 'jwt-decode';
import {client} from './apiCalls';

// create a new class to instantiate for a user
class AuthService {
  // get user data
  getProfile() {
    return decode(this.getToken());
  }

  // check if user's logged in
  loggedIn() {
    // Checks if there is a saved token and it's still valid
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token); // handwaiving here
  }

  // check if token is expired
  isTokenExpired(token) {
    try {
      const decoded = decode(token);
      if (decoded.exp < Date.now() / 1000) {
        return true;
      } else return false;
    } catch (err) {
      return false;
    }
  }

  getToken() {
    // Retrieves the user token from localStorage
    return localStorage.getItem('id_token');
  }

  login(idToken) {
    // Saves user token to localStorage
    localStorage.setItem('id_token', idToken);
    setTimeout(function () {
      window.location.reload();
    }, 500)
  }

  logout() {
    // Clear user token and profile data from localStorage
    client.authStore.clear();
    localStorage.removeItem('id_token');
    window.location.reload();
    // this will reload the page and reset the state of the application
  }
}

export default new AuthService();