import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Image, FlatList, TouchableOpacity } from "react-native";

import { icons } from "../../constants";
import useAppwrite from "../../lib/useAppwrite";
import { getUserPosts, signOut } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import { EmptyState} from "../../components/EmptyState";
import { InfoBox} from "../../components/InfoBox";
import VideoCard  from "../../components/VideoCard";
import { Loader } from "../../components/Loader";
import { useState,useEffect } from "react";



const Profile =  () => {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const { data : posts , loading  } = useAppwrite(() => getUserPosts(user.$id));


  

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLogged(false);

    router.replace("/sign-in");
  };

  return (
    <SafeAreaView className="bg-primary h-full">
     {(loading || !posts) && <Loader isLoading={true} />}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard
            title={item.title}
            thumbnail={item.thumbnail}
            video={item.video}
            creator={item.creator.username}
            avatar={item.creator.avatar}
            id = {item.$id}
            showBookmark = {false}
            />
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="No videos found for this profile"
          />
        )}
        ListHeaderComponent={() => (
          <View className="w-full flex justify-center items-center mt-6 mb-12 px-4">
            <TouchableOpacity
              onPress={logout}
              className="flex w-full items-end mb-10"
            >
              <Image
                source={icons.logout}
                resizeMode="contain"
                style={{
                  width: 24,
                  height: 24
                }}
              />
            </TouchableOpacity>

            <View style={{
              width: 64,
              height: 64,
              borderWidth: 1,
              borderColor: '#secondary',
              borderRadius: 8,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Image
                source={{ uri: user?.avatar }}
                style={{
                  width: '90%',
                  height: '90%',
                  borderRadius: 8
                }}
                resizeMode="cover"
              />
            </View>

            <InfoBox
              title={user?.username}
              containerStyles="mt-5"
              titleStyles="text-lg"
            />

            <View className="mt-5 flex flex-row">
              <InfoBox
                title={posts.length || 0}
                subtitle="Posts"
                titleStyles="text-xl"
                containerStyles="mr-10"
              />
              <InfoBox
                title="1.2k"
                subtitle="Followers"
                titleStyles="text-xl"
              />
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default Profile;
