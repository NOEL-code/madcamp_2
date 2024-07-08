import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';

const NavBar = ({ navigation, currentRoute }) => {

  const getIconSource = (route) => {
    switch (route) {
      case 'Stat':
        return currentRoute === 'Stat'
          ? require('assets/images/statistics.png')
          : require('assets/images/staticsNotSelected.png');
      case 'Main':
        return currentRoute === 'Main'
          ? require('assets/images/home.png')
          : require('assets/images/HomeNotSelected.png');
      case 'Profile':
        return currentRoute === 'Profile'
          ? require('assets/images/myPage.png')
          : require('assets/images/myPageNotSelected.png');
      default:
        return null;
    }
  };

  return (
    <View style={styles.navbar}>
      <TouchableOpacity onPress={() => navigation.navigate('Stat')}>
        <Image
          source={getIconSource('Stat')}
          style={styles.navIcon}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Main')}>
        <Image
          source={getIconSource('Main')}
          style={styles.navIcon}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
        <Image
          source={getIconSource('Profile')}
          style={styles.navIcon}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 18,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  navIcon: {
    width: 30,
    height: 30,
  },
});

export default NavBar;
