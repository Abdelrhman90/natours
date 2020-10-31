const path = require("path");
const express = require("express");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const helmet = require("helmet");
const csp = require('express-csp');
const hpp = require("hpp");
const app = express();
const compression = require('compression')
const cookieParser = require('cookie-parser')
const AppError = require("./utils/AppError");
const globalErrorHandler = require("./controllers/errorControllers");
const toursRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const viewsRouter = require("./routes/viewsRoutes");
const bookingRouter = require("./routes/bookingRoutes");
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Global Middlewares
app.use(express.static(path.join(__dirname, "public")));





app.use(helmet())
csp.extend(app, {
  policy: {
    directives: {
      'default-src': ['self'],
      'style-src': ['self', 'https:'],
      'font-src': ['self', 'https://fonts.gstatic.com'],
      'script-src': [
        'self',
        'unsafe-inline',
        'data',
        'blob',
        'https://js.stripe.com',
        'https://*.mapbox.com',
        'https://*.cloudflare.com/',
        'https://bundle.js:8828',
        'ws://localhost:*/'
      ],
      'worker-src': [
        'self',
        'unsafe-inline',
        'data:',
        'blob:',
        'https://*.stripe.com',
        'https://*.mapbox.com',
        'https://*.cloudflare.com/',
        'https://bundle.js:*',
        'ws://localhost:*/'
      ],
      'frame-src': [
        'self',
        'unsafe-inline',
        'data:',
        'blob:',
        'https://*.stripe.com',
        'https://*.mapbox.com',
        'https://*.cloudflare.com/',
        'https://bundle.js:*',
        'ws://localhost:*/'
      ],
      'img-src': [
        'self',
        'unsafe-inline',
        'data:',
        'blob:',
        'https://*.stripe.com',
        'https://*.mapbox.com',
        'https://*.cloudflare.com/',
        'https://bundle.js:*',
        'ws://localhost:*/'
      ],
      'connect-src': [
        'self',
        'unsafe-inline',
        'data:',
        'blob:',
        'https://*.stripe.com',
        'https://*.mapbox.com',
        'https://*.cloudflare.com/',
        'https://bundle.js:*',
        'ws://localhost:*/',
        'ws://127.0.0.1:*/'
      ]
    }
  }
});

//Limit IP requests
const limiter = rateLimit({
  max: 50,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP",
});

app.use("/api", limiter);

// body parser
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser())

//Sanitaize againset noSQL injection
app.use(mongoSanitize());

//Sanitize against XSS
app.use(xss());

//Preven parameter pollution
app.use(compression())
app.use(
  hpp({
    whitelist: [
      "duration",
      "price",
      "difficulty",
      "maxGroupSize",
      "ratingAverages",
      "ratingQuantity",
    ],
  })
);
app.use(express.static(path.join(__dirname, 'public')));
//Routes

app.get("/overview", (req, res) => {
  res.status(202).render("overview", {
    title: "All Tours",
  });
});

app.use("/", viewsRouter);
app.use("/api/v1/tours", toursRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/bookings", bookingRouter);

app.all("*", (req, res, next) => {
  next(
    new AppError(`Can't find this ${req.originalUrl} url in this server `, 500)
  );
});

app.use(globalErrorHandler);
module.exports = app;
