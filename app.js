console.log("working");
// Initialize Firebase
var config = {
    apiKey: "AIzaSyCKgys7-xfJUFB3mLG8CedXixa-pl9RNOI",
    authDomain: "train-scheduler-b18ae.firebaseapp.com",
    databaseURL: "https://train-scheduler-b18ae.firebaseio.com",
    projectId: "train-scheduler-b18ae",
    storageBucket: "",
    messagingSenderId: "134521792873"
  };
  firebase.initializeApp(config);

// create a var to reference the database.
var database = firebase.database();
// windows scope variables

// On click button
$("#add-train").on("click", function() {
    event.preventDefault();
    console.log("clicked add-train button");
    
    // read values from inputs and storing them in variables
    var trainName = $("#input-train").val().trim();
    var destination = $("#input-destination").val().trim();
    var firstTrainTime = moment($("#input-first-train").val(), "HH:mm").format("HH:mm");
    var frequency = $("#input-frequency").val();
    var minsAway = calcMinsAway();
    console.log(minsAway);
    var nextTrain = moment().add(minsAway, "minutes");
    var nextArrival =  moment(nextTrain).format("hh:mm")
    function calcMinsAway() {
        var firstTimeConverted = moment(firstTrainTime, "HH:mm").subtract(1, "years");
        var currentTime = moment();
        console.log(moment(currentTime).format("hh:mm"));
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        console.log(diffTime);
        var tRemainder = diffTime % frequency;
        console.log(tRemainder);
        var tMinsAway = frequency - tRemainder;
        return tMinsAway;
    }
    

    var newTrain = {
        trainName: trainName,
        destination: destination,
        firstTrainTime: firstTrainTime,
        frequency: frequency,
        nextArrival: nextArrival,
        minsAway: minsAway
    };
    
    // upload new train data to the database.
    database.ref().push(newTrain);
    console.log(newTrain);

    $("#input-train").val("");
    $("#input-destination").val("");
    $("#input-first-train").val("");
    $("#input-frequency").val("");
        
});

database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());

    var trainName = childSnapshot.val().trainName;
    var destination = childSnapshot.val().destination;
    var firstTrainTime = childSnapshot.val().firstTrainTime;
    var frequency = childSnapshot.val().frequency;
    var nextArrival = childSnapshot.val().nextArrival;
    var minsAway = childSnapshot.val().minsAway;

    //create the new row
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(destination),
        $("<td>").text(firstTrainTime),
        $("<td>").text(frequency),
        $("<td>").text(nextArrival),
        $("<td>").text(minsAway)
    );

    $("#add-row").prepend(newRow)

});