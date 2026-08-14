const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },

  description: String,

  image: {
   url: String,
   filename: String,
  },

  price: {
    type: Number,
    required: [true, "Price is required"],
    min: 1,
  },

  location: {
    type: String,
    required: [true, "Location is required"],
  },

  country: {
    type: String,
    required: [true, "Country is required"],
  },

  geometry: {
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: [Number],
  },
  //  ADD THIS HERE
category: {
  type: String,
  enum: [
    "trending",
    "rooms",
    "cities",
    "mountains",
    "castles",
    "pools",
    "camping",
    "farms",
    "arctic",
    "boats"
  ],

},

  reviews: [{
    type: Schema.Types.ObjectId,
    ref: "Review",
  },
],
   owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
   }
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if(listing) {await Review.deleteMany({_id: {$in: listing.reviews}});
}
});
  
module.exports = mongoose.model("Listing", listingSchema);

/*const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: { type: String, required: true },
  description: String,

  image: { 
  filename: { type: String },
  url: {
    type: String,
    default: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800",
    set: v => v === "" ? undefined : v
  }
},


  price: Number,
  location: String,
  country: String,
});

module.exports = mongoose.model("Listing", listingSchema);*/