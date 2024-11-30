import { StatusBar } from "expo-status-bar";
import { Redirect, router } from "expo-router";
import { View, Text, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "../constants";
import CustomButton from '../components/CustomButton';
import {Loader} from '../components/Loader';
import { useGlobalContext } from "../context/GlobalProvider";

const Welcome = () => {             
  const { loading, isLogged } = useGlobalContext();           

  if (!loading && isLogged) return <Redirect href="/home" />;      

  return (
    <SafeAreaView style={{backgroundColor: '#161622', height: '100%'}}>
      <Loader isLoading={loading} />

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
      >
        <View style={{width: '100%', display: 'flex', justifyContent: 'start', alignItems: 'center', height: '100%', paddingHorizontal: 16,marginTop: 50}}>
          <Image
            source={images.original}
            style={{width: 180, height: 90}}
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
              <Text style={{color: '#FFA001'}}>GenFlix</Text>
            </Text>

            <Image
              source={images.path}
              style={{width: 80, height: 40, position: 'absolute', bottom: -15, right: 95}}
              resizeMode="contain"
            />
          </View>

          <Text style={{fontSize: 14, fontFamily: 'Poppins-Regular', color: '#f3f4f6', marginTop: 28, textAlign: 'center'}}>
            Where Creativity Meets Innovation: Embark on a Journey of Limitless
            Exploration with GenFlix
          </Text>
         
          <CustomButton
            title="Continue with Email"
            handlePress={() => router.push("/sign-in")}
            containerStyles="w-full mt-7"
          />
           <Text style={{fontSize: 15, fontFamily: 'Poppins-Regular', color: '#9ca3af', textAlign: 'center'}}>
            Made with ❤️ by Shashi
          </Text>

          
        </View>
      </ScrollView>

      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default Welcome;
