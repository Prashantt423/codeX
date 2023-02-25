let mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// retry for 5s and keep connecting
const connectWithRetry = (dbUrl)=>{
    mongoose
    .connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log(`[*] Connected to Database`);
    })
    .catch((err) => {
      console.log(`[*] Error while connecting to DB, with error: ${err}`);
      setTimeout(connectWithRetry,5000);
    });
 }


 module.exports=connectWithRetry;