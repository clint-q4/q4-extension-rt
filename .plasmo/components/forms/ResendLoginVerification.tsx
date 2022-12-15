import { useState } from "react"

import { sendVerificationEmail } from "../../utils/apiCalls"
import Auth from "../../utils/auth"

function ResendLoginVerification(props) {
  // const [loader, intiateLoader] = useState(false)

  async function handleClick(e) {
    e.preventDefault();
    if(!props.email.length) return;
    const res = await sendVerificationEmail(props.email);
    if(res) {
      document.querySelector<HTMLElement>("#modal-forgot-password-form .error-text").style.color = "green"
      props.setErrorMessage('An verification email has been sent, please verify the email!' );
      props.setVerification(false);
      return;
    } else {
      document.querySelector<HTMLElement>("#modal-forgot-password-form .error-text").style.color = "red"
      props.setErrorMessage('Please double check your email address and try again.');
    }
  }

  return (
    props.verification ? 
      <button 
      id="resend-verification"
      type="button"
      title="Resend Verification"
      className="button resend-verification"
      onClick={handleClick}
    >
      Resend Verification
    </button> : <></>
  )
}

export default ResendLoginVerification;