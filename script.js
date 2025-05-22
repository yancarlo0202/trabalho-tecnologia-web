let cardEditandoId = null;

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-veiculo");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const modelo = document.getElementById("modelo").value;
      const marca = document.getElementById("marca").value;
      const ano = parseInt(document.getElementById("ano").value);
      const placa = document.getElementById("placa").value;
      const situacao = document.getElementById("situacao").value;
      const classificacao = document.getElementById("classificacao").value;
      const preco = parseFloat(document.getElementById("preco").value);
      const imagem = document.getElementById("imagem-url").value;

      const anoAtual = new Date().getFullYear();
      if (ano < 2000 || ano > anoAtual) {
        alert("Ano inválido.");
        return;
      }

      if (!imagem.trim()) {
        alert("Por favor, informe a URL da imagem do veículo.");
        return;
      }

      const novoVeiculo = { modelo, marca, ano, placa, situacao, classificacao, preco, imagem };

      try {
        const resposta = await fetch("http://localhost:3000/veiculos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(novoVeiculo),
        });

        if (resposta.ok) {
          alert("Veículo cadastrado com sucesso!");
          form.reset();
          renderizarCards();
        } else {
          alert("Erro ao cadastrar veículo.");
        }
      } catch (erro) {
        console.error("Erro ao salvar veículo:", erro);
      }
    });
  }

  renderizarCards();
});

document.getElementById("pesquisa-modelo")?.addEventListener("input", (e) => {
  const termo = e.target.value.toLowerCase();
  renderizarCards(termo);
});

async function renderizarCards(filtro = "") {
  const container = document.getElementById("cards-container");
  if (!container) return;
  container.innerHTML = "<h3>Listagem de carros</h3>";

  try {
    const resposta = await fetch("http://localhost:3000/veiculos");
    const veiculos = await resposta.json();

    const veiculosFiltrados = veiculos.filter((v) =>
      v.modelo.toLowerCase().includes(filtro)
    );

    veiculosFiltrados.forEach((veiculo) => {
      const card = document.createElement("div");
      card.classList.add("card");

      card.innerHTML = `
        <img src="${veiculo.imagem}" alt="Imagem do veículo" class="imagem-veiculo" />
        <h4>Modelo: ${veiculo.modelo}</h4>
        <p>Marca: ${veiculo.marca}</p>
        <p>Ano: ${veiculo.ano}</p>
        <p>Placa: ${veiculo.placa}</p>
        <p>Status: ${veiculo.situacao}</p>
        <p>Classificação: ${veiculo.classificacao}</p>
        <p>Preço: R$ ${veiculo.preco}/dia</p>
      `;

      const botaoEditar = document.createElement("button");
      botaoEditar.textContent = "Editar";
      botaoEditar.classList.add("btn-editar");
      botaoEditar.addEventListener("click", () => {
        localStorage.setItem("veiculoParaEditar", JSON.stringify(veiculo));
        window.location.href = "cadastro.html?editar=1";
      });
      card.appendChild(botaoEditar);

      const botaoExcluir = document.createElement("button");
      botaoExcluir.textContent = "Excluir";
      botaoExcluir.classList.add("btn-excluir");
      botaoExcluir.addEventListener("click", async () => {
        if (confirm("Deseja realmente excluir este veículo?")) {
          try {
            await fetch(`http://localhost:3000/veiculos/${veiculo.id}`, {
              method: "DELETE",
            });
            renderizarCards();
          } catch (erro) {
            alert("Erro ao excluir o veículo.");
          }
        }
      });
      card.appendChild(botaoExcluir);

      container.appendChild(card);
    });
  } catch (erro) {
    console.error("Erro ao carregar veículos:", erro);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  if (params.get("editar") === "1") {
    const edicao = JSON.parse(localStorage.getItem("veiculoParaEditar"));
    if (edicao) {
      cardEditandoId = edicao.id;
      document.getElementById("edit-modelo").value = edicao.modelo;
      document.getElementById("edit-marca").value = edicao.marca;
      document.getElementById("edit-ano").value = edicao.ano;
      document.getElementById("edit-situacao").value = edicao.situacao;
      document.getElementById("edit-classificacao").value = edicao.classificacao;
      document.getElementById("edit-preco").value = edicao.preco;
      document.getElementById("modal-editar").classList.remove("hidden");
    }
  }
});

document.getElementById("salvar-edicao")?.addEventListener("click", async () => {
  const modelo = document.getElementById("edit-modelo").value;
  const marca = document.getElementById("edit-marca").value;
  const ano = parseInt(document.getElementById("edit-ano").value);
  const situacao = document.getElementById("edit-situacao").value;
  const classificacao = document.getElementById("edit-classificacao").value;
  const preco = parseFloat(document.getElementById("edit-preco").value);

  try {
    await fetch(`http://localhost:3000/veiculos/${cardEditandoId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ modelo, marca, ano, situacao, classificacao, preco }),
    });
    localStorage.removeItem("veiculoParaEditar");
    fecharModal();
    window.location.href = "carros.html";
  } catch (erro) {
    alert("Erro ao atualizar o veículo.");
  }
});

document.getElementById("cancelar-edicao")?.addEventListener("click", () => {
  fecharModal();
  window.location.href = "carros.html";
});

function fecharModal() {
  document.getElementById("modal-editar").classList.add("hidden");
}
