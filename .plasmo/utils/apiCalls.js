import PocketBase from 'pocketbase';
import Auth from '../utils/auth';
import getSuspender from './getSuspender';

const client = new PocketBase('http://127.0.0.1:8090');

const getLists = async function(collection, pageN = 1, perPage = 50, filerts) {
  const token = Auth.getToken();
  if(!token) return [];
  const newAuthData = await client.users.refresh();
  filter = `profile = ${newAuthData.user.profile.id}`;
  if(!filerts) {
    filerts = filter;
  }
  const resultList = await client.records.getList(collection, pageN, perPage, {
    filerts
  });
  if(!resultList.items) {
    return resultList;
  }
  console.log(resultList);
  return resultList.items;
}

const loginAuth = async function (email, password) {
  const adminAuthData = await client.users.authViaEmail(email, password);
  return adminAuthData;
}

const createLinks = async function (formData) {
  const token = Auth.getToken();
  if(!token) return [];
  const newAuthData = await client.users.refresh();
  if(newAuthData) {
    console.log(newAuthData);
    formData.profile = newAuthData.user.profile.id;
  }
  console.log(formData, 'tt');
  const record = await client.records.create('websites', formData);
  console.log(record, 'ttt')
  if(!record) {
    return 'Something went wrong!';
  }
  return record;
}

const createCategory = async function(formData) {
  const token = Auth.getToken();
  if(!token) return [];
  const newAuthData = await client.users.refresh();
  if(newAuthData) {
    console.log(newAuthData);
    formData.profile = newAuthData.user.profile.id;
  }
  const record = await client.records.create('category', formData);
  console.log(record);
  if(!record) {
    return 'Something went wrong!';
  }
  return record;
}
 
export {client, getLists, loginAuth, createLinks, createCategory}