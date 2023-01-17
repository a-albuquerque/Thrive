from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from django.contrib.auth import views as auth_views
from .views import *

urlpatterns = [
    path('login/', obtain_auth_token, name="api-user-login"),
    path('register/', register, name="api-user-register"),
    path('is_admin/', is_admin, name="api-user-is-admin"),
    path('get_notification_time/', get_preferred_notification_time,
         name="api-user-get-notification-time"),
    path('set_notification_time/', set_preferred_notification_time,
         name="api-user-set-notification-time"),
    path('get_user_meta/', get_user_meta,
         name="api-user-set-notification-time"),

     path('emailVerification/<uidb64>/<token>', activate, name='emailActivate'),

     path('send_buddy_request/', send_buddy_request, name="api-send-buddy-request"),
     path('accept_buddy_request/', accept_buddy_request, name="api-accept-buddy-request"),
     path('reject_buddy_request/', reject_buddy_request, name="api-reject-buddy-request"), 
     path('fetch_buddy_request/', fetch_buddy_request, name="api-fetch-buddy-request"), 
     path('fetch_buddy/', fetch_buddy, name="api-fetch-buddy"), 
     path('reset_password/',
     auth_views.PasswordResetView.as_view(template_name="users/password_reset.html", html_email_template_name="users/password_reset_email.html"),
     name="reset_password"),

     path('reset_password_sent/', 
        auth_views.PasswordResetDoneView.as_view(template_name="users/password_reset_sent.html"), 
        name="password_reset_done"),

     path('reset/<uidb64>/<token>/',
     auth_views.PasswordResetConfirmView.as_view(template_name="users/password_reset_form.html"), 
     name="password_reset_confirm"),

     path('reset_password_complete/', 
        auth_views.PasswordResetCompleteView.as_view(template_name="users/password_reset_done.html"), 
        name="password_reset_complete"),
     
     path('active_journeys/<int:jid>/', active_journeys, name="api-active-journeys"),
     path('get_active_journeys/', get_active_journeys, name="api-get-active-journeys"),
     path('sample-non-buddy/', get_random_non_buddy, name='api-get-random-user'),
     path('set-expo-token/', set_expo_token, name='api-set-expo-token')
]