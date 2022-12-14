import { useState } from "react"

import { createSnippets, updateSnippets } from "../../utils/apiCalls"
import Auth from "../../utils/auth"
import CodeEditorForm from "../codeEditor/CodeEditorForm"
import CategoryForm from "./CategoryForm"
import loaderSvg from '../../../assets/loading.svg';

function FormCardSnippet(props) {
  const { name, snippet, url, category } = props.formSnippetDetails
  const [errorMessage, setErrorMessage] = useState("")
  const [loader, intiateLoader] = useState(false)
  const [categoryMessage, setCategoryMessage] = useState("")

  if (!props.categoryData.length) {
    const token = Auth.getToken()
    if (!token) {
      setErrorMessage("Please login to generate catgeories")
    }
  }

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

    props.setFormSnippetDetails({
      ...props.formSnippetDetails,
      [e.target.name]: e.target.value
    })
  }

  async function handleSubmitSnippet(e) {
    e.preventDefault()
    const modal = document.querySelector(
      "#add-snippet-modal"
    ) as HTMLInputElement
    const errorStatus = document.querySelector(
      "#add-snippet-modal .error-text"
    ) as HTMLInputElement
    const option = modal.dataset.option
    const clear = {
      name: "",
      snippet: "",
      url: "",
      category: ""
    }
    if (option === "create") {
      if (name.length && snippet.length && category.length) {
        setErrorMessage("adding... please wait!")
        if (url.length && !validateUrl(url)) {
          errorStatus.style.color = "red"
          setErrorMessage("Please enter a valid URL!")
          return
        }
        const record = await createSnippets(props.formSnippetDetails)

        if (record) {
          const temp = `${record.name} has been addded to the list!`
          errorStatus.style.color = "green"
          setErrorMessage(temp)
          props.setFormSnippetDetails(clear)
          props.setRefresh(true)
          setTimeout(function () {
            setErrorMessage("")
            modal.classList.remove("is-active")
          }, 1000);
        } else {
          setErrorMessage("Sorry! Something went wrong!")
          document.querySelector<HTMLElement>(".error-text").style.color = "red"
        }
      } else {
        errorStatus.style.color = "red"
        setErrorMessage("One or more fields are empty. Please try again!")
      }
    } else if (option === "update") {
      if (name.length && url.length && category.length) {
        // setErrorMessage("Sending...")
        intiateLoader(true)
        // document.getElementById('add-options-modal')[0].reset();
        if (!validateUrl(url)) {
          errorStatus.style.color = "red"
          setErrorMessage("Please enter a valid URL!")
          return
        }
        const record = await updateSnippets(
          props.snippetID,
          props.formSnippetDetails
        )

        if (record) {
          intiateLoader(false)
          const temp = `${record.name} has been updated!`
          errorStatus.style.color = "green"
          setErrorMessage(temp)
          props.setRefresh(true)
          props.setFormSnippetDetails(clear)
          setTimeout(function () {
            setErrorMessage("")
            modal.classList.remove("is-active")
          }, 1000)
        } else {
          intiateLoader(false)
          setErrorMessage("Sorry! Something went wrong!")
          document.querySelector<HTMLElement>(".error-text").style.color = "red"
        }
      } else {
        intiateLoader(false)
        errorStatus.style.color = "red"
        setErrorMessage("One or more fields are empty. Please try again!")
      }
    }
  }

  return (
    <form
      className="modal"
      id="add-snippet-modal"
      data-type="snippet"
      data-option="create"
      onSubmit={handleSubmitSnippet}>
      <div className="modal-background"></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Add New Snippet</p>
          <button
            className="button modal-close cancel is-danger"
            type="button"
            aria-label="close"></button>
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
                  placeholder="Enter a name"
                  onChange={handleChange}
                  value={name}
                />
                <button
                  title="clear"
                  className="clear-switch button"
                  onClick={(e) => props.handleClear(e, "snippets")}>
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>
            <div className="field">
              <label className="label">Snippet</label>
              <div className="control has-icons-right">
                <CodeEditorForm
                  formSnippetDetails={props.formSnippetDetails}
                  setFormSnippetDetails={props.setFormSnippetDetails}
                  snippet={snippet}></CodeEditorForm>
                <button
                  title="clear"
                  className="clear-switch button"
                  onClick={(e) => props.handleClear(e, "snippets")}>
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>

            <div className="field">
              <label className="label">Related URL</label>
              <div className="control has-icons-right">
                <input
                  name="url"
                  className="input"
                  type="text"
                  placeholder="Enter any related URL"
                  onChange={handleChange}
                  value={url}
                />
                <button
                  title="clear"
                  className="clear-switch button"
                  onClick={(e) => props.handleClear(e, "snippets")}>
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>
            <CategoryForm
              handleChange={handleChange}
              categoryMessage={categoryMessage}
              setCategoryMessage={setCategoryMessage}
              formSnippetDetails={props.formSnippetDetails}
              categoryData={props.categoryData}
              setCategoryData={props.setCategoryData}
              setRefresh={props.setRefresh}
              collectionType={"snippet"}></CategoryForm>
          </section>
        </section>
        <footer className="modal-card-foot">
          <div className="error-container">
            <p className="error-text">{errorMessage}</p>
          </div>
          <div className="field is-grouped">
            <div className="control">
              <button type="submit" className="button is-link">
                Submit
                {loader ? (
                    <div className="loader-container">
                      <img src={loaderSvg} alt="loader" />
                    </div>
                ) : <></>}
              </button>
            </div>
            <div className="control">
              <button type="button" className="button is-link cancel">
                Cancel
              </button>
            </div>
          </div>
        </footer>
      </div>
    </form>
  )
}

export default FormCardSnippet
