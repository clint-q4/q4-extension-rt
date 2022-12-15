import type { PlasmoContentScript } from "plasmo"
import useLocalStorage from "use-local-storage"

import { getIndexArray } from "./.plasmo/utils/apiCalls"

// import {createIndexArray} from './.plasmo/utils/apiCalls';

export const config: PlasmoContentScript = {
  matches: ["<all_urls>"]
}

// Not using this...
export const groupLinks = (categoryData, linksData) => {
  if (!categoryData.length || !linksData.length) return
  const groupedData = linksData.reduce((groups, item) => {
    const group =
      groups[categoryData.find((c) => c.id === item.category).name] || []
    group.push(item)
    groups[categoryData.find((c) => c.id === item.category).name] = group
    return groups
  }, {})

  return groupedData
}
// Group and sort the items
export const groupAndSort = (
  categoryData,
  linksData,
  indexArr,
  setIndexArray,
  createIndexArray,
  type
) => {
  if (!categoryData.length || !linksData.length) return
  const res = []
  for (let data of categoryData) {
    const obj = {
      name: data.name,
      list: linksData.filter((l) => l.category === data.id)
    }

    if (obj.list.length) {
      res.push(obj)
    }
  }

  if (indexArr.length) {
    for (let inde of indexArr) {
      res.find((el) => {
        if (el.name === inde.name) {
          el.index = inde.index
        }
      })
    }
    res.sort((a, b) => a.index - b.index)
  } else {
    const indArr = []
    res.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0))
    for (let ind in res) {
      const obj = {
        name: res[ind].name,
        index: ind
      }
      res[ind].index = ind
      indArr.push(obj)
    }

    const data = {
      indexOrder: indArr,
      name: type
    }
    setIndexArray(indArr)
    createIndexArray(data)
  }
  return res
}

export const checkSite = async () => {
  let [currentTab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  })
  chrome.scripting.executeScript(
    {
      target: { tabId: currentTab.id },
      world: "MAIN",
      func: checkQ4Site
    },
    (result) => {
      if (result && result.length) {
        for (let r of result) {
          const q4Logo = document.querySelector<HTMLElement>(
            "#q4-site-verification"
          )
          if (r.result) {
            q4Logo.style.display = "flex"
          } else {
            q4Logo.style.display = "none"
            document.querySelector<HTMLElement>(
              ".popup-buttons-container.cms-links"
            ).style.display = "none"
          }
        }
      }
    }
  )

  // add a save button below snippets
  // function checkCodeEditor() {
  //   const temp = `
  //     <div class="saveSnippetContainer">
  //       <button class="saveSnippetBtn">Save</button>
  //     </div>
  //   `;
  //   if (document.querySelector("pre code")) {
  //     const all = (document.querySelectorAll("code") as NodeListOf<Element>);
  //     for (let el of all) {
  //       const mainCont = el.closest("pre");
  //       if(mainCont && mainCont.nodeName.toLowerCase() === "pre") {
  //         mainCont.insertAdjacentHTML("afterend", temp);
  //       }
  //     }
  //   }
  // }

  function checkQ4Site() {
    let q4SiteVerification = false
    if (document.querySelector(".module-q4-credits")) {
      q4SiteVerification = true
    } else if (document.location.href.includes("q4web")) {
      q4SiteVerification = true
    }
    return q4SiteVerification
  }
}

export const getCurrentTabLink = async (snip, snipDetails) => {
  let [currentTab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  })
  if (currentTab.title) {
    chrome.scripting.executeScript(
      {
        target: { tabId: currentTab.id },
        world: "MAIN",
        func: checkLink
      },
      (result) => {
        if (result) {
          for (let r of result) {
            if (r.result) {
              snipDetails({
                ...snip,
                name: currentTab.title,
                url: r.result.url,
                category: "default"
              })
            }
          }
        } else {
          return "Sorry! Something went wrong!"
        }
      }
    )
  }

  function checkLink() {
    const o = {
      url: document.location.href
    }
    return o
  }
}

// This function is used to log into the Q4 site from the popup.html page
// The function is executed when the login button is clicked
// The function takes the current tab and executes the loginQ4Site function
// The loginQ4Site function is defined in the content.js file

export const loginEditButtons = () => {
  let loginButton = document.getElementById("q4-site-login-button")
  let previewEditButton = document.getElementById("q4-site-preview-button")

  loginButton.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: loginQ4Site
    })
  })

  previewEditButton.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: loadPreviewEditPage
    })
  })
}

// this function opens the login page of a q4 site
// it checks if the user is already on the login page
// and if so, it alerts the user that they are already on it
// it then opens the login page

export const loginQ4Site = () => {
  const baseUrl = `https://${location.hostname}`
  if (
    baseUrl.includes("s4.q4web.com") &&
    location.pathname.includes("preview/preview.aspx")
  ) {
    alert("You are already in a preview Site")
  } else {
    window.open(`${baseUrl}/login.aspx`)
  }
}

