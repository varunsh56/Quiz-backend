import app from './app.js';
import { swaggerDocs } from "./swagger.js";

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  swaggerDocs(app);
});