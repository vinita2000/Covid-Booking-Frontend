
const BASE_URL = 'https://covid-booking-backend.herokuapp.com';

// input validator
const validateInput = (email, password) => {
  if (!email || !password) return false;
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

// call backend login api
const callLoginApi = (data) => {
  $.ajax({
    url: `${BASE_URL}/login`,
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json"
    },
    data: JSON.stringify(data),
    success: function(response){
      sessionStorage.setItem('userId', JSON.stringify(response.data._id));
      let href = window.location.href;
      href = href.replace('login', 'main');
      window.location.href = href;
    },
    error: function(error){
      alert(`${error.statusText}`);
    }
  });  
};

// login form submission
$("#loginForm").submit((e)=> {
  e.preventDefault();
  console.log('Login submit button clicked');
  const email = $('#loginEmail').val();
  const password = $('#loginPass').val();
  const isValid = validateInput(email, password);
  if (!isValid) alert('Invalid Input');
  else{
    // login api
    callLoginApi({email, password});
  }
});