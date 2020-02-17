import mongoose from 'mongoose';

const deliberationsSchema = new mongoose.Schema(
    {
        unit1: {
            type: Number,
            required: true
        },
        unit2: {
            type: Number,
            required: true
        },
        unit3: {
            type: Number,
            required: true
        },
        student: {
            required: true,
            unique: true,
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
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

deliberationsSchema.index({ '$**': 'text' });

const Deliberation = mongoose.model('Deliberation', deliberationsSchema);

export default Deliberation;