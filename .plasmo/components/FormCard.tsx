import { useState, useEffect } from "react"
import Auth from '../utils/auth';
import {client, createLinks, createCategory, getLists} from "../utils/apiCalls";

function FormCard(props) {
  // form validation
  const formLinkData = {
    name: "",
    url: "",
    category: ""
  }
  // form validation
  const formCategoryData = {
    mainCategory: ""
  }

  const [formLinkDetails, setFormLinkDetails] = useState(formLinkData)
  const [formCategoryDetails, setformCategoryDetails] =
    useState(formCategoryData)
  const { name, url, category } = formLinkDetails
  const { mainCategory } = formCategoryDetails
  // const [categoryData, setCategoryData] = useState(props.categoryData);
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    if(!props.categoryData.length) {
      const token = Auth.getToken(); 
      if(!token) {
        setErrorMessage('Please login to generate catgeories');
      }
    }
    console.log(props.categoryData, 'test')
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
    if (!e.target.value.length) {
      setErrorMessage(
        `${
          e.target.name.charAt(0).toUpperCase() + e.target.name.slice(1)
        } is required.`
      )
      document.querySelector<HTMLElement>(".error-text").style.color = "red"
    } else {
      setErrorMessage("")
    }

    if (!errorMessage) {
      setFormLinkDetails({
        ...formLinkDetails,
        [e.target.name]: e.target.value
      })
    }
    console.log(formLinkDetails, errorMessage);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if(name.length && url.length && category.length) {
    document.querySelector<HTMLElement>('.error-text').style.color = 'green';
    setErrorMessage('Sending...');  
    console.log('form data', formLinkDetails);
    // document.getElementById('add-options-modal')[0].reset();
    const record = await createLinks(formLinkDetails);

    if(record) {
      console.log(record);
      setFormLinkDetails(formLinkData);
    }

    } else {
      document.querySelector<HTMLElement>('.error-text').style.color = 'red';
      setErrorMessage('One or more fields are empty. Please try again!');
    }
  }

  async function categoryHandleSubmit(e) {
    e.preventDefault();
    const input = (document.getElementById('category-input') as HTMLInputElement).value;
    if(input) {
      console.log(input);
      const data = {
        name: input
      }
      const record = await createCategory(data);
      if(record) {
        const result = await getLists('category');
        if(result) {
          props.setCategoryData(result);
        }
      }
    }
  }

  return (
    <form className="modal" id="add-options-modal" onSubmit={handleSubmit}>
      <div className="modal-background"></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Add New Link</p>
          <button className="delete" aria-label="close"></button>
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
              </div>
            </div>
            <div className="field">
              <label className="label">URL</label>
              <div className="control has-icons-right">
                <input
                  name="url"
                  className="input is-success"
                  type="text"
                  placeholder="Text input"
                  onChange={handleChange}
                  value={url}
                />
                <span className="icon is-small is-right">
                  <i className="fas fa-check"></i>
                </span>
              </div>
            </div>

            <div className="field">
              <label className="label">Category</label>
              <div className="control is-flex">
                <div className="select" id="category-select-container">
                  <select title="category" name="category" onChange={handleChange} value={category}>
                    <option value="default">Select a category</option>
                    {props.categoryData.map((item) => (
                      <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                  </select>
                </div>
                <div className="ml-3">
                  <button
                    className="button is-link js-modal-trigger mr-2"
                    data-target="add-category-modal">
                    +
                  </button>
                  <button
                    className="button is-danger js-modal-trigger"
                    data-target="remove-category-modal">
                    x
                  </button>
                  <div className="modal" id="add-category-modal">
                    <div className="modal-background"></div>
                    <div className="modal-card">
                      <header className="modal-card-head">
                        <p className="modal-card-title">Add Category</p>
                        <button className="delete" aria-label="close"></button>
                      </header>
                      <section className="modal-card-body">
                        <div className="field">
                          <label className="label">Category Name</label>
                          <div className="control">
                            <input
                              id="category-input"
                              className="input"
                              type="text"
                              placeholder="Text input"
                            />
                          </div>
                        </div>
                      </section>
                      <footer className="modal-card-foot">
                        <button
                          className="button is-success"
                          id="category-submit-btn"
                          onClick={categoryHandleSubmit}>
                          Add Category
                        </button>
                        <button className="button cancel">Cancel</button>
                      </footer>
                    </div>
                  </div>
                  <div className="modal" id="remove-category-modal">
                    <div className="modal-background"></div>
                    <div className="modal-card">
                      <header className="modal-card-head">
                        <p className="modal-card-title">Remove Category</p>
                        <button className="delete" aria-label="close"></button>
                      </header>
                      <section className="modal-card-body">
                        <div className="field">
                          <label className="label">Category Name</label>
                          <div className="control">
                          {props.categoryData.map((item) => (
                              <span key={item.id} data-value={item.id}>{item.name}</span>
                            ))}
                          </div>
                        </div>
                      </section>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
              <button className="button is-link is-light cancel">Cancel</button>
            </div>
          </div>
        </footer>
      </div>
    </form>
  )
}

export default FormCard
