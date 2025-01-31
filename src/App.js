import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [consultants, setConsultants] = useState([]);
  const [customers, setCustomers] = useState([]);
  
  // Uudet tilat konsultointisession luomista varten
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [lunchBreak, setLunchBreak] = useState('');
  const [consultantId, setConsultantId] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });

  // Raportointiin liittyvät tilat
  const [year, setYear] = useState(2025);
  const [startMonth, setStartMonth] = useState(1);
  const [endMonth, setEndMonth] = useState(2);
  const [reportMessage, setReportMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchConsultants();
    fetchCustomers();
  }, []);

  // Hakee konsulttien listan
  const fetchConsultants = async () => {
    try {
      const response = await axios.get('/consultants');
      setConsultants(response.data.consultants_list);
    } catch (error) {
      console.error('Error fetching consultants:', error);
      setMessage({
        text: 'Error fetching consultants: ' + error.message,
        type: 'error',
      });
    }
  };

  // Hakee asiakkaiden listan
  const fetchCustomers = async () => {
    try {
      const response = await axios.get('/customers');
      setCustomers(response.data.customers_list);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setMessage({
        text: 'Error fetching customers: ' + error.message,
        type: 'error',
      });
    }
  };

  // Konsultointisession luominen
  const createConsultantSession = async () => {
    // Nollataan viesti ennen session luomista
    setMessage({ text: '', type: '' });
  
    try {
      const newSession = {
        start,
        end,
        lunch_break: lunchBreak,
        consultant_id: consultantId,
        customer_id: customerId,
      };
  
      const response = await axios.post('/consultant_sessions', newSession);
  
      if (response.data && response.data.success) {
        setMessage({
          text: response.data.success,
          type: 'success',
        });
        // Tyhjennetään lomakekentät
        setStart('');
        setEnd('');
        setLunchBreak('');
        setConsultantId('');
        setCustomerId('');
      } else {
        setMessage({
          text: 'Error: ' + (response.data ? response.data.message : 'Unknown error'),
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Error creating session:', error);
      setMessage({
        text: 'Error creating session: ' + (error.message || 'Unknown error'),
        type: 'error',
      });
    }
  };
  

  // Raportin tilaus
  const requestReport = async () => {
    // Nollataan viesti ennen raportin tilauspyyntöä
    setReportMessage({ text: '', type: '' });
  
    try {
      const reportData = {
        year,
        start_month: startMonth,
        end_month: endMonth,
      };
  
      const response = await axios.post('/reports', reportData);
  
      if (response.data && response.data.message) {
        setReportMessage({
          text: `Report generated successfully: ${response.data.message}`,
          type: 'success',
        });
      } else {
        setReportMessage({
          text: 'Error: ' + (response.data ? response.data.message : 'Unknown error'),
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Error requesting report:', error);
      setReportMessage({
        text: 'Error requesting report: ' + (error.message || 'Unknown error'),
        type: 'error',
      });
    }
  };

  return (
    <div className="App">
      <h1>Consultants and Customers</h1>

      {/* Konsulttien lista (valintaruudut) */}
      <div className="select-container">
        <h2>Select Consultant</h2>
        <select
          className="dropdown"
          value={consultantId}
          onChange={(e) => setConsultantId(e.target.value)}
        >
          <option value="">Select a Consultant</option>
          {consultants.map((consultant) => (
            <option key={consultant.id} value={consultant.id}>
              {consultant.name} (ID: {consultant.id})
            </option>
          ))}
        </select>
      </div>

      {/* Asiakkaiden lista (valintaruudut) */}
      <div className="select-container">
        <h2>Select Customer</h2>
        <select
          className="dropdown"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
        >
          <option value="">Select a Customer</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name} (ID: {customer.id})
            </option>
          ))}
        </select>
      </div>

      {/* Lomake konsultointisession luomista varten */}
      <div className="form-container">
        <h2>Create Consultant Session</h2>
        <input
          type="datetime-local"
          className="input-field"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          placeholder="Start Time"
        />
        <input
          type="datetime-local"
          className="input-field"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          placeholder="End Time"
        />
        <input
          type="number"
          className="input-field"
          value={lunchBreak}
          onChange={(e) => setLunchBreak(e.target.value)}
          placeholder="Lunch Break (minutes)"
        />
        <button className="button" onClick={createConsultantSession}>Create Session</button>
        <div className={`message ${message.type}`}>{message.text}</div> {/* Viesti onnistumisesta tai virheestä */}
      </div>

      {/* Raportin tilauslomake */}
      <div className="form-container">
        <h2>Request Report</h2>
        <input
          type="number"
          className="input-field"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="Year"
        />
        <input
          type="number"
          className="input-field"
          value={startMonth}
          onChange={(e) => setStartMonth(e.target.value)}
          placeholder="Start Month"
        />
        <input
          type="number"
          className="input-field"
          value={endMonth}
          onChange={(e) => setEndMonth(e.target.value)}
          placeholder="End Month"
        />
        <button className="button" onClick={requestReport}>Request Report</button>
        <div className={`message ${reportMessage.type}`}>{reportMessage.text}</div> {/* Raportin tilausviesti */}
      </div>
    </div>
  );
}

export default App;
