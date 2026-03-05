const Student = require('../models/Student');
const College = require('../models/College');
const Department = require('../models/Department');
const Organization = require('../models/Organization');
const OrgOfficer = require('../models/Org_officer');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.addStudent = async (req, res) => {
    try {
        const {
            studentId,
            firstName,
            middleName,
            lastName,
            college,
            department,
            org, 
            role, 
            username,
            email,
            contactNumber,
            password,
        } = req.body;

        if (!studentId || !firstName || !lastName || !college || !department || !username || !email || !contactNumber || !password) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(409).json({ message: 'Username or email already exists' });
        }

        const existingStudent = await Student.findOne({ student_number: studentId });
        if (existingStudent) {
            return res.status(409).json({ message: 'Student ID already exists' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create User 
        const newUser = await User.create({
            username,
            password: hashedPassword,
            firstname: firstName,
            middlename: middleName || '',
            lastname: lastName,
            contact_number: contactNumber,
            email,
            role: 'Student',
            profile_image: ''
        });

        // Create Student 
        const newStudent = await Student.create({
            users_id: newUser._id,
            college_id: college,
            department_id: department,
            student_number: studentId,
        });

        // Create OrgOfficer 
        let orgOfficer = null;
        if (org && role) {
            orgOfficer = await OrgOfficer.create({
                student_id: newStudent._id,
                org_id: org,
                role: role,
            });
        }

        res.status(201).json({
            message: 'Student added successfully',
            student: newStudent,
            user: newUser,
            orgOfficer: orgOfficer
        });
    } catch (err) {
        console.error('Error in addStudent:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getColleges = async (req, res) => {
    try {
        const colleges = await College.find({});
        res.status(200).json(colleges);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch colleges' });
    }
};

exports.getDepartments = async (req, res) => {
    try {
        const { college_id } = req.query;
        let query = {};
        
        // filter departments by college
        if (college_id) {
            query = { college_id: college_id };
        }

        const departments = await Department.find(query).populate('college_id', 'college_name');
        res.status(200).json(departments);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch departments' });
    }
};

exports.getOrganizations = async (req, res) => {
    try {
        const orgs = await Organization.find({});
        res.status(200).json(orgs);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch organizations' });
    }
};

exports.getRoles = async (req, res) => {
    try {
        const roles = OrgOfficer.schema.path('role').enumValues;
        res.status(200).json(roles);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving roles' });
    }
};