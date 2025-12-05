require("dotenv").config();
const { sequelize } = require("./models");
const express = require("express");
const cors = require("cors");
const XLSX = require("xlsx");
const path = require("path");

const app = express();

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const reportRoutes = require("./routes/report.routes");
const provinceRoutes = require("./routes/province.routes");
const companyRoutes = require("./routes/company.routes");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "https://laporiujp.com",
    allowedHeaders: ["Content-Type", "Authorization", "Access-Token"],
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/province", provinceRoutes);
app.use("/api/company", companyRoutes);

app.get("/api", (req, res) => {
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
