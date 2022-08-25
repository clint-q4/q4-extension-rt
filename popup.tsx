import { useState, useEffect } from "react"
import { useStorage } from "@plasmohq/storage";
import {checkSite} from "./content";
import 'bulma/css/bulma.min.css';
import './Style.css';

function IndexPopup() {
  const [data, setData] = useState("")
  useEffect(() => {
    checkSite();
  })
  return (
    <div className="popup-container py-3 px-5">
    <div className="popup-title-container">
      <h2 className="is-size-2 has-text-weight-bold mb-2 has-text-centered">Site: <span id="q4-site-verification"></span></h2>
    </div>
    <div className="popup-buttons-container">
      <div className="popup-buttons-container-sublist" data-title="q4-cms-quick-links">
        <h3 className="is-size-4 my-3">Quick CMS Links</h3>
        <div className="buttons-container is-flex">
          <div className="buttons is-flex is-3">
            <button className="button is-link" id="q4-site-login-button">Login</button>
          </div>
          <div className="button-container">
            <button className="button is-link" id="q4-site-preview-button">Edit Preview</button>
          </div>
          <div className="buttons is-flex is-3">
            <button className="button is-link" id="q4-site-login-button">Login</button>
          </div>
          <div className="button-container">
            <button className="button is-link" id="q4-site-preview-button">Edit Preview</button>
          </div>
        </div>
      </div>
      <div className="popup-buttons-container-sublist" data-title="quick-links">
        <h3 className="is-size-4 my-3" id="target"></h3>
        <div className="buttons-container is-flex">
          <div className="buttons is-flex is-3">
            <button className="button is-link" id="q4-site-login-button">Login</button>
          </div>
          <div className="button-container">
            <button className="button is-link" id="q4-site-preview-button">Edit Preview</button>
          </div>
          <div className="buttons is-flex is-3">
            <button className="button is-link" id="q4-site-login-button">Login</button>
          </div>
          <div className="button-container">
            <button className="button is-link" id="q4-site-preview-button">Edit Preview</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default IndexPopup
