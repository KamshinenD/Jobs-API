require("dotenv").config();
require("express-async-errors");
// xtrs security
const helmet = require('helmet');
const cors= require('cors');
const xss = require('xss-clean')
const rateLimiter= require('express-rate-limit')

// swagger
const swaggerUI= require('swagger-ui-express');
const YAML = require('yamljs')

const swaggerDocument=YAML.load('./swagger.yaml')
const express = require("express");
const app = express();

// connect DB
const connectDb = require("./db/connect");
const authenticationMiddleware = require("./middleware/authentication");
// routers
const authRouter = require("./routes/auth");
const jobsRouter = require("./routes/jobs");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const authMiddleware= require('./middleware/authentication')


app.set('trust proxy', 1);
app.use(rateLimiter({
  window: 15 *60 * 1000, //15 minutes
  max:100, //limit each IP to 100 requests per window
}));
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());



// routes
app.get('/', (req, res) => {
    res.send('<h1>jobs api <a href="/api-docs">Documentation</a></h1>');
  });

  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))
  
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/jobs", authMiddleware, jobsRouter);
  // the authMiddleware is what is used to verify the token to ensure the user is signed in
  // before allowing them to carry out any operation on the jobs route.
  // it's passed here for all the job routes, instead of doing it for the routes individually

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  await connectDb(process.env.MONGO_URI);
  try {
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
