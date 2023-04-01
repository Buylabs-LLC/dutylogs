const express = require('express')
const config = require('../config.json')
const router = express.Router();

router.get('/:deptName', (req, res) => {
    let dept = req.params.userId
    res.json('index', {
        siteName : 'Home',
        serverName : config.serverName,
        navEnabled : config.NavEnabled,
        NavBtns : config.NavBtns,
        deptList : config.departments,
        viewDept : true,
        dept : dept,
        units : null
    })
})

module.exports = router









// router.get('/', (req, res)=>{
//     res.render('index', {
//         siteName : 'Home',
//         serverName : config.serverName,
//         navEnabled : config.NavEnabled,
//         NavBtns : config.NavBtns,
//         deptList : config.departments,
//     })
// })