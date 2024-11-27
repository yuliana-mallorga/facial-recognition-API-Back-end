
const handleSignin = (db, bcrypt) => (req, res) => {
    db.select('email', 'hash').from('login')
      .where('email', '=', req.body.email)
      .then(data => {
        const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
        if (isValid) {
          return db.select('*').from('users')
            .where('email', '=', req.body.email)
            .then(user => {
              res.json(user[0])
            })    
        } else {
          res.status(401).json('invalid user or credentials')
        }
      })
      .catch(err => res.status(401).json('invalid user or credentials'))
  }

  module.exports = {
    handleSignin
  };