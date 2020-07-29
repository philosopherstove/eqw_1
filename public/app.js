console.log("app");

/**
app
***/
const app = {};
/********
component
*********/
app.component = {};
/***
func
****/
app.func          = {};
app.func.retrieve = {};
app.func.set      = {};
/******
setting
*******/
app.setting              = {};
app.setting.data_byDay   = {};
app.setting.data_byMonth = {};
app.setting.data_byPOI   = {};
app.setting.data_events  = [];
app.setting.data_poi     = [];
app.setting.data_stats   = [];
app.setting.name_byPOI   = {};
app.setting.poiAmount    = 0;
app.setting.statTypes    = ['revenue', 'clicks', 'impressions', 'events'];
app.setting.months       = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];



/*
*************
func hotkeys:
*************
RETRIEVE
app.func.retrieve.data = ()=>{
app.func.retrieve.data_poi = ()=>{
SET
app.func.set.data_inDataByMonth = ()=>{
app.func.set.data_inDataByPOI = ()=>{
app.func.set.eventsData_inDataByDay = ()=>{
app.func.set.poiData_inDataByPOI = ()=>{
app.func.set.statsData_inDataByDay = ()=>{
*/



app.func.retrieve.data = ()=>{
    return new Promise((resolve)=>{
        let resolveCount = 0;
        /* events */
        fetch('/events')
        .then((resp)=>resp.json())
        .then((data)=>{
            app.setting.data_events = data;
            resolveCount++;
        })
        .catch((err)=>{
            console.log('err', err);
            resolveCount++;
        });
        /* stats */
        fetch(`/stats`)
        .then((resp)=>resp.json())
        .then((data)=>{
            app.setting.data_stats = data;
            resolveCount++;
        })
        .catch((err)=>{
            console.log('err', err);
            resolveCount++;
        });
        let check_resolveCount = setInterval(()=>{
            console.log('fetching...');
            if( resolveCount === 2){
                clearInterval(check_resolveCount);
                console.log('completed fetch!');
                resolve();
            };
        },100);
    });
};


app.func.retrieve.data_poi = ()=>{
    return new Promise((resolve)=>{
        let url = '/poi';
        fetch(url)
        .then((resp)=>resp.json())
        .then((data)=>{
            app.setting.data_poi = data;
            app.setting.poiAmount = data.length;
            resolve();
        })
        .catch((err)=>{
            console.log('err', err);
        });
    });
};


app.func.set.data_inDataByMonth = ()=>{
    return new Promise((resolve)=>{
        for(let i = 0; i < Object.keys(app.setting.data_byDay).length; i++){
            let key = Object.keys(app.setting.data_byDay)[i];
            let monthKey = key.split('-');
                monthKey = `${monthKey[0]}-${monthKey[1]}`;
            /* no month bucket */
            if( app.setting.data_byMonth.hasOwnProperty(monthKey) === false){ // no month bucket
                app.setting.data_byMonth[monthKey] = {}; // create month bucket
                for(poi_id in app.setting.data_byDay[key]){ // loop poi_ids
                    app.setting.data_byMonth[monthKey][poi_id] = {}; // create poi_id buckets
                    for(stat in app.setting.data_byDay[key][poi_id]){ // loop stats
                        app.setting.data_byMonth[monthKey][poi_id][stat] = app.setting.data_byDay[key][poi_id][stat]; // create stat
                    };
                };
            }
            else{ // is month bucket
                for(poi_id in app.setting.data_byDay[key]){ // loop poi_ids
                    /* no poi_id bucket */
                    if( app.setting.data_byMonth[monthKey].hasOwnProperty(poi_id) === false){ // no poi_id
                        app.settind.data_byMonth[monthKey][poi_id] = {}; // create poi bucket
                        for(stat in app.setting.data_byDay[key][poi_id]){ // loop stats
                            app.setting.data_byMonth[monthKey][poi_id][stat] = app.setting.data_byDay[key][poi_id][stat]; // create stat
                        };
                    }
                    else{ // is poi_id bucket
                        for(stat in app.setting.data_byDay[key][poi_id]){ // loop stats
                            /* no stat */
                            if( app.setting.data_byMonth[monthKey][poi_id].hasOwnProperty(stat) === false){
                                app.setting.data_byMonth[monthKey][poi_id][stat] = app.setting.data_byDay[key][poi_id][stat]; // create stat
                            }
                            else{ // is stat
                                app.setting.data_byMonth[monthKey][poi_id][stat] += app.setting.data_byDay[key][poi_id][stat]; // add to stat
                            };
                        };
                    };
                };
            };
            if( i === Object.keys(app.setting.data_byDay).length-1){ // end of loop
                resolve();
            };
        };
    });
};


app.func.set.data_inDataByPOI = ()=>{
    return new Promise((resolve)=>{
        for(let i = 0; i < Object.keys(app.setting.data_byDay).length; i++){
            let dayKey = Object.keys(app.setting.data_byDay)[i];
            let dayObj = app.setting.data_byDay[dayKey];
            for(let a = 0; a < Object.keys(dayObj).length; a++){
                let poiKey = Object.keys(dayObj)[a];
                let poiObj = dayObj[poiKey];
                /* no poiKey in data_byPOI obj */
                if( app.setting.data_byPOI.hasOwnProperty(poiKey) === false){
                    app.setting.data_byPOI[poiKey] = {};
                    for(let b = 0; b < Object.keys(poiObj).length; b++){
                        let statKey = Object.keys(poiObj)[b];
                        let stat    = poiObj[statKey];
                        app.setting.data_byPOI[poiKey][statKey] = stat;
                    };
                }
                else{ // has poi in data_byPOI obj
                    for(let b = 0; b < Object.keys(poiObj).length; b++){
                        let statKey = Object.keys(poiObj)[b];
                        let stat    = poiObj[statKey];
                        /* poi no statKey */
                        if( app.setting.data_byPOI[poiKey].hasOwnProperty(statKey) === false){
                            app.setting.data_byPOI[poiKey][statKey] = stat; // createSet stat
                        }
                        else{ // poi has statKey
                            app.setting.data_byPOI[poiKey][statKey] += stat; // add to stat
                        };
                    };
                };
                /* end of loops, resolve */
                if( a === Object.keys(dayObj).length-1
                &&  i === Object.keys(app.setting.data_byDay).length-1
                ){
                    resolve();
                };
            };
        };
    });
};


