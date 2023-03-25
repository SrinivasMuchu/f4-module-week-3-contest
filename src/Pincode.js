import React, { useState } from "react";
import axios from "axios";
import { Container,Card, CardContent, Typography, Grid } from "@mui/material";
import AutorenewIcon from '@mui/icons-material/Autorenew';

function Pincode() {
  const [pincode, setPincode] = useState("");
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState("");
  const [filteredData, setFilteredData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePincodeChange = (event) => {
    setPincode(event.target.value);
  };

  const handleFilterChange = (event) => {
    const filterValue = event.target.value.toLowerCase();
    setFilter(filterValue);
  
    if (Array.isArray(data.PostOffice)) {
      const filteredData = data.PostOffice.filter((po) =>
        po.Name.toLowerCase().includes(filterValue)
      );
      setFilteredData({ ...data, PostOffice: filteredData });
    }
  };
  

  
  const handleLookup = async () => {
    if (pincode.length !== 6) {
      alert("Pincode should be 6 digits");
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = response.data;
      setData(data[0]);
      setFilteredData(data[0]);
    } catch (error) {
      console.error(error);
      alert("Unable to fetch pincode data");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <Container maxWidth="md">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "2rem 0" }}>
        <h1>ENTER PINCODE</h1>
        
    <input label="Enter Pincode" placeholder="Enter Your 6 digit Pincode" variant="outlined" value={pincode} onChange={handlePincodeChange} style={{ marginBottom: "1rem" }} />
        <button variant="contained" color="primary" onClick={handleLookup} disabled={isLoading}>
          Lookup
        </button>
      </div>
      {isLoading && <div ><center><AutorenewIcon/><br/>loading....</center></div>}
      {!isLoading && filteredData && (
        <div style={{ marginBottom: "2rem" }}>
            <p><b>Pincode:{pincode}</b></p>
         <p><b>Message:</b> Number of pincode(s) found: </p>
            <label style={{fontSize:"30px"}}>Filter</label>
          <input label="Filter by Post Office Name" variant="outlined" value={filter} onChange={handleFilterChange} style={{ marginBottom: "1rem" }} />

         
          <Grid container spacing={2}>
            {filteredData.PostOffice.map((po) => (
                
              <Grid item xs={12} sm={6} md={4} key={po.Name}>
                <Card style={{ width: "100%", marginBottom: "1rem" }}>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      {po.Name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                      Branch Type: {po.BranchType}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                      Delivery Status: {po.DeliveryStatus}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                      District: {po.District}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                      Division: {po.Division}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
      )}
      {!isLoading && data && filteredData.PostOffice.length === 0 && <div>No post office found</div>}
    </Container>
  );
};

export default Pincode;