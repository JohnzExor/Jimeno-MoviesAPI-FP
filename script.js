const container = document.getElementById("container");
const form = document.getElementById("form");
const details = document.getElementById("details");

const apiKey = "190459cb7522c147260473041d9226ca";
const webLink = "http://image.tmdb.org/t/p/w500/";

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = document.getElementById("searchValue").value;
  fetchSearchMovie(value);
});

const moviesTemplate = (id, backdrop_path, original_title) => {
  return `<button ondblclick="fetchMovieDetails(${id})" class=movies-btn>
            <img class=movie-poster src=${webLink}${backdrop_path}>
            <span>${original_title}</span>
          </button>`;
};

const fetchUpComingMovies = async () => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=en-US&page=1`
    );
    const data = await response.json();

    container.innerHTML = `
    <div>
      <h1>Upcoming Movies<h1>
      <div class=movies>
         ${data.results
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
    const data = await response.json();
    container.innerHTML = `
    <div>
      <h1>You searched for ${name}<h1>
      <div class=movies>
        ${data.results
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
    const data = await response.json();
    const similarData = await similarResponse.json();

    container.innerHTML = `
      <div>
      <img src=${webLink}${data.backdrop_path}>
        <h1>${data.original_title}</h1>
        <p>${data.overview}</p>
        <h1>Similar Movies</h1>
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
