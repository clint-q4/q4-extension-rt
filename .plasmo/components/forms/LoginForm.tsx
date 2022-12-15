import { useState } from "react"

import { loginAuth, listAuthMethods } from "../../utils/apiCalls"
import Auth from "../../utils/auth"
import RegisterForm from "./RegisterForm"
import ForgetPassword from "./ForgetPasswordForm"
import ResendLoginVerification from "./ResendLoginVerification"
import loaderSvg from '../../../assets/loading.svg';

function LoginForm(props) {
  // form validation
  const LoginFormData = {
    email: "",
    password: ""
  }

  const [loginForm, setLoginForm] = useState(LoginFormData)
  const { email, password } = loginForm
  const [errorMessage, setErrorMessage] = useState("")
  const [verification, setVerification] = useState(false)
  const [loader, intiateLoader] = useState(false)

  function handleChange(e) {
    if (!e.target.value.length) {
      document.querySelector<HTMLElement>(".error-text").style.color = "red"
      setErrorMessage(
        `${
          e.target.name.charAt(0).toUpperCase() + e.target.name.slice(1)
        } is required.`
      )
    } else {
      setErrorMessage("")
      setLoginForm({
        ...loginForm,
        [e.target.name]: e.target.value
      })
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errorCont = document.querySelector<HTMLElement>(
      "#modal-login-form .error-text"
    )
    if (email.length && password.length) {
      // setErrorMessage("Please wait...")
      intiateLoader(true)
      const adminAuthData = await loginAuth(email, password)
      if (!adminAuthData['status']) {
        intiateLoader(false);
        errorCont.style.color = "red";
        setErrorMessage(adminAuthData['message']);
        if(!adminAuthData['verified']) {
          const buttonCont = document.querySelector<HTMLElement>(
            "#modal-login-form .modal-card-foot .control"
          )
          setVerification(true)
        }
        return
      }
      if (adminAuthData.hasOwnProperty("token")) {
        errorCont.style.color = "green"
        const $el = document.querySelector("#modal-login-form")
        setLoginForm(LoginFormData)
        intiateLoader(false)
        setErrorMessage("You have successfully logged in!")
        Auth.login(adminAuthData["token"], adminAuthData["exToken"])
        setTimeout(() => {
          if ($el.classList.contains("is-active")) {
            $el.classList.remove("is-active")
          }
          window.location.reload();
        }, 500)
      } else {
        intiateLoader(false);
        errorCont.style.color = "red"
        setErrorMessage("Email Address or Password is incorrect!");
      }
    } else {
      document.querySelector<HTMLElement>(".error-text").style.color = "red"
      setErrorMessage("One or more fields are empty. Please try again!")
      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
    }
  }

  return (
    <>
      <div className="user-button-container is-flex is-align-items-center">
        {Auth.loggedIn() ? (
          <button
            onClick={(e) => Auth.logout()}
            className="button logout-button"
            type="button">
            <i className="fa-solid fa-user-bounty-hunter"></i>
            Logout
          </button>
        ) : (
          <button
            type="button"
            className="button js-modal-trigger"
            data-target="modal-login-form">
            <i className="fa-solid fa-user-bounty-hunter"></i>
            Login
          </button>
        )}
      </div>
      <div className="user-details-container">
        <div></div>
      </div>
      <form className="modal" id="modal-login-form" onSubmit={handleSubmit}>
        <div className="modal-background"></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Login</p>
            <button className="button modal-close cancel">Cancel</button>
          </header>
          <div className="modal-card-body py-5">
            <div className="login-form" id="loginForm">
              <div className="field">
                <p className="control has-icons-left has-icons-right">
                  <input
                    className="input"
                    name="email"
                    type="email"
                    placeholder="Email"
                    onChange={handleChange}
                  />
                  <span className="icon is-small is-left">
                    <i className="fas fa-envelope"></i>
                  </span>
                </p>
              </div>
              <div className="field">
                <p className="control has-icons-left">
                  <input
                    className="input"
                    name="password"
                    type="password"
                    placeholder="Password"
                    onChange={handleChange}
                  />
                  <span className="icon is-small is-left">
                    <i className="fas fa-lock"></i>
                  </span>
                </p>
              </div>
              <div className="field">
                <button 
                  className="link forgot-password js-modal-trigger"
                  type="button"
                  title="forgot password"
                  data-target="modal-forgot-password-form"
                  >
                  Forgot Password?
                </button>
              </div>
            </div>
          </div>
          <footer className="modal-card-foot">
            {loader ? (
              <div className="loader-container">
                <img src={loaderSvg} alt="loader" />
              </div>
            ) : <></>}
            <div className="error-container">
              <p className="error-text">{errorMessage}</p>
            </div>
            <div className="field is-grouped">
              <div className="control">
                <ResendLoginVerification
                verification={verification}
                setVerification={setVerification}
                email={email}
                setErrorMessage={setErrorMessage}
                ></ResendLoginVerification>
                <button type="submit" className="button">
                  Login
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    const regFrom = document.getElementById(
                      "modal-register-form"
                    )
                    const logFrom = document.getElementById("modal-login-form")
                    regFrom.classList.toggle("is-active")
                    logFrom.classList.toggle("is-active")
                  }}
                  className="button">
                  Register
                </button>
              </div>
            </div>
          </footer>
        </div>
      </form>
      <RegisterForm setRefresh={props.setRefresh}></RegisterForm>
      <ForgetPassword></ForgetPassword>
    </>
  )
}

export default LoginForm
