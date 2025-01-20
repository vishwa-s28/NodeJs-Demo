const {
  ADMIN_API_PREFIX,
  ADMIN_ROUTES,
  BASE_URL,
} = require("../constants/routesConstants");
const fileHelper = require("../utils/file");
// const path = require("path");

const Product = require("../models/product");
const { encrypt, decrypt } = require("../utils/encrypt_decrypt");
const { validationResult } = require("express-validator");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: [],
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = encrypt(req.body.description);

  console.log(image);
  if (!image) {
    // console.log(errors.array());
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/edit-product",
      editing: false,
      hasError: true,
      product: {
        title: title,
        price: price,
        description: description,
      },
      errorMessage: "Attached file is not an image",
      validationErrors: [],
    });
  }

  // if (
  //   image.mimetype !== "image/png" &&
  //   image.mimetype !== "image/jpg" &&
  //   image.mimetype !== "image/jpeg"
  // ) {
  //   return res.status(422).render("admin/edit-product", {
  //     pageTitle: "Add Product",
  //     path: "/admin/edit-product",
  //     editing: false,
  //     hasError: true,
  //     product: {
  //       title: title,
  //       price: price,
  //       description: description,
  //     },
  //     errorMessage: "Attached file is not an image",
  //     validationErrors: [],
  //   });
  // }
  // const uploadPath = path.join(__dirname, "images", image.name);
  // const uploadPath = path.join(__dirname, "..", "images", image.name);

  // image.mv(uploadPath, (err) => {
  //   if (err) {
  //     // console.log(image.path);
  //     return res.status(500).send("Error saving file.");
  //   }

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // console.log(errors.array());
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/edit-product",
      editing: false,
      hasError: true,
      product: {
        title: title,
        price: price,
        description: description,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  // const imageUrl = `/images/${image.name}`;
  const imageUrl = image.path;
  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user,
  });
  product
    .save()
    .then((result) => {
      console.log("Created Product");
      res.redirect(ADMIN_API_PREFIX.ADMIN_API + ADMIN_ROUTES.PRODUCTS);
    })
    .catch((err) => {
      console.log(err);
    });
  // });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect(BASE_URL.URL);
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect(BASE_URL.URL);
      }
      product.description = decrypt(product.description);
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
        hasError: false,
        errorMessage: null,
        validationErrors: [],
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const image = req.file;
  const updatedDesc = encrypt(req.body.description);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: true,
      hasError: true,
      product: {
        title: updatedTitle,
        // imageUrl: updatedImageUrl,
        price: updatedPrice,
        description: updatedDesc,
        _id: prodId,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  Product.findById(prodId)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      if (image) {
        fileHelper.deleteFile(product.imageUrl);
        product.imageUrl = image.path;
      }
      return product.save().then((result) => {
        console.log("UPDATED PRODUCT!");
        res.redirect(ADMIN_API_PREFIX.ADMIN_API + ADMIN_ROUTES.PRODUCTS);
      });
    })
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    .then((products) => {
      products.forEach((product) => {
        product.description = decrypt(product.description);
      });
      // console.log(products);
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return next(new Error("Product not found."));
      }
      fileHelper.deleteFile(product.imageUrl);
      return Product.deleteOne({ _id: prodId, userId: req.user._id });
    })
    .then(() => {
      console.log("DESTROYED PRODUCT");
      res.redirect(ADMIN_API_PREFIX.ADMIN_API + ADMIN_ROUTES.PRODUCTS);
    })
    .catch((err) => console.log(err));
};