// This code will open the Q4 CMS in a new tab, based on the current page you are on in Q4 Preview.
// If you are on a press release preview page, then it will open the press release in the CMS
// If you are on an event preview page, then it will open the event in the CMS
// If you are on a regular page, then it will open the page in the CMS

export const loadPreviewEditPage = () => {
  const base = `https://${location.hostname}`
  if (
    base.includes("s4.q4web.com") &&
    location.pathname.includes("preview/preview.aspx")
  ) {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    let id = urlParams.get("SectionId")
    let sectionId = "f6d80133-c225-4a4e-aa62-d96e8cb2ac66"
    const languageId = urlParams.get("LanguageId")
    if (urlParams.get("PressReleaseId")) {
      id = urlParams.get("PressReleaseId")
      sectionId = "a9a908cb-21fa-46a6-8de1-05e23027c007"
    } else if (urlParams.get("EventId")) {
      id = urlParams.get("EventId")
      sectionId = "a8a3d569-db57-40e4-b845-9fd6c267b0b3"
    }
    window.open(
      `${base}/admin/default.aspx?ItemID=${id}&LanguageId=${languageId}&SectionId=${sectionId}`,
      "_blank"
    )
  } else {
    alert("This is not a Q4 Website Preview.")
  }
}

/**
 * Toggles the active class on a link-list-toggle element
 * and calls the closeAllOptions function to close other options
 * if any are open.
 *
 * @param {Event} e - the event object
 */
export const linkToggle = (e) => {
  let _t = e.target
  let match = _t.matches(".link-list-toggle")
  match ? _t : (_t = _t.closest(".link-list-toggle"))
  if(!match) return;
  const id = _t.dataset.toggle
  _t.classList.toggle("active")
  closeAllOptions()
  ;(document.getElementById(`${id}`) as HTMLInputElement).slideToggle(300)
}

// Function to toggle all the items in the header menu
// @param e - the event object
// @param parentEl - the parent element
// @return void

export const toggleAll = (e, parentEl) => {
  e.preventDefault()
  let _t = e.target
  let match = _t.matches(".button")
  _t = match ? _t : _t.parentElement
  match = _t.matches(".button")
  if (match) {
    const toggleID = _t.getAttribute("id")
    const container = document.querySelector(`${parentEl}`)
    const toggleLinks = document.querySelectorAll(
      `${parentEl} .link-list-toggle`
    ) as NodeListOf<Element>
    if (!container.classList.contains(toggleID)) {
      container.classList.add(toggleID)
      _t.classList.add("active")
      for (let link of toggleLinks) {
        const id = (link as HTMLInputElement).dataset.toggle
        link.classList.add("active")
        const linkTarget = document.getElementById(id)
        ;(linkTarget as HTMLInputElement).slideDown(300)
      }
    } else {
      container.classList.remove(toggleID)
      _t.classList.remove("active")
      for (let link of toggleLinks) {
        const id = (link as HTMLInputElement).dataset.toggle
        const linkTarget = document.getElementById(id)
        link.classList.remove("active")
        ;(linkTarget as HTMLInputElement).slideUp(300)
      }
    }
  }
}

// this function is used to slide all elements up or down based on the toggleClass and direction arguments
// toggleClass is the class name of the elements to be toggled, direction is the direction to slide
// the function is called on a timeout of 100ms to allow for the toggled elements to be in the DOM
// the function iterates over the toggled elements and slides them up or down based on the direction argument
// the id of the button is used to find the target element to slide

export const slideAll = (toggleClass, direction) => {
  setTimeout(() => {
    const buttons = document.querySelectorAll<HTMLElement>(toggleClass)
    for (let b of buttons) {
      const id = b.dataset.toggle
      if (id) {
        const linkTarget = document.getElementById(id)
        direction === "up"
          ? (linkTarget as HTMLInputElement).slideUp(300)
          : (linkTarget as HTMLInputElement).slideDown(300)
      }
    }
  }, 100)
}

export const toggleOptions = (e) => {
  e.preventDefault()
  let target = e.target
  let isTrigger = target.matches(".options-trigger")
  target = isTrigger ? target : target.parentElement
  isTrigger = target.matches(".options-trigger")
  if (isTrigger) {
    const toggleContainer = target.parentElement.nextSibling
    if (!toggleContainer.classList.contains("active")) {
      target.classList.toggle("active")
      toggleContainer.classList.add("active")
      ;(toggleContainer as HTMLInputElement).slideDown(300)
    } else {
      toggleContainer.classList.remove("active")
      target.classList.toggle("active")
      ;(toggleContainer as HTMLInputElement).slideUp(300)
    }
  }
}

