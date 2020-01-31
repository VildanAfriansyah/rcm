import React, {useEffect} from 'react';
import {View, StyleSheet, Image, Text, ImageBackground} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';

const Splash = props => {
  useEffect(() => {
    setTimeout(() => {
      props.navigation.navigate('Login');
    }, 2000);
  }, [props.navigation]);
  return (
    <LinearGradient
      start={{x: 0.0, y: 0.25}}
      end={{x: 0.5, y: 1.0}}
      locations={[0, 0.5, 0.6]}
      colors={['#C3E0F0', '#C3E0F0', '#fff']}
      style={styles.bg}>
      <Image source={require('../assets/bg2.jpg')} style={styles.image} />
    </LinearGradient>
  );
};

export default Splash;

const styles = StyleSheet.create({
  bg: {
    width: wp('100%'),
    height: hp('100%'),
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#C3E0F0',
  },
  image: {
    width: wp('100%'),
    height: hp('100%'),
    flex: 1,
    resizeMode: 'contain',
  },
});
