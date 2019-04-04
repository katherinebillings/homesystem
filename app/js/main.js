//toggle slider (iphone style)

		
//Variables
var sliderSwitch = document.querySelectorAll(".sliderSwitch");
var optionsBox = document.querySelectorAll(".options");

var options = document.querySelectorAll(".optionSlide");

//function
var toggleSlide = e => {
  for(var i = 0; i < options.length; i++) {
    if (e.currentTarget === options[i]) {
      sliderSwitch[i].classList.toggle("on");
      optionsBox[i].classList.toggle("on");   
    }
  }
};
    //listener
    options.forEach(optionSlide => {
    optionSlide.addEventListener("click", toggleSlide);
});
    


//language select dropdown

//language select dropdown for settings page

//variables
/*var button = document.querySelector(".btnLanguages");
var dropdown = document.querySelector(".dropdown");
var list = dropdown.querySelectorAll("li a");


//functions
function toggle() {
  if (dropdown.style.display !== "block") {
    dropdown.style.display = "block";
  } else {
    dropdown.style.display = 'none';
  }
};

function closeAll(e) {
  var check;
  for(var i = 0; i < list.length; i++) {
    if(e.target === list[i]) {
      check = e.target;
    }
  }
  if(e.target.id !== "dropBtn" && check == undefined) {
    dropdown.style.display = 'none';
  }
}

  //listeners
  button.addEventListener("click",toggle,false);
  window.addEventListener("click", closeAll, false);*/









