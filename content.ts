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
        document.querySelector('#q4-site-verification').textContent = 'Q4 Site';
      } else {
        document.querySelector('#q4-site-verification').textContent = 'Not a Q4 Site';
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

export const groupLinks = (categoryData, linksData, setfilterdData) => {
  if(categoryData.length && linksData.length) {
    const groupedData = linksData.reduce((groups, item) => {
      const group = (groups[categoryData.find(c => c.id === item.category).name] || []);
      group.push(item);
      groups[categoryData.find(c => c.id === item.category).name] = group;
      return groups;
    }, {});
    localStorage.setItem('groupedData', JSON.stringify(groupedData));
    const groupedLocalData = JSON.parse(localStorage.getItem('groupedData'));
    setfilterdData(groupedLocalData);
  } else {
    const groupedLocalData = JSON.parse(localStorage.getItem('groupedData'));
    if(groupedLocalData) {
      setfilterdData(groupedLocalData);
    }
  }
}