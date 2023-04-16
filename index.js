// Requirements
const express = require('express')
const config = require('./config.json')
const mysql = require('mysql2')
const axios = require('axios')
const chalk = require('chalk')
let info = `Dutylogs`;
let dutytime = []
licenseCheck(config.license, 1)

// Other consts
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
const app = express();
const deptRouter = require('./routes/deptRouter')
const print = console.log

// App settings
app.set('view engine', 'ejs');
app.set('etag', false)
app.disable('view cache');
app.use(express.static('assets'))
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
app.listen(config.port, () => {
    print(`Server started on ${config.port}`);
});

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


// ████████╗ ██████╗ ██╗   ██╗ ██████╗██╗  ██╗    ████████╗██╗  ██╗██╗███████╗    ███████╗██╗   ██╗███╗   ██╗ ██████╗████████╗██╗ ██████╗ ███╗   ██╗
// ╚══██╔══╝██╔═══██╗██║   ██║██╔════╝██║  ██║    ╚══██╔══╝██║  ██║██║██╔════╝    ██╔════╝██║   ██║████╗  ██║██╔════╝╚══██╔══╝██║██╔═══██╗████╗  ██║
//    ██║   ██║   ██║██║   ██║██║     ███████║       ██║   ███████║██║███████╗    █████╗  ██║   ██║██╔██╗ ██║██║        ██║   ██║██║   ██║██╔██╗ ██║
//    ██║   ██║   ██║██║   ██║██║     ██╔══██║       ██║   ██╔══██║██║╚════██║    ██╔══╝  ██║   ██║██║╚██╗██║██║        ██║   ██║██║   ██║██║╚██╗██║
//    ██║   ╚██████╔╝╚██████╔╝╚██████╗██║  ██║       ██║   ██║  ██║██║███████║    ██║     ╚██████╔╝██║ ╚████║╚██████╗   ██║   ██║╚██████╔╝██║ ╚████║
//    ╚═╝    ╚═════╝  ╚═════╝  ╚═════╝╚═╝  ╚═╝       ╚═╝   ╚═╝  ╚═╝╚═╝╚══════╝    ╚═╝      ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝
                                                                                                                                                 
//  █████╗ ███╗   ██╗██████╗     ██╗   ██╗ ██████╗ ██╗   ██╗██████╗     ██████╗ ███████╗ █████╗ ██████╗     ██╗                                     
// ██╔══██╗████╗  ██║██╔══██╗    ╚██╗ ██╔╝██╔═══██╗██║   ██║██╔══██╗    ██╔══██╗██╔════╝██╔══██╗██╔══██╗    ██║                                     
// ███████║██╔██╗ ██║██║  ██║     ╚████╔╝ ██║   ██║██║   ██║██████╔╝    ██║  ██║█████╗  ███████║██║  ██║    ██║                                     
// ██╔══██║██║╚██╗██║██║  ██║      ╚██╔╝  ██║   ██║██║   ██║██╔══██╗    ██║  ██║██╔══╝  ██╔══██║██║  ██║    ╚═╝                                     
// ██║  ██║██║ ╚████║██████╔╝       ██║   ╚██████╔╝╚██████╔╝██║  ██║    ██████╔╝███████╗██║  ██║██████╔╝    ██╗                                     
// ╚═╝  ╚═╝╚═╝  ╚═══╝╚═════╝        ╚═╝    ╚═════╝  ╚═════╝ ╚═╝  ╚═╝    ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═════╝     ╚═╝  

async function licenseCheck(licenseKey, uniqueId) {

    // Initial Check
    let checkres = await axios({
        method: 'POST', // Post Request
        url: `https://license.tencreator.xyz/api/check/${uniqueId}`, // Your domain with your license key at the end
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': licenseKey, },
        params: { info: `${info} - Boot`, }
    });
    if (checkres.data.pass) { // If Authorization is accepted
        console.log(chalk.bold.red('[LICSYS]: ') + chalk.bold.blue('The License System Has Passed.'));
    } else { // If authorization is failed
        console.log(chalk.bold.red('[LICSYS]: ') + chalk.bold.green('NOT FOUND - License key not found - https://license.tencreator.xyz'))
        process.exit(1) // Terminate the NodeJS Application
    }
    
    // Timed check to repeat ever hour
    setInterval(async () => {
        let checkres = await axios({
            method: 'POST', // Post Request
            url: `https://license.tencreator.xyz/api/check/${uniqueId}`, // Your domain with your license key at the end
            headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': licenseKey, },
            params: { info: `${info} - Check`, }
        });
        if (checkres.data.authorized) { // If Authorization is accepted
            // console.log(chalk.bold.blue('The License System Has Passed.'));
        } else { // If authorization is failed
            let bothfailed = true
            await new Promise(resolve => setTimeout(()=>{
                if (checkres.data.authorized) {
                    bothfailed = false
                }
            }, 3600000))
            if (bothfailed) {
                console.log(chalk.bold.red('[LICSYS]: ') + chalk.bold.green('NOT FOUND - License key not found - https://license.tencreator.xyz'))
                process.exit(1) // Terminate the NodeJS Application
            }
        }
    }, 3600000); // Every 1 hour == 3600000
}