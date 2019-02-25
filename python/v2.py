import requests

def getPIDS(fname):
    f = open(fname, "r")
    found = re.findall("\/player\/(\d+)\/traditional\/\">(\w+ \w+|\w+-\w+ \w+|\w.\w. \w+|\w+ \w+-\w+)", f.read())
    # print(found)
    # for i in found:
        # print("Player: " + str(i[1]) + " ID:" + str(i[0]))
    return found


def getShotCharts(fname):
    headers = {'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:53.0) Gecko/20100101 Firefox/53.0'}

    params = {
        'PlayerID': '201935',
        'SeasonType': 'Regular Season',
        'Outcome' : '',
        'TeamID' : 0,
        'GameID' : '',
        'Month' : 0,
        'Location': '',
        'SeasonSegment': '',
        'DateFrom': '',
        'DateTo':'',
        'OpponentTeamID': 0,
        'VsConference' :'',
        'VsDivision': '',
        'PlayerPosition': '',
        'RookieYear':'',
        'GameSegment':'',
        'Period':0,
        'LastNGames':0,
        'ContextMeasure':'FGA'
    }
    try:
        r = requests.get("https://stats.nba.com/stats/shotchartdetail", params=params, headers=headers, timeout=10)
    except Exception(e):
        printError(e)
    print(r.text)


getShotCharts("playerIDS.txt")