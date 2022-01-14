window.addEventListener("DOMContentLoaded", (event) => {
   const user = localStorage.getItem("lastuser");
   if(user!=null){
       setuserdata(JSON.parse(user))
   }
});

var searchbox = document.getElementById("searchbox");
searchbox.onchange = function () {
  const input = searchbox.value;
  let url='';
  // if input is not empty
  if (input.length > 0) {
    if (!isNaN(input)) {
      url = `http://employeesearchservice.voith.net/api/v1/employees/by/globalId/${input.substring(
        0,
        6
      )}`;
    } else if (isEmail(input)) {
      url = `http://employeesearchservice.voith.net/api/v1/employees/by/email/${input}`;
    }else{
      url = `http://employeesearchservice.voith.net/api/v1/employees/by/shortname/${input}`;
    }
    fetch(url).then((res) => {
        if(res.status==200){
          res.json().then((data) => {
            setuserdata(data);
          })
        }else{
            setemptyuser();
        }
  
      });
    searchbox.value = "";
  }
};
var profilename = document.querySelector(".profile-name");
var profiledescription = document.querySelector(".profile-description");
var costcenter = document.getElementById("costcenter");
var globalid = document.getElementById("globalid");
var company = document.getElementById("company");
function setuserdata(user) {
  profilename.innerHTML = `${user.firstname}, ${user.lastname}(${user.shortname})
    <p>${user.logonname}</p>`;
  profiledescription.innerHTML=``
  user.communications.forEach(element => {
    profiledescription.innerHTML +=`<p>${element.type}: ${element.value}</p>`
  });
  profiledescription.innerHTML +=`<p>City: ${user.city}, ${user.country}</p>`
  globalid.innerHTML=user.globalIdNumber;
  costcenter.innerHTML=user.costCentre;
  company.innerHTML=user.companyShortCut;
  localStorage.setItem("lastuser", JSON.stringify(user));
}
function setemptyuser(){
  profilename.innerHTML = `None,(blank)
    <p>blank</p>`;
  profiledescription.innerHTML=`<p>Phone: +91-123-456-7890</p>
  <p>Fax: +91-123-456-7890</p>
  <p>City: XYZ , ABC</p>`
  globalid.innerHTML='999999';
  costcenter.innerHTML='000000';
  company.innerHTML='VOITH'
}

//create function to check is email address
function isEmail(email) {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}


new ClipboardJS('.clipboard');