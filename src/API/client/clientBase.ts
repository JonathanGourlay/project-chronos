export class ClientBase {
    private sessionToken?: string;
    private clientAccess?: string;

    public setToken(token: string): void {
        this.sessionToken = token;
    }

    public setClientAccess(clientAccess: string): void {
        this.clientAccess = clientAccess;
    }

    public clearToken(): void {
        this.sessionToken = undefined;
    }

    protected transformOptions(opts: RequestInit): Promise<RequestInit> {
        return Promise.resolve(opts);
    }

    protected transformResult<T>(
        url: string,
        response: Response,
        processor: (resp: Response) => Promise<T>,
    ): Promise<T> {
        const result = processor(response);
        return new Promise((res, rej) => {
            return result
                .then(data => {
                    return res(data);
                })
                .catch(err => {
                    return rej(err);
                });
        });
    }
}

export default ClientBase;