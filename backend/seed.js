const mongoose = require('mongoose');
require('dotenv').config();
const Candidate = require('./models/Candidate');

const seedCandidates = [
    { name: 'Sarah Johnson', email: 'sarah.johnson@gmail.com', phone: '9876543210', jobTitle: 'Frontend Developer', status: 'Pending', resumeUrl: null },
    { name: 'Michael Chen', email: 'michael.chen@outlook.com', phone: '8765432109', jobTitle: 'Backend Developer', status: 'Reviewed', resumeUrl: null },
    { name: 'Emily Rodriguez', email: 'emily.rodriguez@yahoo.com', phone: '7654321098', jobTitle: 'Full Stack Developer', status: 'Hired', resumeUrl: null },
    { name: 'David Kumar', email: 'david.kumar@techcorp.com', phone: '6543210987', jobTitle: 'DevOps Engineer', status: 'Pending', resumeUrl: null },
    { name: 'Priya Sharma', email: 'priya.sharma@infosys.com', phone: '5432109876', jobTitle: 'UI/UX Designer', status: 'Reviewed', resumeUrl: null },
    { name: 'James Wilson', email: 'james.wilson@amazon.com', phone: '4321098765', jobTitle: 'Cloud Architect', status: 'Pending', resumeUrl: null },
    { name: 'Ananya Patel', email: 'ananya.patel@tcs.com', phone: '3210987654', jobTitle: 'Data Scientist', status: 'Hired', resumeUrl: null },
    { name: 'Robert Brown', email: 'robert.brown@microsoft.com', phone: '2109876543', jobTitle: 'Software Engineer', status: 'Reviewed', resumeUrl: null },
    { name: 'Neha Gupta', email: 'neha.gupta@wipro.com', phone: '1098765432', jobTitle: 'QA Engineer', status: 'Pending', resumeUrl: null },
    { name: 'Alex Thompson', email: 'alex.thompson@google.com', phone: '9988776655', jobTitle: 'Product Manager', status: 'Hired', resumeUrl: null }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        await Candidate.deleteMany({});
        console.log('Cleared existing candidates');

        const result = await Candidate.insertMany(seedCandidates);
        console.log('Successfully seeded ' + result.length + ' candidates');

        result.forEach((candidate, index) => {
            console.log('  ' + (index + 1) + '. ' + candidate.name + ' - ' + candidate.jobTitle);
        });

        console.log('Database seeding completed!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database: ' + error.message);
        process.exit(1);
    }
};

seedDatabase();
