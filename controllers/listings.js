const Listing = require("../models/listing");
const axios = require("axios");
/*module.exports.index = async(req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", {allListings});
};*/

module.exports.index = async (req, res) => {
  let { category } = req.query;

  let allListings;

  if (category) {
    allListings = await Listing.find({ category: category });
  } else {
    allListings = await Listing.find({});
  }

  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
   res.render("listings/new"); 
};

module.exports.showListing = async (req, res) => {
  let {id} = req.params;
  const listing = await Listing.findById(id)
  .populate({path:"reviews",
    populate:{
    path: "author",
  },
 })
  .populate("owner");
  if(!listing) {
    req.flash("error", "listing you requested does not exist!");
    return res.redirect("/listings");
    }
    res.render("listings/show", {listing});
};

/*module.exports.createListing = async (req, res) => {
  let url =req.file.path;
  let filename = req.file.filename;
  
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = {url, filename};
  await newListing.save(); 
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};*/

module.exports.createListing = async (req, res) => {
  try {
    const newListing = new Listing(req.body.listing);

    newListing.owner = req.user._id;

    // Upload image
    if (req.file) {
      newListing.image = {
        url: req.file.path,
        filename: req.file.filename
      };
    }

    // GEOCODING
    const location = `${req.body.listing.location}, ${req.body.listing.country}`;

    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: location,
          format: "json",
          limit: 1
        },
        headers: {
          "User-Agent": "Wanderlust/1.0 (sayanpatra058@gmail.com)",
          "Accept-Language": "en"
        }
      }
    );

    console.log("Geocoding result:", response.data);

    if (response.data.length > 0) {
      const lat = Number(response.data[0].lat);
      const lon = Number(response.data[0].lon);

      newListing.geometry = {
        type: "Point",
        coordinates: [lon, lat]
      };

      console.log("Coordinates saved:", [lon, lat]);
    } else {
      console.log("Location not found:", location);
    }

    await newListing.save();

    req.flash("success", "New Listing Created!");
    res.redirect("/listings");

  } catch (err) {
    console.log("CREATE LISTING ERROR:", err.message);
    res.status(500).send("Request failed. Please try again.");
  }
}


module.exports.renderEditForm = async(req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
    req.flash("error", "Listing you requested for does not exit!");
    return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit", {listing, originalImageUrl});
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing}, {new: true});

  if(typeof req.file != "undefined") {
  let url =req.file.path;
  let filename = req.file.filename;
  listing.image = {url, filename};
  await listing.save();
  }
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
   let deletedListing = await Listing.findByIdAndDelete(id);
   console.log(deletedListing);
   req.flash("success", "Listing Deleted!");
   res.redirect("/listings");
};