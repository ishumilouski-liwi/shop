import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';
import fs from 'fs';
import path from 'path';
import { parseImportedFile } from './handler';
import { mockS3Event } from './__mocks__/events';

describe('parseImportedFile', () => {
    const s3ClientMock = mockClient(S3Client);

    beforeEach(() => {
        s3ClientMock.reset();
    });

    it('parses csv file', (done) => {
        console.log = jest.fn();

        s3ClientMock.on(GetObjectCommand).resolves({
            Body: fs.createReadStream(path.join(__dirname, '__mocks__', 'products.csv')) as any
        });

        parseImportedFile(mockS3Event());

        setTimeout(() => {
            expect(console.log).toBeCalledTimes(3);
            done();
        }, 300)
    })
})