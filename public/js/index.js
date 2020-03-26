$(function() {
    $("#logoRef").attr("href", window.location.href + "dnaComparator");
    updateNbRequests()
    setInterval(updateNbRequests, 30000)
})

function updateNbRequests() {
    $.getJSON("nbRequests", (data) => {
        $("#nbRequests").html(data)
    }).fail((error) => {
        errorHandler(error)
    })
}

function errorHandler(error) {
    let res = error.responseJSON
    if (res != undefined) alert(res.erreur) //json
    else alert("error : " + error) //autre
}