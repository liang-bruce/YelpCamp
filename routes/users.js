const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post(
  "/register",
  catchAsync(async (req, res, next) => {
    try {
      const { email, username, password } = req.body;
      const user = new User({ email, username });
      const registeredUser = await User.register(user, password);
      req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash("success", "Welcome to Yelp Camp!");
        res.redirect("/campgrounds");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("register");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", "Welcome back!");
    // @ts-ignore
    const redirectUrl = req.session.returnTo || "/campgrounds";
    res.redirect(redirectUrl);
    // @ts-ignore
    delete req.session.returnTo;
  }
);

router.get("/logout", (req, res, next) => {
  // since passport 0.6.0 logout() is async,
  //https://stackoverflow.com/questions/72336177/error-reqlogout-requires-a-callback-function
  // req.logout(function (err) {
  //   if (err) {
  //     return next(err);
  //   }
  // @ts-ignore
  req.logout();
  req.flash("success", "Goodbye!");
  res.redirect("/campgrounds");
  // });
});

module.exports = router;
