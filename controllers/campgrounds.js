const Campground = require("../models/campground");

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.createCampground = async (req, res, next) => {
  const campground = new Campground(req.body.campground);
  // req.user is added through passport middleware
  // @ts-ignore
  campground.author = req.user._id;
  await campground.save();
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
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
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
