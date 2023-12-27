const container = document.getElementById("container");
const form = document.getElementById("form");
const details = document.getElementById("details");
const searchValue = document.getElementById("searchValue");

const apiKey = "190459cb7522c147260473041d9226ca";
const webLink = "http://image.tmdb.org/t/p/w500/";

form.addEventListener("submit", (e) => {
  e.preventDefault();
  fetchSearchMovie(searchValue.value);
});

const moviesTemplate = (id, backdrop_path, original_title) => {
  return `<button ondblclick="fetchMovieDetails(${id})" class=movies-btn>
            <img class=movie-poster src=${webLink}${backdrop_path}>
            <span>${original_title}</span>
          </button>`;
};

const movieDetailsTemplate = (
  backdrop_path,
  genres,
  original_title,
  release_date,
  overview
) => {
  return `<div class=movie-details>
            <img src=${webLink}${backdrop_path} class=movie-details-poster>
            <span>
              <p>${genres.map(({ name }) => name).join(" - ")}</p>
              <h1>${original_title}</h1>
              <p>Release Date: ${release_date}</p>
              <p style=font-weight:bold>Overview: <br><span style=font-weight: normal>${overview}</span></p>
            </span>
          </div>`;
};

const fetchUpComingMovies = async () => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=en-US&page=1`
    );
    const { results } = await response.json();

    container.innerHTML = `
    <div class=movies-page>
      <h1 class=page-title>Upcoming Movies<h1>
      <div class=movies>
         ${results
           .map(({ id, backdrop_path, original_title }) =>
             moviesTemplate(id, backdrop_path, original_title)
           )
           .join("")}
      </div>
    </div>`;
  } catch (error) {
    console.log(error.message);
  }
};

const fetchSearchMovie = async (name) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${name}`
    );
    const { results } = await response.json();
    container.innerHTML = `
    <div class=movies-page>
      <h1 class=page-title>You searched for ${name}<h1>
      <div class=movies>
        ${results
          .map(({ id, backdrop_path, original_title }) =>
            moviesTemplate(id, backdrop_path, original_title)
          )
          .join("")}
      </div>
    </div>`;
  } catch (error) {
    console.log(error.message);
  }
};

const fetchMovieDetails = async (id) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`
    );
    const similarResponse = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${apiKey}&language=en-US&page=1`
    );
    const { backdrop_path, genres, original_title, release_date, overview } =
      await response.json();
    const similarData = await similarResponse.json();

    container.innerHTML = `
      <div class=movies-page>
      ${movieDetailsTemplate(
        backdrop_path,
        genres,
        original_title,
        release_date,
        overview
      )}
        <h1 class=page-title>You may also like</h1>
        <div class=movies>
          ${similarData.results
            .map(({ id, backdrop_path, original_title }) =>
              moviesTemplate(id, backdrop_path, original_title)
            )
            .join("")}
        </div>
      </div>`;
  } catch (error) {
    console.log(error.message);
  }
};

fetchUpComingMovies();
