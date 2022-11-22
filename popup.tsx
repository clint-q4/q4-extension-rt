import { useState, useEffect } from "react"
import useLocalStorage from 'use-local-storage';

// CSS 
import './css/styles.css';
import './node_modules/@fortawesome/fontawesome-free/css/all.min.css';
import slist from '~.plasmo/utils/sort.js'

// Utility functions
import {getLists, createIndexArray, getIndexArray} from "~.plasmo/utils/apiCalls";
import {modalFunctions} from "~.plasmo/utils/modal";
import {fetchData, checkSite, loginEditButtons, getCurrentTabLink, getAndSetIndexArray} from "./content";
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

const HourDiff = (endDate, startDate) => {
  const msInHour = 1000 * 60 * 60;
  return Math.round(Math.abs(endDate - startDate) / msInHour);
}


function IndexPopup() {
  const defaultDark = window.matchMedia('(prefers-color-scheme: light)').matches;
  const [theme, setTheme] = useLocalStorage('theme', defaultDark ? 'dark' : 'light');

  const [categoryData, setCategoryData] = useLocalStorage('categories', []);
  const [localStorageData, setLocalStorageData] = useLocalStorage('localData', {});
  const [filterdData, setfilterdData] = useState(localStorageData['links'] || []);
  const [filterdSnippetData, setfilterdSnippetData] = useState(localStorageData['links'] || [])
  const [refresh, setRefresh] = useState<boolean>(false);
  const [refreshSession, setRefreshSession] = useLocalStorage('refreshSession', '');
  const [indexLinks, setIndexLinks] = useLocalStorage('indexLinks', []);
  const [indexSnippets, setIndexSnippets] = useLocalStorage('indexSnippets', []);

  const [errorMessage, setErrorMessage] = useState<string>('');

  const [linkID, setLinkID] = useState<string>('');
  const [snippetID, setSnippetID] = useState<string>('');

  const [formLinkDetails, setFormLinkDetails] = useState(formLinkData);
  const [formSnippetDetails, setFormSnippetDetails] = useState(formSnippetData);

  const fetchArgs = {
    getLists: getLists,
    setfilterdData: setfilterdData,
    setfilterdSnippetData: setfilterdSnippetData,
    setCategoryData: setCategoryData,
    setRefreshSession: setRefreshSession,
    setLocalStorageData: setLocalStorageData,
    indexLinks: indexLinks,
    indexSnippets: indexSnippets,
    setIndexLinks: setIndexLinks,
    setIndexSnippets: setIndexSnippets,
    createIndexArray: createIndexArray
  }

  useEffect(() => {
    if(localStorageData.hasOwnProperty('links')) {
      setfilterdData(localStorageData['links']);
    }
    if(localStorageData.hasOwnProperty('snippets')) {
      setfilterdSnippetData(localStorageData['snippets']);
    }

  }, [localStorageData])

  useEffect(() => {
    // Run modal/Q4 helper funtions
    modalFunctions();
    checkSite();
    loginEditButtons();

    // Theme toggle
    const el = (document.getElementById('theme-toggle-switch') as HTMLInputElement);
    if(theme === 'dark') {
      el.checked = true;
    }

    // fetch the order if it exist
    // if(!indexLinks.length || !indexSnippets.length) {
    //   getAndSetIndexArray({
    //     setIndexLinks: setIndexLinks,
    //     setIndexSnippets: setIndexSnippets,
    //   })
    // }

    // Fetch data of the localstorage is empty
    if(!localStorageData || Object.keys(localStorageData).length === 0) {
      fetchData(fetchArgs);
    }

    // Fetch data if the session has expired
    const sessDate = new Date(refreshSession);
    const now = new Date();
    const diff = HourDiff(sessDate, now);
    if(diff >= 24) {
      fetchData(fetchArgs);
      setRefresh(false);
    }

    // get list container for drag and drop
    const links = document.querySelector(".popup-buttons-container.quick-links");
    const snippets = document.querySelector(".popup-buttons-container.quick-snippets");

    // if links or snippet exisit run drag and drop function
    if(links) {
      slist(links, {
        parentCont: 'quick-links',
        setIndexLinks: setIndexLinks,
        setLocalStorageData: setLocalStorageData,
        localStorageData: localStorageData,
        setfilterdData: setfilterdData,
      });
    }
    if(snippets) {
      slist(snippets, {
        parentCont: 'quick-snippets',
        setIndexSnippets: setIndexSnippets,
        setLocalStorageData: setLocalStorageData,
        localStorageData: localStorageData,
        setfilterdSnippetData: setfilterdSnippetData,
      })
    }
  }, [])

  useEffect(() => {
    // if refresh is set to true fetch data again
    if(refresh) {
      fetchData(fetchArgs);
    }
    setRefresh(false);
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
    if(!filterdData.length && !filterdSnippetData.length) {
      Auth.loggedIn() ? 
        setErrorMessage('Sorry! No results found...') : 
        setErrorMessage('Please log in to view all the items or add new items!');
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
    const targetOption= _t.dataset.option;
    const target = document.getElementById(targetId);
    target.classList.add('is-active');
    target.dataset.option = 'create';
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

  console.count();


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
                title="Refresh All" 
                className="button" 
                id="refreshAll" 
                onClick={() => setRefresh(true)}
                >
                <i className="fa-solid fa-arrow-rotate-right"></i>
              </button>
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
            setLocalStorageData={setLocalStorageData}
          ></LoginForm>
        </div>
        <div className="error-message-container">
          <p>{errorMessage}</p>
          <button 
          title="delete" 
          className="delete has-background-danger"
          onClick={e => setErrorMessage('')}
          ></button>
        </div>
        {Auth.loggedIn() ? (
          <Search 
            filterdData={filterdData}
            setfilterdData={setfilterdData}
            localStorageData={localStorageData}
            filterdSnippetData={filterdSnippetData}
            setfilterdSnippetData={setfilterdSnippetData}
            handleClear={handleClear}
            ></Search>
          ) : (
          <></>
        )}
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
