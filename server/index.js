const express = require('express');
const bodyParser = require('body-parser');

// Routes
const qaRouter = require('../routes/qaRoutes');

const app = express();
app.use(bodyParser.json());

app.use('/qa', qaRouter);

const PORT = 5000 || process.env.PORT;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${PORT}`);
});
