const User = require("../schemas/userSchema");

exports.getUserProfile = (req, res) => {
  if (!req.user) {
    return res.redirect("/");
  }
  console.log(req.user);
  res.render("profile", { user: req.user });
};

exports.logout = async (req, res) => {
  if (req.user) {
    try {
      await User.findByIdAndDelete(req.user._id);
      req.logout((err) => {
        if (err) {
          console.error("Error during logout:", err);
          return res.status(500).send("An error occurred during logout.");
        }

        req.session.destroy((err) => {
          if (err) {
            console.error("Error destroying session:", err);
            return res
              .status(500)
              .send("An error occurred while destroying session.");
          }

          res.redirect("/");
        });
      });
    } catch (err) {
      console.error("Error removing user from database:", err);
      return res.status(500).send("An error occurred while logging out.");
    }
  } else {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res
          .status(500)
          .send("An error occurred while destroying session.");
      }

      res.redirect("/");
    });
  }
};
