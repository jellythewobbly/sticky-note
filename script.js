'use strict';

// Shorten DOM actions
var elementId = function(id) {
	return document.getElementById(id);
};
var elementsClass = function(className) {
	return document.getElementsByClassName(className);
};
var appendMain = function(element) {
	return elementId('main').appendChild(element);
};
var create = function(element) {
	return document.createElement(element);
};

var colors = {
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
		JSON.parse(localStorage.getItem('savedState')).forEach(function(i) {
			createNote(i.title, i.content, i.color);
		});
	}
});

var Note = function(title = '', content = '', color = 'white') {
	this.title = title;
	this.content = content;
	this.color = color;
};

var holder = [];

// creating note by class + appending to getElementById('main')
var createNote = function(t, cont, col) {
	var test = new Note(t, cont, col);

	// title of note
	var title = create('input');
	t ? (title.defaultValue = t) : (title.placeholder = 'Title');
	title.className = 'title';
	title.addEventListener('focusout', function() {
		test.title = title.value;
		// save to localStorage?
		setTimeout(function() {
			localStorage.setItem('savedState', JSON.stringify(holder));
		}, 0);
	});

	// text area for note body
	var content = create('textarea');
	cont
		? (content.textContent = cont)
		: (content.placeholder = 'Take a note...');
	content.className = 'content';
	content.rows = '8';
	content.addEventListener('focusout', function() {
		test.content = content.value;
		// save to localStorage?
		setTimeout(function() {
			localStorage.setItem('savedState', JSON.stringify(holder));
		}, 0);
	});

	// dropdown select for note color
	var select = create('select');
	select.className = 'selectColor';
	for (var color in colors) {
		var option = create('option');
		option.value = color;
		option.textContent = color.replace('_', ' ');
		select.appendChild(option);
	}
	var index = Array.from(select).findIndex(function(i) {
		return i.value == col;
	});
	select.selectedIndex = col ? index : 0;
	select.addEventListener('change', function() {
		this.parentElement.style.backgroundColor = colors[this.value];
		test.color = this.value;
		// save to localStorage?
		setTimeout(function() {
			localStorage.setItem('savedState', JSON.stringify(holder));
		}, 0);
	});

	// delete button within note
	var delButton = create('button');
	delButton.className = 'delButton';
	delButton.textContent = 'Delete';
	delButton.addEventListener('click', function() {
		this.parentElement.parentNode.removeChild(note);
		holder.splice(holder.indexOf(test), 1);
		// save to localStorage?
		setTimeout(function() {
			localStorage.setItem('savedState', JSON.stringify(holder));
		}, 0);
	});

	// creating note itself and appending elements
	var note = create('div');
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
		setTimeout(function() {
			localStorage.setItem('savedState', JSON.stringify(holder));
		}, 0);
	});

	appendMain(note);
	holder.push(test);
};

var deleteAll = function() {
	if (window.confirm('ARE YOU SURE?')) {
		// reset actions
		holder = [];
		while (elementId('main').firstChild) {
			elementId('main').removeChild(elementId('main').firstChild);
		}
		localStorage.clear();
	}
};

var search = function() {
	// searching in both title and content by using array.filter
	var searchResults = Array.from(elementsClass('note')).filter(function(i) {
		return i.children[0].value
			.toLowerCase()
			.includes(elementId('search').value.toLowerCase());
	});
	// reset
	while (elementId('main').firstChild) {
		elementId('main').removeChild(elementId('main').firstChild);
	}
	// change title to 'SEARCH RESULTS'
	elementId('heading').textContent = 'SEARCH RESULTS';
	// append results
	searchResults.forEach(function(i) {
		return appendMain(i.cloneNode(true));
	});
	// reset search form
	elementId('search').value = '';
	elementId('back').style.visibility = 'visible';
};

var back = function() {
	// hide back button
	elementId('back').style.visibility = 'hidden';
	holder = [];
	while (elementId('main').firstChild) {
		elementId('main').removeChild(elementId('main').firstChild);
	}
	// change title to 'STICKY NOTES'
	elementId('heading').textContent = 'STICKY NOTES';
	JSON.parse(localStorage.getItem('savedState')).forEach(function(i) {
		return createNote(i.title, i.content, i.color);
	});
};
