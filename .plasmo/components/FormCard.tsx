import { useState } from "react"

function FormCard() {
  return (
    <div className="modal" id="add-options-modal">
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
                          <input className="input" type="text" placeholder="Text input" />
                      </div>
                  </div>
                  <div className="field">
                      <label className="label">URL</label>
                      <div className="control has-icons-right">
                          <input className="input is-success" type="text" placeholder="Text input" value="bulma" />
                          <span className="icon is-small is-right">
                              <i className="fas fa-check"></i>
                          </span>
                      </div>
                      <p className="help is-success">This username is available</p>
                  </div>

                  <div className="field">
                      <label className="label">Category</label>
                      <div className="control is-flex">
                          <div className="select" id="category-select-container">
                              <select>
                                  <option>Select dropdown</option>
                              </select>
                          </div>
                          <div className="ml-3">
                              <button className="button is-link js-modal-trigger" data-target="add-category-modal">+</button>
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
                                                  <input className="input" type="text" placeholder="Text input" />
                                              </div>
                                          </div>
                                      </section>
                                      <footer className="modal-card-foot">
                                          <button className="button is-success" id="category-submit-btn">Add Category</button>
                                          <button className="button">Cancel</button>
                                      </footer>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </section>
          </section>
          <footer className="modal-card-foot">
              <div className="field is-grouped">
                  <div className="control">
                      <button className="button is-link">Submit</button>
                  </div>
                  <div className="control">
                      <button className="button is-link is-light">Cancel</button>
                  </div>
              </div>
          </footer>
      </div>
  </div>
  )
}

export default FormCard;