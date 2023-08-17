from django.contrib import admin

# Register your models here.
from .models import User, Post
admin.site.register(User)
@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'content', 'likes', 'unlikes', 'date_created')
    list_filter = ('user', 'date_created')
    search_fields = ('content', 'user__username') 
    
