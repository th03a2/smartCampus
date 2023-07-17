const Entity = require("../../../models/Results/Laboratory/Drugtest");

// entity/
exports.browse = (req, res) =>
  Entity.find()
    // Entity.find({ branch: req.params.id })

    // .populate({
    //   path: "companyId",
    //   select: "name subName",
    // })
    // .populate({
    //   path: "managerId",
    //   select: "fullName email roles",
    // })
    .then(items => res.json(items.filter(item => !item.deletedAt)))
    .catch(error => res.status(400).json({ error: error.message }));

// entity/:id/details
exports.details = (req, res) =>
  Entity.findById(req.query.id)
    .populate({
      path: "branchId",
      select: "name subName",
    })
    .populate({
      path: "customerId",
      select: "fullName email roles",
    })
    .populate({
      path: "saleId",
      select: "created_at",
    })
    .then(item => res.json(item))
    .catch(error => res.status(400).json({ error: error.message }));

// entity/:id/find
exports.find = (req, res) =>
  Entity.find()
    .bySaleId(req.query.id)
    .populate("customerId")
    .populate("branchId")
    .then(items => res.json(items.filter(item => !item.deletedAt)))
    .catch(error => res.status(400).json({ error: error.message }));

// entity/save
exports.save = (req, res) =>
  Entity.updateOne({ _id: req.body._id }, { $set: req.body }, { upsert: true })
    .then(item => res.json(item))
    .catch(error => res.status(400).json({ error: error.message }));

// entity/:id/update
exports.update = (req, res) => {
  Entity.findByIdAndUpdate(req.query.id, req.body, { new: true })
    .populate("customerId")
    .populate("branchId")
    .populate("signatories")
    .then(item => res.json(item))
    .catch(error => res.status(400).json({ error: error.message }));
};

// entity/:id/destroy
exports.destroy = (req, res) =>
  Entity.findByIdAndUpdate(req.query.id, {
    deletedAt: new Date().toLocaleString(),
  })
    .then(() => res.json(req.query.id))
    .catch(error => res.status(400).json({ error: error.message }));
