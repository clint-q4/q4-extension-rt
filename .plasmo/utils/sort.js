import { log } from "console";
import {createIndexArray} from './apiCalls';

function slist (target, args) {
  // (A) SET CSS + GET ALL LIST ITEMS
  target.classList.add("slist");
  let items = target.querySelectorAll(".popup-buttons-container-sublist"), current = null;
  // (B) MAKE ITEMS DRAGGABLE + SORTABLE
  for (let i of items) {
    // (B1) ATTACH DRAGGABLE
    i.draggable = true;

    // (B2) DRAG START - YELLOW HIGHLIGHT DROPZONES
    i.ondragstart = (ev) => {
      current = i;
      for (let it of items) {
        if (it != current) { it.classList.add("hint"); }
      }
    };

    // (B3) DRAG ENTER - RED HIGHLIGHT DROPZONE
    i.ondragenter = (ev) => {
      if (i != current) { i.classList.add("active"); }
    };

    // (B4) DRAG LEAVE - REMOVE RED HIGHLIGHT
    i.ondragleave = () => {
      i.classList.remove("active");
    };

    // (B5) DRAG END - REMOVE ALL HIGHLIGHTS
    i.ondragend = () => { for (let it of items) {
      it.classList.remove("hint");
      it.classList.remove("active");
    }};

    // (B6) DRAG OVER - PREVENT THE DEFAULT "DROP", SO WE CAN DO OUR OWN
    i.ondragover = (evt) => { evt.preventDefault(); };

    // (B7) ON DROP - DO SOMETHING
    i.ondrop = (evt) => {
      evt.preventDefault();
      if (i != current) {
        let currentpos = 0, droppedpos = 0;
        for (let it=0; it<items.length; it++) {
          if (current == items[it]) { currentpos = it; }
          if (i == items[it]) { droppedpos = it; }
        }

        const divs = document.querySelectorAll(`.popup-buttons-container.${args.parentCont} .popup-buttons-container-sublist`)
        const oldOrder = [];
        const reorder = (args) => {
          const result = Array.from(args.list);
          const [removed] = result.splice(args.startIndex, 1);
          result.splice(args.endIndex, 0, removed);
          for(let ind in result) {
            result[ind].index = ind;
          }
          return result;
        }
        const arr = Array.from(divs)
        for (const [index, div] of arr.entries()) {
          const obj = {
            name: div.dataset.category,
            index: index
          }
          oldOrder.push(obj);
        }
        const newOrder = reorder({
          list: oldOrder,
          startIndex: currentpos, 
          endIndex: droppedpos
        })

        if(args.parentCont === 'quick-links') {
          args.setIndexLinks(newOrder);
          const links = args.localStorageData.links;
          const data = {
            indexOrder: newOrder,
            name: 'links'
          }
          for(l of links) {
            for(o of newOrder) {
              if(l.name === o.name) {
                l.index = o.index;
              }
            }
          }
          links.sort((a,b) => (a.index - b.index));
          args.setLocalStorageData({
            ...args.localStorageData,
            links: links
          })
          args.setfilterdData(links)
          createIndexArray(data)
        } else {
          args.setIndexSnippets(newOrder)
          const snippets = args.localStorageData.snippets;
          const data = {
            indexOrder: newOrder,
            name: 'snippets'
          }
          for(l of snippets) {
            for(o of newOrder) {
              if(l.name === o.name) {
                l.index = o.index;
              }
            }
          }
          snippets.sort((a,b) => (a.index - b.index));
          args.setLocalStorageData({
            ...args.localStorageData,
            snippets: snippets
          })
          args.setfilterdSnippetData(snippets)
          createIndexArray(data)
  
        }
      }
    };
  }
}

export default slist;