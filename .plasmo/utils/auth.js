// use this to decode a token and get the user's information out of it
import decode from 'jwt-decode';
import {pb} from './apiCalls';

// create a new class to instantiate for a user
class AuthService {
  // get user data
  getProfile() {
    return decode(this.getToken());
  }

  // check if user's logged in
  loggedIn() {
    // Checks if there is a saved token and it's still valid
    const obj = this.getToken();
    const token = obj.token;
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

  // get token
  getToken() {
    // Retrieves the user token from localStorage
    const token = window.localStorage.getItem('id_token');
    const exToken = window.localStorage.getItem('ex_token');
    const obj = {
      token: token,
      exToken: exToken
    }
    return obj;
  }

  // on login set tokens in localstorage
  login(idToken, exToken) {
    window.localStorage.setItem('id_token', idToken);
    window.localStorage.setItem('ex_token', exToken);
  }

  logout() {
    // Clear user token and profile data from localStorage
    const localStorageItems = ['id_token', 'ex_token', 'indexLinks', 'indexSnippets', 'theme', 'refreshSession', 'localData', 'categories', ]
    pb.authStore.clear();
    for(let item of localStorageItems) {
      window.localStorage.removeItem(item);
    }
    window.location.reload();
    // this will reload the page and reset the state of the application
  }
}

export default new AuthService();