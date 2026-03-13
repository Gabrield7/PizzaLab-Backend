import express from 'express';

const app = express();

app.get("/", (req, res) => {
  res.send("API Pizzalab funcionando 🍕")
})

app.listen(3000, () => {
  console.log('Servidor local rodando na porta 3000');
});