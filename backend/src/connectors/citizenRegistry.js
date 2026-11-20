const citizens = {
  'CIT-1001': { registryId: 'CIT-1001', name: 'Aarav Mehta', verified: true, district: 'Bengaluru Urban' },
  'CIT-1002': { registryId: 'CIT-1002', name: 'Diya Nair', verified: true, district: 'Ernakulam' }
};

export const citizenRegistry = {
  async getCitizen(registryId) {
    return citizens[registryId] || { registryId, name: 'Demo Citizen', verified: true, district: 'Pune' };
  },
  async verifyCitizen(registryId) {
    return { registryId, verified: true, source: 'Citizen Registry mock API' };
  }
};
