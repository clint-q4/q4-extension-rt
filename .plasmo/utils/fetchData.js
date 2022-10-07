import getSuspender from "./getSuspender";
const apiDomain = 'http://127.0.0.1:8090';

function fetchData(url) {
  console.log(apiDomain + url);
  const promise = fetch(apiDomain + url)
    .then((res) => res.json())
    .then((res) => {
      console.log(url, res);
      return res.items;
    });

  return getSuspender(promise);
}

export default fetchData;