import { useState, useEffect } from "react"
import useLocalStorage from 'use-local-storage';

// CSS 
import './css/styles.css';
import './node_modules/@fortawesome/fontawesome-free/css/all.min.css';

// Utility functions
import {getLists} from "~.plasmo/utils/apiCalls";
import fetchData from "~.plasmo/utils/fetchData";
import {modalFunctions} from "~.plasmo/utils/modal";
import {checkSite, loginEditButtons, groupLinks, initDeleteOrModify, getCurrentTabLink} from "./content";
import Auth from '~.plasmo/utils/auth';

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
  const defaultDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const [theme, setTheme] = useLocalStorage('theme', defaultDark ? 'dark' : 'light');

  const [categoryData, setCategoryData] = useLocalStorage('categories', []);
  const [filterdData, setfilterdData] = useLocalStorage('links', {});
  const [filterdSnippetData, setfilterdSnippetData] = useLocalStorage('snippets', {})
  const [refresh, setRefresh] = useState<boolean>(false);
  const [refreshSession, setRefreshSession] = useLocalStorage('refreshSession', '');

  const [errorMessage, setErrorMessage] = useState<string>('');

  const [linkID, setLinkID] = useState<string>('');
  const [snippetID, setSnippetID] = useState<string>('');

  const [formLinkDetails, setFormLinkDetails] = useState(formLinkData);
  const [formSnippetDetails, setFormSnippetDetails] = useState(formSnippetData);

  useEffect(() => {
    // Run modal helper funtions
    modalFunctions();
    checkSite();
    loginEditButtons();

    const el = (document.getElementById('theme-toggle-switch') as HTMLInputElement);
    if(theme === 'dark') {
      el.checked = true;
    }

    (async function fetchData() {
      console.log('fetching');
      const sessDate = new Date(refreshSession);
      const now = new Date();
      const HourDiff = (endDate, startDate) => {
        const msInHour = 1000 * 60 * 60;
        return Math.round(Math.abs(endDate - startDate) / msInHour);
      }
      const diff = HourDiff(sessDate, now);
      const fetchData = async () => {
        const apiLinksData = await getLists('websites');
        const apiSnippetData = await getLists('snippets');
        const apiCategoryData = await getLists('category');
        if(Object.keys(apiLinksData).length && Object.keys(apiSnippetData).length) {
          setCategoryData(apiCategoryData);
          setfilterdData(groupLinks(apiCategoryData, apiLinksData, setfilterdData, 'links')) 
          setfilterdSnippetData(groupLinks(apiCategoryData, apiSnippetData, setfilterdSnippetData, 'snippets'));
          const sessionData = new Date().toLocaleString();
          setRefreshSession(sessionData);
        }
      }
      if(!Object.keys(filterdData).length && !Object.keys(filterdSnippetData).length) {
        fetchData();
        console.log('test 1')
      } else if(diff >= 24) {
        fetchData();
        console.log('test 2')
      } else if(refresh) {
        fetchData();
        console.log('test 3')
      }
    })();
  }, [refresh])


  function formCreateAction(e) {
    const _t = e.target;
    const id = _t.getAttribute('id');
    let form = '';
    id === 'add-snippet-button' ? form = 'Snippet' : form = 'Link';
    const targetId = _t.dataset.target;
    const target = document.getElementById(targetId);
    target.classList.add('is-active');
    target.querySelector('.modal-card-title').textContent = `Create new ${form}`;
    target.querySelector('button[type=submit]').textContent = `Submit`;
    form === 'Snippet' ? 
      getCurrentTabLink(formSnippetDetails, setFormSnippetDetails) :
      getCurrentTabLink(formLinkDetails, setFormLinkDetails)
  }


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
            {Auth.loggedIn() ? (
            <div className="is-flex is-align-items-center">
              <button 
                title="add-snippet" 
                className="button" 
                id="add-snippet-button" 
                data-target="add-snippet-modal"
                onClick={formCreateAction}
                >
                <i className="fa-solid fa-code"></i>
              </button>
              <button 
                title="add-link" 
                className="button"
                id="add-options-button" 
                data-target="add-options-modal"
                onClick={formCreateAction}
                >
                <i className="fa-solid fa-link"></i>
              </button>
            </div>
          ) : (
            <div className="is-flex is-align-items-center mr-5">
              <p>Please login → </p>
            </div>
          )}
          <LoginForm
            setRefresh={setRefresh}
          ></LoginForm>
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
            setSnippetID={setSnippetID}
            formSnippetDetails={formSnippetDetails}
            setFormSnippetDetails={setFormSnippetDetails}
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
        snippetID={snippetID}
        ></FormCardSnippet>
        <div className="error-message-container">
          <p>{errorMessage}</p>
        </div>
      </div>
    </div>
  )
}

export default IndexPopup
