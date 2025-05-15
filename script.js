document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("form-veiculo")

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const modelo = document.getElementById("modelo").value;
        const marca = document.getElementById("marca").value;
        const ano = document.getElementById("ano").value;
        const placa = document.getElementById("placa").value;
        const status = document.getElementById("status").value;
        const preco = document.getElementById("preco").value;

        const novoVeiculo = {
            modelo,
            marca,
            ano,
            placa,
            status,
            preco
        }

        const veiculos = JSON.parse(localStorage.getItem("veiculos")) || [];

        veiculos.push(novoVeiculo);

        localStorage.setItem("veiculos", JSON.stringify(veiculos));

        form.reset();

        alert("Veículo cadastro com sucesso!");

        renderizarCards();
    })

    renderizarCards();
})

function renderizarCards() {
    const container = document.getElementById("cards-container");
    const veiculos = JSON.parse(localStorage.getItem("veiculos")) || [];

    container.innerHTML = "<h3>Listagem de carros</h3>"

    veiculos.forEach(veiculo => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <h4>Modelo: ${veiculo.modelo}</h4>
            <p>Marca: ${veiculo.marca}</p>
            <p>Ano: ${veiculo.ano}</p>
            <p>Status: ${veiculo.status}</p>
            <p>Preço: R$ ${veiculo.preco}/dia</p>
        `;

        container.appendChild(card);
    });
}
