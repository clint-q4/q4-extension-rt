import { useState, useEffect } from "react"
import FormCard from "~.plasmo/components/FormCard"
import {modalFunctions} from "~.plasmo/utils/modal";
import 'bulma/css/bulma.min.css';


function IndexPopup() {
  const [data, setData] = useState("")
  useEffect(() => {
    modalFunctions();
  })

  return (
    <div className="options-container p-6">
    <section className="header-section is-flex is-justify-content-space-between p-4 has-background-success-light border-radius-10">
      <div>
        <h2 className="title is-size-1">Options</h2>
      </div>
      <div>
        <button className="button is-size-4 has-text-weight-bold is-primary js-modal-trigger" id="add-options-button" data-target="add-options-modal">+</button>
      </div>
    </section>
    <div className="popup-buttons-container">
      <div className="popup-buttons-container-sublist" data-title="quick-links">
        <h3 className="is-size-4 my-3">Quick CMS Links</h3>
        <div className="buttons-container is-flex">
          <div className="buttons is-flex is-3">
            <button className="button is-link" id="q4-site-login-button">Login</button>
          </div>
          <div className="button-container">
            <button className="button is-link" id="q4-site-preview-button">Edit Preview</button>
          </div>
        </div>
      </div>
      <div className="popup-buttons-container-sublist" data-title="quick-links">
        <h3 className="is-size-4 my-3">Excel/Speadsheet Links</h3>
        <div className="buttons-container is-flex">
          <div className="buttons is-flex is-3">
            <button className="button is-link" id="q4-site-login-button">Login</button>
          </div>
        </div>
      </div>
    </div>
    <FormCard></FormCard>
  </div>
  )
}

export default IndexPopup
