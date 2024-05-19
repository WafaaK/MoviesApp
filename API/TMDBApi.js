const API_TOKEN = "720fa6c11b82de2ff84c5a8588a005e5";

export function getFilmsFromApiWithSearchedText(text, page) {
  const url =
    'https://api.themoviedb.org/3/search/movie?api_key=' +
    API_TOKEN +
    '&language=fr&query=' +
    text +
    "&page=" +
    page;
  return fetch(url)
    .then((response) => response.json())
    .catch((error) => console.error(error));
}

export function getImageFromApi(name) {
  return 'https://image.tmdb.org/t/p/w300' + name;
}

export function getMovieDetails(movieId) {
  const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_TOKEN}&language=fr`;

  return fetch(url)
    .then((response) => response.json())
    .catch((error) => console.error(error));
}
export function getNearbyCinemas(latitude, longitude, radius = 5000) {
  const apiKey = 'AIzaSyDNvcE55DoV9q7bKx2Z-SRxWUfqVqR-kQs';
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=movie_theater&key=${apiKey}`;

  return fetch(url)
    .then((response) => response.json())
    .catch((error) => console.error(error));
}

export function getMovieTheatres(movieId) {
  const url = `https://api.themoviedb.org/3/movie/${movieId}/theatres?api_key=${API_TOKEN}`;

  return fetch(url)
    .then((response) => response.json())
    .catch((error) => console.error(error));
}
