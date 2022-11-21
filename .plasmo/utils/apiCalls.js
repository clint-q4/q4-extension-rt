import PocketBase from 'pocketbase';
import Auth from '../utils/auth';

const client = new PocketBase('http://127.0.0.1:8090');
let profileID = '';

const getLists = async function(collection, pageN = 1, perPage = 50) {
  const token = Auth.getToken();
  if(!token) return [];

  try {
    // const newAuthData = await client.users.refresh();
    // console.log('aaaa', newAuthData)
    // if(!newAuthData.token) return [];
    let filters = {
        // filter: `profile = "${newAuthData.user.profile.id}"`
        filter: `profile = "${client.user.profile.id}"`
      }
    const resultList = await client.records.getList(collection, pageN, perPage, filters);
    return resultList.items;
  }
  catch(err) {
    return [];
  }
}

const loginAuth = async function (email, password) {
  try {
    const adminAuthData = await client.users.authViaEmail(email, password);
    console.log(adminAuthData);
    if(!adminAuthData.user.verified) {
      const respose = {
        status: false,
        message: 'Please verify the email address first!'
      };
      return respose;
    } else {
      profileID = adminAuthData.user.profile.id;
      console.log(profileID);
      adminAuthData['status'] = true;
      console.log('addd', adminAuthData);
      return adminAuthData;
    }
  }
  catch(err) {
    console.error(err);
    return {
      status: false,
      message: 'Incorrect creditinals! Please try again.'
    };
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
    // send verification email
    await client.users.requestVerification(user.email);
    
    const adminAuthData = await client.users.authViaEmail(formData.email, formData.password);

    // set user profile data
    const updatedProfile = await client.records.update('profiles', adminAuthData.user.profile.id, {
      name: formData.name,
    });

    console.log(updatedProfile);

    return updatedProfile;
  }
  catch(err) {
    console.error(err);
    return {};
  }
}

const createLinks = async function (formData) {
  const token = Auth.getToken();
  if(!token) return [];
  const newAuthData = await client.users.refresh();
  if(!newAuthData.token) return [];
  if(newAuthData) {
    formData.profile = newAuthData.user.profile.id;
  }
  try {
    console.log('authdata',newAuthData)
    const record = await client.records.create('websites', formData);
    console.log(record);
    return record;
  }
  catch(err) {
    console.error(err);
    return {};
  }
}

const createSnippets = async function (formData) {
  const token = Auth.getToken();
  if(!token) return {};
  try {
    const newAuthData = await client.users.refresh();
    if(newAuthData) {
      formData.profile = newAuthData.user.profile.id;
    }
  
    const record = await client.records.create('snippets', formData);
    return record;
  }
  catch(err) {
    console.error(err);
    return {};
  }

}

const createCategory = async function(formData) {
  const token = Auth.getToken();
  if(!token) return {};
  try {
    const newAuthData = await client.users.refresh();
    if(newAuthData) {
      formData.profile = newAuthData.user.profile.id;
    }
    const record = await client.records.create('category', formData);
    console.log(record);
    return record;
  }
  catch(err) {
    console.error(err);
    return {};
  }
}

const createIndexArray = async function(data) {
  const token = Auth.getToken();
  if(!token) return {};
  try {
    const newAuthData = await client.users.refresh();
    if(newAuthData) {
      data.profile = newAuthData.user.profile.id;
    }
    const record = await client.records.create('sorting', data);
    console.log(record);
    return record;
  }
  catch(err) {
    console.error(err);
    return {};
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
    console.error(err);
    return {};
  }
}

const deleteCategory = async function(categoryID) {
  const token = Auth.getToken();
  if(!token) return {};
  try {
    const newAuthData = await client.users.refresh();
    if(newAuthData) {
      const response = await client.records.delete('category', categoryID);
      if(response === null || response) {
        const respose = {
          status: true,
          message: 'Catgeory has been deleted successfully!'
        };
        return respose;
      }
    }
  }
  catch(err) {
    console.error(err);
    return {
      status: false,
      reason: 'Please make sure it is not linked to any items'
    };
  }
}

const deleteLinks = async function(el ,linkID) {
  const token = Auth.getToken();
  if(!token) return {};
  try {
    const newAuthData = await client.users.refresh();
    if(newAuthData) {
      const response = await client.records.delete(el, linkID);
      console.log(response);
      if(response || response === null) {
        const respose = {
          message: `${el} has been deleted successfully!`
        };
        return respose;
      } 
    }
  }
  catch(err) {
    console.error(err);
    return {};
  }
}

const updateLinks = async function(linkID, formData) {
  const token = Auth.getToken();
  if(!token) return {};
  try {
    const newAuthData = await client.users.refresh();
    if(newAuthData) {
      formData.profile = newAuthData.user.profile.id;
    }
    const record = await client.records.update('websites', linkID , formData);
    if(!record) {
      return 'Something went wrong!';
    }
    return record;
  }
  catch(err) {
    console.error(err);
    return {};
  }
}


const updateSnippets = async function(snippetID, formData) {
  console.log('test', snippetID, formData)
  const token = Auth.getToken();
  if(!token) return {};
  try {
    const newAuthData = await client.users.refresh();
    if(newAuthData) {
      formData.profile = newAuthData.user.profile.id;
    }
    const record = await client.records.update('snippets', snippetID , formData);
    if(!record) {
      return 'Something went wrong!';
    }
    return record;
  }
  catch(err) {
    console.error(err);
    return {};
  }
}

const getSingleRecord = async function (collection, id, relations) {
  const token = Auth.getToken();
  if(!token) return {};
  try {
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
  catch(err) {
    console.error(err);
    return {};
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