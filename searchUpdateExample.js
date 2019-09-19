var searchList = [];
function autocomplete(inp, arr) {
  var currentFocus;
  inp.addEventListener("input", function(e) {
    var a, b, i, val = this.value;
    searchList.length = 0;
    closeAllLists();
    if (!val) { return false;}
      currentFocus = -1;
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");

    this.parentNode.appendChild(a);
    for (i = 0; i < arr.length; i++) {
      if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        b = document.createElement("DIV");
        searchList.push(arr[i])
        b.setAttribute("onclick", 'selectCountry()')
        b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
        b.innerHTML += arr[i].substr(val.length);
        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
        b.addEventListener("click", function(e) {
          inp.value = this.getElementsByTagName("input")[0].value;
          closeAllLists();
        });
        a.appendChild(b);
      }
    }
    document.getElementsByClassName('autocomplete-items')[0].style.height = searchList.length*40+"px";
    document.getElementById('searchHistory').style.marginTop = searchList.length*40+10+"px";
  });
  inp.addEventListener("keyup", function(e){
    var val = document.getElementById('myInput').value;
  	var arr = [];
  	if(localStorage.getItem('searchHistory'))
			arr = JSON.parse(localStorage.getItem('searchHistory'));
  	if(val){
  		var x = '';
	  	for (var i = 0; i < arr.length; i++) {
	      x += '<p><b style="float: left">'+arr[i].name+'</b><span style="float:right;font-size:14px">'+arr[i].time + "<span style='font-size: 22px; margin-left:20px;border-radius: 50px;border: 1px solid black;padding: 1px 8px 3px 8px;cursor: pointer' onclick=clearFn("+JSON.stringify(arr[i].name)+")>x</span></p><br clear='all'>";
	    }
	    document.getElementById("searchdata").innerHTML = x;
	  }
	  else
	    document.getElementById("searchdata").innerHTML = '';
    setTimeout(function(){
      if(document.getElementsByClassName('autocomplete-items').length)
        document.getElementsByClassName('autocomplete-items')[0].style.height = searchList.length*40+"px";
      document.getElementById('searchHistory').style.marginTop = searchList.length*40+10+"px";
    }, 50)
  })
  inp.addEventListener("keydown", function(e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        currentFocus++;
        addActive(x);
      } else if (e.keyCode == 38) {
        currentFocus--;
        addActive(x);
      } else if (e.keyCode == 13) {
        e.preventDefault();
        if (currentFocus > -1) {
         	if (x) x[currentFocus].click();
        }
      }
  });
	function addActive(x) {
		if (!x) return false;
			removeActive(x);
		if (currentFocus >= x.length) currentFocus = 0;
			if (currentFocus < 0) currentFocus = (x.length - 1);
			  x[currentFocus].classList.add("autocomplete-active");
	}
	function removeActive(x) {
		for (var i = 0; i < x.length; i++) {
			x[i].classList.remove("autocomplete-active");
		}
	}
	function closeAllLists(elmnt) {
		var x = document.getElementsByClassName("autocomplete-items");
		for (var i = 0; i < x.length; i++) {
			if (elmnt != x[i] && elmnt != inp) {
			  x[i].parentNode.removeChild(x[i]);
			}
		}
	}
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}
function clearSearch(){
	document.getElementById("searchdata").innerHTML = '';
	localStorage.removeItem('searchHistory')
}
function clearFn(val){
  if(localStorage.getItem('searchHistory')){
    var arr = JSON.parse(localStorage.getItem('searchHistory'));
    for(var i = 0; i < arr.length; i++){
      if(arr[i].name == val){
        arr.splice(i, 1)
        break;
      }
    }
    localStorage.setItem('searchHistory', JSON.stringify(arr))
    if(arr.length){
      var x = '';
      for (var i = 0; i < arr.length; i++) {
        x += '<p><b style="float: left">'+arr[i].name+'</b><span style="float:right;font-size:14px">'+arr[i].time + "<span style='font-size: 22px; margin-left:20px;border-radius: 50px;border: 1px solid black;padding: 1px 8px 3px 8px;cursor: pointer' onclick=clearFn("+JSON.stringify(arr[i].name)+")>x</span></p><br clear='all'>";
      }
      document.getElementById("searchdata").innerHTML = x;
    }
    else
      document.getElementById("searchdata").innerHTML = '';
  }
}
function selectCountry(){
	var val, arr = [];
	if(localStorage.getItem('searchHistory'))
		arr = JSON.parse(localStorage.getItem('searchHistory'));
	setTimeout(function(){ 
		val = document.getElementById('myInput').value;
		var d = new Date();
		var date = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()+', '+time(d);
		arr.unshift({name: val, time: date})
		localStorage.setItem('searchHistory', JSON.stringify(arr))
	}, 50);
  searchList.length = 0;
  document.getElementsByClassName('autocomplete-items')[0].style.height = searchList.length*40+"px";
  document.getElementById('searchHistory').style.marginTop = searchList.length*40+10+"px";
}
function time(time){
	var h =  time.getHours(), 
	m = time.getMinutes();
  var thistime = (h > 12) ? ((h-12 < 10 ? ('0'+(h-12)): (h-12)) + ':' + (m < 10 ? ('0'+m):m) +' PM') : ((h < 10? ('0'+h) : h) + ':' + (m < 10 ? ('0'+m):m) +' AM');
  return thistime;
}
var countries = [];
function getApi(){
  var request = new XMLHttpRequest()
  request.open('GET', 'https://api.github.com/users', true)
  request.onload = function() {
    var data = JSON.parse(this.response)

    if (request.status >= 200 && request.status < 400) {
      data.forEach(res => {
        countries.push(res.login)
      })
    } else {
      console.log('error')
    }
  }
  request.send()
}
getApi();
setTimeout(function(){
  autocomplete(document.getElementById("myInput"), countries);
}, 50)
