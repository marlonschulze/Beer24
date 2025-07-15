const form = document.getElementById('form-produtos');
const nomeInput = document.getElementById('name');
const tipoInput = document.getElementById('tipo');
const embalagemInput = document.getElementById('embalagem');
const precoInput = document.getElementById('preco');
const quantidadeInput = document.getElementById('quantidade');
const lista = document.getElementById('lista-produtos');
const buscaInput = document.getElementById('busca');
const alertAdd = document.querySelector('.alertAdd-produto');
const descAlertAdd = document.getElementById('desc-produtoAdd');
const btnAlertEstoque = document.getElementById('btn-alertaEstoque');
const painelAlertaEstoque = document.querySelector('.painel-alertaEstoque');
const listaEstoqueBaixo = document.getElementById('lista-estoqueBaixo');

let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
renderizarProdutos();

form.addEventListener('submit', function(e) {
  e.preventDefault();
  cadastrarProduto();
});

//função de cadastrar os produtos
function cadastrarProduto(){
  const nome = nomeInput.value.trim();
  const tipo = tipoInput.value;
  const embalagem = embalagemInput.value;
  const preco = parseFloat(precoInput.value);
  const quantidade = parseInt(quantidadeInput.value);

  //verif basica
  if(!nome || !tipo || !embalagem || isNaN(preco) || isNaN(quantidade)){
    alert('Preencha todos os campos corretamente!');
    return;
  }

  //verif se existe produto
  const produtoExistente = produtos.find(p =>
    p.nome === nome &&
    p.tipo === tipo &&
    p.embalagem === embalagem
  );

  if(produtoExistente){
    produtoExistente.quantidade += quantidade;
    produtoExistente.preco = preco;
  } else {
    const produto = {
      id: Date.now(),
      nome,
      tipo,
      embalagem,
      preco,
      quantidade
    };
    produtos.push(produto);
  }

  salvarProdutos();
  renderizarProdutos();
  gerarAlertaEstoque();
  mostrarMensagem(`${nome} (${embalagem}) - ${tipo}`);
  form.reset()
}

function mostrarMensagem(texto){
  descAlertAdd.textContent = texto;
  alertAdd.style.display = "block";

  setTimeout (() => {
    alertAdd.style.display = "none";
  }, 3000);
};

function renderizarProdutos(listaprodutos = produtos){

  lista.innerHTML = "";
  
  listaprodutos.forEach(produto => {
    const item = document.createElement('div');
    item.classList.add('produto');

    //controle de estoque por cor
    let cor = "#ccc";
    if(produto.quantidade < 5) cor = "red";
    else if (produto.quantidade < 15) cor = "orange";
    else cor = "green";

    item.style.borderLeft = `6px solid ${cor}`;

    item.innerHTML = `
    <div class="produto-info">
      <strong>${produto.nome}</strong> ( ${produto.embalagem} )<br>
      Tipo: ${produto.tipo}<br>
      Preço: R$ ${produto.preco.toFixed(2)}<br>
      Estoque: ${produto.quantidade}
    </div>
    <button class="btn-remover" data-id="${produto.id}" title="Remover produto">🗑️</button>
    `;

    lista.appendChild(item);
  }); 

  const btnRemover = document.querySelectorAll('.btn-remover');
  btnRemover.forEach(botao => {
    botao.addEventListener('click', (e) => {
      const id = Number(e.currentTarget.getAttribute('data-id'));
      removerProduto(id);
    })
  })
}

//funçao de remover produto
function removerProduto(id){
  if(confirm('Tem certeza que deseja remover este produto?')){
      produtos = produtos.filter(p => p.id !== id);
      salvarProdutos();
      renderizarProdutos();
      gerarAlertaEstoque();
  }
}

//filtro de buscas por nome ou tipo
buscaInput.addEventListener('input', function(){
  const termo = removerAcentos(this.value.trim().toLowerCase());

  const filtrados = produtos.filter(produto => {
    const nome = removerAcentos(produto.nome.toLowerCase());
    const tipo = removerAcentos(produto.tipo.toLowerCase());
    const embalagem = removerAcentos(produto.embalagem.toLowerCase());
    return nome.includes(termo) || tipo.includes(termo) || embalagem.includes(termo);
  });

  renderizarProdutos(filtrados);
});

function removerAcentos(str){
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

//botão alerta de estoque baixo
btnAlertEstoque.addEventListener('click', () => {
  const openAlerta = painelAlertaEstoque.style.display === "block";

  painelAlertaEstoque.style.display = openAlerta ? "none" : "block";

  if(!openAlerta){
    gerarAlertaEstoque();
  }
});

//gerar lista de estoque baixo
function gerarAlertaEstoque(){
  const produtoBaixo = produtos.filter(p => p.quantidade < 5);

  listaEstoqueBaixo.innerHTML = "";

  if(produtoBaixo.length === 0){
    listaEstoqueBaixo.innerHTML = "<li>Tudo em ordem! Nenhum produto em número baixo!</li>";
    return;
  }

  produtoBaixo.forEach(produto => {
    const li = document.createElement('li');
    li.textContent = `${produto.nome} (${produto.embalagem}) - Estoque: ${produto.quantidade}`;
    listaEstoqueBaixo.appendChild(li);
  })
}


function salvarProdutos(){
  localStorage.setItem("produtos", JSON.stringify(produtos));
}