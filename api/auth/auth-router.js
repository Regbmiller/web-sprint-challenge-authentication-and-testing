const router = require('express').Router();
const jwt = require('jsonwebtoken'); 
const bcryptjs = require('bcryptjs'); 
const jwtSecret = require('../../config/secret')
const userAuth = require('./auth-model');

const createToken = user => {
  const payload = {
    id: user.id,
    username: user.username
  };

  const config = {
    expiresIn: '1h'
  };
  return jwt.sign(payload, jwtSecret, config);
};


router.get('/', async (req, res) => {
  try {
    const users = await userAuth.getAll();
    res.status(200).json(users); 
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



router.post('./register', async (req, res) => {
  const newUser = req.body;
  const hash = bcryptjs.hashSync(newUser.password)
  newUser.password = hash;

  try{
    const addUser = await userAuth.get(newUser)
    res.status(200).json(addUser);
  } catch (error) {
    res.status(500).json({message: error.message })
  }
});


router.post('./login', async (req, res) => {
  const { username , password } = req.body;

  try {
    const user = await userAuth.findBy({ username: username})
    if (user && bcryptjs.compareSync(password, user.password)) {
      const token = createToken(user); 
      res.status(200).json({
        message: `welcome, ${user.username}`, 
        token: token
      });
    } else {
      res.status(401).json("invalid credentials"); 
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;