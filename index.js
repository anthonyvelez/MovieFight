//Fetching configuration
const fetchData = async (searchTerm) => {
	const response = await axios.get('http://www.omdbapi.com/', {
		params : {
			apikey : '15afa833',
			s      : searchTerm
		}
	});

	if (response.data.Error) {
		return [];
	}

	return response.data.Search;
};

//html div where child elements will be appended
const root = document.querySelector('.autocomplete');

//appending child html elements
root.innerHTML = `
<div>
<label><b>Search For a Movie</b></label>
<input class='input'/>
</div>

<div class='dropdown'>
    <div class='dropdown-menu'>
        <div class='dropdown-content results'></div>
    </div>
</div>`;

//selecting html elements for DOM manipulation
const input = document.querySelector('input');
const dropdown = document.querySelector('.dropdown');
const resultsWrapper = document.querySelector('.results');

//Input and Dropdown functionality
const onInput = async (event) => {
	const movies = await fetchData(event.target.value);

	if (!movies.length) {
		dropdown.classList.remove('is-active');
		return;
	}

	resultsWrapper.innerHTML = '';
	dropdown.classList.add('is-active');

	for (let movie of movies) {
		const option = document.createElement('a');
		const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;

		//add bulma styles
		option.classList.add('dropdown-item');
		//adding content into anchor tags
		option.innerHTML = `
         <img src="${imgSrc}"/>
         ${movie.Title}
         `;

		//listening for a movie selection
		option.addEventListener('click', () => {
			dropdown.classList.remove('is-active');
			input.value = movie.Title;
			//Passing off following functionality to seperate function
			onMovieSelect(movie);
		});

		resultsWrapper.appendChild(option);
	}
};

input.addEventListener('input', debounce(onInput, 1000));

//closing dropdown if user clicks away
document.addEventListener('click', (event) => {
	if (!root.contains(event.target)) {
		dropdown.classList.remove('is-active');
	}
});

//fetching another level deeper for movie information
const onMovieSelect = async (movie) => {
	const response = await axios.get('http://www.omdbapi.com/', {
		params : {
			apikey : '15afa833',
			i      : movie.imdbID
		}
	});

	document.querySelector('#summary').innerHTML = movieTemplate(response.data);
};

//Auto-complete html rendering
const movieTemplate = (movieDetail) => {
	return `
         <article class="media"> 
            <figure class="media-left">
                <p class="image">
                    <img src="${movieDetail.Poster}"/>
                </p>
            </figure>

            <div class="media-content">
                <div class="content"> 
                    <h1>${movieDetail.Title}</h1>
                    <h4>${movieDetail.Genre}</h4>
                    <p>${movieDetail.Plot}</p>
                </div>
            </div>
         </article>
         <article class="notification is-primary">
            <p class="title">${movieDetail.Awards}</p>
            <p class="subtitle">Awards</p>
         </article>
         <article class="notification is-primary">
             <p class="title">${movieDetail.BoxOffice}</p>
             <p class="subtitle">Box Office</p>
         </article>
         <article class="notification is-primary">
             <p class="title">${movieDetail.Metascore}</p>
             <p class="subtitle">Metascore</p>
         </article>
         <article class="notification is-primary">
             <p class="title">${movieDetail.imdbRating}</p>
             <p class="subtitle">Imdb Rating</p>
         </article>
         <article class="notification is-primary">
             <p class="title">${movieDetail.imdbVotes}</p>
             <p class="subtitle">Imdb Votes</p>
         </article>
    `;
};
