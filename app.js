// app.js
import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';

// Default import for 'pg' and destructuring the 'Pool' class
import pkg from 'pg';
const { Pool } = pkg;

const app = express();
const port = 3000;

// PostgreSQL setup
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'todolistdb',
  password: '1234',
  port: 5432,
});

// Directory helpers for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', async (req, res) => {
  const result = await pool.query('SELECT * FROM tasks ORDER BY id DESC');
  res.render('index', { tasks: result.rows });
});

app.post('/add', async (req, res) => {
  const { task } = req.body;
  if (task.trim()) {
    await pool.query('INSERT INTO tasks (description) VALUES ($1)', [task]);
  }
  res.redirect('/');
});

app.post('/delete/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`To-do app listening at http://localhost:${port}`);
});
