// index.js
import app from "./server.js";
import router from "./routes.js";

app.use(router);

// Start the server
const port = 8080;
app.listen(port, () => {
  console.log("Server is running on port from", port);
});
