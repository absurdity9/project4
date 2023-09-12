from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect
from django.urls import reverse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.core.exceptions import ObjectDoesNotExist
from django.contrib import messages
from .models import User, Post, Follow
import json

def index(request):
    user_id = request.user.id
    return render(request, "network/index.html")

def profile(request):
    user_id = request.user.id
    user = User.objects.get(id=user_id)
    username = user.username
    
    followers = Follow.objects.filter(followed=user)
    followers_count = followers.count()
    
    following = Follow.objects.filter(follower=user)
    following_count = following.count()
        
    return render(request, "network/profile.html", {
        'user_id': user_id,
        'followers_count':followers_count,
        'following_count':following_count,
        'username':username,
        })

def userprofile(request, user_id):
    user = user_id
    currentUserId = request.user.id
    current_user = User.objects.get(id=currentUserId)
    profile_user = User.objects.get(id=user_id)
    username = current_user.username

    followers = Follow.objects.filter(followed=user)
    followers_count = followers.count()
    
    following = Follow.objects.filter(follower=user)
    following_count = following.count()
    
    try:
        follow_object = Follow.objects.get(follower=current_user, followed=profile_user)
        if follow_object:
            relationship_exists = 'true'
        else:
            relationship_exists = 'false'

    except Follow.DoesNotExist:
        relationship_exists = 'false'

    return render(request, "network/userprofile.html", {
        'followers_count': followers_count,
        'following_count': following_count,
        'user_id': user_id,
        'username':username,
        'relationship_exists': relationship_exists
    })

def addfollow(request, user_id):
    try:
        follower_userid = request.user.id
        follower_object = User.objects.get(id=follower_userid)
        followed_object = User.objects.get(id=user_id)
        username=followed_object.username
        follow = Follow.objects.create(follower=follower_object)
        follow.followed.add(followed_object)
        return JsonResponse({'success': True, 'message': f'You followed {username}!'})
    except ObjectDoesNotExist:
        raise ObjectDoesNotExist("User does not exist. Please try again.")
    except Exception as e:
        raise Exception(f"An error occurred: {str(e)}")
    
def removefollow(request,user_id):
    try: 
        follower_userid = request.user.id
        follower_object = User.objects.get(id=follower_userid)
        followed_object = User.objects.get(id=user_id)
        username=followed_object.username

        follow = Follow.objects.get(follower=follower_object, followed=followed_object)
        follow.delete()
        return JsonResponse({'success': True, 'message': f'You unfollowed  {username}!'})
    except ObjectDoesNotExist:
        raise ObjectDoesNotExist("User does not exist. Please try again.")
    except Exception as e:
        raise Exception(f"An error occurred: {str(e)}")

@login_required
def following(request):
    userId = request.user.id
    current_user = User.objects.get(id=userId)

    current_user_follows_ids = current_user.following.values_list('followed', flat=True)
    
    follows_ids_json = json.dumps(list(current_user_follows_ids)) 
    return render (request, "network/following.html",{
        'follows_ids_json': follows_ids_json
    })

@csrf_exempt
@login_required
def feed(request, user_id):
    try:
        # 99999 are all users
        if int(user_id) == 99999:
            posts = Post.objects.all()
        # filter all posts matching the user_id
        else:
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
    # Post must be via GET or PUT
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