import { StatusBar } from "expo-status-bar";
import { Redirect, router } from "expo-router";
import { View, Text, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "../constants";
import CustomButton from '../components/CustomButton';
// import { useGlobalContext } from "../context/GlobalProvider";

const Welcome = () => {
  // const { loading, isLogged } = useGlobalContext();

  // if (!loading && isLogged) return <Redirect href="/home" />;

  return (
    <SafeAreaView style={{backgroundColor: '#161622', height: '100%'}}>
      {/* <Loader isLoading={loading} /> */}

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
      >
        <View style={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', paddingHorizontal: 16}}>
          <Image
            source={images.logo}
            style={{width: 180, height: 45}}
            resizeMode="contain"
          />

          <Image
            source={images.cards}
            style={{width: 300, height: 280, marginTop: 40}}
            resizeMode="contain"
          />

          <View style={{position: 'relative', marginTop: 20}}>
            <Text style={{fontSize: 30, color: '#fff', fontWeight: 'bold', textAlign: 'center'}}>
              Discover Endless{"\n"}
              Possibilities with{" "}
              <Text style={{color: '#FFA001'}}>Aora</Text>
            </Text>

            <Image
              source={images.path}
              style={{width: 80, height: 40, position: 'absolute', bottom: -2, right: -8}}
              resizeMode="contain"
            />
          </View>

          <Text style={{fontSize: 14, fontFamily: 'Poppins-Regular', color: '#f3f4f6', marginTop: 28, textAlign: 'center'}}>
            Where Creativity Meets Innovation: Embark on a Journey of Limitless
            Exploration with Aora
          </Text>

          <CustomButton
            title="Continue with Email"
            handlePress={() => router.push("/sign-in")}
            containerStyles="w-full mt-7"
          />
        </View>
      </ScrollView>

      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default Welcome;
