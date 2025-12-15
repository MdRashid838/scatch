const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");
const db = require("./config/mongoose.connection");
const ownerRouter = require("./routes/ownersRouter");
const userRouter = require("./routes/usersRouter");
const productRouter = require("./routes/productsRouter");
const indexRouter = require("./routes/index");
const flash = require("flash");
const expressSession = require("express-session");
require("dotenv").config();

// ✅ MongoDB Connection Logs
db.on("connected", () => console.log("✅ MongoDB connected successfully"));
db.on("error", (err) => console.error("❌ MongoDB connection error:", err));

// ✅ Trust proxy for Render
app.set("trust proxy", 1);

// ✅ Sessions & Flash
app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.EXPRESS_SESSION_SECRET,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax"
    }
  })
);
app.use(flash());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Static & Views
// app.use(express.static(path.join(__dirname, "public")));
// app.set("view engine", "ejs");

// ✅ Routers
app.use("/", indexRouter);
app.use("/owners", ownerRouter);
app.use("/users", userRouter);
app.use("/products", productRouter);

// ✅ Fallback route (optional)
app.use((req, res) => {
  res.status(404).send("404 - Page Not Found");
});

// ✅ Dynamic Port for Render
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
