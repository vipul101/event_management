const db = require("../db/connection.js");
const Event = require("../models/event.js");
var jwt = require('jsonwebtoken');

async function createEvent(req, res) {
    try{
        const { event_name, description, category, start_time, duration,end_date, is_online, location, is_free , price } = req.body;
        
        let token = req.headers.authorization;
        const newEvent = Event.build({
            'id': null,
            'name': event_name,
            'description': description,
            'auther': getAuther(token),
            'start_date': start_time,
            'end_date': end_date,
            'duration': duration,
            'category_id': category,
            'is_online': is_online,
            'location': location,
            'is_free': is_free,
            'price': price,
            'image': req.file.filename
        });
        console.log(newEvent);
        await newEvent.save();
        res.status(201).json(newEvent);
    }
    catch(e){

    }
}

async function getAllEvents(req, res) {
    try{
        const events = await Event.findAll();
        events.sort((a,b) => {
            return a.start_date - b.start_date;
        });
        res.status(200).json(events);
    }
    catch(e){
    }
}

async function getMyEvents(req, res) {
    try{
        let token = req.headers.authorization;
        const events = await Event.findAll();
        res.status(200).json(events);
    }
    catch(e){
        console.log(e);
    }
}

async function getEventById(req,res){
    try{
        const event = await Event.findByPk(req.params.id);
        res.status(200).json(event);
    }
    catch(e){
        console.log(e);
    }
}

function getAuther(token){
    let user = jwt.decode(token.split(' ')[1]).username;
    console.log(user);
    return user;
}

module.exports = {
    createEvent,
    getAllEvents,
    getMyEvents,
    getEventById
}