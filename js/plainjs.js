var stations = [];
var station = null;
var stationsUrl = "http://rata.digitraffic.fi/api/v1/metadata/stations";
var stationDataUrl = "ws://rata.digitraffic.fi/api/v1/websockets/websocket";
var socket = null;
var stompClient = null;

var onTime = 0;
var early= 0;
var cancelled = 0;
var late = 0;

var stationsSuccess = function (d) {
    d.forEach(function(i){
        stations.push({
            name: i.stationName,
            id: i.stationShortCode
        });
    });
    var $input = $('#station');
    $input.typeahead({
        source:stations,
        autoSelect: true,
        updater: updateStation
    });

};

var updateStation = function(item) {
    console.log(item);
    station = item;
    getStationData();
};

var findStation = function(x) {
    return x.stationShortCode === station.id;
};
var calculateStationData = function(data) {
    console.log(data);

    $("#station-name").html(station.name);

    data.forEach(function(train){
        if(train.cancelled){
            cancelled++;
            return;
        }
        train.timeTableRows.filter(findStation).forEach(function(row){
            if(row.hasOwnProperty("differenceInMinutes")){
                if(row.differenceInMinutes > 0) {
                    late++;
                }
                else if (row.differenceInMinutes < 0) {
                    early++;
                }
                else{
                    onTime++;
                }
                return;
            }
            onTime++;
        });
    });
    $("#early").html(early);
    $("#on-time").html(onTime);
    $("#late").html(late);
    $("#cancelled").html(cancelled);

};

function getStationData(){
    socket = new WebSocket(stationDataUrl);
    stompClient = Stomp.over(socket);
    stompClient.debug = null;
    stompClient.connect({}, function (frame) {
        stompClient.subscribe('/live-trains/station/' + station.id, function (messages) {
            calculateStationData(JSON.parse(messages.body));
        });
    });

}

function getStations(){
    $.ajax({
        dataType: "json",
        url: stationsUrl,
        success: stationsSuccess
    });
}

getStations();