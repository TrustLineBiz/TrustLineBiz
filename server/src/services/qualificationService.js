const MIN_MONTHLY_REVENUE = 20000;
const MIN_CREDIT_SCORE = 500;

function qualify(lead) {
  const revenue = parseFloat(lead.monthly_revenue) || 0;
  const credit = parseInt(lead.credit_score_exact, 10) || 0;

  if (revenue > 0 && revenue < MIN_MONTHLY_REVENUE) {
    return {
      status: 'disqualified',
      reason: `Monthly revenue $${revenue.toLocaleString()} below minimum $${MIN_MONTHLY_REVENUE.toLocaleString()}`,
    };
  }

  if (credit > 0 && credit < MIN_CREDIT_SCORE) {
    return {
      status: 'disqualified',
      reason: `Credit score ${credit} below minimum ${MIN_CREDIT_SCORE}`,
    };
  }

  if (revenue >= MIN_MONTHLY_REVENUE && credit >= MIN_CREDIT_SCORE) {
    return { status: 'qualified', reason: null };
  }

  return { status: 'pending', reason: null };
}

module.exports = { qualify };
