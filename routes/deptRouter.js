const express = require('express')
const config = require('../config.json')
const mysql = require('mysql2')
const router = express.Router();
// const sql = require('../index')
let units = [];

let print = console.log

const sql = mysql.createConnection({
   host: config.sql.host,
   user: config.sql.user,
   password: config.sql.pass,
   database: config.sql.database,
   port: config.sql.port
})

sql.connect()

router.get('/:deptName', (req, res) => {
    let dept = req.params.deptName.toUpperCase()
    getUnits(dept)
    
    setTimeout(()=>{
        res.render('index', {
            siteName : dept,
            serverName : config.ServerName,
            icon       : config.iconUrl,
            navEnabled : config.NavEnabled,
            NavBtns : config.NavBtns,
            deptList : config.departments,
            viewDept : true,
            dept : dept,
            units : units,
            timeConvertor: toHoursAndMinutes
        })
    }, 100)
})

function toHoursAndMinutes(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
  
    return { hours, minutes };
  }

function getUnits (dept) {
    units = []
    let sqlQuery = `SELECT * FROM dutylogs WHERE dept="${dept}" ORDER BY time DESC;`

    setTimeout(()=>{
        sql.query(sqlQuery, (err, res, field)=>{
            if (err) console.log(err)
            units = res
        })
    }, 2)
}

module.exports = router