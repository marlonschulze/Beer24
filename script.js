const form = document.getElementById('form-login');
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const empresa = document.getElementById('empresa');
  const senha = document.getElementById('senha');
  const email = document.getElementById('email');
  const msgErro = document.getElementById('msg-erro');

  if(empresa.value === "Beer24" && senha.value === "beer24" && email.value === "beer24@gmail.com"){
    window.location.href = "home/home.html";
  } else{
    msgErro.textContent = 'Preencha todos os campos corretamente!';
    return;
  };
})