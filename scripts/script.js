var counter = 0;

let addInvoice = async () =>  {
  const newInvoice = {
    comment: null,
    date_created: null,
    date_due: null,
    date_supply: null,
    direction: null,//Сделай guid
  }
  let response = await fetch('http://localhost:3000/invoices', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(newInvoice),
  });

  if(response.ok) {
    getInvoices();
  }
  else {
    console.error('Error: ${response.status}');
  }
}



let getInvoices = async () => {
  let response = await fetch('http://localhost:3000/invoices');
  if(response.ok) {
    let data = await response.json();
    console.log(data);
    let table = document.getElementById("invoicesTable");
    data.forEach(invoice => {
      var invoiceRow = document.createElement('tr');
      invoiceRow.className = 'invoice';
      invoiceRow.id = 'row-' + invoice.id;
      for(let i = 0; i < 5; i += 1) {
        let cell = document.createElement('td');
        switch(i) {
          case 0:
            cell.innerHTML = invoice.date_created;
            break;
          case 1:
            cell.innerHTML = invoice.number;
            break;
          case 2:
            cell.innerHTML = invoice.date_supply;
            break;
          case 3:
            cell.innerHTML = invoice.comment;
            break;
          case 4:
            cell.className = "buttonColumn";

            var editButton = document.createElement('button');
            editButton.innerHTML = 'Edit';
            editButton.onclick = function() {
              location.href='edit-form.html?invoice-id=' + invoice.id;
            }
            cell.appendChild(editButton);
            
            var deleteButton = document.createElement('button');
            deleteButton.innerHTML = 'Delete';
            
            deleteButton.onclick = function deleteInvoice() {
              fetch('http://localhost:3000/invoices/' + invoice.id, {
                method: 'DELETE'
              }).catch(error => console.error(error.status));
              debugger;
              table.removeChild(document.getElementById('row-' + invoice.id));
            };

            cell.appendChild(deleteButton);
            break;
          default:
            break;
        }
        invoiceRow.appendChild(cell);
      }
      table.appendChild(invoiceRow);
    });
  }
  else {
      console.error('Error: ${response.status}');
  }
}
window.onload = getInvoices();