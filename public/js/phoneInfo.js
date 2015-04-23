var div = document.getElementById('phoneInfo');
$.getJSON('phone-data/Google.json', function (json) {
    console.log(json.length);
    for (var i = 0; i < json.length; i++) {
        div.innerHTML += json[i].name + "<br>";
    }
});
