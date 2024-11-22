export const appwriteConfig = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform : 'com.shashi.aora',
    projectId : '674047e300037bcf140d',
    databaseId : '67406aa50000f7bfd95f',
    userCollectionId : '67406aec0010f377641d',
    videosCollectionId :'67406b0e0018500e18b6',
    storageId : '67406cae000225fde66c'
}

import { Client, Account, ID, Avatars } from 'react-native-appwrite';
// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
    .setProject(appwriteConfig.projectId) // Your project ID
    .setPlatform(appwriteConfig.platform) // Your application ID or bundle ID.
;

const account = new Account(client);
// const storage = new Storage(client);
const avatars = new Avatars(client);
// const databases = new Databases(client);

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
      const session = await account.createEmailSession(email, password);
  
      return session;
    } catch (error) {
      throw new Error(error);
    }
  }

  
