document.addEventListener('DOMContentLoaded', function () {
  // Use buttons to toggle between views
  document.querySelector('#postscontainer').style.display = 'none';
});

function compose_email() {
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#full-email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}