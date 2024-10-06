document.addEventListener("DOMContentLoaded", function(){
    // Sidenav initialization
    const menus = document.querySelector(".sidenav");
    M.Sidenav.init(menus, { edge: "left" });
});

// Initialize Recipe Form (modal)
document.addEventListener('DOMContentLoaded', function() {
    const elems = document.querySelectorAll('.modal');
    const instances = M.Modal.init(elems);
});

// JavaScript to toggle favorite icon
document.getElementById('favoriteIcon1').addEventListener('click', function() {
    this.classList.toggle('active'); // Toggle active class
    this.textContent = this.classList.contains('active') ? 'favorite' : 'favorite_border'; // Change icon
});

document.getElementById('favoriteIcon2').addEventListener('click', function() {
    this.classList.toggle('active'); // Toggle active class
    this.textContent = this.classList.contains('active') ? 'favorite' : 'favorite_border'; // Change icon
});

document.getElementById('favoriteIcon3').addEventListener('click', function() {
    this.classList.toggle('active'); // Toggle active class
    this.textContent = this.classList.contains('active') ? 'favorite' : 'favorite_border'; // Change icon
});

// Handle profile picture click and upload
document.getElementById('account-details-pic').addEventListener('click', function() {
    document.getElementById('profilePicUpload').click();
});

document.getElementById('profilePicUpload').addEventListener('change', function(event) {
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('account-details-pic').src = e.target.result;
    };
    reader.readAsDataURL(event.target.files[0]);
});