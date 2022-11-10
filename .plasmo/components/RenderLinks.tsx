import '../utils/slideToggle';
import { linkToggle, toggleAll, toggleOptions, closeAllOptions } from "../../content";
import TriggerOptions from "./TriggerOptions";
import Auth from '~.plasmo/utils/auth';

function RenderLinks(props) {
  const isNotEmpty = Object.keys(props.filterdData).length;
  return (
    isNotEmpty ? 
    <>
      <h3 className="content-title">
        <span>
        Bookmarks
        </span>
        <span className="toggle-all-container">
          <button onClick={(e) => toggleAll(e, '.quick-links')} id="toggle-all-links" className="button" title="toggle">
            Toggle all
            <i className="fa-solid fa-arrow-down-wide-short"></i>
          </button>
        </span>
      </h3>
      <div className="popup-buttons-container quick-links">
        {Object.keys(props.filterdData).map((key, index) => (
          <div key={index} className="popup-buttons-container-sublist" data-title="quick-links">
            <button onClick={linkToggle} data-toggle={`toggle-id-${index}`} className="link-list-toggle">
              {key}
              <span><i className="fa-regular fa-circle-down"></i></span>
            </button>
            <div className="links-container" id={`toggle-id-${index}`} style={{display: 'none'}}>
              <div className="links-container-inner">
                {props.filterdData[key].map((item, ind) => (
                  <div key={ind} className="links is-3">
                    <a className="button is-link" target="_blank" data-id={item.id} href={item.url}>{item.name}
                    {
                      Auth.loggedIn() ? 
                      <button title="options-trigger" className="options-trigger" onClick={toggleOptions}>
                      <i className="fa-solid fa-bars"></i>
                      <i className="fa-solid fa-xmark"></i>
                      </button> : <></>
                    }
                    </a>
                    <TriggerOptions
                        setErrorMessage={props.setErrorMessage}
                        setRefresh={props.setRefresh}
                        setFormLinkDetails={props.setFormLinkDetails}
                        setLinkID={props.setLinkID}
                        item={item}
                        data={{
                          id: item.id,
                          collection: 'websites',
                          formModalID: 'add-options-modal',
                          formModalTitle: '#add-options-modal .modal-card-title',
                          formModalButton: '#add-options-modal button[type="submit"]',
                          formModalOption: 'update',
                          formModalHeaderTitle: 'Update Link',
                          formModalButtonText: 'Update',
                          deleteMsg: 'Link has been deleted successfully!',
                        }}
                      >
                    </TriggerOptions>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </> : <></>
  )
}

export default RenderLinks;