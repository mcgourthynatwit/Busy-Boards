const express = require('express');
const router = express.Router();
const getWhiteboardModel = require('./whiteboardModel.js')

router.post('/save', (req, res) => {
    const { data, collectionName } = req.body; 
    console.log('trying to save', collectionName)

    const Whiteboard = getWhiteboardModel(collectionName);
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

router.get('/whiteboard', (req, res) => {

    const { taskID, collectionName } = req.query;
    console.log(taskID, "server", collectionName)
    if (!taskID || !collectionName) {
        return res.status(400).json({ msg: 'Missing taskID or collection name' });
    }

    const Whiteboard = getWhiteboardModel(collectionName);
    
    Whiteboard.find({ taskID: taskID })
        .then((whiteboardData) => {
            if (!whiteboardData || whiteboardData.length === 0) {
                console.log("no whiteboards found with task id")
                return res.status(404).json({ msg: 'No whiteboards found with the given taskID' });
            }
            console.log('all good here!')
            res.status(200).json(whiteboardData);
        })
        .catch((error) => {
            console.log('internal err ', error)
            res.status(500).json({ msg: 'Sorry, internal server errors', error: error.message });
        });
});



module.exports = router