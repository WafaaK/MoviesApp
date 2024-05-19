// Search.js

import React from 'react';
import { StyleSheet, View, TextInput, FlatList, ActivityIndicator, TouchableOpacity, Text, Modal, Button, Linking } from 'react-native';
import FilmItem from './FilmItem';
import CinemaCard from './CinemaCard';
import { getFilmsFromApiWithSearchedText, getMovieTheatres, getNearbyCinemas } from '../API/TMDBApi';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      films: [],
      isLoading: false,
      trailerFilmId: null,
      trailerUrl: '',
      isModalVisible: false,
      theatres: [],
      selectedFilmDetails: null,
      searchedText: "",
      selectedFilm: null,
      cinemas: [],
    };
  }

  componentDidMount() {
    // Récupérer les cinémas à proximité lorsque l'application est chargée
    this._getNearbyCinemas();
  }

  _getNearbyCinemas = () => {
    // Récupérer la position de l'utilisateur (vous devez utiliser le package react-native-geolocation-service ou un autre package pour cela)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // Appeler la fonction pour récupérer les cinémas à proximité
        getNearbyCinemas(latitude, longitude)
          .then((data) => {
            this.setState({ cinemas: data.results });
          })
          .catch((error) => {
            console.error('Erreur lors de la récupération des cinémas à proximité :', error);
          });
      },
      (error) => {
        console.error('Erreur lors de la récupération de la position de l\'utilisateur :', error);
      }
    );
  };

  _getMovieTheatres = (movieId) => {
    getMovieTheatres(movieId)
      .then(data => {
        this.setState({ theatres: data.results });
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des cinémas où le film est diffusé :', error);
      });
  };

  _loadFilms = () => {
    if (this.state.searchedText.length > 0) {
      this.setState({ isLoading: true });
      getFilmsFromApiWithSearchedText(this.state.searchedText, this.state.page + 1)
        .then(data => {
          this.setState(prevState => ({
            page: data.page,
            totalPages: data.total_pages,
            films: [...prevState.films, ...data.results],
            isLoading: false
          }));
        })
        .catch(error => {
          console.error('Erreur lors du chargement des films :', error);
          this.setState({ isLoading: false });
        });
    }
  }

  _searchTextInputChanged = (text) => {
    this.setState({ searchedText: text });
  }

  _searchFilms = () => {
    this.setState({
      page: 0,
      totalPages: 0,
      films: [],
    }, this._loadFilms);
  }

  _getFilmTrailer = (filmId) => {
    const apiKey = '720fa6c11b82de2ff84c5a8588a005e5';
    const apiUrl = `https://api.themoviedb.org/3/movie/${filmId}/videos?api_key=${apiKey}`;

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        if (data.results.length > 0) {
          const trailerKey = data.results[0].key;
          const trailerUrl = `https://www.youtube.com/embed/${trailerKey}`;
          this.setState({ trailerUrl, trailerFilmId: filmId, isModalVisible: true });

          const detailsUrl = `https://api.themoviedb.org/3/movie/${filmId}?api_key=${apiKey}&language=fr`;
          fetch(detailsUrl)
            .then(response => response.json())
            .then(details => {
              this.setState({ selectedFilmDetails: details, isModalVisible: true }, () => {
                this._getMovieTheatres(filmId); // Appel à la méthode pour récupérer les cinémas où le film est diffusé
              });
            })
            .catch(error => {
              console.error('Erreur lors de la récupération des détails du film:', error);
            });
        } else {
          console.log('Aucun trailer disponible pour ce film.');
        }
      })
      .catch(error => {
        console.error('Erreur lors de la récupération du trailer du film:', error);
      });
  };

  _closeModal = () => {
    this.setState({ trailerUrl: '', trailerFilmId: null, isModalVisible: false });
  };

  _displayLoading = () => {
    if (this.state.isLoading) {
      return (
        <View style={styles.loading_container}>
          <ActivityIndicator size="large" />
        </View>
      );
    }
  }

  _renderTheatres = () => {
    return (
      <View>
        <Text style={styles.title}>Cinémas où ce film est diffusé :</Text>
        <FlatList
          data={this.state.theatres}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => this._showOnMap(item)}>
              <Text>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  };

  _showOnMap = (theatre) => {
    const { lat, lng } = theatre.location; // Assurez-vous que le nom des champs est correct
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    Linking.openURL(url);
  };

  render() {
    return (
      <View style={styles.main_container}>
        <TextInput
          style={styles.textinput}
          placeholder="Titre du film"
          onChangeText={this._searchTextInputChanged}
          onSubmitEditing={this._searchFilms}
        />
        <FlatList
          data={this.state.films}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => this._getFilmTrailer(item.id)}>
              <FilmItem film={item} />
            </TouchableOpacity>
          )}
          onEndReachedThreshold={0.5}
          onEndReached={() => {
            if (this.state.page < this.state.totalPages) {
              this._loadFilms();
            }
          }}
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.isModalVisible}
          onRequestClose={this._closeModal}
        >
          <View style={styles.modal_container}>
            <View style={styles.modal_content}>
              <iframe
                width="560"
                height="315"
                src={this.state.trailerUrl}
                title="Trailer vidéo"
                frameBorder="0"
                allowFullScreen
              ></iframe>
              {this.state.selectedFilmDetails && (
                <View style={styles.details_container}>
                  <Text style={styles.title}>{this.state.selectedFilmDetails.title}</Text>
                  <Text>{this.state.selectedFilmDetails.overview}</Text>
                </View>
              )}
              <Button title="Fermer" onPress={this._closeModal} />
              {/* Ajout de la liste des cinémas où le film est diffusé */}
              {this._renderTheatres()}
              {/* Affichage des cinémas à proximité */}
              {this._renderNearbyCinemas()}
            </View>
          </View>
        </Modal>
        {this._displayLoading()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    marginTop: 20,
  },
  textinput: {
    marginLeft: 5,
    marginRight: 5,
    height: 50,
    borderColor: '#000000',
    borderWidth: 1,
    paddingLeft: 5,
  },
  loading_container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 100,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal_container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal_content: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  details_container: {
    marginTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default Search;
