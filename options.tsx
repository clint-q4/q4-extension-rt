import { useState, useEffect } from "react"
import FormCard from "~.plasmo/components/FormCard";
import FormCardSnippet from "~.plasmo/components/FormCardSnippet";
import RenderLinks from "~.plasmo/components/RenderLinks";
import RenderSnippets from "~.plasmo/components/RenderSnippets";
import {modalFunctions} from "~.plasmo/utils/modal";
import apiLinks from "~.plasmo/utils/apiLinks";
import {getLists} from "~.plasmo/utils/apiCalls";
import {groupLinks, linkToggle, initDeleteOrModify} from "./content";
import fetchData from "~.plasmo/utils/fetchData";
import './css/styles.css';
import axios from 'axios';
import getSuspender from "~.plasmo/utils/getSuspender";
import PocketBase from 'pocketbase';
import LoginForm from "~.plasmo/components/LoginForm";
import Auth from '~.plasmo/utils/auth';
import './node_modules/@fortawesome/fontawesome-free/css/all.min.css';

import './.plasmo/utils/slideToggle';

// getList();
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

function IndexOptions() {
  const [categoryData, setCategoryData] = useState<{[key: string]: any}>([]);
  const [linksData, setLinksData] = useState<{[key: string]: any}>([]);
  const [snippetData, setSnippetData] = useState<{[key: string]: any}>([]);
  const [filterdData, setfilterdData] = useState<{[key: string]: any}>({});
  const [filterdSnippetData, setfilterdSnippetData] = useState<{[key: string]: any}>({});
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [formLinkDetails, setFormLinkDetails] = useState(formLinkData);
  const [formSnippetDetails, setFormSnippetDetails] = useState(formSnippetData);
  const [linkID, setLinkID] = useState<string>('');
  useEffect(() => {
    // Run modal helper funtions
    modalFunctions();
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
    <div className="options-container p-6">
    <section className="header-section is-flex is-justify-content-space-between p-4 has-background-success-light border-radius-10">
      <div className="is-flex-grow-1">
        <h2 className="title is-size-1">ClipMe.</h2>
      </div>
      {Auth.loggedIn() ? (
          <div className="is-flex is-align-items-center">
            <button title="add-snippet" className="button js-modal-trigger create-new-button" id="add-snippet-button" data-target="add-snippet-modal">
              <i className="fa-solid fa-code"></i>
            </button>
            <button title="add-link" className="button js-modal-trigger create-new-button" id="add-options-button" data-target="add-options-modal">
              <i className="fa-solid fa-link"></i>
            </button>
            <button onClick={initDeleteOrModify} id="update-links" title="update links" className="button mr-3">
              {/* Update */}
              <i className="fa-solid fa-pen-to-square"></i>
            </button>
            <button onClick={initDeleteOrModify} id="delete-links" title="delete links" className="button mr-5">
              {/* Delete */}
              <i className="fa-regular fa-trash-can"></i>
            </button>
          </div>
        ) : (
          <div className="is-flex is-align-items-center mr-5">
            <p>Please log in to add links → </p>
          </div>
        )}
      <LoginForm></LoginForm>
    </section>
    <div className="my-5 options-content">
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
  )
}

export default IndexOptions;
