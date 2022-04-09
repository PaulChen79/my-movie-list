const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const panel = document.querySelector("#data-panel")
const movieModelTitle = document.querySelector("#movie-modal-title")
const searchForm = document.querySelector("#search-form")
const searchInput = document.querySelector('#search-input')
const paginators = document.querySelector('#paginator')

const movies_per_page = 12
const movies = []
let filteredMovies = []

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
                        <div class="card-footer text-muted d-flex justify-content-between">
                            <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal"  data-id="${movie.id}">More</button>
                            <button class="btn btn-info btn-add-favorite" data-id="${movie.id}">+</button>
                        </div>
                    </div>
                </div>
            </div>
        `
    })
    panel.innerHTML = movieHTML
}
const renderPaginator = (amount) => {
    const numbersPerPage = Math.ceil(amount / movies_per_page)
    let pagesHTML = ""
    for (let page = 1; page <= numbersPerPage; page++) {
        pagesHTML += `
            <li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>
        `
    }
    paginators.innerHTML = pagesHTML
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
const addToLocalStorage = (id) => {
    const favList = JSON.parse(localStorage.getItem("favoriteMovies")) || []
    const movie = movies.find(movie => movie.id === id)

    if (favList.some(movie => movie.id === id)) {
        return alert("該電影存在收藏清單")
    }
    favList.push(movie)
    localStorage.setItem("favoriteMovies", JSON.stringify(favList))
}
const getMoviesByPage = (page) => {
    const data = filteredMovies.length ? filteredMovies : movies
    const start = (page - 1) * movies_per_page
    return data.slice(start, start + movies_per_page)
}

axios
    .get(INDEX_URL)
    .then(response => {
        movies.push(...response.data.results)
        renderPaginator(movies.length)
        renderMovie(getMoviesByPage(1))
    })
    .catch(error => console.log(error))

panel.addEventListener("click", (event) => {
    if (event.target.matches(".btn-show-movie")) {
        showMovieModal(Number(event.target.dataset.id))
    } else if (event.target.matches(".btn-add-favorite")) {
        addToLocalStorage(Number(event.target.dataset.id))
    }
})

paginators.addEventListener("click", (event) => {
    if (event.target.tagName !== "A") return
    const page = event.target.dataset.page
    renderMovie(getMoviesByPage(page))
})

searchForm.addEventListener("submit", (event) => {
    event.preventDefault()
    const keyWord = searchInput.value.trim().toLowerCase()

    if (keyWord.length === 0) {
        return renderMovie(getMoviesByPage(1))
    }

    filteredMovies = movies.filter((movie) => movie.title.toLowerCase().includes(keyWord))

    if (filteredMovies.length === 0) {
        return alert(`沒有符合${searchInput.value}的結果`)
    }
    renderPaginator(filteredMovies.length)
    renderMovie(getMoviesByPage(1))
})