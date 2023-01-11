import React, {useState, useEffect, useContext} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
//import MenuList from '@mui/material/MenuList';
//import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { getAuth, signOut, onAuthStateChanged} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';




export default function ButtonAppBar() {
  const [email, setEmail] = useState(undefined)
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate()
  const auth = getAuth()
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = e => {
    setAnchorEl(null);
  };

  useEffect(()=>onAuthStateChanged(auth, user => {
      setEmail(user?user.email:undefined)
  }), [])

  const handleClickLine = route => {
    navigate(route)
  }

  const handleSignout = () => {
    setEmail(undefined)
    signOut(auth)
    window.location.reload()
    navigate('/signin')
  }

  const handleSignin = () => {
    navigate('/signin')
  }

  return (
    <div>
    <Menu
      id="basic-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      MenuListProps={{
        'aria-labelledby': 'basic-button',
      }}
    >
      <MenuItem onClick={()=>navigate('/installningar')}>Inställningar</MenuItem>
      <MenuItem><ListItemText inset></ListItemText></MenuItem>
      <Divider />
      {email?<MenuItem onClick={()=>handleSignout()}>Signout</MenuItem>
      :<MenuItem onClick={()=>handleSignin()}>Signin</MenuItem>}
      {email?<MenuItem onClick={()=>navigate('/admin')}>Add Event</MenuItem>:null}
    </Menu>

    <Box sx={{ flexGrow: 2}}>
      <AppBar position="static" sx={{color:'#FFFFA7',  backgroundColor:'#112200'}}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 0 }}
          >
            <HomeIcon 
                  id="basic-button"
                  aria-controls={open ? 'basic-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  onClick={()=>handleClickLine('/home')}
            />
          </IconButton>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}  onClick={()=>handleClickLine('/home')}>
          </Typography>
          <Typography variant="h5" component="div" sx={{ flexGrow: 4 }}  onClick={()=>handleClickLine('/home')}>
            {email?'Signed in as:' +  email:undefined}
          </Typography>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 0 }}
            onClick={handleClick}
            >
            <MenuIcon 
                  id="basic-button"
                  aria-controls={open ? 'basic-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
            />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
    </div>
  );
}

/*
*/