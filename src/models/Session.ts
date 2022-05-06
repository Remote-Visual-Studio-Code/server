/* eslint-disable @typescript-eslint/ban-ts-ignore */
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

type SessionDocument = mongoose.Document & {
    sid: string;
    password: string;
    url: string;
    users_connected: string[];
};

const Session = mongoose.model('Session', SessionSchema);

async function valid(session: {
    sid: string;
    password: string;
}): Promise<boolean> {
    const found = Session.findOne({
        sid: session.sid,
        password: session.password,
    });

    return found !== null && found !== undefined;
}

async function find(session: {
    sid: string;
    password: string;
}): Promise<SessionDocument | null> {
    if (!(await valid(session))) return null;

    const found = Session.findOne({
        sid: session.sid,
        password: session.password,
    });

    return found;
}

async function create(data: {
    sid: string;
    password: string;
    url: string;
}): Promise<any> {
    const options = {
        ...data,
        users_connected: [],
    };

    const session = new Session(options);

    session.save();

    return session;
}

async function remove(session: {
    sid: string;
    password: string;
}): Promise<any> {
    if (!(await valid(session))) return null;

    // @ts-ignore
    const found: SessionDocument = find(session);

    found.remove();

    return found;
}

async function addUser(
    session: { sid: string; password: string },
    user: string,
): Promise<SessionDocument | null> {
    if (!(await valid(session))) return null;

    // @ts-ignore
    const found: SessionDocument = find(session);

    found.users_connected.push(user);
    found.save();

    return found;
}

async function removeUser(
    session: { sid: string; password: string },
    user: string,
): Promise<any> {
    if (!(await valid(session))) return null;

    // @ts-ignore
    const found: SessionDocument = find(session);

    const index = found.users_connected.indexOf(user);

    found.users_connected.splice(index, 1);
    found.save();

    return found;
}

async function getUsers(session: {
    sid: string;
    password: string;
}): Promise<string[] | null> {
    if (!(await valid(session))) return null;

    // @ts-ignore
    const found: SessionDocument = find(session);

    return found.users_connected;
}

export { Session, create, remove, valid, find, addUser, removeUser, getUsers };
