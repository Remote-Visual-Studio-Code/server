import mongoose, { Schema } from 'mongoose';

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
    expires: {
        type: Date,
        required: true,
    },
    users_connected: [
        {
            user: {
                type: String,
                required: true,
            },
            permission: {
                type: String,
                required: true,
                validate: {
                    validator: (v: string) => {
                        return v === 'admin' || v === 'editor' || v === 'viewer';
                    },
                },
            },
        },
    ],
});

export type UserPermission = 'viewer' | 'editor' | 'admin';

export type SessionLike = mongoose.Document & {
    sid: string;
    password: string;
    expires: Date;
    users_connected: { user: string; permission: UserPermission }[];
};

export type SessionAuth = {
    sid: string;
    password: string;
};

const Session = mongoose.model<SessionLike>('Session', SessionSchema);

async function verifyAndFind(session: SessionAuth): Promise<{ session: SessionLike | null; valid: boolean }> {
    if (!(await validate(session))) return { session: null, valid: false };

    const found = await Session.findOne({ sid: session.sid, password: session.password });

    if (found === null || !found) return { session: null, valid: false };

    return { session: found, valid: true };
}

export async function validate(session: SessionAuth): Promise<boolean> {
    const found = Session.findOne({ sid: session.sid, password: session.password });

    return found !== null && found !== undefined;
}

export async function find(session: SessionAuth): Promise<SessionLike | null> {
    const valid = await verifyAndFind(session);

    if (!valid.valid) return null;

    return valid.session;
}

export async function create(session: SessionAuth & { expires: Date }): Promise<SessionLike> {
    const created = new Session(session);

    await created.save();

    return created;
}

export async function remove(session: SessionAuth): Promise<boolean> {
    if (!(await validate(session))) return false;

    await Session.deleteOne({ sid: session.sid, password: session.password });

    return true;
}

export async function add_user(
    auth: SessionAuth,
    user: { user: string; permission: UserPermission },
): Promise<boolean> {
    const { session, valid } = await verifyAndFind(auth);

    if (!valid || session === null) return false;

    session.users_connected.push(user);

    await session.save();

    return true;
}

export async function remove_user(session: SessionAuth, user: string): Promise<boolean> {
    if (!(await validate(session))) return false;

    const found = await Session.findOne({ sid: session.sid, password: session.password });

    if (found === null || !found) return false;

    found.users_connected = found.users_connected.filter((u) => u.user !== user);

    await found.save();

    return true;
}

export async function get_users(auth: SessionAuth): Promise<{ user: string; permission: UserPermission }[] | null> {
    const { session, valid } = await verifyAndFind(auth);

    if (!valid || session === null) return null;

    return session.users_connected;
}

export default Session;
