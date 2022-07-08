import React, { useState } from "react";
import { Container, AppBar, TextField, Button, Grow, Grid, Paper } from '@material-ui/core'
import Posts from '../Posts/Posts'
import Form from '../Form/Form'
import { useDispatch } from "react-redux";
import { getPostsBySearch } from '../../actions/posts'
import useStyles from './styles'
import Pagination from '../Pagination/Pagination'
import { useHistory, useLocation } from 'react-router-dom'
import ChipInput from 'material-ui-chip-input'

function useQuery() {
    return new URLSearchParams(useLocation().search)
}

export default function Home() {

    const classes = useStyles()
    const query = useQuery()
    const history = useHistory()
    const page = query.get('page') || 1;
    const searchQuery = query.get('searchQuery');

    const [currentId,setCurrentId] = useState(null)
    const [search, setSearch] = useState('')
    const [tags, setTags] = useState([])

    const dispatch = useDispatch()

    const searchPost = () => {
        if(search.trim() || tags){
            dispatch(getPostsBySearch({ search, tags: tags.join(',') }))
            history.push(`/posts/search?searchQuery=${search || 'none'}&tags=${tags.join(',')}`)
        } else {
            history.push('/');
        }
    }

    const handleKeyPress = e => {
        if(e.keyCode === 13){
            searchPost()
        }
    }

    const handleAdd = tag => setTags([...tags, tag])

    const handleDelete = tag => setTags(tags.filter(t => t !== tag))

    return (
        <Grow in>
        <Container maxWidth="xl">
            <Grid className={classes.gridContainer} container justify="space-between" alignItems="stretch" spacing={3}>
            <Grid item xs={12} sm={6} md={9}>
                <Posts setCurrentId={setCurrentId} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <AppBar className={classes.appBarSearch} position="static" color="inherit">
                    <TextField fullWidth name="search" variant="outlined" label="Search Posts" value={search} onKeyPress={handleKeyPress} onChange={e => setSearch(e.target.value)} />
                    <ChipInput value={tags} variant="outlined" onAdd={handleAdd} onDelete={handleDelete} label="Search by Tags" style={{ margin: '10px 0' }} />
                    <Button className={classes.searchButton} variant="contained" color="secondary" onClick={searchPost}>Search</Button>
                </AppBar>
                <Form currentId={currentId} setCurrentId={setCurrentId} />
                {(!searchQuery && !tags.length && (
                    <Paper elevation={6} className={classes.pagination}>
                        <Pagination page={page}/>
                    </Paper>
                ))}
            </Grid>
            </Grid>
        </Container>
        </Grow>
    );
}
