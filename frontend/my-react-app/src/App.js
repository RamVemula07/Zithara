import React, { useState, useEffect } from 'react';
import './App.css';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import HostedWebsiteDisplayTable from './component/table';

function App() {
  const [data, setData] = useState([]);


  const fetchRecords = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/records');
      if (!response.ok) {
        throw new Error('Failed to fetch records');
      }
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return (
    <>
      <AppBar
        position="sticky"
        style={{
          background: "#2E3B55"
        }}
        spacing={0}>
        <Toolbar style={{ justifyContent: "space-between" }}>
          <img
            width={100}
            m={2}
            src={""}
            alt="Logo"
          />

        </Toolbar>

      </AppBar>
      <div className="App">
        <HostedWebsiteDisplayTable data={data} />
      </div>
    </>
  );
}

export default App;
