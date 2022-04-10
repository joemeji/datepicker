let monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
let weekNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

let now = new Date();
let month = now.getMonth();
let year = now.getFullYear();

let container = document.getElementById('datepicker');
let inputEl = document.createElement('input');
let calendarDialog = document.createElement('div');
let tableEl = document.createElement('div');

let test = document.createElement('span')

let years = [];

for (let i = 1990; i <= 2090; i++) {
  years.push(i);
}

tableEl.classList.add('days-list')
calendarDialog.classList.add('calendar-dropdown');

container.append(inputEl, calendarDialog);

displayDays(month, year);

function displayDays(_month, _year) {
  let _monthDays = createMonthDays(_month, _year);
  let _monthDaysChunk = [];

  for (let i = 0; i < _monthDays.length / 7; i++) {
    const start = i * 7;
    const end = start + 7;
    _monthDaysChunk.push(_monthDays.slice(start, end));
  }
  
  const tableRenderContent = (
    `
      <div class="datepicker-header">
        <button class="navigator" data-navigate="prev">&#x2039;</button>
        <div>
          <select class="month-select">
            ${monthNames.map(item => (`
              <option value="${item}">${item}</option>
            `)).join('')}
          </select>
          <select class="year-select">
            ${years.map(item => (`
              <option value="${item}">${item}</option>
            `)).join('')}
          </select>
        </div>
        <button class="navigator" data-navigate="next">&#x203A;</button>
      </div>
      <table>
        <thead>
          <tr>
            ${weekNames.map(item => (`
              <th>${item.slice(0, 2)}</th>
            `)).join('')}
          </tr>
        </thead>
        <tbody>
        ${_monthDaysChunk.map(row => (`
          <tr>
            ${row.map(col => {
              const value = new Date(col.day).getDate();
              return (`
                <td value="${col.day}" class="${col.faded ? 'faded' : ''}">${value}</td>
              `)
            }).join('')}
          </tr>
        `)).join('')}
        </tbody>
      </table>
    `
  );
  
  tableEl.innerHTML = tableRenderContent;
  calendarDialog.append(tableEl);

  document.querySelectorAll('button.navigator')
  .forEach(elem => {
    elem.addEventListener('click', (e) => {
      const { navigate } = e.target.dataset;
      if (navigate === 'prev') {
        const prevDate = new Date(_year, _month - 1);
        displayDays(
          prevDate.getMonth(), 
          prevDate.getFullYear()  
        );
        return;
      }
      if (navigate === 'next') {
        const nextDate = new Date(_year, _month + 1);
        displayDays(
          nextDate.getMonth(), 
          nextDate.getFullYear()  
        );
        return;
      }
    });
  });

  const monthSelector = document.querySelector('select.month-select');
  const yearSelector = document.querySelector('select.year-select');

  monthSelector.value = monthNames[_month];
  yearSelector.value = _year;

  monthSelector.addEventListener('change', (e) => {
    displayDays(
      monthNames.indexOf(e.target.value), 
      _year  
    );
  });

  yearSelector.addEventListener('change', (e) => {
    displayDays(_month, e.target.value);
  });

}


// returns array of days
function createMonthDays(_m, _y) {
  let currentDate = new Date(_y, _m + 1, 0);
  let lastDay = currentDate.getDate();

  let currentMonth = `${currentDate.getMonth() + 1}`.padStart(2, '0');

  let leftSpanIndex = new Date(`${currentMonth}/01/${_y}`).getDay();
  let rightSpanIndex = currentDate.getDay();

  let monthDays = [];
  let previousMonthDays = [];
  let nextMonthDays = [];
  
  for (let i = 1; i <= lastDay; i++) {
    const _getMonth = `${currentDate.getMonth() + 1}`.padStart(2, '0');
    const _getDate = `${i}`.padStart(2, '0');
    const _getYear = currentDate.getFullYear();
    const _day = `${_getMonth}/${_getDate}/${_getYear}`;
    monthDays.push({
      day: _day,
      faded: false,
    });
  }

  currentDate = new Date(_y, _m, 0);
  lastDay = currentDate.getDate();
  for (let i = 1; i <= lastDay; i++) {
    const _getMonth = `${currentDate.getMonth() + 1}`.padStart(2, '0');
    const _getDate = `${i}`.padStart(2, '0');
    const _getYear = currentDate.getFullYear();
    const _day = `${_getMonth}/${_getDate}/${_getYear}`;
    previousMonthDays.push({
      day: _day,
      faded: true,
    });
  }

  let leftSpan = [
    ...leftSpanIndex !== 0 ? previousMonthDays.slice(-leftSpanIndex) : []
  ];
  monthDays.unshift(...leftSpan);

  currentDate = new Date(_y, _m + 2, 0);
  lastDay = currentDate.getDate();
  for (let i = 1; i <= lastDay; i++) {
    const _getMonth = `${currentDate.getMonth() + 1}`.padStart(2, '0');
    const _getDate = `${i}`.padStart(2, '0');
    const _getYear = currentDate.getFullYear();
    const _day = `${_getMonth}/${_getDate}/${_getYear}`;
    nextMonthDays.push({
      day: _day,
      faded: true,
    });
  }

  let rightSpan = [
    ...rightSpanIndex !== 6 ? nextMonthDays.slice(0, weekNames.length - (rightSpanIndex + 1)) : []
  ];

  monthDays.push(...rightSpan);

  return monthDays;
}