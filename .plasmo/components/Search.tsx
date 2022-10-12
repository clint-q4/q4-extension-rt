

export default function Search() {
  return (
    <div className="field is-grouped popup-search-container">
      <p className="control is-expanded">
        <input className="input" type="text" placeholder="Seach away..." />
      </p>
      <p className="control">
        <a className="button is-info">
          Search
        </a>
      </p>
    </div>
  )
}