const sequelize = require('./models');
const User = require('./models/User');
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

sequelize.sync().then(() => {
  console.log('База данных синхронизирована');
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
