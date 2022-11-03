import type { PlasmoContentScript } from "plasmo";

export const config: PlasmoContentScript = {
  matches: ["<all_urls>"]
}

export const checkSite = (async () => {
  let [currentTab] = await chrome.tabs.query({ active: true, currentWindow: true });
  console.log(currentTab);
  chrome.scripting.executeScript({
    target: { tabId: currentTab.id },
    world: "MAIN",
    func: checkQ4Site,
  },
  (result) => {
    console.log(result);
    for (let r of result) {
      if(r.result) {
        document.querySelector('#q4-site-verification').innerHTML = '<span class="q4icon">Q4</span>';
      } else {
        document.querySelector('#q4-site-verification').innerHTML = '';
        document.querySelector<HTMLElement>('.popup-buttons-container').style.display = 'none';
      }
    }
  });

  function checkQ4Site() {
    let q4SiteVerification = false;
    if(document.querySelector('.module-q4-credits')) {
      q4SiteVerification = true;
    } else if (document.location.href.includes('q4web')) {
      q4SiteVerification = true;
    }
    return q4SiteVerification;
  }
});

export const getCurrentTabLink = (async (snip, snipDetails) => {
  let [currentTab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if(currentTab.title) {
    chrome.scripting.executeScript({
      target: { tabId: currentTab.id },
      world: "MAIN",
      func: checkLink,
    },
    (result) => { 
      if(result) {
        for (let r of result) {
          if(r.result) {
            snipDetails({
              ...snip,
              name: currentTab.title,
              url: r.result.url
            })
          } 
        } 
      } else {
        return 'Sorry! Something went wrong!';
      }
    });
  }

  function checkLink() {
    const o = {
      url: document.location.href
    };
    return o;
  }
});

export const loginEditButtons = () => {
  let loginButton = document.getElementById("q4-site-login-button");
  let previewEditButton = document.getElementById("q4-site-preview-button");

  loginButton.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: loginQ4Site,
    });
  });

  previewEditButton.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: loadPreviewEditPage,
    });
  });
}

export const loginQ4Site = () => {
  const baseUrl = `https://${location.hostname}`;  
  if(baseUrl.includes("s4.q4web.com") && location.pathname.includes("preview/preview.aspx")) {
    alert("You are already in a preview Site");
  } else {
    window.open(`${baseUrl}/login.aspx`);
  }
}

export const loadPreviewEditPage = () => {
  const base = `https://${location.hostname}`;
  if (base.includes("s4.q4web.com") && location.pathname.includes("preview/preview.aspx")) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let id = urlParams.get("SectionId");
    let sectionId = "f6d80133-c225-4a4e-aa62-d96e8cb2ac66";
    const languageId = urlParams.get("LanguageId");
    if (urlParams.get("PressReleaseId")) {
      id = urlParams.get("PressReleaseId");
      sectionId = "a9a908cb-21fa-46a6-8de1-05e23027c007";
    } else if (urlParams.get("EventId")) {
      id = urlParams.get("EventId");
      sectionId = "a8a3d569-db57-40e4-b845-9fd6c267b0b3";
    }
    window.open(`${base}/admin/default.aspx?ItemID=${id}&LanguageId=${languageId}&SectionId=${sectionId}`, "_blank");
  } else {
    alert("This is not a Q4 Website Preview.");
  }
}

// Not using this...
export const slideToggle = (e) => {
  e.preventDefault();
  const el = e.target;
  const id = el.dataset.toggle ? el.dataset.toggle : el.closest('button').dataset.toggle;
  const t = document.querySelector(`button[data-toggle="${id}"]`);
  var container = document.getElementById(id);
  const statE = !container.classList.contains('active');
  const statT = !t.classList.contains('active');
  if (statE && statT) {
    container.classList.add('active');
    t.classList.add('active');
    container.style.height = 'auto';
    const height = container.clientHeight + 'px';
    container.style.height = '0px';
    setTimeout(function () {
      container.style.height = height;
    }, 0);
  } else {
    container.style.height = '0px';
    t.classList.remove('active');
    container.addEventListener('transitionend', function () {
      container.classList.remove('active');
    }, {
      once: true
    });
  }
}

export const linkToggle = (e) => {
  let _t = e.target;
  let match = _t.matches('.link-list-toggle');
  match ? _t : _t = _t.closest('.link-list-toggle');
  console.log(_t);
  if(_t.matches('.link-list-toggle')) {
    const id = _t.dataset.toggle;
    _t.classList.toggle('active');
    (document.getElementById(`${id}`) as HTMLInputElement).slideToggle(300);
  }
}

