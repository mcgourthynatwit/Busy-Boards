const express = require('express');
const router = express.Router();
const Whiteboard = require('./whiteboardModel.js')
router.post('/save', (req, res) => {
    console.log('trying to save')
    const data = req.body;
    
    const newWhiteboardData = new Whiteboard(data);

    newWhiteboardData.save()
        .then(() => {
            res.status(200).json({ msg: 'Data saved successfully' });
            console.log('good')
        })
        .catch((error) => {
            res.status(500).json({ msg: 'Sorry, internal server errors', error: error.message });
            console.log('not good ', error)
        });
});


module.exports = router