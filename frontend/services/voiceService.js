import * as Speech from 'expo-speech';

const speak = (text, language = 'en') => {
  const options = {
    language,
    pitch: 1,
    rate: 1,
  };
  Speech.speak(text, options);
};

const stopSpeaking = () => {
  Speech.stop();
};

const isSpeaking = () => {
  return Speech.isSpeakingAsync();
};

export {
  speak,
  stopSpeaking,
  isSpeaking
};