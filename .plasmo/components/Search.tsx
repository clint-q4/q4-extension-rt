import { useEffect, useRef, useState } from "react"

import { slideAll } from "../../content"

// import "../utils/slideToggle"
import "../../content"

export default function Search(props) {
  const [allLinks, setAllLinks] = useState([])
  const [allSnippets, setAllSnippets] = useState([])

  useEffect(() => {
    setAllLinks(props.localStorageData.links)
    setAllSnippets(props.localStorageData.snippets)
  }, [props.localStorageData])

  const keyUpTimer = useRef(null) // keyUpTimer will be a Ref object
  const keyUpTimerDelay = 300
  // Filter data based on input
  const filterSearchItems = (text, collection, setter) => {
    for (const link of collection) {
      const arr = link.list
      const filtered = arr.filter((a) => a.name.toLowerCase().includes(text))
      if (filtered.length) {
        setter.push({
          ...link,
          list: filtered
        })
      }
    }
  }
  // set the state
  const setData = (l, s) => {
    props.setfilterdData(l)
    props.setfilterdSnippetData(s)
  }

  // Search function on keyup
  const searchAll = (e) => {
    const textLengthLimit = 0;
    const clarBtn = document.getElementById("clearSearch") as HTMLInputElement
    const searchIcon = document.getElementById(
      "popupSearchIcon"
    ) as HTMLInputElement
    clearTimeout(keyUpTimer.current)
    keyUpTimer.current = setTimeout(() => {
      const links = []
      const snippets = []
      const input = document.getElementById("popup-search") as HTMLInputElement
      const filterTxt = input.value.toLowerCase()
      filterSearchItems(filterTxt, allLinks, links)
      filterSearchItems(filterTxt, allSnippets, snippets)
      if (filterTxt.length > textLengthLimit) {
        clarBtn.classList.add("active")
        searchIcon.classList.add("hide")
        setData(links, snippets)
        console.log("text")
        slideAll(".popup-buttons-container button.link-list-toggle", "down")
      } else {
        clarBtn.classList.remove("active")
        searchIcon.classList.remove("hide")
        setData(allLinks, allSnippets)
        slideAll(".popup-buttons-container button.link-list-toggle", "up")
      }
    }, keyUpTimerDelay)
  }

  return (
    <div className="field is-grouped popup-search-container">
      <div className="control is-expanded">
        <label htmlFor="popup-search" className="hidden">
          Seach
        </label>
        <input
          id="popup-search"
          className="input"
          type="text"
          placeholder="Seach away..."
          onKeyUp={searchAll}
        />
        <button
          id="clearSearch"
          title="clear"
          className="clear-switch button"
          onClick={(e) => props.handleClear(e, "search")}>
          <i className="fa-solid fa-xmark"></i>
        </button>
        <span id="popupSearchIcon" className="popup-search-icon">
          <i className="fa-solid fa-magnifying-glass"></i>
        </span>
      </div>
    </div>
  )
}
