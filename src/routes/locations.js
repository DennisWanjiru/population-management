const express = require('express')
const locationRouter = express.Router()
const Location = require("./../db/models/Location")

function addTotal(req,res,next){
    console.log("the response ",res.body)
    const {location} = res.body;
    Object.assign(location,{total: location.females + location.males })
   
    console.log("the stuff ", location)
    next()
}
locationRouter.route('/').get((req,res)=>{
    Location.find({}, (error,locations)=>{
        for (const location of locations) {
             Object.assign(location,{total: location.females + location.males })
        }
        res.status(200).json(locations)
    })
}).post((req,res)=>{
    let location = new Location(req.body)
    location.save();
    res.status(201).json(location)
});

locationRouter.route("/:id/add").post((req,res)=>{
    const {id} = req.params;
    Location.findById(id, (error,location)=>{
        if(error) return res.status(500).json(error)
        if(!!location){
            Object.assign(req.body, {parent:location._id})
            const sub = new Location(req.body)
            sub.save()
            res.status(200).json(location)
        }else{
            res.status(404).json({message:`Location with ID ${id} was not found`})
        }
     
    })
})

locationRouter.route('/:id').get( async (req,res)=>{
    const {id} = req.params
    Location.findById(id,async (error,location)=>{
        if(error) return res.json(500).json(error)
        if(!!location){
            let response = {
                location
            }
              Location.find({parent:id},(error,subs)=>{
                    response['subs'] = subs
                     res.json(response)
            })
        }else{
            res.status(404).json({message:`Location with ID ${id} was not found`})
        }
       
        
    })
},addTotal).patch((req,res)=>{
    const {id} = req.params
    Location.findById(id,(error,location)=>{
        if(!!location){
            if(req.body._id){
                delete req.body._id;
            }
            for (const item of Object.keys(req.body)) {
                location[item] = req.body[item]
            }
            location.save()
            res.status(200).json(location)
        }else{
            res.status(404).json({message:`Location with ID ${id} is not found`})
        }
        
    })
}).delete((req,res)=>{
    const {id} = req.params
    Location.findById(id,(error,location)=>{
        if(error) return res.status(400).json(error)
        if(!!location){
            location.remove(error=>{
                if (error) return res.status(400).json(error)
                res.status(204).json({message:"Location removed successfully"})
            })
           
        }else{
            res.status(404).send({message:`Location with ID  ${id} is not found `})
        }
        
    })
})

module.exports = locationRouter