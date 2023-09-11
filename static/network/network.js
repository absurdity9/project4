
    var userId = {{ user_id }};
    console.log(userId);
    // On load logic
    document.addEventListener('DOMContentLoaded', function () {
      fetchPosts(userId)
      // Create posts if form button is clicked
      document.querySelector('form').onsubmit = function (event) {
        event.preventDefault()
        const post = document.querySelector('#post').value
        fetch('/create', {
          method: 'POST',
          body: JSON.stringify({
            postcontent: post
          })
        })
          .then((response) => response.json())
          .then((result) => {
            // Display success message in modal
              location.reload();
          })
          .catch((error) => {
            // Handle error
            console.error('An error occurred:', error)
          })
      }
    });
    
    
    // Create a feed of posts based on the user id
    function fetchPosts(user_id) {
      fetch(`/feed/${user_id}`)
        .then((response) => response.json())
        .then((data) => {
          console.log(data)
          data.forEach((post) => {
            const post_id = post.id
            const content = post.content
            const likes = post.likes
            const unlikes = post.unlikes
            const date_created = post.date_created
            const user_id = post.user
            const username = post.username
    
            // Display each post in a div
            const postDiv = document.createElement('div')
            postDiv.classList.add('card', 'card-body', 'mb-3')
    
            // Display content in h5
            const headerElement = document.createElement('h5')
            headerElement.classList.add('card-title')
            headerElement.textContent = content
    
            // Display other info
            const postElement = document.createElement('p')
            postElement.classList.add('card-text')
    
            // Create a clickable username link
            const usernameLink = document.createElement('a')
            usernameLink.textContent = `${username} ·  ${date_created}`
            usernameLink.href = `/profile/${user_id}`
    
            // Append the username link and line break to postElement
            postElement.appendChild(usernameLink)
            postElement.appendChild(document.createElement('br'))
            postElement.innerHTML += `Likes: ${likes} <i class="far fa-thumbs-up"></i>  <br> `
    
            // Append header and post elements to postDiv
            postDiv.appendChild(headerElement)
            postDiv.appendChild(postElement)
    
            const postsContainer = document.querySelector('#postscontainer')
            postsContainer.appendChild(postDiv)
          })
        })
        .catch((error) => {
          console.error('An error occurred:', error)
          // Handle the error
        })
    };
    // Add follow
    const followButton = document.getElementById('follow');
    followButton.addEventListener('click', function(){
      console.log("Clicked");
      fetch(`/addfollow/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': '{{ csrf_token }}',
        },
      })
      .then(response => response.json())
      .then(data => {
        // Handle the response data
        if (data.success) {
          // Display a success message
          alert(data.message);
          // Refresh the page
          window.location.reload();
        } else {
          // Display an error message
          alert(data.message);
        }
      })
      .catch(error => {
        // Handle any error that occurs during the request
        console.error('An error occurred:', error);
      });

    // Remove follow
    const followButton = document.getElementById('unfollow');
    followButton.addEventListener('click', function(){
      console.log("Clicked")
      fetch(`/removefollow/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': '{{ csrf_token }}',
        },
      })
      .then(response => response.json())
      .then(data => {
        // Handle the response data
        if (data.success) {
          // Display a success message
          alert(data.message);
          // Refresh the page
          window.location.reload();
        } else {
          // Display an error message
          alert(data.message);
        }
      })
      .catch(error => {
        // Handle any error that occurs during the request
        console.error('An error occurred:', error);
      });
