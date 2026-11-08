// ========================================
// BlogSpace - Frontend JavaScript
// ========================================

const STORAGE_KEY = "blogspace-posts-v1";

// ========================================
// Local Storage Functions
// ========================================

function getPosts() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (error) {
    return [];
  }
}

function savePosts(posts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

// ========================================
// Utility Functions
// ========================================

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function toggleMenu() {
  const nav = document.getElementById("nav");

  if (nav) {
    nav.classList.toggle("open");
  }
}
async function loadPostsFromMongoDB() {
  try {
    const response = await fetch("http://localhost:5000/api/blogs");

    if (!response.ok) {
      throw new Error("Failed to fetch blog posts.");
    }

    const posts = await response.json();

    const formattedPosts = posts.map((post) => ({
      ...post,
      id: String(post._id)
    }));

    savePosts(formattedPosts);
    renderPosts();
  } catch (error) {
    console.error("Error loading blogs from MongoDB:", error);
  }
}

// ========================================
// Blog Display Functions
// ========================================



function postCard(post, withDelete = false) {
  const content = post.content || "";
  const excerpt = post.excerpt || content.slice(0, 140);
  const postId = String(post.id || post._id);

  return `
    <article class="post-card">
      <span class="category">
        ${escapeHTML(post.category || "Story")}
      </span>

      <h3>${escapeHTML(post.title)}</h3>

      <p>${escapeHTML(excerpt)}</p>

      <a
        class="read-more"
        href="blog-details.html?id=${encodeURIComponent(postId)}"
      >
        Read story →
      </a>

      ${
        withDelete
          ? `
            <a
              class="button"
              href="create-blog.html?id=${encodeURIComponent(postId)}"
            >
              Edit post
            </a>

            <button
              class="delete-button"
              onclick="deletePost('${escapeHTML(postId)}')"
            >
              Delete post
            </button>
          `
          : ""
      }
    </article>
  `;
}


function renderPosts() {
  const posts = getPosts();

  const home = document.getElementById("home-posts");

  if (home) {
    home.innerHTML = posts.length
      ? posts.slice().reverse().map((post) => postCard(post)).join("")
      : `
        <div class="empty-state">
          <strong>Your first story starts here.</strong>
          <br>
          Create a post from the dashboard to see it on this page.
        </div>
      `;
  }

  const dashboard = document.getElementById("dashboard-posts");

  if (dashboard) {
    dashboard.innerHTML = posts.length
      ? posts.slice().reverse().map((post) => postCard(post, true)).join("")
      : `
        <div class="empty-state">
          <strong>No posts yet.</strong>
          <br>
          Click "Create blog" to publish your first story.
        </div>
      `;

    const count = document.getElementById("post-count");

    if (count) {
      count.textContent = posts.length;
    }
  }
}

function showPost(id) {
  const post = getPosts().find(
    (item) => String(item.id) === String(id)
  );

  if (post) {
    alert(post.title + "\n\n" + post.content);
  }
}

async function deletePost(id) {
  if (!confirm("Delete this post?")) {
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:5000/api/blogs/${encodeURIComponent(id)}`,
      {
        method: "DELETE"
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Could not delete blog.");
      return;
    }

    // Remove the deleted blog from localStorage
    const updatedPosts = getPosts().filter(
      (post) => String(post.id || post._id) !== String(id)
    );

    savePosts(updatedPosts);
    renderPosts();

    alert("Blog post deleted successfully!");
  } catch (error) {
    console.error("Delete blog error:", error);
    alert("Cannot connect to backend. Make sure your server is running.");
  }
}



// ========================================
// Main Event Listeners
// ========================================

document.addEventListener("DOMContentLoaded", () => {

  // Load blog posts from MongoDB
loadPostsFromMongoDB();

  // ======================================
  // REGISTER FORM - Backend API
  // ======================================

  const registerForm = document.getElementById("register-form");

  if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const message = document.getElementById("register-message");

      // These IDs must match register.html
      const username = document.getElementById("register-username").value.trim();
      const email = document.getElementById("register-email").value.trim();
      const password = document.getElementById("register-password").value;

      message.textContent = "Creating your account...";

      try {
        const response = await fetch("http://localhost:5000/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username,
            email,
            password
          })
        });

        const data = await response.json();

        if (!response.ok) {
          message.textContent = data.message || "Registration failed.";
          return;
        }

        message.textContent = data.message || "Registration successful!";

        registerForm.reset();

      } catch (error) {
        message.textContent =
          "Cannot connect to the backend. Make sure your server is running.";
      }
    });
  }

  // ======================================
  // LOGIN FORM - Backend API
  // ======================================

  const loginForm = document.getElementById("login-form");

  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const message = document.getElementById("login-message");

      const email = document.getElementById("login-email").value.trim();
      const password = document.getElementById("login-password").value;

      message.textContent = "Logging in...";

      try {
        const response = await fetch("http://localhost:5000/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            password
          })
        });

        const data = await response.json();

        if (!response.ok) {
          message.textContent = data.message || "Login failed.";
          return;
        }

        message.textContent =
          "Login successful! Welcome, " + data.user.username + "!";

        // Save basic login information for this browser session
        sessionStorage.setItem(
          "blogspace-user",
          JSON.stringify(data.user)
        );

        // Redirect to dashboard after successful login
        setTimeout(() => {
          window.location.href = "dashboard.html";
        }, 1000);

      } catch (error) {
        message.textContent =
          "Cannot connect to the backend. Make sure your server is running.";
      }
    });
  }

  // ======================================
  // CREATE BLOG FORM - Backend API
  // ======================================
  
  // ======================================
  // CREATE / EDIT BLOG FORM - Backend API
  // ======================================

  const blogForm = document.getElementById("blog-form");

  if (blogForm) {
    const params = new URLSearchParams(window.location.search);
    const editId = params.get("id");

    const message = document.getElementById("blog-message");
    const submitButton = blogForm.querySelector("button[type='submit']");

    // Change the form title and button when editing
    if (editId) {
      document.querySelector("h1").textContent = "Edit blog post";

      if (submitButton) {
        submitButton.textContent = "Update post";
      }

      message.textContent = "Loading blog post...";

      // Load the existing blog post
      fetch(`http://localhost:5000/api/blogs/${encodeURIComponent(editId)}`)
        .then(async (response) => {
          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Blog not found");
          }

          return data.blog || data;
        })
        .then((blog) => {
          document.getElementById("blog-title").value =
            blog.title || "";

          document.getElementById("blog-category").value =
            blog.category || "Technology";

          document.getElementById("blog-excerpt").value =
            blog.excerpt || "";

          document.getElementById("blog-content").value =
            blog.content || "";

          message.textContent = "Blog loaded. You can edit it now.";
        })
        .catch((error) => {
          console.error("Error loading blog:", error);

          message.textContent =
            "Could not load blog. Please check your backend.";
        });
    }

    // Handle form submission
    blogForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const title = document.getElementById("blog-title").value.trim();

      const category = document.getElementById("blog-category").value;

      const excerpt = document.getElementById("blog-excerpt").value.trim();

      const content = document.getElementById("blog-content").value.trim();

      if (!title || !excerpt || !content) {
        message.textContent = "Please fill in all required fields.";
        return;
      }

      message.textContent = editId
        ? "Updating your post..."
        : "Publishing your post...";

      try {
        const blogData = {
          title,
          content: content,
          author: "BlogSpace User",
          category,
          excerpt
        };

        // Use PUT when editing
        // Use POST when creating
        const response = await fetch(
          editId
            ? `http://localhost:5000/api/blogs/${encodeURIComponent(editId)}`
            : "http://localhost:5000/api/blogs",
          {
            method: editId ? "PUT" : "POST",

            headers: {
              "Content-Type": "application/json"
            },

            body: JSON.stringify(blogData)
          }
        );

        const data = await response.json();

        if (!response.ok) {
          message.textContent =
            data.message ||
            (editId
              ? "Could not update blog."
              : "Could not publish blog.");

          return;
        }

        message.textContent = editId
          ? "Blog updated successfully!"
          : "Blog published successfully!";

        blogForm.reset();

        // Return to dashboard
        setTimeout(() => {
          window.location.href = "dashboard.html";
        }, 1000);

      } catch (error) {
        console.error("Blog form error:", error);

        message.textContent =
          "Cannot connect to backend. Make sure your server is running.";
      }
    });
}
});