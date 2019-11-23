function save() {

  const number = Number(document.getElementById('number').value);
  const invoceDate = document.getElementById('invoceDate').value;
  const supplyDate = document.getElementById('supplyDate').value;
  const comment = document.getElementById('comment').value;
  const date_created = new Date();

  const query = new URLSearchParams(window.location.search);
  const id = query.get('invoice-id');

  
  const newInvoice = {
    number: number,
    comment: comment,
    date_created: date_created,
    date_due: invoceDate,
    date_supply: supplyDate,
    direction: null,
  }

  fetch('https://tds-task-1-miesh.herokuapp.com/invoices/' + id, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(newInvoice),
  }).then((result) => {
    location.href="index.html";
  }, (error) => {
    console.error(error.status);
  });
}

window.onload = function FillIn() {
  const query = new URLSearchParams(window.location.search);
  const id = query.get('invoice-id');
  fetch('https://tds-task-1-miesh.herokuapp.com/invoices/' + id, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Accept': 'application/json'
      },
  }).then(response => {
    response.json().then(invoice => {
      this.document.getElementById('comment').value = invoice.comment;
      this.document.getElementById('number').value = invoice.number;
      this.document.getElementById('invoceDate').value = moment(invoice.date_due).format('YYYY-MM-DD');
      this.document.getElementById('supplyDate').value = moment(invoice.date_supply).format('YYYY-MM-DD');
    });
  });
}