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
      url = `https://employeesearchservice.voith.net/api/v1/employees/by/globalId/${input.substring(
        0,
        6
      )}`;
    } else if (isEmail(input)) {
      url = `https://employeesearchservice.voith.net/api/v1/employees/by/email/${input}`;
    }
    else if(input.indexOf('.') > 0) {
      const firstname = input.split('.')[0];
      const lastname = input.split('.')[1];
      const email = firstname.trim() + '.' + lastname.trim() + '@voith.com';
      url = `https://employeesearchservice.voith.net/api/v1/employees/by/email/${email}`;
    }
    else if(input.indexOf(',') > 0) {
        const lastname = input.split(',')[0];
        const firstname = input.split(',')[1];
        const email = firstname.trim() + '.' + lastname.trim() + '@voith.com';
        console.log(email)
        url = `https://employeesearchservice.voith.net/api/v1/employees/by/email/${email}`;
     
    } else {
      url = `https://employeesearchservice.voith.net/api/v1/employees/by/shortname/${input}`;
    }
    console.log(url)
    fetch(url).then((res) => {
        if(res.status==200){
          res.json().then((data) => {
            setuserdata(data);
          })
        }else{
            setemptyuser();
        }
      }).catch((err) => {
        const user = {
          firstname:faker.name.firstName(),
          lastname:faker.name.lastName(),
          shortname:faker.name.suffix(),
          logonname:faker.internet.email(),
          communications:[{type:'phone',value:faker.phone.phoneNumber()}],
          city:faker.address.city(),
          country:faker.address.country(),
          globalIdNumber:faker.datatype.number(),
          costCentre:faker.datatype.number(),
          companyShortCut:faker.company.companySuffix()
        }
        setuserdata(user);
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
    <p>${user.logonname} <i class="fa fa-clipboard"></i></p>`;
  profiledescription.innerHTML=``
  user.communications.forEach(element => {
    profiledescription.innerHTML +=`<p>${element.type}: ${element.value}</p>`
  });
  profiledescription.innerHTML +=`<p>City: ${user.city}, ${user.country}</p>`
  globalid.innerHTML=user.globalIdNumber + ' <i class="fa fa-clipboard"></i>';
  costcenter.innerHTML=user.costCentre + ' <i class="fa fa-clipboard"></i>';
  company.innerHTML=user.companyShortCut;
  localStorage.setItem("lastuser", JSON.stringify(user));
}
function setemptyuser(){
  profilename.innerHTML = `None,(blank)
    <p>blank</p>`;
  profiledescription.innerHTML=`<p>Phone: +91-123-456-7890</p>
  <p>Fax: +91-123-456-7890</p>
  <p>City: XYZ , ABC</p>`
  globalid.innerHTML='';
  costcenter.innerHTML='';
  company.innerHTML=''
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