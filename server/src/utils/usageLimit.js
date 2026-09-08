const FREE_MONTHLY_LIMIT = 100;

export const checkAndResetUsage = async (user) => {
  const now = new Date();

  // Safely determine the current usage period
  const periodStart = user.usagePeriodStart
    ? new Date(user.usagePeriodStart)
    : now;

  const sameMonth =
    now.getUTCFullYear() === periodStart.getUTCFullYear() &&
    now.getUTCMonth() === periodStart.getUTCMonth();

  // Initialize missing usage fields
  if (typeof user.monthlyAnalysisCount !== "number") {
    user.monthlyAnalysisCount = 0;
  }

  // Reset usage when a new calendar month begins
  if (!sameMonth) {
    user.monthlyAnalysisCount = 0;
    user.usagePeriodStart = now;

    await user.save();
  }

  return {
    allowed: user.monthlyAnalysisCount < FREE_MONTHLY_LIMIT,
    remaining: Math.max(
      0,
      FREE_MONTHLY_LIMIT - user.monthlyAnalysisCount
    ),
    limit: FREE_MONTHLY_LIMIT,
  };
};

export const incrementUsage = async (user) => {
  // Initialize the counter if necessary
  if (typeof user.monthlyAnalysisCount !== "number") {
    user.monthlyAnalysisCount = 0;
  }

  user.monthlyAnalysisCount += 1;

  await user.save();
};

export { FREE_MONTHLY_LIMIT };