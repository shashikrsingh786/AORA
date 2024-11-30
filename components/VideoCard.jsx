import { useState,useEffect, memo } from "react";
import { useVideoPlayer, VideoView } from "expo-video";
import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import { usePathname } from 'expo-router';




import { icons } from "../constants";
import CustomButton from "./CustomButton";
import { bookmarkPost } from "../lib/appwrite";

const VideoCard = memo(({ title, creator, avatar, thumbnail, video,id,isBookmark: initialIsBookmark,onBookmarkSuccess}) => {
  //how to get the parent url
  const pathname = usePathname();
  console.log(pathname,"parentUrl");
  
  const [bookmark,setBookmark] = useState(initialIsBookmark);
  const [play, setPlay] = useState(false);
  

  useEffect(() => {
    setBookmark(initialIsBookmark);
  }, [initialIsBookmark]);
  
  const player = useVideoPlayer(video, player => {
    player.loop = false;
    // Auto stop when finished
    player.addListener('playToEnd', () => {
      setPlay(false);
    });
  });

  const bookmarkVideo = async () => {
    try {
       setBookmark(true);
       
      const result = await bookmarkPost(id);

      if (onBookmarkSuccess) {
        onBookmarkSuccess();
      }
     
     
      console.log("bookmark success");
      Alert.alert("Success", "Post bookmarked successfully");

    }
    catch(error) {
      setBookmark(false); // Reset on error
      console.log(error);
      Alert.alert(error);
    }
  }

  return (
    <View style={{ 
      flexDirection: 'column', 
      justifyContent : 'space-between' ,
      paddingHorizontal: 16, 
      marginBottom: 56,
    
    }}>
      <View style={{ 
        flexDirection: 'row', 
        gap: 12, 
        alignItems: 'flex-start' 
      }}>
        <View style={{ 
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <View style={{ 
            width: 46,
            height: 46,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#secondary',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 2
          }}>
            <Image
              source={{ uri: avatar }}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 8
              }}
              resizeMode="cover"
            />
          </View>

          <View className="flex justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="font-psemibold text-sm text-white"
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              className="text-xs text-gray-100 font-pregular"
              numberOfLines={1}
            >
              {creator}
            </Text>
          </View>
        </View>

       {(pathname != '/profile')  && <View className="flex pt-2">
         
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => bookmarkVideo()}
          
        >
          <Image
           source={bookmark ? icons.fav : icons.unfav}
             resizeMode="contain"
              tintColor='white'
        style={{width: 30, height: 30}}/>
          </TouchableOpacity>
          
             {/* <Image source={icons.menu} style={{width: 30, height: 30}} resizeMode="contain" />
         */}
        </View>
}
      </View>

      {play ? (
  <VideoView
    player={player}
    style={{
      width: "100%",
      height: 240,
      borderRadius: 20, // Softer corners
      marginTop: 12,
      backgroundColor: "black", // Placeholder background for loading state
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5, // For Android shadow effect
    }}
    contentFit="contain"
    nativeControls
  />
) : (
  <TouchableOpacity
    activeOpacity={0.9}
    onPress={() => {
      setPlay(true);
      player.play();
    }}
    style={{
      width: "100%",
      height: 240,
      borderRadius: 20, // Same radius as the VideoView for consistency
      marginTop: 12,
      overflow: "hidden", // Ensures content fits within rounded corners
      position: "relative",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#000", // Placeholder color
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    }}
  >
    <Image
      source={{ uri: thumbnail }}
      style={{
        width: "100%",
        height: "100%",
        borderRadius: 20, // Matches container radius
      }}
      resizeMode="cover"
    />

    <Image
      source={icons.play}
      style={{
        width: 64,
        height: 64,
        position: "absolute",
        tintColor: "rgba(255, 255, 255, 0.8)", // Subtle overlay effect
      }}
      resizeMode="contain"
    />
  </TouchableOpacity>
)}

    </View>
  );
});

export default VideoCard;