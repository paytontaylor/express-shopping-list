const express = require("express");
const ExpressError = require("../ExpressError");
const router = new express.Router();

const items = require("../fakeDb");

router.get("/", (req, res) => {
  return res.json({items: items})
});

router.get("/:name", (req, res, next) => {
  try {
    const item = items.find(item => item.name === req.params.name)
    if (!item) throw new ExpressError("Item not found", 400)
    return res.send(item)
  } catch (err) {
    next(err)
  }
});

router.post("/", (req, res, next) => {
  try {
    const newItem = req.body;
    if (!newItem) throw new ExpressError("Invalid input, please input an item", 400)
    items.push(newItem);
    res.status(201).send({added: newItem});
  } catch (err) {
    next(err)
  }
});

router.patch("/:name", (req, res, next) => {
  try {
    const item = items.find(item => item.name === req.params.name)
    if (!item) throw new ExpressError("Item not found", 400)
    item.name = req.body.name || item.name;
    item.price = req.body.price || item.price
    return res.json({updated: item})
  } catch (err) {
    next(err)
  }
});

router.delete("/:name", (req, res, next) => {
  try {
    const index = items.findIndex(item => item.name === req.params.name)
    items.splice(index, 1)
    return res.json({message: "Deleted"})
  } catch (err) {
    next(err)
  }
});

module.exports = router;