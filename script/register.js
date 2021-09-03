
const BASE_URL = 'https://covid-booking-backend.herokuapp.com';
let address = {};

$(document).ready(function() {
  $("#registerForm").hide();
  getUserLocation();
});

// input validator
const validateInput = (name, email, password, address) => {
  if (!email || !password || !name || !address) return false;
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

// call backend register api
const callRegisterApi = (data) => {
  $.ajax({
    url: `${BASE_URL}/register`,
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json"
    },
    data: JSON.stringify(data),
    success: function(response){
      sessionStorage.setItem('userId', JSON.stringify(response.data._id));
      let href = window.location.href;
      href = href.replace('register', 'main');
      window.location.href = href;
    },
    error: function(error){
      alert(`${error.statusText}`);
    }
  });  
};

// register form submission
$("#registerForm").submit(async (e)=> {
  e.preventDefault();
  console.log('Register submit button clicked');
  const name = $('#registerName').val();
  const email = $('#registerEmail').val();
  const password = $('#registerPass').val();
  if (! address) {
    alert('Could Not Locate');
    return;
  }
  const isValid = validateInput(name, email, password, address);
  if (!isValid) alert('Invalid Input');
  else{
    // register api
    const temp = {
      "name":`${name}`,
      "email":`${email}`,
      "password": `${password}`,
      "address": {
          "name": `${address.name}`,
          "location":{
              "type":"Point",
              "coordinates": address.coordinates
          }
      }
    }
    callRegisterApi(temp);
  }
});

// get user location first
const getUserLocation = async () => {
  $.ajax({
    url: "https://geolocation-db.com/jsonp",
    jsonpCallback: "callback",
    dataType: "jsonp",
    success: function(location) {
      address['name'] = `${location.city}, ${location.state}, ${location.country_name}`;
      address['coordinates'] = [location.latitude, location.longitude];
      $("#registerForm").show();
    },
    error: function(err){
      alert('Could Not Locate Your address');
    }
  });
  return address;
};