require('dotenv').config();
const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5000;


app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET;

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
});

const User = sequelize.define('User', {
  fullName: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  login: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'completed'),
    defaultValue: 'pending',
  },
});

const Application = sequelize.define('Application', {
  fullName: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.STRING, allowNull: false },
  date: { type: DataTypes.STRING, allowNull: false },
  time: { type: DataTypes.STRING, allowNull: false },
  licenseSeries: { type: DataTypes.STRING, allowNull: false },
  licenseNumber: { type: DataTypes.STRING, allowNull: false },
  licenseIssueDate: { type: DataTypes.STRING, allowNull: false },
  carBrand: { type: DataTypes.STRING, allowNull: false },
  carModel: { type: DataTypes.STRING, allowNull: false },
  message: { type: DataTypes.TEXT },
});

User.hasMany(Application, { foreignKey: 'userId' });
Application.belongsTo(User, { foreignKey: 'userId' });

// Регистрация пользователя
app.post('/register', async (req, res) => {
  try {
    const { fullName, phone, email, login, password } = req.body;

    if (!fullName || !phone || !email || !login || !password) {
      return res.status(400).json({ message: 'Все поля обязательны' });
    }

    const candidateLogin = await User.findOne({ where: { login } });
    if (candidateLogin) {
      return res.status(400).json({ message: 'Логин уже занят' });
    }

    const candidateEmail = await User.findOne({ where: { email } });
    if (candidateEmail) {
      return res.status(400).json({ message: 'Email уже зарегистрирован' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      fullName,
      phone,
      email,
      login,
      password: hashedPassword,
    });

    res.status(201).json({ message: 'Пользователь успешно зарегистрирован' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Логин с генерацией JWT
app.post('/login', async (req, res) => {
  const { login, password } = req.body;

  if (!login || !password) {
    return res.status(400).json({ message: 'Логин и пароль обязательны' });
  }

  try {
    const user = await User.findOne({ where: { login } });

    if (!user) {
      return res.status(400).json({ message: 'Пользователь не найден' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Неверный пароль' });
    }

    // Генерируем JWT токен
    const token = jwt.sign(
      { userId: user.id, login: user.login },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('Сгенерированный токен:', token);

    res.json({
      message: 'Авторизация успешна',
      token,
      userId: user.id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Middleware для проверки токена (пример использования для защищенных маршрутов)
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Токен отсутствует' });
  }

  const token = authHeader.split(' ')[1]; // Bearer TOKEN

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // например, { userId, login, iat, exp }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Неверный токен' });
  }
}

// Пример защищённого маршрута (для заявок, где нужен токен)
app.post('/applications', authMiddleware, async (req, res) => {
  try {
    const {
      fullName, phone, email, address, date, time,
      licenseSeries, licenseNumber, licenseIssueDate,
      carBrand, carModel, message
    } = req.body;

    if (!fullName || !phone || !email || !address || !date || !time ||
      !licenseSeries || !licenseNumber || !licenseIssueDate ||
      !carBrand || !carModel) {
      return res.status(400).json({ message: 'Все поля обязательны' });
    }

    const application = await Application.create({
      fullName, phone, email, address, date, time,
      licenseSeries, licenseNumber, licenseIssueDate,
      carBrand, carModel, message,
      userId: req.user.userId, // берем из токена
    });

    res.status(201).json({ message: 'Заявка успешно отправлена', application });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Другие маршруты (например, получение заявок, обновление, удаление) можно тоже защитить через authMiddleware

app.get('/', (req, res) => {
  res.send('Сервер запущен и работает!');
});

sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
  });
});
