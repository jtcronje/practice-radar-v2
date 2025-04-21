import React, { useState, useEffect, useRef } from 'react';
import { Search, Download, Calendar, Clock, DollarSign, Users, Printer } from 'lucide-react';

// Mock data based on the CSV structure
const mockPatients = [
  { 
    id: 'P001', 
    firstName: 'John', 
    lastName: 'Smith', 
    dateOfBirth: '1980-05-15', 
    gender: 'Male',
    medicalAidName: 'Health Guardian',
    medicalAidScheme: 'Premium Plan',
    medicalAidNumber: 123456789,
    dependantCode: 0 
  },
  { 
    id: 'P002', 
    firstName: 'Sarah', 
    lastName: 'Johnson', 
    dateOfBirth: '1992-09-21', 
    gender: 'Female',
    medicalAidName: 'MediCare Plus',
    medicalAidScheme: 'Standard Cover',
    medicalAidNumber: 987654321,
    dependantCode: 1
  },
  { 
    id: 'P003', 
    firstName: 'Michael', 
    lastName: 'Williams', 
    dateOfBirth: '1975-03-10', 
    gender: 'Male',
    medicalAidName: 'National Health',
    medicalAidScheme: 'Comprehensive',
    medicalAidNumber: 456789123,
    dependantCode: 0
  },
];

const mockProcedures = [
  {
    id: 'PR001',
    patientId: 'P001',
    date: '2023-06-10',
    procedureCode: 'A1234',
    procedureDescription: 'Comprehensive General Checkup',
    diagnosis: 'Z00.00 - General adult medical examination',
    locationId: 'L001',
    locationName: 'Main Street Medical Center',
    duration: 45,
    cost: 250.00,
    paymentStatus: 'Paid',
    paymentMethod: 'Medical Aid'
  },
  {
    id: 'PR002',
    patientId: 'P001',
    date: '2023-08-15',
    procedureCode: 'B2345',
    procedureDescription: 'Blood Test - Complete Blood Count',
    diagnosis: 'Z01.89 - Encounter for other specified special examinations',
    locationId: 'L001',
    locationName: 'Main Street Medical Center',
    duration: 15,
    cost: 85.50,
    paymentStatus: 'Paid',
    paymentMethod: 'Credit Card'
  },
  {
    id: 'PR003',
    patientId: 'P001',
    date: '2024-01-22',
    procedureCode: 'C3456',
    procedureDescription: 'Chest X-Ray',
    diagnosis: 'R05 - Cough',
    locationId: 'L002',
    locationName: 'Central City Hospital',
    duration: 30,
    cost: 175.75,
    paymentStatus: 'Outstanding',
    paymentMethod: 'Pending'
  },
  {
    id: 'PR004',
    patientId: 'P002',
    date: '2023-11-05',
    procedureCode: 'D4567',
    procedureDescription: 'Dental Cleaning',
    diagnosis: 'Z01.20 - Encounter for dental examination and cleaning',
    locationId: 'L003',
    locationName: 'Smile Bright Dental Clinic',
    duration: 60,
    cost: 120.00,
    paymentStatus: 'Paid',
    paymentMethod: 'Medical Aid'
  }
];

// Utility functions
const calculateAge = (dateOfBirth) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// AI text generation (simulated)
const generatePatientSummary = (patient, procedures) => {
  if (!patient || procedures.length === 0) return '';
  
  const age = calculateAge(patient.dateOfBirth);
  const visitCount = procedures.length;
  const latestVisit = procedures.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  const totalSpent = procedures.reduce((total, proc) => total + proc.cost, 0);
  
  const commonProcedures = procedures
    .map(p => p.procedureDescription)
    .reduce((acc, curr) => {
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    }, {});
  
  const mostCommonProcedure = Object.entries(commonProcedures)
    .sort((a, b) => b[1] - a[1])[0];
  
  return `${patient.firstName} ${patient.lastName} is a ${age}-year-old ${patient.gender.toLowerCase()} patient who has visited our practice ${visitCount} times. Their most recent visit was on ${formatDate(latestVisit.date)} for a ${latestVisit.procedureDescription.toLowerCase()}. The most common procedure they've undergone is ${mostCommonProcedure[0].toLowerCase()} (${mostCommonProcedure[1]} times). Total amount spent on medical care: ${formatCurrency(totalSpent)}. Patient is covered by ${patient.medicalAidName} under the ${patient.medicalAidScheme} plan.`;
};

const PatientHistoryPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [patientProcedures, setPatientProcedures] = useState([]);

  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = mockPatients.filter(patient => 
        `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPatients(filtered);
    } else {
      setFilteredPatients([]);
    }
  }, [searchTerm]);

  useEffect(() => {
    if (selectedPatient) {
      const procedures = mockProcedures.filter(proc => proc.patientId === selectedPatient.id);
      setPatientProcedures(procedures);
    } else {
      setPatientProcedures([]);
    }
  }, [selectedPatient]);

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setSearchTerm(`${patient.firstName} ${patient.lastName}`);
    setFilteredPatients([]);
  };

  const printRef = useRef();
  
  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to print/save as PDF');
      return;
    }
    
    const printDocument = printWindow.document;
    printDocument.write(`
      <html>
        <head>
          <title>${selectedPatient ? `${selectedPatient.firstName} ${selectedPatient.lastName} - Patient History` : 'Patient History'}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            h1, h2 { color: #333; }
            .summary { background-color: #f0f4ff; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
            @media print {
              button { display: none; }
            }
          </style>
        </head>
        <body>
          ${content.innerHTML}
          <script>
            setTimeout(() => { window.print(); }, 500);
          </script>
        </body>
      </html>
    `);
    printDocument.close();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Patient History</h1>
            <div className="flex space-x-4">
              <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-300 overflow-hidden">
                <div className="pl-4">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search patient by name..."
                  className="w-full px-4 py-2 focus:outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          {/* Search results dropdown */}
          {filteredPatients.length > 0 && (
            <div className="absolute z-10 mt-2 w-64 bg-white rounded-md shadow-lg overflow-hidden">
              <ul className="max-h-60 overflow-auto">
                {filteredPatients.map((patient) => (
                  <li
                    key={patient.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSelectPatient(patient)}
                  >
                    {patient.firstName} {patient.lastName}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow">
        <div ref={printRef} className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Patient details section */}
          {selectedPatient ? (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Patient Information
                  </h2>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Personal and medical aid details
                  </p>
                </div>
                {patientProcedures.length > 0 && (
                  <button
                    onClick={handlePrint}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    Print / Save as PDF
                  </button>
                )}
              </div>
              <div className="border-t border-gray-200">
                <dl>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Full name</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedPatient.firstName} {selectedPatient.lastName}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Date of birth</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {formatDate(selectedPatient.dateOfBirth)} ({calculateAge(selectedPatient.dateOfBirth)} years)
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Gender</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedPatient.gender}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Medical aid</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedPatient.medicalAidName} - {selectedPatient.medicalAidScheme}
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Medical aid number</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedPatient.medicalAidNumber} (Dependant code: {selectedPatient.dependantCode})
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg p-6 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No patient selected</h3>
              <p className="mt-1 text-sm text-gray-500">
                Search for a patient by name to view their history
              </p>
            </div>
          )}

          {/* AI Summary */}
          {selectedPatient && patientProcedures.length > 0 && (
            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-6 mb-6">
              <div className="flex items-start">
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-medium text-indigo-800">
                    AI Summary
                  </h3>
                  <p className="mt-2 text-md text-indigo-700">
                    {generatePatientSummary(selectedPatient, patientProcedures)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Procedures table */}
          {selectedPatient && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Procedure History
                </h2>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  List of all procedures performed for this patient
                </p>
              </div>

              {patientProcedures.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Procedure
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Location
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Duration
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cost
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Payment Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Payment Method
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {patientProcedures.map((procedure) => (
                        <tr key={procedure.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center">
                              <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                              {formatDate(procedure.date)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div>
                              <div className="font-medium">{procedure.procedureDescription}</div>
                              <div className="text-gray-500">{procedure.diagnosis}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {procedure.locationName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center">
                              <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                              {procedure.duration} min
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center">
                              <DollarSign className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                              {formatCurrency(procedure.cost)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              procedure.paymentStatus === 'Paid' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {procedure.paymentStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {procedure.paymentMethod}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No procedures found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    This patient has no recorded procedures at this practice.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PatientHistoryPage;