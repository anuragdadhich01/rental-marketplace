import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  Avatar,
  Chip,
  Button,
} from '@mui/material';
import {
  Groups as TeamIcon,
  Security as SecurityIcon,
  Nature as SustainabilityIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';

const AboutPage: React.FC = () => {
  const features = [
    {
      icon: <SecurityIcon />,
      title: 'Secure & Trusted',
      description: 'Advanced verification system and secure payments ensure safe transactions for all users.',
      color: '#007AFF',
    },
    {
      icon: <SustainabilityIcon />,
      title: 'Sustainable Sharing',
      description: 'Reduce waste and environmental impact by sharing resources within your community.',
      color: '#34C759',
    },
    {
      icon: <TeamIcon />,
      title: 'Community Driven',
      description: 'Built for communities to connect, share, and help each other access what they need.',
      color: '#FF9500',
    },
  ];

  const team = [
    {
      name: 'Anurag Dadhich',
      role: 'Founder & CEO',
      bio: 'Passionate about building sustainable sharing economy platforms',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    },
    {
      name: 'Development Team',
      role: 'Engineering',
      bio: 'Dedicated to creating robust and user-friendly rental solutions',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3847ae348b73?w=150',
    },
  ];

  const stats = [
    { label: 'Active Users', value: '5,000+' },
    { label: 'Items Listed', value: '12,000+' },
    { label: 'Successful Rentals', value: '8,500+' },
    { label: 'Cities Covered', value: '25+' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #007AFF 0%, #34C759 100%)',
          color: 'white',
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h2" sx={{ fontWeight: 700, mb: 2 }}>
              About RentHub
            </Typography>
            <Typography variant="h5" sx={{ mb: 4, maxWidth: '800px', mx: 'auto' }}>
              Your trusted peer-to-peer rental marketplace connecting communities 
              through sustainable sharing of everyday items.
            </Typography>
            <Button
              variant="outlined"
              size="large"
              sx={{
                color: 'white',
                borderColor: 'white',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'white',
                },
              }}
            >
              Join Our Community
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Mission Statement */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
            Our Mission
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: '800px', mx: 'auto', lineHeight: 1.6 }}
          >
            We believe in the power of sharing. RentHub makes it easy for people to rent 
            and lend items within their community, reducing waste, saving money, and building 
            stronger connections between neighbors.
          </Typography>
        </Box>

        {/* Features */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 3 }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    p: 2,
                    borderRadius: '50%',
                    bgcolor: `${feature.color}15`,
                    color: feature.color,
                    mb: 2,
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  {feature.title}
                </Typography>
                <Typography color="text.secondary">
                  {feature.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Stats */}
        <Box sx={{ bgcolor: 'grey.50', borderRadius: 3, p: 4, mb: 8 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, textAlign: 'center', mb: 4 }}>
            Our Impact
          </Typography>
          <Grid container spacing={3}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Team */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, textAlign: 'center', mb: 4 }}>
            Meet Our Team
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {team.map((member, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ textAlign: 'center', p: 3 }}>
                  <Avatar
                    src={member.avatar}
                    sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
                  />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {member.name}
                  </Typography>
                  <Chip
                    label={member.role}
                    color="primary"
                    size="small"
                    sx={{ my: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {member.bio}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Contact */}
        <Card sx={{ p: 4, textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
            Get In Touch
          </Typography>
          <Typography variant="h6" sx={{ mb: 4 }}>
            Have questions or suggestions? We'd love to hear from you!
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              startIcon={<EmailIcon />}
              sx={{
                color: 'white',
                borderColor: 'white',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'white',
                },
              }}
            >
              contact@renthub.com
            </Button>
            <Button
              variant="outlined"
              startIcon={<PhoneIcon />}
              sx={{
                color: 'white',
                borderColor: 'white',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'white',
                },
              }}
            >
              +91 98765 43210
            </Button>
          </Box>
        </Card>
      </Container>
    </Box>
  );
};

export default AboutPage;