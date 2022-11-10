

import { useRef, useState } from "react"
import '../utils/slideToggle';
import "../../content";

export default function Search(props) {
  const [allLinks,] = useState(props.filterdData)
  const [allSnippets,] = useState(props.filterdSnippetData)
  const keyUpTimer = useRef(null); // keyUpTimer will be a Ref object
  const keyUpTimerDelay = 300;
  function searchAll(e) {
    const clarBtn = document.getElementById('clearSearch') as HTMLInputElement;
    const searchIcon = document.getElementById('popupSearchIcon') as HTMLInputElement;
    clearTimeout(keyUpTimer.current);
    keyUpTimer.current = setTimeout(() => {
      const links = {};
      const snippets = {}
      const input = document.getElementById('popup-search') as HTMLInputElement;
      const filterTxt = input.value.toLowerCase();
        for (const property in allLinks) {
          const arr = allLinks[property];
          const filtered = arr.filter(a => a.name.toLowerCase().includes(filterTxt));
          if(filtered.length) {
            links[property] = filtered;
          }
        }
        for (const property in allSnippets) {
          const arr = allSnippets[property];
          const filtered = arr.filter(a => a.name.toLowerCase().includes(filterTxt));
          if(filtered.length) {
            snippets[property] = filtered;
          }
        }
      if(filterTxt.length) {
        clarBtn.classList.add('active');
        searchIcon.classList.add('hide');
        props.setfilterdData(links);
        props.setfilterdSnippetData(snippets);
        const buttons = document.querySelectorAll<HTMLElement>('.popup-buttons-container button.link-list-toggle');
        for(let b of buttons) {
          const id = b.dataset.toggle;
          if(id) {
            const linkTarget = document.getElementById(id);
            const btns = linkTarget.querySelectorAll('.button.is-link');
            (linkTarget as HTMLInputElement).slideDown(300);
            // console.log(input);
            // setTimeout(() => {
            //   (linkTarget as HTMLInputElement).slideDown(300);
            // }, 500)
          }
        }
      } else {
        clarBtn.classList.remove('active');
        searchIcon.classList.remove('hide');
        props.setfilterdData(allLinks);
        props.setfilterdSnippetData(allSnippets);
      }
    }, keyUpTimerDelay);
  }

  // console.log(props);
  return (
    <div className="field is-grouped popup-search-container">
      <div className="control is-expanded">
        <label htmlFor="popup-search" className="hidden">Seach</label>
        <input id="popup-search" className="input" type="text" placeholder="Seach away..." onKeyUp={searchAll} />
        <button 
          id="clearSearch"
          title="clear"
          className="clear-switch button"
          onClick={e => props.handleClear(e, 'search')}
        ><i className="fa-solid fa-xmark"></i></button>
        <span id="popupSearchIcon" className="popup-search-icon"><i className="fa-solid fa-magnifying-glass"></i></span>
      </div>
    </div>
  )
}