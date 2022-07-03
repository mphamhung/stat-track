import {useSearchParams, useLocation, Link} from  'react-router-dom'
import {AppBar, Toolbar, IconButton, Typography, Drawer, Box} from  '@mui/material';
import {List, ListItem, ListItemButton,ListItemText, Divider} from '@mui/material';
import {Menu}  from '@mui/icons-material';
import React, { useEffect } from 'react'

export default function TopBar(props) {
    
    const [searchParams] = useSearchParams() 
    let home = searchParams.get('home')
    let away = searchParams.get('versus')
    // let uID = searchParams.get('uID')
    let date = searchParams.get('date')
    
    const [drawerOpen, setDrawerOpen] = React.useState(false)
    const anchor = 'left'

    const location = useLocation();

    const [color, setColor] = React.useState('grey')
    let text = (location.pathname === '/game/') ? `${home} vs ${away} ${date}` : "Home"

    useEffect( () => {
        if (location.pathname === '/game/') {
            // Fetch Team Color
            setColor('#6200EE')
        }
        else {
            setColor('grey')
        }

    }, [text, location.pathname])



    return (
        <div id='topbar'>
            <AppBar position="sticky" style={{lineHeight: '60px', backgroundColor:color}}>
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={() => setDrawerOpen(true)}
                    >
                        <Menu />
                    </IconButton>
                    <Typography component="div" sx={{ flexGrow: 1 }}>
                        {text}
                    </Typography>
                </Toolbar>            
            </AppBar>

        <Drawer
        anchor={anchor}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        >
            <Box
                sx={{ width: 250 }}
                role="presentation"
                onClick={() => setDrawerOpen(false)}
                onKeyDown={() => setDrawerOpen(false)}
                >
            <List>
            <ListItem key="Home" disablePadding>
                <ListItemButton>
                <Link to={{
                    pathname:"/",
                    }}
                    >
                    <ListItemText primary="Home" />
                </Link>
                
                </ListItemButton>
            </ListItem>
            <Divider />

            {['See Player Stats', 'Export Current Game', 'Leave Feedback'].map((text, index) => (
            <ListItem key={text} disablePadding>
                <ListItemButton>
                <ListItemText primary={text} />
                </ListItemButton>
            </ListItem>
            ))}
        </List>

        </Box>
        </Drawer>
        </div>
        
        


    )
  }