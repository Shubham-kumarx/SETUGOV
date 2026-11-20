export const landRecords = {
  async getProperty(reference) {
    return { propertyReference: reference, owner: 'Demo Citizen', district: 'Pune', landUse: 'Residential', verified: true };
  },
  async verifyProperty(reference) {
    return { propertyReference: reference, verified: true, source: 'Revenue & Land Records mock API' };
  }
};
