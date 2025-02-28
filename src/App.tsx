import React, { useEffect, useState } from 'react';
import { db1, db2 } from './firebase'; // Adjusted path
import { collection, getDocs } from 'firebase/firestore';
import { Box, Typography, Grid, Button, Card, CardMedia, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, TextField, InputAdornment, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from 'react-router-dom';
import './App.css'; // Adjusted path

interface Event {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  registerLink: string;
  date: string;
  club: string;
  status?: string;
}

const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0); // Track scroll position

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const [snapshot1, snapshot2] = await Promise.all([
          getDocs(collection(db1, 'events')),
          getDocs(collection(db2, 'events'))
        ]);

        const events1 = snapshot1.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          imageUrl: doc.data().imageUrl,
          description: doc.data().description || "No description available",
          registerLink: doc.data().registerLink || "#",
          date: doc.data().date || "Date not available",
          club: doc.data().club || "General",
          status: doc.data().status || "active"
        }));

        const events2 = snapshot2.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          imageUrl: doc.data().imageUrl,
          description: doc.data().description || doc.data().desc || "No description available",
          registerLink: doc.data().registerLink || "#",
          date: doc.data().date || "Date not available",
          club: doc.data().club || "General",
          status: doc.data().status || "active"
        }));

        const allEvents = [...events1, ...events2];
        setEvents(allEvents);
        setFilteredEvents(allEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredEvents(events);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = events.filter(event =>
        event.name?.toLowerCase().includes(query) || event.club?.toLowerCase().includes(query)
      );
      setFilteredEvents(filtered);
    }
  }, [searchQuery, events]);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Box sx={{ bgcolor: "black", minHeight: "100vh", color: "white", py: 3 }}>
      {/* Fixed Top Bar */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bgcolor: 'black',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          borderBottom: '1px solid #333',
        }}
      >
        {/* Hamburger Menu */}
        <IconButton
          color="inherit"
          aria-label="menu"
          onClick={() => setDrawerOpen(true)}
        >
          <MenuIcon sx={{ color: 'white', fontSize: '2rem' }} />
        </IconButton>

        {/* Search Button */}
        <IconButton
          color="inherit"
          aria-label="search"
          onClick={() => setSearchOpen(!searchOpen)}
        >
          {searchOpen ? <CloseIcon sx={{ color: 'white', fontSize: '2rem' }} /> : <SearchIcon sx={{ color: 'white', fontSize: '2rem' }} />}
        </IconButton>
      </Box>

      {/* Sidebar */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 250, bgcolor: "#111", color: "white", height: "100%" }} role="presentation">
          <List>
            <ListItem component={Link} to="/" onClick={() => setDrawerOpen(false)}>
              <ListItemText primary="Events" sx={{ color: 'white' }} />
            </ListItem>
            <ListItem component={Link} to="/internships" onClick={() => setDrawerOpen(false)}>
              <ListItemText primary="Internships" sx={{ color: 'white' }} />
            </ListItem>
            <ListItem component={Link} to="/fests" onClick={() => setDrawerOpen(false)}>
              <ListItemText primary="Fests" sx={{ color: 'white' }} />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Search Bar */}
      {searchOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: scrollPosition + 64, // Adjust based on scroll position
            left: 0,
            right: 0,
            bgcolor: 'black',
            zIndex: 1000,
            p: 2,
            borderBottom: '1px solid #333',
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              sx: { backgroundColor: "#333", color: "white" },
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "white" }} />
                </InputAdornment>
              ),
            }}
            sx={{ input: { color: "white" } }}
          />
        </Box>
      )}

      {/* Main Content */}
      <Box sx={{ mt: 8 }}> {/* Add margin-top to avoid overlap with the fixed top bar */}
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <Typography variant="h4" sx={{ fontFamily: '"Old Standard TT", serif', color: "white" }}>
            Events GEC
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ px: 2 }}>
          {filteredEvents.map(event => (
            <Grid item xs={12} sm={6} md={4} key={event.id}>
              <Card onClick={() => setSelectedEvent(event)} sx={{ cursor: 'pointer', height: 350, bgcolor: "#222", color: "white" }}>
                <CardMedia component="img" image={event.imageUrl} alt={event.name} sx={{ height: "100%", objectFit: "cover" }} />
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Event Dialog */}
      {selectedEvent && (
        <Dialog open={Boolean(selectedEvent)} onClose={() => setSelectedEvent(null)}>
          <DialogTitle sx={{ bgcolor: "#111", color: "white" }}>{selectedEvent.name}</DialogTitle>
          <DialogContent sx={{ bgcolor: "#111", color: "white" }}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <img src={selectedEvent.imageUrl} alt={selectedEvent.name} style={{ width: "100%", maxHeight: "300px", objectFit: "cover" }} />
            </Box>
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle1" sx={{ color: "white" }}>Date: {selectedEvent.date}</Typography>
              <Typography variant="body1">{selectedEvent.description}</Typography>
            </Box>
          </DialogContent>
          <DialogActions sx={{ bgcolor: "#111" }}>
            <Button onClick={() => setSelectedEvent(null)} sx={{ color: "white" }}>Close</Button>
            <Button variant="contained" color="primary" href={selectedEvent.registerLink} target="_blank">Register</Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default EventsPage;