import { CustomerSignInResult, MyCustomerDraft } from '@commercetools/platform-sdk';
import { ClientResponse, HttpErrorType } from '@commercetools/sdk-client-v2';
import { SDKManager } from '../sdk_manager';

const mockExecute = jest.fn<Promise<ClientResponse<CustomerSignInResult>>, []>();
const mockPost = jest.fn().mockReturnValue({ execute: mockExecute });
const mockSignup = jest.fn().mockReturnValue({ post: mockPost });
const mockMe: () => {
  signup: () => {
    post: (methodArgs: { body: MyCustomerDraft }) => { execute: () => Promise<ClientResponse<CustomerSignInResult>> };
  };
} = jest.fn().mockReturnValue({ signup: mockSignup });
let apiRoot = {
  me: mockMe,
};

const mockCreatePasswordClient: (email: string, password: string) => { me: typeof mockMe } = jest
  .fn()
  .mockReturnValue(apiRoot);
const mockClientMaker = {
  createPasswordClient: mockCreatePasswordClient,
};

jest.mock('../sdk_manager', () => {
  return {
    SDKManager: jest.fn().mockImplementation(() => ({
      async signup(data: MyCustomerDraft) {
        try {
          await apiRoot.me().signup().post({ body: data }).execute();
          apiRoot = mockClientMaker.createPasswordClient(data.email, data.password);
          return '';
        } catch (err) {
          const error = err as HttpErrorType;
          return error.message;
        }
      },
    })),
  };
});

describe('SDKManager', () => {
  let sdkManager: SDKManager;

  beforeEach(() => {
    sdkManager = new SDKManager();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  test('signup should return an empty string in case of no error', async () => {
    mockExecute.mockResolvedValueOnce({});

    const userData: MyCustomerDraft = {
      email: 'test@example.com',
      password: 'password123',
    };

    const result = await sdkManager.signup(userData);

    expect(result).toBe('');
    expect(mockMe).toHaveBeenCalled();
    expect(mockSignup).toHaveBeenCalled();
    expect(mockPost).toHaveBeenCalledWith({ body: userData });
    expect(mockExecute).toHaveBeenCalled();
    expect(mockCreatePasswordClient).toHaveBeenCalledWith(userData.email, userData.password);
  });

  test('signup should return error message in case of an error', async () => {
    const errorMessage = 'Some error occurred';
    const error = new Error(errorMessage) as HttpErrorType;
    mockExecute.mockRejectedValueOnce(error);

    const userData: MyCustomerDraft = {
      email: 'test@example.com',
      password: 'password123',
    };

    const result = await sdkManager.signup(userData);

    expect(result).toBe(errorMessage);
    expect(mockMe).toHaveBeenCalled();
    expect(mockSignup).toHaveBeenCalled();
    expect(mockPost).toHaveBeenCalledWith({ body: userData });
    expect(mockExecute).toHaveBeenCalled();
  });
});
