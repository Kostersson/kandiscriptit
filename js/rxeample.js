var numbers = [1,2,3,4,5,6,7,8,9,10];
var stream = Rx.Observable.from(numbers)
    .filter(function(number){
        return number % 2 === 0;
    });
stream.subscribe(function(number){
        console.log(number);
    },
    function (err) {
        console.log('Error: ' + err);
    },
    function () {
        console.log('Valmis');
    });

var numbers = [1,2,3,4,5,6,7,8,9,10];
var stream = Rx.Observable.from(numbers)
    .filter(function(number){
        return number % 2 === 0;
    });
stream.subscribe(function(number){
    console.log(number);
});