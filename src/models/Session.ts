import mongoose from 'mongoose';

const { Schema } = mongoose;

const SessionSchema = new Schema({
    sid: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    users_connected: {
        type: Array,
        required: true,
        default: [],
    },
});

const Session = mongoose.model('Session', SessionSchema);

export { Session };
