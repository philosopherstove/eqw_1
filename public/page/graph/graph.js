console.log('graph');

/**************
graph component
***************/
app.component.graphs = {};
/***
func
****/
app.component.graphs.func           = {};
app.component.graphs.func.createSet = {};
app.component.graphs.func.make      = {};
/******
setting
*******/
app.component.graphs.setting = {};
/* clicks */
app.component.graphs.setting.clicks          = {};
app.component.graphs.setting.clicks.labels   = [];
app.component.graphs.setting.clicks.datasets = [];
/* events */
app.component.graphs.setting.events          = {};
app.component.graphs.setting.events.labels   = [];
app.component.graphs.setting.events.datasets = [];
/* impressions */
app.component.graphs.setting.impressions          = {};
app.component.graphs.setting.impressions.labels   = [];
app.component.graphs.setting.impressions.datasets = [];
/* revenue */
app.component.graphs.setting.revenue          = {};
app.component.graphs.setting.revenue.labels   = [];
app.component.graphs.setting.revenue.datasets = [];



/*
*************
func hotkeys:
*************
CREATESET
app.component.graphs.func.createSet.datasets = ()=>{
app.component.graphs.func.createSet.labels = ()=>{
MAKE
app.component.graphs.func.make.eventsGraph = ()=>{
app.component.graphs.func.make.clicksGraph = ()=>{
app.component.graphs.func.make.impressionsGraph = ()=>{
app.component.graphs.func.make.revenueGraph = ()=>{
*/



app.component.graphs.func.createSet.datasets = ()=>{
    return new Promise((resolve)=>{
        let backgroundColor = [
            'rgba(33, 130, 197, 0.7)',
            'rgba(202, 48, 67, 0.7)',
            'rgba(240, 150, 69, 0.7)',
            'rgba(51, 157, 75, 0.7)'
        ];
        let borderColor = [
            'rgb(33, 130, 197)',
            'rgb(202, 48, 67)',
            'rgb(240, 150, 69)',
            'rgb(51, 157, 75)'
        ];
        for(let i = 0; i < app.setting.data_poi.length; i++){ // loop data_poi
            let poi_id      = `poi_id_${app.setting.data_poi[i].poi_id}`;
            let poi_name    = app.setting.data_poi[i].name;
            let datasetObjs = {};
            for(let a = 0; a < app.setting.statTypes.length; a++){
                datasetObjs[app.setting.statTypes[a]] = {
                    label: poi_name,
                    backgroundColor: backgroundColor[i],
                    borderColor: borderColor[i],
                    borderWidth: 1,
                    hoverBorderWidth: 2,
                    data: []
                };
            };
            for(let a = 0; a < Object.keys(app.setting.data_byMonth).length; a++){
                let monthObj = app.setting.data_byMonth[Object.keys(app.setting.data_byMonth)[a]];
                /* clicks */
                if( monthObj[poi_id].clicks !== undefined){ // is stat for poi during month
                    datasetObjs.clicks.data.push(monthObj[poi_id].clicks);
                }
                else{ // no stat for poi during month, push 0 to datasetObj
                    datasetObjs.clicks.data.push(0);
                };
                /* events */
                if( monthObj[poi_id].events !== undefined){
                    datasetObjs.events.data.push(monthObj[poi_id].events);
                }
                else{
                    datasetObjs.events.data.push(0);
                };
                /* impressions */
                if( monthObj[poi_id].impressions !== undefined){
                    datasetObjs.impressions.data.push(monthObj[poi_id].impressions);
                }
                else{
                    datasetObjs.impressions.data.push(0);
                };
                /* revenue */
                if( monthObj[poi_id].revenue !== undefined){
                    datasetObjs.revenue.data.push(monthObj[poi_id].revenue);
                }
                else{
                    datasetObjs.revenue.data.push(0);
                };
                if( a === Object.keys(app.setting.data_byMonth).length-1){ // end of loop
                    app.component.graphs.setting.clicks.datasets.push(datasetObjs.clicks); // push datasetObj to events dataset
                    app.component.graphs.setting.events.datasets.push(datasetObjs.events); // push datasetObj to events dataset
                    app.component.graphs.setting.impressions.datasets.push(datasetObjs.impressions); // push datasetObj to events dataset
                    app.component.graphs.setting.revenue.datasets.push(datasetObjs.revenue); // push datasetObj to events dataset
                    /* resolve point */
                    if( i === app.setting.data_poi.length-1){
                        resolve();
                    };
                };
            };
        };
    });
};


app.component.graphs.func.createSet.labels = ()=>{
    for(date in app.setting.data_byMonth){
        let monthNumber = Number(date.split('-')[1]) - 1;
        let month = app.setting.months[monthNumber];
        app.component.graphs.setting.clicks.labels.push(month);
        app.component.graphs.setting.events.labels.push(month);
        app.component.graphs.setting.impressions.labels.push(month);
        app.component.graphs.setting.revenue.labels.push(month);
    };
};


app.component.graphs.func.make.eventsGraph = ()=>{
    let line_events      = document.querySelector('#line_events')
    let ctx_lineEvents   = line_events.getContext('2d')
    let chart_lineEvents = new Chart(ctx_lineEvents, {
        type: 'bar',
        data: app.component.graphs.setting.events,
        options: {
            title: {
                text: 'Events',
                display: true
            }
        }
    });
};


app.component.graphs.func.make.clicksGraph = ()=>{
    let line_clicks      = document.querySelector('#line_clicks')
    let ctx_lineClicks   = line_clicks.getContext('2d')
    let chart_lineClicks = new Chart(ctx_lineClicks, {
        type: 'bar',
        data: app.component.graphs.setting.clicks,
        options: {
            title: {
                text: 'Clicks',
                display: true
            }
        }
    });
};


app.component.graphs.func.make.impressionsGraph = ()=>{
    let line_impressions      = document.querySelector('#line_impressions')
    let ctx_lineImpressions   = line_impressions.getContext('2d')
    let chart_lineImpressions = new Chart(ctx_lineImpressions, {
        type: 'bar',
        data: app.component.graphs.setting.impressions,
        options: {
            title: {
                text: 'Impressions',
                display: true
            }
        }
    });
};


app.component.graphs.func.make.revenueGraph = ()=>{
    let line_revenue      = document.querySelector('#line_revenue')
    let ctx_lineRevenue   = line_revenue.getContext('2d')
    let chart_lineRevenue = new Chart(ctx_lineRevenue, {
        type: 'bar',
        data: app.component.graphs.setting.revenue,
        options: {
            title: {
                text: 'Revenue',
                display: true
            }
        }
    });
};



/*************
INITIALIZATION
**************/
/* app inits */
app.func.retrieve.data_poi()
.then(async()=>{
    app.func.set.poiData_inDataByPOI();
});

app.func.retrieve.data()
.then(async()=>{
    await app.func.set.eventsData_inDataByDay();
    await app.func.set.statsData_inDataByDay();
    await app.func.set.data_inDataByMonth();
    await app.func.set.data_inDataByPOI();
    /* graph inits */
    app.component.graphs.func.createSet.labels();
    await app.component.graphs.func.createSet.datasets();
    app.component.graphs.func.make.clicksGraph();
    app.component.graphs.func.make.impressionsGraph();
    app.component.graphs.func.make.revenueGraph();
    app.component.graphs.func.make.eventsGraph();
});
