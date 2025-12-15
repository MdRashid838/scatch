const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");
const db = require("./config/mongoose.connection");

const ownerRouter = require("./routes/ownersRouter");
const userRouter = require("./routes/usersRouter");
const productRouter = require("./routes/productsRouter");
const indexRouter = require("./routes/index");

const flash = require("connect-flash");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session); // ✅ ADD
require("dotenv").config();

/* =========================
   MongoDB Logs
========================= */
db.on("connected", () => {
  console.log("✅ MongoDB connected successfully");
});

db.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err);
});

/* =========================
   Render / Proxy
========================= */
app.set("trust proxy", 1);

/* =========================
   Middlewares
========================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* =========================
   SESSION (FIXED ✅)
========================= */
app.use(
  session({
    name: "scatch-session",
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

    // ✅ SESSION AB MONGODB ME STORE HOGA
    store: new MongoStore({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: "sessions",
    }),

    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

app.use(flash());

/* =========================
   API Routes
========================= */
app.use("/", indexRouter);
app.use("/owners", ownerRouter);
app.use("/users", userRouter);
app.use("/products", productRouter);

/* =========================
   Health Check (Render)
========================= */
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

/* =========================
   404 Handler
========================= */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

/* =========================
   Server
========================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
