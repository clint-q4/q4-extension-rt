import { useState, useEffect } from "react";
import PocketBase from 'pocketbase';
import Auth from '../utils/auth';
import { loginAuth } from '../utils/apiCalls';

function LoginForm() {
  // form validation
  const LoginFormData = {
    email: "",
    password: ""
  }

  const [loginForm, setLoginForm] = useState(LoginFormData);
  const {email, password} = loginForm;
  const [validated] = useState(false);
  const [errorMessage, setErrorMessage] = useState("")

  function handleChange(e) {
    if (!e.target.value.length) {
      setErrorMessage(
        `${
          e.target.name.charAt(0).toUpperCase() + e.target.name.slice(1)
        } is required.`
      )
      document.querySelector<HTMLElement>(".error-text").style.color = "red"
    } else {
      setErrorMessage("")
    }

    if (!errorMessage) {
      setLoginForm({
        ...loginForm,
        [e.target.name]: e.target.value
      })
    }
    console.log(loginForm, errorMessage);
  }
  
  async function handleSubmit(e) {
    e.preventDefault();
    if(email.length && password.length) {
      document.querySelector<HTMLElement>('.error-text').style.color = 'green';
      setErrorMessage('Sending...');  
      // document.getElementById('add-options-modal')[0].reset();
      // const adminAuthData = await client.users.authViaEmail(email, password);
      const adminAuthData = await loginAuth(email, password);
      if(adminAuthData.token) {
        const $el = document.querySelector('#modal-login-form');
        Auth.login(adminAuthData.token);
        console.log(adminAuthData);
        setLoginForm(LoginFormData);
        setErrorMessage('You have successfully logged in!');
        setTimeout(() => {
          if($el.classList.contains('is-active')) {
            $el.classList.remove('is-active');
          }
        }, 500)
      }

    } else {
      document.querySelector<HTMLElement>('.error-text').style.color = 'red';
      setErrorMessage('One or more fields are empty. Please try again!');
    }
  }
  return (
    <>
      <div className="user-button-container is-flex is-align-items-center">
      {Auth.loggedIn() ? (
            <button onClick={Auth.logout} className="button logout-button" type="button">
              <i className="fa-solid fa-user-bounty-hunter"></i>
              Logout
            </button>
        ) : (
            <button type="button" className="button js-modal-trigger" data-target="modal-login-form">
              <i className="fa-solid fa-user-bounty-hunter"></i>
              Login
            </button>
        )}
      </div>
      <div className="user-details-container">
        <div>

        </div>
      </div>
      <form className="modal" id="modal-login-form" onSubmit={handleSubmit}>
        <div className="modal-background"></div>
        <div className="modal-content">
          <div className="login-form" id="loginForm">
            <div className="field">
              <p className="control has-icons-left has-icons-right">
                <input className="input" name="email" type="email" placeholder="Email" onChange={handleChange}/>
                <span className="icon is-small is-left">
                  <i className="fas fa-envelope"></i>
                </span>
                <span className="icon is-small is-right">
                  <i className="fas fa-check"></i>
                </span>
              </p>
            </div>
            <div className="field">
              <p className="control has-icons-left">
                <input className="input" name="password" type="password" placeholder="Password" onChange={handleChange} />
                <span className="icon is-small is-left">
                  <i className="fas fa-lock"></i>
                </span>
              </p>
            </div>
            <div className="error-container mb-3">
              <p className="error-text">{errorMessage}</p>
            </div>
            <div className="field is-grouped">
              <div className="control">
                <button type="submit" className="button is-success">Login</button>
              </div>
              <div className="control">
                <button className="button is-link is-danger modal-close cancel">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  )
}

export default LoginForm;