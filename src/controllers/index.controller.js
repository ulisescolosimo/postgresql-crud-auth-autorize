import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: 'behind',
  database: 'firstapi',
  port: '5432'
})

const getUsers = async(req, res) => {
  const response = await pool.query('SELECT * FROM users');
  res.status(200).json(response.rows);
};

const createUsers = async(req, res) => {
  const { email, name} = req.body;
  const response = await pool.query(`INSERT INTO users (email, name) VALUES ($1, $2)`, [email, name])
  res.status(200).json(response);
};

const updateUser = async(req, res) => {
  const { id } = req.params;
  const { email, name} = req.body;
  const response = await pool.query(`UPDATE users SET email = $1, name = $2 WHERE id = $3`, [email, name, id]);
  res.status(200).json(response);
};

const deleteUser = async(req, res) => {
  const { id } = req.params;
  const response = await pool.query(`DELETE FROM users WHERE id = $1`, [id]);
  res.status(200).json(response);
};

export default {
  getUsers,
  createUsers,
  updateUser,
  deleteUser
};