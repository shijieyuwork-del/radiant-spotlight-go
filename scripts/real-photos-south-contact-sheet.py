"""Offline review-only contact sheet. Does not alter source photographs."""
from pathlib import Path
from PIL import Image, ImageOps, ImageDraw
import json
import tempfile

root = Path(__file__).resolve().parent.parent
records = json.loads((root / 'src/data/real-photos-south.json').read_text())
photos = [root / row['imgPath'] for row in records if (root / row['imgPath']).is_file()]
columns, cell_w, cell_h = 4, 400, 400
sheet = Image.new('RGB', (columns * cell_w, ((len(photos) + columns - 1) // columns) * cell_h), '#eeeeee')
draw = ImageDraw.Draw(sheet)
for index, photo in enumerate(photos):
    tile = ImageOps.contain(Image.open(photo).convert('RGB'), (380, 350))
    x, y = (index % columns) * cell_w, (index // columns) * cell_h
    sheet.paste(tile, (x + (cell_w - tile.width) // 2, y + 10 + (350 - tile.height) // 2))
    draw.text((x + 10, y + 373), f'{index + 1:02d}. {photo.name}', fill='#111111')
output = Path(tempfile.mkdtemp(prefix='celadon-south-photo-review-')) / 'contact-sheet.jpg'
sheet.save(output, quality=92)
print(f'{len(photos)} photographs: {output}')
