import React from 'react'
import useStyles from './styles'
import { Card, CardActions, Typography, Button, ButtonBase, CardMedia, CardContent } from '@material-ui/core'
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt'
import ThumbUpAltOutlined from '@material-ui/icons/ThumbUpAltOutlined'
import DeleteIcon from '@material-ui/icons/Delete'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import moment from 'moment'
import { useDispatch } from 'react-redux'
import { deletePost, likePost } from '../../../actions/posts'
import { useHistory } from 'react-router-dom'

export default function Post({ post, setCurrentId }) {

    const classes = useStyles()
    const dispatch = useDispatch()
    const user = JSON.parse(localStorage.getItem('profile'))
    const history = useHistory()

    const openPost = () => {
        history.push(`/posts/${post._id}`)
    }

    const Likes = () => {
        if(post?.likes?.length > 0){
            return post.likes.find((like) => like === (user?.result?.googleId || user?.result?._id))?(
            <><ThumbUpAltIcon fontSize="small" />&nbsp;{post.likes.length > 2 ? `You and ${post.likes.length - 1} others` : `${post.likes.length} like${post.likes.length > 1 ? 's' : ''}` }</>
              ):(
            <><ThumbUpAltOutlined fontSize="small" />&nbsp;{post.likes.length} {post.likes.length === 1 ? 'Like' : 'Likes'}</>
            );
        }
        
        return <><ThumbUpAltOutlined fontSize="small" />&nbsp;Like</>;
    }

    return (
        <Card raised elevation={6} className={classes.card}>
            <ButtonBase className={classes.cardAction} onClick={openPost} component="span">
                <CardMedia className={classes.media} image={post.selectedFile || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'} title={post.title} />
                <div className={classes.overlay}>
                    <Typography variant='h6'>{post.name}</Typography>
                    <Typography variant='body2'>{moment(post.createdAt).fromNow()}</Typography>
                </div>
                {(user?.result?.googleId === post?.creator || user?.result?._id === post?.creator ) && (
                    <div className={classes.overlay2}>
                        <Button 
                            style={ { color: 'white' } } 
                            size="small" 
                            onClick={e => { 
                                e.stopPropagation();
                                setCurrentId(post._id)
                            }}>
                            <MoreHorizIcon fontSize="default" />
                        </Button>
                    </div>
                )}
                <div className={classes.details}>
                    <Typography variant='body2' color="textSecondary">{post.tags.map(tag => `#${tag} `)}</Typography>
                </div>
                <Typography className={classes.title} variant='h5' gutterBottom>{post.title}</Typography>

                <CardContent>
                    <Typography variant='body2' component='p' color="textSecondary">{(post.message.length < 80)?post.message:post.message.substring(0,42).concat(' ....more')}</Typography>
                </CardContent>
            </ButtonBase>
            <CardActions>
                <Button disabled={!user?.result} size="small" color="primary" onClick={() => dispatch(likePost(post._id))}>
                    <Likes />
                </Button>
                {(user?.result?.googleId === post?.creator || user?.result?._id === post?.creator) && (
                    <Button size="small" color="primary" onClick={() => dispatch(deletePost(post._id))} >
                        <DeleteIcon fontSize="small" />
                        Delete
                    </Button>)
                }
            </CardActions>

        </Card>
    )
}
