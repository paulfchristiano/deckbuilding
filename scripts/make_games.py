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
    ('GROW', 'kind=pick&cards=Egg,Frontier,Investment,Traveler,YoungSmith&events=Escalate,Reflect'),
    ('BIG', 'kind=pick&cards=Colony,Fortune,KingsCourt,Palace,Platinum&events=Inflation,Prioritize'),
    ('BUY', 'kind=pick&cards=FlowerMarket,GhostTown,Herbs,Lackeys,Spices&events=Duplicate,Expedite'),
    ('GET', 'kind=pick&cards=Lab,Market,Plow,Till,Unearth&events=Commerce,Recycle'),
    ('PLAY', 'kind=pick&cards=Composting,Construction,Echo,Recruitment,Turnpike&events=Reverberate,TravelingFair')
]

def lone_str(n, s):
    return f"('{n}',\n'{s}',\n0)"

def merge_str(theme1, theme2):
    n1, s1 = theme1
    n2, s2 = theme2
    g1 = extract_game(s1)
    g2 = extract_game(s2)
    n = f'{n1}/{n2}'
    s = render_game(merge_games(g1, g2))
    return lone_str(n, s)

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
        results.append(lone_str(themes[i][0], themes[i][1]))
    for i in range(5):
        results.append(merge_str(themes[i], themes[(i+1)%5]))
    for i in range(5):
        results.append(merge_str(themes[i], themes[(i+2)%5]))
    return results

print(',\n'.join(all_strings(themes)) + ';')
print(',\n'.join(req_strings(themes)) + ';')
