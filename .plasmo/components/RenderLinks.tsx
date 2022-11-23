import "../utils/slideToggle"

import Auth from "~.plasmo/utils/auth"

import {
  closeAllOptions,
  linkToggle,
  toggleAll,
  toggleOptions
} from "../../content"
import TriggerOptions from "./TriggerOptions"

function RenderLinks(props) {
  const isNotEmpty = props.filterdData.length
  return isNotEmpty ? (
    <>
      <h3 className="content-title">
        <span>Bookmarks</span>
        <span className="toggle-all-container">
          <button
            onClick={(e) => toggleAll(e, ".quick-links")}
            id="toggle-all-links"
            className="button"
            title="toggle">
            Toggle all
            <i className="fa-solid fa-arrow-down-wide-short"></i>
          </button>
        </span>
      </h3>
      <div className="popup-buttons-container quick-links">
        {props.filterdData.map((el, index) => (
          <div
            key={index}
            data-index={el.index}
            data-category={el.name}
            className="popup-buttons-container-sublist"
            data-title="quick-links">
            <button
              onClick={linkToggle}
              data-toggle={`toggle-id-${index}`}
              className="link-list-toggle">
              {el.name}
              <span>
                <i className="fa-regular fa-circle-down"></i>
              </span>
            </button>
            <div
              className="links-container"
              id={`toggle-id-${index}`}
              style={{ display: "none" }}>
              <div className="links-container-inner">
                {el.list.map((item, ind) => (
                  <div key={ind} className="links is-3">
                    <a
                      className="button is-link"
                      title={item.name}
                      target="_blank"
                      data-id={item.id}
                      href={item.url}>
                      {item.name}
                      {Auth.loggedIn() ? (
                        <button
                          title="options-trigger"
                          className="options-trigger"
                          onClick={toggleOptions}>
                          <i className="fa-solid fa-bars"></i>
                          <i className="fa-solid fa-xmark"></i>
                        </button>
                      ) : (
                        <></>
                      )}
                    </a>
                    <TriggerOptions
                      setErrorMessage={props.setErrorMessage}
                      setRefresh={props.setRefresh}
                      setFormLinkDetails={props.setFormLinkDetails}
                      setLinkID={props.setLinkID}
                      item={item}
                      data={{
                        id: item.id,
                        collection: "websites",
                        formModalID: "add-options-modal",
                        formModalTitle: "#add-options-modal .modal-card-title",
                        formModalButton:
                          '#add-options-modal button[type="submit"]',
                        formModalOption: "update",
                        formModalHeaderTitle: "Update Link",
                        formModalButtonText: "Update",
                        deleteMsg: "Link has been deleted successfully!"
                      }}></TriggerOptions>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  ) : (
    <></>
  )
}

export default RenderLinks
