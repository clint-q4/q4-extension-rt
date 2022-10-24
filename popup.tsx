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
import RenderSnippets from "~.plasmo/components/RenderSnippets";
import LoginForm from "~.plasmo/components/LoginForm";
import Search from "~.plasmo/components/Search";


// const apiCategoryData = fetchData(apiLinks.categoriesLink);
// const apiLinksData = fetchData(apiLinks.categoriesLink);


function IndexPopup() {
  const [categoryData, setCategoryData] = useState<{[key: string]: any}>([]);
  const [linksData, setLinksData] = useState<{[key: string]: any}>([]);
  const [snippetData, setSnippetData] = useState<{[key: string]: any}>([]);
  const [filterdData, setfilterdData] = useState<{[key: string]: any}>({});
  const [filterdSnippetData, setfilterdSnippetData] = useState<{[key: string]: any}>({});
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    // Run modal helper funtions
    modalFunctions();
    checkSite();
    loginEditButtons();

    (async function fetchData() {
      const apiCategoryData = await getLists('category');
      const apiLinksData = await getLists('websites');
      const snippetData = await getLists('snippets');
      setCategoryData(apiCategoryData);
      setLinksData(apiLinksData);
      setSnippetData(snippetData);
    })();
  }, [])

  useEffect(() => {
    groupLinks(categoryData, linksData, setfilterdData);
    groupLinks(categoryData, snippetData, setfilterdSnippetData);
    console.log(filterdSnippetData);
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
        <div className="content-container">
          <h3>Links</h3>
          <RenderLinks 
            filterdData={filterdData}
            setErrorMessage={setErrorMessage}
            ></RenderLinks>
        </div>
        <div className="content-container">
          <h3>Snippets</h3>
        <RenderSnippets
          filterdData={filterdSnippetData}
          setErrorMessage={setErrorMessage}
          ></RenderSnippets>
        </div>
        <div className="error-message-container">
          <p>{errorMessage}</p>
        </div>
      </div>
    </div>
  )
}

export default IndexPopup
