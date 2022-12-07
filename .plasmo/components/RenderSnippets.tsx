// import "../utils/slideToggle"

import Auth from "~.plasmo/utils/auth"

import {
  closeAllOptions,
  linkToggle,
  toggleAll,
  toggleOptions
} from "../../content"
import TriggerOptions from "./TriggerOptions"
import CodeEditor from "./codeEditor/CodeEditor"

// import CodeMirrorEditor from "./CodeMirrorEditor";

function RenderSnippets(props) {
  console.log('rend-snip', props.filterdData);
  const isNotEmpty = props.filterdData.length

  function copySnippet(e) {
    e.preventDefault()
    let _t = e.target
    const match = _t.matches(".copy-icon")
    match ? _t : (_t = _t.parentNode)
    const id = _t.dataset.id
    ;(
      document.querySelector(
        `.snippet-container[data-id="${id}"] textarea`
      ) as HTMLInputElement
    ).select()
    document.execCommand("copy")
  }

  function snipToggle(e) {
    let _t = e.target
    let match = _t.matches(".snip-toggle-icon")
    match ? _t : (_t = _t.parentNode)
    if (_t.matches(".snip-toggle-icon")) {
      const id = _t.dataset.id
      _t.classList.toggle("active")
      closeAllOptions();
      const _el = document.querySelector(
        `.snippet-container[data-id="${id}"]`
      ) as HTMLElement;
      _el.classList.toggle("active");
      _el.slideToggle(300);
    }
  }

  return isNotEmpty ? (
    <>
      <h3 className="content-title">
        <span>Snippets</span>
        <span className="toggle-all-container">
          <button
            onClick={(e) => toggleAll(e, ".quick-snippets")}
            id="toggle-all-snippets"
            className="button toggle-all"
            title="toggle">
            Toggle all
            <i className="fa-solid fa-arrow-down-wide-short"></i>
          </button>
        </span>
      </h3>
      <div className="popup-buttons-container quick-snippets">
        {props.filterdData.map((el, index) => (
          <div
            key={index}
            data-index={el.index}
            data-category={el.name}
            className="popup-buttons-container-sublist"
            data-title="quick-links">
            <button
              onClick={linkToggle}
              data-toggle={`toggle-id-snip-${index}`}
              className="link-list-toggle">
              {el.name}
              <span>
                <i className="fa-solid fa-circle-chevron-down"></i>
              </span>
            </button>
            <div
              className="links-container"
              id={`toggle-id-snip-${index}`}
              style={{ display: "none" }}>
              <div className="links-container-inner">
                {el.list.map((item, ind) => (
                  <div key={ind} className="snippets is-3">
                    <div className="snippet-title-buttons">
                      <div className="snippet-title">
                        <p title={item.name} data-id={item.id}>
                          {item.name}
                        </p>
                      </div>
                      <div className="snippet-buttons">
                        <button
                          type="button"
                          title="copy-icon"
                          className="copy-icon button"
                          data-id={item.id}
                          onClick={copySnippet}>
                          <i className="fa-solid fa-copy"></i>
                        </button>
                        {item.url ? (
                          <a
                            title="link"
                            className="link-icon button"
                            href={item.url}
                            target="_blank">
                            <i className="fa-solid fa-up-right-from-square"></i>
                          </a>
                        ) : (
                          ""
                        )}
                        <button
                          type="button"
                          title="snip-toggle-icon"
                          className="snip-toggle-icon button"
                          data-id={item.id}
                          onClick={snipToggle}>
                          <i className="fa-solid fa-angles-down"></i>
                        </button>
                        {/* <span onClick={e => triggerUpdateLinks(e, item.id)} className="options-buttons update-links-container">
                      <i className="fa-solid fa-pen-to-square"></i>
                      </span>
                      <span onClick={e => triggerUpdateLinks(e, item.id)} className="options-buttons delete-links-container">
                        <i className="fa-regular fa-trash-can"></i>
                      </span> */}
                      </div>
                    </div>
                    <div
                      className="snippet-container"
                      data-id={item.id}
                      style={{ display: "none" }}>
                      {Auth.loggedIn() ? (
                        <button
                          title="options-trigger"
                          className="options-trigger"
                          onClick={toggleOptions}>
                          <i className="fa-solid fa-bars"></i>
                          <i className="fa-solid fa-xmark"></i>
                        </button>
                      ) : (
                        ""
                      )}
                      <CodeEditor
                        // formSnippetDetails={item}
                        // setFormSnippetDetails={props.setFormSnippetDetails}
                        snippet={item.snippet}></CodeEditor>
                    </div>
                    <TriggerOptions
                      setErrorMessage={props.setErrorMessage}
                      setRefresh={props.setRefresh}
                      setFormSnippetDetails={props.setFormSnippetDetails}
                      setSnippetID={props.setSnippetID}
                      item={item}
                      data={{
                        id: item.id,
                        collection: "snippets",
                        formModalID: "add-snippet-modal",
                        formModalTitle: "#add-snippet-modal .modal-card-title",
                        formModalButton:
                          '#add-snippet-modal button[type="submit"]',
                        formModalOption: "update",
                        formModalHeaderTitle: "Update Snippet",
                        formModalButtonText: "Update",
                        deleteMsg: "Snippet has been deleted successfully!"
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

export default RenderSnippets
