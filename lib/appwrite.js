export const appwriteConfig = {
  endpoint: process.env.APPWRITE_ENDPOINT,
  platform: process.env.APPWRITE_PLATFORM,
  projectId: process.env.APPWRITE_PROJECT_ID,
  databaseId: process.env.APPWRITE_DATABASE_ID,
  userCollectionId: process.env.APPWRITE_USER_COLLECTION_ID,
  videosCollectionId: process.env.APPWRITE_VIDEOS_COLLECTION_ID,
  storageId: process.env.APPWRITE_STORAGE_ID
}


import { Client, Account, ID, Avatars, Databases, Query,Storage } from 'react-native-appwrite';
// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
    .setProject(appwriteConfig.projectId) // Your project ID
    .setPlatform(appwriteConfig.platform) // Your application ID or bundle ID.
;

const account = new Account(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

// Register User



export async function createUser(email, password, username) {
    try {
      const newAccount = await account.create(
        ID.unique(),
        email,
        password,
        username
      );
  
      if (!newAccount) throw Error;
  
      const avatarUrl = avatars.getInitials(username);
  
      await signIn(email, password);
  
      const newUser = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        ID.unique(),
        {
          accountId: newAccount.$id,
          email: email,
          username: username,
          avatar: avatarUrl,
        }
      );
      console.log(newUser,"newUser");
      return newUser;
    } catch (error) {
      throw new Error(error);
    }
  }

export async function signIn(email, password) {
    try {
      const session = await account.createEmailPasswordSession(email, password);
        console.log(session,"session");
      return session;
    } catch (error) {
      throw new Error(error);
    }
  }

 // Get Account
export async function getAccount() {
    try {
      const currentAccount = await account.get();
  
      return currentAccount;
    } catch (error) {
      throw new Error(error);
    }
  }
  
  // Get Current User
  export async function getCurrentUser() {
    try {
      const currentAccount = await getAccount();
      if (!currentAccount) throw Error;
  
      const currentUser = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [Query.equal("accountId", currentAccount.$id)]
      );
  
      if (!currentUser) throw Error;
      // let result = currentUser.documents[0];
      // result.bookmarkVideos = result.bookmarkVideos.map((item)=>item.$id);
      // console.log(result,"resss");
      return currentUser.documents[0];
    } catch (error) {
      console.log(error,"asa");
      return null;
    }
  }

  // Get all video Posts
export async function getAllPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videosCollectionId
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getLatestPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videosCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(7)]
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

// Upload File
export async function uploadFile(file, type) {
  console.log(file, type, "sdfsdfds");
  if (!file) return;

  const { mimeType, ...rest } = file;
  const asset = { 
    type: mimeType,
    filename: file.name || 'file',
    ...rest 
  };

  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      asset
    );

    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    return fileUrl;
  } catch (error) {
    console.log(error,"error");
    throw new Error(error);
  }
}

// Get File Preview
export async function getFilePreview(fileId, type) {
  let fileUrl;

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(appwriteConfig.storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        appwriteConfig.storageId,
        fileId,
        2000,
        2000,
        "top",
        100
      );
    } else {
      throw new Error("Invalid file type");
    }

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
}

// Create Video Post
export async function createVideoPost(form) {
  try {
   
    
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ]);

    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.videosCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        creator: form.userId,
      }
    );

    return newPost;
  } catch (error) {
    throw new Error(error);
  }
}

// Get video posts that matches search query
export async function searchPosts(query) {
  try {
    
   
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videosCollectionId,
      [Query.search("title", query)]
    );
    console.log(posts,"posts");

    if (!posts) throw new Error("Something went wrong");
    console.log(posts.documents,"posts.documents");
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

// Get video posts created by user
export async function getUserPosts(userId) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videosCollectionId,
      [Query.equal("creator", userId)]
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

// Sign Out
export async function signOut() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    throw new Error(error);
  }
}

//get all users
export async function getAllUsers() {
  try {
    const data = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId
    );
    return data.documents;

  } catch (error) {
    throw new Error(error);
  }
}
export async function bookmarkPost(id) {
  try {
    const user = await getCurrentUser(); // Fetch current user
    const userId = user.$id; // Assumes user object contains `$id` property

    // Fetch the current user document
    const userDoc = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId
    );

    // Get existing bookmarks or initialize as an empty array
    const currentBookmarks = userDoc.bookmarkVideos || [];

    // Check if the id is already bookmarked
    if (currentBookmarks.includes(id)) {
      throw new Error(`Post with ID ${id} is already bookmarked.`);
    }

    // Update the user's bookmarks
    const updatedDoc = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId,
      {
        bookmarkVideos: [...currentBookmarks, id], // Add the new bookmark
      }
    );

    return updatedDoc; // Return the updated document
  } catch (error) {
    throw new Error(`Failed to bookmark post: ${error.message}`);
  }
}

export async function unbookmarkPost(id) {
  try {
    const user = await getCurrentUser();
    const userId = user.$id;

    const userDoc = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId
    );

    const currentBookmarks = userDoc.bookmarkVideos || [];

    // Check if the id exists in bookmarks
    if (!currentBookmarks.includes(id)) {
      throw new Error(`Post with ID ${id} is not in bookmarks.`);
    }

    // Remove the id from the bookmarks array
    const updatedBookmarks = currentBookmarks.filter(bookmarkId => bookmarkId !== id);

    const updatedDoc = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId,
      {
        bookmarkVideos: updatedBookmarks,
      }
    );

    return updatedDoc;
  } catch (error) {
    throw new Error(`Failed to unbookmark post: ${error.message}`);
  }
}
