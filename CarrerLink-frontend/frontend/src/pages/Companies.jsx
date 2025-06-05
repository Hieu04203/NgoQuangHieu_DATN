import React, { useState } from 'react';
import { useContext } from 'react';
import { useEffect } from 'react';
import { useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { Search, Building2, MapPin, Users2, Globe2, ArrowUpRight } from 'lucide-react';
import { getAllCompanies } from '../api/CompanyDetailsGetApi'
import { getAllCompaniesusingFilters } from '../api/CompanyDetailsGetApi'
import { AuthContext } from '../api/AuthProvider';
import { getCompanyByName } from '../api/CompanyDetailsGetApi';
import Employer from "./Employer";
// Sample company data


function Companies() {
  const [searchTerm, setSearchTerm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [companyes, setCompanies] = useState([]);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      if (!searchTerm || searchTerm.trim() === '') {
        const response = await getAllCompanies();
        setCompanies(response.data);
      } else {
        const response = await getCompanyByName(searchTerm);
        setCompanies(response.data);
      }
    } catch (error) {
      console.error('Error fetching company data:', error);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const response = await getAllCompanies();
        if (isMounted && response?.success) {
          setCompanies(response.data);
        }
      } catch (error) {
        console.error('Error fetching companies:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCompanies();
    return () => { isMounted = false };
  }, []);

  if (loading) return <div>Đang tải ...</div>
  if (!companyes) return <div>Không tìm thấy công ty</div>

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        {/* Search */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Tìm kiếm công ty..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
            >
              <Search className="h-5 w-5" />
              Tìm kiếm
            </button>
          </div>
        </div>

        {/* Company Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companyes.map(company => (
            <div key={company.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={company.companyPicUrl}
                      alt={company.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{company.name}</h3>
                      <p className="text-blue-600 font-medium">{company.category}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${company.category === 'Actively Hiring'
                      ? 'bg-green-100 text-green-800'
                      : company.status === 'Open to Talent'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                    {company.category}
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-gray-500">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-sm">{company.location}</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Users2 className="h-4 w-4 mr-2" />
                    <span className="text-sm">{company.size}</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Building2 className="h-4 w-4 mr-2" />
                    <span className="text-sm">{company.description}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700">Chuyên ngành:</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {company.technologies.map((tech) => (
                      <span
                        key={tech.techId}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                      >
                        {tech.techName}
                      </span>
                    ))}
                  </div>
                </div>

                <button className="mt-6 w-full flex items-center justify-center bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                  onClick={() => navigate('/employer', { state: { company } })}
                >
                  <Globe2 className="h-4 w-4 mr-2" />
                  Xem hồ sơ công ty
                  <ArrowUpRight className="h-4 w-4 ml-2" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Companies;