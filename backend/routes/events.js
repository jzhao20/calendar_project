const router = require('express').Router();
let events = require('../models/events.model');
const mongoose = require('mongoose');
let user = mongoose.model("users")
router.route('/add_event').post((req,res)=>{
    events.findOne({name:req.body.name}).then(event=>{
        if(event){
            return res.status(400).json({name:"name of event is already in use"})
        }
        else{
            const new_event = new events({
                name:req.body.name,
                event:[]
            });
            new_event.save().then(
                event=>{res.json(event)
                const id = event._id
                user.findById(jwt_payload.id).then(user_to_update=>{
                    let curr_events = user_to_update.events;
                    curr_events.push(id)
                    user_to_update.update({"$set":{events:curr_events}})
                })
                })
               .catch(err=>console.log(err))
        }
    })
})

router.route('/remove_event').post((req,res)=>{
    events.findOne({name:req.body.name}).then(event=>{
        if(!event){
            return res.status(400).json({event:"event doesn't exist"})
        }
        else{
            events.deleteOne({name:req.body.name}).catch(err=>console.log(err))
        }
    })
})

router.route('/add_individual_event').post((req,res)=>{
    events.findOne({name:req.body.name}).then(events=>{
        if(!events){
            return res.status(400).json({event:"event doesn't exist"})
        }
        else{
            let curr_i_events = events.event
            curr_i_events.push({
                name:req.body.i_name,
                date:req.body.date
            })
            events.update({'$set':{event:curr_i_events}})
        }
    })
})

module.exports = router;