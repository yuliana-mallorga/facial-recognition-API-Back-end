const handleRegister = (req, res, db, bcrypt) =>{
    const { email, name, password } = req.body; 
    
    if (!email || !name || !password) {
      return res.status(400).json('Incorrect form submission')
    };

    const hash = bcrypt.hashSync(password);

    db.transaction(trx => {
      trx.insert({
        hash: hash,
        email: email
      })
      .into('login')
      .returning('*')
      .then( loginEmail => {
        return trx('users')
          .returning('*')
          .insert({ 
            email: loginEmail[0].email, 
            name: name,
            joined: new Date()
          })
          .then(user => {
            res.status(200).json(user[0]);
            
          })
      })
      .then(trx.commit)
      .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('unable to register. Your user email may already exist.'))
  };

  module.exports = {
    handleRegister
};