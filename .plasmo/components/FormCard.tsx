import { useState, useEffect } from "react"
import Auth from '../utils/auth';
import {client, createLinks, createCategory, updateCategory, deleteCategory, getLists} from "../utils/apiCalls";
import { error } from "console";

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
  const [categoryMessage, setCategoryMessage] = useState('Please update/delete category using the buttons')
  const [addCategoryMessage, setAddCategoryMessage] = useState('');

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
    const errorStatus = (document.querySelector('#add-options-modal .error-text') as HTMLInputElement);
    if(name.length && url.length && category.length) {
      setErrorMessage('Sending...');  
      console.log('form data', formLinkDetails);
      // document.getElementById('add-options-modal')[0].reset();
      if(!validateUrl(url)) {
        console.log(errorStatus);
        errorStatus.style.color = 'red';
        setErrorMessage('Please enter a valid URL!');
        return;
      }
      const record = await createLinks(formLinkDetails);

      if(record) {
        console.log(record);
        const temp = `${record.name} has been addded to the list!`;
        errorStatus.style.color = 'green';
        setErrorMessage(temp);
        setFormLinkDetails(formLinkData);
      } else {
        setErrorMessage('Sorry! Something went wrong!');
        document.querySelector<HTMLElement>('.error-text').style.color = 'red';
      }

    } else {
      errorStatus.style.color = 'red';
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
        console.log(record, 'catData');
        const categoryStatus = (document.querySelector('.modal-card-foot .add-category-status') as HTMLInputElement);
        const temp = `${record.name} has been added to the category list!`;
        categoryStatus.style.color = 'green';
        setAddCategoryMessage(temp);
        const result = await getLists('category');
        if(result) {
          props.setCategoryData(result);
        }
      } else {
        setAddCategoryMessage('Something went wrong!');
      }
    }
  }

  async function triggerCategoryUpdate(e) {
    e.preventDefault();
    console.log(e);
    console.log(e.target);
    const _t = e.target;
    const match = _t.matches('.fa-floppy-disk');
    console.log(_t);
    if(match) {
      const categoryInput = _t.closest('.buttonsContainer').previousSibling;
      const categoryID = _t.closest('.control').dataset.value;
      const updatedCategory = categoryInput.value;
      _t.style.display = 'none';
      _t.previousSibling.style.display = 'inline-block';
      if(updatedCategory && categoryID) {
        console.log(updatedCategory, categoryID);
        const data = {
          name: updatedCategory
        }
        const response = updateCategory(data, categoryID);
        const textInput = document.createElement('span');
        textInput.classList.add('categoryName');
        textInput.textContent = updatedCategory;
        categoryInput.replaceWith(textInput);
        const categoryStatus = (document.querySelector('.modal-card-foot .category-status') as HTMLInputElement);
        response.then((res) => {
          if(res.name) {
            const temp = `Catgeory has been updated to ${res.name}`;
            categoryStatus.style.color = 'green';
            setCategoryMessage(temp);
          } else {
            const temp = 'Sorry! Something went wrong';
            setCategoryMessage(temp);
            categoryStatus.style.color = 'red';
          }
        });
      }
    }
  }
  
  function modifyCategory(e) {
    e.preventDefault();
    console.log(e);
    console.log(this, 'this');
    const _t = e.target;
    const match = _t.matches('.fa-pen-to-square');
    console.log(_t);
    if(match) {
      const focusEvent = new Event('focus');
      const categoryElement = _t.closest('.buttonsContainer').previousSibling;
      const categoryName = categoryElement.textContent;
      _t.style.display = 'none';
      _t.nextSibling.style.display = 'inline-block';
      if(categoryName) {
        console.log(categoryElement);
        const textInput = document.createElement('textarea');
        textInput.classList.add('form-control');
        textInput.value = categoryName;
        categoryElement.replaceWith(textInput);
        textInput.dispatchEvent(focusEvent);
      }
    }
  }

  async function triggerDeleteCategory(e) {
    e.preventDefault();
    const _t = e.target;
    const match = _t.matches('.fa-trash-can');
    if(match) {
      const categoryID = _t.closest('.control').dataset.value;
      const categoryStatus = (document.querySelector('.modal-card-foot .category-status') as HTMLInputElement);
      if(categoryID) {
        const response = deleteCategory(categoryID);
        response.then((res) => {
          if(res) {
            categoryStatus.style.color = 'green';
            setCategoryMessage('Category has been deleted successfully!');
            getLists('category').then((list) => {
              console.log(list);
              props.setCategoryData(list);
            });
          } else {
            const temp = 'Sorry! Something went wrong';
            setCategoryMessage(temp);
            categoryStatus.style.color = 'red';
          }
        })
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
                      <footer className="modal-card-foot is-flex-direction-column	is-flex is-align-items-flex-start">
                        <div className="category-status-container">
                          <p className="add-category-status mb-3">{addCategoryMessage}</p>
                        </div>
                        <div className="buttons-container">
                          <button
                            className="button is-success"
                            id="category-submit-btn"
                            onClick={categoryHandleSubmit}>
                            Add Category
                          </button>
                          <button className="button cancel">Cancel</button>
                        </div>
                      </footer>
                    </div>
                  </div>
                  <div className="modal" id="remove-category-modal">
                    <div className="modal-background"></div>
                    <div className="modal-card">
                      <header className="modal-card-head">
                        <p className="modal-card-title">Remove/Update Category</p>
                        <button className="delete" aria-label="close"></button>
                      </header>
                      <section className="modal-card-body">
                        <div className="field">
                          <h3 className="label">Categories</h3>
                          {props.categoryData.map((item) => (
                              <div className="control" key={item.id} data-value={item.id}>
                                <span className="categoryName">{item.name}</span>
                                <div className="buttons-container">
                                    <button id="modify-category" title="modify category" type="button">
                                      <i onClick={modifyCategory} className="fa-solid fa-pen-to-square"></i>
                                      <i onClick={triggerCategoryUpdate} className="fa-regular fa-floppy-disk" style={{display: 'none'}}></i>
                                    </button>
                                    <button id="delete-category" title="delete category" type="button">
                                      <i onClick={triggerDeleteCategory} className="fa-regular fa-trash-can"></i>
                                    </button>
                                </div>
                              </div>
                            ))}
                        </div>
                      </section>
                      <footer className="modal-card-foot">
                        <p className="category-status">{categoryMessage}</p>
                      </footer>
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
