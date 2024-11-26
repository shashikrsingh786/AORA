import { useState } from "react";
import { useVideoPlayer, VideoView } from "expo-video";
import { View, Text, TouchableOpacity, Image } from "react-native";

import { icons } from "../constants";

const VideoCard = ({ title, creator, avatar, thumbnail, video }) => {
  const [play, setPlay] = useState(false);
  
  const player = useVideoPlayer(video, player => {
    player.loop = false;
    // Auto stop when finished
    player.addListener('playToEnd', () => {
      setPlay(false);
    });
  });

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

        <View className="pt-2">
          <Image source={icons.menu}  style={{width:30,height:30}} resizeMode="contain" />
        </View>
      </View>

      {play ? (
        <VideoView
          player={player}
          className="w-full h-60 rounded-xl mt-3"
          contentFit="contain"
          nativeControls
        />
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            setPlay(true);
            player.play();
          }}
          className="w-full h-60 rounded-xl mt-3 relative flex justify-center items-center"
        >
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-full rounded-xl mt-3"
            resizeMode="cover"
          />

          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VideoCard;