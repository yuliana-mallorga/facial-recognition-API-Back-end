const handleSignin = (db, bcrypt) => (req, res) => {
  const { email, password } = req.body;
 
  if (!email || !password) {
    return res.status(400).json('Incorrect form submission')
  };
 
  db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db.select('*').from('users')
          .where('email', '=', email)
          .then(user => {
            res.json(user[0])
          })    
      } else {
        res.status(401).json('invalid user or credentials')
      }
    })
    .catch(err => {
      res.status(401).json('invalid user or credentials')
    })
  }

  module.exports = {
    handleSignin
  };