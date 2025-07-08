import requests
import json
import time

session = requests.Session()
session.headers.update({'User-Agent': 'Abel/1.0'})

GENERATIONS = [
    {'gen': 1, 'range': range(1, 152)},
    {'gen': 2, 'range': range(152, 252)},
    {'gen': 3, 'range': range(252, 387)},
    {'gen': 4, 'range': range(387, 494)},
    {'gen': 5, 'range': range(494, 650)},
    {'gen': 6, 'range': range(650, 722)},
]

STARTERS = [1, 4, 7, 25, 152, 155, 158, 252, 255, 258, 387, 390, 393, 495, 498, 501, 650, 653, 656]

output = []

def get_json(url):
    resp = session.get(url, timeout=10)
    resp.raise_for_status()
    return resp.json()

for gen in GENERATIONS:
    for species_id in gen['range']:
        print(f"Fetching #{species_id}")
        try:
            pokemon = get_json(f"https://pokeapi.co/api/v2/pokemon/{species_id}")
            species = get_json(f"https://pokeapi.co/api/v2/pokemon-species/{species_id}")
            evo_chain_url = species['evolution_chain']['url']
            evo_chain = get_json(evo_chain_url)

            base_types = [t['type']['name'] for t in pokemon['types']]
            desc_entry = next(
                (e for e in species['flavor_text_entries'] if e['language']['name'] == 'en'),
                None
            )

            form = {
                'formName': 'Normal',
                'types': base_types,
                'spriteGen5Animated': pokemon['sprites']['versions']['generation-v']['black-white']['animated']['front_default'] if pokemon['sprites']['versions']['generation-v']['black-white']['animated'] else None,
                'spriteGen6Animated': pokemon['sprites']['versions']['generation-vi']['x-y']['front_default'] if pokemon['sprites']['versions']['generation-vi']['x-y'] else None,
            }

            # Find direct evolutions
            evolution_paths = []
            def find_evo(node):
                if node['species']['name'] == pokemon['name']:
                    for evo in node['evolves_to']:
                        detail = evo['evolution_details'][0] if evo['evolution_details'] else None
                        evolution_paths.append({
                            'toSpeciesId': int(evo['species']['url'].split('/')[-2]),
                            'method': detail['trigger']['name'] if detail else None,
                            'detail': detail['min_level'] if detail else None
                        })
                else:
                    for evo in node['evolves_to']:
                        find_evo(evo)
            find_evo(evo_chain['chain'])

            poke_data = {
                'speciesId': species_id,
                'name': pokemon['name'],
                'generation': gen['gen'],
                'baseTypes': base_types,
                'isLegendary': species['is_legendary'],
                'isMythical': species['is_mythical'],
                'isStarter': species_id in STARTERS,
                'evolutionStage': 2 if species['evolves_from_species'] else 1,
                'description': desc_entry['flavor_text'].replace('\n', ' ').replace('\f', ' ') if desc_entry else '',
                'forms': [form],
                'evolutionPaths': evolution_paths
            }

            output.append(poke_data)
            time.sleep(0.5)

        except Exception as e:
            print(f"Error fetching #{species_id}: {e}")

with open('pokemon_db.json', 'w') as f:
    json.dump(output, f, indent=2)

print("✅ All done! Saved to pokemon_db.json")
