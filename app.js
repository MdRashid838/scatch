const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const db = require("./config/mongoose.connection");

const ownerRouter = require("./routes/ownersRouter");
const userRouter = require("./routes/usersRouter");
const productRouter = require("./routes/productsRouter");
const indexRouter = require("./routes/index");

const session = require("express-session");
const flash = require("connect-flash");
const MongoStore = require("connect-mongo");
require("dotenv").config();

// MongoDB logs
db.on("connected", () => console.log("✅ MongoDB connected successfully"));
db.on("error", (err) => console.error("❌ MongoDB error:", err));

// Trust proxy (Render)
app.set("trust proxy", 1);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session (FIXED)
app.use(
  session({
    name: "scatch-session",
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: "sessions",
    }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use(flash());

// Routes (JSON only – React)
app.use("/", indexRouter);
app.use("/owners", ownerRouter);
app.use("/users", userRouter);
app.use("/products", productRouter);

// Health
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: "API not found" });
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
