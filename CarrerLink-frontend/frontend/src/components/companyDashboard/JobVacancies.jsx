import React from "react";
import JobCard from "../Cards/JobCard";

const JobVacancies = ({ jobVacancies, onAddJobClick }) => {
  return (
    <div className="job-vacancies-section">
      <div className="job-vacancies-header">
        <h2 className="job-vacancies-title">Việc làm</h2>
        <button className="add-job-button" onClick={onAddJobClick}>
        Thêm việc làm
        </button>
      </div>
      <div className="job-cards-container">
        {jobVacancies.map((job, index) => (
          <JobCard key={index} jobId={job} />
        ))}
      </div>
    </div>
  );
};

export default JobVacancies;
