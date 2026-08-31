const pool = require('../config/db');

// 1. Get all tasks for logged-in user (with status/priority filters)
exports.getTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, priority } = req.query;

    let query = 'SELECT * FROM tasks WHERE user_id = ?';
    const params = [userId];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    if (priority) {
      query += ' AND priority = ?';
      params.push(priority);
    }

    query += ' ORDER BY created_at DESC';

    const [tasks] = await pool.query(query, params);
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Fetch Tasks Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// 2. Create a new task
exports.createTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description, status, priority, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Task title is required.' });
    }

    const [result] = await pool.query(
      'INSERT INTO tasks (user_id, title, description, status, priority, due_date) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, title, description || null, status || 'todo', priority || 'medium', dueDate || null]
    );

    res.status(201).json({ message: 'Task created successfully!', taskId: result.insertId });
  } catch (error) {
    console.error('Create Task Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// 3. Update a task
exports.updateTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;
    const { title, description, status, priority, dueDate } = req.body;

    const [result] = await pool.query(
      'UPDATE tasks SET title = ?, description = ?, status = ?, priority = ?, due_date = ? WHERE id = ? AND user_id = ?',
      [title, description, status, priority, dueDate, taskId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Task not found or unauthorized.' });
    }

    res.status(200).json({ message: 'Task updated successfully!' });
  } catch (error) {
    console.error('Update Task Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// 4. Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;

    const [result] = await pool.query(
      'DELETE FROM tasks WHERE id = ? AND user_id = ?',
      [taskId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Task not found or unauthorized.' });
    }

    res.status(200).json({ message: 'Task deleted successfully!' });
  } catch (error) {
    console.error('Delete Task Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// 5. Toggle/Update Status only
exports.updateStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;
    const { status } = req.body;

    if (!['todo', 'in-progress', 'done'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    const [result] = await pool.query(
      'UPDATE tasks SET status = ? WHERE id = ? AND user_id = ?',
      [status, taskId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Task not found or unauthorized.' });
    }

    res.status(200).json({ message: 'Status updated successfully!' });
  } catch (error) {
    console.error('Update Status Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};