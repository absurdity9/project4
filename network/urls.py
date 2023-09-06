
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("profile", views.profile, name="profile"),
    path("userprofile/<int:user_id>", views.userprofile, name="userprofile"),
    # API Routes
    path("create", views.handle_create_form, name="handle_create_form"),
    # Find a post by ID
    path("posts/<int:post_id>", views.posts, name="posts"),
    # View feed by user_id
    path("feed/<int:user_id>", views.feed, name="feed"),
]
