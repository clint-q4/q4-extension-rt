import { useState, useEffect } from "react"
import Auth from '../utils/auth';
import {client, createSnippets, createCategory, updateCategory, deleteCategory, getLists, updateLinks} from "../utils/apiCalls";
import { error } from "console";
import CodeEditor from "./CodeEditor";

function FormCardSnippet(props) {
  // form validation
  const formCategoryData = {
    mainCategory: ""
  }

  const [formCategoryDetails, setformCategoryDetails] =
    useState(formCategoryData)
  const { name, snippet, url, category } = props.formSnippetDetails
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
    const req = ['name', 'snippet', 'category']
    if(req.includes(e.target.name)) {
      console.log('req inc');
      if (!e.target.value.length) {
        console.log('firing no lengtn');
        setErrorMessage(
          `${
            e.target.name.charAt(0).toUpperCase() + e.target.name.slice(1)
          } is required.`
        )
        document.querySelector<HTMLElement>(".error-text").style.color = "red"
      } else {
        setErrorMessage("")
      }
    }
    console.log('props', props.formSnippetDetails);
    setErrorMessage("");
    if (!errorMessage) {
      props.setFormSnippetDetails({
        ...props.formSnippetDetails,
        [e.target.name]: e.target.value
      })
    }
  }

  async function handleSubmitSnippet(e) {
    e.preventDefault();
    const errorStatus = (document.querySelector('#add-snippet-modal .error-text') as HTMLInputElement);
    const option = (document.querySelector('#add-snippet-modal') as HTMLInputElement).dataset.option;
    const clear = {
      name: "",
      snippet: "",
      url: "",
      category: "",
    }
    if(option === 'create') {
      if(name.length && snippet.length && category.length) {
        console.log(props.formSnippetDetails);
        setErrorMessage('Sending...');  
        if(url.length && !validateUrl(url)) {
          errorStatus.style.color = 'red';
          setErrorMessage('Please enter a valid URL!');
          return;
        }
        const record = await createSnippets(props.formSnippetDetails);
  
        if(record) {
          const temp = `${record.name} has been addded to the list!`;
          errorStatus.style.color = 'green';
          setErrorMessage(temp);
          props.setFormSnippetDetails(clear);
          setTimeout(function() {
            window.location.reload();
          }, 500)
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
        const record = await updateLinks(props.linkID, props.formSnippetDetails);

  
        if(record) {
          const temp = `${record.name} has been updated!`;
          errorStatus.style.color = 'green';
          setErrorMessage(temp);
          props.setFormSnippetDetails(clear);
          setTimeout(function() {
            window.location.reload();
          }, 500)
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

  async function categoryHandleSubmit(e) {
    e.preventDefault();
    console.log('clikced');
    const input = (document.getElementById('category-snip-input') as HTMLInputElement).value;
    const toggleState = (document.querySelector('.switch-checkbox.snippet') as HTMLInputElement).checked;
    const linked = toggleState ? 'both' : 'snippet';

    if(input) {
      const data = {
        name: input,
        linked: linked
      }
      const record = await createCategory(data);
      console.log(record)
      if(record) {
        const categoryStatus = (document.querySelector('#add-snippet-modal .modal-card-foot .add-category-status') as HTMLInputElement);
        const temp = `${record.name} has been added to the category list!`;
        categoryStatus.style.color = 'green';
        setAddCategoryMessage(temp);
        setTimeout(function() {
          document.querySelector('#add-snip-category-modal').classList.remove('is-active');
        }, 500)
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
    const _t = e.target;
    const match = _t.matches('.fa-floppy-disk');
    if(match) {
      const categoryInput = _t.closest('.buttonsContainer').previousSibling;
      const categoryID = _t.closest('.control').dataset.value;
      const updatedCategory = categoryInput.value;
      _t.style.display = 'none';
      _t.previousSibling.style.display = 'inline-block';
      if(updatedCategory && categoryID) {
        const data = {
          name: updatedCategory
        }
        const response = updateCategory(data, categoryID);
        const textInput = document.createElement('span');
        textInput.classList.add('categoryName');
        textInput.textContent = updatedCategory;
        categoryInput.replaceWith(textInput);
        const categoryStatus = (document.querySelector('#add-snippet-modal .modal-card-foot .add-category-status') as HTMLInputElement);
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
    const _t = e.target;
    const match = _t.matches('.fa-pen-to-square');
    if(match) {
      const focusEvent = new Event('focus');
      const categoryElement = _t.closest('.buttonsContainer').previousSibling;
      const categoryName = categoryElement.textContent;
      _t.style.display = 'none';
      _t.nextSibling.style.display = 'inline-block';
      if(categoryName) {
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
      const categoryStatus = (document.querySelector('#add-snippet-modal .modal-card-foot .category-status') as HTMLInputElement);
      if(categoryID) {
        const response = deleteCategory(categoryID);
        response.then((res) => {
          if(res) {
            categoryStatus.style.color = 'green';
            setCategoryMessage('Category has been deleted successfully!');
            getLists('category').then((list) => {
              props.setCategoryData(list);
            });
          } else {
            const temp = 'Sorry! Something went wrong';
            setCategoryMessage(temp);
            categoryStatus.style.color = 'red';
          }
        }).catch((err) => {
          console.log(err);
          categoryStatus.style.color = 'red';
          const temp = 'Make sure that the category does not have any links!';
          setCategoryMessage(temp);
        });
      }
    }
  }
  
  return (
    <form className="modal" id="add-snippet-modal" data-type="snippet" data-option="create" onSubmit={handleSubmitSnippet}>
      <div className="modal-background"></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Add New Snippet</p>
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
              <label className="label">Snippet</label>
              <div className="control has-icons-right">
                {/* <textarea
                  name="snippet"
                  className="input is-success"
                  placeholder="Text input"
                  onChange={handleChange}
                  value={snippet}
                /> */}
                <CodeEditor
                  formSnippetDetails={props.formSnippetDetails}
                  setFormSnippetDetails={props.setFormSnippetDetails}
                  snippet={''}
                  ></CodeEditor>
                <span className="icon is-small is-right">
                  <i className="fas fa-check"></i>
                </span>
                
              </div>
            </div>

            <div className="field">
              <label className="label">Related URL</label>
              <div className="control has-icons-right">
                <input
                  name="url"
                  className="input"
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
                    {props.categoryData.filter((cat) => cat.linked === 'snippet' || cat.linked === 'both').map((item) => (
                      <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                  </select>
                </div>
                <div className="ml-3">
                  <button
                    className="button is-link js-modal-trigger mr-2"
                    data-target="add-snip-category-modal">
                    +
                  </button>
                  <button
                    className="button is-danger js-modal-trigger"
                    data-target="remove-snip-category-modal">
                    x
                  </button>
                  <div className="modal" id="add-snip-category-modal">
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
                              id="category-snip-input"
                              className="input"
                              type="text"
                              placeholder="Text input"
                            />
                          </div>
                        </div>
                        <div className="field">
                          <label className="label">Linked to both?</label>
                          <div className="control">
                            <label className="switch">
                              <input title="switch" className="switch-checkbox snippet" type="checkbox" />
                              <span className="slider round"></span>
                            </label>
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
                  <div className="modal" id="remove-snip-category-modal">
                    <div className="modal-background"></div>
                    <div className="modal-card">
                      <header className="modal-card-head">
                        <p className="modal-card-title">Remove/Update Category</p>
                        <button className="delete" aria-label="close"></button>
                      </header>
                      <section className="modal-card-body">
                        <div className="field">
                          <h3 className="label">Categories</h3>
                          {props.categoryData.filter((cat) => cat.linked === 'snippet' || cat.linked === 'both').map((item) => (
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
              <button type="button" className="button is-link is-light cancel">Cancel</button>
            </div>
          </div>
        </footer>
      </div>
    </form>
  )
}

export default FormCardSnippet;
