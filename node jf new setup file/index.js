
const authenticate_token = require('./authenticate_token');
const userRepo=require('./repository/userRepository')
const pack=require('./all_packages')


pack.app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('Bad JSON:', err);
    return res.status(400).send({ error: 'Invalid JSON' });
  }
  next();
});

pack.app.post('/signin', async (req, res, next) => {
  try {
    const result = await userRepo.doSgnin(req, res);
    if (!res.headersSent) { // Check if the response has not already been sent
      res.send(result);
    }
  } catch (err) {
    res.status(500).send({ message: 'Internal server error', error: err });
  }
});

pack.app.get('/get',authenticate_token.authenticateToken, async (req, res,next) => {

  try{
    const result=await userRepo.saleList(req,res);
    if (!res.headersSent) { // Check if the response has not already been sent
      res.send(result);
    }
  }catch(error){
    res.status(500).send({message:"Internal Server Error"})
  }
});


// app.post('/signin', async (req, res, next) => {

  // try {
  //   const { user_name, password } = req.body;

  //   if (!user_name || !password) {
  //     return res.status(400).send({ message: 'Username and password are required' });
  //   }

  //   const sql = 'SELECT * FROM users WHERE user_name = ?';
  //   db.query(sql, [user_name], async (error, results) => {
  //     if (error) {
  //       return res.status(500).send({ message: 'Database query error', error });
  //     }
  //     if (results.length === 0) {
  //       return res.status(401).send({ message: 'Invalid Username' });
  //     }
  //     // const hashedPassword = await bcrypt.hash('a', 10);
  //     // console.log('Hashed Password:', hashedPassword);
  
  //     const user = results[0];
  //     const match = await bcrypt.compare(password, '$2b$10$HjFaH1RubO.93N7sgWjYeuV8wVyORJyZRqV7oq/iuNYdZJRTT/eru');
  //     // console.log(match)
  //     if (match) {
  //       const token = authenticate_token.generateAccessToken({ user });
  //       storage.set('token', token);
  //       user.token = token;
  //       res.send(user);
  //     } else {
  //       res.status(401).send({ message: 'Invalid Password' });
  //     }
  //   });
  // } catch (err) {
  //   next(err);
  // }
// });


pack.app.get('/get',  authenticate_token.authenticateToken, (req, res,next) => {

  try{

  }catch(error){
    res.status(500).send({message:"Internal Server Error"})
  }
//   try{
//     sql=`select * from sales`
//     db.query(sql,(error,result)=>{
//       if(error){
//         res.send(500).send({ message: 'Database query error', error });
//       }else{
//         res.send(result)
//       }
//     })
//  }catch(err){
//     next(err);
//  }
});

pack.app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});
