const { access } = require("fs");
const User = require("../../../models/Assets/Persons/Users"),
  Attendances = require("../../../models/Responsibilities/Attendances"),
  Personnels = require("../../../models/Assets/Persons/Personnels"),
  Branch = require("../../../models/Assets/Branches"),
  Access = require("../../../models/Responsibilities/Access");
const { log } = require("handlebars/runtime");
(generateToken = require("../../../config/generateToken")),
  (bcrypt = require("bcryptjs")),
  (jwt = require("jsonwebtoken")),
  (fs = require("fs"));

const encrypt = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};
const defaultBranch = {
  designation: 1,
  name: "patron",
  company: null,
  platform: "patron",
};
const timein = (id) =>
  Attendances.findOne({ user: id })
    .sort({ createdAt: -1 })
    .then((attendance) => {
      if (!attendance) {
        Attendances.create({
          user: id,
          in: new Date().toLocaleTimeString(),
        });
      }

      if (attendance.out) {
        Attendances.create({
          user: id,
          in: new Date().toLocaleTimeString(),
        });
      }
    });

const getSiblings = async (fk) =>
  User.find({ _id: fk })
    .then((datas) => datas)
    .catch((error) => {
      console.log(error);
    });

const getGuardian = async (fk) =>
  User.find({ _id: fk })
    .then((datas) => datas[0])
    .catch((error) => {
      console.log(error);
    });

const getParents = async (fk) =>
  User.find({ _id: fk })
    .then((datas) => datas[0])
    .catch((error) => {
      console.log(error);
    });

const getAccess = async (access) =>
  Access.find()
    .byUserId(access)
    .then((datas) => datas)
    .catch((error) => {
      console.error("Error occurred:", error);
      return error;
    });

const getBranches = async (ownership) =>
  await Branch.find({
    companyId: { $in: ownership },
  })
    .populate({
      path: "company",
      select: "name",
    })
    .then((branches) =>
      branches.map((branch) => ({
        _id: branch._id,
        companyId: branch.companyId,
        isMain: branch.isMain,
        lastVisit: branch.isMain, // by default
        designation: 6,
        name: branch.name,
        platform: "headquarter",
        company: branch.company.name,
        status: branch.status,
      }))
    );

const getAffiliated = async (fk) =>
  Personnels.find()
    .byUser(fk)
    .select("-user")
    .populate({
      path: "branch",
      select: "name companyId companyNames category",
    })
    .then(async (affiliates) => {
      return affiliates.map((a) => ({
        _id: a.branch?._id,
        lastVisit: a.lastVisit,
        designation: a.designation,
        name: a.branch?.name,
        category: a.branch?.category,
        status: a.status,
        company: a.branch?.name,
        specifications: a.specifications,
      }));
      // var container = [];
      // for (var index in affiliates) {
      //   var affiliate = affiliates[index];
      //   var access = await Access.find()
      //     .byUserId(fk)
      //     .byBranchId(affiliate.branch?._id);
      //   if (access.length > 0) {
      //     for (var aIndex in access) {
      //       container.push({
      //         _id: affiliate.branch?._id,
      //         companyId: affiliate.branch?.companyId,
      //         isMain: affiliate.branch?.isMain,
      //         lastVisit: affiliate.lastVisit,
      //         designation: affiliate.designation,
      //         name: affiliate.branch?.name,
      //         platform: affiliate.platform,
      //         company: affiliate.branch?.companyName,
      //         status: affiliate.status,
      //         access: access[aIndex].platform,
      //       });
      //     }
      //   }
      // }
    })

    .catch((error) => {
      console.error("Error occurred:", error);
      return [defaultBranch];
    });

// entity/login
exports.login = (req, res) => {
  const { email, password } = req.query;

  User.findOne({ $or: [{ email }, { mobile: email }] })
    .then(async (user) => {
      if (user) {
        if (await user.matchPassword(password)) {
          if (!user.deletedAt) {
            let siblings =
              user.siblings?.length > 0
                ? await Promise.all(
                    user.siblings.map(async (sibling) => {
                      var _siblings = await getSiblings(sibling);
                      return _siblings;
                    })
                  )
                : [];
            let hasGuardian = Object.keys(user.guardian).length > 0;
            let guardian = hasGuardian
              ? await getGuardian(user.guardian.id)
              : {};
            let mother = await getParents(user.motherId);
            let father = user.fatherId && (await getParents(user.fatherId));

            let branches = [];
            let access = ["principal", "staff", "faculty", "aor"]; //  deafult access for owner
            let isCeo = false;
            if (!!user?.ownership?.length) {
              branches = await getBranches(user.ownership);
              isCeo = true;
            } else {
              branches = await getAffiliated(user._id);
              access = await getAccess(user._id);
            }
            var _user = { ...user._doc };
            delete _user.password;
            res.json({
              auth: {
                ..._user,
                parents: { mother, father: father ? father : {} },
                yourSiblings: siblings,
                yourGuardian: guardian,
              },

              branches,
              access,
              isCeo,
              token: generateToken(user._id),
            });
          } else res.json({ error: "Your account has been banned!" });
        } else res.json({ error: "Password is incorrect!" });
      } else res.json({ error: "Account is not in our database!" });
    })
    .catch((error) => res.status(400).json({ error: error.message }));
};

