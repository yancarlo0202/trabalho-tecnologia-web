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
        const veiculo = JSON.parse(localStorage.getItem("veiculoParaEditar"));
        if (veiculo) {
            document.getElementById("edit-modelo").value = veiculo.modelo || "";
            document.getElementById("edit-marca").value = veiculo.marca || "";
            document.getElementById("edit-ano").value = veiculo.ano || "";
            document.getElementById("edit-status").value = veiculo.status || "";
            document.getElementById("edit-preco").value = veiculo.preco || "";

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
      <button class="btn-editar" data-index="${index}">Editar</button>
    `;

    const botaoEditar = document.createElement("button");
        botaoEditar.textContent = "Editar";
        botaoEditar.classList.add("btn-editar");

        botaoEditar.addEventListener("click", () => {
            localStorage.setItem("veiculoParaEditar", JSON.stringify(veiculo));
            window.location.href = "index.html?editar=1";
    });

card.appendChild(botaoEditar);


    container.appendChild(card);
  });

  document.querySelectorAll(".btn-editar").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const index = e.target.getAttribute("data-index");
      const veiculos = JSON.parse(localStorage.getItem("veiculos")) || [];
      const veiculo = veiculos[index];
      cardEditandoIndex = index;

      document.getElementById("edit-modelo").value = veiculo.modelo;
      document.getElementById("edit-marca").value = veiculo.marca;
      document.getElementById("edit-ano").value = veiculo.ano;
      document.getElementById("edit-status").value = veiculo.status;
      document.getElementById("edit-preco").value = veiculo.preco;

      document.getElementById("modal-editar").classList.remove("hidden");
    });
  });
}

document.getElementById("salvar-edicao").addEventListener("click", () => {
  const veiculos = JSON.parse(localStorage.getItem("veiculos")) || [];

  veiculos[cardEditandoIndex] = {
    ...veiculos[cardEditandoIndex],
    modelo: document.getElementById("edit-modelo").value,
    marca: document.getElementById("edit-marca").value,
    ano: document.getElementById("edit-ano").value,
    status: document.getElementById("edit-status").value,
    preco: document.getElementById("edit-preco").value,
  };

  localStorage.setItem("veiculos", JSON.stringify(veiculos));
  fecharModal();
  renderizarCards();
});

document.getElementById("cancelar-edicao").addEventListener("click", fecharModal);

function fecharModal() {
  document.getElementById("modal-editar").classList.add("hidden");
}
