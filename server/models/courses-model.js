import mongoose from 'mongoose';

const coursesSchema = new mongoose.Schema(
    {
        abb: {
            type: String,
            required: true
        },
        name: String,
        description: String,
        unit: {
            type: Number,
            required: true
        },
        teacher: {
            required: true,
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    {
        toObject: {
            virtuals: true
        },
        toJSON: {
            virtuals: true
        }
    });



coursesSchema.index({ '$**': 'text' });


const Course = mongoose.model('Course', coursesSchema);

export default Course;