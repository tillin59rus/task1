function save() {

  const number = document.getElementById('number').value;
  const invoceDate = document.getElementById('invoceDate').value;
  const supplyDate = document.getElementById('supplyDate').value;
  const comment = document.getElementById('comment').value;
  const date_created = new Date() 

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

  debugger;
  fetch('http://localhost:3000/invoices/' + id, {
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