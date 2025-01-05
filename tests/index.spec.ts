import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Module } from '../src/index';

describe('FlowModule', () => {
    let mock : InstanceType<typeof MockAdapter>;
    const flowModule = new Module('https://example.com/api', 'content-key');

    beforeEach(() => {
        mock = new MockAdapter(axios);
    });

    afterEach(() => {
        mock.reset();
    });

    test('flowModule constroctor\'s domain is not empty', async () => {
        expect(() => new Module('', 'content-key')).toThrowError('Domain is not provided or is empty.')
    });

    test('flowModule constroctor\'s CNTS_CRTC_KEY is not empty', async () => {
        expect(() => new Module('https://example.com/api', '')).toThrowError('CNTS_CRTC_KEY is not provided or is empty.')
    });

});