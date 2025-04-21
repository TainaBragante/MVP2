/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getList = async () => {
  let url = 'http://127.0.0.1:5000/funcionarios';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      data.funcionarios.forEach(item => insertList(item.nome, item.venda, item.porcentagem, item.comissao, item.comissao_real))
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Chamada da função para carregamento inicial dos dados
  --------------------------------------------------------------------------------------
*/
getList() 

/*
  --------------------------------------------------------------------------------------
  Função para colocar um item na lista do servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const postItem = async (inputFuncionario, inputVenda, inputPorcentagem) => {
  const formData = new FormData();
  formData.append('nome', inputFuncionario);
  formData.append('venda', inputVenda);
  formData.append('porcentagem', inputPorcentagem);

  let url = 'http://127.0.0.1:5000/funcionario';
  fetch(url, {
    method: 'post',
    body: formData
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }
      return response.json();
      })
      .then((data) => {
          // Atualiza a lista diretamente com o dado retornado do backend
          insertList(data.nome, data.venda, data.porcentagem, data.comissao, data.comissao_real);
          alert("Funcionário adicionado com sucesso!");
      })
      .catch((error) => {
          console.error('Erro:', error);
          alert("Funcionário já cadastrado.");
      });
};

/*
  --------------------------------------------------------------------------------------
  Função para deletar um item da lista do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteItem = (btn) => {
  const row = btn.parentElement.parentElement;
  const nomeFuncionario = row.cells[0].textContent.trim();
  
  console.log("Excluindo funcionário:", nomeFuncionario);
  let url = 'http://127.0.0.1:5000/funcionario?nome=' + encodeURIComponent(nomeFuncionario);
  
  fetch(url, {
      method: 'delete'
  })
    .then(response => response.json())
    .then(data => {
        row.remove();
        console.log("Funcionário excluído com sucesso:", data);
    })
    .catch((error) => {
        console.error('Erro ao excluir o funcionário:', error);
    });
};

/*
  --------------------------------------------------------------------------------------
  Função para adicionar um novo item na tabela
  --------------------------------------------------------------------------------------
*/
async function newItem() {
  let inputFuncionario = document.getElementById("novoFuncionario").value; // Nome
  let inputVenda = parseFloat(document.getElementById("novaVenda").value); // Vendas
  let inputPorcentagem = parseFloat(document.getElementById("novaPorcentagem").value); // Porcentagem

  if (inputFuncionario === '') {
    alert("Escreva o nome do funcionário!");
  } else if (isNaN(inputVenda) || isNaN(inputPorcentagem)) {
    alert("Vendas e porcentagem precisam ser preenchidos!");
  } else {
    // Chama a função de POST para enviar os dados e atualizar a lista automaticamente
    postItem(inputFuncionario, inputVenda, inputPorcentagem);
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para inserir itens na lista apresentada
  --------------------------------------------------------------------------------------
*/
const insertList = (nome, venda, porcentagem, comissao, comissao_real) => {
  var item = [nome, `US$ ${venda}`, `${porcentagem}%`, `US$ ${comissao}`, `R$ ${comissao_real}`];
  var table = document.getElementById('myTable');
  var row = table.insertRow();

  for (var i = 0; i < item.length; i++) {
    var cel = row.insertCell(i);
    cel.textContent = item[i];
  }

  // Adiciona o botão de deletar na última célula
  var deleteCell = row.insertCell(-1);
  var deleteButton = document.createElement('button');
  deleteButton.textContent = "Excluir";
  deleteButton.className = "delete-btn"; // Classe para estilização
  deleteButton.onclick = () => deleteItem(deleteButton); // Associa a função deleteItem
  deleteCell.appendChild(deleteButton);

  document.getElementById("novoFuncionario").value = "";
  document.getElementById("novaVenda").value = "";
  document.getElementById("novaPorcentagem").value = "";
}

/*
  --------------------------------------------------------------------------------------
  Função para obter a taxa de câmbio
  --------------------------------------------------------------------------------------
*/
async function getExchangeRate() {
  try {
      const response = await fetch("http://127.0.0.1:5000/conversao");
      if (!response.ok) {
          throw new Error("Erro ao obter a taxa de câmbio");
      }
      const data = await response.json();
      return data.exchange_rate;
  } catch (error) {
      console.error("Erro ao obter a taxa de câmbio:", error);
      alert("Não foi possível obter a taxa de câmbio no momento.");
      return null;
  }
}
