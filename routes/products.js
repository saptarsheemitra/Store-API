const express = require('express')
const router = express.Router()

const { getAllStaticProducts, getAllProducts } = require('../controllers/product');

router.get('/static', getAllStaticProducts);
router.get("/",getAllProducts);

module.exports = router;