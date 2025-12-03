require("dotenv").config();
const { sequelize } = require("./models");
const express = require("express");
const cors = require("cors");

const app = express();

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const reportRoutes = require("./routes/report.routes");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/report", reportRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully.");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
  }
}

startServer();
