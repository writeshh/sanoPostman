const { Router } = require('express');

const apiExecutor = require('../controllers/apiExecutor');
const router = Router();

router.use('/sanoPostman', apiExecutor.testApiResponse);

module.exports = router;
