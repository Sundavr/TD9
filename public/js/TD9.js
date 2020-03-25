$(function() {
    updateNbRequests()
    setInterval(updateNbRequests, 30000)
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
        console.log(URL)
        $.getJSON(URL, (data) => {
            if ($('#result').length == 0) {
                $('#sendDiv').after('<br><div id="result"></div>')
                $('#result').append('<label id="distanceLabel"> distance : </label>' +
                                    '<p id="distance" class="inline">' + data.distance + '</p>')
            } else {
                $('#result > #distance').html(data.distance)
            }
            updateNbRequests()
        }).fail((error) => {
            errorHandler(error)
        })
    }
}

function updateNbRequests() {
    $.getJSON("nbRequests", (data) => {
        data.forEach((element) => {
            let user = element[0]
            let nbRequests = element[1]
            if ($('#requestsList > #' + user).length == 0) {
                $("#requestsList").append('<li id="' + user + '">' + user + ' : ' + nbRequests + '</li>')
            } else { //déjà présent
                $('#requestsList > #' + user).html(user + ' : ' + nbRequests)
            }
        });
    });
}

function errorHandler(error) {
    let res = error.responseJSON
    alert(res.erreur)
}