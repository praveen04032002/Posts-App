import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import memories from '../../Images/memories.png'
import useStyles from './styles'
import { AppBar, Typography, Toolbar, Button, Avatar } from '@material-ui/core'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import decode from 'jwt-decode'

export default function Navbar() {

    const classes = useStyles()
    const dispatch = useDispatch()
    const location = useLocation()
    const history = useHistory()

    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')))

    const logout = () => {
        dispatch({ type: 'LOGOUT' })
        history.push('/')
        setUser(null)
    }
    
    useEffect( () => {
        const token = user?.token;
        
        if(token) {
            const decodedToken = decode(token)
            if(decodedToken.exp * 1000 < new Date().getTime())  logout();
        }
        
        setUser(JSON.parse(localStorage.getItem('profile')))
        // eslint-disable-next-line
    }, [location])

    return (
        <>
        <AppBar className={classes.root}  color='inherit' style={ { flexDirection: 'row', position: 'static' } } >
            <div className={classes.brandContainer}>
                <Typography component={Link} to='/' className={classes.heading} variant='h2' align='center'>Posts</Typography>
                <img className={classes.image} src={memories} alt="memory" height='60' />
            </div>
            <div className={classes.sectionDesktop} >
                <Toolbar className={classes.toolbar} >
                    {user?(
                        <div className={classes.profile} >
                            <Avatar className={classes.purple} alt={user.result.name} src={user.result.imageUrl}>
                                {user.result.name.charAt(0)}
                            </Avatar>
                            <Typography className={classes.userName} variant='h6'>{user.result.name}</Typography>
                            <Button variant="contained" className={classes.logout} color="secondary" onClick={logout}>Log out</Button>
                        </div>
                    ):(
                        <Button variant="contained" component={Link} to='/auth' color="primary">Sign in</Button>
                    )}
                </Toolbar>
            </div>
            <div className={classes.sectionMobile}>
                <Toolbar className={classes.toolbar} >
                    {user?(
                        <div className={classes.profile}>
                            <Button variant="contained" className={classes.logout} color="secondary" onClick={logout}>Log out</Button>
                        </div>
                    ):(
                        <Button variant="contained" component={Link} to='/auth' color="primary">Sign in</Button>
                    )}
                </Toolbar>
            </div>
        </AppBar>
        </>
    )
}
