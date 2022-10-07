import PocketBase from 'pocketbase';
import getSuspender from './getSuspender';

const client = new PocketBase('http://127.0.0.1:8090');

export default async function getLists(collection, pageN = 1, perPage = 50, filerts) {
  const resultList = await client.records.getList(collection, pageN, perPage, {
    filerts
  });
  console.log(resultList, 'dd');

  return resultList.items;
}
