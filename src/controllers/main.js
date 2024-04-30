const bcryptjs = require('bcryptjs');
const db = require('../database/models');
const { Op } = require('sequelize');

const mainController = {
  home: (req, res) => {
    db.Book.findAll({
      include: [{ association: 'authors' }]
    })
      .then((books) => {
        res.render('home', { books });
      })
      .catch((error) => console.log(error));
  },
  bookDetail: (req, res) => {
    const { id }= req.params
    db.Book.findOne({
      where: { id: id },
      include: [
        {
            model: db.Author,
            as: 'authors',
            through: 'BooksAuthors',
        }
    ]
    }).then(book=>{
      return res.render('bookDetail',{book});
    })
  },
  bookSearch: (req, res) => {
    res.render('search', { books: [] });
  },
  bookSearchResult: (req, res) => {
    const { title } = req.body;
    db.Book.findAll({
      where:{
        title:{[Op.substring] : title}
      },
    }).then(books=>{
        return res.render('search',{books,title});
    })
  },
  deleteBook: async (req, res) => {
    try {
        const { id } = req.params;

        const book = await db.Book.findOne({
            where: { id: id },
            include: [
                {
                    model: db.Author,
                    as: 'authors',
                    through: 'BooksAuthors',
                }
            ]
        });
        await book.setAuthors([], { through: 'BooksAuthors' });
        await book.destroy();

        return res.redirect('/');
    } catch (error) {
        console.error('Error al eliminar el libro:', error);
        return res.status(500).send('Error interno del servidor');
    }
  },
  authors: (req, res) => {
    db.Author.findAll()
      .then((authors) => {
        res.render('authors', { authors });
      })
      .catch((error) => console.log(error));
  },
  authorBooks: (req, res) => {
    const { id }= req.params
    db.Book.findAll({
      include: [
          {
              model: db.Author,
              as: 'authors',
              through: 'BooksAuthors',
              where: { id: id } 
          }
      ]
  }).then(books=>{
      return res.render('authorBooks',{books});
  })
    
  },
  register: (req, res) => {
    res.render('register');
  },
  processRegister: (req, res) => {
    db.User.create({
      Name: req.body.name,
      Email: req.body.email,
      Country: req.body.country,
      Pass: bcryptjs.hashSync(req.body.password, 10),
      CategoryId: req.body.category
    })
      .then(() => {
        res.redirect('/');
      })
      .catch((error) => console.log(error));
  },
  login: (req, res) => {
    // Implement login process
    res.render('login');
  },
  processLogin: async (req, res) => {
    const { validationResult } = require("express-validator");
    const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.render('login', {
                errors: errors.mapped()
            });
        }
        const user = await db.User.findOne({
            where: {
                email: req.body.email
            }
        });
        const { CategoryId, Id, Email } = user.dataValues
        req.session.userLogin = {
            CategoryId, Id, Email
        }
        res.cookie('BooksChallenge_user_Login_01', req.session.userLogin, {
            maxAge: 1000 * 60 * 8
        });
    res.redirect('/');
  },
  edit: (req, res) => {
    const { id }= req.params
    db.Book.findOne({
      where: { id: id },
    }).then(book=>{
      return res.render('editBook', {id,book});
    })
  },
  processEdit: (req, res) => {
    const { id }= req.params
    const {title, cover, description} = req.body
    db.Book.update(
      {
        title: title,
        cover: cover,
        description: description
      },
      {
          where: { id: id }
      }
    ).then(()=>{
      res.redirect(`/books/detail/${id}`);
    })
  },
  logout: (req, res) =>{
    req.session.destroy();
    res.cookie('BooksChallenge_user_Login_01',null,{
        maxAge : -1
    })
    return res.redirect('/')
  }
};

module.exports = mainController;
