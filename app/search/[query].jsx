import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import useAppwrite from "../../lib/useAppwrite";
import { searchPosts } from "../../lib/appwrite";
import  {EmptyState}  from "../../components/EmptyState";
import  {SearchInput}  from "../../components/SearchInput";
import  VideoCard  from "../../components/VideoCard";
import { Loader } from "../../components/Loader";
const Search = () => {
  const { query } = useLocalSearchParams();
  const [loader, setLoader] = useState(true);
  const [posts, setPosts] = useState([]);
  

  const { data, refetch } = useAppwrite(() => searchPosts(query));

  // Update posts when data changes
  useEffect(() => {
    if (data) {
      setPosts(data);
      setLoader(false);
    }
  }, [data]);

  // Refetch when query changes
  useEffect(() => {
    setLoader(true);
    refetch();
  }, [query]);

  return (
    <SafeAreaView className="bg-primary h-full">
       {loader &&<Loader isLoading={loader} />}
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
          />
        )}
        ListHeaderComponent={() => (
          <>
            <View className="flex my-6 px-4">
              <Text className="font-pmedium text-gray-100 text-sm">
                Search Results
              </Text>
              <Text className="text-2xl font-psemibold text-white mt-1">
                {query}
              </Text>

              <View className="mt-6 mb-8">
                <SearchInput initialQuery={query} refetch={refetch} />
              </View>
            </View>
          </>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="No videos found for this search query"
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Search;
