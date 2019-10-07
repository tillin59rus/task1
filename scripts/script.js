var counter = 0;

function addInvoice() {
    var table = document.getElementById("invoicesTable");

    var invoice = document.createElement('tr');
    invoice.className = 'invoice';
    invoice.id = 'invoice-' + counter;
    for(let i = 0; i < 5; i += 1) {
        let column = document.createElement('td');
        switch(i) {
            case 0:
                column.innerHTML = 'дата создания';
                break;
            case 1:
                column.innerHTML = 'номер';
                break;
            case 2:
                column.innerHTML = 'дата поставки';
                break;
            case 3:
                column.innerHTML = 'комментарий';
                break;
            case 4:
                column.className = "buttonColumn";

                var editButton = document.createElement('button');
                editButton.innerHTML = 'Edit';
                column.appendChild(editButton);
                
                var deleteButton = document.createElement('button');
                deleteButton.innerHTML = 'Delete';
                deleteButton.id = 'deleteButton-' + counter;
                column.appendChild(deleteButton);
                
                //column.innerHTML = '<button>Edit</button> <button>Delete</button>';
                break;
            default:
                break;
        }
        invoice.appendChild(column);
    }
    table.appendChild(invoice);
}
    