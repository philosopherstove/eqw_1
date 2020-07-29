/************
REQUIRED CODE
*************/
const express = require('express')
const exp     = express()
const pg      = require('pg')
const dotenv  = require('dotenv').config()
const redis   = require('redis');



/**********
MAIN OBJECT
***********/
const app = {};
/* func */
app.func           = {};
app.func.calc      = {};
app.func.config    = {};
app.func.connect   = {};
app.func.createSet = {};
app.func.init      = {};
app.func.is        = {};
app.func.listen    = {};
app.func.query     = {};
app.func.retrieve  = {};
app.func.setup     = {};
app.func.update    = {};
/* setting */
app.setting                        = {};
app.setting.db_redisClient         = null;
app.setting.db_postgresPool        = null;
app.setting.tokenExpiry_0_SEC      = 60;
app.setting.tokenRegenRate_0_MS    = 2000;
app.setting.tokenThrottleRate_0_MS = 500;


/*
*************
func hotkeys:
*************
CALC
app.func.calc.newTokenAmount = (obj)=>{
CONFIG
app.func.config.express = ()=>{
app.func.config.process = ()=>{
app.func.config.queries = ()=>{
app.func.config.routes = ()=>{
CONNECT
app.func.connect.db_postgresPool = ()=>{
app.func.connect.db_redisClient = ()=>{
CREATESET
app.func.createSet.userTokenPurse = (req)=>{
INIT
app.func.init = ()=>{
IS
app.func.is.exceedThrottleLimit = (objInRedis)=>{
app.func.is.exceedTokenPurse = (req, objInRedis)=>{
app.func.is.obj_inRedis = (req)=>{
LISTEN
app.func.listen.port = ()=>{
QUERY
app.func.query.postgresPool = (req, res, next)=>{
RATE LIMITER
app.func.rateLimiter = (req, res)=>{
RETRIEVE
app.func.retrieve.ip_fromUser = (req)=>{
UPDATE
app.func.update.userTokenPurse = (ip, objInRedis)=>{
*/


/***
CALC
****/
app.func.calc.newTokenAmount = (obj)=>{
    return new Promise((resolve)=>{
        let time_current     = Date.now();
        let time_lastRequest = obj.time;
        let time_elapsed     = time_current - time_lastRequest;
        let tokensCredited   = Math.floor(time_elapsed / regenRate_MS) + tokensGiven;
        let newTokenAmount   = obj.token + tokensCredited - 1; // -1 for decr
        console.log('NEW TOKEN AMOUNT', newTokenAmount);
        if( newTokenAmount > 10){
            newTokenAmount = 10;
        }
        else
        if( newTokenAmount < 0){
            newTokenAmount = 0;
        };
        resolve(newTokenAmount);
    });
};


/****
CONFIG
*****/
app.func.config.express = ()=>{
    /* Data Parsing */
    exp.use(express.urlencoded({extended: true}));
    exp.use(express.json());
    /* Static File Paths */
    exp.use(express.static('public'));
    exp.use(express.static('public/page'));
    exp.use(express.static('public/page/home'));
    exp.use(express.static('public/page/graph'));
    exp.use(express.static('public/page/table'));
    exp.use(express.static('public/page/map'));
};


app.func.config.process = ()=>{
    /* error handles */
    process.on('uncaughtException', (err)=>{
        console.log(`Caught exception: ${err}`);
        process.exit(1);
    });
    process.on('unhandledRejection', (reason, p)=>{
        console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
        process.exit(1);
    });
};


app.func.config.queries = ()=>{
    /***********
    Postgres GET
    ************/
    /* Events */
    exp.get('/events', (req, res, next)=>{
        req.sqlQuery = `
            SELECT *
            FROM public.hourly_events
            ORDER BY date
            LIMIT 5000
        `;
        return next();
    }, app.func.query.postgresPool);

    /* Poi */
    exp.get('/poi', (req, res, next)=>{
        req.sqlQuery = `
            SELECT *
            FROM public.poi;
        `;
        return next();
    }, app.func.query.postgresPool);

    /* Stats */
    exp.get('/stats', (req, res, next)=>{
        req.sqlQuery = `
            SELECT *
            FROM public.hourly_stats
            ORDER BY date
            LIMIT 5000
        `;
        return next();
    }, app.func.query.postgresPool);
};


app.func.config.routes = ()=>{
    /**********
    Serve Pages
    ***********/

    /* Home */
    // exp.get('/', async(req, res)=>{
    //     console.log('HOME PAGE !');
    //     let pass = await app.func.rateLimiter(
    //         req,
    //         res,
    //         tokensGiven     = 0,
    //         expiry_SEC      = app.setting.tokenExpiry_0_SEC,
    //         regenRate_MS    = app.setting.tokenRegenRate_0_MS,
    //         throttleRate_MS = app.setting.tokenThrottleRate_0_MS
    //     );
    //     console.log('*** PASS', pass);
    //     if( pass){
    //         let ip = app.func.retrieve.ip_fromUser(req);
    //         res.send(ip);
    //     }
    //     else{
    //         res.send('Request limited reached');
    //     };
    // });

    exp.get('/steven', async(req, res)=>{
        console.log('STEVEN PAGE !');
        // res.send('Steven Page');
        res.sendFile('/public/page/map/index.html');

        // let pass = await app.func.rateLimiter(
        //     req,
        //     res,
        //     tokensGiven     = 0,
        //     expiry_SEC      = app.setting.tokenExpiry_0_SEC,
        //     regenRate_MS    = app.setting.tokenRegenRate_0_MS,
        //     throttleRate_MS = app.setting.tokenThrottleRate_0_MS
        // );
        // console.log('*** PASS', pass);
        // if( pass){
        //     res.sendFile('/public/page/table/index.html');
        // }
        // else{
        //     res.send('Request limited reached');
        // };
    });
};


