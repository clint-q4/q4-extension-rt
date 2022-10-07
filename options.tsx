import { useState, useEffect } from "react"
import FormCard from "~.plasmo/components/FormCard"
import RenderLinks from "~.plasmo/components/RenderLinks";
import {modalFunctions} from "~.plasmo/utils/modal";
import apiLinks from "~.plasmo/utils/apiLinks";
import fetchData from "~.plasmo/utils/fetchData";
import './css/styles.css';
import axios from 'axios';
import getSuspender from "~.plasmo/utils/getSuspender";
import PocketBase from 'pocketbase';


// const client = new PocketBase('http://127.0.0.1:8090');
// async function getList() {
//   const records = await client.records.getFullList('websites', 200 /* batch size */, {
//     sort: '-created',
//   });
//   console.log(records);
//   return records;
// }
// getList();

const apiDomain = 'http://127.0.0.1:8090';

const apiCategoryData = fetchData(apiLinks.categoriesLink);
const apiLinksData = fetchData(apiLinks.categoriesLink);

function IndexOptions() {
  const [categoryData, setCatgeoryData] = useState<{[key: string]: any}>(apiCategoryData.read());
  const [linksData, setLinksData] = useState<{[key: string]: any}>(apiLinksData.read());
  const [filterdData, setfilterdData] = useState<{[key: string]: any}>({});
  useEffect(() => {
    // Run modal helper funtions
    modalFunctions();

  }, [])

  useEffect(() => {
    if(categoryData.length && linksData.length) {
      const groupedData = linksData.reduce((groups, item) => {
        const group = (groups[categoryData.find(c => c.id === item.category).name] || []);
        group.push(item);
        groups[categoryData.find(c => c.id === item.category).name] = group;
        return groups;
      }, {});
      setfilterdData(groupedData);
    }
    // const localCategories = JSON.parse(localStorage.getItem('categoriesData'));
    // const localLinks = JSON.parse(localStorage.getItem('linksData'));
  }, [categoryData, linksData])


  return (
    <div className="options-container p-6">
    <section className="header-section is-flex is-justify-content-space-between p-4 has-background-success-light border-radius-10">
      <div>
        <h2 className="title is-size-1">Options</h2>
      </div>
      <div>
        <button className="button is-size-4 has-text-weight-bold is-primary js-modal-trigger" id="add-options-button" data-target="add-options-modal">+</button>
      </div>
    </section>
    <RenderLinks filterdData={filterdData}></RenderLinks>
    <FormCard 
      categoriesData={categoryData}
      setCatgeoryData={setCatgeoryData}
      ></FormCard>
  </div>
  )
}

export default IndexOptions;
