// 定义全局变量以便在多个函数中使用
var backgroundImg;

window.addEventListener("DOMContentLoaded", (event) => {
  // 获取背景图片元素
  backgroundImg = document.querySelector('.profile-card-4 img');
  
  // 确保初始状态所有元素都是不可见的并且有模糊效果
  if (profilename) {
    profilename.style.opacity = "0";
    profilename.style.filter = "blur(8px)";
  }
  if (profiledescription) {
    profiledescription.style.opacity = "0";
    profiledescription.style.filter = "blur(8px)";
  }
  if (globalid) {
    globalid.style.opacity = "0";
    globalid.style.filter = "blur(8px)";
  }
  if (costcenter) {
    costcenter.style.opacity = "0";
    costcenter.style.filter = "blur(8px)";
  }
  if (company) {
    company.style.opacity = "0";
    company.style.filter = "blur(8px)";
  }
    // 使用requestAnimationFrame确保DOM已完全渲染，并确保图片动画有一个良好的开始
  requestAnimationFrame(() => {
    // 确保图片的动画已经开始后再加载用户数据
    setTimeout(() => {
      const user = localStorage.getItem("lastuser");
      if(user!=null){
        setuserdata(JSON.parse(user));
      }
    }, 300); // 延迟300ms，给图片动画一些先行时间
  });
});

var searchbox = document.getElementById("searchbox");
searchbox.onchange = function () {
  const input = searchbox.value;
  
  // 使用全局变量backgroundImg，因为已经在DOMContentLoaded中定义了
  if (backgroundImg) {
    // 添加一个微妙的脉冲效果，暗示搜索正在进行
    backgroundImg.style.transition = 'all 0.3s ease';
    backgroundImg.style.transform = 'scale(1.02)';
    backgroundImg.style.filter = 'brightness(105%)';
    
    // 一小段时间后恢复正常
    setTimeout(() => {
      backgroundImg.style.transform = '';
      backgroundImg.style.filter = '';
    }, 500);
  }
  
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
  // 预先清除可能存在的动画类，重置元素状态
  profilename.classList.remove("blur-animation");
  profiledescription.classList.remove("blur-animation");
  globalid.classList.remove("blur-animation");
  costcenter.classList.remove("blur-animation");
  company.classList.remove("blur-animation");
  
  // 确保元素隐藏且有模糊效果，避免内容更新时闪烁
  profilename.style.opacity = "0";
  profilename.style.filter = "blur(8px)";
  profiledescription.style.opacity = "0";
  profiledescription.style.filter = "blur(8px)";
  globalid.style.opacity = "0";
  globalid.style.filter = "blur(8px)";
  costcenter.style.opacity = "0";
  costcenter.style.filter = "blur(8px)";
  company.style.opacity = "0";
  company.style.filter = "blur(8px)";
  
  // 等待DOM刷新
  requestAnimationFrame(() => {
    // 设置内容
    profilename.innerHTML = `${user.firstname}, ${user.lastname} (${user.shortname})
      <p>${user.logonname} <i class="fa fa-clipboard"></i></p>`;
    profiledescription.innerHTML=``
    user.communications.forEach(element => {
      profiledescription.innerHTML +=`<p>${element.type}: ${element.value}</p>`
    });
    profiledescription.innerHTML +=`<p>City: ${user.city}, ${user.country}</p>`
    globalid.innerHTML=user.globalIdNumber + ' <i class="fa fa-clipboard"></i>';
    costcenter.innerHTML=user.costCentre + ' <i class="fa fa-clipboard"></i>';
    company.innerHTML=user.companyShortCut;    // 应用动画效果，使用requestAnimationFrame确保平滑过渡，并在下一个绘制帧应用动画
    requestAnimationFrame(() => {
      // 清除可能存在的内联样式
      profilename.style.opacity = "";
      profilename.style.filter = "";
      profiledescription.style.opacity = "";
      profiledescription.style.filter = "";
      globalid.style.opacity = "";
      globalid.style.filter = "";
      costcenter.style.opacity = "";
      costcenter.style.filter = "";
      company.style.opacity = "";
      company.style.filter = "";
      
      // 错开动画开始时间，让模糊到清晰的级联效果更加明显
      setTimeout(() => profilename.classList.add("blur-animation"), 20);
      setTimeout(() => profiledescription.classList.add("blur-animation"), 120);
      setTimeout(() => globalid.classList.add("blur-animation"), 220);
      setTimeout(() => costcenter.classList.add("blur-animation"), 250);
      setTimeout(() => company.classList.add("blur-animation"), 280);
    });
  });
  
  localStorage.setItem("lastuser", JSON.stringify(user));
}
function setemptyuser(){
  // 预先清除可能存在的动画类，重置元素状态
  profilename.classList.remove("blur-animation");
  profiledescription.classList.remove("blur-animation");
  globalid.classList.remove("blur-animation");
  costcenter.classList.remove("blur-animation");
  company.classList.remove("blur-animation");
  
  // 确保元素隐藏且有模糊效果，避免内容更新时闪烁
  profilename.style.opacity = "0";
  profilename.style.filter = "blur(8px)";
  profiledescription.style.opacity = "0";
  profiledescription.style.filter = "blur(8px)";
  globalid.style.opacity = "0";
  globalid.style.filter = "blur(8px)";
  costcenter.style.opacity = "0";
  costcenter.style.filter = "blur(8px)";
  company.style.opacity = "0";
  company.style.filter = "blur(8px)";
  
  // 等待DOM刷新
  requestAnimationFrame(() => {
    // 设置内容
    profilename.innerHTML = `None,(blank)
      <p>blank</p>`;
    profiledescription.innerHTML=`<p>Phone: +91-123-456-7890</p>
    <p>Fax: +91-123-456-7890</p>
    <p>City: XYZ , ABC</p>`
    globalid.innerHTML='';
    costcenter.innerHTML='';
    company.innerHTML='';    // 应用动画效果
    requestAnimationFrame(() => {
      // 清除可能存在的内联样式
      profilename.style.opacity = "";
      profilename.style.filter = "";
      profiledescription.style.opacity = "";
      profiledescription.style.filter = "";
      globalid.style.opacity = "";
      globalid.style.filter = "";
      costcenter.style.opacity = "";
      costcenter.style.filter = "";
      company.style.opacity = "";
      company.style.filter = "";
      
      // 应用动画
      setTimeout(() => profilename.classList.add("blur-animation"), 20);
      setTimeout(() => profiledescription.classList.add("blur-animation"), 120);
    });
  });
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