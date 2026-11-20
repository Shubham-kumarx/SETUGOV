const schemes = [
  { id: 'SW-101', name: 'Asha Family Support', benefit: '₹2,000 monthly assistance', eligibility: 'Families below the annual income threshold' },
  { id: 'SW-102', name: 'Shiksha Udaan Scholarship', benefit: 'Education support up to ₹25,000', eligibility: 'Students enrolled in an eligible institution' }
];

export const socialWelfare = {
  async getSchemes() { return schemes; },
  async checkEligibility({ income = 0 }) { return { eligible: Number(income) < 500000, reason: Number(income) < 500000 ? 'Income band matches demo criteria' : 'Income is above demo criteria' }; }
};
