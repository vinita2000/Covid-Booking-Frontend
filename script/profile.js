
// display user profile in DOM
const displayProfileDOM = (profile) => {
  let html = `
    <div class="profileContainer">
      <div>
        <img src="./images/user.png" width="150" height="170">
        <div class="profileDetails">
          <h5>${profile.name}</h5>
          <h6>${profile.email}</h6>
          <p>${profile.address.name}</p>
        </div>
  `;
  let bookingTable = `
  <div class="bookingTable">
  <table>
  <tr>
    <td class="tableHeading">LAB</td>
    <td class="tableHeading">TEST</td>
    <td class="tableHeading">DATE</td>
    <td class="tableHeading">TIME</td>
  </tr>
  `;
  const bookings = profile.bookings;
  bookings.reverse(); // to get latest booking first
  bookings.map((booking) => {
    bookingTable += `
    <tr>
      <td>${booking.labName}</td>
      <td>${booking.testName}</td>
      <td>${booking.bookingDate}</td>
      <td>${booking.bookingTime}</td>
    </tr>
    `;
  });

  bookingTable += `</table></div>`;
  html += bookingTable;
  html += `
    </div>
  </div>
  `;

  $('#pills-profile').html(html);
};

// get user profile api
const getUserProfile = (userId) => {
  $.ajax({
    url: `${BASE_URL}/getProfile?userId=${userId}`,
    method: "GET",
    timeout: 0,
    headers: {
      "Content-Type": "application/json"
    },
    success: function(response){
      displayProfileDOM(response.data);
    },
    error: function(error){
      alert(`${error.statusText}`);
    }
  });  
};

// profile tab 
$("#pills-profile-tab").click(function(e){
  let userId = sessionStorage.getItem('userId');
  userId = JSON.parse(userId);
  getUserProfile(userId);
});
