import {useSearchParams, useLocation, Link} from  'react-router-dom'
import {AppBar, Toolbar, IconButton, Typography, Drawer, Box} from  '@mui/material';
import {List, ListItem, ListItemButton,ListItemText, Divider} from '@mui/material';
import {Menu}  from '@mui/icons-material';
import React, { useEffect } from 'react'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
export default function TopBar(props) {
    
    const [searchParams] = useSearchParams() 
    let home = searchParams.get('home')
    let away = searchParams.get('versus')
    // let uID = searchParams.get('uID')
    let date = searchParams.get('date')
    
    const [drawerOpen, setDrawerOpen] = React.useState(false)
    const [adminDrawerOpen, setAdminDrawerOpen] = React.useState(false)
    const [text, setText] = React.useState("")
    const anchor = 'left'

    const location = useLocation();

    const [color, setColor] = React.useState('grey')
    // let text = (location.pathname === '/game/') ? `${home} vs ${away} ${date}` : "Create a New Game"

    useEffect( () => {
        if (location.pathname === '/game/' || location.pathname === '/summary/') {
            // Fetch Team Color
            setColor('#6200EE')
            setText(`${home} vs ${away} ${date}`)
        }
        else if (location.pathname === '/admin') {
            setText("Admin")

        }
        else if (location.pathname === '/feedback'){
            setText("Thanks for the feedback!")
        }
        else {
            setColor('grey')
            setText("Create a New Game")
        }

    }, [text, location.pathname, home, away, date])



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
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={() => setAdminDrawerOpen(true)}
                    >
                        <AdminPanelSettingsIcon />
                    </IconButton>
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

            {['Leave Feedback'].map((text, index) => (
            <ListItem key={text} disablePadding>
                <Link to={{
                    pathname:"feedback",
                    }}
                    >
                <ListItemButton>
                <ListItemText primary={text} />
                </ListItemButton>
                    </Link>

            </ListItem>
            ))}
        </List>

        </Box>
        </Drawer>
        <Drawer
        anchor='right'
        open={adminDrawerOpen}
        onClose={() => setAdminDrawerOpen(false)}
        >
            <Box
                sx={{ width: 250 }}
                role="presentation"
                onClick={() => setAdminDrawerOpen(false)}
                onKeyDown={() => setAdminDrawerOpen(false)}
                >
            <List>
            <ListItem key="Admin" disablePadding>
                <ListItemButton>
                <Link to={{
                    pathname:"admin",
                    }}
                    >
                    <ListItemText primary="Go to Admin Page" />
                </Link>
                           
                </ListItemButton>

            </ListItem>
            { location.search &&
                <ListItem key="Edit">
                <ListItemButton>
                <Link to={{
                    pathname:"game/"+location.search,
                    }}
                    >
                    <ListItemText primary="Edit Current Game" />
                </Link>
                            
                </ListItemButton>
                </ListItem>

            }
           
            <Divider />
            </List>

        </Box>
        </Drawer>
        </div>
        
        


    )
  }