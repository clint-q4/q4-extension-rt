import { useState, useEffect } from "react"
import Auth from '../../utils/auth';
import {client, createLinks, createCategory, updateCategory, deleteCategory, getLists, updateLinks} from "../../utils/apiCalls";
import { error } from "console";
import CategoryForm from "./CategoryForm";

function FormCard(props) {
  // form validation
  const formCategoryData = {
    mainCategory: ""
  }

  const [formCategoryDetails, setformCategoryDetails] =
    useState(formCategoryData)
    console.log(props.formLinkDetails, 'props')
  const { name, url, category } = props.formLinkDetails;
  const { mainCategory } = formCategoryDetails
  // const [categoryData, setCategoryData] = useState(props.categoryData);
  const [errorMessage, setErrorMessage] = useState("")
  const [categoryMessage, setCategoryMessage] = useState('Please update/delete category using the buttons')
  const [addCategoryMessage, setAddCategoryMessage] = useState('');

  useEffect(() => {
    if(!props.categoryData.length) {
      const token = Auth.getToken(); 
      if(!token) {
        setErrorMessage('Please login to generate catgeories');
      }
    }
  }, [props.categoryData])

  function validateUrl(string) {
    let url
    try {
      url = new URL(string)
    } catch (_) {
      return false
    }

    return url.protocol === "http:" || url.protocol === "https:"
  }

  function handleChange(e) {
    const clearSwitch = e.target.nextSibling;
    if (e.target.value.length) {
      setErrorMessage("")
      props.setFormLinkDetails({
        ...props.formLinkDetails,
        [e.target.name]: e.target.value
      })
    } else {
      const err = document.querySelectorAll<HTMLElement>(".error-text");
      for(let er of err) {
        er.style.color = "red";
      }
      props.setFormLinkDetails({
        ...props.formLinkDetails,
        [e.target.name]: ''
      })
      clearSwitch.classList.remove('active');
      console.log(clearSwitch.classList, 'after');
      setErrorMessage(
        `${
          e.target.name.charAt(0).toUpperCase() + e.target.name.slice(1)
        } is required.`
      )
      clearSwitch.classList.add('remove');
    }
  }


  async function handleSubmit(e) {
    e.preventDefault();
    const modal = (document.querySelector('#add-options-modal') as HTMLInputElement);
    const errorStatus = (document.querySelector('#add-options-modal .error-text') as HTMLInputElement);
    const option = modal.dataset.option;
    const clear = {
      name: "",
      url: "",
      category: "",
    }
    if(option === 'create') {
      if(name.length && url.length && category.length) {
        setErrorMessage('adding... please wait!');  
        // document.getElementById('add-options-modal')[0].reset();
        if(!validateUrl(url)) {
          errorStatus.style.color = 'red';
          setErrorMessage('Please enter a valid URL!');
          return;
        }
        const record = await createLinks(props.formLinkDetails);
  
        if(record) {
          const temp = `${record.name} has been addded to the list!`;
          errorStatus.style.color = 'green';
          setErrorMessage(temp);
          props.setRefresh(true);
          props.setFormLinkDetails(clear);
          setTimeout(function() {
            setErrorMessage("");
            modal.classList.remove('is-active')
          }, 1000)
        } else {
          setErrorMessage('Sorry! Something went wrong!');
          document.querySelector<HTMLElement>('.error-text').style.color = 'red';
        }
  
      } else {
        errorStatus.style.color = 'red';
        setErrorMessage('One or more fields are empty. Please try again!');
      }
    } else if (option === 'update') {
      if(name.length && url.length && category.length) {
        setErrorMessage('Sending...');
        // document.getElementById('add-options-modal')[0].reset();
        if(!validateUrl(url)) {
          errorStatus.style.color = 'red';
          setErrorMessage('Please enter a valid URL!');
          return;
        }
        const record = await updateLinks(props.linkID, props.formLinkDetails);

  
        if(record) {
          const temp = `${record.name} has been updated!`;
          errorStatus.style.color = 'green';
          props.setRefresh(true);
          setErrorMessage(temp);
          props.setFormLinkDetails(clear);
          setTimeout(function() {
            setErrorMessage("");
            modal.classList.remove('is-active')
          }, 1000)
        } else {
          setErrorMessage('Sorry! Something went wrong!');
          document.querySelector<HTMLElement>('.error-text').style.color = 'red';
        }
  
      } else {
        errorStatus.style.color = 'red';
        setErrorMessage('One or more fields are empty. Please try again!');
      }
    }
  }
  
  return (
    <form className="modal" id="add-options-modal" data-type="link" data-option="create" onSubmit={handleSubmit}>
      <div className="modal-background"></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Add New Link</p>
          <button title="cancel" className="button modal-close cancel is-danger" type="button" aria-label="close"></button>
        </header>
        <section className="modal-card-body">
          <section className="form">
            <div className="field">
              <label className="label">Name</label>
              <div className="control">
                <input
                  name="name"
                  className="input"
                  type="text"
                  placeholder="Text input"
                  onChange={handleChange}
                  value={name}
                />
                <button title="clear" className="clear-switch button"
                  onClick={e => props.handleClear(e, 'links')}
                  ><i className="fa-solid fa-xmark"></i></button>
              </div>
            </div>
            <div className="field">
              <label className="label">URL</label>
              <div className="control has-icons-right">
                <input
                  name="url"
                  className="input"
                  type="text"
                  placeholder="Text input"
                  onChange={handleChange}
                  value={url}
                />
                <button 
                title="clear"
                className="clear-switch button"
                onClick={e => props.handleClear(e, 'links')}
                ><i className="fa-solid fa-xmark"></i></button>
              </div>
            </div>
            <CategoryForm
              handleChange={handleChange}
              categoryMessage={categoryMessage}
              setCategoryMessage={setCategoryMessage}
              formLinkDetails={props.formLinkDetails}
              categoryData={props.categoryData}
              setCategoryData={props.setCategoryData}
              setRefresh={props.setRefresh}
              collectionType={'link'}
            ></CategoryForm>
          </section>
        </section>
        <footer className="modal-card-foot">
          <div className="error-container">
            <p className="error-text">{errorMessage}</p>
          </div>
          <div className="field is-grouped">
            <div className="control">
              <button type="submit" className="button is-link">Submit</button>
            </div>
            <div className="control">
              <button type="button" className="button is-link cancel">Cancel</button>
            </div>
          </div>
        </footer>
      </div>
    </form>
  )
}

export default FormCard;
