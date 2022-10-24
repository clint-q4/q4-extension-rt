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
  if(!token) return {};
  const newAuthData = await client.users.refresh();
  if(newAuthData) {
    console.log(newAuthData);
    formData.profile = newAuthData.user.profile.id;
  }

  const record = await client.records.create('websites', formData);
  if(!record) {
    return 'Something went wrong!';
  }
  return record;
}

const createSnippets = async function (formData) {
  const token = Auth.getToken();
  if(!token) return {};
  const newAuthData = await client.users.refresh();
  if(newAuthData) {
    console.log(newAuthData);
    formData.profile = newAuthData.user.profile.id;
  }

  const record = await client.records.create('snippets', formData);
  if(!record) {
    return 'Something went wrong!';
  }
  return record;
}

const createCategory = async function(formData) {
  const token = Auth.getToken();
  if(!token) return {};
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
 
const updateCategory = async function(formData, categoryID) {
  const token = Auth.getToken();
  if(!token) return {};
  const newAuthData = await client.users.refresh();
  if(newAuthData) {
    console.log(newAuthData);
    formData.profile = newAuthData.user.profile.id;
  }
  const record = await client.records.update('category', categoryID , formData);
  console.log(record);
  if(!record) {
    return 'Something went wrong!';
  }
  return record;
}

const deleteCategory = async function(categoryID) {
  const token = Auth.getToken();
  if(!token) return {};
  const newAuthData = await client.users.refresh();
  if(newAuthData) {
    const response = await client.records.delete('category', categoryID);
    if(response === null) {
      const respose = {
        message: 'Catgeory has been deleted successfully!'
      };
      return respose;
    } else {
      return response;
    }
  }
}

const deleteLinks = async function(linkID) {
  const token = Auth.getToken();
  if(!token) return {};
  const newAuthData = await client.users.refresh();
  if(newAuthData) {
    const response = await client.records.delete('websites', linkID);
    if(response === null) {
      const respose = {
        message: 'Link has been deleted successfully!'
      };
      return respose;
    } else {
      return response;
    }
  }
}

const updateLinks = async function(linkID, formData) {
  const token = Auth.getToken();
  if(!token) return {};
  const newAuthData = await client.users.refresh();
  if(newAuthData) {
    console.log(newAuthData);
    formData.profile = newAuthData.user.profile.id;
  }
  const record = await client.records.update('websites', linkID , formData);
  console.log(record);
  if(!record) {
    return 'Something went wrong!';
  }
  return record;
}

const getSingleRecord = async function (collection, id, relations) {
  const token = Auth.getToken();
  if(!token) return {};
  const newAuthData = await client.users.refresh();
  if(newAuthData) {
    const record = await client.records.getOne(collection, id, relations);
    console.log(record);
    if(!record) {
      return 'Something went wrong!';
    }
    return record;
  }
}

export { 
  client, 
  getLists, 
  loginAuth, 
  createLinks, 
  createCategory, 
  updateCategory , 
  deleteCategory,
  deleteLinks,
  updateLinks,
  getSingleRecord,
  createSnippets
}