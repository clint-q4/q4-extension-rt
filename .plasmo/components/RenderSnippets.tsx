import { link } from "fs";
import {useEffect, useState} from "react";
import '../utils/slideToggle';
import { linkToggle, toggleAll, toggleOptions, closeAllOptions } from "../../content";
import {deleteLinks, getSingleRecord} from '../utils/apiCalls';
import CodeEditor from "./CodeEditor";
// import CodeMirrorEditor from "./CodeMirrorEditor";

function RenderSnippets(props) {
  const isNotEmpty = Object.keys(props.filterdData).length;
  
  async function triggerUpdateLinks(e, dataId) {
    e.preventDefault();
    console.log(e);
    const _t = e.target;
    const match = _t.matches('[title="Edit"]') || _t.matches('span') || _t.matches('i');
    if(match) {
      props.setSnippetID(dataId);
      const linkData = await getSingleRecord('snippets', dataId)
      if(linkData) {
        console.log('lindata',linkData);
        const formModal = document.getElementById('add-snippet-modal');
        formModal.classList.add('is-active');
        formModal.click();
        const formModalTitle = document.querySelector('#add-options-modal .modal-card-title');
        const formModalButton = document.querySelector('#add-options-modal button[type="submit"]');
        formModal.dataset.option = 'update';
        formModalTitle.textContent = 'Update Link';
        formModalButton.textContent = 'Update';

        // document.getElementById('add-options-button').click();
        props.setFormSnippetDetails({
          name: linkData.name,
          url: linkData.url,
          snippet: linkData.snippet,
          category: linkData.category
        })
      }
    }
  }

  async function triggerDeleteSnippets(e, dataID) {
    e.preventDefault();
    let _t = e.target;
    console.log(_t);
    const match = _t.matches('[title="Delete"]') || _t.matches('span') || _t.matches('i');
    if(match) {
      const response = await deleteLinks('snippets', dataID)
      if(response) {
        console.log(response);
        props.setErrorMessage('Link has been deleted successfully!');
        setTimeout(function () {
          window.location.reload();
        }, 500)
      } else {
        const temp = 'Sorry! Something went wrong';
        props.setErrorMessage(temp);
        // categoryStatus.style.color = 'red';
      }
    }

  }

  function copySnippet(e) {
    e.preventDefault();
    let _t = e.target;
    const match = _t.matches('.copy-icon');
    match ? _t : _t = _t.parentNode;
    console.log(_t);
    const id = _t.dataset.id;
    // console.log(_t.parentElement.nextSibling);
    (document.querySelector(`.snippet-container[data-id="${id}"] textarea`) as HTMLInputElement).select();
    document.execCommand('copy');
  }

  function snipToggle(e) {
    let _t = e.target;
    let match = _t.matches('.snip-toggle-icon');
    match ? _t : _t = _t.parentNode;
    if(_t.matches('.snip-toggle-icon')) {
      const id = _t.dataset.id;
      _t.classList.toggle('active');
      closeAllOptions();
      (document.querySelector(`.snippet-container[data-id="${id}"]`) as HTMLInputElement).slideToggle(300);
    }
  }

  return (
    isNotEmpty ? 
    <>
    <h3 className="content-title">
      <span>
      Snippets
      </span>
      <span className="toggle-all-container">
          <button onClick={(e) => toggleAll(e, '.quick-snippets')} id="toggle-all-snippets" className="button" title="toggle">
            Toggle all
            <i className="fa-solid fa-arrow-down-wide-short"></i>
          </button>
        </span>
    </h3>
    <div className="popup-buttons-container quick-snippets">
      {Object.keys(props.filterdData).map((key, index) => (
        <div key={index} className="popup-buttons-container-sublist" data-title="quick-links">
          <button onClick={linkToggle} data-toggle={`toggle-id-snip-${index}`} className="link-list-toggle">
            {key}
            <span><i className="fa-regular fa-circle-down"></i></span>
          </button>
          <div className="links-container" id={`toggle-id-snip-${index}`} style={{display: 'none'}}>
            <div className="p-4 links-container-inner">
              {props.filterdData[key].map((item, ind) => (
                <div key={ind} className="snippets is-3">
                  <div className="snippet-title-buttons">
                    <div className="snippet-title">
                      <p data-id={item.id}>{item.name}</p>
                    </div>
                    <div className="snippet-buttons">
                      <span className="copy-icon" data-id={item.id} onClick={copySnippet}>
                      <i className="fa-solid fa-copy"></i>
                      </span>
                      {item.url ? 
                        <a title="link" className="link-icon" href={item.url} target="_blank">
                          <i className="fa-solid fa-up-right-from-square"></i>
                        </a> :
                        ''}
                      <span className="snip-toggle-icon" data-id={item.id} onClick={snipToggle}>
                        <i className="fa-solid fa-angles-down"></i>
                      </span>
                      <span onClick={e => triggerUpdateLinks(e, item.id)} className="options-buttons update-links-container">
                      <i className="fa-solid fa-pen-to-square"></i>
                      </span>
                      <span onClick={e => triggerUpdateLinks(e, item.id)} className="options-buttons delete-links-container">
                        <i className="fa-regular fa-trash-can"></i>
                      </span>
                    </div>
                  </div>
                  <div className="snippet-container" data-id={item.id} style={{display: 'none'}}>
                    <button title="trigger-options" className="options-trigger" onClick={toggleOptions}>
                      <i className="fa-solid fa-bars"></i>
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                    <CodeEditor
                      // formSnippetDetails={item}
                      // setFormSnippetDetails={props.setFormSnippetDetails}
                      snippet={item.snippet}
                      ></CodeEditor>
                  </div>
                  <div className="button-options-container" style={{display: "none"}}>
                      <div className="button-options update-links-container">
                        {/* <h3 className="options-title">
                          Option
                        </h3> */}
                        <button 
                          className="button" 
                          title="Visibility"
                          // onClick={(e) => triggerDeleteLinks(e, item.id)}
                          >
                          {/* Share */}
                            <span className="icon-container update-links-container">
                              <i className="fa-solid fa-users" style={{display: 'none'}}></i>
                              <i className="fa-solid fa-user-shield"></i>
                            </span>
                        </button>
                        <button 
                          className="button" 
                          title="Edit"
                          onClick={(e) => triggerUpdateLinks(e, item.id)}
                          >
                          {/* Edit */}
                            <span className="icon-container update-links-container">
                              <i className="fa-solid fa-pen-to-square"></i>
                            </span>
                        </button>
                        <button 
                          className="button" 
                          title="Delete"
                          onClick={(e) => triggerDeleteSnippets(e, item.id)}
                          >
                          {/* Delete */}
                            <span className="icon-container update-links-container">
                              <i className="fa-solid fa-trash-can"></i>
                            </span>
                        </button>
                      </div>
                    </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
    </> : ''
  )
}

export default RenderSnippets;