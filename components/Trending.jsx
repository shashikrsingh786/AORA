import { useState, useCallback, useMemo } from "react";
import { useVideoPlayer, VideoView } from "expo-video";
import * as Animatable from "react-native-animatable";
import {
  FlatList,
  Image,
  ImageBackground,
  TouchableOpacity,
} from "react-native";

import { icons } from "../constants";

const zoomIn = {
  0: {
    scale: 0.9,
  },
  1: {
    scale: 1,
  },
};

const zoomOut = {
  0: {
    scale: 1,
  },
  1: {
    scale: 0.9,
  },
};

const TrendingItem = ({ activeItem, item }) => {
  const [play, setPlay] = useState(false);
  let video = item.video;
  const player = useVideoPlayer(video, player => {
    player.loop = false;
    // Auto stop when finished
    player.addListener('playToEnd', () => {
      setPlay(false);
    });
  });

  return (
    <Animatable.View
      className="mr-5"
      animation={activeItem === item.$id ? zoomIn : zoomOut}
      duration={500}
    >
      {play ? (
        <VideoView
          player={player}
          style={{
            width: 208,
            height: 288,
            borderRadius: 33,
            marginTop: 12,
            backgroundColor: 'rgba(255, 255, 255, 0.1)'
          }}
          contentFit="fill"
          nativeControls
        />
      ) : (
        <TouchableOpacity
          className="relative flex justify-center items-center"
          activeOpacity={0.7}
          onPress={() => {
            setPlay(true);
            player.play();
          }}
        >
          <Image
            source={{
              uri: item.thumbnail,
            }}
            style={{
              width: 208,
              height: 288,
              borderRadius: 33,
              marginVertical: 20,
              overflow: 'hidden',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.4,
              shadowRadius: 4,
            }}
            resizeMode="cover"
          />

          <Image
            source={icons.play}
            style={{
              width: 48,
              height: 48,
              position: 'absolute',
            }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </Animatable.View>
  );
};


const Trending = ({ posts }) => {
  const [activeItem, setActiveItem] = useState(posts[0]);

  const viewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key);
    }
  }, []);

  

  const viewabilityConfig = useMemo(() => ({
    itemVisiblePercentThreshold: 70
  }), []);

  return (
    <FlatList
      data={posts}
      horizontal
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
        <TrendingItem activeItem={activeItem} item={item} />
      )}
      onViewableItemsChanged={viewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
      contentOffset={{ x: 170 }}
    />
  );
};

export default Trending;
