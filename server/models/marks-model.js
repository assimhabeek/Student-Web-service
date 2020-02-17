import mongoose from 'mongoose';

const marksSchema = new mongoose.Schema(
    {
        mark: {
            type: Number,
            required: true
        },
        student: {
            required: true,
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        course: {
            required: true,
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        },
        complain: String,
        isComplainHandled: {
            type: Boolean,
            default: true
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



marksSchema.index({ '$**': 'text' });
marksSchema.index({ student: 1, course: 1 }, { unique: true });

const Mark = mongoose.model('Mark', marksSchema);

export default Mark;