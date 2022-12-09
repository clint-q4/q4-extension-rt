import { useState } from "react"

import { passwordResetAuth } from "../../utils/apiCalls"
import Auth from "../../utils/auth"

function ForgetPassword(props) {


  const [email, setEmail] = useState('')
  const [errorMessage, setErrorMessage] = useState("")
  // const [loader, intiateLoader] = useState(false)

  function handleChange(e) {
    const _t = e.target.value;
    if(!_t.length) return;
    setEmail(_t);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await passwordResetAuth(email);
    if(res) {
      document.querySelector<HTMLElement>("#modal-forgot-password-form .error-text").style.color = "green"
      setErrorMessage('An email has been sent to you with a link to reset your password (if exists). If you have not received the email, please double check the email address!' );
      return;
    } else {
      document.querySelector<HTMLElement>("#modal-forgot-password-form .error-text").style.color = "red"
      setErrorMessage('Please double check your email address and try again.');
    }
  }

  return (
    <>
      <form className="modal" id="modal-forgot-password-form" onSubmit={handleSubmit}>
        <div className="modal-background"></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Password Reset</p>
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
                    placeholder="Enter you email address"
                    onChange={handleChange}
                  />
                  <span className="icon is-small is-left">
                    <i className="fas fa-envelope"></i>
                  </span>
                </p>
                <p className="py-4">
                  Please enter your email address and we will send you a link to reset your password.
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
                  Send
                </button>
              </div>
            </div>
          </footer>
        </div>
      </form>
    </>
  )
}

export default ForgetPassword;