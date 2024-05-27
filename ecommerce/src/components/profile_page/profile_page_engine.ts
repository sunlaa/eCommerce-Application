import { sdk } from '@/utils/services/SDK/sdk_manager';

export default class ProfileEngine {
  async getCustomerData() {
    const data = await sdk.getCustomerData();

    if (data) return data;
  }
}
