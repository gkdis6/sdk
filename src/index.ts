import axios, { AxiosResponse } from 'axios';

interface BotNotiReqData {
    BOT_ID: string;
    RCVR_USER_ID: string;
    CNTN: string;
}

interface InputData {
    JSONData: {
        API_KEY: string;
        CNTS_CRTC_KEY: string;
        REQ_DATA: BotNotiReqData;
    };
}

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

export interface FlowModuleInterface {
    sendBotNotifications(BOT_ID: string, RCVR_USER_ID: string, CNTN: string, CNTS_CRTC_KEY: string): Promise<ApiResponse>;
}

export class FlowModule implements FlowModuleInterface {
    private DOMAIN: string;
    private CNTS_CRTC_KEY: string;

    constructor(DOMAIN: string, CNTS_CRTC_KEY: string) {
        if (!DOMAIN || DOMAIN.length === 0) {
            throw new Error('Domain is not provided or is empty.');
        }
        if (!CNTS_CRTC_KEY || CNTS_CRTC_KEY.length === 0) {
            throw new Error('CNTS_CRTC_KEY is not provided or is empty.');
        }
        this.DOMAIN = DOMAIN;
        this.CNTS_CRTC_KEY = CNTS_CRTC_KEY;
    }

    public async sendBotNotifications(BOT_ID: string, RCVR_USER_ID: string, CNTN: string = ''): Promise<ApiResponse> {
        if (!RCVR_USER_ID || RCVR_USER_ID.length === 0) {
            return {
                success: false,
                code: 400,
                message: 'RCVR_USER_ID is No provided',
                error: {
                    code: 'Bad Request',
                    message: 'The RCVR_USER_ID is empty.',
                },
            };
        }
        if (!BOT_ID || BOT_ID.length === 0) {
            return {
                success: false,
                code: 400,
                message: 'BOT_ID is No provided',
                error: {
                    code: 'Bad Request',
                    message: 'The BOT_ID is empty or null.',
                },
            };
        }
        const inputData: InputData = {
            JSONData: {
                API_KEY: 'FLOW_BOT_NOTI_API',
                CNTS_CRTC_KEY: this.CNTS_CRTC_KEY,
                REQ_DATA: {
                    BOT_ID,
                    RCVR_USER_ID,
                    CNTN,
                },
            },
        };

        const promises = this.sendApi(inputData);
        return promises;
    }

    private async sendApi(inputData: InputData): Promise<ApiResponse> {
        try {
            const response: AxiosResponse = await axios.post(`${this.DOMAIN}/OpenGate`, inputData, {
                headers: { 'Content-Type': 'application/json' },
                timeout: 5000,
            });

            if (response.data.RSLT_CD === '0000') {
                return {
                    success: true,
                    code: 200,
                    message: 'Success',
                    data: response.data, // 성공 시 데이터 포함
                };
            } else {
                return {
                    success: false,
                    code: 404,
                    message: 'Error',
                    error: {
                        code: 'Not Found',
                        message: response.data, // 실패 시 에러 메시지 포함
                    },
                };
            }
        } catch (error: any) {
            return {
                success: false,
                code: error.status,
                message: 'Error',
                error: {
                    code: error.name,
                    message: error.message,
                },
            };
        }
    }
}