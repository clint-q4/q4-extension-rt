import {useEffect, useState} from "react";
import {deleteLinks, getSingleRecord} from '../utils/apiCalls';
import '../utils/slideToggle';
import { linkToggle, toggleAll, toggleOptions } from "../../content";

function RenderLinks(props) {
  const isNotEmpty = Object.keys(props.filterdData).length;

  async function triggerUpdateLinks(e, dataId) {
    e.preventDefault();
    console.log(e);
    const _t = e.target;
    // let _t = e.target;
    const match = _t.matches('[title="edit-button"]') || _t.matches('span') || _t.matches('i');
    // match ? _t : _t = _t.parentNode;
    // const catEl = _t.previousSibling.previousSibling;
    // console.log(catEl);
    if(match) {
      const linkID = dataId;
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

  async function triggerDeleteLinks(e, dataId) {
    e.preventDefault();
    e.stopPropagation() 
    let _t = e.target;
    const match = _t.matches('[title="delete-button"]') || _t.matches('span') || _t.matches('i');
    // match ? _t : _t = _t.parentNode;
    // const catEl = _t.previousSibling.previousSibling;
    // console.log(_t);
    if(match) {
      const linkID = dataId;
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

  

  console.log(props.filterdData);


  return (
    isNotEmpty ? 
    <>
      <h3 className="content-title">
        <span>
        Links
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
                    <span className="options-trigger" onClick={toggleOptions}>
                      <i className="fa-solid fa-bars"></i>
                      <i className="fa-solid fa-xmark"></i>
                      </span>
                    </a>
                    <div className="button-options-container" style={{display: "none"}}>
                      <div className="button-options update-links-container">
                        {/* <h3 className="options-title">
                          Option
                        </h3> */}
                        <button 
                          className="button" 
                          title="edit-button"
                          onClick={(e) => triggerUpdateLinks(e, item.id)}
                          >
                          Edit
                            <span className="icon-container update-links-container">
                              <i className="fa-solid fa-pen-to-square"></i>
                            </span>
                        </button>
                        <button 
                          className="button" 
                          title="delete-button"
                          onClick={(e) => triggerDeleteLinks(e, item.id)}
                          >
                          Delete
                            <span className="icon-container update-links-container">
                              <i className="fa-solid fa-trash-can"></i>
                            </span>
                        </button>
                      </div>
                    </div>
                    <span onClick={(e) => triggerUpdateLinks(e, item.id)} className="options-buttons update-links-container">
                      <i className="fa-solid fa-pen-to-square"></i>
                    </span>
                    <span onClick={(e) => triggerDeleteLinks(e, item.id)} className="options-buttons delete-links-container">
                      <i className="fa-regular fa-trash-can"></i>
                    </span>
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

export default RenderLinks;