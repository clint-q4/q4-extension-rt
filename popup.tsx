import { useState, useEffect } from "react"
import { useStorage } from "@plasmohq/storage";
import useLocalStorage from 'use-local-storage';

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
import ThemeToggleSwitch from "~.plasmo/components/ThemeToggleSwitch";
import FormCard from "~.plasmo/components/FormCard";
import FormCardSnippet from "~.plasmo/components/FormCardSnippet";

// form validation
const formLinkData = {
  name: "",
  url: "",
  category: ""
}

const formSnippetData = {
  name: "",
  snippet: "",
  notes: "",
  url: "",
  category: ""
}


function IndexPopup() {
  const [categoryData, setCategoryData] = useState<{[key: string]: any}>([]);
  const [linksData, setLinksData] = useState<{[key: string]: any}>([]);
  const [snippetData, setSnippetData] = useState<{[key: string]: any}>([]);
  const [filterdData, setfilterdData] = useState<{[key: string]: any}>({});
  const [filterdSnippetData, setfilterdSnippetData] = useState<{[key: string]: any}>({});
  const [errorMessage, setErrorMessage] = useState<string>('');
  const defaultDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const [theme, setTheme] = useLocalStorage('theme', defaultDark ? 'dark' : 'light');
  const [linkID, setLinkID] = useState<string>('');
  const [formLinkDetails, setFormLinkDetails] = useState(formLinkData);
  const [formSnippetDetails, setFormSnippetDetails] = useState(formSnippetData);

  useEffect(() => {
    // Run modal helper funtions
    modalFunctions();
    checkSite();
    loginEditButtons();

    const el = (document.getElementById('theme-toggle-switch') as HTMLInputElement);
    console.log(el);
    if(theme === 'dark') {
      el.checked = true;
    }

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
    groupLinks(categoryData, linksData, setfilterdData, 'links');
    groupLinks(categoryData, snippetData, setfilterdSnippetData, 'snippets');
    console.log(filterdSnippetData);
  }, [categoryData, linksData])


  return (
    <div className="root-container" data-theme={theme}>
      <div className="popup-container">
        <div className="popup-title-container">
          <h2 className="has-text-weight-bold is-flex-grow-1">ClipMe.<span id="q4-site-verification"></span></h2>
          <span className="theme-toggle">
            {/* <button onClick={switchMode} title="Toggle Theme" className="theme-toggle-button">
              <i className="fa-regular fa-circle"></i>
              <i className="fa-solid fa-circle" style={{display: 'none'}}></i>
            </button> */}
            <ThemeToggleSwitch
              theme={theme}
              setTheme={setTheme}
            ></ThemeToggleSwitch>
          </span>
          <LoginForm></LoginForm>
        </div>
        <Search 
         filterdData={filterdData}
         setfilterdData={setfilterdData}
         filterdSnippetData={filterdSnippetData}
         setfilterdSnippetData={setfilterdSnippetData}
         ></Search>
        <CMSLinks></CMSLinks>
        <div className="content-container">
          <RenderLinks 
            filterdData={filterdData}
            setErrorMessage={setErrorMessage}
            formLinkDetails={formLinkDetails}
            setFormLinkDetails={setFormLinkDetails}
            setLinkID={setLinkID}
            ></RenderLinks>
        </div>
        <div className="content-container">
          <RenderSnippets
            filterdData={filterdSnippetData}
            setErrorMessage={setErrorMessage}
            ></RenderSnippets>
        </div>
        <FormCard 
        categoryData={categoryData}
        setCategoryData={setCategoryData}
        formLinkDetails={formLinkDetails}
        setFormLinkDetails={setFormLinkDetails}
        linkID={linkID}
        ></FormCard>
      <FormCardSnippet
        categoryData={categoryData}
        setCategoryData={setCategoryData}
        formSnippetDetails={formSnippetDetails}
        setFormSnippetDetails={setFormSnippetDetails}
        linkID={linkID}
        ></FormCardSnippet>
        <div className="error-message-container">
          <p>{errorMessage}</p>
        </div>
      </div>
    </div>
  )
}

export default IndexPopup
