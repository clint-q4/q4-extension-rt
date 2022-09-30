import {linkToggle} from "../../content";
import {useEffect} from "react";

function RenderLinks({filterdData}) {

  useEffect(() => {
    linkToggle('.quick-links');
  })

  return (
    <div className="popup-buttons-container quick-links">
      {Object.keys(filterdData).map((key, index) => (
        <div key={index} className="popup-buttons-container-sublist" data-title="quick-links">
          <button className="link-list-toggle">
            <h3 className="is-size-4 p-3">{key}</h3>
          </button>
          <div className="links-container" style={{display:"none"}}>
            {filterdData[key].map((item, ind) => (
              <div key={ind} className="links is-3">
                <a className="button is-link" target="_blank" href={item.url}>{item.name}</a>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default RenderLinks;