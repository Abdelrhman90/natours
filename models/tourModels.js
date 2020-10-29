const mongoose = require("mongoose");
const slugify = require("slugify");
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tour must have a name"],
      unique: true,
      trim: true,
      minlength: [10, "A tour name must have more than 10 chars"],
      maxlength: [40, "A tour name must have less than 40 chars"],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, "A tour Must Have a Duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour Must Have a Group Size"],
    },
    difficulty: {
      type: String,
      required: [true, "A tour Must Have a Difficulty"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "A diffculty must be either easy, medium or difficult",
      },
    },
    price: {
      type: Number,
      required: [true, "tour must have a price"],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1.0, "A rating must be above 1.0"],
      max: [5.0, "A rating must be below 5.0"],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: "Price Discount Cannot be Bigger Than Original Price",
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "tour must have a summary"],
    },
    description: {
      type: String,
      trim: true,
    },
    images: [String],
    imageCover: {
      type: String,
      required: [true, "tour must have an image cover"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/* tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
}); */

tourSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "tour",
});

// INDEXES
tourSchema.index({
  price: 1,
});
tourSchema.index({
  ratingsAverage: -1,
});
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: "2dsphere" });
//DOCUMENT MIDDLEWARE
tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Query Middleware
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: "guides",
    select: "-__v -passwordChangedAt -passwordResetToken",
  });
  next();
});

// Aggergation Middlewares

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
