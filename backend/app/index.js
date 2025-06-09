// index.js
const express = require('express');
const app = express();
const port = 3001; // o cualquier puerto que quieras usar

app.use(express.json());

app.get('/', (req, res) => {
  res.send('¡Backend funcionando!');
});

app.listen(port, () => {
  console.log(`Servidor backend escuchando en http://localhost:${port}`);
});
