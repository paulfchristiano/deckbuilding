def extract_game(url):
    result = {'cards':[], 'events':[]}
    for x in url.split('&'):
        a, b = x.split('=')
        if a in ['cards', 'events']:
            for c in b.split(','):
                result[a].append(c)
    return result

def merge_games(g1, g2):
    return {'cards': g1['cards'] + g2['cards'], 'events':g1['events'] + g2['events']}

def render_game(g):
    return f"kind=pick&cards={','.join(sorted(g['cards']))}&events={','.join(sorted(g['events']))}"

themes = [
    ('GROW', 'kind=pick&cards=Frontier,Hatchery,Investment,Researcher,Traveler&events=Escalate,Reflect', 23),
    ('BIG', 'kind=pick&cards=Colony,Fortune,KingsCourt,Palace,Platinum&events=Inflation,Prioritize', 29),
    ('BUY', 'kind=pick&cards=FlowerMarket,GhostTown,Herbs,Lackeys,Spices&events=Duplicate,Expedite', 41),
    ('DIG', 'kind=pick&cards=Lab,Market,Plow,Till,Unearth&events=Recycle,Toil', 57),
    ('PLAY', 'kind=pick&cards=Composting,Construction,Echo,Recruitment,Turnpike&events=Reverberate,TravelingFair', 70)
]

def lone_str(n, s, k):
    return f"('{n}',\n'{s}',\n{k})"

def merge_str(theme1, theme2):
    n1, s1, _ = theme1
    n2, s2, _ = theme2
    g1 = extract_game(s1)
    g2 = extract_game(s2)
    n = f'{n1}/{n2}'
    s = render_game(merge_games(g1, g2))
    return lone_str(n, s, 0)

def reqs(a, b):
    return f"('{a}/{b}', '{a}'), ('{a}/{b}', '{b}')"

def req_strings(xs):
    results = []
    for i in range(5):
        results.append(reqs(themes[i][0], themes[(i+1)%5][0]))
    for i in range(5):
        results.append(reqs(themes[i][0], themes[(i+2)%5][0]))
    return results

def all_strings(xs):
    results = []
    for i in range(5):
        results.append(lone_str(themes[i][0], themes[i][1], themes[i][2]))
    for i in range(5):
        results.append(merge_str(themes[i], themes[(i+1)%5]))
    for i in range(5):
        results.append(merge_str(themes[i], themes[(i+2)%5]))
    return results

print('INSERT INTO campaign_levels (key, url, points_required) VALUES')
print(',\n'.join(all_strings(themes)) + ';')
print()
print('INSERT INTO campaign_requirements(destination, req) VALUES')
print(',\n'.join(req_strings(themes)) + ';')

def sort_and_join(lists):
    return ','.join(sorted([x for l in lists for x in l]))

card_list = 'Artificer,Banquet,Bridge,Carpenter,Celebration,Colony,Composting,Construction,Coppersmith,Conclave,Duke,Echo,Hatchery,Factory,FairyGold,Feast,FlowerMarket,Formation,Fortune,Fountain,Frontier,Gardens,GhostTown,GoldMine,GrandMarket,GreatSmithy,Haggler,Harvest,Herbs,Highway,Hireling,Homesteading,Imitation,Industry,Innovation,Investment,KingsCourt,Lab,Lackeys,Looter,Market,Mastermind,Palace,Platinum,Plow,Procession,PublicWorks,Recruitment,RoyalSeal,Sacrifice,SecretChamber,Shelter,ShippingLane,Spices,ThroneRoom,Till,Transmogrify,Traveler,Turnpike,Unearth,VibrantCity,Village,Workshop,Researcher'.split(',')
event_list = 'Commerce,Duplicate,Escalate,Expedite,Finance,Focus,HallofMirrors,Inflation,LostArts,Onslaught,Parallelize,Pathfinding,Philanthropy,Polish,Populate,Prioritize,Reach,Recycle,Reflect,Replicate,Resume,Reuse,Reverberate,Synergy,TravelingFair,Twin,Volley,Toil,Vault'.split(',')
bad_list = 'Burden,Mire,Decay'.split(',')

def print_combo(name, card_lists, event_lists, req=0, final=False):
    print(f"('{name}',")
    print(f"'kind=pick&cards={sort_and_join(card_lists)}&events={sort_and_join(event_lists)}',")
    print(f"{req}){';' if final else ','}")

print()
print('INSERT INTO campaign_levels (key, url, points_required) VALUES')
print_combo('NULL', [], [], 80)
print_combo('CARD', [card_list], [], 90)
print_combo('BAD', [], [bad_list], 100)
print_combo('EVENT', [], [event_list], 110)
print_combo('CARD+BAD', [card_list], [bad_list], 0)
print_combo('CARD+EVENT', [card_list], [event_list], 0)
print_combo('BAD+EVENT', [], [bad_list, event_list], 0)
print_combo('CARD+BAD+EVENT', [card_list], [bad_list, event_list], 0, True)

print("""
INSERT INTO campaign_requirements(destination, req) VALUES
('CARD+EVENT', 'CARD'), ('CARD+EVENT', 'EVENT'), ('CARD+BAD', 'CARD'),
('CARD+BAD', 'BAD'), ('BAD+EVENT', 'EVENT'), ('BAD+EVENT', 'BAD'),
('CARD+BAD+EVENT', 'CARD+EVENT'), ('CARD+BAD+EVENT', 'CARD+BAD'),
('CARD+BAD+EVENT', 'BAD+EVENT');
""")
