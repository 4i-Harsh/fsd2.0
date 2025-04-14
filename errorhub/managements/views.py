from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import ManagementRegistrationSerializer, ManagementLoginSerializer
from teachers.models import TeacherProfileVerification
from teachers.serializers import TeacherProfileVerificationSerializer

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

class AllVerificationsListView(generics.ListAPIView):
    serializer_class = TeacherProfileVerificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if not hasattr(self.request.user, 'management_profile'):
            return TeacherProfileVerification.objects.none()
        return TeacherProfileVerification.objects.all().order_by('-verification_date')

class PendingVerificationsListView(generics.ListAPIView):
    serializer_class = TeacherProfileVerificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if not hasattr(self.request.user, 'management_profile'):
            return TeacherProfileVerification.objects.none()
        return TeacherProfileVerification.objects.filter(status='pending')

class TeacherProfileVerificationView(generics.RetrieveUpdateAPIView):
    serializer_class = TeacherProfileVerificationSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        verification_id = self.kwargs.get('pk')
        return TeacherProfileVerification.objects.get(id=verification_id)

    def update(self, request, *args, **kwargs):
        if not hasattr(request.user, 'management_profile'):
            return Response(
                {"detail": "Only management can verify profiles"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        return super().update(request, *args, **kwargs)
