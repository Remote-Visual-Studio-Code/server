/* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars,prefer-promise-reject-errors */
function makeRequest(method: string, url: string): Promise<any> {
    return new Promise((resolve, reject) => {
        const req = new XMLHttpRequest(); // eslint-disable-line no-undef
        try {
            req.open(method, `${url}`);
            req.send();
        } catch (err) {
            reject({
                status: 500,
                data: {
                    success: false,
                    message: err,
                },
            });
        }

        req.onload = (): void => {
            if (req.status === 200) {
                const json = JSON.parse(req.responseText);

                const obj = {
                    status: 200,
                    data: json,
                };

                resolve(obj);
            } else {
                const error = req.statusText;
                const { status } = req;

                const obj = {
                    status: status,
                    data: {
                        success: false,
                        message: error,
                    },
                };

                resolve(obj);
            }
        };
    });
}

class Session {
    public sid: string;
    public password: string;
    public url: string;

    constructor(sid: string, password: string, url: string) {
        this.sid = sid;
        this.password = password;
        this.url = url;
    }
}

async function getSession(
    sid: string,
    password: string,
): Promise<Session | null> {
    let response: any;

    try {
        response = await makeRequest(
            'GET',
            `http://localhost:8000/api/session/valid?sid=${sid}&password=${encodeURIComponent(
                password,
            )}`,
        );
    } catch (err) {
        console.log(err);
        return null;
    }

    if (!response) return null;

    const { message } = response.data;
    const valid = message === 'Valid session';

    try {
        response = await makeRequest(
            'GET',
            `http://localhost:8000/api/session/url?sid=${sid}&password=${encodeURIComponent(
                password,
            )}`,
        );
    } catch (err) {
        console.log(err);
        return null;
    }

    if (!response) return null;

    const { url } = response.data;
    if (!url) return null;

    return new Session(sid, password, url);
}

class SessionHandler {
    public session: Session;

    constructor(session: Session) {
        this.session = session;
    }

    public async getFile(file: string): Promise<string> {
        const response: any = await makeRequest(
            'GET',
            `${this.session.url}/files/system?file=${file}`,
        );

        if (response.status !== 200) throw new Error(response.data.message);

        return response.data.content;
    }

    static async from(
        sid: string,
        password: string,
    ): Promise<SessionHandler | null> {
        const session = await getSession(sid, password);

        if (!session || session === null) return null;

        return new SessionHandler(session);
    }
}
