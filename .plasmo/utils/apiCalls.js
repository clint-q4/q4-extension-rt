import PocketBase from 'pocketbase';
import Auth from '../utils/auth';

const client = new PocketBase('http://127.0.0.1:8090');

const getLists = async function(collection, pageN = 1, perPage = 50) {
  const token = Auth.getToken();
  if(!token) return [];
  const newAuthData = await client.users.refresh();
  console.log('new', newAuthData);

  let filters = {
    filter: `profile = "${newAuthData.user.profile.id}"`
  }

  try {
    const resultList = await client.records.getList(collection, pageN, perPage, filters);
    console.log('rr', resultList);
    return resultList.items;
  }
  catch(err) {
    return [];
  }
}

const loginAuth = async function (email, password) {
  try {
    const adminAuthData = await client.users.authViaEmail(email, password);
    return adminAuthData;
  }
  catch(err) {
    return {};
  }
}

const registerAuth = async function (formData) {
  // create user
  try {
    const user = await client.users.create({
      email: formData.email,
      password: formData.password,
      passwordConfirm: formData.confirmPassword
    });

    console.log(user);
  
    // send verification email
    // await client.users.requestVerification(user.email);
    
    const adminAuthData = await client.users.authViaEmail(formData.email, formData.password);

    console.log('testlogin', adminAuthData);

    // set user profile data
    const updatedProfile = await client.records.update('profiles', adminAuthData.user.profile.id, {
      name: formData.name,
    });

    return adminAuthData;
  }
  catch(err) {
    console.log(err);
    return {};
  }
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

const createIndexArray = async function(data) {
  const token = Auth.getToken();
  if(!token) return {};
  const newAuthData = await client.users.refresh();
  if(newAuthData) {
    console.log(newAuthData);
    data.profile = newAuthData.user.profile.id;
  }
  try {
    const record = await client.records.create('sorting', data);
    return record;
  }
  catch(err) {
    console.log(err)
  }
}
 
const updateCategory = async function(formData, categoryID) {
  const token = Auth.getToken();
  if(!token) return {};
  try {
    const newAuthData = await client.users.refresh();
    if(newAuthData) {
      formData.profile = newAuthData.user.profile.id;
    }
    const record = await client.records.update('category', categoryID , formData);
    return record;
  }
  catch(err) {
      return 'Something went wrong!';
  }
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

const deleteLinks = async function(el ,linkID) {
  const token = Auth.getToken();
  if(!token) return {};
  const newAuthData = await client.users.refresh();
  if(newAuthData) {
    const response = await client.records.delete(el, linkID);
    if(response === null) {
      const respose = {
        message: `${el} has been deleted successfully!`
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


const updateSnippets = async function(snippetID, formData) {
  console.log('test', snippetID, formData)
  const token = Auth.getToken();
  if(!token) return {};
  const newAuthData = await client.users.refresh();
  if(newAuthData) {
    console.log(newAuthData);
    formData.profile = newAuthData.user.profile.id;
  }
  const record = await client.records.update('snippets', snippetID , formData);
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
  registerAuth,
  createLinks, 
  createCategory, 
  updateCategory , 
  deleteCategory,
  deleteLinks,
  updateLinks,
  updateSnippets,
  getSingleRecord,
  createSnippets,
  createIndexArray
}