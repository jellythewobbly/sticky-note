// Shorten DOM actions
const elementId = id => document.getElementById(id);
const appendMain = element => elementId('main').appendChild(element);
const create = element => document.createElement(element);

class Note {
	constructor(title = 'Title', content = 'Take a note...', color = 'white') {
		this.title = title;
		this.content = content;
		this.color = color;
	}
}

let holder = [];

const createNote = (t, cont, col) => {
	const test = new Note(t, cont, col);
	let title = create('input');
	t ? (title.defaultValue = t) : (title.placeholder = test.title);
	title.className = 'title';

	let content = create('textarea');
	cont ? (content.textContent = cont) : (content.placeholder = test.content);
	content.className = 'content';
	content.rows = '8';

	let select = create('select');
	select.className = 'selectColor';
	for (let color in colors) {
		let option = create('option');
		option.value = color;
		option.textContent = color.replace('_', ' ');
		select.appendChild(option);
	}
	select.selectedIndex = 0;
};
