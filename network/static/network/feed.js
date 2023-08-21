// On load logic
document.addEventListener('DOMContentLoaded', function () {
  // Create posts if form button is clicked
  document.querySelector('form').onsubmit = function (event) {
    event.preventDefault();
    const post = document.querySelector('#post').value;
    fetch('/create', {
      method: 'POST',
      body: JSON.stringify({
        postcontent: post,
      })
    })
      .then(response => response.json())
      .then(result => {
        // Print result
        console.log(result);
        fetchPosts(99999);
      })
      .catch(error => {
        // Handle error
        console.error('An error occurred:', error);
      });
  };
  // Load posts
  fetchPosts(99999);
}

// Add event listener to refresh button
document.querySelector('#refresh-feed').addEventListener('click', function () {
  fetchPosts(99999);
});

function fetchPosts(user_id) {
  fetch(`/feed/${user_id}`)
      .then(response => response.json())
      .then(data => {
          console.log(data);
          data.forEach(post => {
              const post_id = post.id;
              const content = post.content;
              const likes = post.likes;
              const unlikes = post.unlikes;
              const date_created = post.date_created;
              const user_id = post.user;

              // Create html markup
              const postDiv = document.createElement('div');
              postDiv.classList.add('card', 'card-body', 'mb-3');

              // Post content elements
              const postElement = document.createElement('p');
              postElement.classList.add('card-text');

              // Display all info
              const postText = `Post ID: ${post_id}, Content: ${content}, Likes: ${likes}, Unlikes: ${unlikes}, Date Created: ${date_created}, User ID: ${user_id}`;
              postElement.textContent = postText;

              // Put post element into div
              postDiv.appendChild(postElement);
              const postsContainer = document.querySelector('#postscontainer');
              postsContainer.appendChild(postDiv);
          });
      })
      .catch(error => {
          console.error('An error occurred:', error);
          // Handle the error
      });
}