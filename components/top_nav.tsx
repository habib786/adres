import * as React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

export default function TopNav() {
  return (
    <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" style={{marginTop: '20px'}}>
        <Link underline="hover" color="inherit" href="/" style={{color: '#10489b', fontWeight: '500'}}>Home</Link>
        <Link underline="hover" color="inherit" href="/" style={{color: '#10489b', fontWeight: '500'}}>Administration</Link>
        <Typography style={{color: '#767e90', fontWeight: '500'}}>Logger Search</Typography>
    </Breadcrumbs>
  );
}
