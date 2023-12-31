const mongoose = require("mongoose");

const modelSchema = new mongoose.Schema(
  {
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "batchs",
      // required: true,
    },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: "Branches" },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    levelId: {
      type: Number,
    },
    specifications: {
      type: String,
    },
    assessedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    categorization: {
      type: String,
      enum: {
        values: [
          "freshman",
          "sophomore",
          "junior",
          "senior",
          "returning",
          "transferrees ",
        ], //old student, new student, transferre, returnee
        message: "{VALUE} is not supported, please select appropriate options",
      },
    },
    attachments: {
      nso: {
        type: String,
      },
      sf10A: {
        type: String,
      },
      goodmoral: {
        type: String,
      },
      sf10B: {
        type: String,
      },
      profile: {
        type: String,
      },
    },
    siblings: { type: Array, default: [] },

    subjects: { type: Array },
    phone: { type: String }, //
    issues: { type: Array }, // title: String , date :kelan inissue,issued By:Sino nag issue,
    miscellaneous: { type: Object }, //
    status: {
      type: String,
      enum: {
        values: ["pending", "denied", "onprogress", "approved"], //pending, approved,denied,missing documents
        message: "{VALUE} is not supported, please select appropriate options",
      },
    }, //
    deletedAt: { type: String },
  },
  {
    timestamps: true,
  }
);
modelSchema.query.byBranch = function (branchId) {
  return this.where({ branchId });
};
const Entity = mongoose.model("enrollments", modelSchema);

module.exports = Entity;
