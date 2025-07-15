document.addEventListener('keydown', (e) => {
  switch(e.key){
    case 'F1':
      e.preventDefault();
      window.location.href = '/home/home.html';
      break;

    case 'F2':
      e.preventDefault();
      window.location.href = '/sales/sales.html';
      break;

    case 'F3':
      e.preventDefault();
      window.location.href = '/stock/stock.html';
      break;

    case 'F4':
      e.preventDefault();
      window.location.href = '/report/report.html';
      break;
  };
})