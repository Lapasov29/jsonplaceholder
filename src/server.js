const express = require('express');
const fs = require('fs');
const app = express()
const PORT = process.env.PORT || 3000
let data = fs.readFileSync('./src/database/posts.json', 'utf-8')
let comments = fs.readFileSync('./src/database/comments.json', 'utf-8')

app.use(express.json())
app.use(express.text())


comments = JSON.parse(comments)
data = JSON.parse(data)
app.get("/posts", (req, res) => {
    res.json(
        data
    )
})
app.get('/posts/:id', (req, res) => {
    res.json(
        data.find(post => post.id == req.params.id)
    )
})

app.get('/posts/:id/comment', (req, res) => {
    res.json(
        comments.filter(com => com.postId == req.params.id)
    )
})

app.get('/comments?', (req, res) => {
    res.json(
        comments.filter(com => com.postId == req.query.postId)
    )
})

app.post('/posts', (req, res) => {
    let id = data[data.length - 1].id + 1
    let userId = (id - 1) % 10 == 0 ? data[data.length - 1].userId + 1 : data[data.length - 1].userId
    if(req.body.title && req.body.body){
        let obj = {
            userId,
            id,
            title: req.body.title,
            body: req.body.body
        }
        data.push(obj)
        fs.writeFileSync('./src/database/posts.json', JSON.stringify(data, null, 4))
        return res.json({
			message: "The new post is added!",
            data: obj
		}).status(200)
    }else{
        res.json({
			message: "Invalid input!",
		}).status(404)
    }
})

app.put('/posts/:id', (req, res) => {
    let change = data.find(post => post.id == req.params.id)
    if(change){
        change.title = req.body.title ? req.body.title : change.title
        change.body = req.body.body ? req.body.body : change.body
        console.log(change);
        fs.writeFileSync('./src/database/posts.json', JSON.stringify(data, null, 4))
        res.json({
            message: "The post has been updated!",
            data: change
        }).status(200)
    }else{
        res.json({
			message: "There is no such post!",
		}).status(404)
    }
})

app.delete('/posts/:id', (req, res) => {
    let find = data.find(post => post.id == req.params.id)
    if(find){
        let change = data.splice(data.findIndex(post => post.id == req.params.id), 1)
		res.json({
			message: "The post has been deleted",
			data: change
		}).status(201)
	}else{
		res.json({
			message: "There is no such post!"
		}).status(404)
	}
    fs.writeFileSync('./src/database/posts.json', JSON.stringify(data, null, 4))
})

app.listen(PORT, () => console.log('Server is running on http://192.168.1.253:' + PORT))