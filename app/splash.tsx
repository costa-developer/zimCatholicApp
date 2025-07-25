// app/splash.tsx
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/home');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/icons/praying.png')} 
        style={styles.logo}
        resizeMode="contain"
        accessibilityLabel="Zim Catholic App logo"
      />
      <Text style={styles.title}>Zim Catholic App</Text>
      <Text style={styles.subtitle}>🙏 In the name of the Father...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff3e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4e342e',
  },
  subtitle: {
    fontSize: 16,
    color: '#6d4c41',
    marginTop: 10,
  },
});
