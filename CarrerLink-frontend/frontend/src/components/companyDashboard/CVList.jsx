import React from "react";

const CVList = ({ applicants, onDateChange }) => {
  return (
    <div className="cv-list-section">
      <h3 className="section-title">CV List</h3>
      <div className="cv-list-container">
        <h3 className="cv-list-title">Applicants</h3>
        <div className="applicants-container">
          {applicants.map((applicant, index) => (
            <div key={index} className="applicant-card">
              <p className="applicant-name">
                <strong>{applicant.name}</strong>
              </p>
              <p className="applicant-position">
              Chức vụ: {applicant.position}
              </p>
              <button className="view-cv-button">Xem CV</button>
              <div className="interview-date">
                <label htmlFor={`interview-date-${index}`}>
                Ngày phỏng vấn:
                </label>
                <input
                  id={`interview-date-${index}`}
                  type="date"
                  value={applicant.interviewDate}
                  onChange={(e) => onDateChange(index, e.target.value)}
                  className="date-input"
                />
              </div>
              <button className="approve-button">Đồng ý</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CVList;
