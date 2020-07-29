
app.func.config.routes = ()=>{
    /**********
    Serve Pages
    ***********/

    /* Home */
    exp.get('/', async(req, res)=>{
        console.log('TEST PAGE !');
        let pass = await app.func.rateLimiter(
            req,
            res,
            tokensGiven     = 0,
            expiry_SEC      = app.setting.tokenExpiry_0_SEC,
            regenRate_MS    = app.setting.tokenRegenRate_0_MS,
            throttleRate_MS = app.setting.tokenThrottleRate_0_MS
        );
        console.log('*** PASS', pass);
        if( pass){
            res.sendFile('/public/page/home/index.html');
        }
        else{
            res.send('Request limited reached');
        };
    });
    /* Graph */
    exp.get('/graph', async(req, res)=>{
        // if( await app.func.rateLimiter(req, res)){
        //     res.sendFile('/public/page/graph/index.html');
        // };
        console.log('GRAPH PAGE !');
        let pass = await app.func.rateLimiter(
            req,
            res,
            tokensGiven     = 3,
            expiry_SEC      = app.setting.tokenExpiry_0_SEC,
            regenRate_MS    = app.setting.tokenRegenRate_0_MS,
            throttleRate_MS = app.setting.tokenThrottleRate_0_MS
        );
        console.log('*** PASS', pass);
        if( pass){
            res.sendFile('/public/page/graph/index.html');
        }
        else{
            res.send('Request limited reached');
        };
    });
    /* Table */
    exp.get('/table', async(req, res)=>{
        // if( await app.func.rateLimiter(req, res)){
        //     res.sendFile('/public/page/table/index.html');
        // };
        console.log('TABLE PAGE !');
        let pass = await app.func.rateLimiter(
            req,
            res,
            tokensGiven     = 3,
            expiry_SEC      = app.setting.tokenExpiry_0_SEC,
            regenRate_MS    = app.setting.tokenRegenRate_0_MS,
            throttleRate_MS = app.setting.tokenThrottleRate_0_MS
        );
        console.log('*** PASS', pass);
        if( pass){
            res.sendFile('/public/page/table/index.html');
        }
        else{
            res.send('Request limited reached');
        };
    });
    /* Map */
    exp.get('/map', async(req, res)=>{
        // if( await app.func.rateLimiter(req, res)){
        //     res.sendFile('/public/page/map/index.html');
        // };
        console.log('MAP PAGE !');
        let pass = await app.func.rateLimiter(
            req,
            res,
            tokensGiven     = 3,
            expiry_SEC      = app.setting.tokenExpiry_0_SEC,
            regenRate_MS    = app.setting.tokenRegenRate_0_MS,
            throttleRate_MS = app.setting.tokenThrottleRate_0_MS
        );
        console.log('*** PASS', pass);
        if( pass){
            res.sendFile('/public/page/map/index.html');
        }
        else{
            res.send('Request limited reached');
        };
    });

    /* TEST */
    exp.get('/test', async(req, res)=>{
        console.log('TEST PAGE !');
        let pass = await app.func.rateLimiter(
            req,
            res,
            tokensGiven     = 0,
            expiry_SEC      = app.setting.tokenExpiry_0_SEC,
            regenRate_MS    = app.setting.tokenRegenRate_0_MS,
            throttleRate_MS = app.setting.tokenThrottleRate_0_MS
        );
        console.log('*** PASS', pass);
        if( pass){
            let ip = app.func.retrieve.ip_fromUser(req);
            res.send(ip);
        }
        else{
            res.send('Request limited reached');
        };
    });
};
