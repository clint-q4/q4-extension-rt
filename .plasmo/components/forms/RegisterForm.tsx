import { useState, useEffect } from "react";
import PocketBase from 'pocketbase';
import Auth from '../../utils/auth';
import { registerAuth } from '../../utils/apiCalls';

function RegisterForm(props) {
  // form validation
  const registerFormData = {
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  }

  const [registerForm, setRegisterForm] = useState(registerFormData);
  const {email, password, confirmPassword, name} = registerForm;
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
      setRegisterForm({
        ...registerForm,
        [e.target.name]: e.target.value
      })
    }
    console.log(registerForm, errorMessage);
  }
    
  async function handleSubmit(e) {
    e.preventDefault();
    if(email.length && password.length) {
      document.querySelector<HTMLElement>('#modal-register-form .error-text').style.color = 'green';
      setErrorMessage('Sending...');  
      const adminAuthData = await registerAuth(registerForm);
      if(adminAuthData.token) {
        const $el = document.querySelector('#modal-register-form');
        Auth.login(adminAuthData.token);
        setRegisterForm(registerFormData);
        setErrorMessage('You have successfully registered and logged in!');
        setTimeout(() => {
          if($el.classList.contains('is-active')) {
            $el.classList.remove('is-active');
          }
          props.setRefresh(true);
        }, 500)
      } else {
        document.querySelector<HTMLElement>(".error-text").style.color = "red"
        setErrorMessage('Sorry, Incorrect credintials. Please try again!');
      }

    } else {
      document.querySelector<HTMLElement>('#modal-register-form .error-text').style.color = 'red';
      setErrorMessage('One or more fields are empty. Please try again!');
    }
  }

  return (
    <form className="modal" id="modal-register-form" onSubmit={handleSubmit}>
        <div className="modal-background"></div>
        <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Register</p>
          <button className="button is-link modal-close cancel">Cancel</button>        
        </header>
        <div className="modal-card-body py-5">
          <div className="register-form" id="registerForm">
            <div className="field">
              <p className="control has-icons-left has-icons-right">
                <input className="input" name="name" type="name" placeholder="Name" onChange={handleChange}/>
                <span className="icon is-small is-left">
                  <i className="fas fa-envelope"></i>
                </span>
                <span className="icon is-small is-right">
                  <i className="fas fa-check"></i>
                </span>
              </p>
            </div>
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
            <div className="field">
              <p className="control has-icons-left">
                <input className="input" name="confirmPassword" type="password" placeholder="Re-enter Password" onChange={handleChange} />
                <span className="icon is-small is-left">
                  <i className="fas fa-lock"></i>
                </span>
              </p>
            </div>
          </div>
        </div>
        <footer className="modal-card-foot">
          <div className="error-container">
            <p className="error-text">{errorMessage}</p>
          </div>
          <div className="field is-grouped">
            <div className="control">
              <button type="submit" className="button">Register</button>
              <button type="button" className="button">Login</button>
            </div>
          </div>
        </footer>
        </div>
      </form>
  )
}

export default RegisterForm;