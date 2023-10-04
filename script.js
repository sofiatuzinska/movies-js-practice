const refs = {
    list: document.querySelector(".js-movie-list"),
    loadMore: document.querySelector(".js-load-more"),
  };
  
  let page = 1;
  
  refs.loadMore.addEventListener("click", onLoadMore);
  
  serviceMovie()
    .then((data) => {
      refs.list.insertAdjacentHTML("beforeend", createMarkup(data.results));
  
      if (data.page < data.total_pages) {
        refs.loadMore.classList.replace("load-more-hidden", "load-more");
      }
    })
    .catch((err) => console.log(err));
  
  function onLoadMore({ target }) {
    page += 1;
    target.disabled = true;
  
    serviceMovie(page)
      .then((data) => {
        refs.list.insertAdjacentHTML("beforeend", createMarkup(data.results));
  
        if (data.page >= data.total_pages) {
          refs.loadMore.classList.replace("load-more", "load-more-hidden");
        }
      })
      .catch((err) => console.log(err))
      .finally(() => (target.disabled = false));
  }
  
  function serviceMovie(page = 1) {
    const BASE_URL = "https://api.themoviedb.org/3";
    const API_KEY = "92a9a9e3708a3e9451b7037d5906879a";
    const END_POINT = "trending/movie/week";
  
    const params = new URLSearchParams({
      api_key: API_KEY,
      page,
    });
  
    return fetch(`${BASE_URL}/${END_POINT}?${params}`).then((resp) => {
      if (!resp.ok) {
        throw new Error(`Fetch error with ${resp.status}: ${resp.statusText}`);
      }
      return resp.json();
    });
  }
  
  function createMarkup(arr) {
    return arr
      .map(
        ({ poster_path, original_title, release_date, vote_average }) => `
      <li class="movie-card">
        <img src="https://image.tmdb.org/t/p/w500${poster_path}" alt="${original_title}">
        <div class="movie-info">
          <h2>${original_title}</h2>
          <p>Release Date: ${release_date}</p>
          <p>Vote Average: ${vote_average}</p>
        </div>
      </li>
      `
      )
      .join("");
  }