const rowList = [
    {
        id: 1,
        name: 'Товар1',
        count: 5,
        price: '100'
    },
    {
        id: 2,
        name: 'Товар2',
        count: 5,
        price: '100'
    },
    {
        id: 3,
        name: 'Товар3',
        count: 5,
        price: '100'
    },
    {
        id: 4,
        name: 'Товар3',
        count: 5,
        price: '101'
    }
];

const SHEVRON_DOWN = '&#9660;';
const SHEVRON_UP = '&#9650;';

let isSortNameDown = true;
let isSortPriceDown = true;

const ADD_MODE = 'ADD_MODE';
const EDIT_MODE = 'EDIT_MODE';
let activeMode = null;
let editIndex = null;

const sortName = document.getElementById('sort-name');
const sortPrice = document.getElementById('sort-price');
const submitBtn = document.getElementById('submit-btn');
const addNewBtn = document.getElementById('add-new');
const filterButton = document.getElementById('filter');
const nameInput = document.getElementById('name-input');
const countInput = document.getElementById('count-input');
const priceInput = document.getElementById('price-input');

document.addEventListener('click', deleteRow);
document.addEventListener('click', editRow);
filterButton.addEventListener('click', draw);
sortName.addEventListener('click', changeSortName);
sortPrice.addEventListener('click', changeSortPrice);
submitBtn.addEventListener('click', submit);
addNewBtn.addEventListener('click', addNew);
priceInput.addEventListener('focus', handleFocus);
priceInput.addEventListener('blur', handleBlur);

function formatToCurrency(n, currency) {
    let result=currency + (+n).toFixed(2).replace( /(\d)(?=(\d{3})+\.)/g, '$1,');
    return result;
}
function formatToNumber(n = '') {
    return (+n.replace( /[^0-9\.]+/g, '')).toFixed(0);
}

function handleFocus() {
    priceInput.value = formatToNumber(priceInput.value || 0);
}

function handleBlur() {
    priceInput.value = formatToCurrency(priceInput.value || 0, '$');
}

function createRow(row) {
    return `<div class="row">
            <div class="row__cell row__cell--first">
                <span>${row.name}</span>
                <span>${row.count}</span>
            </div>
            <div class="row__cell row__cell--second">
                <span>$</span>
                <span>${+row.price}</span>
            </div>
             <div class="row__cell row__cell--third">
                 <button data-type="edit" data-id="${row.id}">Edit</button>
                 <button data-type="delete" data-id="${row.id}">Delete</button>
            </div>
        </div>`;
}

function draw() {
    console.log(rowList);
    const table = document.getElementById('content');
    let rows = '';
    filterRows(rowList).sort(function (vote1, vote2) {
        if (vote1.name > vote2.name) return isSortNameDown ? -1 : 1;
        if (vote1.name < vote2.name) return isSortNameDown ? 1: -1;
        if (vote1.price > vote2.price) return isSortPriceDown ? -1 : 1;
        if (vote1.price < vote2.price) return isSortPriceDown ? 1 : -1;

    }).forEach(function(item) {
        rows += createRow(item);
    });
    table.innerHTML = rows;
}

draw();

function filterRows(list) {
    const filterInput = document.getElementById('filter-input').value.toLowerCase();
    if (filterInput){
        return list.filter(function (element) {
            return element.name.toLowerCase().search(filterInput) != -1;
        })
    } else {
        return list;
    }
}

function validate({name, price, count}) {
    return name.length && name.length <= 15 && (+price >= 0) && (+count >= 0);
}

function submit() {
    let isValid = false;
    if (activeMode) {
        if (rowList[editIndex]) {
            const element = {...rowList[editIndex]};
            element.name = nameInput.value;
            element.count = countInput.value || 0;
            element.price = formatToNumber(priceInput.value || 0);

            isValid = validate(element);
            if (isValid) rowList[editIndex] = {...element};
        } else {
            const element = {};
            element.id = Math.max.apply(Math, rowList.map(function (o) {
                return o.id;
            })) + 1;
            element.name = nameInput.value;
            element.count = countInput.value || 0;
            element.price = formatToNumber(priceInput.value || 0);

            isValid = validate(element);
            if (isValid) rowList.push({...element});
        }

        if (isValid) {
            draw();
            editIndex = null;
            activeMode = null;
            submitBtn.innerHTML = 'Add/Update';
            nameInput.value = '';
            countInput.value = '';
            priceInput.value = '';
        }
    }
}

function changeSortName() {
    isSortNameDown = !isSortNameDown;
    sortName.innerHTML = isSortNameDown ? SHEVRON_DOWN : SHEVRON_UP;
    draw();
}

function changeSortPrice() {
    isSortPriceDown = !isSortPriceDown;
    sortPrice.innerHTML = isSortPriceDown ? SHEVRON_DOWN : SHEVRON_UP;
    draw();
}

function addNew() {
    editIndex = null;
    activeMode = ADD_MODE;
    submitBtn.innerHTML = 'Add';
    nameInput.value = '';
    countInput.value = '';
    priceInput.value = '';
}

function editRow(e) {
    if (e.target.getAttribute('data-type') === 'edit') {
        const index =rowList.findIndex(function (el) {
            return el.id === +e.target.getAttribute('data-id');
        });
        editIndex = index;
        activeMode = EDIT_MODE;
        submitBtn.innerHTML = 'Update';
        nameInput.value = rowList[index].name;
        countInput.value = rowList[index].count || 0;
        priceInput.value = formatToCurrency(rowList[index].price || 0, '$');
    }
}

function deleteRow(e) {
    if (e.target.getAttribute('data-type') === 'delete') {
        const index =rowList.findIndex(function (el) {
            return el.id === +e.target.getAttribute('data-id');
        });
        if (confirm('Are you sure?')) {
            rowList.splice(index, 1);
            draw();
        }
    }
}
