import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

interface Props {
  error: Error;
  retry: () => void;
}

export default function ErrorBoundary({ error, retry }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>앱에 문제가 발생했습니다</Text>
      <Text style={styles.message}>
        잠시 후 다시 시도해주세요.
      </Text>
      
      {__DEV__ && (
        <Text style={styles.errorDetails}>
          {error.message}
        </Text>
      )}
      
      <TouchableOpacity style={styles.button} onPress={retry}>
        <Text style={styles.buttonText}>다시 시도</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.button, styles.secondaryButton]} 
        onPress={() => router.replace('/')}
      >
        <Text style={styles.buttonText}>홈으로 이동</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  errorDetails: {
    fontSize: 12,
    color: '#999',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  secondaryButton: {
    backgroundColor: '#666',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});