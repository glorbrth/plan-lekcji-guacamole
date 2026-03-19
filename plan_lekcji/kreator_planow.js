let tbl = document.querySelector("table tbody");
let btn = document.querySelector("table button");
let header_row = tbl.querySelector("tr");

const LENGTH = 45;

function parse_time(time) {
	const value = time.split(":");
	if (value.length != 2) {
		return false;
	}
	const parsed = value.map(Number);
	if (isNaN(parsed[0]) || isNaN(parsed[1])) return false;
	return parsed;
}

function add_minutes(time, minutes) {
	time[1] += minutes;
	const div = Math.floor(time[1] / 60);
	const rem = time[1] % 60;
	return [time[0] + div, rem];
}

/// integer array [hours, minutes] -> "{hours}:{minutes}"
function format_as_time(time) {
	// Prepend 0 to minutes writable with 1 digit.
	if (time[1].toString().length == 1) {
		time[1] = "0" + time[1].toString();
	}
	return `${time[0]}:${time[1]}`;
}

function append_header() {
	const col = document.importNode(col_template.content, true);
	const no = header_row.children.length - 1;
	col.getElementById("no").textContent = no;

	const begin = col.getElementById("begin");
	const end = col.getElementById("end");
	begin.addEventListener("focusout", () => {
		let first = parse_time(begin.value);
		if (!first) return;
		first = add_minutes(first, LENGTH);
		end.value = format_as_time(first);
	});

	btn.parentElement.parentElement.insertBefore(col, btn.parentElement);

	begin.focus();
}

append_header();
btn.addEventListener("click", append_header);

function save() {
	console.log("!");
	let data = {
		teachers: teachers
	};
	data.times = Array.from(header_row.children).slice(1, -1).map(child => {
		console.log(child);
		return {
			begin: parse_time(child.querySelector("#begin").value),
			end: parse_time(child.querySelector("#end").value),
		};
	});

	console.log(data);
	console.log(JSON.stringify(data));
	return data;
}

new_row_btn.addEventListener("click", () => {
	const tr = document.createElement("tr");
	const td = document.createElement("td");
	const input = document.createElement("input");
	input.type = "text";
	input.className = "input_row";
	td.appendChild(input);
	tr.appendChild(td);
	tbl.insertBefore(tr, new_row_row);
});


let teachers = [];

function display_teachers(teachers) {
	teacher_list.innerHTML = "";
	for (const teacher of teachers) {
		let przedmioty = "";
		for (const subject of teacher.przedmioty) {
			przedmioty += subject;
			przedmioty += ", ";
		}
		przedmioty = przedmioty.substring(0, przedmioty.length - 2);
		teacher_list.innerHTML += ` <span>
			<p> 
				<span style="display: inline-block; width: 1.3ch; height: 1.3ch; background-color: ${teacher.kolor}"></span>
				<span> ${teacher.imie} ${teacher.nazwisko}  </span>
				<span> (${przedmioty}) </span>
			</p>
		</span>`;
	}
}

add_teacher_form.addEventListener("submit", e => {
	e.preventDefault();
	console.log(e);
	let teacher_data = {
		"imie": add_teacher_form.imie.value, 
		"nazwisko": add_teacher_form.nazwisko.value, 
		"oddzial": add_teacher_form.oddzial.value,
		"kolor": add_teacher_form.kolor.value,
		"przedmioty": add_teacher_form.przedmioty.value.split(",").map(string => string.trim())
	};
	teachers.push(teacher_data);
	display_teachers(teachers);
});

function load_data(data) {
	teachers = data.teachers;
	display_teachers(teachers);
	for (let i = 0; i < header_row.children.length - 2; i++) {
		header_row.children[1].remove();
	}
	for (let i = 0; i < data.times.length; i++) append_header();
	let cursor = 1;
	for (const time of data.times) {
		header_row.children[cursor].querySelector("#begin").value = format_as_time(time.begin);
		header_row.children[cursor].querySelector("#end").value = format_as_time(time.end);
		console.log(time);
		cursor += 1;
	}
}

load_form.addEventListener("submit", e => {
	e.preventDefault();
	let data = load_form.querySelector("textarea").value;
	data = JSON.parse(data);
	load_data(data);
})
