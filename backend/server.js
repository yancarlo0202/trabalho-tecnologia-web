const express = require('express');
const cors = require('cors');
const connection = require('./db');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/veiculos', (req, res) => {
  connection.query('SELECT * FROM veiculos', (err, results) => {
    if (err) return res.status(500).json({ erro: 'Erro ao buscar veículos.' });
    res.json(results);
  });
});

app.post('/veiculos', (req, res) => {
  const { modelo, marca, ano, placa, situacao, classificacao, preco, imagem } = req.body;

  const sql = `
    INSERT INTO veiculos (modelo, marca, ano, placa, situacao, classificacao, preco, imagem)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const valores = [modelo, marca, ano, placa, situacao, classificacao, preco, imagem];

  connection.query(sql, valores, (err, result) => {
    if (err) return res.status(500).json({ erro: 'Erro ao cadastrar veículo.' });

    res.status(201).json({ id: result.insertId, ...req.body });
  });
});

app.put('/veiculos/:id', (req, res) => {
  const { id } = req.params;
  const { modelo, marca, ano, situacao, classificacao, preco } = req.body;

  const sql = `
    UPDATE veiculos
    SET modelo = ?, marca = ?, ano = ?, situacao = ?, classificacao = ?, preco = ?
    WHERE id = ?
  `;
  const valores = [modelo, marca, ano, situacao, classificacao, preco, id];

  connection.query(sql, valores, (err, result) => {
    if (err) return res.status(500).json({ erro: 'Erro ao atualizar veículo.' });

    res.json({ mensagem: 'Veículo atualizado com sucesso.' });
  });
});

app.delete('/veiculos/:id', (req, res) => {
  const { id } = req.params;

  connection.query('DELETE FROM veiculos WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ erro: 'Erro ao excluir veículo.' });

    res.json({ mensagem: 'Veículo excluído com sucesso.' });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});