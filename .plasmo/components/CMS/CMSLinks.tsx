import '../../utils/slideToggle';
import { linkToggle } from "../../../content";

export default function CMSLinks() {
  return (
    <div className="popup-buttons-container cms-links">
      <div className="popup-buttons-container-sublist" data-title="q4-cms-quick-links">
        <button className="link-list-toggle active" onClick={linkToggle}  data-toggle="cms-toggle-id-1"> 
          Quick CMS Links
          <span><i className="fa-regular fa-circle-down"></i></span>
        </button>
        <div className="links-container active" id="cms-toggle-id-1">
          <div className="links-container-inner">
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