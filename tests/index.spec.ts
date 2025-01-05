import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Module } from '../src/index';

describe('Module', () => {
    let mock : InstanceType<typeof MockAdapter>;
    const module = new Module('https://example.com', 'content-key');

    beforeEach(() => {
        mock = new MockAdapter(axios);
    });

    afterEach(() => {
        mock.reset();
    });

    test('module constroctor\'s DOMAIN is not empty', async () => {
        expect(() => new Module('', 'content-key')).toThrowError('Domain is not provided or is empty.')
    });

    test('module constroctor\'s CERTIFICATE_KEY is not empty', async () => {
        expect(() => new Module('https://example.com', '')).toThrowError('CERTIFICATE_KEY is not provided or is empty.')
    });

});