const app = require('./src/app');
const dbConnect = require('./src/config/dbConnect');
require("dotenv").config();
// Connect to MongoDB
dbConnect();



app.listen(3000, () => {
  console.log('Server is running on port 3000');
});