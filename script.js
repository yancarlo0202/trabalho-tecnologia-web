let cardEditandoIndex = null;

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-veiculo");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const modelo = document.getElementById("modelo").value;
      const marca = document.getElementById("marca").value;
      const ano = document.getElementById("ano").value;
      const placa = document.getElementById("placa").value;
      const status = document.getElementById("status").value;
      const preco = document.getElementById("preco").value;

      const novoVeiculo = { modelo, marca, ano, placa, status, preco };
      const veiculos = JSON.parse(localStorage.getItem("veiculos")) || [];
      veiculos.push(novoVeiculo);
      localStorage.setItem("veiculos", JSON.stringify(veiculos));

      form.reset();
      renderizarCards();
    });
  }

  renderizarCards();
});

window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  if (params.get("editar") === "1") {
    const edicao = JSON.parse(localStorage.getItem("veiculoParaEditar"));
    if (edicao) {
      cardEditandoIndex = edicao.index;
      document.getElementById("edit-modelo").value = edicao.modelo || "";
      document.getElementById("edit-marca").value = edicao.marca || "";
      document.getElementById("edit-ano").value = edicao.ano || "";
      document.getElementById("edit-status").value = edicao.status || "";
      document.getElementById("edit-preco").value = edicao.preco || "";

      document.getElementById("modal-editar").classList.remove("hidden");
    }
  }
});

function renderizarCards() {
  const container = document.getElementById("cards-container");
  container.innerHTML = "<h3>Listagem de carros</h3>";
  const veiculos = JSON.parse(localStorage.getItem("veiculos")) || [];

  veiculos.forEach((veiculo, index) => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <h4>Modelo: ${veiculo.modelo}</h4>
      <p>Marca: ${veiculo.marca}</p>
      <p>Ano: ${veiculo.ano}</p>
      <p>Status: ${veiculo.status}</p>
      <p>Preço: R$ ${veiculo.preco}/dia</p>
    `;

    const botaoEditar = document.createElement("button");
    botaoEditar.textContent = "Editar";
    botaoEditar.classList.add("btn-editar");
    botaoEditar.addEventListener("click", () => {
      localStorage.setItem("veiculoParaEditar", JSON.stringify({ ...veiculo, index }));
      window.location.href = "cadastro.html?editar=1";
    });
    card.appendChild(botaoEditar);

    const botaoExcluir = document.createElement("button");
    botaoExcluir.textContent = "Excluir";
    botaoExcluir.classList.add("btn-excluir");
    botaoExcluir.addEventListener("click", () => {
      if (confirm("Deseja realmente excluir este veículo?")) {
        const veiculos = JSON.parse(localStorage.getItem("veiculos")) || [];
        veiculos.splice(index, 1); // aqui usa o índice diretamente
        localStorage.setItem("veiculos", JSON.stringify(veiculos));
        renderizarCards();
      }
    });
    card.appendChild(botaoExcluir);

    container.appendChild(card);
  });
}

document.getElementById("salvar-edicao")?.addEventListener("click", () => {
  const veiculos = JSON.parse(localStorage.getItem("veiculos")) || [];

  if (cardEditandoIndex !== null && veiculos[cardEditandoIndex]) {
    veiculos[cardEditandoIndex] = {
      ...veiculos[cardEditandoIndex],
      modelo: document.getElementById("edit-modelo").value,
      marca: document.getElementById("edit-marca").value,
      ano: document.getElementById("edit-ano").value,
      status: document.getElementById("edit-status").value,
      preco: document.getElementById("edit-preco").value,
    };

    localStorage.setItem("veiculos", JSON.stringify(veiculos));
    localStorage.removeItem("veiculoParaEditar");
    fecharModal();
    window.location.href = "carros.html";
  }
});

document.getElementById("cancelar-edicao").addEventListener("click", fecharModal);

function fecharModal() {
  document.getElementById("modal-editar").classList.add("hidden");
}
