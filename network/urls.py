
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("profile", views.profile, name="profile"),
    path("userprofile/<int:user_id>", views.userprofile, name="userprofile"),
    path("create", views.handle_create_form, name="handle_create_form"), # API Routes
    path("posts/<int:post_id>", views.posts, name="posts"),     # Find a post by ID
    path("feed/<int:user_id>", views.feed, name="feed"),     # View feed by user_id
    path("addfollow/<int:user_id>", views.addfollow, name="addfollow"),     # Add/remove current user as a follower
    path("removefollow/<int:user_id>", views.removefollow, name="removefollow"),
    path("following", views.following, name="following"),     # Following function and page
    path("followingposts", views.followingposts, name="followingposts"),
    path('like/<int:post_id>', views.like, name='like'),     # Like 
    path('unlike/<int:post_id>', views.unlike, name='unlike'),     # Unlike 
    path('edit/<int:post_id>', views.edit, name='edit'),     # Edit post content 

]
