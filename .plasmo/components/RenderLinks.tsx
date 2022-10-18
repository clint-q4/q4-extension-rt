import {useEffect, useState} from "react";
import { slideToggle } from "../../content";
import {deleteLinks} from '../utils/apiCalls'

function RenderLinks({filterdData}) {
  const [errorMessage, setErrorMessage] = useState('');

  
  async function triggerUpdateLinks(e) {
    e.preventDefault();
    console.log(e);
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
        // categoryStatus.style.color = 'green';
        setErrorMessage('Link has been deleted successfully!');
        // getLists('category').then((list) => {
        //   console.log(list);
        //   props.setCategoryData(list);
        // });
      } else {
        const temp = 'Sorry! Something went wrong';
        setErrorMessage(temp);
        // categoryStatus.style.color = 'red';
      }
    }

  }


  return (
    <div className="popup-buttons-container quick-links">
      {Object.keys(filterdData).map((key, index) => (
        <div key={index} className="popup-buttons-container-sublist" data-title="quick-links">
          <button onClick={slideToggle} data-toggle={`toggle-id-${index}`} className="link-list-toggle">
            {key}
            <span><i className="fa-solid fa-circle-chevron-down"></i></span>
          </button>
          <div className="links-container" id={`toggle-id-${index}`}>
            <div className="p-4 links-container-inner">
              {filterdData[key].map((item, ind) => (
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