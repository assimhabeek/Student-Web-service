import mongoose from 'mongoose';


const ids = {
    students: {
        first: new mongoose.Types.ObjectId(),
        second: new mongoose.Types.ObjectId(),
        thired: new mongoose.Types.ObjectId(),
        fourth: new mongoose.Types.ObjectId()
    },
    teachers: {
        first: new mongoose.Types.ObjectId(),
        second: new mongoose.Types.ObjectId()
    },
    admins: {
        first: new mongoose.Types.ObjectId(),
        second: new mongoose.Types.ObjectId(),
        thired: new mongoose.Types.ObjectId(),
        fourth: new mongoose.Types.ObjectId(),
        fifth: new mongoose.Types.ObjectId(),
    },
    courses: {
        first: new mongoose.Types.ObjectId(),
        second: new mongoose.Types.ObjectId(),
        thired: new mongoose.Types.ObjectId(),
        fourth: new mongoose.Types.ObjectId()
    },
    deliberations: {
        first: new mongoose.Types.ObjectId(),
        second: new mongoose.Types.ObjectId(),
        thired: new mongoose.Types.ObjectId(),
        fourth: new mongoose.Types.ObjectId()
    },
    marks: {
        first: new mongoose.Types.ObjectId(),
        second: new mongoose.Types.ObjectId(),
        thired: new mongoose.Types.ObjectId(),
        fourth: new mongoose.Types.ObjectId()
    }
}

export default ids;