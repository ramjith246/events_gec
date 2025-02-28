import React, { useEffect, useState } from 'react';
import { db1, db2 } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Box, Typography, Grid, Button, Container, Card, CardMedia, Dialog, DialogTitle, DialogContent, DialogActions, Drawer, List, ListItem, ListItemText, IconButton } from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu'; // Import the hamburger menu icon

interface Internship {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  applyLink: string;
  date: string;
  status?: string;
}

const InternshipsPage = () => {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false); // State to manage drawer open/close

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const [snapshot1, snapshot2] = await Promise.all([
          getDocs(collection(db1, 'internships')), // Fetch from first database
          getDocs(collection(db2, 'internships')) // Fetch from second database
        ]);

        const internships1 = snapshot1.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          imageUrl: doc.data().imageUrl,
          description: doc.data().description || "No description available",
          applyLink: doc.data().applyLink || "#",
          date: doc.data().date || "Date not available",
          status: doc.data().status || "active"
        }));

        const internships2 = snapshot2.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          imageUrl: doc.data().imageUrl,
          description: doc.data().description || doc.data().desc || "No description available",
          applyLink: doc.data().applyLink || "#",
          date: doc.data().date || "Date not available",
          status: doc.data().status || "active"
        }));

        setInternships([...internships1, ...internships2]);
      } catch (error) {
        console.error('Error fetching internships:', error);
      }
    };

    fetchInternships();
  }, []);

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  return (
    <Container>
      {/* PWA Metadata */}
      

      {/* Hamburger Menu Button */}
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={toggleDrawer(true)}
        sx={{ position: 'absolute', top: 16, left: 16, zIndex: 1000 }}
      >
        <MenuIcon sx={{ color: 'white', fontSize: '2rem' }} /> {/* Three white lines */}
      </IconButton>

      {/* Drawer (Sliding Panel) */}
      <Drawer
  anchor="left"
  open={drawerOpen}
  onClose={toggleDrawer(false)}
>
  <Box
    sx={{ width: 250, bgcolor: "#111", color: "white", height: "100%" }}
    role="presentation"
    onClick={toggleDrawer(false)}
    onKeyDown={toggleDrawer(false)}
  >
    <List>
      <ListItem component="a" href="/">
        <ListItemText primary="Events" sx={{ color: 'white' }} />
      </ListItem>
      <ListItem component="a" href="/internships">
        <ListItemText primary="Internships" sx={{ color: 'white' }} />
      </ListItem>
      <ListItem component="a" href="/FestsPage">
        <ListItemText primary="Fests" sx={{ color: 'white' }} />
      </ListItem>
    </List>
  </Box>
</Drawer>

      <Box sx={{ textAlign: 'center', my: 4 }}>
        <Typography 
          variant="h3" 
          sx={{ fontFamily: '"Old Standard TT", serif' }}
        >
          Internships 
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {internships.map(internship => (
          <Grid item xs={12} sm={6} md={4} key={internship.id}>
            <Card 
              onClick={() => setSelectedInternship(internship)} 
              sx={{ 
                cursor: 'pointer', 
                height: 350, 
                display: 'flex', 
                flexDirection: 'column',
                filter: internship.status === "canceled" ? "grayscale(100%)" : "none", 
                opacity: internship.status === "canceled" ? 0.6 : 1,
                position: 'relative' // Needed for overlay
              }}
            >
              <CardMedia 
                component="img" 
                height="200"
                image={internship.imageUrl} 
                alt={internship.name} 
                sx={{ objectFit: "cover" }}
              />

              {/* CANCELED Overlay */}
              {internship.status === "canceled" && (
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    width: '100%', 
                    height: '100%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    bgcolor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
                  }}
                >
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      color: 'white', 
                      fontSize:'3.5rem',
                      fontWeight: 'bold', 
                      textTransform: 'uppercase',
                      opacity: 0.7, // Reduced opacity
                    }}
                  >
                    Canceled
                  </Typography>
                </Box>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Internship Details Dialog */}
      {selectedInternship && (
        <Dialog open={Boolean(selectedInternship)} onClose={() => setSelectedInternship(null)}>
          <DialogTitle sx={{ bgcolor: "black", color: "white" }}>
            {selectedInternship.name}
          </DialogTitle>
          <DialogContent sx={{ bgcolor: "black", color: "white", p: 0 }}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CardMedia
  component="img"
  image={selectedInternship.imageUrl}
  alt={selectedInternship.name}
  sx={{ width: "100%", maxHeight: "300px", objectFit: "cover", borderRadius: "0" }}
/>
            </Box>
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ color: "white" }}>
                Date: {selectedInternship.date}
              </Typography>
              <Typography variant="body1">{selectedInternship.description}</Typography>
              {selectedInternship.status === "canceled" && (
                <Typography variant="h5" sx={{ color: "red", fontWeight: "bold", mt: 2 }}>
                  This Internship Has Been CANCELED
                </Typography>
              )}
            </Box>
          </DialogContent>
          <DialogActions sx={{ bgcolor: "black" }}>
            <Button onClick={() => setSelectedInternship(null)} sx={{ color: "white" }}>Close</Button>
            {selectedInternship.status !== "canceled" && (
              <Button 
                variant="contained" 
                color="primary" 
                href={selectedInternship.applyLink.startsWith('http') ? selectedInternship.applyLink : `https://${selectedInternship.applyLink}`} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Apply Now
              </Button>
            )}
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default InternshipsPage;