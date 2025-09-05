import React from 'react';
import { Box, Container, Grid, Typography, Link, Divider } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#f7f7f7',
        borderTop: '1px solid #ddd',
        mt: 'auto',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
              RentHub
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              The peer-to-peer marketplace for renting anything you need, from furniture to electronics and more.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Link href="#" sx={{ color: 'text.secondary' }}>
                <Facebook />
              </Link>
              <Link href="#" sx={{ color: 'text.secondary' }}>
                <Twitter />
              </Link>
              <Link href="#" sx={{ color: 'text.secondary' }}>
                <Instagram />
              </Link>
              <Link href="#" sx={{ color: 'text.secondary' }}>
                <LinkedIn />
              </Link>
            </Box>
          </Grid>

          {/* Support */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Support
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="#" sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                Help Center
              </Link>
              <Link href="#" sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                Safety Information
              </Link>
              <Link href="#" sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                Cancellation Options
              </Link>
              <Link href="#" sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                Contact Us
              </Link>
            </Box>
          </Grid>

          {/* Community */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Community
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="#" sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                Diversity & Inclusion
              </Link>
              <Link href="#" sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                Accessibility
              </Link>
              <Link href="#" sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                Associates
              </Link>
              <Link href="#" sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                Frontline Stays
              </Link>
            </Box>
          </Grid>

          {/* Rent */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Rent
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="#" sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                List your item
              </Link>
              <Link href="#" sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                Responsible renting
              </Link>
              <Link href="#" sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                Community Center
              </Link>
              <Link href="#" sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                Join a local club
              </Link>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            © 2024 RentHub, Inc. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <Link href="#" sx={{ color: 'text.secondary', textDecoration: 'none', fontSize: '0.875rem', '&:hover': { textDecoration: 'underline' } }}>
              Privacy
            </Link>
            <Link href="#" sx={{ color: 'text.secondary', textDecoration: 'none', fontSize: '0.875rem', '&:hover': { textDecoration: 'underline' } }}>
              Terms
            </Link>
            <Link href="#" sx={{ color: 'text.secondary', textDecoration: 'none', fontSize: '0.875rem', '&:hover': { textDecoration: 'underline' } }}>
              Sitemap
            </Link>
            <Link href="#" sx={{ color: 'text.secondary', textDecoration: 'none', fontSize: '0.875rem', '&:hover': { textDecoration: 'underline' } }}>
              Company details
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;