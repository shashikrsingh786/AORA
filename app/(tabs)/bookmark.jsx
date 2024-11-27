import { FlatList, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import VideoCard from "../../components/VideoCard";
import { EmptyState } from "../../components/EmptyState";
import { images } from "../../constants";
import { useGlobalContext } from "../../context/GlobalProvider";


const Bookmark = () => {
  const {user} = useGlobalContext();
 
  return (
    <SafeAreaView style={{backgroundColor: '#000000', height: '100%'}}>
      <FlatList
        data={user.bookmarkVideos}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard
          title={item.title}
          thumbnail={item.thumbnail}
          video={item.video}
          creator={item.creator.username}
          avatar={item.creator.avatar}
          id = {item.$id}
          isBookmark = {true}
        />
        )}
        ListHeaderComponent={() => (
          <View className="flex my-6 px-4 space-y-6">
            <View className="flex justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">
                  Welcome Back
                </Text>
                <Text className="text-2xl font-psemibold text-white">
                  JSMastery
                </Text>
              </View>

              <View className="mt-1.5">
                <Image
                  source={images.logoSmall}
                  style={{width:45,height:50}}
                  resizeMode="contain"
                />
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="No videos created yet"
          />
        )}
      />
    </SafeAreaView>
  );
};


export default Bookmark;
