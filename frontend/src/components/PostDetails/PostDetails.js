import React, { useEffect } from 'react'
import { Typography,Divider, CircularProgress, Paper } from '@material-ui/core'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { getPost, getPostsBySearch } from '../../actions/posts'
import useStyles from './styles'

const PostDetails = () => {
    
    const { post, posts, isLoading } = useSelector(state => state.posts)
    const classes = useStyles()
    const dispatch = useDispatch()
    const history = useHistory()
    const { id } = useParams()

    useEffect(() => {
        dispatch(getPost(id))
    }, [id, dispatch])

    useEffect(() => {
        if(post){
            dispatch(getPostsBySearch({ search: 'none', tags: post?.tags?.join(',')}))
        }
    }, [post, dispatch])
    
    if(!post) return null;
    
    if(isLoading){
        return (
            <Paper elevation={6} className={classes.loadingPaper} >
                <CircularProgress size="6em" />
            </Paper>
        )
    }

    const openPost = id => {
        history.push(`/posts/${id}`);
    }

    const recommendedPosts = posts.filter(({_id}) => _id !== post._id)
    
    return (
        <Paper elevation={6} style={{ padding: '20px', borderRadius: '15px' }}>
            <div className={classes.card}>
                <div className={classes.section}>
                <Typography variant="h3" component="h2">{post.title}</Typography>
                <Typography gutterBottom variant="h6" color="textSecondary" component="h2">{post?.tags?.map((tag) => `#${tag} `)}</Typography>
                <Typography gutterBottom variant="body1" component="p">{post.message}</Typography>
                <Typography variant="h6">Created by: {post.name}</Typography>
                <Typography variant="body1">{moment(post.createdAt).fromNow()}</Typography>
                <Divider style={{ margin: '20px 0' }} />
                </div>
                <div className={classes.imageSection}>
                    <img className={classes.media} src={post.selectedFile || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'} alt={post.title} />
                </div>
            </div>
            {(recommendedPosts.length > 0) && (
                <div className={classes.section}>
                    <Typography variant="h5" gutterBottom>You might also like</Typography>
                    <Divider />
                    <div className={classes.recommendedPosts}>
                        {recommendedPosts.map(({ title, message, name, likes, selectedFile, _id }) => (
                            <div key={_id} style={{ margin: '20px', cursor: 'pointer', maxWidth: '250px', textAlign: 'center' }} onClick={() => openPost(_id)}>
                                <img src={selectedFile} width='200px' height="150px" alt={title}/>
                                <Typography gutterBottom variant='h6'>{title}</Typography>
                                <Typography gutterBottom variant='subtitle2'>{name}</Typography>
                                <Typography gutterBottom variant='subtitle2'>{(message.length < 50)?message:message.substring(0,45).concat('...')}</Typography>
                                <Typography gutterBottom variant='subtitle1'>Likes: {likes.length}</Typography>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </Paper>
    )
}

export default PostDetails;
