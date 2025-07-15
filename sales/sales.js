const produtos = JSON.parse(localStorage.getItem("produtos")) || [];

const listaProdutos = document.getElementById('lista-produtos-disp');
const buscaInput = document.getElementById('busca-venda');
const form = document.getElementById('form-venda');
const produtoInput = document.getElementById('produto');
const embalagemInput = document.getElementById('embalagem');
const quantidadeInput = document.getElementById('quantidade');
const precoInput = document.getElementById('preco');
const dataInput = document.getElementById('data');
const btnCalcular = document.getElementById('btn-calcular');
const displayValor = document.getElementById('display-valorTotal');

// Mostrar os produtos cadastrados
function renderizarProdutosVenda(produtosParaRenderizar = produtos) {
  listaProdutos.innerHTML = '';

  produtosParaRenderizar.forEach(produto => {
    const div = document.createElement('div');
    div.classList.add('produto-venda');

    let cor = '#ccc';
    if (produto.quantidade < 5) cor = 'red';
    else if (produto.quantidade < 15) cor = 'orange';
    else cor = 'green';

    div.style.borderLeft = `6px solid ${cor}`;
    div.innerHTML = `
      <strong>${produto.nome}</strong><br>
      ${produto.embalagem} - Estoque: ${produto.quantidade}
    `;

    div.addEventListener('click', () => {
      produtoInput.value = produto.nome;
      embalagemInput.value = produto.embalagem;
      precoInput.value = produto.preco.toFixed(2);
    });

    listaProdutos.appendChild(div);
  });
}

//funcionamento da barra de pesquisa de produtos para venda
buscaInput.addEventListener('input', () => {
  const termo = buscaInput.value.trim().toLowerCase();

  const filtrados = produtos.filter(p => 
    p.nome.toLowerCase().includes(termo) ||
    p.embalagem.toLowerCase().includes(termo) ||
    p.tipo.toLowerCase().includes(termo)
  );

  if(filtrados.length === 0){
    document.getElementById('msg-sem-produto').style.display = "block";
  } else{
    document.getElementById('msg-sem-produto').style.display = "none";
  }

  renderizarProdutosVenda(filtrados);
})

renderizarProdutosVenda();

// Calcular valor total
btnCalcular.addEventListener('click', () => {
  const nome = produtoInput.value;
  const embalagem = embalagemInput.value;
  const preco = parseFloat(precoInput.value);
  const quantidade = parseInt(quantidadeInput.value);


  if (!nome || !embalagem || isNaN(preco) || isNaN(quantidade)) {
    displayValor.innerHTML = `Venda <strong>NÃO</strong> realizada<br>
    Preencha todos os dados corretamente!`;
    displayValor.style.color = 'red';
    return;
  } else if(quantidade <= 0){
    displayValor.textContent = "Defina uma quantidade válida!"
    displayValor.style.color = 'red';
    return;
  }

  const total = Number((preco * quantidade).toFixed(2));
  displayValor.style.color = "#222";
  displayValor.innerHTML = `🧮 Venda Confirmada!<br>
  <strong>Produto:</strong> ${nome} ${embalagem}<br>
  <strong>Unidade(s):</strong> ${quantidade}<br>
  <strong>Valor Total:</strong> R$${total.toFixed(2)}<br>
  `

  const indexProduto = produtos.findIndex(p =>
  p.nome === nome &&
  p.embalagem === embalagem &&
  p.preco === preco
);

if (indexProduto !== -1) {
  if (produtos[indexProduto].quantidade >= quantidade) {
    produtos[indexProduto].quantidade -= quantidade;
    localStorage.setItem('produtos', JSON.stringify(produtos));
    renderizarProdutosVenda();
  } else {
    displayValor.textContent = "Estoque insuficiente!";
    displayValor.style.color = "red";
    return;
  }

  const dataVenda = new Date();
  const dataFormatada = dataVenda.toISOString().split('T')[0];
  const horaFormatada = dataVenda.toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'});

  const novaVenda = {
    nome,
    embalagem,
    preco,
    quantidade,
    total: total.toFixed(2),
    data: dataFormatada,
    hora: horaFormatada
  };

  const vendas = JSON.parse(localStorage.getItem('vendas')) || [];
  vendas.push(novaVenda);
  localStorage.setItem('vendas', JSON.stringify(vendas));

  //teste de salvamento da data e hora da venda
  console.log(`Venda realizada! ${nome}, ${dataFormatada} - ${horaFormatada}`, novaVenda)
  }
});

