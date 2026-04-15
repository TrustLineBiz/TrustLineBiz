const router = require('express').Router();
const auth = require('../middleware/auth');
const {
  listLeads, getLead, updateLead, updateStage, deleteLead,
  getNotes, addNote, deleteNote,
  getTasks, createTask, updateTask, deleteTask,
  getAnalyticsSummary,
} = require('../controllers/leadController');
const { subscribe, unsubscribe } = require('../controllers/pushController');

// Analytics
router.get('/analytics/summary', auth, getAnalyticsSummary);

// Tasks (global)
router.get('/tasks', auth, getTasks);
router.post('/tasks', auth, createTask);
router.patch('/tasks/:id', auth, updateTask);
router.delete('/tasks/:id', auth, deleteTask);

// Push
router.post('/push/subscribe', auth, subscribe);
router.delete('/push/subscribe', auth, unsubscribe);

// Notes delete (no lead_id in path)
router.delete('/notes/:id', auth, deleteNote);

// Leads
router.get('/', auth, listLeads);
router.get('/:id', auth, getLead);
router.put('/:id', auth, updateLead);
router.patch('/:id/stage', auth, updateStage);
router.delete('/:id', auth, deleteLead);

// Lead notes
router.get('/:id/notes', auth, getNotes);
router.post('/:id/notes', auth, addNote);

module.exports = router;
