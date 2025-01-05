import axios, { AxiosResponse } from 'axios';


interface InputData {
    API_PATH: string;
    REQ_DATA: any;
};

interface ApiResponse {
    success: boolean;
    code: number;
    message: string;
    data?: any; // 성공 시 반환되는 데이터
    error?: {
        code: string;
        message: any;
    }; // 실패 시 반환되는 에러 정보
}

class TokenManager {
    private static ACCESS_TOKEN_KEY = 'accessToken';
    private static REFRESH_TOKEN_KEY = 'refreshToken';

    // Access Token 저장
    public static setAccessToken(token: string) {
        localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
    }

    // Refresh Token 저장
    public static setRefreshToken(token: string) {
        localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
    }

    // Access Token 반환
    public static getAccessToken(): string | null {
        return localStorage.getItem(this.ACCESS_TOKEN_KEY);
    }

    // Refresh Token 반환
    public static getRefreshToken(): string | null {
        return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }

    // 토큰 제거
    public static clearTokens() {
        localStorage.removeItem(this.ACCESS_TOKEN_KEY);
        localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    }
}

async function refreshAccessToken(): Promise<string | null> {
    const refreshToken = TokenManager.getRefreshToken();
    if (!refreshToken) {
        console.error('Refresh Token is missing');
        location.replace(`${this.DOMAIN}/login`);
        return null;
    }

    try {
        const response = await axios.post(`${this.DOMAIN}/auth/refresh-token`, {
            refreshToken,
        });

        const { accessToken} = response.data;
        TokenManager.setAccessToken(accessToken); // 새 Access Token 저장
        return accessToken;
    } catch (error) {
        console.error('Failed to refresh Access Token', error);
        TokenManager.clearTokens();
        location.replace(`${this.DOMAIN}/login`);
        return null;
    }
}

export interface ModuleInterface {
    apiCall(inputJson: InputData,
            successCallback?: Function,
            errorCallback?: Function,
            finalCallback?: Function)
}

export class Module implements ModuleInterface {
    private DOMAIN: string;
    private CERTIFICATE_KEY: string;

    constructor(DOMAIN: string, CERTIFICATE_KEY: string) {
        if (!DOMAIN || DOMAIN.length === 0) {
            throw new Error('Domain is not provided or is empty.');
        }
        if (!CERTIFICATE_KEY || CERTIFICATE_KEY.length === 0) {
            throw new Error('CERTIFICATE_KEY is not provided or is empty.');
        }
        this.DOMAIN = DOMAIN;
        this.CERTIFICATE_KEY = CERTIFICATE_KEY;
    }

    public async apiCall(
        inputJson: InputData,
        successCallback?: Function,
        errorCallback?: Function,
        finalCallback?: Function
    ) {
        try {
            let accessToken = TokenManager.getAccessToken();
            if (!accessToken) {
                accessToken = await refreshAccessToken();
                if (!accessToken) return; // 갱신 실패 시 함수 종료
            }

            const headers = {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'X-Certificate-Key': this.CERTIFICATE_KEY,
            };

            //내부에서 사용하는 모듈로 상정하여 호출 방식의 일관성을 통일하기 위한 코드로 생각하고 처리
            const response = await axios.post(`${this.DOMAIN}/${inputJson.API_PATH}`, {
                "_JSON_": encodeURIComponent(JSON.stringify(inputJson)),
            }, { headers });

            successCallback(response.data);
        } catch (error: any) {
            if (error.response?.status === 401) {
                const newAccessToken = await refreshAccessToken();
                if (newAccessToken) {
                    return this.apiCall(inputJson, successCallback, errorCallback, finalCallback);
                }
            }
            errorCallback(error);
        }
    }
}