"""Check the static site's files, anchors, image geometry and version contract."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import json
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
class Page(HTMLParser):
    def __init__(self, source):
        super().__init__(); self.ids = set(); self.links = []; self.images = []
        self.feed(source)
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if 'id' in a:
            assert a['id'] not in self.ids, f"duplicate id: {a['id']}"
            self.ids.add(a['id'])
        for key in ('href', 'src', 'poster', 'data-src'):
            if a.get(key): self.links.append(a[key])
        if tag == 'img': self.images.append(a)
pages = {p.name: Page(p.read_text()) for p in ROOT.glob('*.html')}
count = 0
for name, page in pages.items():
    for link in page.links:
        u = urlsplit(link)
        if u.scheme or u.netloc: continue
        target = unquote(u.path) or name
        assert (ROOT / target).is_file(), f'{name}: missing {link}'
        if u.fragment and target.endswith('.html'):
            assert u.fragment in pages[target].ids, f'{name}: missing anchor {link}'
        count += 1
    for img in page.images:
        assert 'alt' in img, f'{name}: missing alt'
        if 'assets/guide/' in img.get('src', ''):
            assert int(img['width']) > 0 and int(img['height']) > 0
assert {'atenciones','evolucion','pendientes','reevaluaciones','compartir','exportar','buscar'} <= pages['guia.html'].ids
manifest = json.loads((ROOT/'app-version.json').read_text())
assert manifest == {'schemaVersion':1,'ios':{'enabled':False,'version':'1.5.0','build':'16'},'android':{'enabled':False,'version':'1.5.0','build':'16'}}
urls = [e.text for e in ET.parse(ROOT/'sitemap.xml').iter() if e.tag.endswith('loc')]
assert 'https://leoalvtor.github.io/score-mama-web/guia.html' in urls
size = sum(p.stat().st_size for p in (ROOT/'assets/guide').glob('*.webp'))
assert size < 2_000_000, f'guide images too large: {size}'
print(f'PASS: {len(pages)} pages, {count} references, 7 procedures; guide images {size:,} bytes; manifest unchanged.')
