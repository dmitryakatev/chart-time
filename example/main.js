
var div = document.querySelector('.container');
var points = document.querySelector('.count-points');
var time = document.querySelector('.processing');

var source1 = createSource(new Date(), 14000, 'wrap.datetime', [3, 7]);
var source2 = createSource(new Date(), 14000, 'datetime', [1, 10]);
var source3 = createSource(new Date(), 4000, 'datetime', [10, 30]);
var source4 = createSource(new Date(), 4000, 'datetime', [11, 20]);

function update () {
    var countPoints = 0;

    countPoints += addData(source1, 'wrap.data1', [0.21, 0.25], [10, 20], [0.0011, 0.003]);   //серия 1
    countPoints += addData(source1, 'wrap.data2', [1000, 3000], [20, 30], [20, 60]);          //серия 2
    countPoints += addData(source1, 'wrap.data3', [500,  4000], [5,   7], [100, 150]);        //серия 3

    countPoints += addData(source2, 'filed_1',    [3000, 6000], [40, 50], [50, 90]);          //серия 4
    countPoints += addData(source2, 'filed_43',   [0.8,       1], [3,  15], [0.02, 0.3]);     //серия 5

    countPoints += addData(source3, 'prop_66',    [3.5,       5], [3,   4], [0.05, 0.01]);    //серия 6
    countPoints += addData(source3, 'prop_22',    [7000,  10000],  [30, 50], [100, 120]);     //серия 7
    countPoints += addData(source3, 'prop_99',    [12000,  15000],  [11, 18], [90, 110]);     //серия 8

    countPoints += addData(source4, 'lens.ter.ttt', [90000, 100000], [2, 5], [200, 250]);     //серия 9

    points.innerHTML = countPoints.toString();

    var time1 = new Date();
    // console.time('processing');
    
    chartGroup.load({
        source1: source1,
        source2: source2,
        source3: source3,
        source4: source4
    });

    var time2 = new Date();
    // console.timeEnd('processing');

    time.innerHTML = (time2.getTime() - time1.getTime()).toString();
}


var chartGroup = new ChartTime.ChartGroup({
    bindTo: div,
    isGroup: true,
    width: 800,
    height: 500,
    charts: [{
        name: 'one-chart',
        series: [{
            type: 'line',
            title: 'Серия 1',
            color: '#d3d3d3',
            source: 'source1',
            x: 'wrap.datetime',
            y: 'wrap.data1',
            scale: 'scale-two'
        }, {
            type: 'line',
            title: 'Серия 5',
            color: '#ff00bf',
            source: 'source2',
            x: 'datetime',
            y: 'filed_43',
            scale: 'scale-two'
        }, {
            type: 'line',
            title: 'Серия 6',
            color: '#d3d3d3',
            source: 'source3',
            x: 'datetime',
            y: 'prop_66',
            scale: 'scale-two'
        },{
            type: 'line',
            title: 'Серия 9',
            color: '#4d0000',
            source: 'source4',
            x: 'datetime',
            y: 'lens.ter.ttt',
            scale: 'scale-one'
        }]
    }, {
        name: 'two-chart',
        series: [{
            type: 'line',
            title: 'Серия 2',
            color: '#D2691E',
            source: 'source1',
            x: 'wrap.datetime',
            y: 'wrap.data2',
            scale: 'scale-three'
        }, {
            type: 'line',
            title: 'Серия 3',
            color: '#00008B',
            source: 'source1',
            x: 'wrap.datetime',
            y: 'wrap.data3',
            scale: 'scale-three'
        }, {
            type: 'line',
            title: 'Серия 4',
            color: '#8FBC8F',
            source: 'source2',
            x: 'datetime',
            y: 'filed_1',
            scale: 'scale-three'
        }]
    }, {
        name: 'three-chart',
        series: [{
            type: 'line',
            title: 'Серия 7',
            color: '#191970',
            source: 'source3',
            x: 'datetime',
            y: 'prop_22',
            scale: 'scale-four'
        }, {
            type: 'line',
            title: 'Серия 8',
            color: '#808000',
            source: 'source3',
            x: 'datetime',
            y: 'prop_99',
            scale: 'scale-four'
        }]
    }],

    scales: [{
        key: 'scale-one',
        right: true,
        index: 0,
        title: 'Шкала 1'
    }, {
        key: 'scale-two',
        right: false,
        index: 0,
        title: 'Шкала 2'
    }, {
        key: 'scale-three',
        right: false,
        index: 1,
        title: 'Шкала 3'
    }, {
        key: 'scale-four',
        right: false,
        index: 2,
        title: 'Шкала 4'
    }]
});

update();
