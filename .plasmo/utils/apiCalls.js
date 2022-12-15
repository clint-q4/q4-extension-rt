import PocketBase from "pocketbase"
import Auth from "../utils/auth"

// client store pb
const pb = new PocketBase("https://clipme.fly.dev")

// Get lists all collection
const getLists = async function (collection, pageN = 1, perPage = 50) {
  const obj = Auth.getToken()
  if (!obj || Object.keys(obj).length === 0) return {}
  try {
    const records = await pb.collection(collection).getFullList(200, {
      filter: `user = "${obj.exToken}"`,
      sort: "-created"
    })
    return records
  } catch (err) {
    return []
  }
}

// Login the user
const loginAuth = async function (email, password) {
  try {
    const adminAuthData = await pb
      .collection("users")
      .authWithPassword(email, password)
    if (!adminAuthData.record.verified) {
      const respose = {
        status: false,
        message: "Please verify the email address first!",
        email: email,
        verified: false
      }
      return respose
    } else {
      const profileID = adminAuthData.record.id
      adminAuthData["status"] = true
      adminAuthData["exToken"] = profileID
      return adminAuthData
    }
  } catch (err) {
    // Check if the status is true, and if so return the value. If not, return
    console.error(err)
    return {
      status: true,
      message: "Incorrect creditinals! Please try again."
    }
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
      emailVisibility: false
    }

    const record = await pb.collection("users").create(data)
    record["status"] = true;
    await pb.collection("users").requestVerification(formData.email)
    console.log(record);
    return record
  } catch (err) {
    console.log(err)
    return {
      status: false,
      message: "Email: The email is invalid or already in use."
    }
  }
}

// create links pb
const createLinks = async function (formData) {
  const obj = Auth.getToken()
  if (!obj || Object.keys(obj).length === 0) return {}
  formData.user = obj.exToken
  try {
    const record = await pb.collection("websites").create(formData)
    return record
  } catch (err) {
    console.error(err)
    return {}
  }
}

// create snippets pb
const createSnippets = async function (formData) {
  const obj = Auth.getToken()
  if (!obj || Object.keys(obj).length === 0) return {}
  formData.user = obj.exToken
  try {
    const record = await pb.collection("snippets").create(formData)
    return record
  } catch (err) {
    console.error(err)
    return {}
  }
}

// create category pb
const createCategory = async function (formData) {
  const obj = Auth.getToken()
  if (!obj || Object.keys(obj).length === 0) return {}
  formData.user = obj.exToken
  try {
    const record = await pb.collection("category").create(formData)
    return record
  } catch (err) {
    console.error(err)
    return {}
  }
}

// create or update index array pb
const createIndexArray = async function (data) {
  const obj = Auth.getToken()
  if (!obj || Object.keys(obj).length === 0) return {}
  data.user = obj.exToken
  try {
    const records = await pb.collection("order").getFullList(200, {
      filter: `user = "${obj.exToken}" && name = "${data.name}"`
    })
    if (records.length > 0) {
      const record = await pb.collection("order").update(records[0].id, data)
      return record
    } else {
      const record = await pb.collection("order").create(data)
      return record
    }
  } catch (err) {
    console.error(err)
    return {}
  }
}

// get indexarray for order pb
const getIndexArray = async function () {
  const obj = Auth.getToken()
  if (!obj || Object.keys(obj).length === 0) return []
  try {
    const records = await pb.collection("order").getFullList(2, {
      filter: `user = "${obj.exToken}"`,
      $autoCancel: false
    })
    return records
  } catch (err) {
    console.error(err)
    return []
  }
}

// update category pb
const updateCategory = async function (formData, categoryID) {
  const obj = Auth.getToken()
  if (!obj || Object.keys(obj).length === 0) return {}
  formData.user = obj.exToken
  try {
    const record = await pb.collection("category").update(categoryID, formData)
    return record
  } catch (err) {
    console.error(err)
    return {}
  }
}

// delete category pb
const deleteCategory = async function (categoryID) {
  const obj = Auth.getToken()
  if (!obj || Object.keys(obj).length === 0) return {}
  try {
    const response = await pb.collection("category").delete(categoryID)
    if (response === null || response) {
      const respose = {
        status: true,
        message: "Catgeory has been deleted successfully!"
      }
      return respose
    }
  } catch (err) {
    console.error(err)
    return {
      status: false,
      reason: "Please make sure it is not linked to any items"
    }
  }
}

// delete items pb
const deleteItems = async function (el, itemId) {
  const obj = Auth.getToken()
  if (!obj || Object.keys(obj).length === 0) return {}
  try {
    const response = await pb.collection(el).delete(itemId)
    if (response || response === null) {
      let msg = ""

      if (el === "websites") {
        msg = `bookmark has been deleted successfully!`
      } else {
        msg = `Snippet has been deleted successfully!`
      }
      const respose = {
        status: true,
        message: msg
      }
      return respose
    }
  } catch (err) {
    console.error(err)
    return {
      status: false,
      message: err.message
    }
  }
}

// update links pb
const updateLinks = async function (linkID, formData) {
  const obj = Auth.getToken()
  if (!obj || Object.keys(obj).length === 0) return {}
  formData.user = obj.exToken
  try {
    const record = await pb.collection("websites").update(linkID, formData)
    return record
  } catch (err) {
    console.error(err)
    return {}
  }
}

// update snippets pb
const updateSnippets = async function (snippetID, formData) {
  const obj = Auth.getToken()
  if (!obj || Object.keys(obj).length === 0) return {}
  formData.user = obj.exToken
  try {
    const record = await pb.collection("snippets").update(snippetID, formData)
    return record
  } catch (err) {
    console.error(err)
    return {}
  }
}

// get a single record pb
const getSingleRecord = async function (collection, id, relations) {
  const obj = Auth.getToken()
  if (!obj || Object.keys(obj).length === 0) return {}
  try {
    const record = await pb.collection(collection).getOne(id, relations)
    return record
  } catch (err) {
    console.error(err)
    return {}
  }
}

// list auth methods pb
const listAuthMethods = async function () {
  try {
    const methods = await pb.collection('users').listAuthMethods();
    console.log(methods);
    return methods
  } catch (err) {
    console.error(err)
    return {}
  }
}

// password reset auth
const passwordResetAuth = async function (email) {
  try {
    const result = await pb.collection('users').requestPasswordReset(email);
    return result;
  }
  catch (err) {
    console.error(err)
    return {}
  }
}

// Send verification email again if not received
const sendVerificationEmail = async function (email) {
  try {
    console.log(email);
    const result = await pb.collection('users').requestPasswordReset(email);
    return result;
  }
  catch (err) {
    console.error(err)
    return {}
  }
}

export {
  pb,
  getLists,
  loginAuth,
  registerAuth,
  createLinks,
  createCategory,
  updateCategory,
  deleteCategory,
  deleteItems,
  updateLinks,
  updateSnippets,
  getSingleRecord,
  createSnippets,
  createIndexArray,
  getIndexArray,
  listAuthMethods,
  passwordResetAuth
}
