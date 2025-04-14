from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .serializers import ManagementRegistrationSerializer, ManagementLoginSerializer

# Create your views here.

class ManagementRegistrationView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = ManagementRegistrationSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            management = serializer.save()
            return Response({
                "message": "Management user registered successfully",
                "username": management.user.username,
                "position": management.position
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ManagementLoginView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = ManagementLoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
