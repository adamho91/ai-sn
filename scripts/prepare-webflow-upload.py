#!/usr/bin/env python3
"""Write Webflow MCP upload payloads from dist/ embed HTML."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE = "6a67f5c7802aff69894804cd"
PAGE = "6a67f5c8802aff69894804eb"

UPLOADS = [
    ("mobile", "dist/mobile-embed.html", "8e3bb068-1463-bc43-03d7-f7f82429e21c"),
    ("desktop", "dist/desktop-embed.html", "a0adda08-f625-aaa6-9102-1ba36c4ddbe4"),
]

def main():
    for name, rel, element in UPLOADS:
        code = (ROOT / rel).read_text()
        payload = {
            "siteId": SITE,
            "pageId": PAGE,
            "actions": [{
                "label": f"set-{name}-code",
                "set_settings": {
                    "operations": [{
                        "element_id": {"component": PAGE, "element": element},
                        "settings": [{"key": "code", "static_text": {"value": code}}],
                    }]
                },
            }],
            "context": f"Upload {name} glitch embed HTML from ai-sn repo dist build.",
        }
        out = ROOT / f".webflow-upload-{name}.json"
        out.write_text(json.dumps(payload))
        print(f"{name}: {len(code)} chars -> {out.name}")

if __name__ == "__main__":
    main()
