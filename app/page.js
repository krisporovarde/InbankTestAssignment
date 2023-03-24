"use client";
import { useState } from "react";

export default function Home() {
  const [showError, setShowError] = useState(false);
  const [result, setResult] = useState("");
  const [formData, setFormData] = useState({
    personal_code: "",
    loan_amount: "",
    loan_period: "",
  });

  const formFields = [
    {
      name: "personal_code",
      type: "number",
      value: formData.personal_code,
      placeholder: "Personal Code",
    },
    {
      name: "loan_amount",
      type: "number",
      value: formData.loan_amount,
      placeholder: "Loan Amount (€)",
    },
    {
      name: "loan_period",
      type: "number",
      value: formData.loan_period,
      placeholder: "Loan Period (month)",
    },
  ];

  const formDataHandler = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const submitForm = async () => {
    const { loan_amount, loan_period } = formData;
    if (
      loan_amount >= 2000 &&
      loan_amount <= 10000 &&
      loan_period >= 12 &&
      loan_period <= 60
    ) {
      await fetch("/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((body) => {
          setResult(body);
          setShowError(false);
        })
        .catch((err) => console.log(err));

      setFormData({
        personal_code: "",
        loan_amount: "",
        loan_period: "",
      });
    } else {
      setShowError(true);
    }
  };

  return (
    <div className="container">
      <div className="form">
        <h1 className="heading-1">Loan Request</h1>
        {formFields.map(({ name, type, value, placeholder }, index) => (
          <div key={index} className="input-wrapper">
            <input
              className="input-field"
              id={name}
              type={type}
              onChange={formDataHandler}
              name={name}
              value={value}
              placeholder={placeholder}
              required
            />
          </div>
        ))}
        <div className="btn-wrapper">
          <button className="btn" onClick={submitForm}>
            Submit
          </button>
        </div>
        <h1 className="heading-1">Response</h1>
        {showError ? (
          <p className="err-msg plain-text">
            Loan amount has to be between 2000 and 1000, Loan period has to be
            between 12 and 60
          </p>
        ) : (
          <p className="plain-text">{result}</p>
        )}
      </div>
    </div>
  );
}
