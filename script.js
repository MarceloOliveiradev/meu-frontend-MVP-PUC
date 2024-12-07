const apiUrl = "http://127.0.0.1:5000/imas/";

// Função para pesquisar um imã por medida
async function pesquisarIma() {
  const medida = document.getElementById("searchMedidaIma").value;

  if (!medida) {
    alert("Por favor, insira a medida do imã para buscar.");
    return;
  }

  const response = await fetch(`${apiUrl}search/${medida}`);

  if (response.ok) {
    const ima = await response.json();
    mostrarResultadoPesquisa(ima); // Exibe os dados do imã
  } else {
    alert("Imã não encontrado.");
    document.getElementById("searchResult").innerHTML = "";
  }
}

// Função para exibir o resultado da pesquisa
function mostrarResultadoPesquisa(ima) {
  const resultDiv = document.getElementById("searchResult");

  resultDiv.innerHTML = `
    <h3>Resultado da Pesquisa:</h3>
    <p><strong>Medida:</strong> ${ima.medida}</p>
    <p><strong>Formato:</strong> ${ima.formato}</p>
    <p><strong>Força (N):</strong> ${ima.forca_N}</p>
    <p><strong>Preço:</strong> R$${ima.preco.toFixed(2)}</p>
  `;
}

// Função para carregar os imãs
async function carregarImas() {
  const response = await fetch(apiUrl);
  const imas = await response.json();
  const itemsList = document.getElementById("itemsList");
  itemsList.innerHTML = "";

  imas.forEach((ima) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${ima.medida}</td>
            <td>${ima.formato}</td>
            <td>${ima.forca_N}</td>
            <td>R$${ima.preco.toFixed(2)}</td>
            <td>
                <button class="delete-btn" data-id="${
                  ima.ima_id
                }">Deletar</button>
                <button class="edit-btn" data-id="${
                  ima.ima_id
                }">Alterar</button>
            </td>
        `;
    itemsList.appendChild(row);
  });

  // Adicionar eventos de deletar
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => deletarIma(btn.dataset.id));
  });

  // Adicionar eventos de editar
  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", () => editarIma(btn.dataset.id));
  });
}

// Função para adicionar um novo imã
async function addIman() {
  const medida = document.getElementById("newMedida").value;
  const formato = document.getElementById("newFormato").value;
  const forca = document.getElementById("newForca").value;
  const preco = parseFloat(document.getElementById("newPreco").value);

  if (!medida || !formato || !forca || isNaN(preco)) {
    alert("Por favor, preencha todos os campos corretamente.");
    return;
  }

  // Validação para 'forca_N'
  const forcasValidas = ["N35", "N42", "N50", "N52"];
  if (!forcasValidas.includes(forca)) {
    alert("Força inválida. Escolha entre: N35, N42, N50, N52.");
    return;
  }
  // Validação para 'formato'
  const formatosValidos = ["cilindro", "cubo", "anel"];
  if (!formatosValidos.includes(formato.toLowerCase())) {
    alert("Formato inválido. Escolha entre: cilindro, cubo, anel.");
    return;
  }
  // Envia os dados para a API
  const novoIma = {
    medida,
    formato,
    forca_N: forca,
    preco,
  };

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(novoIma),
  });

  if (response.ok) {
    alert("Imã adicionado com sucesso!");
    carregarImas(); // Atualizar lista de imãs
  } else {
    alert("Erro ao adicionar o imã.");
  }
}

// Função para deletar um imã
async function deletarIma(id) {
  const response = await fetch(`${apiUrl}${id}`, { method: "DELETE" });
  if (response.ok) {
    alert("Imã deletado com sucesso!");
    carregarImas(); // Atualizar lista de imãs
  } else {
    alert("Erro ao deletar o imã.");
  }
}

// Função para editar um imã
async function editarIma(id) {
  // Obtém os novos valores para o imã
  const novaMedida = prompt("Nova medida:");
  const novoFormato = prompt("Novo formato (cilindro, cubo, anel):");
  const novaForca = prompt("Nova força (N35, N42, N50, N52):");
  const novoPreco = prompt("Novo preço:");

  // Validação do preço
  if (isNaN(parseFloat(novoPreco))) {
    alert("Preço inválido. Insira um valor numérico.");
    return;
  }

  // Validação para 'forca_N'
  const forcasValidas = ["N35", "N42", "N50", "N52"];
  if (!forcasValidas.includes(novaForca)) {
    alert("Força inválida. Escolha entre: N35, N42, N50, N52.");
    return;
  }

  // Validação para 'formato'
  const formatosValidos = ["cilindro", "cubo", "anel"];
  if (!formatosValidos.includes(novoFormato.toLowerCase())) {
    alert("Formato inválido. Escolha entre: cilindro, cubo, anel.");
    return;
  }

  // Envia os novos dados para a API
  const imaEditado = {
    medida: novaMedida,
    formato: novoFormato,
    forca_N: novaForca,
    preco: parseFloat(novoPreco),
  };

  const response = await fetch(`${apiUrl}${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(imaEditado),
  });

  if (response.ok) {
    alert("Imã atualizado com sucesso!");
    carregarImas(); // Atualizar lista de imãs
  } else {
    alert("Erro ao editar o imã.");
  }
}

// Inicializar
carregarImas();
