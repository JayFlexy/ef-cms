const { applicationContext } = require('../test/createTestApplicationContext');
const { saveFileAndGenerateUrl } = require('./saveFileAndGenerateUrl');

describe('saveFileAndGenerateUrl', () => {
  it('saves the file to s3 and returns the file ID and url to the file', async () => {
    const mockUUID = '12345';
    const mockPdfUrlAndId = { fileId: mockUUID, url: 'www.example.com' };
    applicationContext
      .getPersistenceGateway()
      .getDownloadPolicyUrl.mockReturnValue(mockPdfUrlAndId);
    applicationContext.getUniqueId.mockReturnValue(mockUUID);

    const result = await saveFileAndGenerateUrl({
      applicationContext,
      file: '',
    });

    expect(applicationContext.getUniqueId).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda,
    ).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().getDownloadPolicyUrl,
    ).toBeCalled();
    expect(result).toEqual(mockPdfUrlAndId);
  });
});
