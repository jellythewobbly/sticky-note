// Shorten DOM actions
const elementId = id => document.getElementById(id);
const elementsClass = className => document.getElementsByClassName(className);
const appendMain = element => elementId('main').appendChild(element);
const create = element => document.createElement(element);

const colors = {
	white: '#ffffff',
	red: '#ff0000',
	lime: '#00ff00',
	green: '#28a745',
	blue: '#007bff',
	red: '#ff0000',
	yellow: '#ffff00',
	light_blue: '#00ffff',
	pink: '#ff00ff',
	grey: '#808080'
};

// autosave reset upon refresh/DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
	if (localStorage.getItem('savedState')) {
		JSON.parse(localStorage.getItem('savedState')).forEach(i =>
			createNote(i.title, i.content, i.color)
		);
	}
});

class Note {
	constructor(title = 'Title', content = 'Take a note...', color = 'white') {
		this.title = title;
		this.content = content;
		this.color = color;
	}
}

let holder = [];

// creating note by class + appending to getElementById('main')
const createNote = (t, cont, col) => {
	const test = new Note(t, cont, col);

	// title of note
	let title = create('input');
	t ? (title.defaultValue = t) : (title.placeholder = test.title);
	title.className = 'title';
	title.addEventListener('focusout', function() {
		test.title = title.value;
		// save to localStorage?
		setTimeout(
			() => localStorage.setItem('savedState', JSON.stringify(holder)),
			0
		);
	});

	// text area for note body
	let content = create('textarea');
	cont ? (content.textContent = cont) : (content.placeholder = test.content);
	content.className = 'content';
	content.rows = '8';
	content.addEventListener('focusout', function() {
		test.content = content.value;
		// save to localStorage?
		setTimeout(
			() => localStorage.setItem('savedState', JSON.stringify(holder)),
			0
		);
	});

	// dropdown select for note color
	let select = create('select');
	select.className = 'selectColor';
	for (let color in colors) {
		let option = create('option');
		option.value = color;
		option.textContent = color.replace('_', ' ');
		select.appendChild(option);
	}
	select.selectedIndex = 0;
	select.addEventListener('change', function() {
		this.parentElement.style.backgroundColor = colors[this.value];
		test.color = this.value;
		// save to localStorage?
		setTimeout(
			() => localStorage.setItem('savedState', JSON.stringify(holder)),
			0
		);
	});

	// delete button within note
	let delButton = create('button');
	delButton.className = 'delButton';
	delButton.textContent = 'Delete';
	delButton.addEventListener('click', function() {
		this.parentElement.parentNode.removeChild(note);
		holder.splice(holder.indexOf(test), 1);
		// save to localStorage?
		setTimeout(
			() => localStorage.setItem('savedState', JSON.stringify(holder)),
			0
		);
	});

	// creating note itself and appending elements
	let note = create('div');
	note.appendChild(title);
	note.appendChild(content);
	note.appendChild(select);
	note.appendChild(delButton);
	note.className = 'note';
	note.style.backgroundColor = colors[col];
	note.addEventListener('mouseover', function() {
		// showing the dropdown selector + delete button
		this.querySelector('select').style.visibility = 'visible';
		this.querySelector('button').style.visibility = 'visible';
	});
	note.addEventListener('mouseout', function() {
		// hiding the dropdown selector + delete button
		this.querySelector('select').style.visibility = 'hidden';
		this.querySelector('button').style.visibility = 'hidden';
		// save to localStorage?
		setTimeout(
			() => localStorage.setItem('savedState', JSON.stringify(holder)),
			0
		);
	});

	appendMain(note);
	holder.push(test);
};

deleteAll = () => {
	if (window.confirm('ARE YOU SURE?')) {
		// reset actions
		holder = [];
		while (elementId('main').firstChild) {
			elementId('main').removeChild(elementId('main').firstChild);
		}
		localStorage.clear();
	}
};

search = () => {
	console.log(elementId('search').value);
	// searching in both title and content by using array.filter
	const searchResults = Array.from(elementsClass('note')).filter(
		i =>
			i.children[0].value
				.toLowerCase()
				.includes(elementId('search').value.toLowerCase()) ||
			i.children[1].value
				.toLowerCase()
				.includes(elementId('search').value.toLowerCase())
	);
	// reset
	holder = [];
	while (elementId('main').firstChild) {
		elementId('main').removeChild(elementId('main').firstChild);
	}
	// change title to 'SEARCH RESULTS'
	elementId('heading').textContent = 'SEARCH RESULTS';
	// append results
	searchResults.forEach(i =>
		createNote(i.children[0].value, i.children[1].value, i.children[2].value)
	);
	// reset search form
	elementId('search').value = '';
	elementId('back').style.visibility = 'visible';
};

back = () => {
	// hide back button
	elementId('back').style.visibility = 'hidden';
	holder = [];
	while (elementId('main').firstChild) {
		elementId('main').removeChild(elementId('main').firstChild);
	}
	// change title to 'STICKY NOTES'
	elementId('heading').textContent = 'STICKY NOTES';
	JSON.parse(localStorage.getItem('savedState')).forEach(i =>
		createNote(i.title, i.content, i.color)
	);
};
