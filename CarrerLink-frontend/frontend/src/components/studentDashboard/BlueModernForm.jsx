import { useState } from "react";

const CvTemplate7 = ({ initialData, onUpdate }) => {
  const [formData, setFormData] = useState(
    initialData || {
      personalDetails: {
        name: "",
        email: "",
        phone: "",
        address: "",
        website: "",
        linkedin: "",
        // You can add an optional title field if desired:
        title: "",
      },
      skills: [
        {
          title: "",
          description: "",
        },
      ],
      employment: [
        {
          title: "",
          company: "",
          location: "",
          period: "",
          description: "",
          bullets: [""],
        },
      ],
      education: [
        {
          degree: "",
          institution: "",
          location: "",
          period: "",
        },
      ],
      affiliations: [
        {
          title: "",
          period: "",
        },
      ],
      certificates: [
        {
          title: "",
          date: "",
        },
      ],
    }
  );

  const handleChange = (section, field, value, index = null, subfield = null) => {
    setFormData((prev) => {
      const newData = { ...prev };

      if (index !== null) {
        if (subfield) {
          newData[section][index][field][subfield] = value;
        } else {
          newData[section][index][field] = value;
        }
      } else if (section === "personalDetails") {
        newData.personalDetails[field] = value;
      } else {
        newData[section] = value;
      }
      return newData;
    });
    onUpdate(formData);
  };

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Header with blue background */}
      <header className="bg-blue-700 text-white p-8">
        <div className="mb-4">
          <input
            type="text"
            value={formData.personalDetails.name}
            onChange={(e) =>
              handleChange("personalDetails", "name", e.target.value)
            }
            className="text-4xl font-bold bg-transparent border-b border-white/50 focus:outline-none w-full"
            placeholder="Tên của bạn"
          />
        </div>
        <div>
          <input
            type="text"
            value={formData.personalDetails.title}
            onChange={(e) =>
              handleChange("personalDetails", "title", e.target.value)
            }
            className="text-xl bg-transparent border-b border-white/50 focus:outline-none w-full"
            placeholder="Tiêu đề của bạn"
          />
        </div>
      </header>

      {/* Main Content Area split into three columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
        {/* Column 1: Personal Details & Skills */}
        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-bold text-blue-700 mb-4">
            Chi tiết cá nhân
            </h2>
            <div className="space-y-3">
              <input
                type="email"
                value={formData.personalDetails.email}
                onChange={(e) =>
                  handleChange("personalDetails", "email", e.target.value)
                }
                className="w-full p-2 border rounded"
                placeholder="Email"
              />
              <input
                type="tel"
                value={formData.personalDetails.phone}
                onChange={(e) =>
                  handleChange("personalDetails", "phone", e.target.value)
                }
                className="w-full p-2 border rounded"
                placeholder="Phone"
              />
              <input
                type="text"
                value={formData.personalDetails.address}
                onChange={(e) =>
                  handleChange("personalDetails", "address", e.target.value)
                }
                className="w-full p-2 border rounded"
                placeholder="Address"
              />
              <input
                type="url"
                value={formData.personalDetails.website}
                onChange={(e) =>
                  handleChange("personalDetails", "website", e.target.value)
                }
                className="w-full p-2 border rounded"
                placeholder="Website"
              />
              <input
                type="text"
                value={formData.personalDetails.linkedin}
                onChange={(e) =>
                  handleChange("personalDetails", "linkedin", e.target.value)
                }
                className="w-full p-2 border rounded"
                placeholder="LinkedIn"
              />
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-blue-700 mb-4">Kỹ năng</h2>
            {formData.skills.map((skill, index) => (
              <div key={index} className="mb-3">
                <input
                  type="text"
                  value={skill.title}
                  onChange={(e) =>
                    handleChange("skills", "title", e.target.value, index)
                  }
                  className="w-full p-2 border rounded mb-2"
                  placeholder="Tên kỹ năng"
                />
                <textarea
                  value={skill.description}
                  onChange={(e) =>
                    handleChange("skills", "description", e.target.value, index)
                  }
                  className="w-full p-2 border rounded"
                  placeholder="Mô tả kỹ năng"
                  rows="2"
                />
              </div>
            ))}
            <button
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  skills: [...prev.skills, { title: "", description: "" }],
                }))
              }
              className="w-full bg-gray-200 text-gray-700 p-2 rounded mt-2"
            >
              Thêm Kỹ năng
            </button>
          </section>
        </div>

        {/* Column 2: Education & Certificates */}
        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-bold text-blue-700 mb-4">Education</h2>
            {formData.education.map((edu, index) => (
              <div key={index} className="mb-4 p-4 border rounded">
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) =>
                    handleChange("education", "degree", e.target.value, index)
                  }
                  className="w-full p-2 border rounded mb-2"
                  placeholder="Bằng cấp"
                />
                <input
                  type="text"
                  value={edu.institution}
                  onChange={(e) =>
                    handleChange("education", "institution", e.target.value, index)
                  }
                  className="w-full p-2 border rounded mb-2"
                  placeholder="Trường học"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={edu.location}
                    onChange={(e) =>
                      handleChange("education", "location", e.target.value, index)
                    }
                    className="w-full p-2 border rounded"
                    placeholder="Vị trí"
                  />
                  <input
                    type="text"
                    value={edu.period}
                    onChange={(e) =>
                      handleChange("education", "period", e.target.value, index)
                    }
                    className="w-full p-2 border rounded"
                    placeholder="Giai đoạn"
                  />
                </div>
              </div>
            ))}
            <button
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  education: [
                    ...prev.education,
                    { degree: "", institution: "", location: "", period: "" },
                  ],
                }))
              }
              className="w-full bg-gray-200 text-gray-700 p-2 rounded mt-2"
            >
              Thêm Education
            </button>
          </section>

          <section>
            <h2 className="text-xl font-bold text-blue-700 mb-4">
            Giấy chứng nhận
            </h2>
            {formData.certificates.map((cert, index) => (
              <div key={index} className="mb-4 p-4 border rounded">
                <input
                  type="text"
                  value={cert.title}
                  onChange={(e) =>
                    handleChange("certificates", "title", e.target.value, index)
                  }
                  className="w-full p-2 border rounded mb-2"
                  placeholder="Tiêu đề chứng chỉ"
                />
                <input
                  type="text"
                  value={cert.date}
                  onChange={(e) =>
                    handleChange("certificates", "date", e.target.value, index)
                  }
                  className="w-full p-2 border rounded"
                  placeholder="Ngày cấp"
                />
              </div>
            ))}
            <button
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  certificates: [
                    ...prev.certificates,
                    { title: "", date: "" },
                  ],
                }))
              }
              className="w-full bg-gray-200 text-gray-700 p-2 rounded mt-2"
            >
              Thêm chứng chỉ
            </button>
          </section>
        </div>

        {/* Column 3: Employment & Affiliations */}
        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-bold text-blue-700 mb-4">
            Việc làm & Liên kết
            </h2>
            {formData.employment.map((job, index) => (
              <div key={index} className="mb-6 p-4 border rounded">
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <input
                    type="text"
                    value={job.title}
                    onChange={(e) =>
                      handleChange("employment", "title", e.target.value, index)
                    }
                    className="w-full p-2 border rounded"
                    placeholder="Tên việc làm"
                  />
                  <input
                    type="text"
                    value={job.period}
                    onChange={(e) =>
                      handleChange("employment", "period", e.target.value, index)
                    }
                    className="w-full p-2 border rounded"
                    placeholder="Period (e.g., Jan 2018 - Present)"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <input
                    type="text"
                    value={job.company}
                    onChange={(e) =>
                      handleChange("employment", "company", e.target.value, index)
                    }
                    className="w-full p-2 border rounded"
                    placeholder="Công ty"
                  />
                  <input
                    type="text"
                    value={job.location}
                    onChange={(e) =>
                      handleChange("employment", "location", e.target.value, index)
                    }
                    className="w-full p-2 border rounded"
                    placeholder="Vị trí"
                  />
                </div>
                <textarea
                  value={job.description}
                  onChange={(e) =>
                    handleChange("employment", "description", e.target.value, index)
                  }
                  className="w-full p-2 border rounded mb-2"
                  placeholder="Mô tả công việc"
                  rows="3"
                />
                {job.bullets.map((bullet, bulletIndex) => (
                  <input
                    key={bulletIndex}
                    type="text"
                    value={bullet}
                    onChange={(e) => {
                      const newBullets = [...job.bullets];
                      newBullets[bulletIndex] = e.target.value;
                      handleChange("employment", "bullets", newBullets, index);
                    }}
                    className="w-full p-2 border rounded mb-2"
                    placeholder="Điểm thành tích"
                  />
                ))}
                <button
                  onClick={() => {
                    const newEmployment = [...formData.employment];
                    newEmployment[index].bullets.push("");
                    setFormData((prev) => ({ ...prev, employment: newEmployment }));
                  }}
                  className="w-full bg-gray-200 text-gray-700 p-2 rounded mt-2"
                >
                 Thêm dấu đầu dòng
                </button>
              </div>
            ))}
            <button
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  employment: [
                    ...prev.employment,
                    {
                      title: "",
                      company: "",
                      location: "",
                      period: "",
                      description: "",
                      bullets: [""],
                    },
                  ],
                }))
              }
              className="w-full bg-blue-700 text-white p-2 rounded mt-2"
            >
              Thêm việc làm
            </button>
          </section>

          <section>
            <h2 className="text-xl font-bold text-blue-700 mb-4">
            Liên kết chuyên nghiệp
            </h2>
            {formData.affiliations.map((affiliation, index) => (
              <div key={index} className="mb-4 p-4 border rounded">
                <input
                  type="text"
                  value={affiliation.title}
                  onChange={(e) =>
                    handleChange("affiliations", "title", e.target.value, index)
                  }
                  className="w-full p-2 border rounded mb-2"
                  placeholder="Tiêu đề liên kết"
                />
                <input
                  type="text"
                  value={affiliation.period}
                  onChange={(e) =>
                    handleChange("affiliations", "period", e.target.value, index)
                  }
                  className="w-full p-2 border rounded"
                  placeholder="Giai đoạn"
                />
              </div>
            ))}
            <button
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  affiliations: [...prev.affiliations, { title: "", period: "" }],
                }))
              }
              className="w-full bg-gray-200 text-gray-700 p-2 rounded mt-2"
            >
             Thêm liên kết
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CvTemplate7;