exports.logout = (req, res) => {
  const { key } = req.query;
  Attendances.findOne({ user: key })
    .sort({ createdAt: -1 })
    .then((attendance) => {
      if (attendance?.out) {
        Attendances.findByIdAndUpdate(attendance._id, {
          out: new Date().toLocaleTimeString(),
        }).then(() => {
          res.json("Logged out successfully.");
        });
      }
    });
};

exports.timeout = (req, res) => {
  const { key } = req.query;
  Attendances.findOne({ user: key })
    .sort({ createdAt: -1 })
    .then((attendance) => {
      if (!attendance.out) {
        Attendances.findByIdAndUpdate(attendance._id, {
          out: new Date().toLocaleTimeString(),
        }).then(() => {
          res.json("Logged out successfully.");
        });
      }
    });
};

exports.attendance = (req, res) => {
  const { key } = req.query;
  Attendances.find({ user: key }).then(async (attendances) => {
    const personnel = await Personnels.findOne({ user: key });

    res.json({ attendances, rate: personnel.rate });
  });
};

// entity/validateRefresh
exports.validateRefresh = (req, res) => {
  const { token } = req.query;

  if (token) {
    if (token.startsWith("QTracy")) {
      jwt.verify(
        token.split(" ")[1],
        process.env.JWT_SECRET,
        async (err, response) => {
          if (err) {
            res.json({ error: err.message });
          } else {
            const user = await User.findById(response.id)
              .select("-password")
              .populate("fullName.mname fullName.lname");

            if (user) {
              let siblings =
                user.siblings?.length > 0
                  ? await Promise.all(
                      user.siblings.map(async (sibling) => {
                        var _siblings = await getSiblings(sibling);
                        return _siblings[0];
                      })
                    )
                  : [];
              let hasGuardian = Object.keys(user.guardian).length > 0;
              let guardian = hasGuardian
                ? await getGuardian(user.guardian.id)
                : {};

              let mother = await getParents(user.motherId);
              let father = user.fatherId && (await getParents(user.fatherId));
              let branches = [];
              let access = [];
              let isCeo = false;
              if (!!user?.ownership?.length) {
                branches = await getBranches(user.ownership);
                isCeo = true;
              } else {
                branches = await getAffiliated(user._id);

                access = await getAccess(user._id);
                // only if user don't have timein
                // timein(user._id);
              }

              res.json({
                auth: {
                  ...user._doc,
                  parents: { mother, father: father ? father : {} },
                  yourGuardian: guardian,
                  yourSiblings: siblings,
                },
                branches,
                access,
                isCeo,
                token: generateToken(user._id),
              });
            } else {
              res.json({ error: "Invalid account!" });
            }
          }
        }
      );
    } else {
      res.json({ error: "Invalid key!" });
    }
  } else {
    res.json({ error: "Invalid parameters!" });
  }
};

exports.branchSwitcher = async (req, res) => {
  const { designation, userId, activeId, selectedId } = req.query;
  Personnels.findByIdAndUpdate(activeId, { lastVisit: false }).then(() =>
    Personnels.findByIdAndUpdate(selectedId, { lastVisit: true }).then(() =>
      res.json(generateToken(userId, designation))
    )
  );
};

// entity/save
exports.save = (req, res) =>
  User.create(req.body)
    .then((user) => {
      const _body = req.body;
      const _user = { ...user._doc };

      _user.password = undefined;
      if (_body.role) {
        Personnels.create({
          user: user._id,
          branch: _body.role?.branch,
          company: _body.role?.company,
          designation: _body.role?.designation,
          lastVisit: true,
        }).then(() => res.json(_user));
      } else {
        res.json(_user);
      }
    })
    .catch((error) => res.status(400).json({ error: error.message }));

// entity/changepassword
exports.changePassword = (req, res) => {
  const { email, password, old } = req.body;

  User.findOne({ email })
    .then(async (user) => {
      if (user.deletedAt) {
        res.status(400).json({ expired: "Your account has been banned" });
      } else {
        if (user && (await user.matchPassword(old))) {
          let newPassword = await encrypt(password);
          User.findByIdAndUpdate(user._id, { password: newPassword }).then(
            (user) => res.json(user)
          );
        } else {
          res.json({ error: "Old Password is incorrect." });
        }
      }
    })
    .catch((error) => res.status(400).json({ error: error.message }));
};

exports.file = (req, res) => {
  const { path, base64, name } = req.body;
  let url = `./public/${path}`;
  if (!fs.existsSync(url)) {
    fs.mkdirSync(url, { recursive: true });
  }
  try {
    let filename = `${url}/${name}`;
    fs.writeFileSync(filename, base64, "base64");
    return res
      .status(200)
      .json({ success: true, message: "Successfully Uploaded." });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
