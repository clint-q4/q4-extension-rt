import {useEffect, useState} from "react";
import { slideToggle } from "../../content";
import {deleteLinks, getSingleRecord} from '../utils/apiCalls'

function RenderLinks(props) {
  
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


  return (
    <div className="popup-buttons-container quick-links">
      {Object.keys(props.filterdData).map((key, index) => (
        <div key={index} className="popup-buttons-container-sublist" data-title="quick-links">
          <button onClick={slideToggle} data-toggle={`toggle-id-${index}`} className="link-list-toggle">
            {key}
            <span><i className="fa-solid fa-circle-chevron-down"></i></span>
          </button>
          <div className="links-container" id={`toggle-id-${index}`}>
            <div className="p-4 links-container-inner">
              {props.filterdData[key].map((item, ind) => (
                <div key={ind} className="links is-3">
                  <a className="button is-link" target="_blank" data-id={item.id} href={item.url}>{item.name}</a>
                  <span onClick={triggerUpdateLinks} className="update-links-container">
                    <i className="fa-solid fa-pen-to-square"></i>
                  </span>
                  <span onClick={triggerDeleteLinks} className="delete-links-container">
                    <i className="fa-regular fa-trash-can"></i>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default RenderLinks;