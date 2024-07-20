
const pack=require('../all_packages')
const authenticate_token = require('../authenticate_token');

pack.router.doSgnin = async (req, res) => {

    try {
      const { user_name, password } = req.body;
  
      if (!user_name || !password) {
        return res.status(400).send({ message: 'Username and password are required' });
      }
  
      const sql = 'SELECT * FROM users WHERE user_name = ?';
      const results = await dbQuery(sql, [user_name]);
  
      if (results.length === 0) {
        return res.status(401).send({ message: 'Invalid Username' });
      }
  
      const user = results[0];
      // console.log(user)
      const match = await pack.bcrypt.compare(password, '$2b$10$HjFaH1RubO.93N7sgWjYeuV8wVyORJyZRqV7oq/iuNYdZJRTT/eru');  
      if (match) {
        const token = authenticate_token.generateAccessToken( user);
        // console.log(token)
        pack.storage.set('token', token);
        user.token = token;
        return user; // Return user directly
      } else {
        return res.status(401).send({ message: 'Invalid Password' });
      }
    } catch (err) {
      res.status(500).send({ message: 'Internal server error', error: err });
    }
  };

  pack.router.saleList=async (req,res)=>{
    // const dynamicDbConfig =await pack.db.config.getDatabaseConfig();
    // console.log(dynamicDbConfig)

    try{
        var sql=`select 'sales.id', 'sales.id as transaction_id', 'sales.invoice_no', 'sales.transaction_date',(case sales.payment_type when 1 then customers.name when 2 then ledgers.name end) as customer_name, companies.name as company_name from sales left join sale_details on sales.id = sale_details.id left join customers on customers.id = sales.customer_id left join ledgers on ledgers.id = sales.customer_id left join companies on companies.id = sales.company_id`;
        const results= await dbQuery(sql);
        return results;
    }catch(error){
        res.status(500).send({message:error})
    }
  }

  const dbQuery = (sql, params=[]) => {
    return new Promise((resolve, reject) => {
      pack.db.query(sql, params, (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      });
    });
  };
  





// router.doSgnin= async (req,res)=>{
//     try {
//         const { user_name, password } = req.body;
    
//         if (!user_name || !password) {
//           return res.status(400).send({ message: 'Username and password are required' });
//         }
    
//         const sql = 'SELECT * FROM users WHERE user_name = ?';
//          db.query(sql, [user_name], async (error, results) => {
//           if (error) {
//             return res.status(500).send({ message: 'Database query error', error });
//           }
//           if (results.length === 0) {
//             return res.status(401).send({ message: 'Invalid Username' });
//           }
//           // const hashedPassword = await bcrypt.hash('a', 10);
//           // console.log('Hashed Password:', hashedPassword);
      
//           const user = results[0];
//           const match = await bcrypt.compare(password, '$2b$10$HjFaH1RubO.93N7sgWjYeuV8wVyORJyZRqV7oq/iuNYdZJRTT/eru');
//           // console.log(match)
//           if (match) {
//             const token = authenticate_token.generateAccessToken({ user });
//             storage.set('token', token);
//             user.token = token;
//             // res.send(user);
//             return user;
//           } else {
//            return res.status(401).send({ message: 'Invalid Password' });
//           }
//         });
//       } catch (err) {
//         next(err);
//       }
    
// }


module.exports=pack.router;