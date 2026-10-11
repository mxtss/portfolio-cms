from django.urls import path

from .views import (
    ProjectListCreateView,
    ProjectDetailView,
    SkillListCreateView,
    SkillDetailView,
    ExperienceListCreateView,
    ExperienceDetailView,
    EducationListCreateView,
    EducationDetailView,
    ContactMessageListCreateView,
    ContactMessageDetailView,
    PublicProjectListView,
    PublicSkillListView,
    PublicExperienceListView,
    PublicEducationListView,
    PublicContactMessageCreateView,
)
urlpatterns = [
    # Projects
    path("projects/", ProjectListCreateView.as_view(),name="project-list-create"),
    path("projects/<int:pk>/",ProjectDetailView.as_view(),name="project-detail"),
    # Skills
    path("skills/", SkillListCreateView.as_view(),name="skill-list-create"),
    path("skills/<int:pk>/", SkillDetailView.as_view(),name="skill-detail"),
    # Experience
    path("experience/", ExperienceListCreateView.as_view(),name="experience-list-create"),
    path("experience/<int:pk>/", ExperienceDetailView.as_view(),name="experience-detail"),
    # Education
    path("education/", EducationListCreateView.as_view(),name="education-list-create"),
    path("education/<int:pk>/", EducationDetailView.as_view(),name="education-detail"),
    # Contact Messages
    path("contact/",ContactMessageListCreateView.as_view(),name="contact-list-create"),
    path("contact/<int:pk>/", ContactMessageDetailView.as_view(),name="contact-detail"),
    # Public Portfolio APIs 
    path("public/projects/",PublicProjectListView.as_view(),name="public-projects"),
    path("public/skills/",PublicSkillListView.as_view(),name="public-skills"),
    path("public/experience/",PublicExperienceListView.as_view(),name="public-experience"),
    path("public/education/",PublicEducationListView.as_view(), name="public-education"),
    path("public/contact/",PublicContactMessageCreateView.as_view(),name="public-contact-create"),
]