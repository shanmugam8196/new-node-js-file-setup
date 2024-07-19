
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
    const result = router.verifyAccessToken(token);
  
    if (!result.success) {
      return res.status(403).json({ error: result.error });
    }
  
    req.user = result.data;
    next();
  }

  module.exports=pack.router;