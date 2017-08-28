
var div = document.createElement("div");
document.body.appendChild(div);
/*
var config = {
    width: 600,
    // settings: {
    //
    // },
    legend: {
        // draggable: false,
    },
    charts: [{
        name: "chart1",
        series: [{
            type: "line",
            title: "speed 2",
            color: "#ffa95f",
            source: "speeds",
            x: "recordTime",
            y: "speed1",
            scale: "speedScale",
        }, {
            type: "line",
            title: "motor 1",
            color: "#ffff56",
            source: "speeds",
            x: "recordTime",
            y: "speed2",
            scale: "ign",
        }, {
            type: "rect",
            title: "ignition 1",
            color: "#feef56",
            source: "rect",
            opacity: 0.4,
            start: "0",
            finish: "1",
        }],
    }, {
        name: "chart2",
        series: [{
            type: "line",
            title: "speed 2",
            color: "#ffa95f",
            source: "speeds",
            x: "recordTime",
            y: "data1",
            scale: "big",
        }, {
            type: "line",
            title: "motor 2",
            color: "#ffff56",
            source: "speeds",
            x: "recordTime",
            y: "data2",
            scale: "big",
        }, {
            type: "line",
            title: "ignition 2",
            color: "#feef56",
            source: "speeds",
            x: "recordTime",
            y: "speed1",
            scale: "speedScale",
        }],
    }],
    scales: [{
        key: "speedScale",
        index: 0,
        title: "speed",
    }, {
        key: "big",
        index: 0,
        right: true,
    }, {
        key: "ign",
        index: 0,
        title: "ignition",
    }],
    source: db
};

var chartGroup = new ChartTime.ChartGroup(div, config);
*/

var config = {
    bindTo: div,
    series: [{
        type: "line",
        title: "speed 2",
        color: "#ffa95f",
        source: "speeds",
        x: "recordTime",
        y: "speed1",
        scale: "speedScale",
    }, {
        type: "line",
        title: "motor 1",
        color: "#ffff56",
        source: "speeds",
        x: "recordTime",
        y: "speed2",
        scale: "ign",
    }, {
        type: "rect",
        title: "ignition 1",
        color: "#feef56",
        source: "rect",
        opacity: 0.4,
        start: "0",
        finish: "1",
    }],
    scales: [{
        key: "speedScale",
        index: 0,
        title: "speed",
    }, {
        key: "big",
        index: 0,
        right: true,
    }, {
        key: "ign",
        index: 0,
        title: "ignition",
    }],
    source: db,
};

var chart = new ChartTime(div, config);