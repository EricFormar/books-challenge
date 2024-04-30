const express = require('express');
const mainController = require('../controllers/main');
const loginValidacion = require('../validaciones/login');
const checking = require('../middleware/checkRol')

const router = express.Router();

router.get('/', mainController.home);
router.get('/books/detail/:id', mainController.bookDetail);
router.get('/books/search', mainController.bookSearch);
router.post('/books/search', mainController.bookSearchResult);
router.get('/authors', mainController.authors);
router.get('/authors/:id/books', mainController.authorBooks);
router.get('/users/register', mainController.register);
router.post('/users/register', mainController.processRegister);
router.get('/users/login', mainController.login);
router.post('/users/login',loginValidacion, mainController.processLogin);
router.delete('/books/:id', checking.administrador, mainController.deleteBook);
router.get('/books/edit/:id',checking.administrador, mainController.edit);
router.put('/books/edit/:id', mainController.processEdit);
router.get('/users/logout', mainController.logout);

module.exports = router;
