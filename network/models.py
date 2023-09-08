from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

class Post(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    likes = models.PositiveIntegerField(default=0)
    unlikes = models.PositiveIntegerField(default=0)
    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Post {self.id} by {self.user.username}"
    
    def serialize(self):
        return{
            "id":self.id,
            "user":self.user.id,
            "username":self.user.username,
            "content":self.content,
            "likes":self.likes,
            "unlikes":self.unlikes,
            "date_created":self.date_created.strftime("%b %d %Y, %I:%M %p"),
        }
class Follow(models.Model):
    follower = models.ForeignKey(User, on_delete=models.CASCADE, related_name='following')
    followed = models.ManyToManyField(User, related_name='followers')

    def __str__(self):
        return f'{self.follower.username} follows {self.followed.username}'
