import { useState, useEffect } from "react"
import { useStorage } from "@plasmohq/storage";
import {modalFunctions} from "~.plasmo/utils/modal";
import RenderLinks from "~.plasmo/components/RenderLinks";
import {checkSite, loginEditButtons} from "./content";
import axios from 'axios';
import './css/styles.css';
import {linkToggle} from "./content";
import LoginForm from "~.plasmo/components/LoginForm";
import getSuspender from "~.plasmo/utils/getSuspender";
import fetchData from "~.plasmo/utils/fetchData";
import './node_modules/@fortawesome/fontawesome-free/css/all.min.css';
import apiLinks from "~.plasmo/utils/apiLinks";
import apiCalls from "~.plasmo/utils/apiCalls";
// import './Style.css';

    // Fetch categoryData
// const apiCategoryData = async function(url) {
//   const categoryData = await axios.get(apiDomain + url)
//     .then(response => {
//       const strData = JSON.stringify(response.data.items);
//       if(strData) {
//         localStorage.setItem('categoriesData', strData);
//       }
//       // setCatgeoryData(response.data.items);
//       return strData;
//     });
//     return categoryData;
// }

const apiCategoryData = fetchData('/api/collections/category/records');
const apiLinksData = fetchData('/api/collections/websites/records');

// const apiCategoryData = fetchData(apiLinks.categoriesLink);
// const apiLinksData = fetchData(apiLinks.categoriesLink);


function IndexPopup() {
  const [categoryData, setCategoryData] = useState(apiCategoryData.read());
  const [linksData, setLinksData] = useState(apiLinksData.read());
  const [filterdData, setfilterdData] = useState<{[key: string]: any}>({});
  useEffect(() => {
    // Run modal helper funtions
    modalFunctions();
    checkSite();
    loginEditButtons();
    linkToggle('.cms-links');
    // linkToggle('.quick-links');

    (async function fetchData() {
      const apiCategoryData = await apiCalls('category');
      const apiLinksData = await apiCalls('websites');
      setCategoryData(apiCategoryData);
      setLinksData(apiLinksData);
    })();
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
      // linkToggle('.quick-links');
    }
    // const localCategories = JSON.parse(localStorage.getItem('categoriesData'));
    // const localLinks = JSON.parse(localStorage.getItem('linksData'));
  }, [categoryData, linksData])

  return (
    <div className="root-container">
      <div className="popup-container">
        <div className="popup-title-container">
          <h2 className="is-size-4 has-text-weight-bold has-text-centered">Site: <span id="q4-site-verification"></span></h2>
          <LoginForm></LoginForm>
        </div>
        <div className="field is-grouped popup-search-container">
          <p className="control is-expanded">
            <input className="input" type="text" placeholder="Seach away..." />
          </p>
          <p className="control">
            <a className="button is-info">
              Search
            </a>
          </p>
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
