// CinemaCard.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CinemaCard = ({ cinema }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{cinema.name}</Text>
      <Text style={styles.address}>{cinema.address}</Text>
      <Text style={styles.showtimes}>{cinema.showtimes.join(', ')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  address: {
    fontSize: 14,
    color: '#666',
  },
  showtimes: {
    fontSize: 14,
    color: '#333',
  },
});

export default CinemaCard;
