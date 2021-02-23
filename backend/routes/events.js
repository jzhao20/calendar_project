const router = require('express').Router();
let events = require('../models/events.model');
let event_types = require('../models/event_types.model')
const mongoose = require('mongoose');
let user = mongoose.model("users")
router.route('/add_event_type').get(async(req,res)=>{
    const event_list = await event_types.findOne()
    if(!event_list){
        const start = new event_types({
            events:[req.param('name')]
        });
        start.save()
        res.json(start)
    }
    else{
        const array_event_type = event_list.events
        var name_error = false
        for(var i = 0; i < array_event_type.length; i++){
            if(array_event_type[i]===req.param('name')){
                res.status(400).json({name:"event already exists"})
                name_error = true
            }
        }
        if(!name_error){
            array_event_type.push(req.param('name'))
            event_list.events = array_event_type
            await event_list.save()
            res.json(array_event_type)
        }
    }
})
router.route('/get_event_type').get(async (req,res)=>{
    const event_list = await event_types.findOne()
    res.json(event_list.events)
})
router.route('/add_event').post(async (req,res)=>{
    var event_list = await event_types.findOne()
    events.findOne({name:req.body.name}).then(event=>{
        if(event && event.event_category == req.body.event_category){
            return res.status(400).json({name:"event is already in use"})
        }
        else{
            var is_new_event = true
            var array_event_type = event_list.events
            for(var i = 0;i < array_event_type.length; i++){
                if(array_event_type[i]===req.body.event_category){
                    is_new_event = false
                }
            }
            if(is_new_event){
                array_event_type.push(req.body.event_category);
                event_list.events = array_event_type
                event_list.save()
            }
            //check to see if it's a new event first 

            const new_event = new events({
                event_name:req.body.name,
                event_category:req.body.event_category,
                date:req.body.date,
                aux: req.body.aux
            });
            new_event.save().then(
                event=>{
                res.json(event)
                const id = event._id
                //const find_id = jwt_payload.id
                const find_id = req.body.id;
                user.findById(find_id).then(user_to_update=>{
                    let curr_events = user_to_update.events;
                    curr_events.push(id)
                    user_to_update.events = curr_events
                    user_to_update.save()
                })
                })
               .catch(err=>console.log(err))
        }
    })
})
router.route('/update_event').post((req,res)=>{
    events.findById(req.body.id).then(event=>{
        if(!event){
            res.status(400).json({event:"Event doesn't exist"})
        }
        else{
            //update the data
            event.event_name = req.body.event_name
            event.event_category = req.body.event_category
            event_types.findOne().then(event_list=>{
                var list = event_list.events
                var found = false
                for(var i = 0; i < list.length; i++){
                    if(list[i] == event.event_category)
                    {
                        found = true
                    }
                }
                if(!found){
                    list.push(event.event_category)
                    event_list.events = list
                    event_list.save()
                }
            })
            event.date = req.body.date
            event.aux = req.body.aux
            event.save()
            res.json("successfully updated")
        }
    })
})
router.route('/remove_event').post((req,res)=>{
    events.findOne({_id:req.body.id}).then(event=>{
       if(!event){
           return res.status(400).json({event:"event doesn't exist"})
       }
       else{
          //const find_id = jwt_payload.id
          const find_id = req.body.user_id;
          user.findById(find_id).then(user_to_update=>{
              var array_of_events = user_to_update.events;
              for(var i = 0; i < array_of_events.length; i++){
                  if(array_of_events[i] == req.body.id){
                      array_of_events.splice(i,1);
                      break
                  }
              }
              user_to_update.events = array_of_events;
              user_to_update.save()
          });
          res.json("removed from array hopefully")
          //delete the event document
            event.remove()
            res.json("removed event")
        }
    })
})

router.route ('/remove_event_type').post((req,res)=>{
    const event_name = req.body.event_name
    event_types.findOne().then(event_list=>
        {
            
            var array_event_type = event_list.events
            var exists = -1
            for(var i = 0; i < array_event_type.length; i++){
                if(array_event_type[i] == event_name){
                    array_event_type.splice(i,1)
                    event_list.events = array_event_type
                    event_list.save()
                    exists = i
                    break
                }
            }
            if(exists === -1){
                res.status(400).json({event:"event type doesn't exist"})
            }
            else{
                events.find({event_category:event_name}).then(i_events=>{
                    for(var i = 0; i < i_events.length; i++){
                        i_events[i].event_category = ""
                        i_events[i].save()
                    }
                })
                res.json("finished")
                return;
            }
        })
})
router.route('/remove_event_type_and_events').post((req,res)=>{
    const event_name = req.body.event_name
    event_types.findOne().then(event_list=>
        {
            
            var array_event_type = event_list.events
            var exists = -1
            for(var i = 0; i < array_event_type.length; i++){
                if(array_event_type[i] == event_name){
                    array_event_type.splice(i,1)
                    event_list.events = array_event_type
                    event_list.save()
                    exists = i
                    break
                }
            }
            if(exists === -1){
                res.status(400).json({event:"event type doesn't exist"})
            }
            else{
                events.remove({event_category:event_name}, function(err,result){
                    if(err){
                        res.send(err)
                    }
                    else{
                        res.send(result)
                    }
                })
            }
        })
})
router.route('/update_event_type').get((req,res)=>{
    event_types.findOne().then(event_list=>{
        var array_event_type = event_list.events
        var found = false
        for(var i = 0; i < array_event_type.length; i++){
            if(array_event_type[i] == req.param("event_category")){
                event_list.events.set(i, req.param("new_event_category"))
                event_list.save()
                found = true
                break;
            }
        }
        if(!found)
        {
            res.status(400).json({event:"event not found"})
            return
        }
        else{
            events.updateMany({event_category:req.param("event_category")}, {$set:{event_category:req.param("new_event_category")}}, function(err,result){
            if(err)
                res.send(err)
            else
                res.send(result)
            })

        }
    })
})

router.route('/find_event_type').get((req,res)=>{
    console.log(req.param("event_category"))
    events.find({"event_category":req.param("event_category")}).then(i_events=>{
        res.json(i_events)
    })
})

module.exports = router;