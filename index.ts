import { app } from './app';
import dbConnection from './src/db';

const PORT = process.env.PORT || 8001; 

dbConnection()
.then(()=>{
    app.listen(8000, ()=>{
        console.log(`Running on the port ${PORT}`);
    });
})
.catch(error=>console.log(`Error while connecting to DB: ${error}`)); 
