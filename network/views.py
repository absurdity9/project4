from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from .models import User, Post
import json

def index(request):
    user_id = request.user.id
    return render(request, "network/index.html")

def profile(request):
    user_id = request.user.id
    return render(request, "network/profile.html", {'user_id': user_id})


@csrf_exempt
@login_required
def feed(request, user_id):
    try:
        # 99999 are all users
        if int(user_id) == 99999:
            print("All")
            posts = Post.objects.all()
        # filter all posts matching the user_id
        else:
            print(user_id)
            posts = Post.objects.filter(user=user_id)
        posts = posts.order_by("-date_created").all()
        return JsonResponse([post.serialize() for post in posts], safe=False)
        
    except ValueError:
        print("User_ID is not an integer")
        return render(request, "network/index.html")

@csrf_exempt
@login_required
def posts(request, post_id):    
    # Query for requested email
    try:
        post = Post.objects.get(pk=post_id)
    except Post.DoesNotExist:
        return JsonResponse({"error": "Post not found."}, status=404)
    # Return contents
    if request.method == "GET":
        return JsonResponse(post.serialize())
    # Email must be via GET or PUT
    else:
        return JsonResponse({
            "error": "GET or PUT request required."
        }, status=400)
        
def create_post(request, post):
    user_id = request.user
    # create records
    saved_post = Post.objects.create(user=user_id, content=post)
    return saved_post

@csrf_exempt
@login_required
def handle_create_form(request):
    # Composing a new email must be via POST
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    
    formdata = json.loads(request.body)
    post = formdata.get("postcontent")
    
    if not post:
        return JsonResponse({"error": "Post content cannot be empty."}, status=400)
        
    saved_post = create_post(request, post)
    return JsonResponse({"message": "Post created successfully!", "post": saved_post.id}, status=201)


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
