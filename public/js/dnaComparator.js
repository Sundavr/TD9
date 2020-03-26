$(function() {
    var URL = window.location;
    var indexURL = URL.protocol + "//" + URL.host;
    $(".indexRef").attr("href", indexURL);
    $("#results").hide()
    $("#computeButton").on("click", computeSimilarities)
})

function computeSimilarities() {
    let user = $("#username").val()
    let A = $("#A").val()
    let B = $("#B").val()
    if (user.length == 0) {
        $("#username").attr("placeholder", "Type your username here")
        alert("You need to enter your username")
    } else if (A.length == 0) {
        $("#A").attr("placeholder", "Type the first DNA here")
        alert("You need to enter the first DNA (A)")
    } else if (B.length == 0) {
        $("#B").attr("placeholder", "Type the second DNA here")
        alert("You need to enter the second DNA (B)")
    } else {
        let URL = '/' + user + '/distance?A=' + A + "&B=" + B
        $.getJSON(URL, (data) => {
            console.log(data)
            $('#userResult').html("username : " + data.utilisateur)
            $('#dateResult').html(new Date(data.date).toLocaleString())
            $('#AResult').html("A : " + data.A)
            $('#BResult').html("B : " + data.B)
            $('#distanceResult').html("Distance : " + data.distance)
            $('#tempsResult').html("Temps de calcul (ms) : " + data.tempsCalcul)
            $('#nbInterrogationsResult').html("Interrogations minute : " + data.interrogationsMinute)
            $('#results').show()
        }).fail((error) => {
            errorHandler(error)
        })
    }
}

function hideResults() {
    $("#results").hide()
}

function errorHandler(error) {
    let res = error.responseJSON
    if (res != undefined) alert(res.erreur) //json
    else alert(error) //autre
}