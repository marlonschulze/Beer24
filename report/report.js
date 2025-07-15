const vendas = JSON.parse(localStorage.getItem('vendas')) || [];
const btnFiltrar = document.getElementById('btn-filtro');
const tabelaRelatorio = document.getElementById('tabela-relatorio').getElementsByTagName('tbody')[0];
const totalVendas = document.getElementById('total-vendas');
const faturamentoVendas = document.getElementById('faturamento-vendas');


function formatarDataBR(iso){
    const [ano, mes, dia] = iso.split('-');
    return `${dia}/${mes}/${ano}`;
  }

//filtro de vendas por data
btnFiltrar.addEventListener('click', () => {
  const dataInicio = document.getElementById('data-inicio').value;
  const dataFinal = document.getElementById('data-final').value;

  if(!dataInicio || !dataFinal){
    alert('Por favor, selecione as duas datas para filtrar!');
    return;
  }
  
  const vendaFiltrada = vendas.filter(venda => {
    return venda.data >= dataInicio && venda.data <= dataFinal;
  });


  renderizarRelatorio(vendaFiltrada);
});


//Função renderizar relatório
let vendasFiltradasAtuais = [...vendas];
function renderizarRelatorio(vendaFiltrada){
  vendasFiltradasAtuais = vendaFiltrada;
  tabelaRelatorio.innerHTML = "";
  let total = 0;
  let faturamento = 0;

  if(vendaFiltrada.length === 0){
    tabelaRelatorio.innerHTML= `<tr><td colspan='4'>Nenhuma venda encontrada neste período.</td></tr>`;
    totalVendas.textContent = 0;
    faturamentoVendas.textContent = '0.00';
    return;
  }

   vendaFiltrada.forEach(venda => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${formatarDataBR(venda.data)}</td>
      <td>${venda.nome}</td>
      <td>${venda.quantidade}</td>
      <td>R$ ${venda.total}</td>`;

      tabelaRelatorio.appendChild(tr);

      total += venda.quantidade;
      faturamento += parseFloat(venda.total)
  });

  totalVendas.textContent = total;
  faturamentoVendas.textContent = faturamento.toFixed(2);
}

//Exportar o relatório para CSV

document.getElementById('exportar-PDF').addEventListener('click', () => {

  if(vendasFiltradasAtuais.length === 0){
    alert('Realize uma venda para gerar o Relatório de Vendas!');
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Cabeçalho
  doc.setFontSize(16);
  doc.text("Relatório de Vendas - Beer24", 14, 20);

  // Monta os dados para a tabela
  const cabecalho = [['Data', 'Produto', 'Quantidade', 'Total']];
  const corpo = vendasFiltradasAtuais.map(venda => [
    formatarDataBR(venda.data),
    venda.nome,
    `${venda.quantidade} unidade(s)`,
    `R$ ${Number(venda.total).toFixed(2)}`
  ]);

  // Gera a tabela
  doc.autoTable({
    head: cabecalho,
    body: corpo,
    startY: 30,
    theme: 'striped', 
    styles: {
      fontSize: 10,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [41, 128, 185], 
      textColor: 255,
      fontStyle: 'bold',
    }
  });

  // Faturamento e total
  let finalY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(12);
  doc.text(`Total de Vendas: ${totalVendas.textContent}`, 14, finalY);
  doc.text(`Faturamento: R$ ${faturamentoVendas.textContent}`, 14, finalY + 8);

  // Salvar
  doc.save('relatorio_vendas_Beer24.pdf');
});

renderizarRelatorio(vendas);

