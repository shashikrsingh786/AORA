import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { Video } from 'expo-av'; // expo-video alternative
import { icons } from '../../constants';

const videoSource = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

export default function VideoScreen() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <View style={styles.container}>
      {isPlaying ? (
        <Video
          source={{ uri: videoSource }}
          style={styles.video}
          resizeMode="contain"
          shouldPlay
          isLooping
        />
      ) : (
        <TouchableOpacity onPress={() => setIsPlaying(true)}>
          <ImageBackground
            source={{ uri: 'https://i.ibb.co/7XqVPVT/Photo-1677756119517.png' }}
            style={styles.video}
          >
            <Image source={icons.play} style={styles.playIcon} />
          </ImageBackground>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: 350, // Set width of video/image
    height: 275, // Set height of video/image
  },
  playIcon: {
    width: 50,
    height: 50,
    alignSelf: 'center',
  },
});
