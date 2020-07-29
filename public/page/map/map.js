console.log('map');

/************
map component
*************/
app.component.map = {};
/***
func
****/
app.component.map.func           = {};
app.component.map.func.createSet = {};
app.component.map.func.event     = {};
app.component.map.func.give      = {};
app.component.map.func.init      = {};
app.component.map.func.make      = {};
app.component.map.func.sort      = {};
/******
setting
*******/
app.component.map.setting                    = {};
app.component.map.setting.markers            = [];
app.component.map.setting.packets_nameAndObj = [];



/*
func hotkeys:
CREATESET
app.component.map.func.createSet.nameAndObjPackets = ()=>{
EVENT
app.component.map.func.event.clickDismissButton = ()=>{
app.component.map.func.event.intensityHighlight = ()=>{
GIVE
app.component.map.func.give.buttons_intensityHighlightEvent = ()=>{
INIT
app.component.map.func.init.map = ()=>{
SORT
app.component.map.func.sort.byMetric = (metric)=>{
*/



app.component.map.func.createSet.nameAndObjPackets = ()=>{
    for(let i = 0; i < Object.keys(app.setting.data_byPOI).length; i++){
        let key   = Object.keys(app.setting.data_byPOI)[i];
        let idNum = Number(key.split('_')[2]);
        let obj   = app.setting.data_byPOI[key];
        for(x of app.setting.data_poi){
            if( x.poi_id === idNum){
                let poiName = x.name;
                let packet = [ [poiName, obj] ];
                app.component.map.setting.packets_nameAndObj.push(packet);
            };
        };
    };
};


app.component.map.func.event.clickDismissButton = ()=>{
    let check_clickDismissButton = setInterval(()=>{
        let dismissButton = document.querySelector(".dismissButton");
        if( dismissButton !== null){
            dismissButton.click();
            clearInterval(check_clickDismissButton);
        };
    },10);
};


app.component.map.func.event.intensityHighlight = ()=>{
    let button = event.target;
    let sorted = null;
    let colors = ['red', 'orange', 'yellow', 'green'];

    if( button.classList.contains('impressions')){
        sorted = app.component.map.func.sort.byMetric('impressions');
    }
    else
    if( button.classList.contains('clicks')){
        sorted = app.component.map.func.sort.byMetric('clicks');
    }
    else
    if( button.classList.contains('revenue')){
        sorted = app.component.map.func.sort.byMetric('revenue');
    }
    else
    if( button.classList.contains('events')){
        sorted = app.component.map.func.sort.byMetric('events');
    };

    for(let i = 0; i < sorted.length; i++){
        let name = sorted[i][0][0];
        for(y of app.component.map.setting.markers){
            if(name === y.label.text){
                y.icon.url = `http://maps.google.com/mapfiles/ms/icons/${colors[i]}.png`;
                y.setMap();
                document.querySelector('button[title="Zoom in"]').click();
                document.querySelector('button[title="Zoom out"]').click();
            };
        };
    };
};


app.component.map.func.give.buttons_intensityHighlightEvent = ()=>{
    let buttons = document.querySelectorAll('.button');
    for(x of buttons){
        x.addEventListener('click', app.component.map.func.event.intensityHighlight);
    };
};


app.component.map.func.init.map = ()=>{

    let map = new google.maps.Map(
        document.getElementById('map'),
        {
            zoom: 13,
            center: {
                lat: 43.6708,
                lng: -79.3899
            }
        }
    );

    for(let i = 0; i < app.setting.data_poi.length; i++){
        let obj         = app.setting.data_poi[i];
        let lat         = obj.lat;
        let lng         = obj.lon;
        let name        = obj.name;
        let poi_id      = obj.poi_id;
        let poiKey      = `poi_id_${poi_id}`;
        let poiObj      = app.setting.data_byPOI[poiKey];
        let impressions = poiObj.impressions;
        let clicks      = poiObj.clicks;
        let revenue     = poiObj.revenue.toFixed(2);
        let events      = poiObj.events;
        let html = `
            <h3>${name}</h3>
            <p><span>Impressions: </span><span>${impressions}</span></p>
            <p><span>Clicks: </span><span>${clicks}</span></p>
            <p><span>Revenue: </span><span>${revenue}</span></p>
            <p><span>Events: </span><span>${events}</span></p>
        `;
        let infoWindow = new google.maps.InfoWindow(
            {
                content: html
            }
        );
        let marker = new google.maps.Marker(
            {
                id: name,
                map: map,
                label: {
                    text: name,
                    color: 'white',
                    fontSize: '20px'
                },
                position: {
                    lat: lat,
                    lng: lng
                },
                icon: {
                    url: 'http://maps.google.com/mapfiles/ms/icons/blue.png',
                    scaledSize: new google.maps.Size(50, 50)
                }
            }
        );
        marker.addListener('click', ()=>{
            infoWindow.open(map, marker);
        });
        app.component.map.setting.markers.push(marker);
    };

    let markerCluster = new MarkerClusterer(
        map,
        app.component.map.setting.markers,
        {
            imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
        }
    );
};


app.component.map.func.sort.byMetric = (metric)=>{
    return app.component.map.setting.packets_nameAndObj.sort((a, b)=>{
        let A = a[0][1][metric];
        let B = b[0][1][metric];
        let comparison = null;
        if( A < B){
            comparison = 1;
        }
        else
        if( A >= B){
            comparison = -1;
        };
        return comparison;
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
    /* map inits */
    app.component.map.func.init.map();
    app.component.map.func.createSet.nameAndObjPackets();
    app.component.map.func.give.buttons_intensityHighlightEvent();
    app.component.map.func.event.clickDismissButton();
});
