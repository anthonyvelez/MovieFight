const creatAutocomplete = ({ root, renderOption, onOptionSelect, inputValue, fetchData }) => {
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
	const input = root.querySelector('input');
	const dropdown = root.querySelector('.dropdown');
	const resultsWrapper = root.querySelector('.results');

	//Input and Dropdown functionality
	const onInput = async (event) => {
		const items = await fetchData(event.target.value);

		if (!items.length) {
			dropdown.classList.remove('is-active');
			return;
		}

		resultsWrapper.innerHTML = '';
		dropdown.classList.add('is-active');

		for (let item of items) {
			const option = document.createElement('a');

			//add bulma styles
			option.classList.add('dropdown-item');
			//adding content into anchor tags
			option.innerHTML = renderOption(item);
			//listening for a movie selection
			option.addEventListener('click', () => {
				dropdown.classList.remove('is-active');
				input.value = inputValue(item);
				//Passing off following functionality to seperate function
				onOptionSelect(item);
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
};
