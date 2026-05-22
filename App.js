import { useState }from 'react';
import { StyleSheet, Text, View, TextInput, Image, Animated, Button } from 'react-native';

export default function App() {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shakeAnimation] = useState(new Animated.Value(0));
  const [answer,setAnswer] = useState("Ask the 8 Ball anything.");

  const shake = () => {
    Animated.sequence([
    Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
    Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: true }),
    Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
    Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: true }),
  ]).start();
  };

  const randomAnswer = async () => {
    const response = await fetch('https://eightballapi.com/api');
    const data = await response.json();
    setAnswer(data.reading);
    console.log(data.reading)
  }

  const shakeBall = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);

    shake();
    await randomAnswer();

    setIsLoading(false);
    setInputText('');
  }

  return (
    <View style={styles.container}>
      <Animated.Image 
        source={require('./assets/8ball.png')} 
        style={{ transform: [{ translateX: shakeAnimation }],
        margin: 30 }}
      />
      <Text style={styles.h2}>{answer}</Text>
      <TextInput
        value={inputText}
        onChangeText={setInputText}
        placeholder='type your question here'
      />
      <Button
        onPress={shakeBall}
        title='Ask the 8 Ball'
        color='000000'
        accessibilityLabel='Ask the 8 Ball'
        disabled={!inputText.trim() || isLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginTop: 10,
    width: '100%',
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  h1: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  h2: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
});