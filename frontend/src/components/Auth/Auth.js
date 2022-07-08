import React, { useState } from 'react'
import { Typography, Paper, Grid, Container, Button, Avatar } from '@material-ui/core'
import useStyles from './styles'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Input from './Input'
import { GoogleLogin } from 'react-google-login'
import Icon from './icon'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { signin, signup } from '../../actions/auth'

export default function Auth() {

    const classes = useStyles()
    const dispatch = useDispatch()
    const history = useHistory()
    const initialState = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    }
    const [formData, setFormData] = useState(initialState)

    const [showPassword, setShowPassword] = useState(false)
    const [isSignup, setIsSignup] = useState(false);

    const handleSubmit = e => {
        e.preventDefault();
        if(isSignup){
            dispatch(signup(formData, history));
        } else {
            dispatch(signin(formData, history));
        }
    }

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const googleSucess = async (res) => {
        const result = res?.profileObj;
        const token = res?.tokenId

        try {
            dispatch( { type: "AUTH", data: { result, token } } );
            history.push('/');
        } catch (error) {
            console.log(error)
        }
    }

    const googleFailure = () => {
        console.log("Google sign in failed..")
    }

    const switchMode = () => {
        setIsSignup(prevState => !prevState)
        setShowPassword(false)
    }

    const handleShowPassword = () => setShowPassword(prevShowPass => !prevShowPass)

    return (
        <Container maxWidth='xs' component="main" >
            <Paper elevation={3} className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography variant="h5">{isSignup?'SIgn up':'Sign in'}</Typography>
                <form className={classes.form} onSubmit={handleSubmit} >
                    <Grid container spacing={2}>
                        {isSignup && (
                            <>
                            <Input autoFocus half name="firstName" label="First Name" handleChange={handleChange} />
                            <Input half name="lastName" label="Last Name" handleChange={handleChange} />
                            </>
                        ) }
                        <Input name="email" label="Email address" handleChange={handleChange} type="email" />
                        <Input name="password" label="Password" handleShowPassword={handleShowPassword} handleChange={handleChange} type={showPassword?'text':'password'} />
                        {isSignup && <Input name="confirmPassword" label="Confirm password" handleChange={handleChange} type='password' />}
                    </Grid>
                    <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit} >{isSignup?"Sign up":"Sign in"}</Button>
                    <GoogleLogin clientId="912764369929-37ook3gc70cenv8mrodkib61fhi0lc0v.apps.googleusercontent.com" 
                        render={(renderProps) => (
                            <Button className={classes.googleButton} color="primary" fullWidth onClick={renderProps.onClick} disabled={renderProps.disabled} startIcon={<Icon />} variant="contained" >
                                Google Sign in
                            </Button>
                        )} 
                        onSuccess={googleSucess} 
                        onFailure={googleFailure} 
                        cookiePolicy="single_host_origin"
                    />
                    <Grid container justify="flex-end" >
                        <Grid item>
                            <Button onClick={switchMode}>
                            {isSignup?"Already have an account? Sign In":"Don't have an account? Sign up"}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    )
}
