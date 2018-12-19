const { handle, getAuthHeader } = require('./apiGatewayHelper');
const expect = require('chai').expect;
const { UnauthorizedError, NotFoundError } = require('ef-cms-shared/src/errors/errors');

const EXPECTED_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
};

describe('handle', () => {
  it ('should return an object representing an 200 status back if the callback funtion executes successfully', async () => {
    const response = await handle(async () => 'success')
    expect(response).to.deep.equal({
      statusCode: '200',
      body: JSON.stringify('success'),
      headers: EXPECTED_HEADERS,
    });
  });

  it ('should return an object representing an 404 status if the function returns a NotFoundError', async () => {
    const response = await handle(async () => {
      throw new NotFoundError('an error');
    });
    expect(response).to.deep.equal({
      statusCode: 404,
      body: JSON.stringify('an error'),
      headers: EXPECTED_HEADERS,
    });
  })


  it ('should return an object representing an 404 status if the function returns a NotFoundError', async () => {
    const response = await handle(async () => {
      throw new UnauthorizedError('an error');
    });
    expect(response).to.deep.equal({
      statusCode: 403,
      body: JSON.stringify('an error'),
      headers: EXPECTED_HEADERS,
    });
  })

  it ('should return an object representing an 404 status if the function returns a NotFoundError', async () => {
    const response = await handle(async () => {
      throw new Error('an error');
    });
    expect(response).to.deep.equal({
      statusCode: '400',
      body: JSON.stringify('an error'),
      headers: EXPECTED_HEADERS,
    });
  })
})



describe('getAuthHeader', () => {
  it('should return the user token from the authorization header', () => {
    const response = getAuthHeader({
      headers: {
        Authorization: 'Bearer taxpayer',
      }
    })
    expect(response).to.deep.equal('taxpayer');
  })

  it('should return the user token from the authorization header (lowercase a in authorization)', () => {
    const response = getAuthHeader({
      headers: {
        authorization: 'Bearer taxpayer',
      }
    })
    expect(response).to.deep.equal('taxpayer');
  })

  it('should return the user token from the Authorization header', () => {
    let error;
    try {
      getAuthHeader({
        headers: {}
      })
    } catch (err) {
      error = err;
    }
    expect(error).to.not.be.undefined;
  })

  it('should return the user token from the Authorization header', () => {
    let error;
    try {
      getAuthHeader({
        headers: {
          Authorization: 'bearer '
        }
      })
    } catch (err) {
      error = err;
    }
    expect(error).to.not.be.undefined;
  })
})