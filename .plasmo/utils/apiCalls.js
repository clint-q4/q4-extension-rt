import PocketBase from 'pocketbase';
import Auth from '../utils/auth';

// cliten store pb
const pb = new PocketBase('http://127.0.0.1:8090');

// Get lists all collection
const getLists = async function(collection, pageN = 1, perPage = 50) {
  const obj = Auth.getToken();
  if(!obj || Object.keys(obj).length === 0) return {};
  try {
    const records = await pb.collection(collection).getFullList(200, {
        filter: `user = "${obj.exToken}"`,
        sort: '-created',
    });
    return records;
  }
  catch(err) {
    return [];
  }
}

// Login the user
const loginAuth = async function (email, password) {
  try {
    const adminAuthData = await pb.collection('users').authWithPassword(email, password);
    if(!adminAuthData.record.verified) {
      const respose = {
        status: false,
        message: 'Please verify the email address first!'
      };
      return respose;
    } else {
      profileID = adminAuthData.record.id;
      adminAuthData['status'] = true;
      // const hash = bcrypt.hashSync(profileID, salt);
      adminAuthData['exToken'] = profileID;
      // console.log(hash, "hashed");
      return adminAuthData;
    }
  }
  catch(err) {
    console.error(err);
    return {
      // Check if the status is true, and if so return the value. If not, return
      // the fallback value.
      status: true,
      message: 'Incorrect creditinals! Please try again.'
    };
  }
}

// Register pb
const registerAuth = async function (formData) {
  // create user
  try {
    const data = {
      username: formData.username,
      name: formData.name,
      email: formData.email,
      password: formData.password,
      passwordConfirm: formData.confirmPassword,
      emailVisibility: false,
    }

    const record = await pb.collection('users').create(data);

    await pb.collection('users').requestVerification(formData.email);

    return record;
  }
  catch(err) {
    console.error(err);
    return {};
  }
}

const createLinks = async function (formData) {
  const obj = Auth.getToken();
  if (!obj || Object.keys(obj).length === 0) return {};
  formData.user = obj.exToken;
  try {
    const record = await pb.collection('websites').create(formData);
    return record;
  } catch (err) {
    console.error(err);
    return {};
  }
};

const createSnippets = async function (formData) {
  const obj = Auth.getToken();
  if(!obj || Object.keys(obj).length === 0) return {};
  formData.user = obj.exToken;
  try {
    const record = await pb.collection('snippets').create(formData);
    return record;
  }
  catch(err) {
    console.error(err);
    return {};
  }

}

const createCategory = async function(formData) {
  const obj = Auth.getToken();
  if(!obj || Object.keys(obj).length === 0) return {};
  formData.user = obj.exToken;
  try {
    const record = await pb.collection('category').create(formData);
    return record;
  }
  catch(err) {
    console.error(err);
    return {};
  }
}

const createIndexArray = async function(data) {
  const obj = Auth.getToken();
  if(!obj || Object.keys(obj).length === 0) return {};
  data.user = obj.exToken;
  try {
    const records = await pb.collection('order').getFullList(200 , {
        filter: `user = "${obj.exToken}" && name = "${data.name}"`,
    });
    if(records.length > 0) {
      const record = await pb.collection('order').update(records[0].id, data);
      return record;
    } else {
      const record = await pb.collection('order').create(data);
      return record;
    }
  }
  catch(err) {
    console.error(err);
    return {};
  }
}


const getIndexArray = async function() {
  const obj = Auth.getToken();
  if(!obj || Object.keys(obj).length === 0) return [];
  try {
    const records = await pb.collection('order').getFullList(2, {
      filter: `user = "${obj.exToken}"`,
      '$autoCancel': false 
    });
    return records;
  }
  catch(err) {
    console.error(err);
    return [];
  }
}
 
const updateCategory = async function(formData, categoryID) {
  const obj = Auth.getToken();
  if(!obj || Object.keys(obj).length === 0) return {};
  formData.user = obj.exToken;
  try {
    const record = await pb.collection('category').update(categoryID, formData);
    return record;
  }
  catch(err) {
    console.error(err);
    return {};
  }
}

const deleteCategory = async function(categoryID) {
  const obj = Auth.getToken();
  if(!obj || Object.keys(obj).length === 0) return {};
  try {
    const response = await pb.collection('category').delete(categoryID);
    if(response === null || response) {
      const respose = {
        status: true,
        message: 'Catgeory has been deleted successfully!'
      };
      return respose;
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

const deleteItems = async function(el ,itemId) {
  const obj = Auth.getToken();
  if(!obj || Object.keys(obj).length === 0) return {};
  try {
    const response = await pb.collection(el).delete(itemId);
    if(response || response === null) {
      let msg = '';
      
      if(el === 'websites') {
        msg = `bookmark has been deleted successfully!`
      } else {
        msg = `Snippet has been deleted successfully!`
      }
      const respose = {
        status: true, 
        message: msg,
      };
      return respose;
    } 
  }
  catch(err) {
    console.error(err);
    return {
      status: false,
      message: err.message 
    };
  }
}

const updateLinks = async function(linkID, formData) {
  const obj = Auth.getToken();
  if(!obj || Object.keys(obj).length === 0) return {};
  formData.user = obj.exToken;
  try {
    const record = await pb.collection('websites').update(linkID, formData);
    return record;
  }
  catch(err) {
    console.error(err);
    return {};
  }
}


const updateSnippets = async function(snippetID, formData) {
  const obj = Auth.getToken();
  if(!obj || Object.keys(obj).length === 0) return {};
  formData.user = obj.exToken;
  try {
    const record = await pb.collection('snippets').update(snippetID, formData);
    return record;
  }
  catch(err) {
    console.error(err);
    return {};
  }
}

const getSingleRecord = async function (collection, id, relations) {
  const obj = Auth.getToken();
  if(!obj || Object.keys(obj).length === 0) return {};
  try {
    const record = await pb.collection(collection).getOne(id, relations);
    return record;
  }
  catch(err) {
    console.error(err);
    return {};
  }
}

export { 
  pb,
  getLists, 
  loginAuth, 
  registerAuth,
  createLinks, 
  createCategory, 
  updateCategory , 
  deleteCategory,
  deleteItems,
  updateLinks,
  updateSnippets,
  getSingleRecord,
  createSnippets,
  createIndexArray,
  getIndexArray
}