/*****
CONNECT
******/
app.func.connect.db_postgresPool = ()=>{
    app.setting.db_postgresPool = new pg.Pool(
        {
            host:     process.env.DB_HOST,
            port:     process.env.DB_PORT,
            database: process.env.DB_DATABASE,
            user:     process.env.DB_USER,
            password: process.env.DB_PASSWORD
        }
    );
};


app.func.connect.db_redisClient = ()=>{
    // app.setting.db_redisClient = redis.createClient(); // local
    app.setting.db_redisClient = redis.createClient(process.env.REDIS_URL); // deployed
    app.setting.db_redisClient.on('connect', ()=>{
        console.log('Connected to Redis...');
    })
};


/********
CREATESET
*********/
app.func.createSet.userTokenPurse = (req)=>{
    return new Promise((resolve)=>{
        console.log('CREATESET');
        let ip = app.func.retrieve.ip_fromUser(req);
        let keyValue = [
            `${ip}`,
            JSON.stringify({
                time: Date.now(),
                token: 10
            })
        ];
        app.setting.db_redisClient.set(keyValue, (err, result)=>{
            if(err){
                resolve(err);
            }
            else{
                app.setting.db_redisClient.expire(keyValue[0], expiry_SEC);
                resolve();
            };
        });
    });
};


/*
IS
**/
app.func.is.exceedThrottleLimit = (objInRedis)=>{
    return new Promise((resolve)=>{
        let obj              = JSON.parse(objInRedis);
        let time_current     = Date.now();
        let time_lastRequest = obj.time;
        let time_elapsed     = time_current - time_lastRequest;
        if( time_elapsed < throttleRate_MS){
            console.log('EXCEED THROTTLE LIMIT');
            resolve(true);
        }
        else{
            console.log("FALSE THOTTLE");
            resolve(false);
        };
    });
};


app.func.is.exceedTokenPurse = (req, objInRedis)=>{
    return new Promise(async(resolve)=>{
        let ip         = app.func.retrieve.ip_fromUser(req);
        let updatedObj = await app.func.update.userTokenPurse(ip, objInRedis);
            updatedObj = JSON.parse(updatedObj)
        if( updatedObj.token <= 0){ // no more tokens => TRUE exceedTokenPurse
            resolve(true);
        }
        else{
            resolve(false);
        };
    });
};


app.func.is.obj_inRedis = (req)=>{
    return new Promise((resolve)=>{
        let ip = app.func.retrieve.ip_fromUser(req);
        app.setting.db_redisClient.get(ip, (err, result)=>{
            if(err){
                resolve(false);
                throw err;
            }
            else{
                if(result === null){
                    resolve(false);
                }
                else{
                    resolve(result);
                };
            };
        });
    });
};


/*****
LISTEN
******/
app.func.listen.port = ()=>{
    exp.listen(
        process.env.PORT || 5555,
        (err)=>{
            if( err){
                console.error(err);
                process.exit(1);
            }
            else {
                console.log(`Running on ${process.env.PORT || 5555}`);
            };
        }
    );
};


/****
QUERY
*****/
app.func.query.postgresPool = (req, res, next)=>{
    app.setting.db_postgresPool.query(req.sqlQuery)
    .then((resp)=>{
        return res.json(resp.rows || []);
    }).catch(next);
};


/***********
RATE LIMITER
************/
app.func.rateLimiter = (req, res, tokensGiven, expiry_SEC, regenRate_MS, throttleRate_MS)=>{
    console.log('INSIDE RATE LIMITER');
    return new Promise(async(resolve)=>{
        try{
            let objInRedis = await app.func.is.obj_inRedis(req);
            if( objInRedis === false){
                app.func.createSet.userTokenPurse(req);
                resolve(true);
                return;
            }
            else{
                let exceedThrottleLimit = await app.func.is.exceedThrottleLimit(objInRedis);
                if( exceedThrottleLimit === true){ //=> NO SERVICE
                    resolve(false);
                    console.log('EXCEED THOTTLE');
                    return
                };
                let exceedRateLimit = await app.func.is.exceedTokenPurse(req, objInRedis);
                if( exceedRateLimit === true){ //=> SEND LIMIT MSG
                    resolve(false);
                    console.log('EXCEED TOKEN');
                    return;
                };
                resolve(true);
            };
        }
        catch(err){
            console.log('CAUGHT ERR', err);
        };
    });
};


/*******
RETRIEVE
********/
app.func.retrieve.ip_fromUser = (req)=>{
    let ip = req.connection.remoteAddress;
        ip = ip.replace('::ffff:', '');
    return ip;
};


/*****
UPDATE
******/
app.func.update.userTokenPurse = (ip, objInRedis)=>{
    return new Promise(async(resolve)=>{
        let obj       = JSON.parse(objInRedis);
            obj.token = await app.func.calc.newTokenAmount(obj);
            obj.time  = Date.now(); // must update time after newTokenAmount set, because newTokenAmount is calculated with elapsed time
            obj       = JSON.stringify(obj);
        let keyValue = [`${ip}`, obj];
        app.setting.db_redisClient.set(keyValue, (err, result)=>{
            if(err){
                resolve(err);
            }
            else{
                app.setting.db_redisClient.expire(keyValue[0], expiry_SEC);
                resolve(obj);
            };
        });
    });
};




/***
INIT
****/
app.func.init = ()=>{
    /* config */
    app.func.config.express();
    app.func.config.routes();
    app.func.config.queries();
    app.func.config.process();
    /* connect */
    app.func.connect.db_postgresPool();
    app.func.connect.db_redisClient();
    /* listen */
    app.func.listen.port();
};

app.func.init();
