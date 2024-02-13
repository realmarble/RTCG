function getChar(){
    fetch("/api/random")
    .then(response => response.json())
    .then(data => {
        document.getElementById("name").innerHTML = data.name;
        document.getElementById("image").src = data.img;
        document.getElementById("image").alt = data.name;
        if (data.img != null) {
            document.getElementById("image").src = data.img;
            document.getElementById("image").alt = data.name;
        } else {
            document.getElementById("image").src = "https://via.placeholder.com/700x700.png?text=No+Image+Available";
            document.getElementById("image").alt = "No Image Available";
        }
        document.getElementById("image").style.display = "block";
        document.getElementById("text").innerHTML = data.text;
    })
}
function getCount(){
    fetch("/api/count")
    .then(response => response.json())
    .then(data => {
        document.getElementById("count").innerHTML = data;
    })
}