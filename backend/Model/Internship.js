import mongoose from 'mongoose';

const InternshipSchema=new mongoose.Schema({
    title: String,
    company: String,
    location: String,
    category: String,
    aboutCompany: String,
    aboutInternship: String,
    whoCanApply: String,
    perks: String,
    numberOfOpenings: String,
    stipend: String,
    startdate: String,
    additionalnfo: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
});
export default mongoose.model('Internship',InternshipSchema);