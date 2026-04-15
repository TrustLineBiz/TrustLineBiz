const router = require('express').Router();
const { handleWebhook } = require('../controllers/webhookController');

router.post('/leads', handleWebhook);

module.exports = router;
