import { useState, useEffect } from "react"
import { useStorage } from "@plasmohq/storage";

// CSS 
import './css/styles.css';
import './node_modules/@fortawesome/fontawesome-free/css/all.min.css';

// Utility functions
import {getLists} from "~.plasmo/utils/apiCalls";
import fetchData from "~.plasmo/utils/fetchData";
import {modalFunctions} from "~.plasmo/utils/modal";
import {checkSite, loginEditButtons, groupLinks} from "./content";

// Components
import CMSLinks from "~.plasmo/components/CMSLinks";
import RenderLinks from "~.plasmo/components/RenderLinks";
import LoginForm from "~.plasmo/components/LoginForm";
import Search from "~.plasmo/components/Search";


// const apiCategoryData = fetchData(apiLinks.categoriesLink);
// const apiLinksData = fetchData(apiLinks.categoriesLink);


function IndexPopup() {
  const [categoryData, setCategoryData] = useState<{[key: string]: any}>([]);
  const [linksData, setLinksData] = useState<{[key: string]: any}>([]);
  const [filterdData, setfilterdData] = useState<{[key: string]: any}>({});
  useEffect(() => {
    // Run modal helper funtions
    modalFunctions();
    checkSite();
    loginEditButtons();

    (async function fetchData() {
      const apiCategoryData = await getLists('category');
      const apiLinksData = await getLists('websites');
      setCategoryData(apiCategoryData);
      setLinksData(apiLinksData);
    })();
  }, [])

  useEffect(() => {
    groupLinks(categoryData, linksData, setfilterdData);
  }, [categoryData, linksData])

  return (
    <div className="root-container">
      <div className="popup-container">
        <div className="popup-title-container">
          <h2 className="is-size-4 has-text-weight-bold is-flex-grow-1">Site: <span id="q4-site-verification"></span></h2>
          <LoginForm></LoginForm>
        </div>
        <Search></Search>
        <CMSLinks></CMSLinks>
        <RenderLinks filterdData={filterdData}></RenderLinks>
      </div>
    </div>
  )
}

export default IndexPopup
