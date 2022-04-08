const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const panel = document.querySelector("#data-panel")
const movieModelTitle = document.querySelector("#movie-modal-title")
const searchForm = document.querySelector("#search-form")
const searchInput = document.querySelector('#search-input')
const movies = []

const renderMovie = (data) => {
    let movieHTML = ""
    data.forEach(movie => {
        movieHTML += `
            <div class="col-sm-3">
                <div class="mb-2">
                    <div class="card" style="width: 18rem;">
                        <img src="${POSTER_URL + movie.image}" class="card-img-top" alt="Movie Poster">
                        <div class="card-body">
                            <h5 class="card-title">${movie.title}</h5>
                        </div>
                        <div class="card-footer text-muted">
                            <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal"  data-id="${movie.id}">More</button>
                            <button class="btn btn-info btn-add-favorite">+</button>
                        </div>
                    </div>
                </div>
            </div>
        `
    })
    panel.innerHTML = movieHTML
}
const showMovieModal = (id) => {
    const modalTitle = document.querySelector('#movie-modal-title')
    const modalImage = document.querySelector('#movie-modal-image')
    const modalDate = document.querySelector('#movie-modal-date')
    const modalDescription = document.querySelector('#movie-modal-description')
    axios
        .get(INDEX_URL + id)
        .then(response => {
            const data = response.data.results
            modalTitle.innerText = data.title
            modalImage.innerHTML = `<img src="${POSTER_URL + data.image}" alt="" class="img-fluid">`
            modalDate.innerText = "Release Date: " + data.release_date
            modalDescription.innerText = data.description
        })
}
const searching = (event) => {
    event.preventDefault()
    const keyWord = searchInput.value.trim().toLowerCase()
    let filteredMovies = []

    if (!keyWord.length) {
        renderMovie(movies)
    }

    filteredMovies = movies.filter((movie) => movie.title.toLowerCase().includes(keyWord))

    if (filteredMovies.length === 0) {
        return alert(`沒有符合${searchInput.value}的結果`)
    }
    renderMovie(filteredMovies)
}

axios
    .get(INDEX_URL)
    .then(response => {
        movies.push(...response.data.results)
        renderMovie(movies)
    })

panel.addEventListener("click", (event) => {
    if (event.target.matches(".btn-show-movie")) {
        showMovieModal(event.target.dataset.id)
    }
})

searchForm.addEventListener("submit", searching)