import requests
from bs4 import BeautifulSoup
import os

URL = "https://play.pokemonshowdown.com/sprites/ani/"
TARGET_FOLDER = "gen6ani"

os.makedirs(TARGET_FOLDER, exist_ok=True)

# Get the page
response = requests.get(URL)
soup = BeautifulSoup(response.text, "html.parser")

# Loop through all <a> tags
for link in soup.find_all("a"):
    href = link.get("href")
    if href and href.endswith(".gif"):
        file_url = URL + href
        file_name = os.path.join(TARGET_FOLDER, href)
        print(f"Downloading {file_url} ...")
        with open(file_name, "wb") as f:
            f.write(requests.get(file_url).content)
