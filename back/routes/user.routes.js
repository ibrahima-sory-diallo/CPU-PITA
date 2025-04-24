const router = require('express').Router()
const authcontroller = require('../controllers/authController')
const userController = require('../controllers/userController')

//auth
router.post('/register', authcontroller.signUp)
router.post('/login', authcontroller.signIn)
router.get('/logout', authcontroller.logout)

//user DB
router.get('/', userController.getAllUsers)
router.get('/:id', userController.userInfo)
router.put('/:id', userController.updateUser)
router.delete('/:id', userController.deleteUser)


//ajouter inputation






module.exports = router




