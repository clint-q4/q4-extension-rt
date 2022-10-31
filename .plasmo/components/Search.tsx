

import { useRef } from "react"
import '../utils/slideToggle';
import "../../content";

export default function Search(props) {
  const localLinks = JSON.parse(localStorage.getItem('links'));
  const localSnippets = JSON.parse(localStorage.getItem('snippets'));
  const keyUpTimer = useRef(null); // keyUpTimer will be a Ref object
  const keyUpTimerDelay = 300;
  // const propLinks = props.filterdData;
  // const propSnippets = props.filterdSnippetData;
  function searchAll() {
    clearTimeout(keyUpTimer.current);
    keyUpTimer.current = setTimeout(() => {
      const links = {};
      const snippets = {}
      const input = document.getElementById('popup-search') as HTMLInputElement;
      const filterTxt = input.value.toLowerCase();
        for (const property in localLinks) {
          const arr = localLinks[property];
          const filtered = arr.filter(a => a.name.toLowerCase().includes(filterTxt));
          if(filtered.length) {
            links[property] = filtered;
          }
        }
        for (const property in localSnippets) {
          const arr = localSnippets[property];
          const filtered = arr.filter(a => a.name.toLowerCase().includes(filterTxt));
          if(filtered.length) {
            snippets[property] = filtered;
          }
        }
      if(filterTxt.length) {
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
        props.setfilterdData(localLinks);
        props.setfilterdSnippetData(localSnippets);
      }
    }, keyUpTimerDelay);
  }

  // console.log(props);
  return (
    <div className="field is-grouped popup-search-container">
      <div className="control is-expanded">
        <label htmlFor="popup-search" className="hidden">Seach</label>
        <input id="popup-search" className="input" type="text" placeholder="Seach away..." onKeyUp={searchAll} />
        <span className="popup-search-icon"><i className="fa-solid fa-magnifying-glass"></i></span>
      </div>
    </div>
  )
}