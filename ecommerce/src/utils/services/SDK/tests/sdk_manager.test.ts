import { MyCustomerDraft } from '@commercetools/platform-sdk';
import { SDKManager } from '../sdk_manager';

jest.mock('../sdk_manager');

describe('SDKManager', () => {
  test('signup should return an error message in case of an error', async () => {
    const userData: MyCustomerDraft = { email: 'example@gmail.com', password: 'Password123' };
    const errorTestMessage = 'Test Error';
    const sdk = new SDKManager();

    jest.spyOn(SDKManager.prototype, 'signup').mockResolvedValueOnce(errorTestMessage);

    const errorMessage = await sdk.signup(userData);

    expect(errorMessage).toEqual(errorTestMessage);
  });
});
