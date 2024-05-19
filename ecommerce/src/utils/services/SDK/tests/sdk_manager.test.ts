import { CustomerSignInResult, MyCustomerDraft, MyCustomerSignin } from '@commercetools/platform-sdk';
import { ClientResponse, HttpErrorType } from '@commercetools/sdk-client-v2';
import { SDKManager } from '../sdk_manager';
import { SERVER_ERROR_MSG } from '@/utils/types_variables/variables';

const mockExecute = jest.fn<Promise<ClientResponse<CustomerSignInResult>>, []>();
const mockPost = jest.fn().mockReturnValue({ execute: mockExecute });
const mockSignup = jest.fn().mockReturnValue({ post: mockPost });
const mockLogin = jest.fn().mockReturnValue({ post: mockPost });

const mockMe: () => {
  signup: () => {
    post: (methodArgs: { body: MyCustomerDraft }) => { execute: () => Promise<ClientResponse<CustomerSignInResult>> };
  };
  login: () => {
    post: (methodArgs: { body: MyCustomerSignin }) => { execute: () => Promise<ClientResponse<CustomerSignInResult>> };
  };
} = jest.fn().mockReturnValue({ signup: mockSignup, login: mockLogin });

let apiRoot = {
  me: mockMe,
};

const mockCreatePasswordClient: (email: string, password: string) => { me: typeof mockMe } = jest
  .fn()
  .mockReturnValue(apiRoot);
const mockClientMaker = {
  createPasswordClient: mockCreatePasswordClient,
};

const isEmailExist: (email: string) => Promise<string> = jest.fn();

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
      async login(data: MyCustomerSignin) {
        const errorMessage = await isEmailExist(data.email);
        if (errorMessage.length === 0) {
          try {
            await apiRoot.me().login().post({ body: data }).execute();
            apiRoot = mockClientMaker.createPasswordClient(data.email, data.password);
          } catch (err) {
            const error = err as HttpErrorType;
            if (error.statusCode === 400) {
              return SERVER_ERROR_MSG.password;
            }
          }
        }
        return errorMessage;
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
    expect(mockCreatePasswordClient).not.toHaveBeenCalled();
  });

  test('login should return an empty string in case of no error', async () => {
    (isEmailExist as jest.Mock).mockResolvedValue('');
    mockExecute.mockResolvedValueOnce({});

    const userData: MyCustomerSignin = {
      email: 'test@example.com',
      password: 'password123',
    };

    const result = await sdkManager.login(userData);

    expect(result).toBe('');
    expect(mockMe).toHaveBeenCalled();
    expect(mockLogin).toHaveBeenCalled();
    expect(mockPost).toHaveBeenCalledWith({ body: userData });
    expect(mockExecute).toHaveBeenCalled();
    expect(mockCreatePasswordClient).toHaveBeenCalledWith(userData.email, userData.password);
  });

  test('login should return "Incorrect password" in case of 400 error', async () => {
    (isEmailExist as jest.Mock).mockResolvedValue('');
    mockExecute.mockRejectedValue({ statusCode: 400 } as HttpErrorType);

    const userData: MyCustomerSignin = {
      email: 'test@example.com',
      password: 'password123',
    };

    const result = await sdkManager.login(userData);

    expect(result).toBe(SERVER_ERROR_MSG.password);
    expect(mockMe).toHaveBeenCalled();
    expect(mockLogin).toHaveBeenCalled();
    expect(mockPost).toHaveBeenCalledWith({ body: userData });
    expect(mockExecute).toHaveBeenCalled();
    expect(mockCreatePasswordClient).not.toHaveBeenCalled();
  });

  test('login should return "This email address has not been registered" in case of empty results in the isEmailExist method', async () => {
    (isEmailExist as jest.Mock).mockResolvedValue(SERVER_ERROR_MSG.email);
    mockExecute.mockRejectedValue({});

    const userData: MyCustomerSignin = {
      email: 'test@example.com',
      password: 'password123',
    };

    const result = await sdkManager.login(userData);

    expect(result).toBe(SERVER_ERROR_MSG.email);
    expect(mockMe).not.toHaveBeenCalled();
    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockPost).not.toHaveBeenCalledWith({ body: userData });
    expect(mockExecute).not.toHaveBeenCalled();
    expect(mockCreatePasswordClient).not.toHaveBeenCalled();
  });
});
