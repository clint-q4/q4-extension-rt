import { linkToggle, toggleAll, toggleOptions, closeAllOptions } from "../../content";
import {deleteLinks, getSingleRecord} from '../utils/apiCalls';
import Auth from '~.plasmo/utils/auth';


function TriggerOptions(props) {

  async function triggerUpdateLinks(e, data) {
    e.preventDefault();
    const _t = e.target;
    const match = _t.matches('[title="Edit"]');
    if(!match) return;
    const parentCont = _t.parentElement.parentElement as HTMLElement;
    const parentSibling = (parentCont.previousSibling as HTMLElement).querySelector('.options-trigger');
    parentCont.classList.toggle("active")
    parentSibling.classList.toggle("active")
    parentCont.slideUp(0);
    const linkData = await getSingleRecord(data.collection, data.id)
    if(linkData) {
      const formModal = document.getElementById(data.formModalID);
      formModal.classList.add('is-active');
      const formModalTitle = document.querySelector(data.formModalTitle);
      const formModalButton = document.querySelector(data.formModalButton);
      formModal.dataset.option = data.formModalOption;
      formModalTitle.textContent = data.formModalHeaderTitle;
      formModalButton.textContent = data.formModalButtonText;

      if(data.collection === 'websites') {
        props.setLinkID(data.id);
        props.setFormLinkDetails({
          name: linkData.name,
          url: linkData.url,
          category: linkData.category
        })
      } else {
        props.setSnippetID(data.id);
        props.setFormSnippetDetails({
          name: linkData.name,
          url: linkData.url,
          snippet: linkData.snippet,
          category: linkData.category
        })
      }
    }
  }
  
  async function triggerDeleteLinks(e, data) {
    e.preventDefault();
    let _t = e.target;
    const match = _t.matches('[title="Delete"]') || _t.matches('span') || _t.matches('i');
    if(!match) return;
    const parentCont = _t.parentElement.parentElement as HTMLElement;
    const parentSibling = (parentCont.previousSibling as HTMLElement).querySelector('.options-trigger');
    parentCont.classList.toggle("active")
    parentSibling.classList.toggle("active")
    parentCont.slideUp(0);
    const linkID = data.id;
    const response = await deleteLinks(data.collection, linkID)
    if(response.message) {
      props.setErrorMessage(response.message);
      // props.setRefresh(true);
      setTimeout(function() {
        props.setRefresh(true);
      }, 500)
    } else {
      props.setErrorMessage('Sorry! Something went wrong');
    }
  }

  return (
    Auth.loggedIn() ? 
    <div className="button-options-container" style={{display: "none"}}>
      <div className="button-options update-links-container">
        <button 
          className="button" 
          title="Visibility"
          // onClick={(e) => triggerDeleteLinks(e, item.id)}
          >
            <span className="icon-container update-links-container">
              <i className="fa-solid fa-users" style={{display: 'none'}}></i>
              <i className="fa-solid fa-user-shield"></i>
            </span>
        </button>
        <button 
          className="button" 
          title="Edit"
          onClick={(e) => triggerUpdateLinks(e, props.data)}
          >
            <span className="icon-container update-links-container">
              <i className="fa-solid fa-pen-to-square"></i>
            </span>
        </button>
        <button 
          className="button" 
          title="Delete"
          onClick={(e) => triggerDeleteLinks(e,  props.data)}
          >
            <span className="icon-container update-links-container">
              <i className="fa-solid fa-trash-can"></i>
            </span>
        </button>
      </div>
    </div>
    : <></>
  )
}

export default TriggerOptions;


