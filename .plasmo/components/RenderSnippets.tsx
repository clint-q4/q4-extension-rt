import { link } from "fs";
import {useEffect, useState} from "react";
import '../utils/slideToggle';
import { linkToggle } from "../../content";
import {deleteLinks, getSingleRecord} from '../utils/apiCalls';
import MainEditor from "./CodeEditor";
// import CodeMirrorEditor from "./CodeMirrorEditor";

function RenderSnippets(props) {
  const isNotEmpty = Object.keys(props.filterdData).length;
  
  async function triggerUpdateLinks(e) {
    e.preventDefault();
    console.log(e);
    let _t = e.target;
    const match = _t.matches('.update-links-container');
    match ? _t : _t = _t.parentNode;
    const catEl = _t.previousSibling;
    console.log(catEl);
    if(catEl.matches('a.button')) {
      const linkID = catEl.dataset.id;
      props.setLinkID(linkID);
      const linkData = await getSingleRecord('websites', linkID)
      if(linkData) {
        const formModal = document.getElementById('add-options-modal');
        formModal.classList.add('is-active');
        formModal.click();
        const formModalTitle = document.querySelector('#add-options-modal .modal-card-title');
        const formModalButton = document.querySelector('#add-options-modal button[type="submit"]');
        formModal.dataset.option = 'update';
        formModalTitle.textContent = 'Update Link';
        formModalButton.textContent = 'Update';

        // document.getElementById('add-options-button').click();
        props.setFormLinkDetails({
          name: linkData.name,
          url: linkData.url,
          category: linkData.category
        })
      }
    }
  }

  async function triggerDeleteLinks(e) {
    e.preventDefault();
    e.stopPropagation() 
    let _t = e.target;
    const match = _t.matches('.delete-links-container');
    match ? _t : _t = _t.parentNode;
    const catEl = _t.previousSibling.previousSibling;
    console.log(_t);
    if(catEl.matches('a.button')) {
      const linkID = catEl.dataset.id;
      console.log(linkID);
      const response = await deleteLinks(linkID)
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
    // console.log(_t.dataset.id);
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
          <button id="toggle-all-snippets" title="toggle">
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
                      <span onClick={triggerUpdateLinks} className="update-links-container">
                      <i className="fa-solid fa-pen-to-square"></i>
                      </span>
                      <span onClick={triggerDeleteLinks} className="delete-links-container">
                        <i className="fa-regular fa-trash-can"></i>
                      </span>
                    </div>
                  </div>
                  <div className="snippet-container" data-id={item.id} style={{display: 'none'}}>
                  <MainEditor
                    // formSnippetDetails={item}
                    // setFormSnippetDetails={props.setFormSnippetDetails}
                    snippet={item.snippet}
                    ></MainEditor>
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