from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response

from .serializers import RegisterSerializer


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


@method_decorator(csrf_exempt, name="dispatch")
class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request):
        identifier = (request.data.get("email")
                      or request.data.get("username") or "").strip()
        password = request.data.get("password")
        username = identifier

        if "@" in identifier:
            user = User.objects.filter(email__iexact=identifier).first()
            username = user.username if user else identifier

        user = authenticate(
            username=username,
            password=password
        )

        if user is not None:
            login(request, user)

            return Response({
                "message": "Login successful",
                "csrfToken": get_token(request)
            })

        return Response(
            {"message": "Invalid email or password"},
            status=400
        )


class LogoutView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        logout(request)
        return Response({"message": "Logout successful"})
