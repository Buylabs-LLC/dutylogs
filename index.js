// Requirements
const express = require('express')
const config = require('./config.json')
const nocache = require('nocache')
const axios = require('axios')
const mysql = require('mysql2')
const https = require('https')
let dutytime = []

// Other consts 
const app = express();
const deptRouter = require('./routes/deptRouter')
const print = console.log

// App settings
app.set('view engine', 'ejs');
app.use(express.static('assets'))
app.set('etag', false)
app.disable('view cache');
app.use(nocache())
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
})

const sql = mysql.createConnection({
    host: config.sql.host,
    user: config.sql.user,
    password: config.sql.pass,
    database: config.sql.database,
    port: config.sql.port
 })
 
sql.connect()


// App routes
app.get('/', (req, res)=>{
    res.render('index', {
        siteName : 'Home',
        serverName : config.ServerName,
        icon       : config.iconUrl,
        navEnabled : config.NavEnabled,
        NavBtns : config.NavBtns,
        deptList : config.departments,
    })
})


// External routing
app.use('/dept', deptRouter)

app.get('/user/:user', (req, res)=>{
    const user = req.params.user
    getDutyTime(user)

    setTimeout(()=>{
        res.render('index', {
            siteName : `viewing ${user}`,
            serverName : config.ServerName,
            icon       : config.iconUrl,
            navEnabled : config.NavEnabled,
            NavBtns : config.NavBtns,
            deptList : config.departments,
            viewDept : true,
            dept : user,
            units : dutytime,
            timeConvertor: toHoursAndMinutes
        })
    }, 1000)
})

// Misc
setTimeout(() => {

    let headers =  {
        'Content-Type': 'application/x-www-form-urlencoded',
        'authorization': 'xLy7lI8lRFrZeSy2fjtZa5M3gdGeSRf4-8gzNYYVV3Rh5',
        'accept': 'application/json'
    }

    axios.post('https://license.tencreator.xyz/api/check/1', null ,{
        headers: headers
    })
    .then(res => {
        if (res.data.pass) {
            app.listen(config.port, () => {
                print('████████╗███████╗███╗   ██╗ ██████╗██████╗ ███████╗ █████╗ ████████╗ ██████╗ ██████╗ ')
                print('╚══██╔══╝██╔════╝████╗  ██║██╔════╝██╔══██╗██╔════╝██╔══██╗╚══██╔══╝██╔═══██╗██╔══██╗')
                print('   ██║   █████╗  ██╔██╗ ██║██║     ██████╔╝█████╗  ███████║   ██║   ██║   ██║██████╔╝')
                print('   ██║   ██╔══╝  ██║╚██╗██║██║     ██╔══██╗██╔══╝  ██╔══██║   ██║   ██║   ██║██╔══██ ')
                print('   ██║   ███████╗██║ ╚████║╚██████╗██║  ██║███████╗██║  ██║   ██║   ╚██████╔╝██║  ██ ')
                print('   ╚═╝   ╚══════╝╚═╝  ╚═══╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝')
                print('                                                                                     ')
                print('██████╗ ██╗   ██╗████████╗██╗   ██╗██╗      ██████╗  ██████╗ ███████╗                ')
                print('██╔══██╗██║   ██║╚══██╔══╝╚██╗ ██╔╝██║     ██╔═══██╗██╔════╝ ██╔════╝                ')
                print('██║  ██║██║   ██║   ██║    ╚████╔╝ ██║     ██║   ██║██║  ███╗███████╗                ')
                print('██║  ██║██║   ██║   ██║     ╚██╔╝  ██║     ██║   ██║██║   ██║╚════██║                ')
                print('██████╔╝╚██████╔╝   ██║      ██║   ███████╗╚██████╔╝╚██████╔╝███████║                ')
                print('╚═════╝  ╚═════╝    ╚═╝      ╚═╝   ╚══════╝ ╚═════╝  ╚═════╝ ╚══════╝                ')
                print('                                                                                     ')
    
                print('We successfully authenticated you with our authorisation servers!')    
                print(`Server started on ${config.port}`);
            });
        } else {
            print('We was unable to authenticate the service you are using!')
        }
    })


}, 1 * 1000);

function toHoursAndMinutes(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
  
    return { hours, minutes };
}

function getDutyTime (id) {
    dutytime = []
    let sqlQuery = `SELECT * FROM dutylogs WHERE id="${id}" ORDER BY time DESC;`

    setTimeout(()=>{
        sql.query(sqlQuery, (err, res, field)=>{
            if (err) console.log(err)
            dutytime = res
        })
    }, 2)
}
