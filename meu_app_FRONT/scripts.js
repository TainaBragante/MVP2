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
      data.funcionarios.forEach(item => insertList(item.nome, item.venda, item.porcentagem, item.comissao))
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
      // Atualiza a lista diretamente com o dado retornado do back-end
      insertList(data.nome, data.venda, data.porcentagem, data.comissao);
      alert("Funcionário adicionado com sucesso!");
    })
    .catch((error) => {
      console.error('Erro:', error);
      alert("Funcionário já cadastrado.");
    });
};

/*
  --------------------------------------------------------------------------------------
  Função para criar um botão close para cada item da lista
  --------------------------------------------------------------------------------------
*/
const insertButton = (parent) => {
  let span = document.createElement("span");
  let txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  parent.appendChild(span);
}

/*
  --------------------------------------------------------------------------------------
  Função para remover um item da lista de acordo com o click no botão close
  --------------------------------------------------------------------------------------
*/
const removeElement = () => {
  let close = document.getElementsByClassName("close");
  let i;
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const nomeItem = div.getElementsByTagName('td')[0].innerHTML
      if (confirm("Você tem certeza?")) {
        div.remove()
        deleteItem(nomeItem)
        alert("Removido!")
      }
    }
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para deletar um item da lista do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteItem = (item) => {
  console.log(item)
  let url = 'http://127.0.0.1:5000/funcionario?nome=' + item;
  fetch(url, {
    method: 'delete'
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para adicionar um novo item na tabela
  --------------------------------------------------------------------------------------
*/
async function newItem() {
    const nome = document.getElementById("novoFuncionario").value;
    const vendas = parseFloat(document.getElementById("novaVenda").value);
    const porcentagem = parseFloat(document.getElementById("novaPorcentagem").value);

    if (!nome || isNaN(vendas) || isNaN(porcentagem)) {
        alert("Preencha todos os campos corretamente!");
        return;
    }

    // Calcula a comissão em dólares
    const comissaoDolar = (vendas * porcentagem) / 100;

    // Obtém a taxa de câmbio
    const exchangeRate = await getExchangeRate();
    if (!exchangeRate) return;

    // Converte a comissão para reais
    const comissaoReal = comissaoDolar * exchangeRate;

    // Adiciona os dados na tabela
    const table = document.getElementById("myTable");
    const row = table.insertRow();
    row.innerHTML = `
        <td>${nome}</td>
        <td>US$ ${vendas.toFixed(2)}</td>
        <td>${porcentagem}%</td>
        <td>US$ ${comissaoDolar.toFixed(2)}</td>
        <td>R$ ${comissaoReal.toFixed(2)}</td>
        <td><button onclick="deleteRow(this)">Excluir</button></td>
    `;

    // Limpa os campos
    document.getElementById("novoFuncionario").value = "";
    document.getElementById("novaVenda").value = "";
    document.getElementById("novaPorcentagem").value = "";
}

/*
  --------------------------------------------------------------------------------------
  Função para inserir items na lista apresentada
  --------------------------------------------------------------------------------------
*/
const insertList = (nome, venda, porcentagem, comissao) => {
  var item = [nome, `R$${venda}`, `${porcentagem}%`, `R$${comissao}`];
  var table = document.getElementById('myTable');
  var row = table.insertRow();

  for (var i = 0; i < item.length; i++) {
    var cel = row.insertCell(i);
    cel.textContent = item[i];
  }
  insertButton(row.insertCell(-1))
  document.getElementById("novoFuncionario").value = "";
  document.getElementById("novaVenda").value = "";
  document.getElementById("novaPorcentagem").value = "";

  removeElement()
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
