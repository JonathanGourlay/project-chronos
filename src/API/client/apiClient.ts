import { Client } from "./client";

export enum ApiClientEventType {
    RESPONSE_FAIL_STATUS = "RESPONSE_FAIL_STATUS",
    RESPONSE_ERROR = "RESPONSE_ERROR",
    RESPONSE_SUCCESS = "RESPONSE_SUCCESS",
}

interface IApiClientOptions {
    baseUrl: string;
}

class ApiClient extends Client {
    protected headers: Map<string, any> | undefined;
    protected rootUrl: string;

    constructor(options: IApiClientOptions, http?: any) {
        super(options.baseUrl, http);

        this.rootUrl = options.baseUrl;
    }

    protected transformResult(
        url: string,
        response: Response,
        processor: (resp: Response) => Promise<any>,
    ): Promise<any> {
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

export default ApiClient;