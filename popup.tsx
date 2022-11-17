import { useState, useEffect } from "react"
import useLocalStorage from 'use-local-storage';

// CSS 
import './css/styles.css';
import './node_modules/@fortawesome/fontawesome-free/css/all.min.css';
import slist from '~.plasmo/utils/sort.js'

// Utility functions
import {getLists, createIndexArray} from "~.plasmo/utils/apiCalls";
import {modalFunctions} from "~.plasmo/utils/modal";
import {checkSite, loginEditButtons, groupLinks, groupAndSort, initDeleteOrModify, getCurrentTabLink} from "./content";
import Auth from '~.plasmo/utils/auth';

// Components
import CMSLinks from "~.plasmo/components/CMS/CMSLinks";
import RenderLinks from "~.plasmo/components/RenderLinks";
import RenderSnippets from "~.plasmo/components/RenderSnippets";
import LoginForm from "~.plasmo/components/forms/LoginForm";
import Search from "~.plasmo/components/Search";
import ThemeToggleSwitch from "~.plasmo/components/ThemeToggleSwitch";
import FormCard from "~.plasmo/components/forms/FormCard";
import FormCardSnippet from "~.plasmo/components/forms/FormCardSnippet";

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
  const [localStorageData, setLocalStorageData] = useLocalStorage('localData', {});
  const [filterdData, setfilterdData] = useState(localStorageData?.links || []);
  const [filterdSnippetData, setfilterdSnippetData] = useState(localStorageData?.snippets || [])
  const [refresh, setRefresh] = useState<boolean>(false);
  const [refreshSession, setRefreshSession] = useLocalStorage('refreshSession', '');
  const [indexLinks, setIndexLinks] = useLocalStorage('indexLinks', []);
  const [indexSnippets, setIndexSnippets] = useLocalStorage('indexSnippets', []);

  const [errorMessage, setErrorMessage] = useState<string>('');

  const [linkID, setLinkID] = useState<string>('');
  const [snippetID, setSnippetID] = useState<string>('');

  const [formLinkDetails, setFormLinkDetails] = useState(formLinkData);
  const [formSnippetDetails, setFormSnippetDetails] = useState(formSnippetData);

  console.log(filterdData, filterdSnippetData, 'rendering');

  useEffect(() => {
    // Run modal helper funtions
    modalFunctions();
    checkSite();
    loginEditButtons();

    const el = (document.getElementById('theme-toggle-switch') as HTMLInputElement);
    if(theme === 'dark') {
      el.checked = true;
    }
    const links = document.querySelector(".popup-buttons-container.quick-links");
    const snippets = document.querySelector(".popup-buttons-container.quick-snippets");

    if(links) {
      slist(links, {
        parentCont: 'quick-links',
        setIndexLinks: setIndexLinks,
        setLocalStorageData: setLocalStorageData,
        localStorageData: localStorageData,
        setfilterdData: setfilterdData
      });
    }
    if(snippets) {
      slist(snippets, {
        parentCont: 'quick-snippets',
        setIndexSnippets: setIndexSnippets,
        setLocalStorageData: setLocalStorageData,
        localStorageData: localStorageData,
        setfilterdSnippetData: setfilterdSnippetData
      })
    }
  }, [])

  useEffect(() => {

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
        console.log(apiCategoryData, apiLinksData, apiSnippetData);
        if(Object.keys(apiLinksData).length && Object.keys(apiSnippetData).length) {
          setCategoryData(apiCategoryData);
          // const allLinks = groupLinks(apiCategoryData, apiLinksData, setfilterdData, 'links');
          // const allSnippets = groupLinks(apiCategoryData, apiSnippetData, setfilterdSnippetData, 'snippets');
          const allLinks = groupAndSort(apiCategoryData, apiLinksData, indexLinks, setIndexLinks);
          const allSnippets = groupAndSort(apiCategoryData, apiSnippetData, indexSnippets, setIndexSnippets);
          console.log(allLinks, allSnippets);
          const localData = {
            categories: apiCategoryData,
            links: allLinks,
            snippets: allSnippets
          }
          setLocalStorageData(localData);
          setfilterdData(allLinks) 
          setfilterdSnippetData(allSnippets);
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
        setRefresh(false);
      }
    })();
  }, [refresh])

  useEffect(() => {
    const errContainers = document.querySelectorAll<HTMLElement>('.error-message-container');
    if(errorMessage.length) {
      for(let errConts of errContainers) {
        errConts.classList.add('show');
      }
    } else {
      for(let errConts of errContainers) {
        errConts.classList.remove('show');
      }
    }
  }, [errorMessage])

  useEffect(() => {
    if(!Object.keys(filterdData).length && !Object.keys(filterdSnippetData).length) {
      setErrorMessage('Sorry! No results found...')
    } else {
      setErrorMessage('');
    }
  }, [filterdData, filterdSnippetData]);


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

  function handleClear(e, type) {
    e.preventDefault();
    const inputEl = e.target.previousSibling;
    const inp = inputEl.name;
    switch (type) {
      case 'links':
        setFormLinkDetails({
          ...formLinkDetails,
          [inp]: ''
        })
        break;
      case 'snippets':
        setFormSnippetDetails({
          ...formSnippetDetails,
          [inp]: ''
        })
        break;
      case 'search':
        const ev = new KeyboardEvent("keyup", {
          'keyCode': 8,
          'bubbles': true
        });
        console.log(ev);
        inputEl.value = '';
        inputEl.dispatchEvent(ev);
        break;
    }
  }

  const closeErrorModal = (e) => {
    e.preventDefault();
    const _t = e.target;
    const match = _t.matches('button[title="delete"]');
    if(!match) return;

    const parentEl = _t.parentElement as HTMLElement;
    parentEl.classList.remove()
  }


  return (
    <div className="root-container" data-theme={theme}>
      <div className="popup-container">
        <div className="popup-title-container">
          <h2 className="has-text-weight-bold is-flex-grow-1">ClipMe.<span id="q4-site-verification"></span></h2>
          <span className="theme-toggle">
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
              {/* <p>Please login → </p> */}
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
         handleClear={handleClear}
         ></Search>
        <div className="error-message-container">
          <p>{errorMessage}</p>
          <button 
          title="delete" 
          className="delete has-background-danger"
          onClick={e => setErrorMessage('')}
          ></button>
        </div>
        <CMSLinks></CMSLinks>
        <div className="content-container">
          <RenderLinks 
            filterdData={filterdData}
            setErrorMessage={setErrorMessage}
            formLinkDetails={formLinkDetails}
            setFormLinkDetails={setFormLinkDetails}
            setLinkID={setLinkID}
            setRefresh={setRefresh}
            ></RenderLinks>
        </div>
        <div className="content-container">
          <RenderSnippets
            filterdData={filterdSnippetData}
            setErrorMessage={setErrorMessage}
            setSnippetID={setSnippetID}
            formSnippetDetails={formSnippetDetails}
            setFormSnippetDetails={setFormSnippetDetails}
            setRefresh={setRefresh}
            ></RenderSnippets>
        </div>
        <FormCard 
        categoryData={categoryData}
        setCategoryData={setCategoryData}
        formLinkDetails={formLinkDetails}
        setFormLinkDetails={setFormLinkDetails}
        setRefresh={setRefresh}
        linkID={linkID}
        handleClear={handleClear}
        ></FormCard>
      <FormCardSnippet
        categoryData={categoryData}
        setCategoryData={setCategoryData}
        formSnippetDetails={formSnippetDetails}
        setFormSnippetDetails={setFormSnippetDetails}
        snippetID={snippetID}
        setRefresh={setRefresh}
        handleClear={handleClear}
        ></FormCardSnippet>
      </div>
    </div>
  )
}

export default IndexPopup
