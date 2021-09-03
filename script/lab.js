
const BASE_URL = 'https://covid-booking-backend.herokuapp.com';

// display labs in DOM
const displayDOM = (labs) => {
  let html = '';
  labs.map((lab) => {
    const tempHtml = `
    <div class="card-body">
      <img src="./images/hospital.png"" width="100" height="120" class="image">
      <h4 class="card-title">${lab.name}</h4>
      <p class="card-text">${lab.address.name}</p>
      <p class="distance">${parseInt((lab.distance)/1000)} KM</p>
      <button class="btn open" id="${lab._id}">Open</button>
    </div>`;
    html += tempHtml;
  });
  $("#pills-home").html(html);
  // get single lab details
  $(".open").click(function(){
    let labId = $(this).attr('id');
    sessionStorage.setItem('labId', JSON.stringify(labId));
    getLabDetails(labId);
  });
};

// display single lab data in DOM
const displayLabDOM = (lab) => {
  let html = `
  <div class="card-body" style="backround-color:#f7e1f5;">
    <img src="./images/hospital.png" width="150" height="170">
    <h4 class="card-title">${lab.name}</h4>
    <p class="card-text">${lab.address.name}</p>
  </div>
  <div class="container2">
    <div class="test">
      <h5 class="card-title">${lab.tests[0].name}</h5>
      <p class="card-text">Slots: ${lab.tests[0].slots}</p>
      <button class="btn book" id="${lab.tests[0].name}">Book Slot</button>
    </div>
    <div class="test">
      <h5 class="card-title">${lab.tests[1].name}</h5>
      <p class="card-text">Slots: ${lab.tests[1].slots}</p>
      <button class="btn book" id="${lab.tests[1].name}">Book Slot</button>
    </div>
  </div>
  `;
  $("#pills-home").html(html);
  // book slot button
  $(".book").click(function(){
    const test = $(this).attr('id');
    let userId = sessionStorage.getItem('userId');
    userId = JSON.parse(userId);
    let labId = sessionStorage.getItem('labId');
    labId = JSON.parse(labId);
    bookSlot(userId, labId, test);
  });
};

const displayBookingDOM = (booking) => {
  $('#exampleModal').modal('show');
  let html = `
  <table>
    <tr>
      <td>LAB</td>
      <td>TEST</td>
      <td>DATE</td>
      <td>TIME</td>
    </tr>
    <tr>
      <td>${booking.labName}</td>
      <td>${booking.testName}</td>
      <td>${booking.bookingDate}</td>
      <td>${booking.bookingTime}</td>
    </tr>
  </table>
  `;
  $('#modal-booking-details').html(html);
  getLabDetails(booking.labID);
};

const bookSlot = (userId, labId, test) => {
  $.ajax({
    url: `${BASE_URL}/bookSlot?labId=${labId}&test=${test}&userId=${userId}`,
    method: "PUT",
    timeout: 0,
    headers: {
      "Content-Type": "application/json"
    },
    success: function(response){
      if (!response.data) {
        alert('No Slots Available');
        return;
      }
      displayBookingDOM(response.data.bookings[response.data.bookings.length - 1]);
    },
    error: function(error){
      alert(`${error.statusText}`);
    }
  });  
};

const getLabDetails = (labId) => {
  $.ajax({
    url: `${BASE_URL}/getLab?id=${labId}`,
    method: "GET",
    timeout: 0,
    headers: {
      "Content-Type": "application/json"
    },
    success: function(response){
      displayLabDOM(response.data);
    },
    error: function(error){
      alert(`${error.statusText}`);
    }
  });  
};

const getNearByLabs = (userId) => {
  $.ajax({
    url: `${BASE_URL}/nearbyLabs?userId=${userId}`,
    method: "GET",
    timeout: 0,
    headers: {
      "Content-Type": "application/json"
    },
    success: function(response){
      displayDOM(response.data);
    },
    error: function(error){
      alert(`${error.statusText}`);
    }
  });  
};

// home tab 
$("#pills-home-tab").click(function(e){
  $( "#pills-profile" ).empty();
  let userId = sessionStorage.getItem('userId');
  userId = JSON.parse(userId);
  // load nearby labs
  getNearByLabs(userId);
});
