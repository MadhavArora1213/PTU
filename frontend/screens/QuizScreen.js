import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert, Modal } from 'react-native';
import { ProgressCircle } from 'react-native-svg-charts';

const QuizScreen = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [userPoints, setUserPoints] = useState(1250); // Mock user points
  const [achievements, setAchievements] = useState([]); // Mock achievements

  useEffect(() => {
    // Fetch quizzes
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      // Replace with your actual backend URL
      // const response = await axios.get('http://localhost:5000/api/quiz');
      
      // For demo purposes, using mock data
      setQuizzes([
        {
          id: 1,
          title: "Financial Basics",
          description: "Test your knowledge of basic financial concepts",
          questions: [
            {
              id: 1,
              question: "What is the primary purpose of an emergency fund?",
              options: [
                "To invest in stocks",
                "To cover unexpected expenses",
                "To pay off credit card debt",
                "To save for vacation"
              ],
              correctAnswer: 1
            },
            {
              id: 2,
              question: "Which of the following is NOT a type of investment?",
              options: [
                "Stocks",
                "Bonds",
                "Savings Account",
                "Real Estate"
              ],
              correctAnswer: 2
            },
            {
              id: 3,
              question: "What does APR stand for?",
              options: [
                "Annual Percentage Rate",
                "Average Payment Return",
                "Annual Payment Ratio",
                "Average Percentage Return"
              ],
              correctAnswer: 0
            }
          ]
        },
        {
          id: 2,
          title: "Investment Strategies",
          description: "Test your knowledge of investment strategies",
          questions: [
            {
              id: 1,
              question: "What is diversification in investing?",
              options: [
                "Investing all money in one stock",
                "Spreading investments across different assets",
                "Investing only in government bonds",
                "Avoiding all investment risks"
              ],
              correctAnswer: 1
            },
            {
              id: 2,
              question: "What is compound interest?",
              options: [
                "Interest paid only on the principal amount",
                "Interest paid on both principal and accumulated interest",
                "A fee charged by banks",
                "A type of investment tax"
              ],
              correctAnswer: 1
            }
          ]
        }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch quizzes');
    }
  };

  const startQuiz = (quiz) => {
    setCurrentQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setScore(0);
    setQuizCompleted(false);
  };

  const handleOptionSelect = (optionIndex) => {
    setSelectedOption(optionIndex);
  };

  const handleNextQuestion = () => {
    if (selectedOption === null) {
      Alert.alert('Please select an option');
      return;
    }

    // Check if answer is correct
    const currentQuestion = currentQuiz.questions[currentQuestionIndex];
    if (selectedOption === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }

    // Move to next question or finish quiz
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    } else {
      // Quiz completed
      setQuizCompleted(true);
      
      // Calculate points earned
      const pointsEarned = score * 10 + 50; // 10 points per correct answer + 50 completion bonus
      setUserPoints(userPoints + pointsEarned);
      
      // Check for achievements
      const newAchievements = [];
      if (score === currentQuiz.questions.length) {
        newAchievements.push({
          id: Date.now(),
          name: "Quiz Master",
          description: `Scored 100% in ${currentQuiz.title}`,
          points: 100
        });
      }
      
      if (newAchievements.length > 0) {
        setAchievements([...achievements, ...newAchievements]);
      }
    }
  };

  const resetQuiz = () => {
    setCurrentQuiz(null);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setScore(0);
    setQuizCompleted(false);
  };

  const renderQuizList = () => {
    return quizzes.map((quiz) => (
      <View key={quiz.id} style={styles.quizCard}>
        <Text style={styles.quizTitle}>{quiz.title}</Text>
        <Text style={styles.quizDescription}>{quiz.description}</Text>
        <Text style={styles.quizQuestions}>
          {quiz.questions.length} questions
        </Text>
        <TouchableOpacity 
          style={styles.startButton}
          onPress={() => startQuiz(quiz)}
        >
          <Text style={styles.startButtonText}>Start Quiz</Text>
        </TouchableOpacity>
      </View>
    ));
  };

  const renderCurrentQuestion = () => {
    if (!currentQuiz) return null;
    
    const question = currentQuiz.questions[currentQuestionIndex];
    const progress = (currentQuestionIndex + 1) / currentQuiz.questions.length;
    
    return (
      <View style={styles.questionContainer}>
        <View style={styles.progressContainer}>
          <ProgressCircle
            style={styles.progressChart}
            progress={progress}
            progressColor={'#2E8B57'}
            backgroundColor={'#f0f0f0'}
            strokeWidth={8}
          />
          <Text style={styles.progressText}>
            {currentQuestionIndex + 1} / {currentQuiz.questions.length}
          </Text>
        </View>
        
        <Text style={styles.questionText}>{question.question}</Text>
        
        {question.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              selectedOption === index && styles.selectedOption
            ]}
            onPress={() => handleOptionSelect(index)}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
        
        <TouchableOpacity 
          style={styles.nextButton}
          onPress={handleNextQuestion}
          disabled={selectedOption === null}
        >
          <Text style={styles.nextButtonText}>
            {currentQuestionIndex < currentQuiz.questions.length - 1 ? 'Next' : 'Finish'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderQuizResults = () => {
    if (!currentQuiz) return null;
    
    const percentage = (score / currentQuiz.questions.length) * 100;
    const pointsEarned = score * 10 + 50;
    
    return (
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>Quiz Completed!</Text>
        
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>{score} / {currentQuiz.questions.length}</Text>
          <Text style={styles.percentageText}>{percentage.toFixed(0)}%</Text>
        </View>
        
        <View style={styles.pointsContainer}>
          <Text style={styles.pointsText}>Points Earned: {pointsEarned}</Text>
          <Text style={styles.totalPointsText}>Total Points: {userPoints + pointsEarned}</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.restartButton}
          onPress={resetQuiz}
        >
          <Text style={styles.restartButtonText}>Back to Quizzes</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Financial Quiz</Text>
        <Text style={styles.subtitle}>Test your financial knowledge and earn points</Text>
      </View>

      <View style={styles.pointsCard}>
        <Text style={styles.pointsTitle}>Your Points</Text>
        <Text style={styles.pointsValue}>{userPoints} points</Text>
      </View>

      {!currentQuiz && (
        <View style={styles.quizzesContainer}>
          {renderQuizList()}
        </View>
      )}

      {currentQuiz && !quizCompleted && renderCurrentQuestion()}
      
      {quizCompleted && renderQuizResults()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2E8B57',
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  pointsCard: {
    backgroundColor: '#FFD700',
    padding: 20,
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  pointsTitle: {
    fontSize: 18,
    color: '#333',
    marginBottom: 5,
  },
  pointsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  quizzesContainer: {
    padding: 20,
  },
  quizCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quizTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  quizDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  quizQuestions: {
    fontSize: 14,
    color: '#2E8B57',
    marginBottom: 15,
  },
  startButton: {
    backgroundColor: '#2E8B57',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  questionContainer: {
    padding: 20,
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  progressChart: {
    height: 100,
    width: 100,
  },
  progressText: {
    position: 'absolute',
    top: 40,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedOption: {
    backgroundColor: '#e8f5e9',
    borderColor: '#2E8B57',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  nextButton: {
    backgroundColor: '#2E8B57',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultsContainer: {
    padding: 20,
    alignItems: 'center',
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E8B57',
    marginBottom: 30,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  scoreText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
  },
  percentageText: {
    fontSize: 24,
    color: '#2E8B57',
  },
  pointsContainer: {
    backgroundColor: '#e8f5e9',
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
    alignItems: 'center',
  },
  pointsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E8B57',
    marginBottom: 10,
  },
  totalPointsText: {
    fontSize: 16,
    color: '#333',
  },
  restartButton: {
    backgroundColor: '#2E8B57',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  restartButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default QuizScreen;