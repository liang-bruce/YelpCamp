const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

// @ts-ignore
module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

// @ts-ignore
module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

// @ts-ignore
module.exports.createCampground = async (req, res, next) => {
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1,
    })
    .send();
  // .then((response) => {
  //   const match = response.body;
  // });

  const campground = new Campground(req.body.campground);
  // @ts-ignore
  campground.geometry = geoData.body.features[0].geometry;
  // add images properties to campground
  // @ts-ignore
  campground.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  // req.user is added through passport middleware
  // @ts-ignore
  campground.author = req.user._id;
  await campground.save();
  console.log(campground);
  req.flash("success", "Successfully made a new campground!");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res) => {
  const id = req.params.id;
  //try block: bruce added error handler for invalid id
  try {
    // nested populate:
    // if considering scale, need only author nameinstead of all data of the author
    // also can set up infinite scroll  or other ways to limit the data query each time
    const campground = await Campground.findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("author");
    if (!campground) {
      req.flash("error", "Cannot find the campground");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
  } catch (e) {
    req.flash("error", "Invalid Campground Id");
    return res.redirect("/campgrounds");
  }
};

module.exports.renderEditForm = async (req, res) => {
  const id = req.params.id;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash("error", "Cannot find the campground");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { campground });
};

module.exports.updateCampground = async (req, res) => {
  const id = req.params.id;
  console.log(req.body);
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  // @ts-ignore
  campground.images.push(...imgs);
  // @ts-ignore
  await campground.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    // @ts-ignore
    await campground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
    console.log(campground);
  }
  req.flash("success", "Successfully updated campground");
  // @ts-ignore
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
  const id = req.params.id;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted campground!");
  res.redirect(`/campgrounds`);
};
