"""Create a review-only contact sheet; do not modify any source photographs."""
from pathlib import Path
from PIL import Image, ImageOps, ImageDraw
import tempfile

root = Path(__file__).resolve().parent.parent
photos = sorted((root / 'src/assets/real-photos/hangzhou').glob('*.webp'))
columns, cell_w, cell_h = 3, 440, 370
sheet = Image.new('RGB', (columns * cell_w, ((len(photos) + columns - 1) // columns) * cell_h), '#eeeeee')
draw = ImageDraw.Draw(sheet)
for index, path in enumerate(photos):
    photograph = Image.open(path).convert('RGB')
    tile = ImageOps.contain(photograph, (420, 330))
    x, y = (index % columns) * cell_w, (index // columns) * cell_h
    sheet.paste(tile, (x + (cell_w - tile.width) // 2, y + 10 + (330 - tile.height) // 2))
    draw.text((x + 12, y + 345), path.name, fill='#111111')
review_dir = Path(tempfile.mkdtemp(prefix='celadon-hangzhou-photo-review-'))
output = review_dir / 'contact-sheet.jpg'
sheet.save(output, quality=92)
print(output)
