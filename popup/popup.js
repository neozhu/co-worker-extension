window.addEventListener('DOMContentLoaded', (event) => {
   
});

var searchbox = document.getElementById("searchbox");
searchbox.onchange=function(){
    var input = searchbox.value;
    // if input is not empty
    if(input.length > 0){
        if(isEmail(input)){
            console.log("Email address");
            fetch('https://61dec78dfb8dae0017c2e274.mockapi.io/users').then(res=>{
                console.log(res.json().then(data=>{
                    setdata(data[0])
                    console.log(data)
                }))
            })
        }

        searchbox.value='';
    } 
}
var profilename = document.querySelector(".profile-name");
var profiledescription = document.querySelector(".profile-description");
var costcenter = document.getElementById("costcenter");
var globalid = document.getElementById("globalid");
var division = document.getElementById("division")
function setdata(user) {
profilename.innerHTML = ` zhu, hualin(zhuhua)
    <p>huali.zhu@voith.com</p>`
}

//create function to check is email address
function isEmail(email) {
    return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}