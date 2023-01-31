var page = 1;
const perPage = 10;

function loadMovieData(title = null) {
    if (title != null) {
        page = 1
    }
    let url = title
        ? `/api/movies?page=${page}&perPage=${perPage}&title=${title}`
        : `/api/movies?page=${page}&perPage=${perPage}`

    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            if (title != null) {
                page = 1
                if (title != "") {
                    let pagi = document.querySelector(".pagination")
                    pagi.classList.add("d-none")
                }
                else {
                    if (document.querySelector(".d-none")) {
                        let pagi = document.querySelector(".d-none")
                        pagi.classList.remove("d-none")
                    }
                }
            }
            else {
                title = null
                if (document.querySelector(".d-none")) {
                    let pagi = document.querySelector(".d-none")
                    pagi.classList.remove("d-none")
                }
            }
            console.log(data);
            let rows =
                `${data.map(movie => (
                    `<tr data-id=${movie._id}>
                        <td>${movie.year}</td>
                        <td>${movie.title}</td>
                        <td>
                        ${(() => {
                        if (movie.plot) {
                            return movie.plot;
                        }
                        else {
                            return "N/A";
                        }
                    })()}
                        </td>
                        <td>
                        ${(() => {
                        if (movie.rated) {
                            return movie.rated;
                        }
                        else {
                            return "N/A";
                        }
                    })()}
                        </td>
                        <td>
                            ${Math.floor(movie.runtime / 60)} :
                            ${(movie.runtime % 60).toString().padStart(2, '0')}
                        </td>`
                )).join('')}`

            document.querySelector('#moviesTable tbody').innerHTML = rows;

            document.querySelector('#cur-page').innerHTML = page

            document.querySelectorAll('#moviesTable tbody tr').forEach((row) => {
                row.addEventListener('click', (e) => {
                    let clickedId = row.getAttribute('data-id');

                    fetch(`/api/movies/${clickedId}`)
                        .then((res) => res.json())
                        .then((data) => {
                            console.log(data);
                            document.querySelector('#detailsModal .modal-header .modal-title').innerHTML = data.title;

                            let movieData = `
                            <img class="img-fluid w-100" src=${data.poster} alt=""/><br><br>
                            <strong>Directed By:</strong> ${data.directors.join()}<br><br>
                            <p>${data.fullplot}</p>
                            <strong>Cast:</strong>${(() => {
                                    if (data.cast.length >= 1) {
                                        return data.cast.join();
                                    }
                                    else {
                                        return "N/A"
                                    }
                                })()}<br><br>
                            <strong>Awards:</strong>${data.awards.text}<br>
                            <strong>IMDB Rating:</strong> ${data.imdb.rating} (${data.imdb.votes} votes)
                            `

                            document.querySelector('#detailsModal .modal-body').innerHTML = movieData;

                            let modal = new bootstrap.Modal(document.getElementById('detailsModal'), {
                                backdrop: 'static',
                                keyboard: false,
                                focus: true,
                            });

                            modal.show();
                        });
                });
            });
        })
}

document.addEventListener('DOMContentLoaded', function () {
    loadMovieData();
    // populatePostsTable(4); // test with User ID 4 (to be removed after testing)

    document.querySelector('.pagination #pre-page').addEventListener('click', () => {
        if (page > 1) {
            page--;
            loadMovieData()
        }
    });

    document.querySelector('.pagination #next-page').addEventListener('click', () => {
        page++;
        loadMovieData()
    });

    document.querySelector('#searchForm').addEventListener('submit', (para) => {
        para.preventDefault();
        loadMovieData(document.querySelector('#title').value);
    })

    document.querySelector('#clearForm').addEventListener('click', () => {
        document.getElementById("title").reset;
        loadMovieData();
    })
});