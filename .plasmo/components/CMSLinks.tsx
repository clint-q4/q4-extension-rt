import {slideToggle} from "../../content";

export default function CMSLinks() {
  return (
    <div className="popup-buttons-container cms-links">
      <div className="popup-buttons-container-sublist" data-title="q4-cms-quick-links">
        <button className="link-list-toggle active" onClick={slideToggle}  data-toggle="cms-toggle-id-1"> 
          Quick CMS Links
          <span><i className="fa-solid fa-circle-chevron-down"></i></span>
        </button>
        <div className="links-container active" id="cms-toggle-id-1" style={{height: '63px'}}>
          <div className="p-4 links-container-inner">
            <div className="links is-3">
              <button className="button is-link" id="q4-site-login-button">Login</button>
            </div>
            <div className="links is-3">
              <button className="button is-link" id="q4-site-preview-button">Edit Preview</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}