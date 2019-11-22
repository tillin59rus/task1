var counter = 0;

let addInvoice = async () =>  {

  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });

  const newInvoice = {
    id: uuid,
    comment: null,
    date_created: null,
    date_due: null,
    date_supply: null,
    direction: null
  }
  let response = await fetch('http://localhost:3000/invoices', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Accept': 'application/json'
    },
    body: JSON.stringify(newInvoice)
  });
  if (response.ok) {
    addInvoicesInTable([newInvoice]);
  } else {
    console.error('Error: ${response.status}');
  }
}

let getInvoices = async () => {
  let sortingValue = '';
  const sorting = document.getElementById("property-sorting");
  const sortingDirection = document.getElementById('property-sorting-direction');
  const sortingIndex = sorting.selectedIndex;
  const sortingDirectionIndex = sortingDirection.selectedIndex;
  console.log('sortingIndex = ' + sortingIndex);
  console.log('sortingDirectionIndex = ' + sortingDirectionIndex);
// console.log('?_sort=' + sorting.options[sortingIndex].value + '&_order=' + sortingDirection.options[sortingDirectionIndex].value)
  if(sortingDirectionIndex != null && sortingDirection.options[sortingDirectionIndex].value != 'NONE') {
    if(sortingIndex != null) {
      
      sortingValue = '?_sort=' + sorting.options[sortingIndex].value + '&_order=' + sortingDirection.options[sortingDirectionIndex].value;
      console.log('sortingValue = ' + sortingValue);
    }
  }

  let response = await fetch('http://localhost:3000/invoices' + sortingValue);
  if(response.ok) {
    const data = await response.json();
    return data;
  } else {
    console.error('Error: ${response.status}');
  }
}

function addInvoicesInTable(invoices) {
  const table = document.getElementById("invoicesTable");

  const isShowColumns = {
    number: document.getElementById("number-checkbox").checked,
    comment: document.getElementById("comment-checkbox").checked,
    date_created: document.getElementById("date-created-checkbox").checked,
    date_due: document.getElementById("date-due-checkbox").checked,
    date_supply: document.getElementById("date-supply-checkbox").checked
  };
  invoices.forEach(invoice => {
    addInvoiceInTable(invoice, table, isShowColumns);
  });
}

function addInvoiceInTable(invoice, table, isShowColumns)  {

  const invoiceRow = document.createElement('tr');
  invoiceRow.className = 'invoice';
  invoiceRow.id = 'row-' + invoice.id;

  for(let i = 0; i < 6; i += 1) {
    let cell = document.createElement('td');
    switch(i) {
      case 0:
        if (isShowColumns.date_created) {
          cell.innerHTML = moment(invoice.date_created).format('DD MMMM YYYY');
          invoiceRow.appendChild(cell);
        }
        break;
      case 1:
        if (isShowColumns.number) {
          cell.innerHTML = invoice.number;
          invoiceRow.appendChild(cell);
        }
        break;
      case 2:
        if (isShowColumns.date_supply) {
          cell.innerHTML = moment(invoice.date_supply).format('DD MMMM YYYY');
          invoiceRow.appendChild(cell);
        }
        break;
      case 3:
        if (isShowColumns.date_due) {
          cell.innerHTML = moment(invoice.date_due).format('DD MMMM YYYY');
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
        cell.className = "buttonColumn";

        const editButton = document.createElement('button');
        editButton.innerHTML = 'Edit';
        editButton.onclick = function() {
          location.href='edit-form.html?invoice-id=' + invoice.id;
        }
        cell.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = 'Delete';
        
        deleteButton.onclick = function deleteInvoice() {
          fetch('http://localhost:3000/invoices/' + invoice.id, {
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
  const table = document.getElementById("invoicesTable");
  table.innerHTML = "";
  getInvoices().then(invoices => {
    addInvoicesInTable(invoices);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  getInvoices().then(invoices => {
    addInvoicesInTable(invoices);
  });
}, false);
