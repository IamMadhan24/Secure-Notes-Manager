const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// Get all notes for current user
router.get('/', auth, async (req, res) => {
  const userId = req.user.id;
  const result = await pool.query('SELECT id, title, body, created_at, updated_at FROM notes WHERE user_id = $1 ORDER BY updated_at DESC', [userId]);
  res.json(result.rows);
});

// Create note
router.post('/', auth, async (req, res) => {
  const userId = req.user.id;
  const { title, body } = req.body;
  const result = await pool.query(
    'INSERT INTO notes (user_id, title, body) VALUES ($1, $2, $3) RETURNING id, title, body, created_at, updated_at',
    [userId, title || 'Untitled', body || '']
  );
  res.json(result.rows[0]);
});

// Update note
router.put('/:id', auth, async (req, res) => {
  const userId = req.user.id;
  const id = req.params.id;
  const { title, body } = req.body;
  
  const exist = await pool.query('SELECT id FROM notes WHERE id=$1 AND user_id=$2', [id, userId]);
  if (exist.rows.length === 0) return res.status(404).json({ error: 'Not found' });

  const result = await pool.query(
    'UPDATE notes SET title=$1, body=$2, updated_at=now() WHERE id=$3 RETURNING id, title, body, created_at, updated_at',
    [title, body, id]
  );
  res.json(result.rows[0]);
});

// Delete note
router.delete('/:id', auth, async (req, res) => {
  const userId = req.user.id;
  const id = req.params.id;
  await pool.query('DELETE FROM notes WHERE id=$1 AND user_id=$2', [id, userId]);
  res.sendStatus(204);
});

module.exports = router;
