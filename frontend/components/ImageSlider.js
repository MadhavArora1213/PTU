import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { useLanguage } from '../context/LanguageContext';

const { width } = Dimensions.get('window');

const ImageSlider = () => {
  const { translate } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef(null);

  // Financial tips and education content for slider
  const sliderData = [
    {
      id: 1,
      title: 'Budget Planning',
      description: 'Create a monthly budget to track your income and expenses effectively',
      backgroundColor: '#2E7D32',
      icon: '💰'
    },
    {
      id: 2,
      title: 'Emergency Fund',
      description: 'Build an emergency fund covering 6 months of your expenses',
      backgroundColor: '#388E3C',
      icon: '🛡️'
    },
    {
      id: 3,
      title: 'Investment Tips',
      description: 'Start investing early to benefit from compound interest',
      backgroundColor: '#43A047',
      icon: '📈'
    },
    {
      id: 4,
      title: 'Fraud Protection',
      description: 'Stay alert against financial frauds and scams',
      backgroundColor: '#4CAF50',
      icon: '🔒'
    },
    {
      id: 5,
      title: 'Digital Banking',
      description: 'Use secure digital banking for convenient transactions',
      backgroundColor: '#66BB6A',
      icon: '📱'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % sliderData.length;
        scrollViewRef.current?.scrollTo({
          x: nextIndex * width,
          animated: true,
        });
        return nextIndex;
      });
    }, 4000); // Auto-scroll every 4 seconds

    return () => clearInterval(timer);
  }, []);

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setCurrentIndex(index);
  };

  const scrollToIndex = (index) => {
    setCurrentIndex(index);
    scrollViewRef.current?.scrollTo({
      x: index * width,
      animated: true,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={styles.scrollView}
      >
        {sliderData.map((item, index) => (
          <View key={item.id} style={[styles.slide, { backgroundColor: item.backgroundColor }]}>
            <Text style={styles.icon}>{item.icon}</Text>
            <Text style={styles.title}>{translate(item.title, item.title)}</Text>
            <Text style={styles.description}>{translate(item.description, item.description)}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Pagination dots */}
      <View style={styles.pagination}>
        {sliderData.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dot,
              index === currentIndex ? styles.activeDot : styles.inactiveDot
            ]}
            onPress={() => scrollToIndex(index)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
    marginVertical: 20,
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width: width - 40,
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  icon: {
    fontSize: 40,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFDE7', // Cream text
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#FFFDE7', // Cream text
    textAlign: 'center',
    lineHeight: 20,
    opacity: 0.9,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#FFEB3B', // Accent color
    width: 20,
  },
  inactiveDot: {
    backgroundColor: '#E8F5E9', // Light green
    opacity: 0.5,
  },
});

export default ImageSlider;