// closeAllOptions closes all active button option containers
// and deactivates the associated button

export const closeAllOptions = () => {
  const openOptions = document.querySelectorAll(
    ".button-options-container.active"
  );
  const btnActivs = document.querySelectorAll(".options-trigger.active");
  for (let btn of btnActivs) {
    btn.classList.remove("active");
  }
  for (let opts of openOptions) {
    opts.classList.remove("active");
    opts.slideToggle(100);
  }
};

export const initDeleteOrModify = (e) => {
  e.preventDefault()
  let _t = e.target
  const match = _t.matches(".button")
  _t = match ? _t : _t.parentElement
  const id = _t.getAttribute("id") || ""
  const containerAll = document.querySelectorAll(
    ".popup-buttons-container"
  ) as NodeListOf<Element>
  for (let container of containerAll) {
    const pr = container.classList.contains("quick-links")
      ? ".quick-links"
      : ".quick-snippets"
    const toggleLinks = document.querySelectorAll(
      `${pr} .link-list-toggle`
    ) as NodeListOf<Element>
    switch (id) {
      case "update-links":
        if (!container.classList.contains("update-links-init")) {
          container.classList.add("update-links-init")
          // _t.textContent = 'Updating...';
          _t.classList.add("active")
          for (let link of toggleLinks) {
            const id = (link as HTMLInputElement).dataset.toggle
            link.classList.add("active")
            const linkTarget = document.getElementById(id)
            ;(linkTarget as HTMLInputElement).slideDown(300)
          }
        } else {
          container.classList.remove("update-links-init")
          // _t.textContent = 'Update';
          _t.classList.remove("active")
          for (let link of toggleLinks) {
            const id = (link as HTMLInputElement).dataset.toggle
            const linkTarget = document.getElementById(id)
            link.classList.remove("active")
            ;(linkTarget as HTMLInputElement).slideUp(300)
          }
        }
        break

      case "delete-links":
        if (!container.classList.contains("delete-links-init")) {
          container.classList.add("delete-links-init")
          // _t.textContent = 'Deleting...';
          _t.classList.add("active")
          for (let link of toggleLinks) {
            const id = (link as HTMLInputElement).dataset.toggle
            link.classList.add("active")
            const linkTarget = document.getElementById(id)
            ;(linkTarget as HTMLElement).slideDown(300)
          }
        } else {
          container.classList.remove("delete-links-init")
          // _t.textContent = 'Delete';
          _t.classList.remove("active")
          for (let link of toggleLinks) {
            const id = (link as HTMLInputElement).dataset.toggle
            const linkTarget = document.getElementById(id)
            link.classList.remove("active")
            ;(linkTarget as HTMLInputElement).slideUp(300)
          }
        }
        break
    }
  }
}

// resendverification sends a verification email to the user
export const resendVerificatioOnClick = async (buttonId, email) => {
  document.getElementById(buttonId).classList.add("sent");
  
}

// fetch data from database and group them with their categories
export const fetchData = async (obj) => {
  const apiLinksData = (await obj.getLists("websites")) || []
  const apiSnippetData = (await obj.getLists("snippets")) || []
  const apiCategoryData = (await obj.getLists("category")) || []
  const indexData = (await getIndexArray()) || []
  let indexLinks = []
  let indexSnippets = []
  if (indexData.length) {
    for (let arr of indexData) {
      if (arr.name === "links") {
        obj.setIndexLinks(arr.indexOrder)
        indexLinks = arr.indexOrder
      } else if (arr.name === "snippets") {
        obj.setIndexSnippets(arr.indexOrder)
        indexSnippets = arr.indexOrder
      }
    }
  }

  let localData = {}

  if (apiLinksData.length && apiCategoryData.length) {
    const allLinks = groupAndSort(
      apiCategoryData,
      apiLinksData,
      indexLinks,
      obj.setIndexLinks,
      obj.createIndexArray,
      "links"
    )
    localData["links"] = allLinks
    obj.setfilterdData(allLinks)
  } else if (!apiLinksData.length && apiCategoryData.length) {
    localData["links"] = []
  }
  if (apiSnippetData.length && apiCategoryData.length) {
    const allSnippets = groupAndSort(
      apiCategoryData,
      apiSnippetData,
      indexSnippets,
      obj.setIndexSnippets,
      obj.createIndexArray,
      "snippets"
    )
    localData["snippets"] = allSnippets
    obj.setfilterdSnippetData(allSnippets)
  } else if (!apiSnippetData.length && apiCategoryData.length) {
    localData["snippets"] = []
  }
  if (apiCategoryData.length) {
    localData["categories"] = apiCategoryData
    obj.setCategoryData(apiCategoryData)
  }

  const sessionData = new Date().toLocaleString()
  obj.setRefreshSession(sessionData)
  obj.setLocalStorageData(localData)
}
