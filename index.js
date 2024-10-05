const express = require("express");
// populate proces.env
require("dotenv").config();
const { UserController } = require("./src/controllers/users");
const {
  initializeRedisClient,
  redisCachingMiddleware,
} = require("./src/middlewares/redis");

async function initializeExpressServer() {
  // initialize an Express application
  const app = express();
  app.use(express.json());

  // connect to Redis
  await initializeRedisClient();

  // register an endpoint
  app.get("/api/v1/users", redisCachingMiddleware(), UserController.getAll);
  app.get("/", (req, res) =>{
    res.json({
      status:true,
      msg:"layered-cahing server health check passed ✅",
      meta_data:{
        about: "In Node.js, a caching layer is the part of the backend application that contains the logic to implement response caching logic. This code must rely on a caching provider, such as Redis. Now, the problem is that Redis works in memory, and RAM is expensive.",
        example:{
         api_url :"https://layered-caching.onrender.com/api/v1/users" ,
         desc: "use the endpoint above to test with redis"
        }
      }
    })
  });

  // start the server 
  const port = 3000;
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

initializeExpressServer()
  .then()
  .catch((e) => console.error(e));
