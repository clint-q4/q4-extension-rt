import { useState, useEffect } from "react"
import FormCard from "~.plasmo/components/FormCard"
import FormCardSnippet from "~.plasmo/components/FormCardSnippet"
import RenderLinks from "~.plasmo/components/RenderLinks";
import RenderSnippets from "~.plasmo/components/RenderSnippets";
import {modalFunctions} from "~.plasmo/utils/modal";
import apiLinks from "~.plasmo/utils/apiLinks";
import {getLists} from "~.plasmo/utils/apiCalls";
import {groupLinks} from "./content";
import fetchData from "~.plasmo/utils/fetchData";
import './css/styles.css';
import axios from 'axios';
import getSuspender from "~.plasmo/utils/getSuspender";
import PocketBase from 'pocketbase';
import LoginForm from "~.plasmo/components/LoginForm";
import Auth from '~.plasmo/utils/auth';

import './.plasmo/utils/slideToggle';
import { linkToggle } from "./content";

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
    groupLinks(categoryData, linksData, setfilterdData);
    groupLinks(categoryData, snippetData, setfilterdSnippetData);
    console.log(filterdSnippetData);
  }, [categoryData, linksData])

  function initDeleteOrModify(e) {
    e.preventDefault();
    let _t = e.target;
    const match = _t.matches('.button');
    _t = match ? _t : _t.parentElement;
    const id = _t.getAttribute('id') || '';
    const containerAll = document.querySelectorAll('.popup-buttons-container') as NodeListOf<Element>;
    for (let container of containerAll) {
      const pr = container.classList.contains('quick-links') ? '.quick-links' : '.quick-snippets';
            const toggleLinks = (document.querySelectorAll(`${pr} .link-list-toggle`) as NodeListOf<Element>);
      switch (id) {
        case 'update-links':
          if(!container.classList.contains('update-links-init')) {
            container.classList.add('update-links-init')
            // _t.textContent = 'Updating...';
            _t.classList.add('active');
            for(let link of toggleLinks) {
              const id  = (link as HTMLInputElement).dataset.toggle;
              console.log(link.classList)
              link.classList.add('active');
              const linkTarget = document.getElementById(id);
              (linkTarget as HTMLInputElement).slideDown(300);
            }
          } else {
            container.classList.remove('update-links-init')
            // _t.textContent = 'Update';
            _t.classList.remove('active');
            for(let link of toggleLinks) {
              const id  = (link as HTMLInputElement).dataset.toggle;
              const linkTarget = document.getElementById(id);
              link.classList.remove('active');
              (linkTarget as HTMLInputElement).slideUp(300);
            }
          }
        break;
        
        case 'delete-links':
          if(!container.classList.contains('delete-links-init')) {
            container.classList.add('delete-links-init')
            // _t.textContent = 'Deleting...';
            _t.classList.add('active');
            for(let link of toggleLinks) {
              const id  = (link as HTMLInputElement).dataset.toggle;
              console.log(link.classList)
              link.classList.add('active');
              const linkTarget = document.getElementById(id);
              (linkTarget as HTMLInputElement).slideDown(300);
            }
          } else {
            container.classList.remove('delete-links-init')
            // _t.textContent = 'Delete';
            _t.classList.remove('active');
            for(let link of toggleLinks) {
              const id  = (link as HTMLInputElement).dataset.toggle;
              const linkTarget = document.getElementById(id);
              link.classList.remove('active');
              (linkTarget as HTMLInputElement).slideUp(300);
            }
          }
          break;
      }
    }
  }

  return (
    <div className="options-container p-6">
    <section className="header-section is-flex is-justify-content-space-between p-4 has-background-success-light border-radius-10">
      <div className="is-flex-grow-1">
        <h2 className="title is-size-1">ClipMe.</h2>
      </div>
      {Auth.loggedIn() ? (
          <div className="is-flex is-align-items-center">
            <button className="button js-modal-trigger mr-3" id="add-snippet-button" data-target="add-snippet-modal">
              Add Snippets
            </button>
            <button className="button js-modal-trigger mr-3" id="add-options-button" data-target="add-options-modal">
              Add Links
            </button>
            <button onClick={initDeleteOrModify} id="update-links" title="update links" className="button is-success mr-3">
              {/* Update */}
              <i className="fa-solid fa-pen-to-square"></i>
            </button>
            <button onClick={initDeleteOrModify} id="delete-links" title="delete links" className="button is-danger mr-5">
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
