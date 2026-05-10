const Organization = require("../models/Organization");
const OrgOfficer = require("../models/Org_officer");
const uploadStream = require("../utils/uploadStream");

// ===== ALL ORGANIZATIONS ROUTE =====
exports.getOrganizations = async (req, res) => {
  try {
    const orgs = await Organization.find()
      .populate({
        path: "department_id",
        select: "department_name department_code college_id",
        populate: { path: "college_id", select: "college_name college_code" }
      })
      .sort({ org_name: 1 })
      .lean();
    res.json(orgs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ===== ADD ORGANIZATION ROUTE =====
exports.createOrganization = async (req, res) => {
  try {
    const { name, type, department, description, moderator, facebookLink, instagramLink, xLink } = req.body;

    if (!name || !type || !department || !description) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let uploadedLogoUrl = "";
    if (req.file) {
      const uploadRes = await uploadStream(req.file.buffer);
      uploadedLogoUrl = uploadRes.secure_url;
    }

    const newOrg = new Organization({
      org_name: name,
      org_type: type,
      department_id: department,
      description: description,
      moderator_name: moderator || "",
      fb_link: facebookLink || "",
      ig_link: instagramLink || "",
      x_link: xLink || "",
      pfp: uploadedLogoUrl,
    });

    await newOrg.save();
    res.status(201).json(newOrg);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ===== EDIT ORGANIZATION ROUTE =====
exports.updateOrganization = async (req, res) => {
  try {
    const { name, type, department, description, moderator, facebookLink, instagramLink, xLink } = req.body;

    const updateData = {
      org_name: name,
      org_type: type,
      department_id: department,
      description: description,
      moderator_name: moderator || "",
      fb_link: facebookLink || "",
      ig_link: instagramLink || "",
      x_link: xLink || "",
    };

    if (req.file) {
      const uploadRes = await uploadStream(req.file.buffer);
      updateData.pfp = uploadRes.secure_url;
    }

    const updatedOrg = await Organization.findByIdAndUpdate(req.params.id, updateData, { returnDocument: 'after' });
    if (!updatedOrg) {
      return res.status(404).json({ message: "Organization not found" });
    }
    res.json(updatedOrg);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ===== DELETE ORGANIZATION ROUTE =====
exports.deleteOrganization = async (req, res) => {
  try {
    const deletedOrg = await Organization.findByIdAndDelete(req.params.id);
    if (!deletedOrg) {
      return res.status(404).json({ message: "Organization not found" });
    }

    await OrgOfficer.deleteMany({ org_id: req.params.id });

    res.json({ message: "Organization deleted successfully", deletedOrg });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};