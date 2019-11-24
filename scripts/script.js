var counter = 0;

let addInvoice = async () => {
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(
    c
  ) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

  const newInvoice = {
    id: uuid,
    comment: null,
    date_created: null,
    date_due: null,
    date_supply: null,
    direction: null
  };
  let response = await fetch('https://tds-task-1-miesh.herokuapp.com/invoices', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Accept': 'application/json'
    },
    body: JSON.stringify(newInvoice)
  });
  if (response.ok) {
    location.href = 'edit-form.html?invoice-id=' + uuid;
  } else {
    console.error('Error: ${response.status}');
  }
};

let getInvoices = async () => {

  //Сортировка
  let sortingValue = null;
  const sortingInput = document.getElementById('property-sorting');
  const sortingDirection = document.getElementById(
    'property-sorting-direction'
  );
  const sortingIndex = sortingInput.selectedIndex;
  const sortingDirectionIndex = sortingDirection.selectedIndex;

  if (
    sortingDirectionIndex != null
    && sortingDirection.options[sortingDirectionIndex].value != 'NONE'
    && sortingIndex != null ) {
      sortingValue = '_sort=' 
        + sortingInput.options[sortingIndex].value 
        + '&_order=' 
        + sortingDirection.options[sortingDirectionIndex].value;
  }

  //Полнотекстовый поиск
  let searchingValue = null;
  const searching = document.getElementById('search-input').value;
  if(searching != '') {
    searchingValue = 'q=' + searching;
  }

  //Фильтрация
  let filteringValue = '';
  const dateCreatedFrom = document.getElementById('from-date-created-input').value;
  const dateCreatedTo = document.getElementById('to-date-created-input').value;
  const dateDueFrom = document.getElementById('from-date-due-input').value;
  const dateDueTo = document.getElementById('to-date-due-input').value;
  const dateSupplyFrom = document.getElementById('from-date-supply-input').value;
  const dateSupplyTo = document.getElementById('to-date-supply-input').value;
  
  if (dateCreatedFrom) {
    filteringValue += 'date_created_gte=' + dateCreatedFrom;
  }

  if (dateCreatedTo) {
    if (filteringValue != '') {
      filteringValue += '&'
    }

    filteringValue += 'date_created_lte=' + dateCreatedTo;
  }

  if (dateDueFrom) {
    if (filteringValue != '') {
      filteringValue += '&'
    }

    filteringValue += 'date_due_gte=' + dateDueFrom;
  }

  if (dateDueTo) {
    if (filteringValue != '') {
      filteringValue += '&'
    }

    filteringValue += 'date_due_lte=' + dateDueTo;
  }

  if (dateSupplyFrom) {
    if (filteringValue != '') {
      filteringValue += '&'
    }

    filteringValue += 'date_supply_gte=' + dateSupplyFrom;
  }

  if (dateSupplyTo) {
    if (filteringValue != '') {
      filteringValue += '&'
    }

    filteringValue += 'date_supply_lte=' + dateSupplyTo;
  }

  //Запрос
  const questionMark = (sortingValue 
    || searchingValue 
    || (filteringValue && filteringValue != '')) 
    ? '?' : '';
  const filterString = questionMark 
  + (sortingValue ? sortingValue : '')
  + (searchingValue ? ('&' + searchingValue) : '')
  + (filteringValue ?  ('&' + filteringValue) : '');

  console.log(filterString)

  let response = await fetch('https://tds-task-1-miesh.herokuapp.com/invoices' + filterString)

  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    console.error('Error: ${response.status}');
  }
};

function addInvoicesInTable(invoices) {
  const table = document.getElementById('invoicesTable');

  const isShowColumns = {
    number: document.getElementById('number-checkbox').checked,
    comment: document.getElementById('comment-checkbox').checked,
    date_created: document.getElementById('date-created-checkbox').checked,
    date_due: document.getElementById('date-due-checkbox').checked,
    date_supply: document.getElementById('date-supply-checkbox').checked
  };
  invoices.forEach(invoice => {
    addInvoiceInTable(invoice, table, isShowColumns);
  });
}

function addInvoiceInTable(invoice, table, isShowColumns) {
  const invoiceRow = document.createElement('tr');
  invoiceRow.className = 'invoice';
  invoiceRow.id = 'row-' + invoice.id;

  for (let i = 0; i < 6; i += 1) {
    let cell = document.createElement('td');
    switch (i) {
      case 0:
        if (isShowColumns.date_created) {
          cell.innerHTML = checkDate(invoice.date_created);
          invoiceRow.appendChild(cell);
        }

        break;
      case 1:
        if (isShowColumns.number) {
          if(invoice.number != undefined) {
            cell.innerHTML = invoice.number;
          } else {
            cell.innerHTML = '';
          }

          invoiceRow.appendChild(cell);
        }
        break;
      case 2:
        if (isShowColumns.date_supply) {
          cell.innerHTML = checkDate(invoice.date_supply);
          invoiceRow.appendChild(cell);
        }

        break;
      case 3:
        if (isShowColumns.date_due) {
          cell.innerHTML = checkDate(invoice.date_due);
          invoiceRow.appendChild(cell);
        }

        break;
      case 4:
        if (isShowColumns.comment) {
          cell.innerHTML = invoice.comment;
          invoiceRow.appendChild(cell);
        }

        break;
      case 5:
        cell.className = 'buttonColumn';

        const editButton = document.createElement('button');
        editButton.innerHTML = 'Edit';
        editButton.onclick = function() {
          location.href = 'html/edit-form.html?invoice-id=' + invoice.id;
        };
        cell.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = 'Delete';

        deleteButton.onclick = function deleteInvoice() {
          fetch('https://tds-task-1-miesh.herokuapp.com/invoices/' + invoice.id, {
            method: 'DELETE'
          }).catch(error => console.error(error.status));
          table.removeChild(document.getElementById('row-' + invoice.id));
        };

        cell.appendChild(deleteButton);
        invoiceRow.appendChild(cell);
        break;
      default:
        break;
    }
  }

  table.appendChild(invoiceRow);
}

function refreshTable() {
  const table = document.getElementById('invoicesTable');
  table.innerHTML = '';
  getInvoices().then(invoices => {
    addInvoicesInTable(invoices);
  });
}

document.addEventListener(
  'DOMContentLoaded',
  function() {
    getInvoices().then(invoices => {
      addInvoicesInTable(invoices);
    });
  },
  false
);

function checkDate(date) {
  const showingDate = moment(date).format('DD MMMM YYYY');
  if(!showingDate || showingDate == 'Invalid date') {
    return ''
  } else return showingDate;
}
