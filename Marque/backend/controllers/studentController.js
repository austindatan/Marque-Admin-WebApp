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
            orgs,
            username,
            email,
            contactNumber,
            password,
        } = req.body;

        if (!studentId || !firstName || !lastName || !college || !department || !password) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        if (username || email) {
            const query = [];
            if (username) query.push({ username });
            if (email) query.push({ email });

            const existingUser = await User.findOne({ $or: query });
            if (existingUser) {
                return res.status(409).json({ message: 'Username or email already exists' });
            }
        }

        const existingStudent = await Student.findOne({ student_number: studentId });
        if (existingStudent) {
            return res.status(409).json({ message: 'Student ID already exists' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create User 
        const newUser = await User.create({
            username: username || studentId,
            password: hashedPassword,
            firstname: firstName,
            middlename: middleName || '',
            lastname: lastName,
            contact_number: contactNumber || '',
            email: email || `${studentId}@school.edu.ph`,
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

        // Create OrgOfficers 
        const orgOfficers = [];
        if (orgs && orgs.length > 0) {
            for (const item of orgs) {
                if (item.org && item.role) {
                    const created = await OrgOfficer.create({
                        student_id: newStudent._id,
                        org_id: item.org,
                        role: item.role,
                    });
                    orgOfficers.push(created);
                }
            }
        }

        res.status(201).json({
            message: 'Student added successfully',
            student: newStudent,
            user: newUser,
            orgOfficers
        });
    } catch (err) {
        console.error('Error in addStudent:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.updateStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            studentId,
            firstName,
            middleName,
            lastName,
            college,
            department,
            orgs,
            username,
            email,
            contactNumber,
            password,
        } = req.body;

        const student = await Student.findById(id);
        if (!student) return res.status(404).json({ message: 'Student not found' });

        const user = await User.findById(student.users_id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Check if new student number is already used
        if (studentId && studentId !== student.student_number) {
            const existingStudent = await Student.findOne({ student_number: studentId });
            if (existingStudent) return res.status(409).json({ message: 'Student ID already exists' });
        }

        // Check if username/email already used by someone else
        if ((username && username !== user.username) || (email && email !== user.email)) {
            const existingUser = await User.findOne({
                $or: [{ username }, { email }],
                _id: { $ne: user._id }
            });
            if (existingUser) return res.status(409).json({ message: 'Username or email already exists' });
        }

        // Update User
        user.firstname = firstName || user.firstname;
        user.middlename = middleName !== undefined ? middleName : user.middlename;
        user.lastname = lastName || user.lastname;
        user.username = username || user.username || student.student_number;
        user.email = email || user.email || `${student.student_number}@school.edu.ph`;
        user.contact_number = contactNumber || user.contact_number || '';

        if (password && password.trim() !== '') {
            const saltRounds = 10;
            const bcrypt = require('bcryptjs');
            user.password = await bcrypt.hash(password, saltRounds);
        }
        await user.save();

        // Update Student
        student.student_number = studentId || student.student_number;
        student.college_id = college || student.college_id;
        student.department_id = department || student.department_id;
        await student.save();

        // Update OrgOfficers
        if (orgs !== undefined) {
            // First, remove existing records
            await OrgOfficer.deleteMany({ student_id: student._id });
            
            // Then, insert the new ones
            for (const item of orgs) {
                if (item.org && item.role) {
                    await OrgOfficer.create({
                        student_id: student._id,
                        org_id: item.org,
                        role: item.role,
                    });
                }
            }
        }

        res.status(200).json({ message: 'Student updated successfully', student, user });
    } catch (err) {
        console.error('Error in updateStudent:', err);
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

exports.deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const student = await Student.findById(id);
        if (!student) return res.status(404).json({ message: 'Student not found' });

        // Delete associated User
        if (student.users_id) {
            await User.findByIdAndDelete(student.users_id);
        }

        // Delete associated OrgOfficers
        await OrgOfficer.deleteMany({ student_id: student._id });

        // Delete Student
        await Student.findByIdAndDelete(id);

        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (err) {
        console.error('Error in deleteStudent:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};