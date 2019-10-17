var counter = 0;

let addInvoice = async () =>  {
    newInvoice = {
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

function remove() {
    var element = document.getElementById('block-1');
    element.removeChild(document.querySelector('.link'))
    element.removeChild(document.querySelector('.br-near-link'))
}


let getInvoices = async () => {
    let response = await fetch('http://localhost:3000/invoices');
    if(response.ok) {
        let data = await response.json();
        console.log(data);
        //parsedData = JSON.parse(data);
        //console.log(parsedData);
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
                            location.href="edit-form.html"
                        }
                        cell.appendChild(editButton);
                        
                        var deleteButton = document.createElement('button');
                        deleteButton.innerHTML = 'Delete';
                        deleteButton.id = 'deleteButton-' + counter;
                        
                        deleteButton.onclick = function() {
                            cell.parentNode.removeChild(cell);
                        };
                        cell.appendChild(deleteButton);
                        
                        //column.innerHTML = '<button>Edit</button> <button>Delete</button>';
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