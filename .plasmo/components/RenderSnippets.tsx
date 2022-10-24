import {useEffect, useState} from "react";
import { slideToggle } from "../../content";
import {deleteLinks, getSingleRecord} from '../utils/apiCalls';
import CodeEditor from "./CodeEditor";

function RenderSnippets(props) {
  
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


  return (
    <div className="popup-buttons-container quick-snippets">
      {Object.keys(props.filterdData).map((key, index) => (
        <div key={index} className="popup-buttons-container-sublist" data-title="quick-links">
          <button onClick={slideToggle} data-toggle={`toggle-id-snip-${index}`} className="link-list-toggle">
            {key}
            <span><i className="fa-solid fa-circle-chevron-down"></i></span>
          </button>
          <div className="links-container" id={`toggle-id-snip-${index}`}>
            <div className="p-4 links-container-inner">
              {props.filterdData[key].map((item, ind) => (
                <div key={ind} className="snippets is-3">
                  <div className="snippet-title">
                    <p data-id={item.id}>{item.name}</p>
                    <span className="copy-icon" data-id={item.id} onClick={copySnippet}>
                     <i className="fa-solid fa-copy"></i>
                    </span>
                  </div>
                  <div className="snippet-container" data-id={item.id}>
                  <CodeEditor
                    // formSnippetDetails={item}
                    // setFormSnippetDetails={props.setFormSnippetDetails}
                    snippet={item.snippet}
                    ></CodeEditor>
                  </div>
                  {/* <span onClick={triggerUpdateLinks} className="update-links-container">
                    <i className="fa-solid fa-pen-to-square"></i>
                  </span>
                  <span onClick={triggerDeleteLinks} className="delete-links-container">
                    <i className="fa-regular fa-trash-can"></i>
                  </span> */}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default RenderSnippets;