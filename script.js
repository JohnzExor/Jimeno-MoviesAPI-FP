const container = document.getElementById("container");
const form = document.getElementById("form");
const details = document.getElementById("details");
const searchValue = document.getElementById("searchValue");

const apiKey = "190459cb7522c147260473041d9226ca";
const webLink = "http://image.tmdb.org/t/p/w500/";
let pageIndex = 1;
let maxPageIndex = null;

const nextPage = () => {
  if (pageIndex < maxPageIndex) fetchUpComingMovies((pageIndex += 1));
};

const backPage = () => {
  if (pageIndex > 1) fetchUpComingMovies((pageIndex -= 1));
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  fetchSearchMovie(searchValue.value);
});

const moviesTemplate = (id, poster_path, original_title) => {
  return `<button ondblclick="fetchMovieDetails(${id})" class=movies-btn>
            <img class=movie-poster src=${webLink}${poster_path}>
            <span>${original_title}</span>
          </button>`;
};

const movieDetailsTemplate = (
  poster_path,
  genres,
  original_title,
  release_date,
  overview,
  popularity,
  belongs_to_collection
) => {
  return `<div class=movie-details>
            <img src=${webLink}${poster_path} class=movie-details-poster>
            <div class=movie-details-text>
              <p>${genres.map(({ name }) => name).join(" - ")}</p>
              <p>Popularity: ${popularity}</p>
              <h1>${original_title}</h1>
              <p>Release Date: ${release_date}</p>
              <p style=font-weight:bold>Overview: <br><span style=font-weight: normal>${overview}</span></p>
              <p style=font-weight:bold>Belongs to the collection:</p>
              ${
                belongs_to_collection
                  ? `<div class=collection>
                      <img class=small-img src=${webLink}${belongs_to_collection.poster_path}> 
                      <span>${belongs_to_collection.name}</span>
                    </div>
                  `
                  : null
              }
            </div>
          </div>`;
};

const fetchUpComingMovies = async (index) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=en-US&page=${index}`
    );
    const { results, page, total_pages } = await response.json();
    maxPageIndex = total_pages;
    container.innerHTML = `
    <div class=movies-page>
      <h1 class=page-title>Upcoming Movies<h1>
      <div class=movies>
         ${results
           .map(({ id, poster_path, original_title }) =>
             moviesTemplate(id, poster_path, original_title)
           )
           .join("")}
      </div>
      <div class=page-buttons>
          <button onclick=backPage() class=interactable>Back</button>
          <span>Page ${page} out of ${total_pages}</span>
          <button onclick=nextPage() class=interactable>Next</button>
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
          .map(({ id, poster_path, original_title }) =>
            moviesTemplate(id, poster_path, original_title)
          )
          .join("")}
      </div>
    </div>`;
  } catch (error) {
    console.log(error.message);
  }
};

const fetchMovieDetails = async (movieID) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieID}?api_key=${apiKey}&language=en-US`
    );
    const {
      id,
      poster_path,
      genres,
      original_title,
      release_date,
      overview,
      popularity,
      belongs_to_collection,
    } = await response.json();

    container.innerHTML = `
      <div class=movies-page>
      ${movieDetailsTemplate(
        poster_path,
        genres,
        original_title,
        release_date,
        overview,
        popularity,
        belongs_to_collection
      )}
        <h1 class=page-title>You may also like</h1>
        <div class=movies>
          ${await fetchSimilarMovies(id)}
        </div>
      </div>`;
  } catch (error) {
    console.log(error.message);
  }
};

const fetchSimilarMovies = async (id) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${apiKey}&language=en-US&page=1`
  );
  const { results } = await response.json();

  return results
    .map(({ id, poster_path, original_title }) =>
      moviesTemplate(id, poster_path, original_title)
    )
    .join("");
};

fetchUpComingMovies(pageIndex);
