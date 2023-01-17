from django.http import HttpResponse

from django.conf import settings
from django.urls import URLPattern, URLResolver

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

urlconf = __import__(settings.ROOT_URLCONF, {}, {}, [''])


def list_urls(lis, acc=None):
    if acc is None:
        acc = []
    if not lis:
        return
    l = lis[0]
    if isinstance(l, URLPattern):
        yield acc + [str(l.pattern)]
    elif isinstance(l, URLResolver):
        yield from list_urls(l.url_patterns, acc + [str(l.pattern)])
    yield from list_urls(lis[1:], acc)


# Create your views here.


def home(request):
    return HttpResponse("WELCOME, PLEASE GO TO '/api'")


@api_view(["GET"])
@permission_classes(())
def api_overview(request):
    proper_urls = []
    for my_url in list_urls(urlconf.urlpatterns):
        if my_url[0] != "admin/":
            proper_urls.append(''.join(my_url))
    return Response({"paths": proper_urls})
