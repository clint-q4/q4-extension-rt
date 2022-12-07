import { useState } from "react"

import { registerAuth } from "../../utils/apiCalls"

function RegisterForm(props) {
  // form validation
  const registerFormData = {
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  }

  const [registerForm, setRegisterForm] = useState(registerFormData)
  const { email, password, confirmPassword, name } = registerForm
  const [errorMessage, setErrorMessage] = useState("")

  function handleChange(e) {
    const errorCont = document.querySelector<HTMLElement>(
      "#modal-register-form .error-text"
    )
    if (!e.target.value.length) {
      setErrorMessage(
        `${
          e.target.name.charAt(0).toUpperCase() + e.target.name.slice(1)
        } is required.`
      )
      document.querySelector<HTMLElement>(
        "#modal-register-form .error-text"
      ).style.color = "red"
    } else {
      setErrorMessage("")
    }

    if(e.target.name === "confirmPassword" || e.target.name === "password") {
      if(e.target.value.length <= 8) {
        errorCont.style.color = "red";
        setErrorMessage("Password: the length must be between 8 and 72.")
      } else {
        setErrorMessage("")
      }
    }

    if (e.target.value.length) {
      setRegisterForm({
        ...registerForm,
        [e.target.name]: e.target.value
      })
    }
  }

  function triggerLoginModal(e) {
    e.preventDefault()
    const _t = e.target
    const $elRegister = document.querySelector(
      "#modal-register-form"
    ) as HTMLElement
    const $elLogin = document.querySelector("#modal-login-form") as HTMLElement
    if ($elRegister.classList.contains("is-active")) {
      $elRegister.classList.remove("is-active")
    }
    if (!$elLogin.classList.contains("is-active")) {
      $elLogin.classList.add("is-active")
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errContainer = document.querySelector<HTMLElement>("#modal-register-form .error-text");
    if (email.length && password.length) {
      errContainer.style.color = "green"
      setErrorMessage("Sending...")
      const adminAuthData = await registerAuth(registerForm)
      if (adminAuthData.status) {
        const $el = document.querySelector("#modal-register-form")
        setRegisterForm(registerFormData);
        setErrorMessage(
          "You have successfully registered! You will receive an email for verification. You can sign in once you verified the link!"
        )
      } else {
        errContainer.style.color = "red";
        setErrorMessage("Sorry, Incorrect credintials. Please try again!");
        setRegisterForm(registerFormData);
      }
    } else {
      errContainer.style.color = "red"
      setErrorMessage("One or more fields are empty. Please try again!")
    }
  }

  return (
    <form className="modal" id="modal-register-form" onSubmit={handleSubmit}>
      <div className="modal-background"></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Register</p>
          <button className="button modal-close cancel">Cancel</button>
        </header>
        <div className="modal-card-body py-5">
          <div className="register-form" id="registerForm">
            <div className="field">
              <p className="control has-icons-left has-icons-right">
                <input
                  className="input"
                  name="name"
                  type="name"
                  placeholder="Name"
                  onChange={handleChange}
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-user"></i>
                </span>
              </p>
            </div>
            <div className="field">
              <p className="control has-icons-left has-icons-right">
                <input
                  className="input"
                  name="username"
                  type="name"
                  placeholder="User Name"
                  onChange={handleChange}
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-user"></i>
                </span>
              </p>
            </div>
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
              <p className="control has-icons-left">
                <input
                  className="input"
                  name="confirmPassword"
                  type="password"
                  placeholder="Re-enter Password"
                  onChange={handleChange}
                />
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
              <button type="submit" className="button">
                Register
              </button>
              <button
                type="button"
                onClick={triggerLoginModal}
                className="button">
                Login
              </button>
            </div>
          </div>
        </footer>
      </div>
    </form>
  )
}

export default RegisterForm