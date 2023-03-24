export async function POST(request) {
  const body = await request.json();
  const personal_code = body.personal_code;
  const loan_amount = body.loan_amount;
  const loan_period = body.loan_period;

  let debt = false;
  let credit_modifier = 0;

  // determening the credit modifier based on the personal code.
  switch (personal_code) {
    case "49002010965":
      debt = true;
      break;
    case "49002010976":
      credit_modifier = 100;
      break;
    case "49002010987":
      credit_modifier = 300;
      break;
    default:
      credit_modifier = 1000;
  }

  // If person has debt then we don't approve any loan.
  if (debt) {
    return new Response(
      JSON.stringify("You have debt we don't approve any loan.")
    );
  } else {
    let opt_loan_amount = optimal_amount(
      credit_modifier,
      loan_amount,
      loan_period
    );
    if (opt_loan_amount != 0) {
      return new Response(
        JSON.stringify(
          "Loan amount approved: " +
            opt_loan_amount +
            ", Loan period approved: " +
            loan_period
        )
      );
    } else {
      let opt_loan_period = optimal_period(
        credit_modifier,
        loan_amount,
        loan_period
      );
      if (opt_loan_period != 0) {
        return new Response(
          JSON.stringify(
            "Loan amount approved: " +
              loan_amount +
              ", Loan period approved: " +
              opt_loan_period
          )
        );
      } else {
        return new Response(JSON.stringify("Try new loan amount and period"));
      }
    }
  }
}

// Function to calculate persons credit score.
function calculate_score(amount, period, modifier) {
  return (modifier / amount) * period;
}

// Function to find the optimal loan amount that we would approve.
function optimal_amount(modifier, amount, period) {
  let opt_amount = 0;
  // finding the biggest possible loan amount we would approve.
  // requested loan amount is apporoved but we need to fint the biggest possible amount.
  if (calculate_score(amount, period, modifier) >= 1) {
    for (let i = amount; i <= 10000; i++) {
      if (i === 10000) {
        return calculate_score(i, period, modifier) >= 1 ? i : opt_amount;
      } else if (calculate_score(i, period, modifier) >= 1) {
        opt_amount = i;
        continue;
      } else {
        return opt_amount;
      }
    }
  }
  // requested loan amount is not approved so we try to find a suitable amount.
  else {
    for (let i = amount; i >= 2000; i--) {
      if (calculate_score(i, period, modifier) >= 1) {
        opt_amount = i;
        return opt_amount;
      }
    }
  }
  return opt_amount;
}

// Function to find a new loan period if we could't approve previous loan period with a loan amount.
function optimal_period(modifier, amount, period) {
  let opt_period = 0;
  for (let i = period; i <= 60; i++) {
    if (calculate_score(amount, i, modifier) >= 1) {
      opt_period = i;
      return opt_period;
    }
  }
  return opt_period;
}
