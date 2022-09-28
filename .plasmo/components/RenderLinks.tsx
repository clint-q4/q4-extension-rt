import {linkToggle} from "../../content";
import {useEffect} from "react";

function RenderLinks({filterdData}) {

  useEffect(() => {
    linkToggle();
  })

  return (
    <div className="popup-buttons-container">
      {Object.keys(filterdData).map((key, index) => (
        <div key={index} className="popup-buttons-container-sublist" data-title="quick-links">
          <button className="link-list-toggle">
            <h3 className="is-size-4 my-3">{key}</h3>
          </button>
          <div className="links-container" style={{display:"none"}}>
            {filterdData[key].map((item, ind) => (
              <div key={ind} className="links is-3">
                <a href={item.url}>{item.name}</a>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default RenderLinks;