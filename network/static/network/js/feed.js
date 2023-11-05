
  console.log("Feed.js loaded");
  const previousPageElement = document.getElementById("previousPageBtn");
  const currentPageElement = document.getElementById("currentPageElement");
  const nextPageElement = document.getElementById("nextPageBtn");
  previousPageElement.addEventListener("click", handlePreviousPageClick);
  nextPageElement.addEventListener("click", handleNextPageClick);
  // Event handler for creating a post
  document.querySelector('form').addEventListener('submit', handleFormSubmission);

  updatePaginationCounter();

  function updatePaginationCounter() {
    currentPageElement.innerHTML = "Page " + currentPage;
  }
  
  function handlePreviousPageClick() {
    if (currentPage > 1) {
      currentPage--;
      updatePaginationCounter();
      checkPreviousButtonVisibility(); 
      checkNextButtonVisibility();
      // Add your logic to fetch and display the previous page of content
      fetchPosts(userId); // Fetch previous page content using the updated currentPage value
    }
  }
  
  function checkPreviousButtonVisibility() {
    if (currentPage === 1) {
      previousPageElement.style.display = "none";
    } else {
      previousPageElement.style.display = "block";
    }
  }
  
  function handleNextPageClick() {
    console.log("Clicked 1");
    if (currentPage < numPages) {
      currentPage++;
      console.log(currentPage);
      updatePaginationCounter();
      checkNextButtonVisibility();
      checkPreviousButtonVisibility();
  
      // Add your logic to fetch and display the next page of content
      if (userId>=0) {
        fetchPosts(userId); // Fetch next page content using the updated currentPage value
      } else {
        fetchFollowingPosts(); // Fetch next page content for following posts
      }
    }
  }
  
  function checkNextButtonVisibility() {
    if (currentPage === numPages) {
      nextPageElement.style.display = "none";
    } else {
      nextPageElement.style.display = "block";
    }
  }

  function likePost(post_id) {
    fetch(`/like/${post_id}`, {
      method: "POST"
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Handle success response, if needed
          console.log("Post liked successfully!");
          fetchPosts(userId); // Call the fetchPosts function if like is successful
        } else {
          // Handle error response, if needed
          console.error("Failed to like post.");
          alert("Failed to like"); // Show an alert if like fails
        }
      })
      .catch(error => {
        // Handle fetch error, if needed
        console.error("An error occurred while liking the post:", error);
      });
  }
    
  function removeAllChildNodes(parentNode) {
    while (parentNode.firstChild) {
      parentNode.removeChild(parentNode.firstChild);
    }
  }
  
  function fetchPosts(user_id) {
    fetch(`/feed/${user_id}?page=${currentPage}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data.serialized_posts);
        showPosts(data.serialized_posts);
        numPages = data.paginator.num_pages;
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  }

  function fetchFollowingPosts() {
    fetch(`/following?page=${currentPage}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data.serialized_posts);
        showPosts(data.serialized_posts);
        numPages = data.paginator.num_pages;
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  }

  function showPosts(posts) {
    const postsContainer = document.querySelector("#postscontainer");
    // Remove all existing child nodes from postsContainer
    removeAllChildNodes(postsContainer);
  
    posts.forEach((serialized_post) => {
      const post_id = serialized_post.id;
      const content = serialized_post.content;
      const likes = serialized_post.likes;
      const unlikes = serialized_post.unlikes;
      const date_created = serialized_post.date_created;
      const user_id = serialized_post.user;
      const username = serialized_post.username;
  
      // Display each post in a div
      const postDiv = document.createElement("div");
      postDiv.classList.add("card", "card-body", "mb-3");
  
      // Display content in h5
      const headerElement = document.createElement("h5");
      headerElement.classList.add("card-title");
      headerElement.textContent = content;
  
      // Display other info
      const postElement = document.createElement("p");
      postElement.classList.add("card-text");
  
      // Create a clickable username link
      const usernameLink = document.createElement("a");
      usernameLink.textContent = `${username} ·  ${date_created}`;
      usernameLink.href = `/userprofile/${user_id}`;
  
      // Append the username link and line break to postElement
      postElement.appendChild(usernameLink);
      postElement.appendChild(document.createElement("br"));

      // Create a clickable "Likes" link with the thumbs-up icon
      const likesLink = document.createElement("a");
      likesLink.href = "#"; // Set the appropriate URL for the like functionality
      likesLink.textContent = `Likes: ${likes} `;
      
      // Create the thumbs-up icon element
      const thumbsUpIcon = document.createElement("i");
      thumbsUpIcon.classList.add("far", "fa-thumbs-up");
      
      // Add an event listener to the likes link
      likesLink.addEventListener("click", () => likePost(post_id));
      
      // Append the thumbs-up icon to the likes link
      likesLink.appendChild(thumbsUpIcon);
      
      // Append the likes link to postElement
      postElement.appendChild(likesLink);

      // Append header and post elements to postDiv
      postDiv.appendChild(headerElement);
      postDiv.appendChild(postElement);

      // Check if the user_id is equal to currentUserId
      if (user_id === currentUserId) {
        // Create the edit button
        const editButton = document.createElement("button");
        editButton.classList.add("btn", "btn-info");
        editButton.textContent = "Edit";
        editButton.style.maxWidth = "72px";
        // Add an event listener to the edit button
        editButton.addEventListener("click", () => handleEditPost(post_id, editButton));
        // Append the edit button to postDiv
        postDiv.appendChild(editButton);
      }

      // Function to handle the editing of a post
      function handleEditPost(post_id, editButton) {
        editButton.style.display = "none";
        // Find the post element to be edited
        const postElement = postDiv.querySelector("h5");
        const content = postElement.textContent;

        // Replace the h5 element with a textarea
        const textarea = document.createElement("textarea");
        textarea.value = content;

        // Create the save button
        const saveButton = document.createElement("button");
        saveButton.textContent = "Save";
        // Add Bootstrap classes to the save button
        saveButton.classList.add("btn", "btn-success");
        saveButton.style.marginTop = "10px";

        // Set the max-width of the button
        saveButton.style.maxWidth = "72px";

        // Add an event listener to the save button
        saveButton.addEventListener("click", () => {
          const updatedContent = textarea.value;
          // Call the editPost function with the updated content
          editPost(post_id, updatedContent, saveButton);
          // Replace the textarea with the updated post element
          const updatedPostElement = document.createElement("h5");
          updatedPostElement.classList.add("card-text");
          updatedPostElement.textContent = updatedContent+ " (edited)";
          postDiv.replaceChild(updatedPostElement, textarea);
          editButton.style.display = "block";
        });

      // Replace the post element with the textarea and save button
      postDiv.replaceChild(textarea, postElement);
      postDiv.appendChild(saveButton);

      }

      postsContainer.appendChild(postDiv);
    });
  }

  function editPost(post_id, updatedContent, saveButton) {
    console.log(post_id);
    console.log(updatedContent);
    // Perform the necessary logic to update the post content
    fetch(`/edit/${post_id}`, {
      method: 'POST',
      body: JSON.stringify({ updatedContent: updatedContent }), // Update the field name to 'updatedContent'
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.success) {
          console.log('Post edited successfully!');
          // Perform any additional actions on success
          saveButton.style.display = 'none';
        } else {
          console.error('Failed to edit post:', data.message);
          // Handle the error case
        }
      })
      .catch((error) => {
        console.error('An error occurred while editing the post:', error);
        // Handle the error case
      });
  }