import re
import requests
from bs4 import BeautifulSoup

def print_grid_from_gdoc(url: str) -> None:
    html = requests.get(url, timeout=30).text
    soup = BeautifulSoup(html, "html.parser")
    tokens = [t.strip() for t in soup.stripped_strings if t.strip()]
    triples = []
    i = 0
    while i + 2 < len(tokens):
        if tokens[i].isdigit() and tokens[i + 2].isdigit():
            x = int(tokens[i])
            ch = tokens[i + 1][0]
            y = int(tokens[i + 2])
            triples.append((x, y, ch))
            i += 3
        else:
            i += 1
    if not triples:
        return
    max_x = max(x for x, _, _ in triples)
    max_y = max(y for _, y, _ in triples)
    grid = [[" "] * (max_x + 1) for _ in range(max_y + 1)]
    for x, y, ch in triples:
        grid[y][x] = ch
    for row in grid:
        print("".join(row))

if __name__ == "__main__":
    print_grid_from_gdoc("https://docs.google.com/document/d/e/2PACX-1vTER-wL5E8YC9pxDx43gk8eIds59GtUUk4nJo_ZWagbnrH0NFvMXIw6VWFLpf5tWTZIT9P9oLIoFJ6A/pub")
