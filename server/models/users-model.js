import mongoose from 'mongoose';


const usersSchema = new mongoose.Schema(
    {
        
        name: {
            first: String,
            last: String
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            select: false
        },
        type: {
            type: String,
            required: true,
        },
        isResponsible: Boolean
    },
    {
        toObject: {
            virtuals: true
        },
        toJSON: {
            virtuals: true
        }
    });

usersSchema.virtual('fullName').get(function () {
    return this.name.first + ' ' + this.name.last;
});

usersSchema.index({ '$**': 'text' });

const User = mongoose.model('User', usersSchema);

export default User;