import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { FlowModule } from '../src/index';

describe('FlowModule', () => {
    let mock : InstanceType<typeof MockAdapter>;
    const flowModule = new FlowModule('https://example.com/api', 'content-key');

    beforeEach(() => {
        mock = new MockAdapter(axios);
    });

    afterEach(() => {
        mock.reset();
    });

    test('should send notifications successfully when RSLT_CD is 0000', async () => {
        mock.onPost('https://example.com/api/OpenGate').reply(200, {
            RSLT_CD: '0000',
            RSLT_MSG: '전송 성공',
        });

        const result = await flowModule.sendBotNotifications('BOT123', 'user1', 'Hello!');
        expect(mock.history.post.length).toBe(1); // API 호출 여부 확인
        expect(result.success).toBe(true);
        expect(result.code).toBe(200);
        // console.log(result); // 전달된 응답 확인
        // console.log(mock.history.post);
    });

    test('should return an error response when BOT_ID is empty', async () => {
        mock.onPost('https://example.com/api/OpenGate').reply(200, {
            RSLT_CD: '0000',
            RSLT_MSG: '전송 성공',
        });

        const result = await flowModule.sendBotNotifications('', 'user1', 'Hello!');
        expect(mock.history.post.length).toBe(0); // API 호출 여부 확인
        expect(result.success).toBe(false);
        expect(result.code).toBe(400);
        // console.log(result); // 전달된 응답 확인
    });

    // test('should send notifications successfully when RSLT_CD is 0000', async () => {
    //     mock.onPost('https://example.com/api/OpenGate').reply(200, {
    //         RSLT_CD: '0000',
    //         RSLT_MSG: '전송 성공',
    //     });
    //
    //     const result = await flowModule.sendBotNotifications(null, 'user1', 'Hello!', 'content-key');
    //     expect(mock.history.post.length).toBe(0); // API 호출 여부 확인
    //     console.log(result); // 전달된 응답 확인
    // });

    test('should return an error response when RCVR_USER_ID is empty', async () => {
        mock.onPost('https://example.com/api/OpenGate').reply(200, {
            RSLT_CD: '0000',
            RSLT_MSG: '전송 성공',
        });

        const result = await flowModule.sendBotNotifications('BOT123', '', 'Hello!');
        expect(mock.history.post.length).toBe(0); // API 호출 여부 확인
        // console.log(result); // 전달된 응답 확인
        expect(result.success).toBe(false);
        expect(result.code).toBe(400);
    });

    // test('should send notifications successfully when RSLT_CD is 0000', async () => {
    //     mock.onPost('https://example.com/api/OpenGate').reply(200, {
    //         RSLT_CD: '0000',
    //         RSLT_MSG: '전송 성공',
    //     });
    //
    //     const result = await flowModule.sendBotNotifications('BOT123', null, 'Hello!', 'content-key');
    //     expect(mock.history.post.length).toBe(0); // API 호출 여부 확인
    //     console.log(result); // 전달된 응답 확인
    // });

    // test('should send notifications successfully when RSLT_CD is 0000', async () => {
    //     mock.onPost('https://example.com/api/OpenGate').reply(200, {
    //         RSLT_CD: '0000',
    //         RSLT_MSG: '전송 성공',
    //     });
    //
    //     const result = await flowModule.sendBotNotifications('BOT123', null, 'Hello!', 'content-key');
    //     expect(mock.history.post.length).toBe(0); // API 호출 여부 확인
    //     console.log(result); // 전달된 응답 확인
    // });

    test('should send notifications successfully when CNTN is empty', async () => {
        mock.onPost('https://example.com/api/OpenGate').reply(200, {
            RSLT_CD: '0000',
            RSLT_MSG: '전송 성공',
        });

        const result = await flowModule.sendBotNotifications('BOT123', 'user1', '');
        expect(mock.history.post.length).toBe(1); // API 호출 여부 확인
        // console.log(result); // 전달된 응답 확인
        expect(result.success).toBe(true);
        expect(result.code).toBe(200);
    });

    // test('should send notifications successfully when RSLT_CD is 0000', async () => {
    //     mock.onPost('https://example.com/api/OpenGate').reply(200, {
    //         RSLT_CD: '0000',
    //         RSLT_MSG: '전송 성공',
    //     });
    //
    //     const result = await flowModule.sendBotNotifications('BOT123', 'user1', null, 'content-key');
    //     expect(mock.history.post.length).toBe(1); // API 호출 여부 확인
    //     console.log(result); // 전달된 응답 확인
    // });

    // test('should send notifications successfully when RSLT_CD is 0000', async () => {
    //     mock.onPost('https://example.com/api/OpenGate').reply(200, {
    //         RSLT_CD: '0000',
    //         RSLT_MSG: '전송 성공',
    //     });
    //
    //     const result = await flowModule.sendBotNotifications('BOT123', 'user1', 'Hello!', null);
    //     expect(mock.history.post.length).toBe(0); // API 호출 여부 확인
    //     console.log(result); // 전달된 응답 확인
    // });

    test('should return an error response when RSLT_CD is not 0000', async () => {
        mock.onPost('https://example.com/api/OpenGate').reply(200, {
            RSLT_CD: '9999',
            RSLT_MSG: '에러 발생',
        });

        const result = await flowModule.sendBotNotifications('BOT123', 'user1', 'Hello!');
        expect(mock.history.post.length).toBe(1); // API 호출 여부 확인
        // console.log(result); // 전달된 응답 확인
        expect(result.success).toBe(false);
        expect(result.code).toBe(404);
    });

    test('should handle network errors gracefully', async () => {
        mock.onPost('https://example.com/api/OpenGate').networkError();

        try {
            const result = await flowModule.sendBotNotifications('BOT123', 'user1', 'Hello!');
            expect(mock.history.post.length).toBe(1); // API 호출 여부 확인
            // console.log(result); // 전달된 응답 확인
        } catch (error: any) {
            expect(error.response.success).toBe(false);
            expect(error.response.code).toBe(500);
            expect(error.response.error.code).toBe('Server Error');
        }
    });

    test('flowModule constroctor\'s domain is not empty', async () => {
        expect(() => new FlowModule('', 'content-key')).toThrowError('Domain is not provided or is empty.')
    });

    test('flowModule constroctor\'s CNTS_CRTC_KEY is not empty', async () => {
        expect(() => new FlowModule('https://example.com/api', '')).toThrowError('CNTS_CRTC_KEY is not provided or is empty.')
    });

});