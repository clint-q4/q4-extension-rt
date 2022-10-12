import {useEffect} from "react";
import { slideToggle } from "../../content";

function RenderLinks({filterdData}) {

  // useEffect(() => {
  // })

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
                  <a className="button is-link" target="_blank" href={item.url}>{item.name}</a>
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