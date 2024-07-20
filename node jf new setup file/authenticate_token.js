
const pack=require('./all_packages');

pack.dotenv.config();
let jwtSecretKey = process.env.JWT_SECRET_KEY;

// const router = express.Router();
pack.router.generateAccessToken= (user) =>{
    const payload = {
      id: user.id,
      // email: user.user_name
    };
    
    const secret =jwtSecretKey;
    // const options = { expiresIn: '1h' };
    // return jwt.sign(payload, secret, options);
    pack.storage.set('session_time_out',parseInt(process.env.SESSION_TIME_OUT) + Math.floor(Date.now() / 1000));
    pack.storage.set('user',user);
   return pack.jwt.sign({
      exp: Math.floor(Date.now() / 1000) + (60 * 60),
      id: user.id,
    }, secret);
  }

// console.log(generateAccessToken({user:{id:1,email:'shan@123'}}))
pack.router.verifyAccessToken=(token)=> {
  // console.log(token)
    const secret = jwtSecretKey;
  //one hour 3600 extand
    try {
      // const decoded = jwt.verify(token, secret);
      const decoded = pack.jwt.decode(token, secret);
      // console.log(Math.floor(Date.now() / 1000))
      if(decoded.exp > Math.floor(Date.now() / 1000) || pack.storage.get('session_time_out') > Math.floor(Date.now() / 1000)){
        pack.storage.set('session_time_out',parseInt(process.env.SESSION_TIME_OUT) + Math.floor(Date.now() / 1000));
        return { success: true, data: decoded };
      }else{
        return { success: false, error: 'Token is expired' };
      }
      
    } catch (error) {
      return { success: false, error: error.message };
    }
  }


  pack.router.authenticateToken=(req, res, next)=> {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.sendStatus(401);
    }
    const result = pack.router.verifyAccessToken(token);
    if (!result.success) {
      return res.status(403).json({ error: result.error });
    }
  
    pack.db = pack.mysql.createConnection({
      host: process.env.HOST_NAME,
      port: process.env.PORT,
      user: process.env.user,
      password: process.env.PASSWORD,
      database: 'eplus_'+pack.storage.get('user').tenant_id+"_24_25"
    });
    
    pack.db.connect((err) => {
      if (err) {
        console.log('Error connecting to the database:', err);
      }
      console.log('Connected to the dynamic database');
    });

    req.user = result.data;
    next();
  }

  module.exports=pack.router;