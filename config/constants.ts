export const TAX_CONSTANTS = {
  2026: {
    // Common rates (as fractions)
    TAX_RATE_A: 0.2, // Model A income tax
    TAX_RATE_B: 0.1, // Model B income tax
    PIO_RATE: 0.24, // Pension & Disability
    HEALTH_RATE: 0.103, // Health insurance

    // Model A (Opcija 1) - Fixed deduction
    MODEL_A_FIXED_QUARTER: 110_647,

    // Model B (Opcija 2) - Fixed + percentage
    MODEL_B_FIXED_PART: 66_733,
    MODEL_B_PERCENT: 0.34,

    // PIO Minimum (Model B only)
    MODEL_B_PIO_MIN_QUARTER: 36_934,

    // Health Minimum (if uncovered)
    HEALTH_MIN_QUARTER: 7_003,

    // Lowest monthly base
    LOWEST_MONTHLY_BASE: 51_297,

    // Quarterly multiplier
    QUARTER_MONTHS: 3,
  },
};
