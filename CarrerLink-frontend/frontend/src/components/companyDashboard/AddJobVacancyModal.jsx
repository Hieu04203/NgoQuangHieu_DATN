import React, { useState } from "react";
import "../../styles/Modal.css";

const AddJobVacancyModal = ({ isOpen, onClose }) => {
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [location, setLocation] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [salary, setSalary] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [applicationDeadline, setApplicationDeadline] = useState("");

  const handleSaveJob = () => {
    const jobDetails = {
      jobTitle,
      companyName,
      location,
      employmentType,
      salary,
      description,
      requirements,
      applicationDeadline,
    };
    console.log("Saving job vacancy:", jobDetails);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          X
        </button>
        <div className="modal-form">
          <h2>Thêm việc làm</h2>
          <input
            type="text"
            placeholder="Tên công việc"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Tên công ty"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Vị trí"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <input
            type="text"
            placeholder="Loại việc làm"
            value={employmentType}
            onChange={(e) => setEmploymentType(e.target.value)}
          />
          <input
            type="text"
            placeholder="Lương"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
          />
          <textarea
            placeholder="Mô tả công việc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <textarea
            placeholder="Yêu cầu"
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
          />
          <input
            type="date"
            value={applicationDeadline}
            onChange={(e) => setApplicationDeadline(e.target.value)}
          />
          <button className="submit-btn" onClick={handleSaveJob}>
          Lưu công việc
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddJobVacancyModal;