app.func.set.eventsData_inDataByDay = ()=>{
    return new Promise((resolve)=>{
        for(let i = 0; i < app.setting.data_events.length; i++){
            let obj  = app.setting.data_events[i];
            let date = obj.date;
            if( app.setting.data_byDay.hasOwnProperty(date) === false){ // no date bucket
                app.setting.data_byDay[date] = {}; // create date bucket
                app.setting.data_byDay[date][`poi_id_${obj.poi_id}`] = {}; // create poi bucket
                app.setting.data_byDay[date][`poi_id_${obj.poi_id}`].events = obj.events; // createSet events
            }
            else{
                if( app.setting.data_byDay[date].hasOwnProperty(`poi_id_${obj.poi_id}`) === false){ // date bucket, but no poi bucket
                    app.setting.data_byDay[date][`poi_id_${obj.poi_id}`] = {}; // create poi bucket
                    app.setting.data_byDay[date][`poi_id_${obj.poi_id}`].events = obj.events; // createSet events
                }
                else{ // has date and poi bucket, add events
                    app.setting.data_byDay[date][`poi_id_${obj.poi_id}`].events += obj.events; // add events
                };
            };
            if( i === app.setting.data_events.length-1){ // end of loop
                resolve();
            };
        };
    });
};


app.func.set.poiData_inDataByPOI = ()=>{
    for(let i = 0; i < app.setting.data_poi.length; i++){
        let obj     = app.setting.data_poi[i];
        let idNum   = obj.poi_id;
        let poi_id  = `poi_id_${idNum}`;
        let poiName = obj.name;
        app.setting.name_byPOI[poi_id] = poiName;
    };
};


app.func.set.statsData_inDataByDay = ()=>{
    return new Promise((resolve)=>{
        for(let i = 0; i < app.setting.data_stats.length; i++){
            let obj  = app.setting.data_stats[i];
            let date = obj.date;
            if( app.setting.data_byDay.hasOwnProperty(date) === false){ // no date bucket
                app.setting.data_byDay[date] = {}; // create date bucket
                app.setting.data_byDay[date][`poi_id_${obj.poi_id}`] = {}; // create poi bucket
                app.setting.data_byDay[date][`poi_id_${obj.poi_id}`].clicks      = obj.clicks; // createSet clicks
                app.setting.data_byDay[date][`poi_id_${obj.poi_id}`].impressions = obj.impressions; // createSet impressions
                app.setting.data_byDay[date][`poi_id_${obj.poi_id}`].revenue     = Number(obj.revenue); // createSet revenue
            }
            else{
                if( app.setting.data_byDay[date].hasOwnProperty(`poi_id_${obj.poi_id}`) === false){ // date bucket, but no poi bucket
                    app.setting.data_byDay[date][`poi_id_${obj.poi_id}`] = {}; // create poi bucket
                    app.setting.data_byDay[date][`poi_id_${obj.poi_id}`].clicks      = obj.clicks; // createSet clicks
                    app.setting.data_byDay[date][`poi_id_${obj.poi_id}`].impressions = obj.impressions; // createSet impressions
                    app.setting.data_byDay[date][`poi_id_${obj.poi_id}`].revenue     = Number(obj.revenue); // createSet revenue
                }
                else{ // has date and poi bucket, add clicks, impressions, and revenue
                    /* clicks */
                    if( app.setting.data_byDay[date][`poi_id_${obj.poi_id}`].hasOwnProperty('clicks') === false){ // no clicks bucket
                        app.setting.data_byDay[date][`poi_id_${obj.poi_id}`].clicks = obj.clicks; // createSet clicks bucket
                    }
                    else{ // has clicks bucket
                        app.setting.data_byDay[date][`poi_id_${obj.poi_id}`].clicks += obj.clicks; // add to clicks
                    };
                    /* impressions */
                    if( app.setting.data_byDay[date][`poi_id_${obj.poi_id}`].hasOwnProperty('impressions') === false){ // no impressions bucket
                        app.setting.data_byDay[date][`poi_id_${obj.poi_id}`].impressions = obj.impressions; // createSet impressions bucket
                    }
                    else{ // has impressions bucket
                        app.setting.data_byDay[date][`poi_id_${obj.poi_id}`].impressions += obj.impressions; // add to impressions
                    };
                    /* revenue */
                    if( app.setting.data_byDay[date][`poi_id_${obj.poi_id}`].hasOwnProperty('revenue') === false){ // no revenue bucket
                        app.setting.data_byDay[date][`poi_id_${obj.poi_id}`].revenue = Number(obj.revenue); // createSet revenue bucket
                    }
                    else{ // has revenue bucket
                        app.setting.data_byDay[date][`poi_id_${obj.poi_id}`].revenue += Number(obj.revenue); // add to revenue
                    };
                };
            };
            if( i === app.setting.data_stats.length-1){ // end of loop
                resolve();
            };
        };
    });
};
