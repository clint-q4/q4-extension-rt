import { useState, useEffect } from "react"
import { useStorage } from "@plasmohq/storage";
import {modalFunctions} from "~.plasmo/utils/modal";
import RenderLinks from "~.plasmo/components/RenderLinks";
import {checkSite, loginEditButtons} from "./content";
import axios from 'axios';
import 'bulma/css/bulma.min.css';
import './Style.css';

const apiDomain = 'http://127.0.0.1:8090';

function IndexPopup() {
  const [categoryData, setCatgeoryData] = useState<{[key: string]: any}>([]);
  const [linksData, setLinksData] = useState<{[key: string]: any}>([]);
  const [filterdData, setfilterdData] = useState<{[key: string]: any}>({});
  useEffect(() => {
    // Run modal helper funtions
    modalFunctions();
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
        const group = (groups[categoryData.find(c => c.id === item.categories).name] || []);
        group.push(item);
        groups[categoryData.find(c => c.id === item.categories).name] = group;
        return groups;
      }, {});
      setfilterdData(groupedData);
    }
    // const localCategories = JSON.parse(localStorage.getItem('categoriesData'));
    // const localLinks = JSON.parse(localStorage.getItem('linksData'));
  }, [categoryData, linksData])
  useEffect(() => {
    checkSite();
    loginEditButtons();
  })
  return (
    <div className="popup-container py-3 px-5">
    <div className="popup-title-container">
      <h2 className="is-size-2 has-text-weight-bold mb-2 has-text-centered">Site: <span id="q4-site-verification"></span></h2>
    </div>
    <div className="popup-buttons-container">
      <div className="popup-buttons-container-sublist" data-title="q4-cms-quick-links">
        <h3 className="is-size-4 my-3">Quick CMS Links</h3>
        <div className="buttons-container is-flex">
          <div className="buttons is-flex is-3">
            <button className="button is-link" id="q4-site-login-button">Login</button>
          </div>
          <div className="button-container">
            <button className="button is-link" id="q4-site-preview-button">Edit Preview</button>
          </div>
        </div>
      </div>
    </div>
    <RenderLinks filterdData={filterdData}></RenderLinks>
  </div>
  )
}

export default IndexPopup