export const groupLinks = (categoryData, linksData, setfilterdData, name) => {
  if(categoryData.length && linksData.length) {
    const groupedData = linksData.reduce((groups, item) => {
      const group = (groups[categoryData.find(c => c.id === item.category).name] || []);
      group.push(item);
      groups[categoryData.find(c => c.id === item.category).name] = group;
      return groups;
    }, {});
    localStorage.setItem(name, JSON.stringify(groupedData));
    const groupedLocalData = JSON.parse(localStorage.getItem(name));
    console.log(groupedLocalData, 'group');
    setfilterdData(groupedLocalData);
  } else {
    const groupedLocalData = JSON.parse(localStorage.getItem(name));
    if(groupedLocalData) {
      setfilterdData(groupedLocalData);
    }
  }
}

export const toggleAll = (e, parentEl) => {
  e.preventDefault();
  let _t = e.target;
  let match = _t.matches('.button');
  _t = match ? _t : _t.parentElement;
  match = _t.matches('.button');
  if(match) {
    const toggleID = _t.getAttribute('id');
    const container = document.querySelector(`${parentEl}`)
    const toggleLinks = (document.querySelectorAll(`${parentEl} .link-list-toggle`) as NodeListOf<Element>);
    if(!container.classList.contains(toggleID)) {
      container.classList.add(toggleID)
      _t.classList.add('active');
      for(let link of toggleLinks) {
        const id  = (link as HTMLInputElement).dataset.toggle;
        console.log(link.classList)
        link.classList.add('active');
        const linkTarget = document.getElementById(id);
        (linkTarget as HTMLInputElement).slideDown(300);
      }
    } else {
      container.classList.remove(toggleID)
      _t.classList.remove('active');
      for(let link of toggleLinks) {
        const id  = (link as HTMLInputElement).dataset.toggle;
        const linkTarget = document.getElementById(id);
        link.classList.remove('active');
        (linkTarget as HTMLInputElement).slideUp(300);
      }
    }
  }
}


export const toggleOptions = (e) => {
  e.preventDefault();
  console.log('check', e.target);
  let _t = e.target;
  let match = _t.matches('.options-trigger');
  _t = match ? _t : _t.parentElement;
  match = _t.matches('.options-trigger');
  if(match) {
    const toggleCont = _t.parentElement.nextSibling;
    if(!toggleCont.classList.contains('active')) {
      _t.classList.toggle('active');
      toggleCont.classList.add('active');
      (toggleCont as HTMLInputElement).slideDown(300);
    } else {
      toggleCont.classList.remove('active');
      _t.classList.toggle('active');
      (toggleCont as HTMLInputElement).slideUp(300);
    }
    console.log(toggleCont);
  }
}

export const initDeleteOrModify = (e) => {
  e.preventDefault();
  let _t = e.target;
  console.log(_t);
  const match = _t.matches('.button');
  _t = match ? _t : _t.parentElement;
  const id = _t.getAttribute('id') || '';
  const containerAll = document.querySelectorAll('.popup-buttons-container') as NodeListOf<Element>;
  for (let container of containerAll) {
    const pr = container.classList.contains('quick-links') ? '.quick-links' : '.quick-snippets';
          const toggleLinks = (document.querySelectorAll(`${pr} .link-list-toggle`) as NodeListOf<Element>);
    switch (id) {
      case 'update-links':
        if(!container.classList.contains('update-links-init')) {
          container.classList.add('update-links-init')
          // _t.textContent = 'Updating...';
          _t.classList.add('active');
          for(let link of toggleLinks) {
            const id  = (link as HTMLInputElement).dataset.toggle;
            console.log(link.classList)
            link.classList.add('active');
            const linkTarget = document.getElementById(id);
            (linkTarget as HTMLInputElement).slideDown(300);
          }
        } else {
          container.classList.remove('update-links-init')
          // _t.textContent = 'Update';
          _t.classList.remove('active');
          for(let link of toggleLinks) {
            const id  = (link as HTMLInputElement).dataset.toggle;
            const linkTarget = document.getElementById(id);
            link.classList.remove('active');
            (linkTarget as HTMLInputElement).slideUp(300);
          }
        }
      break;
      
      case 'delete-links':
        if(!container.classList.contains('delete-links-init')) {
          container.classList.add('delete-links-init')
          // _t.textContent = 'Deleting...';
          _t.classList.add('active');
          for(let link of toggleLinks) {
            const id  = (link as HTMLInputElement).dataset.toggle;
            console.log(link.classList)
            link.classList.add('active');
            const linkTarget = document.getElementById(id);
            (linkTarget as HTMLInputElement).slideDown(300);
          }
        } else {
          container.classList.remove('delete-links-init')
          // _t.textContent = 'Delete';
          _t.classList.remove('active');
          for(let link of toggleLinks) {
            const id  = (link as HTMLInputElement).dataset.toggle;
            const linkTarget = document.getElementById(id);
            link.classList.remove('active');
            (linkTarget as HTMLInputElement).slideUp(300);
          }
        }
        break;
    }
  }
}