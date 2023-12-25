const container = document.getElementById("container");
const popup = document.getElementById("popup");
const form = document.getElementById("form");
const details = document.getElementById("details");

const apiKey = "190459cb7522c147260473041d9226ca";
const webLink = "http://image.tmdb.org/t/p/w500/";

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = document.getElementById("searchValue").value;
  fetchSearchMovie(value);
});

const showDetails = (id) => {
  document.getElementById("details-container").style.display = "flex";
  fetchMovieDetails(id);
};

const closeDetails = () => {
  document.getElementById("details-container").style.display = "none";
};

const moviesTemplate = (id, backdrop_path, original_title) => {
  return `<button onclick="showDetails(${id})"><img src=${webLink}${backdrop_path}><span>${original_title}</span></button>`;
};

const fetchUpComingMovies = async () => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=en-US&page=1`
    );
    const data = await response.json();

    container.innerHTML = data.results
      .map(({ id, backdrop_path, original_title }) =>
        moviesTemplate(id, backdrop_path, original_title)
      )
      .join("");
  } catch (error) {
    console.log(error.message);
  }
};

const fetchSearchMovie = async (name) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${name}`
    );
    const data = await response.json();
    container.innerHTML = data.results.map(
      ({ id, backdrop_path, original_title }) =>
        moviesTemplate(id, backdrop_path, original_title)
    );
  } catch (error) {
    console.log(error.message);
  }
};

const fetchMovieDetails = async (id) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`
    );
    const data = await response.json();

    details.innerHTML = `<div><h1>${data.original_title}</h1><p>${data.overview}</p></div`;
  } catch (error) {
    console.log(error.message);
  }
};

fetchUpComingMovies();
