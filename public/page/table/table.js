console.log('table');

/**************
table component
***************/
app.component.table = {};
/***
func
****/
app.component.table.func            = {};
app.component.table.func.event      = {};
app.component.table.func.give       = {};
app.component.table.func.makeAppend = {};



/*
*************
func hotkeys:
*************
EVENT
app.component.table.func.event.fuzzySearch = ()=>{
GIVE
app.component.table.func.give.filter_fuzzySearchEvent = ()=>{
MAKEAPPEND
app.component.table.func.makeAppend = ()=>{
*/



app.component.table.func.event.fuzzySearch = ()=>{
    let value = document.querySelector('.filter').value.trim().toLowerCase();
    let lis   = document.querySelectorAll("li");
    for(let i = 1; i < lis.length; i++){
        let li = lis[i];
        if( li.children[0].innerHTML.toLowerCase().indexOf(value) > -1
        ||  li.children[1].innerHTML.toLowerCase().indexOf(value) > -1
        ){
            if( li.children[0].innerHTML.toLowerCase().indexOf(value) > -1){
                li.children[0].classList.add('highlight');
            }
            else{
                li.children[0].classList.remove('highlight');
            };

            if( li.children[1].innerHTML.toLowerCase().indexOf(value) > -1){
                li.children[1].classList.add('highlight');
            }
            else{
                li.children[1].classList.remove('highlight');
            };
            li.style.display = '';
        }
        else{
            li.style.display = 'none';
        };
    };
    if(value.length === 0){
        for(let i = 0; i < lis.length; i++){
            let li = lis[i];
                li.children[0].classList.remove('highlight');
                li.children[1].classList.remove('highlight');
        };
    };
};


app.component.table.func.give.filter_fuzzySearchEvent = ()=>{
    let filter = document.querySelector('.filter');
        filter.addEventListener('keyup', app.component.table.func.event.fuzzySearch);
};


app.component.table.func.makeAppend = ()=>{
    return new Promise((resolve)=>{
        let html = ``;
        for(let i = 0; i < Object.keys(app.setting.data_byDay).length; i++){
            let date        = Object.keys(app.setting.data_byDay)[i];
            let dateSplits  = Object.keys(app.setting.data_byDay)[i].split('-');
            let monthNumber = Number(dateSplits[1]) - 1;
            let month       = app.setting.months[monthNumber];
            let dayNumber   = Number(dateSplits[2].split('T')[0]);
            let dayText     = `${month} ${dayNumber}`;
            for(let i = 0; i < Object.keys(app.setting.data_byDay[date]).length; i++){
                let poiName     = app.setting.name_byPOI[Object.keys(app.setting.data_byDay[date])[i]];
                let poiObj      = app.setting.data_byDay[date][Object.keys(app.setting.data_byDay[date])[i]];
                let impressions = poiObj.impressions;if( impressions === undefined){impressions = 0};
                let clicks      = poiObj.clicks;if( clicks === undefined){clicks = 0};
                let revenue     = poiObj.revenue;if( revenue === undefined){revenue = 0};
                let events      = poiObj.events;if( events === undefined){events = 0};
                html += `
                    <li class="${dayText} ${poiName}">
                        <p>${dayText}</p>
                        <p>${poiName}</p>
                        <p>${impressions}</p>
                        <p>${clicks}</p>
                        <p>${(revenue).toFixed(2)}</p>
                        <p>${events}</p>
                    </li>
                `;
            };
            if( i === Object.keys(app.setting.data_byDay).length-1){ // end of loop
                let table_ul = document.querySelector('.table_ul');
                    table_ul.insertAdjacentHTML('afterbegin', html);
                resolve();
            };
        };
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
    /* table inits */
    await app.component.table.func.makeAppend();
    app.component.table.func.give.filter_fuzzySearchEvent();
});
