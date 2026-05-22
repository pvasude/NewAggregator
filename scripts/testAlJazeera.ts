const AJ_FEED = 'https://www.aljazeera.com/xml/rss/all.xml';

(async () => {
  const res = await fetch(AJ_FEED);
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);

  const xml = await res.text();

  const itemStart = xml.indexOf('<item>');
  const itemEnd = xml.indexOf('</item>') + '</item>'.length;

  if (itemStart === -1) {
    console.log('No <item> found in feed.');
  } else {
    console.log(xml.slice(itemStart, itemEnd));
  }
})();
