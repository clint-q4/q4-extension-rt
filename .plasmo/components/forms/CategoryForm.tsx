import { useEffect, useState } from "react"

import {
  createCategory,
  deleteCategory,
  getLists,
  updateCategory
} from "../../utils/apiCalls"

function CategoryForm(props) {
  const [addCategoryMessage, setAddCategoryMessage] = useState("")

  let category
  props.collectionType === "link"
    ? (category = props.formLinkDetails.category)
    : (category = props.formSnippetDetails.category)

  async function categoryHandleSubmit(e) {
    e.preventDefault()
    const input = document.getElementById(
      `${props.collectionType}CategoryInput`
    ) as HTMLInputElement
    const inpValue = input.value
    const toggleState = (
      document.querySelector(
        `.switch-checkbox.${props.collectionType}`
      ) as HTMLInputElement
    ).checked
    const linked = toggleState ? "both" : `${props.collectionType}`

    if (inpValue.length) {
      const data = {
        name: inpValue,
        linked: linked
      }
      const record = await createCategory(data)
      if (record) {
        const categoryStatus = document.querySelector(
          `#${props.collectionType}AddCategoryModal .add-category-status`
        ) as HTMLInputElement
        categoryStatus.style.color = "green"
        const temp = `${record.name} has been added to the category list!`
        setAddCategoryMessage(temp)
        const result = await getLists("category")
        if (result) {
          props.setCategoryData(result)
          input.value = ""
          setTimeout(function () {
            const modal = document.getElementById(
              `${props.collectionType}AddCategoryModal`
            ) as HTMLInputElement
            modal.classList.remove("is-active")
            setAddCategoryMessage("")
          }, 1000)
        }
      } else {
        setAddCategoryMessage("Something went wrong!")
      }
    }
  }

  async function triggerCategoryUpdate(e) {
    e.preventDefault()
    const _t = e.target
    const match = _t.matches(`#${props.collectionType}UpdateCategory`)
    if (match) {
      const categoryInput = _t.parentElement.previousSibling
      const categoryID = categoryInput.parentElement.dataset.value
      const updatedCategory = categoryInput.value
      _t.style.display = "none"
      _t.previousSibling.style.display = "flex"
      if (updatedCategory && categoryID) {
        const data = {
          name: updatedCategory
        }
        const response = updateCategory(data, categoryID)
        const textInput = document.createElement("span")
        textInput.classList.add("categoryName")
        textInput.textContent = updatedCategory
        categoryInput.replaceWith(textInput)
        const categoryStatus = document.querySelector(
          `#${props.collectionType}RemoveCategoryModal .category-status`
        ) as HTMLInputElement
        response.then((res) => {
          if (res.name) {
            const temp = `Catgeory has been updated to ${res.name}`
            categoryStatus.style.color = "green"
            props.setCategoryMessage(temp)
            props.setRefresh(true)
            setTimeout(function () {
              props.setCategoryMessage("")
            }, 1000)
          } else {
            const temp = "Sorry! Something went wrong"
            props.setCategoryMessage(temp)
            categoryStatus.style.color = "red"
          }
        })
      }
    }
  }

  function modifyCategory(e) {
    e.preventDefault()
    const _t = e.target
    const match = _t.matches(`#${props.collectionType}ModifyCategory`)
    if (!match) return

    const focusEvent = new Event("focus")
    const categoryElement = _t.parentElement.previousSibling
    const categoryName = categoryElement.textContent
    _t.style.display = "none"
    _t.nextSibling.style.display = "flex"
    if (categoryName) {
      const textInput = document.createElement("input")
      textInput.classList.add("form-control")
      textInput.value = categoryName
      categoryElement.replaceWith(textInput)
      textInput.dispatchEvent(focusEvent)
    }
  }

  async function triggerDeleteCategory(e) {
    e.preventDefault()
    const _t = e.target
    const match = _t.matches(`#${props.collectionType}DeleteCategory`)
    if (match) {
      const categoryID = _t.closest(".control").dataset.value
      const categoryStatus = document.querySelector(
        `#${props.collectionType}RemoveCategoryModal .category-status`
      ) as HTMLInputElement
      if (categoryID) {
        const response = deleteCategory(categoryID)
        response
          .then((res) => {
            if (!res.status) {
              props.setCategoryMessage(res.reason)
              categoryStatus.style.color = "red"
            } else {
              categoryStatus.style.color = "green"
              props.setCategoryMessage(
                "Category has been deleted successfully!"
              )
              getLists("category").then((list) => {
                props.setCategoryData(list)
              })
              setTimeout(() => {
                props.setCategoryMessage("")
              }, 1000)
            }
          })
          .catch((err) => {
            categoryStatus.style.color = "red"
            const temp = "Make sure that the category does not have any links!"
            props.setCategoryMessage(temp)
            setTimeout(() => {
              props.setCategoryMessage("")
            }, 1000)
          })
      }
    }
  }

  return (
    <div className="field">
      <label className="label">Category</label>
      <div className="control is-flex">
        <div
          className="select"
          id={`${props.collectionType}CategorySelectCont`}>
          <select
            title="category"
            name="category"
            onChange={props.handleChange}
            value={category}>
            <option value="default">Select a category</option>
            {props.categoryData
              .filter(
                (cat) =>
                  cat.linked === props.collectionType || cat.linked === "both"
              )
              .map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
          </select>
        </div>
        <div className="ml-3">
          <button
            type="button"
            title="add-category"
            className="button is-link js-modal-trigger mr-2"
            data-target={`${props.collectionType}AddCategoryModal`}>
            <i className="fa-solid fa-folder-plus"></i>
          </button>
          <button
            type="button"
            title="delete-category"
            className="button js-modal-trigger"
            data-target={`${props.collectionType}RemoveCategoryModal`}>
            <i className="fa-solid fa-trash"></i>
          </button>
          <div className="modal" id={`${props.collectionType}AddCategoryModal`}>
            <div className="modal-background"></div>
            <div className="modal-card">
              <header className="modal-card-head">
                <p className="modal-card-title">Add Category</p>
                <button
                  title="cancel"
                  type="button"
                  className="delete button modal-close is-danger"
                  aria-label="close"></button>
              </header>
              <section className="modal-card-body">
                <div className="field">
                  <label className="label">Category Name</label>
                  <div className="control">
                    <input
                      id={`${props.collectionType}CategoryInput`}
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
                      <input
                        title="switch"
                        className={`switch-checkbox ${props.collectionType}`}
                        type="checkbox"
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
              </section>
              <footer className="modal-card-foot is-flex-direction-column	is-flex is-align-items-flex-start">
                <div className="category-status-container">
                  <p className="add-category-status mb-3">
                    {addCategoryMessage}
                  </p>
                </div>
                <div className="buttons-container">
                  <button
                    className="button"
                    id={`${props.collectionType}CategorySubmitBtn`}
                    onClick={categoryHandleSubmit}>
                    Add Category
                  </button>
                  <button type="button" className="button cancel">
                    Cancel
                  </button>
                </div>
              </footer>
            </div>
          </div>
          <div
            className="modal"
            id={`${props.collectionType}RemoveCategoryModal`}>
            <div className="modal-background"></div>
            <div className="modal-card">
              <header className="modal-card-head">
                <p className="modal-card-title">Remove/Update Category</p>
                <button
                  type="button"
                  className="button modal-close cancel is-danger"
                  aria-label="close"></button>
              </header>
              <section className="modal-card-body">
                <div className="field">
                  <h3 className="label">Categories</h3>
                  {props.categoryData
                    .filter(
                      (cat) =>
                        cat.linked === props.collectionType ||
                        cat.linked === "both"
                    )
                    .map((item) => (
                      <div
                        className="control"
                        key={item.id}
                        data-value={item.id}>
                        <span className="categoryName">{item.name}</span>
                        <div className="buttons-container">
                          <button
                            id={`${props.collectionType}ModifyCategory`}
                            className="button"
                            title="modify category"
                            type="button"
                            onClick={modifyCategory}>
                            <i className="fa-solid fa-pen-to-square"></i>
                          </button>
                          <button
                            id={`${props.collectionType}UpdateCategory`}
                            className="button"
                            title="update category"
                            type="button"
                            onClick={triggerCategoryUpdate}
                            style={{ display: "none" }}>
                            <i className="fa-regular fa-floppy-disk"></i>
                          </button>
                          <button
                            id={`${props.collectionType}DeleteCategory`}
                            className="button"
                            title="delete category"
                            type="button"
                            onClick={triggerDeleteCategory}>
                            <i className="fa-regular fa-trash-can"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </section>
              <footer className="modal-card-foot">
                <p className="category-status">{props.categoryMessage}</p>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoryForm
