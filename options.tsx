import { useState, useEffect } from "react"
import FormCard from "~.plasmo/components/FormCard"
import RenderLinks from "~.plasmo/components/RenderLinks";
import {modalFunctions} from "~.plasmo/utils/modal";
import apiLinks from "~.plasmo/utils/apiLinks";
import {getLists} from "~.plasmo/utils/apiCalls";
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

const apiDomain = 'http://127.0.0.1:8090';

// const apiCategoryData = fetchData(apiLinks.categoriesLink);
// const apiLinksData = fetchData(apiLinks.categoriesLink);

function IndexOptions() {
  const [categoryData, setCategoryData] = useState<{[key: string]: any}>([]);
  const [linksData, setLinksData] = useState<{[key: string]: any}>([]);
  const [filterdData, setfilterdData] = useState<{[key: string]: any}>({});
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [formLinkDetails, setFormLinkDetails] = useState(formLinkData)
  const [linkID, setLinkID] = useState<string>('');
  useEffect(() => {
    // Run modal helper funtions
    modalFunctions();
    (async function fetchData() {
      const apiCategoryData = await getLists('category');
      const apiLinksData = await getLists('websites');
      setCategoryData(apiCategoryData);
      setLinksData(apiLinksData);
    })();

  }, [])

  useEffect(() => {
    if(categoryData.length && linksData.length) {
      const groupedData = linksData.reduce((groups, item) => {
        const group = (groups[categoryData.find(c => c.id === item.category).name] || []);
        group.push(item);
        groups[categoryData.find(c => c.id === item.category).name] = group;
        return groups;
      }, {});
      localStorage.setItem('groupedData', JSON.stringify(groupedData));
      const groupedLocalData = JSON.parse(localStorage.getItem('groupedData'));
      setfilterdData(groupedLocalData);
    } else {
      const groupedLocalData = JSON.parse(localStorage.getItem('groupedData'));
      if(groupedLocalData) {
        setfilterdData(groupedLocalData);
      }
    }
    // const localCategories = JSON.parse(localStorage.getItem('categoriesData'));
    // const localLinks = JSON.parse(localStorage.getItem('linksData'));
  }, [categoryData, linksData])

  function initDeleteOrModify(e) {
    e.preventDefault();
    console.log(e)
    const _t = e.target;
    const id = _t.getAttribute('id') || '';
    const container = document.querySelector('.popup-buttons-container') as HTMLElement;
    const toggleLinks = (document.querySelectorAll('.link-list-toggle') as NodeListOf<Element>);
    switch (id) {
      case 'update-links':
        for(let link of toggleLinks) {
          console.log(link);
          const id  = (link as HTMLInputElement).dataset.toggle;
          console.log(id);
          const linkTarget = document.getElementById(id);
          if(link.classList.contains('active') && 
            linkTarget.classList.contains('active') && 
            !container.classList.contains('update-links-init')) {
            container.classList.add('update-links-init')
              _t.textContent = 'Updating...';
            }
           else {
            (link as HTMLInputElement).click();
            if(container.classList.contains('update-links-init'))  {
              container.classList.remove('update-links-init');
              _t.textContent = 'Update';
            } else {
              container.classList.add('update-links-init');
              _t.textContent = 'Updating...';
            }
          }
      }
      break;
      
      case 'delete-links':
        for(let link of toggleLinks) {
          if(link.classList.contains('active')) {
            link.classList.remove('active');
            (link as HTMLInputElement).click();
          } else {
            (link as HTMLInputElement).click();
          }
        }
        if(container.classList.contains('delete-links-init'))  {
          container.classList.remove('delete-links-init');
          _t.textContent = 'Delete';
        } else {
          container.classList.add('delete-links-init')
          _t.textContent = 'Deleting...';
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
    <div className="my-5">
      <RenderLinks 
          filterdData={filterdData}
          setErrorMessage={setErrorMessage}
          formLinkDetails={formLinkDetails}
          setFormLinkDetails={setFormLinkDetails}
          setLinkID={setLinkID}
          ></RenderLinks>
    </div>
    <FormCard 
      categoryData={categoryData}
      setCategoryData={setCategoryData}
      formLinkDetails={formLinkDetails}
      setFormLinkDetails={setFormLinkDetails}
      linkID={linkID}
      ></FormCard>
    <div className="error-message-container">
      <p>{errorMessage}</p>
    </div>
  </div>
  )
}

export default IndexOptions;
