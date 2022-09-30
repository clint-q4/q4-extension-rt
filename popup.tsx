import { useState, useEffect } from "react"
import { useStorage } from "@plasmohq/storage";
import {modalFunctions} from "~.plasmo/utils/modal";
import RenderLinks from "~.plasmo/components/RenderLinks";
import {checkSite, loginEditButtons} from "./content";
import axios from 'axios';
import './css/styles.css';
import {linkToggle} from "./content";
// import './Style.css';

const apiDomain = 'http://127.0.0.1:8090';

function IndexPopup() {
  const [categoryData, setCatgeoryData] = useState<{[key: string]: any}>([]);
  const [linksData, setLinksData] = useState<{[key: string]: any}>([]);
  const [filterdData, setfilterdData] = useState<{[key: string]: any}>({});
  useEffect(() => {
    // Run modal helper funtions
    modalFunctions();
    checkSite();
    loginEditButtons();
    linkToggle('.cms-links');
    // Fetch categoryData
    axios.get(apiDomain + '/api/collections/category/records')
    .then(response => {
      const strData = JSON.stringify(response.data.items);
      if(strData) {
        localStorage.setItem('categoriesData', strData);
      }
      setCatgeoryData(response.data.items);
    });
    // Fetch LinksData
    axios.get(apiDomain + '/api/collections/websites/records')
    .then(response => {
      const strData = JSON.stringify(response.data.items);
      if(strData) {
        localStorage.setItem('linksData', strData);
      }
      console.log(response.data, 'data');
      setLinksData(response.data.items);
    });

  }, [])

  useEffect(() => {
    if(categoryData.length && linksData.length) {
      const groupedData = linksData.reduce((groups, item) => {
        const group = (groups[categoryData.find(c => c.id === item.category).name] || []);
        group.push(item);
        groups[categoryData.find(c => c.id === item.category).name] = group;
        return groups;
      }, {});
      setfilterdData(groupedData);
    }
    // const localCategories = JSON.parse(localStorage.getItem('categoriesData'));
    // const localLinks = JSON.parse(localStorage.getItem('linksData'));
  }, [categoryData, linksData])
  return (
    <div className="root-container">
      <div className="popup-container">
        <div className="popup-title-container">
          <h2 className="is-size-4 has-text-weight-bold has-text-centered">Site: <span id="q4-site-verification"></span></h2>
        </div>
        <div className="popup-buttons-container cms-links">
          <div className="popup-buttons-container-sublist" data-title="q4-cms-quick-links">
            <button className="link-list-toggle">
              <h3 className="is-size-4 p-3">Quick CMS Links</h3>
            </button>
            <div className="links-container">
              <div className="links is-3">
                <button className="button is-link" id="q4-site-login-button">Login</button>
              </div>
              <div className="links is-3">
                <button className="button is-link" id="q4-site-preview-button">Edit Preview</button>
              </div>
            </div>
          </div>
        </div>
        <RenderLinks filterdData={filterdData}></RenderLinks>
      </div>
    </div>
  )
}

export default IndexPopup
