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
    const _t = e.target;
    const id = _t.getAttribute('id') || '';
    const container = document.querySelector('.popup-buttons-container') as HTMLElement;
    const toggleLinks = (document.querySelectorAll('.link-list-toggle') as NodeListOf<Element>);
    switch (id) {
      case 'update-links':
        if(!container.classList.contains('update-links-init')) {
          container.classList.add('update-links-init')
          _t.textContent = 'Updating...';
          for(let link of toggleLinks) {
            const id  = (link as HTMLInputElement).dataset.toggle;
            const linkTarget = document.getElementById(id);
            if(link.classList.contains('active') && 
              linkTarget.classList.contains('active')) {
                link.classList.remove('active')
                linkTarget.classList.remove('active');
                (link as HTMLInputElement).click();
              } else {
                (link as HTMLInputElement).click();
              }
          }
        } else {
          container.classList.remove('update-links-init')
          _t.textContent = 'Update';
          for(let link of toggleLinks) {
            const id  = (link as HTMLInputElement).dataset.toggle;
            const linkTarget = document.getElementById(id);
            if(!link.classList.contains('active') && 
            !linkTarget.classList.contains('active')) {
              link.classList.add('active');
              (linkTarget as HTMLInputElement).classList.add('active');
              linkTarget.style.height = 'auto';
              const height = linkTarget.clientHeight + 'px';
              linkTarget.style.height = '0px';
              setTimeout(function () {
                linkTarget.style.height = height;
              }, 0);
            }
            (link as HTMLInputElement).click();
          }
        }
      break;
      
      case 'delete-links':
        if(!container.classList.contains('delete-links-init')) {
          container.classList.add('delete-links-init')
          _t.textContent = 'Deleting...';
          for(let link of toggleLinks) {
            const id  = (link as HTMLInputElement).dataset.toggle;
            const linkTarget = document.getElementById(id);
            if(link.classList.contains('active') && 
              linkTarget.classList.contains('active')) {
                link.classList.remove('active')
                linkTarget.classList.remove('active');
                (link as HTMLInputElement).click();
              } else {
                (link as HTMLInputElement).click();
              }
          }
        } else {
          container.classList.remove('delete-links-init')
          _t.textContent = 'Delete';
          for(let link of toggleLinks) {
            const id  = (link as HTMLInputElement).dataset.toggle;
            const linkTarget = document.getElementById(id);
            if(!link.classList.contains('active') && 
            !linkTarget.classList.contains('active')) {
              link.classList.add('active');
              (linkTarget as HTMLInputElement).classList.add('active');
              linkTarget.style.height = 'auto';
              const height = linkTarget.clientHeight + 'px';
              linkTarget.style.height = '0px';
              setTimeout(function () {
                linkTarget.style.height = height;
              }, 0);
            }
            (link as HTMLInputElement).click();
          }
        }
        break;
    }
  }

  return (
    <div className="options-container p-6">
    <section className="header-section is-flex is-justify-content-space-between p-4 has-background-success-light border-radius-10">
      <div className="is-flex-grow-1">
        <h2 className="title is-size-1">Options</h2>
      </div>
      {Auth.loggedIn() ? (
          <div className="is-flex is-align-items-center">
            <button className="button has-text-weight-bold is-primary js-modal-trigger mr-3" id="add-snippet-button" data-target="add-snippet-modal">
              Add Snippets
            </button>
            <button className="button has-text-weight-bold is-primary js-modal-trigger mr-3" id="add-options-button" data-target="add-options-modal">
              Add Links
            </button>
            <button onClick={initDeleteOrModify} id="update-links" title="update links" className="button has-text-weight-bold is-success mr-3">
              Update
            </button>
            <button onClick={initDeleteOrModify} id="delete-links" title="delete links" className="button has-text-weight-bold is-danger mr-5">
              Delete
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
        <h3>Links</h3>
        <RenderLinks 
          filterdData={filterdData}
          setErrorMessage={setErrorMessage}
          formLinkDetails={formLinkDetails}
          setFormLinkDetails={setFormLinkDetails}
          setLinkID={setLinkID}
          ></RenderLinks>
        </div>
        <div className="content-container">
          <h3>Snippets</h3>
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
